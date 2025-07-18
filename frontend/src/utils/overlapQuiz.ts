/**
 * Career Overlap Quiz Differentiation System
 * This module provides targeted follow-up questions when overlap is detected between career matches
 */

interface OverlapQuestion {
  id: string;
  text: string;
  category: string;
  fields: string[];
  options: {
    text: string;
    fields: Record<string, number>;
  }[];
}

interface OverlapResult {
  categoryScores: Record<string, number>;
  recommendedField: string;
  differentiationStrength: number; // 0-100 scale of how strong the differentiation is
  explanation: string;
}

/**
 * Overlap categories and their targeted differentiation questions
 */
const overlapQuestions: OverlapQuestion[] = [
  // Business/Management Career Differentiation
  {
    id: "biz-management-1",
    text: "What part of a business project do you find most rewarding?",
    category: "business-management",
    fields: ["Business Manager", "Marketing Manager", "Sales Manager", "Entrepreneur"],
    options: [
      {
        text: "Setting the strategy and making key decisions",
        fields: { "Business Manager": 30, "Entrepreneur": 20 }
      },
      {
        text: "Crafting messaging and understanding customer needs",
        fields: { "Marketing Manager": 30, "Business Development": 15 }
      },
      {
        text: "Building relationships and negotiating outcomes",
        fields: { "Sales Manager": 30, "Business Development": 15 }
      },
      {
        text: "Creating something new and taking risks",
        fields: { "Entrepreneur": 30, "Marketing Manager": 10 }
      },
      {
        text: "Managing teams and helping others succeed",
        fields: { "Business Manager": 25, "Sales Manager": 10 }
      }
    ]
  },
  {
    id: "biz-management-2",
    text: "What's your approach to business challenges?",
    category: "business-management",
    fields: ["Business Manager", "Marketing Manager", "Sales Manager", "Entrepreneur"],
    options: [
      {
        text: "Developing a structured plan with measurable outcomes",
        fields: { "Business Manager": 25, "Marketing Manager": 10 }
      },
      {
        text: "Finding creative solutions that appeal to target audiences",
        fields: { "Marketing Manager": 25, "Creative Director": 10 }
      },
      {
        text: "Persuading others to see your perspective",
        fields: { "Sales Manager": 25, "Business Development": 15 }
      },
      {
        text: "Taking calculated risks to find innovative approaches",
        fields: { "Entrepreneur": 25, "Product Manager": 10 }
      },
      {
        text: "Analyzing data to make evidence-based decisions",
        fields: { "Business Manager": 20, "Marketing Manager": 15, "Business Analyst": 15 }
      }
    ]
  },

  // Technology Career Differentiation
  {
    id: "tech-1",
    text: "Which aspect of technology work most energizes you?",
    category: "technology",
    fields: ["Software Developer", "Data Scientist", "IT Manager", "UX/UI Designer"],
    options: [
      {
        text: "Writing code and building functional systems",
        fields: { "Software Developer": 30, "Software Engineer": 25 }
      },
      {
        text: "Analyzing data patterns and creating predictive models",
        fields: { "Data Scientist": 30, "Data Analyst": 20 }
      },
      {
        text: "Designing user-friendly interfaces and experiences",
        fields: { "UX/UI Designer": 30, "Web Designer": 20 }
      },
      {
        text: "Overseeing technical projects and teams",
        fields: { "IT Manager": 30, "Project Manager": 15 }
      },
      {
        text: "Solving complex technical problems",
        fields: { "Software Developer": 20, "Systems Analyst": 25 }
      }
    ]
  },
  {
    id: "tech-2",
    text: "How do you prefer to contribute to a technology project?",
    category: "technology",
    fields: ["Software Developer", "Data Scientist", "IT Manager", "UX/UI Designer"],
    options: [
      {
        text: "Creating the architecture and building the core functionality",
        fields: { "Software Developer": 25, "Software Engineer": 25 }
      },
      {
        text: "Working with data to draw conclusions and inform decisions",
        fields: { "Data Scientist": 30, "Business Analyst": 15 }
      },
      {
        text: "Making technology accessible and enjoyable for users",
        fields: { "UX/UI Designer": 30, "Digital Content Creator": 15 }
      },
      {
        text: "Ensuring all systems are secure, efficient, and well-maintained",
        fields: { "IT Manager": 25, "Systems Administrator": 20 }
      },
      {
        text: "Innovating new approaches to technical challenges",
        fields: { "Software Developer": 15, "Data Scientist": 15, "Research Scientist": 20 }
      }
    ]
  },

  // Creative Field Differentiation
  {
    id: "creative-1",
    text: "What kind of creative process do you prefer?",
    category: "creative",
    fields: ["Graphic Designer", "Art Director", "UX/UI Designer", "Digital Content Creator"],
    options: [
      {
        text: "Creating visuals that communicate specific messages",
        fields: { "Graphic Designer": 30, "Marketing Specialist": 10 }
      },
      {
        text: "Directing the overall visual strategy and creative vision",
        fields: { "Art Director": 30, "Creative Director": 20 }
      },
      {
        text: "Designing functional and beautiful digital experiences",
        fields: { "UX/UI Designer": 30, "Web Designer": 20 }
      },
      {
        text: "Producing content that entertains or educates an audience",
        fields: { "Digital Content Creator": 30, "Media Production": 20 }
      },
      {
        text: "Crafting a cohesive brand identity across multiple platforms",
        fields: { "Graphic Designer": 15, "Art Director": 15, "Brand Manager": 20 }
      }
    ]
  },
  {
    id: "creative-2",
    text: "What's most important to you in your creative work?",
    category: "creative",
    fields: ["Graphic Designer", "Art Director", "UX/UI Designer", "Digital Content Creator"],
    options: [
      {
        text: "Technical execution and visual impact",
        fields: { "Graphic Designer": 25, "Photographer": 15 }
      },
      {
        text: "Strategic direction and consistent visual storytelling",
        fields: { "Art Director": 25, "Brand Manager": 15 }
      },
      {
        text: "User experience and intuitive interaction",
        fields: { "UX/UI Designer": 25, "Product Designer": 15 }
      },
      {
        text: "Audience engagement and response",
        fields: { "Digital Content Creator": 25, "Social Media Manager": 15 }
      },
      {
        text: "Innovation and pushing creative boundaries",
        fields: { "Art Director": 20, "Creative Director": 20 }
      }
    ]
  },

  // Healthcare Differentiation
  {
    id: "healthcare-1",
    text: "What aspect of healthcare interests you most?",
    category: "healthcare",
    fields: ["Physician", "Medical Researcher", "Healthcare Administrator", "Nurse"],
    options: [
      {
        text: "Diagnosing and treating patients directly",
        fields: { "Physician": 30, "Nurse Practitioner": 15 }
      },
      {
        text: "Discovering new treatments through research",
        fields: { "Medical Researcher": 30, "Biomedical Engineer": 15 }
      },
      {
        text: "Improving healthcare systems and operations",
        fields: { "Healthcare Administrator": 30, "Health Policy Analyst": 15 }
      },
      {
        text: "Providing consistent care and patient support",
        fields: { "Nurse": 30, "Physician Assistant": 15 }
      },
      {
        text: "Focusing on preventive health and wellness",
        fields: { "Physician": 15, "Public Health Specialist": 25 }
      }
    ]
  },
  {
    id: "healthcare-2",
    text: "How would you prefer to improve healthcare outcomes?",
    category: "healthcare",
    fields: ["Physician", "Medical Researcher", "Healthcare Administrator", "Nurse"],
    options: [
      {
        text: "Through direct clinical intervention and patient care",
        fields: { "Physician": 25, "Surgeon": 20 }
      },
      {
        text: "By conducting studies that advance medical knowledge",
        fields: { "Medical Researcher": 25, "Epidemiologist": 15 }
      },
      {
        text: "By making healthcare delivery more efficient and accessible",
        fields: { "Healthcare Administrator": 25, "Health Information Manager": 15 }
      },
      {
        text: "Through compassionate, continuous patient support",
        fields: { "Nurse": 25, "Mental Health Counselor": 10 }
      },
      {
        text: "By applying technology to healthcare challenges",
        fields: { "Medical Researcher": 15, "Health Informatics Specialist": 25 }
      }
    ]
  },

  // Education/Teaching Differentiation
  {
    id: "education-1",
    text: "What educational role do you find most fulfilling?",
    category: "education",
    fields: ["Teacher", "Education Administrator", "Curriculum Developer", "Educational Consultant"],
    options: [
      {
        text: "Teaching students directly in a classroom setting",
        fields: { "Teacher": 30, "University Professor": 15 }
      },
      {
        text: "Leading educational institutions and programs",
        fields: { "Education Administrator": 30, "School Principal": 20 }
      },
      {
        text: "Designing educational content and learning experiences",
        fields: { "Curriculum Developer": 30, "Instructional Designer": 20 }
      },
      {
        text: "Advising on educational improvements and best practices",
        fields: { "Educational Consultant": 30, "Education Policy Analyst": 15 }
      },
      {
        text: "Supporting students with specialized learning needs",
        fields: { "Teacher": 15, "Special Education Specialist": 25 }
      }
    ]
  },
  {
    id: "education-2",
    text: "What educational approach resonates with you most?",
    category: "education",
    fields: ["Teacher", "Education Administrator", "Curriculum Developer", "Educational Consultant"],
    options: [
      {
        text: "Personalized, hands-on instruction tailored to individual needs",
        fields: { "Teacher": 25, "Learning Specialist": 20 }
      },
      {
        text: "Creating systems that support educational excellence",
        fields: { "Education Administrator": 25, "Education Program Director": 20 }
      },
      {
        text: "Developing innovative learning materials and methods",
        fields: { "Curriculum Developer": 25, "Educational Content Creator": 20 }
      },
      {
        text: "Analyzing and applying research to improve education",
        fields: { "Educational Consultant": 25, "Educational Researcher": 20 }
      },
      {
        text: "Using technology to enhance teaching and learning",
        fields: { "Curriculum Developer": 15, "Educational Technology Specialist": 25 }
      }
    ]
  }
];

