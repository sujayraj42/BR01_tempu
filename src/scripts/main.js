// -------------------------------------------------------------
// TEMPU WALA — HARD BHOJPURI PHONK RADIO ENGINE
// High-Impact Poster Art Visuals & Interactive Audio Visualizer
// -------------------------------------------------------------

const SCENE_POSTERS = [
  { id: 'highway-night', name: 'Highway Night Drift', image: '/assets/poster-highway-night.jpg', color: '#00F0FF' },
  { id: 'dhaba-break', name: 'Dhaba Neon Night', image: '/assets/poster-dhaba-break.jpg', color: '#FFC800' },
  { id: 'monsoon-phonk', name: 'Monsoon Rain Drift', image: '/assets/poster-monsoon-phonk.jpg', color: '#00FF66' },
  { id: 'mela-crowd', name: 'Mela Bass Festival', image: '/assets/poster-mela-crowd.jpg', color: '#FF2A6D' },
  { id: 'overloaded-rush', name: 'Overloaded Highway', image: '/assets/poster-overloaded-rush.jpg', color: '#FFAA00' }
];

const PLAYLIST_TRACKS = [
  { id: 0, videoId: "rs-vlTfVDYs", title: "Bhojpuri Phonk (Official Track)", artist: "Tempu Beats × Phonk", poster: "/assets/poster-highway-night.jpg" },
  { id: 1, videoId: "b8k_h7J9g8A", title: "Lolipop Lagelu (Bhojpuri Phonk)", artist: "Pawan Singh × Desi Phonk", poster: "/assets/poster-dhaba-break.jpg" },
  { id: 2, videoId: "9bZkp7q19f0", title: "Katta Bass Drift", artist: "Bhojpuri Hard Phonk", poster: "/assets/poster-monsoon-phonk.jpg" },
  { id: 3, videoId: "kJQP7kiw5Fk", title: "Raja Ji Phonk (Ultra Bass)", artist: "Bihar Phonk Club", poster: "/assets/poster-mela-crowd.jpg" },
  { id: 4, videoId: "fJ9rUzIMcZQ", title: "Patna Bypass Hard Bass", artist: "Hajipur Phonk Beats", poster: "/assets/poster-overloaded-rush.jpg" },
  { id: 5, videoId: "3tmd-ClpJxA", title: "Overloaded Highway Rush", artist: "Muzaffarpur Drift", poster: "/assets/poster-highway-night.jpg" }
];

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

const BASS_PRESETS = [
  { name: "⚡ BASS: OVERDRIVE", level: 1.0 },
  { name: "🌙 BASS: DHABA NIGHT", level: 0.7 },
  { name: "🏎 BASS: CRUISE", level: 0.5 },
  { name: "🎵 BASS: NORMAL", level: 0.3 }
];

let currentPosterIndex = 0;
let currentTrackIndex = 0;
let currentPresetIndex = 0;
let currentSloganIndex = 0;
let isPlaying = false;
let isMuted = false;
let likedCount = 2840;
let isLiked = false;

let ytPlayer = null;
let isPlayerReady = false;
let progressInterval = null;
let quoteTimerInterval = null;
let activePosterLayer = 'A';

// Visualizer State
let visCanvas, visCtx;
let visFrame = 0;
let audioParticles = [];

// -------------------------------------------------------------
// POSTER BACKGROUND CROSSFADE MANAGER
// -------------------------------------------------------------
export function cyclePosterMood(targetIndex = null) {
  if (targetIndex !== null) {
    currentPosterIndex = targetIndex % SCENE_POSTERS.length;
  } else {
    currentPosterIndex = (currentPosterIndex + 1) % SCENE_POSTERS.length;
  }

  const poster = SCENE_POSTERS[currentPosterIndex];
  const layerA = document.getElementById('bgPosterA');
  const layerB = document.getElementById('bgPosterB');

  if (!layerA || !layerB) return;

  if (activePosterLayer === 'A') {
    layerB.style.backgroundImage = `url('${poster.image}')`;
    layerB.classList.add('active');
    layerA.classList.remove('active');
    activePosterLayer = 'B';
  } else {
    layerA.style.backgroundImage = `url('${poster.image}')`;
    layerA.classList.add('active');
    layerB.classList.remove('active');
    activePosterLayer = 'A';
  }

  showToast(`🖼 Art Mood: ${poster.name}`);
}

