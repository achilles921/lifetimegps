/**
 * Gamification Service
 * 
 * Manages the gamified learning progress tracking system, including
 * achievements, badges, quests, and progress tracking.
 */

import { eq, and, desc, sql } from "drizzle-orm";
import { db } from "../db";
import { 
  learningAchievements, userAchievements, 
  learningQuests, userQuestProgress,
  type LearningAchievement, type UserAchievement,
  type LearningQuest, type UserQuestProgress
} from './../shared/schema';
import { inArray, not, isNull, lte, gte} from 'drizzle-orm';
import { getCache, setCache } from './cacheService';

const ACHIEVEMENTS_CACHE_TTL = 7200; // 2 hours
const QUEST_CACHE_TTL = 3600; // 1 hour

interface AchievementProgress {
  achievement: LearningAchievement;
  userProgress: UserAchievement | null;
  progress: number; // 0-100
  isCompleted: boolean;
  completedAt: Date | null;
  isSecret: boolean;
  isRevealed: boolean; // Secret achievement that has been revealed
}

interface QuestProgress {
  quest: LearningQuest;
  userProgress: UserQuestProgress | null;
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'paused' | 'completed' | 'failed';
  currentStepId: string | null;
  completedSteps: string[];
  pointsEarned: number;
  startedAt: Date | null;
  completedAt: Date | null;
  isUnlocked: boolean;
}

interface UserGamificationProfile {
  userId: string;
  totalPoints: number;
  level: number;
  achievements: {
    total: number;
    completed: number;
    inProgress: number;
    secret: number;
  };
  quests: {
    total: number;
    completed: number;
    inProgress: number;
    available: number;
  };
  stats: {
    completionRate: number;
    averageDailyPoints: number;
    currentStreak: number;
    longestStreak: number;
    lastActivityDate: Date | null;
  };
}

/**
 * Gets all achievements with user progress information
 */
export async function getUserAchievements(userId: string): Promise<AchievementProgress[]> {
  const cacheKey = `user_achievements:${userId}`;
  const cachedAchievements = await getCache<AchievementProgress[]>(cacheKey);
  if (cachedAchievements) return cachedAchievements;

  try {
    // Get all active achievements
    const achievements = await db
      .select()
      .from(learningAchievements)
      .where(eq(learningAchievements.isActive, true));

    // Get user's progress on these achievements
    const userProgress = await db
      .select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        inArray(userAchievements.achievementId, achievements.map(a => a.id))
      ));

    // Create a map for quick lookup of user progress by achievement ID
    const progressMap = new Map<number, UserAchievement>();
    userProgress.forEach(progress => {
      progressMap.set(progress.achievementId, progress);
    });

    // Combine achievements with user progress
    const achievementsWithProgress: AchievementProgress[] = achievements.map(achievement => {
      const progress = progressMap.get(achievement.id);
      const isSecret = achievement.isSecret || false;
      const isRevealed = isSecret && !!progress; // Secret is revealed if user has made progress

      return {
        achievement,
        userProgress: progress || null,
        progress: progress?.progress || 0,
        isCompleted: progress?.isCompleted || false,
        completedAt: progress?.completedAt || null,
        isSecret,
        isRevealed
      };
    });

    // Filter out secret achievements that haven't been revealed
    const visibleAchievements = achievementsWithProgress.filter(a => !a.isSecret || a.isRevealed);

    // Cache the results
    await setCache(cacheKey, visibleAchievements, ACHIEVEMENTS_CACHE_TTL);

    return visibleAchievements;
  } catch (error) {
    console.error('Error getting user achievements:', error);
    return [];
  }
}

/**
 * Gets a user's quests with progress information
 */
