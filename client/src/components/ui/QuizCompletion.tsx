import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { 
  FiAward, 
  FiStar, 
  FiArrowRight,
  FiCheckSquare,
  FiCpu,
  FiUsers,
  FiTrendingUp
} from 'react-icons/fi';
import { BsPersonCheck, BsStars, BsTrophy } from 'react-icons/bs';
import confetti from 'canvas-confetti';

interface QuizCompletionProps {
  points: number;
  onContinue: () => void;
}

export function QuizCompletion({ points, onContinue }: QuizCompletionProps) {
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  
  useEffect(() => {
    // Trigger confetti celebration
    const triggerConfetti = () => {
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;
      const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }

      const interval: NodeJS.Timeout = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          return clearInterval(interval);
        }

        const particleCount = 50 * (timeLeft / duration);
        
        // Custom confetti colors that match the app's theme
        const colors = ['#4F46E5', '#8B5CF6', '#EC4899', '#F59E0B', '#10B981'];
        
        // Fire confetti from both sides
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
          colors
        });
        
        confetti({
          ...defaults,
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
          colors
        });
      }, 250);
    };
    
    // Slight delay before triggering confetti
    setTimeout(() => {
      setShowConfetti(true);
      triggerConfetti();
    }, 500);
  }, []);
  
  // Randomize encouraging phrases
  const encouragingPhrases = [
    "Absolutely amazing work!",
    "You crushed it!",
    "Stellar performance!",
    "What an accomplishment!",
    "You're a superstar!"
  ];
  
  const randomPhrase = encouragingPhrases[Math.floor(Math.random() * encouragingPhrases.length)];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-md w-full animate-scaleIn">
      {/* Top celebration banner */}
      <div className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 text-white text-center overflow-hidden">
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-20">
          <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/20"></div>
          <div className="absolute -left-8 -bottom-8 w-36 h-36 rounded-full bg-white/10"></div>
        </div>
        
        <div className="relative z-10">
          <div className="mx-auto bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mb-4">
            <BsTrophy className="w-10 h-10 text-yellow-300" />
          </div>
          <h2 className="text-2xl font-bold mb-1">Quiz Complete!</h2>
          <p className="text-white/90 text-lg">{randomPhrase}</p>
          
          {/* Points display */}
          <div className="mt-4 bg-white/20 rounded-full px-4 py-2 inline-flex items-center">
            <BsStars className="mr-2 text-yellow-300" />
            <span className="font-bold">
              {points} Points Earned
            </span>
          </div>
        </div>
      </div>
      
      {/* Achievements */}
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-800">
          Your Assessment Results
        </h3>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="bg-blue-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mr-3">
                <FiCpu className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Cognitive Style</p>
                <p className="font-medium text-blue-800">Analyzer</p>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0 mr-3">
                <FiUsers className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Social Approach</p>
                <p className="font-medium text-purple-800">Collaborator</p>
              </div>
            </div>
          </div>
          
          <div className="bg-pink-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0 mr-3">
                <FiCheckSquare className="text-pink-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Work Style</p>
                <p className="font-medium text-pink-800">Creative</p>
              </div>
            </div>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mr-3">
                <FiTrendingUp className="text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Motivation</p>
                <p className="font-medium text-amber-800">Achiever</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-gray-600 mb-6">
            Ready to see which careers match your unique profile? 
            Your assessment reveals great insights about your potential!
          </p>
          
          <Button 
            onClick={onContinue}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white py-2 px-5 rounded-lg text-lg w-full"
          >
            Show My Career Matches
            <FiArrowRight className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}