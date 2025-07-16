import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/ui/VoiceAssistant";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { useUser } from "@/context/UserContext";
import { avatars } from "@/data/avatarData";

export function Results() {
  const { 
    avatarId, 
    careerMatches,
    setScreen,
  } = useUser();
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === avatarId);
  
  // State for active section
  const [activeSection, setActiveSection] = useState<'results' | 'explore' | 'roadmap' | 'profile'>('results');
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  
  // Function to navigate to career explore screen
  const handleExploreCareer = (careerTitle: string) => {
    setSelectedCareer(careerTitle);
    setScreen("careerExplore");
  };
  
  // Determine personality insights based on quiz responses
  // This would normally be calculated from actual quiz responses
  const personalityInsights = {
    workStyle: "Flexible & Creative",
    cognitiveStrength: "Knowledge-based",
    socialApproach: "Balanced Introvert",
    riskProfile: "Calculated Risks"
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="bg-gradient-to-r from-primary-600 to-primary-400 text-white p-5">
        <div className="flex items-center justify-between">
          <h1 className="font-poppins font-bold text-xl">Your Career Matches</h1>
          <button className="text-primary-100 w-8 h-8 rounded-full bg-primary-700 flex items-center justify-center">
            <i className="fas fa-share-alt"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 p-5">
        {/* Voice AI Assistant */}
        {currentAvatar && (
          <VoiceAssistant 
            message="Based on your answers, I've found some amazing career matches for you! Let's explore them together to find your perfect path."
            avatarSrc={currentAvatar.src}
            name={currentAvatar.gender === 'female' ? 'Sophia' : 'Alex'}
          />
        )}

        {/* Personality Insights */}
        <div className="bg-white rounded-xl shadow-sm p-5 mb-5">
          <h2 className="font-medium text-gray-800 text-lg mb-3">Your Career Personality</h2>
          
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-primary-50 rounded-lg p-3">
              <h3 className="text-primary-700 text-sm font-medium mb-1">Work Style</h3>
              <p className="text-gray-700">{personalityInsights.workStyle}</p>
            </div>
            <div className="bg-secondary-50 rounded-lg p-3">
              <h3 className="text-secondary-700 text-sm font-medium mb-1">Cognitive Strength</h3>
              <p className="text-gray-700">{personalityInsights.cognitiveStrength}</p>
            </div>
            <div className="bg-accent-50 rounded-lg p-3">
              <h3 className="text-accent-700 text-sm font-medium mb-1">Social Approach</h3>
              <p className="text-gray-700">{personalityInsights.socialApproach}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <h3 className="text-gray-700 text-sm font-medium mb-1">Risk Profile</h3>
              <p className="text-gray-700">{personalityInsights.riskProfile}</p>
            </div>
          </div>
          
          <button className="text-primary-600 text-sm font-medium flex items-center space-x-1">
            <span>See full personality insights</span>
            <i className="fas fa-chevron-right text-xs"></i>
          </button>
        </div>

        {/* Career Matches */}
        <h2 className="font-medium text-gray-800 text-lg mb-3">Your Top Career Matches</h2>
        
        {careerMatches && careerMatches.length > 0 ? (
          <div className="space-y-4 mb-6">
            {careerMatches.map((career, index) => (
              <div key={index} className="career-match bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="relative h-32 bg-gray-100">
                  <img 
                    src={career.imagePath} 
                    alt={career.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-3 right-3 bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700">
                    {career.match}% Match
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-poppins font-bold text-gray-800 mb-1">{career.title}</h3>
                  <p className="text-sm text-gray-600 mb-3">{career.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {career.skills.slice(0, 3).map((skill, idx) => (
                      <span key={idx} className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">{skill}</span>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button 
                      className="flex-1 bg-primary-500 hover:bg-primary-600 text-white font-medium py-2 px-3 rounded-lg transition-all text-sm"
                      onClick={() => handleExploreCareer(career.title)}
                    >
                      Explore Career
                    </Button>
                    <button className="w-10 h-8 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center">
                      <i className="fas fa-bookmark text-gray-500"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-5 text-center">
            <p className="text-gray-500">No career matches found. Please complete the assessment.</p>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        active="results" 
        onNavigate={(screen) => {
          if (screen === 'explore' && selectedCareer) {
            setScreen('careerExplore');
          } else if (screen === 'roadmap') {
            setScreen('roadmap');
          }
        }} 
      />
    </div>
  );
}
