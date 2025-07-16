import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  LuRocket, LuPlanet, LuSatellite, LuWand2, LuGift,
  LuInfo, LuActivity, LuRadiation, LuCombine, LuMessagesSquare
} from 'react-icons/lu';

// Define personality assessment questions embedded as mission scenarios
interface AssessmentQuestion {
  id: string;
  scenario: string;
  question: string;
  voicePrompt?: string; // For AI voice to ask this question
  trait: 'workStyle' | 'cognitiveStrength' | 'socialApproach' | 'motivation' | 'interests';
  subTrait: string;
  options: {
    id: string;
    text: string;
    value: number; // Value from 1-5 for this trait
    resourceReward?: 'fuel' | 'shields' | 'data' | 'materials';
    rewardAmount?: number;
  }[];
}

interface GalaxyExplorerGameProps {
  onComplete: (responses: Record<string, any>) => void;
  timeLimit?: number; // in seconds
  sectorName?: string;
  onAskQuestion?: (question: string, voiceId?: string) => void;
}

// Sample assessment questions embedded as mission scenarios
const assessmentQuestions: AssessmentQuestion[] = [
  {
    id: 'q1',
    scenario: 'Nebula Navigation Dilemma',
    question: 'Your ship has encountered a dense nebula with multiple navigation options. How do you proceed?',
    voicePrompt: "Your scanners show multiple paths through this nebula. What's your instinct telling you to do?",
    trait: 'workStyle',
    subTrait: 'planning',
    options: [
      { 
        id: 'q1-a', 
        text: 'Calculate all possible routes and analyze risk factors before choosing',
        value: 5,
        resourceReward: 'shields',
        rewardAmount: 15
      },
      { 
        id: 'q1-b', 
        text: 'Select the route that looks most promising and adjust as needed',
        value: 3,
        resourceReward: 'fuel',
        rewardAmount: 20
      },
      { 
        id: 'q1-c', 
        text: 'Trust your instincts and navigate through the nebula dynamically',
        value: 1,
        resourceReward: 'data',
        rewardAmount: 25
      }
    ]
  },
  {
    id: 'q2',
    scenario: 'Alien Artifact Analysis',
    question: 'Your team has discovered an unusual artifact of unknown origin. What is your approach to studying it?',
    voicePrompt: "This artifact has patterns unlike anything in our database. How will you unlock its secrets?",
    trait: 'cognitiveStrength',
    subTrait: 'analytical',
    options: [
      { 
        id: 'q2-a', 
        text: 'Methodically document every aspect before forming any theories',
        value: 5,
        resourceReward: 'data',
        rewardAmount: 20
      },
      { 
        id: 'q2-b', 
        text: 'Look for patterns and connections to known technologies',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 15
      },
      { 
        id: 'q2-c', 
        text: 'Test various interactions to see how the artifact responds',
        value: 1,
        resourceReward: 'shields',
        rewardAmount: 10
      }
    ]
  },
  {
    id: 'q3',
    scenario: 'Distress Signal Decision',
    question: 'You have received a distress signal from a mining colony, but it is in a region known for pirate activity. What do you do?',
    voicePrompt: "Commander, that distress call could be genuine or a trap. What's your call?",
    trait: 'socialApproach',
    subTrait: 'trust',
    options: [
      { 
        id: 'q3-a', 
        text: 'Approach cautiously with shields at maximum, ready for any scenario',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 20
      },
      { 
        id: 'q3-b', 
        text: 'Contact nearby ships to form a response team before investigating',
        value: 5,
        resourceReward: 'data',
        rewardAmount: 15
      },
      { 
        id: 'q3-c', 
        text: 'Respond immediately - someone\'s life could be at stake',
        value: 1,
        resourceReward: 'fuel',
        rewardAmount: 25
      }
    ]
  },
  {
    id: 'q4',
    scenario: 'Unexpected Discovery',
    question: 'During a routine planetary scan, you find evidence of advanced technology. How would you prefer to handle this discovery?',
    voicePrompt: "This technology... it doesn't match our development timelines. How should we proceed with this finding?",
    trait: 'workStyle',
    subTrait: 'innovation',
    options: [
      { 
        id: 'q4-a', 
        text: 'Document everything and return for a full scientific expedition',
        value: 5,
        resourceReward: 'data',
        rewardAmount: 30
      },
      { 
        id: 'q4-b', 
        text: 'Perform initial tests to understand its capabilities',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 20
      },
      { 
        id: 'q4-c', 
        text: 'Attempt to activate the technology to see what happens',
        value: 1,
        resourceReward: 'fuel',
        rewardAmount: 15
      }
    ]
  },
  {
    id: 'q5',
    scenario: 'Crew Conflict Resolution',
    question: 'Two senior officers are in disagreement about the mission priorities. How do you resolve this situation?',
    voicePrompt: "Your officers are at odds about our next move. How will you handle this tension?",
    trait: 'socialApproach',
    subTrait: 'leadership',
    options: [
      { 
        id: 'q5-a', 
        text: 'Listen to both perspectives, then make a decision based on mission objectives',
        value: 5,
        resourceReward: 'shields',
        rewardAmount: 25
      },
      { 
        id: 'q5-b', 
        text: 'Have them work together to find a compromise solution',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 15
      },
      { 
        id: 'q5-c', 
        text: 'Defer to the officer with more experience in the current situation',
        value: 1,
        resourceReward: 'data',
        rewardAmount: 20
      }
    ]
  },
  {
    id: 'q6',
    scenario: 'Resource Allocation Challenge',
    question: 'Your expedition is running low on critical resources. What is your approach to this challenge?',
    voicePrompt: "We're going to need to make some tough choices about our remaining supplies. What's your strategy?",
    trait: 'motivation',
    subTrait: 'resourcefulness',
    options: [
      { 
        id: 'q6-a', 
        text: 'Implement strict rationing protocols to extend current supplies',
        value: 5,
        resourceReward: 'fuel',
        rewardAmount: 20
      },
      { 
        id: 'q6-b', 
        text: 'Search for alternative resources in the current star system',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 25
      },
      { 
        id: 'q6-c', 
        text: 'Divert course to the nearest supply station, even if it delays the mission',
        value: 1,
        resourceReward: 'shields',
        rewardAmount: 15
      }
    ]
  },
  {
    id: 'q7',
    scenario: 'Anomalous Signal Investigation',
    question: 'Sensors detect an unusual signal from an unexplored region. What would you find most interesting about this discovery?',
    voicePrompt: "This signal doesn't match any known patterns in our database. What aspect of it intrigues you most?",
    trait: 'interests',
    subTrait: 'scientific',
    options: [
      { 
        id: 'q7-a', 
        text: 'The potential to discover a new form of communication or technology',
        value: 5,
        resourceReward: 'data',
        rewardAmount: 30
      },
      { 
        id: 'q7-b', 
        text: 'The challenge of decoding the signal\'s pattern and meaning',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 20
      },
      { 
        id: 'q7-c', 
        text: 'The possibility of making first contact with a new civilization',
        value: 1,
        resourceReward: 'fuel',
        rewardAmount: 15
      }
    ]
  },
  {
    id: 'q8',
    scenario: 'Deep Space Expedition',
    question: 'Your ship has the opportunity to venture into an uncharted region. What most motivates you about this mission?',
    voicePrompt: "We're about to go where no one has gone before. What excites you most about this opportunity?",
    trait: 'motivation',
    subTrait: 'exploration',
    options: [
      { 
        id: 'q8-a', 
        text: 'The chance to discover resources and phenomena beneficial to humanity',
        value: 5,
        resourceReward: 'materials',
        rewardAmount: 25
      },
      { 
        id: 'q8-b', 
        text: 'The personal accomplishment of being among the first to explore this region',
        value: 3,
        resourceReward: 'fuel',
        rewardAmount: 20
      },
      { 
        id: 'q8-c', 
        text: 'The intellectual challenge of mapping and understanding new stellar formations',
        value: 1,
        resourceReward: 'data',
        rewardAmount: 30
      }
    ]
  },
  {
    id: 'q9',
    scenario: 'Experimental Technology Test',
    question: 'Your team needs to test a new propulsion system. How would you approach this task?',
    voicePrompt: "This new engine technology is promising but untested. How would you proceed with the trials?",
    trait: 'cognitiveStrength',
    subTrait: 'methodical',
    options: [
      { 
        id: 'q9-a', 
        text: 'Run extensive simulations before any physical testing',
        value: 5,
        resourceReward: 'shields',
        rewardAmount: 25
      },
      { 
        id: 'q9-b', 
        text: 'Test individual components, then gradually integrate them',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 20
      },
      { 
        id: 'q9-c', 
        text: 'Set up a controlled environment for a full-scale test',
        value: 1,
        resourceReward: 'fuel',
        rewardAmount: 15
      }
    ]
  },
  {
    id: 'q10',
    scenario: 'Diplomatic First Contact',
    question: 'Your team has established communication with a new alien species. What aspect of this interaction would you focus on?',
    voicePrompt: "We've made contact with an entirely new civilization. What's your priority in this historic moment?",
    trait: 'interests',
    subTrait: 'cultural',
    options: [
      { 
        id: 'q10-a', 
        text: 'Understanding their social structures and cultural values',
        value: 5,
        resourceReward: 'data',
        rewardAmount: 25
      },
      { 
        id: 'q10-b', 
        text: 'Learning about their technological capabilities and scientific knowledge',
        value: 3,
        resourceReward: 'materials',
        rewardAmount: 20
      },
      { 
        id: 'q10-c', 
        text: 'Establishing trade and resource exchange protocols',
        value: 1,
        resourceReward: 'fuel',
        rewardAmount: 15
      }
    ]
  }
];

