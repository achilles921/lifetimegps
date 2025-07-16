import React, { useState, useEffect } from 'react';
import { runOverlapDifferentiation } from '../utils/overlapQuiz';
import OverlapQuiz from './OverlapQuiz';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface CareerOverlapHandlerProps {
  careerMatches: Array<{title: string; match: number}>;
  onRefinedMatches: (
    refinedMatches: Array<{title: string; match: number}>, 
    explanations: Record<string, string>
  ) => void;
}

const CareerOverlapHandler: React.FC<CareerOverlapHandlerProps> = ({ 
  careerMatches,
  onRefinedMatches
}) => {
  const [overlapState, setOverlapState] = useState<{
    hasOverlap: boolean;
    overlapCategories: string[];
    questions: any[];
    originalMatches: typeof careerMatches;
  } | null>(null);
  
  const [showQuiz, setShowQuiz] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  
  // Check for overlaps when career matches change
  useEffect(() => {
    if (careerMatches && careerMatches.length > 0) {
      const overlapResult = runOverlapDifferentiation(careerMatches);
      setOverlapState(overlapResult);
      
      // If overlap detected, show alert
      if (overlapResult.hasOverlap) {
        setShowAlert(true);
      } else {
        // No overlap, use original matches
        onRefinedMatches(careerMatches, {});
      }
    }
  }, [careerMatches]);
  
  // Handle quiz completion
  const handleQuizComplete = (
    refinedMatches: Array<{title: string; match: number}>, 
    explanations: Record<string, string>
  ) => {
    onRefinedMatches(refinedMatches, explanations);
    setShowQuiz(false);
  };
  
  // Skip quiz
  const handleSkipQuiz = () => {
    setShowQuiz(false);
    setShowAlert(false);
    // Use original matches if quiz is skipped
    onRefinedMatches(careerMatches, {});
  };
  
  // Start quiz
  const handleStartQuiz = () => {
    setShowQuiz(true);
    setShowAlert(false);
  };
  
  if (!overlapState) return null;
  
  if (!overlapState.hasOverlap) {
    return null; // No overlap detected, nothing to render
  }
  
  if (showQuiz) {
    return (
      <OverlapQuiz 
        overlapCategories={overlapState.overlapCategories}
        originalMatches={overlapState.originalMatches}
        onComplete={handleQuizComplete}
        onCancel={handleSkipQuiz}
      />
    );
  }
  
  if (showAlert) {
    return (
      <Alert className="mb-4">
        <AlertTitle>We found some similar career matches!</AlertTitle>
        <AlertDescription className="flex flex-col gap-3">
          <p>
            We noticed some overlap in your top career matches. A quick 2-minute quiz 
            can help us provide more personalized recommendations within these fields:
            {overlapState.overlapCategories.map(cat => {
              // Format category name (e.g., "business-management" -> "Business & Management")
              const formatted = cat
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' & ');
              return ` ${formatted},`;
            }).join('').slice(0, -1)}
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handleSkipQuiz}>
              Skip
            </Button>
            <Button onClick={handleStartQuiz}>
              Take Quiz
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }
  
  return null;
};

export default CareerOverlapHandler;