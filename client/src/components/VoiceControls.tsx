import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { 
  Play, 
  Pause, 
  VolumeX, 
  Volume2, 
  RefreshCw,
  Mic,
  Headphones,
  Info
} from 'lucide-react';
import SimplifiedVoicePlayer from './SimplifiedVoicePlayer';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { usePerformance } from '@/context/PerformanceContext';

// Voice type matching the API response
interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  gender: 'male' | 'female' | 'other';
  accent?: string;
  ethnicity?: string; // Added ethnicity field
  description?: string;
}

interface VoiceControlsProps {
  gender: 'male' | 'female';
  initialText?: string;
  onVoiceChange?: (voiceId: string) => void;
}

const VoiceControls: React.FC<VoiceControlsProps> = ({
  gender,
  initialText = '',
  onVoiceChange,
}) => {
  // State
  const [text, setText] = useState<string>(initialText);
  const [selectedVoice, setSelectedVoice] = useState<string | undefined>(undefined);
  const [volume, setVolume] = useState<number>(80);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [voicesLoading, setVoicesLoading] = useState<boolean>(true);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [voicesError, setVoicesError] = useState<boolean>(false);
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const previousVolumeRef = useRef<number>(80);
  
  // Context
  const { isLowPowerMode } = usePerformance();
  
  // Fetch voices directly
  useEffect(() => {
    async function fetchVoices() {
      try {
        setVoicesLoading(true);
        console.log(`Directly fetching voices for gender: ${gender}`);
        
        const response = await fetch(`/api/voice/voices/${gender}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        
        const data = await response.json();
        console.log(`Fetched ${data.length} ${gender} voices:`, data);
        
        // Debug preview URLs
        for (const voice of data) {
          console.log(`Voice ${voice.name} preview URL:`, voice.preview_url || 'No preview URL');
        }
        
        setVoices(data);
        setVoicesError(false);
      } catch (error) {
        console.error('Error fetching voices:', error);
        setVoicesError(true);
      } finally {
        setVoicesLoading(false);
      }
    }
    
    if (gender) {
      fetchVoices();
    }
  }, [gender]);
  
  // Initialize audio element
  useEffect(() => {
    const audio = new Audio();
    audio.onended = () => setIsPlaying(false);
    audio.onpause = () => setIsPlaying(false);
    audio.onplay = () => setIsPlaying(true);
    audioRef.current = audio;
    
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);
  
  // Set volume when it changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);
  
  // Auto-select the first voice when voices load
  useEffect(() => {
    if (voices.length > 0 && !selectedVoice) {
      console.log(`Auto-selecting first voice: ${voices[0].name} (${voices[0].voice_id})`);
      const defaultVoice = voices[0].voice_id;
      setSelectedVoice(defaultVoice);
      if (onVoiceChange) {
        onVoiceChange(defaultVoice);
      }
    }
  }, [voices, selectedVoice, onVoiceChange]);
  
  // Handlers
  
  // Toggle play/pause
  const handlePlayToggle = async () => {
    if (!audioRef.current || !selectedVoice) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // If we already have an audio source, just play it
      if (audioRef.current.src) {
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      } else {
        // Otherwise, generate new audio
        await generateSpeech();
      }
    }
  };
  
  // Generate speech from text
  const generateSpeech = async () => {
    if (!selectedVoice || !text) return;
    
    setIsLoading(true);
    
    try {
      console.log(`Generating speech with voice ${selectedVoice}:`, text.substring(0, 50) + "...");
      
      const response = await axios.post('/api/voice/speech', {
        text,
        voice_id: selectedVoice,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75
        }
      }, {
        responseType: 'arraybuffer'
      });
      
      // Create blob from response
      const blob = new Blob([response.data], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      // Update audio source and play
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play().catch(err => console.error('Error playing audio:', err));
      }
    } catch (error) {
      console.error('Error generating speech:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Toggle mute/unmute
  const handleMuteToggle = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      // Unmute: restore previous volume
      setVolume(previousVolumeRef.current);
      audioRef.current.volume = previousVolumeRef.current / 100;
    } else {
      // Mute: save current volume and set to 0
      previousVolumeRef.current = volume;
      setVolume(0);
      audioRef.current.volume = 0;
    }
    
    setIsMuted(!isMuted);
  };
  
  // Play a preview of a voice using our direct API endpoint
  const playVoicePreview = async (voice: Voice) => {
    if (!audioRef.current) return;
    
    // Stop current playback
    if (isPlaying) {
      audioRef.current.pause();
    }
    
    try {
      console.log(`Playing preview for voice: ${voice.name}`);
      
      // Always use our custom preview endpoint
      const previewUrl = `/api/voice/preview/${voice.voice_id}`;
      console.log("Using preview URL:", previewUrl);
      
      // Set a loading state
      setIsLoading(true);
      
      // Load and play
      audioRef.current.src = previewUrl;
      await audioRef.current.play();
    } catch (error) {
      console.error('Error playing preview:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Change selected voice
  const handleVoiceChange = (voiceId: string) => {
    console.log(`Changing voice to: ${voiceId}`);
    setSelectedVoice(voiceId);
    
    // Stop current playback when voice changes
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    // Reset the audio source to force regeneration with new voice
    if (audioRef.current) {
      audioRef.current.src = '';
    }
    
    if (onVoiceChange) {
      onVoiceChange(voiceId);
    }
    
    // Play preview of the selected voice
    const selectedVoiceData = voices.find(v => v.voice_id === voiceId);
    if (selectedVoiceData) {
      playVoicePreview(selectedVoiceData);
    }
  };
  
  // UI
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-background shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-medium flex items-center">
          <Mic className="w-4 h-4 mr-2" />
          Voice Controls {gender && `(${gender.charAt(0).toUpperCase() + gender.slice(1)})`}
        </h3>
        
        {isLowPowerMode && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
            Low Power Mode
          </span>
        )}
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium">Voice Selection</label>
        
        {voicesLoading ? (
          <div className="text-center text-sm text-muted-foreground py-2">
            Loading voices...
          </div>
        ) : voices.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-2">
            No voices available
          </div>
        ) : (
          <div className="space-y-3">
            <Select 
              disabled={isLoading} 
              value={selectedVoice}
              onValueChange={handleVoiceChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a voice" />
              </SelectTrigger>
              <SelectContent>
                {voices.map((voice) => (
                  <SelectItem key={voice.voice_id} value={voice.voice_id}>
                    {voice.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedVoice && (
              <div className="space-y-2">
                <button
                  onClick={() => {
                    const voice = voices.find(v => v.voice_id === selectedVoice);
                    if (voice) {
                      console.log("Manually playing preview for:", voice.name);
                      console.log("Preview URL:", voice.preview_url);
                      playVoicePreview(voice);
                    }
                  }}
                  disabled={isLoading}
                  className="w-full flex items-center justify-center py-1 px-2 text-sm rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Loading Sample...
                    </>
                  ) : (
                    <>
                      <Headphones className="w-4 h-4 mr-2" />
                      Listen to Sample
                    </>
                  )}
                </button>
                
                {/* Audio preview section using our simplified player */}
                <div className="mt-2 space-y-4">
                  {/* Original HTML5 Audio Element */}
                  <div className="p-3 border rounded-md bg-slate-50 min-h-[150px]">
                    <p className="text-sm font-medium mb-2 flex items-center">
                      <Headphones className="w-4 h-4 mr-2" /> 
                      Voice Sample - HTML5 Audio
                    </p>
                    
                    <div className="bg-white p-2 rounded border mb-2">
                      <audio 
                        controls 
                        key={`html5-${selectedVoice}-${Date.now()}`} // Force new instance on voice change
                        src={`/api/voice/preview/${selectedVoice}?t=${Date.now()}`} // Cache busting
                        className="w-full h-10"
                        preload="auto"
                      >
                        Your browser does not support the audio element.
                      </audio>
                    </div>
                  </div>
                  
                  {/* Simplified Player */}
                  <SimplifiedVoicePlayer 
                    voiceId={selectedVoice} 
                    voiceName={voices.find(v => v.voice_id === selectedVoice)?.name || 'Selected Voice'}
                    previewUrl={voices.find(v => v.voice_id === selectedVoice)?.preview_url}
                  />
                </div>
              </div>
            )}
          </div>
        )}
        
        {voicesError && (
          <p className="text-sm text-red-500">Error loading voices. Please try again.</p>
        )}
      </div>
      
      <div className="space-y-3">
        <label className="block text-sm font-medium">Sample Text</label>
        <textarea
          className="w-full px-3 py-2 border rounded-md h-24 text-sm"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text to synthesize speech..."
          disabled={isLoading}
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={handlePlayToggle}
          disabled={isLoading || !selectedVoice}
          className="p-2 rounded-full bg-primary text-primary-foreground disabled:opacity-50"
          title={isPlaying ? "Pause" : "Play"}
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : isPlaying ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Play className="w-5 h-5" />
          )}
        </button>
        
        <button
          onClick={handleMuteToggle}
          className="p-2 rounded-full bg-secondary text-secondary-foreground"
          title={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
        
        <div className="flex-1 mx-2">
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={values => setVolume(values[0])}
            disabled={isMuted}
            aria-label="Volume"
          />
        </div>
        
        <span className="text-xs font-mono w-8 text-center">
          {volume}%
        </span>
      </div>
    </div>
  );
};

export default VoiceControls;