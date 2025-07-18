/**
 * Serendipity Engine Service
 * 
 * This service powers the opportunity discovery engine that matches users
 * with unexpected but relevant opportunities based on their profile data.
 */

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { storage } from '../storage';
import { 
  serendipityOpportunities, opportunityCategories, 
  userOpportunityInteractions, type SerendipityOpportunity 
} from './../shared/schema';
import { getCache, setCache } from './cacheService';

const OPPORTUNITY_CACHE_TTL = 3600; // 1 hour

interface UserProfileSnapshot {
  interests: string[];
  skills: string[];
  careerPaths: string[];
  learningStyle: Record<string, number>;
  location?: string;
  ageGroup?: string;
  availableTimeFrames?: string[];
  constraints?: string[];
}

interface DiscoveryOptions {
  maxResults?: number;
  includeCategories?: string[];
  excludeCategories?: string[];
  includeTypes?: ('api' | 'partner' | 'system' | 'community' | 'recommendation')[];
  includeVirtual?: boolean;
  includeInPerson?: boolean;
  maxCost?: number;
  minNoveltyScore?: number;
  maxTimeCommitment?: string;
}

/**
 * Generates a user profile snapshot for opportunity matching
 */
export async function generateUserProfileSnapshot(userId: string): Promise<UserProfileSnapshot> {
  // Get cached snapshot if available
  const cacheKey = `user_profile_snapshot:${userId}`;
  const cachedSnapshot = await getCache<UserProfileSnapshot>(cacheKey);
  if (cachedSnapshot) return cachedSnapshot;

  // Get user data from various tables
  const user = await storage.getUser(userId);
  if (!user) throw new Error(`User ${userId} not found`);

  const quizResponses = await storage.getQuizResponses(userId);
  const careerRoadmap = await storage.getCareerRoadmap(userId);
  const learningPrefs = await storage.getUserPreferences(userId);

  // Build a comprehensive snapshot of user preferences and traits
  const snapshot: UserProfileSnapshot = {
    interests: [],
    skills: [],
    careerPaths: [],
    learningStyle: {},
    location: user.city ? `${user.city}, ${user.state}` : undefined,
    ageGroup: user.dateOfBirth ? calculateAgeGroup(user.dateOfBirth) : undefined,
  };

  // Extract interests from quiz responses
  if (quizResponses?.interestSelections) {
    try {
      const selections = quizResponses.interestSelections as any;
      snapshot.interests = Object.keys(selections)
        .filter(key => selections[key] > 50) // Only high interest areas
        .map(key => key.toLowerCase());
    } catch (error) {
      console.error('Error parsing interest selections:', error);
    }
  }

  // Extract career paths
  if (quizResponses?.careerMatches) {
    try {
      const matches = quizResponses.careerMatches as any;
      if (Array.isArray(matches)) {
        snapshot.careerPaths = matches
          .slice(0, 5) // Top 5 matches
          .map(match => match.career?.toLowerCase() || match.name?.toLowerCase())
          .filter(Boolean);
      }
    } catch (error) {
      console.error('Error parsing career matches:', error);
    }
  }

  // Add the specific career roadmap if it exists
  if (careerRoadmap?.careerPath) {
    snapshot.careerPaths.unshift(careerRoadmap.careerPath.toLowerCase());
  }

  // Extract learning style preferences if available
  if (learningPrefs) {
    try {
      // Placeholder - the actual implementation would use the learning preferences data
      snapshot.learningStyle = {
        visual: 50,
        auditory: 50,
        kinesthetic: 50,
        reading: 50
      };
    } catch (error) {
      console.error('Error parsing learning preferences:', error);
    }
  }

  // Cache the snapshot
  await setCache(cacheKey, snapshot, 86400); // Cache for 24 hours
  return snapshot;
}

/**
 * Calculate age group based on date of birth
 */
function calculateAgeGroup(dob: Date): string {
  const age = calculateAge(dob);
  
  if (age < 13) return 'pre-teen';
  if (age >= 13 && age <= 17) return 'teen';
  if (age >= 18 && age <= 24) return 'young-adult';
  if (age >= 25 && age <= 34) return 'adult';
  if (age >= 35 && age <= 49) return 'mid-career';
  return 'experienced';
}

function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  
  return age;
}

/**
 * Discovers opportunities that might interest the user based on their profile
 */
