import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ChevronRight,
  ArrowRight,
  Check,
  Trophy,
  Star,
} from "lucide-react";
import AvatarCustomizer from "@/components/AvatarCustomizer";
import SectorCompletionMessage from "@/components/quiz/SectorCompletionMessage";
import InterestQuizStage from "@/components/quiz/InterestQuizStage";
import confetti from "canvas-confetti";
import { useToast } from "@/hooks/use-toast";
import { quizQuestions, interestOptions } from "@/data/quizData";
import startImageSrc from "@assets/Start.png";
import gpsImageSrc from "@assets/GPS MILESTONES.png";
import { getQuizProgress, saveInterests, saveQuizProgress } from "@/lib/quiz-progress";
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useElevenLabsSpeech } from '@/hooks/useElevenLabsSpeech';
import { getStoredAuth } from '@/lib/authUtils';

type Question = {
  id: number | string;
  text: string;
  description?: string;
  options: {
    id: string;
    text: string;
    value: string | number | boolean;
  }[];
  sector?: number;
};

// Function to shuffle array (Fisher-Yates algorithm)
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Map the quiz questions from the data file to our format with randomized options
const questions: Question[] = quizQuestions.map((q, index) => {
  // Shuffle the options array to randomize answer positions
  const shuffledOptions = shuffleArray(q.options);

  return {
    id: q.id,
    text: q.text,
    options: shuffledOptions.map((opt, optIndex) => ({
      id: `option-${index}-${optIndex}`,
      text: opt.text,
      value: opt.value,
    })),
    sector: q.sector,
  };
});

// Add a special question for sector 5 (interests) that allows multiple selections
const sector5Question: Question = {
  id: "s5_interests",
  text: "Select your top 5 areas of interest",
  description: "Distribute 100% across your selections using the sliders",
  options: interestOptions.map((interest, idx) => ({
    id: `interest-${idx}`,
    text: interest.name,
    value: interest.id,
  })),
  sector: 5,
};

// If we don't have any sector 5 questions, add our interest selection question
if (!questions.some((q) => q.sector === 5)) {
  questions.push(sector5Question);
}

// The questions are now loaded from quizData.ts

