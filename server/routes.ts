import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { registerReadRoutes } from "./routes/readRoutes";
import { registerWriteRoutes } from "./routes/writeRoutes";
import { registerAuthRoutes } from "./routes/authRoutes";
import voiceRoutes from "./routes/voice";
import activityRoutes from "./routes/activityRoutes";
import miniGamesRouter from "./routes/miniGamesRoutes";
import { log } from "./vite";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes prefix
  const apiPrefix = "/api";
  
  // Create routers for read, write, and auth operations
  const readRouter = express.Router();
  const writeRouter = express.Router();
  const authRouter = express.Router();
  
  // Register routes on their respective routers
  registerReadRoutes(readRouter);
  registerWriteRoutes(writeRouter);
  registerAuthRoutes(authRouter);
  
  // Apply the routers to the API prefix path
  app.use(apiPrefix, readRouter);
  app.use(apiPrefix, writeRouter);
  app.use(apiPrefix, authRouter);
  
  // Apply voice routes
  app.use(`${apiPrefix}/voice`, voiceRoutes);
  
  // Apply activity tracking routes
  app.use(`${apiPrefix}/activity`, activityRoutes);
  
  // Apply mini-games routes
  app.use(`${apiPrefix}/mini-games`, miniGamesRouter);
  
  // Add a logout route that properly redirects to home page
  app.get(`${apiPrefix}/logout`, (req: Request, res: Response) => {
    // Handle logout in a simpler way without type errors
    try {
      // Clear any auth cookies if they exist - with all possible options
      res.clearCookie('connect.sid', { 
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict'
      });
      
      // Also try clearing without options
      res.clearCookie('connect.sid');
      
      // Try clearing session directly if it exists
      // Using any type to work around TypeScript limitations with Express sessions
      const reqAny = req as any;
      if (reqAny.session && typeof reqAny.session.destroy === 'function') {
        reqAny.session.destroy((err: any) => {
          if (err) {
            console.error('Error destroying session:', err);
          }
        });
      }
      
      // Set aggressive cache-control headers to prevent caching
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '-1');
      res.setHeader('Surrogate-Control', 'no-store');
      
      // Return a script to clear all browser storage before redirecting
      res.send(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Logging Out...</title>
          <script>
            // Clear all client-side storage
            localStorage.clear();
            sessionStorage.clear();
            
            // Clear cookies by setting expiration in the past
            document.cookie.split(";").forEach(function(c) {
              document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
            });
            
            // Redirect to home with cache busting
            window.location.href = "/?cache=" + Date.now();
          </script>
        </head>
        <body>
          <p>Logging out...</p>
        </body>
        </html>
      `);
      
      log("User logged out successfully", "auth");
    } catch (error) {
      console.error('Error during logout:', error);
      res.status(500).send('Error logging out');
    }
  });
  
  // Log that routes have been registered
  log("API routes registered with read/write separation and voice integration", "routes");
  
  // Create and return HTTP server
  const httpServer = createServer(app);
  return httpServer;
}