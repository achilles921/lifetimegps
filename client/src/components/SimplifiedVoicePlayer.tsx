import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Loader2, Volume2, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { isBraveBrowser, createCompatibleAudio } from '@/lib/utils';

interface VoicePlayerProps {
  voiceId: string;
  voiceName: string;
  previewUrl?: string;
}

// Explicitly define AudioElement type to fix TypeScript issues
type AudioElement = HTMLAudioElement & {
  src: string;
  play: () => Promise<void>;
  pause: () => void;
  onended: null | ((this: GlobalEventHandlers, ev: Event) => any);
  onpause: null | ((this: GlobalEventHandlers, ev: Event) => any);
  onplay: null | ((this: GlobalEventHandlers, ev: Event) => any);
  onerror: null | ((this: GlobalEventHandlers, ev: Event) => any);
};

const SimplifiedVoicePlayer: React.FC<VoicePlayerProps> = ({ voiceId, voiceName, previewUrl }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  // Use proper AudioElement type for ref
  const audioRef = useRef<AudioElement | null>(null);
  const [isBrave, setIsBrave] = useState<boolean>(false);
  
  // Create audio element ref on mount
  useEffect(() => {
    const audio = new Audio();
    audio.onended = () => setIsPlaying(false);
    audio.onpause = () => setIsPlaying(false);
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        URL.revokeObjectURL(audioRef.current.src);
        audioRef.current = null;
      }
    };
  }, []);
  
  // Detect browser on mount
  useEffect(() => {
    setIsBrave(isBraveBrowser());
  }, []);

  // Preload audio for Brave browser
  useEffect(() => {
    if (isBrave && voiceId && previewUrl) {
      loadAudioFile();
    }
  }, [voiceId, isBrave, previewUrl]);

  // Load the audio file directly via axios
  const loadAudioFile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('Fetching audio file directly for Brave compatibility');
      
      // Use the preview URL if available, otherwise fallback to our API
      const url = previewUrl || `/api/voice/preview/${voiceId}?t=${Date.now()}`;
      
      const response = await axios.get(url, {
        responseType: 'arraybuffer'
      });
      
      // Create a blob from the response
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      setAudioBlob(blob);
      
      if (audioRef.current) {
        audioRef.current.src = URL.createObjectURL(blob);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error preloading audio file:', err);
      setError('Could not preload audio file');
      setIsLoading(false);
    }
  };
  
  // Play audio using the most compatible method for the browser
  const playAudio = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Use the preview URL if available, otherwise fallback to our API
      const audioUrl = previewUrl || `/api/voice/preview/${voiceId}?t=${Date.now()}`;
      
      console.log("Using audio URL:", audioUrl);
      
      // For Brave: Use our specialized audio handling
      if (isBrave) {
        // Use the preloaded blob if available
        if (audioBlob) {
          if (audioRef.current) {
            audioRef.current.src = URL.createObjectURL(audioBlob);
            await audioRef.current.play();
            setIsPlaying(true);
            setIsLoading(false);
            return;
          }
        } else {
          // Try to load the audio file if not already loaded
          await loadAudioFile();
          if (audioRef.current && audioBlob) {
            audioRef.current.src = URL.createObjectURL(audioBlob);
            await audioRef.current.play();
            setIsPlaying(true);
            setIsLoading(false);
            return;
          }
        }
      }
      
      // Use our compatible audio utility for cross-browser support
      const audio = createCompatibleAudio(audioUrl, isBrave);
      
      // Set up event handlers
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
      };
      
      audio.onended = audio.onpause = () => {
        setIsPlaying(false);
      };
      
      audio.onerror = (e) => {
        console.error('Audio playback error:', e);
        setError('Failed to play audio. Please try again.');
        setIsPlaying(false);
        setIsLoading(false);
      };
      
      // Start playing
      await audio.play().catch(err => {
        console.warn('Initial play failed, retrying with fetch approach:', err);
        // If direct play fails, try the fetch approach which works better in some cases
        fetch(audioUrl)
          .then(response => response.blob())
          .then(blob => {
            const blobUrl = URL.createObjectURL(blob);
            audio.src = blobUrl;
            return audio.play();
          })
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch(fetchErr => {
            console.error('Both play methods failed:', fetchErr);
            throw fetchErr;
          });
      });
      
    } catch (err) {
      console.error('Error playing audio:', err);
      setError('Error playing audio');
      setIsPlaying(false);
      setIsLoading(false);
    }
  };
  
  return (
    <div className="p-3 border rounded bg-slate-50 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{voiceName || 'Voice Sample'}</span>
        <button
          onClick={playAudio}
          disabled={isLoading || isPlaying}
          className="p-2 rounded-full bg-primary text-white hover:bg-primary/90 transition-colors"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-4 h-4" />
          ) : (
            <Play className="w-4 h-4" />
          )}
        </button>
      </div>
      
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
      
      <div className="text-xs text-muted-foreground">
        <p>This will play a short sample of the selected voice.</p>
      </div>
    </div>
  );
};

export default SimplifiedVoicePlayer;