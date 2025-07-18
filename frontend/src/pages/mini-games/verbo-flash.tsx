import React, { useState, useEffect, useRef } from 'react';
import MiniGameLayout from '@/components/mini-games/MiniGameLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Clock, Check, X, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import miniGameService from '@/services/MiniGameService';
import { VerboFlashMetrics } from '@/components/mini-games/MiniGameTypes';

// Game difficulty levels
enum DifficultyLevel {
  Easy = 1,
  Medium = 2,
  Hard = 3
}

// Game states
enum GameState {
  Start,
  Playing,
  Review,
  Results
}

// Word pair for association
interface WordPair {
  id: number;
  prompt: string;
  target: string;
  userResponse: string;
  correct: boolean;
  responseTime: number;
}

// Categories for word associations
enum WordCategory {
  CommonPairs,
  Synonyms,
  Antonyms,
  Categories,
  Analogies
}

const VerboFlashPage: React.FC = () => {
 //  console.log('Verbo Flash game mounted');
  
  return (
    <MiniGameLayout
      gameId="verbo-flash"
      title="Verbo Flash"
      description="Test your verbal processing speed and word association abilities"
      icon={<MessageSquare className="w-6 h-6 text-white" />}
      themeColor="bg-gradient-to-r from-orange-500 to-amber-500"
      showExitConfirmation={true}
    >
      <VerboFlashGame />
    </MiniGameLayout>
  );
};

