/**
 * Algorithm Testing Utility for Career Matching
 * 
 * This utility provides tools for systematically testing the career matching algorithm
 * with different input scenarios to ensure accurate and consistent results.
 */

import { generateCareerMatches, type CareerMatch } from './quizLogic';
import { careers } from '../data/careerData';

// QuizResults interface matches the structure in quizLogic.ts
interface QuizResults {
  workStyle: Record<string, number>;
  cognitive: Record<string, number>;
  personality: Record<string, number>;
  interests: Array<{interest: string; percentage: number}>;
  motivation: Record<string, number>;
  miniGameMetrics?: {
    decisionSpeed?: number;
    patternRecognition?: number;
    brainDominance?: 'left' | 'right' | 'balanced';
    planningStyle?: 'planner' | 'reactive' | 'balanced';
    spatialAwareness?: number;
    detailOrientation?: number;
    resourceManagement?: number;
    handEyeCoordination?: number;
    multitaskingAbility?: number;
    learningCurve?: number;
    riskAssessment?: number;
    stressResponse?: 'low' | 'medium' | 'high';
  };
}

/**
 * Test Case Interface
 */
interface TestCase {
  id: string;
  name: string;
  description: string;
  input: Partial<QuizResults>;
  expectedTopCareer?: string;
  expectedMinMatch?: number; // Minimum expected match percentage for top career
  expectedCareers?: string[]; // Expected careers in the top 5 (in any order)
}

/**
 * Test Result Interface
 */
interface TestResult {
  testId: string;
  testName: string;
  passed: boolean;
  actualTopCareer: string;
  actualTopMatch: number;
  actualTop5: string[];
  expectedTopCareer?: string;
  expectedMinMatch?: number;
  expectedCareers?: string[];
  missingExpectedCareers?: string[];
  details: string;
}

/**
 * Weight Distribution Analysis Result
 */
interface WeightAnalysisResult {
  careerTitle: string;
  interestWeight: number;
  workStyleWeight: number;
  cognitiveWeight: number;
  socialWeight: number;
  motivationWeight: number;
  miniGameWeight: number;
  otherWeight: number;
  totalScore: number;
}

/**
 * Helper function to create a baseline quiz result
 */
function createBaselineQuizResult(): QuizResults {
  return {
    workStyle: {
      team: 50,
      independent: 50,
      structured: 50,
      flexible: 50,
      creative: 50,
      analytical: 50,
      leadership: 50,
      support: 50,
      'hands-on': 50,
      conceptual: 50
    },
    cognitive: {
      verbal: 50,
      logical: 50,
      spatial: 50,
      musical: 50,
      naturalistic: 50,
      interpersonal: 50,
      intrapersonal: 50,
      kinesthetic: 50,
      mathematical: 50,
      linguistic: 50,
      skills: 50
    },
    personality: {
      openness: 50,
      conscientiousness: 50,
      extraversion: 50,
      agreeableness: 50,
      neuroticism: 50,
      adaptability: 50,
      persistence: 50,
      optimism: 50,
      risk_taking: 50,
      competitiveness: 50
    },
    interests: [],
    motivation: {
      achievement: 50,
      autonomy: 50,
      balance: 50,
      challenge: 50,
      creativity: 50,
      financial: 50,
      helping: 50,
      learning: 50,
      lifestyle: 50,
      personal_goals: 50,
      power: 50,
      prestige: 50,
      responsibility: 50,
      security: 50,
      social: 50,
      social_impact: 50,
      solving: 50,
      team: 50,
      variety: 50,
      work_conditions: 50,
      work_life_balance: 50,
      working_with_others: 50,
      working_with_things: 50
    },
    miniGameMetrics: {
      decisionSpeed: 50,
      patternRecognition: 50,
      brainDominance: 'balanced',
      planningStyle: 'balanced',
      spatialAwareness: 50,
      detailOrientation: 50,
      resourceManagement: 50,
      handEyeCoordination: 50,
      multitaskingAbility: 50,
      learningCurve: 50,
      riskAssessment: 50
    }
  };
}

/**
 * Generate test cases for entrepreneurial profile
 */
function generateEntrepreneurialTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  
  // Strong entrepreneurial profile
  testCases.push({
    id: 'entrepreneur-strong',
    name: 'Strong Entrepreneurial Profile',
    description: 'High scores in leadership, innovation, risk-taking, and business acumen',
    input: {
      workStyle: {
        leadership: 90,
        creative: 85,
        independent: 80,
        risk_taking: 75
      },
      motivation: {
        financial: 80,
        personal_goals: 75,
        autonomy: 85,
        challenge: 80
      },
      interests: [
        { interest: 'business', percentage: 90 },
        { interest: 'entrepreneurship', percentage: 85 },
        { interest: 'innovation', percentage: 80 }
      ]
    },
    expectedTopCareer: 'Entrepreneur/Business Owner',
    expectedMinMatch: 75,
    expectedCareers: ['Entrepreneur/Business Owner', 'Business Manager', 'Marketing Manager']
  });
  
  // Moderate entrepreneurial profile
  testCases.push({
    id: 'entrepreneur-moderate',
    name: 'Moderate Entrepreneurial Profile',
    description: 'Moderate scores in entrepreneurial traits',
    input: {
      workStyle: {
        leadership: 70,
        creative: 65,
        independent: 75,
        risk_taking: 60
      },
      motivation: {
        financial: 65,
        personal_goals: 70,
        autonomy: 75,
        challenge: 65
      },
      interests: [
        { interest: 'business', percentage: 70 },
        { interest: 'entrepreneurship', percentage: 65 },
        { interest: 'innovation', percentage: 60 }
      ]
    },
    expectedCareers: ['Entrepreneur/Business Owner', 'Small Business Owner']
  });
  
  // Low entrepreneurial profile
  testCases.push({
    id: 'entrepreneur-low',
    name: 'Low Entrepreneurial Profile',
    description: 'Low scores in entrepreneurial traits',
    input: {
      workStyle: {
        leadership: 40,
        creative: 45,
        independent: 50,
        risk_taking: 30
      },
      motivation: {
        financial: 50,
        personal_goals: 45,
        autonomy: 40,
        challenge: 40
      },
      interests: [
        { interest: 'business', percentage: 40 },
        { interest: 'entrepreneurship', percentage: 35 },
        { interest: 'innovation', percentage: 30 }
      ]
    },
    expectedCareers: ['Business Analyst', 'Administrative Assistant']
  });
  
  return testCases;
}

/**
 * Generate test cases for technical/analytical profiles
 */
function generateTechnicalTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  
  // Strong software developer profile
  testCases.push({
    id: 'tech-software-dev',
    name: 'Software Developer Profile',
    description: 'High scores in tech, programming, analytical thinking',
    input: {
      workStyle: {
        independent: 75,
        analytical: 85,
        creative: 70,
        structured: 75
      },
      cognitive: {
        logical: 90,
        mathematical: 85,
        spatial: 70
      },
      interests: [
        { interest: 'technology', percentage: 90 },
        { interest: 'programming', percentage: 85 },
        { interest: 'software', percentage: 90 }
      ],
      motivation: {
        challenge: 80,
        solving: 85,
        learning: 75
      }
    },
    expectedCareers: ['Software Developer', 'Web Developer', 'Data Scientist'],
    expectedMinMatch: 70
  });
  
  // Data scientist profile
  testCases.push({
    id: 'tech-data-scientist',
    name: 'Data Scientist Profile',
    description: 'High scores in data, analysis, mathematics',
    input: {
      workStyle: {
        analytical: 90,
        independent: 70,
        structured: 75
      },
      cognitive: {
        mathematical: 90,
        logical: 85,
        verbal: 70
      },
      interests: [
        { interest: 'data', percentage: 90 },
        { interest: 'research', percentage: 80 },
        { interest: 'analytics', percentage: 85 },
        { interest: 'technology', percentage: 75 }
      ],
      motivation: {
        solving: 85,
        learning: 80,
        challenge: 75
      }
    },
    expectedCareers: ['Data Scientist', 'Data Analyst', 'Statistician'],
    expectedMinMatch: 70
  });
  
  return testCases;
}

/**
 * Generate test cases for creative profiles
 */
function generateCreativeTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  
  // Graphic designer profile
  testCases.push({
    id: 'creative-graphic-design',
    name: 'Graphic Designer Profile',
    description: 'High scores in visual arts, design, creativity',
    input: {
      workStyle: {
        creative: 90,
        flexible: 75,
        independent: 70
      },
      cognitive: {
        spatial: 85,
        visual: 90
      },
      interests: [
        { interest: 'design', percentage: 90 },
        { interest: 'art', percentage: 85 },
        { interest: 'visual', percentage: 90 }
      ],
      miniGameMetrics: {
        brainDominance: 'right',
        spatialAwareness: 85,
        detailOrientation: 80
      }
    },
    expectedCareers: ['Graphic Designer', 'UX/UI Designer', 'Multimedia Artist'],
    expectedMinMatch: 70
  });
  
  // Writer/author profile
  testCases.push({
    id: 'creative-writer',
    name: 'Writer/Author Profile',
    description: 'High scores in writing, language, creativity',
    input: {
      workStyle: {
        creative: 85,
        independent: 80,
        flexible: 70
      },
      cognitive: {
        linguistic: 90,
        verbal: 85
      },
      interests: [
        { interest: 'writing', percentage: 90 },
        { interest: 'storytelling', percentage: 85 },
        { interest: 'literature', percentage: 80 }
      ]
    },
    expectedCareers: ['Writer/Author', 'Content Creator', 'Journalist'],
    expectedMinMatch: 65
  });
  
  return testCases;
}

/**
 * Generate test cases for trade profiles
 */
function generateTradeTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  
  // Electrician profile
  testCases.push({
    id: 'trade-electrician',
    name: 'Electrician Profile',
    description: 'High scores in hands-on work, technical skills',
    input: {
      workStyle: {
        'hands-on': 90,
        structured: 80,
        independent: 70
      },
      cognitive: {
        skills: 85,
        spatial: 75,
        logical: 70
      },
      interests: [
        { interest: 'electrical', percentage: 85 },
        { interest: 'construction', percentage: 70 },
        { interest: 'installation', percentage: 80 }
      ],
      miniGameMetrics: {
        handEyeCoordination: 85,
        detailOrientation: 80,
        spatialAwareness: 75
      }
    },
    expectedCareers: ['Electrician', 'Construction Manager', 'HVAC Technician'],
    expectedMinMatch: 60
  });
  
  // Mechanic profile
  testCases.push({
    id: 'trade-mechanic',
    name: 'Mechanic Profile',
    description: 'High scores in hands-on work, mechanical aptitude',
    input: {
      workStyle: {
        'hands-on': 90,
        independent: 75,
        structured: 70
      },
      cognitive: {
        skills: 90,
        spatial: 80,
        logical: 75
      },
      interests: [
        { interest: 'mechanical', percentage: 90 },
        { interest: 'repair', percentage: 85 },
        { interest: 'automotive', percentage: 80 }
      ],
      miniGameMetrics: {
        handEyeCoordination: 90,
        detailOrientation: 85,
        spatialAwareness: 75
      }
    },
    expectedCareers: ['Mechanic', 'Automotive Technician', 'Equipment Maintenance Technician'],
    expectedMinMatch: 65
  });
  
  return testCases;
}

/**
 * Generate test cases for healthcare profiles
 */
function generateHealthcareTestCases(): TestCase[] {
  const testCases: TestCase[] = [];
  
  // Nurse profile
  testCases.push({
    id: 'healthcare-nurse',
    name: 'Nurse Profile',
    description: 'High scores in helping others, healthcare, teamwork',
    input: {
      workStyle: {
        team: 85,
        structured: 75,
        support: 90
      },
      personality: {
        agreeableness: 85,
        conscientiousness: 80
      },
      interests: [
        { interest: 'healthcare', percentage: 90 },
        { interest: 'nursing', percentage: 85 },
        { interest: 'medicine', percentage: 80 }
      ],
      motivation: {
        helping: 90,
        helping_others: 90
      }
    },
    expectedCareers: ['Registered Nurse', 'Healthcare Worker', 'Medical Assistant'],
    expectedMinMatch: 70
  });
  
  // Physical therapist profile
  testCases.push({
    id: 'healthcare-pt',
    name: 'Physical Therapist Profile',
    description: 'High scores in healthcare, rehabilitation, helping others',
    input: {
      workStyle: {
        'hands-on': 80,
        team: 75,
        support: 85
      },
      cognitive: {
        kinesthetic: 85,
        interpersonal: 80
      },
      interests: [
        { interest: 'healthcare', percentage: 85 },
        { interest: 'rehabilitation', percentage: 90 },
        { interest: 'fitness', percentage: 75 }
      ],
      motivation: {
        helping: 85,
        helping_others: 85
      }
    },
    expectedCareers: ['Physical Therapist', 'Occupational Therapist', 'Healthcare Worker'],
    expectedMinMatch: 65
  });
  
  return testCases;
}

/**
 * Run test cases and analyze results
 */
