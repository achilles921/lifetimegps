import React, { useState, useEffect } from 'react';
import { useNavigate } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { QuizExperience } from './QuizExperience';
import { apiRequest } from '@/lib/queryClient';

interface QuizProps {
  sessionId?: string;
  guestMode?: boolean;
}

export function Quiz({ sessionId, guestMode = true }: QuizProps) {
  const [isStarted, setIsStarted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [results, setResults] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if quiz has already been completed for this session
  useEffect(() => {
    if (sessionId) {
      const checkSession = async () => {
        try {
          const response = await apiRequest('GET', `/api/guest-session/${sessionId}`);
          const data = await response.json();
          
          if (data.careerMatches && data.careerMatches.length > 0) {
            // Quiz already completed, redirect to results
            navigate('/results');
          }
        } catch (error) {
          console.error('Error checking session:', error);
        }
      };
      
      checkSession();
    }
  }, [sessionId, navigate]);

  // Handle starting the quiz
  const handleStart = () => {
    setIsStarted(true);
  };

  // Handle quiz completion
  const handleComplete = async (quizResponses: any) => {
    setIsComplete(true);
    setResults(quizResponses);
    
    if (guestMode && quizResponses) {
      // Submit responses to server
      setIsSubmitting(true);
      
      try {
        const response = await apiRequest('POST', '/api/quiz-responses', {
          sessionId: sessionId || quizResponses.sessionId,
          responses: quizResponses.responses
        });
        
        const data = await response.json();
        
        if (data.careerMatches) {
          // Wait a moment to show completion message
          setTimeout(() => {
            navigate('/results');
          }, 3000);
        } else {
          toast({
            title: "Error processing results",
            description: "There was a problem processing your quiz results. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error('Error submitting quiz responses:', error);
        toast({
          title: "Error submitting quiz",
          description: "There was a problem submitting your quiz responses. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // If quiz not started, show intro screen
  if (!isStarted) {
    return (
      <div className="max-w-3xl mx-auto p-4 py-12">
        <Card className="p-8 text-center shadow-lg bg-gradient-to-br from-slate-50 to-slate-100">
          <h1 className="text-3xl font-bold mb-4">Discover Your Perfect Career Path</h1>
          
          <p className="mb-6 text-lg">
            Ready to find where your unique talents and passions can lead you? 
            Our interactive assessment uses cutting-edge AI to map your perfect career journey.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl mb-2">🎮</div>
              <h3 className="font-medium mb-1">Fun & Engaging</h3>
              <p className="text-sm text-muted-foreground">
                Play interactive games that reveal your unique strengths and preferences
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl mb-2">🔍</div>
              <h3 className="font-medium mb-1">Personalized Results</h3>
              <p className="text-sm text-muted-foreground">
                Discover career paths perfectly matched to your personality
              </p>
            </div>
            
            <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-200">
              <div className="text-2xl mb-2">🗺️</div>
              <h3 className="font-medium mb-1">Clear Roadmap</h3>
              <p className="text-sm text-muted-foreground">
                Get a step-by-step plan to achieve success in your chosen field
              </p>
            </div>
          </div>
          
          <p className="mb-8 text-muted-foreground">
            This assessment takes approximately 15-20 minutes to complete.
            You'll have fun while discovering valuable insights about your career potential!
          </p>
          
          <Button 
            size="lg" 
            onClick={handleStart}
            className="bg-gradient-to-r from-primary to-purple-600 text-white px-8"
          >
            Start My Assessment
          </Button>
        </Card>
      </div>
    );
  }

  // If quiz completed but waiting for results processing
  if (isComplete) {
    return (
      <div className="max-w-3xl mx-auto p-4 py-12 text-center">
        <h2 className="text-2xl font-bold mb-4">Assessment Complete!</h2>
        
        <p className="mb-8">
          {isSubmitting ? (
            "Processing your results..."
          ) : (
            "Your results are ready! Let's explore your perfect career matches."
          )}
        </p>
        
        {isSubmitting ? (
          <div className="flex justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : (
          <Button 
            size="lg" 
            onClick={() => navigate('/results')}
            className="bg-gradient-to-r from-primary to-purple-600 text-white"
          >
            View My Results
          </Button>
        )}
      </div>
    );
  }

  // Render quiz experience
  return (
    <div className="max-w-4xl mx-auto p-4">
      <QuizExperience
        sessionId={sessionId}
        onComplete={handleComplete}
      />
    </div>
  );
}