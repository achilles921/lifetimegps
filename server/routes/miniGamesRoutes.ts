import { Router, Request as ExpressRequest, Response } from 'express';
import { log } from '../vite';
import { activityStorage } from '../activityStorage';
import { storage } from '../storage';

// Extend the Express Request type to include user and sessionID properties
interface Request extends ExpressRequest {
  user?: {
    id?: string;
    [key: string]: any;
  };
  sessionID?: string;
}

const router = Router();

// Get anonymous user identifier (either logged in user ID or session ID)
function getUserIdentifier(req: Request): string {
  // Try to get user ID if user is logged in
  let userId = 'anonymous';
  
  try {
    if (req.user && typeof req.user === 'object' && 'id' in req.user) {
      userId = String(req.user.id);
    } else if (req.sessionID) {
      userId = `session_${req.sessionID}`;
    }
  } catch (error) {
    console.error('Error getting user identifier:', error);
  }
  
  return userId;
}

// Cache for mini-game results
interface GameResultCache {
  [sessionId: string]: Array<{
    gameId: string,
    userId: string,
    metrics: any,
    completed: boolean,
    timestamp: number
  }>;
}

// In-memory cache for mini-game results (while we set up the database)
const gameResultsCache: GameResultCache = {};

// Store mini-game results
router.post('/results', async (req: Request, res: Response) => {
  try {
    const { gameId, metrics, completed, timestamp, sessionId, 
            score, completionTime, accuracy, difficulty } = req.body;
    
    if (!gameId || !metrics) {
      return res.status(400).json({
        error: 'Missing required fields: gameId, metrics'
      });
    }
    
    // Get user identifier
    const userId = getUserIdentifier(req);
    
    // Store both in the cache (for backward compatibility) and in the database
    if (!gameResultsCache[sessionId]) {
      gameResultsCache[sessionId] = [];
    }
    
    gameResultsCache[sessionId].push({
      gameId,
      userId,
      metrics,
      completed: !!completed,
      timestamp: timestamp || Date.now()
    });
    
    // Store in the database if we have a real user ID (not a session ID)
    if (userId !== 'anonymous' && !userId.startsWith('session_')) {
      try {
        // Extract common metrics from different mini-games
        await storage.createMiniGamePerformance({
          userId,
          gameId,
          metrics,
          score: score || metrics.score || 0,
          completionTime: completionTime || metrics.completionTime || null,
          accuracy: accuracy || metrics.accuracy || null,
          difficulty: difficulty || metrics.difficulty || null,
          completed: !!completed,
          responses: metrics.responses || null,
          brainDominance: metrics.brainDominance || null,
          cognitiveStyle: metrics.cognitiveStyle || null,
          learningStyle: metrics.learningStyle || null,
          stressResponse: metrics.stressResponse || null,
          attentionScore: metrics.attentionScore || null,
          memoryScore: metrics.memoryScore || null,
          processingSpeed: metrics.processingSpeed || null,
          verbalSkills: metrics.verbalSkills || null,
          logicalReasoning: metrics.logicalReasoning || null,
          spatialReasoning: metrics.spatialReasoning || null,
          emotionalIntelligence: metrics.emotionalIntelligence || null,
          creativity: metrics.creativity || null,
          problemSolving: metrics.problemSolving || null,
          patternRecognition: metrics.patternRecognition || null,
          isPractice: metrics.isPractice || false
        });
        
        log(`Mini-game results saved to database for user ${userId}, game ${gameId}`, 'mini-games');
      } catch (dbError) {
        console.error('Error saving mini-game results to database:', dbError);
        // We'll continue even if the database save fails, so we at least have the cache version
      }
    }
    
    // Track activity
    await activityStorage.trackEvents([{
      type: 'mini_game_completed',
      userId,
      sessionId,
      metadata: {
        gameId,
        completed: !!completed,
        score: score || metrics.score || 0
      }
    }]);
    
    log(`Mini-game results saved for ${gameId}`, 'mini-games');
    
    res.status(200).json({
      success: true,
      message: `Results for ${gameId} saved successfully`
    });
  } catch (error) {
    console.error('Error saving mini-game results:', error);
    res.status(500).json({
      error: 'Error saving mini-game results'
    });
  }
});