export async function getUserQuests(userId: string, filterType?: string): Promise<QuestProgress[]> {
  const cacheKey = `user_quests:${userId}:${filterType || 'all'}`;
  const cachedQuests = await getCache<QuestProgress[]>(cacheKey);
  if (cachedQuests) return cachedQuests;

  try {
    // Get all active quests
    let questQuery = db
      .select()
      .from(learningQuests)
      .where(eq(learningQuests.isActive, true));

    // Apply filtering if specified
    if (filterType === 'available') {
      const now = new Date();
      questQuery = questQuery.where(
        and(
          or(isNull(learningQuests.startDate), lte(learningQuests.startDate, now)),
          or(isNull(learningQuests.endDate), gte(learningQuests.endDate, now))
        )
      );
    }

    const quests = await questQuery;

    // Get user's progress on these quests
    const userProgress = await db
      .select()
      .from(userQuestProgress)
      .where(and(
        eq(userQuestProgress.userId, userId),
        inArray(userQuestProgress.questId, quests.map(q => q.id))
      ));

    // Create a map for quick lookup of user progress by quest ID
    const progressMap = new Map<number, UserQuestProgress>();
    userProgress.forEach(progress => {
      progressMap.set(progress.questId, progress);
    });

    // Get user's completed achievements for unlocking quests
    const userCompletedAchievements = await db
      .select({ achievementId: userAchievements.achievementId })
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.isCompleted, true)
      ));

    const completedAchievementIds = new Set(userCompletedAchievements.map(a => a.achievementId));

    // Combine quests with user progress
    const questsWithProgress: QuestProgress[] = await Promise.all(quests.map(async quest => {
      const progress = progressMap.get(quest.id);
      
      // Check if quest is unlocked
      let isUnlocked = true;
      
      // Parse unlock requirements
      if (quest.unlockRequirements) {
        isUnlocked = await checkQuestUnlockRequirements(
          userId, 
          quest.unlockRequirements, 
          completedAchievementIds
        );
      }
      
      return {
        quest,
        userProgress: progress || null,
        progress: progress ? calculateQuestProgress(quest, progress) : 0,
        status: progress?.status || 'not_started',
        currentStepId: progress?.currentStepId || null,
        completedSteps: (progress?.completedSteps as string[]) || [],
        pointsEarned: progress?.pointsEarned || 0,
        startedAt: progress?.startedAt || null,
        completedAt: progress?.completedAt || null,
        isUnlocked
      };
    }));

    // Apply additional filtering based on status if specified
    let filteredQuests = questsWithProgress;
    
    if (filterType === 'in_progress') {
      filteredQuests = questsWithProgress.filter(q => q.status === 'in_progress');
    } else if (filterType === 'completed') {
      filteredQuests = questsWithProgress.filter(q => q.status === 'completed');
    } else if (filterType === 'available') {
      filteredQuests = questsWithProgress.filter(q => q.isUnlocked && q.status !== 'completed');
    }

    // Sort quests: in-progress first, then available, then completed
    filteredQuests.sort((a, b) => {
      if (a.status === 'in_progress' && b.status !== 'in_progress') return -1;
      if (a.status !== 'in_progress' && b.status === 'in_progress') return 1;
      if (a.isUnlocked && !b.isUnlocked) return -1;
      if (!a.isUnlocked && b.isUnlocked) return 1;
      if (a.status === 'completed' && b.status !== 'completed') return 1;
      if (a.status !== 'completed' && b.status === 'completed') return -1;
      return 0;
    });

    // Cache the results
    await setCache(cacheKey, filteredQuests, QUEST_CACHE_TTL);

    return filteredQuests;
  } catch (error) {
    console.error('Error getting user quests:', error);
    return [];
  }
}

/**
 * Checks if a quest's unlock requirements are met
 */
async function checkQuestUnlockRequirements(
  userId: string,
  unlockRequirements: any,
  completedAchievementIds: Set<number>
): Promise<boolean> {
  // Parse unlock requirements
  if (!unlockRequirements) return true;
  
  try {
    // Check achievement requirements
    if (unlockRequirements.achievements) {
      const requiredAchievements = unlockRequirements.achievements as number[];
      // Check if all required achievements are completed
      if (!requiredAchievements.every(id => completedAchievementIds.has(id))) {
        return false;
      }
    }
    
    // Check prerequisite quests
    if (unlockRequirements.quests) {
      const requiredQuests = unlockRequirements.quests as number[];
      
      // Get completed quests
      const completedQuests = await db
        .select({ questId: userQuestProgress.questId })
        .from(userQuestProgress)
        .where(and(
          eq(userQuestProgress.userId, userId),
          eq(userQuestProgress.status, 'completed'),
          inArray(userQuestProgress.questId, requiredQuests)
        ));
      
      const completedQuestIds = new Set(completedQuests.map(q => q.questId));
      
      // Check if all required quests are completed
      if (!requiredQuests.every(id => completedQuestIds.has(id))) {
        return false;
      }
    }
    
    // Check level requirement
    if (unlockRequirements.level) {
      const requiredLevel = unlockRequirements.level as number;
      const userLevel = await calculateUserLevel(userId);
      
      if (userLevel < requiredLevel) {
        return false;
      }
    }
    
    return true;
  } catch (error) {
    console.error('Error checking quest unlock requirements:', error);
    return false;
  }
}

