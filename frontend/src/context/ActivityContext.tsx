import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';

// Match the ActivityEventType from the server schema
export type ActivityEventType = 
  | 'page_view'
  | 'quiz_start'
  | 'quiz_complete'
  | 'quiz_question_answer'
  | 'career_select'
  | 'voice_select'
  | 'mini_game_start'
  | 'mini_game_complete'
  | 'button_click'
  | 'avatar_select'
  | 'career_roadmap_view'
  | 'external_link_click'
  | 'signup'
  | 'login'
  | 'logout'
  | 'feedback_submit'
  | 'share';

// Match the ActivityEvent structure from the server
export interface ActivityEvent {
  id: string;
  timestamp: number;
  userId: number | null; // Changed to number to match integer in database
  sessionId: string;
  type: ActivityEventType;
  path: string;
  data?: any;
}

interface ActivityContextType {
  trackEvent: (type: ActivityEventType, data?: any) => void;
  activityEvents: ActivityEvent[];
  sessionId: string;
}

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export const ActivityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location] = useLocation();
  const [sessionId] = useState(() => {
    const existingSessionId = localStorage.getItem('activitySessionId');
    if (existingSessionId) return existingSessionId;
    
    const newSessionId = uuidv4();
    localStorage.setItem('activitySessionId', newSessionId);
    return newSessionId;
  });
  
  const [userId, setUserId] = useState<number | null>(null);
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>([]);
  const [lastEventFlush, setLastEventFlush] = useState<number>(Date.now());
  
  // Track page views automatically
  useEffect(() => {
    if (!location) return;
    
    const pageViewEvent: ActivityEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      userId,
      sessionId,
      type: 'page_view',
      path: location,
    };
    
    setActivityEvents(prev => [...prev, pageViewEvent]);
  }, [location, sessionId, userId]);
  
  // Flush events to the server periodically or when buffer gets large
  useEffect(() => {
    const shouldFlushEvents = 
      activityEvents.length >= 10 || // Flush when we have 10+ events
      (activityEvents.length > 0 && Date.now() - lastEventFlush > 30000); // Or after 30 seconds with pending events
    
    if (shouldFlushEvents) {
      const flushEvents = async () => {
        try {
          const eventsToSend = [...activityEvents];
          
          await apiRequest('POST', '/api/activity/track', { events: eventsToSend });
          
          // Clear the events that were sent
          setActivityEvents([]);
          setLastEventFlush(Date.now());
        } catch (error) {
          console.error('Error flushing activity events:', error);
        }
      };
      
      flushEvents();
    }
  }, [activityEvents, lastEventFlush]);
  
  // Flush events when user is about to leave the page
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (activityEvents.length > 0) {
        // We can't use async/await here because beforeunload needs to be synchronous
        // Use beacon API if available
        if (navigator.sendBeacon) {
          const blob = new Blob(
            [JSON.stringify({ events: activityEvents })], 
            { type: 'application/json' }
          );
          navigator.sendBeacon('/api/activity/track', blob);
        } else {
          // Fallback to synchronous XHR
          const xhr = new XMLHttpRequest();
          xhr.open('POST', '/api/activity/track', false); // false makes it synchronous
          xhr.setRequestHeader('Content-Type', 'application/json');
          xhr.send(JSON.stringify({ events: activityEvents }));
        }
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [activityEvents]);
  
  // Tracking function for components to use
  const trackEvent = useCallback((type: ActivityEventType, data?: any) => {
    const event: ActivityEvent = {
      id: uuidv4(),
      timestamp: Date.now(),
      userId,
      sessionId,
      type,
      path: location || '/',
      data,
    };
    
    setActivityEvents(prev => [...prev, event]);
  }, [location, sessionId, userId]);
  
  return (
    <ActivityContext.Provider value={{ trackEvent, activityEvents, sessionId }}>
      {children}
    </ActivityContext.Provider>
  );
};

export const useActivity = () => {
  const context = useContext(ActivityContext);
  if (context === undefined) {
    throw new Error('useActivity must be used within an ActivityProvider');
  }
  return context;
};