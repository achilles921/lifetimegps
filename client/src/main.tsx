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


// Function to add mock quiz data if none exists
/*  NOT USED ANYMORE!
function addMockQuizData() {
  try {
    // Check if we should reset all data (for testing)
    const shouldResetData = false;
    
    if (shouldResetData) {
      // Clear all existing quiz data (FOR TESTING ONLY)
      const allKeys = Object.keys(localStorage);
      const quizKeys = allKeys.filter(key => key.includes('_quickQuizAnswers_'));
      quizKeys.forEach(key => localStorage.removeItem(key));
      console.log('Cleared all existing quiz data for testing');
    }
    
    // Get all known email accounts
    const userEmails = ['alainwin@gmail.com', 'alainwin@yahoo.com'];
    
    // For each email, check if they have quiz data
    userEmails.forEach(email => {
      // Get current localStorage keys
      const allKeys = Object.keys(localStorage);
      
      // Check if we already have user-specific data
      const userSpecificKeys = allKeys.filter(key => 
        key.includes(email) && 
        key.includes('_quickQuizAnswers_')
      );
      
      // If this user already has quiz data, don't overwrite it
      if (userSpecificKeys.length > 0) {
        console.log(`User ${email} already has quiz data (${userSpecificKeys.length} entries)`);
        return;
      }
      
      console.log(`Adding mock quiz data for ${email}`);
      
      // Create a session ID for this user's quiz data
      const timestamp = Date.now();
      const randomSuffix = Math.random().toString(36).substring(2, 15);
      const sessionId = `quiz_${email}_${timestamp}_${randomSuffix}`;
      
      // Store the userEmail with this session
      localStorage.setItem(`${sessionId}_userEmail`, email);
      
      // Mock data for Sector 1 (Work Style and Preferences)
      const sector1Data = {
        'work_pace': 'fast',
        'teamwork': 'collaborative',
        'management_style': 'supportive',
        'work_environment': 'mixed',
        'travel': 'moderate',
        'flexibility': 'high',
        's1_q1': 'independent',
        's1_q2': 'creative',
        's1_q3': 'flexible'
      };
      localStorage.setItem(`${sessionId}_quickQuizAnswers_sector_1`, JSON.stringify(sector1Data));
      
      // Mock data for Sector 2 (Cognitive Strengths)
      const sector2Data = {
        'analytical': 'high',
        'creative': 'very_high',
        'technical': 'medium',
        'verbal': 'high',
        'mathematical': 'medium',
        'spatial': 'high',
        's2_q1': 'problem_solving',
        's2_q2': 'innovation',
        's2_q3': 'visualization'
      };
      localStorage.setItem(`${sessionId}_quickQuizAnswers_sector_2`, JSON.stringify(sector2Data));
      
      // Mock data for Sector 3 (Personality)
      const sector3Data = {
        'extroversion': 'medium',
        'openness': 'high',
        'conscientiousness': 'very_high',
        'agreeableness': 'high',
        'neuroticism': 'low',
        'risk_tolerance': 'medium',
        's3_q1': 'adaptable',
        's3_q2': 'detail_oriented',
        's3_q3': 'curious'
      };
      localStorage.setItem(`${sessionId}_quickQuizAnswers_sector_3`, JSON.stringify(sector3Data));
      
      // Mock data for Sector 4 (Motivation)
      const sector4Data = {
        'financial': 'important',
        'purpose': 'very_important',
        'growth': 'critical',
        'recognition': 'somewhat_important',
        'work_life_balance': 'very_important',
        'job_security': 'important',
        's4_q1': 'meaning',
        's4_q2': 'challenge',
        's4_q3': 'autonomy'
      };
      localStorage.setItem(`${sessionId}_quickQuizAnswers_sector_4`, JSON.stringify(sector4Data));
      
      // Mock data for Sector 5 (Interests)
      const sector5Data = {
        // Use the actual interest IDs
        'interests': ['8', '13', '15', '17', '20']
      };
      localStorage.setItem(`${sessionId}_quickQuizAnswers_sector_5`, JSON.stringify(sector5Data));
      
      // Mark this quiz as complete
      localStorage.setItem(`${sessionId}_quickQuizAnswers_complete`, 'true');
      
      console.log(`Created mock quiz data for ${email} with session ID ${sessionId}`);
      
      // Store career matches based on these responses
      const mockCareerMatches = [
        {
          id: "software_developer",
          title: "Software Developer",
          match: 95,
          description: "Create applications and systems that power our digital world. Software developers build, test, and maintain software for various platforms.",
          skills: ["Problem Solving", "Coding", "Critical Thinking", "Collaboration", "Adaptability"],
          education: "Bachelor's in Computer Science or equivalent experience",
          salary: "$110,140",
          outlook: "+22% (2020-2030)",
          category: "Technology"
        },
        {
          id: "ux_ui_designer",
          title: "UX/UI Designer",
          match: 92,
          description: "Create intuitive and engaging user experiences for digital products. UX/UI designers focus on how users interact with applications and websites.",
          skills: ["Creativity", "User Empathy", "Visual Design", "Wireframing", "User Research"],
          education: "Bachelor's in Design, HCI, or equivalent experience",
          salary: "$85,650",
          outlook: "+13% (2020-2030)",
          category: "Creative Technology"
        },
        {
          id: "content_creator",
          title: "Content Creator",
          match: 90,
          description: "Develop engaging digital content for social media, websites, and other platforms to build audience and drive engagement.",
          skills: ["Storytelling", "Visual Communication", "Audience Building", "Social Media", "Trend Analysis"],
          education: "Various paths available - degree in Communications/Media or practical experience",
          salary: "$63,400 (varies widely)",
          outlook: "+17% (2020-2030)",
          category: "Creative"
        },
        {
          id: "data_scientist",
          title: "Data Scientist",
          match: 88,
          description: "Extract valuable insights from complex data to drive business decisions. Data scientists use statistical analysis and machine learning.",
          skills: ["Analytics", "Programming", "Statistics", "Problem Solving", "Communication"],
          education: "Bachelor's or Master's in Data Science or related field",
          salary: "$100,560",
          outlook: "+28% (2020-2030)",
          category: "Technology"
        },
        {
          id: "entrepreneur",
          title: "Entrepreneur/Business Owner",
          match: 85,
          description: "Build and run your own business ventures, identifying opportunities and bringing innovative ideas to market.",
          skills: ["Leadership", "Strategic Planning", "Financial Management", "Marketing", "Risk Assessment"],
          education: "Various paths available - degree in Business/relevant field or practical experience",
          salary: "Variable (median $59,800 with potential for significant growth)",
          outlook: "+8% (2020-2030)",
          category: "Business"
        }
      ];
      
      localStorage.setItem('allCareerMatches', JSON.stringify(mockCareerMatches));
      console.log(`Stored mock career matches for ${email}`);
    });
  } catch (error) {
    console.error('Error adding mock quiz data:', error);
  }
}*/



createRoot(document.getElementById("root")!).render(
  <ActivityProvider>
    <App />
  </ActivityProvider>
);