export interface Career {
  id: string;
  title: string;
  description: string;
  skills: string[];
  relatedInterests: number[];
  salary: string;
  growth: string;
  workEnvironment: string;
  workStyle: string[];
  educationPath: string;
  imagePath: string;
  shadowingVideoUrl?: string;
  category?: string; // Added to support categorization in matching algorithm
}

// Helper function to identify trade careers with enhanced detection
export function isTradeCareer(careerInput: Career | string): boolean {
  // Expanded trade categories for more comprehensive identification
  const tradeCategories = [
    // Construction trades
    "Construction", "Electrical", "Plumbing", "HVAC", 
    "Automotive", "Manufacturing", "Welding", "Fabrication",
    "Carpentry", "Masonry", "Landscaping", "Electrician",
    "Plumber", "Carpenter", "HVAC Technician", "Welder",
    "Automotive Technician", "Solar Installer", "Wind Turbine Technician",
    
    // Skilled trades and vocational careers
    "Mechanic", "Technician", "Installer", "Repairer", "Machinist",
    "Equipment Operator", "Craft", "Apprentice", "Journeyman", 
    "Maintenance", "Repair", "Inspection", "Installation",
    
    // Culinary and service trades
    "Chef", "Culinary", "Catering", "Baker", "Brewing",
    
    // Artistic/creative trades
    "Woodworking", "Metalworking", "Glassblowing", "Ceramics"
  ];
  
  // Trade-related education keywords
  const tradeEducationPaths = [
    "Vocational", "Technical", "Apprenticeship", "Trade School",
    "Certificate", "License", "On-the-job"
  ];
  
  // Trade-related work environments
  const tradeWorkEnvironments = [
    "Workshop", "Field", "Construction Site", "Factory", "Plant",
    "Industrial", "Laboratory", "Kitchen", "Client Site", "Outdoors",
    "Physical"
  ];
  
  // Handle string input (career title)
  if (typeof careerInput === 'string') {
    return tradeCategories.some(category => 
      careerInput.toLowerCase().includes(category.toLowerCase())
    );
  }
  
  // Handle Career object
  const career = careerInput as Career;
  
  // Comprehensive check across multiple career attributes
  // 1. Check title for trade terms
  const titleMatch = tradeCategories.some(category => 
    career.title.toLowerCase().includes(category.toLowerCase())
  );
  
  // 2. Check work environment for trade settings
  const environmentMatch = career.workEnvironment ? tradeWorkEnvironments.some(env => 
    career.workEnvironment.toLowerCase().includes(env.toLowerCase())
  ) : false;
  
  // 3. Check skills for hands-on abilities
  const skillsMatch = career.skills.some(skill => 
    tradeCategories.some(category => skill.toLowerCase().includes(category.toLowerCase()))
  );
  
  // 4. Check work style for trade-related approaches
  const workStyleMatch = career.workStyle && career.workStyle.some(style => 
    style.toLowerCase().includes("hands-on") || 
    style.toLowerCase().includes("practical") ||
    style.toLowerCase().includes("technical")
  );
  
  // 5. Check education path for trade-related education
  const educationMatch = career.educationPath ? tradeEducationPaths.some(path => 
    career.educationPath.toLowerCase().includes(path.toLowerCase())
  ) : false;
  
  // Return true if any of these checks pass
  return titleMatch || environmentMatch || skillsMatch || workStyleMatch || educationMatch;
}

import { additionalCareers } from './additionalCareers';

