import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeCache } from "./services/optimizedCacheService";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

dotenv.config();
// Initialize the optimized caching system with default namespace
initializeCache('default');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Configure session middleware
app.use(session({
  secret: 'lifetime-gps-auth-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(cookieParser());

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, req: Request, res: Response, _next: NextFunction) => {
    // Get detailed error information
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    const stack = process.env.NODE_ENV === 'development' ? err.stack : undefined;

    // Log error with request details
    console.error(`Error processing ${req.method} ${req.url}:`, {
      status,
      message,
      errorName: err.name,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
      requestParams: {
        path: req.path,
        query: req.query,
        body: req.method !== 'GET' ? req.body : undefined,
        ip: req.ip,
        userAgent: req.get('user-agent')
      }
    });

    // Send error response with appropriate information based on environment
    res.status(status).json({ 
      message,
      error: process.env.NODE_ENV === 'development' ? err.name : undefined,
      stack: process.env.NODE_ENV === 'development' ? stack : undefined
    });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();