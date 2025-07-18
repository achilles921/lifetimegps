import { useState, useRef } from 'react';
import axios from 'axios';

export interface UseElevenLabsSpeechProps {
  voiceId: string;
  text: string;
  autoPlay?: boolean;
  voiceSettings?: {
    stability: number;
    similarity_boost: number;
  };
}

export interface UseElevenLabsSpeechReturn {
  play: () => Promise<void>;
  stop: () => void;
  isPlaying: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useElevenLabsSpeech({
  voiceId,
  text,
  autoPlay = false,
  voiceSettings = { stability: 0.5, similarity_boost: 0.75 },
}: UseElevenLabsSpeechProps): UseElevenLabsSpeechReturn {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  
  // Create audio element if it doesn't exist
  const getAudioElement = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.onpause = () => setIsPlaying(false);
      audioRef.current.onerror = () => {
        setError('Error playing audio');
        setIsPlaying(false);
      };
    }
    return audioRef.current;
  };
  
  // Function to generate speech
  const generateSpeech = async (): Promise<string> => {
    try {
      const response = await axios.post('/api/voice/speech', {
        text,
        voice_id: voiceId,
        voice_settings: voiceSettings
      }, {
        responseType: 'arraybuffer'
      });
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      
      // Clean up previous URL
      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current);
      }
      
      // Create new URL
      const url = URL.createObjectURL(blob);
      audioUrlRef.current = url;
      
      return url;
    } catch (err: any) {
      setError(err.message || 'Failed to generate speech');
      throw err;
    }
  };
  
  // Play audio
  const play = async () => {
    setError(null);
    
    if (!text || !voiceId) {
      setError('Missing text or voice ID');
      return;
    }
    
    const audio = getAudioElement();
    
    // If already playing, stop
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Generate new audio or use cached URL
      if (!audioUrlRef.current) {
        const url = await generateSpeech();
        audio.src = url;
      } else {
        audio.src = audioUrlRef.current;
      }
      
      // Play audio
      await audio.play();
      setIsPlaying(true);
    } catch (err: any) {
      setError(err.message || 'Failed to play audio');
      console.error('Error playing audio:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Stop audio
  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  return {
    play,
    stop,
    isPlaying,
    isLoading,
    error,
  };
}