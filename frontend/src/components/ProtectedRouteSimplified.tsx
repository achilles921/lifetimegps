import { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContextFixed';
import { Spinner } from '@/components/ui/spinner';

interface ProtectedRouteProps {
  children: ReactNode;
}

/**
 * A simplified protected route component that redirects to login if user is not authenticated
 * Uses the useAuth hook for authentication state and handles loading states
 */
export function ProtectedRouteSimplified({ children }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  useEffect(() => {
    // If authentication check is complete and user is not logged in
    if (!isLoading && !user) {
     //  console.log('Protected route: User not authenticated, checking redirect conditions');
      
      // Check if the user has completed the career race quiz
      const hasCompletedQuiz = localStorage.getItem('quizFullyCompleted') === 'true' || 
                              localStorage.getItem('quizCompleted') === 'true';
      
      // Check if they're trying to access the dashboard after completing the quiz
      const currentPath = window.location.pathname;
      const isDashboardAccess = currentPath === '/dashboard';
      
      // If they have completed the quiz and are trying to access the dashboard,
      // allow them to view it without login
      if (hasCompletedQuiz && isDashboardAccess) {
       //  console.log('Quiz completed and accessing dashboard - allowing access without login');
        return;
      }
      
      // Check if we've been stuck in a redirect loop
      const checkForRedirectLoop = () => {
        try {
          const redirectCount = parseInt(sessionStorage.getItem('simpRedirectCount') || '0');
          const lastRedirectTime = parseInt(sessionStorage.getItem('simpLastRedirectTime') || '0');
          const currentTime = Date.now();
          
          // If we've had multiple redirects in a short time period (5 seconds)
          if (redirectCount > 2 && (currentTime - lastRedirectTime < 5000)) {
           //  console.log('Detected redirect loop in simplified route! Breaking chain');
            sessionStorage.setItem('simpRedirectCount', '0');
            return true;
          }
          
          // Update redirect tracking
          sessionStorage.setItem('simpRedirectCount', (redirectCount + 1).toString());
          sessionStorage.setItem('simpLastRedirectTime', currentTime.toString());
          return false;
        } catch (e) {
          console.error('Error checking simplified redirect loop:', e);
          return false;
        }
      };
      
      // Check for redirect loops
      const isRedirectLoop = checkForRedirectLoop();
      if (isRedirectLoop) {
       //  console.log('Breaking redirect loop, staying on current page');
        return;
      }
      
      // Prevent redirect loops by checking if we're already on the login page
      // Also prevent redirects from public pages like results, career-quiz, etc.
      
      // List of public routes that should not redirect to login
      const publicRoutes = [
        '/login', 
        '/signup', 
        '/results', 
        '/career-quiz',
        '/voice-demo',
        '/about',
        '/contact',
        '/testimonials',
        '/terms'
      ];
      
      // Don't redirect if current path is in the list of public routes
      if (publicRoutes.some(route => currentPath.startsWith(route))) {
       //  console.log('On a public page, not redirecting to login');
        return;
      }
      
      // Check if we just came from login/signup to avoid loops
      if (document.referrer.includes('/login') || document.referrer.includes('/signup')) {
       //  console.log('Coming from login/signup page, possibly in a loop - not redirecting');
        return;
      }
      
     //  console.log('Conditions checked, proceeding with redirect to login');
      
      // Save the current path to redirect back after login (only if not already on login/signup)
      try {
        localStorage.setItem('redirectAfterLogin', currentPath);
      } catch (e) {
        console.error('Error saving redirect path:', e);
      }
      
      // Use more reliable navigation to avoid potential React state update loops
      window.location.href = `${window.location.origin}/login`;
    }
  }, [user, isLoading]);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
        <p className="ml-2 text-lg">Verifying authentication...</p>
      </div>
    );
  }

  // Check if the user has completed the quiz (for dashboard access without login)
  const hasCompletedQuiz = localStorage.getItem('quizFullyCompleted') === 'true' || 
                          localStorage.getItem('quizCompleted') === 'true';
  const currentPath = window.location.pathname;
  const isDashboardAccess = currentPath === '/dashboard';
  
  // Allow access if:
  // 1. User is logged in, OR
  // 2. User has completed the quiz and is trying to access the dashboard
  if (user || (hasCompletedQuiz && isDashboardAccess)) {
    return <>{children}</>;
  }
  
  return null;
}