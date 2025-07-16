import axios from 'axios';
import { log } from '../vite';

// Types for voice data
export interface Voice {
  voice_id: string;
  name: string;
  preview_url: string;
  gender: 'male' | 'female' | 'other';
  accent?: string;
  ethnicity?: string;  // Added ethnicity field
  description?: string;
}

// Types for text-to-speech parameters
export interface TTSParams {
  text: string;
  voice_id: string;
  voice_settings?: {
    stability: number;
    similarity_boost: number;
  };
}

// ElevenLabs API base URL
const API_URL = 'https://api.elevenlabs.io/v1';

// Check for API key
if (!process.env.ELEVENLABS_API_KEY) {
  log('Warning: ELEVENLABS_API_KEY environment variable is not set', 'voice');
}

// API headers with key
const headers = {
  'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
  'Content-Type': 'application/json',
};

// Define ethnicity mappings to use across functions
const ethnicVoiceMappings = {
  female: {
    // British - Just one British voice option
    'Charlotte': 'british', 
    
    // Irish and Australian options
    'Freya': 'irish',
    'Nicole': 'australian',
    
    // African American voices
    'Aria': 'african-american',
    'Grace': 'african-american-2',
    
    // Hispanic voices
    'Jessica': 'hispanic',
    'Bella': 'hispanic-2',
    
    // Asian voices
    'Laura': 'asian',
    'Emma': 'asian-2',
    
    // North American voices - One Canadian, rest American
    'Lily': 'american',
    'Olivia': 'american-2',
    'Sarah': 'canadian',  // Just one Canadian female voice
    'Rachel': 'american-3',
    'Ashley': 'american-4',
    'Madison': 'american-midwest',
  },
  male: {
    // British - Just one British voice option
    'George': 'british',
    
    // Irish and Australian options
    'Patrick': 'irish',
    'Thomas': 'australian',
    
    // African American voices
    'Liam': 'african-american',
    'Brian': 'african-american-2',
    
    // Hispanic voices
    'Eric': 'hispanic',
    'Daniel': 'hispanic-2',
    
    // Asian voices
    'Will': 'asian',
    'Charlie': 'asian-2',
    
    // North American voices - One Canadian, rest American
    'Roger': 'american',
    'Chris': 'american-2',
    'Bill': 'american-3',
    'Josh': 'american-4',
    'Anthony': 'canadian',  // Just one Canadian male voice
    'Mike': 'american-midwest',
  }
};

// Human-friendly ethnicity labels for display
const ethnicityLabels: Record<string, string> = {
  'british': 'British',
  'irish': 'Irish',
  'australian': 'Australian',
  'african-american': 'African American',
  'african-american-2': 'African American',
  'hispanic': 'Hispanic',
  'hispanic-2': 'Hispanic',
  'asian': 'Asian',
  'asian-2': 'Asian',
  'american': 'American',
  'american-2': 'American',
  'american-3': 'American',
  'american-4': 'American',
  'american-midwest': 'American (Midwest)',
  'canadian': 'Canadian',
};

// Function to determine ethnicity for a voice by name
function determineEthnicity(name: string): string | undefined {
  // Since we're no longer using ethnicity labels, just return undefined
  return undefined;
}

// Function to fetch all available voices
export async function getVoices(): Promise<Voice[]> {
  try {
    const response = await axios.get(`${API_URL}/voices`, { headers });
    
    // Map API response to our Voice interface
    const voices: Voice[] = response.data.voices.map((voice: any) => {
      const gender = determineGender(voice.name, voice.labels);
      
      // Ensure we have a preview URL - if missing, provide a fallback
      let previewUrl = voice.preview_url;
      
      // If no preview URL or it's invalid, create a custom preview URL using our proxy endpoint
      if (!previewUrl || !previewUrl.startsWith('http')) {
        previewUrl = `/api/voice/preview/${voice.voice_id}`;
        log(`Creating custom preview URL for voice: ${voice.name} using our proxy endpoint`, 'voice');
      }
      
      return {
        voice_id: voice.voice_id,
        name: voice.name,
        preview_url: previewUrl,
        gender,
        accent: getLabel(voice.labels, 'accent'),
        ethnicity: undefined, // Remove all ethnicity labels
        description: voice.description,
      };
    });
    
    // Only keep Jessica and Eric as requested
    const filteredVoices = voices.filter(voice => voice.name === 'Jessica' || voice.name === 'Eric');
    
    // Log the filtered voices
    log(`Filtered voices to only Jessica and Eric: ${filteredVoices.length} voices`, 'voice');
    
    return filteredVoices;
  } catch (error: any) {
    log(`Error fetching voices: ${error.message}`, 'voice');
    throw new Error(`Failed to fetch voices: ${error.message}`);
  }
}

// Function to filter voices by gender and ensure diversity
export async function getVoicesByGender(gender: 'male' | 'female'): Promise<Voice[]> {
  try {
    const allVoices = await getVoices();
    let filteredVoices = allVoices.filter(voice => voice.gender === gender);
    
    // Limit voices to only Jessica (female) and Eric (male) as requested
    if (gender === 'female') {
      // Only return Jessica voice without Hispanic label
      filteredVoices = filteredVoices.filter(voice => voice.name === 'Jessica');
      
      // Log the number of female voices we're returning
      log(`Returning Jessica as the only female voice option`, 'voice');
      
      // Remove any ethnicity labels from all voices
      filteredVoices.forEach(voice => {
        voice.ethnicity = undefined;
      });
      
      return filteredVoices;
    }
    
    // For male voices, only return Eric
    if (gender === 'male') {
      // Only return Eric voice without Hispanic label
      filteredVoices = filteredVoices.filter(voice => voice.name === 'Eric');
      
      // Log the number of male voices we're returning
      log(`Returning Eric as the only male voice option`, 'voice');
      
      // Remove any ethnicity labels from all voices
      filteredVoices.forEach(voice => {
        voice.ethnicity = undefined;
      });
      
      return filteredVoices;
    }
    
    return filteredVoices;
  } catch (error: any) {
    log(`Error filtering voices by gender: ${error.message}`, 'voice');
    throw new Error(`Failed to filter voices by gender: ${error.message}`);
  }
}

