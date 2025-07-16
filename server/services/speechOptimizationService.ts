/**
 * Speech Optimization Service
 * 
 * This service provides cost optimization strategies for text-to-speech usage:
 * 
 * - Token counting and rate limiting
 * - Text preprocessing to reduce token usage
 * - Smart caching of common phrases
 * - Usage tracking and analytics
 * - Adaptive quality settings based on usage patterns
 */

import { initializeCache, getCache, setCache } from './optimizedCacheService';

// Cache for frequently used speech phrases (1 day TTL)
const PHRASE_CACHE_TTL = 24 * 60 * 60 * 1000;

// Initialize caches
initializeCache('speech-tokens', PHRASE_CACHE_TTL);
initializeCache('speech-phrases', PHRASE_CACHE_TTL);
initializeCache('speech-settings', PHRASE_CACHE_TTL);

// Usage tiers with different quality settings
enum UsageTier {
  FREE = 'free',        // Basic quality, limited usage
  STANDARD = 'standard', // Standard quality, moderate usage
  PREMIUM = 'premium'   // High quality, extensive usage
}

// User-specific settings
interface UserSpeechSettings {
  tier: UsageTier;
  monthlyTokensUsed: number;
  monthlyTokenLimit: number;
  lastResetDate: Date;
  preferredVoiceId?: string;
  preferredModel?: string;
  customSettings?: Record<string, any>;
}

// Default settings by tier
const tierDefaults: Record<UsageTier, {
  model: string;
  stability: number;
  similarityBoost: number;
  tokenLimit: number;
}> = {
  [UsageTier.FREE]: {
    model: 'eleven_monolingual_v1',  // More efficient model
    stability: 0.5,
    similarityBoost: 0.75,
    tokenLimit: 50000,  // Example limit 
  },
  [UsageTier.STANDARD]: {
    model: 'eleven_turbo_v2',
    stability: 0.7,
    similarityBoost: 0.8,
    tokenLimit: 150000,
  },
  [UsageTier.PREMIUM]: {
    model: 'eleven_multilingual_v2',
    stability: 0.8,
    similarityBoost: 0.85,
    tokenLimit: 500000,
  }
};

/**
 * Get user's speech settings, creating default if needed
 */
export async function getUserSpeechSettings(userId: string): Promise<UserSpeechSettings> {
  const cachedSettings = getCache<UserSpeechSettings>('speech-settings', userId);
  
  if (cachedSettings) {
    // Check if monthly reset is needed
    const now = new Date();
    const lastReset = new Date(cachedSettings.lastResetDate);
    
    // If we're in a new month, reset the token count
    if (now.getMonth() !== lastReset.getMonth() || now.getFullYear() !== lastReset.getFullYear()) {
      const updatedSettings = {
        ...cachedSettings,
        monthlyTokensUsed: 0,
        lastResetDate: now
      };
      
      setCache('speech-settings', userId, updatedSettings);
      return updatedSettings;
    }
    
    return cachedSettings;
  }
  
  // Create default settings for a new user
  const defaultSettings: UserSpeechSettings = {
    tier: UsageTier.FREE,
    monthlyTokensUsed: 0,
    monthlyTokenLimit: tierDefaults[UsageTier.FREE].tokenLimit,
    lastResetDate: new Date()
  };
  
  setCache('speech-settings', userId, defaultSettings);
  return defaultSettings;
}

/**
 * Update a user's speech settings
 */
export async function updateUserSpeechSettings(
  userId: string, 
  updates: Partial<UserSpeechSettings>
): Promise<UserSpeechSettings> {
  const currentSettings = await getUserSpeechSettings(userId);
  const updatedSettings = { ...currentSettings, ...updates };
  
  setCache('speech-settings', userId, updatedSettings);
  return updatedSettings;
}

/**
 * Update the token usage for a user
 */
