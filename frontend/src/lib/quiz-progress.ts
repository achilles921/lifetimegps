import { apiRequest } from './queryClient';
import { getStoredAuth } from './authUtils';

export interface QuizProgress {
  hasProgress: boolean;
  currentSector: number;
  sectorResponses: Record<string, any>;
  completedSectors: number;
  isCompleted: boolean;
}

export async function saveQuizProgress(
  sessionId: string,
  currentSector: number,
  sectorData: Record<string, any>,
  questionId: string,
  answer: any
): Promise<void> {
  try {
    const authData = getStoredAuth();
    
    if (!authData.isLoggedIn || !authData.userId) {
      console.warn('No authenticated user found, skipping progress save');
      return;
    }

    const response = await fetch('/api/quiz-progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies
      body: JSON.stringify({
        sessionId,
        currentSector,
        sectorData,
        questionId,
        answer,
        userId: authData.userId
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
   //  console.log(`Quiz progress saved: sector ${currentSector}, question ${questionId}`);
  } catch (error) {
    console.error('Failed to save quiz progress:', error);
  }
}

export async function saveInterests(
  sessionId: string,
  interests: string[],
): Promise<void> {
  try {
    const authData = getStoredAuth();
    
    if (!authData.isLoggedIn || !authData.userId) {
      console.warn('No authenticated user found, skipping progress save');
      return;
    }

    const response = await fetch('/api/save-interests', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      // credentials: 'include', // Include cookies
      body: JSON.stringify({
        sessionId,
        interests,
        userId: authData.userId
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    ////  console.log(`Quiz progress saved: sector ${currentSector}, question ${questionId}`);
  } catch (error) {
    console.error('Failed to save quiz progress:', error);
  }
}

export async function getQuizProgress(): Promise<QuizProgress> {
  try {
    const authData = getStoredAuth();
    
    if (!authData.isLoggedIn || !authData.userId) {
      return {
        hasProgress: false,
        currentSector: 1,
        sectorResponses: {},
        completedSectors: 0,
        isCompleted: false
      };
    }

    const response = await fetch('/api/quiz-progress', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    
   //  console.log('Retrieved quiz progress:', data);
    return data;
  } catch (error) {
    console.error('Failed to get quiz progress:', error);
    return {
      hasProgress: false,
      currentSector: 1,
      sectorResponses: {},
      completedSectors: 0,
      isCompleted: false
    };
  }
}