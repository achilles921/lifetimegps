import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ActivityProvider } from "./context/ActivityContext";

// Import the audio mixer utilities file instead of defining global functions
import { setTrackVolume, TrackTypes } from "./components/audioMixer";

// Create a proper module for audio mix status evaluation
const AudioMixEvaluator = {
  // Evaluate the current mix based on slider values
  evaluateMix: (vocalValue: number, drumsValue: number, bassValue: number, reverbValue: number): { 
    message: string, 
    status: 'perfect' | 'warning' | 'default'
  } => {
    if (vocalValue > 80 && drumsValue > 70 && bassValue > 70) {
      return {
        message: "Too loud! Reduce some levels for a better balance",
        status: 'warning'
      };
    } else if (vocalValue < 30 && drumsValue < 30 && bassValue < 30) {
      return {
        message: "Too quiet! Increase some levels for better presence",
        status: 'warning'
      };
    } else if (reverbValue > 70) {
      return {
        message: "Too much reverb! The mix sounds washed out",
        status: 'warning'
      };
    } else if (vocalValue >= 65 && vocalValue <= 80 && 
              drumsValue >= 50 && drumsValue <= 70 && 
              bassValue >= 40 && bassValue <= 60 && 
              reverbValue >= 20 && reverbValue <= 40) {
      return {
        message: "Perfect balance! This mix sounds professional",
        status: 'perfect'
      };
    } else {
      return {
        message: "Adjust the sliders to create your mix",
        status: 'default'
      };
    }
  },

  // Update the UI based on the evaluation
  updateMixStatus: () => {
    try {
      const vocalSlider = document.getElementById('vocal-slider') as HTMLInputElement;
      const drumsSlider = document.getElementById('drums-slider') as HTMLInputElement;
      const bassSlider = document.getElementById('bass-slider') as HTMLInputElement;
      const reverbSlider = document.getElementById('reverb-slider') as HTMLInputElement;
      const mixStatus = document.getElementById('mix-status');
      
      if (vocalSlider && drumsSlider && bassSlider && reverbSlider && mixStatus) {
        const vocalValue = parseInt(vocalSlider.value);
        const drumsValue = parseInt(drumsSlider.value);
        const bassValue = parseInt(bassSlider.value);
        const reverbValue = parseInt(reverbSlider.value);
        
        // Get evaluation
        const evaluation = AudioMixEvaluator.evaluateMix(vocalValue, drumsValue, bassValue, reverbValue);
        
        // Update UI
        mixStatus.innerText = evaluation.message;
        if (evaluation.status === 'perfect') {
          mixStatus.className = "bg-green-100 text-green-800";
        } else {
          mixStatus.className = "bg-amber-100 text-amber-800";
        }
        
        // Apply the slider values to the actual audio nodes
        if (typeof setTrackVolume === 'function') {
          setTrackVolume(TrackTypes.VOCAL, vocalValue / 100);
          setTrackVolume(TrackTypes.DRUMS, drumsValue / 100);
          setTrackVolume(TrackTypes.BASS, bassValue / 100);
          setTrackVolume(TrackTypes.REVERB, reverbValue / 100);
        }
        
        // Update VU meter
        const vuMeter = document.getElementById('vu-meter');
        if (vuMeter) {
          const avgLevel = (vocalValue + drumsValue + bassValue) / 3;
          const children = vuMeter.children;
          if (children.length > 0) {
            (children[0] as HTMLElement).style.height = Math.min(Math.max(avgLevel, 5), 100) + '%';
          }
        }
      }
    } catch (error) {
      console.error("Error updating audio mix status:", error);
    }
  }
};

// Expose the function globally but in a controlled way
if (typeof window !== 'undefined') {
  (window as any).updateAudioMixStatus = AudioMixEvaluator.updateMixStatus;
}


createRoot(document.getElementById("root")!).render(
  <ActivityProvider>
    <App />
  </ActivityProvider>
);