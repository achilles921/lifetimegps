import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { RaceTrackJourney } from './RaceTrackJourney';
import { SpeedwayRacer } from './mini-games/SpeedwayRacer';
import { GalaxyExplorerGame } from './mini-games/GalaxyExplorerGame';
import { SkillMatchGame } from './mini-games/SkillMatchGame';
import { VoiceSelector } from './ui/VoiceSelector';
import confetti from 'canvas-confetti';

// We need to track the user's voice preference for the AI assistant
import { useElevenLabsSpeech } from '@/hooks/useElevenLabsSpeech';

interface QuizExperienceProps {
  sessionId?: string;
  onComplete: (results: any) => void;
  initialVoiceType?: string;
  initialVoiceId?: string;
}

// Define quiz sections (milestones)
const quizSections = [
  {
    id: 'workStyle',
    name: 'Work Style',
    description: 'Discover how you prefer to work and approach challenges',
    game: 'speedway',
    completed: false
  },
  {
    id: 'cognitiveStrength',
    name: 'Cognitive Strengths', 
    description: 'Analyze your thinking patterns and problem-solving approach',
    game: 'battle',
    completed: false
  },
  {
    id: 'socialApproach',
    name: 'Social Approach',
    description: 'Explore how you interact with others in different settings',
    game: 'galaxy',
    completed: false
  },
  {
    id: 'motivation',
    name: 'Motivation Drivers',
    description: 'Identify what motivates you and drives your decisions',
    game: 'speedway',
    completed: false
  },
  {
    id: 'interests',
    name: 'Interest Analysis',
    description: 'Measure your level of interest in various professional fields',
    game: 'galaxy',
    completed: false
  }
];

// Celebratory messages for completing each milestone
const celebrationMessages = [
  "Great job! You've completed your first milestone!",
  "You're making excellent progress! Two milestones down!",
  "Halfway there! You're doing fantastic!",
  "Almost to the finish line! Just one more to go!",
  "Congratulations! You've completed all milestones!"
];

