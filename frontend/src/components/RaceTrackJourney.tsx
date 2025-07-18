import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';
import { 
  LuFlag, LuMapPin, LuChevronRight, LuAward, 
  LuCompass, LuBrain, LuUsers, LuHeart, LuBarChart 
} from 'react-icons/lu';
import { FaFlagCheckered } from 'react-icons/fa';
import startImagePath from "@assets/Start.png";
import finishImagePath from "@assets/Finish Line.png";
import womanRacerPath from "@assets/woman racer.png";

// Define milestone types/names
const milestones = [
  { 
    name: 'workStyle', 
    label: 'Work Style',
    icon: <LuCompass className="h-5 w-5" />,
    color: 'from-blue-500 to-cyan-400',
    description: 'Discover how you prefer to work and approach challenges'
  },
  { 
    name: 'cognitiveStrength', 
    label: 'Cognitive Strengths',
    icon: <LuBrain className="h-5 w-5" />,
    color: 'from-purple-500 to-indigo-400',
    description: 'Analyze your thinking patterns and problem-solving approach'
  },
  { 
    name: 'socialApproach', 
    label: 'Social Approach',
    icon: <LuUsers className="h-5 w-5" />,
    color: 'from-green-500 to-emerald-400',
    description: 'Explore how you interact with others in different settings'
  },
  { 
    name: 'motivation', 
    label: 'Motivation Drivers',
    icon: <LuHeart className="h-5 w-5" />,
    color: 'from-red-500 to-rose-400',
    description: 'Identify what motivates you and drives your decisions'
  },
  { 
    name: 'interests', 
    label: 'Interest Analysis',
    icon: <LuBarChart className="h-5 w-5" />,
    color: 'from-amber-500 to-yellow-400',
    description: 'Measure your level of interest in various professional fields'
  }
];

interface RaceTrackJourneyProps {
  currentMilestone: number;
  completedMilestones: number[];
  onMilestoneSelect: (index: number) => void;
  showControls?: boolean; // Whether to show next/previous buttons
  animateAvatar?: boolean; // Whether to show the avatar moving animation
}

