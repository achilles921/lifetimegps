import React, { useState, useEffect } from 'react';
import MiniGameLayout from '@/components/mini-games/MiniGameLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3X3, Check, X, Clock, Brain } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import miniGameService from '@/services/MiniGameService';
import { MultisensoryMatrixMetrics } from '@/components/mini-games/MiniGameTypes';

// Game difficulty levels
enum DifficultyLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3
}

// Game states
enum GameState {
  Start,
  Memorizing,
  Playing,
  LevelComplete,
  Results
}

// Tile types
enum TileType {
  Color,
  Shape,
  Symbol,
  Mixed
}

// Shape types
enum ShapeType {
  Circle,
  Square,
  Triangle,
  Diamond,
  Star
}

// Symbol types
enum SymbolType {
  Heart,
  Plus,
  Dollar,
  Percent,
  Hash
}

// Tile data structure
interface Tile {
  id: number;
  color: string;
  revealed: boolean;
  matched: boolean;
  selected: boolean;
  type: TileType;
  shape?: ShapeType;
  symbol?: SymbolType;
  value: number; // Used for matching
}

const MultisensoryMatrixPage: React.FC = () => {
 //  console.log('Multisensory Matrix game mounted');
  
  return (
    <MiniGameLayout
      gameId="multisensory-matrix"
      title="Multisensory Matrix"
      description="Challenge your memory and multitasking abilities"
      icon={<Grid3X3 className="w-6 h-6 text-white" />}
      themeColor="bg-gradient-to-r from-indigo-600 to-violet-600"
      showExitConfirmation={true}
    >
      <MultisensoryMatrixGame />
    </MiniGameLayout>
  );
};