// -------------------------------------------------------------
// NEON AUDIO FREQUENCY WAVE VISUALIZER
// -------------------------------------------------------------
function initVisualizer() {
  visCanvas = document.getElementById('audioVisualizerCanvas');
  if (!visCanvas) return;
  visCtx = visCanvas.getContext('2d');

  resizeVisualizer();
  window.addEventListener('resize', resizeVisualizer);

  // Generate glowing floating audio particles
  audioParticles = [];
  for (let i = 0; i < 45; i++) {
    audioParticles.push({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight - Math.random() * 180,
      size: Math.random() * 2.5 + 1,
      speedY: Math.random() * 0.8 + 0.2,
      alpha: Math.random() * 0.7 + 0.2,
      color: Math.random() > 0.5 ? '#FFC800' : '#00F0FF'
    });
  }

  requestAnimationFrame(renderVisualizerLoop);
}

function resizeVisualizer() {
  if (!visCanvas) return;
  visCanvas.width = window.innerWidth;
  visCanvas.height = 220;
}

function renderVisualizerLoop() {
  visFrame++;
  if (!visCtx || !visCanvas) return;

  visCtx.clearRect(0, 0, visCanvas.width, visCanvas.height);

  const W = visCanvas.width;
  const H = visCanvas.height;
  const numBars = Math.floor(W / 18);
  const bassAmp = isPlaying ? (1.5 + BASS_PRESETS[currentPresetIndex].level * 1.2) : 0.4;

  // 1. Draw Bouncing Frequency Spectrum Bars
  for (let i = 0; i < numBars; i++) {
    const x = i * 18 + 4;
    const freqVal = Math.sin(visFrame * 0.08 + i * 0.3) * Math.cos(visFrame * 0.05 + i * 0.15);
    const barHeight = Math.max(8, (Math.abs(freqVal) * 90 + Math.random() * 12) * bassAmp);

    const grad = visCtx.createLinearGradient(0, H, 0, H - barHeight);
    grad.addColorStop(0, "rgba(255, 200, 0, 0.1)");
    grad.addColorStop(0.5, "rgba(0, 240, 255, 0.6)");
    grad.addColorStop(1, "rgba(255, 42, 109, 0.95)");

    visCtx.fillStyle = grad;
    visCtx.beginPath();
    visCtx.roundRect(x, H - barHeight, 10, barHeight, [4, 4, 0, 0]);
    visCtx.fill();
  }

  // 2. Draw Floating Neon Sparks/Particles
  audioParticles.forEach(p => {
    p.y -= isPlaying ? p.speedY * 1.5 : p.speedY * 0.5;
    if (p.y < H - 200) {
      p.y = H;
      p.x = Math.random() * W;
    }

    visCtx.fillStyle = p.color;
    visCtx.globalAlpha = p.alpha;
    visCtx.beginPath();
    visCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    visCtx.fill();
  });
  visCtx.globalAlpha = 1.0;

  // 3. Glowing Bottom Horizon Sine Wave
  visCtx.strokeStyle = "rgba(0, 240, 255, 0.45)";
  visCtx.lineWidth = 2;
  visCtx.beginPath();
  visCtx.moveTo(0, H - 10);
  for (let x = 0; x < W; x += 15) {
    const y = H - 10 - Math.sin((x + visFrame * 4) * 0.02) * (isPlaying ? 12 : 3);
    visCtx.lineTo(x, y);
  }
  visCtx.stroke();

  requestAnimationFrame(renderVisualizerLoop);
}

