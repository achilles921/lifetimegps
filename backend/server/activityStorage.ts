import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import { activityEvents, type InsertActivityEvent, type ActivityEvent, type ActivityEventType } from './shared/schema';

// Define interface for activity storage
export interface IActivityStorage {
  trackEvents(events: Omit<ActivityEvent, 'id' | 'createdAt'>[]): Promise<void>;
  getEventsByUserId(userId: string, limit?: number): Promise<ActivityEvent[]>;
  getEventsBySessionId(sessionId: string, limit?: number): Promise<ActivityEvent[]>;
  getEventsByType(type: ActivityEventType, limit?: number): Promise<ActivityEvent[]>;
  getEventsByTimeRange(startTime: Date, endTime: Date, limit?: number): Promise<ActivityEvent[]>;
}

// Implement activity storage with database
export class ActivityDatabaseStorage implements IActivityStorage {
  async trackEvents(events: any[]): Promise<void> {
    if (!events || events.length === 0) return;
    
    try {
      // Convert client events to database format with timestamp validation
      const dbEvents = events.map(event => {
        // Validate and sanitize timestamp
        let timestamp = new Date();
        if (event.timestamp) {
          const parsedTimestamp = new Date(event.timestamp);
          if (!isNaN(parsedTimestamp.getTime())) {
            timestamp = parsedTimestamp;
          }
        }
        
        return {
          eventId: event.eventId || event.id || `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          userId: event.userId || null,
          sessionId: event.sessionId,
          type: event.type,
          path: event.path,
          data: event.data || {},
          timestamp: timestamp,
        };
      });
      
      // Insert events into database
      await db.insert(activityEvents).values(dbEvents);
      
      console.log(`Tracked ${events.length} activity events`, 'activity');
    } catch (error) {
      console.error('Error tracking activity events:', error);
      throw error;
    }
  }
  
  async getEventsByUserId(userId: string, limit: number = 100): Promise<any[]> {
    try {
      const events = await db
        .select()
        .from(activityEvents)
        .where(eq(activityEvents.userId, userId))
        .orderBy(desc(activityEvents.timestamp))
        .limit(limit);
      
      return events;
    } catch (error) {
      console.error(`Error getting events by userId ${userId}:`, error);
      return [];
    }
  }
  
  async getEventsBySessionId(sessionId: string, limit: number = 100): Promise<any[]> {
    try {
      const events = await db
        .select()
        .from(activityEvents)
        .where(eq(activityEvents.sessionId, sessionId))
        .orderBy(desc(activityEvents.timestamp))
        .limit(limit);
      
      return events;
    } catch (error) {
      console.error(`Error getting events by sessionId ${sessionId}:`, error);
      return [];
    }
  }
  
  async getEventsByType(type: string, limit: number = 100): Promise<any[]> {
    try {
      const events = await db
        .select()
        .from(activityEvents)
        .where(eq(activityEvents.type, type))
        .orderBy(desc(activityEvents.timestamp))
        .limit(limit);
      
      return events;
    } catch (error) {
      console.error(`Error getting events by type ${type}:`, error);
      return [];
    }
  }
  
  async getEventsByTimeRange(startTime: Date, endTime: Date, limit: number = 100): Promise<any[]> {
    try {
      const events = await db
        .select()
        .from(activityEvents)
        .where(
          and(
            sql`${activityEvents.timestamp} >= ${startTime}`,
            sql`${activityEvents.timestamp} <= ${endTime}`
          )
        )
        .orderBy(desc(activityEvents.timestamp))
        .limit(limit);
      
      return events;
    } catch (error) {
      console.error(`Error getting events by time range:`, error);
      return [];
    }
  }
}

// Export a singleton instance
export const activityStorage = new ActivityDatabaseStorage();