import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { 
  LuCheck, LuX, LuArrowRightCircle, LuShieldAlert, LuScanFace, 
  LuZap, LuBrain, LuTrophy, LuTarget
} from 'react-icons/lu';

// Define types for skill aptitudes
interface SkillAptitude {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: React.ReactNode;
}

interface CommandModule {
  id: string;
  name: string;
  description: string;
  powerLevel: number;
  category: string;
}

interface BattleScenario {
  id: string;
  description: string;
  challenge: string;
  requiredAptitude: string;
  requiredPower: number;
}

interface SkillMatchGameProps {
  onComplete: (score: number, aptitudes: Record<string, number>) => void;
  timeLimit?: number; // in seconds
  sectorName?: string;
}

// Futuristic battle aptitudes
const battleAptitudes: SkillAptitude[] = [
  { 
    id: 'tactical-thinking', 
    name: 'Tactical Thinking', 
    category: 'cognitive',
    description: 'The ability to analyze situations and adapt strategies in real-time',
    icon: <LuBrain />
  },
  { 
    id: 'pattern-recognition', 
    name: 'Pattern Recognition', 
    category: 'cognitive',
    description: 'Identifying meaningful patterns within complex data streams',
    icon: <LuScanFace />
  },
  { 
    id: 'adaptive-command', 
    name: 'Adaptive Command', 
    category: 'social',
    description: 'Leading and adjusting team strategies based on changing conditions',
    icon: <LuTarget />
  },
  { 
    id: 'resource-management', 
    name: 'Resource Management', 
    category: 'work',
    description: 'Efficiently allocating limited resources for maximum effectiveness',
    icon: <LuZap />
  },
  { 
    id: 'defensive-resilience', 
    name: 'Defensive Resilience', 
    category: 'social',
    description: 'Maintaining operational capability under hostile conditions',
    icon: <LuShieldAlert />
  }
];

// Command module options
const commandModules: CommandModule[] = [
  {
    id: 'tactical-array',
    name: 'Tactical Array',
    description: 'Enhances strategic processing and decision-making in combat',
    powerLevel: 75,
    category: 'tactical-thinking'
  },
  {
    id: 'neural-scanner',
    name: 'Neural Scanner',
    description: 'Advanced pattern recognition for identifying enemy weaknesses',
    powerLevel: 82,
    category: 'pattern-recognition'
  },
  {
    id: 'fleet-command',
    name: 'Fleet Command',
    description: 'Coordinates multiple units for synchronized attacks',
    powerLevel: 68,
    category: 'adaptive-command'
  },
  {
    id: 'energy-distributor',
    name: 'Energy Distributor',
    description: 'Optimizes energy allocation across ship systems',
    powerLevel: 70,
    category: 'resource-management'
  },
  {
    id: 'shield-matrix',
    name: 'Shield Matrix',
    description: 'Advanced defensive protocols that adapt to attack patterns',
    powerLevel: 73,
    category: 'defensive-resilience'
  },
  {
    id: 'quantum-analyzer',
    name: 'Quantum Analyzer',
    description: 'Identifies subtle patterns in enemy formations',
    powerLevel: 65,
    category: 'pattern-recognition'
  },
  {
    id: 'battle-strategist',
    name: 'Battle Strategist',
    description: 'Develops complex multi-phase attack sequences',
    powerLevel: 80,
    category: 'tactical-thinking'
  },
  {
    id: 'swarm-director',
    name: 'Swarm Director',
    description: 'Coordinates drone swarms for adaptive defense patterns',
    powerLevel: 77,
    category: 'adaptive-command'
  },
  {
    id: 'resource-optimizer',
    name: 'Resource Optimizer',
    description: 'Maximizes efficiency of limited battle resources',
    powerLevel: 69,
    category: 'resource-management'
  },
  {
    id: 'defense-grid',
    name: 'Defense Grid',
    description: 'Creates layered defensive barriers against multiple threats',
    powerLevel: 71,
    category: 'defensive-resilience'
  }
];

