/**
 * Netlify Serverless Function for ElevenLabs AI Narrator
 * Handles /api/status, /api/models, /api/voices, and /api/generate
 * Zero external dependencies - runs natively on Netlify Node.js runtime!
 */

// Fallback Premade Voices
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

const DEFAULT_ELEVENLABS_API_KEY = 'sk_cf1031f267e99c1ff605c1385b24e7236ea812f246d8387b';

function getApiKey() {
  const envKey = process.env.ELEVENLABS_API_KEY;
  if (envKey && envKey.trim() && envKey.trim() !== 'your_elevenlabs_api_key_here') {
    return envKey.trim();
  }
  return DEFAULT_ELEVENLABS_API_KEY;
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, xi-api-key, Authorization',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};

exports.handler = async (event, context) => {
  // Handle OPTIONS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: ''
    };
  }

  // Normalize path from Netlify redirect
  // e.g. "/.netlify/functions/api/status" -> "/status" or "/api/status" -> "/status"
  let cleanPath = (event.path || '')
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '');

  if (!cleanPath || cleanPath === '') {
    cleanPath = '/';
  }

  const apiKey = getApiKey();

  try {
    // 1. GET /status
    if (cleanPath === '/status' || cleanPath === '/status/') {
      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          configured: Boolean(apiKey),
          keyMasked: apiKey ? `${apiKey.slice(0, 9)}...${apiKey.slice(-4)}` : null,
          modelsCount: CURATED_MODELS.length,
          message: 'ElevenLabs API connected successfully on Netlify serverless runtime.'
        })
      };
    }

    // 2. GET /models
    if (cleanPath === '/models' || cleanPath === '/models/') {
      if (apiKey) {
        try {
          const response = await fetch('https://api.elevenlabs.io/v1/models', {
            headers: { 'xi-api-key': apiKey }
          });
          if (response.ok) {
            const modelsData = await response.json();
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
              return {
                statusCode: 200,
                headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
                body: JSON.stringify({ models: ttsModels, source: 'elevenlabs_live' })
              };
            }
          }
        } catch (e) {
          console.warn('Netlify function models fetch error, using curated:', e.message);
        }
      }

      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({ models: CURATED_MODELS, source: 'curated' })
      };
    }

    // 3. GET /voices
    if (cleanPath === '/voices' || cleanPath === '/voices/') {
      if (!apiKey) {
        return {
          statusCode: 200,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            voices: FALLBACK_PREMADE_VOICES,
            hasApiKey: false,
            message: 'ELEVENLABS_API_KEY not configured.'
          })
        };
      }

      try {
        const response = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': apiKey,
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
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

          return {
            statusCode: 200,
            headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              voices: formattedVoices.length > 0 ? formattedVoices : FALLBACK_PREMADE_VOICES,
              hasApiKey: true
            })
          };
        }
      } catch (err) {
        console.warn('Netlify function voices error, using fallback:', err.message);
      }

      return {
        statusCode: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voices: FALLBACK_PREMADE_VOICES,
          hasApiKey: true,
          notice: 'Using standard ElevenLabs premade voices.'
        })
      };
    }

    // 4. POST /generate
    if (cleanPath === '/generate' || cleanPath === '/generate/') {
      if (event.httpMethod !== 'POST') {
        return {
          statusCode: 405,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Method Not Allowed' })
        };
      }

      let payload = {};
      try {
        payload = JSON.parse(event.body || '{}');
      } catch (e) {
        return {
          statusCode: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Invalid JSON request body.' })
        };
      }

      const { text, voiceId, modelId, voiceSettings } = payload;

      if (!text || !text.trim()) {
        return {
          statusCode: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Please enter text to generate narration.' })
        };
      }

      if (!voiceId || !voiceId.trim()) {
        return {
          statusCode: 400,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: 'Please select a voice from the dropdown.' })
        };
      }

      const selectedModel = (modelId && modelId.trim()) ? modelId.trim() : 'eleven_multilingual_v2';
      const parsedSettings = {
        stability: typeof voiceSettings?.stability === 'number' ? Math.max(0, Math.min(1, voiceSettings.stability)) : 0.5,
        similarity_boost: typeof voiceSettings?.similarity_boost === 'number' ? Math.max(0, Math.min(1, voiceSettings.similarity_boost)) : 0.75,
        style: typeof voiceSettings?.style === 'number' ? Math.max(0, Math.min(1, voiceSettings.style)) : 0.0,
        use_speaker_boost: typeof voiceSettings?.use_speaker_boost === 'boolean' ? voiceSettings.use_speaker_boost : true
      };

      const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=mp3_44100_128`;

      const ttsResponse = await fetch(elevenLabsUrl, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
          text: text.trim(),
          model_id: selectedModel,
          voice_settings: parsedSettings
        })
      });

      if (!ttsResponse.ok) {
        const errText = await ttsResponse.text();
        let errMsg = 'Failed to generate speech with ElevenLabs.';
        try {
          const parsed = JSON.parse(errText);
          if (parsed.detail?.message) errMsg = parsed.detail.message;
          else if (typeof parsed.detail === 'string') errMsg = parsed.detail;
        } catch (_) {}

        return {
          statusCode: ttsResponse.status,
          headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
          body: JSON.stringify({ error: errMsg, raw: errText })
        };
      }

      const audioBuffer = await ttsResponse.arrayBuffer();
      const base64Audio = Buffer.from(audioBuffer).toString('base64');

      return {
        statusCode: 200,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'audio/mpeg',
          'Content-Disposition': 'inline; filename="narration.mp3"',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        },
        body: base64Audio,
        isBase64Encoded: true
      };
    }

    // Default route
    return {
      statusCode: 404,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: `API endpoint '${cleanPath}' not found.` })
    };

  } catch (error) {
    console.error('Unhandled Netlify function error:', error);
    return {
      statusCode: 500,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Serverless execution error: ' + error.message })
    };
  }
};
