import express from 'express';
import axios from 'axios';
import { getVoices, getVoicesByGender, getVoiceById, textToSpeech } from '../services/elevenLabsService';
import { cacheMiddleware, clearVoiceCache } from '../services/cacheService';
import { log } from '../vite';

const router = express.Router();

// Get all voices with caching
router.get('/voices', cacheMiddleware(3600), async (req, res) => {
  try {
    const voices = await getVoices();
    res.json(voices);
  } catch (error: any) {
    log(`Error fetching voices: ${error.message}`, 'voice');
    res.status(500).json({ error: error.message });
  }
});

// Get voices by gender with caching
router.get('/voices/:gender', cacheMiddleware(3600), async (req, res) => {
  try {
    const gender = req.params.gender as 'male' | 'female';
    
    if (gender !== 'male' && gender !== 'female') {
      return res.status(400).json({ error: 'Invalid gender parameter. Must be "male" or "female".' });
    }
    
    const voices = await getVoicesByGender(gender);
    res.json(voices);
  } catch (error: any) {
    log(`Error fetching voices by gender: ${error.message}`, 'voice');
    res.status(500).json({ error: error.message });
  }
});

// Get specific voice by ID with caching
router.get('/voice/:id', cacheMiddleware(3600), async (req, res) => {
  try {
    const voiceId = req.params.id;
    const voice = await getVoiceById(voiceId);
    
    if (!voice) {
      return res.status(404).json({ error: 'Voice not found' });
    }
    
    res.json(voice);
  } catch (error: any) {
    log(`Error fetching voice: ${error.message}`, 'voice');
    res.status(500).json({ error: error.message });
  }
});

// Generate speech from text
router.post('/speech', async (req, res) => {
  try {
    const { text, voice_id, voice_settings } = req.body;
    
    if (!text || !voice_id) {
      return res.status(400).json({ error: 'Text and voice_id are required' });
    }
    
    // Set content-type for audio
    res.setHeader('Content-Type', 'audio/mpeg');
    
    // Generate audio
    const audioBuffer = await textToSpeech({
      text,
      voice_id,
      voice_settings
    });
    
    // Send audio as response
    res.send(audioBuffer);
  } catch (error: any) {
    log(`Error generating speech: ${error.message}`, 'voice');
    res.status(500).json({ error: error.message });
  }
});

// Clear voice cache route - for development and testing
router.post('/clear-cache', async (req, res) => {
  try {
    const invalidatedCount = clearVoiceCache();
    res.json({ 
      success: true, 
      message: `Cleared ${invalidatedCount} cached voice entries` 
    });
  } catch (error: any) {
    log(`Error clearing voice cache: ${error.message}`, 'voice');
    res.status(500).json({ error: error.message });
  }
});

// Get audio preview for a voice - needed for when ElevenLabs API doesn't provide proper preview URLs
router.get('/preview/:id', cacheMiddleware(86400), async (req, res) => {
  try {
    const voiceId = req.params.id;
    const API_URL = 'https://api.elevenlabs.io/v1';
    
    // Set CORS headers to allow all origins for audio
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Range');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Length, Accept-Ranges, Content-Range');
    
    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(200).end();
      return;
    }
    
    const headers = {
      'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
      'Accept': 'audio/mpeg',
    };
    
    log(`Fetching audio preview for voice ID: ${voiceId}`, 'voice');
    
    // Choose a short, friendly sample text
    const sampleText = "Hello, I'm your career guide. I'm here to help you find your path.";
    
    log(`Generating TTS preview for voice: ${voiceId}`, 'voice');
    
    // API request to generate speech
    log(`Sending TTS request to ElevenLabs API for voice ${voiceId}`, 'voice');
    
    const response = await axios.post(
      `${API_URL}/text-to-speech/${voiceId}`,
      {
        text: sampleText,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
        model_id: 'eleven_multilingual_v2',
      },
      {
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY || '',
          'Content-Type': 'application/json',
        },
        responseType: 'arraybuffer',
      }
    );
    
    const audioData = Buffer.from(response.data);
    
    log(`Successfully generated TTS preview for voice ${voiceId}, size: ${audioData.length} bytes`, 'voice');
    
    // Set proper audio headers
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioData.length);
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for a day
    
    // Send audio data
    res.status(200).send(audioData);
    
  } catch (error: any) {
    log(`Error processing voice preview: ${error.message}`, 'voice');
    
    // Check if API connection failed
    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return res.status(503).json({ 
        error: 'Service Unavailable',
        details: 'Could not connect to ElevenLabs API. Please try again later.'
      });
    }
    
    // Check if it's an API error with a response
    if (error.response) {
      const status = error.response.status;
      let message = 'Unknown API error';
      
      // Provide helpful messages for common error codes
      if (status === 401) {
        message = 'Invalid or missing API key. Please update your ElevenLabs API key.';
      } else if (status === 404) {
        message = `Voice ID ${req.params.id} not found. Please select a different voice.`;
      } else if (status === 429) {
        message = 'ElevenLabs API rate limit exceeded. Please try again later.';
      } else if (status >= 500) {
        message = 'ElevenLabs service is currently experiencing issues. Please try again later.';
      }
      
      return res.status(status).json({
        error: `ElevenLabs API Error (${status})`,
        details: message
      });
    }
    
    // Handle any other errors
    res.status(500).json({ 
      error: 'Internal Server Error',
      details: 'There was an issue generating the voice preview. Please try again later.'
    });
  }
});

// Clear voice cache immediately when the server starts
clearVoiceCache();

export default router;