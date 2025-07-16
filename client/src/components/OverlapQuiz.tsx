import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { getOverlapQuestions, processOverlapResponses } from '../utils/overlapQuiz';

interface OverlapQuizProps {
  overlapCategories: string[];
  originalMatches: Array<{title: string; match: number}>;
  onComplete: (
    refinedMatches: Array<{title: string; match: number}>, 
    explanations: Record<string, string>
  ) => void;
  onCancel: () => void;
}

const OverlapQuiz: React.FC<OverlapQuizProps> = ({ 
  overlapCategories, 
  originalMatches, 
  onComplete, 
  onCancel 
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Get relevant questions based on detected overlap categories
  const questions = getOverlapQuestions(overlapCategories);
  const currentQuestion = questions[currentQuestionIndex];
  
  // Handle option selection
  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };
  
  // Handle next question or completion
  const handleNext = () => {
    if (selectedOption === null) return;
    
    // Record response
    setResponses(prev => ({
      ...prev,
      [currentQuestion.id]: selectedOption
    }));
    
    // Reset selected option for next question
    setSelectedOption(null);
    
    // Check if more questions
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Process all responses and finalize
      const { refinedMatches, explanations } = processOverlapResponses(
        {...responses, [currentQuestion.id]: selectedOption},
        originalMatches
      );
      onComplete(refinedMatches, explanations);
    }
  };
  
  // Create an array to show progress through questions
  const progressDots = Array(questions.length).fill(0).map((_, i) => i);
  
  if (!currentQuestion) {
    return null;
  }
  
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Career Differentiation Quiz</CardTitle>
        <CardDescription>
          We found some overlap in your career matches. These quick questions will help us 
          provide more personalized recommendations.
        </CardDescription>
        
        {/* Question progress indicator */}
        <div className="flex justify-center gap-1 mt-2">
          {progressDots.map((dot, i) => (
            <div 
              key={i} 
              className={`h-2 w-2 rounded-full ${
                i === currentQuestionIndex ? 'bg-primary' : 
                i < currentQuestionIndex ? 'bg-primary/50' : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="text-lg font-medium">
            {currentQuestion.text}
          </div>
          
          <RadioGroup 
            value={selectedOption?.toString()} 
            onValueChange={(value) => handleOptionSelect(parseInt(value))}
          >
            <div className="space-y-3">
              {currentQuestion.options.map((option, i) => (
                <div key={i} className="flex items-start space-x-2">
                  <RadioGroupItem value={i.toString()} id={`option-${i}`} />
                  <Label 
                    htmlFor={`option-${i}`}
                    className="font-normal cursor-pointer"
                  >
                    {option.text}
                  </Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Skip Quiz
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={selectedOption === null}
        >
          {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Complete'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default OverlapQuiz;