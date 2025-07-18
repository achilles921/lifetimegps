import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { areAllSectionsCompleted } from '@/utils/quizLogic';
import { useAuth } from '@/context/AuthContextFixed';
import { Brain, Lightbulb, Grid3X3, MessageSquare, BrainCircuit, Lock, Unlock, KeyRound } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

// Game unlock keys mapped to sections
const GAME_UNLOCK_KEYS = {
  'section-1': {
    gameId: 'color-dash',
    key: 'CAREER-RACE-S1',
    color: 'purple'
  },
  'section-2': {
    gameId: 'sentence-quest',
    key: 'CAREER-RACE-S2',
    color: 'green'
  },
  'section-3': {
    gameId: 'multisensory-matrix',
    key: 'CAREER-RACE-S3',
    color: 'indigo'
  },
  'section-4': {
    gameId: 'verbo-flash',
    key: 'CAREER-RACE-S4',
    color: 'orange'
  }
};

const MiniGamesHub: React.FC = () => {
  const [, navigate] = useLocation();
  const [unlockedGames, setUnlockedGames] = useState<string[]>([]);
  const [isGuestMode, setIsGuestMode] = useState<boolean>(false);
  const { user, isLoading } = useAuth();
  
 //  console.log('Mini Games Hub mounted');
  
  // Check if user is in guest mode (completed quiz without login)
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    const quizCompleted = localStorage.getItem('quizFullyCompleted') === 'true' || 
                        localStorage.getItem('quizCompleted') === 'true';
    const isGuest = !userEmail && quizCompleted;
    setIsGuestMode(isGuest);
  }, []);
  
  // Check if at least one section is completed or if user has previously completed the quiz
  useEffect(() => {
    if (isLoading) return;
    
   //  console.log("Mini-Games Hub: Checking quiz completion status");
    
    // STEP 0: If user is authenticated, unlock all games without requiring prior quiz completion
    // This is the key fix to prevent redirects for logged-in users
    if (user) {
     //  console.log("Mini-Games Hub: User is logged in, automatically unlocking all mini-games");
      setUnlockedGames(['color-dash', 'sentence-quest', 'multisensory-matrix', 'verbo-flash']);
      
      // Also make sure completedSections is set so all route checks pass
      const completedSections = ['workStyle', 'cognitiveStrength', 'socialApproach', 'motivation', 'interests'];
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      return;
    }
    
    // STEP 1: First check for any saved results for ANY user
    const hasSavedResults = localStorage.getItem('savedResults') !== null;
    const hasCareerMatches = localStorage.getItem('allCareerMatches') !== null;
    
    if (hasSavedResults || hasCareerMatches) {
     //  console.log("Mini-Games Hub: Found saved results or career matches, unlocking all mini-games");
      setUnlockedGames(['color-dash', 'sentence-quest', 'multisensory-matrix', 'verbo-flash']);
      return;
    }
    
    // STEP 2: Check if user is in localStorage (for test accounts or if session was lost)
    const userEmail = localStorage.getItem('userEmail');
    const isLoggedInLocal = localStorage.getItem('isLoggedIn') === 'true';
    
    if (isLoggedInLocal && userEmail) {
     //  console.log(`Mini-Games Hub: User logged in via localStorage: ${userEmail}, unlocking all mini-games`);
      setUnlockedGames(['color-dash', 'sentence-quest', 'multisensory-matrix', 'verbo-flash']);
      
      // Also make sure completedSections is set so all route checks pass
      const completedSections = ['workStyle', 'cognitiveStrength', 'socialApproach', 'motivation', 'interests'];
      localStorage.setItem('completedSections', JSON.stringify(completedSections));
      return;
    }
    
    // STEP 3: Check for ANY email with quiz data in localStorage
    if (userEmail) {
     //  console.log(`Mini-Games Hub: Checking localStorage for quiz data for ${userEmail}`);
      
      // Look for all localStorage entries with this email
      const allKeys = Object.keys(localStorage);
      const userDataKeys = allKeys.filter(key => key.includes(userEmail));
      
      // Check for specific user quiz sessions
      const userQuizSessions = allKeys.filter(key => 
        key.includes(userEmail) && key.includes('_userEmail')
      );
      
     //  console.log(`Mini-Games Hub: Found ${userDataKeys.length} data keys and ${userQuizSessions.length} quiz sessions for ${userEmail}`);
      
      // Look for known quiz data patterns
      const hasQuizData = allKeys.some(key => 
        key.includes('_quickQuizAnswers_sector_') || 
        key.includes('quizFullyCompleted') || 
        key.includes('lastCareerQuizSector') ||
        key.includes('cachedQuizResponses')
      );
      
      if (userQuizSessions.length > 0 || userDataKeys.length > 0 || hasQuizData) {
       //  console.log(`Found existing quiz data for ${userEmail}, unlocking all mini-games`);
        setUnlockedGames(['color-dash', 'sentence-quest', 'multisensory-matrix', 'verbo-flash']);
        return;
      }
    }
    
    // STEP 4: Look for any registered users in storage
    try {
      const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      if (registeredUsers.length > 0) {
        // If any users are registered, assume they're returning users and unlock mini-games
       //  console.log("Mini-Games Hub: Found registered users, unlocking all mini-games");
        setUnlockedGames(['color-dash', 'sentence-quest', 'multisensory-matrix', 'verbo-flash']);
        return;
      }
    } catch (e) {
      console.error("Mini-Games Hub: Error parsing registeredUsers", e);
    }
    
    // STEP 5: Finally, check for specific section completion
    if (areAllSectionsCompleted()) {
     //  console.log("Mini-Games Hub: At least one sector completed, unlocking appropriate mini-games");
      // Let the game unlocking logic in other components handle which specific games to unlock
      return;
    }
    
    // If we get here, no evidence of any quiz completion was found
   //  console.log("Mini-Games Hub: No evidence of quiz completion found, redirecting to Career Race");
    toast({
      title: "Access Restricted",
      description: "Complete at least one Career Race section to access the Mini-games Hub",
      variant: "destructive",
    });
    
    // Redirect to the career quiz page
    navigate('/career-quiz');
  }, [navigate, user, isLoading, setUnlockedGames, toast]);
  
  // Check localStorage for unlocked games on mount
  useEffect(() => {
    const storedUnlockedGames = localStorage.getItem('unlockedGames');
    if (storedUnlockedGames) {
      setUnlockedGames(JSON.parse(storedUnlockedGames));
    }
  }, []);
  
  // Save unlocked games to localStorage when they change
  useEffect(() => {
    if (unlockedGames.length > 0) {
      localStorage.setItem('unlockedGames', JSON.stringify(unlockedGames));
    }
  }, [unlockedGames]);
  
  // Function to check if a game is unlocked
  const isGameUnlocked = (gameId: string): boolean => {
    return unlockedGames.includes(gameId);
  };
  
  // List of mini-games with metadata
  const games = [
    {
      id: 'color-dash',
      name: 'Color Dash',
      description: 'Test your visual perception and reaction time with color matching challenges.',
      icon: <Brain className="w-8 h-8 text-white" />,
      bgGradient: 'from-purple-600 to-indigo-700',
      status: isGameUnlocked('color-dash') ? 'ready' : 'locked',
      metrics: ['Visual Perception', 'Reaction Time', 'Color Processing'],
      brainAreas: ['Visual Cortex', 'Prefrontal Cortex'],
      route: '/mini-games/color-dash',
      unlockSection: 'Section 1: Work Style',
      keyColor: 'purple'
    },
    {
      id: 'sentence-quest',
      name: 'Sentence Quest',
      description: 'Master language skills by completing contextual sentence challenges based on Tatoeba.',
      icon: <Lightbulb className="w-8 h-8 text-white" />,
      bgGradient: 'from-green-600 to-emerald-500',
      status: isGameUnlocked('sentence-quest') ? 'ready' : 'locked',
      metrics: ['Contextual Comprehension', 'Language Application', 'Grammar Consistency'],
      brainAreas: ['Broca\'s Area', 'Wernicke\'s Area'],
      route: '/mini-games/sentence-quest',
      unlockSection: 'Section 2: Cognitive Strengths',
      keyColor: 'green'
    },
    {
      id: 'multisensory-matrix',
      name: 'Multisensory Matrix',
      description: 'Challenge your memory and multitasking abilities with pattern recognition.',
      icon: <Grid3X3 className="w-8 h-8 text-white" />,
      bgGradient: 'from-indigo-600 to-violet-600',
      status: isGameUnlocked('multisensory-matrix') ? 'ready' : 'locked',
      metrics: ['Spatial Reasoning', 'Working Memory', 'Multitasking'],
      brainAreas: ['Parietal Lobe', 'Frontal Lobe'],
      route: '/mini-games/multisensory-matrix',
      unlockSection: 'Section 3: Personality Traits',
      keyColor: 'indigo'
    },
    {
      id: 'verbo-flash',
      name: 'Verbo Flash',
      description: 'Test your verbal processing speed and word association abilities.',
      icon: <MessageSquare className="w-8 h-8 text-white" />,
      bgGradient: 'from-orange-500 to-amber-500',
      status: isGameUnlocked('verbo-flash') ? 'ready' : 'locked',
      metrics: ['Verbal Processing', 'Linguistic Flexibility', 'Semantic Comprehension'],
      brainAreas: ['Broca\'s Area', 'Wernicke\'s Area'],
      route: '/mini-games/verbo-flash',
      unlockSection: 'Section 4: Motivation & Interest',
      keyColor: 'orange'
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Guest mode notification */}
      {isGuestMode && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 mx-auto max-w-5xl">
          <div className="flex items-center justify-between">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  You're playing mini-games in guest mode. Create an account to save your progress and access additional features.
                </p>
              </div>
            </div>
            <Button 
              className="bg-duo-purple-600 hover:bg-duo-purple-700 text-white font-medium ml-6"
              onClick={() => navigate('/login')}
            >
              Create Account
            </Button>
          </div>
        </div>
      )}
    
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white shadow-lg">
        <div className="container mx-auto px-4 py-10 text-center">
          <div className="flex items-center justify-center mb-4">
            <BrainCircuit className="w-12 h-12 mr-3" />
            <h1 className="text-3xl font-bold">Mini Games Hub</h1>
          </div>
          <p className="max-w-2xl mx-auto text-white/80">
            Unlock insights about your cognitive strengths through interactive challenges designed to measure different aspects of your mind.
          </p>
        </div>
      </div>
      
      {/* Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Stats summary (placeholder for now) */}
        <Card className="p-6 mb-8 bg-white/60 backdrop-blur-sm">
          <h2 className="text-xl font-bold mb-4">Your Cognitive Profile</h2>
          <p className="text-gray-600 mb-4">
            Complete mini-games to build your cognitive profile and discover your unique strengths and traits.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500">Games Completed</div>
              <div className="text-2xl font-bold text-indigo-600">0/5</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500">Brain Dominance</div>
              <div className="text-2xl font-bold text-indigo-600">Unknown</div>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 text-center">
              <div className="text-sm text-gray-500">Cognitive Style</div>
              <div className="text-2xl font-bold text-indigo-600">Unknown</div>
            </div>
          </div>
        </Card>
        
        {/* Info card about automatic unlocking */}
        <Card className="p-6 mb-8 border-dashed border-2 border-blue-300 bg-blue-50">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-3">
              <KeyRound className="h-8 w-8 text-blue-600 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-bold text-blue-800">Mini-Games Unlock Automatically</h3>
                <p className="text-sm text-blue-600">
                  Mini-games are unlocked automatically as you complete each section of the Career Race!
                </p>
              </div>
            </div>
            <Button 
              onClick={() => {
                // Check if we have a saved sector to return to
                const lastSector = localStorage.getItem('lastCareerQuizSector');
                if (lastSector) {
                 //  console.log(`Returning to Career Race at sector ${lastSector}`);
                  localStorage.setItem('currentSector', lastSector);
                  localStorage.setItem('returnToCareerQuiz', 'true');
                  window.location.replace('/quick-quiz');
                } else {
                  // Default to career quiz landing page
                  window.location.replace('/career-quiz');
                }
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Return to Career Race
            </Button>
          </div>
        </Card>
        
        {/* Color-coded key information */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Object.values(GAME_UNLOCK_KEYS).map((gameKey) => (
            <div 
              key={gameKey.gameId} 
              className={`p-4 rounded-lg flex items-center gap-3 bg-${gameKey.color}-50 border border-${gameKey.color}-200`}
            >
              <div className={`p-2 rounded-full bg-${gameKey.color}-100`}>
                {isGameUnlocked(gameKey.gameId) ? 
                  <Unlock className={`h-5 w-5 text-${gameKey.color}-600`} /> : 
                  <Lock className={`h-5 w-5 text-${gameKey.color}-600`} />
                }
              </div>
              <div>
                <h4 className={`font-semibold text-${gameKey.color}-800`}>
                  {gameKey.gameId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </h4>
                <p className={`text-xs text-${gameKey.color}-600`}>
                  {isGameUnlocked(gameKey.gameId) ? 'Unlocked' : 'Complete corresponding section to unlock'}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Games grid */}
        <h2 className="text-2xl font-bold mb-6">Available Games</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map(game => (
            <Card 
              key={game.id}
              className={`overflow-hidden transition-transform duration-300 hover:scale-[1.02] ${
                game.status === 'locked' ? 'opacity-60' : ''
              }`}
              onClick={() => {
                // Save the current sector if available
                const lastSector = localStorage.getItem('lastCareerQuizSector');
                if (lastSector) {
                  // Set returnToCareerQuiz flag
                  localStorage.setItem('returnToCareerQuiz', 'true');
                }
                navigate(game.route);
              }}
            >
              {/* Header */}
              <div className={`bg-gradient-to-r ${game.bgGradient} p-4 text-white`}>
                <div className="flex items-center">
                  <div className="bg-white/20 p-2 rounded-full">
                    {game.icon}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-bold text-xl">{game.name}</h3>
                    {game.status === 'coming-soon' && (
                      <span className="bg-white/30 text-white text-xs px-2 py-1 rounded-full">
                        Coming Soon
                      </span>
                    )}
                    {game.status === 'locked' && (
                      <span className="bg-white/30 text-white text-xs px-2 py-1 rounded-full">
                        Locked
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-4">
                <p className="text-gray-600 text-sm mb-4">{game.description}</p>
                
                <div className="mb-4">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Measures</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.metrics.map(metric => (
                      <span key={metric} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-xs font-semibold text-gray-500 uppercase mb-2">Brain Areas</h4>
                  <div className="flex flex-wrap gap-1">
                    {game.brainAreas.map(area => (
                      <span key={area} className="bg-indigo-50 text-indigo-700 text-xs px-2 py-1 rounded-full">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Footer */}
              <div className="border-t p-4">
                <button 
                  className={`w-full py-2 rounded-md font-medium ${
                    game.status === 'ready' 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                      : 'bg-gray-300 text-gray-600'
                  }`}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (game.status === 'ready') {
                      // Save the current sector if available
                      const lastSector = localStorage.getItem('lastCareerQuizSector');
                      if (lastSector) {
                        // Set returnToCareerQuiz flag
                        localStorage.setItem('returnToCareerQuiz', 'true');
                      }
                      navigate(game.route);
                    } else if (game.status === 'locked') {
                      // Show the user how to unlock this game
                      toast({
                        title: "Game Locked",
                        description: `Complete ${game.unlockSection} of the Career Race to unlock this game!`,
                        variant: "default",
                      });
                    }
                  }}
                >
                  {game.status === 'ready' 
                    ? 'Play Now' 
                    : 'Complete Section to Unlock'}
                </button>
              </div>
            </Card>
          ))}
        </div>
        
        {/* Info section */}
        <div className="mt-12 bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4">How Mini-Games Help Your Career Discovery</h2>
          <p className="text-gray-600 mb-4">
            These games are scientifically designed to measure different aspects of your cognitive profile, which helps match you with careers that align with your natural strengths and preferences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Brain Dominance</h3>
              <p className="text-gray-600 text-sm">
                Discover whether you have left-brain dominance (analytical, logical), right-brain dominance (creative, intuitive), or balanced processing, which influences your approach to problem-solving.
              </p>
            </div>
            <div className="border rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Cognitive Style</h3>
              <p className="text-gray-600 text-sm">
                Uncover your cognitive style—analytical, intuitive, strategic, creative, or practical—to understand your natural way of processing information and making decisions.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* No unlock dialog needed anymore since games are automatically unlocked */}
    </div>
  );
};

export default MiniGamesHub;