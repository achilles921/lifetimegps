// Backend version of quizLogic for server-side processing
// Simplified version focused on the functions needed by the backend routes

// Interface for mini-game metrics
export interface MiniGameMetrics {
  brainDominance?: 'left' | 'right' | 'balanced';
  cognitiveStyle?: 'analytical' | 'creative' | 'practical' | 'conceptual' | 'sequential';
  stressResponse?: 'low' | 'medium' | 'high';
  decisionSpeed?: number;
  patternRecognition?: number;
  multitaskingAbility?: number;
  spatialAwareness?: number;
  handEyeCoordination?: number;
  motorControl?: number;
  verbalProcessing?: number;
  visualProcessing?: number;
  auditoryProcessing?: number;
  attentionControl?: number;
  decisionMaking?: number;
  memoryCapacity?: number;
  processingSpeed?: number;
  responseConsistency?: number;
  visualProcessingSpeed?: number;
  colorRecognitionAccuracy?: number;
  distractionResistance?: number;
  contextualUnderstanding?: number;
  grammarConsistency?: number;
  languageApplication?: number;
  sentenceFormationSpeed?: number;
  vocabularyDepth?: number;
  spatialReasoningScore?: number;
  patternCompletionAccuracy?: number;
  workingMemoryCapacity?: number;
  multiTaskingScore?: number;
  logicalSequencingScore?: number;
  verbalProcessingSpeed?: number;
  wordAssociationAccuracy?: number;
  linguisticFlexibility?: number;
  vocabularyRange?: number;
  semanticComprehension?: number;
}

// Interface to define the structure of quiz results
export interface QuizResults {
  workStyle: Record<string, number>;
  cognitiveStrength: Record<string, number>;
  socialApproach: Record<string, number>;
  motivation: Record<string, number>;
  interests: Array<{interest: string; percentage: number}>;
  miniGameMetrics?: MiniGameMetrics;
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
  timeline?: string;
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
  console.log("PROCESSING QUIZ RESPONSES:", JSON.stringify(responses, null, 2));
  
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
      'collaborative': 0,
      'independent': 0,
      'creative': 0,
      'analytical': 0
    },
    cognitiveStrength: {
      'analytical': 0,
      'creative': 0,
      'technical': 0,
      'verbal': 0,
      'mathematical': 0,
      'spatial': 0
    },
    socialApproach: {
      'extroverted': 0,
      'introverted': 0,
      'leadership': 0,
      'supportive': 0,
      'team-oriented': 0,
      'individual': 0
    },
    motivation: {
      'financial': 0,
      'purpose': 0,
      'growth': 0,
      'recognition': 0,
      'work_life_balance': 0,
      'job_security': 0
    },
    interests: []
  };

  // Process sector 1 (Work Style and Preferences)
  if (responses.sector1) {
    const sector1 = responses.sector1;
    
    // Work pace
    if (sector1.work_pace === 'fast') {
      results.workStyle.structured += 30;
      results.workStyle.analytical += 20;
    } else if (sector1.work_pace === 'moderate') {
      results.workStyle.flexible += 25;
      results.workStyle.collaborative += 15;
    } else if (sector1.work_pace === 'slow') {
      results.workStyle.creative += 30;
      results.workStyle.independent += 20;
    }

    // Teamwork preference
    if (sector1.teamwork === 'collaborative') {
      results.workStyle.collaborative += 40;
      results.socialApproach['team-oriented'] += 30;
    } else if (sector1.teamwork === 'independent') {
      results.workStyle.independent += 40;
      results.socialApproach.individual += 30;
    }

    // Management style
    if (sector1.management_style === 'directive') {
      results.socialApproach.leadership += 40;
      results.workStyle.structured += 20;
    } else if (sector1.management_style === 'supportive') {
      results.socialApproach.supportive += 40;
      results.workStyle.collaborative += 20;
    }
  }

  // Process sector 2 (Cognitive Strengths)
  if (responses.sector2) {
    const sector2 = responses.sector2;
    
    // Analytical thinking
    if (sector2.analytical === 'high') {
      results.cognitiveStrength.analytical += 40;
      results.workStyle.analytical += 30;
    } else if (sector2.analytical === 'very_high') {
      results.cognitiveStrength.analytical += 50;
      results.workStyle.analytical += 40;
    }

    // Creative thinking
    if (sector2.creative === 'high') {
      results.cognitiveStrength.creative += 40;
      results.workStyle.creative += 30;
    } else if (sector2.creative === 'very_high') {
      results.cognitiveStrength.creative += 50;
      results.workStyle.creative += 40;
    }

    // Technical skills
    if (sector2.technical === 'high') {
      results.cognitiveStrength.technical += 40;
    } else if (sector2.technical === 'very_high') {
      results.cognitiveStrength.technical += 50;
    }
  }

  // Process sector 3 (Personality)
  if (responses.sector3) {
    const sector3 = responses.sector3;
    
    // Extroversion
    if (sector3.extroversion === 'high') {
      results.socialApproach.extroverted += 40;
      results.socialApproach.leadership += 20;
    } else if (sector3.extroversion === 'very_high') {
      results.socialApproach.extroverted += 50;
      results.socialApproach.leadership += 30;
    } else if (sector3.extroversion === 'low') {
      results.socialApproach.introverted += 40;
      results.workStyle.independent += 20;
    }

    // Openness
    if (sector3.openness === 'high') {
      results.workStyle.creative += 30;
      results.cognitiveStrength.creative += 20;
    } else if (sector3.openness === 'very_high') {
      results.workStyle.creative += 40;
      results.cognitiveStrength.creative += 30;
    }
  }

  // Process sector 4 (Motivation)
  if (responses.sector4) {
    const sector4 = responses.sector4;
    
    // Financial motivation
    if (sector4.financial === 'important') {
      results.motivation.financial += 30;
    } else if (sector4.financial === 'very_important') {
      results.motivation.financial += 40;
    } else if (sector4.financial === 'critical') {
      results.motivation.financial += 50;
    }

    // Purpose motivation
    if (sector4.purpose === 'important') {
      results.motivation.purpose += 30;
    } else if (sector4.purpose === 'very_important') {
      results.motivation.purpose += 40;
    } else if (sector4.purpose === 'critical') {
      results.motivation.purpose += 50;
    }

    // Growth motivation
    if (sector4.growth === 'important') {
      results.motivation.growth += 30;
    } else if (sector4.growth === 'very_important') {
      results.motivation.growth += 40;
    } else if (sector4.growth === 'critical') {
      results.motivation.growth += 50;
    }
  }

  // Process sector 5 (Interests)
  if (responses.sector5 && Array.isArray(responses.sector5)) {
    results.interests = responses.sector5.map((interest: any) => ({
      interest: interest.interest,
      percentage: interest.percentage
    }));
  }

  return results;
}

