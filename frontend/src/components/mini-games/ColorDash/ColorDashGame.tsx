import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, AlertCircle, Award, Timer } from 'lucide-react';
import miniGameService from '@/services/MiniGameService';
import { ColorDashMetrics } from '@/components/mini-games/MiniGameTypes';
import './ColorDash.css';
import { useToast } from '@/hooks/use-toast';

// Available colors
const COLORS = [
  { name: 'Red', hex: '#ef4444', textColor: 'text-rose-600' },
  { name: 'Blue', hex: '#3b82f6', textColor: 'text-blue-600' },
  { name: 'Green', hex: '#22c55e', textColor: 'text-green-600' },
  { name: 'Yellow', hex: '#eab308', textColor: 'text-yellow-600' },
  { name: 'Purple', hex: '#a855f7', textColor: 'text-purple-600' },
  { name: 'Orange', hex: '#f97316', textColor: 'text-orange-600' }
];

// Difficulty levels
const DIFFICULTY_LEVELS = {
  easy: {
    roundsToComplete: 10,
    timePerRound: 5000, // 5 seconds
    mismatchProbability: 0.4, // 40% chance of mismatch
    colorOptions: 4 // Use only first 4 colors
  },
  medium: {
    roundsToComplete: 15,
    timePerRound: 3500, // 3.5 seconds
    mismatchProbability: 0.5, // 50% chance of mismatch
    colorOptions: 5 // Use first 5 colors
  },
  hard: {
    roundsToComplete: 20,
    timePerRound: 2500, // 2.5 seconds
    mismatchProbability: 0.6, // 60% chance of mismatch
    colorOptions: 6 // Use all colors
  }
};

type Difficulty = 'easy' | 'medium' | 'hard';

interface GameState {
  isStarted: boolean;
  isActive: boolean;
  isComplete: boolean;
  difficulty: Difficulty;
  round: number;
  score: number;
  lives: number;
  startTime: number;
  roundStartTime: number;
  endTime: number;
  timeTaken: number[];
  correctAnswers: number;
  incorrectAnswers: number;
}

