import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowLeft, ChevronRight, Rocket, Stars, Check } from 'lucide-react';

// Ultra simple mini-game for maximum compatibility
const GalaxyExplorerPage: React.FC = () => {
  // Basic states
  const [gameStage, setGameStage] = useState<'intro' | 'playing' | 'results'>('intro');
  const [score, setScore] = useState(0);
  const [selectedPlanets, setSelectedPlanets] = useState<string[]>([]);
  
  // Career areas with their associated colors
  const careerAreas = [
    { id: 'tech', name: 'Technology', color: 'bg-blue-600', score: 10 },
    { id: 'creative', name: 'Creative Arts', color: 'bg-purple-600', score: 10 },
    { id: 'science', name: 'Science & Research', color: 'bg-green-600', score: 10 },
    { id: 'social', name: 'Social Sciences', color: 'bg-yellow-600', score: 10 },
    { id: 'healthcare', name: 'Healthcare', color: 'bg-red-600', score: 10 }
  ];
  
  // Handle selection of a career area
  const selectPlanet = (id: string) => {
    if (selectedPlanets.includes(id)) return;
    
    // Add to selected list
    setSelectedPlanets([...selectedPlanets, id]);
    
    // Add score
    const area = careerAreas.find(a => a.id === id);
    if (area) {
      setScore(prev => prev + area.score);
    }
    
    // Complete game if 3 areas selected
    if (selectedPlanets.length >= 2) { // This is the third selection
      setGameStage('results');
    }
  };
  
  // Start game handler
  const startGame = () => {
    setScore(0);
    setSelectedPlanets([]);
    setGameStage('playing');
  };
  
  // Restart game handler
  const restartGame = () => {
    setScore(0);
    setSelectedPlanets([]);
    setGameStage('playing');
  };
  
  // Intro screen
  if (gameStage === 'intro') {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold mb-2">Galaxy Explorer</h1>
          <p className="text-gray-600">
            Discover your career interests through a cosmic journey
          </p>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <h2 className="font-medium mb-2">How It Works</h2>
          <p className="text-sm">
            In this mini-game, you'll explore different career areas 
            represented as planets. Your choices will help us understand
            what career paths might suit you best.
          </p>
        </div>
        
        <div className="space-y-3 mb-6">
          <div className="flex gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">1</div>
            <div>
              <h3 className="font-medium">Select Career Areas</h3>
              <p className="text-sm text-gray-600">Choose 3 areas that interest you most</p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <div className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0">2</div>
            <div>
              <h3 className="font-medium">See Your Results</h3>
              <p className="text-sm text-gray-600">Discover what your choices reveal about you</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between">
          <Link href="/career-quiz">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-1 h-4 w-4" /> Back
            </Button>
          </Link>
          <Button onClick={startGame} className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            Start Exploring <Rocket className="ml-1 h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  }
  
  // Game playing screen
  if (gameStage === 'playing') {
    return (
      <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold">Select Career Areas</h1>
          <div className="text-sm">
            <span className="font-medium">{selectedPlanets.length}/3</span> selected
          </div>
        </div>
        
        <p className="text-sm text-gray-600 mb-4">
          Choose three career areas that interest you the most.
        </p>
        
        <div className="space-y-3 mb-6">
          {careerAreas.map((area) => (
            <div
              key={area.id}
              onClick={() => selectPlanet(area.id)}
              className={`
                ${area.color} text-white p-4 rounded-lg cursor-pointer
                ${selectedPlanets.includes(area.id) ? 'ring-2 ring-offset-2 ring-blue-500' : 'hover:opacity-90'}
                transition-all
              `}
            >
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{area.name}</h3>
                {selectedPlanets.includes(area.id) && (
                  <Check className="h-5 w-5" />
                )}
              </div>
            </div>
          ))}
        </div>
        
        <div className="bg-gray-100 p-3 rounded-lg text-sm mb-4">
          <div className="flex justify-between">
            <div>
              <span className="font-medium">Current Score:</span> {score} points
            </div>
            <div>
              <span className="font-medium">Selected:</span> {selectedPlanets.length}/3
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Results screen
  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-sm">
      <div className="text-center mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
          <Stars className="h-8 w-8 text-green-600" />
        </div>
        <h1 className="text-xl font-bold mb-1">Exploration Complete!</h1>
        <p className="text-sm text-gray-600">
          You've discovered your career preferences
        </p>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg text-center mb-6">
        <h2 className="text-2xl font-bold mb-1">{score} points</h2>
        <p className="text-sm">Based on your choices, you seem to prefer:</p>
        <div className="mt-2 flex flex-wrap gap-2 justify-center">
          {selectedPlanets.map(id => {
            const area = careerAreas.find(a => a.id === id);
            return area ? (
              <span key={id} className={`${area.color} text-white text-xs px-2 py-1 rounded-full`}>
                {area.name}
              </span>
            ) : null;
          })}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium mb-3">Career Recommendations</h3>
        <div className="space-y-2 text-sm">
          <div className="border p-3 rounded-lg">
            <div className="font-medium">Based on your interests:</div>
            <ul className="mt-1 list-disc list-inside">
              <li>User Experience Designer</li>
              <li>Research Scientist</li>
              <li>Healthcare Technologies Specialist</li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button variant="outline" size="sm" onClick={restartGame}>
          Play Again
        </Button>
        <Link href="/career-quiz">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white" size="sm">
            Continue <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default GalaxyExplorerPage;