/**
 * Determines if overlap questions should be presented based on career match results
 * @param careerMatches Array of career matches from the main algorithm
 * @returns Array of overlap categories that should be addressed
 */
export function detectOverlaps(careerMatches: Array<{title: string; match: number}>): string[] {
  // Get top 5 career matches
  const topCareers = careerMatches.slice(0, 5).map(match => match.title);
  
  // Check each overlap category for matches
  const overlaps: string[] = [];
  
  // For each overlap question, check if multiple fields match the top careers
  overlapQuestions.forEach(question => {
    const matchingFields = question.fields.filter(field => 
      topCareers.some(career => career.includes(field) || field.includes(career))
    );
    
    // If more than one field in this category matches, add to overlaps
    if (matchingFields.length > 1 && !overlaps.includes(question.category)) {
      overlaps.push(question.category);
    }
  });
  
  return [...new Set(overlaps)]; // Remove duplicates
}

/**
 * Gets relevant questions for detected overlap categories
 * @param overlapCategories Categories of overlap to address
 * @returns Questions to present to the user
 */
export function getOverlapQuestions(overlapCategories: string[]): OverlapQuestion[] {
  const questions: OverlapQuestion[] = [];
  
  overlapCategories.forEach(category => {
    const categoryQuestions = overlapQuestions.filter(q => q.category === category);
    questions.push(...categoryQuestions);
  });
  
  return questions;
}