const ColorDashGame: React.FC = () => {
  const { toast } = useToast();
  const [state, setState] = useState<GameState>({
    isStarted: false,
    isActive: false,
    isComplete: false,
    difficulty: 'easy' as Difficulty,
    round: 0,
    score: 0,
    lives: 3,
    startTime: 0,
    roundStartTime: 0,
    endTime: 0,
    timeTaken: [],
    correctAnswers: 0,
    incorrectAnswers: 0
  });

  const [gameConfig, setGameConfig] = useState(DIFFICULTY_LEVELS.easy);
  const [textColor, setTextColor] = useState(COLORS[0]);
  const [displayedColorName, setDisplayedColorName] = useState(COLORS[0].name);
  const [timeLeft, setTimeLeft] = useState(100);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [metrics, setMetrics] = useState<ColorDashMetrics | null>(null);

  // Initialize new round
  const setupNewRound = useCallback(() => {
    // Reset feedback
    setFeedback(null);

    // Select a random text color
    const availableColors = COLORS.slice(0, gameConfig.colorOptions);
    const textColorIndex = Math.floor(Math.random() * availableColors.length);
    const selectedTextColor = availableColors[textColorIndex];
    
    // Determine if this round should be a match or mismatch
    const shouldMismatch = Math.random() < gameConfig.mismatchProbability;
    
    let selectedColorName;
    if (shouldMismatch) {
      // Choose a different color name
      let differentColorIndex;
      do {
        differentColorIndex = Math.floor(Math.random() * availableColors.length);
      } while (differentColorIndex === textColorIndex);
      selectedColorName = availableColors[differentColorIndex].name;
    } else {
      // Use the same color name (a match)
      selectedColorName = selectedTextColor.name;
    }
    
    setTextColor(selectedTextColor);
    setDisplayedColorName(selectedColorName);
    setTimeLeft(100);
    
    // Record the start time of this round
    const now = Date.now();
    setState(prev => ({
      ...prev,
      roundStartTime: now
    }));
  }, [gameConfig]);

  // Start the game
  const startGame = (difficulty: Difficulty) => {
    const difficultyConfig = DIFFICULTY_LEVELS[difficulty];
    setGameConfig(difficultyConfig);
    
    const now = Date.now();
    setState({
      isStarted: true,
      isActive: true,
      isComplete: false,
      difficulty,
      round: 1,
      score: 0,
      lives: 3,
      startTime: now,
      roundStartTime: now,
      endTime: 0,
      timeTaken: [],
      correctAnswers: 0,
      incorrectAnswers: 0
    });
    
    setupNewRound();
  };

  // Handle user response
  const handleResponse = (isMatch: boolean) => {
    const now = Date.now();
    const reactionTime = now - state.roundStartTime;
    
    // Check if user's response is correct
    const actualMatch = textColor.name === displayedColorName;
    const isCorrect = isMatch === actualMatch;
    
    // Update game state
    setState(prev => {
      const newState = { ...prev };
      newState.timeTaken.push(reactionTime);
      
      if (isCorrect) {
        newState.score += Math.max(50, 100 - Math.floor(reactionTime / 50));
        newState.correctAnswers += 1;
        setFeedback('correct');
      } else {
        newState.lives -= 1;
        newState.incorrectAnswers += 1;
        setFeedback('incorrect');
      }
      
      // Check if game is over
      if (newState.lives <= 0 || newState.round >= gameConfig.roundsToComplete) {
        newState.isActive = false;
        newState.isComplete = true;
        newState.endTime = now;
        
        // Calculate metrics
        calculateMetrics(newState);
      } else {
        // Move to next round
        newState.round += 1;
      }
      
      return newState;
    });
    
    // If game is not over, setup the next round after a delay
    if (state.lives > 1 && state.round < gameConfig.roundsToComplete) {
      setTimeout(() => {
        setupNewRound();
      }, 1000); // 1 second delay to show feedback
    }
  };

  // Calculate game metrics
  const calculateMetrics = (gameState: GameState) => {
    const totalTime = gameState.endTime - gameState.startTime;
    const avgReactionTime = gameState.timeTaken.reduce((a, b) => a + b, 0) / gameState.timeTaken.length;
    
    // Filter out reaction times for correct answers only
    const correctTimes = gameState.timeTaken.slice(0, gameState.correctAnswers);
    const avgCorrectReactionTime = correctTimes.length > 0
      ? correctTimes.reduce((a, b) => a + b, 0) / correctTimes.length
      : 0;
    
    // Calculate accuracy
    const accuracy = gameState.correctAnswers / gameState.round * 100;
    
    // Calculate specialized metrics
    const visualReactionTime = avgReactionTime;
    const colorMatchingAccuracy = accuracy;
    const peripheralVisionScore = 100 - Math.min(100, avgReactionTime / 10);
    const colorMatchingSpeed = 100 - Math.min(100, avgCorrectReactionTime / 10);
    const visualDiscriminationScore = accuracy * (gameState.score / (gameState.round * 100));
    const sequenceMemoryScore = gameState.round >= gameConfig.roundsToComplete ? 100 : 
      (gameState.round / gameConfig.roundsToComplete) * 100;
    
    const calculatedMetrics: ColorDashMetrics = {
      totalTime,
      completionTime: totalTime,
      score: gameState.score,
      accuracy,
      level: gameState.difficulty === 'easy' ? 1 : (gameState.difficulty === 'medium' ? 2 : 3),
      visualReactionTime,
      colorMatchingAccuracy,
      peripheralVisionScore,
      colorMatchingSpeed,
      visualDiscriminationScore,
      colorSequenceMemory: sequenceMemoryScore
    };
    
    setMetrics(calculatedMetrics);
    
    // Save results to localStorage only for now
    try {
      // Using localStorage fallback as server-side saving needs additional setup
      miniGameService.saveGameResultLocally('color-dash', calculatedMetrics, true);
     //  console.log('Game results saved locally');
    } catch (error) {
      console.error('Failed to save game results:', error);
      toast({
        title: 'Notice',
        description: 'Results saved locally for development purposes.',
        variant: 'default'
      });
    }
  };

  // Countdown timer
  useEffect(() => {
    let timerId: NodeJS.Timeout;
    
    if (state.isActive) {
      timerId = setInterval(() => {
        setTimeLeft(prev => {
          const newValue = prev - (100 / (gameConfig.timePerRound / 100));
          
          // If time runs out, count as incorrect response
          if (newValue <= 0) {
            handleResponse(false); // Auto-submit "No" when time runs out
            return 0;
          }
          
          return newValue;
        });
      }, 100); // Update every 100ms
    }
    
    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [state.isActive, gameConfig, handleResponse]);

  // Render different game states
  if (!state.isStarted) {
    return <DifficultySelector onSelectDifficulty={startGame} />;
  }
  
  if (state.isComplete) {
    return <GameResults state={state} metrics={metrics} onPlayAgain={() => startGame(state.difficulty)} />;
  }
  
  return (
    <div className="flex flex-col space-y-4">
      {/* Game stats */}
      <div className="stats-container">
        <div className="stat-box">
          <div className="text-sm text-gray-500">Round</div>
          <div className="font-bold">{state.round}/{gameConfig.roundsToComplete}</div>
        </div>
        
        <div className="stat-box">
          <div className="text-sm text-gray-500">Score</div>
          <div className="font-bold">{state.score}</div>
        </div>
        
        <div className="stat-box">
          <div className="text-sm text-gray-500">Lives</div>
          <div className="font-bold">{Array(state.lives).fill('❤️').join('')}</div>
        </div>
      </div>
      
      {/* Timer */}
      <div className="timer-bar">
        <Progress value={timeLeft} className="h-2" />
      </div>
      
      {/* Challenge */}
      <Card className={`color-challenge-container p-8 text-center animate-fadeIn ${feedback ? 'border-2' : ''} ${
        feedback === 'correct' ? 'border-green-500' : feedback === 'incorrect' ? 'border-red-500' : ''
      }`}>
        <div className="pb-4 text-lg">
          Does the <strong>text color</strong> match the <strong>color name</strong>?
        </div>
        
        <div className={`text-6xl font-bold my-8 ${textColor.textColor} color-text ${feedback ? 'animate-pulse' : ''}`}>
          {displayedColorName}
        </div>
        
        {/* Feedback */}
        {feedback && (
          <div className="absolute top-2 right-2">
            {feedback === 'correct' ? 
              <CheckCircle2 className="w-6 h-6 text-green-500" /> : 
              <XCircle className="w-6 h-6 text-red-500" />
            }
          </div>
        )}
      </Card>
      
      {/* Response buttons */}
      <div className="response-buttons">
        <Button 
          className="flex-1 h-16 text-lg yes-button"
          variant="outline"
          onClick={() => handleResponse(true)}
          disabled={!!feedback}
        >
          <CheckCircle2 className="w-5 h-5 mr-2" /> Yes, it matches
        </Button>
        
        <Button 
          className="flex-1 h-16 text-lg no-button"
          variant="outline"
          onClick={() => handleResponse(false)}
          disabled={!!feedback}
        >
          <XCircle className="w-5 h-5 mr-2" /> No, it doesn't match
        </Button>
      </div>
    </div>
  );
};

// Difficulty selector component
const DifficultySelector: React.FC<{ onSelectDifficulty: (difficulty: Difficulty) => void }> = ({ onSelectDifficulty }) => {
  return (
    <div className="flex flex-col items-center space-y-6 py-8 animate-fadeIn">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Welcome to Color Dash!</h2>
        <p className="text-gray-600 max-w-xl">
          Test your visual perception and reaction time by quickly determining if the text color matches the color name.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl mt-4">
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectDifficulty('easy')}>
          <div className="text-center">
            <div className="bg-green-100 text-green-800 text-sm font-medium rounded-full px-3 py-1 inline-block mb-2">
              Easy
            </div>
            <h3 className="text-lg font-bold mb-2">Beginner</h3>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• 10 rounds</li>
              <li>• 5 seconds per round</li>
              <li>• 4 colors</li>
              <li>• 3 lives</li>
            </ul>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer border-blue-200" onClick={() => onSelectDifficulty('medium')}>
          <div className="text-center">
            <div className="bg-blue-100 text-blue-800 text-sm font-medium rounded-full px-3 py-1 inline-block mb-2">
              Medium
            </div>
            <h3 className="text-lg font-bold mb-2">Intermediate</h3>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• 15 rounds</li>
              <li>• 3.5 seconds per round</li>
              <li>• 5 colors</li>
              <li>• 3 lives</li>
            </ul>
          </div>
        </Card>
        
        <Card className="p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => onSelectDifficulty('hard')}>
          <div className="text-center">
            <div className="bg-red-100 text-red-800 text-sm font-medium rounded-full px-3 py-1 inline-block mb-2">
              Hard
            </div>
            <h3 className="text-lg font-bold mb-2">Expert</h3>
            <ul className="text-sm text-gray-600 text-left space-y-1">
              <li>• 20 rounds</li>
              <li>• 2.5 seconds per round</li>
              <li>• 6 colors</li>
              <li>• 3 lives</li>
            </ul>
          </div>
        </Card>
      </div>
      
      <div className="text-center text-gray-600 max-w-xl mt-6">
        <AlertCircle className="w-5 h-5 inline-block mr-1 mb-1" />
        <span>Respond quickly! Points are awarded based on your reaction time.</span>
      </div>
    </div>
  );
};

