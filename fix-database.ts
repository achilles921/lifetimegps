import { db } from './server/db';
import { sql } from 'drizzle-orm';

async function fixDatabase() {
  try {
    // First, check the users table id type
    const userIdTypeResult = await db.execute(sql`
      SELECT column_name, data_type, character_maximum_length 
      FROM information_schema.columns 
      WHERE table_name = 'users' AND column_name = 'id';
    `);
    
    console.log('User ID type info:', userIdTypeResult.rows && userIdTypeResult.rows[0]);
    
    // Check if activity_events table exists
    const result = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'activity_events'
      ) AS exists;
    `);
    
    const tableExists = result.rows && result.rows[0] && result.rows[0].exists === true;
    console.log('activity_events table exists:', tableExists);
    
    if (!tableExists) {
      console.log('Creating activity_events table without foreign key constraint...');
      
      // Create the table with integer user_id to match the users table
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "activity_events" (
          "id" SERIAL PRIMARY KEY,
          "event_id" VARCHAR(36) NOT NULL,
          "user_id" INTEGER REFERENCES "users" ("id"),
          "session_id" VARCHAR(36) NOT NULL,
          "type" VARCHAR(50) NOT NULL,
          "path" TEXT NOT NULL,
          "data" JSONB,
          "timestamp" TIMESTAMP DEFAULT NOW() NOT NULL,
          "created_at" TIMESTAMP DEFAULT NOW() NOT NULL
        );
      `);
      
      console.log('Table created successfully!');
    } else {
      console.log('activity_events table already exists.');
    }
    
    // Check if shadowing_opportunities table exists
    const shadOppsResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'shadowing_opportunities'
      ) AS exists;
    `);
    
    const shadOppsExists = shadOppsResult.rows && shadOppsResult.rows[0] && shadOppsResult.rows[0].exists === true;
    
    if (!shadOppsExists) {
      console.log('Creating shadowing_opportunities table...');
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "shadowing_opportunities" (
          "id" SERIAL PRIMARY KEY,
          "title" TEXT NOT NULL,
          "organization" TEXT NOT NULL,
          "type" TEXT NOT NULL,
          "location" TEXT,
          "availability" TEXT NOT NULL,
          "description" TEXT NOT NULL,
          "requirements" JSONB NOT NULL,
          "link" TEXT NOT NULL,
          "industry" TEXT NOT NULL,
          "image_url" TEXT NOT NULL,
          "created_at" TIMESTAMP DEFAULT NOW()
        );
      `);
      
      console.log('shadowing_opportunities table created successfully!');
    }
    
    // Check if shadowing_applications table exists
    const shadAppsResult = await db.execute(sql`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public'
        AND table_name = 'shadowing_applications'
      ) AS exists;
    `);
    
    const shadAppsExists = shadAppsResult.rows && shadAppsResult.rows[0] && shadAppsResult.rows[0].exists === true;
    
    if (!shadAppsExists) {
      console.log('Creating shadowing_applications table...');
      
      await db.execute(sql`
        CREATE TABLE IF NOT EXISTS "shadowing_applications" (
          "id" SERIAL PRIMARY KEY,
          "user_id" INTEGER NOT NULL REFERENCES "users" ("id"),
          "opportunity_id" INTEGER NOT NULL REFERENCES "shadowing_opportunities" ("id"),
          "status" TEXT NOT NULL DEFAULT 'pending',
          "notes" TEXT,
          "created_at" TIMESTAMP DEFAULT NOW(),
          "updated_at" TIMESTAMP DEFAULT NOW(),
          UNIQUE("user_id", "opportunity_id")
        );
      `);
      
      console.log('shadowing_applications table created successfully!');
    }
    
    // Check other important tables
    const tables = [
      'users', 'user_preferences', 'quiz_responses', 
      'career_roadmaps', 'shadowing_opportunities', 
      'shadowing_applications', 'guest_sessions'
    ];
    
    for (const table of tables) {
      const checkResult = await db.execute(sql`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public'
          AND table_name = ${table}
        ) AS exists;
      `);
      
      const exists = checkResult.rows && checkResult.rows[0] && checkResult.rows[0].exists === true;
      console.log(`Table ${table} exists: ${exists}`);
      
      if (exists) {
        // Get the column structure for the table
        const columnsResult = await db.execute(sql`
          SELECT column_name, data_type, character_maximum_length 
          FROM information_schema.columns 
          WHERE table_name = ${table};
        `);
        
        console.log(`${table} columns:`, columnsResult.rows);
      }
    }
    
  } catch (error) {
    console.error('Error fixing database:', error);
  } finally {
    process.exit(0);
  }
}

fixDatabase();