// -------------------------------------------------------------
// PLAYLIST DRAWER & TRACK SELECTION
// -------------------------------------------------------------
function renderPlaylistGrid() {
  const grid = document.getElementById('playlistGrid');
  if (!grid) return;

  grid.innerHTML = PLAYLIST_TRACKS.map((track, i) => `
    <div class="playlist-card ${i === currentTrackIndex ? 'active' : ''}" onclick="selectTrack(${i})">
      <img class="playlist-card-img" src="${track.poster}" alt="${track.title}" />
      <div class="playlist-card-info">
        <span class="playlist-card-title">${track.title}</span>
        <span class="playlist-card-artist">${track.artist}</span>
      </div>
    </div>
  `).join('');
}

window.selectTrack = function(index) {
  currentTrackIndex = index % PLAYLIST_TRACKS.length;
  const track = PLAYLIST_TRACKS[currentTrackIndex];

  // Update UI Elements
  const titleEl = document.getElementById('trackTitle');
  const artistEl = document.getElementById('trackArtist');
  const thumbEl = document.getElementById('playerThumb');

  if (titleEl) titleEl.textContent = track.title;
  if (artistEl) artistEl.textContent = track.artist;
  if (thumbEl) thumbEl.src = track.poster;

  // Switch poster background
  cyclePosterMood(currentTrackIndex % SCENE_POSTERS.length);

  // Play YouTube Track if player exists
  if (ytPlayer) {
    if (track.videoId && typeof ytPlayer.loadVideoById === 'function') {
      ytPlayer.loadVideoById(track.videoId);
    } else if (typeof ytPlayer.playVideoAt === 'function') {
      ytPlayer.playVideoAt(currentTrackIndex);
    }
  } else {
    initYouTubeAPI();
  }

  renderPlaylistGrid();
  togglePlaylistDrawer(false);
  showToast(`🎵 Playing: ${track.title}`);
};

export function togglePlaylistDrawer(forceState = null) {
  const drawer = document.getElementById('playlistDrawer');
  if (!drawer) return;
  if (forceState !== null) {
    drawer.classList.toggle('open', forceState);
  } else {
    drawer.classList.toggle('open');
  }
}

// -------------------------------------------------------------
// AUDIENCE ENGAGEMENT: LIKE, SHARE, SHAYARI
// -------------------------------------------------------------
export function handleLikeTrack() {
  const likeCountEl = document.getElementById('likeCount');
  const likeIconEl = document.getElementById('likeIcon');
  if (!likeCountEl || !likeIconEl) return;

  if (!isLiked) {
    likedCount++;
    isLiked = true;
    likeIconEl.textContent = '💖';
    showToast("❤️ Liked! Phonk power increased!");
  } else {
    likedCount--;
    isLiked = false;
    likeIconEl.textContent = '❤️';
  }
  likeCountEl.textContent = `${(likedCount / 1000).toFixed(1)}k`;
}

export function handleShareRadio() {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(window.location.href);
    showToast("🚀 Radio Link Copied! Send to friends!");
  } else {
    showToast("🚀 Radio Link: " + window.location.href);
  }
}

export function nextQuote() {
  currentSloganIndex = (currentSloganIndex + 1) % HIGHWAY_SLOGANS.length;
  updateQuoteDisplay(currentSloganIndex);
}

export function copyCurrentQuote() {
  const quoteText = HIGHWAY_SLOGANS[currentSloganIndex];
  if (navigator.clipboard) {
    navigator.clipboard.writeText(`"${quoteText}" — TEMPU WALA RADIO`);
    showToast("📋 Slogan Copied to Clipboard!");
  }
}

