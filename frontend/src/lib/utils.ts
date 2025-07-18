import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  
  return function(...args: Parameters<T>) {
    if (timeout) {
      clearTimeout(timeout);
    }
    
    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

// Browser detection functions
export function isBraveBrowser(): boolean {
  // Brave modifies the navigator object with specific properties
  return (
    navigator.brave?.isBrave?.name === 'isBrave' || 
    // Alternative detection method
    (navigator.userAgent.includes('Chrome') && 
     'brave' in navigator && 
     typeof (navigator as any).brave.isBrave === 'function')
  );
}

// Special audio handling for different browsers
export function createCompatibleAudio(src: string, forceBlob = false): HTMLAudioElement {
  const audio = new Audio();
  
  // Brave requires special handling for audio, especially from API responses
  if (isBraveBrowser() || forceBlob) {
    // For Brave: fetch the audio and convert to blob
    fetch(src)
      .then(response => response.blob())
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        audio.src = blobUrl;
        // Clean up the blob URL when done to prevent memory leaks
        audio.onended = () => URL.revokeObjectURL(blobUrl);
      })
      .catch(err => {
        console.error('Error loading audio in Brave:', err);
        // Fallback to direct assignment
        audio.src = src;
      });
  } else {
    // For other browsers, direct assignment is fine
    audio.src = src;
  }
  
  return audio;
}