// Core careers defined directly in this file
const coreCareers: Career[] = [
  {
    id: "electrician",
    title: "Electrician",
    description: "Install, maintain, and repair electrical systems in homes, businesses, and industrial facilities. Electricians ensure electrical systems work properly and safely.",
    skills: ["Technical Skills", "Problem Solving", "Physical Strength", "Critical Thinking", "Safety Awareness"],
    relatedInterests: [3, 4, 11, 19, 21],
    salary: "$60,040",
    growth: "+9% (2020-2030)",
    workEnvironment: "Construction Sites, Residential, Commercial, Industrial Settings",
    workStyle: ["Hands-on", "Practical", "Detail-oriented"],
    educationPath: "High school diploma plus 4-5 year apprenticeship or technical training. Licensing required.",
    imagePath: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/trade-video-1"
  },
  {
    id: "plumber",
    title: "Plumber",
    description: "Install and repair water, gas, and sewage systems in homes and businesses. Plumbers work with pipes, fixtures, and appliances to ensure proper functioning.",
    skills: ["Technical Skills", "Problem Solving", "Physical Strength", "Troubleshooting", "Customer Service"],
    relatedInterests: [3, 4, 7, 19],
    salary: "$59,880",
    growth: "+5% (2020-2030)",
    workEnvironment: "Residential, Commercial, Construction Sites",
    workStyle: ["Hands-on", "Practical", "Independent"],
    educationPath: "High school diploma plus 4-5 year apprenticeship. Licensing required in most states.",
    imagePath: "https://images.unsplash.com/photo-1542013936693-884638332954?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/trade-video-2"
  },
  {
    id: "carpenter",
    title: "Carpenter",
    description: "Build, install, and repair structures made of wood and other materials. Carpenters work on buildings, furniture, and various construction projects.",
    skills: ["Craftsmanship", "Physical Stamina", "Math", "Attention to Detail", "Problem Solving"],
    relatedInterests: [3, 4, 8, 18],
    salary: "$48,260",
    growth: "+2% (2020-2030)",
    workEnvironment: "Construction Sites, Residential, Commercial",
    workStyle: ["Hands-on", "Creative", "Precise"],
    educationPath: "High school diploma plus 3-4 year apprenticeship or on-the-job training.",
    imagePath: "https://images.unsplash.com/photo-1601055283742-8b27e81b5553?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/trade-video-3"
  },
  {
    id: "hvac_technician",
    title: "HVAC Technician",
    description: "Install, maintain and repair heating, ventilation, air conditioning, and refrigeration systems. HVAC technicians ensure comfortable indoor environments.",
    skills: ["Technical Knowledge", "Troubleshooting", "Customer Service", "Physical Stamina", "Attention to Detail"],
    relatedInterests: [3, 4, 11, 19],
    salary: "$50,590",
    growth: "+5% (2020-2030)",
    workEnvironment: "Residential, Commercial, Industrial Settings",
    workStyle: ["Hands-on", "Problem-solver", "Detail-oriented"],
    educationPath: "Postsecondary certificate or associate's degree plus apprenticeship. Certification often required.",
    imagePath: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/trade-video-4"
  },
  {
    id: "welder",
    title: "Welder",
    description: "Join metal parts using heat and pressure. Welders work on construction projects, manufacturing, and repair services across various industries.",
    skills: ["Technical Skills", "Spatial Awareness", "Physical Stamina", "Precision", "Safety Awareness"],
    relatedInterests: [3, 4, 8, 21],
    salary: "$46,000",
    growth: "+8% (2020-2030)",
    workEnvironment: "Manufacturing, Construction, Shipyards, Repair Shops",
    workStyle: ["Hands-on", "Precise", "Technical"],
    educationPath: "High school diploma plus technical training or apprenticeship. Certification available.",
    imagePath: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/trade-video-5"
  },
  {
    id: "automotive_technician",
    title: "Automotive Technician",
    description: "Diagnose, maintain, and repair cars and light trucks. Automotive technicians work with mechanical and electronic systems in vehicles.",
    skills: ["Technical Knowledge", "Problem Solving", "Manual Dexterity", "Customer Service", "Computer Skills"],
    relatedInterests: [3, 4, 7, 11],
    salary: "$46,880",
    growth: "+0% (2020-2030)",
    workEnvironment: "Repair Shops, Dealerships, Service Centers",
    workStyle: ["Hands-on", "Diagnostic", "Detail-oriented"],
    educationPath: "Postsecondary certificate or associate's degree. ASE certification recommended.",
    imagePath: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/trade-video-6"
  },
  {
    id: "software_developer",
    title: "Software Developer",
    description: "Create applications and systems that power our digital world. Software developers build, test, and maintain software for various platforms.",
    skills: ["Problem Solving", "Coding", "Critical Thinking", "Collaboration", "Adaptability"],
    relatedInterests: [11, 13, 14, 15, 21],
    salary: "$110,140",
    growth: "+22% (2020-2030)",
    workEnvironment: "Office, Remote, Hybrid",
    workStyle: ["Analytical", "Creative", "Detail-oriented"],
    educationPath: "Bachelor's in Computer Science or equivalent experience. Many enter through bootcamps or self-learning.",
    imagePath: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-1"
  },
  {
    id: "ux_ui_designer",
    title: "UX/UI Designer",
    description: "Create intuitive and engaging user experiences for digital products. UX/UI designers focus on how users interact with applications and websites.",
    skills: ["Creativity", "User Empathy", "Visual Design", "Wireframing", "User Research"],
    relatedInterests: [8, 13, 15, 18],
    salary: "$85,650",
    growth: "+13% (2020-2030)",
    workEnvironment: "Office, Remote, Hybrid",
    workStyle: ["Creative", "User-focused", "Detail-oriented"],
    educationPath: "Bachelor's in Design, HCI, or equivalent experience. Portfolio is crucial.",
    imagePath: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-2"
  },
  {
    id: "game_developer",
    title: "Game Developer",
    description: "Design and code interactive entertainment experiences. Game developers create games for various platforms, from mobile to console.",
    skills: ["Creativity", "Programming", "Storytelling", "3D Modeling", "Animation"],
    relatedInterests: [8, 11, 13, 15],
    salary: "$93,750",
    growth: "+10% (2020-2030)",
    workEnvironment: "Office, Studio, Remote",
    workStyle: ["Creative", "Technical", "Collaborative"],
    educationPath: "Bachelor's in Game Development, Computer Science, or equivalent experience.",
    imagePath: "https://images.unsplash.com/photo-1542744094-3a31f272c490?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-3"
  },
  {
    id: "data_scientist",
    title: "Data Scientist",
    description: "Extract valuable insights from complex data to drive business decisions. Data scientists use statistical analysis and machine learning.",
    skills: ["Analytics", "Programming", "Statistics", "Problem Solving", "Communication"],
    relatedInterests: [13, 16, 19, 20],
    salary: "$100,560",
    growth: "+28% (2020-2030)",
    workEnvironment: "Office, Remote",
    workStyle: ["Analytical", "Detail-oriented", "Innovative"],
    educationPath: "Bachelor's or Master's in Data Science, Statistics, Computer Science or related field.",
    imagePath: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-4"
  },
  {
    id: "digital_marketer",
    title: "Digital Marketer",
    description: "Create and implement strategies to promote products and services online. Digital marketers use social media, content, and ads.",
    skills: ["Creativity", "Analytics", "Communication", "Social Media", "SEO"],
    relatedInterests: [15, 16, 17],
    salary: "$67,230",
    growth: "+10% (2020-2030)",
    workEnvironment: "Office, Remote, Agency",
    workStyle: ["Creative", "Data-driven", "Adaptive"],
    educationPath: "Bachelor's in Marketing, Communications, or equivalent experience.",
    imagePath: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-5"
  },
  {
    id: "nurse",
    title: "Registered Nurse",
    description: "Provide and coordinate patient care in various healthcare settings. Nurses work directly with patients and doctors.",
    skills: ["Compassion", "Communication", "Critical Thinking", "Attention to Detail", "Stamina"],
    relatedInterests: [1, 9, 10, 12],
    salary: "$77,600",
    growth: "+9% (2020-2030)",
    workEnvironment: "Hospital, Clinic, Home Care",
    workStyle: ["Caring", "Organized", "Team-oriented"],
    educationPath: "Associate's or Bachelor's degree in Nursing, plus licensing.",
    imagePath: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-6"
  },
  {
    id: "physical_therapist",
    title: "Physical Therapist",
    description: "Help patients improve movement and manage pain after injuries or illnesses. Physical therapists work with patients of all ages.",
    skills: ["Empathy", "Physical Stamina", "Communication", "Problem Solving", "Motivation"],
    relatedInterests: [7, 9, 10, 12],
    salary: "$91,010",
    growth: "+21% (2020-2030)",
    workEnvironment: "Hospital, Clinic, Home Care, Sports Facilities",
    workStyle: ["Hands-on", "Patient", "Supportive"],
    educationPath: "Doctoral Degree in Physical Therapy (DPT) plus licensing.",
    imagePath: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-7"
  },
  {
    id: "civil_engineer",
    title: "Civil Engineer",
    description: "Design, develop, and supervise infrastructure projects like roads, buildings, and water systems. Civil engineers combine creativity with technical skills.",
    skills: ["Problem Solving", "Math", "Project Management", "Technical Knowledge", "Communication"],
    relatedInterests: [3, 4, 18, 19, 20],
    salary: "$88,050",
    growth: "+8% (2020-2030)",
    workEnvironment: "Office, Field, Construction Sites",
    workStyle: ["Analytical", "Detail-oriented", "Collaborative"],
    educationPath: "Bachelor's degree in Civil Engineering plus licensing for professional engineers.",
    imagePath: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    shadowingVideoUrl: "https://youtu.be/video-id-8"
  }
];