/**
 * Generates career matches based on quiz results
 */
export function generateCareerMatches(quizResults: QuizResults): CareerMatch[] {
  // This is a simplified version for the backend
  // In a full implementation, this would use a more sophisticated matching algorithm
  
  const matches: CareerMatch[] = [
    {
      id: 'software-developer',
      title: 'Software Developer',
      description: 'Create applications and systems using programming languages',
      match: 85,
      skills: ['Programming', 'Problem Solving', 'Analytical Thinking'],
      imagePath: '/careers/software-developer.jpg',
      salary: '$80,000 - $120,000',
      growth: 'High',
      category: 'Technology'
    },
    {
      id: 'data-analyst',
      title: 'Data Analyst',
      description: 'Analyze data to help organizations make informed decisions',
      match: 80,
      skills: ['Data Analysis', 'Statistics', 'Critical Thinking'],
      imagePath: '/careers/data-analyst.jpg',
      salary: '$60,000 - $90,000',
      growth: 'High',
      category: 'Technology'
    },
    {
      id: 'project-manager',
      title: 'Project Manager',
      description: 'Lead teams and manage projects to successful completion',
      match: 75,
      skills: ['Leadership', 'Communication', 'Organization'],
      imagePath: '/careers/project-manager.jpg',
      salary: '$70,000 - $110,000',
      growth: 'Medium',
      category: 'Management'
    }
  ];

  return matches;
}

/**
 * Generates a career roadmap based on the selected career path
 */
export function generateRoadmap(
  careerPath: string, 
  quizResults?: QuizResults,
  ageGroup: string = 'teen',
  priorExperience: string = 'none'
): CareerRoadmap {
  const roadmap: CareerRoadmap = {
    careerPath,
    title: `${careerPath} Career Roadmap`,
    description: `A personalized roadmap to help you achieve your ${careerPath} career goals`,
    educationPath: [
      'High School Diploma or GED',
      'Relevant Bachelor\'s Degree',
      'Optional: Master\'s Degree for advancement'
    ],
    experiencePath: [
      'Entry-level position',
      'Mid-level role with 2-5 years experience',
      'Senior position with 5+ years experience'
    ],
    skillsPath: [
      'Core technical skills',
      'Soft skills development',
      'Leadership and management skills'
    ],
    certifications: [
      'Industry-specific certifications',
      'Professional development courses'
    ],
    timeline: '3-5 years to reach mid-level',
    investment: '$10,000 - $50,000 for education',
    difficulty: 'Moderate',
    phases: [
      {
        title: 'Foundation Phase',
        description: 'Build core skills and knowledge',
        steps: [
          {
            title: 'Complete education requirements',
            description: 'Earn necessary degrees and certifications',
            completed: false
          },
          {
            title: 'Gain entry-level experience',
            description: 'Start with internships or junior positions',
            completed: false
          }
        ]
      },
      {
        title: 'Growth Phase',
        description: 'Develop expertise and advance',
        steps: [
          {
            title: 'Specialize in areas of interest',
            description: 'Focus on specific skills and technologies',
            completed: false
          },
          {
            title: 'Take on more responsibility',
            description: 'Lead projects and mentor others',
            completed: false
          }
        ]
      }
    ],
    milestones: [
      {
        name: 'First Job',
        description: 'Land your first position in the field',
        time: '0-1 years'
      },
      {
        name: 'Skill Mastery',
        description: 'Become proficient in core skills',
        time: '2-3 years'
      },
      {
        name: 'Career Advancement',
        description: 'Move to senior or specialized roles',
        time: '3-5 years'
      }
    ],
    mentorshipOpportunities: [
      'Join professional organizations',
      'Attend industry conferences',
      'Connect with experienced professionals'
    ],
    apprenticeshipOpportunities: [
      {
        company: 'Various Companies',
        position: 'Apprentice',
        duration: '1-2 years'
      }
    ],
    estimatedSalaryProgress: [
      { year: 1, salary: '$40,000 - $60,000' },
      { year: 3, salary: '$60,000 - $80,000' },
      { year: 5, salary: '$80,000 - $120,000' }
    ],
    ageGroup,
    priorExperience
  };

  return roadmap;
} 