export function RaceTrackJourney({
  currentMilestone,
  completedMilestones,
  onMilestoneSelect,
  showControls = true,
  animateAvatar = true
}: RaceTrackJourneyProps) {
  const [progress, setProgress] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Calculate progress percentage based on completed milestones
  useEffect(() => {
    const progressValue = ((completedMilestones.length) / milestones.length) * 100;
    setProgress(progressValue);
    
    // Show celebration animation when all milestones are completed
    if (completedMilestones.length === milestones.length) {
      setShowCelebration(true);
      
      // Hide celebration after 5 seconds
      const timer = setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [completedMilestones]);
  
  // Handle next/previous milestone navigation
  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentMilestone < milestones.length - 1) {
      onMilestoneSelect(currentMilestone + 1);
    } else if (direction === 'prev' && currentMilestone > 0) {
      onMilestoneSelect(currentMilestone - 1);
    }
  };
  
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Overall progress indicator */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-medium">Career Journey Progress</div>
        <div className="text-sm text-muted-foreground">
          {Math.round(progress)}% Complete
        </div>
      </div>
      
      <Progress value={progress} className="h-2 mb-8" />
      
      {/* Race track visualization */}
      <div className="relative">
        <div className="h-24 bg-gradient-to-r from-muted/50 to-muted flex items-center rounded-lg overflow-hidden">
          {/* Start Flag */}
          <div className="absolute left-0 -top-2 flex flex-col items-center z-10">
            <img src={startImagePath} alt="Start" className="h-12 w-12 object-contain" />
            <span className="text-xs font-medium">START</span>
          </div>
          
          {/* Finish Flag */}
          <div className="absolute right-0 -top-2 flex flex-col items-center z-10">
            <img src={finishImagePath} alt="Finish" className="h-12 w-12 object-contain" />
            <span className="text-xs font-medium">FINISH</span>
          </div>
          
          {/* Track markers (milestones) */}
          <div className="flex justify-between w-full px-12 relative">
            {milestones.map((milestone, index) => {
              const isCompleted = completedMilestones.includes(index);
              const isCurrent = currentMilestone === index;
              
              return (
                <div 
                  key={milestone.name}
                  className={`flex flex-col items-center cursor-pointer transition-all duration-300
                    ${isCurrent ? 'scale-110' : ''}
                    ${isCompleted ? '' : 'opacity-70'}
                  `}
                  onClick={() => onMilestoneSelect(index)}
                >
                  <div className={`
                    h-10 w-10 rounded-full flex items-center justify-center mb-1
                    ${isCompleted 
                      ? `bg-gradient-to-br ${milestone.color} text-white shadow-md` 
                      : 'bg-muted text-muted-foreground'
                    }
                    ${isCurrent ? 'ring-2 ring-primary ring-offset-2' : ''}
                  `}>
                    {isCompleted ? (
                      <LuFlag className="h-5 w-5" />
                    ) : (
                      milestone.icon
                    )}
                  </div>
                  <span className={`
                    text-xs font-medium whitespace-nowrap
                    ${isCompleted ? 'text-foreground' : 'text-muted-foreground'}
                    ${isCurrent ? 'text-primary font-semibold' : ''}
                  `}>
                    {milestone.label}
                  </span>
                </div>
              );
            })}
          </div>
          
          {/* Race track lane markers */}
          <div className="absolute inset-0 flex px-4">
            <div className="w-full h-full border-t-2 border-b-2 border-dashed border-muted-foreground/20"></div>
          </div>
        </div>
        
        {/* Avatar character on the track */}
        <motion.div
          className="absolute bottom-1"
          initial={{ left: 0 }}
          animate={{ 
            left: animateAvatar
              ? `${Math.min(100, (currentMilestone / (milestones.length - 1)) * 85)}%` 
              : `${Math.min(100, (currentMilestone / (milestones.length - 1)) * 85)}%`
          }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            duration: 0.8
          }}
          key={currentMilestone} // Re-render on current milestone change
        >
          <img 
            src={womanRacerPath} 
            alt="Your journey" 
            className="h-24 object-contain transform -scale-x-100"
          />
          
          {/* Current action highlight */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute -top-16 left-1/2 -translate-x-1/2 bg-white rounded-lg p-2 shadow-lg text-xs font-medium z-20 min-w-40 text-center whitespace-nowrap"
          >
            {currentMilestone < milestones.length ? (
              <>Exploring: <span className="text-primary">{milestones[currentMilestone].label}</span></>
            ) : (
              <>All milestones completed!</>
            )}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Current milestone details */}
      <Card className="p-4 mt-8 bg-gradient-to-br from-white to-muted/30">
        <div className="flex items-center gap-3">
          <div className={`h-10 w-10 rounded-full flex items-center justify-center bg-gradient-to-br ${milestones[currentMilestone].color} text-white`}>
            {milestones[currentMilestone].icon}
          </div>
          <div>
            <h3 className="font-bold text-lg">{milestones[currentMilestone].label}</h3>
            <p className="text-sm text-muted-foreground">{milestones[currentMilestone].description}</p>
          </div>
        </div>
      </Card>
      
      {/* Navigation controls */}
      {showControls && (
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => handleNavigation('prev')}
            disabled={currentMilestone === 0}
          >
            Previous Milestone
          </Button>
          
          <Button
            onClick={() => handleNavigation('next')}
            disabled={currentMilestone === milestones.length - 1}
          >
            Next Milestone <LuChevronRight className="ml-1" />
          </Button>
        </div>
      )}
      
      {/* Celebration animation - only shows when all milestones are completed */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              transition={{ 
                type: "spring", 
                damping: 10, 
                stiffness: 100,
                repeat: 3,
                repeatType: "mirror" 
              }}
              className="text-6xl mb-4"
            >
              🏆
            </motion.div>
            
            <motion.h2
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ 
                duration: 0.5,
                ease: "easeOut"
              }}
              className="text-3xl font-bold text-white mb-2 text-center"
            >
              Journey Complete!
            </motion.h2>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-white/90 text-lg text-center max-w-md mb-8"
            >
              You've crossed the finish line and completed all assessment milestones!
              Let's discover your perfect career matches.
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-purple-600 text-white shadow-xl hover:shadow-lg"
                onClick={() => setShowCelebration(false)}
              >
                <LuAward className="mr-2 h-5 w-5" /> See My Results
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}