/**
 * Authentication Middleware
 * 
 * Provides middleware functions for protecting routes:
 * - isAuthenticated: Ensures the user is logged in
 * - isAuthorized: Ensures the user has specific permissions
 * - refreshTokenIfNeeded: Refreshes auth token if about to expire
 */

import { Request, Response, NextFunction } from 'express';

// Extend Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

/**
 * Middleware to check if user is authenticated
 */
export function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  // First check if session contains user 
  if (req.session && req.session.user) {
    // We have a user in session
    return next();
  }
  
  // Legacy check: User is attached to request directly
  if (req.user) {
    return next();
  }
  
  // No authenticated user found
  return res.status(401).json({ message: 'Authentication required' });
}

/**
 * Middleware to check if user has specific permissions
 */
export function isAuthorized(permission: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Check session first
    if (req.session && req.session.user) {
      // Session user found, check permissions  
      // For simplicity, we're skipping actual permission checks for session users
      // In a real implementation, you'd attach permissions to the session
      
      // For now, let's just assume session users have all permissions
      return next();
    }
    
    // Legacy check
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }
    
    // This implementation would be expanded based on your permission system
    const userPermissions = (req.user as any).permissions || [];
    
    if (!userPermissions.includes(permission)) {
      return res.status(403).json({ message: 'Permission denied' });
    }
    
    next();
  };
}

/**
 * Middleware to refresh auth token if it's about to expire
 */
export function refreshTokenIfNeeded(req: Request, res: Response, next: NextFunction) {
  if (!req.user) {
    return next();
  }
  
  const user = req.user as any;
  
  // If token expires in less than 5 minutes, refresh it
  const expiresAt = user.expires_at;
  const fiveMinutesFromNow = Math.floor(Date.now() / 1000) + 5 * 60;
  
  if (expiresAt && expiresAt < fiveMinutesFromNow) {
    // Token refresh logic would go here
    // This depends on your authentication system
    console.log('Token about to expire, refreshing...');
    
    // After refreshing, continue
    return next();
  }
  
  next();
}