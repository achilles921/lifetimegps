/**
 * PageSuspense Component
 * 
 * Provides a suspense boundary for route-based code splitting
 * with intelligent preloading of likely destinations.
 */

import React, { Suspense, lazy, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { PageSkeleton } from '@/components/ui/PageSkeleton';
import { usePerformance } from '@/context/PerformanceContext';

// Entry and exit animations
const ANIMATION_DURATION = 200; // milliseconds

interface PageSuspenseProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  skeletonType?: 'default' | 'dashboard' | 'profile' | 'roadmap' | 'career';
  preloadRoutes?: string[];
}

export function PageSuspense({
  children,
  fallback,
  skeletonType = 'default',
  preloadRoutes = [],
}: PageSuspenseProps) {
  const [location] = useLocation();
  const [isExiting, setIsExiting] = useState(false);
  const [isEntering, setIsEntering] = useState(true);
  const prevLocation = React.useRef(location);
  
  // Preload other likely routes
  useEffect(() => {
    if (preloadRoutes.length > 0 && 'requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(() => {
        preloadRoutes.forEach(route => {
          const link = document.createElement('link');
          link.rel = 'prefetch';
          link.href = route;
          link.as = 'script';
          document.head.appendChild(link);
        });
      });
      
      return () => {
        if ('cancelIdleCallback' in window) {
          (window as any).cancelIdleCallback(handle);
        }
      };
    }
  }, [preloadRoutes]);
  
  // Trigger enter animation
  useEffect(() => {
    setIsEntering(true);
    
    const timeout = setTimeout(() => {
      setIsEntering(false);
    }, ANIMATION_DURATION);
    
    return () => clearTimeout(timeout);
  }, []);
  
  // When location changes, trigger exit animation
  useEffect(() => {
    if (location !== prevLocation.current) {
      setIsExiting(true);
      
      const timeout = setTimeout(() => {
        prevLocation.current = location;
        setIsExiting(false);
      }, ANIMATION_DURATION);
      
      return () => clearTimeout(timeout);
    }
  }, [location]);
  
  // Animation classes based on state
  const animationClass = 
    isExiting
      ? 'opacity-0 scale-95'
      : isEntering
        ? 'opacity-0 scale-105'
        : 'opacity-100 scale-100'
    ;
  
  // Default fallback to skeleton UI
  const defaultFallback = <PageSkeleton type={skeletonType} />;
  
  return (
    <Suspense fallback={fallback || defaultFallback}>
      <div
        className={`transition-all duration-200 ${animationClass}`}
      >
        {children}
      </div>
    </Suspense>
  );
}

// Helper to convert a regular component to a lazy-loaded component
export function lazyWithPreload<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  preloadRoutes: string[] = []
) {
  const LazyComponent = lazy(factory);
  
  // Attach preload method to the lazy component
  const Component = (props: React.ComponentProps<T>) => (
    <PageSuspense preloadRoutes={preloadRoutes}>
      <LazyComponent {...props} />
    </PageSuspense>
  );
  
  // Add preload function so it can be triggered manually if needed
  Component.preload = factory;
  
  return Component;
}