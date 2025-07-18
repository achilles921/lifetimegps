import React, { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  ArrowLeft, 
  RefreshCw, 
  Briefcase, 
  GraduationCap, 
  Trophy, 
  Award, 
  BarChart3, 
  Star 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useToast } from '@/hooks/use-toast';
import { useActivity } from '@/context/ActivityContext';
import { careers } from '@/data/careerData';
import { processQuizResponses, generateCareerMatches } from '@/utils/quizLogic';

interface CareerDashboardProps {
  currentMatches: any[]; // Primary career matches
  onRefreshMatches?: () => void; // Callback when user wants new matches
  onSelectCareer?: (careerId: string) => void; // Callback when user selects a career
}

const CareerDashboard: React.FC<CareerDashboardProps> = ({ 
  currentMatches, 
  onRefreshMatches,
  onSelectCareer
}) => {
  const { toast } = useToast();
  const { trackEvent } = useActivity();
  const [selectedCareer, setSelectedCareer] = useState<string | null>(null);
  const [alternativeMatches, setAlternativeMatches] = useState<any[]>([]);
  const [showingAlternatives, setShowingAlternatives] = useState<boolean>(false);
  
  const handleSelectCareer = (careerId: string) => {
    setSelectedCareer(careerId);
    
    // Find the selected career data for tracking
    const selectedCareerData = [...currentMatches, ...alternativeMatches].find(
      career => career.id === careerId
    );
    
    // Track career selection event
    trackEvent('career_select', {
      careerId: careerId,
      careerTitle: selectedCareerData?.title,
      matchPercentage: selectedCareerData?.match,
      source: showingAlternatives ? 'alternative_suggestions' : 'primary_matches'
    });
    
    if (onSelectCareer) {
      onSelectCareer(careerId);
    }
    
    // Trigger confetti for celebration when selecting career
    confetti({
      particleCount: 80,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#58a700', '#a560f0', '#1cb0f6', '#ff9600'] // Duolingo colors
    });
  };
  
  const generateAlternativeMatches = () => {
    try {
      // First, check if we have stored additional matches from the quiz
      const allMatchesString = localStorage.getItem('allCareerMatches');
      
      if (allMatchesString) {
        // Use the pre-stored additional matches from the quiz
        const allMatches = JSON.parse(allMatchesString);
        
        // Filter out careers that are already in current matches
        const currentMatchIds = currentMatches.map(match => match.id);
        
        // Check if Entrepreneur/Business Owner is among the additional careers
        const entrepreneurMatch = allMatches.find(match => 
          match.title === "Entrepreneur/Business Owner" || 
          match.title.includes("Entrepreneur") || 
          match.title.includes("Business Owner")
        );
        
        // If Entrepreneur career exists but is not in current matches, prioritize it
        let additionalMatches = [];
        if (entrepreneurMatch && !currentMatchIds.includes(entrepreneurMatch.id)) {
          // Include entrepreneur and other matches
          additionalMatches = [
            entrepreneurMatch,
            ...allMatches.filter(match => 
              !currentMatchIds.includes(match.id) && 
              match.id !== entrepreneurMatch.id
            )
          ].slice(0, 5); // Get up to 5 alternatives including entrepreneur
        } else {
          // Get regular alternatives without special handling
          additionalMatches = allMatches
            .filter(match => !currentMatchIds.includes(match.id))
            .slice(0, 5); // Get up to 5 alternatives
        }
        
        setAlternativeMatches(additionalMatches);
        setShowingAlternatives(true);
        
        toast({
          title: "Additional Career Matches",
          description: "Here are some more career options that might interest you.",
          variant: "default",
        });
        return;
      }
      
      // Fallback to original approach if no stored matches
      // Get all quiz responses from localStorage
      const responses: any = {};
      
      // Get the current user's email
      const userEmail = localStorage.getItem('userEmail');
      
      // Get the current quiz session ID - prefer user-specific sessions if available
      let currentSessionId;
      
      if (userEmail) {
        // Search for session IDs that contain the user email
        const allKeys = Object.keys(localStorage);
        const userSessionKeys = allKeys.filter(key => 
          key.startsWith('quiz_') && 
          key.includes(userEmail) && 
          key.includes('_quickQuizAnswers_')
        );
        
        if (userSessionKeys.length > 0) {
          // Use the latest session (assuming it has timestamp in name)
          const latestKey = userSessionKeys.sort().pop();
          if (latestKey) {
            // Extract the session ID from the key format: [sessionId]_quickQuizAnswers_sector_1
            currentSessionId = latestKey.split('_quickQuizAnswers_')[0];
           //  console.log("Found user-specific quiz session:", currentSessionId);
          }
        }
      }
      
      // Fallback to current session ID if no user-specific session found
      if (!currentSessionId) {
        currentSessionId = localStorage.getItem('currentQuizSessionId') || 'default';
      }
      
     //  console.log("Using quiz session ID:", currentSessionId);
      
      // Get sector 1-4 answers
      for (let i = 1; i <= 4; i++) {
        const sectorKey = `${currentSessionId}_quickQuizAnswers_sector_${i}`;
        const sectorData = localStorage.getItem(sectorKey);
        if (sectorData) {
          responses[`sector${i}`] = JSON.parse(sectorData);
        }
      }
      
      // Get interests (sector 5)
      const sector5Key = `${currentSessionId}_quickQuizAnswers_sector_5`;
      const sector5Data = localStorage.getItem(sector5Key);
      if (sector5Data) {
        const sector5Answers = JSON.parse(sector5Data);
        responses.sector5 = sector5Answers;
      }
      
      // Process these responses
      const results = processQuizResponses(responses);
      
      // Generate career matches
      const allMatches = generateCareerMatches(results);
      
      // Specifically look for Entrepreneur/Business Owner in all matches
      const entrepreneurMatch = allMatches.find(match => 
        match.title === "Entrepreneur/Business Owner" || 
        match.title.includes("Entrepreneur") || 
        match.title.includes("Business Owner")
      );
      
      // Filter out careers that are already in current matches
      const currentMatchIds = currentMatches.map(match => match.id);
      
      // Prioritize entrepreneur if it exists and not already shown
      let alternatives = [];
      if (entrepreneurMatch && !currentMatchIds.includes(entrepreneurMatch.id)) {
        // Include entrepreneur first, then other top alternatives
        alternatives = [
          entrepreneurMatch,
          ...allMatches.filter(match => 
            !currentMatchIds.includes(match.id) && 
            match.id !== entrepreneurMatch.id
          )
        ].slice(0, 5); // Get top 5 alternatives including entrepreneur
      } else {
        alternatives = allMatches
          .filter(match => !currentMatchIds.includes(match.id))
          .slice(0, 5); // Get the top 5 alternatives
      }
      
      setAlternativeMatches(alternatives);
      setShowingAlternatives(true);
      
      toast({
        title: "Alternative Careers Found!",
        description: "Here are some additional career options that might interest you.",
        variant: "default",
      });
    } catch (error) {
      console.error("Error generating alternative matches:", error);
      toast({
        title: "Something went wrong",
        description: "Unable to generate alternative matches. Please try again.",
        variant: "destructive",
      });
      
      // Add entrepreneurship as a fallback option
      const entrepreneurOption = {
        id: "entrepreneur_business_owner",
        title: "Entrepreneur/Business Owner",
        description: "Build and run your own business ventures, identifying opportunities and bringing innovative ideas to market.",
        match: 85,
        skills: ["Leadership", "Strategic Planning", "Financial Management", "Marketing", "Risk Assessment"],
        education: "Various paths available - degree in Business/relevant field or practical experience",
        salary: "Variable (median $59,800 with potential for significant growth)",
        outlook: "+8% (2020-2030)",
        category: "Business"
      };
      
      // Get additional random careers for variety
      const randomMatches = [...careers]
        .filter(career => !career.title.includes("Entrepreneur") && !career.title.includes("Business Owner"))
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map(career => ({
          id: career.id || career.title.toLowerCase().replace(/\s+/g, '_'),
          title: career.title,
          description: career.description,
          match: Math.floor(Math.random() * 30) + 50, // Random match between 50-80%
          skills: career.skills,
          education: career.educationPath ? career.educationPath[0] : "Varies by pathway",
          salary: career.salary,
          outlook: career.growth || "Average",
          category: career.category || "Various"
        }));
      
      setAlternativeMatches([entrepreneurOption, ...randomMatches]);
      setShowingAlternatives(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-duo-purple-700">
          Your Personalized Career Dashboard
        </h2>
        <div className="flex gap-2">
          <Link href="/career-quiz" onClick={() => {
            trackEvent('button_click', {
              buttonId: 'retake_quiz',
              buttonText: 'Retake Quiz',
              context: 'career_dashboard'
            });
          }}>
            <Button variant="outline" className="border-2 border-duo-purple-300 text-duo-purple-700 hover:bg-duo-purple-100 rounded-xl">
              <RefreshCw className="mr-2 h-4 w-4" /> Retake Quiz
            </Button>
          </Link>
          <Button 
            onClick={() => {
              // Track the action of looking for more careers
              trackEvent('button_click', {
                buttonId: 'find_more_careers',
                buttonText: 'Find More Careers',
                context: 'career_dashboard'
              });
              
              if (onRefreshMatches) {
                onRefreshMatches();
              } else {
                generateAlternativeMatches();
              }
            }}
            className="bg-duo-orange-500 hover:bg-duo-orange-600 text-white rounded-xl"
          >
            <Star className="mr-2 h-4 w-4" /> Find More Careers
          </Button>
        </div>
      </div>
      
      {/* Main career matches */}
      <div className="grid grid-cols-1 gap-6">
        <h3 className="text-xl font-semibold text-duo-green-700 flex items-center gap-2">
          <Trophy className="h-5 w-5" /> Top Career Matches
        </h3>
        {currentMatches.map((career, index) => (
          <Card 
            key={index}
            className={`rounded-2xl hover:shadow-xl transition-all cursor-pointer border-2 ${
              selectedCareer === career.id 
                ? 'border-duo-green-500 bg-duo-green-50' 
                : 'border-gray-200 hover:border-duo-green-300'
            }`}
            onClick={() => handleSelectCareer(career.id)}
          >
            <CardHeader className="pb-2 relative">
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl font-bold text-duo-purple-700">{career.title}</CardTitle>
                <div className="bg-duo-green-500 text-white px-3 py-1 rounded-full font-bold">
                  {career.match}% Match
                </div>
              </div>
              <CardDescription className="text-gray-700 text-base mt-2">{career.description}</CardDescription>
              {selectedCareer === career.id && (
                <div className="absolute -right-2 -top-2 bg-duo-orange-500 text-white p-2 rounded-full">
                  <Star className="h-4 w-4" />
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-duo-blue-50 p-3 rounded-xl border border-duo-blue-200">
                  <div className="flex items-center gap-2 mb-1 text-duo-blue-700 font-medium">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </div>
                  <p className="text-duo-blue-800">{career.education}</p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-duo-purple-50 p-3 rounded-xl border border-duo-purple-200">
                    <div className="flex items-center gap-2 text-duo-purple-700 font-medium">
                      <Briefcase className="h-5 w-5" />
                      Salary
                    </div>
                    <p className="text-duo-purple-800 font-bold">{career.salary}</p>
                  </div>
                  
                  <div className="bg-duo-orange-50 p-3 rounded-xl border border-duo-orange-200">
                    <div className="flex items-center gap-2 text-duo-orange-700 font-medium">
                      <BarChart3 className="h-5 w-5" />
                      Outlook
                    </div>
                    <p className="text-duo-orange-800 font-bold">{career.outlook}</p>
                  </div>
                </div>
                
                <div>
                  <div className="mb-2 font-medium text-duo-green-700 flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Match Strength
                  </div>
                  <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-duo-green-500 to-duo-blue-500 rounded-full animate-pulse-slow"
                      style={{ width: `${career.match}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <div className="flex flex-wrap gap-2">
                {career.skills.map((skill: string, index: number) => (
                  <div 
                    key={index} 
                    className="px-3 py-1 bg-duo-green-100 border border-duo-green-200 text-duo-green-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </div>
                ))}
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      {/* Alternative matches */}
      {showingAlternatives && alternativeMatches.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold text-duo-orange-600 flex items-center gap-2 mb-4">
            <Award className="h-5 w-5" /> Alternative Career Paths
          </h3>
          
          <Alert className="mb-4 bg-duo-green-50 border-duo-green-200">
            <AlertTitle className="text-duo-green-700">Looking for more options?</AlertTitle>
            <AlertDescription className="text-duo-green-800">
              Explore these alternative career paths that match your profile in different ways. 
              Your preferences and skills could make you successful in multiple fields!
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {alternativeMatches.map((career, index) => (
              <Card 
                key={index}
                className="rounded-2xl hover:shadow-lg transition-all cursor-pointer border-2 border-gray-200 hover:border-duo-orange-300"
                onClick={() => handleSelectCareer(career.id)}
              >
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-bold text-duo-orange-700">{career.title}</CardTitle>
                    <div className="bg-duo-orange-500 text-white px-2 py-0.5 rounded-full text-sm font-bold">
                      {career.match}% Match
                    </div>
                  </div>
                  <CardDescription className="text-gray-700 text-sm mt-1 line-clamp-2">
                    {career.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4">
                  <div className="flex flex-wrap gap-1 mt-2">
                    {career.skills.slice(0, 3).map((skill: string, i: number) => (
                      <Badge key={i} variant="outline" className="bg-duo-orange-50 text-duo-orange-700 border-duo-orange-200">
                        {skill}
                      </Badge>
                    ))}
                    {career.skills.length > 3 && (
                      <Badge variant="outline" className="bg-duo-orange-50 text-duo-orange-700 border-duo-orange-200">
                        +{career.skills.length - 3} more
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CareerDashboard;