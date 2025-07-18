// Define types for quiz data
export interface QuizOption {
  text: string;
  traitType?: string;
  value: string | number | boolean;
}

export interface QuizQuestion {
  id: string;
  text: string;
  options: QuizOption[];
  sector: number;
}

// Create quiz questions based on the PDF
export const quizQuestions: QuizQuestion[] = [
  // Sector 1 - Work Style and Preferences
  {
    id: "s1_q1",
    text: "Your TikTok about your dream workspace just went viral. What's it showing?",
    options: [
      { text: "A DIY studio where I'm creating like nobody's watching 🛠️", traitType: "Hands-On", value: "hands-on" },
      { text: "My tech setup with multiple screens giving major productivity vibes 💻", traitType: "Analytical", value: "analytical" },
      { text: "A cozy space that changes with my mood - aesthetic but functional ✨", traitType: "Flexible Environment", value: "flexible" }
    ],
    sector: 1
  },
  {
    id: "s1_q2",
    text: "24 hours to turn your wildest idea into reality. What's your move?",
    options: [
      { text: "Make a detailed plan in my Notes app - I need all the steps mapped out 📝", traitType: "Structured", value: "structured" },
      { text: "Just start and figure it out as I go - the process is the adventure 🏄", traitType: "Flexible Environment", value: "flexible" },
      { text: "Group chat goes crazy - my squad and I are making this happen together 👯", traitType: "Team-Oriented", value: "team_collaborative" }
    ],
    sector: 1
  },
  {
    id: "s1_q3",
    text: "You're the main character in your life story. How do you write the next episode?",
    options: [
      { text: "Journaling my goals and creating a vision board for what's next 📊", traitType: "Structured", value: "structured" },
      { text: "Going with the plot twists - the best stories aren't planned 🎭", traitType: "Flexible Environment", value: "flexible" },
      { text: "Asking my day ones for feedback - they know my character development 👥", traitType: "Team-Oriented", value: "team_network" }
    ],
    sector: 1
  },
  {
    id: "s1_q4",
    text: "Your moment just went live on all platforms. What power move are you making?",
    options: [
      { text: "Executing the strategy I've been practicing - consistency is key 💯", traitType: "Structured", value: "structured" },
      { text: "Taking that risk nobody expects - viral moments come from being bold 🚀", traitType: "Flexible Environment", value: "flexible" },
      { text: "Tagging in my crew - we're showing up and showing out together 🤝", traitType: "Team-Oriented", value: "team_rally" }
    ],
    sector: 1
  },
  {
    id: "s1_q5",
    text: "If your life became the next trending challenge, what would it be?",
    options: [
      { text: "Solo achievement speedrun - watch me level up on my own 💪", traitType: "Independent", value: "independent" },
      { text: "Creative chaos where there are no rules, just vibes 🎨", traitType: "Flexible Environment", value: "flexible" },
      { text: "Squad goals challenge that everyone wants to join 🌟", traitType: "Team-Oriented", value: "team_competition" }
    ],
    sector: 1
  },
  {
    id: "s1_q6",
    text: "You've got the ultimate project to finish. How's your day structured?",
    options: [
      { text: "Time blocks in my calendar app with alerts to stay on schedule ⏰", traitType: "Structured", value: "structured" },
      { text: "Different every time - I work when inspiration hits, day or night 🌙", traitType: "Flexible Environment", value: "flexible" },
      { text: "Discord calls with the team throughout the day to build together 🎮", traitType: "Team-Oriented", value: "team_brainstorm" }
    ],
    sector: 1
  },
  {
    id: "s1_q7",
    text: "What gives you that main character energy?",
    options: [
      { text: "Creating something with my own hands that didn't exist before 🔨", traitType: "Hands-On", value: "hands-on" },
      { text: "Solving a problem everyone else gave up on 🧩", traitType: "Analytical", value: "analytical" },
      { text: "Building connections that bring people together in new ways 🌐", traitType: "Team-Oriented", value: "team_connection" }
    ],
    sector: 1
  },
  {
    id: "s1_q8",
    text: "Big decision energy - which one is you?",
    options: [
      { text: "Researching all night and making a pros/cons list before choosing 🔎", traitType: "Analytical", value: "analytical" },
      { text: "Trusting the vibe check - if it feels right, it is right 💫", traitType: "Flexible Environment", value: "flexible" },
      { text: "Getting input from my circle - their perspectives always help ⭕", traitType: "Team-Oriented", value: "team_wisdom" }
    ],
    sector: 1
  },
  {
    id: "s1_q9",
    text: "You've got 10 minutes to master something new. Your approach?",
    options: [
      { text: "Dive in and try it - I'll learn faster from my Ls and Ws 🏆", traitType: "Hands-On", value: "hands-on" },
      { text: "YouTube tutorial at 2x speed while taking notes 📱", traitType: "Analytical", value: "analytical" },
      { text: "DM someone who's already elite at it for their hacks ✉️", traitType: "Team-Oriented", value: "team_mentor" }
    ],
    sector: 1
  },
  {
    id: "s1_q10",
    text: "The ultimate challenge just dropped in your notifications. How do you respond?",
    options: [
      { text: "Need all the details first so I can execute flawlessly 📋", traitType: "Structured", value: "structured" },
      { text: "Let me cook - I need space to put my own spin on this 🔥", traitType: "Flexible Environment", value: "flexible" },
      { text: "Assembling my dream team - we're about to make this legendary 🏅", traitType: "Team-Oriented", value: "team_synergy" }
    ],
    sector: 1
  },
  {
    id: "s1_q11",
    text: "What's your work vibe?",
    options: [
      { text: "Headphones on, locked in, working solo like a mastermind!", traitType: "Independent", value: "independent" },
      { text: "Creative chaos—some structure, but mostly inspiration!", traitType: "Flexible Environment", value: "flexible" },
      { text: "Energy-filled collabs—I thrive with my people!", traitType: "Team-Oriented", value: "team_collaboration" }
    ],
    sector: 1
  },
  {
    id: "s1_q12",
    text: "A major plot twist just dropped in your plan—how do you react?",
    options: [
      { text: "Stick to the original idea—if it ain't broke, don't fix it!", traitType: "Structured", value: "structured" },
      { text: "Pivot fast—I'm built for last-minute magic!", traitType: "Flexible Environment", value: "flexible" },
      { text: "Call a team huddle—let's adjust together!", traitType: "Team-Oriented", value: "team_adaptable" }
    ],
    sector: 1
  },
  {
    id: "s1_q13",
    text: "What makes a project feel legendary?",
    options: [
      { text: "Seeing something real and physical come to life!", traitType: "Hands-On", value: "hands-on" },
      { text: "Solving something no one else could and proving them wrong!", traitType: "Analytical", value: "analytical" },
      { text: "Creating something that inspires and connects people!", traitType: "Team-Oriented", value: "team_inspire" }
    ],
    sector: 1
  },
  {
    id: "s1_q14",
    text: "If your workday had a theme song, what would it be?",
    options: [
      { text: "A steady, powerful beat that keeps me focused!", traitType: "Structured", value: "structured" },
      { text: "A mix of sounds—every day is a different melody!", traitType: "Flexible Environment", value: "flexible" },
      { text: "An anthem that the whole squad sings together!", traitType: "Team-Oriented", value: "team_anthem" }
    ],
    sector: 1
  },
  {
    id: "s1_q15",
    text: "You're about to step onto the biggest stage of your life. What's your mindset?",
    options: [
      { text: "\"I got this. I'll handle it on my own.\"", traitType: "Independent", value: "independent" },
      { text: "\"Let's go! I was born for this!\"", traitType: "Flexible Environment", value: "flexible" },
      { text: "\"It's not just about me—let's do this together!\"", traitType: "Team-Oriented", value: "team_together" }
    ],
    sector: 1
  },
  
  // Sector 2 - Cognitive Strengths
  {
    id: "s2_q1",
    text: "You need to solve a tough problem. What's your approach?",
    options: [
      { text: "Follow a method I was taught.", traitType: "Learned Behavior", value: "learned" },
      { text: "Use a skill I've practiced.", traitType: "Skills", value: "skills" },
      { text: "Think back to a similar situation I've faced before.", traitType: "Experience", value: "experience" },
      { text: "Apply facts or information I know.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q2",
    text: "You have to learn something new quickly. What works best for you?",
    options: [
      { text: "Step-by-step instructions or lessons.", traitType: "Learned Behavior", value: "learned" },
      { text: "Hands-on practice.", traitType: "Skills", value: "skills" },
      { text: "Relating it to something I've done before.", traitType: "Experience", value: "experience" },
      { text: "Understanding the big picture and how it works.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q3",
    text: "You're fixing something that's broken. What's your first move?",
    options: [
      { text: "Follow instructions or a guide.", traitType: "Learned Behavior", value: "learned" },
      { text: "Use a technique I already know.", traitType: "Skills", value: "skills" },
      { text: "Think about a time I fixed something similar.", traitType: "Experience", value: "experience" },
      { text: "Use what I know about how it works.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q4",
    text: "How do you handle unexpected challenges?",
    options: [
      { text: "Apply a strategy I've learned.", traitType: "Learned Behavior", value: "learned" },
      { text: "Use my personal abilities to work through it.", traitType: "Skills", value: "skills" },
      { text: "Think about what worked in the past.", traitType: "Experience", value: "experience" },
      { text: "Analyze the situation based on facts I know.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q5",
    text: "You need to teach someone something. How do you explain it?",
    options: [
      { text: "Repeat the way I learned it.", traitType: "Learned Behavior", value: "learned" },
      { text: "Demonstrate the skill.", traitType: "Skills", value: "skills" },
      { text: "Use examples from my own experience.", traitType: "Experience", value: "experience" },
      { text: "Explain the logic behind it.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q6",
    text: "You're competing in a trivia game. What helps you answer questions?",
    options: [
      { text: "Things I've memorized from studying.", traitType: "Learned Behavior", value: "learned" },
      { text: "Quick thinking and problem-solving ability.", traitType: "Skills", value: "skills" },
      { text: "Personal experiences and things I've seen.", traitType: "Experience", value: "experience" },
      { text: "Facts and concepts I already know.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q7",
    text: "You're put in charge of a group project. What's your strength?",
    options: [
      { text: "I know how group work is supposed to be structured.", traitType: "Learned Behavior", value: "learned" },
      { text: "I'm good at organizing and completing tasks.", traitType: "Skills", value: "skills" },
      { text: "I've led projects before, so I know what works.", traitType: "Experience", value: "experience" },
      { text: "I understand how people work and how to make a plan.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q8",
    text: "You have to make a big decision. What helps you the most?",
    options: [
      { text: "A process or rule I've learned.", traitType: "Learned Behavior", value: "learned" },
      { text: "My ability to analyze the situation.", traitType: "Skills", value: "skills" },
      { text: "What I've experienced in the past.", traitType: "Experience", value: "experience" },
      { text: "Facts and logic that apply to the situation.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q9",
    text: "Someone asks for your advice. How do you respond?",
    options: [
      { text: "Share advice I've heard or been taught.", traitType: "Learned Behavior", value: "learned" },
      { text: "Use reasoning and problem-solving to help them.", traitType: "Skills", value: "skills" },
      { text: "Tell them what worked for me in a similar situation.", traitType: "Experience", value: "experience" },
      { text: "Give them facts or information to consider.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  {
    id: "s2_q10",
    text: "You need to improve at something. How do you do it?",
    options: [
      { text: "Follow a structured learning process.", traitType: "Learned Behavior", value: "learned" },
      { text: "Keep practicing until I get better.", traitType: "Skills", value: "skills" },
      { text: "Learn from my past mistakes and adjust.", traitType: "Experience", value: "experience" },
      { text: "Study and research to understand it better.", traitType: "Knowledge", value: "knowledge" }
    ],
    sector: 2
  },
  
  // Sector 3 - Personality Traits (Yes/No Questions)
  {
    id: "s3_q1",
    text: "I feel energized when I'm around a lot of people.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q2",
    text: "I prefer deep one-on-one conversations over group discussions.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q3",
    text: "I need time alone to recharge after socializing.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q4",
    text: "I enjoy being the center of attention in social settings.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q5",
    text: "I would rather spend my free time with a few close friends than at a big event.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q6",
    text: "I like taking charge and making decisions in a group.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q7",
    text: "I feel more comfortable following a strong leader than being one.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q8",
    text: "When there's a problem, I naturally step up to find a solution.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q9",
    text: "I prefer being the person who supports the leader rather than leading myself.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q10",
    text: "People often look to me for direction in group situations.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q11",
    text: "I enjoy trying new things, even if there's a chance I might fail.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q12",
    text: "I prefer to have a solid plan rather than taking chances.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q13",
    text: "I'm willing to take big risks if there's a chance for big rewards.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q14",
    text: "I like knowing exactly what to expect instead of dealing with uncertainty.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  {
    id: "s3_q15",
    text: "I get excited by challenges that push me out of my comfort zone.",
    options: [
      { text: "Yes", value: true },
      { text: "No", value: false }
    ],
    sector: 3
  },
  
  // Sector 4 - Motivation
  {
    id: "s4_q1",
    text: "What drives you to succeed the most?",
    options: [
      { text: "Achieving personal goals", value: "personal_goals" },
      { text: "Helping others succeed", value: "helping_others" },
      { text: "Gaining recognition", value: "recognition" },
      { text: "Overcoming challenges", value: "challenges" }
    ],
    sector: 4
  },
  {
    id: "s4_q2",
    text: "Which of these excites you the most?",
    options: [
      { text: "Learning something new", value: "learning" },
      { text: "Solving complex problems", value: "solving" },
      { text: "Helping others grow", value: "helping" },
      { text: "Earning rewards for hard work", value: "rewards" }
    ],
    sector: 4
  },
  {
    id: "s4_q3",
    text: "When faced with a task, what motivates you to keep going?",
    options: [
      { text: "The sense of accomplishment", value: "accomplishment" },
      { text: "The opportunity to help people", value: "helping" },
      { text: "The challenge and growth", value: "growth" },
      { text: "The potential rewards", value: "rewards" }
    ],
    sector: 4
  },
  {
    id: "s4_q4",
    text: "What type of work environment energizes you the most?",
    options: [
      { text: "Collaborative teamwork", value: "collaborative" },
      { text: "Independent focus", value: "independent" },
      { text: "A mix of both", value: "mixed" },
      { text: "Constantly changing challenges", value: "dynamic" }
    ],
    sector: 4
  },
  {
    id: "s4_q5",
    text: "Which of these best describes what you want from your work?",
    options: [
      { text: "Stability and security", value: "stability" },
      { text: "Innovation and new experiences", value: "innovation" },
      { text: "Impacting others' lives", value: "impact" },
      { text: "Continuous learning and development", value: "learning" }
    ],
    sector: 4
  },
  {
    id: "s4_q6",
    text: "What makes you feel most proud of your work?",
    options: [
      { text: "Solving tough problems", value: "problem_solving" },
      { text: "Helping others succeed", value: "helping" },
      { text: "Creative freedom", value: "creativity" },
      { text: "Financial success", value: "financial" }
    ],
    sector: 4
  },
  {
    id: "s4_q7",
    text: "When setting goals, what's most important to you?",
    options: [
      { text: "Personal growth and development", value: "growth" },
      { text: "Helping others along the way", value: "helping" },
      { text: "Financial reward", value: "financial" },
      { text: "Making a lasting impact", value: "impact" }
    ],
    sector: 4
  },
  {
    id: "s4_q8",
    text: "How do you prefer to spend your free time?",
    options: [
      { text: "Exploring new ideas or hobbies", value: "exploring" },
      { text: "Working on challenging projects", value: "challenging_projects" },
      { text: "Volunteering or helping others", value: "volunteering" },
      { text: "Relaxing and recharging", value: "relaxing" }
    ],
    sector: 4
  },
  {
    id: "s4_q9",
    text: "What inspires you to take action?",
    options: [
      { text: "A clear plan and strategy", value: "plan" },
      { text: "Positive feedback from others", value: "feedback" },
      { text: "The desire to make a difference", value: "difference" },
      { text: "The potential for personal gain", value: "gain" }
    ],
    sector: 4
  },
  {
    id: "s4_q10",
    text: "Which of these is most important to you in your career?",
    options: [
      { text: "Making a positive impact on the world", value: "impact" },
      { text: "The ability to continuously learn", value: "learning" },
      { text: "Having job security and stability", value: "security" },
      { text: "Earning a high salary", value: "salary" }
    ],
    sector: 4
  }
];

// Sector 5 - Interests
export const interestOptions = [
  { id: 1, name: "Emergency Services / First Responder" },
  { id: 2, name: "Military" },
  { id: 3, name: "Skilled Trades" },
  { id: 4, name: "Building / Construction" },
  { id: 5, name: "Vehicles / Aviation" },
  { id: 6, name: "Real Estate / Brokerage" },
  { id: 7, name: "Sports / Fitness" },
  { id: 8, name: "Arts / Performance" },
  { id: 9, name: "Animals / Nature" },
  { id: 10, name: "Health / Wellness" },
  { id: 11, name: "Gaming / Interactive Media" },
  { id: 12, name: "Teaching / Coaching" },
  { id: 13, name: "Software Development" },
  { id: 14, name: "Hardware Technology" },
  { id: 15, name: "Content Creation" },
  { id: 16, name: "Finance / Data" },
  { id: 17, name: "Writing / Communication" },
  { id: 18, name: "Architectural Design / City Planning" },
  { id: 19, name: "Engineering" },
  { id: 20, name: "Renewable Energy / Science" },
  { id: 21, name: "Information / Cyber Security" },
  { id: 22, name: "Attorney / Law" }
];