// Sync multiple mini-game results
router.post('/sync', async (req: Request, res: Response) => {
  try {
    const { results } = req.body;
    
    if (!results || !Array.isArray(results)) {
      return res.status(400).json({
        error: 'Missing required field: results (array)'
      });
    }
    
    // Get user identifier
    const userId = getUserIdentifier(req);
    
    // Process each result
    for (const result of results) {
      const { gameId, metrics, completed, timestamp, sessionId,
              score, completionTime, accuracy, difficulty } = result;
      
      if (!gameId || !metrics || !sessionId) {
        continue;  // Skip invalid entries
      }
      
      // Store the results in our cache
      if (!gameResultsCache[sessionId]) {
        gameResultsCache[sessionId] = [];
      }
      
      gameResultsCache[sessionId].push({
        gameId,
        userId,
        metrics,
        completed: !!completed,
        timestamp: timestamp || Date.now()
      });
      
      // Store in the database if we have a real user ID (not a session ID)
      if (userId !== 'anonymous' && !userId.startsWith('session_')) {
        try {
          // Extract common metrics from different mini-games
          await storage.createMiniGamePerformance({
            userId,
            gameId,
            metrics,
            score: score || metrics.score || 0,
            completionTime: completionTime || metrics.completionTime || null,
            accuracy: accuracy || metrics.accuracy || null,
            difficulty: difficulty || metrics.difficulty || null,
            completed: !!completed,
            responses: metrics.responses || null,
            brainDominance: metrics.brainDominance || null,
            cognitiveStyle: metrics.cognitiveStyle || null,
            learningStyle: metrics.learningStyle || null,
            stressResponse: metrics.stressResponse || null,
            attentionScore: metrics.attentionScore || null,
            memoryScore: metrics.memoryScore || null,
            processingSpeed: metrics.processingSpeed || null,
            verbalSkills: metrics.verbalSkills || null,
            logicalReasoning: metrics.logicalReasoning || null,
            spatialReasoning: metrics.spatialReasoning || null,
            emotionalIntelligence: metrics.emotionalIntelligence || null,
            creativity: metrics.creativity || null,
            problemSolving: metrics.problemSolving || null,
            patternRecognition: metrics.patternRecognition || null,
            isPractice: metrics.isPractice || false
          });
          
          log(`Mini-game results saved to database for user ${userId}, game ${gameId}`, 'mini-games');
        } catch (dbError) {
          console.error('Error saving mini-game results to database:', dbError);
          // We'll continue even if the database save fails, so we at least have the cache version
        }
      }
      
      // Track activity for each game
      await activityStorage.trackEvents([{
        type: 'mini_game_completed',
        userId,
        sessionId,
        metadata: {
          gameId,
          completed: !!completed,
          score: score || metrics.score || 0
        }
      }]);
    }
    
    log(`${results.length} mini-game results synced`, 'mini-games');
    
    res.status(200).json({
      success: true,
      message: `${results.length} results synced successfully`
    });
  } catch (error) {
    console.error('Error syncing mini-game results:', error);
    res.status(500).json({
      error: 'Error syncing mini-game results'
    });
  }
});

// Get aggregate metrics for a user or session
router.get('/metrics', async (req: Request, res: Response) => {
  try {
    const { sessionId, gameId } = req.query;
    
    if (!sessionId) {
      return res.status(400).json({
        error: 'Missing required query parameter: sessionId'
      });
    }
    
    // Get user identifier
    const userId = getUserIdentifier(req);
    
    // Initialize the final results array
    let finalResults = [];
    
    // Try to get results from the database if this is a registered user
    if (userId !== 'anonymous' && !userId.startsWith('session_')) {
      try {
        // Get results from database
        const dbResults = await storage.getMiniGamePerformance(
          userId, 
          gameId ? String(gameId) : undefined
        );
        
        if (dbResults && dbResults.length > 0) {
          // Transform database results to match expected format
          const formattedDbResults = dbResults.map(result => ({
            gameId: result.gameId,
            metrics: result.metrics,
            completed: result.completed,
            timestamp: result.createdAt?.getTime() || Date.now()
          }));
          
          finalResults = formattedDbResults;
          log(`Retrieved ${finalResults.length} mini-game results from database for user ${userId}`, 'mini-games');
        }
      } catch (dbError) {
        console.error('Error getting mini-game metrics from database:', dbError);
        // We'll fall back to the cache if the database query fails
      }
    }
    
    // If we didn't get any results from the database, use the cache
    if (finalResults.length === 0) {
      // Get results for this session from cache
      const results = gameResultsCache[sessionId as string] || [];
      
      // Filter results for this user (extra security check)
      const userResults = results.filter(result => 
        result.userId === userId || result.userId.startsWith('session_')
      );
      
      // Filter by game ID if provided
      const filteredResults = gameId 
        ? userResults.filter(result => result.gameId === gameId) 
        : userResults;
      
      finalResults = filteredResults.map(result => ({
        gameId: result.gameId,
        metrics: result.metrics,
        completed: result.completed,
        timestamp: result.timestamp
      }));
      
      log(`Retrieved ${finalResults.length} mini-game results from cache for session ${sessionId}`, 'mini-games');
    }
    
    // Return the results
    res.status(200).json({
      success: true,
      metrics: finalResults
    });
  } catch (error) {
    console.error('Error getting mini-game metrics:', error);
    res.status(500).json({
      error: 'Error getting mini-game metrics'
    });
  }
});

export default router;