function updateQuoteDisplay(sloganIndex) {
  const textEl = document.getElementById('heroQuoteText');
  if (!textEl) return;

  textEl.classList.add('quote-fade');
  setTimeout(() => {
    textEl.textContent = `"${HIGHWAY_SLOGANS[sloganIndex]}"`;
    textEl.classList.remove('quote-fade');
  }, 350);
}

function startQuoteTimer() {
  if (quoteTimerInterval) clearInterval(quoteTimerInterval);
  quoteTimerInterval = setInterval(nextQuote, 14000);
}

// -------------------------------------------------------------
// PRESSURE HORN SYNTHESIZER
// -------------------------------------------------------------
export function triggerHornSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const now = audioCtx.currentTime;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc2.type = 'square';
    filter.type = 'lowpass';
    filter.frequency.value = 1800;

    osc1.frequency.setValueAtTime(440, now);
    osc1.frequency.exponentialRampToValueAtTime(523.25, now + 0.35);

    osc2.frequency.setValueAtTime(659.25, now);
    osc2.frequency.exponentialRampToValueAtTime(698.46, now + 0.35);

    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.15, now + 0.05);
    gainNode.gain.setValueAtTime(0.15, now + 0.28);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.45);
    osc2.stop(now + 0.45);
  } catch (e) {}

  // Screen pulse flash
  document.body.classList.add('horn-flash');
  setTimeout(() => document.body.classList.remove('horn-flash'), 300);

  showToast("📢 HORN OK PLEASE! 🎺");
}

// -------------------------------------------------------------
// BASS PRESET TOGGLE
// -------------------------------------------------------------
export function cycleBassPreset() {
  currentPresetIndex = (currentPresetIndex + 1) % BASS_PRESETS.length;
  const preset = BASS_PRESETS[currentPresetIndex];
  const btn = document.getElementById('btnBassPreset');

  if (btn) btn.textContent = preset.name;
  showToast(`⚡ Equalizer: ${preset.name}`);
}

// -------------------------------------------------------------
// YOUTUBE PLAYER API INTEGRATION
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
      videoId: 'rs-vlTfVDYs',
      playerVars: {
        autoplay: 0,
        controls: 1,
        rel: 0,
        enablejsapi: 1,
        origin: window.location.origin
      },
      events: {
        onReady: onPlayerReady,
        onStateChange: onPlayerStateChange
      }
    });
  } catch (err) {}
}

function onPlayerReady() {
  isPlayerReady = true;
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

    // Dynamically retrieve actual playing video title & author from YouTube playlist
    if (ytPlayer && typeof ytPlayer.getVideoData === 'function') {
      const data = ytPlayer.getVideoData();
      if (data && data.title) {
        const titleEl = document.getElementById('trackTitle');
        const artistEl = document.getElementById('trackArtist');
        if (titleEl) titleEl.textContent = data.title;
        if (artistEl) artistEl.textContent = data.author || "Bhojpuri Phonk Radio";

        // Sync active playlist index if available from YouTube
        if (typeof ytPlayer.getPlaylistIndex === 'function') {
          const idx = ytPlayer.getPlaylistIndex();
          if (idx !== undefined && idx >= 0) {
            currentTrackIndex = idx % PLAYLIST_TRACKS.length;
            cyclePosterMood(currentTrackIndex % SCENE_POSTERS.length);
            renderPlaylistGrid();
          }
        }
      }
    }

    showToast("▶ PLAYING PLAYLIST TRACK!");
    startProgressTracker();
  } else if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) {
    isPlaying = false;
    if (playPauseBtn) playPauseBtn.innerHTML = '▶';
    if (eqBars) eqBars.classList.remove('playing');
    stopProgressTracker();
  }
}

export function togglePlayPause() {
  if (!isPlayerReady || !ytPlayer) {
    showToast("▶ Loading Playlist Stream...");
    initYouTubeAPI();
    return;
  }

  if (isPlaying) {
    if (typeof ytPlayer.pauseVideo === 'function') ytPlayer.pauseVideo();
  } else {
    if (typeof ytPlayer.playVideo === 'function') ytPlayer.playVideo();
  }
}

