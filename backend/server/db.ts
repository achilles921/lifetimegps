import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "./shared/schema";
import dotenv from "dotenv";
dotenv.config();
if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use standard PostgreSQL connection for better reliability in Replit
export const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  max: 5, // Reduce connection pool size for Replit
  min: 1, // Keep minimum connections
  idleTimeoutMillis: 10000, // Reduce idle timeout
  connectionTimeoutMillis: 10000
});

export const db = drizzle(pool, { schema });