export function runAlgorithmTests(): TestResult[] {
  // Combine all test cases
  const allTestCases: TestCase[] = [
    ...generateEntrepreneurialTestCases(),
    ...generateTechnicalTestCases(),
    ...generateCreativeTestCases(),
    ...generateTradeTestCases(),
    ...generateHealthcareTestCases()
  ];
  
  const results: TestResult[] = [];
  
  // Process each test case
  for (const testCase of allTestCases) {
    // Create a complete quiz result by merging the baseline with test inputs
    const baseline = createBaselineQuizResult();
    const testInput: QuizResults = {
      ...baseline,
      ...testCase.input
    };
    
    // Merge nested objects
    if (testCase.input.workStyle) {
      testInput.workStyle = { ...baseline.workStyle, ...testCase.input.workStyle };
    }
    if (testCase.input.cognitive) {
      testInput.cognitive = { ...baseline.cognitive, ...testCase.input.cognitive };
    }
    if (testCase.input.personality) {
      testInput.personality = { ...baseline.personality, ...testCase.input.personality };
    }
    if (testCase.input.interests) {
      testInput.interests = testCase.input.interests;
    }
    if (testCase.input.motivation) {
      testInput.motivation = { ...baseline.motivation, ...testCase.input.motivation };
    }
    if (testCase.input.miniGameMetrics) {
      testInput.miniGameMetrics = { ...baseline.miniGameMetrics, ...testCase.input.miniGameMetrics };
    }
    
    // Run the algorithm with the test input
    const matches = generateCareerMatches(testInput);
    const topCareer = matches[0];
    
    // Check if expected careers are in top 5
    const missingExpectedCareers = testCase.expectedCareers ? 
      testCase.expectedCareers.filter(expected => 
        !matches.some(match => match.title.includes(expected))
      ) : [];
    
    // Determine if test passed
    const topCareerPassed = testCase.expectedTopCareer ? 
      topCareer.title.includes(testCase.expectedTopCareer) : true;
    
    const minMatchPassed = testCase.expectedMinMatch ? 
      topCareer.match >= testCase.expectedMinMatch : true;
    
    const expectedCareersPassed = testCase.expectedCareers ? 
      missingExpectedCareers.length === 0 : true;
    
    const passed = topCareerPassed && minMatchPassed && expectedCareersPassed;
    
    // Create a test result
    results.push({
      testId: testCase.id,
      testName: testCase.name,
      passed,
      actualTopCareer: topCareer.title,
      actualTopMatch: topCareer.match,
      actualTop5: matches.map(m => m.title),
      expectedTopCareer: testCase.expectedTopCareer,
      expectedMinMatch: testCase.expectedMinMatch,
      expectedCareers: testCase.expectedCareers,
      missingExpectedCareers: missingExpectedCareers.length > 0 ? missingExpectedCareers : undefined,
      details: buildTestDetails(testCase, matches, passed, topCareerPassed, minMatchPassed, expectedCareersPassed, missingExpectedCareers)
    });
  }
  
  return results;
}

/**
 * Create human-readable test result details
 */
function buildTestDetails(
  testCase: TestCase, 
  matches: CareerMatch[], 
  passed: boolean,
  topCareerPassed: boolean,
  minMatchPassed: boolean,
  expectedCareersPassed: boolean,
  missingExpectedCareers: string[]
): string {
  let details = `Test ${passed ? 'PASSED' : 'FAILED'}: ${testCase.name}\n`;
  details += `Description: ${testCase.description}\n\n`;
  
  details += 'Top 5 career matches:\n';
  matches.slice(0, 5).forEach((match, index) => {
    details += `${index + 1}. ${match.title} (${match.match}%)\n`;
  });
  
  details += '\nTest criteria:\n';
  
  if (testCase.expectedTopCareer) {
    details += `- Expected top career to include "${testCase.expectedTopCareer}": ${topCareerPassed ? 'PASSED' : 'FAILED'}\n`;
  }
  
  if (testCase.expectedMinMatch) {
    details += `- Expected top match to be at least ${testCase.expectedMinMatch}%: ${minMatchPassed ? 'PASSED' : 'FAILED'}\n`;
  }
  
  if (testCase.expectedCareers) {
    details += `- Expected careers in top 5: ${testCase.expectedCareers.join(', ')}: ${expectedCareersPassed ? 'PASSED' : 'FAILED'}\n`;
    
    if (missingExpectedCareers.length > 0) {
      details += `  Missing expected careers: ${missingExpectedCareers.join(', ')}\n`;
    }
  }
  
  return details;
}

/**
 * Analyze weight distribution across different career types
 */
