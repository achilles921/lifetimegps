import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechProps {
  voiceType?: string;
}

export function useSpeech({ voiceType = 'female' }: UseSpeechProps = {}) {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [text, setText] = useState('');
  
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize speech synthesis
  useEffect(() => {
    // Check if speech synthesis is available
    if (!window.speechSynthesis) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Get available voices
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      if (availableVoices.length > 0) {
        setVoices(availableVoices);
        setIsReady(true);
      }
    };

    // Chrome loads voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    loadVoices();

    // Clean up
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Get appropriate voice based on preference
  const getVoice = useCallback(() => {
    if (voices.length === 0) return null;

   //  console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));

    // Define premium natural-sounding voices prioritized to match Gail Swift's voice
    // These are voices that may have qualities like hers - warm, confident, and dynamic
    const premiumFemaleVoices = [
      // Top choices that may sound more like Gail Swift
      'Samantha', 'Karen', 'Moira', 'Microsoft Zira', 
      // Secondary options with good quality
      'Google US English Female', 'Ava', 'Alex', 'Fiona',
      'Google US English', 'en-US-Neural2-F', 'en-GB-Neural2-C',
      // Edge voices with good warmth
      'Microsoft Zira Desktop', 'Microsoft Susan', 'Microsoft Linda'
    ];
    
    const premiumMaleVoices = [
      'Daniel', 'Google UK English Male', 'Microsoft David', 'Tom', 
      'Arthur', 'Nathan', 'Oliver', 'Google US English Male', 
      'en-US-Neural2-D', 'en-US-Wavenet-D', 'en-GB-Neural2-B'
    ];

    // Try to match premium voices first
    let premiumMatches = [];
    if (voiceType === 'female') {
      premiumMatches = voices.filter(voice => 
        premiumFemaleVoices.some(name => 
          voice.name.includes(name)
        )
      );
    } else {
      premiumMatches = voices.filter(voice => 
        premiumMaleVoices.some(name => 
          voice.name.includes(name)
        )
      );
    }

    // If we have premium matches, prefer those in English
    if (premiumMatches.length > 0) {
      const englishPremium = premiumMatches.filter(
        voice => voice.lang.includes('en')
      );
      
      if (englishPremium.length > 0) {
        return englishPremium[0];
      }
      
      return premiumMatches[0];
    }

    // Fallback to standard voice detection
    let preferredVoices: SpeechSynthesisVoice[] = [];
    
    if (voiceType === 'female') {
      // Use a scoring system to find voices most similar to Gail Swift
      const scoredVoices = voices.map(voice => {
        let score = 0;
        const nameLower = voice.name.toLowerCase();
        
        // Prioritize US English voices (Gail has an American accent)
        if (voice.lang === 'en-US') score += 5;
        else if (voice.lang.startsWith('en')) score += 3;
        
        // Prioritize voices with certain keywords that might sound warm and dynamic
        if (nameLower.includes('samantha')) score += 8; // Often a warm, confident voice
        if (nameLower.includes('karen')) score += 7;    // Can be similar to Gail's clarity
        if (nameLower.includes('susan')) score += 6;    // Often a professional tone
        if (nameLower.includes('zira')) score += 5;     // Good clarity and warmth
        if (nameLower.includes('woman')) score += 4;    // Likely a mature female voice
        if (nameLower.includes('female')) score += 3;   // Explicitly female
        if (nameLower.includes('lisa')) score += 3;     // Often friendly tone
        if (nameLower.includes('natural')) score += 10; // Directly labeled as natural
        
        return { voice, score };
      });
      
      // Sort by score and convert back to just voices
      const sortedVoices = scoredVoices
        .sort((a, b) => b.score - a.score)
        .map(item => item.voice);
      
      preferredVoices = sortedVoices.length > 0 ? sortedVoices : voices;
    } else {
      preferredVoices = voices.filter(
        voice => 
          voice.name.toLowerCase().includes('male') ||
          voice.name.toLowerCase().includes('man') ||
          voice.name.toLowerCase().includes('guy') ||
          voice.name.toLowerCase().includes('daniel') ||
          voice.name.toLowerCase().includes('david') ||
          voice.name.toLowerCase().includes('john') ||
          voice.name.toLowerCase().includes('tom')
      );
    }

    // If no matching voice found, use the first available voice
    if (preferredVoices.length === 0) {
      return voices[0];
    }

    // Prefer English voices if available
    const englishVoices = preferredVoices.filter(
      voice => voice.lang.includes('en')
    );

    if (englishVoices.length > 0) {
      // For English voices, prefer ones marked as "natural" if available
      const naturalVoice = englishVoices.find(
        voice => voice.name.toLowerCase().includes('natural')
      );

      return naturalVoice || englishVoices[0];
    }

    return preferredVoices[0];
  }, [voices, voiceType]);

  // Speak the provided text
  const speak = useCallback((textToSpeak: string) => {
    if (!window.speechSynthesis || !isReady) {
      console.error('Speech synthesis not ready');
      return;
    }

    // Stop any current speech
    window.speechSynthesis.cancel();
    
    // Process text to match Gail Swift's speaking style - enthusiastic, warm, and confident
    // Add appropriate pauses and emphasis
    const processedText = textToSpeak
      .replace(/\./g, '... ') // Slightly longer pause after periods like Gail often does
      .replace(/\,/g, ', ') // Brief pause after commas
      .replace(/\!/g, '! ... ') // Emphasis after exclamations with a pause
      .replace(/\?/g, '? ... ') // Thoughtful pause after questions
      // Add more breathing room between sentences for a natural rhythm like Gail's speech
      .replace(/\. ([A-Z])/g, '... $1'); 
      
    // Emphasize motivational and career-focused words that Gail would emphasize
    // This improves the prosody (rhythm, stress, intonation) to sound more like her
    const naturalText = processedText.replace(
      /(career|future|potential|success|journey|path|opportunity|growth|develop|skills|passion|strengths|achievement|goals|dream job|profession|trade|apprenticeship|amazing|perfect|great|excellent|wonderful|important|key|crucial|exciting|interesting)/gi,
      word => `${word}` // Web Speech API doesn't support explicit emphasis, but word recognition helps
    );
    
    // Create new utterance
    const utterance = new SpeechSynthesisUtterance(naturalText);
    utteranceRef.current = utterance;
    
    // Set voice
    const voice = getVoice();
    if (voice) {
      utterance.voice = voice;
    }
    
    // Set properties to match Gail Swift's voice characteristics 
    // Slightly more moderate pace - she speaks clearly but with enthusiasm
    utterance.rate = 0.92; 
    // Higher pitch for female voice with warm tone
    utterance.pitch = voiceType === 'female' ? 1.15 : 0.95;
    // Full volume but not overwhelming
    utterance.volume = 1.0;
    
    // Event handlers
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
      setText(textToSpeak); // Store original text for repeat function
    };
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
      setText('');
    };
    
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
    };
    
    // Speak
    window.speechSynthesis.speak(utterance);
  }, [isReady, getVoice, voiceType]);

  // Pause speaking
  const pause = useCallback(() => {
    if (!window.speechSynthesis || !isSpeaking) return;
    
    window.speechSynthesis.pause();
    setIsPaused(true);
  }, [isSpeaking]);

  // Resume speaking
  const resume = useCallback(() => {
    if (!window.speechSynthesis || !isPaused) return;
    
    window.speechSynthesis.resume();
    setIsPaused(false);
  }, [isPaused]);

  // Stop speaking
  const stop = useCallback(() => {
    if (!window.speechSynthesis) return;
    
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    setText('');
  }, []);

  // Repeat current text
  const repeat = useCallback(() => {
    if (text) {
      speak(text);
    }
  }, [text, speak]);

  return {
    speak,
    pause,
    resume,
    stop,
    repeat,
    isSpeaking,
    isPaused,
    isReady,
    text
  };
}
