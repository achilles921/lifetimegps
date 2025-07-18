import { useState } from "react";
import { Button } from "@/components/ui/button";
import { avatars } from "@/data/avatarData";
import { useUser } from "@/context/UserContext";
import { FiArrowLeft, FiPlay, FiPause } from "react-icons/fi";
import { MdFemale, MdMale } from "react-icons/md";
import { useSpeech } from "@/hooks/useSpeech";

export function AvatarSelection() {
  const { setAvatarAndVoice, setScreen, isLoading } = useUser();
  const [selectedVoice, setSelectedVoice] = useState<string>("female");
  const [selectedAvatar, setSelectedAvatar] = useState<number>(1);
  const [showAllAvatars, setShowAllAvatars] = useState<boolean>(false);
  
  // Setup speech hooks for voice preview
  const femaleSpeech = useSpeech({ voiceType: 'female' });
  const maleSpeech = useSpeech({ voiceType: 'male' });
  
  // Get the selected avatar data
  const avatarData = avatars.find(avatar => avatar.id === selectedAvatar);
  
  // Get displayed avatars (either first 8 or all)
  const displayedAvatars = showAllAvatars 
    ? avatars 
    : avatars.slice(0, 8);
  
  const handleBackClick = () => {
    setScreen("onboarding");
  };
  
  const handleContinueClick = async () => {
    await setAvatarAndVoice(selectedAvatar, selectedVoice);
  };
  
  const handleVoiceSelect = (voice: string) => {
    setSelectedVoice(voice);
  };
  
  const handleAvatarSelect = (id: number) => {
    setSelectedAvatar(id);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gradient-to-r from-primary to-secondary text-white p-5 shadow-md">
        <div className="flex items-center">
          <button 
            className="mr-3 text-white opacity-80 hover:opacity-100 transition-opacity" 
            onClick={handleBackClick}
            disabled={isLoading}
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="font-bold text-xl">Choose Your Avatar</h1>
        </div>
      </header>

      <main className="flex-1 p-5 max-w-md mx-auto w-full">
        <div className="slide-in-bottom">
          {/* Voice Preference Selection */}
          <div className="mb-8">
            <h2 className="font-medium mb-3 text-lg">Select AI Voice</h2>
            <div className="flex flex-col sm:flex-row gap-4">
              <div 
                className={`voice-option flex-1 card-hover bg-white rounded-lg p-4 border-2 ${selectedVoice === 'female' ? 'border-secondary' : 'border-transparent hover:border-primary/30'} cursor-pointer transition-all duration-200`}
                onClick={() => handleVoiceSelect('female')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                      <MdFemale className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Female Voice</h3>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">Gail</p>
                        {femaleSpeech.isSpeaking && (
                          <div className="ml-2 flex space-x-0.5">
                            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-1 bg-secondary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center text-secondary cursor-pointer hover:bg-secondary/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting voice when clicking play button
                      // Stop male voice if playing
                      if (maleSpeech.isSpeaking) maleSpeech.stop();
                      
                      // Toggle female voice
                      if (femaleSpeech.isSpeaking) {
                        femaleSpeech.stop();
                      } else {
                        const sampleText = "Hi there! I'm Gail, and I'll be your career journey guide. Let's discover your perfect path together!";
                        femaleSpeech.speak(sampleText);
                      }
                    }}
                  >
                    {femaleSpeech.isSpeaking ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                  </div>
                </div>
              </div>
              
              <div 
                className={`voice-option flex-1 card-hover bg-white rounded-lg p-4 border-2 ${selectedVoice === 'male' ? 'border-secondary' : 'border-transparent hover:border-primary/30'} cursor-pointer transition-all duration-200`}
                onClick={() => handleVoiceSelect('male')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                      <MdMale className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-medium">Male Voice</h3>
                      <div className="flex items-center">
                        <p className="text-xs text-muted-foreground">Alex</p>
                        {maleSpeech.isSpeaking && (
                          <div className="ml-2 flex space-x-0.5">
                            <div className="w-1 h-1 bg-accent rounded-full animate-pulse"></div>
                            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                            <div className="w-1 h-1 bg-accent rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div 
                    className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center text-accent cursor-pointer hover:bg-accent/20 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent selecting voice when clicking play button
                      // Stop female voice if playing
                      if (femaleSpeech.isSpeaking) femaleSpeech.stop();
                      
                      // Toggle male voice
                      if (maleSpeech.isSpeaking) {
                        maleSpeech.stop();
                      } else {
                        const sampleText = "Hello! I'm Alex, your career exploration assistant. I'm here to help you find your dream career!";
                        maleSpeech.speak(sampleText);
                      }
                    }}
                  >
                    {maleSpeech.isSpeaking ? <FiPause className="w-4 h-4" /> : <FiPlay className="w-4 h-4" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Avatar Selection Grid */}
          <div>
            <h2 className="font-medium mb-3 text-lg flex items-center justify-between">
              <span>Select Your Avatar</span>
              <span className="badge-gradient">{displayedAvatars.length} options</span>
            </h2>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {/* Avatar options */}
              {displayedAvatars.map((avatar) => (
                <div 
                  key={avatar.id}
                  className={`avatar-option aspect-square bg-white rounded-lg flex items-center justify-center p-2 ${selectedAvatar === avatar.id ? 'avatar-selected' : 'hover:shadow-md'} cursor-pointer overflow-hidden transition-all duration-300`}
                  onClick={() => handleAvatarSelect(avatar.id)}
                >
                  <img 
                    src={avatar.src} 
                    alt={avatar.alt} 
                    className="rounded-full w-full h-full object-cover" 
                  />
                </div>
              ))}
              
              {/* View more avatars button (if not showing all) */}
              {!showAllAvatars && (
                <div 
                  className="avatar-more aspect-square bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => setShowAllAvatars(true)}
                >
                  <span className="text-muted-foreground font-medium">+{avatars.length - 8}</span>
                </div>
              )}
            </div>
            
            {/* Selected Avatar Preview */}
            <div className="card-hover bg-white rounded-lg p-5 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden ring-2 ring-primary/20">
                  <img 
                    src={avatarData?.src || ''} 
                    alt="Selected Avatar" 
                    className="object-cover w-full h-full" 
                  />
                </div>
                <div>
                  <h3 className="font-medium">Your AI Guide</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedVoice === 'female' ? 'Female voice • Gail' : 'Male voice • Alex'}
                  </p>
                </div>
              </div>
              <Button 
                onClick={handleContinueClick} 
                disabled={isLoading}
                className="btn-gradient text-white px-6 py-2 rounded-md"
              >
                {isLoading ? "Loading..." : "Continue"}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