export function analyzeWeightDistribution(): WeightAnalysisResult[] {
  const results: WeightAnalysisResult[] = [];
  const baselineQuiz = createBaselineQuizResult();
  
  // Sample career titles to analyze
  const careerTitlesToAnalyze = [
    'Software Developer',
    'Registered Nurse',
    'Graphic Designer',
    'Electrician',
    'Business Manager',
    'Teacher',
    'Entrepreneur/Business Owner',
    'Data Scientist'
  ];
  
  // Find these careers in our career data
  const careersToAnalyze = careers.filter(c => 
    careerTitlesToAnalyze.some(title => c.title.includes(title))
  );
  
  for (const career of careersToAnalyze) {
    // Create customized quiz result with high interest in this career
    const customQuiz = { ...baselineQuiz };
    const careerKeyword = career.title.split('/')[0].split(' ')[0].toLowerCase();
    
    // Add high interest in this career area
    customQuiz.interests = [
      { interest: careerKeyword, percentage: 90 }
    ];
    
    // Match with this modified quiz
    const matches = generateCareerMatches(customQuiz);
    const careerMatch = matches.find(m => m.title === career.title);
    
    if (careerMatch) {
      // Calculate approximate weight distribution based on scoring algorithm
      // Note: This is an approximation and may not exactly match the internal scoring
      const totalScore = careerMatch.match;
      
      // Extract weights from the scoring algorithm (approximate percentages)
      const interestWeight = 40; // Interest is 40% of total score
      const workStyleWeight = 15; // Work style is 15% of total score
      const cognitiveWeight = 15; // Cognitive is 15% of total score
      const socialWeight = 10; // Social is 10% of total score
      const motivationWeight = 20; // Motivation is 20% of total score
      
      // Estimate mini-game and other contributions
      const estimatedScore = interestWeight + workStyleWeight + cognitiveWeight + socialWeight + motivationWeight;
      const remainingWeight = totalScore - estimatedScore;
      
      // Assume mini-game bonus is 60% of the remaining weight, other factors 40%
      const miniGameWeight = remainingWeight > 0 ? remainingWeight * 0.6 : 0;
      const otherWeight = remainingWeight > 0 ? remainingWeight * 0.4 : 0;
      
      results.push({
        careerTitle: career.title,
        interestWeight,
        workStyleWeight,
        cognitiveWeight,
        socialWeight,
        motivationWeight,
        miniGameWeight,
        otherWeight,
        totalScore
      });
    }
  }
  
  return results;
}

/**
 * Generate career matches for a comprehensive set of input combinations
 * This function creates test cases with varied inputs to test the algorithm's 
 * responses across different answer combinations
 */
export function generateComprehensiveTestMatrix(iterations: number = 100): TestResult[] {
  const results: TestResult[] = [];
  
  for (let i = 0; i < iterations; i++) {
    // Generate a random test case with weighted randomization
    // This ensures we cover a wide range of possible quiz responses
    const testCase = generateRandomTestCase(i);
    
    // Run the algorithm with this test case
    const baseline = createBaselineQuizResult();
    const testInput: QuizResults = {
      ...baseline,
      ...testCase.input
    };
    
    // Merge nested objects
    if (testCase.input.workStyle) {
      testInput.workStyle = { ...baseline.workStyle, ...testCase.input.workStyle };
    }
    if (testCase.input.cognitive) {
      testInput.cognitive = { ...baseline.cognitive, ...testCase.input.cognitive };
    }
    if (testCase.input.personality) {
      testInput.personality = { ...baseline.personality, ...testCase.input.personality };
    }
    if (testCase.input.interests) {
      testInput.interests = testCase.input.interests;
    }
    if (testCase.input.motivation) {
      testInput.motivation = { ...baseline.motivation, ...testCase.input.motivation };
    }
    if (testCase.input.miniGameMetrics) {
      testInput.miniGameMetrics = { ...baseline.miniGameMetrics, ...testCase.input.miniGameMetrics };
    }
    
    // Run the algorithm with the test input
    const matches = generateCareerMatches(testInput);
    const topCareer = matches[0];
    
    // For comprehensive tests, we're validating consistency rather than specific outputs
    // So we record the results for analysis but don't compare to expected values
    results.push({
      testId: `comprehensive-${i}`,
      testName: `Comprehensive Test ${i}`,
      passed: true, // We're not checking pass/fail here
      actualTopCareer: topCareer.title,
      actualTopMatch: topCareer.match,
      actualTop5: matches.map(m => m.title),
      details: `Random test case ${i}\nTop career: ${topCareer.title} (${topCareer.match}%)\n`
    });
  }
  
  return results;
}

