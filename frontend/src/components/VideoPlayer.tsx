import React, { useRef, useEffect, useState } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  posterSrc: string;
  height?: string;
  width?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  videoSrc, 
  posterSrc, 
  height = 'auto', 
  width = '100%' 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleCanPlay = () => {
      setLoading(false);
     //  console.log("Video can now play");
    };

    const handleError = (e: Event) => {
      console.error("Video error:", e);
      setError(true);
      setLoading(false);
    };

    video.addEventListener('canplay', handleCanPlay);
    video.addEventListener('error', handleError);

    // Load the video
    video.load();

    return () => {
      video.removeEventListener('canplay', handleCanPlay);
      video.removeEventListener('error', handleError);
    };
  }, [videoSrc]);

  return (
    <div style={{ position: 'relative', width, height }}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent"></div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
          <div className="text-center p-4">
            <p className="text-red-500 font-bold">Failed to load video</p>
            <img 
              src={posterSrc} 
              alt="Video poster" 
              className="max-h-[80vh] mx-auto mt-4"
            />
          </div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className={`w-full h-full object-cover ${loading || error ? 'hidden' : 'block'}`}
        poster={posterSrc}
        controls
        loop
        muted
        playsInline
        autoPlay
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};