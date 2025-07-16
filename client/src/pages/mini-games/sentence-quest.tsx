import React, { useState, useEffect } from 'react';
import MiniGameLayout from '@/components/mini-games/MiniGameLayout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Lightbulb, 
  Clock, 
  AlertCircle, 
  CheckCircle,
  ChevronRight,
  X, 
  RefreshCw,
  Sparkles
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import miniGameService from '@/services/MiniGameService';
import { SentenceQuestMetrics } from '@/components/mini-games/MiniGameTypes';

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
  Results
}

// Question types for language challenges
type QuestionType = 'fill-blank' | 'sentence-correction' | 'word-order' | 'context-match';

// Question interface
interface Question {
  id: number;
  type: QuestionType;
  text: string;
  context?: string;
  options?: string[];
  correctAnswer: string | string[];
  userAnswer?: string | string[];
  isCorrect?: boolean;
  category: string;
  difficulty: number; // 1-3
}

// Sample Tatoeba-style sentences and challenges
const careerSentences: Question[] = [
  // Fill in the blank questions
  {
    id: 1,
    type: 'fill-blank',
    text: "Software developers need strong ____ skills to solve complex problems.",
    options: ["analytical", "artistic", "athletic", "authoritative"],
    correctAnswer: "analytical",
    category: "Technology",
    difficulty: 1
  },
  {
    id: 2,
    type: 'fill-blank',
    text: "A ____ is responsible for examining patients, diagnosing illnesses, and prescribing medication.",
    options: ["nurse", "physician", "therapist", "technician"],
    correctAnswer: "physician",
    category: "Healthcare",
    difficulty: 1
  },
  {
    id: 3,
    type: 'fill-blank',
    text: "Marketing professionals must understand customer ____ in order to create effective campaigns.",
    options: ["psychology", "geography", "biology", "geology"],
    correctAnswer: "psychology",
    category: "Marketing",
    difficulty: 1
  },
  {
    id: 4,
    type: 'fill-blank',
    text: "Electricians must follow ____ codes to ensure the safety of electrical installations.",
    options: ["international", "ethical", "building", "fashion"],
    correctAnswer: "building",
    category: "Trades",
    difficulty: 1
  },
  {
    id: 5,
    type: 'fill-blank',
    text: "Financial analysts evaluate company ____ statements to make investment recommendations.",
    options: ["mission", "financial", "personal", "objective"],
    correctAnswer: "financial",
    category: "Finance",
    difficulty: 1
  },
  
  // Sentence correction questions
  {
    id: 6,
    type: 'sentence-correction',
    text: "The company hired three new engineer for the robotics department.",
    options: [
      "The company hired three new engineer for the robotics department.",
      "The company hired three new engineers for the robotics department.",
      "The company hired three new engineers the robotics department.",
      "The company hire three new engineers for the robotics department."
    ],
    correctAnswer: "The company hired three new engineers for the robotics department.",
    category: "Engineering",
    difficulty: 1
  },
  {
    id: 7,
    type: 'sentence-correction',
    text: "She have been working as a nurse for over fifteen years.",
    options: [
      "She have been working as a nurse for over fifteen years.",
      "She has been working as a nurse for over fifteen years.",
      "She has working as a nurse for over fifteen years.",
      "She have worked as a nurse for over fifteen years."
    ],
    correctAnswer: "She has been working as a nurse for over fifteen years.",
    category: "Healthcare",
    difficulty: 1
  },
  {
    id: 8,
    type: 'sentence-correction',
    text: "The carpenter build custom furniture for residential and commercial spaces.",
    options: [
      "The carpenter build custom furniture for residential and commercial spaces.",
      "The carpenter builds custom furniture for residential and commercial spaces.",
      "The carpenter building custom furniture for residential and commercial spaces.",
      "The carpenters builds custom furniture for residential and commercial spaces."
    ],
    correctAnswer: "The carpenter builds custom furniture for residential and commercial spaces.",
    category: "Trades",
    difficulty: 1
  },
  
  // Word order questions
  {
    id: 9,
    type: 'word-order',
    text: "designers | create | visual | content | for | various | media",
    correctAnswer: "designers create visual content for various media",
    category: "Creative",
    difficulty: 2
  },
  {
    id: 10,
    type: 'word-order',
    text: "architects | design | buildings | and | supervise | their | construction",
    correctAnswer: "architects design buildings and supervise their construction",
    category: "Architecture",
    difficulty: 2
  },
  {
    id: 11,
    type: 'word-order',
    text: "teachers | develop | lesson | plans | and | evaluate | student | progress",
    correctAnswer: "teachers develop lesson plans and evaluate student progress",
    category: "Education",
    difficulty: 2
  },
  
  // Context match questions
  {
    id: 12,
    type: 'context-match',
    text: "Which sentence best describes the role of a project manager?",
    options: [
      "They develop software applications using various programming languages.",
      "They oversee project timelines, resources, and team coordination to meet goals.",
      "They design visual elements for marketing campaigns and brand identities.",
      "They diagnose and treat patients with various medical conditions."
    ],
    correctAnswer: "They oversee project timelines, resources, and team coordination to meet goals.",
    category: "Management",
    difficulty: 2
  },
  {
    id: 13,
    type: 'context-match',
    text: "Which statement accurately reflects the work environment of a chef?",
    options: [
      "They typically work in quiet office settings with regular 9-5 hours.",
      "They primarily work outdoors in all weather conditions.",
      "They work in fast-paced kitchen environments with irregular hours including evenings and weekends.",
      "They spend most of their time traveling between different client locations."
    ],
    correctAnswer: "They work in fast-paced kitchen environments with irregular hours including evenings and weekends.",
    category: "Culinary",
    difficulty: 2
  },
  {
    id: 14,
    type: 'context-match',
    text: "Which sentence correctly describes a skill needed for success as an electrician?",
    options: [
      "The ability to create detailed 3D renderings of building plans.",
      "Strong public speaking skills and comfort with large audiences.",
      "Knowledge of electrical systems and ability to read technical diagrams.",
      "Expertise in financial modeling and market analysis."
    ],
    correctAnswer: "Knowledge of electrical systems and ability to read technical diagrams.",
    category: "Trades",
    difficulty: 2
  },
  
  // More challenging questions
  {
    id: 15,
    type: 'fill-blank',
    text: "Civil engineers must consider environmental ____ when designing infrastructure projects to ensure sustainability.",
    options: ["impacts", "policies", "sciences", "resources"],
    correctAnswer: "impacts",
    category: "Engineering",
    difficulty: 3
  },
  {
    id: 16,
    type: 'sentence-correction',
    text: "The research team have collected data from over thousand participants in they study on workplace satisfaction.",
    options: [
      "The research team have collected data from over thousand participants in they study on workplace satisfaction.",
      "The research team has collected data from over thousand participants in their study on workplace satisfaction.",
      "The research team has collected data from over a thousand participants in their study on workplace satisfaction.",
      "The research team have collected data from over a thousand participants in their study on workplace satisfaction."
    ],
    correctAnswer: "The research team has collected data from over a thousand participants in their study on workplace satisfaction.",
    category: "Research",
    difficulty: 3
  },
  {
    id: 17,
    type: 'word-order',
    text: "data | analysts | interpret | complex | datasets | to | inform | business | decisions",
    correctAnswer: "data analysts interpret complex datasets to inform business decisions",
    category: "Technology",
    difficulty: 3
  },
  {
    id: 18,
    type: 'context-match',
    text: "Which statement accurately reflects the ethical considerations of a journalist?",
    options: [
      "Prioritizing speed of reporting over factual accuracy to beat competitors.",
      "Maintaining objectivity while reporting facts accurately and verifying sources.",
      "Focusing primarily on stories that will generate the most revenue.",
      "Avoiding controversial topics that might challenge readers' existing beliefs."
    ],
    correctAnswer: "Maintaining objectivity while reporting facts accurately and verifying sources.",
    category: "Journalism",
    difficulty: 3
  }
];