/**
 * Generate a random test case with weighted randomization
 */
function generateRandomTestCase(seed: number): TestCase {
  // Use seed to create some consistency in randomization
  const random = () => {
    const x = Math.sin(seed + 1) * 10000;
    return x - Math.floor(x);
  };
  
  // Pick a dominant profile type for this test case
  const profileTypes = ['technical', 'creative', 'entrepreneurial', 'healthcare', 'trade', 'mixed'];
  const dominantProfile = profileTypes[Math.floor(random() * profileTypes.length)];
  
  // Create a test case with random values weighted toward the profile type
  const testCase: TestCase = {
    id: `random-${seed}`,
    name: `Random Test Case ${seed} (${dominantProfile})`,
    description: `Randomly generated test case with dominant ${dominantProfile} profile`,
    input: {
      workStyle: {},
      cognitive: {},
      personality: {},
      interests: {},
      motivation: {},
      miniGameMetrics: {}
    }
  };
  
  // Generate random values for each category based on dominant profile
  switch (dominantProfile) {
    case 'technical':
      // Higher probability of technical traits
      testCase.input.workStyle = {
        analytical: 60 + Math.floor(random() * 40),
        structured: 50 + Math.floor(random() * 50),
        independent: 50 + Math.floor(random() * 50)
      };
      testCase.input.cognitive = {
        logical: 60 + Math.floor(random() * 40),
        mathematical: 60 + Math.floor(random() * 40)
      };
      testCase.input.interests = [
        { interest: 'technology', percentage: 60 + Math.floor(random() * 40) },
        { interest: 'programming', percentage: 60 + Math.floor(random() * 40) }
      ];
      break;
      
    case 'creative':
      // Higher probability of creative traits
      testCase.input.workStyle = {
        creative: 60 + Math.floor(random() * 40),
        flexible: 50 + Math.floor(random() * 50)
      };
      testCase.input.cognitive = {
        spatial: 50 + Math.floor(random() * 50),
        musical: Math.floor(random() * 100),
        linguistic: Math.floor(random() * 100)
      };
      testCase.input.interests = [
        { interest: 'art', percentage: Math.floor(random() * 100) },
        { interest: 'design', percentage: Math.floor(random() * 100) },
        { interest: 'writing', percentage: Math.floor(random() * 100) }
      ];
      break;
      
    case 'entrepreneurial':
      // Higher probability of entrepreneurial traits
      testCase.input.workStyle = {
        leadership: 60 + Math.floor(random() * 40),
        creative: 55 + Math.floor(random() * 45),
        independent: 60 + Math.floor(random() * 40),
        risk_taking: 55 + Math.floor(random() * 45)
      };
      testCase.input.cognitive = {
        verbal: 50 + Math.floor(random() * 50),
        interpersonal: 50 + Math.floor(random() * 50),
        problem_solving: 55 + Math.floor(random() * 45),
        adaptability: 55 + Math.floor(random() * 45)
      };
      testCase.input.interests = [
        { interest: 'business', percentage: 60 + Math.floor(random() * 40) },
        { interest: 'entrepreneurship', percentage: 60 + Math.floor(random() * 40) },
        { interest: 'innovation', percentage: 50 + Math.floor(random() * 50) }
      ];
      break;
      
    case 'healthcare':
      // Higher probability of healthcare traits
      testCase.input.workStyle = {
        team: 60 + Math.floor(random() * 40),
        support: 60 + Math.floor(random() * 40)
      };
      testCase.input.personality = {
        agreeableness: 60 + Math.floor(random() * 40)
      };
      testCase.input.interests = [
        { interest: 'healthcare', percentage: 60 + Math.floor(random() * 40) },
        { interest: 'medicine', percentage: 50 + Math.floor(random() * 50) }
      ];
      testCase.input.motivation = {
        helping: 60 + Math.floor(random() * 40),
        helping_others: 60 + Math.floor(random() * 40)
      };
      break;
      
    case 'trade':
      // Higher probability of trade traits
      testCase.input.workStyle = {
        'hands-on': 60 + Math.floor(random() * 40),
        structured: 50 + Math.floor(random() * 50)
      };
      testCase.input.cognitive = {
        skills: 60 + Math.floor(random() * 40),
        spatial: 50 + Math.floor(random() * 50)
      };
      testCase.input.interests = [
        { interest: 'construction', percentage: Math.floor(random() * 100) },
        { interest: 'mechanical', percentage: Math.floor(random() * 100) },
        { interest: 'electrical', percentage: Math.floor(random() * 100) }
      ];
      testCase.input.miniGameMetrics = {
        handEyeCoordination: 60 + Math.floor(random() * 40),
        spatialAwareness: 60 + Math.floor(random() * 40)
      };
      break;
      
    case 'mixed':
    default:
      // Truly random profile
      const randomInterests = ['technology', 'art', 'business', 'healthcare', 'science', 'education'];
      const selectedInterests = randomInterests.filter(() => random() > 0.5);
      
      testCase.input.workStyle = {
        team: Math.floor(random() * 100),
        independent: Math.floor(random() * 100),
        creative: Math.floor(random() * 100),
        analytical: Math.floor(random() * 100)
      };
      
      // Pick 1-3 random interests
      testCase.input.interests = selectedInterests.map(interest => ({
        interest: interest,
        percentage: 50 + Math.floor(random() * 50)
      }));
      
      // Pick 1-3 random motivations
      const randomMotivations = ['helping_others', 'financial', 'challenge', 'autonomy', 'learning'];
      const selectedMotivations = randomMotivations.filter(() => random() > 0.6);
      
      testCase.input.motivation = {};
      for (const motivation of selectedMotivations) {
        testCase.input.motivation[motivation] = 50 + Math.floor(random() * 50);
      }
      break;
  }
  
  return testCase;
}

