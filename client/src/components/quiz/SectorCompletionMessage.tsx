import React, { useEffect } from 'react';
import { useLocation } from 'wouter';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Trophy, Sparkles, GamepadIcon } from 'lucide-react';
import { Card } from '@/components/ui/card';
import confetti from 'canvas-confetti';

interface SectorCompletionMessageProps {
  sectorNumber: number;
  open: boolean;
  onClose: () => void;
}

// Define the section completion data
const SECTOR_COMPLETION_DATA = {
  1: {
    title: 'Work Style Section Completed!',
    description: 'Great job! You\'ve completed the Work Style section and uncovered how you prefer to approach tasks and challenges.',
    gameUnlocked: 'Color Dash',
    gameRoute: '/mini-games/color-dash',
    keyColor: 'purple',
    congratsMessage: 'You\'ve completed the Work Style section! As a reward, you\'ve unlocked the Color Dash mini-game to help refine your visual processing speed and color recognition abilities.'
  },
  2: {
    title: 'Cognitive Strengths Section Completed!',
    description: 'Excellent work! You\'ve completed the Cognitive Strengths section and discovered your unique thinking patterns and abilities.',
    gameUnlocked: 'Sentence Quest',
    gameRoute: '/mini-games/sentence-quest',
    keyColor: 'green',
    congratsMessage: 'You\'ve completed the Cognitive Strengths section! As a reward, you\'ve unlocked the Sentence Quest mini-game to enhance your verbal comprehension and language skills.'
  },
  3: {
    title: 'Personality Traits Section Completed!',
    description: 'Amazing! You\'ve completed the Personality Traits section and revealed key aspects of your character and social interactions.',
    gameUnlocked: 'Multisensory Matrix',
    gameRoute: '/mini-games/multisensory-matrix',
    keyColor: 'indigo',
    congratsMessage: 'You\'ve completed the Personality Traits section! As a reward, you\'ve unlocked the Multisensory Matrix mini-game to challenge your spatial reasoning and pattern recognition abilities.'
  },
  4: {
    title: 'Motivation & Interest Section Completed!',
    description: 'Outstanding! You\'ve completed the Motivation & Interest section and identified what truly drives and inspires you.',
    gameUnlocked: 'Verbo Flash',
    gameRoute: '/mini-games/verbo-flash',
    keyColor: 'orange',
    congratsMessage: 'You\'ve completed the Motivation & Interest section! As a reward, you\'ve unlocked the Verbo Flash mini-game to test your verbal processing speed and word association skills.'
  },
  5: {
    title: 'Career Race Completed!',
    description: 'Congratulations on completing the full Career Race Quiz! You\'ve unlocked all mini-games and are ready to explore your personalized career recommendations.',
    gameUnlocked: 'All Games',
    gameRoute: '/mini-games',
    keyColor: 'yellow',
    congratsMessage: 'You\'ve completed the entire Career Race Quiz! Your results are being processed to provide you with personalized career recommendations.'
  }
};

