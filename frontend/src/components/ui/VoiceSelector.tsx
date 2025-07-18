import { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useElevenLabsSpeech } from '@/hooks/useElevenLabsSpeech';
import { BsFillPlayFill, BsFillStopFill, BsVolumeUp, BsVolumeMute } from 'react-icons/bs';

// Voice options with their corresponding IDs
export const voiceOptions = {
  female: [
    { id: 'XB0fDUnXU5powFXDhCwa', name: 'Rachel', description: 'Warm and friendly' },
    { id: '29vD33N1CtxCmqQRPOHJ', name: 'Grace', description: 'Peaceful and reassuring' },
    { id: 'jsCqWAovK2LkecY7zXl4', name: 'Emily', description: 'Clear and professional' }
  ],
  male: [
    { id: '5Q0t7uMcjvnagumLfvZi', name: 'Michael', description: 'Confident and encouraging' },
    { id: 'onwK4e9ZLuTAKqWW03F9', name: 'David', description: 'Calm and articulate' },
    { id: 'W5XQhPziBlgFDH5MLlz2', name: 'James', description: 'Warm and motivational' }
  ]
};

// Sample phrases for voice testing
const samplePhrases = [
  "Hi there! I'm your career journey guide.",
  "Let's explore your strengths and find the perfect career match for you.",
  "Great job completing that milestone! You're making excellent progress.",
  "Your unique skills and interests suggest some exciting career opportunities.",
  "We'll work together to build your personalized roadmap to success."
];

interface VoiceSelectorProps {
  onSelect: (voiceType: string, voiceId: string, voiceName: string) => void;
  initialVoiceType?: string;
  initialVoiceId?: string;
}

export function VoiceSelector({ 
  onSelect, 
  initialVoiceType = 'female', 
  initialVoiceId = 'XB0fDUnXU5powFXDhCwa' 
}: VoiceSelectorProps) {
  const [voiceType, setVoiceType] = useState(initialVoiceType);
  const [selectedVoice, setSelectedVoice] = useState(initialVoiceId);
  const [demoPhrase, setDemoPhrase] = useState(samplePhrases[0]);
  
  // Get a new speech instance with the current voice type
  const speech = useElevenLabsSpeech({ voiceType });
  
  // Find the currently selected voice details
  const currentVoiceDetails = voiceOptions[voiceType as keyof typeof voiceOptions].find(
    v => v.id === selectedVoice
  );
  
  // Handle voice type change
  const handleVoiceTypeChange = (type: string) => {
    if (speech.isSpeaking) {
      speech.stop();
    }
    setVoiceType(type);
    
    // Select first voice from the new type
    const newVoiceId = voiceOptions[type as keyof typeof voiceOptions][0].id;
    setSelectedVoice(newVoiceId);
    
    // Notify parent component
    const newVoiceDetails = voiceOptions[type as keyof typeof voiceOptions][0];
    onSelect(type, newVoiceId, newVoiceDetails.name);
  };
  
  // Handle specific voice selection
  const handleVoiceSelect = (voiceId: string, voiceName: string) => {
    if (speech.isSpeaking) {
      speech.stop();
    }
    setSelectedVoice(voiceId);
    onSelect(voiceType, voiceId, voiceName);
  };
  
  // Play demo phrase
  const handlePlay = () => {
    if (speech.isSpeaking) {
      speech.stop();
    } else {
      speech.speak(demoPhrase);
    }
  };
  
  // Choose a random phrase
  const handleRandomPhrase = () => {
    const randomIndex = Math.floor(Math.random() * samplePhrases.length);
    setDemoPhrase(samplePhrases[randomIndex]);
  };
  
  // Reset selected voice on voice type change
  useEffect(() => {
    const firstVoice = voiceOptions[voiceType as keyof typeof voiceOptions][0];
    if (!voiceOptions[voiceType as keyof typeof voiceOptions].some(v => v.id === selectedVoice)) {
      setSelectedVoice(firstVoice.id);
      onSelect(voiceType, firstVoice.id, firstVoice.name);
    }
  }, [voiceType, selectedVoice, onSelect]);
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Select Your Guide's Voice</CardTitle>
        <CardDescription>
          Choose a voice that will guide you on your career journey
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs defaultValue={initialVoiceType} onValueChange={handleVoiceTypeChange}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="female">Female Voices</TabsTrigger>
            <TabsTrigger value="male">Male Voices</TabsTrigger>
          </TabsList>
          
          <TabsContent value="female" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {voiceOptions.female.map((voice) => (
                <Card 
                  key={voice.id}
                  className={`cursor-pointer transition-all ${selectedVoice === voice.id ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50'}`}
                  onClick={() => handleVoiceSelect(voice.id, voice.name)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {selectedVoice === voice.id && <BsVolumeUp className="text-primary" />}
                      {voice.name}
                    </CardTitle>
                    <CardDescription>{voice.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="male" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3">
              {voiceOptions.male.map((voice) => (
                <Card 
                  key={voice.id}
                  className={`cursor-pointer transition-all ${selectedVoice === voice.id ? 'border-primary bg-primary/5 shadow-md' : 'hover:border-primary/50'}`}
                  onClick={() => handleVoiceSelect(voice.id, voice.name)}
                >
                  <CardHeader className="p-4">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {selectedVoice === voice.id && <BsVolumeUp className="text-primary" />}
                      {voice.name}
                    </CardTitle>
                    <CardDescription>{voice.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 p-4 border rounded-md bg-gray-50">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">Try this voice</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRandomPhrase}
            >
              Try different phrase
            </Button>
          </div>
          
          <p className="mb-4 text-gray-700 italic">"{demoPhrase}"</p>
          
          <div className="flex items-center">
            <Button 
              onClick={handlePlay}
              className="flex items-center gap-2"
              disabled={speech.isLoading}
            >
              {speech.isLoading ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Loading...
                </>
              ) : speech.isSpeaking ? (
                <>
                  <BsFillStopFill /> Stop
                </>
              ) : (
                <>
                  <BsFillPlayFill /> Play
                </>
              )}
            </Button>
            
            {speech.isSpeaking && (
              <div className="ml-4 flex items-center gap-1">
                <div className="w-1 h-3 bg-primary rounded-full animate-pulse"></div>
                <div className="w-1 h-5 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                <div className="w-1 h-4 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                <div className="w-1 h-2 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
                <div className="w-1 h-3 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.8s" }}></div>
              </div>
            )}
          </div>
          
          {speech.error && (
            <div className="mt-2 text-red-500 text-sm">
              Error: {speech.error}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="border-t pt-4">
        <div className="w-full flex justify-between items-center">
          <div>
            <p className="font-medium">Currently selected: <span className="text-primary">{currentVoiceDetails?.name}</span></p>
            <p className="text-sm text-gray-500">{currentVoiceDetails?.description}</p>
          </div>
          
          <Button onClick={() => onSelect(voiceType, selectedVoice, currentVoiceDetails?.name || '')}>
            Confirm Selection
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}