/**
 * Calculates the progress percentage for a quest
 */
function calculateQuestProgress(quest: LearningQuest, progress: UserQuestProgress): number {
  if (progress.status === 'completed') return 100;
  if (progress.status === 'not_started') return 0;
  
  try {
    const steps = quest.steps as any[];
    if (!steps || !Array.isArray(steps)) return 0;
    
    const completedSteps = progress.completedSteps as string[] || [];
    if (!completedSteps.length) return 0;
    
    return Math.round((completedSteps.length / steps.length) * 100);
  } catch (error) {
    console.error('Error calculating quest progress:', error);
    return 0;
  }
}

/**
 * Gets a user's gamification profile with summary statistics
 */
export async function getUserGamificationProfile(userId: string): Promise<UserGamificationProfile> {
  const cacheKey = `user_gamification_profile:${userId}`;
  const cachedProfile = await getCache<UserGamificationProfile>(cacheKey);
  if (cachedProfile) return cachedProfile;

  try {
    // Get all achievement and quest data
    const achievements = await getUserAchievements(userId);
    const quests = await getUserQuests(userId);
    
    // Calculate total points from completed achievements and quests
    const achievementPoints = achievements
      .filter(a => a.isCompleted)
      .reduce((sum, a) => sum + (a.achievement.points || 0), 0);
    
    const questPoints = quests
      .reduce((sum, q) => sum + (q.pointsEarned || 0), 0);
    
    const totalPoints = achievementPoints + questPoints;
    
    // Calculate achievement stats
    const completedAchievements = achievements.filter(a => a.isCompleted);
    const inProgressAchievements = achievements.filter(a => !a.isCompleted && a.progress > 0);
    const secretAchievements = achievements.filter(a => a.isSecret);
    
    // Calculate quest stats
    const completedQuests = quests.filter(q => q.status === 'completed');
    const inProgressQuests = quests.filter(q => q.status === 'in_progress');
    const availableQuests = quests.filter(q => q.isUnlocked && q.status !== 'completed' && q.status !== 'in_progress');
    
    // Calculate user level
    const level = calculateLevelFromPoints(totalPoints);
    
    // Calculate streak and activity stats
    const streakData = await calculateUserStreak(userId);
    
    // Build the profile
    const profile: UserGamificationProfile = {
      userId,
      totalPoints,
      level,
      achievements: {
        total: achievements.length,
        completed: completedAchievements.length,
        inProgress: inProgressAchievements.length,
        secret: secretAchievements.length,
      },
      quests: {
        total: quests.length,
        completed: completedQuests.length,
        inProgress: inProgressQuests.length,
        available: availableQuests.length,
      },
      stats: {
        completionRate: calculateCompletionRate(achievements, quests),
        averageDailyPoints: streakData.averageDailyPoints,
        currentStreak: streakData.currentStreak,
        longestStreak: streakData.longestStreak,
        lastActivityDate: streakData.lastActivityDate,
      }
    };
    
    // Cache the profile
    await setCache(cacheKey, profile, 3600); // 1 hour cache
    
    return profile;
  } catch (error) {
    console.error('Error getting user gamification profile:', error);
    return {
      userId,
      totalPoints: 0,
      level: 1,
      achievements: { total: 0, completed: 0, inProgress: 0, secret: 0 },
      quests: { total: 0, completed: 0, inProgress: 0, available: 0 },
      stats: { 
        completionRate: 0, 
        averageDailyPoints: 0, 
        currentStreak: 0, 
        longestStreak: 0,
        lastActivityDate: null 
      }
    };
  }
}

/**
 * Calculate level based on total points
 */