export function nextTrack() {
  if (ytPlayer && typeof ytPlayer.nextVideo === 'function') {
    ytPlayer.nextVideo();
  } else {
    currentTrackIndex = (currentTrackIndex + 1) % PLAYLIST_TRACKS.length;
    window.selectTrack(currentTrackIndex);
  }
}

export function prevTrack() {
  if (ytPlayer && typeof ytPlayer.previousVideo === 'function') {
    ytPlayer.previousVideo();
  } else {
    currentTrackIndex = (currentTrackIndex - 1 + PLAYLIST_TRACKS.length) % PLAYLIST_TRACKS.length;
    window.selectTrack(currentTrackIndex);
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
    const ringCircle = document.getElementById('progressRingCircle');

    if (currentTimeEl) currentTimeEl.textContent = formatTime(current);
    if (totalTimeEl && total > 1) totalTimeEl.textContent = formatTime(total);

    const pct = Math.max(0, Math.min(1, current / total));
    if (fillEl) fillEl.style.width = `${pct * 100}%`;

    if (ringCircle) {
      const circumference = 144.51;
      ringCircle.style.strokeDashoffset = `${circumference * (1 - pct)}`;
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
    cyclePosterMood();
  } else if (key === 'l') {
    togglePlaylistDrawer();
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
// INITIALIZATION
// -------------------------------------------------------------
document.addEventListener('DOMContentLoaded', () => {
  // Initialize Neon Visualizer
  initVisualizer();

  // Render Track Playlist Cards
  renderPlaylistGrid();

  // Bind Event Listeners
  const playPauseBtn = document.getElementById('btnPlayPause');
  if (playPauseBtn) playPauseBtn.addEventListener('click', togglePlayPause);

  const prevBtn = document.getElementById('btnPrev');
  if (prevBtn) prevBtn.addEventListener('click', prevTrack);

  const nextBtn = document.getElementById('btnNext');
  if (nextBtn) nextBtn.addEventListener('click', nextTrack);

  const hornBtn = document.getElementById('btnHornPill');
  if (hornBtn) hornBtn.addEventListener('click', triggerHornSound);

  const sceneBtn = document.getElementById('btnSceneCycle');
  if (sceneBtn) sceneBtn.addEventListener('click', () => cyclePosterMood());

  const playlistBtn = document.getElementById('btnPlaylistToggle');
  const playlistClose = document.getElementById('playlistClose');
  const playerTrackInfo = document.getElementById('playerTrackInfo');

  if (playlistBtn) playlistBtn.addEventListener('click', () => togglePlaylistDrawer());
  if (playlistClose) playlistClose.addEventListener('click', () => togglePlaylistDrawer(false));
  if (playerTrackInfo) playerTrackInfo.addEventListener('click', () => togglePlaylistDrawer());

  const bassPresetBtn = document.getElementById('btnBassPreset');
  if (bassPresetBtn) bassPresetBtn.addEventListener('click', cycleBassPreset);

  const btnMute = document.getElementById('btnMute');
  if (btnMute) btnMute.addEventListener('click', toggleMute);

  const btnLike = document.getElementById('btnLikeTrack');
  const btnShare = document.getElementById('btnShareTrack');
  const btnNextQ = document.getElementById('btnNextQuote');
  const btnCopyQ = document.getElementById('btnCopyQuote');

  if (btnLike) btnLike.addEventListener('click', handleLikeTrack);
  if (btnShare) btnShare.addEventListener('click', handleShareRadio);
  if (btnNextQ) btnNextQ.addEventListener('click', nextQuote);
  if (btnCopyQ) btnCopyQ.addEventListener('click', copyCurrentQuote);

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

  window.addEventListener('keydown', handleKeyboardShortcuts);

  startQuoteTimer();

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }

  initYouTubeAPI();
});