export async function trackTokenUsage(
  userId: string, 
  tokenCount: number
): Promise<{
  successful: boolean;
  remainingTokens: number;
  message?: string;
}> {
  const settings = await getUserSpeechSettings(userId);
  
  // Check if user has exceeded their limit
  if (settings.monthlyTokensUsed + tokenCount > settings.monthlyTokenLimit) {
    return {
      successful: false,
      remainingTokens: settings.monthlyTokenLimit - settings.monthlyTokensUsed,
      message: 'Monthly token limit exceeded'
    };
  }
  
  // Update token usage
  const updatedSettings = {
    ...settings,
    monthlyTokensUsed: settings.monthlyTokensUsed + tokenCount
  };
  
  setCache('speech-settings', userId, updatedSettings);
  
  return {
    successful: true,
    remainingTokens: updatedSettings.monthlyTokenLimit - updatedSettings.monthlyTokensUsed
  };
}

/**
 * Estimate token count for a text
 * This is a simple estimation - ElevenLabs might count differently
 */
export function estimateTokenCount(text: string): number {
  // Average English word is ~4.7 characters
  // Typical token is ~4 characters
  // This is a simple approximation
  return Math.ceil(text.length / 4);
}

/**
 * Optimize text to reduce token usage
 */
export function optimizeText(text: string): string {
  if (!text) return text;
  
  // Remove redundant whitespace
  let optimized = text.trim().replace(/\s+/g, ' ');
  
  // Replace common phrases with shorter equivalents
  const replacements: [RegExp, string][] = [
    [/I would like to/gi, "I'd like to"],
    [/We would like to/gi, "We'd like to"],
    [/You would like to/gi, "You'd like to"],
    [/They would like to/gi, "They'd like to"],
    [/It would be/gi, "It'd be"],
    [/That would be/gi, "That'd be"],
    [/I will/gi, "I'll"],
    [/You will/gi, "You'll"],
    [/They will/gi, "They'll"],
    [/We will/gi, "We'll"],
    [/It will/gi, "It'll"],
    [/That will/gi, "That'll"],
    [/Do not/gi, "Don't"],
    [/Does not/gi, "Doesn't"],
    [/Did not/gi, "Didn't"],
    [/Have not/gi, "Haven't"],
    [/Has not/gi, "Hasn't"],
    [/Had not/gi, "Hadn't"],
    [/Cannot/gi, "Can't"],
    [/Could not/gi, "Couldn't"],
    [/For example,/gi, "e.g.,"],
    [/That is,/gi, "i.e.,"],
    // Add more common replacements as needed
  ];
  
  for (const [pattern, replacement] of replacements) {
    optimized = optimized.replace(pattern, replacement);
  }
  
  return optimized;
}

/**
 * Generate a cache key for a speech request
 */
export function generateSpeechCacheKey(
  text: string, 
  voiceId: string, 
  stability?: number, 
  similarityBoost?: number,
  style?: number,
  modelId?: string
): string {
  // Create a deterministic hash for caching
  const params = [
    text.trim().toLowerCase(),
    voiceId,
    stability?.toFixed(2) || '0.50',
    similarityBoost?.toFixed(2) || '0.75',
    style?.toFixed(2) || '0.00',
    modelId || 'eleven_turbo_v2'
  ].join('|');
  
  // Simple string hash
  let hash = 0;
  for (let i = 0; i < params.length; i++) {
    hash = ((hash << 5) - hash) + params.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }
  
  return `${voiceId}_${Math.abs(hash).toString(16)}`;
}

/**
 * Check if a cached audio exists for this text/voice combination
 */
export function hasCachedSpeech(
  text: string, 
  voiceId: string,
  stability?: number, 
  similarityBoost?: number,
  style?: number,
  modelId?: string
): boolean {
  const cacheKey = generateSpeechCacheKey(
    text, 
    voiceId, 
    stability, 
    similarityBoost,
    style,
    modelId
  );
  
  return !!getCache('speech-phrases', cacheKey);
}

/**
 * Split long text into reasonable chunks to avoid timeout issues
 * and potential cost overruns
 */
