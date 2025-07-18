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

// Define the storage interface
export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  upsertUser(user: InsertUser): Promise<User>;
  updateUser(id: string, userData: Partial<Omit<InsertUser, 'id'>>): Promise<User | undefined>;

  // User preferences methods
  getUserPreferences(userId: string): Promise<UserPreference | undefined>;
  createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference>;
  updateUserPreferences(userId: string, preferences: Partial<Omit<InsertUserPreference, 'userId'>>): Promise<UserPreference | undefined>;

  // Quiz responses methods
  getQuizResponses(userId: string): Promise<QuizResponse | undefined>;
  createQuizResponses(responses: InsertQuizResponse): Promise<QuizResponse>;
  updateQuizResponses(userId: string, responses: Partial<Omit<InsertQuizResponse, 'userId'>>): Promise<QuizResponse | undefined>;

  // Career roadmap methods
  getCareerRoadmap(userId: string): Promise<CareerRoadmap | undefined>;
  getCareerRoadmapByPath(userId: string, careerPath: string): Promise<CareerRoadmap | undefined>;
  createCareerRoadmap(roadmap: InsertCareerRoadmap): Promise<CareerRoadmap>;
  updateCareerRoadmap(id: number, data: Partial<Omit<InsertCareerRoadmap, 'userId'>>): Promise<CareerRoadmap | undefined>;

  // Shadowing opportunities methods
  getShadowingOpportunities(limit?: number, offset?: number): Promise<ShadowingOpportunity[]>;
  getShadowingOpportunitiesByIndustry(industry: string): Promise<ShadowingOpportunity[]>;
  getShadowingOpportunity(id: number): Promise<ShadowingOpportunity | undefined>;
  createShadowingOpportunity(opportunity: InsertShadowingOpportunity): Promise<ShadowingOpportunity>;

  // Shadowing applications methods
  getShadowingApplications(userId: string): Promise<ShadowingApplication[]>;
  getShadowingApplication(id: number): Promise<ShadowingApplication | undefined>;
  createShadowingApplication(application: InsertShadowingApplication): Promise<ShadowingApplication>;
  updateShadowingApplication(id: number, data: Partial<Omit<InsertShadowingApplication, 'userId' | 'opportunityId'>>): Promise<ShadowingApplication | undefined>;

  // Parent/guardian methods
  getParentGuardian(id: number): Promise<ParentGuardian | undefined>;
  getParentGuardianByUserId(userId: string): Promise<ParentGuardian | undefined>;
  getParentGuardianByEmail(email: string): Promise<ParentGuardian | undefined>;
  createParentGuardian(guardianData: InsertParentGuardian): Promise<ParentGuardian>;
  updateParentGuardian(id: number, data: Partial<Omit<InsertParentGuardian, 'email'>>): Promise<ParentGuardian | undefined>;

  // Mini-game performance methods
  getMiniGamePerformance(userId: string, gameId?: string): Promise<MiniGamePerformance[]>; 
  createMiniGamePerformance(performanceData: InsertMiniGamePerformance): Promise<MiniGamePerformance>;
  updateMiniGamePerformance(id: number, data: Partial<Omit<InsertMiniGamePerformance, 'userId' | 'gameId'>>): Promise<MiniGamePerformance | undefined>;

  // Guest session methods
  createGuestSession(sessionData: InsertGuestSession): Promise<GuestSession>;
  getGuestSession(sessionId: string): Promise<GuestSession | undefined>;
  updateGuestSession(sessionId: string, data: Partial<Omit<GuestSession, 'id'>>): Promise<GuestSession | undefined>;
  cleanupExpiredGuestSessions(): Promise<number>; // Returns count of deleted sessions
}