/**
 * Processes user responses to overlap questions and refines career matches
 * @param responses User responses to overlap questions (question id -> selected option index)
 * @param originalMatches Original career matches from main algorithm
 * @returns Refined career matches with explanations
 */
export function processOverlapResponses(
  responses: Record<string, number>,
  originalMatches: Array<{title: string; match: number}>
): {
  refinedMatches: Array<{title: string; match: number}>;
  explanations: Record<string, string>;
} {
  // Create a copy of original matches to work with
  const refinedMatches = [...originalMatches];
  const explanations: Record<string, string> = {};
  
  // Calculate adjustments based on responses
  const adjustments: Record<string, number> = {};
  
  // Process each response
  Object.entries(responses).forEach(([questionId, optionIndex]) => {
    // Find the question
    const question = overlapQuestions.find(q => q.id === questionId);
    if (!question) return;
    
    // Get the selected option
    const option = question.options[optionIndex];
    if (!option) return;
    
    // Apply field adjustments
    Object.entries(option.fields).forEach(([field, adjustment]) => {
      adjustments[field] = (adjustments[field] || 0) + adjustment;
      
      // Add explanation for significant adjustments
      if (adjustment >= 20) {
        explanations[field] = explanations[field] || "";
        explanations[field] += `You prefer ${option.text.toLowerCase()}, which aligns well with ${field}. `;
      }
    });
  });
  
  // Apply adjustments to refined matches
  refinedMatches.forEach(match => {
    // Find any adjustments that apply to this career
    Object.entries(adjustments).forEach(([field, adjustment]) => {
      if (match.title.includes(field) || field.includes(match.title)) {
        // Apply percentage boost (max 15% to avoid overwhelming original algorithm)
        const boost = Math.min(adjustment / 10, 15);
        match.match = Math.min(Math.round(match.match + boost), 100);
      }
    });
  });
  
  // Re-sort matches by score
  refinedMatches.sort((a, b) => b.match - a.match);
  
  return {
    refinedMatches,
    explanations
  };
}

/**
 * Main function to run the overlap differentiation process
 * @param careerMatches Original career matches from main algorithm
 * @returns Object containing overlap detection results and questions if needed
 */
export function runOverlapDifferentiation(careerMatches: Array<{title: string; match: number}>) {
  // Detect overlaps
  const overlaps = detectOverlaps(careerMatches);
  
  // If no overlaps detected, return original matches
  if (overlaps.length === 0) {
    return {
      hasOverlap: false,
      originalMatches: careerMatches,
      refinedMatches: careerMatches,
      overlapCategories: [],
      questions: []
    };
  }
  
  // Get relevant questions
  const questions = getOverlapQuestions(overlaps);
  
  return {
    hasOverlap: true,
    originalMatches: careerMatches,
    refinedMatches: null, // To be filled after user responses
    overlapCategories: overlaps,
    questions
  };
}