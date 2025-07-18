import { interestOptions } from "@/data/quizData";
import { careers, isTradeCareer} from "@/data/careerData";

/**
 * Checks if any sections of the career race quiz have been completed
 * to determine if Mini-Games Hub should be shown in navigation
 */
export function areAllSectionsCompleted(): boolean {
  // If at least one section is completed or quiz is fully completed,
  // we'll show the mini-games hub in navigation
  const quizFullyCompleted = localStorage.getItem('quizFullyCompleted') === 'true';
  const currentSector = parseInt(localStorage.getItem('currentSector') || '1', 10);
  
  // If the quiz is fully completed or user is past sector 1, show mini-games hub
  if (quizFullyCompleted || currentSector > 1) {
    return true;
  }
  
  // Also check if any sectors have been completed in any session
  const allKeys = Object.keys(localStorage);
  const anySectorCompleted = allKeys.some(key => 
    key.includes('_quickQuizAnswers_sector_')
  );
  
  return anySectorCompleted;
}

/**
 * Helper function to determine a career's category based on its title
 * This provides better categorization for the diversified display algorithm
 */
function determineCareerCategory(title: string): string {
  if (title.includes("Developer") || title.includes("Programmer") || title.includes("Engineer") || 
      title.includes("Computing") || title.includes("IT") || title.includes("Security")) {
    return "Technology";
  } else if (title.includes("Designer") || title.includes("Artist") || title.includes("Writer") ||
            title.includes("Director") || title.includes("Producer")) {
    return "Creative";
  } else if (title.includes("Engineer") && !title.includes("Software")) {
    return "Engineering";
  } else if (title.includes("Therapist") || title.includes("Nurse") || title.includes("Doctor") || 
            title.includes("Health") || title.includes("Medical") || title.includes("Dental")) {
    return "Healthcare";
  } else if (title.includes("Teacher") || title.includes("Coach") || title.includes("Professor") || 
            title.includes("Educator")) {
    return "Education";
  } else if (title.includes("Manager") || title.includes("Executive") || title.includes("Director") ||
            title.includes("Administrator") || title.includes("Supervisor")) {
    return "Management";
  } else if (title.includes("Technician") || title.includes("Electrician") || title.includes("Plumber") ||
            title.includes("Mechanic") || title.includes("Carpenter") || title.includes("Welder") ||
            title.includes("Operator")) {
    return "Trades";
  } else if (title.includes("Chef") || title.includes("Cook") || title.includes("Hospitality") ||
            title.includes("Service") || title.includes("Culinary")) {
    return "Hospitality";
  } else if (title.includes("Scientist") || title.includes("Researcher") || title.includes("Analyst") ||
            title.includes("Laboratory")) {
    return "Science";
  } else if (title.includes("Analyst") || title.includes("Finance") || title.includes("Accountant") ||
            title.includes("Advisor") || title.includes("Banking")) {
    return "Finance";
  } else if (title.includes("Marketing") || title.includes("Sales") || title.includes("Advertising") ||
            title.includes("PR") || title.includes("Brand")) {
    return "Marketing";
  }
  
  return "Other";
}

// Interface for mini-game metrics
export interface MiniGameMetrics {
  // Core metrics used by algorithm for career matching - UPDATED
  brainDominance?: 'left' | 'right' | 'balanced'; // Analytical vs creative problem-solving
  cognitiveStyle?: 'analytical' | 'creative' | 'practical' | 'conceptual' | 'sequential'; // Overall cognitive style
  stressResponse?: 'low' | 'medium' | 'high'; // Response to stress and pressure
  decisionSpeed?: number;           // Decision making speed (0-100)
  patternRecognition?: number;      // Pattern recognition ability (0-100)
  multitaskingAbility?: number;     // Multitasking ability (0-100)
  spatialAwareness?: number;        // Spatial awareness (0-100)
  handEyeCoordination?: number;     // Hand-eye coordination (0-100)
  
  // Legacy metrics - for backward compatibility
  motorControl?: number;            // Motor control precision (0-100)
  verbalProcessing?: number;        // Verbal processing ability (0-100)
  visualProcessing?: number;        // Visual processing ability (0-100)
  auditoryProcessing?: number;      // Auditory processing ability (0-100)
  attentionControl?: number;        // Attention control (0-100)
  decisionMaking?: number;          // Decision making ability (0-100) - use decisionSpeed instead
  memoryCapacity?: number;          // Memory capacity (0-100)
  processingSpeed?: number;         // Overall processing speed (0-100)
  responseConsistency?: number;     // Consistency of responses (0-100)
  
  // Mini-game specific metrics
  // Color Dash metrics
  visualProcessingSpeed?: number;   // Speed of visual processing (0-100)
  colorRecognitionAccuracy?: number; // Accuracy of color recognition (0-100)
  distractionResistance?: number;   // Ability to resist distractions (0-100)
  
  // Sentence Quest metrics
  contextualUnderstanding?: number;  // Context comprehension (0-100)
  grammarConsistency?: number;       // Grammar application (0-100)
  languageApplication?: number;      // Language use flexibility (0-100)
  sentenceFormationSpeed?: number;   // Formation speed (0-100)
  vocabularyDepth?: number;          // Vocabulary depth (0-100)
  
  // Multisensory Matrix metrics
  spatialReasoningScore?: number;    // Spatial reasoning ability (0-100)
  patternCompletionAccuracy?: number; // Pattern completion accuracy (0-100)
  workingMemoryCapacity?: number;    // Working memory capacity (0-100)
  multiTaskingScore?: number;        // Multitasking ability (0-100) - source for multitaskingAbility
  logicalSequencingScore?: number;   // Logical sequencing ability (0-100)
  
  // Verbo Flash metrics
  verbalProcessingSpeed?: number;    // Verbal processing speed (0-100)
  wordAssociationAccuracy?: number;  // Word association accuracy (0-100)
  linguisticFlexibility?: number;    // Linguistic flexibility (0-100)
  vocabularyRange?: number;          // Vocabulary breadth (0-100)
  semanticComprehension?: number;    // Semantic comprehension (0-100)
}

// Interface to define the structure of quiz results
interface QuizResults {
  workStyle: Record<string, number>;
  cognitiveStrength: Record<string, number>;
  socialApproach: Record<string, number>;
  motivation: Record<string, number>;
  interests: Array<{interest: string; percentage: number}>;
  miniGameMetrics?: MiniGameMetrics; // Optional mini-game results
}

// Interface for career matches
export interface CareerMatch {
  id: string;
  title: string;
  description: string;
  match: number;
  skills: string[];
  imagePath: string;
  salary: string;
  growth: string;
  education?: string;
  category?: string;
}

interface CareerRoadmap {
  careerPath: string;
  title?: string;
  description?: string;
  educationPath?: string[];
  experiencePath?: string[];
  skillsPath?: string[];
  certifications?: string[];
  timeline?: string; // Changed from number[] to string to match implementation
  investment?: string;
  difficulty?: string;
  phases?: {
    title: string;
    description: string;
    steps: {
      title: string;
      description: string;
      completed: boolean;
    }[];
  }[];
  milestones?: {name: string, description: string, time: string}[];
  mentorshipOpportunities?: string[];
  apprenticeshipOpportunities?: {company: string, position: string, duration: string}[];
  estimatedSalaryProgress?: {year: number, salary: string}[];
  ageGroup?: string;
  priorExperience?: string;
}

/**
 * Processes the quiz responses and calculates personality traits
 */
export function processQuizResponses(responses: any): QuizResults {
 //  console.log("PROCESSING QUIZ RESPONSES:", JSON.stringify(responses, null, 2));
  
  // Validate incoming data to prevent processing errors
  if (!responses || typeof responses !== 'object') {
    console.error("Invalid quiz response data provided");
    // Return a minimal valid structure to prevent downstream errors
    return {
      workStyle: {},
      cognitiveStrength: {},
      socialApproach: {},
      motivation: {},
      interests: []
    };
  }
  
  // Initialize result object
  const results: QuizResults = {
    workStyle: {
      'structured': 0,
      'flexible': 0,
      'team': 0,
      'independent': 0,
      'hands-on': 0,
      'analytical': 0
    },
    cognitiveStrength: {
      'learned': 0,
      'skills': 0,
      'experience': 0,
      'knowledge': 0
    },
    socialApproach: {
      'extrovert': 0,
      'introvert': 0,
      'leader': 0,
      'supporter': 0,
      'risk-taker': 0,
      'cautious': 0
    },
    motivation: {
      'personal_goals': 0,
      'helping_others': 0,
      'recognition': 0,
      'challenges': 0,
      'learning': 0,
      'solving': 0,
      'helping': 0,
      'rewards': 0,
      'accomplishment': 0,
      'growth': 0
    },
    interests: []
  };
  
  // Process Sector 1 - Work Style
  if (responses.sector1) {
    // Initialize a tracking object for detailed team value analytics
    const teamValueTypes: Record<string, number> = {};
    
    Object.entries(responses.sector1).forEach(([question, answer]: [string, any]) => {
      if (typeof answer === 'string') {
        // Handle team-oriented responses with various values (team_wisdom, team_mentor, team_synergy, etc.)
        // These unique values help track specific preferences while still counting toward the overall 'team' score
        if (answer.startsWith('team_') || answer === 'team') {
          // Track the specific team value type for analytics
          teamValueTypes[answer] = (teamValueTypes[answer] || 0) + 1;
         //  console.log(`Found team-oriented value: "${answer}" in question ${question}`);
          
          // Add to overall team score
          results.workStyle['team']++;
        }
        // Handle regular values
        else if (results.workStyle.hasOwnProperty(answer)) {
          results.workStyle[answer]++;
        }
      }
    });
    
    // Store the detailed team value types for future analytics and personalization
   //  console.log('Team value distribution:', teamValueTypes);
  }
  
  // Process Sector 2 - Cognitive Strengths
  if (responses.sector2) {
    Object.values(responses.sector2).forEach((answer: any) => {
      if (typeof answer === 'string' && results.cognitiveStrength.hasOwnProperty(answer)) {
        results.cognitiveStrength[answer]++;
      }
    });
  }
  
  // Process Sector 3 - Social Approach
  if (responses.sector3) {
    // Count extrovert vs introvert traits
    const extrovertQuestions = ['s3_q1', 's3_q4', 's3_q6', 's3_q10', 's3_q11', 's3_q13', 's3_q15'];
    extrovertQuestions.forEach(q => {
      if (responses.sector3[q] === true) {
        results.socialApproach['extrovert']++;
      } else if (responses.sector3[q] === false) {
        results.socialApproach['introvert']++;
      }
    });
    
    // Count leader vs supporter traits
    const leaderQuestions = ['s3_q6', 's3_q8', 's3_q10'];
    leaderQuestions.forEach(q => {
      if (responses.sector3[q] === true) {
        results.socialApproach['leader']++;
      } else if (responses.sector3[q] === false) {
        results.socialApproach['supporter']++;
      }
    });
    
    // Count risk-taker vs cautious traits
    const riskQuestions = ['s3_q11', 's3_q13', 's3_q15'];
    riskQuestions.forEach(q => {
      if (responses.sector3[q] === true) {
        results.socialApproach['risk-taker']++;
      } else if (responses.sector3[q] === false) {
        results.socialApproach['cautious']++;
      }
    });
  }
  
  // Process Sector 4 - Motivation
  if (responses.sector4) {
    Object.values(responses.sector4).forEach((answer: any) => {
      if (typeof answer === 'string' && results.motivation.hasOwnProperty(answer)) {
        results.motivation[answer]++;
      }
    });
  }
  
  // Process Sector 5 - Interests
  if (responses.sector5 && Array.isArray(responses.sector5)) {
    results.interests = responses.sector5;
   //  console.log("Found interests data:", responses.sector5);
  } else {
   //  console.log("No interests data found in responses");
  }
  
  // Process mini-game metrics if provided with enhanced cognitive trait correlation
  if (responses.miniGameMetrics) {
    results.miniGameMetrics = responses.miniGameMetrics;
   //  console.log("Found mini-game metrics:", responses.miniGameMetrics);
    
    // Map mini-game metrics to enhance cognitive strength assessment
    // This provides objective validation of self-reported cognitive skills
    if (responses.miniGameMetrics.patternRecognition) {
      // Strengthen analytical and logical thinking based on pattern recognition score
      results.cognitiveStrength.analytical = Math.max(
        results.cognitiveStrength.analytical || 0,
        Math.round(responses.miniGameMetrics.patternRecognition * 0.7)
      );
      results.cognitiveStrength.logical = Math.max(
        results.cognitiveStrength.logical || 0,
        Math.round(responses.miniGameMetrics.patternRecognition * 0.6)
      );
    }
    
    if (responses.miniGameMetrics.decisionSpeed) {
      // Strengthen decisive and quick-thinking traits
      results.cognitiveStrength.decisive = Math.max(
        results.cognitiveStrength.decisive || 0,
        Math.round(responses.miniGameMetrics.decisionSpeed * 0.8)
      );
    }
    
    if (responses.miniGameMetrics.spatialAwareness) {
      // Strengthen visualization and creative thinking
      results.cognitiveStrength.visual = Math.max(
        results.cognitiveStrength.visual || 0,
        Math.round(responses.miniGameMetrics.spatialAwareness * 0.75)
      );
      results.cognitiveStrength.creative = Math.max(
        results.cognitiveStrength.creative || 0,
        Math.round(responses.miniGameMetrics.spatialAwareness * 0.5)
      );
    }
  }
  
  // Log entire results object for debugging
 //  console.log("Final processed quiz results:", JSON.stringify(results, null, 2));
  
  return results;
}

/**
 * Generates career matches based on quiz results with enhanced trade career emphasis
 * and improved mini-game metric integration
 */
/**
 * Special entrepreneurial profile detection and scoring
 * Custom weights for entrepreneur profile:
 * - Interest Alignment: 50% (increased from 40%)
 * - Work Style: 20% (increased from 15%)
 * - Cognitive: 15% (unchanged)
 * - Social: 10% (unchanged)
 * - Motivation: 5% (decreased from 20%)
 */

