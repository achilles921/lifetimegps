import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Check, ArrowLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLocation } from 'wouter';
import { interestOptions } from '@/data/quizData';
import startImageSrc from '@assets/Start.png';
import gpsImageSrc from '@assets/GPS MILESTONES.png';
import confetti from 'canvas-confetti';

type InterestQuizStageProps = {
  currentSector: number;
  onComplete: (interests: string) => void;
  onBack: () => void;
};

export default function InterestQuizStage({ 
  onComplete, 
  onBack 
}: InterestQuizStageProps) {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  // Color palette for selected interests - update to use green for consistency
  const interestColors = [
    'bg-green-100 border-green-300 text-green-700',
    'bg-green-100 border-green-300 text-green-700',
    'bg-green-100 border-green-300 text-green-700',
    'bg-green-100 border-green-300 text-green-700',
    'bg-green-100 border-green-300 text-green-700'
  ];
  
  // State for selected interests with their colors
  const [selectedInterests, setSelectedInterests] = useState<Array<{id: number, name: string, color: string}>>([]);
  const [availableInterests, setAvailableInterests] = useState(interestOptions);
  
  // State for showing the congratulations message when 5 interests are selected
  const [showCongratulations, setShowCongratulations] = useState(false);

  // Effect to handle when 5 interests are selected
  useEffect(() => {
    if (selectedInterests.length === 5 && !showCongratulations) {
      // Show congratulations message after a short delay
      setTimeout(() => {
        setShowCongratulations(true);
        
        // Trigger confetti effect after congratulations appears
        setTimeout(() => {
          confetti({
            particleCount: 150,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#58a700', '#a560f0', '#1cb0f6', '#ff9600', '#10B981'] // Colorful palette
          });
          
          // Add a second burst of confetti
          setTimeout(() => {
            confetti({
              particleCount: 100,
              angle: 60,
              spread: 55,
              origin: { x: 0.2, y: 0.6 },
              colors: ['#10B981', '#4F46E5', '#EC4899']
            });
            confetti({
              particleCount: 100,
              angle: 120,
              spread: 55,
              origin: { x: 0.8, y: 0.6 },
              colors: ['#F59E0B', '#2563EB', '#84CC16']
            });
          }, 300);
        }, 200);
      }, 300);
    } else if (selectedInterests.length < 5 && showCongratulations) {
      // Hide congratulations if an interest is removed
      setShowCongratulations(false);
    }
  }, [selectedInterests.length, showCongratulations]);
  
  // Function to handle completing the quiz and redirecting to results
  const handleCompletionRedirect = () => {
    // Format the interests as a comma-separated list of IDs
    const interestIds = selectedInterests.map(interest => interest.id).join(',');
    
    // Log for debugging
   //  console.log("All 5 interests selected, saving data and redirecting to results");
    
    try {
      // Mark this step as completed in localStorage
      localStorage.setItem('interestSelectionCompleted', 'true');
      localStorage.setItem('selectedInterestIds', interestIds);
      
      // Save the interests data before redirecting
      onComplete(interestIds);
      
      // Don't redirect to signup - instead redirect directly to results
      window.location.href = '/results';
    } catch (error) {
      console.error("Error during interest selection completion:", error);
      // Fallback to standard navigation if localStorage fails
      setLocation('/results');
    }
  };
  
  // Handle adding an interest
  const handleAddInterest = (interest: {id: number, name: string}) => {
    if (selectedInterests.length >= 5) {
      toast({
        title: "Maximum Reached",
        description: "You can only select up to 5 interests. Remove one to add another.",
        variant: "destructive"
      });
      return;
    }
    
    // Get the next color in sequence
    const colorIndex = selectedInterests.length; 
    
    // Create new interests array with updated colors
    const newInterests = [
      ...selectedInterests, 
      { 
        ...interest, 
        color: interestColors[colorIndex]
      }
    ];
    
    setSelectedInterests(newInterests);
    
    // Remove from available interests
    setAvailableInterests(availableInterests.filter(i => i.id !== interest.id));
  };
  
  // Handle removing an interest
  const handleRemoveInterest = (interestId: number) => {
    const interestToRemove = selectedInterests.find(i => i.id === interestId);
    
    if (interestToRemove) {
      // Add back to available interests
      setAvailableInterests([
        ...availableInterests,
        { id: interestToRemove.id, name: interestToRemove.name }
      ]);
      
      // Remove from selected
      const newSelectedInterests = selectedInterests.filter(i => i.id !== interestId);
      setSelectedInterests(newSelectedInterests);
    }
  };
  
  // Handle submit
  const handleCompleteQuiz = () => {
    // For this simplified version, we'll accept any number of interests selected
    if (selectedInterests.length === 0) {
      toast({
        title: "No Interests Selected",
        description: "Please select at least one interest to continue",
        variant: "destructive"
      });
      return;
    }
    
    // Format the interests as a comma-separated list of IDs
    const interestIds = selectedInterests.map(interest => interest.id).join(',');
    
    // Pass the formatted interests back to the parent component
    onComplete(interestIds);
  };
  
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
            <h1 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md mb-2">Career Discovery Race</h1>
            <div className="flex gap-2 items-center">
              <div className="bg-background/80 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm">
                Final Section: Interest Selection
              </div>
            </div>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="absolute w-full h-2 bg-muted rounded-full"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all bg-emerald-500 text-white">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2 text-emerald-500 font-medium">Work Style</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all bg-emerald-500 text-white">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2 text-emerald-500 font-medium">Cognitive</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all bg-emerald-500 text-white">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2 text-emerald-500 font-medium">Personality</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all bg-emerald-500 text-white">
                <Check className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2 text-emerald-500 font-medium">Motivation</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full flex items-center justify-center z-10 transition-all bg-primary text-primary-foreground ring-4 ring-primary/20">
                5
              </div>
              <span className="text-xs mt-2 text-primary font-medium">Interests</span>
            </div>
          </div>
        </div>
        
        <div className="relative mb-4">
          <img 
            src={gpsImageSrc} 
            alt="GPS journey" 
            className="w-full h-16 object-cover object-left rounded-lg opacity-75"
          />
          <div className="absolute top-0 left-0 h-full" style={{width: '90%'}}>
            <div className="h-full bg-primary/20 rounded-l-lg"></div>
          </div>
          <Progress value={90} className="h-2 absolute bottom-0 left-0 w-full" />
        </div>
      </header>
      
      <Card className="w-full border-2 border-primary/20 p-6 mb-8">
        {/* Interest Selection */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="font-medium text-gray-800 text-lg mb-1">Select your top 5 interests</h2>
          <p className="text-sm text-gray-500 mb-2">Choose areas that you'd like to explore in your career</p>
          
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md mb-4 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <div>
              <span className="font-medium">Note:</span> You can select up to 5 different interest areas. Once you've selected all 5, you'll automatically see your career matches!
            </div>
          </div>
          
          {/* Progress Indicator */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className="bg-primary h-2.5 rounded-full" 
              style={{ width: `${(selectedInterests.length / 5) * 100}%` }}
            ></div>
          </div>
          
          {/* Congratulations Message when 5 interests are selected */}
          {showCongratulations ? (
            <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-400 rounded-lg p-6 mb-6 text-center shadow-md transform transition-all duration-500 scale-105">
              <div className="absolute top-0 right-0 left-0 h-1 bg-gradient-to-r from-green-400 via-green-500 to-green-400 rounded-t-lg"></div>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center shadow-inner">
                  <Check className="h-8 w-8 text-white" strokeWidth={3} />
                </div>
              </div>
              
              <h3 className="text-2xl font-bold text-green-800 mb-3">
                Congratulations! 🎉
              </h3>
              <h4 className="text-xl font-semibold text-green-700 mb-2">
                You've completed the Career Discovery Race!
              </h4>
              <p className="text-green-700 mb-5">
                You've selected 5 interests that will help us find your perfect career matches.
              </p>
              
              <button
                onClick={handleCompletionRedirect}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full shadow-md transform hover:scale-105 transition-all"
              >
                View My Career Matches
              </button>
            </div>
          ) : (
            <div className="py-2 text-center text-gray-600 mb-4">
              {selectedInterests.length === 0 
                ? "Select interests from the list below to get started" 
                : selectedInterests.length === 4
                  ? "Just one more interest to complete your profile!"
                  : `Selected ${selectedInterests.length} of 5 interests. ${5 - selectedInterests.length} more to go!`
              }
            </div>
          )}
          
          {/* Available Interests */}
          <h3 className="font-medium text-gray-700 mb-3">{selectedInterests.length === 0 ? 'Choose your interests' : 'Add more interests'}</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableInterests.map(interest => (
              <div 
                key={interest.id}
                className="interest-option border-2 rounded-lg p-3 cursor-pointer transition-all flex items-center space-x-2 border-gray-200 hover:border-green-500 hover:bg-green-50"
                onClick={() => handleAddInterest(interest)}
              >
                <div className="w-5 h-5 rounded-full border border-gray-300 flex items-center justify-center bg-white">
                  <Check className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-gray-700">{interest.name}</span>
              </div>
            ))}
          </div>
          
          {/* Small confetti animation for each selection */}
          {selectedInterests.length > 0 && (
            <div className="mt-4 text-center">
              <div className="inline-flex justify-center items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i < selectedInterests.length 
                        ? 'bg-green-500 scale-110' 
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              {selectedInterests.length < 5 && (
                <p className="text-xs text-gray-500 mt-1">
                  {5 - selectedInterests.length} more selections to complete
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
      
      {/* Footer navigation */}
      <div className="flex justify-between mt-6">
        <Button 
          variant="outline" 
          onClick={onBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Motivation
        </Button>
        
        <Button
          onClick={handleCompleteQuiz}
          className="bg-primary text-white hover:bg-primary/90"
          disabled={selectedInterests.length === 0}
        >
          Complete Assessment <Check className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}