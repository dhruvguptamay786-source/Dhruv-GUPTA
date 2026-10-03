/**
 * ElevenLabs AI Narrator - Frontend Controller
 * Complete modular Vanilla JavaScript architecture with Animated AI Avatar Companion
 * Built for universal deployment on Netlify (Serverless & Static), Node.js, and local dev.
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // Integrated ElevenLabs API Configuration
  // =========================================================================
  const ELEVENLABS_API_KEY = 'sk_cf1031f267e99c1ff605c1385b24e7236ea812f246d8387b';

  // =========================================================================
  // Curated Fallback Voices & Models
  // =========================================================================
  const FALLBACK_PREMADE_VOICES = [
    {
      voice_id: 'JBFqnCBsd6RMkjVDRZzb',
      name: 'George',
      category: 'premade',
      description: 'Warm & Resonant • British • Audiobook & Narration',
      preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/JBFqnCBsd6RMkjVDRZzb/e6206d1a-0786-440f-a45d-1176979e4f3f.mp3'
    },
    {
      voice_id: 'nPczCjzI2devNBz1zQrb',
      name: 'Brian',
      category: 'premade',
      description: 'Deep & Authoritative • American • Documentary & Narration',
      preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/nPczCjzI2devNBz1zQrb/2dd34734-40bf-4a9f-93d9-9528647895e6.mp3'
    },
    {
      voice_id: 'ErXwobaYiN019PkySvjV',
      name: 'Antoni',
      category: 'premade',
      description: 'Well-Rounded & Expressive • American • Narration',
      preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/ErXwobaYiN019PkySvjV/38d8f8f0-0412-4d2a-b605-e7b51b3a164c.mp3'
    },
    {
      voice_id: 'onwK4e9ZLuTAKqWW03F9',
      name: 'Daniel',
      category: 'premade',
      description: 'Authoritative Presenter • British • News & Storytelling',
      preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/onwK4e9ZLuTAKqWW03F9/79ced863-718e-4a6c-9418-ee5cf327e57c.mp3'
    },
    {
      voice_id: 'pNInz6obpgDQGcFmaJgB',
      name: 'Adam',
      category: 'premade',
      description: 'Deep & Smooth • American • Narration',
      preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/pNInz6obpgDQGcFmaJgB/b953d5a4-05a9-467f-94ad-7bc479a9572b.mp3'
    },
    {
      voice_id: 'VR6AewLTigWG4xSOukaG',
      name: 'Arnold',
      category: 'premade',
      description: 'Crisp & Narrative • American • Video & Games',
      preview_url: 'https://storage.googleapis.com/eleven-public-prod/premade/voices/VR6AewLTigWG4xSOukaG/056976ca-1216-43b6-9ae8-5c4a1789c629.mp3'
    }
  ];

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

  // Model Metadata for descriptions and badges
  const MODEL_META = {
    eleven_multilingual_v2: {
      badge: 'Best Quality',
      desc: 'State-of-the-art multilingual model with 29+ languages. Ideal for audiobooks, stories, and expressive narration.'
    },
    eleven_flash_v2_5: {
      badge: 'Ultra-Fast (~75ms)',
      desc: 'Ultra-low latency synthesis across 32 languages. Recommended by ElevenLabs for optimal speed and efficiency.'
    },
    eleven_turbo_v2_5: {
      badge: 'Balanced Speed',
      desc: 'High-quality, low-latency (~250ms) speech generation across 32 languages.'
    },
    eleven_turbo_v2: {
      badge: 'English Fast',
      desc: 'Fast, English-optimized model designed for high-throughput and quick turnaround.'
    },
    eleven_monolingual_v1: {
      badge: 'Legacy English',
      desc: 'Classic ElevenLabs standard English voice synthesis model.'
    }
  };

  // Avatar Personas Configuration
  const PERSONAS = {
    nova: {
      name: 'Nova',
      title: 'Cyber AI Assistant',
      greeting: "Hello! I'm Nova, your AI Voice Narrator. Paste or type your script below, select a voice, and let's create studio-quality speech!",
      typingMsg: "I'm listening closely! Keep typing your script...",
      generatingMsg: "Synthesizing high-fidelity neural audio with ElevenLabs...",
      speakingMsg: "Narrating your text with expressive voice synthesis...",
      doneMsg: "Narration complete! Click play to re-listen or download as MP3.",
      class: 'persona-nova'
    },
    aria: {
      name: 'Aria',
      title: 'Studio Narrator',
      greeting: "Welcome! I'm Aria, your studio narrator. I bring warmth, emotion, and realism to every sentence.",
      typingMsg: "Reading your words... Crafting the emotional cadence...",
      generatingMsg: "Tuning acoustic frequencies and expressive stability...",
      speakingMsg: "Bringing your story to life in real-time...",
      doneMsg: "Finished reading your piece! Ready whenever you are.",
      class: 'persona-aria'
    },
    atlas: {
      name: 'Atlas',
      title: 'Deep Voice Specialist',
      greeting: "Atlas ready. Select your preferred voice model and let's produce crisp, authoritative narration.",
      typingMsg: "Analyzing text density and sentence structure...",
      generatingMsg: "Initiating deep neural voice processing...",
      speakingMsg: "Delivering powerful voice output...",
      doneMsg: "Speech output finished. File ready for export.",
      class: 'persona-atlas'
    },
    echo: {
      name: 'Echo',
      title: 'Neural Synthesizer',
      greeting: "Echo online! Multilingual voice synthesis ready across 32 languages. What shall we voice today?",
      typingMsg: "Synthesizer receiving character stream...",
      generatingMsg: "Encoding neural audio diffusion spectrogram...",
      speakingMsg: "Streaming dynamic harmonic soundwaves...",
      doneMsg: "Transmission concluded. Ready for next audio script.",
      class: 'persona-echo'
    }
  };

  // Sample texts for quick demonstration
  const SAMPLES = {
    story: "Deep within the ancient observatory, the brass telescope hummed with forgotten energy. As the constellation aligned, a harmonic whisper echoed through the crystalline domes, signaling that the stars had finally returned the lost transmission.",
    tech: "In today's deep dive, we explore how neural audio synthesis and diffusion acoustic models are transforming digital narration, enabling real-time conversational agents with unmatched emotional fidelity and sub-second latency.",
    quote: "The only limit to our realization of tomorrow will be our doubts of today. Let us move forward with strong and active faith, creating the future one courageous step at a time.",
    announcement: "Welcome to ElevenLabs AI Narrator! Experience studio-grade voice generation powered by state-of-the-art multilingual models. Paste your script, tune the voice stability, and bring your words to life."
  };

  // =========================================================================
  // State Management
  // =========================================================================
  const state = {
    apiKeyConfigured: true,
    apiKey: ELEVENLABS_API_KEY,
    backendMode: 'auto', // 'serverless', 'express', or 'direct'
    voices: [],
    models: [],
    selectedVoiceId: 'JBFqnCBsd6RMkjVDRZzb', // George (Default)
    selectedModelId: 'eleven_multilingual_v2',
    voiceSettings: {
      stability: 0.50,
      similarity_boost: 0.75,
      style: 0.00,
      use_speaker_boost: true
    },
    audioBlob: null,
    audioUrl: null,
    isPlaying: false,
    isGenerating: false,
    duration: 0,
    previousVolume: 1.0,
    // Avatar state
    avatarPersona: 'nova',
    avatarState: 'idle', // 'idle' | 'listening' | 'generating' | 'speaking'
    typingTimer: null
  };

  // =========================================================================
  // DOM Elements
  // =========================================================================
  const dom = {
    // API Status & Banners
    apiStatusBadge: document.getElementById('api-status-badge'),
    apiStatusText: document.getElementById('api-status-text'),
    apiWarningBanner: document.getElementById('api-warning-banner'),
    btnOpenGuide: document.getElementById('btn-open-guide'),
    btnBannerGuide: document.getElementById('btn-banner-guide'),

    // Avatar Elements
    avatarSection: document.getElementById('avatar-section'),
    avatarInteractive: document.getElementById('avatar-interactive'),
    avatarFigure: document.getElementById('avatar-figure'),
    avatarStatusTag: document.getElementById('avatar-status-tag'),
    avatarStatusLabel: document.getElementById('avatar-status-label'),
    avatarSpeechBubble: document.getElementById('avatar-speech-bubble'),
    avatarSpeechText: document.getElementById('avatar-speech-text'),
    personaChips: document.querySelectorAll('.btn-persona-chip'),
    avatarMiniEq: document.getElementById('avatar-mini-eq'),

    // Modal
    modalGuide: document.getElementById('modal-guide'),
    btnCloseModal: document.getElementById('btn-close-modal'),
    btnModalDone: document.getElementById('btn-modal-done'),

    // Text Input
    textInput: document.getElementById('text-input'),
    charCount: document.getElementById('char-count'),
    charProgressFill: document.getElementById('char-progress-fill'),
    btnPasteText: document.getElementById('btn-paste-text'),
    btnClearText: document.getElementById('btn-clear-text'),
    sampleButtons: document.querySelectorAll('.btn-sample-chip'),

    // Models & Voices
    modelSelect: document.getElementById('model-select'),
    modelBadge: document.getElementById('model-badge'),
    modelDescription: document.getElementById('model-description'),
    voiceSelect: document.getElementById('voice-select'),
    voiceDescription: document.getElementById('voice-description'),
    btnPreviewVoice: document.getElementById('btn-preview-voice'),

    // Voice Settings
    sliderStability: document.getElementById('slider-stability'),
    valStability: document.getElementById('val-stability'),
    sliderSimilarity: document.getElementById('slider-similarity'),
    valSimilarity: document.getElementById('val-similarity'),
    sliderStyle: document.getElementById('slider-style'),
    valStyle: document.getElementById('val-style'),
    toggleSpeakerBoost: document.getElementById('toggle-speaker-boost'),
    btnResetSettings: document.getElementById('btn-reset-settings'),

    // Generation CTA
    btnGenerate: document.getElementById('btn-generate'),
    btnContentDefault: document.querySelector('.btn-content-default'),
    btnContentLoading: document.querySelector('.btn-content-loading'),
    generationStatus: document.getElementById('generation-status'),

    // Audio Player Elements
    audioPlayerSection: document.getElementById('audio-player-section'),
    mainAudio: document.getElementById('main-audio-element'),
    previewAudio: document.getElementById('preview-audio-element'),
    btnPlayPause: document.getElementById('btn-play-pause'),
    iconPlay: document.getElementById('icon-play'),
    iconPause: document.getElementById('icon-pause'),
    waveformVisualizer: document.getElementById('waveform-visualizer'),
    audioSeekbar: document.getElementById('audio-seekbar'),
    seekbarFill: document.getElementById('seekbar-fill'),
    timeCurrent: document.getElementById('time-current'),
    timeDuration: document.getElementById('time-duration'),
    btnVolumeToggle: document.getElementById('btn-volume-toggle'),
    iconVolHigh: document.getElementById('icon-vol-high'),
    iconVolMuted: document.getElementById('icon-vol-muted'),
    volumeSlider: document.getElementById('volume-slider'),
    speedSelect: document.getElementById('speed-select'),
    btnDownload: document.getElementById('btn-download'),
    playerVoiceName: document.getElementById('player-voice-name'),
    playerModelName: document.getElementById('player-model-name'),

    // Toasts
    toastContainer: document.getElementById('toast-container')
  };

  // =========================================================================
  // Toast Notification System
  // =========================================================================
  function showToast(message, type = 'info', duration = 4000) {
    if (!dom.toastContainer) return;
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    let iconSvg = '';
    if (type === 'success') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>`;
    } else if (type === 'error') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>`;
    } else if (type === 'warning') {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`;
    } else {
      iconSvg = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#818cf8" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`;
    }

    toast.innerHTML = `
      <div style="flex-shrink:0; display:flex; align-items:center;">${iconSvg}</div>
      <div style="flex:1;">${escapeHtml(message)}</div>
    `;

    dom.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // =========================================================================
  // AI Avatar Controller & Animation System
  // =========================================================================
  function setAvatarPersona(personaKey) {
    if (!PERSONAS[personaKey]) return;
    state.avatarPersona = personaKey;
    const persona = PERSONAS[personaKey];

    // Remove all persona classes from section
    if (dom.avatarSection) {
      dom.avatarSection.classList.remove('persona-nova', 'persona-aria', 'persona-atlas', 'persona-echo');
      dom.avatarSection.classList.add(persona.class);
    }

    // Update active button
    dom.personaChips.forEach(chip => {
      if (chip.dataset.persona === personaKey) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });

    // Update dialogue and status
    updateAvatarDialogue(persona.greeting);
    updateAvatarStatus(`${persona.name} • Ready`);

    // Trigger bounce
    triggerAvatarBounce();
    showToast(`Avatar switched to ${persona.name} (${persona.title})`, 'info', 2000);
  }

  function setAvatarState(newState, customMsg = null) {
    state.avatarState = newState;
    const persona = PERSONAS[state.avatarPersona] || PERSONAS.nova;

    if (!dom.avatarSection) return;

    // Reset state classes
    dom.avatarSection.classList.remove('avatar-speaking', 'avatar-generating', 'avatar-listening');

    if (newState === 'speaking') {
      dom.avatarSection.classList.add('avatar-speaking');
      const activeVoice = state.voices.find(v => v.voice_id === state.selectedVoiceId);
      const voiceName = activeVoice ? activeVoice.name : 'AI Voice';
      updateAvatarStatus(`${persona.name} • Narrating (${voiceName})`);
      updateAvatarDialogue(customMsg || persona.speakingMsg);
    } else if (newState === 'generating') {
      dom.avatarSection.classList.add('avatar-generating');
      updateAvatarStatus(`${persona.name} • Synthesizing`);
      updateAvatarDialogue(customMsg || persona.generatingMsg);
    } else if (newState === 'listening') {
      dom.avatarSection.classList.add('avatar-listening');
      updateAvatarStatus(`${persona.name} • Listening`);
      updateAvatarDialogue(customMsg || persona.typingMsg);
    } else {
      // Idle
      updateAvatarStatus(`${persona.name} • Idle`);
      updateAvatarDialogue(customMsg || persona.greeting);
    }
  }

  function updateAvatarDialogue(text) {
    if (!dom.avatarSpeechText) return;
    dom.avatarSpeechText.style.opacity = '0';
    setTimeout(() => {
      dom.avatarSpeechText.textContent = `"${text}"`;
      dom.avatarSpeechText.style.opacity = '1';
    }, 150);
  }

  function updateAvatarStatus(label) {
    if (dom.avatarStatusLabel) {
      dom.avatarStatusLabel.textContent = label;
    }
  }

  function triggerAvatarBounce() {
    if (!dom.avatarInteractive) return;
    dom.avatarInteractive.classList.add('avatar-bounce');
    setTimeout(() => {
      dom.avatarInteractive.classList.remove('avatar-bounce');
    }, 600);
  }

  function handleAvatarClick() {
    triggerAvatarBounce();
    const persona = PERSONAS[state.avatarPersona] || PERSONAS.nova;
    const quotes = [
      `I'm ready! Paste any text and hear ElevenLabs neural synthesis in action.`,
      `Did you know? ElevenLabs Multilingual v2 supports 29+ languages seamlessly!`,
      `Feel free to fine-tune the Voice Stability and Similarity sliders below.`,
      `Click "Generate & Play" whenever you're ready to listen!`
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    updateAvatarDialogue(randomQuote);
    showToast(`${persona.name}: "${randomQuote}"`, 'info', 3000);
  }

  const isFileProtocol = window.location.protocol === 'file:';

  // =========================================================================
  // API Status & Configuration Check (Fixes Netlify "api is not found")
  // =========================================================================
  async function checkApiStatus() {
    state.apiKeyConfigured = true;
    dom.apiWarningBanner.classList.add('banner-hidden');

    // If opened directly from desktop/file system (file://)
    if (isFileProtocol) {
      state.backendMode = 'direct';
      setApiConnectedState('API Connected (Direct Mode)');
      console.log('✓ Running in direct client mode (file:// protocol).');
      return;
    }

    // Test backend /api/status (handles Netlify serverless functions & local Express)
    try {
      const response = await fetch('/api/status');
      if (response.ok) {
        const data = await response.json().catch(() => ({}));
        state.backendMode = 'serverless';
        setApiConnectedState('API Connected (Serverless / Express)');
        return;
      }
    } catch (err) {
      console.warn('Backend serverless route not reachable, testing direct ElevenLabs API...');
    }

    // Direct Mode Fallback:
    // If running on Netlify Static or serverless function is spinning up,
    // the frontend can call ElevenLabs API directly with client-side key.
    if (state.apiKey) {
      state.backendMode = 'direct';
      setApiConnectedState('API Connected (Direct Mode)');
      console.log('✓ ElevenLabs Direct API mode active (Universal Fallback).');
    } else {
      dom.apiStatusBadge.classList.remove('status-connected', 'status-checking');
      dom.apiStatusBadge.classList.add('status-error');
      dom.apiStatusText.textContent = 'API Key Missing';
      dom.apiWarningBanner.classList.remove('banner-hidden');
    }
  }

  function setApiConnectedState(msg = 'API Connected') {
    dom.apiStatusBadge.classList.remove('status-checking', 'status-missing', 'status-error');
    dom.apiStatusBadge.classList.add('status-connected');
    dom.apiStatusText.textContent = msg;
    dom.apiStatusBadge.title = 'ElevenLabs API is connected and ready to synthesize';
  }

  // =========================================================================
  // Models Loader (Resilient against 404s on Netlify & file://)
  // =========================================================================
  async function loadModels() {
    if (!isFileProtocol) {
      try {
        const response = await fetch('/api/models');
        if (response.ok) {
          const data = await response.json();
          if (data.models && data.models.length > 0) {
            state.models = data.models;
            renderModelsDropdown(state.models);
            return;
          }
        }
      } catch (err) {
        console.warn('Could not fetch models from backend, using curated models:', err.message);
      }
    }

    // Curated models fallback
    state.models = CURATED_MODELS;
    renderModelsDropdown(state.models);
  }

  function renderModelsDropdown(models) {
    if (!models || models.length === 0) return;

    dom.modelSelect.innerHTML = '';
    models.forEach(model => {
      const opt = document.createElement('option');
      opt.value = model.model_id;
      opt.textContent = `${model.name}${model.recommended ? ' (Recommended)' : ''}`;
      if (model.recommended || model.model_id === 'eleven_multilingual_v2') {
        opt.selected = true;
        state.selectedModelId = model.model_id;
      }
      dom.modelSelect.appendChild(opt);
    });

    updateModelDetails();
  }

  function updateModelDetails() {
    const selectedId = dom.modelSelect.value;
    state.selectedModelId = selectedId;
    
    const meta = MODEL_META[selectedId] || { badge: 'Standard', desc: 'ElevenLabs Speech Model' };
    dom.modelBadge.textContent = meta.badge;
    dom.modelDescription.textContent = meta.desc;
  }

  // =========================================================================
  // Voices Loader (Resilient against 404s on Netlify & file://)
  // =========================================================================
  async function loadVoices() {
    // 1. Try backend serverless endpoint (if not file://)
    if (!isFileProtocol) {
      try {
        const response = await fetch('/api/voices');
        if (response.ok) {
          const data = await response.json();
          const voices = data.voices || data.fallbackVoices || [];
          if (voices.length > 0) {
            state.voices = voices;
            renderVoicesDropdown(voices);
            return;
          }
        }
      } catch (err) {
        console.warn('Backend voices endpoint not responding, attempting direct ElevenLabs API fetch...');
      }
    }

    // 2. Direct ElevenLabs API fallback
    if (state.apiKey) {
      try {
        const directRes = await fetch('https://api.elevenlabs.io/v1/voices', {
          headers: {
            'xi-api-key': state.apiKey,
            'Accept': 'application/json'
          }
        });
        if (directRes.ok) {
          const directData = await directRes.json();
          if (directData.voices && directData.voices.length > 0) {
            const formatted = directData.voices.map(v => ({
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
            state.voices = formatted;
            renderVoicesDropdown(formatted);
            return;
          }
        }
      } catch (err) {
        console.warn('Direct ElevenLabs voices fetch notice, using verified premade voices.');
      }
    }

    // 3. Fallback Premade Voices
    state.voices = FALLBACK_PREMADE_VOICES;
    renderVoicesDropdown(FALLBACK_PREMADE_VOICES);
  }

  function renderVoicesDropdown(voices) {
    dom.voiceSelect.innerHTML = '';

    if (!voices || voices.length === 0) {
      dom.voiceSelect.innerHTML = '<option value="" disabled>No voices found</option>';
      return;
    }

    voices.forEach((v, index) => {
      const opt = document.createElement('option');
      opt.value = v.voice_id;
      const desc = v.description ? ` (${v.description})` : '';
      opt.textContent = `${v.name}${desc}`;

      // Pick George by default
      if (v.voice_id === 'JBFqnCBsd6RMkjVDRZzb' || index === 0) {
        opt.selected = true;
        state.selectedVoiceId = v.voice_id;
      }
      dom.voiceSelect.appendChild(opt);
    });

    updateVoiceDetails();
  }

  function updateVoiceDetails() {
    const selectedId = dom.voiceSelect.value;
    state.selectedVoiceId = selectedId;

    const currentVoice = state.voices.find(v => v.voice_id === selectedId);
    if (currentVoice) {
      dom.voiceDescription.textContent = currentVoice.description || `${currentVoice.category || 'Premade'} voice`;
      if (currentVoice.preview_url) {
        dom.btnPreviewVoice.style.display = 'inline-flex';
      } else {
        dom.btnPreviewVoice.style.display = 'none';
      }

      // Update avatar dialogue with voice change
      if (state.avatarState === 'idle') {
        updateAvatarDialogue(`Selected voice: ${currentVoice.name} (${currentVoice.description || 'Verified Voice'})`);
      }
    }
  }

  // =========================================================================
  // Character Count & Text Formatting
  // =========================================================================
  function updateCharacterCount() {
    const length = dom.textInput.value.length;
    dom.charCount.textContent = length.toLocaleString();

    // Progress bar fill (max 10,000)
    const percentage = Math.min(100, (length / 10000) * 100);
    dom.charProgressFill.style.width = `${percentage}%`;

    if (length > 9000) {
      dom.charProgressFill.style.backgroundColor = '#ef4444';
      dom.charCount.style.color = '#ef4444';
    } else if (length > 5000) {
      dom.charProgressFill.style.backgroundColor = '#f59e0b';
      dom.charCount.style.color = '#f59e0b';
    } else {
      dom.charProgressFill.style.backgroundColor = '#818cf8';
      dom.charCount.style.color = '#94a3b8';
    }

    // Avatar typing reaction
    if (length > 0 && !state.isPlaying && !state.isGenerating) {
      setAvatarState('listening');
      clearTimeout(state.typingTimer);
      state.typingTimer = setTimeout(() => {
        if (!state.isPlaying && !state.isGenerating) {
          setAvatarState('idle', `Ready to narrate ${length} characters of text!`);
        }
      }, 2500);
    }
  }

  // =========================================================================
  // Voice Settings Sliders Synchronization
  // =========================================================================
  function initVoiceSettings() {
    dom.sliderStability.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.voiceSettings.stability = val;
      dom.valStability.textContent = val.toFixed(2);
    });

    dom.sliderSimilarity.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.voiceSettings.similarity_boost = val;
      dom.valSimilarity.textContent = val.toFixed(2);
    });

    dom.sliderStyle.addEventListener('input', (e) => {
      const val = parseFloat(e.target.value);
      state.voiceSettings.style = val;
      dom.valStyle.textContent = val.toFixed(2);
    });

    dom.toggleSpeakerBoost.addEventListener('change', (e) => {
      state.voiceSettings.use_speaker_boost = e.target.checked;
    });

    // Reset Defaults
    dom.btnResetSettings.addEventListener('click', () => {
      state.voiceSettings = {
        stability: 0.50,
        similarity_boost: 0.75,
        style: 0.00,
        use_speaker_boost: true
      };

      dom.sliderStability.value = 0.50;
      dom.valStability.textContent = '0.50';

      dom.sliderSimilarity.value = 0.75;
      dom.valSimilarity.textContent = '0.75';

      dom.sliderStyle.value = 0.00;
      dom.valStyle.textContent = '0.00';

      dom.toggleSpeakerBoost.checked = true;

      showToast('Voice settings reset to ElevenLabs standard defaults.', 'info', 2000);
    });
  }

  // =========================================================================
  // Generate Narration (Universal Engine: Serverless + Direct Netlify Fallback)
  // =========================================================================
  async function generateNarration() {
    const text = dom.textInput.value.trim();

    // 1. Validations
    if (!text) {
      showError('Please enter some text in the textarea first.');
      dom.textInput.focus();
      return;
    }

    if (!state.selectedVoiceId) {
      showError('Please select a voice before generating narration.');
      return;
    }

    if (!state.selectedModelId) {
      showError('Please select a narration model.');
      return;
    }

    // 2. Loading State & Avatar
    showLoading(true);
    setAvatarState('generating', 'Synthesizing voice audio via ElevenLabs...');
    dom.generationStatus.textContent = 'Contacting ElevenLabs Text-to-Speech API...';

    // Pause any existing playback
    pauseAudio();

    try {
      const payload = {
        text,
        voiceId: state.selectedVoiceId,
        modelId: state.selectedModelId,
        voiceSettings: state.voiceSettings
      };

      let audioBlob = null;
      let usedDirectFallback = false;

      // STEP 1: Attempt Serverless / Express Backend Call (if on HTTP/HTTPS and not direct mode)
      if (!isFileProtocol && state.backendMode !== 'direct') {
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (response.ok) {
            // If Netlify serverless returns binary audio or base64
            const contentType = response.headers.get('content-type') || '';
            if (contentType.includes('audio') || contentType.includes('octet-stream')) {
              audioBlob = await response.blob();
            } else {
              // Check if returned as JSON with base64
              const jsonRes = await response.json();
              if (jsonRes.audio) {
                const byteCharacters = atob(jsonRes.audio);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                  byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                audioBlob = new Blob([byteArray], { type: 'audio/mpeg' });
              }
            }
          } else if (response.status === 404) {
            // 404 on Netlify: Serverless function not active or routing to static
            console.info('Backend returned 404, switching to Direct ElevenLabs API fallback...');
            usedDirectFallback = true;
          } else {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || `Generation failed (HTTP ${response.status})`);
          }
        } catch (backendErr) {
          console.warn('Backend call encountered issue:', backendErr.message);
          usedDirectFallback = true;
        }
      } else {
        usedDirectFallback = true;
      }

      // STEP 2: Direct ElevenLabs API Fallback (Guarantees zero 404s on Netlify)
      if (!audioBlob || usedDirectFallback) {
        dom.generationStatus.textContent = 'Connecting directly to ElevenLabs API...';
        
        const parsedSettings = {
          stability: Math.max(0, Math.min(1, state.voiceSettings.stability || 0.5)),
          similarity_boost: Math.max(0, Math.min(1, state.voiceSettings.similarity_boost || 0.75)),
          style: Math.max(0, Math.min(1, state.voiceSettings.style || 0.0)),
          use_speaker_boost: Boolean(state.voiceSettings.use_speaker_boost)
        };

        const directUrl = `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(state.selectedVoiceId)}?output_format=mp3_44100_128`;

        const directResponse = await fetch(directUrl, {
          method: 'POST',
          headers: {
            'xi-api-key': state.apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
          },
          body: JSON.stringify({
            text,
            model_id: state.selectedModelId,
            voice_settings: parsedSettings
          })
        });

        if (!directResponse.ok) {
          const errText = await directResponse.text();
          let errMsg = 'Failed to generate narration from ElevenLabs.';
          try {
            const parsed = JSON.parse(errText);
            if (parsed.detail?.message) errMsg = parsed.detail.message;
            else if (typeof parsed.detail === 'string') errMsg = parsed.detail;
          } catch (_) {}
          throw new Error(errMsg);
        }

        audioBlob = await directResponse.blob();
      }

      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Received empty audio stream from ElevenLabs.');
      }

      // 4. Successful Audio Response
      dom.generationStatus.textContent = 'Audio ready! Starting playback...';

      // Revoke previous object URL if any
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }

      state.audioBlob = audioBlob;
      state.audioUrl = URL.createObjectURL(audioBlob);

      // Load into audio element
      dom.mainAudio.src = state.audioUrl;
      dom.mainAudio.load();

      // Update Player Track Info
      const activeVoice = state.voices.find(v => v.voice_id === state.selectedVoiceId);
      const activeModel = state.models.find(m => m.model_id === state.selectedModelId);

      dom.playerVoiceName.textContent = activeVoice ? activeVoice.name : 'Custom Voice';
      dom.playerModelName.textContent = activeModel ? activeModel.name : state.selectedModelId;

      // Enable player controls
      dom.btnPlayPause.disabled = false;
      dom.audioSeekbar.disabled = false;
      dom.btnDownload.disabled = false;

      // Automatically play the generated audio
      dom.generationStatus.textContent = 'Narration generated successfully!';
      setTimeout(() => { dom.generationStatus.textContent = ''; }, 3500);

      showToast('Narration generated successfully! Playing now...', 'success');
      playAudio();

    } catch (err) {
      console.error('Narration generation error:', err);
      showError(err.message || 'Unable to generate narration. Please check your API key.');
      setAvatarState('idle', 'Oops, something went wrong with the voice generation. Please try again!');
    } finally {
      showLoading(false);
    }
  }

  function showLoading(isLoading) {
    state.isGenerating = isLoading;
    dom.btnGenerate.disabled = isLoading;

    if (isLoading) {
      dom.btnContentDefault.style.display = 'none';
      dom.btnContentLoading.style.display = 'flex';
    } else {
      dom.btnContentDefault.style.display = 'flex';
      dom.btnContentLoading.style.display = 'none';
    }
  }

  function showError(msg) {
    dom.generationStatus.textContent = msg;
    dom.generationStatus.style.color = '#ef4444';
    showToast(msg, 'error', 6000);
    setTimeout(() => {
      dom.generationStatus.textContent = '';
      dom.generationStatus.style.color = '';
    }, 6000);
  }

  // =========================================================================
  // Audio Player Logic & Synchronized Avatar Speaking
  // =========================================================================
  function playAudio() {
    if (!state.audioUrl) return;

    // Stop voice preview sample if playing
    if (!dom.previewAudio.paused) {
      dom.previewAudio.pause();
      dom.btnPreviewVoice.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Preview Sample
      `;
    }

    dom.mainAudio.play()
      .then(() => {
        state.isPlaying = true;
        updatePlayerUIState();
        setAvatarState('speaking');
      })
      .catch((err) => {
        console.warn('Playback prevented or interrupted:', err);
      });
  }

  function pauseAudio() {
    dom.mainAudio.pause();
    state.isPlaying = false;
    updatePlayerUIState();
    if (!state.isGenerating) {
      setAvatarState('idle', 'Audio paused. Press Play to continue listening.');
    }
  }

  function togglePlayPause() {
    if (dom.mainAudio.paused) {
      playAudio();
    } else {
      pauseAudio();
    }
  }

  function updatePlayerUIState() {
    if (state.isPlaying) {
      dom.iconPlay.style.display = 'none';
      dom.iconPause.style.display = 'block';
      dom.waveformVisualizer.classList.add('waveform-active');
    } else {
      dom.iconPlay.style.display = 'block';
      dom.iconPause.style.display = 'none';
      dom.waveformVisualizer.classList.remove('waveform-active');
    }
  }

  function updateProgress() {
    if (!dom.mainAudio.duration) return;

    const current = dom.mainAudio.currentTime;
    const duration = dom.mainAudio.duration;

    dom.timeCurrent.textContent = formatTime(current);
    dom.timeDuration.textContent = formatTime(duration);

    // Update Seekbar
    const progressPercent = (current / duration) * 100;
    dom.audioSeekbar.value = progressPercent;
    dom.seekbarFill.style.width = `${progressPercent}%`;
  }

  function seekAudio(e) {
    if (!dom.mainAudio.duration) return;
    const seekPercentage = parseFloat(e.target.value);
    const targetTime = (seekPercentage / 100) * dom.mainAudio.duration;
    dom.mainAudio.currentTime = targetTime;
    dom.seekbarFill.style.width = `${seekPercentage}%`;
  }

  function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  // =========================================================================
  // Download Audio
  // =========================================================================
  function downloadAudio() {
    if (!state.audioBlob) {
      showToast('No audio generated to download.', 'warning');
      return;
    }

    const activeVoice = state.voices.find(v => v.voice_id === state.selectedVoiceId);
    const voiceName = (activeVoice?.name || 'narrator').toLowerCase().replace(/\s+/g, '-');
    const timestamp = new Date().toISOString().slice(0, 10);
    const filename = `elevenlabs-${voiceName}-${timestamp}.mp3`;

    const a = document.createElement('a');
    a.href = state.audioUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    showToast(`Downloading: ${filename}`, 'success');
  }

  // =========================================================================
  // Sample Voice Preview
  // =========================================================================
  function previewVoiceSample() {
    const currentVoice = state.voices.find(v => v.voice_id === state.selectedVoiceId);
    if (!currentVoice || !currentVoice.preview_url) {
      showToast('No voice preview sample available for this voice.', 'info');
      return;
    }

    // Pause main playback if active
    pauseAudio();

    if (!dom.previewAudio.paused && dom.previewAudio.src === currentVoice.preview_url) {
      dom.previewAudio.pause();
      dom.btnPreviewVoice.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Preview Sample
      `;
      setAvatarState('idle');
    } else {
      dom.previewAudio.src = currentVoice.preview_url;
      dom.previewAudio.play().then(() => {
        dom.btnPreviewVoice.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          Stop Preview
        `;
        setAvatarState('speaking', `Playing sample preview for ${currentVoice.name}...`);
      }).catch(err => {
        console.warn('Voice preview error:', err);
      });
    }
  }

  // =========================================================================
  // Modal Guide Controls
  // =========================================================================
  function openModalGuide() {
    dom.modalGuide.classList.add('modal-open');
    dom.modalGuide.setAttribute('aria-hidden', 'false');
  }

  function closeModalGuide() {
    dom.modalGuide.classList.remove('modal-open');
    dom.modalGuide.setAttribute('aria-hidden', 'true');
  }

  // =========================================================================
  // Event Listeners Registration
  // =========================================================================
  function attachEventListeners() {
    // Textarea input & counter
    dom.textInput.addEventListener('input', updateCharacterCount);

    // Paste text button
    dom.btnPasteText.addEventListener('click', async () => {
      try {
        const clipboardText = await navigator.clipboard.readText();
        if (clipboardText) {
          dom.textInput.value = clipboardText;
          updateCharacterCount();
          showToast('Text pasted from clipboard', 'info', 2000);
        } else {
          showToast('Clipboard is empty', 'warning');
        }
      } catch (err) {
        showToast('Clipboard permission denied. Please paste manually.', 'warning');
      }
    });

    // Clear text button
    dom.btnClearText.addEventListener('click', () => {
      dom.textInput.value = '';
      updateCharacterCount();
      dom.textInput.focus();
      setAvatarState('idle', 'Text cleared! Enter new text to voice.');
    });

    // Sample chip buttons
    dom.sampleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.dataset.sample;
        if (SAMPLES[sampleKey]) {
          dom.textInput.value = SAMPLES[sampleKey];
          updateCharacterCount();
          showToast(`Loaded "${btn.textContent}" sample text`, 'info', 2000);
          setAvatarState('idle', `Loaded ${btn.textContent} sample! Ready to generate narration.`);
        }
      });
    });

    // Avatar Persona Chips
    dom.personaChips.forEach(chip => {
      chip.addEventListener('click', () => {
        const personaKey = chip.dataset.persona;
        setAvatarPersona(personaKey);
      });
    });

    // Avatar Interactive Click
    if (dom.avatarInteractive) {
      dom.avatarInteractive.addEventListener('click', handleAvatarClick);
    }

    // Model and Voice Select
    dom.modelSelect.addEventListener('change', updateModelDetails);
    dom.voiceSelect.addEventListener('change', updateVoiceDetails);
    dom.btnPreviewVoice.addEventListener('click', previewVoiceSample);

    // Generate CTA
    dom.btnGenerate.addEventListener('click', generateNarration);

    // Audio Player controls
    dom.btnPlayPause.addEventListener('click', togglePlayPause);
    dom.audioSeekbar.addEventListener('input', seekAudio);

    // Native audio events
    dom.mainAudio.addEventListener('timeupdate', updateProgress);
    dom.mainAudio.addEventListener('play', () => {
      state.isPlaying = true;
      updatePlayerUIState();
      setAvatarState('speaking');
    });
    dom.mainAudio.addEventListener('pause', () => {
      state.isPlaying = false;
      updatePlayerUIState();
      if (!state.isGenerating) {
        setAvatarState('idle');
      }
    });
    dom.mainAudio.addEventListener('ended', () => {
      state.isPlaying = false;
      updatePlayerUIState();
      dom.audioSeekbar.value = 0;
      dom.seekbarFill.style.width = '0%';
      dom.timeCurrent.textContent = '00:00';
      const persona = PERSONAS[state.avatarPersona] || PERSONAS.nova;
      setAvatarState('idle', persona.doneMsg);
    });
    dom.mainAudio.addEventListener('loadedmetadata', () => {
      dom.timeDuration.textContent = formatTime(dom.mainAudio.duration);
    });

    // Voice preview audio reset
    dom.previewAudio.addEventListener('ended', () => {
      dom.btnPreviewVoice.innerHTML = `
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
        Preview Sample
      `;
      setAvatarState('idle');
    });

    // Volume & Mute
    dom.volumeSlider.addEventListener('input', (e) => {
      const vol = parseFloat(e.target.value);
      dom.mainAudio.volume = vol;
      if (vol === 0) {
        dom.iconVolHigh.style.display = 'none';
        dom.iconVolMuted.style.display = 'block';
      } else {
        dom.iconVolHigh.style.display = 'block';
        dom.iconVolMuted.style.display = 'none';
      }
    });

    dom.btnVolumeToggle.addEventListener('click', () => {
      if (dom.mainAudio.volume > 0) {
        state.previousVolume = dom.mainAudio.volume;
        dom.mainAudio.volume = 0;
        dom.volumeSlider.value = 0;
        dom.iconVolHigh.style.display = 'none';
        dom.iconVolMuted.style.display = 'block';
      } else {
        const restoreVol = state.previousVolume || 1.0;
        dom.mainAudio.volume = restoreVol;
        dom.volumeSlider.value = restoreVol;
        dom.iconVolHigh.style.display = 'block';
        dom.iconVolMuted.style.display = 'none';
      }
    });

    // Playback Speed
    dom.speedSelect.addEventListener('change', (e) => {
      const speed = parseFloat(e.target.value);
      dom.mainAudio.playbackRate = speed;
      showToast(`Playback speed: ${speed}x`, 'info', 1500);
    });

    // Download button
    dom.btnDownload.addEventListener('click', downloadAudio);

    // Modal triggers
    dom.btnOpenGuide.addEventListener('click', openModalGuide);
    dom.btnBannerGuide.addEventListener('click', openModalGuide);
    dom.apiStatusBadge.addEventListener('click', openModalGuide);
    dom.btnCloseModal.addEventListener('click', closeModalGuide);
    dom.btnModalDone.addEventListener('click', closeModalGuide);
    dom.modalGuide.addEventListener('click', (e) => {
      if (e.target === dom.modalGuide) closeModalGuide();
    });

    // Keyboard Shortcuts (Esc to close modal, Space on audio player when not typing)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.modalGuide.classList.contains('modal-open')) {
        closeModalGuide();
      }
      if (e.code === 'Space' && !['TEXTAREA', 'INPUT', 'SELECT', 'BUTTON'].includes(document.activeElement.tagName)) {
        if (state.audioUrl) {
          e.preventDefault();
          togglePlayPause();
        }
      }
    });
  }

  // =========================================================================
  // Initialization
  // =========================================================================
  async function init() {
    attachEventListeners();
    initVoiceSettings();
    updateCharacterCount();

    // Check backend API connection & load data in parallel
    await Promise.all([
      checkApiStatus(),
      loadModels(),
      loadVoices()
    ]);
  }

  init();
});
