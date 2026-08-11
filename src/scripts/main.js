// -------------------------------------------------------------
// TEMPU WALA — FULL-BLEED HERO & AUDIO INTEGRATION
// -------------------------------------------------------------

const POSTER_LIST = [
  '/src/assets/poster-highway-night.jpg',
  '/src/assets/poster-dhaba-break.jpg',
  '/src/assets/poster-overloaded-rush.jpg',
  '/src/assets/poster-monsoon-phonk.jpg',
  '/src/assets/poster-mela-crowd.jpg'
];

const SCENE_NAMES = [
  "Highway Night",
  "Dhaba Break",
  "Overloaded Rush",
  "Monsoon Phonk",
  "Mela Crowd"
];

// All 20 Authentic Bihari Tempu & Highway Slogans
const HIGHWAY_SLOGANS = [
  "हंस मत पगले प्यार हो जाएगा",
  "देखे में छोट, पर चोट बड़े मारब",
  "बुरा मत देख, बुरा मत बोल, सीधा बाईपास डोल",
  "हम जियेंगे शान से, जलने वाले जलेंगे जान से",
  "जिगर है तो पास आ, वरना दूर से सलाम कर",
  "दम है तो पार कर, वरना बर्दाश्त कर",
  "लटक मत बेटा, जान चली जाएगी",
  "दूरी बनाए रखें, प्यार अपने आप हो जाएगा",
  "हॉर्न दबाके रास्ता पावें",
  "देख मगर प्यार से",
  "समय से पहले, भाग्य से ज्यादा कभी नहीं मिलता",
  "मेहनत मेरी, रहमत तेरी",
  "मालिक की गाड़ी, ड्राइवर का पसीना",
  "जिंदगी एक सफर है, सुहाना सफर है",
  "वक्त बदलेगा, सब ठीक हो जाएगा",
  "बुरी नजर वाले तेरा मुंह काला",
  "जलने वाले जलते रहो, हम आगे बढ़ते रहेंगे",
  "नजर हटी, दुर्घटना घटी",
  "तेरी दुआ से चलती है",
  "बच के रहियो बाबू"
];

// Equalizer Presets
const BASS_PRESETS = [
  { name: "⚡ BASS: OVERDRIVE", gain: 14, freq: 70 },
  { name: "🌙 BASS: DHABA NIGHT", gain: 8, freq: 90 },
  { name: "🏎 BASS: CRUISE", gain: 5, freq: 100 },
  { name: "🎵 BASS: NORMAL", gain: 0, freq: 80 }
];

let currentPresetIndex = 0;
let currentPosterIndex = 0;
let currentSloganIndex = 0;
let isPlaying = false;
let isMuted = false;
let ytPlayer = null;
let isPlayerReady = false;
let progressInterval = null;
let quoteTimerInterval = null;
let activeBgLayer = 1;

// -------------------------------------------------------------
// LIVE REAL-TIME CLOCK (e.g. "5:10 PM")
// -------------------------------------------------------------
function updateLiveClock() {
  const clockEl = document.getElementById('liveClock');
  if (!clockEl) return;

  const now = new Date();
  let hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? '0' + minutes : minutes;
  clockEl.textContent = `${hours}:${minutesStr} ${ampm}`;
}
setInterval(updateLiveClock, 1000);

// -------------------------------------------------------------
// DYNAMIC LIVE SAWAARI COUNTER
// -------------------------------------------------------------
let currentSawaari = 1428;
function updateSawaariCount() {
  const sawaariEl = document.getElementById('sawaariCount');
  if (!sawaariEl) return;
  const delta = Math.floor(Math.random() * 11) - 3;
  currentSawaari = Math.max(1200, currentSawaari + delta);
  sawaariEl.textContent = `${currentSawaari.toLocaleString()} SAWAARI ONLINE`;
}
setInterval(updateSawaariCount, 4000);

