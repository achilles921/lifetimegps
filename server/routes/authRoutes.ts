import type { Router, Request } from "express";
import { db } from "../db";
import { z, ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { log } from "../vite";
import { eq } from "drizzle-orm";
import { users } from "../../shared/schema";
import { randomBytes } from "crypto";

// Helper function to create user session
async function createUserSession(email: string, res: any): Promise<string> {
  const sessionId = randomBytes(32).toString('hex');
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days expiry
  
  // Insert session into database
  const { pool } = await import('../db');
  const sessionInsertQuery = `
    INSERT INTO user_sessions (session_id, email, expires_at, created_at) 
    VALUES ($1, $2, $3, NOW())
    ON CONFLICT (session_id) DO UPDATE SET
      email = $2,
      expires_at = $3,
      created_at = NOW()
  `;
  await pool.query(sessionInsertQuery, [sessionId, email, expiresAt]);
  
  // Set session cookie
  res.cookie('sessionId', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
  
  return sessionId;
}

// Augment the Express Request type to include session
declare module 'express-serve-static-core' {
  interface Request {
    session?: {
      user?: {
        id: number;
        email: string;
        name: string;
      };
      destroy?: (callback: (err: any) => void) => void;
    };
  }
}

/**
 * Register authentication routes
 */
export function registerAuthRoutes(router: Router): void {
  // Enhanced user authentication endpoint with better handling of test accounts
  router.get('/auth/user', async (req, res) => {
    try {
      // Get session ID from cookies
      const sessionId = req.cookies?.sessionId;
      
      if (!sessionId) {
        return res.status(401).json({ message: "Unauthorized - no session" });
      }

      // Get user email from session table
      const { pool } = await import('../db');
      const sessionQuery = `SELECT email FROM user_sessions WHERE session_id = $1 AND expires_at > NOW()`;
      const sessionResult = await pool.query(sessionQuery, [sessionId]);
      
      if (sessionResult.rows.length === 0) {
        return res.status(401).json({ message: "Unauthorized - invalid or expired session" });
      }
      
      const email = sessionResult.rows[0].email;
      
      // For regular users, attempt database lookup
      log(`Auth request for email: ${email}`, 'auth');
      
      try {
        // Use direct SQL query for performance
        const { pool } = await import('../db');
        const query = `SELECT * FROM users WHERE username = $1 OR email = $1`;
        const result = await pool.query(query, [email]);
        
        if (result.rows.length === 0) {
          log(`User not found in database: ${email}`, 'auth');
          
          // If the user doesn't exist, return unauthorized
          return res.status(401).json({ message: "Unauthorized - user not found" });
        }
        
        // If we found the user, return their information
        const user = result.rows[0];
        log(`User authenticated from database: ${email}`, 'auth');
        
        // Return user without sensitive information
        return res.json({
          id: user.id,
          username: user.username,
          email: user.email || user.username, // Use email if available, otherwise username
          firstName: user.firstName || email.split('@')[0], // Use stored first name or extract from email
          lastName: user.lastName || '',
          isLoggedIn: true,
        });
      } catch (error) {
        console.error('Database error getting user:', error);
        
        // For database errors, still return an error
        return res.status(500).json({ message: "Error fetching user data" });
      }
    } catch (error) {
      console.error('Error in auth/user:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Enhanced login endpoint with better test account handling
  router.post('/auth/login', async (req, res) => {
    try {
      // Get username and password from request body
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Log for debugging
      log(`Login attempt for ${username}`, "auth");

      // For all other accounts, try the database
      try {
        // Look up user by username OR email using direct SQL
        const { pool } = await import('../db');
        const query = `SELECT * FROM users WHERE username = $1 OR email = $1`;
        const result = await pool.query(query, [username]);
        
        if (result.rows.length === 0) {
          // Not found in database
          log(`User not found in database: ${username}`, "auth");
          return res.status(401).json({ message: "Invalid email or password" });
        }
        
        const user = result.rows[0];
        
        // Check password (in a real app, we would hash and compare)
        if (user.password !== password) {
          log(`Invalid password for user: ${username}`, "auth");
          return res.status(401).json({ message: "Invalid email or password" });
        }
        
        log(`Successful login for database user: ${username}`, "auth");
        
        // Create session using helper function
        const sessionId = await createUserSession(user.email || user.username, res);
        
        // Return success with user data and session ID
        return res.status(200).json({
          id: user.id,
          username: user.username,
          email: user.email || user.username,
          firstName: user.firstName || username.split('@')[0],
          lastName: user.lastName || '',
          isLoggedIn: true,
          sessionId: sessionId
        });
      } catch (error) {
        console.error('Database error in login:', error);
        
        // Since login failed, check if we want to auto-register this user
        // For now, just return an error
        // Cast error to access its properties safely
        const err = error as any;
        return res.status(401).json({ 
          message: "Login failed: Database error",
          error: err.message || "Unknown database error"
        });
      }
    } catch (error) {
      console.error('Error in auth/login:', error);
      return res.status(500).json({ message: "Internal server error" });
    }
  });
  
  // Improved signup endpoint with better validation and error handling
  router.post('/auth/signup', async (req, res) => {
    try {
      // Define validation schema
      const schema = z.object({
        username: z.string().email("Please enter a valid email address"),
        password: z.string().min(6, "Password must be at least 6 characters"),
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        birthdate: z.string().optional(),
        // Add other fields as needed
      });
      
      // Validate the request body
      const validated = schema.parse(req.body);
      
      try {
        // Use Drizzle ORM instead of raw SQL for better type safety
        const { db } = await import('../db');
        const { users } = await import('../../shared/schema');
        const { eq, or } = await import('drizzle-orm');

        // Check if user already exists
        const existingUser = await db.select().from(users)
          .where(or(eq(users.username, validated.username), eq(users.email, validated.username)))
          .limit(1);
        
        if (existingUser.length > 0) {
          log(`User already exists: ${validated.username}`, "auth");
          return res.status(409).json({ message: "Account already exists with this email" });
        }
        
        // Create new user with Drizzle
        const userId = Math.floor(Math.random() * 1000000) + 10000; // Generate random integer ID
        const newUserData = {
          id: userId.toString(), // Convert to string for consistency with schema
          username: validated.username,
          password: validated.password,
          email: validated.username,
          firstName: validated.firstName || validated.username.split('@')[0],
          lastName: validated.lastName || '',
          createdAt: new Date(),
          updatedAt: new Date()
        };

        const [newUser] = await db.insert(users).values(newUserData).returning();
        log(`New user account created: ${validated.username}`, "auth");
        
        // Create session using helper function
        const sessionId = await createUserSession(newUser.email || newUser.username, res);
        
        // Return success with user data and session ID
        return res.status(201).json({
          id: newUser.id,
          username: newUser.username,
          email: newUser.email || newUser.username,
          firstName: newUser.firstName || validated.username.split('@')[0],
          lastName: newUser.lastName || '',
          isLoggedIn: true,
          sessionId: sessionId,
          message: "Account created successfully",
        });
      } catch (error) {
        console.error('Database error in signup:', error);
        
        // Return more specific error
        const err = error as any;
        if (err.code === '23505') { // PostgreSQL unique violation
          return res.status(409).json({ message: "Account already exists with this email" });
        }
        
        // Already cast above, use the same err variable
        return res.status(500).json({ 
          message: "Failed to create account. Please try again.",
          error: err.message || "Unknown database error"
        });
      }
    } catch (error) {
      // Handle validation errors
      if (error instanceof ZodError) {
        const formattedError = fromZodError(error);
        return res.status(400).json({ 
          message: "Invalid signup data", 
          errors: formattedError.message
        });
      } 
      
      // Handle other errors
      console.error('Error in auth/signup:', error);
      return res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
}