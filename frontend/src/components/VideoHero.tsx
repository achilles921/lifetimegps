import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { LuPlay, LuPause, LuVolume2, LuVolumeX } from 'react-icons/lu';

interface VideoHeroProps {
  videoPath: string;
  posterPath?: string;
  title?: string;
  subtitle?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export function VideoHero({
  videoPath,
  posterPath,
  title = "Discover Your Perfect Career Path",
  subtitle = "Our interactive assessment uses cutting-edge AI to map your perfect career journey.",
  ctaText = "Start Your Discovery",
  onCtaClick
}: VideoHeroProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Handle video when component mounts
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      // Function handlers for event listeners
      const handlePlay = () => setIsPlaying(true);
      const handlePause = () => setIsPlaying(false);
      const handleEnded = () => setIsPlaying(false);
      const handleCanPlay = () => {
       //  console.log("Video can play now:", videoPath);
        // Optionally auto-play when ready
        if (!hasStarted) {
          try {
            video.muted = true;
            video.play().then(() => {
              setIsPlaying(true);
              setHasStarted(true);
            }).catch(err => {
              console.error("Error auto-playing video:", err);
            });
          } catch (err) {
            console.error("Error during video play:", err);
          }
        }
      };
      
      // Add event listeners
      video.addEventListener('play', handlePlay);
      video.addEventListener('pause', handlePause);
      video.addEventListener('ended', handleEnded);
      video.addEventListener('canplay', handleCanPlay);
      
      // Force the video to load
      video.load();
      
      // Cleanup event listeners on unmount
      return () => {
        video.removeEventListener('play', handlePlay);
        video.removeEventListener('pause', handlePause);
        video.removeEventListener('ended', handleEnded);
        video.removeEventListener('canplay', handleCanPlay);
      };
    }
  }, [videoPath, hasStarted]);

  // Handle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    
    if (isPlaying) {
      video.pause();
    } else {
      video.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
    
    setHasStarted(true);
  };

  // Handle mute/unmute
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    const newMutedState = !isMuted;
    video.muted = newMutedState;
    setIsMuted(newMutedState);
  };

  // Default action for the CTA button if none provided
  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else {
      // If no click handler provided, default to navigating to voice-demo
      window.location.assign('/voice-demo');
     //  console.log('Navigating to /voice-demo');
    }
  };

  return (
    <div className="relative w-full max-h-[80vh] overflow-hidden">
      {/* Video */}
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full object-cover max-h-[80vh]"
          poster={posterPath}
          playsInline
          loop
          preload="auto"
          muted
          controls
        >
          <source src={videoPath} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        
        {/* Video controls */}
        <div className="absolute bottom-4 left-4 flex items-center space-x-2 z-10">
          <button
            onClick={togglePlay}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition"
            aria-label={isPlaying ? "Pause video" : "Play video"}
          >
            {isPlaying ? <LuPause className="h-5 w-5" /> : <LuPlay className="h-5 w-5" />}
          </button>
          
          <button
            onClick={toggleMute}
            className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/30 transition"
            aria-label={isMuted ? "Unmute video" : "Mute video"}
          >
            {isMuted ? <LuVolumeX className="h-5 w-5" /> : <LuVolume2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
      
      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 drop-shadow-md animate-fade-in">
            {title}
          </h1>
          
          <p className="text-lg md:text-xl mb-8 max-w-xl mx-auto text-white/90 drop-shadow-md animate-fade-in-delay">
            {subtitle}
          </p>
          
          <div className="animate-fade-in-scale-delay">
            <Button 
              size="lg" 
              onClick={handleCtaClick}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-md shadow-lg"
            >
              {ctaText}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}