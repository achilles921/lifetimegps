import fetch from 'node-fetch';

interface TextToSpeechOptions {
  text: string;
  voiceId: string;
  modelId?: string;
  optimizeStreamingLatency?: number;
  voiceSettings?: {
    stability?: number;
    similarity_boost?: number;
    style?: number;
    use_speaker_boost?: boolean;
  };
}

export class ElevenLabsService {
  private apiKey: string;
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('ElevenLabs API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Converts text to speech using ElevenLabs API
   */
  async textToSpeech({
    text,
    voiceId,
    modelId = 'eleven_multilingual_v2',
    optimizeStreamingLatency = 0,
    voiceSettings = {}
  }: TextToSpeechOptions): Promise<Buffer> {
    try {
      const url = `${this.baseUrl}/text-to-speech/${voiceId}`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': this.apiKey
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          optimize_streaming_latency: optimizeStreamingLatency,
          voice_settings: {
            stability: voiceSettings.stability ?? 0.5,
            similarity_boost: voiceSettings.similarity_boost ?? 0.75,
            style: voiceSettings.style ?? 0,
            use_speaker_boost: voiceSettings.use_speaker_boost ?? true
          }
        })
      });

      if (!response.ok) {
        let errorMessage: string;
        try {
          const errorData = await response.json();
          errorMessage = errorData.detail || `Error: ${response.status} ${response.statusText}`;
        } catch (e) {
          errorMessage = `Error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      const audioBuffer = await response.buffer();
      return audioBuffer;
    } catch (error) {
      console.error('ElevenLabs API error:', error);
      throw error;
    }
  }

  /**
   * Gets available voices from ElevenLabs API
   */
  async getVoices() {
    try {
      const response = await fetch(`${this.baseUrl}/voices`, {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get voices: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.voices;
    } catch (error) {
      console.error('Error fetching voices:', error);
      throw error;
    }
  }

  /**
   * Gets voice details by ID
   */
  async getVoice(voiceId: string) {
    try {
      const response = await fetch(`${this.baseUrl}/voices/${voiceId}`, {
        headers: {
          'Accept': 'application/json',
          'xi-api-key': this.apiKey
        }
      });

      if (!response.ok) {
        throw new Error(`Failed to get voice details: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Error fetching voice ${voiceId}:`, error);
      throw error;
    }
  }
}

// Create and export service instance
let elevenLabsService: ElevenLabsService | null = null;

export function getElevenLabsService(): ElevenLabsService {
  if (!elevenLabsService) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
      throw new Error('ELEVENLABS_API_KEY environment variable is not set');
    }
    elevenLabsService = new ElevenLabsService(apiKey);
  }
  return elevenLabsService;
}