const QuickQuizPage: React.FC = () => {
  const { toast } = useToast();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string | number, string | number | boolean>
  >({});
  const [selectedOption, setSelectedOption] = useState<
    string | number | boolean | null
  >(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [autoAdvancing, setAutoAdvancing] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [showAvatarCustomizer, setShowAvatarCustomizer] = useState(false);
  const [hasExistingAvatar, setHasExistingAvatar] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [completionTime, setCompletionTime] = useState<number>(0);
  // Initialize currentSector to 1 when starting a new quiz session
  const [currentSector, setCurrentSector] = useState<number>(1);

  // Load existing quiz progress on page load
  useEffect(() => {
    const loadQuizProgress = async () => {
      try {
        const progress = await getQuizProgress();
        console.log("Loading quiz progress:", progress);

        if (progress.hasProgress) {
          // Restore progress from backend
          setCurrentSector(progress.currentSector);
          setAnswers(progress.sectorResponses);
          localStorage.setItem(
            "currentSector",
            progress.currentSector.toString(),
          );

          // For sector transitions, always start from question index 0
          setCurrentQuestionIndex(0);

          // Ensure answers state is properly restored from progress
          const restoredAnswers: Record<
            string | number,
            string | number | boolean
          > = {};
          Object.entries(progress.sectorResponses).forEach(
            ([sectorKey, sectorAnswers]) => {
              Object.entries(sectorAnswers as Record<string, any>).forEach(
                ([questionKey, answer]) => {
                  restoredAnswers[questionKey] = answer;
                },
              );
            },
          );
          setAnswers(restoredAnswers);

          console.log(`Quiz resumed: sector ${progress.currentSector}`);
        } else {
          // Start fresh quiz
          setCurrentSector(1);
          localStorage.setItem("currentSector", "1");
        }

        // Get or create session ID
        const currentSession = localStorage.getItem("currentQuizSessionId");
        if (!currentSession) {
          const newSessionId = `quiz_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          localStorage.setItem("currentQuizSessionId", newSessionId);
          console.log("Created new quiz session:", newSessionId);
        } else {
          console.log("Using existing quiz session:", currentSession);
        }
      } catch (error) {
        console.error("Error loading quiz progress:", error);
        // Fallback to fresh start
        setCurrentSector(1);
        localStorage.setItem("currentSector", "1");
      }
    };

    loadQuizProgress();
  }, []);
  const [showSectorCompletionMessage, setShowSectorCompletionMessage] =
    useState(false);
  const [completedSectorNumber, setCompletedSectorNumber] = useState<number>(0);

  const [userName, setUserName] = useState<string>(() => {
    // Get the user's name from localStorage if available
    const savedName = localStorage.getItem("userName");
    return savedName || "Racer";
  });
  const [powerUps, setPowerUps] = useState<{
    skipQuestion: number;
    hint: number;
    timeFreeze: number;
    doublePoints: number;
  }>({
    skipQuestion: 1, // Skip a difficult question
    hint: 2, // Get a hint for a question
    timeFreeze: 1, // Pause the timer for this question
    doublePoints: 1, // Double points for the next question
  });

  // This useEffect previously checked if quiz was completed and redirected to results
  // We've removed it to allow retaking the quiz from the beginning
  useEffect(() => {
    // Reset any previously completed flag for the new session
    const sessionId = localStorage.getItem("currentQuizSessionId");
    if (sessionId) {
      // We'll keep the flag but only check it when we explicitly want to
      console.log("Starting or continuing quiz session:", sessionId);
    }
  }, []);

  // Get the user's name and create a user-specific quiz session ID
  useEffect(() => {
    // Get user data from cookies
    const authData = getStoredAuth();

    if (authData.userName) {
      setUserName(authData.userName);
    } else if (authData.email) {
      // Extract name from email (e.g., alainwin@gmail.com -> Alain)
      const namePart = authData.email.split("@")[0];
      const displayName =
        namePart.charAt(0).toUpperCase() +
        namePart.slice(1).replace(/[0-9]/g, "");
      setUserName(displayName);
    } else {
      setUserName("Alain");
    }
  }, []);

  // Mock leaderboard data - this would come from an API in a real app
  const leaderboard = [
    { name: userName, time: 165, position: 1, isUser: true }, // User is at #1 position
    { name: "MarcusW", time: 185, position: 2 },
    { name: "AlexR", time: 210, position: 3 },
    { name: "SamanthaK", time: 225, position: 4 },
    { name: "JessicaT", time: 230, position: 5 },
    { name: "DavidL", time: 240, position: 6 },
    { name: "ElenaM", time: 255, position: 7 },
    { name: "ChrisP", time: 270, position: 8 },
  ];

  // Function to get shuffled questions for the current sector
  const getCurrentSectorQuestions = () => {
    // Get questions for the current sector
    const sectorQuestions = questions.filter((q) => q.sector === currentSector);

    // Don't shuffle sector 5 (interests) as it's a special multi-select question
    if (currentSector === 5) {
      return sectorQuestions;
    }

    // Get cached shuffled questions if already generated for this session and sector
    const sessionId = localStorage.getItem("currentQuizSessionId") || "default";
    const cachedQuestionsKey = `${sessionId}_shuffled_questions_sector_${currentSector}`;
    const cachedQuestions = localStorage.getItem(cachedQuestionsKey);

    if (cachedQuestions) {
      try {
        return JSON.parse(cachedQuestions);
      } catch (e) {
        console.error("Error parsing cached questions:", e);
        // Continue to generate new shuffled questions if parsing fails
      }
    }

    // Create a shuffled copy of the sector questions
    const shuffledQuestions = [...sectorQuestions].sort(
      () => Math.random() - 0.5,
    );

    // Cache the shuffled questions for this session
    localStorage.setItem(cachedQuestionsKey, JSON.stringify(shuffledQuestions));

    return shuffledQuestions;
  };

  // Get shuffled questions for the current sector
  const currentSectorQuestions = getCurrentSectorQuestions();

  // Track question start time for measuring response time
  const [questionStartTime, setQuestionStartTime] = useState<number>(
    Date.now(),
  );

  // If we're at the start of a new sector, log it and reset
  useEffect(() => {
    console.log(
      "Moving to sector",
      currentSector,
      "with",
      currentSectorQuestions.length,
      "questions",
    );

    // Save the current sector to localStorage whenever it changes
    localStorage.setItem("currentSector", currentSector.toString());

    // Reset question index when changing sectors
    if (currentSectorQuestions.length > 0) {
      setCurrentQuestionIndex(0);
      // Set new question start time
      setQuestionStartTime(Date.now());
    }
  }, [currentSector, currentSectorQuestions.length]);

  const currentQuestion =
    currentSectorQuestions.length > 0
      ? currentSectorQuestions[currentQuestionIndex]
      : null;

  // Calculate progress across all sectors by summing up completed questions
  const sectorsCompleted = currentSector - 1; // Sectors fully completed

  // Count questions in completed sectors
  const completedSectorsQuestionsCount = questions.reduce((count, q) => {
    if (q.sector !== undefined && q.sector < currentSector) {
      return count + 1;
    }
    return count;
  }, 0);

  // Add current sector progress
  const completedQuestionsCount =
    completedSectorsQuestionsCount + currentQuestionIndex;

  // Calculate overall progress percentage
  const progress = (completedQuestionsCount / questions.length) * 100;

  // Check if user already has an avatar
  useEffect(() => {
    const savedAvatar = localStorage.getItem("userAvatar");
    if (savedAvatar) {
      setHasExistingAvatar(true);
    }
  }, []);

  // Auto-advance effect when an option is selected
  useEffect(() => {
    // Check if autoAdvancing is true and selectedOption is not null/undefined (handles boolean false values)
    if (
      autoAdvancing &&
      selectedOption !== null &&
      selectedOption !== undefined &&
      currentQuestion
    ) {
      console.log(
        "Auto-advancing effect triggered with option:",
        selectedOption,
        "type:",
        typeof selectedOption,
      );

      // Capture the current question at the time the effect runs
      const questionBeingAnswered = currentQuestion;

      const timer = setTimeout(() => {
        console.log("Auto-advance timer fired, calling handleNext()");
        handleNextWithQuestion(questionBeingAnswered);
        setAutoAdvancing(false);
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [autoAdvancing, selectedOption, currentQuestion]);

  // Function to award power-ups based on progress
  const awardPowerUps = (questionIndex: number) => {
    // Award power-ups at specific milestones (e.g., every 3 questions)
    if (questionIndex > 0 && questionIndex % 3 === 0) {
      // Determine which power-up to award based on progress
      if (questionIndex % 12 === 0) {
        // Award a skip question power-up every 12 questions
        setPowerUps((prev) => ({
          ...prev,
          skipQuestion: prev.skipQuestion + 1,
        }));
        toast({
          title: "Power-Up Unlocked!",
          description:
            "You earned a Skip Question power-up! Use it on difficult questions.",
          variant: "default",
        });
      } else if (questionIndex % 9 === 0) {
        // Award a double points power-up every 9 questions
        setPowerUps((prev) => ({
          ...prev,
          doublePoints: prev.doublePoints + 1,
        }));
        toast({
          title: "Power-Up Unlocked!",
          description:
            "You earned a Double Points power-up! Use it to maximize your score.",
          variant: "default",
        });
      } else if (questionIndex % 6 === 0) {
        // Award a time freeze power-up every 6 questions
        setPowerUps((prev) => ({
          ...prev,
          timeFreeze: prev.timeFreeze + 1,
        }));
        toast({
          title: "Power-Up Unlocked!",
          description:
            "You earned a Time Freeze power-up! Use it to stop the clock.",
          variant: "default",
        });
      } else {
        // Award a hint power-up every 3 questions
        setPowerUps((prev) => ({
          ...prev,
          hint: prev.hint + 1,
        }));
        toast({
          title: "Power-Up Unlocked!",
          description: "You earned a Hint power-up! Use it when you're stuck.",
          variant: "default",
        });
      }

      // Small celebration for earning a power-up
      confetti({
        particleCount: 30,
        spread: 50,
        origin: { y: 0.7 },
        colors: ["#10B981", "#4F46E5"],
      });
    }
  };

  // Interface for question timing data
  interface QuestionTimingData {
    questionId: string;
    responseTimeMs: number;
    sector: number;
    userEmail?: string;
    sessionId: string;
    timestamp: number;
  }

  // Record response time for the current question
  const recordQuestionResponseTime = () => {
    if (!currentQuestion) return;

    const endTime = Date.now();
    const responseTimeMs = endTime - questionStartTime;
    const sessionId = localStorage.getItem("currentQuizSessionId") || "default";
    const userEmail = localStorage.getItem("userEmail") || undefined;

    // Create timing data object
    const timingData: QuestionTimingData = {
      questionId: currentQuestion.id,
      responseTimeMs,
      sector: currentSector,
      userEmail,
      sessionId,
      timestamp: endTime,
    };

    console.log(
      `Question ${currentQuestion.id} took ${responseTimeMs}ms to answer`,
    );

    // Get existing timing data from localStorage
    const existingTimingDataJson = localStorage.getItem(
      `${sessionId}_question_timing_data`,
    );
    let existingTimingData: QuestionTimingData[] = [];

    if (existingTimingDataJson) {
      try {
        existingTimingData = JSON.parse(existingTimingDataJson);
      } catch (e) {
        console.error("Error parsing existing timing data:", e);
      }
    }

    // Add new timing data and save to localStorage
    existingTimingData.push(timingData);
    localStorage.setItem(
      `${sessionId}_question_timing_data`,
      JSON.stringify(existingTimingData),
    );

    // If user is logged in, send timing data to the server
    if (userEmail) {
      fetch("/api/activity/question-timing", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(timingData),
      }).catch((error) => {
        console.error("Error sending timing data to server:", error);
      });
    }

    // Reset the start time for the next question
    setQuestionStartTime(Date.now());
  };

  const handleNextWithQuestion = (questionToAnswer: typeof currentQuestion) => {
    // Use selectedOption !== null check instead of just selectedOption
    // to correctly handle 'false' boolean values which evaluate to false in a boolean context
    if (
      selectedOption !== null &&
      selectedOption !== undefined &&
      questionToAnswer
    ) {
      console.log(
        `Answering question: ${questionToAnswer.id} with value: ${selectedOption}`,
      );

      // Save the answer
      setAnswers((prev) => ({
        ...prev,
        [questionToAnswer.id]: selectedOption,
      }));

      // Save progress to backend incrementally (consolidated with timing)
      const sessionId =
        localStorage.getItem("currentQuizSessionId") || "default";
      const updatedAnswers = {
        ...answers,
        [questionToAnswer.id]: selectedOption,
      };

      // Prepare sector data for backend
      const sectorData: Record<string, any> = {};
      Object.entries(updatedAnswers).forEach(([questionId, answer]) => {
        if (questionId.startsWith(`s${currentSector}_`)) {
          const qNumber = questionId.replace(`s${currentSector}_`, "");
          sectorData[qNumber] = answer;
        }
      });

      console.log(
        `Saving progress for question: ${questionToAnswer.id} in sector ${currentSector}`,
      );
      // Single API call for both progress and timing
      saveQuizProgress(
        sessionId,
        currentSector,
        sectorData,
        questionToAnswer.id.toString(),
        selectedOption,
      );

      // Check if we're at the end of the current sector's questions
      const isEndOfSector =
        currentQuestionIndex + 1 >= currentSectorQuestions.length;

      if (isEndOfSector) {
        // Set the completed sector to show the completion message with key
        setCompletedSectorNumber(currentSector);
        setShowSectorCompletionMessage(true);

        // Increment to the next sector (1→2, 2→3, etc.)
        const nextSector = currentSector + 1;
        if (nextSector <= 5) {
          // Reset the question index and update the current sector when user closes dialog
          // This will be handled in the onClose callback of SectorCompletionMessage
          // Don't set quizCompleted to true here - this was causing redirect to results page
          // after finishing just the first section

          // Only show the sector completion message
          setShowSectorCompletionMessage(true);
        } else {
          // End of the last sector (end of quiz)
          const sessionId =
            localStorage.getItem("currentQuizSessionId") || "default";
          localStorage.setItem(
            `${sessionId}_quickQuizAnswers_complete`,
            "true",
          );
          // Set a flag to indicate the quiz is fully completed
          localStorage.setItem("quizFullyCompleted", "true");

          // Set next sector to 6 to indicate we're past all sectors
          localStorage.setItem("currentSector", "6");

          // For the final section, mark it as completed
          setQuizCompleted(true);

          // Show sector completion dialog for sector 5 first, then avatar customizer
          // After that, we'll show the quiz completion screen
          // The navigation will be handled in the onClose callback of SectorCompletionMessage
        }
      } else {
        // Just move to the next question within the same sector
        const nextIndex = currentQuestionIndex + 1;
        setCurrentQuestionIndex(nextIndex);
        setSelectedOption(null);
        setSelectedInterests([]); // Reset selected interests for new questions

        // Check if we should award power-ups based on progress
        awardPowerUps(nextIndex);
      }
    } else if (
      selectedOption !== null &&
      selectedOption !== undefined &&
      !currentQuestion
    ) {
      // Edge case: we have a selected option but no current question
      console.error(
        "Error: Attempted to proceed with no valid current question",
      );
      toast({
        title: "Navigation Error",
        description:
          "Unable to save your answer. Please try refreshing the page.",
        variant: "destructive",
      });
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && currentSectorQuestions.length > 0) {
      const prevIndex = currentQuestionIndex - 1;
      if (prevIndex >= 0) {
        setCurrentQuestionIndex(prevIndex);
        // Safely access the previous question within this sector
        const prevQuestion = currentSectorQuestions[prevIndex];
        if (prevQuestion && prevQuestion.id) {
          setSelectedOption(answers[prevQuestion.id] || null);
        } else {
          setSelectedOption(null);
        }
      }
    } else if (currentQuestionIndex === 0 && currentSector > 1) {
      // If at the first question of a sector and not in the first sector,
      // go back to the previous sector's last question
      const prevSector = currentSector - 1;
      const prevSectorQuestions = questions.filter(
        (q) => q.sector === prevSector,
      );

      if (prevSectorQuestions.length > 0) {
        setCurrentSector(prevSector);
        const lastQuestionIndex = prevSectorQuestions.length - 1;
        setCurrentQuestionIndex(lastQuestionIndex);

        const prevQuestion = prevSectorQuestions[lastQuestionIndex];
        if (prevQuestion && prevQuestion.id) {
          setSelectedOption(answers[prevQuestion.id] || null);
        } else {
          setSelectedOption(null);
        }
      }
    }
  };

  // Create a function to trigger confetti celebration
  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#4F46E5", "#10B981", "#F59E0B"],
    });
  };

  // Calculate user's position in leaderboard based on completion time
  const calculateLeaderboardPosition = (time: number) => {
    // Create a sorted array with user's time included
    const allTimes = leaderboard
      .filter((entry) => !entry.isUser)
      .map((entry) => entry.time)
      .concat(time)
      .sort((a, b) => a - b);

    // Find position of user's time (add 1 because array is 0-indexed)
    return allTimes.indexOf(time) + 1;
  };

  // Handler for avatar customization completion
  // Use location for navigation
  const [, setLocation] = useLocation();

  const handleAvatarComplete = () => {
    // Calculate completion time in seconds (rounded)
    const endTime = Date.now();
    const timeTaken = Math.round((endTime - startTime) / 1000);
    setCompletionTime(timeTaken);

    // Update user position in leaderboard
    const userPosition = calculateLeaderboardPosition(timeTaken);

    // Update leaderboard with user's data
    const updatedLeaderboard = leaderboard.map((entry) => {
      if (entry.isUser) {
        return { ...entry, time: timeTaken, position: userPosition };
      }
      return entry;
    });

    setShowAvatarCustomizer(false);
    setQuizCompleted(true);

    // Trigger confetti effect when quiz is completed
    setTimeout(() => {
      triggerConfetti();
    }, 500);

    // Set a flag to indicate quiz completion
    localStorage.setItem("quizCompleted", "true");
    localStorage.setItem("quizCompletedAt", new Date().toISOString());
  };

  const handleViewResults = () => {
    // Only navigate to results if all sections are completed
    const storedSector = parseInt(localStorage.getItem("currentSector") || "1");

    if (storedSector >= 5) {
      // If user has completed all 5 sectors, navigate to results
      setLocation("/results");
    } else {
      // If not all sections completed, show a toast message
      toast({
        title: "More Sections to Complete",
        description: `You're on section ${storedSector} of 5. Complete all sections to see your career results.`,
        variant: "default",
      });

      // Close any completion UI and continue with the quiz
      setQuizCompleted(false);
    }
  };

  // Handler for closing the sector completion message
  const handleSectorCompletionClose = () => {
    setShowSectorCompletionMessage(false);

    // Determine what to do next based on the completed sector
    if (completedSectorNumber < 5) {
      // Move to the next sector
      const nextSector = completedSectorNumber + 1;
      console.log(
        `Advancing from sector ${completedSectorNumber} to sector ${nextSector}`,
      );

      // Update localStorage to reflect the new sector
      localStorage.setItem("currentSector", nextSector.toString());

      // Reset state for the new sector
      setCurrentQuestionIndex(0);
      setCurrentSector(nextSector);
      setSelectedOption(null);
      setSelectedInterests([]); // Reset selected interests
      setAnswers({}); // Reset answers for the new sector

      // Reset question start time for timing tracking
      setQuestionStartTime(Date.now());
    } else {
      // We completed the final sector (sector 5)
      console.log("Completed all sectors, showing avatar customizer");
      setShowAvatarCustomizer(true);
    }
  };

  // Show the sector completion message dialog when a sector is completed
  if (showSectorCompletionMessage) {
    return (
      <SectorCompletionMessage
        sectorNumber={completedSectorNumber}
        open={showSectorCompletionMessage}
        onClose={handleSectorCompletionClose}
      />
    );
  }

  // Show avatar customizer after completing a section
  if (showAvatarCustomizer) {
    return (
      <div className="container mx-auto p-4 max-w-4xl min-h-screen pt-8">
        <AvatarCustomizer
          onComplete={handleAvatarComplete}
          sectionNumber={currentSector}
          hasExistingAvatar={hasExistingAvatar}
        />
      </div>
    );
  }

  // Render the completed screen
  if (quizCompleted) {
    return (
      <div className="container mx-auto p-4 max-w-4xl min-h-screen pt-8">
        <Card className="w-full overflow-hidden">
          <div className="relative">
            <img
              src="/attached_assets/Finish Line.png"
              alt="Finish line"
              className="w-full h-40 object-cover object-center opacity-60"
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-background to-transparent">
              <img
                src="/attached_assets/woman racer.png"
                alt="Woman racer"
                className="h-24 mb-4"
              />
              <h2 className="text-3xl font-bold text-primary shadow-sm">
                Checkpoint Reached!
              </h2>
            </div>
          </div>

          <CardHeader className="text-center pt-4">
            <CardTitle className="text-2xl md:text-3xl">
              {currentSector === 1
                ? "First Milestone Complete!"
                : currentSector === 2
                  ? "Second Milestone Complete!"
                  : currentSector === 3
                    ? "Third Milestone Complete!"
                    : currentSector === 4
                      ? "Fourth Milestone Complete!"
                      : "Final Milestone Complete!"}
            </CardTitle>
            <CardDescription className="text-lg">
              Great job! You've completed the{" "}
              {currentSector === 1
                ? "first"
                : currentSector === 2
                  ? "second"
                  : currentSector === 3
                    ? "third"
                    : currentSector === 4
                      ? "fourth"
                      : "final"}{" "}
              leg of your career discovery race
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-muted p-6 rounded-lg text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 via-primary to-purple-500"></div>
              <h3 className="text-2xl font-bold mb-2">
                {currentSector === 1
                  ? "Milestone 1: Work Style Preferences"
                  : currentSector === 2
                    ? "Milestone 2: Cognitive Strengths"
                    : currentSector === 3
                      ? "Milestone 3: Personality Traits"
                      : currentSector === 4
                        ? "Milestone 4: Motivation & Values"
                        : "Milestone 5: Interest Areas"}
              </h3>
              <p>
                You've crossed the{" "}
                {currentSector === 1
                  ? "first"
                  : currentSector === 2
                    ? "second"
                    : currentSector === 3
                      ? "third"
                      : currentSector === 4
                        ? "fourth"
                        : "final"}{" "}
                checkpoint in your 5-part career exploration journey!
              </p>

              <div className="mt-6 relative">
                <img
                  src="/attached_assets/GPS MILESTONES.png"
                  alt="Career journey milestones"
                  className="w-full rounded-lg shadow-md"
                />
                <div
                  className="absolute top-0 left-0 h-full bg-primary/20 rounded-l-lg"
                  style={{ width: `${currentSector * 20}%` }}
                ></div>
              </div>
            </div>

            {/* Achievement badges */}
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary mr-2" />
                <h3 className="text-lg font-semibold">
                  Achievements Unlocked!
                </h3>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-primary/20 transform transition-all hover:scale-105">
                  <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center mb-2">
                    <Check className="h-8 w-8 text-primary" />
                  </div>
                  <p className="font-medium text-sm">First Checkpoint</p>
                  <p className="text-xs text-muted-foreground">
                    Completed Section 1
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-primary/20 transform transition-all hover:scale-105">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-green-500"
                    >
                      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                      <path d="M16 12l-4 4l-2-2"></path>
                    </svg>
                  </div>
                  <p className="font-medium text-sm">Work Style Expert</p>
                  <p className="text-xs text-muted-foreground">
                    Discovered your preferences
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg shadow-sm text-center border border-primary/20 transform transition-all hover:scale-105">
                  <div className="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-8 w-8 text-blue-500"
                    >
                      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"></path>
                    </svg>
                  </div>
                  <p className="font-medium text-sm">Avatar Creator</p>
                  <p className="text-xs text-muted-foreground">
                    Personalized your racer
                  </p>
                </div>
              </div>
            </div>

            {/* Leaderboard */}
            <div className="p-6 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-6 w-6 text-yellow-500 mr-2"
                >
                  <rect width="18" height="7" x="3" y="3" rx="1"></rect>
                  <rect width="9" height="7" x="3" y="14" rx="1"></rect>
                  <rect width="5" height="7" x="16" y="14" rx="1"></rect>
                </svg>
                <h3 className="text-lg font-semibold">
                  Section {currentSector} Leaderboard
                </h3>
              </div>

              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="bg-muted/50">
                    <tr>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                        Position
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-left font-medium">
                        Racer
                      </th>
                      <th className="whitespace-nowrap px-4 py-3 text-right font-medium">
                        Time (sec)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {leaderboard
                      .sort((a, b) => a.time - b.time)
                      .slice(0, 5)
                      .map((entry, index) => (
                        <tr
                          key={entry.name}
                          className={
                            entry.isUser
                              ? "bg-duo-green-50 font-medium"
                              : "bg-white"
                          }
                        >
                          <td className="whitespace-nowrap px-4 py-3 text-left">
                            {index === 0 ? (
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center w-8 h-8 bg-yellow-100 border border-yellow-300 text-yellow-600 rounded-full mr-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-yellow-600"
                                  >
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                    <path d="M4 22h16"></path>
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                    <path d="M9 2v7"></path>
                                    <path d="M15 2v7"></path>
                                    <path d="M12 12a5 5 0 0 0 5-5V2H7v5a5 5 0 0 0 5 5Z"></path>
                                  </svg>
                                </span>
                                <span className="font-bold text-yellow-600">
                                  1
                                </span>
                              </div>
                            ) : index === 1 ? (
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center w-7 h-7 bg-slate-100 border border-slate-200 text-slate-500 rounded-full mr-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-slate-500"
                                  >
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                    <path d="M4 22h16"></path>
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                    <path d="M9 2v7"></path>
                                    <path d="M15 2v7"></path>
                                    <path d="M12 12a5 5 0 0 0 5-5V2H7v5a5 5 0 0 0 5 5Z"></path>
                                  </svg>
                                </span>
                                <span className="font-medium text-slate-600">
                                  2
                                </span>
                              </div>
                            ) : index === 2 ? (
                              <div className="flex items-center">
                                <span className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 border border-amber-200 text-amber-600 rounded-full mr-1">
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="18"
                                    height="18"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="text-amber-600"
                                  >
                                    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path>
                                    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path>
                                    <path d="M4 22h16"></path>
                                    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"></path>
                                    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"></path>
                                    <path d="M9 2v7"></path>
                                    <path d="M15 2v7"></path>
                                    <path d="M12 12a5 5 0 0 0 5-5V2H7v5a5 5 0 0 0 5 5Z"></path>
                                  </svg>
                                </span>
                                <span className="font-medium text-amber-600">
                                  3
                                </span>
                              </div>
                            ) : (
                              <span className="inline-flex items-center justify-center w-6 h-6 ml-1">
                                {index + 1}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-left">
                            {entry.name}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right">
                            {entry.time}s
                            {entry.isUser && (
                              <span className="ml-2 text-xs text-white rounded-full bg-duo-green-500 px-2 py-0.5">
                                Current User
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-3 text-xs text-center text-muted-foreground">
                Your completion time:{" "}
                <span className="font-semibold">{completionTime} seconds</span>{" "}
                • Race again to beat your time!
              </div>
            </div>

            {currentSector < 5 && (
              <div className="space-y-4">
                <h3 className="font-semibold">
                  {currentSector === 1
                    ? "Next Checkpoint: Cognitive Strengths"
                    : currentSector === 2
                      ? "Next Checkpoint: Personality Traits"
                      : currentSector === 3
                        ? "Next Checkpoint: Motivation & Values"
                        : "Next Checkpoint: Interest Areas"}
                </h3>
                <p className="text-muted-foreground">
                  {currentSector === 1
                    ? "The race continues! In the next section, you'll explore how your mind works best."
                    : currentSector === 2
                      ? "Get ready for the next leg! You'll explore the personality traits that make you unique."
                      : currentSector === 3
                        ? "Almost there! Next up, discover what truly motivates you in your career journey."
                        : "Final stretch ahead! In the last section, you'll identify your strongest interest areas."}{" "}
                  Each completed section brings you closer to discovering your
                  ideal career path.
                </p>
              </div>
            )}

            {currentSector === 5 && (
              <div className="space-y-4 bg-emerald-50 p-6 rounded-lg border border-emerald-200">
                <div className="flex items-center">
                  <Trophy className="h-6 w-6 text-emerald-500 mr-2" />
                  <h3 className="font-semibold text-emerald-700">
                    Congratulations! Full Assessment Completed
                  </h3>
                </div>
                <p className="text-emerald-600">
                  You've completed all five checkpoints in your career discovery
                  journey! Get ready to see your personalized career
                  recommendations.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between p-6">
            <Button variant="outline" onClick={() => setLocation("/dashboard")}>
              Back to Dashboard
            </Button>
            <Button
              className="bg-primary hover:bg-primary/90 text-white flex items-center gap-2"
              onClick={handleViewResults}
            >
              View Career Results <ArrowRight className="w-4 h-4" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If we're in sector 5, render the InterestQuizStage component
  if (currentSector === 5) {
    return (
      <InterestQuizStage
        currentSector={currentSector}
        onBack={() => {
          // Go back to the previous sector (4)
          setCurrentSector(4);
          setCurrentQuestionIndex(0); // Reset to first question
          setSelectedOption(null);
        }}
        onComplete={async (interestIds) => {
          // Handle the completion of interest selection
          console.log("Interest selection completed with IDs:", interestIds);

          // Get quiz session ID
          const quizSessionId =
            localStorage.getItem("currentQuizSessionId") || "default";

          // Store the selected interests in local storage
          localStorage.setItem(
            `${quizSessionId}_sector5_interests`,
            interestIds,
          );

          // Record timing data
          const questionResponseTime = Date.now() - questionStartTime;

          // Save response timing data
          const timingData: QuestionTimingData = {
            questionId: "s5_interests",
            responseTimeMs: questionResponseTime,
            sector: 5,
            userEmail: localStorage.getItem("userEmail") || undefined,
            sessionId: quizSessionId,
            timestamp: Date.now(),
          };

          // Store timing in localStorage
          const timingsKey = `${quizSessionId}_timings`;
          const existingTimingsJson = localStorage.getItem(timingsKey) || "[]";

          try {
            const existingTimings = JSON.parse(existingTimingsJson);
            existingTimings.push(timingData);
            localStorage.setItem(timingsKey, JSON.stringify(existingTimings));
          } catch (e) {
            console.error("Error storing timing data:", e);
            // Start fresh if we have corrupted data
            localStorage.setItem(timingsKey, JSON.stringify([timingData]));
          }

          // Store the answer in our answers object
          setAnswers((prev) => ({
            ...prev,
            s5_interests: interestIds,
          }));

          const sessionId = localStorage.getItem("currentQuizSessionId") || "default";
          await saveInterests(sessionId, interestIds.split(","));

          // Show the completion message for sector 5
          setShowSectorCompletionMessage(true);
          setCompletedSectorNumber(5);
        }}
      />
    );
  }

  // If we don't have a valid current question but we're not in a completed state,
  // something might be wrong - display a loading message
  if (!currentQuestion && !quizCompleted && !showAvatarCustomizer) {
    return (
      <div className="container mx-auto p-4 max-w-4xl min-h-screen pt-8 flex items-center justify-center">
        <Card className="w-full border-2 border-primary/20 text-center p-8">
          <CardHeader>
            <CardTitle className="text-xl">Loading next questions...</CardTitle>
            <CardDescription>
              Please wait while we prepare the next section
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 flex justify-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl min-h-screen pt-8">
      <header className="mb-8">
        <div className="relative mb-6">
          <img
            src={startImageSrc}
            alt="Starting line"
            className="w-full h-36 object-cover object-center rounded-lg shadow-md"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent flex flex-col items-center justify-end pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2">
              Career Discovery Race
            </h1>
            <div className="flex gap-2 items-center">
              <div className="bg-background/80 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                Question {currentQuestionIndex + 1} of {questions.length}{" "}
                (Section {currentSector}/5)
              </div>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/80 text-xs"
                onClick={() => {
                  // Clean up all previous quiz session data
                  const oldSessionId = localStorage.getItem(
                    "currentQuizSessionId",
                  );
                  if (oldSessionId) {
                    // Remove all session-specific data
                    for (let i = 1; i <= 5; i++) {
                      localStorage.removeItem(
                        `${oldSessionId}_quickQuizAnswers_sector_${i}`,
                      );
                      localStorage.removeItem(
                        `${oldSessionId}_shuffled_questions_sector_${i}`,
                      );
                    }
                    localStorage.removeItem(
                      `${oldSessionId}_question_timing_data`,
                    );
                    localStorage.removeItem(`${oldSessionId}_userEmail`);
                    localStorage.removeItem(`${oldSessionId}_timings`);
                    localStorage.removeItem(
                      `${oldSessionId}_sector5_interests`,
                    );
                  }

                  // Remove general quiz state
                  localStorage.removeItem("currentQuizSessionId");
                  localStorage.removeItem("quizCompleted");
                  localStorage.removeItem("quizCompletedAt");
                  localStorage.setItem("currentSector", "1");

                  // Create new session
                  const userEmail =
                    localStorage.getItem("userEmail") || "guest";
                  const newSessionId = `quiz_${userEmail}_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
                  localStorage.setItem("currentQuizSessionId", newSessionId);

                  // Reset current state
                  setCurrentSector(1);
                  setCurrentQuestionIndex(0);
                  setSelectedOption(null);
                  setSelectedInterests([]);
                  setAnswers({});
                  setShowSectorCompletionMessage(false);
                  setQuizCompleted(false);

                  console.log("Created new quiz session ID:", newSessionId);
                  toast({
                    title: "New Session Started",
                    description: "Previous quiz data cleared. Starting fresh!",
                  });
                }}
              >
                New Session
              </Button>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <div className="absolute w-full h-2 bg-muted rounded-full"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                ${currentSector === 1 ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : currentSector > 1 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {currentSector > 1 ? <Check className="h-5 w-5" /> : "1"}
              </div>
              <span
                className={`text-xs mt-2 ${currentSector === 1 ? "text-primary font-medium" : currentSector > 1 ? "text-emerald-500 font-medium" : "text-muted-foreground"}`}
              >
                Work Style
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                ${currentSector === 2 ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : currentSector > 2 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {currentSector > 2 ? <Check className="h-5 w-5" /> : "2"}
              </div>
              <span
                className={`text-xs mt-2 ${currentSector === 2 ? "text-primary font-medium" : currentSector > 2 ? "text-emerald-500 font-medium" : "text-muted-foreground"}`}
              >
                Cognitive
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                ${currentSector === 3 ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : currentSector > 3 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {currentSector > 3 ? <Check className="h-5 w-5" /> : "3"}
              </div>
              <span
                className={`text-xs mt-2 ${currentSector === 3 ? "text-primary font-medium" : currentSector > 3 ? "text-emerald-500 font-medium" : "text-muted-foreground"}`}
              >
                Personality
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                ${currentSector === 4 ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : currentSector > 4 ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
              >
                {currentSector > 4 ? <Check className="h-5 w-5" /> : "4"}
              </div>
              <span
                className={`text-xs mt-2 ${currentSector === 4 ? "text-primary font-medium" : currentSector > 4 ? "text-emerald-500 font-medium" : "text-muted-foreground"}`}
              >
                Motivation
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all
                ${currentSector === 5 ? "bg-primary text-primary-foreground ring-4 ring-primary/20" : "bg-muted text-muted-foreground"}`}
              >
                5
              </div>
              <span
                className={`text-xs mt-2 ${currentSector === 5 ? "text-primary font-medium" : "text-muted-foreground"}`}
              >
                Interests
              </span>
            </div>
          </div>
        </div>

        <div className="relative mb-4">
          <img
            src={gpsImageSrc}
            alt="GPS journey"
            className="w-full h-16 object-cover object-left rounded-lg opacity-75"
          />
          <div
            className="absolute top-0 left-0 h-full"
            style={{ width: `${progress}%` }}
          >
            <div className="h-full bg-primary/20 rounded-l-lg"></div>
          </div>
          <Progress
            value={progress}
            className="h-2 absolute bottom-0 left-0 w-full"
          />
        </div>
      </header>

      <Card className="w-full border-2 border-primary/20">
        <CardHeader className="bg-gradient-to-r from-primary/10 to-background">
          <CardTitle className="text-xl">
            {currentQuestion?.text || "Loading question..."}
          </CardTitle>
          {currentQuestion?.description && (
            <CardDescription>{currentQuestion.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent className="pt-6">
          {currentSector === 5 ? (
            // Multiple selection for Sector 5
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground mb-2">
                Select up to 5 areas of interest that appeal to you most.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {currentQuestion?.options?.map(
                  (option: {
                    id: string;
                    text: string;
                    value: string | number | boolean;
                  }) => (
                    <div
                      key={option.id}
                      className={`flex items-center border p-3 rounded-lg hover:border-primary/50 transition-all cursor-pointer
                      ${selectedInterests.includes(String(option.value)) ? "border-duo-green-500 bg-duo-green-100 shadow-md" : ""}`}
                      onClick={() => {
                        // Toggle selection
                        const value = String(option.value);
                        if (selectedInterests.includes(value)) {
                          // Remove if already selected
                          setSelectedInterests((prev) =>
                            prev.filter((i) => i !== value),
                          );
                        } else if (selectedInterests.length < 5) {
                          // Add if less than 5 are selected
                          setSelectedInterests((prev) => [...prev, value]);
                        } else {
                          // Alert if trying to select more than 5
                          toast({
                            title: "Maximum selection reached",
                            description:
                              "You can select up to 5 interest areas. Deselect one to choose another.",
                            variant: "destructive",
                          });
                        }
                      }}
                    >
                      <div className="flex-1">
                        <div className="flex items-center">
                          <div
                            className={`w-5 h-5 rounded border mr-2 flex items-center justify-center ${selectedInterests.includes(String(option.value)) ? "bg-duo-green-500 border-duo-green-500" : "border-gray-300"}`}
                          >
                            {selectedInterests.includes(
                              String(option.value),
                            ) && <Check className="h-3 w-3 text-white" />}
                          </div>
                          <Label htmlFor={option.id} className="cursor-pointer">
                            {option.text}
                          </Label>
                        </div>
                      </div>
                    </div>
                  ),
                )}
              </div>

              {/* Show count and button to continue */}
              <div className="flex justify-between items-center mt-6 pt-4 border-t">
                <div className="text-sm">
                  Selected:{" "}
                  <span className="font-medium">
                    {selectedInterests.length}/5
                  </span>
                </div>

                <Button
                  type="button"
                  disabled={selectedInterests.length === 0}
                  className={`${selectedInterests.length > 0 ? "bg-duo-green-500 hover:bg-duo-green-600 text-white" : ""}`}
                  onClick={() => {
                    // If at least 1 is selected, save and continue
                    if (selectedInterests.length > 0) {
                      // Store the array of interests as the answer
                      setSelectedOption(selectedInterests.join(","));
                      setAutoAdvancing(true);
                    }
                  }}
                >
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            // Standard radio selection for Sectors 1-4
            <RadioGroup
              value={selectedOption?.toString() || ""}
              onValueChange={(value) => {
                console.log("Option selected via RadioGroup:", value);
                // Need to convert the value to appropriate type (boolean/number/string)
                let typedValue: string | number | boolean = value;

                // Convert "true"/"false" strings to boolean if needed
                if (value === "true") typedValue = true;
                if (value === "false") typedValue = false;

                // Convert numeric strings to numbers if needed
                if (
                  !isNaN(Number(value)) &&
                  value !== "true" &&
                  value !== "false"
                ) {
                  typedValue = Number(value);
                }

                console.log("Converted to typed value:", typedValue);
                // Set the selected option and mark that we're auto-advancing
                setSelectedOption(typedValue);
                // Always set auto advancing to true, even for false boolean values
                setAutoAdvancing(true);
              }}
              className="space-y-3"
            >
              {currentQuestion?.options?.map(
                (option: {
                  id: string;
                  text: string;
                  value: string | number | boolean;
                }) => (
                  <div
                    key={option.id}
                    className={`flex items-start space-x-2 border p-4 rounded-lg hover:border-primary/50 transition-all cursor-pointer
                    ${String(selectedOption) === String(option.value) ? "border-duo-green-500 bg-duo-green-100 shadow-md" : ""}`}
                    onClick={() => {
                      // Make the whole option area clickable
                      // Need to convert to string for comparison since option.value could be boolean
                      if (String(selectedOption) !== String(option.value)) {
                        console.log(
                          "Option clicked via div:",
                          option.value,
                          "type:",
                          typeof option.value,
                        );
                        console.log(
                          "Current question when clicked:",
                          currentQuestion?.id,
                        );
                        // Match the same logic as the RadioGroup handler
                        setSelectedOption(option.value);
                        // Always set auto advancing to true, even for false boolean values
                        setAutoAdvancing(true);
                      }
                    }}
                  >
                    <RadioGroupItem
                      value={String(option.value)}
                      id={option.id}
                      className="mt-1"
                    />
                    <Label
                      htmlFor={option.id}
                      className="grid gap-1 cursor-pointer w-full"
                    >
                      <span>{option.text}</span>
                    </Label>
                  </div>
                ),
              )}
            </RadioGroup>
          )}
        </CardContent>
        <CardFooter className="flex justify-between bg-muted/20 rounded-b-lg">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Previous
          </Button>

          <div className="flex items-center">
            {selectedOption !== null && selectedOption !== undefined ? (
              <p className="text-sm text-muted-foreground mr-3">
                <span className="animate-pulse">Advancing...</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mr-3">
                Select an option to continue
              </p>
            )}

            <Button
              variant={
                selectedOption !== null && selectedOption !== undefined
                  ? "outline"
                  : "ghost"
              }
              onClick={() => handleNextWithQuestion(currentQuestion)}
              disabled={selectedOption === null || selectedOption === undefined}
              className={`hover:bg-primary/10 transition-all ${selectedOption !== null && selectedOption !== undefined ? "border-primary text-primary" : ""}`}
            >
              {currentQuestionIndex < questions.length - 1 ? (
                selectedOption !== null && selectedOption !== undefined ? (
                  <>
                    <span className="animate-pulse">Advancing...</span>{" "}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                ) : (
                  <>
                    Skip Wait <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )
              ) : (
                <>
                  Complete <Check className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuickQuizPage;