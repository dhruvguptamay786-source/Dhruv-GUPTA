const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Official Fallback Premade Voices (universally supported across free & paid tiers)
const FALLBACK_PREMADE_VOICES = [
  {
    voice_id: 'JBFqnCBsd6RMkjVDRZzb',
    name: 'George',
    category: 'premade',
    labels: { accent: 'british', description: 'warm & resonant', gender: 'male', 'use case': 'audiobook & narration' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0786-440f-a45d-1176979e4f3f.mp3'
  },
  {
    voice_id: 'nPczCjzI2devNBz1zQrb',
    name: 'Brian',
    category: 'premade',
    labels: { accent: 'american', description: 'deep & authoritative', gender: 'male', 'use case': 'documentary & narration' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd34734-40bf-4a9f-93d9-9528647895e6.mp3'
  },
  {
    voice_id: 'ErXwobaYiN019PkySvjV',
    name: 'Antoni',
    category: 'premade',
    labels: { accent: 'american', description: 'well-rounded & expressive', gender: 'male', 'use case': 'narration' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/38d8f8f0-0412-4d2a-b605-e7b51b3a164c.mp3'
  },
  {
    voice_id: 'onwK4e9ZLuTAKqWW03F9',
    name: 'Daniel',
    category: 'premade',
    labels: { accent: 'british', description: 'authoritative presenter', gender: 'male', 'use case': 'news & storytelling' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/79ced863-718e-4a6c-9418-ee5cf327e57c.mp3'
  },
  {
    voice_id: 'pNInz6obpgDQGcFmaJgB',
    name: 'Adam',
    category: 'premade',
    labels: { accent: 'american', description: 'deep & smooth', gender: 'male', 'use case': 'narration' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/b953d5a4-05a9-467f-94ad-7bc479a9572b.mp3'
  },
  {
    voice_id: 'VR6AewLTigWG4xSOukaG',
    name: 'Arnold',
    category: 'premade',
    labels: { accent: 'american', description: 'crisp & narrative', gender: 'male', 'use case': 'video & games' },
    preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/056976ca-1216-43b6-9ae8-5c4a1789c629.mp3'
  }
];

// Curated active ElevenLabs models
const CURATED_MODELS = [
  {
    model_id: 'eleven_multilingual_v2',
    name: 'Eleven Multilingual v2',
    description: 'Most lifelike and emotionally rich narration across 29+ languages. Ideal for audiobooks, stories, and long-form content.',
    badge: 'Best Quality',
    recommended: true
  },
  {
    model_id: 'eleven_flash_v2_5',
    name: 'Eleven Flash v2.5',
    description: 'Ultra-low latency (~75ms) synthesis across 32 languages. Recommended by ElevenLabs for optimal speed and efficiency.',
    badge: 'Ultra Fast (~75ms)',
    recommended: false
  },
  {
    model_id: 'eleven_turbo_v2_5',
    name: 'Eleven Turbo v2.5',
    description: 'High-quality, low-latency (~250ms) speech generation supporting 32 languages. Great balance of speed and expressiveness.',
    badge: 'Balanced Speed',
    recommended: false
  },
  {
    model_id: 'eleven_turbo_v2',
    name: 'Eleven Turbo v2',
    description: 'Fast, English-optimized model designed for high-throughput and quick turnaround.',
    badge: 'English Fast',
    recommended: false
  },
  {
    model_id: 'eleven_monolingual_v1',
    name: 'Eleven Monolingual v1',
    description: 'Classic ElevenLabs standard English voice synthesis model.',
    badge: 'Legacy English',
    recommended: false
  }
];

/**
 * Helper to check if an API key is present and configured
 */
function hasValidApiKey() {
  const key = process.env.ELEVENLABS_API_KEY;
  return Boolean(key && key.trim() && key !== 'your_elevenlabs_api_key_here');
}

/**
 * GET /api/status
 * Returns API configuration status without leaking the secret key
 */
app.get('/api/status', (req, res) => {
  const configured = hasValidApiKey();
  res.json({
    configured,
    modelsCount: CURATED_MODELS.length,
    message: configured
      ? 'ElevenLabs API key is configured.'
      : 'ElevenLabs API key is missing. Please add ELEVENLABS_API_KEY in .env.'
  });
});

/**
 * GET /api/models
 * Returns available ElevenLabs TTS models
 */
app.get('/api/models', async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (hasValidApiKey()) {
    try {
      const response = await fetch('https://api.elevenlabs.io/v1/models', {
        headers: {
          'xi-api-key': apiKey.trim()
        }
      });

      if (response.ok) {
        const modelsData = await response.json();
        // Filter models that support text-to-speech
        const ttsModels = modelsData
          .filter(m => m.can_do_text_to_speech)
          .map(m => {
            const matched = CURATED_MODELS.find(c => c.model_id === m.model_id);
            return {
              model_id: m.model_id,
              name: m.name,
              description: m.description || matched?.description || '',
              badge: matched?.badge || (m.model_id.includes('flash') ? 'Ultra Fast' : 'Standard'),
              recommended: matched?.recommended || false
            };
          });

        if (ttsModels.length > 0) {
          return res.json({ models: ttsModels, source: 'elevenlabs_live' });
        }
      }
    } catch (err) {
      console.warn('Could not fetch live models from ElevenLabs API, using curated models:', err.message);
    }
  }

  // Fallback to curated list
  res.json({ models: CURATED_MODELS, source: 'curated' });
});

/**
 * GET /api/voices
 * Return available voices from ElevenLabs or fallbacks with clear status
 */
app.get('/api/voices', async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!hasValidApiKey()) {
    return res.json({
      voices: FALLBACK_PREMADE_VOICES,
      hasApiKey: false,
      message: 'ELEVENLABS_API_KEY is not configured. Displaying default premade voices for preview.'
    });
  }

  try {
    const response = await fetch('https://api.elevenlabs.io/v1/voices', {
      method: 'GET',
      headers: {
        'xi-api-key': apiKey.trim(),
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errText = await response.text();
      let errJson = {};
      try { errJson = JSON.parse(errText); } catch (_) {}

      console.warn(`ElevenLabs Voices Notice [${response.status}]:`, errText);

      // If the API key is valid but lacks 'voices_read' permission, or free tier restricted
      if (errJson.detail?.status === 'missing_permissions' || errJson.detail?.code === 'missing_permissions') {
        return res.json({
          voices: FALLBACK_PREMADE_VOICES,
          hasApiKey: true,
          notice: 'API key active (using standard verified voices).'
        });
      }

      if (response.status === 401 && errJson.detail?.status === 'invalid_api_key') {
        return res.status(401).json({
          error: 'Invalid ElevenLabs API key. Please check your ELEVENLABS_API_KEY in the .env file.',
          code: 'UNAUTHORIZED',
          fallbackVoices: FALLBACK_PREMADE_VOICES
        });
      }

      // Return fallback voices with hasApiKey: true so generation works
      return res.json({
        voices: FALLBACK_PREMADE_VOICES,
        hasApiKey: true,
        notice: 'Using standard ElevenLabs premade voices.'
      });
    }

    const data = await response.json();
    const formattedVoices = (data.voices || []).map(v => ({
      voice_id: v.voice_id,
      name: v.name,
      category: v.category || 'premade',
      labels: v.labels || {},
      preview_url: v.preview_url || null,
      description: [
        v.labels?.accent,
        v.labels?.gender,
        v.labels?.['use case'] || v.labels?.description
      ].filter(Boolean).join(' • ')
    }));

    res.json({
      voices: formattedVoices.length > 0 ? formattedVoices : FALLBACK_PREMADE_VOICES,
      hasApiKey: true
    });
  } catch (err) {
    console.error('Error contacting ElevenLabs for voices:', err);
    res.status(500).json({
      error: 'Network connection error while contacting ElevenLabs API.',
      code: 'NETWORK_ERROR',
      fallbackVoices: FALLBACK_PREMADE_VOICES
    });
  }
});

/**
 * POST /api/generate
 * Generates speech audio using ElevenLabs Text-to-Speech API
 */
app.post('/api/generate', async (req, res) => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  // 1. Check API Key configuration
  if (!hasValidApiKey()) {
    return res.status(400).json({
      error: 'ElevenLabs API key is not configured. Please add your key to the .env file (ELEVENLABS_API_KEY=your_key) and restart the server.',
      code: 'MISSING_API_KEY'
    });
  }

  // 2. Validate request body
  const { text, voiceId, modelId, voiceSettings } = req.body;

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({
      error: 'Please enter text to generate narration.',
      code: 'EMPTY_TEXT'
    });
  }

  const trimmedText = text.trim();

  // Character limit sanity check (e.g. 10,000 characters per single request)
  if (trimmedText.length > 10000) {
    return res.status(400).json({
      error: 'Text exceeds maximum limit of 10,000 characters per request.',
      code: 'TEXT_TOO_LONG'
    });
  }

  if (!voiceId || typeof voiceId !== 'string' || !voiceId.trim()) {
    return res.status(400).json({
      error: 'Please select a voice from the dropdown.',
      code: 'MISSING_VOICE'
    });
  }

  const selectedModel = (modelId && typeof modelId === 'string' && modelId.trim())
    ? modelId.trim()
    : 'eleven_multilingual_v2';

  // 3. Format voice settings
  const parsedSettings = {
    stability: typeof voiceSettings?.stability === 'number'
      ? Math.max(0, Math.min(1, voiceSettings.stability))
      : 0.5,
    similarity_boost: typeof voiceSettings?.similarity_boost === 'number'
      ? Math.max(0, Math.min(1, voiceSettings.similarity_boost))
      : 0.75,
    style: typeof voiceSettings?.style === 'number'
      ? Math.max(0, Math.min(1, voiceSettings.style))
      : 0.0,
    use_speaker_boost: typeof voiceSettings?.use_speaker_boost === 'boolean'
      ? voiceSettings.use_speaker_boost
      : true
  };

  try {
    // 4. Call ElevenLabs Text-to-Speech API
    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;

    const response = await fetch(elevenLabsUrl, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey.trim(),
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        text: trimmedText,
        model_id: selectedModel,
        voice_settings: parsedSettings
      })
    });

    // 5. Handle error responses from ElevenLabs
    if (!response.ok) {
      const errText = await response.text();
      let errJson = {};
      try {
        errJson = JSON.parse(errText);
      } catch (_) {}

      console.error(`ElevenLabs TTS Error [Status ${response.status}]:`, errText);

      let clientMessage = 'Unable to generate narration. Please check your API configuration.';

      if (response.status === 401) {
        clientMessage = 'Invalid ElevenLabs API key. Please check your ELEVENLABS_API_KEY in the .env file.';
      } else if (response.status === 429) {
        clientMessage = 'ElevenLabs quota or rate limit exceeded. Please check your account credits at elevenlabs.io.';
      } else if (response.status === 404) {
        clientMessage = 'The selected voice or model was not found in ElevenLabs.';
      } else if (errJson.detail) {
        if (typeof errJson.detail === 'string') {
          clientMessage = errJson.detail;
        } else if (errJson.detail.message) {
          clientMessage = errJson.detail.message;
        }
      }

      return res.status(response.status).json({
        error: clientMessage,
        code: `ELEVENLABS_${response.status}`
      });
    }

    // 6. Audio generation succeeded! Return audio buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Content-Disposition', 'inline; filename="narration.mp3"');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    return res.end(buffer);
  } catch (err) {
    console.error('TTS Generation Server Exception:', err);
    return res.status(500).json({
      error: 'Internal server error while connecting to ElevenLabs. Please try again.',
      code: 'SERVER_EXCEPTION'
    });
  }
});

// Serve frontend for all standard routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`===============================================`);
  console.log(`🎙 ElevenLabs AI Narrator server running!`);
  console.log(`🌐 Local URL: http://localhost:${PORT}`);
  console.log(`🔑 ElevenLabs API Key configured: ${hasValidApiKey() ? 'YES (Ready)' : 'NO (Add to .env)'}`);
  console.log(`===============================================`);
});
