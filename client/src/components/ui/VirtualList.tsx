/**
 * VirtualList Component
 * 
 * A performance-optimized list component that only renders items
 * that are visible in the viewport, making it extremely efficient
 * for long lists of data.
 */

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { usePerformance } from '@/context/PerformanceContext';
import { cn, debounce } from '@/lib/utils';

interface VirtualListProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  overscan?: number; // Number of items to render outside of view
  onEndReached?: () => void;
  endReachedThreshold?: number; // Percentage (0-1) of list remaining that triggers onEndReached
  scrollToIndex?: number;
  listContainerClassName?: string;
  getItemKey?: (item: T, index: number) => string | number;
}

export function VirtualList<T>({
  items,
  renderItem,
  itemHeight,
  className,
  overscan = 5,
  onEndReached,
  endReachedThreshold = 0.9,
  scrollToIndex,
  listContainerClassName,
  getItemKey = (_, index) => index,
}: VirtualListProps<T>) {
  const { isLowEndDevice } = usePerformance();
  
  // For lower-end devices, we'll render more items at once to reduce the frequency of rendering operations
  const effectiveOverscan = isLowEndDevice ? Math.max(overscan, 10) : overscan;
  
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleRange, setVisibleRange] = useState({ start: 0, end: 10 });
  const prevScrollTop = useRef(0);
  const ticking = useRef(false);
  const totalHeight = items.length * itemHeight;
  
  // Calculate which items should be visible
  const calculateVisibleRange = useCallback(() => {
    if (!containerRef.current) return;
    
    const { scrollTop, clientHeight } = containerRef.current;
    const start = Math.floor(scrollTop / itemHeight);
    const visibleItems = Math.ceil(clientHeight / itemHeight);
    const end = Math.min(start + visibleItems + effectiveOverscan, items.length);
    const adjustedStart = Math.max(0, start - effectiveOverscan);
    
    setVisibleRange({ start: adjustedStart, end });
    
    // Check if we need to load more items
    if (onEndReached && scrollTop + clientHeight >= totalHeight * endReachedThreshold) {
      onEndReached();
    }
    
    prevScrollTop.current = scrollTop;
    ticking.current = false;
  }, [itemHeight, items.length, effectiveOverscan, onEndReached, endReachedThreshold, totalHeight]);
  
  // Handle scroll event with throttling
  const handleScroll = useCallback(() => {
    if (!ticking.current) {
      window.requestAnimationFrame(() => {
        calculateVisibleRange();
      });
      ticking.current = true;
    }
  }, [calculateVisibleRange]);
  
  // Handle resize events to recalculate visible items
  useEffect(() => {
    const debouncedResize = debounce(() => {
      calculateVisibleRange();
    }, 100);
    
    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
    };
  }, [calculateVisibleRange]);
  
  // Initial calculation and recalculation when inputs change
  useEffect(() => {
    calculateVisibleRange();
  }, [calculateVisibleRange, items.length]);
  
  // Handle scroll to index
  useEffect(() => {
    if (scrollToIndex !== undefined && containerRef.current) {
      containerRef.current.scrollTop = scrollToIndex * itemHeight;
    }
  }, [scrollToIndex, itemHeight]);
  
  // Generate visible items to render
  const visibleItems = [];
  for (let i = visibleRange.start; i < visibleRange.end; i++) {
    visibleItems.push(
      <div
        key={getItemKey(items[i], i)}
        style={{
          position: 'absolute',
          top: 0,
          transform: `translateY(${i * itemHeight}px)`,
          width: '100%',
          height: itemHeight,
        }}
      >
        {renderItem(items[i], i)}
      </div>
    );
  }
  
  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn('overflow-auto relative', className)}
    >
      <div
        className={cn('relative', listContainerClassName)}
        style={{ height: `${totalHeight}px` }}
      >
        {visibleItems}
      </div>
    </div>
  );
}