/**
 * ProgressiveImage Component
 * 
 * Implements the blur-up technique for progressive image loading:
 * 1. Shows a tiny, blurred preview image immediately
 * 2. Loads the full image in the background
 * 3. Fades in the full image when loaded
 * 
 * This provides a smooth loading experience that feels much faster
 * than traditional image loading techniques.
 */

import React, { useState, useEffect } from 'react';
import { usePerformance } from '@/context/PerformanceContext';
import { cn } from '@/lib/utils';

interface ProgressiveImageProps {
  src: string;
  alt: string;
  lowResSrc?: string;
  placeholderColor?: string;
  width?: number;
  height?: number;
  aspectRatio?: string;
  className?: string;
  imgClassName?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

export function ProgressiveImage({
  src,
  alt,
  lowResSrc,
  placeholderColor = '#f3f4f6',
  width,
  height,
  aspectRatio = '16/9',
  className,
  imgClassName,
  objectFit = 'cover',
  priority = false,
  onLoad,
  onError,
}: ProgressiveImageProps) {
  const [highResLoaded, setHighResLoaded] = useState(false);
  const [lowResLoaded, setLowResLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { getOptimizedImageUrl, enableHighQualityImages } = usePerformance();
  
  // Decide on image quality based on performance detection
  const optimizedSrc = getOptimizedImageUrl(src, width);
  
  // Set up a fixed size container if width/height are provided
  const containerStyle: React.CSSProperties = {
    backgroundColor: placeholderColor,
    position: 'relative',
    overflow: 'hidden',
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : undefined,
    aspectRatio: !height ? aspectRatio : undefined,
  };
  
  // Preload high-resolution image
  useEffect(() => {
    if (priority || lowResLoaded) {
      const highResImage = new Image();
      highResImage.src = optimizedSrc;
      
      // When high-res image loads, update state
      highResImage.onload = () => {
        setHighResLoaded(true);
        onLoad?.();
      };
      
      // Handle errors
      highResImage.onerror = () => {
        setIsError(true);
        onError?.();
      };
    }
  }, [optimizedSrc, priority, lowResLoaded, onLoad, onError]);
  
  // Handle low-res image load
  const handleLowResLoad = () => {
    setLowResLoaded(true);
  };
  
  // Handle errors
  const handleError = () => {
    setIsError(true);
    onError?.();
  };
  
  // Shared image styles
  const imageStyles: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit,
    display: 'block',
    position: 'absolute', 
    top: 0,
    left: 0,
  };
  
  return (
    <div 
      className={cn('progressive-image', className)} 
      style={containerStyle}
    >
      {/* Show colored placeholder immediately */}
      <div 
        className="absolute inset-0"
        style={{ backgroundColor: placeholderColor }}
      />
      
      {/* If we have a low-res image, show it until high-res loads */}
      {lowResSrc && !isError && (
        <img
          src={lowResSrc}
          alt=""
          className={cn(
            "transition-opacity duration-200",
            highResLoaded ? "opacity-0" : "opacity-100",
            imgClassName
          )}
          style={imageStyles}
          onLoad={handleLowResLoad}
          onError={handleError}
          aria-hidden="true"
          loading="eager"
        />
      )}
      
      {/* High-resolution image - fade in when loaded */}
      {!isError && (
        <img
          src={optimizedSrc}
          alt={alt}
          className={cn(
            "transition-opacity duration-500",
            highResLoaded ? "opacity-100" : "opacity-0",
            imgClassName
          )}
          style={imageStyles}
          loading={priority ? "eager" : "lazy"}
          onLoad={() => setHighResLoaded(true)}
          onError={handleError}
        />
      )}
      
      {/* Error state */}
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
    </div>
  );
}