import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MiniGameMetrics } from '@/utils/quizLogic';

interface BattleCommandSimulatorProps {
  onComplete: (metrics: Partial<MiniGameMetrics>) => void;
  onSkip: () => void;
}

// Using procedural generation to minimize data transfer
// Instead of loading large JSON files or images, we generate scenarios programmatically
const SCENARIO_TEMPLATES = [
  {
    type: "ambush",
    description: "Enemy forces have set up an ambush in your path.",
    options: [
      { text: "Set up a counter-ambush", type: "creative", risk: "high", planning: "planner" },
      { text: "Send scouts to assess strength", type: "analytical", risk: "medium", planning: "planner" },
      { text: "Find an alternative route", type: "balanced", risk: "low", planning: "planner" },
      { text: "Charge through with full force", type: "direct", risk: "high", planning: "reactive" }
    ]
  },
  {
    type: "resource",
    description: "Your supplies are running low and a storm is approaching.",
    options: [
      { text: "Construct shelter and wait out the storm", type: "analytical", risk: "low", planning: "planner" },
      { text: "Quickly gather resources while possible", type: "direct", risk: "medium", planning: "reactive" },
      { text: "Split your team to handle both tasks", type: "balanced", risk: "medium", planning: "balanced" },
      { text: "Use technology to create an efficient solution", type: "creative", risk: "medium", planning: "planner" }
    ]
  },
  {
    type: "negotiation",
    description: "A rival faction offers an alliance under suspicious terms.",
    options: [
      { text: "Analyze their proposal for hidden agendas", type: "analytical", risk: "low", planning: "planner" },
      { text: "Propose an alternative arrangement", type: "creative", risk: "medium", planning: "balanced" },
      { text: "Accept but prepare contingencies", type: "balanced", risk: "medium", planning: "planner" },
      { text: "Decline and prepare for potential conflict", type: "direct", risk: "high", planning: "reactive" }
    ]
  },
  {
    type: "technical",
    description: "Your communications system is malfunctioning during a critical operation.",
    options: [
      { text: "Analyze the system code for errors", type: "analytical", risk: "low", planning: "planner" },
      { text: "Develop an alternative communication method", type: "creative", risk: "medium", planning: "balanced" },
      { text: "Proceed with the mission using visual signals", type: "direct", risk: "high", planning: "reactive" },
      { text: "Delay mission until repairs are complete", type: "balanced", risk: "low", planning: "planner" }
    ]
  },
  {
    type: "pattern",
    description: "You detect a potential pattern in enemy movements that could be exploited.",
    options: [
      { text: "Analyze historical data to verify the pattern", type: "analytical", risk: "low", planning: "planner" },
      { text: "Develop a trap based on the predicted movements", type: "creative", risk: "high", planning: "planner" },
      { text: "Move forces immediately to intercept", type: "direct", risk: "high", planning: "reactive" },
      { text: "Monitor and gather more intel before acting", type: "balanced", risk: "medium", planning: "balanced" }
    ]
  }
];

// Define SVG icons using string templates to avoid image loading
const ICONS = {
  analytical: '<svg viewBox="0 0 24 24" width="24" height="24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/><path d="M8 12l3 3 5-5" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  creative: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M12 3v18M3 12h18" stroke="currentColor" stroke-width="2"/></svg>',
  direct: '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" stroke-width="2" fill="none"/></svg>',
  balanced: '<svg viewBox="0 0 24 24" width="24" height="24"><rect x="4" y="4" width="16" height="16" rx="2" stroke="currentColor" stroke-width="2" fill="none"/></svg>'
};

