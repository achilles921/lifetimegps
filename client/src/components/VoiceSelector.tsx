/**
 * Voice Selector Component
 * 
 * This component provides a user interface for selecting and previewing different
 * voice options from ElevenLabs API. Features include:
 * 
 * - Filtering by gender, age, and category
 * - Voice preview playback
 * - Multi-panel selection with smooth animations
 * - Responsive design for mobile and desktop
 * - Accessible UI with keyboard navigation
 */

import React, { useState, useEffect, useCallback } from 'react';
import { useElevenLabsSpeech } from '@/hooks/useElevenLabsSpeech';
import { usePerformance } from '@/context/PerformanceContext';
import { ProgressiveImage } from '@/components/ui/ProgressiveImage';
import { cn } from '@/lib/utils';
import { apiRequest } from '@/lib/queryClient';

// Icons
import { 
  Play, Pause, SkipForward, Volume2, VolumeX, 
  User, UserCircle, Users, Check, Filter, X
} from 'lucide-react';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// Voice types from server
export interface VoiceOption {
  id?: string;
  voice_id?: string; // From API response
  name: string;
  gender: 'male' | 'female' | 'neutral';
  preview_url: string;
  category?: string;
  description?: string;
  age?: 'young' | 'adult' | 'senior';
  suitableFor?: string[];
  accent?: string;
  isDefault?: boolean;
}

interface VoiceSelectorProps {
  onSelect: (voice: VoiceOption) => void;
  selectedVoiceId?: string;
  previewText?: string;
  className?: string;
}

