import { Pool, neonConfig } from '@neondatabase/serverless';
import { sql } from 'drizzle-orm';
import ws from 'ws';

/**
 * Migration file to update database schema to include all required tables and fields
 * This includes tables for parent/guardian information, mini-game performance, and enhancing users table
 */

// Configure Neon to use 'ws' package for WebSocket connections
neonConfig.webSocketConstructor = ws;

async function updateDatabase() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  
  try {
    console.log('Starting database schema update...');
    
    // Update users table to include all required fields
    console.log('Updating users table...');
    await pool.query(`
      ALTER TABLE "users" 
      ADD COLUMN IF NOT EXISTS "email" TEXT UNIQUE,
      ADD COLUMN IF NOT EXISTS "first_name" TEXT,
      ADD COLUMN IF NOT EXISTS "last_name" TEXT,
      ADD COLUMN IF NOT EXISTS "phone" TEXT,
      ADD COLUMN IF NOT EXISTS "date_of_birth" TIMESTAMP,
      ADD COLUMN IF NOT EXISTS "gender" TEXT,
      ADD COLUMN IF NOT EXISTS "bio" TEXT,
      ADD COLUMN IF NOT EXISTS "profile_image_url" TEXT,
      ADD COLUMN IF NOT EXISTS "custom_avatar_url" TEXT,
      ADD COLUMN IF NOT EXISTS "address" TEXT,
      ADD COLUMN IF NOT EXISTS "city" TEXT,
      ADD COLUMN IF NOT EXISTS "state" TEXT,
      ADD COLUMN IF NOT EXISTS "zip_code" TEXT,
      ADD COLUMN IF NOT EXISTS "country" TEXT DEFAULT 'USA',
      ADD COLUMN IF NOT EXISTS "hobbies" JSONB,
      ADD COLUMN IF NOT EXISTS "optimal_time_of_day" TEXT,
      ADD COLUMN IF NOT EXISTS "travel_interests" JSONB,
      ADD COLUMN IF NOT EXISTS "education_level" TEXT,
      ADD COLUMN IF NOT EXISTS "school_name" TEXT,
      ADD COLUMN IF NOT EXISTS "graduation_year" INTEGER,
      ADD COLUMN IF NOT EXISTS "user_type" TEXT DEFAULT 'student',
      ADD COLUMN IF NOT EXISTS "privacy_settings" JSONB,
      ADD COLUMN IF NOT EXISTS "is_minor" BOOLEAN DEFAULT FALSE,
      ADD COLUMN IF NOT EXISTS "created_at" TIMESTAMP DEFAULT NOW(),
      ADD COLUMN IF NOT EXISTS "updated_at" TIMESTAMP DEFAULT NOW()
    `);
    
    // Create parent guardians table if not exists
    console.log('Creating parent_guardians table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "parent_guardians" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER REFERENCES "users" ("id"),
        "first_name" TEXT NOT NULL,
        "last_name" TEXT NOT NULL,
        "email" TEXT UNIQUE NOT NULL,
        "phone" TEXT NOT NULL,
        "relationship" TEXT NOT NULL,
        "address" TEXT,
        "city" TEXT,
        "state" TEXT,
        "zip_code" TEXT,
        "country" TEXT DEFAULT 'USA',
        "receive_updates" BOOLEAN DEFAULT TRUE,
        "contact_preference" TEXT DEFAULT 'email',
        "verification_status" TEXT DEFAULT 'pending',
        "verification_token" UUID,
        "consent_provided" BOOLEAN DEFAULT FALSE,
        "consent_date" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create sessions table for Replit Auth if not exists
    console.log('Creating sessions table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "sessions" (
        "sid" VARCHAR PRIMARY KEY,
        "sess" JSONB NOT NULL,
        "expire" TIMESTAMP NOT NULL
      )
    `);
    
    // Create index on sessions expiry
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "sessions" ("expire")
    `);
    
    // Create mini_game_performance table if not exists
    console.log('Creating mini_game_performance table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "mini_game_performance" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "game_id" TEXT NOT NULL,
        "metrics" JSONB NOT NULL,
        "completed" BOOLEAN DEFAULT FALSE,
        "difficulty" INTEGER DEFAULT 1,
        "score" INTEGER NOT NULL,
        "completion_time" FLOAT,
        "accuracy" FLOAT,
        "visual_processing" INTEGER,
        "auditory_processing" INTEGER,
        "motor_control" INTEGER,
        "pattern_recognition" INTEGER,
        "decision_speed" INTEGER,
        "response_consistency" INTEGER,
        "spatial_awareness" INTEGER,
        "multitasking_ability" INTEGER,
        "memory_capacity" INTEGER,
        "processing_speed" INTEGER,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "session_id" TEXT,
        "is_practice" BOOLEAN DEFAULT FALSE
      )
    `);
    
    // Create learning preferences table if not exists
    console.log('Creating learning_preferences table...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "learning_preferences" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "preferred_learning_style" TEXT,
        "preferred_content_types" JSONB,
        "career_exploration_preferences" JSONB,
        "preferred_feedback_style" TEXT,
        "engagement_preferences" JSONB,
        "time_commitment" TEXT,
        "accessibility_needs" JSONB,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Create quests and achievements tables if they don't exist
    console.log('Creating quests and achievements tables...');
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "quests" (
        "id" SERIAL PRIMARY KEY,
        "title" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "requirements" JSONB NOT NULL,
        "reward_xp" INTEGER DEFAULT 0,
        "reward_badges" JSONB,
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_quest_progress" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "quest_id" INTEGER NOT NULL REFERENCES "quests" ("id"),
        "current_progress" JSONB NOT NULL,
        "is_completed" BOOLEAN DEFAULT FALSE,
        "completed_at" TIMESTAMP,
        "created_at" TIMESTAMP DEFAULT NOW(),
        "updated_at" TIMESTAMP DEFAULT NOW(),
        UNIQUE("user_id", "quest_id")
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "badges" (
        "id" SERIAL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "icon_url" TEXT NOT NULL,
        "category" TEXT,
        "xp_value" INTEGER DEFAULT 0,
        "is_active" BOOLEAN DEFAULT TRUE,
        "created_at" TIMESTAMP DEFAULT NOW()
      )
    `);
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS "user_achievements" (
        "id" SERIAL PRIMARY KEY,
        "user_id" INTEGER NOT NULL REFERENCES "users" ("id"),
        "badge_id" INTEGER NOT NULL REFERENCES "badges" ("id"),
        "awarded_at" TIMESTAMP DEFAULT NOW(),
        "showcase_priority" INTEGER DEFAULT 0,
        UNIQUE("user_id", "badge_id")
      )
    `);
    
    // Add indexes for performance
    console.log('Adding performance indexes...');
    await pool.query(`
      CREATE INDEX IF NOT EXISTS "idx_mini_game_performance_user_id" ON "mini_game_performance" ("user_id");
      CREATE INDEX IF NOT EXISTS "idx_mini_game_performance_game_id" ON "mini_game_performance" ("game_id");
      CREATE INDEX IF NOT EXISTS "idx_user_quest_progress_user_id" ON "user_quest_progress" ("user_id");
      CREATE INDEX IF NOT EXISTS "idx_user_achievements_user_id" ON "user_achievements" ("user_id");
      CREATE INDEX IF NOT EXISTS "idx_parent_guardians_user_id" ON "parent_guardians" ("user_id");
    `);
    
    console.log('Database schema update completed successfully!');
  } catch (error) {
    console.error('Error updating database schema:', error);
  } finally {
    await pool.end();
  }
}

// Run the migration
updateDatabase().catch(console.error);