// Define resource icons
const resourceIcons = {
  'fuel': <LuActivity className="h-5 w-5 text-amber-400" />,
  'shields': <LuRadiation className="h-5 w-5 text-blue-400" />,
  'data': <LuCombine className="h-5 w-5 text-green-400" />,
  'materials': <LuWand2 className="h-5 w-5 text-purple-400" />
};

export function GalaxyExplorerGame({ 
  onComplete, 
  timeLimit = 0, // 0 means no time limit
  sectorName = 'Personality Sector',
  onAskQuestion
}: GalaxyExplorerGameProps) {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [resources, setResources] = useState({
    fuel: 50,
    shields: 50,
    data: 50,
    materials: 50
  });
  const [starSystems, setStarSystems] = useState<string[]>([]);
  const [currentAnimation, setCurrentAnimation] = useState<string | null>(null);
  const [traitScores, setTraitScores] = useState<Record<string, Record<string, number>>>({
    workStyle: {},
    cognitiveStrength: {},
    socialApproach: {},
    motivation: {},
    interests: {}
  });

  const spaceRef = useRef<HTMLDivElement>(null);
  
  // Initialize game
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Generate random star systems for exploration
      const systems = [];
      for (let i = 0; i < assessmentQuestions.length; i++) {
        systems.push(`Star System ${String.fromCharCode(65 + i)}`);
      }
      setStarSystems(systems);
      
      // Initialize trait scores
      const initialTraitScores: Record<string, Record<string, number>> = {
        workStyle: {},
        cognitiveStrength: {},
        socialApproach: {},
        motivation: {},
        interests: {}
      };
      
      assessmentQuestions.forEach(q => {
        if (!initialTraitScores[q.trait][q.subTrait]) {
          initialTraitScores[q.trait][q.subTrait] = 0;
        }
      });
      
      setTraitScores(initialTraitScores);
      
      // Ask first question with voice if available
      if (onAskQuestion && assessmentQuestions[0].voicePrompt) {
        onAskQuestion(assessmentQuestions[0].voicePrompt);
      }
      
      // Set up timer if time limit is provided
      if (timeLimit > 0) {
        const timer = setInterval(() => {
          setTimeRemaining(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              endGame();
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
        
        return () => clearInterval(timer);
      }
    }
  }, [gameStarted, onAskQuestion]);
  
  // Handle selecting an answer
  const handleSelectOption = (option: any) => {
    // Don't allow selection during animations
    if (currentAnimation) return;
    
    const currentQuestion = assessmentQuestions[currentQuestionIndex];
    
    // Store response
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: {
        questionId: currentQuestion.id,
        trait: currentQuestion.trait,
        subTrait: currentQuestion.subTrait,
        selectedOption: option.id,
        value: option.value
      }
    }));
    
    // Update trait scores
    setTraitScores(prev => {
      const newScores = { ...prev };
      
      // Make sure the subtrait exists
      if (!newScores[currentQuestion.trait][currentQuestion.subTrait]) {
        newScores[currentQuestion.trait][currentQuestion.subTrait] = 0;
      }
      
      // Add the value
      newScores[currentQuestion.trait][currentQuestion.subTrait] += option.value;
      
      return newScores;
    });
    
    // Update resources if there's a reward
    if (option.resourceReward) {
      setCurrentAnimation(option.resourceReward);
      setResources(prev => ({
        ...prev,
        [option.resourceReward!]: Math.min(100, prev[option.resourceReward!] + (option.rewardAmount || 10))
      }));
      
      // Clear animation after 1.5 seconds
      setTimeout(() => {
        setCurrentAnimation(null);
        
        // Move to next question or end game
        moveToNextQuestion();
      }, 1500);
    } else {
      // Move to next question or end game
      moveToNextQuestion();
    }
  };
  
  // Move to next question or end game
  const moveToNextQuestion = () => {
    const nextIndex = currentQuestionIndex + 1;
    
    if (nextIndex < assessmentQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      
      // Ask next question with voice if available
      if (onAskQuestion && assessmentQuestions[nextIndex].voicePrompt) {
        onAskQuestion(assessmentQuestions[nextIndex].voicePrompt);
      }
    } else {
      endGame();
    }
  };
  
  // End the game
  const endGame = () => {
    setGameOver(true);
    
    // Process final trait scores into a more usable format
    const processedResponses = {
      ...responses,
      traitScores: processTraitScores()
    };
    
    // Show celebration
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    // Notify parent component
    setTimeout(() => {
      onComplete(processedResponses);
    }, 3000);
  };
  
  // Process trait scores into Color Spectrum format
  const processTraitScores = () => {
    // For each trait, calculate average score
    const processedScores: Record<string, number> = {};
    
    Object.entries(traitScores).forEach(([trait, subTraits]) => {
      const subTraitValues = Object.values(subTraits);
      if (subTraitValues.length > 0) {
        // Calculate average and normalize to 0-100 scale
        const sum = subTraitValues.reduce((acc, val) => acc + val, 0);
        const avg = sum / subTraitValues.length;
        const normalized = Math.min(100, Math.round((avg / 5) * 100)); // Assuming max value is 5
        
        processedScores[trait] = normalized;
      } else {
        processedScores[trait] = 50; // Default middle value
      }
    });
    
    return processedScores;
  };
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Start button click handler
  const handleStart = () => {
    setGameStarted(true);
  };
  
  // Render start screen
  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center h-96 max-w-2xl mx-auto text-center p-6">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h2 className="text-2xl font-bold mb-2 text-primary">Galactic Explorers Initiative</h2>
          <p className="text-muted-foreground mb-6">
            Command your own starship through uncharted space. The decisions you make
            will shape your journey and reveal your unique command style.
          </p>
          
          <div className="bg-gradient-to-br from-blue-950 to-indigo-900 text-white/90 p-6 rounded-lg mb-6 border border-blue-500/30">
            <h3 className="font-medium mb-3 text-blue-300">Mission Briefing:</h3>
            <p className="mb-4">
              As the newly appointed commander of the interstellar vessel "Pathfinder," 
              you'll navigate through mysterious star systems, facing unique scenarios 
              that will test your decision-making and leadership abilities.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                {resourceIcons.fuel}
                <span>Fuel Reserves</span>
              </div>
              <div className="flex items-center gap-2">
                {resourceIcons.shields}
                <span>Shield Integrity</span>
              </div>
              <div className="flex items-center gap-2">
                {resourceIcons.data}
                <span>Data Storage</span>
              </div>
              <div className="flex items-center gap-2">
                {resourceIcons.materials}
                <span>Material Resources</span>
              </div>
            </div>
          </div>
        </motion.div>
        
        <Button 
          size="lg" 
          onClick={handleStart}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:shadow-lg group relative overflow-hidden"
        >
          <span className="relative z-10">Launch Expedition</span>
          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
      </div>
    );
  }
  
  // Render game over screen
  if (gameOver) {
    const colorSpectrum = processTraitScores();
    
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center p-6"
      >
        <LuRocket className="text-primary h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Expedition Complete</h2>
        <p className="text-lg mb-6">Your journey through the stars has revealed your commander profile</p>
        
        {/* Color spectrum visualization */}
        <div className="w-full bg-gradient-to-br from-blue-950 to-indigo-900 rounded-xl p-6 border border-blue-500/30 mb-8">
          <h3 className="text-xl font-semibold text-blue-300 mb-4">Your Command Spectrum</h3>
          
          <div className="space-y-4">
            {Object.entries(colorSpectrum).map(([trait, value]) => (
              <div key={trait} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">
                    {trait === 'workStyle' && 'Work Style'}
                    {trait === 'cognitiveStrength' && 'Cognitive Approach'}
                    {trait === 'socialApproach' && 'Team Dynamics'}
                    {trait === 'motivation' && 'Motivation Source'}
                    {trait === 'interests' && 'Area of Interest'}
                  </span>
                  <span className="text-white">{value}%</span>
                </div>
                <div className="h-3 rounded-full bg-black/30 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className={`h-full rounded-full ${trait === 'workStyle' ? 'bg-red-500' : 
                      trait === 'cognitiveStrength' ? 'bg-blue-500' : 
                      trait === 'socialApproach' ? 'bg-green-500' : 
                      trait === 'motivation' ? 'bg-purple-500' : 
                      'bg-amber-500'}`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <p className="text-muted-foreground mb-4">
          Based on your decisions during the {sectorName} exploration,
          we've mapped your unique approach to challenges and teamwork.
          This data will help guide your career journey.
        </p>
      </motion.div>
    );
  }
  
  // Get current question
  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  
  // Render main game
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Game header with resources */}
      <div className="flex justify-between items-center mb-4 bg-gradient-to-r from-blue-950 to-indigo-900 text-white p-3 rounded-lg border border-blue-500/30">
        <div className="text-sm">
          <div className="font-semibold mb-1">Star System {String.fromCharCode(65 + currentQuestionIndex)}</div>
          <div className="text-xs text-blue-300">Mission {currentQuestionIndex + 1}/{assessmentQuestions.length}</div>
        </div>
        
        {timeLimit > 0 && (
          <div className="flex items-center gap-1 bg-black/30 px-3 py-1 rounded-full">
            <span className={timeRemaining < 15 ? 'text-red-400 animate-pulse' : ''}>
              {formatTime(timeRemaining)}
            </span>
          </div>
        )}
        
        <div className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-amber-300">
              {resourceIcons.fuel}
              <span>Fuel</span>
            </div>
            <Progress value={resources.fuel} className="h-1.5 w-16 mt-1" />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1 text-xs text-blue-300">
              {resourceIcons.shields}
              <span>Shields</span>
            </div>
            <Progress value={resources.shields} className="h-1.5 w-16 mt-1" />
          </div>
        </div>
      </div>
      
      {/* Space visualization */}
      <div 
        ref={spaceRef}
        className="h-48 mb-6 rounded-lg bg-black relative overflow-hidden flex items-center justify-center"
      >
        {/* Animated stars */}
        <div className="stars-container absolute inset-0"></div>
        
        {/* Ship and planet visualization */}
        <div className="relative z-10 flex items-center justify-center w-full">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute left-10 text-4xl"
          >
            <LuRocket className="text-white" />
          </motion.div>
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute right-10 text-5xl"
          >
            <LuPlanet className="text-blue-400" />
          </motion.div>
          
          {/* Resource animation */}
          <AnimatePresence>
            {currentAnimation && (
              <motion.div
                initial={{ y: 0, opacity: 1, scale: 1 }}
                animate={{ y: -50, opacity: 0, scale: 1.5 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute text-xl"
              >
                <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full border border-white/20">
                  {resourceIcons[currentAnimation]}
                  <span className="text-white text-sm">+{assessmentQuestions[currentQuestionIndex].options.find(
                    o => o.resourceReward === currentAnimation
                  )?.rewardAmount || 10}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Scenario name */}
        <div className="absolute bottom-2 left-2 right-2 z-20">
          <div className="text-blue-300 text-sm font-semibold bg-black/60 rounded px-2 py-1 inline-block">
            {currentQuestion.scenario}
          </div>
        </div>
      </div>
      
      {/* Question and options */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="mb-6"
        >
          <Card className="shadow-lg overflow-hidden bg-gradient-to-br from-slate-50 to-slate-100 border-t-2 border-t-blue-500">
            <CardHeader className="p-4 pb-0">
              <div className="flex items-start gap-3">
                <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-700 flex-shrink-0 mt-1">
                  <LuMessagesSquare />
                </div>
                <div>
                  <p className="text-lg mb-4">{currentQuestion.question}</p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="p-4 pt-2">
              <div className="space-y-3 mt-2">
                {currentQuestion.options.map((option) => (
                  <motion.div
                    key={option.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 rounded-lg cursor-pointer transition-all
                      border border-slate-200 hover:border-blue-400 hover:shadow-md
                      bg-white hover:bg-blue-50
                    `}
                    onClick={() => handleSelectOption(option)}
                  >
                    <div className="text-md">{option.text}</div>
                    
                    {option.resourceReward && (
                      <div className="mt-2 flex items-center gap-1 text-sm text-slate-500">
                        <LuInfo className="h-3.5 w-3.5" />
                        <span>Reward:</span>
                        {resourceIcons[option.resourceReward]}
                        <span>+{option.rewardAmount}</span>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
      
      {/* Navigation status */}
      <div className="flex items-center justify-between mt-4 text-sm text-slate-500">
        <div>
          <LuSatellite className="inline mr-1" /> Scanning sector {currentQuestionIndex + 1} of {assessmentQuestions.length}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {resourceIcons.data}
            <span>{resources.data}%</span>
          </div>
          <div className="flex items-center gap-1">
            {resourceIcons.materials}
            <span>{resources.materials}%</span>
          </div>
        </div>
      </div>
      
      {/* Add CSS for space animation */}
      <style jsx global>{`
        .stars-container {
          background-image: 
            radial-gradient(2px 2px at 20px 30px, #eee, rgba(0, 0, 0, 0)),
            radial-gradient(2px 2px at 40px 70px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(1px 1px at 90px 40px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(1px 1px at 130px 80px, #fff, rgba(0, 0, 0, 0)),
            radial-gradient(1px 1px at 160px 120px, #fff, rgba(0, 0, 0, 0));
          background-repeat: repeat;
          background-size: 200px 200px;
          animation: stars-animation 60s linear infinite;
        }
        
        @keyframes stars-animation {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 200px 200px;
          }
        }
      `}</style>
    </div>
  );
}