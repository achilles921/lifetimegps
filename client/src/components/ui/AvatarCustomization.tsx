import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { avatars } from '@/data/avatarData';
import { BsVolumeUp, BsVolumeMute, BsEmojiSmileFill, BsCheckCircleFill } from "react-icons/bs";
import { FiCheck } from "react-icons/fi";
import { useSpeech } from '@/hooks/useSpeech';

interface AvatarCustomizationProps {
  currentAvatarId: number;
  currentVoiceType: string;
  onComplete: (avatarId: number, voiceType: string) => void;
}

export function AvatarCustomization({ 
  currentAvatarId, 
  currentVoiceType, 
  onComplete 
}: AvatarCustomizationProps) {
  const [selectedAvatarId, setSelectedAvatarId] = useState<number>(currentAvatarId || 1);
  const [selectedVoiceType, setSelectedVoiceType] = useState<string>(currentVoiceType || 'female');
  const [activeTab, setActiveTab] = useState<'avatar' | 'voice'>('avatar');
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Initialize speech synthesis hooks for voice preview
  const femaleSpeech = useSpeech({ voiceType: 'female' });
  const maleSpeech = useSpeech({ voiceType: 'male' });
  
  // Filtered avatars by category
  const filterAvatars = (gender: string, ethnicity?: string) => {
    return avatars.filter(avatar => 
      avatar.gender === gender && 
      (ethnicity ? avatar.ethnicity === ethnicity : true)
    );
  };
  
  // Handle save and continue
  const handleSave = () => {
    setShowConfetti(true);
    setTimeout(() => {
      onComplete(selectedAvatarId, selectedVoiceType);
    }, 1200);
  };
  
  // Check if selection has changed
  const hasChanges = selectedAvatarId !== currentAvatarId || selectedVoiceType !== currentVoiceType;
  
  // Get current avatar
  const currentAvatar = avatars.find(avatar => avatar.id === selectedAvatarId);
  
  return (
    <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 animate-scaleIn">
      {/* Confetti effect */}
      {showConfetti && (
        <div className="confetti-container"></div>
      )}
      
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Customize Your Experience</h2>
        <p className="text-gray-600">Personalize your career guide companion</p>
      </div>
      
      {/* Preview section */}
      <div className="flex justify-center mb-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary">
            {currentAvatar && (
              <img 
                src={currentAvatar.src} 
                alt={currentAvatar.alt}
                className="w-full h-full object-cover"
              />
            )}
          </div>
          
          {/* Voice indicator */}
          <div className={`absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center ${
            selectedVoiceType === 'female' ? 'bg-pink-100' :
            selectedVoiceType === 'male' ? 'bg-blue-100' : 'bg-gray-200'
          }`}>
            {selectedVoiceType === 'none' ? (
              <BsVolumeMute className={`text-gray-600 w-5 h-5`} />
            ) : (
              <BsVolumeUp className={`${
                selectedVoiceType === 'female' ? 'text-pink-600' : 'text-blue-600'
              } w-5 h-5`} />
            )}
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`flex-1 py-2 font-medium text-sm ${
            activeTab === 'avatar' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('avatar')}
        >
          Choose Avatar
        </button>
        <button
          className={`flex-1 py-2 font-medium text-sm ${
            activeTab === 'voice' 
              ? 'text-primary border-b-2 border-primary' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('voice')}
        >
          Voice Settings
        </button>
      </div>
      
      {/* Avatar selection */}
      {activeTab === 'avatar' && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Female Avatars</h3>
            <div className="grid grid-cols-4 gap-2">
              {filterAvatars('female').map(avatar => (
                <div 
                  key={avatar.id}
                  className={`relative cursor-pointer transition-all overflow-hidden rounded-lg ${
                    selectedAvatarId === avatar.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'hover:ring-1 hover:ring-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                >
                  <img 
                    src={avatar.src} 
                    alt={avatar.alt} 
                    className="w-full h-auto aspect-square object-cover"
                  />
                  {selectedAvatarId === avatar.id && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1">
                        <FiCheck className="text-primary w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Male Avatars</h3>
            <div className="grid grid-cols-4 gap-2">
              {filterAvatars('male').map(avatar => (
                <div 
                  key={avatar.id}
                  className={`relative cursor-pointer transition-all overflow-hidden rounded-lg ${
                    selectedAvatarId === avatar.id 
                      ? 'ring-2 ring-primary shadow-md' 
                      : 'hover:ring-1 hover:ring-primary/50 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedAvatarId(avatar.id)}
                >
                  <img 
                    src={avatar.src} 
                    alt={avatar.alt} 
                    className="w-full h-auto aspect-square object-cover"
                  />
                  {selectedAvatarId === avatar.id && (
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <div className="bg-white rounded-full p-1">
                        <FiCheck className="text-primary w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Voice selection */}
      {activeTab === 'voice' && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Voice Type</h3>
          <div className="grid grid-cols-3 gap-3">
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedVoiceType === 'female' 
                  ? 'bg-pink-50 border-pink-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setSelectedVoiceType('female')}
            >
              <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center mb-2">
                <BsVolumeUp className="text-pink-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-800">Female</span>
              <span className="text-xs text-gray-500 mt-1">Gail</span>
            </button>
            
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedVoiceType === 'male' 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setSelectedVoiceType('male')}
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                <BsVolumeUp className="text-blue-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-800">Male</span>
              <span className="text-xs text-gray-500 mt-1">Alex</span>
            </button>
            
            <button
              className={`flex flex-col items-center justify-center p-4 rounded-lg border ${
                selectedVoiceType === 'none' 
                  ? 'bg-gray-200 border-gray-300' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              } transition-colors`}
              onClick={() => setSelectedVoiceType('none')}
            >
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                <BsVolumeMute className="text-gray-600 w-5 h-5" />
              </div>
              <span className="font-medium text-gray-800">No Voice</span>
              <span className="text-xs text-gray-500 mt-1">Silent Mode</span>
            </button>
          </div>
          
          <div className="mt-4 bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Voice Preview</h4>
            <p className="text-sm text-gray-600 mb-3">
              Your guide will speak with this voice throughout your journey.
            </p>
            
            {selectedVoiceType !== 'none' && (
              <div className="flex flex-col space-y-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs inline-flex items-center"
                  onClick={() => {
                    // Play voice sample based on selected type
                    const previewText = selectedVoiceType === 'female' 
                      ? "Hi there! I'm Gail, and I'll be your career journey guide. Let's discover your ideal career path together!" 
                      : "Hello! I'm Alex, your career exploration assistant. I'm here to help you find your dream career!";
                    
                    if (selectedVoiceType === 'female') {
                      femaleSpeech.speak(previewText);
                    } else {
                      maleSpeech.speak(previewText);
                    }
                  }}
                  disabled={selectedVoiceType === 'female' ? femaleSpeech.isSpeaking : maleSpeech.isSpeaking}
                >
                  <BsVolumeUp className="mr-1 w-3 h-3" />
                  {(selectedVoiceType === 'female' ? femaleSpeech.isSpeaking : maleSpeech.isSpeaking) 
                    ? 'Speaking...' 
                    : 'Preview Voice'}
                </Button>
                
                {(selectedVoiceType === 'female' ? femaleSpeech.isSpeaking : maleSpeech.isSpeaking) && (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="h-1 w-1 bg-primary rounded-full animate-pulse"></div>
                    <div className="h-1 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-1 w-1 bg-primary rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            setSelectedAvatarId(currentAvatarId);
            setSelectedVoiceType(currentVoiceType);
          }}
          disabled={!hasChanges}
        >
          Reset Changes
        </Button>
        
        <Button
          className={`bg-gradient-to-r from-primary to-secondary text-white ${!hasChanges ? 'opacity-70' : ''}`}
          onClick={handleSave}
        >
          {hasChanges ? 'Save & Continue' : 'Continue'}
        </Button>
      </div>
    </div>
  );
}