import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Play, Pause, RefreshCw, MessageSquare, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';

interface Voice {
  voice_id: string;
  name: string;
  gender: 'male' | 'female' | 'other';
  accent?: string;
  ethnicity?: string;
}

interface VoiceGuidanceProps {
  selectedCareer?: string | null;
  interests: string[];
  getInterestName: (id: string) => string;
  onFeedbackSubmit?: (feedback: string) => void;
}

const VoiceGuidance: React.FC<VoiceGuidanceProps> = ({
  selectedCareer,
  interests,
  getInterestName,
  onFeedbackSubmit
}) => {
  // State
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [currentMessage, setCurrentMessage] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('female');
  
  // Refs
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
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
  
  // Fetch voices
  useEffect(() => {
    async function fetchVoices() {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/voice/voices/${gender}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        
        const data = await response.json();
        setVoices(data);
        
        // Auto-select the first voice
        if (data.length > 0 && !selectedVoice) {
          setSelectedVoice(data[0].voice_id);
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchVoices();
  }, [gender]);
  
  // Generate greeting message based on selected interests and career
  const generateMessage = () => {
    // Get user's name from localStorage or use a fallback
    const userName = localStorage.getItem('userName') || "Alain";
    
    // Base message template with personalized greeting
    let message = `Hi ${userName}! I noticed you've just completed your career assessment. `;
    
    // Add interests context
    if (interests && interests.length > 0) {
      message += `Based on your interests in ${interests.slice(0, 3).map(id => getInterestName(id)).join(', ')}${interests.length > 3 ? ' and others' : ''}, `;
    }
    
    // Add selected career context or general career matches
    if (selectedCareer) {
      message += `I see you're exploring ${selectedCareer} as a potential career path. Does this match appeal to you? I'm curious - what aspects of this career feel like a good fit for your skills and interests? And is there anything about it that surprises you? Take a moment to imagine yourself in this role - can you see yourself enjoying the day-to-day activities? I'd love to hear your thoughts!`;
    } else {
      message += `we've found several career matches that might be a good fit for you. Take a look at the recommendations and ask yourself: 'Do any of these careers appeal to me?' Some matches might immediately excite you, while others might surprise you. Does anything on this list make you think, 'I could see myself doing that'? Click on any career that interests you to learn more, and feel free to share which options you're drawn to and why.`;
    }
    
    return message;
  };
  
  // Generate and play speech
  const generateSpeech = async () => {
    if (!selectedVoice) return;
    
    // Get greeting message
    const message = generateMessage();
    setCurrentMessage(message);
    
    setIsLoading(true);
    
    try {
      console.log(`Generating speech with voice ${selectedVoice}`);
      
      const response = await axios.post('/api/voice/speech', {
        text: message,
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
  
  // Handle feedback submission
  const handleFeedbackSubmit = () => {
    if (onFeedbackSubmit && feedbackText.trim()) {
      onFeedbackSubmit(feedbackText);
    }
    setShowFeedback(false);
    setFeedbackText('');
  };
  
  return (
    <Card className="w-full overflow-hidden shadow-md border-primary/20">
      <CardContent className="p-4 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-primary" />
            AI Career Guide
          </h3>
          
          <div className="flex space-x-2">
            <Select 
              value={gender}
              onValueChange={(value: 'male' | 'female') => setGender(value)}
            >
              <SelectTrigger className="w-[100px]">
                <SelectValue placeholder="Voice" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="male">Male</SelectItem>
              </SelectContent>
            </Select>
            
            {voices.length > 0 && (
              <Select 
                value={selectedVoice || ''}
                onValueChange={setSelectedVoice}
              >
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Select voice" />
                </SelectTrigger>
                <SelectContent>
                  {voices.map((voice) => (
                    <SelectItem key={voice.voice_id} value={voice.voice_id}>
                      {voice.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        <div className="bg-muted p-4 rounded-lg relative min-h-[120px] flex flex-col">
          {currentMessage ? (
            <>
              <p className="text-sm">{currentMessage}</p>
              <div className="flex mt-2 space-x-2">
                <Badge variant="outline" className="bg-primary/10">
                  Career Guidance
                </Badge>
                {selectedCareer && (
                  <Badge variant="outline" className="bg-primary/10">
                    {selectedCareer}
                  </Badge>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              Click the play button to hear career guidance from our AI assistant.
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <div className="flex space-x-2">
            <Button
              size="sm"
              variant={isPlaying ? "secondary" : "default"}
              onClick={handlePlayToggle}
              disabled={isLoading || !selectedVoice}
            >
              {isLoading ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isPlaying ? "Pause" : "Listen to Guidance"}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowFeedback(!showFeedback)}
            >
              {showFeedback ? "Cancel" : "Share Thoughts"}
            </Button>
          </div>
          
          {currentMessage && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => generateSpeech()}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </Button>
          )}
        </div>
        
        {showFeedback && (
          <div className="space-y-2">
            <Textarea
              placeholder="Share your thoughts on these career matches..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              className="w-full"
              rows={3}
            />
            <div className="flex justify-end space-x-2">
              <Button size="sm" variant="outline" onClick={() => setShowFeedback(false)}>
                <XCircle className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleFeedbackSubmit} disabled={!feedbackText.trim()}>
                Submit
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceGuidance;