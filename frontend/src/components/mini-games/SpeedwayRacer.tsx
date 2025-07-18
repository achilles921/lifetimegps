import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { MiniGameMetrics } from '@/utils/quizLogic';

interface SpeedwayRacerProps {
  onComplete: (metrics: Partial<MiniGameMetrics>) => void;
  onSkip: () => void;
}

// Using SVG assets for minimal bandwidth - vector graphics scale well and load quickly
const ASSET_PATHS = {
  // Core assets that load immediately (minimal set)
  essential: [
    '/mini-games/speedway/track-outline.svg',  // Just basic track outline
    '/mini-games/speedway/car-basic.svg',      // Simple car silhouette
  ],
  // Assets that load only during the race
  race: [
    '/mini-games/speedway/obstacle-1.svg',
    '/mini-games/speedway/obstacle-2.svg',
    '/mini-games/speedway/power-up.svg',
  ],
  // Assets that load only on results screen
  results: [
    '/mini-games/speedway/trophy.svg',
    '/mini-games/speedway/stats-icon.svg',
  ]
};

// Track configuration - procedurally generated to avoid large data transfers
const TRACK_CONFIG = {
  segmentCount: 10,
  segmentLength: 500,
  curveIntensity: 0.3,
  width: 80,
  // Generate track procedurally instead of transferring full track data
  generateSegment: (index: number) => ({
    curve: Math.sin(index * 0.3) * TRACK_CONFIG.curveIntensity,
    obstacles: Math.random() > 0.7 ? Math.floor(Math.random() * 3) + 1 : 0,
  })
};