export async function discoverOpportunities(
  userId: string,
  options: DiscoveryOptions = {}
): Promise<SerendipityOpportunity[]> {
  const cacheKey = `user_opportunities:${userId}:${JSON.stringify(options)}`;
  const cachedOpportunities = await getCache<SerendipityOpportunity[]>(cacheKey);
  if (cachedOpportunities) return cachedOpportunities;

  try {
    // Get user profile snapshot
    const userProfile = await generateUserProfileSnapshot(userId);
    
    // Get previously interacted opportunities to exclude
    const previousInteractions = await db
      .select({ opportunityId: userOpportunityInteractions.opportunityId })
      .from(userOpportunityInteractions)
      .where(eq(userOpportunityInteractions.userId, userId));
    
    const previousOpportunityIds = previousInteractions.map(i => i.opportunityId);
    
    // Build query conditions
    let query = db
      .select()
      .from(serendipityOpportunities)
      .where(eq(serendipityOpportunities.isActive, true));
    
    // Exclude previously interacted opportunities
    if (previousOpportunityIds.length > 0) {
      query = query.where(sql`${serendipityOpportunities.id} NOT IN (${previousOpportunityIds.join(',')})`);
    }
    
    // Filter by categories if specified
    if (options.includeCategories && options.includeCategories.length > 0) {
      const categoryIds = await getCategoryIdsByNames(options.includeCategories);
      if (categoryIds.length > 0) {
        query = query.where(inArray(serendipityOpportunities.categoryId, categoryIds));
      }
    }
    
    // Filter by source types if specified
    if (options.includeTypes && options.includeTypes.length > 0) {
      query = query.where(inArray(serendipityOpportunities.sourceType, options.includeTypes));
    }
    
    // Filter by virtualness
    if (options.includeVirtual === true && options.includeInPerson === false) {
      query = query.where(eq(serendipityOpportunities.isVirtual, true));
    } else if (options.includeVirtual === false && options.includeInPerson === true) {
      query = query.where(eq(serendipityOpportunities.isVirtual, false));
    }
    
    // Filter by cost if specified
    if (typeof options.maxCost === 'number') {
      query = query.where(
        and(
          eq(serendipityOpportunities.costType, 'paid'),
          lte(serendipityOpportunities.cost, options.maxCost)
        )
      );
    }
    
    // Execute query and get results
    let opportunities = await query.limit(options.maxResults || 20);
    
    // Apply additional ranking and filtering
    opportunities = rankOpportunitiesByRelevance(opportunities, userProfile, options);
    
    // Cache the results
    await setCache(cacheKey, opportunities, OPPORTUNITY_CACHE_TTL);
    
    return opportunities;
  } catch (error) {
    console.error('Error discovering opportunities:', error);
    return [];
  }
}

/**
 * Get category IDs by their names
 */
async function getCategoryIdsByNames(categoryNames: string[]): Promise<number[]> {
  const categories = await db
    .select({ id: opportunityCategories.id })
    .from(opportunityCategories)
    .where(
      inArray(
        opportunityCategories.name, 
        categoryNames.map(name => name.trim())
      )
    );
  
  return categories.map(c => c.id);
}

/**
 * Ranks opportunities based on relevance to user profile
 */
