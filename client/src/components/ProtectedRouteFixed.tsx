import React, { ReactNode, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/context/AuthContextFixed';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

export function ProtectedRouteFixed({ 
  children, 
  requireAuth = true,
  redirectTo = '/login' 
}: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Debug authentication state
  useEffect(() => {
    console.log('ProtectedRoute auth check:', { 
      user: user ? 'authenticated' : 'not authenticated', 
      isLoading, 
      requireAuth 
    });
  }, [user, isLoading, requireAuth]);

  // Handle navigation in useEffect to avoid render warnings
  useEffect(() => {
    if (!isLoading && requireAuth && !user) {
      console.log('ProtectedRoute redirecting to login - user not authenticated');
      navigate(redirectTo);
    }
  }, [user, isLoading, requireAuth, redirectTo, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If auth is required but user is not authenticated, show loading while redirecting
  if (requireAuth && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Render the protected content
  return <>{children}</>;
}

export function MiniGameProtectedRouteFixed({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();
  const [, navigate] = useLocation();

  // Handle redirection in useEffect to avoid render warnings
  useEffect(() => {
    if (!isLoading && !user) {
      const quizCompleted = localStorage.getItem('quizCompleted') === 'true' || 
                           localStorage.getItem('quizFullyCompleted') === 'true';
      
      if (!quizCompleted) {
        navigate('/career-quiz');
      }
    }
  }, [user, isLoading, navigate]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Check if user is authenticated
  if (user) {
    // Authenticated users can always access mini-games
    return <>{children}</>;
  }

  // Check if quiz is completed for guest users
  const quizCompleted = localStorage.getItem('quizCompleted') === 'true' || 
                       localStorage.getItem('quizFullyCompleted') === 'true';

  if (quizCompleted) {
    // Quiz completed - allow access as guest
    return <>{children}</>;
  }

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}