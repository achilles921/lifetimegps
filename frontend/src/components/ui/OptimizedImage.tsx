/**
 * Optimized Image Component
 * 
 * A performance-optimized image component that:
 * - Lazy loads images
 * - Uses appropriate sizes for different devices
 * - Shows a placeholder while loading
 * - Supports WebP and AVIF formats with fallbacks
 * - Handles errors gracefully
 */

import React, { useState, useEffect, useRef } from 'react';
import { usePerformance } from '@/context/PerformanceContext';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean; // Load immediately without lazy loading
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  objectPosition?: string;
  onLoad?: () => void;
  onError?: () => void;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  objectFit = 'cover',
  objectPosition = 'center',
  onLoad,
  onError,
  placeholder = 'empty',
  blurDataURL,
  ...props
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  
  const {
    getOptimizedImageUrl,
    trackElementVisibility,
    shouldLoadContent,
    isMobile,
    isTablet,
  } = usePerformance();
  
  // Get responsive width based on device
  const responsiveWidth = width ? (
    isMobile ? Math.min(width, window.innerWidth) :
    isTablet ? Math.min(width, Math.min(window.innerWidth, 768)) :
    width
  ) : undefined;
  
  // Determine if we should load the image yet
  const [shouldLoad, setShouldLoad] = useState(priority);
  
  useEffect(() => {
    if (imageRef.current) {
      // If priority, load right away, otherwise track visibility
      if (priority) {
        setShouldLoad(true);
      } else {
        trackElementVisibility(imageRef.current);
        
        // Check if the element is already visible
        if (shouldLoadContent(imageRef.current)) {
          setShouldLoad(true);
        }
      }
    }
  }, [priority, trackElementVisibility, shouldLoadContent]);
  
  // Generate srcSet for responsive images
  const generateSrcSet = () => {
    if (!width) return undefined;
    
    const sizes = [320, 640, 768, 1024, 1280, 1536, 1920];
    return sizes
      .filter(size => size <= (width * 2)) // Don't go beyond 2x the intended width
      .map(size => `${getOptimizedImageUrl(src, size)} ${size}w`)
      .join(', ');
  };
  
  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };
  
  const handleError = () => {
    setIsError(true);
    onError?.();
  };
  
  // Generate appropriate sizes attribute
  const sizeAttr = width 
    ? `(max-width: 640px) 100vw, (max-width: 768px) 768px, ${width}px`
    : '100vw';
  
  // Style for the placeholder
  const placeholderStyle = {
    backgroundColor: '#f3f4f6', // Light gray
    backgroundImage: placeholder === 'blur' && blurDataURL ? `url(${blurDataURL})` : undefined,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    filter: placeholder === 'blur' ? 'blur(20px)' : undefined,
    transform: placeholder === 'blur' ? 'scale(1.1)' : undefined,
  };
  
  return (
    <div
      className={cn(
        'relative overflow-hidden',
        className
      )}
      style={{
        width: width ? `${width}px` : '100%',
        height: height ? `${height}px` : 'auto',
      }}
      ref={imageRef}
    >
      {/* Loading placeholder */}
      {!isLoaded && !isError && (
        <div 
          className="absolute inset-0 animate-pulse"
          style={placeholderStyle}
        />
      )}
      
      {/* Error placeholder */}
      {isError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <svg 
            className="w-10 h-10 text-gray-400" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2" 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            ></path>
          </svg>
        </div>
      )}
      
      {/* Actual image - only load when visible or priority */}
      {shouldLoad && (
        <img
          src={getOptimizedImageUrl(src, responsiveWidth)}
          srcSet={generateSrcSet()}
          sizes={sizeAttr}
          alt={alt}
          width={width}
          height={height}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'transition-opacity duration-300',
            isLoaded ? 'opacity-100' : 'opacity-0',
            isError ? 'hidden' : 'block'
          )}
          style={{
            objectFit,
            objectPosition,
            width: '100%',
            height: '100%',
          }}
          loading={priority ? 'eager' : 'lazy'}
          {...props}
        />
      )}
    </div>
  );
}