// -------------------------------------------------------------
// FULL-BLEED BACKGROUND CROSS-FADE POSTER SYNC
// -------------------------------------------------------------
function setBackgroundPoster(posterIndex) {
  if (posterIndex === currentPosterIndex && document.querySelector('.bg-hero-img.active')) return;
  currentPosterIndex = posterIndex;

  const img1 = document.getElementById('bgHeroImg1');
  const img2 = document.getElementById('bgHeroImg2');
  if (!img1 || !img2) return;

  const newPosterSrc = POSTER_LIST[posterIndex];

  if (activeBgLayer === 1) {
    img2.src = newPosterSrc;
    img2.classList.add('active');
    img1.classList.remove('active');
    activeBgLayer = 2;
  } else {
    img1.src = newPosterSrc;
    img1.classList.add('active');
    img2.classList.remove('active');
    activeBgLayer = 1;
  }

  showToast(`🖼 Scene: ${SCENE_NAMES[posterIndex]}`);
}

export function cycleScene() {
  const nextIndex = (currentPosterIndex + 1) % POSTER_LIST.length;
  setBackgroundPoster(nextIndex);
}

function syncPosterToVideoId(videoId) {
  if (!videoId) return;
  let sum = 0;
  for (let i = 0; i < videoId.length; i++) {
    sum += videoId.charCodeAt(i);
  }
  const index = sum % POSTER_LIST.length;
  setBackgroundPoster(index);
}

// -------------------------------------------------------------
// 15-SECOND PURE QUOTE TYPOGRAPHY AUTO-CHANGE (NO BOX/CARD)
// -------------------------------------------------------------
function updateQuoteDisplay(sloganIndex) {
  currentSloganIndex = sloganIndex % HIGHWAY_SLOGANS.length;
  const textEl = document.getElementById('heroQuoteText');

  if (!textEl) return;

  textEl.classList.add('quote-fade');
  setTimeout(() => {
    textEl.textContent = `"${HIGHWAY_SLOGANS[currentSloganIndex]}"`;
    textEl.classList.remove('quote-fade');
  }, 400);
}

export function nextQuote() {
  updateQuoteDisplay(currentSloganIndex + 1);
}

function startQuoteTimer() {
  if (quoteTimerInterval) clearInterval(quoteTimerInterval);
  quoteTimerInterval = setInterval(() => {
    updateQuoteDisplay(currentSloganIndex + 1);
  }, 15000);
}

// -------------------------------------------------------------
// KATTA BASS BOOSTER EQUALIZER PRESET TOGGLE
// -------------------------------------------------------------
export function cycleBassPreset() {
  currentPresetIndex = (currentPresetIndex + 1) % BASS_PRESETS.length;
  const preset = BASS_PRESETS[currentPresetIndex];
  const btn = document.getElementById('btnBassPreset');

  if (btn) btn.textContent = preset.name;
  triggerHornSound();
  showToast(`🔥 EQ Preset: ${preset.name}`);
}

// -------------------------------------------------------------
// PLEASANT & MELODIC WARM HORN CHIME (WEB AUDIO API)
// -------------------------------------------------------------
export function triggerHornSound() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;

  const ctx = new AudioCtx();
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const filter = ctx.createBiquadFilter();
  const gainNode = ctx.createGain();

  osc1.type = 'sine';
  osc2.type = 'triangle';

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(1400, ctx.currentTime);

  const now = ctx.currentTime;
  osc1.frequency.setValueAtTime(523.25, now);
  osc1.frequency.exponentialRampToValueAtTime(587.33, now + 0.1);
  osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.35);

  osc2.frequency.setValueAtTime(659.25, now);
  osc2.frequency.exponentialRampToValueAtTime(698.46, now + 0.1);
  osc2.frequency.exponentialRampToValueAtTime(659.25, now + 0.35);

  gainNode.gain.setValueAtTime(0, now);
  gainNode.gain.linearRampToValueAtTime(0.12, now + 0.05);
  gainNode.gain.setValueAtTime(0.12, now + 0.28);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.45);
  osc2.stop(now + 0.45);

  const container = document.querySelector('.bg-hero-container');
  if (container) {
    container.classList.add('horn-pulse');
    setTimeout(() => container.classList.remove('horn-pulse'), 500);
  }

  showToast("🎺 Soft Musical Horn Chime!");
}