export class DatabaseStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id));
      return user;
    } catch (error) {
      console.error(`Error fetching user ${id}:`, error);
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Use direct SQL with the pool to match the actual database structure
      const { pool } = await import('./db');
      const query = `SELECT * FROM users WHERE username = $1`;
      const result = await pool.query(query, [username]);

      if (result.rows.length === 0) {
        return undefined;
      }

      const dbUser = result.rows[0];

      // Map the database user to our expected User type
      // This is a workaround because our schema doesn't match the database
      return {
        id: dbUser.id,
        username: dbUser.username,
        password: null, // Add password field
        // Add fake fields to satisfy our schema
        email: dbUser.username, // Use username as email
        firstName: dbUser.username.split('@')[0], // Extract first part of email as name
        lastName: null,
        phone: null,
        dateOfBirth: null,
        gender: null,
        bio: null,
        profileImageUrl: null,
        customAvatarUrl: null,
        address: null,
        city: null,
        state: null,
        zipCode: null,
        country: null,
        hobbies: null,
        optimalTimeOfDay: null,
        travelInterests: null,
        educationLevel: null,
        schoolName: null,
        graduationYear: null,
        userType: 'student',
        privacySettings: null,
        isMinor: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch (error) {
      console.error(`Error fetching user by username ${username}:`, error);
      return undefined;
    }
  }

  async getUserById(userId: string): Promise<User | null> {
    try {
      const { pool } = await import('./db');
      const query = `SELECT * FROM users WHERE id = $1`;
      const result = await pool.query(query, [userId]);

      if (result.rows.length === 0) {
        return null;
      }

      const user = result.rows[0];
      return {
        id: user.id,
        username: user.username,
        email: user.email || user.username,
        firstName: user.firstName || user.username.split('@')[0],
        lastName: user.lastName || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error) {
      console.error('Error getting user by ID:', error);
      return null;
    }
  }

  async upsertUser(userData: InsertUser): Promise<User> {
    try {
      // Insert the user if they don't exist or update if they do
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
            bio: userData.bio,
            profileImageUrl: userData.profileImageUrl,
            customAvatarUrl: userData.customAvatarUrl,
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

  async updateUser(id: string, userData: Partial<Omit<InsertUser, 'id'>>): Promise<User | undefined> {
    try {
      const updateData = {
        ...userData,
        updatedAt: new Date()
      };

      const [user] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, id))
        .returning();

      return user;
    } catch (error) {
      console.error(`Error updating user ${id}:`, error);
      return undefined;
    }
  }

  // User preferences methods
  async getUserPreferences(userId: string): Promise<UserPreference | undefined> {
    try {
      const [preference] = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));
      return preference;
    } catch (error) {
      console.error(`Error fetching user preferences for ${userId}:`, error);
      return undefined;
    }
  }

  async createUserPreferences(preferences: InsertUserPreference): Promise<UserPreference> {
    try {
      const [preference] = await db.insert(userPreferences).values(preferences).returning();
      return preference;
    } catch (error) {
      console.error(`Error creating user preferences:`, error);
      throw error;
    }
  }

  async updateUserPreferences(userId: string, preferences: Partial<Omit<InsertUserPreference, 'userId'>>): Promise<UserPreference | undefined> {
    try {
      const [preference] = await db
        .update(userPreferences)
        .set({
          ...preferences,
          updatedAt: new Date()
        })
        .where(eq(userPreferences.userId, userId))
        .returning();

      return preference;
    } catch (error) {
      console.error(`Error updating user preferences for ${userId}:`, error);
      return undefined;
    }
  }

  // Quiz responses methods
  async getQuizResponses(userId: string): Promise<QuizResponse | undefined> {
    try {
      const [response] = await db.select().from(quizResponses).where(eq(quizResponses.userId, userId));
      return response;
    } catch (error) {
      console.error(`Error fetching quiz responses for ${userId}:`, error);
      return undefined;
    }
  }

  async createQuizResponses(responses: InsertQuizResponse): Promise<QuizResponse> {
    try {
      const [response] = await db.insert(quizResponses).values(responses).returning();
      return response;
    } catch (error) {
      console.error(`Error creating quiz responses:`, error);
      throw error;
    }
  }

  async updateQuizResponses(userId: string, responses: Partial<Omit<InsertQuizResponse, 'userId'>>): Promise<QuizResponse | undefined> {
    try {
      const [response] = await db
        .update(quizResponses)
        .set({
          ...responses,
          updatedAt: new Date()
        })
        .where(eq(quizResponses.userId, userId))
        .returning();

      return response;
    } catch (error) {
      console.error(`Error updating quiz responses for ${userId}:`, error);
      return undefined;
    }
  }

  // Career roadmap methods
  async getCareerRoadmap(userId: string): Promise<CareerRoadmap | undefined> {
    try {
      const [roadmap] = await db
        .select()
        .from(careerRoadmaps)
        .where(eq(careerRoadmaps.userId, userId))
        .orderBy(desc(careerRoadmaps.createdAt))
        .limit(1);

      return roadmap;
    } catch (error) {
      console.error(`Error fetching roadmap for ${userId}:`, error);
      return undefined;
    }
  }

  async getCareerRoadmapByPath(userId: string, careerPath: string): Promise<CareerRoadmap | undefined> {
    try {
      const [roadmap] = await db
        .select()
        .from(careerRoadmaps)
        .where(
          and(
            eq(careerRoadmaps.userId, userId),
            eq(careerRoadmaps.careerPath, careerPath)
          )
        );

      return roadmap;
    } catch (error) {
      console.error(`Error fetching roadmap for ${userId} and path ${careerPath}:`, error);
      return undefined;
    }
  }

  async createCareerRoadmap(roadmap: InsertCareerRoadmap): Promise<CareerRoadmap> {
    try {
      const [response] = await db.insert(careerRoadmaps).values(roadmap).returning();
      return response;
    } catch (error) {
      console.error(`Error creating career roadmap:`, error);
      throw error;
    }
  }

  async updateCareerRoadmap(id: number, data: Partial<Omit<InsertCareerRoadmap, 'userId'>>): Promise<CareerRoadmap | undefined> {
    try {
      const [roadmap] = await db
        .update(careerRoadmaps)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(careerRoadmaps.id, id))
        .returning();

      return roadmap;
    } catch (error) {
      console.error(`Error updating career roadmap ${id}:`, error);
      return undefined;
    }
  }

  // Shadowing opportunities methods
  async getShadowingOpportunities(limit = 50, offset = 0): Promise<ShadowingOpportunity[]> {
    try {
      return await db
        .select()
        .from(shadowingOpportunities)
        .limit(limit)
        .offset(offset);
    } catch (error) {
      console.error(`Error fetching shadowing opportunities:`, error);
      return [];
    }
  }

  async getShadowingOpportunitiesByIndustry(industry: string): Promise<ShadowingOpportunity[]> {
    try {
      return await db
        .select()
        .from(shadowingOpportunities)
        .where(eq(shadowingOpportunities.industry, industry));
    } catch (error) {
      console.error(`Error fetching shadowing opportunities for industry ${industry}:`, error);
      return [];
    }
  }

  async getShadowingOpportunity(id: number): Promise<ShadowingOpportunity | undefined> {
    try {
      const [opportunity] = await db
        .select()
        .from(shadowingOpportunities)
        .where(eq(shadowingOpportunities.id, id));

      return opportunity;
    } catch (error) {
      console.error(`Error fetching shadowing opportunity ${id}:`, error);
      return undefined;
    }
  }

  async createShadowingOpportunity(opportunity: InsertShadowingOpportunity): Promise<ShadowingOpportunity> {
    try {
      // When inserting an opportunity with an array of requirements,
      // we need to ensure it's properly formatted as a JSON array
      const formattedOpportunity = {
        ...opportunity,
        requirements: Array.isArray(opportunity.requirements) 
          ? opportunity.requirements 
          : []
      };

      const [result] = await db
        .insert(shadowingOpportunities)
        .values(formattedOpportunity)
        .returning();

      return result;
    } catch (error) {
      console.error(`Error creating shadowing opportunity:`, error);
      throw error;
    }
  }

  // Shadowing applications methods
  async getShadowingApplications(userId: string): Promise<ShadowingApplication[]> {
    try {
      return await db
        .select()
        .from(shadowingApplications)
        .where(eq(shadowingApplications.userId, userId));
    } catch (error) {
      console.error(`Error fetching shadowing applications for user ${userId}:`, error);
      return [];
    }
  }

  async getShadowingApplication(id: number): Promise<ShadowingApplication | undefined> {
    try {
      const [application] = await db
        .select()
        .from(shadowingApplications)
        .where(eq(shadowingApplications.id, id));

      return application;
    } catch (error) {
      console.error(`Error fetching shadowing application ${id}:`, error);
      return undefined;
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

  async updateShadowingApplication(id: number, data: Partial<Omit<InsertShadowingApplication, 'userId' | 'opportunityId'>>): Promise<ShadowingApplication | undefined> {
    try {
      const [application] = await db
        .update(shadowingApplications)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(shadowingApplications.id, id))
        .returning();

      return application;
    } catch (error) {
      console.error(`Error updating shadowing application ${id}:`, error);
      return undefined;
    }
  }

  // Guest session methods
  async createGuestSession(sessionData: InsertGuestSession): Promise<GuestSession> {
    try {
      // Set expiration to 30 days from now
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Create a cleaned version of the input data with only valid fields
      const validData = {
        id: sessionData.id,
        avatarId: sessionData.avatarId,
        voiceId: sessionData.voiceId,
        voiceType: sessionData.voiceType,
        ageGroup: sessionData.ageGroup || 'teen', // Default to teen for Gen-Z focus
        priorExperience: sessionData.priorExperience || 'none', // Default to none for new users
        quizResponses: sessionData.quizResponses,
        interestSelections: sessionData.interestSelections,
        careerMatches: sessionData.careerMatches,
        currentSector: sessionData.currentSector,
        currentScreen: sessionData.currentScreen,
        selectedCareer: sessionData.selectedCareer,
        roadmapData: sessionData.roadmapData,
        expiresAt
      };

      const [session] = await db
        .insert(guestSessions)
        .values(validData)
        .returning();

      return session;
    } catch (error) {
      console.error(`Error creating guest session:`, error);
      throw error;
    }
  }

  async getGuestSession(sessionId: string): Promise<GuestSession | undefined> {
    try {
      // Get columns that we know exist in the table
      const [session] = await db
        .select({
          id: guestSessions.id,
          avatarId: guestSessions.avatarId,
          voiceId: guestSessions.voiceId,
          voiceType: guestSessions.voiceType,
          ageGroup: guestSessions.ageGroup,
          priorExperience: guestSessions.priorExperience,
          quizResponses: guestSessions.quizResponses,
          interestSelections: guestSessions.interestSelections,
          careerMatches: guestSessions.careerMatches,
          currentSector: guestSessions.currentSector,
          currentScreen: guestSessions.currentScreen,
          selectedCareer: guestSessions.selectedCareer,
          roadmapData: guestSessions.roadmapData,
          createdAt: guestSessions.createdAt,
          lastActiveAt: guestSessions.lastActiveAt,
          expiresAt: guestSessions.expiresAt
        })
        .from(guestSessions)
        .where(eq(guestSessions.id, sessionId));

      // Update last active timestamp if session exists
      if (session) {
        await db
          .update(guestSessions)
          .set({ lastActiveAt: new Date() })
          .where(eq(guestSessions.id, sessionId));
      }

      return session;
    } catch (error) {
      console.error(`Error fetching guest session ${sessionId}:`, error);
      return undefined;
    }
  }

  async updateGuestSession(sessionId: string, data: Partial<Omit<GuestSession, 'id'>>): Promise<GuestSession | undefined> {
    try {
      const [session] = await db
        .update(guestSessions)
        .set({
          ...data,
          lastActiveAt: new Date()
        })
        .where(eq(guestSessions.id, sessionId))
        .returning();

      return session;
    } catch (error) {
      console.error(`Error updating guest session ${sessionId}:`, error);
      return undefined;
    }
  }

  async cleanupExpiredGuestSessions(): Promise<number> {
    try {
      const now = new Date();

      const result = await db
        .delete(guestSessions)
        .where(sql`${guestSessions.expiresAt} < ${now}`)
        .returning();

      return result.length;
    } catch (error) {
      console.error("Error cleaning up expired guest sessions:", error);
      return 0;
    }
  }

  // Parent/Guardian methods
  async getParentGuardian(id: number): Promise<ParentGuardian | undefined> {
    try {
      const [guardian] = await db
        .select()
        .from(parentGuardians)
        .where(eq(parentGuardians.id, id));

      return guardian;
    } catch (error) {
      console.error(`Error fetching parent/guardian ${id}:`, error);
      return undefined;
    }
  }

  async getParentGuardianByUserId(userId: string): Promise<ParentGuardian | undefined> {
    try {
      const [guardian] = await db
        .select()
        .from(parentGuardians)
        .where(eq(parentGuardians.userId, userId));

      return guardian;
    } catch (error) {
      console.error(`Error fetching parent/guardian for user ${userId}:`, error);
      return undefined;
    }
  }

  async getParentGuardianByEmail(email: string): Promise<ParentGuardian | undefined> {
    try {
      const [guardian] = await db
        .select()
        .from(parentGuardians)
        .where(eq(parentGuardians.email, email));

      return guardian;
    } catch (error) {
      console.error(`Error fetching parent/guardian with email ${email}:`, error);
      return undefined;
    }
  }

  async createParentGuardian(guardianData: InsertParentGuardian): Promise<ParentGuardian> {
    try {
      const [guardian] = await db
        .insert(parentGuardians)
        .values([guardianData])
        .returning();

      return guardian;
    } catch (error) {
      console.error(`Error creating parent/guardian:`, error);
      throw error;
    }
  }

  async updateParentGuardian(id: number, data: Partial<Omit<InsertParentGuardian, 'email'>>): Promise<ParentGuardian | undefined> {
    try {
      const [guardian] = await db
        .update(parentGuardians)
        .set({
          ...data,
          updatedAt: new Date()
        })
        .where(eq(parentGuardians.id, id))
        .returning();

      return guardian;
    } catch (error) {
      console.error(`Error updating parent/guardian ${id}:`, error);
      return undefined;
    }
  }

  // Mini-game performance methods
  async getMiniGamePerformance(userId: string, gameId?: string): Promise<MiniGamePerformance[]> {
    try {
      let query = db.select().from(miniGamePerformance).where(eq(miniGamePerformance.userId, userId));

      if (gameId) {
        query = query.where(eq(miniGamePerformance.gameId, gameId));
      }

      const results = await query.orderBy(desc(miniGamePerformance.createdAt));
      return results;
    } catch (error) {
      console.error(`Error fetching mini-game performance for user ${userId}:`, error);
      return [];
    }
  }

  async createMiniGamePerformance(performanceData: InsertMiniGamePerformance): Promise<MiniGamePerformance> {
    try {
      const [performance] = await db
        .insert(miniGamePerformance)
        .values(performanceData)
        .returning();

      return performance;
    } catch (error) {
      console.error(`Error creating mini-game performance:`, error);
      throw error;
    }
  }

  async updateMiniGamePerformance(id: number, data: Partial<Omit<InsertMiniGamePerformance, 'userId' | 'gameId'>>): Promise<MiniGamePerformance | undefined> {
    try {
      const [performance] = await db
        .update(miniGamePerformance)
        .set(data)
        .where(eq(miniGamePerformance.id, id))
        .returning();

      return performance;
    } catch (error) {
      console.error(`Error updating mini-game performance ${id}:`, error);
      return undefined;
    }
  }
}

// Create and export a singleton instance
export const storage = new DatabaseStorage();