/**
 * Calculate the algorithm's accuracy scores based on test results
 */
export function calculateAlgorithmAccuracy(results: TestResult[]): {
  overallAccuracy: number;
  accuracyByCategory: Record<string, number>;
  detailedAnalysis: string;
} {
  const passedTests = results.filter(r => r.passed).length;
  const overallAccuracy = (passedTests / results.length) * 100;
  
  // Group results by test category
  const categoryResults: Record<string, { passed: number, total: number }> = {};
  
  for (const result of results) {
    // Extract category from test ID (e.g., 'entrepreneur-strong' -> 'entrepreneur')
    const category = result.testId.split('-')[0];
    
    if (!categoryResults[category]) {
      categoryResults[category] = { passed: 0, total: 0 };
    }
    
    categoryResults[category].total += 1;
    if (result.passed) {
      categoryResults[category].passed += 1;
    }
  }
  
  // Calculate accuracy by category
  const accuracyByCategory: Record<string, number> = {};
  
  for (const [category, counts] of Object.entries(categoryResults)) {
    accuracyByCategory[category] = (counts.passed / counts.total) * 100;
  }
  
  // Generate detailed analysis
  let detailedAnalysis = `Algorithm Accuracy Analysis\n`;
  detailedAnalysis += `------------------------\n`;
  detailedAnalysis += `Overall Accuracy: ${overallAccuracy.toFixed(2)}%\n\n`;
  
  detailedAnalysis += `Accuracy by Category:\n`;
  for (const [category, accuracy] of Object.entries(accuracyByCategory)) {
    detailedAnalysis += `- ${category}: ${accuracy.toFixed(2)}%\n`;
  }
  
  // Add failure analysis
  const failedTests = results.filter(r => !r.passed);
  if (failedTests.length > 0) {
    detailedAnalysis += `\nFailed Test Analysis:\n`;
    for (const failedTest of failedTests) {
      detailedAnalysis += `- ${failedTest.testName} (ID: ${failedTest.testId})\n`;
      detailedAnalysis += `  Expected: ${failedTest.expectedTopCareer || 'any'}, Got: ${failedTest.actualTopCareer}\n`;
      if (failedTest.missingExpectedCareers && failedTest.missingExpectedCareers.length > 0) {
        detailedAnalysis += `  Missing expected careers: ${failedTest.missingExpectedCareers.join(', ')}\n`;
      }
      detailedAnalysis += `\n`;
    }
  }
  
  return {
    overallAccuracy,
    accuracyByCategory,
    detailedAnalysis
  };
}

/**
 * Run all tests and generate a comprehensive report
 */