export default function BattleCommandSimulator({ onComplete, onSkip }: BattleCommandSimulatorProps) {
  // Game state
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [currentScenario, setCurrentScenario] = useState<any>(null);
  const [scenarioResults, setScenarioResults] = useState<string | null>(null);
  const [scenariosCompleted, setScenariosCompleted] = useState(0);
  const [loading, setLoading] = useState(false);
  
  // Decision tracking
  const startTime = useRef<number | null>(null);
  const decisionTimes = useRef<number[]>([]);
  const [patternSequences, setPatternSequences] = useState(0);
  
  // Decision metrics tracking
  const decisionTracker = useRef({
    analyticalChoices: 0,
    creativeChoices: 0,
    directChoices: 0,
    balancedChoices: 0,
    leftBrainChoices: 0,   // analytical + balanced
    rightBrainChoices: 0,  // creative + direct
    highRiskChoices: 0,
    lowRiskChoices: 0,
    plannerChoices: 0,
    reactiveChoices: 0,
    averageDecisionTime: 0
  });
  
  // Final metrics
  const [metrics, setMetrics] = useState<Partial<MiniGameMetrics>>({
    decisionSpeed: 50,
    patternRecognition: 50,
    brainDominance: 'balanced',
    planningStyle: 'balanced'
  });
  
  // Prepare a new scenario
  const prepareNewScenario = () => {
    setLoading(true);
    setScenarioResults(null);
    
    // Simulate loading time - more efficient than loading actual assets
    setTimeout(() => {
      // Choose a random scenario template
      const templateIndex = Math.floor(Math.random() * SCENARIO_TEMPLATES.length);
      const template = SCENARIO_TEMPLATES[templateIndex];
      
      // Apply procedural generation to make each instance unique
      // This is more bandwidth-efficient than sending pre-made content
      const scenario = {
        ...template,
        description: customizeDescription(template.description),
        scenarioId: Date.now(),
      };
      
      setCurrentScenario(scenario);
      setLoading(false);
      
      // Start timing the decision
      startTime.current = Date.now();
    }, 300);
  };
  
  // Add procedural variation to descriptions to keep scenarios fresh
  const customizeDescription = (baseDescription: string) => {
    const variations = [
      { pattern: "Enemy forces", replacements: ["Hostile units", "Opposition troops", "Adversary squads"] },
      { pattern: "storm", replacements: ["blizzard", "sandstorm", "thunderstorm"] },
      { pattern: "supplies", replacements: ["resources", "provisions", "equipment"] },
      { pattern: "rival faction", replacements: ["opposing group", "competitor team", "antagonist contingent"] }
    ];
    
    let customized = baseDescription;
    variations.forEach(variation => {
      if (baseDescription.includes(variation.pattern)) {
        const replacement = variation.replacements[Math.floor(Math.random() * variation.replacements.length)];
        customized = customized.replace(variation.pattern, replacement);
      }
    });
    
    return customized;
  };
  
  // Check for patterns in current scenarios
  const checkForPatterns = () => {
    const tracker = decisionTracker.current;
    
    // Check for alternating patterns in choice types
    const choices = [];
    if (tracker.analyticalChoices > 0) choices.push('analytical');
    if (tracker.creativeChoices > 0) choices.push('creative');
    if (tracker.directChoices > 0) choices.push('direct');
    if (tracker.balancedChoices > 0) choices.push('balanced');
    
    // If player is recognizing and exploiting patterns in the game
    if (choices.length >= 2) {
      setPatternSequences(prev => prev + 1);
    }
  };
  
  // Handle player decision
  const makeDecision = (option: any) => {
    if (!startTime.current) return;
    
    // Calculate decision time
    const decisionTime = (Date.now() - startTime.current) / 1000;
    decisionTimes.current.push(decisionTime);
    
    // Track decision metrics
    const tracker = decisionTracker.current;
    
    // Update choice type counts
    if (option.type === 'analytical') {
      tracker.analyticalChoices++;
      tracker.leftBrainChoices++;
    } else if (option.type === 'creative') {
      tracker.creativeChoices++;
      tracker.rightBrainChoices++;
    } else if (option.type === 'direct') {
      tracker.directChoices++;
      tracker.rightBrainChoices++;
    } else if (option.type === 'balanced') {
      tracker.balancedChoices++;
      tracker.leftBrainChoices++;
    }
    
    // Update risk profile
    if (option.risk === 'high') {
      tracker.highRiskChoices++;
    } else if (option.risk === 'low') {
      tracker.lowRiskChoices++;
    }
    
    // Update planning style
    if (option.planning === 'planner') {
      tracker.plannerChoices++;
    } else if (option.planning === 'reactive') {
      tracker.reactiveChoices++;
    }
    
    // Calculate average decision time
    const totalDecisionTime = decisionTimes.current.reduce((sum, time) => sum + time, 0);
    tracker.averageDecisionTime = totalDecisionTime / decisionTimes.current.length;
    
    // Check for patterns in choices
    checkForPatterns();
    
    // Show result of decision
    setScenarioResults(getDecisionOutcome(option));
    
    // Update completed scenarios count
    setScenariosCompleted(prev => prev + 1);
  };
  
  // Generate outcome text based on decision
  const getDecisionOutcome = (option: any) => {
    const outcomes = {
      analytical: [
        "Your thorough analysis revealed crucial details others would have missed.",
        "The time spent analyzing paid off with a more efficient solution.",
        "Your methodical approach uncovered hidden variables in the situation."
      ],
      creative: [
        "Your unconventional approach caught everyone by surprise and succeeded.",
        "The creative solution opened up entirely new strategic possibilities.",
        "Your innovative thinking transformed a potential loss into a victory."
      ],
      direct: [
        "Your decisive action prevented further complications from developing.",
        "The direct approach cut through the confusion and achieved quick results.",
        "Your bold maneuver changed the dynamics of the entire situation."
      ],
      balanced: [
        "Your balanced approach satisfied multiple objectives simultaneously.",
        "The measured response preserved options while still making progress.",
        "Your well-rounded strategy addressed both immediate and long-term concerns."
      ]
    };
    
    const typeOutcomes = outcomes[option.type as keyof typeof outcomes];
    return typeOutcomes[Math.floor(Math.random() * typeOutcomes.length)];
  };
  
  // Process next step based on game state
  const handleContinue = () => {
    if (scenariosCompleted >= 5) {
      // Game is complete
      finalizeResults();
    } else {
      // Load next scenario
      prepareNewScenario();
    }
  };
  
  // Calculate final metrics based on gameplay
  const finalizeResults = () => {
    const tracker = decisionTracker.current;
    
    // Calculate decision speed (0-100)
    // Lower average time = higher score
    const avgTime = tracker.averageDecisionTime;
    const speedScore = Math.min(100, Math.max(0, 100 - (avgTime * 10)));
    
    // Calculate pattern recognition (0-100)
    // Based on pattern sequences identified and consistent strategies
    const patternScore = Math.min(100, Math.max(0, patternSequences * 20));
    
    // Determine brain dominance
    // 'left', 'right', or 'balanced'
    let brainDominance: 'left' | 'right' | 'balanced' = 'balanced';
    const brainDiff = Math.abs(tracker.leftBrainChoices - tracker.rightBrainChoices);
    const totalChoices = tracker.leftBrainChoices + tracker.rightBrainChoices;
    
    if (brainDiff > totalChoices * 0.2) {
      // More than 20% difference indicates dominance
      brainDominance = tracker.leftBrainChoices > tracker.rightBrainChoices ? 'left' : 'right';
    }
    
    // Determine planning style
    // 'planner', 'reactive', or 'balanced'
    let planningStyle: 'planner' | 'reactive' | 'balanced' = 'balanced';
    const planningDiff = Math.abs(tracker.plannerChoices - tracker.reactiveChoices);
    
    if (planningDiff > totalChoices * 0.2) {
      planningStyle = tracker.plannerChoices > tracker.reactiveChoices ? 'planner' : 'reactive';
    }
    
    // Set final metrics
    setMetrics({
      decisionSpeed: Math.max(20, speedScore),
      patternRecognition: Math.max(20, patternScore),
      brainDominance,
      planningStyle
    });
    
    setGameCompleted(true);
  };
  
  // Start game and load first scenario
  const handleStartGame = () => {
    setGameStarted(true);
    prepareNewScenario();
  };
  
  // Submit results
  const handleSubmitResults = () => {
    onComplete(metrics);
  };
  
  // Skip mini-game
  const handleSkip = () => {
    onSkip();
  };
  
  // Create SVG icon from string template
  const renderIcon = (type: keyof typeof ICONS) => {
    return <div dangerouslySetInnerHTML={{ __html: ICONS[type] }} />;
  };
  
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Battle Command Simulator</CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        {!gameStarted && (
          <div className="text-center space-y-4 p-4">
            <p>Test your strategic decision-making skills in this command simulation. Your choices will reveal insights about your thinking patterns and problem-solving approach.</p>
            <Button onClick={handleStartGame}>Start Simulation</Button>
            <Button variant="outline" onClick={handleSkip}>Skip This Game</Button>
          </div>
        )}
        
        {gameStarted && loading && (
          <div className="w-full p-4 text-center">
            <p>Generating scenario...</p>
            <Progress value={100} className="w-full mt-2 animate-pulse" />
          </div>
        )}
        
        {gameStarted && !loading && !gameCompleted && currentScenario && (
          <div className="w-full space-y-5">
            <div className="bg-primary/10 p-4 rounded-md">
              <h3 className="font-medium mb-2">Scenario {scenariosCompleted + 1}/5</h3>
              <p>{currentScenario.description}</p>
            </div>
            
            {!scenarioResults ? (
              <div className="grid grid-cols-1 gap-3">
                {currentScenario.options.map((option: any, index: number) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3 flex items-center gap-3"
                    onClick={() => makeDecision(option)}
                  >
                    <div className="text-primary">
                      {renderIcon(option.type as keyof typeof ICONS)}
                    </div>
                    <span>{option.text}</span>
                  </Button>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-muted p-4 rounded-md">
                  <h3 className="font-medium mb-1">Outcome</h3>
                  <p>{scenarioResults}</p>
                </div>
                <Button onClick={handleContinue}>Continue</Button>
              </div>
            )}
            
            <div className="text-sm opacity-70 text-center">
              Scenarios completed: {scenariosCompleted}/5
            </div>
          </div>
        )}
        
        {gameCompleted && (
          <div className="w-full space-y-4 text-center">
            <h3 className="text-xl font-semibold">Simulation Complete!</h3>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="font-medium">Decision Speed</p>
                <Progress value={metrics.decisionSpeed} className="w-full mt-1" />
                <p className="text-xs mt-1 opacity-70">{metrics.decisionSpeed}/100</p>
              </div>
              
              <div>
                <p className="font-medium">Pattern Recognition</p>
                <Progress value={metrics.patternRecognition} className="w-full mt-1" />
                <p className="text-xs mt-1 opacity-70">{metrics.patternRecognition}/100</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-left mt-4">
              <div>
                <p className="font-medium">Brain Dominance</p>
                <p className="text-sm">
                  {metrics.brainDominance === 'left' ? 'Analytical/Logical Thinking' :
                   metrics.brainDominance === 'right' ? 'Creative/Intuitive Thinking' :
                   'Balanced Thinking Style'}
                </p>
              </div>
              
              <div>
                <p className="font-medium">Planning Style</p>
                <p className="text-sm">
                  {metrics.planningStyle === 'planner' ? 'Methodical Planner' :
                   metrics.planningStyle === 'reactive' ? 'Adaptive Responder' :
                   'Balanced Planning Approach'}
                </p>
              </div>
            </div>
            
            <Button onClick={handleSubmitResults} className="mt-4">
              Continue to Next Game
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-center text-xs text-center opacity-70">
        <p>Command decisions reveal your cognitive preferences</p>
      </CardFooter>
    </Card>
  );
}