import { useSpeech } from "@/hooks/useSpeech";
import { useState, useEffect } from "react";
import { useUser } from "@/context/UserContext";
import { FiPause, FiPlay, FiRepeat } from "react-icons/fi";

interface VoiceAssistantProps {
  message: string;
  avatarSrc: string;
  autoPlay?: boolean;
  name?: string;
}

export function VoiceAssistant({ 
  message, 
  avatarSrc, 
  autoPlay = true,
  name = "Gail"  // Changed default name to Gail to match voice style
}: VoiceAssistantProps) {
  const { voiceType } = useUser();
  const { 
    speak, 
    pause, 
    resume, 
    repeat, 
    isSpeaking, 
    isPaused, 
    isReady 
  } = useSpeech({ voiceType: voiceType || 'female' });
  
  // Auto play the message when component mounts
  useEffect(() => {
    if (autoPlay && isReady && message) {
      // Add a slight delay to ensure the voice is fully loaded
      const timer = setTimeout(() => {
        speak(message);
      }, 200);
      
      return () => clearTimeout(timer);
    }
  }, [autoPlay, isReady, message, speak]);

  // Handle pause/resume
  const togglePause = () => {
    if (isPaused) {
      resume();
    } else {
      pause();
    }
  };

  return (
    <div className="mb-6 card-hover bg-white rounded-lg p-5 shadow-md flex items-start space-x-4">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden shrink-0 ring-2 ring-offset-2 ring-primary/20">
        <img src={avatarSrc} alt="AI Assistant" className="object-cover w-full h-full" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2 mb-2">
          <h3 className="font-medium text-foreground">{name}</h3>
          {isSpeaking && (
            <div className="pulse-animation flex space-x-1 items-center bg-secondary/10 px-2 py-1 rounded-full">
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse"></div>
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              <span className="text-xs text-secondary ml-1">Speaking</span>
            </div>
          )}
        </div>
        <p className="text-muted-foreground mb-3">{message}</p>
        
        {/* Show voice controls if speech synthesis is ready */}
        {isReady ? (
          <div className="flex items-center space-x-2">
            <button 
              className="text-xs border border-muted bg-background hover:bg-muted text-muted-foreground py-1.5 px-3 rounded-full flex items-center space-x-1.5 transition-colors"
              onClick={togglePause}
              aria-label={isPaused ? 'Resume speaking' : 'Pause speaking'}
            >
              {isPaused ? <FiPlay className="text-xs" /> : <FiPause className="text-xs" />}
              <span>{isPaused ? 'Resume' : 'Pause'}</span>
            </button>
            <button 
              className="text-xs border border-muted bg-background hover:bg-muted text-muted-foreground py-1.5 px-3 rounded-full flex items-center space-x-1.5 transition-colors"
              onClick={repeat}
              aria-label="Repeat message"
            >
              <FiRepeat className="text-xs" />
              <span>Repeat</span>
            </button>
          </div>
        ) : (
          <div className="text-xs text-amber-500 italic">
            Voice synthesis is not available in your browser. Please try a different browser like Chrome for the voice feature.
          </div>
        )}
      </div>
    </div>
  );
}