export function calculateLevelFromPoints(points: number): number {
  // Simple logarithmic scale: level = 1 + ln(points/100 + 1)
  if (points <= 0) return 1;
  
  // Level up formula (adjust as needed)
  // This gives level 1 at 0 points, level 2 around 100 points,
  // level 3 around 300 points, with diminishing returns
  const level = Math.floor(1 + Math.log(points/100 + 1));
  return Math.max(1, level);
}

/**
 * Calculate user level
 */
export async function calculateUserLevel(userId: string): Promise<number> {
  try {
    const profile = await getUserGamificationProfile(userId);
    return profile.level;
  } catch (error) {
    console.error('Error calculating user level:', error);
    return 1;
  }
}

/**
 * Calculate user streak and activity stats
 */
async function calculateUserStreak(userId: string): Promise<{
  currentStreak: number;
  longestStreak: number;
  averageDailyPoints: number;
  lastActivityDate: Date | null;
}> {
  try {
    // Get user achievement completions
    const achievementCompletions = await db
      .select({ completedAt: userAchievements.completedAt })
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.isCompleted, true),
        not(isNull(userAchievements.completedAt))
      ))
      .orderBy(desc(userAchievements.completedAt));
    
    // Get user quest progress updates
    const questUpdates = await db
      .select({ updatedAt: userQuestProgress.updatedAt })
      .from(userQuestProgress)
      .where(eq(userQuestProgress.userId, userId))
      .orderBy(desc(userQuestProgress.updatedAt));
    
    // Combine all activity dates
    const allDates = [
      ...achievementCompletions.map(a => a.completedAt),
      ...questUpdates.map(q => q.updatedAt)
    ].filter(Boolean).sort((a, b) => b.getTime() - a.getTime());
    
    if (!allDates.length) {
      return {
        currentStreak: 0,
        longestStreak: 0,
        averageDailyPoints: 0,
        lastActivityDate: null
      };
    }
    
    // Get the most recent activity date
    const lastActivityDate = allDates[0];
    
    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let currentStreatActive = true;
    
    // Group activities by day
    const activityByDay = new Map<string, Date[]>();
    for (const date of allDates) {
      const dateKey = date.toISOString().split('T')[0];
      if (!activityByDay.has(dateKey)) {
        activityByDay.set(dateKey, []);
      }
      activityByDay.get(dateKey)!.push(date);
    }
    
    // Sort days
    const sortedDays = Array.from(activityByDay.keys()).sort().reverse();
    
    // Calculate streaks
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    
    // Check if user was active today or yesterday
    currentStreatActive = sortedDays[0] === today || sortedDays[0] === yesterday;
    
    let streakCount = currentStreatActive ? 1 : 0;
    
    for (let i = 0; i < sortedDays.length - 1; i++) {
      const currentDate = new Date(sortedDays[i]);
      const nextDate = new Date(sortedDays[i + 1]);
      
      // Check if dates are consecutive
      const dayDiff = Math.floor((currentDate.getTime() - nextDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dayDiff === 1) {
        // Consecutive days
        streakCount++;
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, streakCount);
        streakCount = 1;
        
        // If we've passed the current streak calculation, no need to continue
        if (i === 0) {
          currentStreatActive = false;
        }
      }
    }
    
    // Update the longest streak after the loop
    longestStreak = Math.max(longestStreak, streakCount);
    
    // Set current streak
    currentStreak = currentStreatActive ? streakCount : 0;
    
    // Calculate average daily points
    // In a full implementation, this would look at actual point awards over time
    const totalDays = activityByDay.size;
    const profile = await getUserGamificationProfile(userId);
    const averageDailyPoints = totalDays > 0 ? Math.round(profile.totalPoints / totalDays) : 0;
    
    return {
      currentStreak,
      longestStreak,
      averageDailyPoints,
      lastActivityDate
    };
  } catch (error) {
    console.error('Error calculating user streak:', error);
    return {
      currentStreak: 0,
      longestStreak: 0,
      averageDailyPoints: 0,
      lastActivityDate: null
    };
  }
}

/**
 * Calculate completion rate for achievements and quests
 */
function calculateCompletionRate(
  achievements: AchievementProgress[],
  quests: QuestProgress[]
): number {
  const totalItems = achievements.length + quests.length;
  if (totalItems === 0) return 0;
  
  const completedAchievements = achievements.filter(a => a.isCompleted).length;
  const completedQuests = quests.filter(q => q.status === 'completed').length;
  
  return Math.round(((completedAchievements + completedQuests) / totalItems) * 100);
}

