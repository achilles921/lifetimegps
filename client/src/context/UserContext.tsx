import React, { createContext, useContext, useState, useCallback } from 'react';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface UserContextType {
  avatarId: number | null;
  setAvatarId: (id: number) => void;
  screen: string;
  setScreen: (screen: string) => void;
  quizResponses: any;
  setQuizResponses: (responses: any) => void;
  saveQuizResponses: (responses: any) => Promise<boolean>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [avatarId, setAvatarId] = useState<number | null>(null);
  const [screen, setScreen] = useState<string>('interests');
  const [quizResponses, setQuizResponses] = useState<any>(null);
  const { toast } = useToast();

  // Function to save quiz responses to backend
  const saveQuizResponses = useCallback(async (responses: any): Promise<boolean> => {
    try {
      console.log('Saving quiz responses to backend:', responses);
      
      // Get current session ID
      const sessionId = localStorage.getItem('currentQuizSessionId') || `quiz_${Date.now()}`;
      
      // Get user email for authentication
      const userEmail = localStorage.getItem('userEmail');
      
      // Submit responses to server with authentication headers
      const response = await fetch('/api/quiz-responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-User-Email': userEmail || '',
          'X-Auth-Token': `Bearer ${userEmail}`,
        },
        body: JSON.stringify({
          sessionId: sessionId,
          responses: responses
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to save quiz responses: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Quiz responses saved successfully:', data);
      
      // Store career matches if returned
      if (data.careerMatches) {
        localStorage.setItem('careerMatches', JSON.stringify(data.careerMatches));
        console.log('Career matches stored in localStorage');
      }
      
      toast({
        title: "Quiz Complete!",
        description: "Your responses have been saved and career matches generated.",
      });
      
      return true;
    } catch (error) {
      console.error('Error saving quiz responses:', error);
      toast({
        title: "Error saving quiz",
        description: "There was a problem saving your quiz responses. Please try again.",
        variant: "destructive"
      });
      return false;
    }
  }, [toast]);

  const value = {
    avatarId,
    setAvatarId,
    screen,
    setScreen,
    quizResponses,
    setQuizResponses,
    saveQuizResponses
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}