// -------------------------------------------------------------
// YOUTUBE IFRAME PLAYER API INTEGRATION
// -------------------------------------------------------------
function initYouTubeAPI() {
  if (!window.YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    tag.async = true;
    const firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(tag, firstScript);
  } else if (window.YT && window.YT.Player) {
    createPlayer();
  }
}

window.onYouTubeIframeAPIReady = function() {
  createPlayer();
};

function createPlayer() {
  const mountEl = document.getElementById('youtube-embed');
  if (!mountEl) return;

  try {
    ytPlayer = new window.YT.Player('youtube-embed', {
      height: '100%',
      width: '100%',
      playerVars: {
        listType: 'playlist',
        list: 'PLSQDgs2rRTeY',
        autoplay: 0,
        controls: 1,
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange,
        onError: onPlayerError
      }
    });
  } catch (err) {
    onPlayerError();
  }
}

function onPlayerReady() {
  isPlayerReady = true;
  // Strictly ensure audio does NOT play on start/load off
  if (ytPlayer && typeof ytPlayer.pauseVideo === 'function') {
    ytPlayer.pauseVideo();
  }
}

function onPlayerStateChange(event) {
  const playPauseBtn = document.getElementById('btnPlayPause');
  const eqBars = document.getElementById('playerEqBars');

  if (event.data === window.YT.PlayerState.PLAYING) {
    isPlaying = true;
    if (playPauseBtn) playPauseBtn.innerHTML = '❚❚';
    if (eqBars) eqBars.classList.add('playing');
    showToast("▶ TEMPU BASS PLAYING!");
    startProgressTracker();

    if (ytPlayer && typeof ytPlayer.getVideoData === 'function') {
      const data = ytPlayer.getVideoData();
      if (data) {
        const titleEl = document.getElementById('trackTitle');
        const artistEl = document.getElementById('trackArtist');
        if (titleEl && data.title) titleEl.textContent = data.title;
        if (artistEl && data.author) artistEl.textContent = data.author;
        if (data.video_id) syncPosterToVideoId(data.video_id);
      }
    }
  } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.innerHTML = '▶';
    if (eqBars) eqBars.classList.remove('playing');
    stopProgressTracker();
  }
}

function onPlayerError() {
  // Silent fallback so no toasts interrupt start off
}

// -------------------------------------------------------------
// PLAYBACK CONTROLS
// -------------------------------------------------------------
export function togglePlayPause() {
  triggerHornSound();

  if (!isPlayerReady || !ytPlayer) {
    showToast("▶ Loading Player...");
    initYouTubeAPI();
    return;
  }

  if (isPlaying) {
    if (typeof ytPlayer.pauseVideo === 'function') {
      ytPlayer.pauseVideo();
    }
  } else {
    if (typeof ytPlayer.playVideo === 'function') {
      ytPlayer.playVideo();
    }
  }
}

export function nextTrack() {
  triggerHornSound();
  if (ytPlayer && typeof ytPlayer.nextVideo === 'function') {
    ytPlayer.nextVideo();
  }
}

export function prevTrack() {
  triggerHornSound();
  if (ytPlayer && typeof ytPlayer.previousVideo === 'function') {
    ytPlayer.previousVideo();
  }
}

export function toggleMute() {
  if (!ytPlayer) return;
  const btnMute = document.getElementById('btnMute');
  isMuted = !isMuted;

  if (isMuted) {
    if (typeof ytPlayer.mute === 'function') ytPlayer.mute();
    if (btnMute) btnMute.textContent = '🔇';
    showToast("🔇 Audio Muted");
  } else {
    if (typeof ytPlayer.unMute === 'function') ytPlayer.unMute();
    if (btnMute) btnMute.textContent = '🔊';
    showToast("🔊 Audio Unmuted");
  }
}

