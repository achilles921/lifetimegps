import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { QuizProgressBar } from "@/components/ui/ProgressBar";
import { VoiceAssistant } from "@/components/ui/VoiceAssistant";
import { interestOptions } from "@/data/quizData";
import { useUser } from "@/context/UserContext";
import { avatars } from "@/data/avatarData";
import { useToast } from "@/hooks/use-toast";

export function InterestSelection() {
  const { 
    avatarId, 
    setScreen, 
    saveQuizResponses,
    quizResponses
  } = useUser();
  const { toast } = useToast();
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === avatarId);
  
  // State for selected interests and their percentages
  const [selectedInterests, setSelectedInterests] = useState<Array<{id: number, name: string, percentage: number}>>([]);
  const [availableInterests, setAvailableInterests] = useState(interestOptions);
  
  // Calculate total percentage
  const totalPercentage = selectedInterests.reduce((total, interest) => total + interest.percentage, 0);
  const isComplete = totalPercentage === 100 && selectedInterests.length > 0;
  
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
    
    // Add interest with default 20% or remaining percentage
    const defaultPercentage = Math.min(20, 100 - totalPercentage);
    
    setSelectedInterests([
      ...selectedInterests, 
      { ...interest, percentage: defaultPercentage }
    ]);
    
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
      setSelectedInterests(selectedInterests.filter(i => i.id !== interestId));
    }
  };
  
  // Handle percentage change
  const handlePercentageChange = (interestId: number, newPercentage: number) => {
    // Ensure percentage is between 0 and remaining available
    const otherInterestsTotal = selectedInterests
      .filter(i => i.id !== interestId)
      .reduce((total, interest) => total + interest.percentage, 0);
    
    const maxAllowed = 100 - otherInterestsTotal;
    const validPercentage = Math.min(newPercentage, maxAllowed);
    
    setSelectedInterests(selectedInterests.map(interest => 
      interest.id === interestId 
        ? { ...interest, percentage: validPercentage } 
        : interest
    ));
  };
  
  // Handle back button
  const handleBackButton = () => {
    setScreen("quiz");
  };
  
  // Handle submit
  const handleCompleteQuiz = async () => {
    if (!isComplete) {
      toast({
        title: "Incomplete Selection",
        description: "Please select interests totaling exactly 100%",
        variant: "destructive"
      });
      return;
    }
    
    // Format responses for submission
    const formattedResponses = {
      sector1: quizResponses?.sector1 || {},
      sector2: quizResponses?.sector2 || {},
      sector3: quizResponses?.sector3 || {},
      sector4: quizResponses?.sector4 || {},
      sector5: selectedInterests.map(interest => ({
        interest: interest.name,
        percentage: interest.percentage
      }))
    };
    
    // Save responses
    const result = await saveQuizResponses(formattedResponses);
    
    if (result) {
      setScreen("results");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <QuizProgressBar />

      <main className="flex-1 p-5">
        {/* Voice AI Assistant */}
        {currentAvatar && (
          <VoiceAssistant 
            message="Now, let's talk about your interests! Select your top 5 areas and adjust the slider to show how much each one matters to you."
            avatarSrc={currentAvatar.src}
            name={currentAvatar.gender === 'female' ? 'Sophia' : 'Alex'}
          />
        )}

        {/* Interest Selection */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-4">
          <h2 className="font-medium text-gray-800 text-lg mb-1">Select your top 5 interests</h2>
          <p className="text-sm text-gray-500 mb-2">Adjust the sliders to total 100%</p>
          
          <div className="bg-blue-50 text-blue-800 p-3 rounded-md mb-4 text-sm flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 mt-0.5 flex-shrink-0">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 16v-4"></path>
              <path d="M12 8h.01"></path>
            </svg>
            <div>
              <span className="font-medium">Note:</span> You can select up to 5 different interest areas. Once selected, use the sliders to adjust how important each area is to you.
            </div>
          </div>
          
          {/* Interest Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-6">
            <div 
              className={`${totalPercentage === 100 ? 'bg-success' : 'bg-primary-500'} h-2.5 rounded-full`} 
              style={{ width: `${totalPercentage}%` }}
            ></div>
          </div>
          
          {/* Selected Interests with Sliders */}
          {selectedInterests.length > 0 ? (
            <div className="space-y-4 mb-6">
              {selectedInterests.map(interest => (
                <div key={interest.id} className="interest-item">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-5 h-5 bg-primary/10 rounded mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span className="text-gray-700 font-medium">{interest.name}</span>
                      <button 
                        className="ml-2 text-gray-400 hover:text-gray-600"
                        onClick={() => handleRemoveInterest(interest.id)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x-circle">
                          <circle cx="12" cy="12" r="10"></circle>
                          <path d="m15 9-6 6"></path>
                          <path d="m9 9 6 6"></path>
                        </svg>
                      </button>
                    </div>
                    <span className="text-sm text-primary-600 font-medium">{interest.percentage}%</span>
                  </div>
                  <input 
                    type="range" 
                    min="0" 
                    max="100" 
                    value={interest.percentage} 
                    onChange={(e) => handlePercentageChange(interest.id, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-500"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500 mb-6">
              Select interests from the list below to get started
            </div>
          )}
          
          {/* Additional Interests */}
          <h3 className="font-medium text-gray-700 mb-3">Add more interests</h3>
          <div className="grid grid-cols-2 gap-2">
            {availableInterests.map(interest => (
              <div 
                key={interest.id}
                className="interest-option border border-gray-200 rounded-lg p-3 hover:border-primary-300 hover:bg-primary-50 cursor-pointer transition-all flex items-center space-x-2"
                onClick={() => handleAddInterest(interest)}
              >
                <div className="w-4 h-4 rounded-sm border border-gray-300 flex items-center justify-center bg-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className="text-sm text-gray-700">{interest.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quiz Navigation */}
        <div className="flex justify-between">
          <Button 
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2 px-4 rounded-lg transition-all"
            onClick={handleBackButton}
          >
            Previous
          </Button>
          <Button 
            className="bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-4 rounded-lg transition-all"
            onClick={handleCompleteQuiz}
            disabled={!isComplete}
          >
            Complete & See Results
          </Button>
        </div>
      </main>
    </div>
  );
}