// Game results component
const GameResults: React.FC<{
  state: GameState;
  metrics: ColorDashMetrics | null;
  onPlayAgain: () => void;
}> = ({ state, metrics, onPlayAgain }) => {
  if (!metrics) return <div>Loading results...</div>;
  
  // Calculate game summary
  const totalRounds = state.correctAnswers + state.incorrectAnswers;
  const accuracy = (state.correctAnswers / totalRounds) * 100;
  const avgReactionTime = metrics.visualReactionTime;
  const completionPercent = (state.round / DIFFICULTY_LEVELS[state.difficulty].roundsToComplete) * 100;
  const gameCompleted = state.round >= DIFFICULTY_LEVELS[state.difficulty].roundsToComplete;
  
  // Performance tiers
  const getAccuracyTier = (acc: number) => {
    if (acc >= 90) return "Exceptional";
    if (acc >= 75) return "Great";
    if (acc >= 60) return "Good";
    return "Needs Practice";
  };
  
  const getSpeedTier = (time: number) => {
    if (time < 500) return "Lightning Fast";
    if (time < 1000) return "Very Quick";
    if (time < 1500) return "Good";
    return "Average";
  };
  
  return (
    <div className="flex flex-col items-center space-y-6 py-6 animate-fadeIn">
      <div className="completion-badge">
        {gameCompleted ? <Award /> : <AlertCircle />}
      </div>
      
      <h2 className="text-2xl font-bold text-center">
        {gameCompleted ? "Challenge Complete!" : "Game Over"}
      </h2>
      
      <Card className="w-full max-w-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-sm">Final Score</div>
            <div className="text-2xl font-bold">{state.score}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-sm">Accuracy</div>
            <div className="text-2xl font-bold">{accuracy.toFixed(0)}%</div>
            <div className="text-xs text-gray-500">{getAccuracyTier(accuracy)}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-sm">Avg. Reaction Time</div>
            <div className="text-2xl font-bold">{avgReactionTime.toFixed(0)}ms</div>
            <div className="text-xs text-gray-500">{getSpeedTier(avgReactionTime)}</div>
          </div>
          
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-gray-500 text-sm">Rounds Completed</div>
            <div className="text-2xl font-bold">
              {state.round}/{DIFFICULTY_LEVELS[state.difficulty].roundsToComplete}
            </div>
            <div className="text-xs text-gray-500">
              {completionPercent.toFixed(0)}%
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="text-lg font-bold mb-2">Cognitive Metrics</h3>
          <div className="space-y-2">
            <MetricBar label="Visual Perception" value={metrics.visualDiscriminationScore} />
            <MetricBar label="Color Processing" value={metrics.colorMatchingAccuracy} />
            <MetricBar label="Reaction Speed" value={metrics.colorMatchingSpeed} />
            <MetricBar label="Visual Attention" value={metrics.peripheralVisionScore} />
          </div>
        </div>
      </Card>
      
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onPlayAgain} className="px-8">
          Play Again
        </Button>
        <Button 
          variant="outline" 
          className="px-8 border-green-500 text-green-600 hover:bg-green-50"
          onClick={() => {
            // Check if we came from the career quiz
            const urlParams = new URLSearchParams(window.location.search);
            const fromCareerQuiz = urlParams.get('from') === 'career-quiz';
            const sector = urlParams.get('sector') || localStorage.getItem('lastCareerQuizSector');
            
            if (fromCareerQuiz && sector) {
             //  console.log(`Game completed, continuing to next sector from ${sector}`);
              // Convert to number, increment, and store as the current sector
              const sectorNum = parseInt(sector);
              // Continue to the next sector
              const nextSector = sectorNum + 1;
              localStorage.setItem('currentSector', nextSector.toString());
              
              // Navigate to the quiz to continue to the next section
             //  console.log(`Moving to sector ${nextSector}`);
              window.location.replace('/quick-quiz');
            } else {
              // Return to the career quiz landing page as fallback
              window.location.replace('/career-quiz');
            }
          }}
        >
          Return to Career Race
        </Button>
      </div>
    </div>
  );
};

// Metric bar component
const MetricBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-medium text-gray-500">{value.toFixed(0)}%</span>
      </div>
      <Progress value={value} className="h-2" />
    </div>
  );
};

export default ColorDashGame;