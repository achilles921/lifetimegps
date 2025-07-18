// Web Audio API based mixer for the Audio Production mini-game

// AudioContext singleton
let audioContext: AudioContext | null = null;

// Audio nodes
let oscillators: OscillatorNode[] = [];
let gainNodes: GainNode[] = [];
let masterGain: GainNode | null = null;

// Track types
const TRACK_TYPES = {
  VOCAL: 0,
  DRUMS: 1,
  BASS: 2,
  REVERB: 3
};

// Animation interval ID
let vuMeterAnimationId: number | null = null;

/**
 * Check if Web Audio API is supported in this browser
 */
export function isAudioSupported(): boolean {
  return !!(window.AudioContext || (window as any).webkitAudioContext);
}

/**
 * Resume audio context if it was suspended (browser autoplay policy)
 */
export async function resumeAudioContext(): Promise<boolean> {
  try {
    if (audioContext && audioContext.state === 'suspended') {
      await audioContext.resume();
      return true;
    }
    return audioContext?.state === 'running' || false;
  } catch (error) {
    console.error("Failed to resume audio context:", error);
    return false;
  }
}

/**
 * Initialize the audio mixer with browser compatibility handling
 */
export function initAudioMixer(): boolean {
  try {
    // Check if browser supports Web Audio API
    if (!isAudioSupported()) {
      console.warn("Web Audio API is not supported in this browser");
      return false;
    }
    
    // Create Web Audio API context
    if (!audioContext) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
    } else if (audioContext.state === 'closed') {
      // Create a new context if the previous one was closed
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContext = new AudioContextClass();
    }
    
    // Create oscillators for different sounds
    oscillators = [
      createOscillator('sine', 440),    // Vocals: A4 note with sine wave
      createOscillator('square', 220),  // Drums: A3 note with square wave
      createOscillator('triangle', 110), // Bass: A2 note with triangle wave
      createOscillator('sine', 880)     // Reverb: A5 note with sine wave
    ];
    
    // Create gain nodes for volume control
    gainNodes = [
      audioContext.createGain(), // Vocals gain
      audioContext.createGain(), // Drums gain
      audioContext.createGain(), // Bass gain
      audioContext.createGain()  // Reverb gain
    ];
    
    // Set initial volume to low to prevent surprise loud sounds
    gainNodes.forEach(gain => gain.gain.value = 0.5);
    
    // Create master gain node
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.7; // Set default master volume
    
    // Connect oscillators to their respective gain nodes
    oscillators.forEach((osc, index) => {
      osc.connect(gainNodes[index]);
      gainNodes[index].connect(masterGain!);
    });
    
    // Connect master gain to audio output
    masterGain.connect(audioContext.destination);
    
    return true;
  } catch (error) {
    console.error("Failed to initialize audio mixer:", error);
    return false;
  }
}

/**
 * Create an oscillator with the specified type and frequency
 */
function createOscillator(type: OscillatorType, frequency: number): OscillatorNode {
  if (!audioContext) {
    throw new Error("Audio context not initialized");
  }
  
  const oscillator = audioContext.createOscillator();
  
  // Safely set oscillator type with fallback if the type isn't supported
  try {
    oscillator.type = type;
  } catch (e) {
    console.warn(`Oscillator type ${type} not supported, falling back to sine`);
    oscillator.type = 'sine';
  }
  
  oscillator.frequency.value = frequency;
  return oscillator;
}

/**
 * Set the volume for a specific track with smooth transition
 */
export function setTrackVolume(trackType: number, volume: number, masterVolume: number = 1): void {
  if (!gainNodes[trackType]) {
    console.error(`Invalid track type: ${trackType}`);
    return;
  }
  
  try {
    // Clamp volume to valid range
    const clampedVolume = Math.max(0, Math.min(1, volume));
    const gain = gainNodes[trackType].gain;
    
    // Apply volume scaled by master volume with smooth transition
    const targetValue = clampedVolume * masterVolume;
    
    // Use exponential ramp for more natural volume changes
    const now = audioContext?.currentTime || 0;
    // Avoid zero value for exponentialRampToValueAtTime 
    gain.setValueAtTime(Math.max(0.00001, gain.value), now);
    gain.exponentialRampToValueAtTime(Math.max(0.00001, targetValue), now + 0.05);
  } catch (error) {
    console.error("Error setting track volume:", error);
    // Fallback to direct value setting if ramping fails
    gainNodes[trackType].gain.value = Math.max(0, Math.min(1, volume)) * masterVolume;
  }
}

/**
 * Set the master volume with smooth transition
 */