/**
 * Updates a user's quest progress
 */
export async function updateQuestProgress(
  userId: string,
  questId: number,
  update: {
    status?: 'in_progress' | 'paused' | 'completed' | 'failed';
    currentStepId?: string;
    completedSteps?: string[];
    pointsEarned?: number;
    evidence?: any;
    notes?: string;
  }
): Promise<QuestProgress> {
  try {
    // Get the quest
    const [quest] = await db
      .select()
      .from(learningQuests)
      .where(eq(learningQuests.id, questId))
      .limit(1);
    
    if (!quest) {
      throw new Error(`Quest ${questId} not found`);
    }
    
    // Get existing progress
    const [existingProgress] = await db
      .select()
      .from(userQuestProgress)
      .where(and(
        eq(userQuestProgress.userId, userId),
        eq(userQuestProgress.questId, questId)
      ))
      .limit(1);
    
    const now = new Date();
    
    if (existingProgress) {
      // Update existing progress
      let updatedValues: any = {
        ...update,
        lastActivityAt: now,
        updatedAt: now
      };
      
      // Set completed date if status is changing to completed
      if (update.status === 'completed' && existingProgress.status !== 'completed') {
        updatedValues.completedAt = now;
        
        // Award achievement rewards if applicable
        if (quest.rewardAchievementIds) {
          await awardQuestAchievements(userId, quest);
        }
      }
      
      // Set started date if status is changing to in_progress and no start date exists
      if (update.status === 'in_progress' && !existingProgress.startedAt) {
        updatedValues.startedAt = now;
      }
      
      const [updatedProgress] = await db
        .update(userQuestProgress)
        .set(updatedValues)
        .where(and(
          eq(userQuestProgress.userId, userId),
          eq(userQuestProgress.questId, questId)
        ))
        .returning();
      
      // Invalidate relevant caches
      await invalidateUserQuestCache(userId);
      
      return {
        quest,
        userProgress: updatedProgress,
        progress: calculateQuestProgress(quest, updatedProgress),
        status: updatedProgress.status,
        currentStepId: updatedProgress.currentStepId,
        completedSteps: updatedProgress.completedSteps as string[] || [],
        pointsEarned: updatedProgress.pointsEarned || 0,
        startedAt: updatedProgress.startedAt,
        completedAt: updatedProgress.completedAt,
        isUnlocked: true // We know it's unlocked if the user is updating it
      };
    } else {
      // Create new progress
      let newValues: any = {
        userId,
        questId,
        status: update.status || 'in_progress',
        currentStepId: update.currentStepId,
        completedSteps: update.completedSteps || [],
        pointsEarned: update.pointsEarned || 0,
        evidence: update.evidence,
        notes: update.notes,
        lastActivityAt: now
      };
      
      // Set started date if status is in_progress
      if (newValues.status === 'in_progress') {
        newValues.startedAt = now;
      }
      
      // Set completed date if status is completed
      if (newValues.status === 'completed') {
        newValues.completedAt = now;
        
        // Award achievement rewards if applicable
        if (quest.rewardAchievementIds) {
          await awardQuestAchievements(userId, quest);
        }
      }
      
      const [newProgress] = await db
        .insert(userQuestProgress)
        .values(newValues)
        .returning();
      
      // Invalidate relevant caches
      await invalidateUserQuestCache(userId);
      
      return {
        quest,
        userProgress: newProgress,
        progress: calculateQuestProgress(quest, newProgress),
        status: newProgress.status,
        currentStepId: newProgress.currentStepId,
        completedSteps: newProgress.completedSteps as string[] || [],
        pointsEarned: newProgress.pointsEarned || 0,
        startedAt: newProgress.startedAt,
        completedAt: newProgress.completedAt,
        isUnlocked: true // We know it's unlocked if the user is creating progress
      };
    }
  } catch (error) {
    console.error('Error updating quest progress:', error);
    throw error;
  }
}

/**
 * Award achievements for completing a quest
 */
