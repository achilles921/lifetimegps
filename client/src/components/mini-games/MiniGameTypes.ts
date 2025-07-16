// Basic game IDs
export type GameId = 'color-dash' | 'sentence-quest' | 'multisensory-matrix' | 'verbo-flash';

// Base metrics interface that all game metrics extend
export interface BaseGameMetrics {
  totalTime: number;       // Total time spent in game (seconds)
  completionTime: number;  // Time to complete game objectives (seconds)
  score: number;           // Final score
  accuracy: number;        // Overall accuracy percentage 
  level: number;           // Level reached or difficulty level completed
}

// Color Dash game metrics
export interface ColorDashMetrics extends BaseGameMetrics {
  visualReactionTime: number;       // Average reaction time (milliseconds)
  colorMatchingAccuracy: number;    // Accuracy of color recognition (0-100)
  peripheralVisionScore: number;    // Peripheral vision score (0-100)
  colorMatchingSpeed: number;       // Speed of color matching (0-100)
  visualDiscriminationScore: number; // Ability to discriminate between visual stimuli (0-100)
  colorSequenceMemory: number;      // Color sequence memory (0-100)
}

// Note: AnkiLearn game has been removed

// SentenceQuest game metrics
export interface SentenceQuestMetrics extends BaseGameMetrics {
  contextualComprehension: number;    // Understanding context (0-100)
  languageApplication: number;        // Application of language rules (0-100)
  sentenceFormulation: number;        // Ability to formulate sentences (0-100)
  grammarConsistency: number;         // Consistency in grammar usage (0-100)
  synonymRecognition: number;         // Recognition of synonyms and meaning (0-100)
}

// Multisensory Matrix game metrics
export interface MultisensoryMatrixMetrics extends BaseGameMetrics {
  spatialReasoningScore: number;      // Spatial reasoning ability (0-100)
  patternCompletionAccuracy: number;  // Pattern completion accuracy (0-100)
  multiTaskingScore: number;          // Multitasking ability (0-100)
  workingMemoryCapacity: number;      // Working memory capacity (0-100)
  logicalSequencingScore: number;     // Logical sequencing ability (0-100)
}

// Verbo Flash game metrics
export interface VerboFlashMetrics extends BaseGameMetrics {
  verbalProcessingSpeed: number;      // Verbal processing speed (0-100)
  wordAssociationAccuracy: number;    // Word association accuracy (0-100)
  linguisticFlexibility: number;      // Linguistic flexibility (0-100)
  vocabularyRange: number;            // Vocabulary breadth (0-100)
  semanticComprehension: number;      // Semantic comprehension (0-100)
}

// Game statuses
export type GameStatus = 'ready' | 'coming-soon' | 'locked';

// Game difficulty levels
export enum GameDifficulty {
  Easy = 1,
  Medium = 2,
  Hard = 3
}

// Mini game categories
export enum GameCategory {
  Visual = 'visual',
  Auditory = 'auditory',
  Motor = 'motor',
  Cognitive = 'cognitive',
  Verbal = 'verbal'
}

// Mini game brain dominance
export enum BrainDominance {
  Left = 'left',
  Right = 'right',
  Balanced = 'balanced'
}

// Mini game cognitive style
export enum CognitiveStyle {
  Analytical = 'analytical',
  Creative = 'creative',
  Practical = 'practical',
  Conceptual = 'conceptual',
  Sequential = 'sequential'
}

// Game result
export interface GameResult {
  gameId: GameId;
  timestamp: number;
  difficulty: GameDifficulty;
  metrics: BaseGameMetrics;
  completed: boolean;
}

// Game settings
export interface GameSettings {
  soundEnabled: boolean;
  animationsEnabled: boolean;
  contrastMode: boolean;
  difficulty: GameDifficulty;
}

// User cognitive profile based on game results
export interface CognitiveProfile {
  brainDominance: BrainDominance;
  cognitiveStyle: CognitiveStyle;
  strengths: string[];
  visualProcessing: number;
  auditoryProcessing: number;
  motorControl: number;
  verbalProcessing: number;
  spatialReasoning: number;
  attentionControl: number;
  decisionMaking: number;
  patternRecognition: number;
  memoryCapacity: number;
  processingSpeed: number;
  responseConsistency: number;
}