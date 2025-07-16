/**
 * ElevenLabs Voice API integration
 * This service handles text-to-speech conversion using ElevenLabs' API.
 */

const API_URL = "https://api.elevenlabs.io/v1";

// Voice IDs for different voice types
// These are premium voices from ElevenLabs' library
const VOICE_IDS = {
  // Female voices with warm, friendly tones (similar to Gail Swift)
  female: [
    "XB0fDUnXU5powFXDhCwa", // Rachel - Warm, friendly voice with a natural tone
    "pNInz6obpgDQGcFmaJgB", // Bella - Very natural, warm and gentle
    "EXAVITQu4vr4xnSDxMaL"  // Elli - Cheerful, conversational
  ],
  // Male voices with professional, friendly tones
  male: [
    "ErXwobaYiN019PkySvjV", // Antoni - Well-articulated, trustworthy
    "MF3mGyEYCl7XYWbV9V6O", // Adam - Professional, friendly
    "pqHfZKP75CvOlQylXSjW"  // Josh - Conversational, engaging
  ]
};

// Cache for audio data to prevent repeated API calls for the same text
const audioCache = new Map<string, string>();

/**
 * Generate a cache key based on text and voice type
 */
function getCacheKey(text: string, voiceType: string): string {
  const voiceId = getVoiceId(voiceType);
  return `${voiceId}-${text}`;
}

/**
 * Get a voice ID based on the requested voice type
 */
function getVoiceId(voiceType: string): string {
  const voices = voiceType === 'female' ? VOICE_IDS.female : VOICE_IDS.male;
  // For now, just use the first voice in each category
  return voices[0];
}

/**
 * Convert text to speech using ElevenLabs API
 * Returns a data URL containing the audio
 */
export async function textToSpeech(text: string, voiceType: string = 'female'): Promise<string> {
  try {
    const cacheKey = getCacheKey(text, voiceType);
    
    // Check if we already have this audio cached
    if (audioCache.has(cacheKey)) {
      return audioCache.get(cacheKey)!;
    }
    
    const voiceId = getVoiceId(voiceType);
    
    // API key is available in environment
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY || '';
    
    if (!apiKey) {
      console.error('ElevenLabs API key is missing');
      throw new Error('API key is required');
    }
    
    // Set parameters for natural speech
    const options = {
      method: 'POST',
      headers: {
        'Accept': 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': apiKey
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0.3,  // Slightly emphasized style for more expressiveness
          use_speaker_boost: true
        }
      })
    };
    
    // Make the API request
    const response = await fetch(`${API_URL}/text-to-speech/${voiceId}`, options);
    
    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status} ${response.statusText}`);
    }
    
    // Convert the audio blob to a data URL
    const audioBlob = await response.blob();
    const audioUrl = URL.createObjectURL(audioBlob);
    
    // Cache the result
    audioCache.set(cacheKey, audioUrl);
    
    return audioUrl;
  } catch (error) {
    console.error('Error converting text to speech:', error);
    throw error;
  }
}

/**
 * Clean up any created object URLs to prevent memory leaks
 */
export function cleanupAudio(audioUrl: string): void {
  if (audioUrl && audioUrl.startsWith('blob:')) {
    URL.revokeObjectURL(audioUrl);
  }
}