const MultisensoryMatrixGame: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy);
  const [tiles, setTiles] = useState<Tile[]>([]);
  const [gridSize, setGridSize] = useState({ rows: 4, cols: 4 });
  const [currentLevel, setCurrentLevel] = useState(1);
  const [maxLevel, setMaxLevel] = useState(5);
  const [score, setScore] = useState(0);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [memoryTimeLeft, setMemoryTimeLeft] = useState(0);
  const [selectedTiles, setSelectedTiles] = useState<Tile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [levelStartTime, setLevelStartTime] = useState<number | null>(null);
  const [gameEndTime, setGameEndTime] = useState<number | null>(null);
  const [totalTimeElapsed, setTotalTimeElapsed] = useState(0);
  
  // Game metrics
  const [metrics, setMetrics] = useState<MultisensoryMatrixMetrics>({
    totalTime: 0,
    completionTime: 0,
    score: 0,
    accuracy: 0,
    level: 0,
    spatialReasoningScore: 0,
    patternCompletionAccuracy: 0,
    multiTaskingScore: 0,
    workingMemoryCapacity: 0,
    logicalSequencingScore: 0,
  });
  
  // Colors for tiles
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  // Memory timer
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameState === GameState.Memorizing && memoryTimeLeft > 0) {
      timer = setInterval(() => {
        setMemoryTimeLeft(prev => {
          if (prev <= 1) {
            hideTiles(); // Hide all tiles when time is up
            setTimeout(() => {
              setGameState(GameState.Playing);
             //  console.log("Game state changed to Playing - tiles should be clickable now");
            }, 100);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameState, memoryTimeLeft]);
  
  // Start a new game
  const startGame = () => {
    const initialLevel = 1;
    setCurrentLevel(initialLevel);
    setScore(0);
    setMoves(0);
    setMatches(0);
    setGameStartTime(Date.now());
    setTotalTimeElapsed(0);
    
    // Set max levels based on difficulty
    const maxLevels = difficulty === DifficultyLevel.Easy ? 5 : 
                    difficulty === DifficultyLevel.Medium ? 7 : 10;
    setMaxLevel(maxLevels);
    
    // Start first level
    startLevel(initialLevel);
  };
  
  // Start a new level
  const startLevel = (level: number) => {
    // Adjust grid size based on level and difficulty
    let rows = 4;
    let cols = 4;
    
    if (difficulty === DifficultyLevel.Easy) {
      if (level > 3) {
        rows = 4;
        cols = 5;
      }
    } else if (difficulty === DifficultyLevel.Medium) {
      if (level > 2) {
        rows = 4;
        cols = 5;
      }
      if (level > 5) {
        rows = 6;
        cols = 6;
      }
    } else { // Hard
      if (level > 1) {
        rows = 4;
        cols = 5;
      }
      if (level > 4) {
        rows = 6;
        cols = 6;
      }
      if (level > 7) {
        rows = 6;
        cols = 7;
      }
    }
    
    setGridSize({ rows, cols });
    
    // Generate tiles
    const newTiles = generateTiles(rows, cols, level, difficulty);
    setTiles(newTiles);
    
    // Reset level state
    setSelectedTiles([]);
    setMatches(0);
    setLevelStartTime(Date.now());
    
    // Set memorization time based on difficulty and level
    const memTime = difficulty === DifficultyLevel.Easy ? 5 : 
                  difficulty === DifficultyLevel.Medium ? 4 : 3;
    setMemoryTimeLeft(memTime);
    
    // Start memorization phase
    setGameState(GameState.Memorizing);
  };
  
  // Generate tiles for the game
  const generateTiles = (rows: number, cols: number, level: number, difficulty: DifficultyLevel): Tile[] => {
    const totalTiles = rows * cols;
    
    // Make sure total tiles is even for pairs
    const adjustedTotal = totalTiles % 2 === 0 ? totalTiles : totalTiles - 1;
    
    // Determine type of tiles based on difficulty and level
    let tileType = TileType.Color;
    
    if (difficulty === DifficultyLevel.Easy) {
      tileType = level <= 3 ? TileType.Color : TileType.Shape;
    } else if (difficulty === DifficultyLevel.Medium) {
      if (level <= 2) tileType = TileType.Color;
      else if (level <= 5) tileType = TileType.Shape;
      else tileType = TileType.Symbol;
    } else { // Hard
      if (level <= 2) tileType = TileType.Shape;
      else if (level <= 5) tileType = TileType.Symbol;
      else tileType = TileType.Mixed;
    }
    
    // Create pairs of values
    const numPairs = adjustedTotal / 2;
    const values: number[] = [];
    
    for (let i = 0; i < numPairs; i++) {
      values.push(i);
      values.push(i);
    }
    
    // Shuffle the values
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [values[i], values[j]] = [values[j], values[i]];
    }
    
    // Create tiles
    const tiles: Tile[] = [];
    for (let i = 0; i < adjustedTotal; i++) {
      const value = values[i];
      const color = colors[value % colors.length];
      const tile: Tile = {
        id: i,
        color,
        revealed: true, // Start revealed for memorization
        matched: false,
        selected: false,
        type: tileType,
        value,
      };
      
      // Add shape or symbol properties based on tile type
      if (tileType === TileType.Shape || tileType === TileType.Mixed) {
        tile.shape = value % 5;
      }
      
      if (tileType === TileType.Symbol || tileType === TileType.Mixed) {
        tile.symbol = value % 5;
      }
      
      tiles.push(tile);
    }
    
    return tiles;
  };
  
  // Hide all tiles after memorization phase
  const hideTiles = () => {
    const updatedTiles = tiles.map(tile => ({
      ...tile,
      revealed: false
    }));
    setTiles(updatedTiles);
  };
  
  // Handle tile click
  const handleTileClick = (tile: Tile) => {
    // Only allow clicks during the Playing state
    if (gameState !== GameState.Playing) {
      return;
    }
    
    // Don't allow clicks on already matched, revealed, or when processing
    if (isProcessing || tile.matched || tile.revealed || selectedTiles.length >= 2) {
      return;
    }
    
   //  console.log("Tile clicked:", tile.id, tile.color);
    
    // Reveal the tile
    const updatedTiles = tiles.map(t => 
      t.id === tile.id ? { ...t, revealed: true, selected: true } : t
    );
    setTiles(updatedTiles);
    
    // Add to selected tiles
    const newSelected = [...selectedTiles, tile];
    setSelectedTiles(newSelected);
    
    // If two tiles are selected, check for a match
    if (newSelected.length === 2) {
      setIsProcessing(true);
      setMoves(moves + 1);
      
      setTimeout(() => {
        checkForMatch(newSelected[0], newSelected[1]);
        setIsProcessing(false);
      }, 1000);
    }
  };
  
  // Check if selected tiles match
  const checkForMatch = (tile1: Tile, tile2: Tile) => {
    const isMatch = tile1.value === tile2.value;
    
    // Update tiles
    const updatedTiles = tiles.map(tile => {
      if (tile.id === tile1.id || tile.id === tile2.id) {
        return {
          ...tile,
          matched: isMatch,
          revealed: isMatch,
          selected: false
        };
      }
      return tile;
    });
    
    setTiles(updatedTiles);
    setSelectedTiles([]);
    
    // Update score and matches
    if (isMatch) {
      const matchPoints = difficulty * 50 * (currentLevel * 0.5);
      setScore(score + matchPoints);
      setMatches(matches + 1);
      
      // Check if level is complete
      const requiredMatches = (gridSize.rows * gridSize.cols) / 2;
      if (matches + 1 >= requiredMatches) {
        handleLevelComplete();
      }
    }
  };
  
  // Handle level completion
  const handleLevelComplete = () => {
    const levelEndTime = Date.now();
    const levelTimeElapsed = levelStartTime ? (levelEndTime - levelStartTime) / 1000 : 0;
    setTotalTimeElapsed(totalTimeElapsed + levelTimeElapsed);
    
    // Add level completion bonus
    const timeFactor = Math.max(0, 1 - (levelTimeElapsed / 120)); // Bonus decreases as time increases
    const levelBonus = Math.floor(difficulty * 100 * currentLevel * timeFactor);
    setScore(score + levelBonus);
    
    setGameState(GameState.LevelComplete);
  };
  
  // Handle moving to the next level
  const handleNextLevel = () => {
    const nextLevel = currentLevel + 1;
    
    if (nextLevel <= maxLevel) {
      setCurrentLevel(nextLevel);
      startLevel(nextLevel);
    } else {
      // Game is complete
      finishGame();
    }
  };
  
  // Finish the game and calculate metrics
  const finishGame = () => {
    const endTime = Date.now();
    setGameEndTime(endTime);
    
    if (gameStartTime) {
      const gameTimeElapsed = (endTime - gameStartTime) / 1000; // in seconds
      
      // Calculate accuracy
      const movesPerMatch = moves / Math.max(1, matches);
      const perfectMovesPerMatch = gridSize.rows * gridSize.cols / 2; // Each pair should take 1 move in perfect play
      const accuracyScore = Math.max(0, 100 - ((movesPerMatch - 1) * 20)); // Penalty for extra moves
      
      // Calculate memory capacity
      const gridComplexity = gridSize.rows * gridSize.cols;
      const memoryCapacity = Math.min(100, (gridComplexity / 36) * 100); // 6x6 grid = 100%
      
      // Calculate multitasking score based on difficulty and level reached
      const multitaskingBase = difficulty * 20;
      const levelBonus = currentLevel * 5;
      const multitaskingScore = Math.min(100, multitaskingBase + levelBonus);
      
      // Calculate spatial reasoning based on grid size and speed
      const spatialBase = (gridSize.rows * gridSize.cols) / 2;
      const timePerMatch = gameTimeElapsed / Math.max(1, matches);
      const speedFactor = Math.max(0, 1 - (timePerMatch / 10)); // Faster is better
      const spatialScore = Math.min(100, spatialBase * speedFactor * 10);
      
      // Calculate pattern recognition
      const patternScore = Math.min(100, accuracyScore * 0.7 + memoryCapacity * 0.3);
      
      // Logical sequencing score
      const sequencingScore = Math.min(100, 75 + (currentLevel * 5));
      
      const calculatedMetrics: MultisensoryMatrixMetrics = {
        totalTime: gameTimeElapsed,
        completionTime: gameTimeElapsed,
        score,
        accuracy: accuracyScore,
        level: currentLevel,
        spatialReasoningScore: spatialScore,
        patternCompletionAccuracy: patternScore,
        multiTaskingScore: multitaskingScore,
        workingMemoryCapacity: memoryCapacity,
        logicalSequencingScore: sequencingScore,
      };
      
      setMetrics(calculatedMetrics);
      
      // Save game results
      try {
        miniGameService.saveGameResultLocally('multisensory-matrix', calculatedMetrics, currentLevel >= maxLevel);
       //  console.log('Game results saved locally');
      } catch (error) {
        console.error('Error saving game results:', error);
      }
      
      setGameState(GameState.Results);
    }
  };
  
  // Play again button handler
  const onPlayAgain = () => {
    setGameState(GameState.Start);
  };
  
  // Render a tile
  const renderTile = (tile: Tile) => {
    // Base tile classes
    const baseClasses = `relative aspect-square rounded-lg shadow transition-all transform 
      ${tile.selected ? 'scale-95' : ''} 
      ${tile.matched ? 'opacity-70' : ''} 
      ${gameState === GameState.Playing && !tile.matched && !tile.revealed ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}
    `;
    
    // Content classes (for revealed tiles)
    const contentClasses = `absolute inset-0 flex items-center justify-center ${
      tile.color
    } text-white font-bold rounded-lg ${tile.selected ? 'ring-4 ring-white' : ''}`;
    
    // Back face classes (for hidden tiles)
    const backClasses = `absolute inset-0 bg-slate-700 rounded-lg flex items-center justify-center text-white 
      ${gameState === GameState.Playing ? 'hover:bg-slate-600 active:bg-slate-800' : ''}`;
    
    // Render inner content based on tile type
    const renderTileContent = () => {
      switch (tile.type) {
        case TileType.Color:
          return null; // Just show the color
          
        case TileType.Shape:
          return renderShape(tile.shape as ShapeType);
          
        case TileType.Symbol:
          return renderSymbol(tile.symbol as SymbolType);
          
        case TileType.Mixed:
          return (
            <>
              {renderShape(tile.shape as ShapeType)}
              <div className="absolute top-2 right-2 text-lg">
                {renderSymbol(tile.symbol as SymbolType)}
              </div>
            </>
          );
      }
    };
    
    return (
      <div 
        key={tile.id}
        className={baseClasses}
        onClick={() => handleTileClick(tile)}
      >
        {/* Front face (revealed) */}
        {tile.revealed && (
          <div className={contentClasses}>
            {renderTileContent()}
          </div>
        )}
        
        {/* Back face (hidden) */}
        {!tile.revealed && (
          <div className={backClasses}>
            <Grid3X3 className="w-6 h-6" />
          </div>
        )}
      </div>
    );
  };
  
  // Render shape based on shape type
  const renderShape = (shape: ShapeType) => {
    switch (shape) {
      case ShapeType.Circle:
        return <div className="w-10 h-10 bg-white rounded-full" />;
      case ShapeType.Square:
        return <div className="w-10 h-10 bg-white" />;
      case ShapeType.Triangle:
        return (
          <div className="w-0 h-0 border-l-[20px] border-r-[20px] border-b-[35px] border-l-transparent border-r-transparent border-b-white" />
        );
      case ShapeType.Diamond:
        return (
          <div className="w-10 h-10 bg-white transform rotate-45" />
        );
      case ShapeType.Star:
        return (
          <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
            <path d="M12 2l2.6 8h8.4l-6.8 5 2.6 8-6.8-5-6.8 5 2.6-8-6.8-5h8.4z" />
          </svg>
        );
    }
  };
  
  // Render symbol based on symbol type
  const renderSymbol = (symbol: SymbolType) => {
    switch (symbol) {
      case SymbolType.Heart:
        return "❤️";
      case SymbolType.Plus:
        return "➕";
      case SymbolType.Dollar:
        return "💲";
      case SymbolType.Percent:
        return "%";
      case SymbolType.Hash:
        return "#";
    }
  };
  
  // Render the game start screen
  const renderStartScreen = () => (
    <div className="flex flex-col items-center gap-10 p-6">
      <Card className="w-full max-w-md p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold mb-2">Multisensory Matrix</h2>
        <p className="text-gray-500 mb-6">
          Challenge your memory and pattern recognition! Memorize the positions of colored tiles,
          then find matching pairs as quickly as possible.
        </p>
        
        <div className="space-y-4">
          <h3 className="font-semibold">Select Difficulty:</h3>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant={difficulty === DifficultyLevel.Easy ? "default" : "outline"}
              onClick={() => setDifficulty(DifficultyLevel.Easy)}
              className="flex-1"
            >
              Easy
            </Button>
            <Button 
              variant={difficulty === DifficultyLevel.Medium ? "default" : "outline"}
              onClick={() => setDifficulty(DifficultyLevel.Medium)}
              className="flex-1"
            >
              Medium
            </Button>
            <Button 
              variant={difficulty === DifficultyLevel.Hard ? "default" : "outline"}
              onClick={() => setDifficulty(DifficultyLevel.Hard)}
              className="flex-1"
            >
              Hard
            </Button>
          </div>
        </div>
        
        <div className="mt-6 text-left space-y-2">
          <h3 className="font-semibold text-center">How to Play:</h3>
          <ul className="list-disc pl-5 text-sm text-gray-600">
            <li>Memorize the positions of all tiles during the memorization phase</li>
            <li>Find matching pairs by clicking on tiles</li>
            <li>Match all pairs to complete each level</li>
            <li>Higher difficulty levels introduce shapes and symbols</li>
          </ul>
        </div>
      </Card>
      
      <Button size="lg" onClick={startGame} className="w-40">
        Start Game
      </Button>
    </div>
  );
  
  // Render the memorization phase
  const renderMemorizingScreen = () => (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="w-full flex justify-between items-center">
        <div className="text-left">
          <p className="text-sm text-gray-500">Level</p>
          <p className="text-xl font-bold">{currentLevel} / {maxLevel}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span className="text-xl font-bold">Memorize: {memoryTimeLeft}s</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-xl font-bold">{score}</p>
        </div>
      </div>
      
      <Card className="w-full p-6">
        <div 
          className="grid gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
          }}
        >
          {tiles.map(tile => renderTile(tile))}
        </div>
      </Card>
      
      <div className="text-center">
        <Button onClick={() => { 
          hideTiles();
          setGameState(GameState.Playing);
        }}>
          Start Matching
        </Button>
      </div>
    </div>
  );
  
  // Render the playing phase
  const renderPlayingScreen = () => (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="w-full flex justify-between items-center">
        <div className="text-left">
          <p className="text-sm text-gray-500">Level</p>
          <p className="text-xl font-bold">{currentLevel} / {maxLevel}</p>
        </div>
        <div className="text-center">
          <div className="flex items-center gap-2">
            <p className="text-sm font-semibold">
              Matches: {matches} / {(gridSize.rows * gridSize.cols) / 2}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-xl font-bold">{score}</p>
        </div>
      </div>
      
      <Progress 
        value={(matches / ((gridSize.rows * gridSize.cols) / 2)) * 100} 
        className="w-full h-2" 
      />
      
      <Card className="w-full p-6">
        <div 
          className="grid gap-2"
          style={{ 
            gridTemplateColumns: `repeat(${gridSize.cols}, 1fr)`,
            gridTemplateRows: `repeat(${gridSize.rows}, 1fr)`
          }}
        >
          {tiles.map(tile => renderTile(tile))}
        </div>
      </Card>
      
      <div className="flex items-center gap-4">
        <div className="text-center">
          <p className="text-sm text-gray-500">Moves</p>
          <p className="text-xl font-bold">{moves}</p>
        </div>
      </div>
    </div>
  );
  
  // Render the level complete screen
  const renderLevelCompleteScreen = () => (
    <div className="flex flex-col items-center gap-6 p-4 max-w-md mx-auto">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Level {currentLevel} Complete!</h2>
        <p className="text-gray-500">
          Well done! You matched all the pairs.
        </p>
      </div>
      
      <Card className="w-full p-6">
        <div className="flex flex-col items-center gap-4">
          <div className="bg-green-100 p-4 rounded-full">
            <Check className="w-10 h-10 text-green-500" />
          </div>
          
          <div className="grid grid-cols-2 gap-4 w-full">
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-semibold">{score}</div>
              <div className="text-xs text-gray-500">Score</div>
            </div>
            <div className="text-center p-3 bg-gray-50 rounded-lg">
              <div className="text-2xl font-semibold">{moves}</div>
              <div className="text-xs text-gray-500">Moves</div>
            </div>
          </div>
          
          {currentLevel < maxLevel ? (
            <Button 
              className="w-full mt-4" 
              onClick={handleNextLevel}
            >
              Continue to Level {currentLevel + 1}
            </Button>
          ) : (
            <Button 
              className="w-full mt-4" 
              onClick={finishGame}
            >
              Complete Game
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
  
  // Render the game results screen
  const renderResultsScreen = () => (
    <div className="flex flex-col items-center gap-6 p-4 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold">
        Game Complete!
      </h2>
      
      <Card className="w-full p-6 space-y-6">
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-primary mb-1">{metrics.score}</div>
          <div className="text-sm text-gray-500">Points Scored</div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-semibold">{currentLevel}</div>
            <div className="text-xs text-gray-500">Level Reached</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-semibold">{Math.round(metrics.accuracy)}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-semibold">
              {Math.round(metrics.totalTime)}s
            </div>
            <div className="text-xs text-gray-500">Total Time</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-semibold">
              {difficulty === DifficultyLevel.Easy ? 'Easy' : 
               difficulty === DifficultyLevel.Medium ? 'Medium' : 'Hard'}
            </div>
            <div className="text-xs text-gray-500">Difficulty</div>
          </div>
        </div>
        
        <div className="space-y-3">
          <h3 className="font-semibold mb-2">Your Cognitive Metrics:</h3>
          <MetricBar label="Spatial Reasoning" value={metrics.spatialReasoningScore} />
          <MetricBar label="Pattern Completion" value={metrics.patternCompletionAccuracy} />
          <MetricBar label="Multitasking" value={metrics.multiTaskingScore} />
          <MetricBar label="Working Memory" value={metrics.workingMemoryCapacity} />
          <MetricBar label="Logical Sequencing" value={metrics.logicalSequencingScore} />
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
  
  // Render the game based on current state
  switch (gameState) {
    case GameState.Start:
      return renderStartScreen();
    case GameState.Memorizing:
      return renderMemorizingScreen();
    case GameState.Playing:
      return renderPlayingScreen();
    case GameState.LevelComplete:
      return renderLevelCompleteScreen();
    case GameState.Results:
      return renderResultsScreen();
    default:
      return null;
  }
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

export default MultisensoryMatrixPage;