export const SectorCompletionMessage: React.FC<SectorCompletionMessageProps> = ({ 
  sectorNumber, 
  open, 
  onClose 
}) => {
  const [, navigate] = useLocation();
  
  const sectorData = SECTOR_COMPLETION_DATA[sectorNumber as keyof typeof SECTOR_COMPLETION_DATA] || SECTOR_COMPLETION_DATA[1];
  
  // Run confetti effect and store unlocked game in localStorage when dialog opens
  useEffect(() => {
    if (open) {
      // Trigger the confetti effect
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      
      // Automatically store unlocked games in localStorage
      storeUnlockedGames();
    }
  }, [open]);
  
  // Store the unlocked games in localStorage
  const storeUnlockedGames = () => {
    // Get existing unlocked games
    const existingUnlockedGames = localStorage.getItem('unlockedGames');
    let unlockedGames: string[] = [];
    
    if (existingUnlockedGames) {
      try {
        unlockedGames = JSON.parse(existingUnlockedGames);
      } catch (e) {
        console.error('Failed to parse unlocked games:', e);
      }
    }
    
    // Determine which game to unlock based on section
    let gameToUnlock = '';
    
    switch (sectorNumber) {
      case 1:
        gameToUnlock = 'color-dash';
        break;
      case 2:
        gameToUnlock = 'sentence-quest';
        break;
      case 3:
        gameToUnlock = 'multisensory-matrix';
        break;
      case 4:
        gameToUnlock = 'verbo-flash';
        break;
      case 5:
        // If all sections completed, unlock all games
        unlockedGames = ['color-dash', 'sentence-quest', 'multisensory-matrix', 'verbo-flash'];
        break;
      default:
        break;
    }
    
    // Add the game to unlocked games if not already there and not section 5 (which is handled above)
    if (gameToUnlock && !unlockedGames.includes(gameToUnlock) && sectorNumber !== 5) {
      unlockedGames.push(gameToUnlock);
    }
    
    // Save back to localStorage
    localStorage.setItem('unlockedGames', JSON.stringify(unlockedGames));
  };
  
  // Handle the navigate to mini-games hub action
  const handleGoToMiniGames = () => {
    // Close the dialog
    onClose();
    
    // Save the current sector to localStorage for returning to the correct section
    localStorage.setItem('lastCareerQuizSector', sectorNumber.toString());
    localStorage.setItem('returnToCareerQuiz', 'true');
    
    // Use direct navigation to preserve authentication state
    window.location.replace(`/mini-games?from=career-quiz&sector=${sectorNumber}`);
  };
  
  // Handle playing the unlocked mini-game immediately
  const handlePlayMiniGame = () => {
    // Close the dialog
    onClose();
    
    // Save the current sector number and question index to localStorage 
    // so we can return to the same point after the mini-game
    localStorage.setItem('lastCareerQuizSector', sectorNumber.toString());
    localStorage.setItem('returnToCareerQuiz', 'true');
    
    // Use direct navigation to preserve authentication state
    window.location.replace(`${sectorData.gameRoute}?from=career-quiz&sector=${sectorNumber}`);
  };
  
  // Handle continuing to the next section or results
  const handleContinue = () => {
    // Close the dialog - this will trigger the onClose callback in the parent component
    // which properly handles sector advancement without page reloads
    onClose();
    
    // If we've completed all 5 sections, mark as complete
    if (sectorNumber === 5) {
      // Mark quiz as fully completed
      localStorage.setItem('quizFullyCompleted', 'true');
      // Set current sector to 6 to indicate we're past all sectors
      localStorage.setItem('currentSector', '6');
      // Mark quiz as complete in the current session
      const sessionId = localStorage.getItem('currentQuizSessionId') || 'default';
      localStorage.setItem(`${sessionId}_quickQuizAnswers_complete`, 'true');
    } else {
      // Save the next sector number to localStorage
      const nextSector = sectorNumber + 1;
      localStorage.setItem('currentSector', nextSector.toString());
      console.log(`Updated currentSector to ${nextSector} in localStorage`);
    }
    
    // The parent component's onClose handler will manage the actual progression
    // This avoids page reloads and maintains React state
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      if (!isOpen) onClose();
    }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Trophy className={`h-6 w-6 text-${sectorData.keyColor}-500`} />
            {sectorData.title}
          </DialogTitle>
          <DialogDescription>
            {sectorData.description}
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col items-center py-4">
          <div className="mb-4 p-1 rounded-full bg-duo-purple-100">
            <Sparkles className="h-8 w-8 text-duo-purple-500" />
          </div>
          
          <div className="text-center mb-6">
            <p className="text-gray-700 mb-2">
              {sectorData.congratsMessage}
            </p>
            {sectorNumber !== 5 && (
              <p className="text-lg font-semibold text-green-600 mt-3">
                Congratulations, you've unlocked the {sectorData.gameUnlocked} mini-game!
              </p>
            )}
          </div>
          
          {/* Game unlock prompt for sections 1-4 */}
          {sectorNumber !== 5 && (
            <Card className="w-full p-4 border bg-blue-50 border-blue-200">
              <h3 className="font-medium text-blue-800 mb-2">Would you like to play the mini-game now?</h3>
              <p className="text-sm text-blue-700 mb-4">
                You can play your newly unlocked mini-game now, or continue with the Career Race Quiz and play it later.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handlePlayMiniGame}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  <GamepadIcon className="mr-2 h-4 w-4" />
                  Play Mini-Game Now
                </Button>
                <Button 
                  onClick={handleContinue}
                  variant="outline"
                  className="flex-1 border-blue-300 text-blue-700 hover:bg-blue-100"
                >
                  Continue Race
                </Button>
              </div>
            </Card>
          )}
        </div>
        
        <DialogFooter className="flex sm:flex-row sm:justify-between gap-2">
          {sectorNumber !== 5 ? (
            <>
              <Button variant="outline" onClick={handleGoToMiniGames}>
                Go to Mini-Games Hub
              </Button>
              <Button onClick={handleContinue}>
                Continue Race
              </Button>
            </>
          ) : (
            <Button onClick={handleContinue} className="w-full">
              View Career Results
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SectorCompletionMessage;