function rankOpportunitiesByRelevance(
  opportunities: SerendipityOpportunity[],
  userProfile: UserProfileSnapshot,
  options: DiscoveryOptions
): SerendipityOpportunity[] {
  // Score each opportunity
  const scoredOpportunities = opportunities.map(opportunity => {
    let score = 0;
    
    // Calculate interest match
    const interestMatch = calculateInterestMatch(opportunity, userProfile.interests);
    score += interestMatch * 0.3; // 30% weight for interest match
    
    // Calculate career relevance
    const careerRelevance = calculateCareerRelevance(opportunity, userProfile.careerPaths);
    score += careerRelevance * 0.2; // 20% weight for career relevance
    
    // Calculate novelty score (how unexpected/serendipitous)
    const noveltyScore = calculateNoveltyScore(opportunity);
    score += noveltyScore * 0.3; // 30% weight for novelty/serendipity
    
    // Calculate accessibility match
    const accessibilityMatch = calculateAccessibilityMatch(opportunity, userProfile);
    score += accessibilityMatch * 0.2; // 20% weight for accessibility
    
    // Apply minimum novelty threshold if specified
    if (options.minNoveltyScore && noveltyScore < options.minNoveltyScore) {
      score = 0; // Disqualify if not novel enough
    }
    
    return {
      opportunity,
      score,
      components: {
        interestMatch,
        careerRelevance,
        noveltyScore,
        accessibilityMatch
      }
    };
  });
  
  // Filter out opportunities with zero score
  const validOpportunities = scoredOpportunities.filter(item => item.score > 0);
  
  // Sort by score descending
  const sortedOpportunities = validOpportunities
    .sort((a, b) => b.score - a.score)
    .map(item => ({
      ...item.opportunity,
      relevanceFactors: {
        interestMatch: Math.round(item.components.interestMatch),
        careerRelevance: Math.round(item.components.careerRelevance),
        skillGap: 0, // Placeholder
        novelty: Math.round(item.components.noveltyScore),
        accessibilityMatch: Math.round(item.components.accessibilityMatch)
      }
    }));
  
  return sortedOpportunities.slice(0, options.maxResults || 10);
}

/**
 * Calculates how well the opportunity matches user interests
 */
function calculateInterestMatch(
  opportunity: SerendipityOpportunity, 
  userInterests: string[]
): number {
  if (!userInterests.length) return 50; // Neutral score if no user interests
  
  let matchCount = 0;
  const opportunityTags = opportunity.tags as string[] || [];
  const opportunityText = [
    opportunity.title,
    opportunity.description,
    ...(opportunityTags || [])
  ].join(' ').toLowerCase();
  
  // Count matches between user interests and opportunity text
  userInterests.forEach(interest => {
    if (opportunityText.includes(interest.toLowerCase())) {
      matchCount++;
    }
  });
  
  const matchRatio = userInterests.length > 0 ? 
    matchCount / userInterests.length : 0;
  
  return Math.min(100, matchRatio * 100);
}

/**
 * Calculates how relevant the opportunity is to user's career paths
 */
function calculateCareerRelevance(
  opportunity: SerendipityOpportunity, 
  careerPaths: string[]
): number {
  if (!careerPaths.length) return 50; // Neutral score if no career paths
  
  const opportunityTags = opportunity.tags as string[] || [];
  const opportunityText = [
    opportunity.title,
    opportunity.description,
    ...(opportunityTags || [])
  ].join(' ').toLowerCase();
  
  let relevanceScore = 0;
  
  careerPaths.forEach((career, index) => {
    // Give more weight to primary career path
    const weight = 1 - (index * 0.2);
    if (opportunityText.includes(career.toLowerCase())) {
      relevanceScore += 25 * weight;
    }
  });
  
  return Math.min(100, relevanceScore);
}

/**
 * Calculates how unexpected/serendipitous the opportunity is
 */
function calculateNoveltyScore(opportunity: SerendipityOpportunity): number {
  // Use the pre-calculated novelty score if available
  if (opportunity.relevanceFactors && typeof opportunity.relevanceFactors === 'object') {
    const factors = opportunity.relevanceFactors as any;
    if (typeof factors.novelty === 'number') {
      return factors.novelty;
    }
  }
  
  // Otherwise calculate a basic score
  // This is just a placeholder - a real implementation would use more factors
  let score = 50; // Start with a neutral score
  
  // Increase novelty for certain source types
  if (opportunity.sourceType === 'community') score += 15;
  if (opportunity.sourceType === 'partner') score += 10;
  
  // Adjust based on tags
  const opportunityTags = opportunity.tags as string[] || [];
  if (opportunityTags.includes('emerging') || 
      opportunityTags.includes('innovative') ||
      opportunityTags.includes('cutting-edge')) {
    score += 20;
  }
  
  return Math.min(100, score);
}

/**
 * Calculates how accessible the opportunity is based on user constraints
 */
function calculateAccessibilityMatch(
  opportunity: SerendipityOpportunity, 
  userProfile: UserProfileSnapshot
): number {
  let score = 70; // Start with a decent score
  
  // Location matching
  if (userProfile.location && opportunity.location) {
    if (opportunity.location.includes(userProfile.location)) {
      score += 20;
    } else if (!opportunity.isVirtual) {
      score -= 30; // Penalize non-virtual opportunities in different locations
    }
  } else if (opportunity.isVirtual) {
    score += 10; // Virtual opportunities are more accessible
  }
  
  // Cost accessibility
  if (opportunity.costType === 'free') {
    score += 15;
  } else if (opportunity.costType === 'scholarship-eligible') {
    score += 5;
  }
  
  return Math.min(100, Math.max(0, score));
}