// Function to get a specific voice by ID
export async function getVoiceById(voiceId: string): Promise<Voice | undefined> {
  try {
    const allVoices = await getVoices();
    return allVoices.find(voice => voice.voice_id === voiceId);
  } catch (error: any) {
    log(`Error getting voice by ID: ${error.message}`, 'voice');
    throw new Error(`Failed to get voice by ID: ${error.message}`);
  }
}

// Function to perform text-to-speech conversion
export async function textToSpeech(params: TTSParams): Promise<Buffer> {
  try {
    const { text, voice_id, voice_settings } = params;
    
    const requestData = {
      text,
      voice_settings: voice_settings || {
        stability: 0.5,
        similarity_boost: 0.75,
      },
      model_id: 'eleven_multilingual_v2',
    };
    
    // Make API request with responseType arraybuffer to get binary audio data
    const response = await axios.post(
      `${API_URL}/text-to-speech/${voice_id}`,
      requestData,
      {
        headers,
        responseType: 'arraybuffer',
      }
    );
    
    // Return audio as Buffer
    return Buffer.from(response.data);
  } catch (error: any) {
    log(`Error generating speech: ${error.message}`, 'voice');
    throw new Error(`Failed to generate speech: ${error.message}`);
  }
}

// Helper function to determine gender from voice name and labels
function determineGender(name: string, labels: any): 'male' | 'female' | 'other' {
  // Check if gender is explicitly in the labels
  const genderLabel = getLabel(labels, 'gender');
  if (genderLabel) {
    if (genderLabel.toLowerCase().includes('female')) return 'female';
    if (genderLabel.toLowerCase().includes('male')) return 'male';
  }
  
  // If no explicit gender label, we can try to infer from name or use common voice patterns
  // This is a simplified approach - a more robust solution would use a comprehensive database
  const femaleNames = [
    // Common female names
    'sarah', 'emma', 'grace', 'bella', 'sophia', 'rachel', 'olivia', 'emily', 
    'jessica', 'lily', 'gail', 'charlotte', 'matilda', 'alice', 'laura',
    // Additional female names to ensure we have enough female voices
    'freya', 'nicole', 'domi', 'elli', 'abigail', 'mimi', 'dorothy',
    'hannah', 'glinda', 'whitney', 'madison', 'judy', 'victoria', 'tamira',
    'avery', 'harper', 'scarlett', 'aria', 'chloe', 'zoe', 'stella', 'maya',
    'lucy', 'audrey', 'leah', 'allison', 'savannah', 'gabriella', 'anna', 'ella',
    'natalie', 'mila', 'eva', 'vivian'
  ];
  
  const maleNames = [
    'josh', 'adam', 'james', 'john', 'michael', 'david', 'robert', 'william', 
    'thomas', 'charles', 'roger', 'george', 'eric', 'brian', 'daniel', 'chris',
    'bill', 'liam', 'callum', 'will', 'charlie', 'harry', 'patrick'
  ];
  
  const lowerName = name.toLowerCase();
  
  for (const femaleName of femaleNames) {
    if (lowerName.includes(femaleName)) return 'female';
  }
  
  for (const maleName of maleNames) {
    if (lowerName.includes(maleName)) return 'male';
  }
  
  // For any voice that looks female by name pattern (ending in 'a' or 'ie' is often female)
  if (lowerName.endsWith('a') || lowerName.endsWith('ie') || lowerName.endsWith('y') || 
      lowerName.endsWith('i') || lowerName.endsWith('e')) {
    return 'female';
  }
  
  // For voices we couldn't classify based on name, let's assign more voices
  // to ensure we have gender parity
  if (['Daniel', 'Chris', 'Brian', 'George', 'Eric', 'Josh', 'Patrick'].includes(name)) return 'male';
  if (['River', 'Aria', 'Bella', 'Mia', 'Sofia', 'Nova', 'Ella', 'Ava'].includes(name)) return 'female';
  
  // For any uncategorized voices, alternate assignment to achieve balance
  // Currently we need more female voices, so default new voices to female
  return 'female';
}

// Helper function to extract label value
function getLabel(labels: any, key: string): string | undefined {
  if (!labels || !Array.isArray(labels)) return undefined;
  
  const label = labels.find((l: any) => l.name === key);
  return label ? label.value : undefined;
}

// Force clear the voice cache when server starts up and this module loads
// This function is imported from cacheService in the routes file
// But we explicitly import it here to ensure we clear cache whenever
// the ElevelLabs service is loaded or changed
import { clearVoiceCache } from './cacheService';
// Clear the cache immediately - this runs when the server starts
setTimeout(() => {
  try {
    console.log('Clearing voice cache due to filter changes');
    clearVoiceCache();
  } catch (error) {
    console.error('Error clearing voice cache:', error);
  }
}, 100);