import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Check, ArrowRight, RefreshCw } from 'lucide-react';

// Avatar emojis based on the provided assets
const avatarEmojis = [
  { id: 'artist', src: 'https://cdn-icons-png.flaticon.com/512/742/742751.png' },
  { id: 'cool', src: 'https://cdn-icons-png.flaticon.com/512/742/742920.png' },
  { id: 'nerd', src: 'https://cdn-icons-png.flaticon.com/512/742/742799.png' },
  { id: 'sporty', src: 'https://cdn-icons-png.flaticon.com/512/742/742904.png' },
  { id: 'cowboy', src: 'https://cdn-icons-png.flaticon.com/512/742/742750.png' },
  { id: 'smug', src: 'https://cdn-icons-png.flaticon.com/512/742/742872.png' },
  { id: 'technical', src: 'https://cdn-icons-png.flaticon.com/512/742/742810.png' },
  { id: 'thumbsup', src: 'https://cdn-icons-png.flaticon.com/512/742/742774.png' },
  { id: 'excited', src: 'https://cdn-icons-png.flaticon.com/512/742/742768.png' },
];

// Backgrounds or frames to make it more personalized
const avatarBackgrounds = [
  { id: 'blue', color: 'bg-blue-500' },
  { id: 'green', color: 'bg-green-500' },
  { id: 'orange', color: 'bg-orange-500' },
  { id: 'purple', color: 'bg-purple-500' },
  { id: 'red', color: 'bg-red-500' },
  { id: 'teal', color: 'bg-teal-500' },
];

type CustomizationCategory = 'avatar' | 'background' | 'upload';

interface AvatarCustomizerProps {
  onComplete: () => void;
  sectionNumber: number;
  hasExistingAvatar?: boolean;
}

const AvatarCustomizer: React.FC<AvatarCustomizerProps> = ({ 
  onComplete, 
  sectionNumber,
  hasExistingAvatar = false 
}) => {
  const [activeTab, setActiveTab] = useState<CustomizationCategory>('avatar');
  const [avatarOptions, setAvatarOptions] = useState({
    emoji: avatarEmojis[0].id,
    background: avatarBackgrounds[0].id,
    uploadedImage: ''
  });
  
  // File input reference for image upload
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Get the selected emoji and background
  const selectedEmoji = avatarEmojis.find(emoji => emoji.id === avatarOptions.emoji) || avatarEmojis[0];
  const selectedBackground = avatarBackgrounds.find(bg => bg.id === avatarOptions.background) || avatarBackgrounds[0];
  
  // Avatar preview with the selected emoji and background
  const AvatarPreview = () => (
    <div className={`w-40 h-40 ${selectedBackground.color} rounded-full mx-auto flex items-center justify-center mb-6 p-1`}>
      {avatarOptions.uploadedImage ? (
        <div className="w-full h-full rounded-full overflow-hidden">
          <img 
            src={avatarOptions.uploadedImage} 
            alt="Custom avatar" 
            className="w-full h-full object-cover"
          />
        </div>
      ) : (
        <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
          <img 
            src={selectedEmoji.src}
            alt={`${selectedEmoji.id} emoji`}
            className="w-3/4 h-3/4 object-contain"
          />
        </div>
      )}
    </div>
  );
  
  const saveAvatar = () => {
    // In a real app, save this to the user's profile
    localStorage.setItem('userAvatar', JSON.stringify(avatarOptions));
    onComplete();
  };
  
  const updateAvatarOption = (category: string, value: string) => {
    setAvatarOptions(prev => ({
      ...prev,
      [category]: value
    }));
  };
  
  const randomizeAvatar = () => {
    const randomEmoji = avatarEmojis[Math.floor(Math.random() * avatarEmojis.length)];
    const randomBackground = avatarBackgrounds[Math.floor(Math.random() * avatarBackgrounds.length)];
    
    setAvatarOptions({
      emoji: randomEmoji.id,
      background: randomBackground.id,
      uploadedImage: ''
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          updateAvatarOption('uploadedImage', event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="text-center">
        <div className="w-16 h-16 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-4">
          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
            <Check className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
        <CardTitle className="text-2xl md:text-3xl mb-2">Level Up Your Avatar!</CardTitle>
        <CardDescription className="text-lg mb-2">
          {hasExistingAvatar 
            ? "You've unlocked new avatar customization options!"
            : "Great job completing Section " + sectionNumber + "! Create your avatar to track your progress."}
        </CardDescription>
        <p className="text-muted-foreground mt-2">
          Personalize your career journey companion as you progress through each section of the assessment.
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <AvatarPreview />
        
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={randomizeAvatar}
          >
            <RefreshCw className="h-4 w-4" /> Randomize Avatar
          </Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as CustomizationCategory)}>
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="avatar">Choose Emoji</TabsTrigger>
            <TabsTrigger value="background">Background</TabsTrigger>
            <TabsTrigger value="upload">Upload Image</TabsTrigger>
          </TabsList>
          
          <TabsContent value="avatar" className="space-y-4">
            <h3 className="text-lg font-medium">Choose Your Career Race Emoji</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {avatarEmojis.map(emoji => (
                <div 
                  key={emoji.id}
                  className={`cursor-pointer p-4 rounded-lg border ${avatarOptions.emoji === emoji.id ? 'border-primary bg-primary/10' : 'border-muted'}`}
                  onClick={() => updateAvatarOption('emoji', emoji.id)}
                >
                  <div className="w-full aspect-square rounded-lg flex items-center justify-center bg-white">
                    <img 
                      src={emoji.src} 
                      alt={emoji.id} 
                      className="w-3/4 h-3/4 object-contain"
                    />
                  </div>
                  <p className="text-xs text-center mt-2 capitalize">{emoji.id}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="background" className="space-y-4">
            <h3 className="text-lg font-medium">Choose Background Color</h3>
            <div className="grid grid-cols-3 gap-3">
              {avatarBackgrounds.map(bg => (
                <div 
                  key={bg.id}
                  className={`cursor-pointer p-4 rounded-lg border ${avatarOptions.background === bg.id ? 'border-primary bg-primary/10' : 'border-muted'}`}
                  onClick={() => updateAvatarOption('background', bg.id)}
                >
                  <div className={`w-full h-16 rounded-lg ${bg.color}`}>
                  </div>
                  <p className="text-xs text-center mt-2 capitalize">{bg.id}</p>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <h3 className="text-lg font-medium">Upload Custom Avatar</h3>
            <div className="border-2 border-dashed border-muted rounded-lg p-8 text-center">
              {avatarOptions.uploadedImage ? (
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto rounded-full overflow-hidden">
                    <img 
                      src={avatarOptions.uploadedImage} 
                      alt="Uploaded avatar" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateAvatarOption('uploadedImage', '')}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    accept="image/*"
                    className="hidden"
                  />
                  <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
                    <p className="text-4xl text-muted-foreground">+</p>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Select Image
                  </Button>
                  <p className="text-xs text-muted-foreground mt-4">
                    Upload a photo for your avatar. Square images work best.
                  </p>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onComplete}
        >
          Skip for Now
        </Button>
        <Button 
          className="bg-primary hover:bg-primary/90"
          onClick={saveAvatar}
        >
          Save & Continue <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AvatarCustomizer;