const VerboFlashGame: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy);
  const [wordPairs, setWordPairs] = useState<WordPair[]>([]);
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timePerWord, setTimePerWord] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameEndTime, setGameEndTime] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintPenalty, setHintPenalty] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [totalWordPairs, setTotalWordPairs] = useState(20);
  
  // Input reference for focus
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Timer reference
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Game metrics
  const [metrics, setMetrics] = useState<VerboFlashMetrics>({
    totalTime: 0,
    completionTime: 0,
    score: 0,
    accuracy: 0,
    level: 0,
    verbalProcessingSpeed: 0,
    wordAssociationAccuracy: 0,
    linguisticFlexibility: 0,
    vocabularyRange: 0,
    semanticComprehension: 0,
  });
  
  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);
  
  // Focus on input field when playing
  useEffect(() => {
    if (gameState === GameState.Playing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [gameState, currentPairIndex]);
  
  // Start countdown timer for each word
  useEffect(() => {
    if (gameState === GameState.Playing && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [gameState, timeLeft]);
  
  // Handle time up for current word
  const handleTimeUp = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Record response time and mark as incorrect
    const updatedPairs = [...wordPairs];
    updatedPairs[currentPairIndex] = {
      ...updatedPairs[currentPairIndex],
      userResponse: userInput || "NO RESPONSE",
      correct: false,
      responseTime: timePerWord * 1000 // Maximum time in ms
    };
    
    setWordPairs(updatedPairs);
    moveToNextWord();
  };
  
  // Start a new game
  const startGame = () => {
    // Generate word pairs based on difficulty
    const pairs = generateWordPairs(difficulty);
    setWordPairs(pairs);
    
    // Set time per word based on difficulty
    const time = difficulty === DifficultyLevel.Easy ? 8 : 
                difficulty === DifficultyLevel.Medium ? 6 : 4;
    setTimePerWord(time);
    setTimeLeft(time);
    
    // Reset game state
    setCurrentPairIndex(0);
    setScore(0);
    setUserInput('');
    setHintPenalty(0);
    setHintsUsed(0);
    setShowHint(false);
    setGameStartTime(Date.now());
    setStartTime(Date.now());
    
    // Set number of word pairs based on difficulty
    const numPairs = difficulty === DifficultyLevel.Easy ? 15 : 
                   difficulty === DifficultyLevel.Medium ? 20 : 25;
    setTotalWordPairs(numPairs);
    
    // Start playing
    setGameState(GameState.Playing);
  };
  
  // Generate word pairs based on difficulty
  const generateWordPairs = (difficulty: DifficultyLevel): WordPair[] => {
    // Number of pairs based on difficulty
    const numPairs = difficulty === DifficultyLevel.Easy ? 15 : 
                   difficulty === DifficultyLevel.Medium ? 20 : 25;
    
    // Categories to use based on difficulty
    let selectedCategories: WordCategory[] = [];
    
    if (difficulty === DifficultyLevel.Easy) {
      selectedCategories = [WordCategory.CommonPairs, WordCategory.Synonyms];
    } else if (difficulty === DifficultyLevel.Medium) {
      selectedCategories = [WordCategory.CommonPairs, WordCategory.Synonyms, WordCategory.Antonyms, WordCategory.Categories];
    } else {
      selectedCategories = [WordCategory.CommonPairs, WordCategory.Synonyms, WordCategory.Antonyms, WordCategory.Categories, WordCategory.Analogies];
    }
    
    // Generate pairs from all categories
    const pairs: WordPair[] = [];
    
    // Common word pairs (e.g., "peanut" -> "butter")
    const commonPairs = [
      { prompt: "peanut", target: "butter" },
      { prompt: "salt", target: "pepper" },
      { prompt: "bread", target: "butter" },
      { prompt: "cup", target: "saucer" },
      { prompt: "knife", target: "fork" },
      { prompt: "shoes", target: "socks" },
      { prompt: "pen", target: "paper" },
      { prompt: "lock", target: "key" },
      { prompt: "needle", target: "thread" },
      { prompt: "hammer", target: "nail" },
      { prompt: "coffee", target: "tea" },
      { prompt: "sun", target: "moon" },
      { prompt: "day", target: "night" },
      { prompt: "bow", target: "arrow" },
      { prompt: "king", target: "queen" },
    ];
    
    // Synonyms (e.g., "happy" -> "joyful")
    const synonyms = [
      { prompt: "happy", target: "joyful" },
      { prompt: "sad", target: "unhappy" },
      { prompt: "big", target: "large" },
      { prompt: "small", target: "tiny" },
      { prompt: "fast", target: "quick" },
      { prompt: "slow", target: "sluggish" },
      { prompt: "smart", target: "intelligent" },
      { prompt: "beautiful", target: "pretty" },
      { prompt: "angry", target: "mad" },
      { prompt: "cold", target: "chilly" },
      { prompt: "hot", target: "warm" },
      { prompt: "tired", target: "exhausted" },
      { prompt: "hungry", target: "starving" },
      { prompt: "rich", target: "wealthy" },
      { prompt: "begin", target: "start" },
    ];
    
    // Antonyms (e.g., "hot" -> "cold")
    const antonyms = [
      { prompt: "hot", target: "cold" },
      { prompt: "big", target: "small" },
      { prompt: "tall", target: "short" },
      { prompt: "happy", target: "sad" },
      { prompt: "light", target: "dark" },
      { prompt: "fast", target: "slow" },
      { prompt: "strong", target: "weak" },
      { prompt: "rich", target: "poor" },
      { prompt: "young", target: "old" },
      { prompt: "clean", target: "dirty" },
      { prompt: "easy", target: "difficult" },
      { prompt: "wet", target: "dry" },
      { prompt: "full", target: "empty" },
      { prompt: "high", target: "low" },
      { prompt: "loud", target: "quiet" },
    ];
    
    // Categories (e.g., "apple" -> "fruit")
    const categoryPairs = [
      { prompt: "apple", target: "fruit" },
      { prompt: "carrot", target: "vegetable" },
      { prompt: "dog", target: "animal" },
      { prompt: "chair", target: "furniture" },
      { prompt: "piano", target: "instrument" },
      { prompt: "hammer", target: "tool" },
      { prompt: "shirt", target: "clothing" },
      { prompt: "car", target: "vehicle" },
      { prompt: "rose", target: "flower" },
      { prompt: "oak", target: "tree" },
      { prompt: "robin", target: "bird" },
      { prompt: "shark", target: "fish" },
      { prompt: "pencil", target: "writing" },
      { prompt: "gold", target: "metal" },
      { prompt: "baseball", target: "sport" },
    ];
    
    // Analogies (e.g., "sky : blue :: grass : ___" -> "green")
    const analogies = [
      { prompt: "sky : blue :: grass", target: "green" },
      { prompt: "fish : swim :: bird", target: "fly" },
      { prompt: "hand : finger :: foot", target: "toe" },
      { prompt: "sheep : wool :: cow", target: "milk" },
      { prompt: "car : road :: boat", target: "water" },
      { prompt: "book : read :: song", target: "listen" },
      { prompt: "day : sun :: night", target: "moon" },
      { prompt: "eye : see :: ear", target: "hear" },
      { prompt: "winter : cold :: summer", target: "hot" },
      { prompt: "kitten : cat :: puppy", target: "dog" },
      { prompt: "hungry : eat :: thirsty", target: "drink" },
      { prompt: "teacher : school :: doctor", target: "hospital" },
      { prompt: "watch : wrist :: hat", target: "head" },
      { prompt: "second : minute :: minute", target: "hour" },
      { prompt: "sad : cry :: happy", target: "smile" },
    ];
    
    // Collect pairs from selected categories
    const allPairs: {prompt: string, target: string}[] = [];
    if (selectedCategories.includes(WordCategory.CommonPairs)) allPairs.push(...commonPairs);
    if (selectedCategories.includes(WordCategory.Synonyms)) allPairs.push(...synonyms);
    if (selectedCategories.includes(WordCategory.Antonyms)) allPairs.push(...antonyms);
    if (selectedCategories.includes(WordCategory.Categories)) allPairs.push(...categoryPairs);
    if (selectedCategories.includes(WordCategory.Analogies)) allPairs.push(...analogies);
    
    // Shuffle and select pairs
    const shuffledPairs = [...allPairs].sort(() => 0.5 - Math.random());
    
    // Create word pairs with game state
    for (let i = 0; i < numPairs && i < shuffledPairs.length; i++) {
      pairs.push({
        id: i,
        prompt: shuffledPairs[i].prompt,
        target: shuffledPairs[i].target,
        userResponse: '',
        correct: false,
        responseTime: 0
      });
    }
    
    return pairs;
  };
  
  // Handle user input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userInput.trim() === '') return;
    
    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Calculate response time
    const endTime = Date.now();
    const responseTime = startTime ? endTime - startTime : 0;
    
    // Check if answer is correct
    const currentPair = wordPairs[currentPairIndex];
    const normalizedUserInput = userInput.trim().toLowerCase();
    const normalizedTarget = currentPair.target.toLowerCase();
    const isCorrect = normalizedUserInput === normalizedTarget;
    
    // Update word pair
    const updatedPairs = [...wordPairs];
    updatedPairs[currentPairIndex] = {
      ...updatedPairs[currentPairIndex],
      userResponse: userInput,
      correct: isCorrect,
      responseTime
    };
    
    setWordPairs(updatedPairs);
    
    // Update score
    if (isCorrect) {
      // Base points for correct answer
      const speedFactor = Math.max(0, timePerWord - (responseTime / 1000));
      const difficultyFactor = difficulty * 1.5;
      const points = Math.floor(100 * (speedFactor / timePerWord) * difficultyFactor) - hintPenalty;
      
      setScore(prev => prev + Math.max(10, points));
    }
    
    moveToNextWord();
  };
  
  // Move to the next word
  const moveToNextWord = () => {
    const nextIndex = currentPairIndex + 1;
    
    // Reset for next word
    setUserInput('');
    setHintPenalty(0);
    setShowHint(false);
    
    if (nextIndex < totalWordPairs && nextIndex < wordPairs.length) {
      setCurrentPairIndex(nextIndex);
      setTimeLeft(timePerWord);
      setStartTime(Date.now());
    } else {
      // All words completed
      finishGame();
    }
  };
  
  // Show hint for current word
  const handleShowHint = () => {
    setShowHint(true);
    // Add penalty for using hint
    setHintPenalty(10);
    setHintsUsed(hintsUsed + 1);
  };
  
  // Skip current word
  const handleSkipWord = () => {
    // Stop timer
    if (timerRef.current) clearInterval(timerRef.current);
    
    // Mark as incorrect with no response
    const updatedPairs = [...wordPairs];
    updatedPairs[currentPairIndex] = {
      ...updatedPairs[currentPairIndex],
      userResponse: "SKIPPED",
      correct: false,
      responseTime: (Date.now() - (startTime || Date.now()))
    };
    
    setWordPairs(updatedPairs);
    moveToNextWord();
  };
  
  // Finish the game and calculate metrics
  const finishGame = () => {
    const endTime = Date.now();
    setGameEndTime(endTime);
    
    if (gameStartTime) {
      const totalTime = (endTime - gameStartTime) / 1000; // in seconds
      
      // Calculate metrics
      const correctAnswers = wordPairs.filter(pair => pair.correct).length;
      const totalAnswers = wordPairs.length;
      const accuracyRate = (correctAnswers / totalAnswers) * 100;
      
      // Average response time for correct answers
      const correctResponseTimes = wordPairs
        .filter(pair => pair.correct)
        .map(pair => pair.responseTime);
      
      const avgResponseTime = correctResponseTimes.length > 0
        ? correctResponseTimes.reduce((sum, time) => sum + time, 0) / correctResponseTimes.length
        : 0;
      
      // Verbal processing speed (lower time is better)
      const verbalProcessingSpeed = Math.max(0, 100 - (avgResponseTime / 100));
      
      // Word association accuracy
      const wordAssociationAccuracy = accuracyRate;
      
      // Linguistic flexibility based on different categories of words answered correctly
      const categoryPrompts = {
        "common": ["peanut", "salt", "bread", "cup", "knife", "shoes", "pen", "lock", "needle", "hammer", "coffee", "sun", "day", "bow", "king"],
        "synonym": ["happy", "sad", "big", "small", "fast", "slow", "smart", "beautiful", "angry", "cold", "hot", "tired", "hungry", "rich", "begin"],
        "antonym": ["hot", "big", "tall", "happy", "light", "fast", "strong", "rich", "young", "clean", "easy", "wet", "full", "high", "loud"],
        "category": ["apple", "carrot", "dog", "chair", "piano", "hammer", "shirt", "car", "rose", "oak", "robin", "shark", "pencil", "gold", "baseball"],
        "analogy": ["sky : blue :: grass", "fish : swim :: bird", "hand : finger :: foot", "sheep : wool :: cow", "car : road :: boat"]
      };
      
      const categoriesCorrect = {
        common: 0,
        synonym: 0,
        antonym: 0,
        category: 0,
        analogy: 0
      };
      
      wordPairs.forEach(pair => {
        if (pair.correct) {
          if (categoryPrompts.common.includes(pair.prompt)) categoriesCorrect.common++;
          if (categoryPrompts.synonym.includes(pair.prompt)) categoriesCorrect.synonym++;
          if (categoryPrompts.antonym.includes(pair.prompt)) categoriesCorrect.antonym++;
          if (categoryPrompts.category.includes(pair.prompt)) categoriesCorrect.category++;
          if (categoryPrompts.analogy.some(prompt => pair.prompt.includes(prompt))) categoriesCorrect.analogy++;
        }
      });
      
      const categoriesCount = Object.values(categoriesCorrect).filter(count => count > 0).length;
      const maxCategories = difficulty === DifficultyLevel.Easy ? 2 : 
                          difficulty === DifficultyLevel.Medium ? 4 : 5;
      const linguisticFlexibility = (categoriesCount / maxCategories) * 100;
      
      // Vocabulary range based on difficulty and correct answers
      const vocabularyRange = (correctAnswers / totalAnswers) * 100 * (difficulty / 3);
      
      // Semantic comprehension (reduced by hint usage)
      const semanticComprehension = Math.max(0, accuracyRate - (hintsUsed * 5));
      
      const calculatedMetrics: VerboFlashMetrics = {
        totalTime,
        completionTime: totalTime,
        score,
        accuracy: accuracyRate,
        level: difficulty,
        verbalProcessingSpeed,
        wordAssociationAccuracy,
        linguisticFlexibility,
        vocabularyRange,
        semanticComprehension,
      };
      
      setMetrics(calculatedMetrics);
      
      // Save game results
      try {
        miniGameService.saveGameResultLocally('verbo-flash', calculatedMetrics, true);
       //  console.log('Game results saved locally');
      } catch (error) {
        console.error('Error saving game results:', error);
      }
      
      setGameState(GameState.Review);
    }
  };
  
  // Show final results
  const showResults = () => {
    setGameState(GameState.Results);
  };
  
  // Play again button handler
  const onPlayAgain = () => {
    setGameState(GameState.Start);
  };
  
  // Generate hint text
  const getHint = (target: string): string => {
    // Show first letter and number of remaining letters
    return `${target[0]}${'_'.repeat(target.length - 1)} (${target.length} letters)`;
  };
  
  // Get appropriate prompt display based on category
  const getPromptDisplay = (prompt: string): string => {
    // Check if it's an analogy
    if (prompt.includes(' : ') && prompt.includes(' :: ')) {
      return prompt + ' : ?';
    }
    return prompt;
  };
  
  // Render the game start screen
  const renderStartScreen = () => (
    <div className="flex flex-col items-center gap-10 p-6">
      <Card className="w-full max-w-md p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold mb-2">Verbo Flash</h2>
        <p className="text-gray-500 mb-6">
          Test your verbal processing speed! Respond with associated words as quickly as possible.
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
            <li>Type the word that is most closely associated with the prompt</li>
            <li>Respond as quickly as possible - faster answers get more points</li>
            <li>You can use hints, but they will reduce your score</li>
            <li>Different difficulties include more challenging word associations</li>
          </ul>
        </div>
      </Card>
      
      <Button size="lg" onClick={startGame} className="w-40">
        Start Game
      </Button>
    </div>
  );
  
  // Render the game play screen
  const renderPlayingScreen = () => {
    const currentPair = wordPairs[currentPairIndex];
    
    return (
      <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 space-y-6">
        <div className="w-full flex justify-between items-center">
          <div className="text-left">
            <p className="text-sm text-gray-500">Word</p>
            <p className="text-xl font-bold">{currentPairIndex + 1} / {totalWordPairs}</p>
          </div>
          <div className="text-center">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-500" />
              <span className="text-xl font-bold">{timeLeft}s</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500">Score</p>
            <p className="text-xl font-bold">{score}</p>
          </div>
        </div>
        
        <Card className="w-full p-6">
          <div className="flex flex-col items-center gap-8">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-1">Word Prompt:</p>
              <p className="text-3xl font-bold text-primary">{getPromptDisplay(currentPair.prompt)}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="w-full">
              <div className="flex flex-col gap-4">
                <input
                  ref={inputRef}
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  placeholder="Type your answer..."
                  className="p-4 border rounded-lg text-xl text-center"
                  autoFocus
                  autoComplete="off"
                />
                
                <div className="h-8 text-center">
                  {showHint && (
                    <p className="text-amber-600">Hint: {getHint(currentPair.target)}</p>
                  )}
                </div>
                
                <div className="flex justify-between gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleShowHint}
                    disabled={showHint}
                    className="flex-1"
                  >
                    Hint (-10 pts)
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                  >
                    Submit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkipWord}
                    className="flex-1"
                  >
                    Skip
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </Card>
        
        <Progress 
          value={(currentPairIndex / totalWordPairs) * 100} 
          className="w-full h-2" 
        />
      </div>
    );
  };
  
  // Render the review screen
  const renderReviewScreen = () => (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Review Your Answers</h2>
        <p className="text-gray-500">
          You answered {wordPairs.filter(pair => pair.correct).length} out of {wordPairs.length} correctly!
        </p>
      </div>
      
      <Card className="w-full p-4">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto p-2">
          {wordPairs.map((pair, index) => (
            <div 
              key={pair.id} 
              className={`p-3 rounded-lg ${
                pair.correct ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold">{index + 1}. {getPromptDisplay(pair.prompt)}</div>
                <div>
                  {pair.correct ? (
                    <Check className="w-5 h-5 text-green-500" />
                  ) : (
                    <X className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
              <div className="mt-2 flex justify-between">
                <div>
                  <span className="text-sm text-gray-500">Your answer: </span>
                  <span className={pair.correct ? 'text-green-600' : 'text-red-600'}>
                    {pair.userResponse || "No answer"}
                  </span>
                </div>
                {!pair.correct && (
                  <div>
                    <span className="text-sm text-gray-500">Correct: </span>
                    <span className="text-green-600">{pair.target}</span>
                  </div>
                )}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                Time: {(pair.responseTime / 1000).toFixed(2)}s
              </div>
            </div>
          ))}
        </div>
      </Card>
      
      <Button onClick={showResults}>
        See Final Results
      </Button>
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
            <div className="text-2xl font-semibold">{Math.round(metrics.accuracy)}%</div>
            <div className="text-xs text-gray-500">Accuracy</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-semibold">{hintsUsed}</div>
            <div className="text-xs text-gray-500">Hints Used</div>
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
          <MetricBar label="Verbal Processing Speed" value={metrics.verbalProcessingSpeed} />
          <MetricBar label="Word Association Accuracy" value={metrics.wordAssociationAccuracy} />
          <MetricBar label="Linguistic Flexibility" value={metrics.linguisticFlexibility} />
          <MetricBar label="Vocabulary Range" value={metrics.vocabularyRange} />
          <MetricBar label="Semantic Comprehension" value={metrics.semanticComprehension} />
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
    case GameState.Playing:
      return renderPlayingScreen();
    case GameState.Review:
      return renderReviewScreen();
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

export default VerboFlashPage;