async function awardQuestAchievements(userId: string, quest: LearningQuest): Promise<void> {
  try {
    if (!quest.rewardAchievementIds) return;
    
    const rewardIds = quest.rewardAchievementIds as number[];
    if (!rewardIds.length) return;
    
    for (const achievementId of rewardIds) {
      await updateAchievementProgress(userId, achievementId, { 
        progress: 100,
        isCompleted: true 
      });
    }
  } catch (error) {
    console.error('Error awarding quest achievements:', error);
  }
}

/**
 * Updates a user's achievement progress
 */
export async function updateAchievementProgress(
  userId: string,
  achievementId: number,
  update: {
    progress?: number;
    isCompleted?: boolean;
    currentStreak?: number;
    highestStreak?: number;
  }
): Promise<AchievementProgress> {
  try {
    // Get the achievement
    const [achievement] = await db
      .select()
      .from(learningAchievements)
      .where(eq(learningAchievements.id, achievementId))
      .limit(1);
    
    if (!achievement) {
      throw new Error(`Achievement ${achievementId} not found`);
    }
    
    // Get existing progress
    const [existingProgress] = await db
      .select()
      .from(userAchievements)
      .where(and(
        eq(userAchievements.userId, userId),
        eq(userAchievements.achievementId, achievementId)
      ))
      .limit(1);
    
    const now = new Date();
    
    if (existingProgress) {
      // Update existing progress
      let updatedValues: any = {
        ...update,
        updatedAt: now
      };
      
      // Set completed date if status is changing to completed
      if (update.isCompleted === true && !existingProgress.isCompleted) {
        updatedValues.completedAt = now;
      }
      
      const [updatedProgress] = await db
        .update(userAchievements)
        .set(updatedValues)
        .where(and(
          eq(userAchievements.userId, userId),
          eq(userAchievements.achievementId, achievementId)
        ))
        .returning();
      
      // Invalidate relevant caches
      await invalidateUserAchievementCache(userId);
      
      return {
        achievement,
        userProgress: updatedProgress,
        progress: updatedProgress.progress,
        isCompleted: updatedProgress.isCompleted,
        completedAt: updatedProgress.completedAt,
        isSecret: achievement.isSecret || false,
        isRevealed: true // It's revealed if we're updating it
      };
    } else {
      // Create new progress
      let newValues: any = {
        userId,
        achievementId,
        progress: update.progress || 0,
        isCompleted: update.isCompleted || false,
        currentStreak: update.currentStreak || 0,
        highestStreak: update.highestStreak || 0
      };
      
      // Set completed date if creating as completed
      if (newValues.isCompleted) {
        newValues.completedAt = now;
      }
      
      const [newProgress] = await db
        .insert(userAchievements)
        .values(newValues)
        .returning();
      
      // Invalidate relevant caches
      await invalidateUserAchievementCache(userId);
      
      return {
        achievement,
        userProgress: newProgress,
        progress: newProgress.progress,
        isCompleted: newProgress.isCompleted,
        completedAt: newProgress.completedAt,
        isSecret: achievement.isSecret || false,
        isRevealed: true // It's revealed if we're creating progress
      };
    }
  } catch (error) {
    console.error('Error updating achievement progress:', error);
    throw error;
  }
}

/**
 * Invalidates achievement caches for a user
 */
async function invalidateUserAchievementCache(userId: string): Promise<void> {
  try {
    // Invalidate achievement list
    await setCache(`user_achievements:${userId}`, null, 0);
    
    // Invalidate gamification profile
    await setCache(`user_gamification_profile:${userId}`, null, 0);
  } catch (error) {
    console.error('Error invalidating user achievement cache:', error);
  }
}

/**
 * Invalidates quest caches for a user
 */
async function invalidateUserQuestCache(userId: string): Promise<void> {
  try {
    // Invalidate quest lists
    await setCache(`user_quests:${userId}:all`, null, 0);
    await setCache(`user_quests:${userId}:in_progress`, null, 0);
    await setCache(`user_quests:${userId}:completed`, null, 0);
    await setCache(`user_quests:${userId}:available`, null, 0);
    
    // Invalidate gamification profile
    await setCache(`user_gamification_profile:${userId}`, null, 0);
  } catch (error) {
    console.error('Error invalidating user quest cache:', error);
  }
}

/**
 * Helper function for combining ORs in Drizzle ORM
 */
function or(...conditions: any[]): any {
  return sql`(${conditions.map(c => sql`(${c})`).join(' OR ')})`;
}