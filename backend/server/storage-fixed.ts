import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "./db";
import {
  users, userPreferences, quizResponses, careerRoadmaps, 
  shadowingOpportunities, shadowingApplications, parentGuardians, 
  miniGamePerformance, guestSessions,
  type User, type UserPreference, type QuizResponse, 
  type CareerRoadmap, type ShadowingOpportunity, type ShadowingApplication,
  type ParentGuardian, type MiniGamePerformance, type GuestSession,
  type InsertUser, type InsertUserPreference, type InsertQuizResponse,
  type InsertCareerRoadmap, type InsertShadowingOpportunity, 
  type InsertShadowingApplication, type InsertParentGuardian,
  type InsertMiniGamePerformance, type InsertGuestSession
} from "./shared/schema";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined>;
  
  // User preferences methods
  getUserPreferences(userId: string): Promise<UserPreference | undefined>;
  createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference>;
  updateUserPreferences(userId: string, preferences: Partial<InsertUserPreference>): Promise<UserPreference | undefined>;
  
  // Quiz responses methods
  getQuizResponses(userId: string): Promise<QuizResponse | undefined>;
  createQuizResponses(responses: InsertQuizResponse): Promise<QuizResponse>;
  updateQuizResponses(userId: string, responses: Partial<InsertQuizResponse>): Promise<QuizResponse | undefined>;
  
  // Career roadmap methods
  getCareerRoadmap(userId: string): Promise<CareerRoadmap | undefined>;
  createCareerRoadmap(roadmap: InsertCareerRoadmap): Promise<CareerRoadmap>;
  
  // Shadowing opportunities methods
  getShadowingOpportunities(limit?: number, offset?: number): Promise<ShadowingOpportunity[]>;
  getShadowingOpportunity(id: number): Promise<ShadowingOpportunity | undefined>;
  createShadowingOpportunity(opportunity: InsertShadowingOpportunity): Promise<ShadowingOpportunity>;
  
  // Shadowing applications methods
  getShadowingApplications(userId: string): Promise<ShadowingApplication[]>;
  createShadowingApplication(application: InsertShadowingApplication): Promise<ShadowingApplication>;
  
  // Parent/guardian methods
  getParentGuardianByUserId(userId: string): Promise<ParentGuardian | undefined>;
  createParentGuardian(guardianData: InsertParentGuardian): Promise<ParentGuardian>;
  
  // Mini-game performance methods
  getMiniGamePerformance(userId: string, gameId?: string): Promise<MiniGamePerformance[]>; 
  createMiniGamePerformance(performanceData: InsertMiniGamePerformance): Promise<MiniGamePerformance>;
  
  // Guest session methods
  createGuestSession(sessionData: InsertGuestSession): Promise<GuestSession>;
  getGuestSession(sessionId: string): Promise<GuestSession | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, id))
        .limit(1);
      return user;
    } catch (error) {
      console.error(`Error getting user ${id}:`, error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.username, username))
        .limit(1);
      return user;
    } catch (error) {
      console.error(`Error getting user by username ${username}:`, error);
      return undefined;
    }
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    try {
      const [user] = await db
        .insert(users)
        .values(userData)
        .onConflictDoUpdate({
          target: users.id,
          set: {
            username: userData.username,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            updatedAt: new Date()
          }
        })
        .returning();
      
      return user;
    } catch (error) {
      console.error(`Error upserting user:`, error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<InsertUser>): Promise<User | undefined> {
    try {
      const [user] = await db
        .update(users)
        .set({
          ...userData,
          updatedAt: new Date()
        })
        .where(eq(users.id, id))
        .returning();
      
      return user;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      return undefined;
    }
  }

  async getUserPreferences(userId: string): Promise<UserPreference | undefined> {
    try {
      const [preferences] = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, userId))
        .limit(1);
      return preferences;
    } catch (error) {
      console.error(`Error getting user preferences for ${userId}:`, error);
      return undefined;
    }
  }

  async createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference> {
    try {
      const [result] = await db
        .insert(userPreferences)
        .values(preferences)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating user preferences:`, error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<InsertUserPreference>): Promise<UserPreference | undefined> {
    try {
      const [result] = await db
        .update(userPreferences)
        .set({
          ...preferences,
          updatedAt: new Date()
        })
        .where(eq(userPreferences.userId, userId))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating user preferences for ${userId}:`, error);
      return undefined;
    }
  }

  async getQuizResponses(userId: string): Promise<QuizResponse | undefined> {
    try {
      const [responses] = await db
        .select()
        .from(quizResponses)
        .where(eq(quizResponses.userId, userId))
        .limit(1);
      return responses;
    } catch (error) {
      console.error(`Error getting quiz responses for ${userId}:`, error);
      return undefined;
    }
  }

  async createQuizResponses(responses: InsertQuizResponse): Promise<QuizResponse> {
    try {
      const [result] = await db
        .insert(quizResponses)
        .values(responses)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating quiz responses:`, error);
      throw error;
    }
  }

  async updateQuizResponses(userId: string, responses: Partial<InsertQuizResponse>): Promise<QuizResponse | undefined> {
    try {
      const [result] = await db
        .update(quizResponses)
        .set({
          ...responses,
          updatedAt: new Date()
        })
        .where(eq(quizResponses.userId, userId))
        .returning();
      return result;
    } catch (error) {
      console.error(`Error updating quiz responses for ${userId}:`, error);
      return undefined;
    }
  }

  async getCareerRoadmap(userId: string): Promise<CareerRoadmap | undefined> {
    try {
      const [roadmap] = await db
        .select()
        .from(careerRoadmaps)
        .where(eq(careerRoadmaps.userId, userId))
        .limit(1);
      return roadmap;
    } catch (error) {
      console.error(`Error getting career roadmap for ${userId}:`, error);
      return undefined;
    }
  }

  async createCareerRoadmap(roadmap: InsertCareerRoadmap): Promise<CareerRoadmap> {
    try {
      const [result] = await db
        .insert(careerRoadmaps)
        .values(roadmap)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating career roadmap:`, error);
      throw error;
    }
  }

  async getShadowingOpportunities(limit = 50, offset = 0): Promise<ShadowingOpportunity[]> {
    try {
      const opportunities = await db
        .select()
        .from(shadowingOpportunities)
        .limit(limit)
        .offset(offset);
      return opportunities;
    } catch (error) {
      console.error(`Error getting shadowing opportunities:`, error);
      return [];
    }
  }

  async getShadowingOpportunity(id: number): Promise<ShadowingOpportunity | undefined> {
    try {
      const [opportunity] = await db
        .select()
        .from(shadowingOpportunities)
        .where(eq(shadowingOpportunities.id, id))
        .limit(1);
      return opportunity;
    } catch (error) {
      console.error(`Error getting shadowing opportunity ${id}:`, error);
      return undefined;
    }
  }

  async createShadowingOpportunity(opportunity: InsertShadowingOpportunity): Promise<ShadowingOpportunity> {
    try {
      const [result] = await db
        .insert(shadowingOpportunities)
        .values(opportunity)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating shadowing opportunity:`, error);
      throw error;
    }
  }

  async getShadowingApplications(userId: string): Promise<ShadowingApplication[]> {
    try {
      const applications = await db
        .select()
        .from(shadowingApplications)
        .where(eq(shadowingApplications.userId, userId));
      return applications;
    } catch (error) {
      console.error(`Error getting shadowing applications for ${userId}:`, error);
      return [];
    }
  }

  async createShadowingApplication(application: InsertShadowingApplication): Promise<ShadowingApplication> {
    try {
      const [result] = await db
        .insert(shadowingApplications)
        .values(application)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating shadowing application:`, error);
      throw error;
    }
  }

  async getParentGuardianByUserId(userId: string): Promise<ParentGuardian | undefined> {
    try {
      const [guardian] = await db
        .select()
        .from(parentGuardians)
        .where(eq(parentGuardians.userId, userId))
        .limit(1);
      return guardian;
    } catch (error) {
      console.error(`Error getting parent guardian for ${userId}:`, error);
      return undefined;
    }
  }

  async createParentGuardian(guardianData: InsertParentGuardian): Promise<ParentGuardian> {
    try {
      const [result] = await db
        .insert(parentGuardians)
        .values(guardianData)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating parent guardian:`, error);
      throw error;
    }
  }

  async getMiniGamePerformance(userId: string, gameId?: string): Promise<MiniGamePerformance[]> {
    try {
      let query = db
        .select()
        .from(miniGamePerformance)
        .where(eq(miniGamePerformance.userId, userId));
      
      if (gameId) {
        query = query.where(eq(miniGamePerformance.gameId, gameId));
      }
      
      const performances = await query;
      return performances;
    } catch (error) {
      console.error(`Error getting mini game performance for ${userId}:`, error);
      return [];
    }
  }

  async createMiniGamePerformance(performanceData: InsertMiniGamePerformance): Promise<MiniGamePerformance> {
    try {
      const [result] = await db
        .insert(miniGamePerformance)
        .values(performanceData)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating mini game performance:`, error);
      throw error;
    }
  }

  async createGuestSession(sessionData: InsertGuestSession): Promise<GuestSession> {
    try {
      const [result] = await db
        .insert(guestSessions)
        .values(sessionData)
        .returning();
      return result;
    } catch (error) {
      console.error(`Error creating guest session:`, error);
      throw error;
    }
  }

  async getGuestSession(sessionId: string): Promise<GuestSession | undefined> {
    try {
      const [session] = await db
        .select()
        .from(guestSessions)
        .where(eq(guestSessions.sessionId, sessionId))
        .limit(1);
      return session;
    } catch (error) {
      console.error(`Error getting guest session ${sessionId}:`, error);
      return undefined;
    }
  }
}

export const storage = new DatabaseStorage();