export interface RoadmapStep {
  title: string;
  description: string;
  completed: boolean;
}

export interface RoadmapPhase {
  title: string;
  description: string;
  steps: RoadmapStep[];
}

export interface CareerRoadmap {
  careerPath: string;
  timeline: string;
  investment: string;
  difficulty: string;
  phases: RoadmapPhase[];
}

// Add entrepreneur/business owner career option
export const entrepreneurCareer: Career = {
  id: "entrepreneur",
  title: "Entrepreneur/Business Owner",
  description: "Create and run your own business ventures. Entrepreneurs identify opportunities, develop business plans, secure funding, and lead organizations to success.",
  skills: ["Leadership", "Strategic Planning", "Risk Management", "Financial Acumen", "Adaptability", "Communication", "Sales"],
  relatedInterests: [1, 6, 7, 10, 13, 14, 17, 18, 20],
  salary: "Variable (highly dependent on business success)",
  growth: "+8% (2020-2030)",
  workEnvironment: "Variable (office, remote, on-site depending on business)",
  workStyle: ["Self-directed", "Risk-taking", "Creative", "Strategic", "Resilient"],
  educationPath: "No specific degree required. Many successful entrepreneurs have backgrounds in business, marketing, or industry-specific education, while others are self-taught.",
  imagePath: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  shadowingVideoUrl: "https://youtu.be/entrepreneur-video",
  category: "Business"
};

// Export the combined list of all careers
export const careers: Career[] = [...coreCareers, ...additionalCareers, entrepreneurCareer];
