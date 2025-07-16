import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { useLocation } from "wouter";

export default function OnboardingPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Check if user has quiz progress
    const sessionId = localStorage.getItem('currentQuizSessionId');
    const quizCompleted = sessionId && localStorage.getItem(`${sessionId}_quickQuizAnswers_complete`) === 'true';
    
    if (quizCompleted) {
      // If quiz is completed, auto-redirect to results
      toast({
        title: "Quiz already completed",
        description: "Redirecting you to your results",
      });
      setTimeout(() => {
        navigate('/results');
      }, 1000);
    } else {
      // Check if user is past section 1
      const currentSector = localStorage.getItem('currentSector');
      if (currentSector && parseInt(currentSector) > 1) {
        // If they already started, redirect to continue
        toast({
          title: "Quiz in progress",
          description: "Redirecting you to continue your quiz",
        });
        setTimeout(() => {
          navigate('/quick-quiz');
        }, 1000);
      }
    }
  }, [navigate, toast]);

  const handleContinueToQuiz = () => {
    navigate('/career-quiz');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-duo-green-100 to-duo-blue-50">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Card className="p-8 shadow-lg rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-duo-green-600 mb-4">Welcome to Lifetime GPS</h1>
            <p className="text-lg text-gray-700">
              Your personalized career guidance journey is about to begin!
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="p-4 bg-duo-blue-50 rounded-lg border border-duo-blue-200">
              <h2 className="font-semibold text-xl text-duo-blue-700 mb-2">What is Lifetime GPS?</h2>
              <p className="text-duo-blue-900">
                Lifetime GPS is your AI-powered career guidance system that helps you discover
                career paths perfectly aligned with your unique strengths, traits, and interests.
              </p>
            </div>
            
            <div className="p-4 bg-duo-purple-50 rounded-lg border border-duo-purple-200">
              <h2 className="font-semibold text-xl text-duo-purple-700 mb-2">How It Works</h2>
              <ul className="list-disc pl-5 text-duo-purple-900 space-y-2">
                <li>Complete the fun Career Race Quiz</li>
                <li>Unlock mini-games as you progress</li>
                <li>Get personalized career matches</li>
                <li>Explore your detailed career roadmap</li>
              </ul>
            </div>
            
            <div className="text-center pt-4">
              <Button 
                onClick={handleContinueToQuiz}
                className="bg-duo-green-500 hover:bg-duo-green-600 text-xl py-6 px-8 rounded-xl"
              >
                Start Your Career Race
              </Button>
              <p className="mt-4 text-gray-600 italic">
                Your journey to the perfect career starts here!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}