export function QuizExperience({
  sessionId,
  onComplete,
  initialVoiceType = 'female',
  initialVoiceId = 'XB0fDUnXU5powFXDhCwa'
}: QuizExperienceProps) {
  // State for quiz progression
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [completedMilestones, setCompletedMilestones] = useState<number[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [voiceType, setVoiceType] = useState(initialVoiceType);
  const [voiceId, setVoiceId] = useState(initialVoiceId);
  const [voiceName, setVoiceName] = useState('');
  const [isVoiceSetupComplete, setIsVoiceSetupComplete] = useState(false);

  // Speech hook for voice guidance
  const speech = useElevenLabsSpeech({ 
    voiceType, 
    voiceId 
  });
  
  const { toast } = useToast();

  // Handle voice assistant speaking
  const handleSpeak = useCallback((text: string) => {
    if (speech && !speech.isSpeaking) {
      speech.speak(text);
    }
  }, [speech]);

  // Start voice introduction when component mounts and voice is selected
  useEffect(() => {
    if (isVoiceSetupComplete && showIntro) {
      handleSpeak(
        `Hi there! I'm ${voiceName}, your guide on this career discovery journey. ` +
        `I'll be with you every step of the way as we explore your unique strengths, ` +
        `interests, and potential career paths. Let's get started!`
      );
    }
  }, [isVoiceSetupComplete, showIntro, handleSpeak, voiceName]);

  // Handle completing a mini-game/milestone
  const handleGameComplete = (sectionId: string, gameResponses: any) => {
    // Store responses
    setResponses(prev => ({
      ...prev,
      [sectionId]: gameResponses
    }));

    // Mark milestone as completed
    const milestoneIndex = quizSections.findIndex(section => section.id === sectionId);
    if (milestoneIndex >= 0 && !completedMilestones.includes(milestoneIndex)) {
      setCompletedMilestones(prev => [...prev, milestoneIndex]);
      
      // Show celebration toast
      toast({
        title: "Milestone Complete!",
        description: celebrationMessages[completedMilestones.length],
      });
      
      // Trigger confetti
      confetti({
        particleCount: 50,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Voice celebration
      handleSpeak(celebrationMessages[completedMilestones.length]);
    }

    // Clear current game
    setCurrentGame(null);
    
    // Check if all milestones are completed
    if (completedMilestones.length + 1 >= quizSections.length) {
      // Small delay before completing the entire quiz
      setTimeout(() => {
        handleComplete();
      }, 2000);
    }
  };

  // Handle selecting a milestone to start
  const handleSelectMilestone = (index: number) => {
    setCurrentMilestone(index);
    
    // If milestone not completed, start the corresponding game
    if (!completedMilestones.includes(index)) {
      const gameType = quizSections[index].game;
      setCurrentGame(gameType);
      
      // Voice introduction to the new section
      handleSpeak(
        `Now let's explore your ${quizSections[index].name}. ` +
        `${quizSections[index].description} through an interactive experience. Have fun!`
      );
    }
  };

  // Handle voice selection
  const handleVoiceSelect = (type: string, id: string, name: string) => {
    setVoiceType(type);
    setVoiceId(id);
    setVoiceName(name);
    setIsVoiceSetupComplete(true);
  };

  // Handle skipping intro
  const handleSkipIntro = () => {
    setShowIntro(false);
    if (speech.isSpeaking) {
      speech.stop();
    }
  };

  // Handle starting the journey after intro
  const handleStartJourney = () => {
    setShowIntro(false);
    if (speech.isSpeaking) {
      speech.stop();
    }
    
    // Voice introduction to the first section
    handleSpeak(
      `Let's begin our journey! The race track you see represents your progress. ` +
      `Click on the first milestone to start exploring your ${quizSections[0].name}.`
    );
  };

  // Handle completing the entire quiz
  const handleComplete = () => {
    // Process all responses
    const processedResults = {
      sessionId,
      completedAt: new Date().toISOString(),
      responses,
      voice: {
        type: voiceType,
        id: voiceId,
        name: voiceName
      }
    };
    
    // Trigger final celebration
    confetti({
      particleCount: 100,
      spread: 100,
      origin: { y: 0.6 }
    });
    
    // Final voice message
    handleSpeak(
      `Congratulations! You've completed all milestones! ` +
      `Based on your interactions, we're now ready to reveal your perfect career matches.`
    );
    
    // Notify parent component
    setTimeout(() => {
      onComplete(processedResults);
    }, 5000); // Give time for the voice to finish
  };

  // Render voice selection screen
  if (!isVoiceSetupComplete) {
    return (
      <div className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Guide</h2>
        <p className="text-center text-muted-foreground mb-8">
          Select a voice that will guide you through your career discovery journey
        </p>
        
        <VoiceSelector 
          onSelect={handleVoiceSelect}
          initialVoiceType={initialVoiceType}
          initialVoiceId={initialVoiceId}
        />
      </div>
    );
  }

  // Render introduction screen
  if (showIntro) {
    return (
      <div className="max-w-3xl mx-auto p-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold mb-4">Welcome to Your Career GPS Journey</h1>
          
          <Card className="p-6 mb-8 bg-gradient-to-br from-slate-50 to-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                {voiceType === 'female' ? '👩‍🚀' : '👨‍🚀'}
              </div>
              <div className="text-left">
                <h3 className="text-lg font-medium">Meet {voiceName}, Your Guide</h3>
                <p className="text-muted-foreground">{voiceName} will help you navigate your career discovery journey</p>
              </div>
            </div>
            
            <p className="mb-4 text-left">
              I'm excited to guide you through this interactive experience! Together, we'll explore
              your unique strengths, interests, and work preferences through fun, game-like activities.
            </p>
            
            <p className="mb-4 text-left">
              As you complete each section, you'll unlock insights about yourself that will help
              identify your ideal career paths. Think of this as a journey where each milestone reveals
              a piece of your career puzzle.
            </p>
            
            <p className="text-left text-muted-foreground italic">
              This assessment takes about 15-20 minutes to complete, and you can pause at any time.
            </p>
          </Card>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="outline" onClick={handleSkipIntro}>
              Skip Introduction
            </Button>
            
            <Button 
              onClick={handleStartJourney}
              className="bg-gradient-to-r from-primary to-purple-600 text-white"
            >
              Start My Career Journey
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Render current game
  if (currentGame) {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentGame + currentMilestone}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {currentGame === 'speedway' && (
            <SpeedwayRacer 
              onComplete={(results) => handleGameComplete(quizSections[currentMilestone].id, results)}
              onAskQuestion={handleSpeak}
            />
          )}
          
          {currentGame === 'battle' && (
            <SkillMatchGame 
              onComplete={(results) => handleGameComplete(quizSections[currentMilestone].id, results)}
              onAskQuestion={handleSpeak}
            />
          )}
          
          {currentGame === 'galaxy' && (
            <GalaxyExplorerGame 
              onComplete={(results) => handleGameComplete(quizSections[currentMilestone].id, results)}
              sectorName={quizSections[currentMilestone].name}
              onAskQuestion={handleSpeak}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  }

  // Render main race track journey view
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-center">Your Career Discovery Journey</h2>
      
      <div className="mb-8">
        <RaceTrackJourney 
          currentMilestone={currentMilestone}
          completedMilestones={completedMilestones}
          onMilestoneSelect={handleSelectMilestone}
        />
      </div>
      
      <div className="text-center">
        <p className="text-muted-foreground mb-6">
          Click on a milestone to begin exploring that aspect of your career identity.
          Complete all milestones to discover your perfect career matches!
        </p>
        
        {completedMilestones.length > 0 && completedMilestones.length < quizSections.length && (
          <div className="flex justify-center">
            <Button 
              onClick={() => {
                const nextIncomplete = quizSections.findIndex(
                  (_, index) => !completedMilestones.includes(index)
                );
                if (nextIncomplete >= 0) {
                  handleSelectMilestone(nextIncomplete);
                }
              }}
              className="bg-gradient-to-r from-primary to-purple-600 text-white"
            >
              Continue to Next Section
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}