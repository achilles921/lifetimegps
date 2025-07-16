import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardFooter 
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { VoiceSelector } from '@/components/ui/VoiceSelector';
import { useElevenLabsSpeech } from '@/hooks/useElevenLabsSpeech';
import { BsFillPlayFill, BsFillStopFill, BsSoundwave } from 'react-icons/bs';

export function VoiceTester() {
  const [selectedVoiceType, setSelectedVoiceType] = useState('female');
  const [selectedVoiceId, setSelectedVoiceId] = useState('XB0fDUnXU5powFXDhCwa'); // Default to Rachel
  const [selectedVoiceName, setSelectedVoiceName] = useState('Rachel');
  const [customText, setCustomText] = useState(
    "Hi there! I'm your career journey guide. We'll work together to discover your perfect career path based on your unique strengths and interests."
  );
  
  const speech = useElevenLabsSpeech({ voiceType: selectedVoiceType });
  
  const handleVoiceSelect = (voiceType: string, voiceId: string, voiceName: string) => {
    // Stop any current speech
    if (speech.isSpeaking) {
      speech.stop();
    }
    
    setSelectedVoiceType(voiceType);
    setSelectedVoiceId(voiceId);
    setSelectedVoiceName(voiceName);
  };
  
  const handleSpeakClick = () => {
    if (speech.isSpeaking) {
      speech.stop();
    } else {
      speech.speak(customText);
    }
  };
  
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">ElevenLabs Voice Tester</h1>
      
      <div className="grid gap-8">
        {/* Voice Selection */}
        <VoiceSelector 
          onSelect={handleVoiceSelect}
          initialVoiceType={selectedVoiceType}
          initialVoiceId={selectedVoiceId}
        />
        
        {/* Custom Text Tester */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BsSoundwave className="text-primary" />
              Test Your Selected Voice
            </CardTitle>
            <CardDescription>
              Try your selected voice ({selectedVoiceName}) with custom text.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Textarea
              className="w-full min-h-[100px] p-3 border rounded-md"
              placeholder="Enter text to speak..."
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
            />
            
            {speech.isSpeaking && (
              <div className="mt-4 flex items-center gap-2 text-primary">
                <div className="flex items-center gap-1">
                  <div className="w-2 h-6 bg-primary rounded-full animate-pulse"></div>
                  <div className="w-2 h-10 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-2 h-8 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                  <div className="w-2 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                  <div className="w-2 h-7 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.8s" }}></div>
                </div>
                <span className="text-sm">Speaking with {selectedVoiceName}'s voice...</span>
              </div>
            )}
            
            {speech.error && (
              <div className="mt-2 text-red-500 text-sm">
                Error: {speech.error}
              </div>
            )}
          </CardContent>
          
          <CardFooter>
            <Button 
              onClick={handleSpeakClick} 
              className="w-full flex items-center justify-center gap-2"
              disabled={!customText.trim() || speech.isLoading}
            >
              {speech.isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Loading...
                </>
              ) : speech.isSpeaking ? (
                <>
                  <BsFillStopFill className="text-xl" />
                  Stop Speaking
                </>
              ) : (
                <>
                  <BsFillPlayFill className="text-xl" />
                  Speak with {selectedVoiceName}'s Voice
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}