// Battle scenarios
const battleScenarios: BattleScenario[] = [
  {
    id: 'asteroid-ambush',
    description: 'Enemy forces are hiding within a dense asteroid field',
    challenge: 'Identify enemy positions while navigating hazardous terrain',
    requiredAptitude: 'pattern-recognition',
    requiredPower: 70
  },
  {
    id: 'multi-vector-assault',
    description: 'Multiple attack vectors detected on approach',
    challenge: 'Coordinate defensive formations while maintaining offensive capabilities',
    requiredAptitude: 'tactical-thinking',
    requiredPower: 75
  },
  {
    id: 'fleet-coordination',
    description: 'Your fleet is scattered and communications are limited',
    challenge: 'Regroup and establish a unified attack strategy',
    requiredAptitude: 'adaptive-command',
    requiredPower: 65
  },
  {
    id: 'power-critical',
    description: 'Main reactor operating at 30% capacity',
    challenge: 'Allocate limited power to critical systems while maintaining combat effectiveness',
    requiredAptitude: 'resource-management',
    requiredPower: 68
  },
  {
    id: 'sustained-assault',
    description: 'Enemy forces launching wave attacks against your position',
    challenge: 'Maintain defensive integrity during prolonged engagement',
    requiredAptitude: 'defensive-resilience',
    requiredPower: 72
  }
];