export function setMasterVolume(volume: number): void {
  if (!masterGain || !audioContext) {
    console.error("Master gain not initialized");
    return;
  }
  
  try {
    // Clamp volume to valid range
    const clampedVolume = Math.max(0, Math.min(1, volume));
    
    // Apply volume with smooth transition
    const now = audioContext.currentTime;
    // Avoid zero value for exponentialRampToValueAtTime
    masterGain.gain.setValueAtTime(Math.max(0.00001, masterGain.gain.value), now);
    masterGain.gain.exponentialRampToValueAtTime(Math.max(0.00001, clampedVolume), now + 0.05);
  } catch (error) {
    console.error("Error setting master volume:", error);
    // Fallback to direct value setting if ramping fails
    masterGain.gain.value = Math.max(0, Math.min(1, volume));
  }
}

/**
 * Start playback with user gesture handling
 */
export async function startPlayback(): Promise<boolean> {
  try {
    if (!audioContext) {
      console.warn("Audio context not initialized, attempting to initialize");
      if (!initAudioMixer()) {
        return false;
      }
    }
    
    // Handle browser autoplay restrictions
    if (audioContext && audioContext.state === 'suspended') {
      try {
        await audioContext.resume();
      } catch (e) {
        console.warn("Could not resume audio context. User interaction required:", e);
        return false;
      }
    }
    
    if (oscillators.length === 0) {
      console.error("Oscillators not initialized");
      return false;
    }
    
    // Start all oscillators
    oscillators.forEach(osc => {
      try {
        osc.start();
      } catch (e) {
        // Ignore already started errors
        if (!(e instanceof DOMException && e.message.includes('already started'))) {
          console.error("Error starting oscillator:", e);
        }
      }
    });
    
    return true;
  } catch (error) {
    console.error("Error starting playback:", error);
    return false;
  }
}

/**
 * Get current audio context state
 */
export function getAudioContextState(): string {
  return audioContext?.state || 'closed';
}

/**
 * Stop playback and clean up
 */
export function stopPlayback(): void {
  try {
    // Stop all oscillators
    oscillators.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Ignore already stopped errors
        if (!(e instanceof DOMException && e.message.includes('already stopped'))) {
          console.error("Error stopping oscillator:", e);
        }
      }
    });
    
    // Close audio context
    if (audioContext) {
      audioContext.close().catch(err => {
        console.error("Error closing audio context:", err);
      });
    }
    
    // Reset state
    audioContext = null;
    oscillators = [];
    gainNodes = [];
    masterGain = null;
    
    // Stop VU meter animation
    if (vuMeterAnimationId !== null) {
      clearInterval(vuMeterAnimationId);
      vuMeterAnimationId = null;
    }
  } catch (error) {
    console.error("Error stopping playback:", error);
    
    // Force reset state even if errors occur
    audioContext = null;
    oscillators = [];
    gainNodes = [];
    masterGain = null;
  }
}

/**
 * Start VU meter animation with performance optimization
 */
export function startVuMeterAnimation(vuMeter: HTMLElement): void {
  if (!vuMeter) return;
  
  const children = vuMeter.children;
  if (children.length === 0) return;
  
  // Stop any existing animation
  if (vuMeterAnimationId !== null) {
    clearInterval(vuMeterAnimationId);
  }
  
  // Use requestAnimationFrame for better performance if available
  const meterElement = children[0] as HTMLElement;
  let lastTime = 0;
  let height = 20;
  
  const updateMeter = (timestamp: number) => {
    // Update approximately 5 times per second
    if (timestamp - lastTime > 200) {
      height = 20 + Math.floor(Math.random() * 80);
      meterElement.style.height = `${height}%`;
      lastTime = timestamp;
    }
    
    if (vuMeterAnimationId !== null) { // Only continue if not stopped
      requestAnimationFrame(updateMeter);
    }
  };
  
  // Start animation with requestAnimationFrame if supported
  // All modern browsers support requestAnimationFrame, but check for safety
  if (typeof window.requestAnimationFrame === 'function') {
    vuMeterAnimationId = 1; // Non-null value to indicate animation is running
    requestAnimationFrame(updateMeter);
  } else {
    // Fallback to setInterval for older browsers
    vuMeterAnimationId = window.setInterval(() => {
      height = 20 + Math.floor(Math.random() * 80);
      meterElement.style.height = `${height}%`;
    }, 200);
  }
}

/**
 * Stop VU meter animation
 */
export function stopVuMeterAnimation(vuMeter: HTMLElement): void {
  if (!vuMeter) return;
  
  // Clear animation
  if (vuMeterAnimationId !== null) {
    if (typeof vuMeterAnimationId === 'number' && vuMeterAnimationId > 1) {
      // It's a setInterval ID
      clearInterval(vuMeterAnimationId);
    }
    // For requestAnimationFrame, setting to null will stop the recursive calls
    vuMeterAnimationId = null;
  }
  
  // Reset meter
  const children = vuMeter.children;
  if (children.length > 0) {
    (children[0] as HTMLElement).style.height = '25%';
  }
}

// Export track types for easy reference
export const TrackTypes = TRACK_TYPES;