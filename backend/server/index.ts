import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { initializeCache } from "./services/optimizedCacheService";
import session from 'express-session';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
// Initialize the optimized caching system with default namespace
initializeCache('default');

const app = express();

// Serve static files from frontend/dist
app.use(express.static(path.join(__dirname, "../../frontend/dist")));

// SPA Fallback: serve index.html for any non-API route
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/index.html"));
});

// Enable CORS for frontend
app.use(cors({
  origin: process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

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

      console.log(logLine);
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

  // Backend API server runs on port 3001
  const port = process.env.PORT || 3001;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    console.log(`🚀 Backend API server running on port ${port}`);
    console.log(`📡 API endpoints available at http://localhost:${port}/api`);
  });
})();