import { ReactNode, useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContextFixed';
import { Spinner } from '@/components/ui/spinner';
import { apiRequest } from '@/lib/queryClient';

interface MiniGameProtectedRouteProps {
  children: ReactNode;
  requiredSections?: string[];
}

/**
 * Protected route specifically for mini-games that checks both authentication 
 * and whether the user has completed the required sections
 */
export function MiniGameProtectedRouteSimplified({ 
  children, 
  requiredSections = [] 
}: MiniGameProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [hasSections, setHasSections] = useState<boolean>(false);
  const [checkingSections, setCheckingSections] = useState<boolean>(true);
  
  // Get quiz completion status from localStorage
  const hasCompletedQuiz = () => {
    const quizCompleted = localStorage.getItem('quizCompleted') === 'true';
    const quizFullyCompleted = localStorage.getItem('quizFullyCompleted') === 'true';
    const result = quizCompleted || quizFullyCompleted;
    
    console.log('MiniGame route: Quiz completion check:', {
      quizCompleted,
      quizFullyCompleted,
      result
    });
    
    return result;
  };
  
  useEffect(() => {
    // Check if quiz is completed - if so, mark sections as completed
    if (hasCompletedQuiz()) {
      console.log('Quiz completion detected in useEffect, marking sections as completed');
      
      // Mark sections as completed so they can play mini-games
      const completedSections = ['workStyle', 'cognitiveStrength', 'socialApproach', 'motivation', 'interests'];
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      
      // If not loading and we already have this state, return early to avoid unnecessary processing
      if (!isLoading && hasSections) {
        return;
      }
    }

    // First check authentication or quiz completion
    if (!isLoading && !user) {
      console.log('MiniGame route: User not authenticated, checking for quiz completion');
      
      // If the quiz is completed, allow access as a guest user
      if (hasCompletedQuiz()) {
        console.log('Quiz has been completed, creating temporary session for mini-games');
        
        // Create a temporary user session for mini-games access
        const guestId = localStorage.getItem('guestSessionId') || `guest-${Date.now()}`;
        localStorage.setItem('guestSessionId', guestId);
        
        // Mark all sections as completed for the guest user
        const completedSections = ['workStyle', 'cognitiveStrength', 'socialApproach', 'motivation', 'interests'];
        localStorage.setItem('completedSections', JSON.stringify(completedSections));
        
        // Set hasSections to true to allow navigation to mini-games
        setHasSections(true);
        setCheckingSections(false);
        return;
      }
      
      console.log('MiniGame route: No quiz completion found, redirecting to login');
      
      // Prevent redirect loops and protect public routes
      const currentPath = window.location.pathname;
      
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
        console.log('MiniGame route: On a public page, not redirecting to login');
        return;
      }
      
      // Save the current path to redirect back after login
      localStorage.setItem('redirectAfterLogin', currentPath);
      
      // Use more reliable window.location for navigation to avoid React update loops
      window.location.href = `${window.location.origin}/login`;
      return;
    }
    
    // Check if user is logged in but we also need to verify quiz completion status
    if (!isLoading && user) {
      console.log('MiniGame route: User is authenticated, allowing access to mini-games');
      
      // For authenticated users, always grant access without requiring quiz completion
      // This ensures logged-in users are never redirected to the account creation page
      const completedSections = ['workStyle', 'cognitiveStrength', 'socialApproach', 'motivation', 'interests'];
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      
      // Set hasSections to true to allow navigation to mini-games
      setHasSections(true);
      setCheckingSections(false);
      return;
    }
    
    // Then check if user has completed required sections
    if (user && requiredSections.length > 0) {
      const checkCompletedSections = async () => {
        try {
          // Try to fetch user progress from API
          const response = await apiRequest('GET', '/api/user/progress', null, {
            headers: {
              'X-User-Email': user.email,
              'X-User-Id': user.id,
            }
          });
          
          if (response.ok) {
            const progressData = await response.json();
            
            // Check if user has completed at least one required section
            const hasCompletedAnyRequired = requiredSections.some(section => 
              progressData.completedSections && progressData.completedSections.includes(section)
            );
            
            setHasSections(hasCompletedAnyRequired);
          } else {
            // If API fails, fallback to localStorage
            const localSectionsJson = localStorage.getItem('completedSections');
            
            if (localSectionsJson) {
              try {
                const localSections = JSON.parse(localSectionsJson);
                const hasCompletedAnyRequired = requiredSections.some(section => 
                  localSections.includes(section)
                );
                setHasSections(hasCompletedAnyRequired);
              } catch (e) {
                console.error('Error parsing localStorage sections:', e);
                setHasSections(false);
              }
            } else {
              setHasSections(false);
            }
          }
        } catch (error) {
          console.error('Error checking completed sections:', error);
          setHasSections(false);
        } finally {
          setCheckingSections(false);
        }
      };
      
      checkCompletedSections();
    } else if (user) {
      // If no required sections or user is logged in, allow access
      setHasSections(true);
      setCheckingSections(false);
    }
  }, [user, isLoading, requiredSections]);

  // If still loading auth or checking sections, show spinner
  if (isLoading || checkingSections) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Spinner size="lg" />
        <p className="mt-4 text-lg text-duo-green-700">
          {isLoading ? 'Verifying account...' : 'Checking your progress...'}
        </p>
      </div>
    );
  }
  
  // If quiz is completed, make sure hasSections is true
  if (hasCompletedQuiz() && !hasSections) {
    console.log('Quiz completion detected, setting sections as completed immediately');
    
    // Mark sections as completed
    const completedSections = ['workStyle', 'cognitiveStrength', 'socialApproach', 'motivation', 'interests'];
    localStorage.setItem('completedSections', JSON.stringify(completedSections));
    
    // Set hasSections to true immediately
    setHasSections(true);
    
    // No need to show a loading spinner here anymore - render children immediately
  }
  
  // If user doesn't have required sections and quiz isn't completed, redirect to career quiz
  if (user && !hasSections && !hasCompletedQuiz()) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <div className="bg-white rounded-xl shadow-lg p-6 max-w-md text-center">
          <h2 className="text-2xl font-bold text-duo-purple-600 mb-4">
            Complete Your Assessment First
          </h2>
          <p className="text-gray-700 mb-6">
            You need to complete at least one section of the Career Quiz 
            before unlocking this mini-game.
          </p>
          <button
            onClick={() => window.location.href = `${window.location.origin}/career-quiz`}
            className="bg-duo-green-500 hover:bg-duo-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors"
          >
            Go to Career Quiz
          </button>
        </div>
      </div>
    );
  }

  // Enhanced logic for who can access mini-games:
  // 1. Logged-in users who have completed any required sections (hasSections)
  // 2. Any user (logged in or not) who has completed the full quiz
  // 3. If quiz is completed, we consider that as having all sections
  const quizIsCompleted = hasCompletedQuiz();
  const hasRequiredProgress = quizIsCompleted || hasSections;
  
  console.log('Access check:', {
    isLoggedIn: !!user,
    quizIsCompleted,
    hasSections,
    hasRequiredProgress
  });
  
  // Return children if access is granted
  return hasRequiredProgress ? <>{children}</> : null;
}