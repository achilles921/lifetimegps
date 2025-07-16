/**
 * Optimized Cache Service
 * 
 * A memory-efficient caching system with:
 * - TTL (Time-To-Live) support
 * - Memory usage optimization
 * - LRU (Least Recently Used) eviction strategy
 * - Cache stats for monitoring
 * - Automatic cleanup of expired items
 */

// Debounce function for internal use
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Cache entry structure
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // milliseconds
  lastAccessed?: number;
}

// Cache statistics tracking
interface CacheStats {
  size: number;
  hits: number;
  misses: number;
  hitRate: string;
  totalHits: number;
  totalMisses: number;
}

// Global cache registry
type CacheStore = Map<string, Map<string, CacheEntry<any>>>;
const cacheRegistry: CacheStore = new Map();

// Cache statistics tracking
const cacheStats: Record<string, {
  hits: number;
  misses: number;
  totalHits: number;
  totalMisses: number;
}> = {};

// Default TTL (30 minutes)
const DEFAULT_TTL = 30 * 60 * 1000;

// Maximum cache size before enforcing cleanup
const MAX_CACHE_SIZE = 500;

// Cleanup interval (every 5 minutes)
const CLEANUP_INTERVAL = 5 * 60 * 1000;

/**
 * Initialize a cache namespace with TTL
 */
export function initializeCache(namespace: string, defaultTTL?: number): void {
  if (!cacheRegistry.has(namespace)) {
    cacheRegistry.set(namespace, new Map());
    
    // Initialize stats
    cacheStats[namespace] = {
      hits: 0,
      misses: 0,
      totalHits: 0,
      totalMisses: 0
    };
    
    // Set up periodic cleanup for this cache
    if (typeof window === 'undefined') { // Only on server
      setInterval(() => {
        removeExpiredItems(namespace);
      }, CLEANUP_INTERVAL);
    }
  }
}

/**
 * Get a value from cache with automatic expiration check
 */
export function getCache<T>(namespace: string, key: string): T | null {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache) {
    console.warn(`Cache namespace "${namespace}" not initialized. Call initializeCache first.`);
    return null;
  }
  
  const entry = cache.get(key);
  
  if (!entry) {
    // Cache miss
    cacheStats[namespace].misses++;
    cacheStats[namespace].totalMisses++;
    return null;
  }
  
  // Check if the entry has expired
  if (Date.now() - entry.timestamp > entry.ttl) {
    // Entry expired, remove it
    cache.delete(key);
    cacheStats[namespace].misses++;
    cacheStats[namespace].totalMisses++;
    return null;
  }
  
  // Update last accessed time
  entry.lastAccessed = Date.now();
  
  // Cache hit
  cacheStats[namespace].hits++;
  cacheStats[namespace].totalHits++;
  
  return entry.value;
}

/**
 * Set a value in the cache with TTL
 */
export function setCache<T>(
  namespace: string, 
  key: string, 
  value: T, 
  ttl: number = DEFAULT_TTL
): void {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache) {
    console.warn(`Cache namespace "${namespace}" not initialized. Call initializeCache first.`);
    return;
  }
  
  // If the cache is getting too large, clean up oldest or expired entries
  if (cache.size > MAX_CACHE_SIZE) {
    // First try to remove expired items
    const expired = removeExpiredItems(namespace);
    
    // If not enough items were freed, remove least recently used
    if (expired < 10 && cache.size > MAX_CACHE_SIZE * 0.9) {
      evictLeastRecentlyUsed(namespace, 50); // Remove 50 LRU items
    }
  }
  
  // Add new entry
  cache.set(key, {
    value,
    timestamp: Date.now(),
    ttl,
    lastAccessed: Date.now()
  });
}

/**
 * Remove a specific item from cache
 */
export function removeCache(namespace: string, key: string): boolean {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache) {
    return false;
  }
  
  return cache.delete(key);
}

/**
 * Clear an entire cache namespace
 */
export function clearCache(namespace: string): boolean {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache) {
    return false;
  }
  
  cache.clear();
  
  // Reset stats
  cacheStats[namespace] = {
    hits: 0,
    misses: 0,
    totalHits: cacheStats[namespace].totalHits,
    totalMisses: cacheStats[namespace].totalMisses
  };
  
  return true;
}

/**
 * Remove all expired items from a namespace
 * Returns number of items removed
 */
export function removeExpiredItems(namespace: string): number {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache) {
    return 0;
  }
  
  const now = Date.now();
  let removedCount = 0;
  
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl) {
      cache.delete(key);
      removedCount++;
    }
  }
  
  return removedCount;
}

/**
 * Evict least recently used items
 */
function evictLeastRecentlyUsed(namespace: string, count: number): number {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache || cache.size === 0) {
    return 0;
  }
  
  // Sort entries by lastAccessed timestamp
  const entries = Array.from(cache.entries())
    .sort(([, a], [, b]) => (a.lastAccessed || 0) - (b.lastAccessed || 0));
  
  // Remove the oldest accessed entries
  const toRemove = Math.min(count, entries.length);
  
  for (let i = 0; i < toRemove; i++) {
    cache.delete(entries[i][0]);
  }
  
  return toRemove;
}

/**
 * Get cache statistics
 */
export function getCacheStats(namespace: string): CacheStats {
  const cache = cacheRegistry.get(namespace);
  
  if (!cache) {
    return {
      size: 0,
      hits: 0,
      misses: 0,
      hitRate: '0%',
      totalHits: 0,
      totalMisses: 0
    };
  }
  
  const stats = cacheStats[namespace];
  const hitRate = stats.hits + stats.misses === 0 
    ? '0%' 
    : `${Math.round((stats.hits / (stats.hits + stats.misses)) * 100)}%`;
  
  return {
    size: cache.size,
    hits: stats.hits,
    misses: stats.misses,
    hitRate,
    totalHits: stats.totalHits,
    totalMisses: stats.totalMisses
  };
}

// Debounced cache cleanup for all namespaces
export const cleanupAllCaches = debounce(() => {
  for (const namespace of cacheRegistry.keys()) {
    removeExpiredItems(namespace);
  }
}, 10000);

// When process is exiting, clean up memory
if (typeof process !== 'undefined') {
  process.on('exit', () => {
    for (const namespace of cacheRegistry.keys()) {
      clearCache(namespace);
    }
  });
}