import { 
  GameId, 
  BaseGameMetrics,
  GameResult,
  GameDifficulty,
  CognitiveProfile,
  BrainDominance,
  CognitiveStyle
} from '@/components/mini-games/MiniGameTypes';

class MiniGameService {
  private readonly STORAGE_KEY = 'lifetime_gps_game_results';
  private readonly API_URL = '/api/mini-games';
  
  /**
   * Save game result to server, with localStorage fallback
   */
  public async saveGameResult(
    gameId: GameId, 
    metrics: BaseGameMetrics, 
    completed: boolean
  ): Promise<boolean> {
    try {
      const gameResult: GameResult = {
        gameId,
        timestamp: Date.now(),
        difficulty: metrics.level as GameDifficulty,
        metrics,
        completed
      };
      
      // Try to save to server first
      const response = await fetch(`${this.API_URL}/results`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameResult)
      });
      
      if (!response.ok) {
        // Fallback to local storage
        this.saveGameResultLocally(gameId, metrics, completed);
        console.warn('Failed to save game result to server, saved locally instead');
        return false;
      }
      
      return true;
    } catch (error) {
      // Fallback to local storage
      this.saveGameResultLocally(gameId, metrics, completed);
      console.error('Error saving game result:', error);
      return false;
    }
  }
  
  /**
   * Save game result to localStorage (fallback)
   */
  public saveGameResultLocally(
    gameId: GameId, 
    metrics: BaseGameMetrics, 
    completed: boolean
  ): void {
    try {
      // Get existing results
      const existingResults = this.getLocalGameResults();
      
      // Create new result
      const gameResult: GameResult = {
        gameId,
        timestamp: Date.now(),
        difficulty: metrics.level as GameDifficulty,
        metrics,
        completed
      };
      
      // Add to results and save
      existingResults.push(gameResult);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existingResults));
      
      // Update cognitive profile based on new result
      this.updateCognitiveProfile(existingResults);
      
      console.log(`Game result for ${gameId} saved locally`);
    } catch (error) {
      console.error('Error saving game result locally:', error);
    }
  }
  
  /**
   * Get all game results from server with localStorage fallback
   */
  public async getGameResults(): Promise<GameResult[]> {
    try {
      const response = await fetch(`${this.API_URL}/results`);
      
      if (!response.ok) {
        // Fallback to local storage
        const localResults = this.getLocalGameResults();
        console.warn('Failed to fetch game results from server, using local results');
        return localResults;
      }
      
      return await response.json();
    } catch (error) {
      // Fallback to local storage
      console.error('Error fetching game results:', error);
      return this.getLocalGameResults();
    }
  }
  
  /**
   * Get all game results from localStorage
   */
  public getLocalGameResults(): GameResult[] {
    try {
      const resultsJson = localStorage.getItem(this.STORAGE_KEY);
      return resultsJson ? JSON.parse(resultsJson) : [];
    } catch (error) {
      console.error('Error retrieving game results from localStorage:', error);
      return [];
    }
  }
  
  /**
   * Get the most recent result for a specific game
   */
  public async getLatestGameResult(gameId: GameId): Promise<GameResult | null> {
    const results = await this.getGameResults();
    
    if (!results || results.length === 0) {
      return null;
    }
    
    // Filter by game ID and sort by timestamp (descending)
    const gameResults = results
      .filter(result => result.gameId === gameId)
      .sort((a, b) => b.timestamp - a.timestamp);
    
    return gameResults.length > 0 ? gameResults[0] : null;
  }
  
  /**
   * Calculate cognitive profile based on game results
   */
  private updateCognitiveProfile(results: GameResult[]): void {
    if (!results || results.length === 0) {
      return;
    }
    
    // Group results by game ID (keep only the latest for each game)
    const latestByGame = new Map<GameId, GameResult>();
    
    for (const result of results) {
      const existing = latestByGame.get(result.gameId);
      
      if (!existing || existing.timestamp < result.timestamp) {
        latestByGame.set(result.gameId, result);
      }
    }
    
    // Only proceed if we have at least 3 different games
    if (latestByGame.size < 3) {
      return;
    }
    
    // Calculate scores for each cognitive domain
    let visualProcessing = 0;
    let auditoryProcessing = 0;
    let motorControl = 0;
    let verbalProcessing = 0;
    let spatialReasoning = 0;
    let attentionControl = 0;
    let decisionMaking = 0;
    let patternRecognition = 0;
    let memoryCapacity = 0;
    let processingSpeed = 0;
    let responseConsistency = 0;
    
    // Count for averaging
    let visualCount = 0;
    let auditoryCount = 0;
    let motorCount = 0;
    let verbalCount = 0;
    let spatialCount = 0;
    let attentionCount = 0;
    let decisionCount = 0;
    let patternCount = 0;
    let memoryCount = 0;
    let speedCount = 0;
    let consistencyCount = 0;
    
    // Process Color Dash results
    const colorDash = latestByGame.get('color-dash');
    if (colorDash && 'visualProcessingSpeed' in colorDash.metrics) {
      const metrics = colorDash.metrics as any;
      visualProcessing += metrics.visualProcessingSpeed;
      visualCount++;
      
      processingSpeed += metrics.visualProcessingSpeed;
      speedCount++;
      
      decisionMaking += metrics.decisionSpeed;
      decisionCount++;
      
      attentionControl += metrics.distractionResistance;
      attentionCount++;
      
      responseConsistency += metrics.responseConsistency;
      consistencyCount++;
    }
    
    // Note: Echo Match and Reaction Run games have been removed
    
    // Process Multisensory Matrix results
    const matrix = latestByGame.get('multisensory-matrix');
    if (matrix && 'spatialReasoningScore' in matrix.metrics) {
      const metrics = matrix.metrics as any;
      spatialReasoning += metrics.spatialReasoningScore;
      spatialCount++;
      
      patternRecognition += metrics.patternCompletionAccuracy;
      patternCount++;
      
      memoryCapacity += metrics.workingMemoryCapacity;
      memoryCount++;
    }
    
    // Process Verbo Flash results
    const verboFlash = latestByGame.get('verbo-flash');
    if (verboFlash && 'verbalProcessingSpeed' in verboFlash.metrics) {
      const metrics = verboFlash.metrics as any;
      verbalProcessing += metrics.verbalProcessingSpeed;
      verbalCount++;
      
      processingSpeed += metrics.verbalProcessingSpeed;
      speedCount++;
      
      memoryCapacity += metrics.vocabularyRange;
      memoryCount++;
    }
    
    // Calculate averages
    const profile: CognitiveProfile = {
      brainDominance: BrainDominance.Balanced,
      cognitiveStyle: CognitiveStyle.Analytical,
      strengths: [],
      visualProcessing: visualCount > 0 ? visualProcessing / visualCount : 0,
      auditoryProcessing: auditoryCount > 0 ? auditoryProcessing / auditoryCount : 0,
      motorControl: motorCount > 0 ? motorControl / motorCount : 0,
      verbalProcessing: verbalCount > 0 ? verbalProcessing / verbalCount : 0,
      spatialReasoning: spatialCount > 0 ? spatialReasoning / spatialCount : 0,
      attentionControl: attentionCount > 0 ? attentionControl / attentionCount : 0,
      decisionMaking: decisionCount > 0 ? decisionMaking / decisionCount : 0,
      patternRecognition: patternCount > 0 ? patternRecognition / patternCount : 0,
      memoryCapacity: memoryCount > 0 ? memoryCapacity / memoryCount : 0,
      processingSpeed: speedCount > 0 ? processingSpeed / speedCount : 0,
      responseConsistency: consistencyCount > 0 ? responseConsistency / consistencyCount : 0,
    };
    
    // Determine brain dominance
    // Left: analytical, logical, verbal
    const leftScore = (profile.verbalProcessing + profile.decisionMaking + profile.attentionControl) / 3;
    
    // Right: creative, intuitive, spatial
    const rightScore = (profile.visualProcessing + profile.spatialReasoning + profile.patternRecognition) / 3;
    
    const dominanceDiff = Math.abs(leftScore - rightScore);
    if (dominanceDiff < 10) {
      profile.brainDominance = BrainDominance.Balanced;
    } else if (leftScore > rightScore) {
      profile.brainDominance = BrainDominance.Left;
    } else {
      profile.brainDominance = BrainDominance.Right;
    }
    
    // Determine cognitive style
    const styles = [
      { style: CognitiveStyle.Analytical, score: (profile.decisionMaking + profile.attentionControl) / 2 },
      { style: CognitiveStyle.Creative, score: (profile.patternRecognition + profile.visualProcessing) / 2 },
      { style: CognitiveStyle.Practical, score: (profile.motorControl + profile.responseConsistency) / 2 },
      { style: CognitiveStyle.Conceptual, score: (profile.verbalProcessing + profile.spatialReasoning) / 2 },
      { style: CognitiveStyle.Sequential, score: (profile.memoryCapacity + profile.processingSpeed) / 2 }
    ];
    
    // Find the highest scoring style
    const topStyle = styles.reduce((prev, current) => 
      prev.score > current.score ? prev : current
    );
    
    profile.cognitiveStyle = topStyle.style;
    
    // Determine strengths (top 3 scores)
    const strengthMetrics = [
      { name: 'Visual Processing', score: profile.visualProcessing },
      { name: 'Auditory Processing', score: profile.auditoryProcessing },
      { name: 'Motor Control', score: profile.motorControl },
      { name: 'Verbal Processing', score: profile.verbalProcessing },
      { name: 'Spatial Reasoning', score: profile.spatialReasoning },
      { name: 'Attention Control', score: profile.attentionControl },
      { name: 'Decision Making', score: profile.decisionMaking },
      { name: 'Pattern Recognition', score: profile.patternRecognition },
      { name: 'Memory Capacity', score: profile.memoryCapacity },
      { name: 'Processing Speed', score: profile.processingSpeed }
    ];
    
    // Sort by score and take top 3
    const sortedStrengths = strengthMetrics
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(strength => strength.name);
    
    profile.strengths = sortedStrengths;
    
    // Save profile to localStorage
    localStorage.setItem('lifetime_gps_cognitive_profile', JSON.stringify(profile));
  }
  
  /**
   * Get the current cognitive profile
   */
  public getCognitiveProfile(): CognitiveProfile | null {
    try {
      const profileJson = localStorage.getItem('lifetime_gps_cognitive_profile');
      return profileJson ? JSON.parse(profileJson) : null;
    } catch (error) {
      console.error('Error retrieving cognitive profile:', error);
      return null;
    }
  }
  
  /**
   * Calculate and return game completion stats (overall progress)
   */
  public getGameCompletionStats(): { completed: number, total: number, percent: number } {
    const results = this.getLocalGameResults();
    
    // Find unique games that were completed
    const completedGames = new Set<GameId>();
    
    for (const result of results) {
      if (result.completed) {
        completedGames.add(result.gameId);
      }
    }
    
    const totalGames = 4; // Total number of mini-games (color-dash, sentence-quest, multisensory-matrix, verbo-flash)
    const completedCount = completedGames.size;
    const percentComplete = (completedCount / totalGames) * 100;
    
    return {
      completed: completedCount,
      total: totalGames,
      percent: percentComplete
    };
  }
}

// Export singleton instance
const miniGameService = new MiniGameService();
export default miniGameService;