function startProgressTracker() {
  stopProgressTracker();
  progressInterval = setInterval(() => {
    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;

    const current = ytPlayer.getCurrentTime() || 0;
    const total = ytPlayer.getDuration() || 1;

    const currentTimeEl = document.getElementById('currentTime');
    const totalTimeEl = document.getElementById('totalTime');
    const fillEl = document.getElementById('progressBarFill');

    if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
    if (totalTimeEl && total > 1) totalTimeEl.textContent = formatTime(total);
    if (fillEl) {
      const pct = (current / total) * 100;
      fillEl.style.width = `${pct}%`;
    }
  }, 500);
}

function stopProgressTracker() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
}

function formatTime(secs) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

// -------------------------------------------------------------
// KEYBOARD SHORTCUTS HANDLER
// -------------------------------------------------------------
function handleKeyboardShortcuts(e) {
  if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

  const key = e.key.toLowerCase();

  if (e.code === 'Space' || key === 'k') {
    e.preventDefault();
    togglePlayPause();
  } else if (e.code === 'ArrowRight' || key === 'n') {
    nextTrack();
  } else if (e.code === 'ArrowLeft' || key === 'p') {
    prevTrack();
  } else if (key === 'h' || key === 'b') {
    triggerHornSound();
  } else if (key === 'm') {
    toggleMute();
  } else if (key === 'e') {
    cycleBassPreset();
  } else if (key === 'q') {
    nextQuote();
  } else if (key === '?') {
    toggleKbModal();
  }
}

export function toggleKbModal() {
  const modal = document.getElementById('kbModal');
  if (modal) modal.classList.toggle('open');
}

// -------------------------------------------------------------
// TOAST NOTIFICATION HELPER
// -------------------------------------------------------------
export function showToast(msg) {
  const toast = document.getElementById('toastMsg');
  if (!toast) return;
  toast.textContent = msg;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// -------------------------------------------------------------
// INITIALIZE ON DOM LOADED
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  updateLiveClock();

  // Controls
  const playPauseBtn = document.getElementById('btnPlayPause');
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);

  const prevBtn = document.getElementById('btnPrev');
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);

  const nextBtn = document.getElementById('btnNext');
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);

  const hornBtn = document.getElementById('btnHornPill');
  if (hornBtn) hornBtn.addEventListener('click', triggerHornSound);

  const sceneBtn = document.getElementById('btnSceneCycle');
  if (sceneBtn) sceneBtn.addEventListener('click', cycleScene);

  const bassPresetBtn = document.getElementById('btnBassPreset');
  if (bassPresetBtn) bassPresetBtn.addEventListener('click', cycleBassPreset);

  const btnMute = document.getElementById('btnMute');
  if (btnMute) btnMute.addEventListener('click', toggleMute);

  const volumeSlider = document.getElementById('volumeSlider');
  if (volumeSlider) {
    volumeSlider.addEventListener('input', (e) => {
      const vol = parseInt(e.target.value, 10);
      if (ytPlayer && typeof ytPlayer.setVolume === 'function') {
        ytPlayer.setVolume(vol);
      }
    });
  }

  const toggleFrameBtn = document.getElementById('btnToggleFrame');
  const playerDrawer = document.getElementById('playerDrawer');
  if (toggleFrameBtn && playerDrawer) {
    toggleFrameBtn.addEventListener('click', () => {
      playerDrawer.classList.toggle('open');
    });
  }

  const kbBadge = document.getElementById('kbBadge');
  const kbModalClose = document.getElementById('kbModalClose');
  if (kbBadge) kbBadge.addEventListener('click', toggleKbModal);
  if (kbModalClose) kbModalClose.addEventListener('click', toggleKbModal);

  const progressBarBg = document.getElementById('progressBarBg');
  if (progressBarBg) {
    progressBarBg.addEventListener('click', (e) => {
      if (!ytPlayer || typeof ytPlayer.seekTo !== 'function') return;
      const rect = progressBarBg.getBoundingClientRect();
      const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      const total = ytPlayer.getDuration() || 1;
      ytPlayer.seekTo(pct * total, true);
    });
  }

  // Bind Keyboard Shortcuts
  window.addEventListener('keydown', handleKeyboardShortcuts);

  // Start 15-second quote rotation timer
  startQuoteTimer();

  // Register Service Worker for PWA
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  initYouTubeAPI();
});