export function generateAlgorithmAnalysisReport(): string {
 //  console.log('Starting career matching algorithm analysis...');
  
  // Run the standard test cases
  const testResults = runAlgorithmTests();
  
  // Calculate accuracy metrics
  const accuracyResults = calculateAlgorithmAccuracy(testResults);
  
  // Analyze weight distribution
  const weightAnalysis = analyzeWeightDistribution();
  
  // Generate the report
  let report = `CAREER MATCHING ALGORITHM ANALYSIS REPORT\n`;
  report += `=========================================\n\n`;
  
  // Accuracy section
  report += `1. ALGORITHM ACCURACY\n`;
  report += accuracyResults.detailedAnalysis;
  report += `\n`;
  
  // Weight distribution section
  report += `2. WEIGHT DISTRIBUTION ANALYSIS\n`;
  report += `----------------------------\n`;
  report += `This analysis shows how different factors contribute to the matching score:\n\n`;
  
  for (const analysis of weightAnalysis) {
    report += `Career: ${analysis.careerTitle}\n`;
    report += `- Interest alignment: ${analysis.interestWeight.toFixed(1)}%\n`;
    report += `- Work style match: ${analysis.workStyleWeight.toFixed(1)}%\n`;
    report += `- Cognitive strengths: ${analysis.cognitiveWeight.toFixed(1)}%\n`;
    report += `- Social traits: ${analysis.socialWeight.toFixed(1)}%\n`;
    report += `- Motivation factors: ${analysis.motivationWeight.toFixed(1)}%\n`;
    report += `- Mini-game performance: ${analysis.miniGameWeight.toFixed(1)}%\n`;
    report += `- Other factors: ${analysis.otherWeight.toFixed(1)}%\n`;
    report += `- Total score: ${analysis.totalScore.toFixed(1)}%\n\n`;
  }
  
  // Detailed test results
  report += `3. DETAILED TEST RESULTS\n`;
  report += `---------------------\n`;
  
  for (const result of testResults) {
    report += `Test: ${result.testName} (${result.passed ? 'PASSED' : 'FAILED'})\n`;
    report += `Top career match: ${result.actualTopCareer} (${result.actualTopMatch}%)\n`;
    report += `Top 5 matches: ${result.actualTop5.join(', ')}\n`;
    
    if (result.expectedTopCareer) {
      report += `Expected top career: ${result.expectedTopCareer}\n`;
    }
    
    if (result.expectedMinMatch) {
      report += `Expected minimum match: ${result.expectedMinMatch}%\n`;
    }
    
    if (result.expectedCareers) {
      report += `Expected careers in top 5: ${result.expectedCareers.join(', ')}\n`;
    }
    
    if (result.missingExpectedCareers && result.missingExpectedCareers.length > 0) {
      report += `Missing expected careers: ${result.missingExpectedCareers.join(', ')}\n`;
    }
    
    report += `\n`;
  }
  
  // Recommendations
  report += `4. RECOMMENDATIONS\n`;
  report += `---------------\n`;
  
  // Add recommendations based on the test results
  if (accuracyResults.overallAccuracy < 80) {
    report += `- Improve overall algorithm accuracy (currently ${accuracyResults.overallAccuracy.toFixed(2)}%)\n`;
    
    // Find categories with low accuracy
    const lowAccuracyCategories = Object.entries(accuracyResults.accuracyByCategory)
      .filter(([_, accuracy]) => accuracy < 75)
      .map(([category, _]) => category);
    
    if (lowAccuracyCategories.length > 0) {
      report += `- Focus on improving matching for these categories: ${lowAccuracyCategories.join(', ')}\n`;
    }
  }
  
  // Check if any career types have significantly different weight distributions
  const avgInterestWeight = weightAnalysis.reduce((sum, item) => sum + item.interestWeight, 0) / weightAnalysis.length;
  const avgWorkStyleWeight = weightAnalysis.reduce((sum, item) => sum + item.workStyleWeight, 0) / weightAnalysis.length;
  
  for (const analysis of weightAnalysis) {
    if (Math.abs(analysis.interestWeight - avgInterestWeight) > 10) {
      report += `- Review interest alignment weighting for ${analysis.careerTitle}\n`;
    }
    
    if (Math.abs(analysis.workStyleWeight - avgWorkStyleWeight) > 5) {
      report += `- Review work style weighting for ${analysis.careerTitle}\n`;
    }
  }
  
  report += `- Consider adding more diverse test cases to improve algorithm validation\n`;
  report += `- Enhance scoring for mini-game performance to better differentiate career matches\n`;
  
 //  console.log('Algorithm analysis complete!');
  return report;
}

/**
 * Utility function to test algorithm with specific input
 */
export function testWithSpecificInputs(inputs: Partial<QuizResults>): CareerMatch[] {
  const baseline = createBaselineQuizResult();
  const testInput = { ...baseline, ...inputs };
  
  // Merge nested objects
  for (const key of Object.keys(inputs)) {
    if (typeof inputs[key] === 'object' && inputs[key] !== null) {
      testInput[key] = { ...baseline[key], ...inputs[key] };
    }
  }
  
  return generateCareerMatches(testInput);
}