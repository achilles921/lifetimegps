import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { X, ArrowLeft, BrainCircuit } from 'lucide-react';
import { GameId } from './MiniGameTypes';

export interface MiniGameLayoutProps {
  children: React.ReactNode;
  gameId?: GameId;
  title: string;
  description: string;
  icon: React.ReactNode;
  themeColor?: string;
  showExitConfirmation?: boolean;
}

const MiniGameLayout: React.FC<MiniGameLayoutProps> = ({ 
  children, 
  gameId = 'color-dash',
  title,
  description,
  icon,
  themeColor,
  showExitConfirmation = true
}) => {
  const [, navigate] = useLocation();
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [startTime, setStartTime] = useState<number>(Date.now());
  
  // Track time spent in the mini-game
  useEffect(() => {
    setStartTime(Date.now());
    
    return () => {
      const endTime = Date.now();
      const timeSpent = (endTime - startTime) / 1000; // in seconds
      console.log(`Time spent in mini-game ${gameId}: ${timeSpent}s`);
    };
  }, [gameId]);
  
  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (showExitConfirmation) {
          setShowExitDialog(true);
        } else {
          // Check URL params to see if we should redirect back to career quiz
          const urlParams = new URLSearchParams(window.location.search);
          const redirectToCareerQuiz = urlParams.get('from') === 'career-quiz';
          
          if (redirectToCareerQuiz) {
            // Direct navigation to preserve authentication state
            window.location.replace('/career-quiz');
          } else {
            window.location.replace('/mini-games');
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showExitConfirmation, navigate]);
  
  const handleBackClick = () => {
    if (showExitConfirmation) {
      setShowExitDialog(true);
    } else {
      // Check URL params to see if we should redirect back to career quiz
      const urlParams = new URLSearchParams(window.location.search);
      const redirectToCareerQuiz = urlParams.get('from') === 'career-quiz';
      
      if (redirectToCareerQuiz) {
        // Direct navigation to preserve authentication state
        window.location.replace('/career-quiz');
      } else {
        window.location.replace('/mini-games');
      }
    }
  };
  
  const handleExitConfirm = () => {
    // Check URL params to see if we should redirect back to career quiz
    const urlParams = new URLSearchParams(window.location.search);
    const redirectToCareerQuiz = urlParams.get('from') === 'career-quiz';
    
    if (redirectToCareerQuiz) {
      // Preserve authentication state by forcing a direct navigation
      window.location.replace('/career-quiz');
    } else {
      navigate('/mini-games');
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className={`${themeColor || 'bg-white'} border-b border-gray-200 p-4 text-white`}>
        <div className="container mx-auto flex items-center justify-between">
          <button 
            onClick={handleBackClick}
            className={`flex items-center ${themeColor ? 'text-white hover:text-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <ArrowLeft className="w-5 h-5 mr-1" />
            {(() => {
              const urlParams = new URLSearchParams(window.location.search);
              const fromCareerQuiz = urlParams.get('from') === 'career-quiz';
              return <span>{fromCareerQuiz ? 'Back to Career Race' : 'Back to Hub'}</span>;
            })()}
          </button>
          
          <div className="flex items-center">
            <div className={`${themeColor ? 'bg-white/20' : 'bg-indigo-100'} p-2 rounded-full mr-3`}>
              {icon || <BrainCircuit className={`w-6 h-6 ${themeColor ? 'text-white' : 'text-indigo-600'}`} />}
            </div>
            <div>
              <h1 className={`text-xl font-bold ${themeColor ? 'text-white' : ''}`}>{title}</h1>
              <p className={`text-sm ${themeColor ? 'text-gray-100' : 'text-gray-500'}`}>{description}</p>
            </div>
          </div>
          
          <button 
            onClick={handleBackClick}
            className={`${themeColor ? 'text-white hover:text-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>
      
      {/* Content */}
      <main className="flex-1 py-6">
        <div className="container mx-auto">
          {children}
        </div>
      </main>
      
      {/* Exit Confirmation Dialog */}
      {showExitConfirmation && (
        <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Exit Game?</AlertDialogTitle>
              <AlertDialogDescription>
                Your progress in this mini-game will be lost. Are you sure you want to exit?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleExitConfirm}>
                Exit Game
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

// Add a utility function to handle game completion
export const handleGameCompletion = (navigate: Function) => {
  // Always return to the Career Race when a game is completed
  const urlParams = new URLSearchParams(window.location.search);
  const fromCareerQuiz = urlParams.get('from') === 'career-quiz';
  const sector = urlParams.get('sector');
  
  if (fromCareerQuiz) {
    // Get the return flag and last sector from localStorage
    const shouldReturnToQuiz = localStorage.getItem('returnToCareerQuiz') === 'true';
    const lastSector = localStorage.getItem('lastCareerQuizSector') || sector;
    
    // Clear the return flag
    localStorage.removeItem('returnToCareerQuiz');
    
    // If we have a sector parameter, navigate to the quick-quiz page
    // which is where the actual questions are handled
    if (lastSector) {
      console.log(`Returning to Career Race sector ${lastSector}`);
      localStorage.setItem('currentSector', lastSector);
      window.location.replace('/quick-quiz');
    } else {
      // Fallback to career-quiz landing page if no sector
      window.location.replace('/career-quiz');
    }
  } else {
    // If they're playing from the hub, still give them the option to return to quiz
    const wantToReturnToQuiz = window.confirm('Great job! Would you like to return to the Career Race to continue your assessment?');
    
    if (wantToReturnToQuiz) {
      // Direct navigation to preserve authentication state
      window.location.replace('/career-quiz');
    } else {
      window.location.replace('/mini-games');
    }
  }
};

export default MiniGameLayout;