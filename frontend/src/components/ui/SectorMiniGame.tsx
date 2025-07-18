import { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { FiTarget, FiClock, FiZap, FiBook } from 'react-icons/fi';
import { BsLightbulb } from 'react-icons/bs';
import confetti from 'canvas-confetti';

interface SectorMiniGameProps {
  currentSector: number;
  onComplete: (points: number) => void;
}

export function SectorMiniGame({ currentSector, onComplete }: SectorMiniGameProps) {
  const [gameTitle, setGameTitle] = useState<string>("");
  
  useEffect(() => {
    switch(currentSector) {
      case 1:
        setGameTitle("Bubble Pop Challenge");
        break;
      case 2:
        setGameTitle("Memory Match");
        break;
      case 3:
        setGameTitle("Quick Reaction");
        break;
      case 4:
        setGameTitle("Word Scramble");
        break;
      default:
        setGameTitle("Mini Game");
    }
  }, [currentSector]);
  
  // Render the appropriate mini-game based on current sector
  const renderGame = () => {
    switch(currentSector) {
      case 1:
        return <BubblePopGame onComplete={onComplete} />;
      case 2:
        return <MemoryMatchGame onComplete={onComplete} />;
      case 3:
        return <QuickReactionGame onComplete={onComplete} />;
      case 4:
        return <WordScrambleGame onComplete={onComplete} />;
      default:
        return <BubblePopGame onComplete={onComplete} />;
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full overflow-hidden">
      <div className="bg-gradient-to-r from-primary to-secondary p-4 text-white">
        <h2 className="text-xl font-bold text-center">{gameTitle}</h2>
        <p className="text-center text-white/80 text-sm">Complete the mini-game to earn bonus points!</p>
      </div>
      <div className="p-6">
        {renderGame()}
      </div>
    </div>
  );
}

// MINI-GAME 1: BUBBLE POP GAME
function BubblePopGame({ onComplete }: { onComplete: (points: number) => void }) {
  const [bubbles, setBubbles] = useState<{id: number, x: number, y: number, size: number, popped: boolean}[]>([]);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const gameContainerRef = useRef<HTMLDivElement>(null);
  
  // Start game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(20);
    generateBubbles();
  };
  
  // Generate random bubbles
  const generateBubbles = () => {
    const newBubbles = [];
    const numBubbles = 10;
    
    for (let i = 0; i < numBubbles; i++) {
      newBubbles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 30 + Math.random() * 30,
        popped: false
      });
    }
    
    setBubbles(newBubbles);
  };
  
  // Pop a bubble
  const popBubble = (id: number) => {
    if (gameOver) return;
    
    setBubbles(bubbles.map(bubble => 
      bubble.id === id ? { ...bubble, popped: true } : bubble
    ));
    
    setScore(score + 1);
    
    // Generate new bubbles if all are popped
    if (bubbles.filter(b => !b.popped).length === 1) {
      generateBubbles();
    }
    
    // Create confetti burst at click
    if (gameContainerRef.current) {
      const rect = gameContainerRef.current.getBoundingClientRect();
      const bubble = bubbles.find(b => b.id === id);
      
      if (bubble) {
        const x = bubble.x / 100;
        const y = bubble.y / 100;
        
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { 
            x: (rect.left + (rect.width * x)) / window.innerWidth,
            y: (rect.top + (rect.height * y)) / window.innerHeight
          }
        });
      }
    }
  };
  
  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);
  
  // Calculate points based on score
  const calculatePoints = () => {
    return Math.min(Math.round((score / 30) * 100), 100);
  };
  
  return (
    <div className="flex flex-col items-center">
      {!gameStarted ? (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
            <FiTarget className="w-10 h-10 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Bubble Pop Challenge</h3>
          <p className="text-gray-600 mb-6">Pop as many bubbles as you can in 20 seconds!</p>
          <Button onClick={startGame} className="bg-primary text-white">Start Game</Button>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-between items-center mb-4">
            <div className="bg-blue-100 rounded-full px-3 py-1">
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className={`rounded-full px-3 py-1 ${timeLeft < 5 ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
              <span className="font-semibold">Time: {timeLeft}s</span>
            </div>
          </div>
          
          <div 
            ref={gameContainerRef}
            className="w-full h-80 bg-gradient-to-b from-blue-50 to-indigo-100 rounded-xl relative overflow-hidden border-2 border-blue-200"
          >
            {bubbles.map(bubble => !bubble.popped && (
              <button
                key={bubble.id}
                onClick={() => popBubble(bubble.id)}
                className="absolute rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 shadow-md transform hover:scale-110 transition-transform cursor-pointer"
                style={{
                  left: `${bubble.x}%`,
                  top: `${bubble.y}%`,
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  transform: 'translate(-50%, -50%)'
                }}
              ></button>
            ))}
            
            {gameOver && (
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4">
                <h3 className="text-xl font-bold mb-2">Time's Up!</h3>
                <p className="mb-4">You popped {score} bubbles</p>
                <p className="text-xl font-bold mb-6">+{calculatePoints()} Points</p>
                <Button 
                  onClick={() => onComplete(calculatePoints())}
                  className="bg-white text-primary"
                >
                  Continue
                </Button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// MINI-GAME 2: MEMORY MATCH GAME
function MemoryMatchGame({ onComplete }: { onComplete: (points: number) => void }) {
  const [cards, setCards] = useState<{id: number, value: number, flipped: boolean, matched: boolean}[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  
  // Generate cards for memory game
  const generateCards = () => {
    const values = [1, 2, 3, 4, 5, 6, 7, 8];
    const allValues = [...values, ...values]; // Each value appears twice
    
    // Shuffle the array
    const shuffled = allValues.sort(() => Math.random() - 0.5);
    
    const newCards = shuffled.map((value, index) => ({
      id: index,
      value,
      flipped: false,
      matched: false
    }));
    
    setCards(newCards);
  };
  
  // Start game
  const startGame = () => {
    setGameStarted(true);
    setMoves(0);
    setFlippedCards([]);
    generateCards();
  };
  
  // Handle card click
  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards[id].flipped || cards[id].matched) return;
    
    // Flip the card
    setCards(cards.map(card => 
      card.id === id ? { ...card, flipped: true } : card
    ));
    
    setFlippedCards([...flippedCards, id]);
  };
  
  // Check for matches
  useEffect(() => {
    if (flippedCards.length !== 2) return;
    
    const [first, second] = flippedCards;
    setMoves(moves + 1);
    
    if (cards[first].value === cards[second].value) {
      // Match found
      setCards(cards.map(card => 
        card.id === first || card.id === second ? { ...card, matched: true } : card
      ));
      
      // Small confetti celebration
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { x: 0.5, y: 0.5 }
      });
      
      // Reset flipped cards
      setFlippedCards([]);
      
      // Check if game is over
      const allMatched = cards.every(card => card.matched || (card.id === first || card.id === second));
      if (allMatched) {
        setGameOver(true);
      }
    } else {
      // No match, flip back after delay
      setTimeout(() => {
        setCards(cards.map(card => 
          card.id === first || card.id === second ? { ...card, flipped: false } : card
        ));
        setFlippedCards([]);
      }, 1000);
    }
  }, [flippedCards, cards, moves]);
  
  // Calculate points based on moves
  const calculatePoints = () => {
    const basePoints = 100;
    const penalty = moves * 5;
    return Math.max(basePoints - penalty, 10);
  };
  
  return (
    <div className="flex flex-col items-center">
      {!gameStarted ? (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-4">
            <BsLightbulb className="w-10 h-10 text-purple-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Memory Match</h3>
          <p className="text-gray-600 mb-6">Match all the pairs in as few moves as possible!</p>
          <Button onClick={startGame} className="bg-primary text-white">Start Game</Button>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-center items-center mb-4">
            <div className="bg-purple-100 rounded-full px-3 py-1">
              <span className="font-semibold">Moves: {moves}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-4 gap-2 w-full max-w-md">
            {cards.map(card => (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                className={`
                  aspect-square rounded-lg cursor-pointer transform transition-all duration-300
                  ${card.flipped || card.matched ? '[transform:rotateY(180deg)]' : ''}
                  ${card.matched ? 'bg-green-100 border border-green-300' : ''}
                `}
              >
                <div className="relative w-full h-full [transform-style:preserve-3d]">
                  {/* Card Back */}
                  <div 
                    className={`absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-md flex items-center justify-center text-white font-bold text-2xl [backface-visibility:hidden] ${
                      card.flipped || card.matched ? 'opacity-0' : 'opacity-100'
                    }`}
                  >
                    ?
                  </div>
                  
                  {/* Card Front */}
                  <div 
                    className={`absolute inset-0 bg-white rounded-lg shadow-md flex items-center justify-center font-bold text-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] ${
                      card.flipped || card.matched ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    {card.value === 1 && '🎮'}
                    {card.value === 2 && '🚀'}
                    {card.value === 3 && '🎨'}
                    {card.value === 4 && '🔍'}
                    {card.value === 5 && '💡'}
                    {card.value === 6 && '🎵'}
                    {card.value === 7 && '🌈'}
                    {card.value === 8 && '🎯'}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {gameOver && (
            <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 z-50">
              <h3 className="text-xl font-bold mb-2">Great Job!</h3>
              <p className="mb-4">You matched all pairs in {moves} moves</p>
              <p className="text-xl font-bold mb-6">+{calculatePoints()} Points</p>
              <Button 
                onClick={() => onComplete(calculatePoints())}
                className="bg-white text-primary"
              >
                Continue
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// MINI-GAME 3: QUICK REACTION GAME
function QuickReactionGame({ onComplete }: { onComplete: (points: number) => void }) {
  const [gameState, setGameState] = useState<'waiting' | 'ready' | 'click' | 'result'>('waiting');
  const [startTime, setStartTime] = useState<number>(0);
  const [reactionTime, setReactionTime] = useState<number | null>(null);
  const [countDown, setCountDown] = useState<number>(3);
  const [attempts, setAttempts] = useState<number[]>([]);
  const [cheated, setCheated] = useState<boolean>(false);
  const [timerRef, setTimerRef] = useState<NodeJS.Timeout | null>(null);
  
  // Start game
  const startGame = () => {
    setGameState('ready');
    setCountDown(3);
    setAttempts([]);
    
    // Count down from 3
    const intervalId = setInterval(() => {
      setCountDown(prev => {
        if (prev <= 1) {
          clearInterval(intervalId);
          setTimeout(showTarget, Math.random() * 3000 + 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };
  
  // Show the target to click
  const showTarget = () => {
    setGameState('click');
    setStartTime(Date.now());
    
    // Timeout for slow reaction
    const timer = setTimeout(() => {
      if (gameState === 'click') {
        setGameState('result');
        setReactionTime(null);
      }
    }, 2000);
    
    setTimerRef(timer);
  };
  
  // Handle click during game
  const handleClick = () => {
    if (gameState === 'ready') {
      // Clicked too early
      setCheated(true);
      setGameState('result');
      setReactionTime(null);
      if (timerRef) clearTimeout(timerRef);
      return;
    }
    
    if (gameState === 'click') {
      // Good click
      const clickTime = Date.now();
      const reaction = clickTime - startTime;
      setReactionTime(reaction);
      setAttempts([...attempts, reaction]);
      
      if (timerRef) clearTimeout(timerRef);
      
      if (attempts.length >= 2) {
        // End game after 3 attempts
        setGameState('result');
      } else {
        // Next round
        setGameState('ready');
        setCountDown(3);
        
        // Count down from 3
        const intervalId = setInterval(() => {
          setCountDown(prev => {
            if (prev <= 1) {
              clearInterval(intervalId);
              setTimeout(showTarget, Math.random() * 3000 + 1000);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    }
  };
  
  // Calculate points based on average reaction time
  const calculatePoints = () => {
    if (cheated) return 10;
    if (attempts.length === 0) return 25;
    
    const avgReaction = attempts.reduce((sum, time) => sum + time, 0) / attempts.length;
    
    // Faster reactions get more points
    if (avgReaction < 250) return 100;
    if (avgReaction < 350) return 85;
    if (avgReaction < 450) return 70;
    if (avgReaction < 550) return 55;
    return 40;
  };
  
  // Calculate average reaction time
  const getAverageReactionTime = () => {
    if (attempts.length === 0) return null;
    return Math.round(attempts.reduce((sum, time) => sum + time, 0) / attempts.length);
  };
  
  return (
    <div className="flex flex-col items-center">
      {gameState === 'waiting' ? (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
            <FiZap className="w-10 h-10 text-amber-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Quick Reaction Test</h3>
          <p className="text-gray-600 mb-6">Click as fast as you can when the screen turns green!</p>
          <Button onClick={startGame} className="bg-primary text-white">Start Game</Button>
        </div>
      ) : (
        <div className="w-full max-w-md">
          {gameState === 'ready' && (
            <div 
              className="w-full aspect-video bg-red-100 rounded-xl flex flex-col items-center justify-center cursor-pointer"
              onClick={handleClick}
            >
              <p className="text-red-500 font-bold text-xl mb-2">Wait...</p>
              {countDown > 0 && <p className="text-5xl font-bold text-gray-700">{countDown}</p>}
            </div>
          )}
          
          {gameState === 'click' && (
            <div 
              className="w-full aspect-video bg-green-400 rounded-xl flex items-center justify-center cursor-pointer animate-pulse hover:bg-green-300"
              onClick={handleClick}
            >
              <p className="text-white font-bold text-2xl">CLICK NOW!</p>
            </div>
          )}
          
          {reactionTime !== null && (
            <div className="mt-4 bg-gray-100 rounded-xl p-4 text-center">
              <p className="text-gray-700">Your reaction time:</p>
              <p className="text-2xl font-bold">
                {reactionTime}ms
                {reactionTime < 250 && ' 🔥 Lightning fast!'}
                {reactionTime >= 250 && reactionTime < 400 && ' ⚡ Great!'}
                {reactionTime >= 400 && ' 👍 Good!'}
              </p>
            </div>
          )}
          
          {gameState === 'result' && (
            <div className="mt-8 bg-white rounded-xl p-6 shadow-md text-center">
              <h3 className="text-xl font-bold mb-4">Results</h3>
              
              {cheated ? (
                <p className="text-lg mb-4 text-red-500">You clicked too early! 🙈</p>
              ) : attempts.length === 0 ? (
                <p className="text-lg mb-4">You didn't click in time! ⏰</p>
              ) : (
                <>
                  <p className="text-lg mb-2">Average reaction time:</p>
                  <p className="text-3xl font-bold mb-4">{getAverageReactionTime()}ms</p>
                </>
              )}
              
              <p className="text-xl font-bold mb-6 text-primary">+{calculatePoints()} Points</p>
              
              <Button 
                onClick={() => onComplete(calculatePoints())}
                className="bg-primary text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// MINI-GAME 4: WORD SCRAMBLE GAME
function WordScrambleGame({ onComplete }: { onComplete: (points: number) => void }) {
  const careerWords = [
    "CAREER", "SKILLS", "TALENT", "GROWTH", "LEADER", 
    "SUCCESS", "FUTURE", "GOALS", "ACHIEVE", "PASSION"
  ];
  
  const [currentWord, setCurrentWord] = useState<string>("");
  const [scrambledWord, setScrambledWord] = useState<string>("");
  const [playerInput, setPlayerInput] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [score, setScore] = useState<number>(0);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameOver, setGameOver] = useState<boolean>(false);
  const [result, setResult] = useState<'correct' | 'incorrect' | null>(null);
  
  // Start game
  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setTimeLeft(30);
    pickNewWord();
  };
  
  // Pick a random word and scramble it
  const pickNewWord = () => {
    const randomIndex = Math.floor(Math.random() * careerWords.length);
    const word = careerWords[randomIndex];
    setCurrentWord(word);
    setScrambledWord(scrambleWord(word));
    setPlayerInput("");
    setResult(null);
  };
  
  // Scramble a word
  const scrambleWord = (word: string) => {
    const letters = word.split('');
    let scrambled = '';
    
    // Ensure the scrambled word is different from the original
    do {
      scrambled = letters
        .sort(() => Math.random() - 0.5)
        .join('');
    } while (scrambled === word);
    
    return scrambled;
  };
  
  // Check player's answer
  const checkAnswer = () => {
    if (playerInput.toUpperCase() === currentWord) {
      // Correct answer
      setScore(score + 1);
      setResult('correct');
      
      // Celebrate with confetti
      confetti({
        particleCount: 50,
        spread: 70
      });
      
      // Move to next word after delay
      setTimeout(() => {
        pickNewWord();
      }, 1000);
    } else {
      // Incorrect answer
      setResult('incorrect');
      // Show correct answer briefly
      setTimeout(() => {
        pickNewWord();
      }, 1500);
    }
  };
  
  // Game timer
  useEffect(() => {
    if (!gameStarted || gameOver) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          setGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, gameOver]);
  
  // Calculate points based on score
  const calculatePoints = () => {
    return score * 20;
  };
  
  return (
    <div className="flex flex-col items-center">
      {!gameStarted ? (
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <FiClock className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Word Scramble</h3>
          <p className="text-gray-600 mb-6">Unscramble as many career-related words as you can in 30 seconds!</p>
          <Button onClick={startGame} className="bg-primary text-white">Start Game</Button>
        </div>
      ) : (
        <>
          <div className="w-full flex justify-between items-center mb-4">
            <div className="bg-indigo-100 rounded-full px-3 py-1">
              <span className="font-semibold">Score: {score}</span>
            </div>
            <div className={`rounded-full px-3 py-1 ${timeLeft < 10 ? 'bg-red-100 animate-pulse' : 'bg-gray-100'}`}>
              <span className="font-semibold">Time: {timeLeft}s</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md text-center">
            <div className="mb-6">
              <h3 className="text-sm text-gray-500 mb-1">Unscramble this career word:</h3>
              <div className="text-3xl font-bold tracking-wider bg-gradient-to-r from-primary to-secondary text-transparent bg-clip-text">
                {scrambledWord}
              </div>
            </div>
            
            <div className="mb-6">
              <input
                type="text"
                value={playerInput}
                onChange={(e) => setPlayerInput(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && checkAnswer()}
                placeholder="Type your answer"
                className={`w-full p-3 border-2 rounded-md text-center text-lg uppercase tracking-wider ${
                  result === 'correct' ? 'border-green-500 bg-green-50' :
                  result === 'incorrect' ? 'border-red-500 bg-red-50' :
                  'border-gray-300'
                }`}
                disabled={result !== null}
                autoFocus
              />
              
              {result === 'incorrect' && (
                <p className="text-red-500 mt-2">
                  Correct answer: {currentWord}
                </p>
              )}
            </div>
            
            <Button 
              onClick={checkAnswer}
              className="bg-primary text-white w-full"
              disabled={!playerInput || result !== null}
            >
              Check Answer
            </Button>
          </div>
          
          {gameOver && (
            <div className="fixed inset-0 bg-black/60 flex flex-col items-center justify-center text-white p-4 z-50">
              <h3 className="text-xl font-bold mb-2">Time's Up!</h3>
              <p className="mb-4">You unscrambled {score} words</p>
              <p className="text-xl font-bold mb-6">+{calculatePoints()} Points</p>
              <Button 
                onClick={() => onComplete(calculatePoints())}
                className="bg-white text-primary"
              >
                Continue
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}