export function generateCareerMatches(quizResults: QuizResults): CareerMatch[] {
  const interestIds = new Set<number>();
  
  // Map interest names to IDs and store percentages for weighting
  const interestWeights = new Map<number, number>();
  quizResults.interests.forEach(interestItem => {
    const interest = interestOptions.find(opt => opt.name === interestItem.interest);
    if (interest) {
      interestIds.add(interest.id);
      interestWeights.set(interest.id, interestItem.percentage);
    }
  });
  
  // Get top work styles
  const workStyleEntries = Object.entries(quizResults.workStyle);
  const topWorkStyles = workStyleEntries
    .sort((a, b) => b[1] - a[1])
    .filter(entry => entry[1] > 0)
    .map(entry => entry[0]);

  // Get top cognitive strengths
  const cognitiveEntries = Object.entries(quizResults.cognitiveStrength);
  const topCognitiveStrengths = cognitiveEntries
    .sort((a, b) => b[1] - a[1])
    .filter(entry => entry[1] > 0)
    .map(entry => entry[0]);

  // Get social approach traits
  const socialEntries = Object.entries(quizResults.socialApproach);
  const dominantSocialTraits = socialEntries
    .sort((a, b) => b[1] - a[1])
    .filter(entry => entry[1] > 0)
    .slice(0, 3)
    .map(entry => entry[0]);

  // Get motivation factors
  const motivationEntries = Object.entries(quizResults.motivation);
  const topMotivations = motivationEntries
    .sort((a, b) => b[1] - a[1])
    .filter(entry => entry[1] > 0)
    .slice(0, 3)
    .map(entry => entry[0]);
  
  // Score each career based on matching interests and traits using weighted scoring matrix
  const scoredCareers = careers.map(career => {
    // Weighted Scoring Matrix - REVISED with motivation emphasis:
    // 1. Interest Alignment: 40% - Very important but reduced slightly
    // 2. Work Style Compatibility: 15% - Slightly reduced
    // 3. Cognitive Approach Match: 15% - Maintained
    // 4. Social Traits Compatibility: 10% - Maintained
    // 5. Motivation Alignment: 20% - Significantly increased (critical driver of career success)
    
    // Initialize category scores - REBALANCED to emphasize motivation
    let interestScore = 0;    // Max 40 points (reduced from 50)
    let workStyleScore = 0;   // Max 15 points (reduced from 20)
    let cognitiveScore = 0;   // Max 15 points (maintained)
    let socialScore = 0;      // Max 10 points (maintained)
    let motivationScore = 0;  // Max 20 points (increased from 5 - critical driver)
    let miniGameBonus = 0;    // Bonus points from mini-game metrics
    let tradeCareerBonus = 0; // Additional boost for trade careers
    
    // Detailed breakdowns for score tracking and analytics
    const scoringBreakdown = {
      interest: { score: 0, matches: [] as Array<{id: number, weight: number, name: string}>, maxPossible: 40 },
      workStyle: { score: 0, matches: [] as Array<{style: string, weight: number}>, maxPossible: 15 },
      cognitive: { score: 0, matches: [] as Array<{type: string, contribution: number}>, maxPossible: 15 },
      social: { score: 0, matches: [] as Array<{trait: string, environment: string, contribution: number}>, maxPossible: 10 },
      motivation: { score: 0, matches: [] as Array<{motivation: string, careerAttribute: string, contribution: number, type: 'intrinsic'|'extrinsic'}>, maxPossible: 20 }
    };
    
    // 1. INTEREST ALIGNMENT (40% of total score) - IMPROVED ALGORITHM
    // The cornerstone metric for a truly personalized user experience
    // Implements advanced weighting, relevancy, and exponential boost system
    
    let interestMatchCount = 0;
    let totalInterestWeight = 0;
    let primaryMatchFound = false;
    const interestMatches: {id: number, weight: number, name: string, relevanceBoost: number, isExact: boolean}[] = [];
    
    // Interest matching is critical - users need to feel their interests are represented
    // in the suggested careers. This enhanced algorithm improves match relevance.
    
    // First pass - identify direct interest matches with weighted relevance
    career.relatedInterests.forEach(interestId => {
      if (interestIds.has(interestId)) {
        interestMatchCount++;
        
        // Find interest name for breakdown tracking
        const interestName = interestOptions.find(opt => opt.id === interestId)?.name || 'Unknown';
        
        // User's interest weight (normalized to 1-100)
        const weight = interestWeights.get(interestId) || 0;
        totalInterestWeight += weight;
        
        // Calculate relevance boost based on position in career's interests
        // First interest is considered primary (most relevant) with highest boost
        let relevanceBoost = 1.0;
        if (career.relatedInterests.indexOf(interestId) === 0) {
          relevanceBoost = 1.5; // 50% boost for primary interest
          primaryMatchFound = true;
        } else if (career.relatedInterests.indexOf(interestId) === 1) {
          relevanceBoost = 1.3; // 30% boost for secondary interest
        } else if (career.relatedInterests.indexOf(interestId) === 2) {
          relevanceBoost = 1.1; // 10% boost for tertiary interest
        }
        
        // Apply progressive scoring for multiple matches
        // Instead of diminishing returns, we use progressive returns to better
        // match users with careers that have multiple interest alignments
        const matchCountFactor = Math.min(1.0 + (interestMatchCount * 0.1), 1.4); // Up to 40% boost for multiple matches
        
        // Calculate raw contributed score with this enhanced approach
        const contributedScore = (weight * relevanceBoost * matchCountFactor) / 100 * 40; // Scale to 40% max
        interestScore += contributedScore;
        
        // Track for detailed breakdown and user explanation
        interestMatches.push({
          id: interestId,
          weight,
          name: interestName,
          relevanceBoost,
          isExact: true
        });
      }
    });
    
    // Second pass - check for related/adjacent interests
    // This gives partial credit for interests that are closely related to the career
    if (interestMatchCount === 0) {
      // Attempt to find related interests when no direct matches found
      // Define interest clusters (interests that are closely related)
      const interestClusters = [
        [1, 5, 12], // Technology cluster
        [2, 14, 18], // Creative cluster
        [3, 11, 17], // Building/Construction cluster
        [4, 8, 16], // People-oriented cluster
        [6, 9, 13], // Science/Research cluster 
        [7, 10, 15], // Business/Administration cluster
      ];
      
      // Check if any user interests are in the same cluster as career interests
      career.relatedInterests.forEach(careerInterestId => {
        const clusterWithCareerInterest = interestClusters.find(cluster => 
          cluster.includes(careerInterestId)
        );
        
        if (clusterWithCareerInterest) {
          // Check if user has any interests in this same cluster
          const userInterestsInSameCluster = Array.from(interestIds).filter(id => 
            clusterWithCareerInterest.includes(id)
          );
          
          if (userInterestsInSameCluster.length > 0) {
            // Award partial points for related interests
            userInterestsInSameCluster.forEach(relatedId => {
              const interestName = interestOptions.find(opt => opt.id === relatedId)?.name || 'Unknown';
              const weight = (interestWeights.get(relatedId) || 0) * 0.5; // 50% of normal weight
              
              interestScore += weight;
              interestMatchCount += 0.5; // Count as partial match
              totalInterestWeight += weight;
              
              // Track for breakdown
              interestMatches.push({
                id: relatedId,
                weight: weight,
                name: interestName + " (related)",
                relevanceBoost: 0.5,
                isExact: false
              });
            });
          }
        }
      });
    }
    
    // Normalize and finalize interest score
    if (interestMatchCount > 0) {
      // Improved scaling function
      // - Better rewards strong multiple interest matches
      // - More sensitive to interest intensity (weight)
      // - Provides smoother progression
      
      // Base factors - revised to better value intensity of interest
      const matchCountFactor = Math.min(1, interestMatchCount / 2.5); // Reduced from 3 to 2.5 for faster scaling
      const weightFactor = Math.min(1, totalInterestWeight / 90); // Reduced from 100 to 90 for easier max value
      
      // Progressive weight emphasis - increases weight importance for higher match counts
      // This better rewards the case where user has multiple strong interests matching the career
      const weightEmphasis = 0.65 + (matchCountFactor * 0.15); // 65%-80% based on match count
      const countEmphasis = 1 - weightEmphasis;
      
      // Calculate combined score with progressive weighting
      const combinedFactor = (weightFactor * weightEmphasis) + (matchCountFactor * countEmphasis);
      
      // Apply non-linear scaling for more intuitive progression 
      // - Easier to get scores in the middle range
      // - Harder to max out at exactly 40
      const scaledFactor = Math.pow(combinedFactor, 0.85); // Slight curve to the scaling
      
      // Calculate final score (max 40)
      interestScore = Math.min(40, Math.round(40 * scaledFactor));
      
      // Track for breakdown
      scoringBreakdown.interest.score = interestScore;
      scoringBreakdown.interest.matches = interestMatches;
    }
    
    // 2. WORK STYLE COMPATIBILITY (15% of total score)
    // Assesses preferences for how work is structured and executed
    // Evaluates alignment between user's preferred work style and the career's requirements
    
    const workStyles = career.workStyle.map(style => style.toLowerCase());
    const workStyleMatches: {style: string, weight: number, matchQuality: number, matchType: string}[] = [];
    
    // Define work style opposites (for potential conflict detection)
    const workStyleOpposites: Record<string, string> = {
      'structured': 'flexible',
      'flexible': 'structured',
      'team': 'independent',
      'independent': 'team'
    };
    
    // Enhanced mapping of user work styles to their career importance with more detailed descriptions
    const workStyleMapping: {[key: string]: {
      importance: number, 
      careerKeywords: string[],
      description: string, // Added for better explanations in results
      tradeRelevance: number, // Indicates how relevant this style is to trade careers (0-1)
      entrepreneurRelevance?: number // Optional: Indicates how relevant this style is to entrepreneurial careers (0-1)
    }} = {
      'structured': {
        importance: 0.4, // High importance
        careerKeywords: ['structured', 'systematic', 'regulated', 'precise', 'methodical', 'organized', 'protocol', 'procedural', 'standardized', 'routine'],
        description: 'Preference for clear processes, procedures and frameworks',
        tradeRelevance: 0.8 // Highly relevant to many trades that require following codes/procedures
      },
      'flexible': {
        importance: 0.5, // Increased importance
        careerKeywords: ['flexible', 'adaptable', 'dynamic', 'variable', 'creative', 'fluid', 'agile', 'innovative', 'evolving', 'changing', 'entrepreneurial', 'self-starter', 'business', 'venture', 'ownership'],
        description: 'Preference for adaptable and changing work environments',
        tradeRelevance: 0.5, // Moderately relevant - some trades require adaptability
        entrepreneurRelevance: 0.9 // Highly relevant for entrepreneurs
      },
      'team': {
        importance: 0.3, // Medium importance
        careerKeywords: ['team', 'collaborative', 'group', 'cooperation', 'partnership', 'joint', 'collective', 'crew', 'coordinated', 'together'],
        description: 'Preference for collaborative and group-based work',
        tradeRelevance: 0.7 // Many trades involve crew/team-based work
      },
      'independent': {
        importance: 0.45, // Increased importance
        careerKeywords: ['independent', 'autonomous', 'self-directed', 'solo', 'individual', 'private', 'self-managed', 'self-sufficient', 'leader', 'entrepreneur', 'ownership', 'decision-maker', 'business-owner', 'founder', 'startup'],
        description: 'Preference for self-directed and autonomous work',
        tradeRelevance: 0.6, // Some trades allow for independent work
        entrepreneurRelevance: 1.0 // Maximum relevance for entrepreneurs
      },
      'hands-on': {
        importance: 0.5, // Increased importance for trade careers
        careerKeywords: [
          'hands-on', 'practical', 'field', 'manual', 'physical', 'craft', 'construction', 
          'maintenance', 'repair', 'installation', 'technical', 'fabrication', 'assembly', 
          'machining', 'mechanical', 'electrical', 'plumbing', 'trade', 'carpentry', 'welding',
          'building', 'operating', 'handling', 'crafting', 'manufacturing', 'industrial'
        ],
        description: 'Preference for physical, tangible work involving manual skills',
        tradeRelevance: 1.0 // Maximum relevance to trades
      },
      'analytical': {
        importance: 0.35, // Medium-high importance
        careerKeywords: ['analytical', 'research', 'data', 'logical', 'investigative', 'mathematical', 'systematic', 'diagnostic', 'evaluative', 'calculation'],
        description: 'Preference for work involving analysis and logical reasoning',
        tradeRelevance: 0.5 // Moderately relevant - many trades require troubleshooting
      }
    };
    
    // Enhanced work style scoring with match quality awareness
    // This new approach handles multi-dimensional matching and potential conflicts
    
    // First pass - identify direct style matches and their quality
    topWorkStyles.forEach((style, index) => {
      // Apply more nuanced diminishing weights for lower-ranked styles
      // Formula updated to better value secondary preferences
      const rankFactor = 1 - (index * 0.2); // Reduced from 0.25 to 0.2
      
      // Get the information for this work style
      const styleInfo = workStyleMapping[style] || { 
        importance: 0.3, 
        careerKeywords: [style],
        description: 'Custom work style preference',
        tradeRelevance: 0.3,
        entrepreneurRelevance: 0.3 // Default value for custom styles
      };
      
      // Multi-level matching for more accurate scoring
      let matchQuality = 0;
      let matchType = '';
      
      // Level 1: Direct style match (highest quality)
      if (workStyles.some(ws => ws === style)) {
        matchQuality = 1.0; // Perfect match
        matchType = 'direct';
      } 
      // Level 2: Strong keyword match (high quality)
      else if (styleInfo.careerKeywords.some(keyword => 
        workStyles.some(ws => ws === keyword) // Exact match with a keyword
      )) {
        matchQuality = 0.9; // Strong match
        matchType = 'keyword_exact';
      }
      // Level 3: Partial keyword match (medium quality)
      else if (styleInfo.careerKeywords.some(keyword => 
        workStyles.some(ws => ws.includes(keyword)) // Partial match with a keyword
      )) {
        matchQuality = 0.7; // Partial match
        matchType = 'keyword_partial';
      }
      // Level 4: Description match (lower quality)
      else if (career.description.toLowerCase().split(' ').some(word => 
        styleInfo.careerKeywords.includes(word)
      )) {
        matchQuality = 0.5; // Description match
        matchType = 'description';
      }
      
      // Optional: Add trade relevance boost for applicable styles in trade careers
      // Infer if this is likely a trade career based on skills and description
      const isTrade = 
        career.skills.some(skill => 
          ['trade', 'manual', 'craft', 'mechanical', 'repair', 'maintenance', 'construction', 'electrical', 'plumbing'].some(term => 
            skill.toLowerCase().includes(term)
          )
        ) || 
        career.description.toLowerCase().includes('trade');
      
      // Check if this is a trade career
      if (isTrade && styleInfo.tradeRelevance > 0.5 && matchQuality > 0) {
        // Apply additional trade relevance multiplier for trades
        matchQuality *= (1 + (styleInfo.tradeRelevance - 0.5) * 0.4); // Up to 20% boost
        matchType += '_trade_boosted';
      }
      
      // Check if this is an entrepreneurial career (looking for key entrepreneurial terms)
      const isEntrepreneurial = 
        career.title.toLowerCase().includes('entrepreneur') || 
        career.title.toLowerCase().includes('business owner') ||
        career.description.toLowerCase().includes('entrepreneur') ||
        career.description.toLowerCase().includes('business owner') ||
        career.description.toLowerCase().includes('start your own') ||
        career.description.toLowerCase().includes('leadership') ||
        career.skills.some(skill => 
          ['leadership', 'entrepreneurial', 'business', 'management', 'strategy', 'innovation', 'risk-taking'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
      
      // If this is an entrepreneurial role and this work style is relevant for entrepreneurs
      if (isEntrepreneurial && (style === 'independent' || style === 'flexible') && matchQuality > 0) {
        // Reduced boost for entrepreneurial careers to avoid over-weighting
        matchQuality *= 1.15; // 15% boost (reduced from 35%) for entrepreneurial matches
        matchType += '_entrepreneur_boosted';
      }
      
      if (matchQuality > 0) {
        // Calculate score contribution with improved formula
        const baseScore = 15 * styleInfo.importance * rankFactor;
        const styleScore = baseScore * matchQuality;
        workStyleScore += styleScore;
        
        // Track for breakdown
        workStyleMatches.push({
          style,
          weight: styleScore,
          matchQuality,
          matchType
        });
      }
    });
    
    // Second pass - check for style conflicts that might reduce satisfaction
    // This reflects research showing that conflicting work styles can cause job dissatisfaction
    let conflictPenalty = 0;
    
    for (const userStyle of topWorkStyles.slice(0, 2)) { // Check only top 2 styles for conflicts
      if (workStyleOpposites[userStyle]) {
        const oppositeStyle = workStyleOpposites[userStyle];
        
        // Check if career requires the opposite style
        if (workStyles.includes(oppositeStyle)) {
          // Calculate conflict penalty based on style importance and user preference ranking
          const userStyleRank = topWorkStyles.indexOf(userStyle);
          const conflictSeverity = userStyleRank === 0 ? 0.15 : 0.08; // More severe for top style
          conflictPenalty += workStyleScore * conflictSeverity;
          
          // Add to breakdown as a negative match
          workStyleMatches.push({
            style: `${userStyle}-${oppositeStyle}`,
            weight: -Math.round(workStyleScore * conflictSeverity), // Show as negative contribution
            matchQuality: 0,
            matchType: 'conflict'
          });
        }
      }
    }
    
    // Apply conflict penalty if any exists
    workStyleScore = Math.max(0, workStyleScore - conflictPenalty);
    
    // Apply normalized cap at 15 points total
    workStyleScore = Math.min(15, workStyleScore);
    scoringBreakdown.workStyle.score = workStyleScore;
    scoringBreakdown.workStyle.matches = workStyleMatches;
    
    // 3. COGNITIVE APPROACH MATCH (15% of total score)
    // Evaluates fit based on mental strengths required for the role
    // This component measures how the user's cognitive preferences align with job requirements
    const cognitiveMatches: {type: string, contribution: number, skillMatch: string, confidence: number}[] = [];
    
    // Define extended cognitive categories and their related career skills - ENHANCED
    const cognitiveCategories: {[key: string]: {
      keywords: string[],
      description: string,
      tradeRelevance: number // How relevant to trades (0-1)
    }} = {
      'problem-solving': {
        keywords: ['problem', 'analytical', 'debug', 'troubleshoot', 'solving', 'logic', 'diagnostic', 'resolve', 'fix', 'solution', 'optimize', 'determine'],
        description: 'Ability to identify, analyze and solve problems',
        tradeRelevance: 0.8 // Highly relevant to troubleshooting in trades
      },
      'creativity': {
        keywords: ['creative', 'design', 'innovation', 'artistic', 'original', 'novel', 'imagine', 'invent', 'develop', 'create', 'ideate', 'conceptualize'],
        description: 'Ability to generate new ideas and approaches',
        tradeRelevance: 0.6 // Moderately relevant to custom work in trades
      },
      'attention-to-detail': {
        keywords: ['detail', 'precision', 'accuracy', 'careful', 'meticulous', 'quality', 'thorough', 'exact', 'specific', 'scrutiny', 'methodical', 'procedural'],
        description: 'Ability to handle detailed and precise work with accuracy',
        tradeRelevance: 0.9 // Extremely relevant to quality work in trades
      },
      'spatial-reasoning': {
        keywords: ['spatial', 'visual', '3d', 'layout', 'positioning', 'structural', 'arrangement', 'dimensional', 'visualization', 'geometric', 'proportion'],
        description: 'Ability to understand and mentally manipulate spatial relationships',
        tradeRelevance: 0.9 // Extremely relevant to building/construction trades
      },
      'systems-thinking': {
        keywords: ['system', 'integration', 'workflow', 'process', 'holistic', 'interconnected', 'comprehensive', 'overview', 'architecture', 'framework'],
        description: 'Ability to see how components work together in a larger system',
        tradeRelevance: 0.7 // Relevant to understanding complex systems in trades
      }
    };
    
    // Enhanced mapping of user cognitive strengths to cognitive categories with confidence levels
    // This reflects how strongly each strength aligns with different cognitive categories
    const userCognitiveStrengths: {[key: string]: {categories: string[], confidence: number, tradeBoost: number}} = {
      'knowledge': {
        categories: ['problem-solving', 'attention-to-detail', 'systems-thinking'],
        confidence: 0.85, // High confidence in these matches
        tradeBoost: 0.15 // Some trade relevance
      },
      'skills': {
        categories: ['creativity', 'problem-solving', 'spatial-reasoning'],
        confidence: 0.9, // Very high confidence in these matches  
        tradeBoost: 0.25 // Strong trade relevance - practical skills
      },
      'experience': {
        categories: ['problem-solving', 'attention-to-detail', 'systems-thinking'],
        confidence: 0.8, // Strong confidence in these matches
        tradeBoost: 0.2 // Moderate trade relevance - practical knowledge
      },
      'learned': {
        categories: ['attention-to-detail', 'creativity', 'problem-solving'],
        confidence: 0.75, // Moderate confidence in these matches
        tradeBoost: 0.1 // Lower trade relevance - academic orientation
      }
    };
    
    // Get mini-game cognitive metrics if available for enhanced matching
    const miniGameMetrics = quizResults.miniGameMetrics;
    
    // Intermediate tracking for unique cognitive matches
    const matchedCategories = new Set<string>();
    
    // First pass: Deep skill analysis with mini-game integration
    career.skills.forEach(skill => {
      const skillLower = skill.toLowerCase();
      
      // For each cognitive category
      Object.entries(cognitiveCategories).forEach(([category, categoryInfo]) => {
        // Skip if we already matched this category
        if (matchedCategories.has(category)) return;
        
        // Check if this skill matches this cognitive category
        if (categoryInfo.keywords.some(keyword => skillLower.includes(keyword))) {
          // Find the strongest user strength that matches this category
          let bestMatch = {
            strength: '',
            confidenceLevel: 0,
            priorityFactor: 0,
            miniGameBoost: 0
          };
          
          topCognitiveStrengths.forEach((strength, index) => {
            const strengthInfo = userCognitiveStrengths[strength];
            if (strengthInfo?.categories.includes(category)) {
              // Calculate priority based on rank in user's top strengths
              const priorityFactor = 1 - (index * 0.15); // Reduced from 0.2 to 0.15 for less steep drop-off
              
              // If this strength is a better match than what we've seen so far
              if (strengthInfo.confidence * priorityFactor > bestMatch.confidenceLevel * bestMatch.priorityFactor) {
                bestMatch.strength = strength;
                bestMatch.confidenceLevel = strengthInfo.confidence;
                bestMatch.priorityFactor = priorityFactor;
              }
            }
          });
          
          // If we found a match
          if (bestMatch.strength) {
            // Check for mini-game boosts
            if (miniGameMetrics) {
              // Add boosts based on mini-game metrics
              // Problem-solving boost from Decision Making
              if (category === 'problem-solving' && miniGameMetrics.decisionMaking && miniGameMetrics.decisionMaking > 70) {
                bestMatch.miniGameBoost += 0.15; // 15% boost for fast decision makers
               //  console.log(`Decision making boost for ${category}: +15%`);
              }
              
              // Attention-to-detail boost from Attention Control
              if (category === 'attention-to-detail' && miniGameMetrics.attentionControl && miniGameMetrics.attentionControl > 70) {
                bestMatch.miniGameBoost += 0.2; // 20% boost for detail-oriented attention
               //  console.log(`Attention control boost for ${category}: +20%`);
              }
              
              // Spatial-reasoning boost from Multisensory Matrix
              if (category === 'spatial-reasoning' && miniGameMetrics.spatialAwareness && miniGameMetrics.spatialAwareness > 75) {
                bestMatch.miniGameBoost += 0.25; // 25% boost for high spatial reasoning
               //  console.log(`Spatial reasoning boost for ${category}: +25%`);
              }
              
              // Verbal boost from Verbo Flash
              if (category === 'verbal' && miniGameMetrics.verbalProcessing && miniGameMetrics.verbalProcessing > 75) {
                bestMatch.miniGameBoost += 0.2; // 20% boost for verbal processing
               //  console.log(`Verbal processing boost for ${category}: +20%`);
              }
              
              // Creativity boost from all mini-games for balanced brain dominance
              if (category === 'creativity' && miniGameMetrics.brainDominance === 'balanced') {
                bestMatch.miniGameBoost += 0.15; // 15% boost for balanced brain dominance
               //  console.log(`Brain dominance boost for ${category}: +15%`);
              }
              
              // Pattern recognition boost for analytical careers
              if (category === 'analytical' && miniGameMetrics.patternRecognition && miniGameMetrics.patternRecognition > 75) {
                bestMatch.miniGameBoost += 0.2; // 20% boost for pattern recognition
               //  console.log(`Pattern recognition boost for ${category}: +20%`);
              }
            }
            
            // Calculate base contribution (up to 5 points per matching category)
            const baseContribution = 5 * bestMatch.confidenceLevel * bestMatch.priorityFactor;
            
            // Apply mini-game boost if any
            const boostMultiplier = 1 + bestMatch.miniGameBoost;
            
            // Calculate trade relevance boost
            // Infer if this is likely a trade career
            const isTrade = 
              career.skills.some(skill => 
                ['trade', 'manual', 'craft', 'mechanical', 'repair', 'maintenance', 'construction', 'electrical', 'plumbing'].some(term => 
                  skill.toLowerCase().includes(term)
                )
              ) || 
              career.description.toLowerCase().includes('trade');
            
            // Apply trade boost if applicable
            const tradeBoostMultiplier = isTrade ? 
              (1 + (cognitiveCategories[category].tradeRelevance * userCognitiveStrengths[bestMatch.strength].tradeBoost)) : 1;
            
            // Combine all multipliers for final contribution
            const contribution = baseContribution * boostMultiplier * tradeBoostMultiplier;
            cognitiveScore += contribution;
            
            // Track for detailed breakdown
            cognitiveMatches.push({
              type: `${bestMatch.strength}-to-${category}`,
              contribution,
              skillMatch: skill,
              confidence: bestMatch.confidenceLevel
            });
            
            // Mark this category as matched
            matchedCategories.add(category);
          }
        }
      });
    });
    
    // Second pass: Career description analysis for broader pattern detection
    if (cognitiveMatches.length < 2) { // If we didn't find enough from skills
      const descriptionLower = career.description.toLowerCase();
      
      Object.entries(cognitiveCategories).forEach(([category, categoryInfo]) => {
        // Skip if we already matched this category
        if (matchedCategories.has(category)) return;
        
        // Check if the description contains any keywords for this category
        if (categoryInfo.keywords.some(keyword => descriptionLower.includes(keyword))) {
          // Find matching user strength as before
          const matchingStrength = topCognitiveStrengths.find(strength => 
            userCognitiveStrengths[strength]?.categories.includes(category)
          );
          
          if (matchingStrength) {
            // Lower contribution for description-based matches (less specific)
            const strengthIndex = topCognitiveStrengths.indexOf(matchingStrength);
            const priorityFactor = 1 - (strengthIndex * 0.2);
            const contribution = 3 * priorityFactor; // Reduced from 5 to 3 for description matches
            
            cognitiveScore += contribution;
            cognitiveMatches.push({
              type: `${matchingStrength}-to-${category} (description)`,
              contribution,
              skillMatch: "career description",
              confidence: 0.6 // Lower confidence for description matches
            });
            
            // Mark this category as matched
            matchedCategories.add(category);
          }
        }
      });
    }
    
    // Third pass: Special case matches for specific career types
    
    // Special case 1: If career requires broad knowledge and user has 'knowledge' strength
    if (!matchedCategories.has('systems-thinking') && 
        career.skills.some(skill => 
          ['research', 'knowledge', 'learning', 'study', 'analytical'].some(term => 
            skill.toLowerCase().includes(term)
          )) && 
        topCognitiveStrengths.includes('knowledge')
    ) {
      const contribution = 5;
      cognitiveScore += contribution;
      cognitiveMatches.push({
        type: 'knowledge-systems-special',
        contribution,
        skillMatch: "research/analytical skills",
        confidence: 0.85
      });
      matchedCategories.add('systems-thinking');
    }
    
    // Special case 2: Mini-game metrics without direct skill matches
    if (miniGameMetrics && miniGameMetrics.motorControl && miniGameMetrics.motorControl > 80) {
      // High motor control boost for trades or technical roles
      if (!matchedCategories.has('attention-to-detail') && 
          career.skills.some(skill => 
            ['manual', 'technical', 'operate', 'equipment', 'machinery', 'instrument'].some(term => 
              skill.toLowerCase().includes(term)
            ))
      ) {
        const contribution = 4;
        cognitiveScore += contribution;
        cognitiveMatches.push({
          type: 'mini-game-motor-precision-special',
          contribution,
          skillMatch: "manual precision requirements",
          confidence: 0.8
        });
        matchedCategories.add('attention-to-detail');
       //  console.log(`Applied motor precision special boost: +${contribution} points`);
      }
    }
    
    // Cap cognitive score at 15
    cognitiveScore = Math.min(15, Math.round(cognitiveScore));
    scoringBreakdown.cognitive.score = cognitiveScore;
    scoringBreakdown.cognitive.matches = cognitiveMatches;
    
    // 4. SOCIAL TRAITS COMPATIBILITY (10% of total score)
    // Assesses personality dynamics in workplace relationships
    // This component evaluates fit between social traits and work environment
    const socialMatches: {trait: string, environment: string, contribution: number, matchType: string, tradeRelevance?: number}[] = [];
    const workEnvironmentSocial = career.workEnvironment?.toLowerCase() || '';
    const titleLower = career.title.toLowerCase();
    const descriptionLower = career.description.toLowerCase();
    
    // Check for trade career indicators - important for social context matching
    const isTrade = 
      career.skills.some(skill => 
        ['trade', 'manual', 'craft', 'mechanical', 'repair', 'maintenance', 'construction', 'electrical', 'plumbing'].some(term => 
          skill.toLowerCase().includes(term)
        )
      ) || 
      descriptionLower.includes('trade');
    
    // Define enhanced social dimensions with trade relevance and detailed matching
    type SocialDimension = {
      userTraits: string[];
      careerEnvironments: Record<string, string[]>;
      tradeRelevance: Record<string, number>; // How relevant each trait is to trades (0-1)
      maxScore: number;
      description: string; // For better result explanations
    };
    
    const socialDimensions: SocialDimension[] = [
      {
        // Introvert vs Extrovert dimension
        userTraits: ['introvert', 'extrovert'],
        careerEnvironments: {
          'introvert': [
            'independent', 'remote', 'focused', 'quiet', 'research', 'analysis', 'detail', 
            'technical', 'precise', 'behind-the-scenes', 'concentration', 'solo', 'specialized'
          ],
          'extrovert': [
            'team', 'client', 'interactive', 'customer', 'social', 'public', 'presentation', 
            'networking', 'collaborative', 'communication', 'outgoing', 'negotiation', 'sales'
          ]
        },
        tradeRelevance: {
          'introvert': 0.6, // Many trades allow for independent work
          'extrovert': 0.7  // Many trades involve client interaction and crew work
        },
        maxScore: 4, // Max contribution from this dimension
        description: 'Social energy preference and interaction style'
      },
      {
        // Leadership vs Support dimension
        userTraits: ['leader', 'supporter'],
        careerEnvironments: {
          'leader': [
            'manage', 'lead', 'direct', 'supervise', 'coordinate', 'oversee', 'guide',
            'strategy', 'decision', 'responsible', 'executive', 'administration', 'control'
          ],
          'supporter': [
            'assist', 'support', 'help', 'collaborate', 'contribute', 'team member', 
            'specialist', 'technical', 'operator', 'staff', 'implementer', 'crew'
          ]
        },
        tradeRelevance: {
          'leader': 0.7, // Foremen and senior trades often lead crews
          'supporter': 0.9  // Many entry-level trades are supportive roles
        },
        maxScore: 3, // Max contribution from this dimension
        description: 'Preference for directing others vs contributing to a team'
      },
      {
        // Risk vs Stability dimension
        userTraits: ['risk-taker', 'cautious'],
        careerEnvironments: {
          'risk-taker': [
            'startup', 'innovative', 'changing', 'dynamic', 'entrepreneurial',
            'cutting-edge', 'progressive', 'disruptive', 'challenging', 'pioneering'
          ],
          'cautious': [
            'stable', 'established', 'consistent', 'traditional', 'reliable',
            'proven', 'methodical', 'safe', 'structured', 'secure', 'regulated'
          ]
        },
        tradeRelevance: {
          'risk-taker': 0.5, // Some trades involve entrepreneurial opportunities
          'cautious': 0.8  // Many trades value safety and following established procedures
        },
        maxScore: 3, // Max contribution from this dimension
        description: 'Preference for stability vs innovation and risk'
      }
    ];
    
    // First pass: Environment-based matching with enhanced detection
    socialDimensions.forEach(dimension => {
      // Find which trait in this dimension the user has
      const userTrait = dominantSocialTraits.find(trait => dimension.userTraits.includes(trait));
      
      if (userTrait) {
        // Get the environments that match this user trait
        const matchingEnvironments = dimension.careerEnvironments[userTrait] || [];
        
        // Multi-level matching with source tracking
        let matchFound = false;
        let matchSource = '';
        let matchLevel = 0;
        
        // Level 1: Work environment explicit match (highest quality)
        if (workEnvironmentSocial && matchingEnvironments.some(env => workEnvironmentSocial.includes(env))) {
          matchFound = true;
          matchSource = 'environment';
          matchLevel = 1.0;
        }
        // Level 2: Description-based match (medium quality)
        else if (descriptionLower && matchingEnvironments.some(env => descriptionLower.includes(env))) {
          matchFound = true;
          matchSource = 'description';
          matchLevel = 0.8;
        }
        // Level 3: Title-based match (lower quality but still relevant)
        else if (titleLower && matchingEnvironments.some(env => titleLower.includes(env))) {
          matchFound = true;
          matchSource = 'title';
          matchLevel = 0.7;
        }
        // Level 4: Skills-based inference (lowest quality direct match)
        else if (career.skills.some(skill => 
          matchingEnvironments.some(env => skill.toLowerCase().includes(env))
        )) {
          matchFound = true;
          matchSource = 'skills';
          matchLevel = 0.6;
        }
        
        // Add trade-specific matching for improved trade focus
        if (isTrade && !matchFound) {
          // Get the trade relevance for this trait
          const tradeRelevance = dimension.tradeRelevance[userTrait] || 0;
          
          // If this trait is highly relevant to trades, count it even without explicit keywords
          if (tradeRelevance > 0.7) {
            matchFound = true;
            matchSource = 'trade_inference';
            matchLevel = 0.65 * tradeRelevance; // Scale match quality by trade relevance
          }
        }
        
        if (matchFound) {
          // Calculate contribution with match quality factor
          const traitIndex = dominantSocialTraits.indexOf(userTrait);
          const priorityFactor = 1 - (traitIndex * 0.15); // Reduced from 0.2 to 0.15
          
          // Apply match level to score
          const contribution = dimension.maxScore * priorityFactor * matchLevel;
          socialScore += contribution;
          
          // Track for detailed breakdown
          socialMatches.push({
            trait: userTrait,
            environment: matchSource,
            contribution,
            matchType: matchSource,
            tradeRelevance: isTrade ? dimension.tradeRelevance[userTrait] : undefined
          });
        }
      }
    });
    
    // Enhanced mini-game integration for social traits with deeper psychological profiling
    if (miniGameMetrics) {
      // Add insights from mini-game performance with improved career relevance mapping
      
      // ------------------------------------------------------------------------
      // Social trait assessment based on multitasking ability 
      // ------------------------------------------------------------------------
      if (miniGameMetrics.multitaskingAbility) {
        const mtScore = miniGameMetrics.multitaskingAbility;
        
        // Extrovert boost - extroverts often excel in environments requiring juggling multiple social interactions
        if (mtScore > 70 && dominantSocialTraits.includes('extrovert') && 
            !socialMatches.some(m => m.trait === 'extrovert')) {
          
          // Check if career involves multi-tasking social environments
          if (descriptionLower.includes('multi') || 
              descriptionLower.includes('fast-paced') || 
              descriptionLower.includes('dynamic') ||
              descriptionLower.includes('juggl') ||
              descriptionLower.includes('simultaneously') ||
              workStyles.includes('team')) {
            
            // Scale contribution based on score intensity
            const contribution = 1 + Math.floor(mtScore / 25); // 1-4 points based on performance
            socialScore += contribution;
            socialMatches.push({
              trait: 'extrovert',
              environment: 'multi-faceted-social-environments',
              contribution,
              matchType: 'mini_game_insight'
            });
           //  console.log(`Applied multitasking boost for extrovert: +${contribution} points`);
          }
        }
        
        // Team player boost - coordinate well with others in collaborative settings
        if (mtScore > 65 && dominantSocialTraits.includes('team-player') && 
            !socialMatches.some(m => m.trait === 'team-player')) {
          
          if (descriptionLower.includes('team') || 
              descriptionLower.includes('collaborate') || 
              descriptionLower.includes('coordinate') ||
              workStyles.includes('team')) {
            
            const contribution = 1 + Math.floor(mtScore / 30); // 1-3 points
            socialScore += contribution;
            socialMatches.push({
              trait: 'team-player',
              environment: 'collaborative-workplaces',
              contribution,
              matchType: 'mini_game_insight'
            });
          }
        }
      }
      
      // ------------------------------------------------------------------------
      // Social trait assessment based on decision speed/quality
      // ------------------------------------------------------------------------
      if (miniGameMetrics.decisionSpeed) {
        const decSpeed = miniGameMetrics.decisionSpeed;
        
        // Leadership boost - fast, confident decision-making is a hallmark of effective leadership
        if (decSpeed > 75 && dominantSocialTraits.includes('leader') && 
            !socialMatches.some(m => m.trait === 'leader')) {
          
          // Check if career involves leadership roles requiring decisive action
          if (descriptionLower.includes('decision') || 
              descriptionLower.includes('leadership') || 
              descriptionLower.includes('manage') ||
              descriptionLower.includes('direct') ||
              descriptionLower.includes('guide') ||
              titleLower.includes('manager') ||
              titleLower.includes('director') ||
              titleLower.includes('lead')) {
            
            const contribution = 2 + Math.floor(decSpeed / 25); // 2-5 points based on performance
            socialScore += contribution;
            socialMatches.push({
              trait: 'leader',
              environment: 'high-impact-decision-making',
              contribution,
              matchType: 'mini_game_insight'
            });
           //  console.log(`Applied decision making boost for leader: +${contribution} points`);
          }
        }
        
        // Independent worker boost - autonomous decision-making is critical for self-directed roles
        if (decSpeed > 70 && dominantSocialTraits.includes('independent') && 
            !socialMatches.some(m => m.trait === 'independent')) {
          
          if (descriptionLower.includes('independent') || 
              descriptionLower.includes('self-directed') || 
              descriptionLower.includes('autonomous') ||
              descriptionLower.includes('initiative') ||
              workStyles.includes('independent')) {
            
            const contribution = 1 + Math.floor(decSpeed / 30); // 1-3 points
            socialScore += contribution;
            socialMatches.push({
              trait: 'independent',
              environment: 'autonomous-work-settings',
              contribution,
              matchType: 'mini_game_insight'
            });
          }
        }
      }
      
      // ------------------------------------------------------------------------
      // Social trait assessment based on pattern recognition - crucial for strategic roles
      // ------------------------------------------------------------------------
      if (miniGameMetrics.patternRecognition) {
        const patternScore = miniGameMetrics.patternRecognition;
        
        // Risk-taker assessment - pattern recognition combined with quick insight supports calculated risk-taking
        if (patternScore > 70 && dominantSocialTraits.includes('risk-taker') && 
            !socialMatches.some(m => m.trait === 'risk-taker')) {
          
          // Check if career involves innovation, trends analysis, or strategic planning
          if (descriptionLower.includes('innovat') || 
              descriptionLower.includes('trend') || 
              descriptionLower.includes('strat') ||
              descriptionLower.includes('disrupt') ||
              descriptionLower.includes('adapt') ||
              descriptionLower.includes('entrepreneur') ||
              titleLower.includes('founder') ||
              titleLower.includes('strategist')) {
            
            const contribution = 1 + Math.floor(patternScore / 25); // 1-4 points
            socialScore += contribution;
            socialMatches.push({
              trait: 'risk-taker',
              environment: 'innovative-adaptive-settings',
              contribution,
              matchType: 'mini_game_insight'
            });
           //  console.log(`Applied pattern recognition boost for risk-taker: +${contribution} points`);
          }
        }
        
        // Strategic thinker boost - pattern recognition is fundamental to strategic planning
        if (patternScore > 75 && dominantSocialTraits.includes('strategic') && 
            !socialMatches.some(m => m.trait === 'strategic')) {
          
          if (descriptionLower.includes('strategy') || 
              descriptionLower.includes('plan') || 
              descriptionLower.includes('analyze') ||
              descriptionLower.includes('forecast') ||
              titleLower.includes('analyst') ||
              titleLower.includes('strategist') ||
              titleLower.includes('planner')) {
            
            const contribution = 2 + Math.floor(patternScore / 25); // 2-5 points
            socialScore += contribution;
            socialMatches.push({
              trait: 'strategic',
              environment: 'strategic-planning-roles',
              contribution,
              matchType: 'mini_game_insight'
            });
          }
        }
      }
      
      // ------------------------------------------------------------------------
      // Social trait assessment based on stress response - vital for pressure environments
      // ------------------------------------------------------------------------
      if (miniGameMetrics.stressResponse) {
        const stressLevel = miniGameMetrics.stressResponse;
        
        // Match stress tolerance to appropriate careers
        if ((stressLevel === 'low' && dominantSocialTraits.includes('calm')) ||
            (stressLevel === 'high' && dominantSocialTraits.includes('resilient'))) {
          
          // Check for high-pressure environments or crisis management roles
          const highPressureTerms = [
            'pressure', 'deadline', 'emergency', 'critical', 'urgent', 'life-saving',
            'crisis', 'stress', 'demanding', 'high-stakes', 'time-sensitive'
          ];
          
          const isHighPressure = highPressureTerms.some(term => 
            descriptionLower.includes(term) || titleLower.includes(term)
          );
          
          if (isHighPressure) {
            const contribution = stressLevel === 'high' ? 3 : 2;
            socialScore += contribution;
            socialMatches.push({
              trait: stressLevel === 'high' ? 'resilient' : 'calm',
              environment: 'high-pressure-environments',
              contribution,
              matchType: 'mini_game_insight'
            });
          }
        }
      }
    }
    
    // Third pass: Special case direct title matching for leadership roles with boosted confidence
    if ((titleLower.includes('manager') || 
         titleLower.includes('director') || 
         titleLower.includes('lead') || 
         titleLower.includes('chief') ||
         titleLower.includes('supervisor') ||
         titleLower.includes('foreman')) && 
        dominantSocialTraits.includes('leader') &&
        !socialMatches.some(m => m.trait === 'leader')) {
          
      const contribution = 3;
      socialScore += contribution;
      socialMatches.push({
        trait: 'leader',
        environment: 'leadership-title-explicit',
        contribution,
        matchType: 'title_explicit'
      });
    }
    
    // Special case for trade-specific social dynamics
    if (isTrade) {
      // Trades often involve hands-on team collaboration
      if (dominantSocialTraits.includes('supporter') && 
          !socialMatches.some(m => m.trait === 'supporter')) {
        
        const contribution = 2;
        socialScore += contribution;
        socialMatches.push({
          trait: 'supporter',
          environment: 'trade-team-dynamics',
          contribution,
          matchType: 'trade_specific',
          tradeRelevance: 0.9
        });
      }
      
      // Many trades value detail-oriented, methodical people
      if (dominantSocialTraits.includes('cautious') && 
          !socialMatches.some(m => m.trait === 'cautious')) {
        
        const contribution = 2;
        socialScore += contribution;
        socialMatches.push({
          trait: 'cautious',
          environment: 'trade-precision-focus',
          contribution,
          matchType: 'trade_specific',
          tradeRelevance: 0.85
        });
      }
    }
    
    // Cap social score at 10
    socialScore = Math.min(10, Math.round(socialScore));
    scoringBreakdown.social.score = socialScore;
    scoringBreakdown.social.matches = socialMatches;
    
    // 5. MOTIVATION ALIGNMENT (20% of total score) - SIGNIFICANTLY INCREASED
    // Motivation is now treated as the critical engine that drives career success and satisfaction
    // This reflects the insight from psychometric research that intrinsic motivation is the
    // strongest predictor of career longevity, satisfaction and achievement
    
    const motivationMatches: {
      motivation: string, 
      careerAttribute: string, 
      matchSource: string,
      matchQuality: number,
      contribution: number, 
      type: 'intrinsic'|'extrinsic',
      sustainability: number,
      tradeRelevance?: number
    }[] = [];
    
    // Enhanced motivation framework based on Self-Determination Theory and Maslow's hierarchy
    // This captures both intrinsic (more sustainable) and extrinsic (less sustainable) motivators
    const motivationMapping: {[key: string]: {
      importance: number, 
      sustainability: number,  // How well this motivation sustains long-term engagement (0-1)
      type: 'intrinsic'|'extrinsic',
      tradeRelevance: number, // How relevant this motivation is to trade careers (0-1)
      careerAttributes: string[],
      description: string,  // Human-readable description for explanations
      careerFields?: string[]  // Specific fields where this motivation is particularly aligned
    }} = {
      // INTRINSIC MOTIVATORS (more sustainable)
      'personal_goals': {
        importance: 0.8,
        sustainability: 0.8,
        type: 'intrinsic',
        tradeRelevance: 0.6,  // Moderate relevance to trades
        careerAttributes: ['growth', 'advancement', 'career-path', 'promotion', 'progress', 'development'],
        description: 'Drive to achieve personal objectives and advance one\'s position',
        careerFields: ['management', 'business', 'entrepreneur']
      },
      'helping_others': {
        importance: 1.0,
        sustainability: 0.9,
        type: 'intrinsic',
        tradeRelevance: 0.6,  // Some trades involve helping (e.g., emergency services, home repair)
        careerAttributes: ['help', 'teach', 'heal', 'therapy', 'nurse', 'doctor', 'social', 'service', 'care', 'counsel'],
        description: 'Desire to make a positive difference in others\' lives',
        careerFields: ['healthcare', 'education', 'social work', 'nonprofit', 'community']
      },
      'challenges': {
        importance: 0.9,
        sustainability: 0.8,
        type: 'intrinsic',
        tradeRelevance: 0.7,  // Many trades offer challenging problem-solving
        careerAttributes: ['challenging', 'competitive', 'difficult', 'complex', 'advanced', 'solving', 'technical'],
        description: 'Enjoyment of tackling difficult problems and mental challenges',
        careerFields: ['engineering', 'science', 'research', 'technology', 'finance']
      },
      'learning': {
        importance: 0.85,
        sustainability: 0.85,
        type: 'intrinsic',
        tradeRelevance: 0.7,  // Trades require continuous skill development
        careerAttributes: ['research', 'discover', 'academic', 'education', 'learning', 'development', 'knowledge'],
        description: 'Desire to continuously learn and acquire new knowledge',
        careerFields: ['science', 'education', 'research', 'technology']
      },
      'solving': {
        importance: 0.9,
        sustainability: 0.8,
        type: 'intrinsic',
        tradeRelevance: 0.9,  // Problem-solving is highly relevant to trades
        careerAttributes: ['problem', 'solving', 'technical', 'engineering', 'analytical', 'design', 'develop'],
        description: 'Satisfaction from troubleshooting and resolving complex problems',
        careerFields: ['engineering', 'technology', 'science', 'design']
      },
      'helping': {
        importance: 1.0,
        sustainability: 0.9,
        type: 'intrinsic',
        tradeRelevance: 0.75,  // Many trades provide direct help to people (e.g., plumbers, electricians)
        careerAttributes: ['service', 'support', 'help', 'assist', 'care', 'facilitate', 'enable'],
        description: 'Finding fulfillment in assisting others and providing valuable services',
        careerFields: ['healthcare', 'social work', 'education', 'customer service', 'community']
      },
      'accomplishment': {
        importance: 0.9,
        sustainability: 0.8,
        type: 'intrinsic',
        tradeRelevance: 0.9,  // Trades offer concrete accomplishments (e.g., completed projects)
        careerAttributes: ['results', 'achievement', 'success', 'impact', 'measurable', 'complete'],
        description: 'Satisfaction from seeing tangible results and completing meaningful work',
        careerFields: ['business', 'sales', 'entrepreneurship', 'management']
      },
      'autonomy': { // Added: key intrinsic motivator from Self-Determination Theory
        importance: 0.9, // Increased importance
        sustainability: 0.95, // Increased sustainability
        type: 'intrinsic',
        tradeRelevance: 0.95,  // Many trades offer high levels of autonomy, especially for independent contractors
        careerAttributes: [
          'independent', 'autonomous', 'self-directed', 'freedom', 'flexibility', 'own pace', 
          'leadership', 'decision-maker', 'entrepreneur', 'business-owner', 'founder', 'startup', 
          'self-employed', 'management', 'executive', 'ceo', 'ownership', 'venture'
        ],
        description: 'Desire for independence and ability to make own decisions in work',
        careerFields: ['entrepreneur', 'business ownership', 'startup', 'management', 'consulting', 'creative', 'research', 'trades']
      },
      'mastery': { // Added: key intrinsic motivator from Self-Determination Theory
        importance: 0.85, 
        sustainability: 0.9,
        type: 'intrinsic',
        tradeRelevance: 1.0,  // Mastery is the cornerstone of trade careers
        careerAttributes: ['skill', 'craft', 'expertise', 'artisan', 'specialist', 'perfect', 'master'],
        description: 'Pursuit of excellence and progressive skill development in a discipline',
        careerFields: ['trades', 'arts', 'crafts', 'sports', 'culinary']
      },
      'purpose': { // Added: key intrinsic motivator from Self-Determination Theory
        importance: 0.95,
        sustainability: 0.95, 
        type: 'intrinsic',
        tradeRelevance: 0.7,  // Trades can provide meaningful purpose through essential services
        careerAttributes: ['mission', 'purpose', 'meaning', 'impact', 'difference', 'legacy', 'important'],
        description: 'Connection to meaningful work that provides a sense of contribution to society',
        careerFields: ['nonprofit', 'healthcare', 'education', 'environment', 'social justice', 'infrastructure']
      },
      'creating': { // Added: important intrinsic motivator
        importance: 0.85,
        sustainability: 0.85,
        type: 'intrinsic',
        tradeRelevance: 0.95,  // Nearly all trades involve creating, building, or repairing
        careerAttributes: ['create', 'build', 'design', 'develop', 'produce', 'craft', 'make', 'invent'],
        description: 'Enjoyment from producing tangible work and building things with one\'s hands',
        careerFields: ['arts', 'design', 'engineering', 'architecture', 'writing', 'trades']
      },
      
      // EXTRINSIC MOTIVATORS (less sustainable long-term but still important)
      'recognition': {
        importance: 0.75,
        sustainability: 0.6,
        type: 'extrinsic',
        tradeRelevance: 0.4,  // Some trades can receive recognition but less commonly than other careers
        careerAttributes: ['creative', 'public', 'awards', 'prestige', 'respected', 'recognized', 'status'],
        description: 'Desire to be acknowledged by peers and recognized for one\'s work',
        careerFields: ['entertainment', 'politics', 'media', 'marketing']
      },
      'rewards': {
        importance: 0.7,
        sustainability: 0.5,
        type: 'extrinsic',
        tradeRelevance: 0.7,  // Many trades offer competitive compensation, especially with experience
        careerAttributes: ['high-salary', 'commission', 'bonus', 'compensation', 'benefits', 'incentives'],
        description: 'Motivation driven by financial compensation and material benefits',
        careerFields: ['finance', 'sales', 'law', 'executive', 'technology', 'specialized trades']
      },
      'growth': {
        importance: 0.8,
        sustainability: 0.7,
        type: 'extrinsic',
        tradeRelevance: 0.6,  // Trades offer advancement through increased expertise/specialization
        careerAttributes: ['advancement', 'promotion', 'career-path', 'rising', 'progressing'],
        description: 'Desire for career advancement and increasing responsibility over time',
        careerFields: ['business', 'corporate', 'government', 'management', 'trades']
      },
      'security': { // Added: important extrinsic motivator
        importance: 0.75,
        sustainability: 0.65,
        type: 'extrinsic',
        tradeRelevance: 0.8,  // Skilled trades typically offer high job security due to consistent demand
        careerAttributes: ['stable', 'secure', 'reliable', 'consistent', 'established', 'safe'],
        description: 'Preference for stable work with predictable income and long-term prospects',
        careerFields: ['government', 'healthcare', 'education', 'utilities', 'established corporations', 'essential trades']
      }
    };
    
    // Calculate intrinsic vs extrinsic motivation balance
    const intrinsicCount = topMotivations.filter(m => 
      motivationMapping[m]?.type === 'intrinsic'
    ).length;
    
    const extrinsicCount = topMotivations.filter(m => 
      motivationMapping[m]?.type === 'extrinsic'
    ).length;
    
    // Intrinsic motivation bonus - research shows intrinsic motivation leads to better career outcomes
    const intrinsicRatio = intrinsicCount / Math.max(1, (intrinsicCount + extrinsicCount));
    const intrinsicBonus = Math.round(intrinsicRatio * 4); // Up to 4 extra points for fully intrinsic motivation
    
    if (intrinsicBonus > 0) {
      motivationScore += intrinsicBonus;
      motivationMatches.push({
        motivation: 'intrinsic_bias',
        careerAttribute: 'sustainability',
        matchSource: 'analysis',
        matchQuality: 0.9,
        contribution: intrinsicBonus,
        type: 'intrinsic',
        sustainability: 0.9
      });
    }
    
    // Score based on salary for reward-motivated individuals
    const salaryNumber = parseInt(career.salary.replace(/[^0-9]/g, ''), 10);
    if (salaryNumber > 80000 && 
        (topMotivations.includes('rewards') || topMotivations.includes('recognition'))) {
      const motivation = topMotivations.includes('rewards') ? 'rewards' : 'recognition';
      // More generous salary scaling for financial motivators
      const contribution = Math.min(6, (salaryNumber - 80000) / 20000); 
      
      motivationScore += contribution;
      motivationMatches.push({
        motivation,
        careerAttribute: 'high-salary',
        matchSource: 'salary_analysis',
        matchQuality: 0.85,
        contribution,
        type: 'extrinsic',
        sustainability: 0.6
      });
    }
    
    // Direct field matching - strong predictor of motivational alignment
    // This checks if the career directly relates to motivational fields
    topMotivations.forEach((motivation, index) => {
      const info = motivationMapping[motivation];
      if (!info || !info.careerFields) return;
      
      // Get career field from title and description
      const careerText = `${career.title.toLowerCase()} ${career.description.toLowerCase()}`;
      
      // Check if any fields directly match
      const matchingFields = info.careerFields.filter(field => 
        careerText.includes(field)
      );
      
      if (matchingFields.length > 0) {
        // Direct field match is a strong indicator of motivational alignment
        const priorityFactor = 1 - (index * 0.15); // Less diminishing for direct field matches
        const contribution = 6 * info.sustainability * priorityFactor;
        
        motivationScore += contribution;
        motivationMatches.push({
          motivation,
          careerAttribute: `field:${matchingFields.join(',')}`,
          matchSource: 'field_match',
          matchQuality: 0.9,
          contribution,
          type: info.type,
          sustainability: info.sustainability || 0.7
        });
      }
    });
    
    // Check each motivation against career attributes in more depth
    topMotivations.forEach((motivation, index) => {
      const info = motivationMapping[motivation];
      if (!info) return;
      
      // Less diminishing returns for motivation (motivation sustainability matters more)
      const priorityFactor = 1 - (index * 0.15); 
      
      // Check career title, description, and skills for motivation attributes
      const careerText = `${career.title.toLowerCase()} ${career.description.toLowerCase()} ${career.skills.join(' ').toLowerCase()}`;
      
      // Count how many attributes match
      const matchingAttributes = info.careerAttributes.filter(attr => 
        careerText.includes(attr)
      );
      
      if (matchingAttributes.length > 0) {
        // Calculate contribution with sustainability factor
        const matchFactor = Math.min(1, matchingAttributes.length / 2); // Up to 2 matches for full points
        const contribution = 6 * info.importance * info.sustainability * priorityFactor * matchFactor;
        
        motivationScore += contribution;
        
        // Track for breakdown
        motivationMatches.push({
          motivation,
          careerAttribute: matchingAttributes.join(','),
          matchSource: 'attribute_match',
          matchQuality: Math.min(0.85, matchingAttributes.length * 0.25),
          contribution,
          type: info.type,
          sustainability: info.sustainability || 0.7
        });
      }
    });
    
    // Enhanced growth potential matching
    if (career.growth.includes('+')) {
      const growthNumber = parseInt(career.growth.match(/\+(\d+)%/)?.[1] || '0', 10);
      
      // Match different growth motivations differently
      if (topMotivations.includes('growth')) {
        // Direct growth motivation
        const contribution = Math.min(5, growthNumber / 8); // More generous scaling
        motivationScore += contribution;
        motivationMatches.push({
          motivation: 'growth',
          careerAttribute: 'growth-potential',
          matchSource: 'growth_data',
          matchQuality: 0.8,
          contribution,
          type: 'extrinsic',
          sustainability: 0.7
        });
      } 
      else if (topMotivations.includes('challenges') || topMotivations.includes('accomplishment')) {
        // Indirect growth motivation through challenges or accomplishment
        const motivation = topMotivations.includes('challenges') ? 'challenges' : 'accomplishment';
        const contribution = Math.min(3, growthNumber / 10);
        motivationScore += contribution;
        motivationMatches.push({
          motivation,
          careerAttribute: 'growth-potential',
          matchSource: 'growth_data',
          matchQuality: 0.75,
          contribution,
          type: 'intrinsic',
          sustainability: 0.8
        });
      }
    }
    
    // Special case for trades and motivation alignment - reuse the isTrade variable from above
    
    if (isTrade) {
      // Trade careers align particularly well with certain motivations
      const tradeAlignedMotivations = ['mastery', 'autonomy', 'creating', 'accomplishment'];
      const matchingMotivations = topMotivations.filter(m => tradeAlignedMotivations.includes(m));
      
      if (matchingMotivations.length > 0) {
        const contribution = Math.min(6, matchingMotivations.length * 2);
        motivationScore += contribution;
        motivationMatches.push({
          motivation: matchingMotivations.join(','),
          careerAttribute: 'trade-alignment',
          matchSource: 'trade_analysis',
          matchQuality: 0.95,
          contribution,
          type: 'intrinsic',
          sustainability: 0.9,
          tradeRelevance: 1.0
        });
      }
    }
    
    // Special case for entrepreneurial careers - using the isEntrepreneurial variable from work style section
    const isEntrepreneurial = 
      career.title.toLowerCase().includes('entrepreneur') || 
      career.title.toLowerCase().includes('business owner') ||
      career.description.toLowerCase().includes('entrepreneur') ||
      career.description.toLowerCase().includes('business owner') ||
      career.description.toLowerCase().includes('start your own') ||
      career.description.toLowerCase().includes('leadership') ||
      career.skills.some(skill => 
        ['leadership', 'entrepreneurial', 'business', 'management', 'strategy', 'innovation', 'risk-taking'].some(term => 
          skill.toLowerCase().includes(term)
        )
      );
      
    if (isEntrepreneurial) {
      // Entrepreneurial careers align particularly well with certain motivations
      const entrepreneurAlignedMotivations = ['autonomy', 'personal_goals', 'accomplishment', 'challenges', 'creating', 'recognition'];
      const matchingMotivations = topMotivations.filter(m => entrepreneurAlignedMotivations.includes(m));
      
      if (matchingMotivations.length > 0) {
        // Reduced the multiplier to avoid over-boosting entrepreneurial careers
        const contribution = Math.min(5, matchingMotivations.length * 1.5); 
        motivationScore += contribution;
        motivationMatches.push({
          motivation: matchingMotivations.join(','),
          careerAttribute: 'entrepreneur-alignment',
          matchSource: 'entrepreneur_analysis',
          matchQuality: 0.85, // Reduced from 0.95
          contribution,
          type: 'intrinsic',
          sustainability: 0.9
        });
      }
    }
    
    // Cap motivation score at 20 (increased from 5 to reflect its critical importance)
    motivationScore = Math.min(20, motivationScore);
    scoringBreakdown.motivation.score = motivationScore;
    scoringBreakdown.motivation.matches = motivationMatches;
    
    // ALGORITHM OUTPUT LOGGING
   //  console.log('CAREER MATCHING ALGORITHM - DETAILED OUTPUT');
   //  console.log('==========================================');
   //  console.log(`Career being evaluated: ${career.title}`);
   //  console.log(`Is this a trade career? ${isTrade ? 'YES' : 'NO'}`);
   //  console.log(`User's top motivations: ${topMotivations.join(', ')}`);
   //  console.log('Motivation matching breakdown:');
    motivationMatches.forEach(match => {
     //  console.log(`  - ${match.motivation}: +${match.contribution.toFixed(1)} points (${match.matchSource}: ${match.careerAttribute})`);
    });
   //  console.log(`Final motivation score: ${motivationScore.toFixed(1)} / 20`);
    
    if (miniGameBonus > 0) {
     //  console.log(`Mini-game metrics bonus: +${miniGameBonus.toFixed(1)} points`);
    }
    
    if (isTrade && tradeCareerBonus > 0) {
     //  console.log(`Trade career bonus: +${tradeCareerBonus.toFixed(1)} points`);
    }
    
    // Percentage breakdown
    const totalPossibleScore = 100;
    const interestPercent = (interestScore / 20) * 100;
    const workStylePercent = (workStyleScore / 15) * 100;
    const cognitivePercent = (cognitiveScore / 15) * 100;
    const socialPercent = (socialScore / 10) * 100;
    const motivationPercent = (motivationScore / 20) * 100;
    const miniGamePercent = (miniGameBonus / 10) * 100;
    const tradeCareerPercent = (tradeCareerBonus / 10) * 100;
    
   //  console.log('SCORING BREAKDOWN BY PERCENTAGE:');
   //  console.log(`Interest Score: ${interestPercent.toFixed(1)}% (${interestScore.toFixed(1)}/20)`);
   //  console.log(`Work Style Score: ${workStylePercent.toFixed(1)}% (${workStyleScore.toFixed(1)}/15)`);
   //  console.log(`Cognitive Score: ${cognitivePercent.toFixed(1)}% (${cognitiveScore.toFixed(1)}/15)`);
   //  console.log(`Social Score: ${socialPercent.toFixed(1)}% (${socialScore.toFixed(1)}/10)`);
   //  console.log(`Motivation Score: ${motivationPercent.toFixed(1)}% (${motivationScore.toFixed(1)}/20)`);
    
    if (miniGameBonus > 0) {
     //  console.log(`Mini-Game Bonus: ${miniGamePercent.toFixed(1)}% (${miniGameBonus.toFixed(1)}/10)`);
    }
    
    if (tradeCareerBonus > 0) {
     //  console.log(`Trade Career Bonus: ${tradeCareerPercent.toFixed(1)}% (${tradeCareerBonus.toFixed(1)}/10)`);
    }
    
    const totalPercentage = Math.min(100, (interestScore + workStyleScore + cognitiveScore + socialScore + motivationScore + miniGameBonus + tradeCareerBonus) / totalPossibleScore * 100);
   //  console.log(`TOTAL MATCH: ${totalPercentage.toFixed(1)}%`);
    
    // We'll store the percentage breakdown in match rather than
    // using a percentages property that doesn't exist in the interface
    const matchScoreDetails = {
      interest: interestPercent,
      workStyle: workStylePercent,
      cognitive: cognitivePercent,
      social: socialPercent,
      motivation: motivationPercent,
      miniGame: miniGamePercent,
      tradeCareer: tradeCareerPercent,
      total: totalPercentage
    };
    
    // CALCULATE TOTAL SCORE
    // Sum of all weighted category scores
    // Process mini-game metrics to provide additional score adjustments
    if (quizResults.miniGameMetrics) {
      const metrics = quizResults.miniGameMetrics;
      
      // 1. Mini Games metrics
      // Decision Making & Pattern Recognition boost for analytical roles
      if (metrics.decisionMaking && metrics.patternRecognition) {
        const analyticalRole = career.skills.some(skill => 
          ['analytical', 'strategy', 'planning', 'decision', 'management'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (analyticalRole) {
          // Calculate bonus based on decision making and pattern recognition
          const decisionBonus = (metrics.decisionMaking / 100) * 3; // Max 3 points
          const patternBonus = (metrics.patternRecognition / 100) * 2; // Max 2 points
          
          miniGameBonus += decisionBonus + patternBonus;
        }
      }
      
      // Brain dominance matches
      if (metrics.brainDominance) {
        // Left brain (analytical) boost for technical careers
        if (metrics.brainDominance === 'left' && career.skills.some(skill => 
          ['coding', 'programming', 'analysis', 'engineering', 'mathematics'].some(term => 
            skill.toLowerCase().includes(term)
          )
        )) {
          miniGameBonus += 3;
        }
        
        // Right brain (creative) boost for creative careers
        if (metrics.brainDominance === 'right' && career.skills.some(skill => 
          ['creative', 'design', 'artistic', 'visual', 'communication'].some(term => 
            skill.toLowerCase().includes(term)
          )
        )) {
          miniGameBonus += 3;
        }
        
        // Balanced brain is good for versatile roles
        if (metrics.brainDominance === 'balanced' && (career.title.includes('Manager') || 
            career.title.includes('Consultant') || career.title.includes('Coordinator'))) {
          miniGameBonus += 2.5;
        }
      }
      
      // Planning vs Reactive style based on attention control and response consistency
      if (metrics.attentionControl && metrics.responseConsistency) {
        // High attention & consistency = planner boost for roles requiring structure
        if (metrics.attentionControl > 70 && metrics.responseConsistency > 70 && workStyles.some(style => 
          ['structured', 'methodical', 'precise'].includes(style)
        )) {
          miniGameBonus += 2;
         //  console.log(`Structured planner bonus for ${career.title}: +2.0`);
        }
        
        // High attention but low consistency = reactive boost for roles requiring adaptability
        if (metrics.attentionControl > 70 && metrics.responseConsistency < 50 && workStyles.some(style => 
          ['flexible', 'adaptable', 'dynamic'].includes(style)
        )) {
          miniGameBonus += 2;
         //  console.log(`Adaptive planner bonus for ${career.title}: +2.0`);
        }
      }
      
      // 2. Mini Games Hub metrics
      
      // Visual Processing from Color Dash for design/visual roles
      if (metrics.visualProcessing && metrics.visualProcessing > 70) {
        const visualRole = career.skills.some(skill => 
          ['design', 'visual', 'graphic', 'art', 'media', 'imaging'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (visualRole) {
          const visualBonus = (metrics.visualProcessing / 100) * 3; // Max 3 points
          miniGameBonus += visualBonus;
         //  console.log(`Visual processing bonus for ${career.title}: +${visualBonus.toFixed(1)}`);
        }
      }
      
      // Spatial Reasoning from Multisensory Matrix for architecture/engineering roles
      if (metrics.spatialAwareness && metrics.spatialAwareness > 70) {
        const spatialRole = career.skills.some(skill => 
          ['architecture', 'engineering', 'spatial', 'navigation', 'construction'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (spatialRole) {
          const spatialBonus = (metrics.spatialAwareness / 100) * 3; // Max 3 points
          miniGameBonus += spatialBonus;
         //  console.log(`Spatial reasoning bonus for ${career.title}: +${spatialBonus.toFixed(1)}`);
        }
      }
      
      // Attention Control for precision and detail-oriented roles
      if (metrics.attentionControl && metrics.attentionControl > 70) {
        const detailRole = career.skills.some(skill => 
          ['detail', 'precision', 'accuracy', 'quality', 'inspection', 'careful'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (detailRole) {
          const attentionBonus = (metrics.attentionControl / 100) * 3; // Max 3 points
          miniGameBonus += attentionBonus;
         //  console.log(`Attention control bonus for ${career.title}: +${attentionBonus.toFixed(1)}`);
        }
      }
      
      // Verbal Processing from Verbo Flash for communication/writing roles
      if (metrics.verbalProcessing && metrics.verbalProcessing > 70) {
        const verbalRole = career.skills.some(skill => 
          ['communication', 'writing', 'verbal', 'language', 'speaking', 'presentation'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (verbalRole) {
          const verbalBonus = (metrics.verbalProcessing / 100) * 3; // Max 3 points
          miniGameBonus += verbalBonus;
         //  console.log(`Verbal processing bonus for ${career.title}: +${verbalBonus.toFixed(1)}`);
        }
      }
      
      // Memory Capacity for knowledge-intensive roles
      if (metrics.memoryCapacity && metrics.memoryCapacity > 70) {
        const memoryRole = career.skills.some(skill => 
          ['knowledge', 'memory', 'learning', 'retention', 'recall', 'research'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (memoryRole) {
          const memoryBonus = (metrics.memoryCapacity / 100) * 3; // Max 3 points
          miniGameBonus += memoryBonus;
         //  console.log(`Memory capacity bonus for ${career.title}: +${memoryBonus.toFixed(1)}`);
        }
      }
      
      // 3. Mini Games motor and cognitive metrics
      // Motor control for hands-on careers
      if (metrics.motorControl && metrics.motorControl > 70) {
        const handsOnRole = career.skills.some(skill => 
          ['manual', 'physical', 'hands-on', 'dexterity', 'craft', 'surgical'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (handsOnRole) {
          const coordinationBonus = (metrics.motorControl / 100) * 3; // Max 3 points
          miniGameBonus += coordinationBonus;
         //  console.log(`Motor control bonus for ${career.title}: +${coordinationBonus.toFixed(1)}`);
        }
      }
      
      // Multitasking ability for fast-paced careers
      if (metrics.multiTaskingScore && metrics.multiTaskingScore > 70) {
        const multitaskRole = career.workEnvironment?.toLowerCase?.().includes('fast-paced') || 
          career.skills.some(skill => 
            ['multitask', 'dynamic', 'fast', 'simultaneous', 'coordinate'].some(term => 
              skill.toLowerCase().includes(term)
            )
          );
        
        if (multitaskRole) {
          const multitaskBonus = (metrics.multiTaskingScore / 100) * 3; // Max 3 points
          miniGameBonus += multitaskBonus;
         //  console.log(`Multitasking bonus for ${career.title}: +${multitaskBonus.toFixed(1)}`);
        }
      }
      
      // Processing speed for adapting to new technologies
      if (metrics.processingSpeed && metrics.processingSpeed > 70) {
        const adaptiveRole = career.skills.some(skill => 
          ['adapt', 'learn', 'technology', 'evolving', 'innovative'].some(term => 
            skill.toLowerCase().includes(term)
          )
        );
        
        if (adaptiveRole) {
          const learningBonus = (metrics.processingSpeed / 100) * 3; // Max 3 points
          miniGameBonus += learningBonus;
         //  console.log(`Processing speed bonus for ${career.title}: +${learningBonus.toFixed(1)}`);
        }
      }
      
      // No special treatment for entrepreneurial careers
      // Leadership and management skills are already adequately assessed through 
      // other metrics like decision making and cognitive abilities
      
      // Attention stability for high-pressure careers
      if (metrics.attentionControl && metrics.attentionControl > 75) {
        const pressureRole = career.workEnvironment?.toLowerCase?.().includes('high-pressure') || 
          career.skills.some(skill => 
            ['pressure', 'stress', 'deadline', 'emergency', 'critical'].some(term => 
              skill.toLowerCase().includes(term)
            )
          );
        
        if (pressureRole) {
          const stabilityBonus = (metrics.attentionControl / 100) * 3; // Max 3 points
          miniGameBonus += stabilityBonus;
         //  console.log(`Attention stability bonus for ${career.title}: +${stabilityBonus.toFixed(1)}`);
        }
      }
      
      // Cap the mini-game bonus to avoid overweighting
      miniGameBonus = Math.min(10, miniGameBonus);
    }
    
    // Calculate total match percentage (sum of all factors + mini-game bonus)
    // -------------------------------------------------------
    // TRADE CAREER IDENTIFICATION
    // -------------------------------------------------------
    // Identify trade careers but don't give them any special preference
    // Only show trade careers when users are genuinely suited for them
    
    // Check if this is a trade career based on multiple indicators
    const isTradeCareer = 
      career.skills.some(skill => 
        ['trade', 'craft', 'mechanical', 'electrical', 'plumbing', 'carpentry', 'welding', 
         'construction', 'installation', 'repair', 'maintenance', 'fabrication', 'technician'].some(term => 
          skill.toLowerCase().includes(term)
        )
      ) || 
      career.title.toLowerCase().match(/technician|mechanic|electrician|plumber|carpenter|welder|operator|machinist|repairer|installer/) !== null;
    
    // No special boosts for trade careers - they'll be scored like any other career
    // This ensures trade careers only appear when users are truly suited for them
    tradeCareerBonus = 0;
    
    // -------------------------------------------------------
    // CALCULATE FINAL SCORE
    // -------------------------------------------------------
    
    // ENHANCED FINAL SCORING SYSTEM
    // Designed to create meaningful differentiation between careers
    // while ensuring at least 3-5 highly relevant recommendations
    
    // Sum of all scoring dimensions 
    const rawTotalScore = interestScore + workStyleScore + cognitiveScore + socialScore + motivationScore + miniGameBonus + tradeCareerBonus;
    
    // Apply dynamic enhancement if interest match found to ensure high personalization
    let enhancedScore = rawTotalScore;
    
    // Interest-based enhancement - critical to show users careers they're interested in
    if (interestScore > 15) {
      // Apply progressive boost to careers with strong interest matches
      // This ensures careers with high interest alignment rise to the top
      const interestBoost = Math.pow(interestScore/40, 1.2) * 15; // Up to 15 point boost
      enhancedScore += interestBoost;
    }
    
    // User engagement boost - for careers with balanced scores in multiple dimensions
    // This ensures well-rounded matches that align across categories
    const dimensionCount = [
      interestScore > 8,
      workStyleScore > 7,
      cognitiveScore > 7,
      socialScore > 5, 
      motivationScore > 8
    ].filter(Boolean).length;
    
    if (dimensionCount >= 3) {
      // Boost for well-rounded matches (good in 3+ dimensions)
      enhancedScore += dimensionCount * 2;
    }
    
    // Normalize to maximum of 100
    const matchPercentage = Math.min(Math.round(enhancedScore), 100);
    
    // Apply intelligent graduated scale for more meaningful score distribution
    // This avoids the problem of too many low-percentage matches
    let finalMatchPercentage = matchPercentage;
    
    // Meaningful score transformation with three tiers
    if (matchPercentage < 8) {
      // Lowest tier - ensure minimum useful score that still preserves differences
      finalMatchPercentage = 5 + (matchPercentage * 0.6); // 0-7% becomes 5-9%
    } else if (matchPercentage < 20) {
      // Middle tier - gentle boost to make mid-range more relevant
      finalMatchPercentage = 9 + (matchPercentage * 0.7); // 8-19% becomes 14-22%
    } else {
      // Top tier - careers with genuinely good matches, minimal adjustment
      finalMatchPercentage = Math.max(22, matchPercentage);
    }
    
    return {
      id: career.id || career.title.toLowerCase().replace(/\s+/g, '_'),
      title: career.title,
      description: career.description,
      match: finalMatchPercentage,
      skills: career.skills,
      imagePath: career.imagePath,
      salary: career.salary,
      growth: career.growth,
      category: career.category || determineCareerCategory(career.title)
    };
  });
  
  // Debug diagnostic info for tuning the algorithm
 //  console.log("SCORING BREAKDOWN BY PERCENTAGE:");
  // Use debugging logs without reference to variables outside of scope
  scoredCareers.forEach(career => {
   //  console.log(`Career: ${career.title}, Match: ${career.match.toFixed(1)}%`);
  });
  
  // Enhanced career matching for Gen Z users:
  // 1. Sort by match percentage
  // 2. Ensure diversity in the top results (different career fields)
  // 3. Prioritize careers with high job growth or high salary for high engagement
  // 4. Include at least one trade career option for inclusivity (if any scored above minimum threshold)
  
  // First, sort all careers by match score
  const sortedCareers = scoredCareers.sort((a, b) => b.match - a.match);
  
  // Find top-scoring trade career (if any) that scores at least 15%
  const topTradeCareers = sortedCareers.filter(career => 
    career.title.includes("Technician") || 
    career.title.includes("Electrician") || 
    career.title.includes("Plumber") ||
    career.title.includes("Operator") ||
    career.title.includes("Mechanic") ||
    career.title.includes("Carpenter") ||
    career.title.includes("Welder")
  );
  
  const topTrade = topTradeCareers.length > 0 ? topTradeCareers[0] : null;
  
  // Find the Entrepreneur career if it exists
  const entrepreneurCareer = sortedCareers.find(career => 
    career.title === "Entrepreneur/Business Owner" || 
    career.title.includes("Entrepreneur") || 
    career.title.includes("Business Owner")
  );
  
  // Check for autonomy and independence in user's top work styles
  const hasEntrepreneurialWorkStyle = (quizResults.workStyle['independent'] >= 70 || 
                                       quizResults.workStyle['flexible'] >= 70) &&
                                      quizResults.workStyle['team'] < 50;
                                      
  // Check for entrepreneurial motivations
  const hasEntrepreneurialMotivation = quizResults.motivation['autonomy'] >= 60 || 
                                       quizResults.motivation['personal_goals'] >= 70;
  
  // Determine if the user has an entrepreneurial profile based on traits
  const hasEntrepreneurialProfile = hasEntrepreneurialWorkStyle || hasEntrepreneurialMotivation;
  
  // Start with the top 4 scoring careers
  // Always get top 5 scoring careers to meet the requirement
  let topMatches = sortedCareers.slice(0, 5);
  
  // No special handling for trade careers - they'll only appear in top results if they have high match scores
  // This ensures users only see trade careers when they're genuinely suited for them
 //  console.log(`Trade careers will be recommended based solely on natural match scores without special handling`);
  
  // Log entrepreneurial profile diagnostics
 //  console.log('-------- ENTREPRENEURIAL PROFILE ANALYSIS --------');
 //  console.log(`Work Style Independent Score: ${quizResults.workStyle['independent'] || 0}`);
 //  console.log(`Work Style Flexible Score: ${quizResults.workStyle['flexible'] || 0}`);
 //  console.log(`Work Style Team Score: ${quizResults.workStyle['team'] || 0}`);
 //  console.log(`Motivation Autonomy Score: ${quizResults.motivation['autonomy'] || 0}`);
 //  console.log(`Motivation Personal Goals Score: ${quizResults.motivation['personal_goals'] || 0}`);
 //  console.log(`Has Entrepreneurial Work Style: ${hasEntrepreneurialWorkStyle}`);
 //  console.log(`Has Entrepreneurial Motivation: ${hasEntrepreneurialMotivation}`);
 //  console.log(`Overall Entrepreneurial Profile: ${hasEntrepreneurialProfile}`);
  
  if (entrepreneurCareer) {
   //  console.log(`Entrepreneur Career Score: ${entrepreneurCareer.match.toFixed(1)}%`);
   //  console.log(`Entrepreneur Career in Top 4: ${topMatches.some(c => c.id === entrepreneurCareer.id)}`);
  } else {
   //  console.log('No Entrepreneur Career option found in career list');
  }
 //  console.log('---------------------------------------------------');
  
  // Treat entrepreneurial careers the same as all other careers
  if (entrepreneurCareer) {
   //  console.log(`Found entrepreneur career with match score: ${entrepreneurCareer.match.toFixed(1)}%`);
    
    // No special weighting for entrepreneurial careers
    // Use the same weighting system as all other careers:
    // - Interest Alignment: 40%
    // - Motivation: 20% 
    // - Work Style: 15%
    // - Cognitive: 15%
    // - Social: 10%
    
    // Recalculate the match score based on the weighted factors
    // We've removed all special handling for entrepreneurial careers
    // No customized weights or calculations
  }
  
  // Enhanced career diversity approach for personalized exploration
  // This algorithm now ensures:
  // 1. Optimal category diversity in results
  // 2. Inclusion of at least one trade career when appropriate
  // 3. Balance of high-match careers with exploratory options
  // 4. Consideration of unusual interest combinations
  
  // First, identify different career categories present in the top matches
  const categoryMap = new Map(); // Maps categories to their best matching careers
  const tradeMatches = []; // Track trade careers specifically
  const highValueMatches = []; // Tracks careers with exceptionally high scores (>70%)
  
  // First pass - categorize all careers and identify trades and high matches
  for (const career of sortedCareers) {
    // Extract category from metadata if available, or infer from title
    const category = career.category || determineCareerCategory(career.title);
    
    // Track trade careers separately using the isTradeCareer helper from careerData
    if (isTradeCareer(career)) {
      tradeMatches.push(career);
    }
    
    // Track exceptional matches
    if (career.match > 70) {
      highValueMatches.push(career);
    }
    
    // Store the highest matching career for each category
    if (!categoryMap.has(category) || 
        categoryMap.get(category).match < career.match) {
      categoryMap.set(category, career);
    }
  }
  
  // Initialize final matches
  const finalMatches = [];
  const includedIds = new Set();
  
  // Step 1: Always include the absolute top match (highest overall score)
  if (sortedCareers.length > 0) {
    const topMatch = sortedCareers[0];
    finalMatches.push(topMatch);
    includedIds.add(topMatch.id);
    
    // Also remove this category from categoryMap to avoid duplicates
    const topCategory = topMatch.category || determineCareerCategory(topMatch.title);
    categoryMap.delete(topCategory);
    
   //  console.log(`Added top match: ${topMatch.title} (${topMatch.match.toFixed(1)}%)`);
  }
  
  // Step 2: Include top trade career if one has a decent match (>45%) and user has relevant traits
  // This ensures trade careers are considered when appropriate
  const hasTradeAffinity = (
    quizResults.workStyle && 
    (quizResults.workStyle['hands-on'] > 60 || 
     quizResults.workStyle['practical'] > 60)
  );
  
  if (hasTradeAffinity && tradeMatches.length > 0 && tradeMatches[0].match > 45) {
    const topTrade = tradeMatches[0];
    if (!includedIds.has(topTrade.id)) {
      finalMatches.push(topTrade);
      includedIds.add(topTrade.id);
     //  console.log(`Added trade career: ${topTrade.title} (${topTrade.match.toFixed(1)}%)`);
      
      // Remove this category from consideration
      const tradeCategory = topTrade.category || determineCareerCategory(topTrade.title);
      categoryMap.delete(tradeCategory);
    }
  }
  
  // Step 3: Include any extremely high matching careers (>70%)
  // This ensures we don't miss exceptional matches due to category filtering
  for (const highMatch of highValueMatches) {
    if (finalMatches.length >= 5) break;
    
    if (!includedIds.has(highMatch.id)) {
      finalMatches.push(highMatch);
      includedIds.add(highMatch.id);
     //  console.log(`Added high-value match: ${highMatch.title} (${highMatch.match.toFixed(1)}%)`);
      
      // Remove this category
      const highCategory = highMatch.category || determineCareerCategory(highMatch.title);
      categoryMap.delete(highCategory);
    }
  }
  
  // Step 4: Fill remaining slots with diverse categories
  // Get top career from each remaining category, prioritizing highest match
  const remainingCategories = Array.from(categoryMap.entries())
    .sort((a, b) => b[1].match - a[1].match);
  
  for (const [category, career] of remainingCategories) {
    if (finalMatches.length >= 5) break;
    
    if (!includedIds.has(career.id)) {
      finalMatches.push(career);
      includedIds.add(career.id);
     //  console.log(`Added for category diversity: ${career.title} (${career.match.toFixed(1)}%) - ${category}`);
    }
  }
  
  // Step 5: If we still need more careers, add highest remaining matches
  if (finalMatches.length < 5) {
    for (const career of sortedCareers) {
      if (finalMatches.length >= 5) break;
      
      if (!includedIds.has(career.id)) {
        finalMatches.push(career);
        includedIds.add(career.id);
       //  console.log(`Added to fill quota: ${career.title} (${career.match.toFixed(1)}%)`);
      }
    }
  }
  
  // Sort final selection by match percentage
  return finalMatches.sort((a, b) => b.match - a.match);
}

/**
 * Generates a career roadmap based on the selected career
 */
export function generateRoadmap(
  careerPath: string, 
  quizResults?: QuizResults,
  ageGroup: string = 'teen',
  priorExperience: string = 'none'
): CareerRoadmap {
  // Find the career data
  const career = careers.find(c => c.title === careerPath);
  
  if (!career) {
    // Return a default roadmap if career not found
    return {
      careerPath,
      timeline: "2-4 Years",
      investment: "$$$",
      difficulty: "Moderate",
      phases: [
        {
          title: "Build Your Foundation",
          description: "Master fundamentals and basic skills.",
          steps: [
            {
              title: "Learn Core Skills",
              description: "Focus on the essential skills for this field",
              completed: false
            },
            {
              title: "Get Education",
              description: "Formal education or self-learning path",
              completed: false
            },
            {
              title: "Build Basic Projects",
              description: "Create small projects to practice your skills",
              completed: false
            }
          ]
        },
        {
          title: "Specialized Learning",
          description: "Develop specialized skills and knowledge.",
          steps: [
            {
              title: "Choose Your Focus Area",
              description: "Select an area to specialize in",
              completed: false
            },
            {
              title: "Advanced Training",
              description: "Take courses or get certifications",
              completed: false
            },
            {
              title: "Create a Portfolio",
              description: "Showcase your skills and projects",
              completed: false
            }
          ]
        },
        {
          title: "Launch Your Career",
          description: "Enter the industry and grow professionally.",
          steps: [
            {
              title: "Entry-Level Position",
              description: "Gain real-world experience in your field",
              completed: false
            },
            {
              title: "Networking",
              description: "Build connections in your industry",
              completed: false
            },
            {
              title: "Continuous Learning",
              description: "Stay updated with industry trends",
              completed: false
            }
          ]
        }
      ]
    };
  }
  
  // Determine timeline based on career path and education requirements
  let timeline = "2-4 Years";
  if (career.educationPath.includes("Master") || career.educationPath.includes("Doctoral")) {
    timeline = "4-6 Years";
  } else if (career.educationPath.includes("Bachelor")) {
    timeline = "3-5 Years";
  } else if (career.educationPath.includes("bootcamp") || career.educationPath.includes("certification")) {
    timeline = "1-2 Years";
  } else if (career.title.includes("Developer") || career.title.includes("Designer")) {
    timeline = "2-4 Years";
  }
  
  // Determine investment level
  let investment = "$$$";
  if (career.educationPath.includes("Doctoral")) {
    investment = "$$$$$";
  } else if (career.educationPath.includes("Master")) {
    investment = "$$$$";
  } else if (career.educationPath.includes("Bachelor")) {
    investment = "$$$";
  } else if (career.educationPath.includes("Associate")) {
    investment = "$$";
  } else if (career.educationPath.includes("self-learning") || career.educationPath.includes("bootcamp")) {
    investment = "$";
  }
  
  // Determine difficulty
  let difficulty = "Moderate";
  if (career.educationPath.includes("Doctoral") || career.title.includes("Surgeon")) {
    difficulty = "Very High";
  } else if (career.educationPath.includes("Master") || career.skills.includes("Mathematics")) {
    difficulty = "High";
  } else if (career.educationPath.includes("Bachelor")) {
    difficulty = "Moderate";
  } else {
    difficulty = "Approachable";
  }
  
  // Generate specialized steps based on the career and user demographics
  const foundationSteps = [];
  const specializedSteps = [];
  const launchSteps = [];
  
  // Apply age group and prior experience modifications
  let startFaster = false;
  let skipBasics = false;
  let addMentorship = false;
  let addRetraining = false;
  
  // Adjust roadmap based on age group
  if (ageGroup === 'teen') {
    // For teens (Gen Z), focus on exploration and fundamentals
    addMentorship = true;
    timeline = timeline.split('-')[0] + "-" + (parseInt(timeline.split('-')[1]) + 1) + " Years";
  } else if (ageGroup === 'youngAdult') {
    // Young adults may have some college/training already
    startFaster = true;
  } else if (ageGroup === 'adult' || ageGroup === 'midCareer') {
    // Adults may need to balance work and learning
    addRetraining = true;
    // Make timeline shorter for adults as they can't spend as many years on career changes
    if (timeline.includes("4-6")) {
      timeline = "3-5 Years";
    } else if (timeline.includes("3-5")) {
      timeline = "2-4 Years";
    } else if (timeline.includes("2-4")) {
      timeline = "1.5-3 Years";
    }
  } else if (ageGroup === 'lateCareer') {
    // Late career individuals might want faster paths and leverage existing experience
    startFaster = true;
    addRetraining = true;
    // Even shorter timelines for late career changers
    if (timeline.includes("4-6")) {
      timeline = "2-4 Years";
    } else if (timeline.includes("3-5")) {
      timeline = "1.5-3 Years";
    } else if (timeline.includes("2-4")) {
      timeline = "1-2 Years";
    }
  }
  
  // Adjust roadmap based on prior experience level
  if (priorExperience === 'none') {
    // No changes needed - this is the default path
  } else if (priorExperience === 'entry') {
    startFaster = true;
  } else if (priorExperience === 'intermediate') {
    startFaster = true;
    skipBasics = true;
  } else if (priorExperience === 'advanced' || priorExperience === 'expert') {
    startFaster = true;
    skipBasics = true;
    // Reduce difficulty for those with advanced experience
    if (difficulty === "Very High") {
      difficulty = "High";
    } else if (difficulty === "High") {
      difficulty = "Moderate";
    } else if (difficulty === "Moderate") {
      difficulty = "Approachable";
    }
  }
  
  // Foundation steps
  // Always include a core skill from the career
  foundationSteps.push({
    title: `Master ${career.skills[0]}`,
    description: `This foundational skill is essential for success as a ${career.title}`,
    completed: false
  });
  
  // Add education step based on the career's requirements
  if (career.educationPath.includes("Doctoral")) {
    foundationSteps.push({
      title: "Complete Advanced Education",
      description: career.educationPath,
      completed: false
    });
  } else if (career.educationPath.includes("Bachelor") || career.educationPath.includes("Master")) {
    foundationSteps.push({
      title: "Complete Formal Education",
      description: career.educationPath,
      completed: false
    });
  } else if (career.educationPath.includes("bootcamp")) {
    foundationSteps.push({
      title: "Complete Intensive Training",
      description: career.educationPath,
      completed: false
    });
  } else {
    foundationSteps.push({
      title: "Learn Essential Theory",
      description: "Through courses, tutorials, or self-study resources",
      completed: false
    });
  }
  
  // Add a practical foundation step
  if (career.title.includes("Entrepreneur") || career.title.includes("Business Owner")) {
    foundationSteps.push({
      title: "Identify Market Opportunity",
      description: "Research and identify a viable market need or business opportunity",
      completed: false
    });
    
    foundationSteps.push({
      title: "Develop Business Model",
      description: "Create a clear business model outlining your value proposition, target customers, and revenue streams",
      completed: false
    });
    
    // Entrepreneurial specialized steps will be different
    specializedSteps.push({
      title: "Build Minimum Viable Product",
      description: "Develop the simplest version of your product or service to test in the market",
      completed: false
    });
    
    specializedSteps.push({
      title: "Secure Initial Funding",
      description: "Obtain seed funding through personal savings, friends/family, or early investors",
      completed: false
    });
    
    specializedSteps.push({
      title: "Create Business Plan",
      description: "Develop a comprehensive business plan with financial projections and growth strategy",
      completed: false
    });
    
    // Launch steps for entrepreneurs
    launchSteps.push({
      title: "Launch Your Business",
      description: "Officially launch your business and start serving customers",
      completed: false
    });
    
    launchSteps.push({
      title: "Establish Growth Systems",
      description: "Create scalable processes for marketing, sales, and operations",
      completed: false
    });
    
    launchSteps.push({
      title: "Build Your Team",
      description: "Hire key team members to support business growth and expansion",
      completed: false
    });
  }
  else if (career.title.includes("Developer") || career.title.includes("Designer") || career.title.includes("Engineer")) {
    foundationSteps.push({
      title: "Build Starter Projects",
      description: "Create simple projects to apply your knowledge and build your portfolio",
      completed: false
    });
  } else if (career.title.includes("Writer") || career.title.includes("Marketer") || career.title.includes("Content")) {
    foundationSteps.push({
      title: "Create Sample Work",
      description: "Develop a collection of writing samples or content pieces",
      completed: false
    });
  } else {
    foundationSteps.push({
      title: "Get Practical Experience",
      description: "Through volunteer work, internships, or entry-level positions",
      completed: false
    });
  }
  
  // Specialized steps
  // Add specialization focus
  specializedSteps.push({
    title: "Choose Your Specialization",
    description: `Select a specific area within ${career.title} that aligns with your interests`,
    completed: false
  });
  
  // Add skills mastery based on the career
  if (career.skills.length >= 3) {
    specializedSteps.push({
      title: `Develop Advanced ${career.skills[1]} Skills`,
      description: "Focus on building expertise in this key area",
      completed: false
    });
  } else {
    specializedSteps.push({
      title: "Deepen Technical Expertise",
      description: "Focus on mastering advanced concepts and techniques",
      completed: false
    });
  }
  
  // Add certifications or credentials based on field
  if (career.title.includes("Developer") || career.title.includes("Engineer") || career.title.includes("Security")) {
    specializedSteps.push({
      title: "Earn Key Certifications",
      description: "Obtain industry-recognized certifications to validate your expertise",
      completed: false
    });
  } else if (career.title.includes("Designer") || career.title.includes("Writer")) {
    specializedSteps.push({
      title: "Build an Impressive Portfolio",
      description: "Create a collection of high-quality work that showcases your abilities",
      completed: false
    });
  } else {
    specializedSteps.push({
      title: "Gain Specialized Training",
      description: "Complete advanced courses or workshops in your chosen specialization",
      completed: false
    });
  }
  
  // Launch steps
  // First professional role
  launchSteps.push({
    title: "Land Your First Professional Role",
    description: "Apply for entry-level positions or freelance opportunities in your field",
    completed: false
  });
  
  // Networking
  launchSteps.push({
    title: "Build Your Professional Network",
    description: "Connect with others in your industry through meetups, social media, and conferences",
    completed: false
  });
  
  // Continuous growth
  launchSteps.push({
    title: "Commit to Continual Learning",
    description: "Stay updated with industry trends and expand your knowledge",
    completed: false
  });
  
  // Customize based on demographic flags set earlier
  
  // For those with prior experience, modify steps
  if (skipBasics) {
    // Replace basic foundation steps with more advanced ones
    for (let i = 0; i < foundationSteps.length; i++) {
      if (foundationSteps[i].title.includes("Learn Essential") || 
          foundationSteps[i].title.includes("Build Starter") ||
          foundationSteps[i].title.includes("Master")) {
        foundationSteps[i] = {
          title: "Refresh and Fill Knowledge Gaps",
          description: "Update your skills and fill any gaps specific to this career path",
          completed: false
        };
        break;
      }
    }
    
    // Modify specialized steps for experienced people
    for (let i = 0; i < specializedSteps.length; i++) {
      if (specializedSteps[i].title.includes("Choose Your")) {
        specializedSteps[i] = {
          title: "Apply Existing Expertise",
          description: "Identify how your previous skills transfer to this new field",
          completed: false
        };
        break;
      }
    }
  }
  
  // Add mentorship step for teens (Gen Z)
  if (addMentorship) {
    specializedSteps.push({
      title: "Find a Mentor",
      description: "Connect with an experienced professional who can guide your learning journey",
      completed: false
    });
  }
  
  // Add retraining or job transition step for adults
  if (addRetraining) {
    launchSteps.push({
      title: "Transition Strategy",
      description: "Develop a plan to transition from your current career to your new path",
      completed: false
    });
  }
  
  // For faster starters (prior experience or young adults)
  if (startFaster) {
    // Add a fast-track step (different for entrepreneurs vs other careers)
    if (career.title.includes("Entrepreneur") || career.title.includes("Business Owner")) {
      specializedSteps.push({
        title: "Lean Startup Approach",
        description: "Use rapid iteration and minimal resources to test business concepts quickly",
        completed: false
      });
    } else {
      specializedSteps.push({
        title: "Accelerated Learning Path",
        description: "Focus on the most critical skills and knowledge to enter the field faster",
        completed: false
      });
    }
  }
  
  // Special handling for entrepreneurial career roadmaps based on mini-game metrics
  if ((career.title.includes("Entrepreneur") || career.title.includes("Business Owner")) && 
     quizResults?.miniGameMetrics) {
     
    const metrics = quizResults.miniGameMetrics;
     
    // Add decision-making specialized step for entrepreneurs with good decision making
    if (metrics.decisionMaking && metrics.decisionMaking > 65) {
      specializedSteps.push({
        title: "Decision Framework Development",
        description: "Create structured processes for rapid, effective business decision-making",
        completed: false
      });
    }
    
    // Add risk management for entrepreneurs with good pattern recognition
    if (metrics.patternRecognition && metrics.patternRecognition > 65) {
      specializedSteps.push({
        title: "Strategic Risk Management",
        description: "Develop frameworks to evaluate and mitigate business risks while capitalizing on opportunities",
        completed: false
      });
    }
    
    // Add resource optimization for entrepreneurs with good multitasking
    if (metrics.multiTaskingScore && metrics.multiTaskingScore > 65) {
      specializedSteps.push({
        title: "Resource Optimization Strategy",
        description: "Create systems to maximize efficiency of financial, human, and operational resources",
        completed: false
      });
    }
  }
  
  // Process mini-game metrics if available
  if (quizResults?.miniGameMetrics) {
    const metrics = quizResults.miniGameMetrics;
    const miniGameEnhancements = [];
    
    // 1. Battle Command Simulator metrics
    if (metrics.brainDominance) {
      if (metrics.brainDominance === 'left' && 
          (career.skills.some(s => ['analysis', 'programming', 'coding', 'mathematics'].some(k => s.toLowerCase().includes(k))))) {
        miniGameEnhancements.push({
          title: "Analytical Skill Development",
          description: "Leverage your analytical strengths through structured learning and problem-solving activities",
          phase: "specialized",
          priority: 2
        });
      } else if (metrics.brainDominance === 'right' && 
               (career.skills.some(s => ['creative', 'design', 'communication', 'artistic'].some(k => s.toLowerCase().includes(k))))) {
        miniGameEnhancements.push({
          title: "Creative Approach Optimization",
          description: "Enhance your creative thinking through design-focused projects and innovation challenges",
          phase: "specialized",
          priority: 2
        });
      } else if (metrics.brainDominance === 'balanced') {
        miniGameEnhancements.push({
          title: "Versatile Thinking Application",
          description: "Apply your balanced thinking style to multidisciplinary projects requiring both analysis and creativity",
          phase: "launch",
          priority: 1
        });
      }
    }
    
    // Processing vs reaction styles based on cognitive profile
    if (metrics.processingSpeed && metrics.responseConsistency) {
      // If fast processing and consistent responses, suggest structured planning approach
      if (metrics.processingSpeed > 70 && metrics.responseConsistency > 70) {
        miniGameEnhancements.push({
          title: "Strategic Planning Skills",
          description: "Develop formal project management and strategic planning methodologies",
          phase: "specialized",
          priority: 1
        });
      } 
      // If fast processing but inconsistent responses, suggest adaptive approach
      else if (metrics.processingSpeed > 70 && metrics.responseConsistency < 50) {
        miniGameEnhancements.push({
          title: "Adaptive Response Training",
          description: "Refine your ability to excel in dynamic environments through agile methodologies",
          phase: "specialized",
          priority: 1
        });
      }
    }
    
    // 2. Mini Games Hub metrics for spatial skills
    if (metrics.spatialAwareness && metrics.spatialAwareness > 70) {
      if (career.skills.some(s => ['design', 'architecture', 'visual', 'spatial'].some(k => s.toLowerCase().includes(k)))) {
        miniGameEnhancements.push({
          title: "Spatial Intelligence Applications",
          description: "Apply your strong visual-spatial skills to specialized aspects of your career path",
          phase: "specialized",
          priority: 2
        });
      }
    }
    
    if (metrics.attentionControl && metrics.attentionControl > 70) {
      miniGameEnhancements.push({
        title: "Detail-Oriented Specialization",
        description: "Pursue roles or certifications that leverage your exceptional attention to detail",
        phase: "specialized",
        priority: 3
      });
    }
    
    if (metrics.patternRecognition && metrics.patternRecognition > 70) {
      if (career.skills.some(s => ['management', 'logistics', 'planning', 'resource'].some(k => s.toLowerCase().includes(k)))) {
        miniGameEnhancements.push({
          title: "Resource Optimization Training",
          description: "Develop advanced resource management techniques for efficiency and productivity",
          phase: "launch",
          priority: 2
        });
      }
    }
    
    // 3. Motor and cognitive skills from mini-games
    if (metrics.motorControl && metrics.motorControl > 70) {
      if (career.skills.some(s => ['manual', 'physical', 'hands-on', 'craft'].some(k => s.toLowerCase().includes(k)))) {
        miniGameEnhancements.push({
          title: "Technical Precision Development",
          description: "Refine your technical coordination skills through specialized hands-on training",
          phase: "foundation",
          priority: 3
        });
      }
    }
    
    if (metrics.multiTaskingScore && metrics.multiTaskingScore > 70) {
      miniGameEnhancements.push({
        title: "Complex Workflow Management",
        description: "Develop systems for handling multiple priorities in fast-paced environments",
        phase: "launch",
        priority: 2
      });
    }
    
    if (metrics.processingSpeed && metrics.processingSpeed > 70) {
      miniGameEnhancements.push({
        title: "Accelerated Learning Path",
        description: "Leverage your ability to rapidly acquire new skills through intensive learning modules",
        phase: "foundation",
        priority: 1
      });
    }
    
    // Stress responsiveness - high attentionControl from Reaction Run indicates good stress handling
    if (metrics.attentionControl && metrics.attentionControl > 75) {
      if (career.workEnvironment?.toLowerCase().includes('high-pressure') || 
          career.skills.some(s => ['emergency', 'critical', 'deadline'].some(k => s.toLowerCase().includes(k)))) {
        miniGameEnhancements.push({
          title: "High-Pressure Performance Optimization",
          description: "Seek opportunities that leverage your ability to excel under pressure",
          phase: "launch",
          priority: 3
        });
      }
    }
    
    // Sort by priority (lower number is higher priority)
    miniGameEnhancements.sort((a, b) => a.priority - b.priority);
    
    // Add to appropriate phases, limiting additions to avoid overwhelming
    let foundationCount = 0;
    let specializedCount = 0;
    let launchCount = 0;
    
    // This implementation uses efficient memory management by directly pushing to the existing arrays
    // rather than creating new arrays and concatenating - important for scalability
    for (const enhancement of miniGameEnhancements) {
      if (enhancement.phase === 'foundation' && foundationCount < 2) {
        foundationSteps.push({
          title: enhancement.title,
          description: enhancement.description,
          completed: false
        });
        foundationCount++;
      } else if (enhancement.phase === 'specialized' && specializedCount < 2) {
        specializedSteps.push({
          title: enhancement.title,
          description: enhancement.description,
          completed: false
        });
        specializedCount++;
      } else if (enhancement.phase === 'launch' && launchCount < 2) {
        launchSteps.push({
          title: enhancement.title,
          description: enhancement.description,
          completed: false
        });
        launchCount++;
      }
    }
  }
  
  // Generate a custom roadmap based on the career and demographic factors
  return {
    careerPath: career.title,
    timeline: timeline,
    investment: investment,
    difficulty: difficulty,
    ageGroup: ageGroup, // Include the age group used
    priorExperience: priorExperience, // Include the experience level used
    phases: [
      {
        title: "Build Your Foundation",
        description: `Master the fundamentals of ${career.title}.`,
        steps: foundationSteps
      },
      {
        title: "Specialized Learning",
        description: "Develop expertise in your chosen area.",
        steps: specializedSteps
      },
      {
        title: "Launch Your Career",
        description: `Start your professional journey as a ${career.title}.`,
        steps: launchSteps
      }
    ]
  };
}