export default function SpeedwayRacer({ onComplete, onSkip }: SpeedwayRacerProps) {
  // Game states
  const [gameStarted, setGameStarted] = useState(false);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [raceInProgress, setRaceInProgress] = useState(false);
  
  // Player car state
  const [carPosition, setCarPosition] = useState({ x: 0, y: 0, lane: 1 });
  const [speed, setSpeed] = useState(0);
  const [distanceTraveled, setDistanceTraveled] = useState(0);
  
  // Game progress variables
  const [raceTime, setRaceTime] = useState(0);
  const [currentSegment, setCurrentSegment] = useState(0);
  const [obstaclesAvoided, setObstaclesAvoided] = useState(0);
  const [collisions, setCollisions] = useState(0);
  const [lapsCompleted, setLapsCompleted] = useState(0);
  const [currentLap, setCurrentLap] = useState(1);
  
  // Performance metrics tracking
  const [lapTimes, setLapTimes] = useState<number[]>([]);
  const [reactionTimes, setReactionTimes] = useState<number[]>([]);
  const startTime = useRef<number | null>(null);
  const lastObstacleTime = useRef<number | null>(null);
  const gameLoop = useRef<number | null>(null);
  const leftKeyPressed = useRef(false);
  const rightKeyPressed = useRef(false);
  const upKeyPressed = useRef(false);
  const downKeyPressed = useRef(false);
  
  // Store the player's metrics
  const [metrics, setMetrics] = useState<Partial<MiniGameMetrics>>({
    handEyeCoordination: 50,
    multitaskingAbility: 50, 
    learningCurve: 50,
    stressResponse: 'maintains',
    dexterityLevel: 50,
    dominantSide: 'balanced'
  });
  
  // Detailed metrics tracking
  const metricsTracker = useRef({
    // Hand-eye coordination metrics
    precisionMoves: 0,        // Successful precise maneuvers
    oversteers: 0,            // Times player oversteered
    perfectCorners: 0,        // Perfect corner executions
    
    // Multitasking metrics
    simultaneousActions: 0,   // Multiple controls used at once
    missedObstacles: 0,       // Failed to react to obstacles
    
    // Learning curve metrics
    improvementRate: 0,       // Calculated from lap times
    consistencyScore: 0,      // Consistency between laps
    
    // Stress response
    highSpeedPerformance: 0,  // Performance during high-speed segments
    recoveryTime: 0,          // Time to recover after mistakes
    
    // Dominant side
    leftInputs: 0,            // Left direction inputs
    rightInputs: 0,           // Right direction inputs
    
    // Dexterity
    inputsPerSecond: 0,       // Rate of control inputs
    averageReactionTime: 0,   // Average time to react to obstacles
  });
  
  // Load assets progressively to minimize initial bandwidth usage
  useEffect(() => {
    if (!gameStarted) return;
    
    // Progressive asset loading simulation
    const loadAssets = async () => {
      setLoading(true);
      
      // Load only essential assets first for quick startup
      for (let i = 0; i < ASSET_PATHS.essential.length; i++) {
        // Simulate progressive loading
        await new Promise(resolve => setTimeout(resolve, 200));
        setLoadProgress(Math.floor(((i + 1) / ASSET_PATHS.essential.length) * 100));
      }
      
      setLoading(false);
      initializeGame();
    };
    
    loadAssets();
    
    // Clean up
    return () => {
      if (gameLoop.current) {
        cancelAnimationFrame(gameLoop.current);
      }
      // Remove event listeners when component unmounts
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStarted]);
  
  // Add keyboard controls when race starts
  useEffect(() => {
    if (raceInProgress) {
      window.addEventListener('keydown', handleKeyDown);
      window.addEventListener('keyup', handleKeyUp);
      startTime.current = Date.now();
      
      // Start race loop
      gameLoop.current = requestAnimationFrame(gameUpdateLoop);
    }
    
    return () => {
      if (raceInProgress) {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
      }
    };
  }, [raceInProgress]);
  
  // Keyboard event handlers - using keycode for better performance than string comparisons
  const handleKeyDown = (e: KeyboardEvent) => {
    // Prevent default actions like page scrolling
    if ([37, 38, 39, 40, 32].includes(e.keyCode)) {
      e.preventDefault();
    }
    
    // Track key states for smoother controls
    switch (e.keyCode) {
      case 37: // Left
        leftKeyPressed.current = true;
        metricsTracker.current.leftInputs++;
        break;
      case 39: // Right
        rightKeyPressed.current = true;
        metricsTracker.current.rightInputs++;
        break;
      case 38: // Up
        upKeyPressed.current = true;
        break;
      case 40: // Down
        downKeyPressed.current = true;
        break;
    }
    
    // Track simultaneous inputs for multitasking measurement
    const activeInputs = [
      leftKeyPressed.current, 
      rightKeyPressed.current, 
      upKeyPressed.current, 
      downKeyPressed.current
    ].filter(Boolean).length;
    
    if (activeInputs > 1) {
      metricsTracker.current.simultaneousActions++;
    }
  };
  
  // Handle key up events
  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 37: // Left
        leftKeyPressed.current = false;
        break;
      case 39: // Right
        rightKeyPressed.current = false;
        break;
      case 38: // Up
        upKeyPressed.current = false;
        break;
      case 40: // Down
        downKeyPressed.current = false;
        break;
    }
  };
  
  // Initialize the game
  const initializeGame = () => {
    // Set up the initial game state
    setCarPosition({ x: 0, y: 0, lane: 1 });
    setSpeed(0);
    setDistanceTraveled(0);
    setRaceTime(0);
    setCurrentSegment(0);
    setObstaclesAvoided(0);
    setCollisions(0);
    setLapsCompleted(0);
    setCurrentLap(1);
    setLapTimes([]);
    
    // Initialize metrics tracking
    metricsTracker.current = {
      precisionMoves: 0,
      oversteers: 0,
      perfectCorners: 0,
      simultaneousActions: 0,
      missedObstacles: 0,
      improvementRate: 0,
      consistencyScore: 0,
      highSpeedPerformance: 0,
      recoveryTime: 0,
      leftInputs: 0,
      rightInputs: 0,
      inputsPerSecond: 0,
      averageReactionTime: 0,
    };
  };
  
  // Start the race
  const startRace = () => {
    setRaceInProgress(true);
    
    // Lazily load race assets after race starts
    // In production, this would actually preload assets needed during gameplay
    setTimeout(() => {
      ASSET_PATHS.race.forEach(path => {
        // Simulate loading in background without blocking UI
        const img = new Image();
        img.src = path;
      });
    }, 1000);
  };
  
  // Main game loop - runs every frame
  const gameUpdateLoop = () => {
    // Calculate time elapsed
    const now = Date.now();
    const elapsed = (startTime.current) ? (now - startTime.current) / 1000 : 0;
    setRaceTime(elapsed);
    
    // Update car position based on controls
    updateCarPosition();
    
    // Update game state
    updateRaceProgress();
    
    // Check for collisions
    checkCollisions();
    
    // Check for lap completion
    checkLapCompletion();
    
    // End race condition check
    if (lapsCompleted >= 3 || collisions >= 5) {
      endRace();
      return;
    }
    
    // Continue game loop
    gameLoop.current = requestAnimationFrame(gameUpdateLoop);
  };
  
  // Update car position based on player input
  const updateCarPosition = () => {
    // This would be more complex in a real implementation
    // Simple simulation for demonstration
    
    // Accelerate/decelerate
    if (upKeyPressed.current && speed < 100) {
      setSpeed(prev => Math.min(100, prev + 2));
    } else if (downKeyPressed.current) {
      setSpeed(prev => Math.max(0, prev - 3));
    } else if (speed > 0) {
      setSpeed(prev => Math.max(0, prev - 0.5)); // Natural deceleration
    }
    
    // Change lanes
    if (leftKeyPressed.current) {
      setCarPosition(prev => ({
        ...prev,
        lane: Math.max(0, prev.lane - 0.1)
      }));
    }
    
    if (rightKeyPressed.current) {
      setCarPosition(prev => ({
        ...prev,
        lane: Math.min(2, prev.lane + 0.1)
      }));
    }
    
    // Check for oversteer
    const laneChangeRate = 0.1;
    if (Math.abs(carPosition.lane % 1) < laneChangeRate && 
        (leftKeyPressed.current || rightKeyPressed.current)) {
      metricsTracker.current.precisionMoves++;
    } else if (Math.abs(carPosition.lane % 1) > 0.4 && 
               Math.abs(carPosition.lane % 1) < 0.6) {
      metricsTracker.current.oversteers++;
    }
    
    // Update distance based on speed
    setDistanceTraveled(prev => prev + speed * 0.1);
  };
  
  // Update race progress
  const updateRaceProgress = () => {
    // Calculate current track segment
    const segmentIndex = Math.floor(distanceTraveled / TRACK_CONFIG.segmentLength) % TRACK_CONFIG.segmentCount;
    
    if (segmentIndex !== currentSegment) {
      // Moving to a new segment
      setCurrentSegment(segmentIndex);
      
      // Generate random obstacle for this segment (with some probability)
      if (Math.random() > 0.7) {
        // Record time when obstacle appears
        lastObstacleTime.current = Date.now();
      }
    }
  };
  
  // Check for collisions with obstacles
  const checkCollisions = () => {
    // Simplified collision detection for demo
    // In a real implementation, this would check actual game objects
    
    // Random chance of obstacle in current segment
    if (lastObstacleTime.current && Date.now() - lastObstacleTime.current > 500) {
      // Reaction time window passed
      const avoided = Math.random() > 0.3; // Simple simulation
      
      if (avoided) {
        setObstaclesAvoided(prev => prev + 1);
        
        // Calculate reaction time
        const reactionTime = (Date.now() - (lastObstacleTime.current || 0)) / 1000;
        setReactionTimes(prev => [...prev, reactionTime]);
        
        // Track performance metrics
        if (speed > 80) {
          metricsTracker.current.highSpeedPerformance++;
        }
      } else {
        setCollisions(prev => prev + 1);
        setSpeed(prev => Math.max(0, prev - 20)); // Slow down after collision
        
        // Start tracking recovery time
        const recoveryStart = Date.now();
        const checkRecovery = setInterval(() => {
          if (speed > 70) {
            // Car has recovered
            metricsTracker.current.recoveryTime += (Date.now() - recoveryStart) / 1000;
            clearInterval(checkRecovery);
          }
        }, 100);
      }
      
      lastObstacleTime.current = null;
    }
  };
  
  // Check for lap completion
  const checkLapCompletion = () => {
    const trackLength = TRACK_CONFIG.segmentCount * TRACK_CONFIG.segmentLength;
    
    // Check if player completed a lap
    if (distanceTraveled >= trackLength * currentLap) {
      // Record lap time
      const lapTime = raceTime - (lapTimes.reduce((sum, time) => sum + time, 0));
      setLapTimes(prev => [...prev, lapTime]);
      
      // Update game state
      setLapsCompleted(prev => prev + 1);
      setCurrentLap(prev => prev + 1);
      
      // Calculate improvement rate for learning curve
      if (lapTimes.length > 0) {
        const previousLapTime = lapTimes[lapTimes.length - 1];
        const improvement = (previousLapTime - lapTime) / previousLapTime;
        metricsTracker.current.improvementRate += improvement;
      }
    }
  };
  
  // End the race and calculate final metrics
  const endRace = () => {
    if (gameLoop.current) {
      cancelAnimationFrame(gameLoop.current);
    }
    
    setRaceInProgress(false);
    
    // Load results assets
    ASSET_PATHS.results.forEach(path => {
      const img = new Image();
      img.src = path;
    });
    
    // Calculate final metrics
    calculateFinalMetrics();
    
    setGameCompleted(true);
  };
  
  // Calculate final metrics based on gameplay
  const calculateFinalMetrics = () => {
    const m = metricsTracker.current;
    
    // Calculate hand-eye coordination (0-100)
    const handEyeScore = Math.min(100, Math.floor(
      (m.precisionMoves * 2) - (m.oversteers * 0.5) + (m.perfectCorners * 3)
    ));
    
    // Calculate multitasking ability (0-100)
    const multitaskingScore = Math.min(100, Math.floor(
      (m.simultaneousActions * 3) - (m.missedObstacles * 2) + (obstaclesAvoided * 2)
    ));
    
    // Calculate learning curve (0-100)
    // Higher score means faster learning
    let learningScore = 50; // Default
    if (lapTimes.length > 1) {
      const firstLap = lapTimes[0];
      const lastLap = lapTimes[lapTimes.length - 1];
      const improvementPercent = ((firstLap - lastLap) / firstLap) * 100;
      learningScore = Math.min(100, Math.max(0, Math.floor(50 + improvementPercent)));
    }
    
    // Calculate stress response
    // 'improves', 'maintains', or 'declines'
    let stressResponse: 'improves' | 'maintains' | 'declines' = 'maintains';
    if (m.highSpeedPerformance > 3) {
      stressResponse = 'improves';
    } else if (m.recoveryTime > 5) {
      stressResponse = 'declines';
    }
    
    // Calculate dexterity level (0-100)
    const dexterityScore = Math.min(100, Math.floor(
      (m.inputsPerSecond * 10) + (obstaclesAvoided * 2) - (collisions * 5)
    ));
    
    // Calculate dominant side
    // 'left', 'right', or 'balanced'
    let dominantSide: 'left' | 'right' | 'balanced' = 'balanced';
    const leftRightDiff = Math.abs(m.leftInputs - m.rightInputs);
    const totalInputs = m.leftInputs + m.rightInputs;
    
    if (leftRightDiff > totalInputs * 0.2) {
      // More than 20% difference indicates dominance
      dominantSide = m.leftInputs > m.rightInputs ? 'left' : 'right';
    }
    
    // Set final metrics
    setMetrics({
      handEyeCoordination: Math.max(20, handEyeScore),
      multitaskingAbility: Math.max(20, multitaskingScore),
      learningCurve: Math.max(20, learningScore),
      stressResponse,
      dexterityLevel: Math.max(20, dexterityScore),
      dominantSide
    });
  };
  
  // Start the game
  const handleStartGame = () => {
    setGameStarted(true);
  };
  
  // Submit results
  const handleSubmitResults = () => {
    onComplete(metrics);
  };
  
  // Skip mini-game
  const handleSkip = () => {
    onSkip();
  };
  
  // UI Rendering
  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Speedway Racer</CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col items-center">
        {!gameStarted && (
          <div className="text-center space-y-4 p-4">
            <p>Test your reflexes and coordination in this high-speed racing challenge. Your performance will reveal insights about your hand-eye coordination and multitasking abilities.</p>
            <Button onClick={handleStartGame}>Start Racing</Button>
            <Button variant="outline" onClick={handleSkip}>Skip This Game</Button>
          </div>
        )}
        
        {gameStarted && loading && (
          <div className="w-full p-4 text-center">
            <p>Preparing the race track...</p>
            <Progress value={loadProgress} className="w-full mt-2" />
          </div>
        )}
        
        {gameStarted && !loading && !raceInProgress && !gameCompleted && (
          <div className="text-center space-y-4">
            <p>Ready to race! Use arrow keys to control your car.</p>
            <p className="text-sm text-muted-foreground">
              ← → to steer left and right<br />
              ↑ ↓ to accelerate and brake
            </p>
            <Button onClick={startRace}>Begin Race</Button>
          </div>
        )}
        
        {raceInProgress && (
          <div className="w-full">
            {/* Game HUD */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div>
                <p className="text-sm">Speed</p>
                <Progress value={speed} className="h-2" />
              </div>
              <div>
                <p className="text-sm">Lap {currentLap}/3</p>
                <Progress 
                  value={(distanceTraveled % (TRACK_CONFIG.segmentCount * TRACK_CONFIG.segmentLength)) / 
                         (TRACK_CONFIG.segmentCount * TRACK_CONFIG.segmentLength) * 100} 
                  className="h-2" 
                />
              </div>
              <div>
                <p className="text-sm">Time: {raceTime.toFixed(1)}s</p>
              </div>
            </div>
            
            {/* Game Canvas - Just a placeholder representation */}
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 w-full h-64 rounded-lg relative overflow-hidden">
              {/* This would be an actual WebGL/Canvas or DOM-based game in production */}
              <div 
                className="absolute w-10 h-16 bg-primary rounded-md"
                style={{ 
                  left: `${10 + carPosition.lane * 33}%`, 
                  bottom: '20%',
                  transform: `rotate(${(carPosition.lane - 1) * 15}deg)`
                }}
              />
              
              <div className="absolute bottom-2 right-2 text-xs text-white flex gap-2">
                <span>Avoided: {obstaclesAvoided}</span>
                <span>Collisions: {collisions}</span>
              </div>
            </div>
          </div>
        )}
        
        {gameCompleted && (
          <div className="w-full space-y-4 text-center">
            <h3 className="text-xl font-semibold">Race Complete!</h3>
            
            <div className="grid grid-cols-2 gap-4 text-left">
              <div>
                <p className="font-medium">Hand-Eye Coordination</p>
                <Progress value={metrics.handEyeCoordination} className="w-full mt-1" />
                <p className="text-xs mt-1 opacity-70">{metrics.handEyeCoordination}/100</p>
              </div>
              
              <div>
                <p className="font-medium">Multitasking Ability</p>
                <Progress value={metrics.multitaskingAbility} className="w-full mt-1" />
                <p className="text-xs mt-1 opacity-70">{metrics.multitaskingAbility}/100</p>
              </div>
              
              <div>
                <p className="font-medium">Learning Curve</p>
                <Progress value={metrics.learningCurve} className="w-full mt-1" />
                <p className="text-xs mt-1 opacity-70">{metrics.learningCurve}/100</p>
              </div>
              
              <div>
                <p className="font-medium">Dexterity Level</p>
                <Progress value={metrics.dexterityLevel} className="w-full mt-1" />
                <p className="text-xs mt-1 opacity-70">{metrics.dexterityLevel}/100</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-left mt-4">
              <div>
                <p className="font-medium">Stress Response</p>
                <p className="text-sm">{metrics.stressResponse === 'improves' ? 'Improves under pressure' : 
                  metrics.stressResponse === 'declines' ? 'Performance decreases under pressure' : 
                  'Maintains performance under pressure'}</p>
              </div>
              
              <div>
                <p className="font-medium">Dominant Side</p>
                <p className="text-sm">{metrics.dominantSide === 'balanced' ? 'Balanced usage' :
                  `${metrics.dominantSide}-dominant`}</p>
              </div>
            </div>
            
            <Button onClick={handleSubmitResults} className="mt-4">
              Continue to Next Game
            </Button>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="justify-center text-xs text-center opacity-70">
        <p>Racing reveals your coordination and adaptability</p>
      </CardFooter>
    </Card>
  );
}