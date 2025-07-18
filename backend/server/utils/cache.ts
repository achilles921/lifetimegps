/**
 * Cache Utility
 * 
 * Provides in-memory caching with TTL (Time-To-Live) for improved performance.
 * - Automatically evicts expired items
 * - Memory-efficient for large objects
 * - Performance optimized for frequent access patterns
 * - Type-safe with TypeScript generics
 */

import { log } from './logging';

/**
 * Simple in-memory cache implementation with TTL
 */
export function createCache<T>(defaultTtl: number = 5 * 60 * 1000) { // 5 minutes default
  const cache = new Map<string, { value: T; timestamp: number; ttl: number }>();
  let cleanupInterval: NodeJS.Timeout | null = null;
  let totalHits = 0;
  let totalMisses = 0;
  
  /**
   * Start automatic cleanup of expired items
   */
  function startCleanupInterval(intervalMs: number = 60 * 1000) { // 1 minute default
    if (cleanupInterval) {
      clearInterval(cleanupInterval);
    }
    
    cleanupInterval = setInterval(() => {
      const now = Date.now();
      let expiredCount = 0;
      
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          cache.delete(key);
          expiredCount++;
        }
      }
      
      if (expiredCount > 0) {
        log(`Cache cleanup: removed ${expiredCount} expired items`, 'cache');
      }
    }, intervalMs);
    
    return () => {
      if (cleanupInterval) {
        clearInterval(cleanupInterval);
        cleanupInterval = null;
      }
    };
  }
  
  // Start the cleanup interval
  const stopCleanup = startCleanupInterval();
  
  return {
    /**
     * Get an item from the cache
     */
    get(key: string): T | undefined {
      const item = cache.get(key);
      if (!item) {
        totalMisses++;
        return undefined;
      }
      
      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        cache.delete(key);
        totalMisses++;
        return undefined;
      }
      
      totalHits++;
      return item.value;
    },
    
    /**
     * Set an item in the cache with optional custom TTL
     */
    set(key: string, value: T, ttl: number = defaultTtl): void {
      cache.set(key, { value, timestamp: Date.now(), ttl });
    },
    
    /**
     * Check if a key exists in the cache and is not expired
     */
    has(key: string): boolean {
      const item = cache.get(key);
      if (!item) return false;
      
      const now = Date.now();
      if (now - item.timestamp > item.ttl) {
        cache.delete(key);
        return false;
      }
      
      return true;
    },
    
    /**
     * Delete an item from the cache
     */
    delete(key: string): boolean {
      return cache.delete(key);
    },
    
    /**
     * Clear all items from the cache
     */
    clear(): void {
      cache.clear();
    },
    
    /**
     * Get cache statistics
     */
    getStats(): { size: number; hitRate: string; totalHits: number; totalMisses: number } {
      const totalRequests = totalHits + totalMisses;
      const hitRate = totalRequests === 0 
        ? '0%' 
        : `${Math.round((totalHits / totalRequests) * 100)}%`;
      
      return {
        size: cache.size,
        hitRate,
        totalHits,
        totalMisses,
      };
    },
    
    /**
     * Manually run cleanup of expired items
     */
    cleanup(): number {
      const now = Date.now();
      let expiredCount = 0;
      
      for (const [key, item] of cache.entries()) {
        if (now - item.timestamp > item.ttl) {
          cache.delete(key);
          expiredCount++;
        }
      }
      
      return expiredCount;
    },
    
    /**
     * Stop the automatic cleanup interval
     */
    stopCleanup,
  };
}

// Create a shared cache for common application data
export const appCache = createCache<any>(15 * 60 * 1000); // 15 minute TTL by default