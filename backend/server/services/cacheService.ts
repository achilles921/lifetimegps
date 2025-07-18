import { NextFunction, Request, Response } from 'express';
import { log } from '../utils/logging';

// Cache entry with value, timestamp, and TTL
interface CacheEntry<T> {
  value: T;
  timestamp: number;
  ttl: number; // Time to live in seconds
}

// In-memory cache
const cache = new Map<string, CacheEntry<any>>();

// Cache middleware
export function cacheMiddleware(ttl = 3600) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') return next();
    
    // Generate cache key from request URL
    const cacheKey = req.originalUrl || req.url;
    
    // Check if we have a cached response
    if (cache.has(cacheKey)) {
      const entry = cache.get(cacheKey) as CacheEntry<any>;
      const now = Date.now();
      
      // If entry is still valid, return cached response
      if (entry && now - entry.timestamp < entry.ttl * 1000) {
        log(`Cache hit for ${cacheKey}`, 'cache');
        return res.json(entry.value);
      } else {
        // Remove expired entry
        cache.delete(cacheKey);
      }
    }
    
    // Store original json method
    const originalJson = res.json;
    
    // Override json method to intercept the response
    res.json = function(body) {
      // Restore original method
      res.json = originalJson;
      
      // Store response in cache
      cache.set(cacheKey, {
        value: body,
        timestamp: Date.now(),
        ttl: ttl
      });
      
      log(`Cache set for ${cacheKey}`, 'cache');
      
      // Call original method with body
      return originalJson.call(this, body);
    };
    
    next();
  };
}

// Clean expired cache entries
export function cleanCache(): void {
  const now = Date.now();
  let expiredCount = 0;
  
  for (const [key, entry] of cache.entries()) {
    if (now - entry.timestamp > entry.ttl * 1000) {
      cache.delete(key);
      expiredCount++;
    }
  }
  
  if (expiredCount > 0) {
    log(`Cleaned ${expiredCount} expired cache entries`, 'cache');
  }
}

// Invalidate cache entries matching a pattern
export function invalidatePattern(pattern: string): number {
  const regex = new RegExp(pattern);
  let invalidatedCount = 0;
  
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
      invalidatedCount++;
    }
  }
  
  if (invalidatedCount > 0) {
    log(`Invalidated ${invalidatedCount} cache entries matching pattern: ${pattern}`, 'cache');
  }
  
  return invalidatedCount;
}

// Helper to clear voice cache
export function clearVoiceCache(): number {
  return invalidatePattern('/api/voice/voices');
}

// Set up periodic cache cleaning (every 10 minutes)
setInterval(cleanCache, 10 * 60 * 1000);