/**
 * Records a user's interaction with an opportunity
 */
export async function recordOpportunityInteraction(
  userId: string,
  opportunityId: number,
  interactionType: 'viewed' | 'saved' | 'applied' | 'participated' | 'completed' | 'dismissed',
  feedback?: { rating?: number, text?: string }
): Promise<void> {
  try {
    // Check if this interaction already exists
    const existingInteraction = await db
      .select()
      .from(userOpportunityInteractions)
      .where(and(
        eq(userOpportunityInteractions.userId, userId),
        eq(userOpportunityInteractions.opportunityId, opportunityId)
      ))
      .limit(1);
    
    const now = new Date();
    
    if (existingInteraction.length > 0) {
      // Update existing interaction
      await db
        .update(userOpportunityInteractions)
        .set({
          interactionType,
          interactionDate: now,
          userFeedback: feedback?.rating as any,
          feedbackText: feedback?.text,
          updatedAt: now
        })
        .where(and(
          eq(userOpportunityInteractions.userId, userId),
          eq(userOpportunityInteractions.opportunityId, opportunityId)
        ));
    } else {
      // Create new interaction
      await db
        .insert(userOpportunityInteractions)
        .values({
          userId,
          opportunityId,
          interactionType,
          interactionDate: now,
          discoveryDate: now,
          userFeedback: feedback?.rating as any,
          feedbackText: feedback?.text
        });
    }
    
    // Invalidate relevant caches
    await invalidateUserOpportunityCache(userId);
  } catch (error) {
    console.error('Error recording opportunity interaction:', error);
    throw error;
  }
}

/**
 * Invalidates opportunity discovery caches for a user
 */
async function invalidateUserOpportunityCache(userId: string): Promise<void> {
  try {
    // Invalidate profile snapshot
    await setCache(`user_profile_snapshot:${userId}`, null, 0);
    
    // The full implementation would use a more sophisticated cache invalidation
    // strategy, like using a pattern to match all user opportunity caches
  } catch (error) {
    console.error('Error invalidating user opportunity cache:', error);
  }
}

/**
 * Gets a user's opportunity interaction history
 */
export async function getUserOpportunityHistory(
  userId: string,
  types?: string[],
  limit: number = 50
): Promise<any[]> {
  try {
    // Build query with join to get opportunity details
    let query = db
      .select({
        interaction: userOpportunityInteractions,
        opportunity: serendipityOpportunities
      })
      .from(userOpportunityInteractions)
      .innerJoin(
        serendipityOpportunities,
        eq(userOpportunityInteractions.opportunityId, serendipityOpportunities.id)
      )
      .where(eq(userOpportunityInteractions.userId, userId))
      .orderBy(desc(userOpportunityInteractions.interactionDate));
    
    // Filter by interaction types if specified
    if (types && types.length > 0) {
      query = query.where(inArray(userOpportunityInteractions.interactionType, types as any));
    }
    
    const results = await query.limit(limit);
    
    // Format results
    return results.map(result => ({
      id: result.interaction.id,
      opportunityId: result.opportunity.id,
      title: result.opportunity.title,
      category: result.opportunity.categoryId,
      interactionType: result.interaction.interactionType,
      interactionDate: result.interaction.interactionDate,
      discoveryDate: result.interaction.discoveryDate,
      feedback: result.interaction.userFeedback,
      comment: result.interaction.feedbackText,
      hasReminder: result.interaction.reminderSet,
      reminderDate: result.interaction.reminderDate,
      opportunity: {
        id: result.opportunity.id,
        title: result.opportunity.title,
        description: result.opportunity.description,
        imageUrl: result.opportunity.imageUrl,
        startDate: result.opportunity.startDate,
        endDate: result.opportunity.endDate,
        location: result.opportunity.location,
        isVirtual: result.opportunity.isVirtual,
        externalUrl: result.opportunity.externalUrl
      }
    }));
  } catch (error) {
    console.error('Error getting user opportunity history:', error);
    return [];
  }
}