const SentenceQuestPage: React.FC = () => {
  console.log('Sentence Quest game mounted');
  
  return (
    <MiniGameLayout
      gameId="sentence-quest"
      title="Sentence Quest"
      description="Master language skills with contextual sentence challenges"
      icon={<Lightbulb className="w-6 h-6 text-white" />}
      themeColor="bg-gradient-to-r from-green-600 to-emerald-500"
      showExitConfirmation={true}
    >
      <SentenceQuestGame />
    </MiniGameLayout>
  );
};

// Component for metrics visualizations
const MetricBar: React.FC<{ label: string; value: number }> = ({ label, value }) => {
  const roundedValue = Math.round(value);
  
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-sm">
        <span>{label}</span>
        <span>{roundedValue}%</span>
      </div>
      <Progress value={roundedValue} className="h-2" />
    </div>
  );
};

const SentenceQuestGame: React.FC = () => {
  // Game state
  const [gameState, setGameState] = useState<GameState>(GameState.Start);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>(DifficultyLevel.Easy);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [wordOrder, setWordOrder] = useState<string[]>([]);
  const [orderedSentence, setOrderedSentence] = useState<string>('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [questionStartTime, setQuestionStartTime] = useState<number | null>(null);
  const [responseTimeLog, setResponseTimeLog] = useState<number[]>([]);
  const [streak, setStreak] = useState(0);
  
  // Game metrics
  const [metrics, setMetrics] = useState<SentenceQuestMetrics>({
    totalTime: 0,
    completionTime: 0,
    score: 0,
    accuracy: 0,
    level: 0,
    contextualComprehension: 0,
    languageApplication: 0,
    sentenceFormulation: 0,
    grammarConsistency: 0,
    synonymRecognition: 0,
  });
  
  // Timer effect
  useEffect(() => {
    if (gameState === GameState.Playing && timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (gameState === GameState.Playing && timeLeft === 0) {
      // Time's up for this question, submit automatically
      handleSubmit();
    }
  }, [gameState, timeLeft]);
  
  // Start a new game
  const startGame = () => {
    // Filter and shuffle questions based on difficulty
    const filteredQuestions = careerSentences.filter(q => {
      if (difficulty === DifficultyLevel.Easy) return q.difficulty === 1;
      if (difficulty === DifficultyLevel.Medium) return q.difficulty <= 2;
      return true; // Hard difficulty includes all questions
    });
    
    // Limit number of questions based on difficulty
    const questionCount = difficulty === DifficultyLevel.Easy ? 5 : 
                        difficulty === DifficultyLevel.Medium ? 8 : 10;
    
    const shuffledQuestions = [...filteredQuestions]
      .sort(() => Math.random() - 0.5)
      .slice(0, questionCount);
    
    setQuestions(shuffledQuestions);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setWordOrder([]);
    setOrderedSentence('');
    setIsSubmitted(false);
    setScore(0);
    setStreak(0);
    setResponseTimeLog([]);
    
    // Set time limit based on difficulty
    const timeLimit = difficulty === DifficultyLevel.Easy ? 30 : 
                    difficulty === DifficultyLevel.Medium ? 25 : 20;
    setTimeLeft(timeLimit);
    
    setGameState(GameState.Playing);
    setGameStartTime(Date.now());
    setQuestionStartTime(Date.now());
  };
  
  // Handle answer selection for multiple choice questions
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
  };
  
  // Handle word selection for word order questions
  const handleWordSelect = (word: string) => {
    if (wordOrder.includes(word)) {
      // Remove word if already selected
      setWordOrder(wordOrder.filter(w => w !== word));
    } else {
      // Add word to the ordered sentence
      setWordOrder([...wordOrder, word]);
    }
  };
  
  useEffect(() => {
    // Update the ordered sentence when word order changes
    setOrderedSentence(wordOrder.join(' '));
  }, [wordOrder]);
  
  // Handle question submission
  const handleSubmit = () => {
    if (isSubmitted) return;
    
    // Log response time
    if (questionStartTime) {
      const responseTime = (Date.now() - questionStartTime) / 1000;
      setResponseTimeLog([...responseTimeLog, responseTime]);
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    let isCorrect = false;
    let userAnswer = '';
    
    // Check answer based on question type
    switch (currentQuestion.type) {
      case 'fill-blank':
      case 'sentence-correction':
      case 'context-match':
        isCorrect = selectedAnswer === currentQuestion.correctAnswer;
        userAnswer = selectedAnswer;
        break;
      case 'word-order':
        isCorrect = orderedSentence.trim() === currentQuestion.correctAnswer;
        userAnswer = orderedSentence;
        break;
    }
    
    // Update question with user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentQuestionIndex] = {
      ...currentQuestion,
      userAnswer,
      isCorrect
    };
    
    setQuestions(updatedQuestions);
    
    // Update score and streak
    if (isCorrect) {
      const streakBonus = Math.min(streak, 3) * 5; // Max 15 points bonus
      const basePoints = difficulty * 20;
      const timeBonus = Math.round(timeLeft / 2);
      
      setScore(score + basePoints + streakBonus + timeBonus);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    setIsSubmitted(true);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        // Move to next question
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer('');
        setWordOrder([]);
        setOrderedSentence('');
        setIsSubmitted(false);
        
        // Reset timer
        const timeLimit = difficulty === DifficultyLevel.Easy ? 30 : 
                        difficulty === DifficultyLevel.Medium ? 25 : 20;
        setTimeLeft(timeLimit);
        
        setQuestionStartTime(Date.now());
      } else {
        // Game complete
        finishGame();
      }
    }, 2000);
  };
  
  // Finish the game and calculate metrics
  const finishGame = () => {
    if (gameStartTime) {
      const totalTime = (Date.now() - gameStartTime) / 1000; // in seconds
      
      // Calculate accuracy
      const correctAnswers = questions.filter(q => q.isCorrect).length;
      const accuracy = (correctAnswers / questions.length) * 100;
      
      // Calculate average response time
      const averageResponseTime = responseTimeLog.length > 0 ?
        responseTimeLog.reduce((sum, time) => sum + time, 0) / responseTimeLog.length : 0;
      
      // Calculate metrics for each question type
      const fillBlankQuestions = questions.filter(q => q.type === 'fill-blank');
      const correctionQuestions = questions.filter(q => q.type === 'sentence-correction');
      const orderQuestions = questions.filter(q => q.type === 'word-order');
      const contextQuestions = questions.filter(q => q.type === 'context-match');
      
      // Calculate success rates for each type
      const fillBlankRate = fillBlankQuestions.length > 0 ?
        fillBlankQuestions.filter(q => q.isCorrect).length / fillBlankQuestions.length : 0;
      
      const correctionRate = correctionQuestions.length > 0 ?
        correctionQuestions.filter(q => q.isCorrect).length / correctionQuestions.length : 0;
      
      const orderRate = orderQuestions.length > 0 ?
        orderQuestions.filter(q => q.isCorrect).length / orderQuestions.length : 0;
      
      const contextRate = contextQuestions.length > 0 ?
        contextQuestions.filter(q => q.isCorrect).length / contextQuestions.length : 0;
      
      // Calculate metrics
      const contextualComprehension = Math.min(100, contextRate * 100 + (orderRate * 40));
      const languageApplication = Math.min(100, (fillBlankRate * 50) + (correctionRate * 50));
      const sentenceFormulation = Math.min(100, orderRate * 100 + (contextRate * 30));
      const grammarConsistency = Math.min(100, correctionRate * 100 + (fillBlankRate * 30));
      const synonymRecognition = Math.min(100, fillBlankRate * 100 + (contextRate * 30));
      
      const calculatedMetrics: SentenceQuestMetrics = {
        totalTime,
        completionTime: totalTime,
        score,
        accuracy,
        level: difficulty,
        contextualComprehension,
        languageApplication,
        sentenceFormulation,
        grammarConsistency,
        synonymRecognition,
      };
      
      setMetrics(calculatedMetrics);
      
      // Save game results
      try {
        miniGameService.saveGameResultLocally('sentence-quest', calculatedMetrics, true);
        console.log('Game result for sentence-quest saved locally');
      } catch (error) {
        console.error('Error saving game results:', error);
      }
      
      setGameState(GameState.Results);
    }
  };
  
  // Play again button handler
  const onPlayAgain = () => {
    setGameState(GameState.Start);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswer('');
    setWordOrder([]);
    setIsSubmitted(false);
    setScore(0);
  };
  
  // Render different question types
  const renderQuestion = () => {
    if (questions.length === 0) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    
    switch (currentQuestion.type) {
      case 'fill-blank':
        return renderFillBlankQuestion(currentQuestion);
      case 'sentence-correction':
        return renderCorrectionQuestion(currentQuestion);
      case 'word-order':
        return renderWordOrderQuestion(currentQuestion);
      case 'context-match':
        return renderContextMatchQuestion(currentQuestion);
      default:
        return null;
    }
  };
  
  // Render fill in the blank question
  const renderFillBlankQuestion = (question: Question) => {
    const parts = question.text.split('____');
    
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <Badge variant="outline" className="mb-2">{question.category}</Badge>
          <p className="text-lg font-medium">
            {parts[0]}
            <span className={`font-bold px-1 ${isSubmitted ? (question.isCorrect ? 'text-green-500' : 'text-red-500') : 'text-gray-400'}`}>
              {isSubmitted ? (question.userAnswer as string || '____') : '____'}
            </span>
            {parts[1]}
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {question.options?.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`
                text-left py-3 px-4
                ${isSubmitted && option === question.correctAnswer ? 'border-green-500 bg-green-50 text-green-700' : ''}
                ${isSubmitted && option === selectedAnswer && option !== question.correctAnswer ? 'border-red-500 bg-red-50 text-red-700' : ''}
              `}
              onClick={() => !isSubmitted && handleAnswerSelect(option)}
              disabled={isSubmitted}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  
  // Render sentence correction question
  const renderCorrectionQuestion = (question: Question) => {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <Badge variant="outline" className="mb-2">{question.category}</Badge>
          <p className="text-lg font-medium mb-2">Choose the correct sentence:</p>
          <p className="text-base italic text-gray-500">{question.text}</p>
        </div>
        
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`
                w-full text-left py-3 px-4 h-auto
                ${isSubmitted && option === question.correctAnswer ? 'border-green-500 bg-green-50 text-green-700' : ''}
                ${isSubmitted && option === selectedAnswer && option !== question.correctAnswer ? 'border-red-500 bg-red-50 text-red-700' : ''}
              `}
              onClick={() => !isSubmitted && handleAnswerSelect(option)}
              disabled={isSubmitted}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  
  // Render word order question
  const renderWordOrderQuestion = (question: Question) => {
    const words = question.text.split(' | ');
    
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <Badge variant="outline" className="mb-2">{question.category}</Badge>
          <p className="text-lg font-medium mb-4">Arrange the words to form a correct sentence:</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {words.map((word, index) => (
              <Button
                key={index}
                variant={wordOrder.includes(word) ? "default" : "outline"}
                size="sm"
                className={`
                  ${wordOrder.includes(word) ? 'opacity-50' : ''}
                  ${isSubmitted ? 'cursor-not-allowed' : 'cursor-pointer'}
                `}
                onClick={() => !isSubmitted && handleWordSelect(word)}
                disabled={isSubmitted}
              >
                {word}
              </Button>
            ))}
          </div>
          
          <div className="border rounded-lg p-3 min-h-[60px] bg-gray-50">
            <p className={`
              ${isSubmitted && !questions[currentQuestionIndex].isCorrect ? 'text-red-500' : ''}
              ${isSubmitted && questions[currentQuestionIndex].isCorrect ? 'text-green-600' : ''}
              font-medium
            `}>
              {orderedSentence || '...'}
            </p>
          </div>
          
          {isSubmitted && !questions[currentQuestionIndex].isCorrect && (
            <div className="mt-3 text-sm text-green-600">
              <p className="font-semibold">Correct sentence:</p>
              <p>{question.correctAnswer}</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => !isSubmitted && setWordOrder([])}
            disabled={isSubmitted || wordOrder.length === 0}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
          
          <Button
            onClick={() => !isSubmitted && handleSubmit()}
            disabled={isSubmitted || wordOrder.length === 0}
            className="flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Submit
          </Button>
        </div>
      </div>
    );
  };
  
  // Render context match question
  const renderContextMatchQuestion = (question: Question) => {
    return (
      <div className="space-y-4">
        <div className="bg-white p-4 rounded-lg">
          <Badge variant="outline" className="mb-2">{question.category}</Badge>
          <p className="text-lg font-medium mb-3">{question.text}</p>
        </div>
        
        <div className="space-y-2">
          {question.options?.map((option, index) => (
            <Button
              key={index}
              variant={selectedAnswer === option ? "default" : "outline"}
              className={`
                w-full text-left py-3 px-4 h-auto
                ${isSubmitted && option === question.correctAnswer ? 'border-green-500 bg-green-50 text-green-700' : ''}
                ${isSubmitted && option === selectedAnswer && option !== question.correctAnswer ? 'border-red-500 bg-red-50 text-red-700' : ''}
              `}
              onClick={() => !isSubmitted && handleAnswerSelect(option)}
              disabled={isSubmitted}
            >
              {option}
            </Button>
          ))}
        </div>
      </div>
    );
  };
  
  // Render the game start screen
  const renderStartScreen = () => (
    <div className="flex flex-col items-center gap-10 p-6">
      <Card className="w-full max-w-md p-6 text-center space-y-4">
        <h2 className="text-2xl font-bold mb-2">Sentence Quest</h2>
        <p className="text-gray-500 mb-6">
          Master language skills by completing various sentence challenges. Test your grammar, 
          vocabulary, and contextual understanding with this Tatoeba-inspired game.
        </p>
        
        <div className="space-y-4">
          <h3 className="font-semibold">Select Difficulty:</h3>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button 
              variant={difficulty === DifficultyLevel.Easy ? "default" : "outline"}
              onClick={() => setDifficulty(DifficultyLevel.Easy)}
              className="flex-1"
            >
              Easy (5 questions)
            </Button>
            <Button 
              variant={difficulty === DifficultyLevel.Medium ? "default" : "outline"}
              onClick={() => setDifficulty(DifficultyLevel.Medium)}
              className="flex-1"
            >
              Medium (8 questions)
            </Button>
            <Button 
              variant={difficulty === DifficultyLevel.Hard ? "default" : "outline"}
              onClick={() => setDifficulty(DifficultyLevel.Hard)}
              className="flex-1"
            >
              Hard (10 questions)
            </Button>
          </div>
        </div>
      </Card>
      
      <Button size="lg" onClick={startGame} className="w-40">
        Start Game
      </Button>
    </div>
  );
  
  // Render the game play screen
  const renderGameScreen = () => (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 space-y-6">
      <div className="w-full flex justify-between items-center">
        <div className="text-left">
          <p className="text-sm text-gray-500">Question</p>
          <p className="text-xl font-bold">{currentQuestionIndex + 1} / {questions.length}</p>
        </div>
        <div className="text-center flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-500" />
          <span className={`font-medium ${timeLeft < 10 ? 'text-red-500' : ''}`}>
            {timeLeft}s
          </span>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Score</p>
          <p className="text-xl font-bold">{score}</p>
        </div>
      </div>
      
      {/* Streak indicator */}
      {streak > 0 && (
        <div className="flex items-center gap-2 text-amber-500">
          <Sparkles className="h-4 w-4" />
          <span className="font-medium text-sm">Streak: {streak}</span>
        </div>
      )}
      
      {/* Question content */}
      {renderQuestion()}
      
      {/* Submit button for multiple choice questions */}
      {questions[currentQuestionIndex]?.type !== 'word-order' && (
        <Button
          onClick={handleSubmit}
          disabled={isSubmitted || selectedAnswer === ''}
          className="w-full md:w-auto px-8"
        >
          {isSubmitted ? (
            questions[currentQuestionIndex].isCorrect ? (
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Correct!
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Incorrect
              </span>
            )
          ) : (
            <span className="flex items-center gap-2">
              <ChevronRight className="h-4 w-4" />
              Submit
            </span>
          )}
        </Button>
      )}
      
      <div className="w-full">
        <div className="flex justify-between mb-2">
          <span>Progress:</span>
          <span>{currentQuestionIndex + 1} / {questions.length}</span>
        </div>
        <Progress value={((currentQuestionIndex + 1) / questions.length) * 100} className="h-2" />
      </div>
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
            <div className="text-2xl font-semibold">{questions.length}</div>
            <div className="text-xs text-gray-500">Questions</div>
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
          <MetricBar label="Contextual Comprehension" value={metrics.contextualComprehension} />
          <MetricBar label="Language Application" value={metrics.languageApplication} />
          <MetricBar label="Sentence Formulation" value={metrics.sentenceFormulation} />
          <MetricBar label="Grammar Consistency" value={metrics.grammarConsistency} />
          <MetricBar label="Synonym Recognition" value={metrics.synonymRecognition} />
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
              console.log(`Game completed, continuing to next sector from ${sector}`);
              // Convert to number, increment, and store as the current sector
              const sectorNum = parseInt(sector);
              // Continue to the next sector
              const nextSector = sectorNum + 1;
              localStorage.setItem('currentSector', nextSector.toString());
              
              // Navigate to the quiz to continue to the next section
              console.log(`Moving to sector ${nextSector}`);
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
      return renderGameScreen();
    case GameState.Results:
      return renderResultsScreen();
    default:
      return null;
  }
};

export default SentenceQuestPage;