export function VoiceSelector({
  onSelect,
  selectedVoiceId,
  previewText = "Hi, I'm your career guide. I'll help you discover career paths that match your unique strengths and interests.",
  className
}: VoiceSelectorProps) {
  // State for voice options and filtering
  const [allVoices, setAllVoices] = useState<VoiceOption[]>([]);
  const [filteredVoices, setFilteredVoices] = useState<VoiceOption[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter states
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  
  // UI states
  const [activeTab, setActiveTab] = useState('all');
  
  // Audio control
  const { 
    play, 
    pause, 
    isPlaying, 
    isPaused, 
    isLoading: isAudioLoading 
  } = useElevenLabsSpeech();
  
  const { isLowPowerMode } = usePerformance();
  
  // Fetch voice options
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await apiRequest('GET', '/api/voice/voices');
        
        if (!response.ok) {
          throw new Error('Failed to fetch voice options');
        }
        
        const data = await response.json();
        
        // Map API response to match our expected format
        const mappedVoices = data.map((voice: any) => ({
          ...voice,
          id: voice.voice_id, // Use voice_id as id for compatibility
          category: voice.category || 'General',
          age: voice.age || 'adult'
        }));
        
        setAllVoices(mappedVoices);
        setFilteredVoices(mappedVoices);
        
        // Set initially selected voice if provided
        if (selectedVoiceId) {
          const voice = mappedVoices.find((v: VoiceOption) => v.id === selectedVoiceId);
          if (voice) {
            setSelectedVoice(voice);
          } else if (mappedVoices.length > 0) {
            // Fallback to first voice
            setSelectedVoice(mappedVoices[0]);
          }
        } else if (mappedVoices.length > 0) {
          // If no selection, default to first voice
          setSelectedVoice(mappedVoices[0]);
        }
      } catch (err) {
        console.error('Error fetching voices:', err);
        setError('Failed to load voice options. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVoices();
  }, [selectedVoiceId]);
  
  // Apply filters
  useEffect(() => {
    if (allVoices.length === 0) return;
    
    let results = [...allVoices];
    
    // Apply gender filter
    if (genderFilter !== 'all') {
      results = results.filter(voice => voice.gender === genderFilter);
    }
    
    // Apply category filter
    if (categoryFilter !== 'all') {
      results = results.filter(voice => voice.category === categoryFilter);
    }
    
    // Apply age filter
    if (ageFilter !== 'all') {
      results = results.filter(voice => voice.age === ageFilter);
    }
    
    setFilteredVoices(results);
  }, [allVoices, genderFilter, categoryFilter, ageFilter]);
  
  // Play preview for selected voice
  const playPreview = useCallback((voice: VoiceOption) => {
    if (isPlaying && selectedVoice?.id === voice.id) {
      pause();
    } else {
      play(previewText, { voiceId: voice.id });
      setSelectedVoice(voice);
    }
  }, [isPlaying, selectedVoice, previewText, play, pause]);
  
  // Handle voice selection
  const handleSelectVoice = useCallback((voice: VoiceOption) => {
    setSelectedVoice(voice);
    onSelect(voice);
  }, [onSelect]);
  
  // Get unique categories for filter
  const categories = React.useMemo(() => {
    if (!allVoices.length) return [];
    const uniqueCategories = new Set<string>();
    allVoices.forEach(voice => uniqueCategories.add(voice.category));
    return Array.from(uniqueCategories).sort();
  }, [allVoices]);
  
  // Reset all filters
  const resetFilters = useCallback(() => {
    setGenderFilter('all');
    setCategoryFilter('all');
    setAgeFilter('all');
    setShowFilters(false);
  }, []);
  
  // Determine if we have active filters
  const hasActiveFilters = genderFilter !== 'all' || categoryFilter !== 'all' || ageFilter !== 'all';
  
  // If error occurred
  if (error) {
    return (
      <Card className={cn("w-full border-orange-200 bg-orange-50", className)}>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3 text-orange-700">
            <VolumeX size={24} />
            <div>
              <h3 className="text-lg font-semibold">Voice Selection Unavailable</h3>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="w-full"
          >
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className={cn("w-full", className)}>
      <div className="px-4 py-3 bg-primary-50 border-b flex justify-between items-center">
        <h3 className="font-semibold text-primary-800">Choose Your Guide's Voice</h3>
        
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "h-8 px-2",
              hasActiveFilters && "text-primary-600"
            )}
          >
            <Filter size={16} className="mr-1" />
            {hasActiveFilters ? `Filters (${
              (genderFilter !== 'all' ? 1 : 0) + 
              (categoryFilter !== 'all' ? 1 : 0) + 
              (ageFilter !== 'all' ? 1 : 0)
            })` : "Filters"}
          </Button>
        </div>
      </div>
      
      {/* Filter panel */}
      {showFilters && (
        <div className="p-4 border-b bg-gray-50 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Gender</Label>
              <Select 
                value={genderFilter} 
                onValueChange={setGenderFilter}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="neutral">Neutral</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Category</Label>
              <Select 
                value={categoryFilter} 
                onValueChange={setCategoryFilter}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem 
                      key={category} 
                      value={category}
                    >
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label className="text-xs font-medium mb-1.5 block">Age</Label>
              <Select 
                value={ageFilter} 
                onValueChange={setAgeFilter}
              >
                <SelectTrigger className="h-8">
                  <SelectValue placeholder="All Ages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Ages</SelectItem>
                  <SelectItem value="young">Young</SelectItem>
                  <SelectItem value="adult">Adult</SelectItem>
                  <SelectItem value="senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-end mt-3">
            <Button
              variant="ghost" 
              size="sm"
              onClick={resetFilters}
              className="h-7 text-xs"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      )}
      
      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="px-4 py-2 border-b">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="all">All Voices</TabsTrigger>
            <TabsTrigger value="male">
              <User size={14} className="mr-1.5" />
              Male
            </TabsTrigger>
            <TabsTrigger value="female">
              <UserCircle size={14} className="mr-1.5" />
              Female
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="all" className="m-0">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 4 }).map((_, i) => (
                  <VoiceCardSkeleton key={i} />
                ))
              ) : filteredVoices.length === 0 ? (
                // No results
                <div className="col-span-full py-6 text-center text-gray-500">
                  <Users size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No voice options match your filters.</p>
                  <Button
                    variant="link"
                    onClick={resetFilters}
                    className="mt-1"
                  >
                    Reset Filters
                  </Button>
                </div>
              ) : (
                // Voice cards
                filteredVoices.map(voice => (
                  <VoiceCard
                    key={voice.id}
                    voice={voice}
                    isSelected={selectedVoice?.id === voice.id}
                    isPlaying={isPlaying && selectedVoice?.id === voice.id}
                    isPaused={isPaused && selectedVoice?.id === voice.id}
                    isLoading={isAudioLoading && selectedVoice?.id === voice.id}
                    onPlay={() => playPreview(voice)}
                    onSelect={() => handleSelectVoice(voice)}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="male" className="m-0">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 2 }).map((_, i) => (
                  <VoiceCardSkeleton key={i} />
                ))
              ) : filteredVoices.filter(v => v.gender === 'male').length === 0 ? (
                // No results
                <div className="col-span-full py-6 text-center text-gray-500">
                  <User size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No male voice options available.</p>
                </div>
              ) : (
                // Male voice cards
                filteredVoices
                  .filter(v => v.gender === 'male')
                  .map(voice => (
                    <VoiceCard
                      key={voice.id}
                      voice={voice}
                      isSelected={selectedVoice?.id === voice.id}
                      isPlaying={isPlaying && selectedVoice?.id === voice.id}
                      isPaused={isPaused && selectedVoice?.id === voice.id}
                      isLoading={isAudioLoading && selectedVoice?.id === voice.id}
                      onPlay={() => playPreview(voice)}
                      onSelect={() => handleSelectVoice(voice)}
                    />
                  ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="female" className="m-0">
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {isLoading ? (
                // Loading skeletons
                Array.from({ length: 2 }).map((_, i) => (
                  <VoiceCardSkeleton key={i} />
                ))
              ) : filteredVoices.filter(v => v.gender === 'female').length === 0 ? (
                // No results
                <div className="col-span-full py-6 text-center text-gray-500">
                  <Female size={24} className="mx-auto mb-2 opacity-50" />
                  <p>No female voice options available.</p>
                </div>
              ) : (
                // Female voice cards
                filteredVoices
                  .filter(v => v.gender === 'female')
                  .map(voice => (
                    <VoiceCard
                      key={voice.id}
                      voice={voice}
                      isSelected={selectedVoice?.id === voice.id}
                      isPlaying={isPlaying && selectedVoice?.id === voice.id}
                      isPaused={isPaused && selectedVoice?.id === voice.id}
                      isLoading={isAudioLoading && selectedVoice?.id === voice.id}
                      onPlay={() => playPreview(voice)}
                      onSelect={() => handleSelectVoice(voice)}
                    />
                  ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

// Voice card component
interface VoiceCardProps {
  voice: VoiceOption;
  isSelected: boolean;
  isPlaying: boolean;
  isPaused: boolean;
  isLoading: boolean;
  onPlay: () => void;
  onSelect: () => void;
}

function VoiceCard({
  voice,
  isSelected,
  isPlaying,
  isPaused,
  isLoading,
  onPlay,
  onSelect
}: VoiceCardProps) {
  // Generate avatar based on voice properties
  const avatarSrc = `/avatars/${voice.gender}/${voice.age}.svg`;
  
  // Gender icon
  const GenderIcon = voice.gender === 'male' ? Male : voice.gender === 'female' ? Female : Users;
  
  return (
    <Card 
      className={cn(
        "overflow-hidden transition-all border",
        isSelected ? "border-primary ring-1 ring-primary shadow-sm" : "hover:border-gray-300"
      )}
    >
      <div className="flex items-stretch">
        <div className="w-16 sm:w-20 flex items-center justify-center bg-gray-50 p-2">
          <ProgressiveImage
            src={avatarSrc}
            alt={`${voice.name} avatar`}
            className="w-full aspect-square rounded-full overflow-hidden"
            objectFit="cover"
          />
        </div>
        
        <div className="flex-1 p-3">
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium text-gray-900 flex items-center">
                {voice.name}
                {voice.isDefault && (
                  <Badge variant="secondary" className="ml-2 text-[9px] px-1 py-0 h-4">
                    Featured
                  </Badge>
                )}
              </h4>
              
              <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-0.5">
                <GenderIcon size={12} />
                <span className="capitalize">{voice.gender}</span>
                
                {voice.accent && (
                  <>
                    <span className="mx-0.5">•</span>
                    <span>{voice.accent}</span>
                  </>
                )}
                
                <span className="mx-0.5">•</span>
                <span className="capitalize">{voice.category}</span>
              </div>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0",
                isPlaying && "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
              )}
              onClick={onPlay}
              aria-label={isPlaying ? "Pause voice" : "Play voice sample"}
            >
              {isLoading ? (
                <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={16} />
              ) : isPaused ? (
                <SkipForward size={16} />
              ) : (
                <Play size={16} />
              )}
            </Button>
          </div>
          
          {voice.description && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {voice.description}
            </p>
          )}
        </div>
      </div>
      
      <Separator />
      
      <div className="p-2 flex justify-between items-center bg-gray-50">
        <span className="text-xs text-gray-500 italic pl-2">
          {isSelected ? "Currently selected" : "Preview and select"}
        </span>
        
        <Button
          variant={isSelected ? "default" : "outline"}
          size="sm"
          className="h-7"
          onClick={onSelect}
        >
          {isSelected ? (
            <>
              <Check size={14} className="mr-1" />
              Selected
            </>
          ) : (
            "Select Voice"
          )}
        </Button>
      </div>
    </Card>
  );
}

// Skeleton loading component
function VoiceCardSkeleton() {
  return (
    <Card className="overflow-hidden border">
      <div className="flex items-stretch">
        <div className="w-16 sm:w-20 flex items-center justify-center bg-gray-50 p-2">
          <Skeleton className="w-full aspect-square rounded-full" />
        </div>
        
        <div className="flex-1 p-3">
          <div className="flex justify-between items-start">
            <div>
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-3 w-32 mt-2" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
          
          <Skeleton className="h-3 w-full mt-3" />
          <Skeleton className="h-3 w-3/4 mt-1.5" />
        </div>
      </div>
      
      <Separator />
      
      <div className="p-2 flex justify-between items-center bg-gray-50">
        <Skeleton className="h-3 w-24 ml-2" />
        <Skeleton className="h-7 w-28 rounded-md" />
      </div>
    </Card>
  );
}