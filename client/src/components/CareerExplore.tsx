import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VoiceAssistant } from "@/components/ui/VoiceAssistant";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { useUser } from "@/context/UserContext";
import { avatars } from "@/data/avatarData";
import { generateRoadmap } from "@/utils/quizLogic";

export function CareerExplore() {
  const { 
    avatarId, 
    careerMatches,
    setScreen,
    generateRoadmap: generateCareerRoadmap
  } = useUser();
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === avatarId);
  
  // State for active tab and career data
  const [activeTab, setActiveTab] = useState('overview');
  
  // Find career data from the first match if available
  const careerData = careerMatches?.[0] || {
    title: "Software Developer",
    description: "Create applications and systems that power our digital world.",
    match: 92,
    skills: ["Problem Solving", "Creativity", "Technical Skills"],
    imagePath: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80",
    salary: "$110,140",
    growth: "+22% (2020-2030)"
  };
  
  // Handle back button
  const handleBackClick = () => {
    setScreen("results");
  };
  
  // Handle create roadmap button
  const handleCreateRoadmap = async () => {
    if (careerData) {
      await generateCareerRoadmap(careerData.title);
      setScreen("roadmap");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col pb-16">
      <header className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <button 
            className="text-gray-500 hover:text-gray-700"
            onClick={handleBackClick}
          >
            <i className="fas fa-arrow-left"></i>
          </button>
          <h1 className="font-poppins font-medium text-gray-800">{careerData.title}</h1>
          <button className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-bookmark"></i>
          </button>
        </div>
      </header>

      <main className="flex-1 p-0">
        {/* Career Hero Image */}
        <div className="relative h-48 bg-gray-100">
          <img 
            src={careerData.imagePath} 
            alt={careerData.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <div className="absolute bottom-4 left-4">
            <span className="bg-white rounded-full px-2 py-1 text-xs font-medium text-gray-700">
              {careerData.match}% Match
            </span>
          </div>
        </div>
        
        {/* Career Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="flex">
            <button 
              className={`flex-1 ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'} py-3 font-medium`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`flex-1 ${activeTab === 'shadowing' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'} py-3 font-medium`}
              onClick={() => setActiveTab('shadowing')}
            >
              Shadowing
            </button>
            <button 
              className={`flex-1 ${activeTab === 'roadmap' ? 'text-primary-600 border-b-2 border-primary-500' : 'text-gray-500'} py-3 font-medium`}
              onClick={() => setActiveTab('roadmap')}
            >
              Roadmap
            </button>
          </div>
        </div>
        
        {/* Career Content */}
        <div className="p-5">
          {/* Voice AI Assistant */}
          {currentAvatar && (
            <VoiceAssistant 
              message={`${careerData.title} is a great match for your analytical skills and creative problem-solving. Let me tell you what makes this career so exciting!`}
              avatarSrc={currentAvatar.src}
              name={currentAvatar.gender === 'female' ? 'Sophia' : 'Alex'}
            />
          )}
          
          {/* Career Details */}
          <div className="mb-6">
            <h2 className="font-poppins font-bold text-gray-800 text-xl mb-2">{careerData.title}</h2>
            <p className="text-gray-600 mb-4">{careerData.description}</p>
            
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-gray-700 text-sm font-medium mb-1">Average Salary</h3>
                <p className="text-gray-800 font-medium">{careerData.salary}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <h3 className="text-gray-700 text-sm font-medium mb-1">Growth Rate</h3>
                <p className="text-green-600 font-medium">{careerData.growth}</p>
              </div>
            </div>
          </div>
          
          {/* Key Skills */}
          <div className="mb-6">
            <h3 className="font-medium text-gray-800 mb-3">Key Skills</h3>
            <div className="flex flex-wrap gap-2">
              {careerData.skills.map((skill, index) => (
                <span key={index} className="bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full text-sm">{skill}</span>
              ))}
            </div>
          </div>
          
          {/* Shadowing Experience */}
          {activeTab === 'shadowing' && (
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Virtual Shadowing</h3>
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                <div className="relative aspect-video bg-gray-100">
                  <img 
                    src="https://images.unsplash.com/photo-1552581234-26160f608093?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80" 
                    alt={`${careerData.title} Shadowing`} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white bg-opacity-80 flex items-center justify-center">
                      <i className="fas fa-play text-primary-600 text-xl"></i>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-800 mb-1">A Day in the Life: {careerData.title}</h4>
                  <p className="text-sm text-gray-600">Follow Maria, a senior professional, as she works through her day.</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Get Started Button */}
          <Button 
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 px-4 rounded-xl transition-all flex items-center justify-center space-x-2"
            onClick={handleCreateRoadmap}
          >
            <span>Create My Career Roadmap</span>
            <i className="fas fa-arrow-right"></i>
          </Button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation 
        active="explore" 
        onNavigate={(screen) => {
          if (screen === 'results') {
            setScreen('results');
          } else if (screen === 'roadmap') {
            setScreen('roadmap');
          }
        }} 
      />
    </div>
  );
}
