/**
 * ElevenLabs AI Narrator - Frontend Controller
 * Complete modular Vanilla JavaScript architecture
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // State Management
  // =========================================================================
  const state = {
    apiKeyConfigured: false,
    voices: [],
    models: [],
    selectedVoiceId: null,
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
    previousVolume: 1.0
  };

  // Sample texts for quick demonstration
  const SAMPLES = {
    story: "Deep within the ancient observatory, the brass telescope hummed with forgotten energy. As the constellation aligned, a harmonic whisper echoed through the crystalline domes, signaling that the stars had finally returned the lost transmission.",
    tech: "In today's deep dive, we explore how neural audio synthesis and diffusion acoustic models are transforming digital narration, enabling real-time conversational agents with unmatched emotional fidelity and sub-second latency.",
    quote: "The only limit to our realization of tomorrow will be our doubts of today. Let us move forward with strong and active faith, creating the future one courageous step at a time.",
    announcement: "Welcome to ElevenLabs AI Narrator! Experience studio-grade voice generation powered by state-of-the-art multilingual models. Paste your script, tune the voice stability, and bring your words to life."
  };

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
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    // Choose icon according to type
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
  // API Status & Configuration Check
  // =========================================================================
  async function checkApiStatus() {
    try {
      const response = await fetch('/api/status');
      if (!response.ok) throw new Error('Status route failed');
      const data = await response.json();

      state.apiKeyConfigured = data.configured;

      dom.apiStatusBadge.classList.remove('status-checking', 'status-connected', 'status-missing', 'status-error');

      if (data.configured) {
        dom.apiStatusBadge.classList.add('status-connected');
        dom.apiStatusText.textContent = 'API Connected';
        dom.apiWarningBanner.classList.add('banner-hidden');
      } else {
        dom.apiStatusBadge.classList.add('status-missing');
        dom.apiStatusText.textContent = 'API Key Setup';
        dom.apiWarningBanner.classList.remove('banner-hidden');
      }
    } catch (err) {
      console.warn('API Status error:', err);
      dom.apiStatusBadge.classList.remove('status-checking', 'status-connected', 'status-missing');
      dom.apiStatusBadge.classList.add('status-error');
      dom.apiStatusText.textContent = 'Offline';
    }
  }

  // =========================================================================
  // Models Loader
  // =========================================================================
  async function loadModels() {
    try {
      const response = await fetch('/api/models');
      if (!response.ok) throw new Error('Failed to load models');
      const data = await response.json();

      state.models = data.models || [];
      renderModelsDropdown(state.models);
    } catch (err) {
      console.error('Error loading models:', err);
      showToast('Could not fetch latest models; using defaults.', 'warning');
    }
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
  // Voices Loader
  // =========================================================================
  async function loadVoices() {
    dom.voiceSelect.innerHTML = '<option value="" disabled selected>Loading voices from ElevenLabs...</option>';
    
    try {
      const response = await fetch('/api/voices');
      const data = await response.json();

      if (!response.ok && response.status === 401) {
        showToast('Invalid ElevenLabs API key in .env', 'error');
        dom.apiStatusBadge.classList.remove('status-connected');
        dom.apiStatusBadge.classList.add('status-error');
        dom.apiStatusText.textContent = 'Invalid Key';
      }

      const voices = data.voices || data.fallbackVoices || [];
      state.voices = voices;

      renderVoicesDropdown(voices);

      if (data.hasApiKey === false) {
        showToast('Running in preview mode. Add ELEVENLABS_API_KEY to generate speech.', 'warning', 6000);
      }
    } catch (err) {
      console.error('Error fetching voices:', err);
      showToast('Network error loading voices. Check your backend server.', 'error');
      dom.voiceSelect.innerHTML = '<option value="" disabled selected>Failed to load voices</option>';
    }
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

      // Pick first voice or default Rachel/George
      if (index === 0) {
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
      // Toggle preview sample button visibility
      if (currentVoice.preview_url) {
        dom.btnPreviewVoice.style.display = 'inline-flex';
      } else {
        dom.btnPreviewVoice.style.display = 'none';
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
  // Generate Narration
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

    // 2. Loading State
    showLoading(true);
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

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      // 3. Handle errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMsg = errorData.error || `Generation failed (HTTP ${response.status})`;
        
        if (response.status === 400 && errorData.code === 'MISSING_API_KEY') {
          openModalGuide();
        }

        throw new Error(errorMsg);
      }

      // 4. Successful Audio Response (audio/mpeg binary stream)
      dom.generationStatus.textContent = 'Finalizing audio stream...';
      const audioBlob = await response.blob();

      if (audioBlob.size === 0) {
        throw new Error('Received empty audio stream from backend.');
      }

      // Revoke previous object URL if any
      if (state.audioUrl) {
        URL.revokeObjectURL(state.audioUrl);
      }

      // Store in state
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
      showError(err.message || 'Unable to generate narration. Please check your API configuration.');
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
  // Audio Player Logic
  // =========================================================================
  function playAudio() {
    if (!state.audioUrl) return;

    dom.mainAudio.play()
      .then(() => {
        state.isPlaying = true;
        updatePlayerUIState();
      })
      .catch((err) => {
        console.warn('Playback prevented or interrupted:', err);
      });
  }

  function pauseAudio() {
    dom.mainAudio.pause();
    state.isPlaying = false;
    updatePlayerUIState();
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
    } else {
      dom.previewAudio.src = currentVoice.preview_url;
      dom.previewAudio.play().then(() => {
        dom.btnPreviewVoice.innerHTML = `
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          Stop Preview
        `;
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
    });

    // Sample chip buttons
    dom.sampleButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const sampleKey = btn.dataset.sample;
        if (SAMPLES[sampleKey]) {
          dom.textInput.value = SAMPLES[sampleKey];
          updateCharacterCount();
          showToast(`Loaded "${btn.textContent}" sample text`, 'info', 2000);
        }
      });
    });

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
    });
    dom.mainAudio.addEventListener('pause', () => {
      state.isPlaying = false;
      updatePlayerUIState();
    });
    dom.mainAudio.addEventListener('ended', () => {
      state.isPlaying = false;
      updatePlayerUIState();
      dom.audioSeekbar.value = 0;
      dom.seekbarFill.style.width = '0%';
      dom.timeCurrent.textContent = '00:00';
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

    // Keyboard Shortcuts (Esc to close modal, Space on audio player)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && dom.modalGuide.classList.contains('modal-open')) {
        closeModalGuide();
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