export function splitTextIntoChunks(text: string, maxChunkLength: number = 300): string[] {
  if (text.length <= maxChunkLength) {
    return [text];
  }
  
  const chunks: string[] = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
  
  let currentChunk = '';
  for (const sentence of sentences) {
    // If adding this sentence would exceed max length
    if (currentChunk.length + sentence.length > maxChunkLength && currentChunk.length > 0) {
      // Store the current chunk and start a new one
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      // Add sentence to current chunk
      currentChunk += sentence;
    }
  }
  
  // Add the last chunk if it's not empty
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

/**
 * Get optimal model and settings based on user tier and context
 */
export async function getOptimalTtsSettings(
  userId: string,
  context: {
    isMobile?: boolean;
    isLowBandwidth?: boolean;
    isInteractive?: boolean;
    isHighPriority?: boolean;
  } = {}
): Promise<{
  model: string;
  stability: number;
  similarityBoost: number;
  canProceed: boolean;
  remainingTokens: number;
}> {
  const settings = await getUserSpeechSettings(userId);
  const tierSettings = tierDefaults[settings.tier];
  
  // Start with the tier defaults
  let model = tierSettings.model;
  let stability = tierSettings.stability;
  let similarityBoost = tierSettings.similarityBoost;
  
  // Adjust based on context
  if (context.isMobile || context.isLowBandwidth) {
    // Use more efficient model and settings for mobile/low bandwidth
    model = 'eleven_monolingual_v1';
    stability = Math.max(0.3, stability - 0.1);
    similarityBoost = Math.max(0.65, similarityBoost - 0.1);
  }
  
  if (context.isInteractive) {
    // For interactive experiences, optimize for speed
    stability = Math.max(0.3, stability - 0.15);
  }
  
  if (context.isHighPriority) {
    // For high priority messages, ensure quality
    stability = Math.min(0.9, stability + 0.1);
    similarityBoost = Math.min(0.9, similarityBoost + 0.05);
  }
  
  // Use custom settings if available
  if (settings.customSettings) {
    model = settings.customSettings.model || model;
    stability = settings.customSettings.stability || stability;
    similarityBoost = settings.customSettings.similarityBoost || similarityBoost;
  }
  
  // Check if user has enough tokens left
  const canProceed = settings.monthlyTokensUsed < settings.monthlyTokenLimit;
  const remainingTokens = settings.monthlyTokenLimit - settings.monthlyTokensUsed;
  
  return {
    model,
    stability,
    similarityBoost,
    canProceed,
    remainingTokens
  };
}

/**
 * Pre-cache common phrases for a guide's voice
 * This can be run during quiet periods to prepare common interactions
 */
export async function precacheCommonPhrases(
  voiceId: string,
  phrases: string[],
  modelId?: string
): Promise<void> {
  // Implementation would call the ElevenLabs API for each phrase
  // and store the audio in the cache
  
  // This would typically be a background job, not a real-time operation
  console.log(`Precaching ${phrases.length} phrases for voice ${voiceId}`);
  
  // Example implementation - in a real system, this would make API calls
  // and store the resulting audio in a persistent cache
  for (const phrase of phrases) {
    const cacheKey = generateSpeechCacheKey(phrase, voiceId, undefined, undefined, undefined, modelId);
    
    // In a real implementation, this would make an API call and store the result
    // For this example, we're just marking it as cached
    setCache('speech-phrases', cacheKey, {
      cached: true,
      phrase,
      voiceId,
      timestamp: Date.now()
    });
  }
}

/**
 * Gets usage analytics for business insights
 */
export function getSpeechUsageAnalytics(): {
  totalTokensUsed: number;
  userCount: number;
  averageTokensPerUser: number;
  topTier: UsageTier;
} {
  // In a real implementation, this would query a database
  // For this example, we'll return placeholder data
  return {
    totalTokensUsed: 1250000,
    userCount: 500,
    averageTokensPerUser: 2500,
    topTier: UsageTier.STANDARD
  };
}