export function SkillMatchGame({ 
  onComplete, 
  timeLimit = 120,
  sectorName = 'Battle Command'
}: SkillMatchGameProps) {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [score, setScore] = useState(0);
  const [currentScenario, setCurrentScenario] = useState<BattleScenario | null>(null);
  const [availableModules, setAvailableModules] = useState<CommandModule[]>([]);
  const [selectedModule, setSelectedModule] = useState<CommandModule | null>(null);
  const [powerAllocation, setPowerAllocation] = useState<number>(70);
  const [battleResult, setBattleResult] = useState<'success' | 'failure' | null>(null);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);
  const [aptitudeScores, setAptitudeScores] = useState<Record<string, number>>({
    'tactical-thinking': 50,
    'pattern-recognition': 50,
    'adaptive-command': 50,
    'resource-management': 50,
    'defensive-resilience': 50
  });
  
  // Refs for animation elements
  const battleArenaRef = useRef<HTMLDivElement>(null);
  
  // Initialize game data
  useEffect(() => {
    if (gameStarted && !gameOver) {
      // Start with first scenario
      generateNewScenario();
      
      // Start timer
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
  }, [gameStarted]);
  
  // Generate a new battle scenario
  const generateNewScenario = () => {
    // Filter out completed scenarios
    const availableScenarios = battleScenarios.filter(
      scenario => !completedMissions.includes(scenario.id)
    );
    
    // If all scenarios completed, end game
    if (availableScenarios.length === 0) {
      endGame();
      return;
    }
    
    // Select random scenario
    const scenarioIndex = Math.floor(Math.random() * availableScenarios.length);
    const scenario = availableScenarios[scenarioIndex];
    setCurrentScenario(scenario);
    
    // Get modules that match the required aptitude plus 2 random ones
    const matchingModules = commandModules.filter(
      module => module.category === scenario.requiredAptitude
    );
    
    const otherModules = commandModules.filter(
      module => module.category !== scenario.requiredAptitude
    );
    
    // Shuffle and take 2 random modules from other categories
    const shuffledOthers = [...otherModules].sort(() => Math.random() - 0.5).slice(0, 2);
    
    // Combine and shuffle all available modules
    const modules = [...matchingModules, ...shuffledOthers].sort(() => Math.random() - 0.5);
    setAvailableModules(modules);
    setSelectedModule(null);
    setPowerAllocation(70);
    setBattleResult(null);
  };
  
  // Handle module selection
  const handleModuleSelect = (module: CommandModule) => {
    setSelectedModule(module);
  };
  
  // Handle power allocation
  const handlePowerAllocation = (value: number[]) => {
    setPowerAllocation(value[0]);
  };
  
  // Engage battle
  const engageBattle = () => {
    if (!selectedModule || !currentScenario) return;
    
    // Calculate success probability
    // 1. Right module category is important
    const categoryMatch = selectedModule.category === currentScenario.requiredAptitude;
    // 2. Power allocation must be sufficient but not wasteful
    const powerEfficiency = powerAllocation >= currentScenario.requiredPower ? 
      1 - Math.min(0.3, (powerAllocation - currentScenario.requiredPower) / 100) : 
      powerAllocation / currentScenario.requiredPower;
    // 3. Module power level affects success
    const modulePower = selectedModule.powerLevel / 100;
    
    // Calculate final success probability
    const successProbability = categoryMatch ? 
      (0.7 * powerEfficiency + 0.3 * modulePower) : 
      (0.3 * powerEfficiency + 0.2 * modulePower);
    
    // Determine if mission succeeds (with randomness)
    const isSuccessful = Math.random() < successProbability;
    
    // Update battle result
    setBattleResult(isSuccessful ? 'success' : 'failure');
    
    // Update aptitude scores based on choices
    setAptitudeScores(prev => {
      const newScores = { ...prev };
      
      // The aptitude related to the selected module gets a boost
      newScores[selectedModule.category] += isSuccessful ? 8 : 3;
      
      // Small boost to the required aptitude for attempting the scenario
      if (currentScenario.requiredAptitude !== selectedModule.category) {
        newScores[currentScenario.requiredAptitude] += isSuccessful ? 3 : 1;
      }
      
      // Cap all scores at 100
      Object.keys(newScores).forEach(key => {
        newScores[key] = Math.min(100, newScores[key]);
      });
      
      return newScores;
    });
    
    // Update score
    if (isSuccessful) {
      // Base points + bonus for efficiency
      const basePoints = 50;
      const efficiencyBonus = Math.round(powerEfficiency * 50);
      const categoryBonus = categoryMatch ? 25 : 0;
      const points = basePoints + efficiencyBonus + categoryBonus;
      
      setScore(prev => prev + points);
      
      // Show confetti for successful missions
      confetti({
        particleCount: 30,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Add to completed missions
      setCompletedMissions(prev => [...prev, currentScenario.id]);
    }
    
    // After 2 seconds, move to next scenario
    setTimeout(() => {
      setBattleResult(null);
      generateNewScenario();
    }, 2000);
  };
  
  // End the game
  const endGame = () => {
    setGameOver(true);
    
    // Calculate final aptitude scores - normalize to percentage of max possible
    const normalizedScores: Record<string, number> = {};
    Object.entries(aptitudeScores).forEach(([key, value]) => {
      normalizedScores[key] = Math.round(value);
    });
    
    // Show final celebration
    if (score > 200) {
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.6 }
      });
    }
    
    // Notify parent component
    setTimeout(() => {
      onComplete(score, normalizedScores);
    }, 3000);
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
          <h2 className="text-2xl font-bold mb-2 text-primary">Battle Command Simulator</h2>
          <p className="text-muted-foreground mb-6">
            Your fleet awaits your command. Navigate threat scenarios by deploying 
            the right tactical modules and optimizing power resources.
          </p>
          
          <div className="bg-black/90 text-white/90 p-6 rounded-lg mb-6 border border-primary/30">
            <h3 className="font-medium mb-3 text-primary/80">Mission Briefing:</h3>
            <ul className="text-sm text-left space-y-2">
              <li className="flex items-start">
                <LuArrowRightCircle className="mr-2 h-4 w-4 mt-0.5 text-primary/70" />
                Analyze each combat scenario and select the appropriate command module
              </li>
              <li className="flex items-start">
                <LuArrowRightCircle className="mr-2 h-4 w-4 mt-0.5 text-primary/70" />
                Allocate power resources efficiently - too little power will fail the mission,
                too much wastes critical resources
              </li>
              <li className="flex items-start">
                <LuArrowRightCircle className="mr-2 h-4 w-4 mt-0.5 text-primary/70" />
                Your decisions will reveal your natural aptitudes in different command areas
              </li>
              <li className="flex items-start">
                <LuArrowRightCircle className="mr-2 h-4 w-4 mt-0.5 text-primary/70" />
                Complete as many missions as possible before time expires
              </li>
            </ul>
          </div>
        </motion.div>
        
        <Button 
          size="lg" 
          onClick={handleStart}
          className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white hover:shadow-lg group relative overflow-hidden"
        >
          <span className="relative z-10">Initialize Battle Simulator</span>
          <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-cyan-300 opacity-0 group-hover:opacity-20 transition-opacity"></span>
        </Button>
      </div>
    );
  }
  
  // Render game over screen
  if (gameOver) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center max-w-2xl mx-auto text-center p-6"
      >
        <LuTrophy className="text-amber-500 h-16 w-16 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Simulation Complete</h2>
        <p className="text-lg mb-1">Battle Performance Score:</p>
        <motion.div 
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 8 }}
          className="text-4xl font-bold text-primary mb-6"
        >
          {score}
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl mb-8">
          {battleAptitudes.map(aptitude => (
            <div key={aptitude.id} className="bg-black/90 text-white rounded-lg p-4 border border-primary/30">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  {aptitude.icon}
                </div>
                <h3 className="font-medium">{aptitude.name}</h3>
              </div>
              <Progress value={aptitudeScores[aptitude.id]} className="h-2 mb-1" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Novice</span>
                <span>{aptitudeScores[aptitude.id]}%</span>
                <span>Expert</span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-muted-foreground mb-4">
          The {sectorName} simulation has revealed key insights about your aptitudes.
          This data will help us identify your optimal career trajectory.
        </p>
      </motion.div>
    );
  }
  
  // Render main game
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Game header */}
      <div className="flex justify-between items-center mb-4 bg-black/90 text-white p-3 rounded-lg border border-primary/30">
        <div>
          <span className="text-xs text-muted-foreground">Battle Score</span>
          <div className="text-xl font-bold text-primary">{score}</div>
        </div>
        
        <div className="flex items-center gap-1 bg-black/50 px-3 py-1 rounded-full">
          <span className={`font-mono ${timeRemaining < 15 ? 'text-red-400 animate-pulse' : 'text-cyan-400'}`}>
            {formatTime(timeRemaining)}
          </span>
        </div>
        
        <div>
          <span className="text-xs text-muted-foreground">Missions</span>
          <div className="text-xl font-medium flex items-center gap-1">
            <span className="text-green-400">{completedMissions.length}</span>
            <span className="text-xs text-muted-foreground">/ {battleScenarios.length}</span>
          </div>
        </div>
      </div>
      
      {/* Battle scenario */}
      {currentScenario && (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScenario.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mb-6"
          >
            <Card className="border-t-4 border-t-cyan-500 shadow-lg overflow-hidden bg-black/90 text-white">
              <CardContent className="p-6">
                <h3 className="text-xl font-semibold mb-1 text-cyan-400">Threat Detected</h3>
                <p className="mb-3 text-lg">{currentScenario.description}</p>
                
                <div className="p-3 bg-black/40 rounded-md border border-white/10 mb-3">
                  <p className="font-medium text-sm text-white/80">Mission Objective:</p>
                  <p className="text-white/90">{currentScenario.challenge}</p>
                </div>
                
                {battleResult === 'success' && (
                  <div className="bg-green-900/30 text-green-400 p-3 rounded-md border border-green-500/30 text-center font-bold">
                    MISSION SUCCESSFUL
                  </div>
                )}
                
                {battleResult === 'failure' && (
                  <div className="bg-red-900/30 text-red-400 p-3 rounded-md border border-red-500/30 text-center font-bold">
                    MISSION FAILED
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Battle visualization arena */}
            {!battleResult && (
              <div 
                ref={battleArenaRef}
                className="h-24 my-6 rounded-lg bg-gradient-to-r from-black to-blue-950 border border-cyan-900/50 relative overflow-hidden"
              >
                {/* Animated grid lines */}
                <div className="absolute inset-0" style={{ 
                  backgroundImage: 'linear-gradient(0deg, rgba(0,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.05) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                  backgroundPosition: 'center center',
                  animation: 'grid-scroll 20s linear infinite'
                }}></div>
                
                {/* Scenario visualization */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.7, 0.9, 0.7] 
                    }}
                    transition={{ 
                      duration: 3,
                      repeat: Infinity,
                      repeatType: 'loop'
                    }}
                    className="w-16 h-16 rounded-full bg-cyan-500/20 flex items-center justify-center"
                  >
                    {currentScenario.requiredAptitude === 'tactical-thinking' && (
                      <LuBrain className="h-8 w-8 text-cyan-400/70" />
                    )}
                    {currentScenario.requiredAptitude === 'pattern-recognition' && (
                      <LuScanFace className="h-8 w-8 text-cyan-400/70" />
                    )}
                    {currentScenario.requiredAptitude === 'adaptive-command' && (
                      <LuTarget className="h-8 w-8 text-cyan-400/70" />
                    )}
                    {currentScenario.requiredAptitude === 'resource-management' && (
                      <LuZap className="h-8 w-8 text-cyan-400/70" />
                    )}
                    {currentScenario.requiredAptitude === 'defensive-resilience' && (
                      <LuShieldAlert className="h-8 w-8 text-cyan-400/70" />
                    )}
                  </motion.div>
                </div>
              </div>
            )}
            
            {/* Command module selection */}
            {!battleResult && (
              <>
                <h3 className="text-lg font-semibold mb-3 text-primary">Select Command Module</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                  {availableModules.map(module => (
                    <Card 
                      key={module.id}
                      className={`cursor-pointer transition-all border bg-black/80 text-white
                        ${selectedModule?.id === module.id 
                          ? 'border-primary shadow-md shadow-primary/20' 
                          : 'border-white/10 hover:border-primary/50'
                        }
                      `}
                      onClick={() => handleModuleSelect(module)}
                    >
                      <CardContent className="p-3 flex gap-3 items-center">
                        <div className={`h-10 w-10 flex-shrink-0 rounded-full flex items-center justify-center 
                          ${selectedModule?.id === module.id ? 'bg-primary text-white' : 'bg-blue-950 text-blue-400'}
                        `}>
                          {module.category === 'tactical-thinking' && <LuBrain className="h-5 w-5" />}
                          {module.category === 'pattern-recognition' && <LuScanFace className="h-5 w-5" />}
                          {module.category === 'adaptive-command' && <LuTarget className="h-5 w-5" />}
                          {module.category === 'resource-management' && <LuZap className="h-5 w-5" />}
                          {module.category === 'defensive-resilience' && <LuShieldAlert className="h-5 w-5" />}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{module.name}</div>
                          <div className="text-xs text-cyan-300/80">Power: {module.powerLevel}</div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                {/* Power allocation */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-primary">Power Allocation</h3>
                    <div className="text-2xl font-bold text-cyan-400">{powerAllocation}%</div>
                  </div>
                  
                  <Slider
                    defaultValue={[70]}
                    min={40}
                    max={95}
                    step={5}
                    value={[powerAllocation]}
                    onValueChange={handlePowerAllocation}
                    className="py-4"
                  />
                  
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Minimal</span>
                    <span>Balanced</span>
                    <span>Maximum</span>
                  </div>
                </div>
                
                {/* Engage button */}
                <Button
                  className="w-full py-6 text-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white"
                  disabled={!selectedModule}
                  onClick={engageBattle}
                >
                  {selectedModule ? 'Engage Battle System' : 'Select a Command Module'}
                </Button>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      
      {/* Add some futuristic CSS for animations */}
      <style jsx global>{`
        @keyframes grid-scroll {
          0% {
            background-position: 0px 0px;
          }
          100% {
            background-position: 40px 40px;
          }
        }
      `}</style>
    </div>
  );
}