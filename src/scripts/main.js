// -------------------------------------------------------------
// TEMPU WALA — PURE CODE HTML5 CANVAS AUTO HIGHWAY ANIMATION ENGINE
// Green & Yellow Bihari Auto Rickshaw driving on Bihar Highway
// -------------------------------------------------------------

const SCENE_MOODS = [
  { name: "Highway Sunset", skyTop: "#2C082A", skyBottom: "#FF5E36", road: "#151722", line: "#FFC800" },
  { name: "Dhaba Night", skyTop: "#05060A", skyBottom: "#12182B", road: "#0A0C14", line: "#FFC800" },
  { name: "Monsoon Phonk", skyTop: "#081C24", skyBottom: "#003846", road: "#0B151A", line: "#00F0FF" },
  { name: "Mela Lights", skyTop: "#330818", skyBottom: "#8C1B3F", road: "#1A0A10", line: "#FFC800" },
  { name: "Golden Morning", skyTop: "#1A2A40", skyBottom: "#FF9933", road: "#1C1E26", line: "#FFFFFF" }
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
  { name: "⚡ BASS: OVERDRIVE", speedBoost: 6, bounce: 5 },
  { name: "🌙 BASS: DHABA NIGHT", speedBoost: 3, bounce: 3 },
  { name: "🏎 BASS: CRUISE", speedBoost: 2, bounce: 2 },
  { name: "🎵 BASS: NORMAL", speedBoost: 0, bounce: 1.5 }
];

let currentPresetIndex = 0;
let currentMoodIndex = 0;
let currentSloganIndex = 0;
let isPlaying = false;
let isMuted = false;
let ytPlayer = null;
let isPlayerReady = false;
let progressInterval = null;
let quoteTimerInterval = null;

// Animation Engine State
let canvas, ctx;
let frameCount = 0;
let wheelRotation = 0;
let hornJumpY = 0;
let hornFlash = 0;
let exhaustParticles = [];
let roadsideElements = [];
let stars = [];

// -------------------------------------------------------------
// REAL-TIME CLOCK & SAWAARI COUNTER
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

let currentSawaari = 1428;
setInterval(() => {
  const delta = Math.floor(Math.random() * 11) - 3;
  currentSawaari = Math.max(1200, currentSawaari + delta);
  const sawaariEl = document.getElementById('sawaariCount');
  if (sawaariEl) sawaariEl.textContent = `${currentSawaari.toLocaleString()} SAWAARI ONLINE`;
}, 4000);

// -------------------------------------------------------------
// PURE CANVAS ANIMATION ENGINE (GREEN & YELLOW BIHAR AUTO TEMPO)
// -------------------------------------------------------------
function initCanvasEngine() {
  canvas = document.getElementById('autoHighwayCanvas');
  if (!canvas) return;
  ctx = canvas.getContext('2d');

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Generate Stars
  stars = [];
  for (let i = 0; i < 70; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * (canvas.height * 0.5),
      size: Math.random() * 2 + 0.5,
      alpha: Math.random()
    });
  }

  // Generate Initial Roadside Elements (Milestone markers, poles)
  roadsideElements = [];
  const milestoneNames = ["PATNA 45 KM", "GAYA 80 KM", "BIHAR 0 KM", "HAJIPUR 12 KM", "MUZAFFARPUR 65 KM"];
  for (let i = 0; i < 6; i++) {
    roadsideElements.push({
      x: i * (canvas.width / 4) + 100,
      type: i % 2 === 0 ? 'milestone' : 'pole',
      text: milestoneNames[i % milestoneNames.length]
    });
  }

  requestAnimationFrame(renderCanvasLoop);
}

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function renderCanvasLoop() {
  frameCount++;
  const mood = SCENE_MOODS[currentMoodIndex];
  const preset = BASS_PRESETS[currentPresetIndex];
  const currentSpeed = (isPlaying ? 9 : 3.5) + preset.speedBoost;

  // Clear Canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1. Draw Sky Gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.65);
  skyGrad.addColorStop(0, mood.skyTop);
  skyGrad.addColorStop(1, mood.skyBottom);
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, canvas.width, canvas.height * 0.65);

  // 2. Draw Twinkling Stars
  if (currentMoodIndex === 1 || currentMoodIndex === 2 || currentMoodIndex === 3) {
    ctx.fillStyle = "#FFFFFF";
    stars.forEach(star => {
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin((frameCount + star.x) * 0.03));
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;
  }

  // 3. Draw Parallax Distant Mountains/Hills
  const roadY = canvas.height * 0.62;
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.moveTo(0, roadY);
  for (let x = 0; x <= canvas.width; x += 40) {
    const y = roadY - 40 - Math.sin((x + frameCount * 0.5) * 0.008) * 35;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvas.width, roadY);
  ctx.closePath();
  ctx.fill();

  // 4. Draw Road Asphalt
  ctx.fillStyle = mood.road;
  ctx.fillRect(0, roadY, canvas.width, canvas.height - roadY);

  // Road Shoulder Grass Line
  ctx.fillStyle = "#0D1E12";
  ctx.fillRect(0, roadY, canvas.width, 8);

  // 5. Moving Dashed Center Line
  ctx.strokeStyle = mood.line;
  ctx.lineWidth = 6;
  ctx.setLineDash([40, 35]);
  ctx.lineDashOffset = -frameCount * currentSpeed * 1.5;
  ctx.beginPath();
  ctx.moveTo(0, roadY + 80);
  ctx.lineTo(canvas.width, roadY + 80);
  ctx.stroke();
  ctx.setLineDash([]);

  // 6. Draw Parallax Roadside Elements (Milestones & Poles)
  roadsideElements.forEach(el => {
    el.x -= currentSpeed * 0.8;
    if (el.x < -120) {
      el.x = canvas.width + 100;
    }

    if (el.type === 'milestone') {
      const mx = el.x;
      const my = roadY - 45;

      ctx.fillStyle = "#EAEAEA";
      ctx.beginPath();
      ctx.arc(mx + 16, my + 16, 16, Math.PI, 0);
      ctx.rect(mx, my + 16, 32, 28);
      ctx.fill();
      ctx.strokeStyle = "#111";
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = "#FFC800";
      ctx.beginPath();
      ctx.arc(mx + 16, my + 16, 15, Math.PI, 0);
      ctx.fill();

      ctx.fillStyle = "#000";
      ctx.font = "bold 9px 'JetBrains Mono', monospace";
      ctx.textAlign = "center";
      ctx.fillText("BIHAR", mx + 16, my + 12);
      ctx.fillText(el.text.split(' ')[0], mx + 16, my + 28);
    } else {
      const px = el.x;
      const py = roadY - 160;

      ctx.strokeStyle = "#333745";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(px, roadY);
      ctx.lineTo(px, py);
      ctx.stroke();

      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(px - 20, py + 15);
      ctx.lineTo(px + 20, py + 15);
      ctx.stroke();

      ctx.strokeStyle = "rgba(100,110,130,0.5)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(px - 150, py + 25);
      ctx.quadraticCurveTo(px - 75, py + 45, px + 20, py + 25);
      ctx.stroke();
    }
  });

  // 7. Suspension Physics & Horn Easing
  if (hornJumpY < 0) {
    hornJumpY += 1.2;
  } else {
    hornJumpY = 0;
  }
  if (hornFlash > 0) hornFlash--;

  const bounceFactor = isPlaying ? preset.bounce : 1.2;
  const suspensionY = Math.sin(frameCount * 0.25) * bounceFactor + hornJumpY;

  // 8. Auto Rickshaw Position Calculations
  const autoX = canvas.width > 768 ? canvas.width * 0.38 : canvas.width * 0.15;
  const autoY = roadY - 115 + suspensionY;

  wheelRotation += currentSpeed * 0.08;

  // 9. DRAW THE PERFECT SHAPED GREEN & YELLOW BIHAR AUTO TEMPO
  drawBihariAuto(ctx, autoX, autoY, wheelRotation, hornFlash > 0);

  // 10. Exhaust Particles
  if (frameCount % 4 === 0) {
    exhaustParticles.push({
      x: autoX - 15,
      y: autoY + 82,
      radius: 3 + Math.random() * 4,
      alpha: 0.6,
      vx: -currentSpeed * 0.3 - Math.random() * 1.5,
      vy: -Math.random() * 1
    });
  }

  ctx.fillStyle = "rgba(180, 190, 200, 0.4)";
  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    const p = exhaustParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.radius += 0.3;
    p.alpha -= 0.02;

    if (p.alpha <= 0) {
      exhaustParticles.splice(i, 1);
      continue;
    }

    ctx.globalAlpha = Math.max(0, p.alpha);
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  requestAnimationFrame(renderCanvasLoop);
}

// -------------------------------------------------------------
// PERFECT ACCURATE SHAPE VECTOR DRAWING OF BIHAR PASSENGER AUTO RICKSHAW
// -------------------------------------------------------------
function drawBihariAuto(ctx, x, y, wheelRot, isHornFlashing) {
  ctx.save();
  ctx.translate(x, y);

  // A) HEADLIGHT BEAM GLOW (LIGHTING UP THE ROAD AHEAD)
  const beamGrad = ctx.createLinearGradient(200, 48, 550, 95);
  beamGrad.addColorStop(0, isHornFlashing ? "rgba(255, 255, 220, 0.9)" : "rgba(255, 230, 140, 0.5)");
  beamGrad.addColorStop(1, "rgba(255, 200, 0, 0)");

  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(200, 48);
  ctx.lineTo(canvas.width, 10);
  ctx.lineTo(canvas.width, 150);
  ctx.lineTo(200, 68);
  ctx.closePath();
  ctx.fill();

  // B) GROUND DROP SHADOW
  ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
  ctx.beginPath();
  ctx.ellipse(95, 96, 115, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // C) REAR MUDFLAP ("HORN OK PLEASE")
  ctx.fillStyle = "#11141A";
  ctx.fillRect(-18, 65, 14, 28);
  ctx.fillStyle = "#FFC800";
  ctx.font = "700 7px 'JetBrains Mono', monospace";
  ctx.fillText("HORN OK", -17, 77);
  ctx.fillText("PLEASE", -17, 87);

  // Red Tail Reflector Lamp
  ctx.fillStyle = "#FF2A2A";
  ctx.shadowColor = "#FF2A2A";
  ctx.shadowBlur = 10;
  ctx.fillRect(-14, 50, 7, 12);
  ctx.shadowBlur = 0; // Reset

  // D) LOWER METALLIC GREEN BODY WORK (#00A859 BIHAR GREEN)
  const greenGrad = ctx.createLinearGradient(0, 25, 0, 85);
  greenGrad.addColorStop(0, "#00A859");
  greenGrad.addColorStop(0.6, "#008848");
  greenGrad.addColorStop(1, "#00582D");
  ctx.fillStyle = greenGrad;

  // Main Green Body Shell Contour
  ctx.beginPath();
  ctx.moveTo(-5, 28);
  ctx.lineTo(185, 28);
  ctx.quadraticCurveTo(202, 38, 198, 62); // Front Nose Slanted Curve
  ctx.lineTo(178, 86);
  ctx.lineTo(12, 86);
  ctx.quadraticCurveTo(-12, 75, -5, 28);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#00381C";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Front Nose Black Bumper / Grille Panel (Mahindra / Bajaj Style)
  ctx.fillStyle = "#1A1D24";
  ctx.beginPath();
  ctx.moveTo(175, 36);
  ctx.quadraticCurveTo(200, 42, 196, 62);
  ctx.lineTo(180, 80);
  ctx.lineTo(168, 80);
  ctx.quadraticCurveTo(185, 60, 170, 36);
  ctx.closePath();
  ctx.fill();

  // Black Front Bumper Guard Bar
  ctx.fillStyle = "#090A0F";
  ctx.fillRect(194, 52, 10, 18);

  // Side Passenger Doorway Opening
  ctx.fillStyle = "#0A0C12";
  ctx.beginPath();
  ctx.roundRect(40, 32, 85, 48, [8, 8, 0, 0]);
  ctx.fill();
  ctx.strokeStyle = "#00381C";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Passenger Bench Seats & Cushions inside Doorway
  ctx.fillStyle = "#1B4D3E";
  ctx.fillRect(44, 58, 38, 18); // Rear Bench
  ctx.fillRect(92, 58, 30, 18); // Front Bench
  ctx.fillStyle = "#266B57";
  ctx.fillRect(44, 46, 12, 28); // Rear Backrest Cushion

  // Chrome Side Passenger Handrail Bar
  ctx.strokeStyle = "#D1D5DB";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(122, 35);
  ctx.lineTo(122, 78);
  ctx.stroke();

  // Front & Rear Wheel Arches
  ctx.fillStyle = "#11141A";
  ctx.beginPath();
  ctx.arc(162, 86, 22, Math.PI, 0); // Front Mudguard Arch
  ctx.arc(32, 86, 24, Math.PI, 0);  // Rear Arch
  ctx.fill();

  // E) PERFECT VIBRANT YELLOW CANOPY ROOF HOOD (#FFD100)
  const yellowGrad = ctx.createLinearGradient(0, -18, 0, 30);
  yellowGrad.addColorStop(0, "#FFF033");
  yellowGrad.addColorStop(0.5, "#FFD100");
  yellowGrad.addColorStop(1, "#E6B800");
  ctx.fillStyle = yellowGrad;

  // Canopy Roof Silhouette Shape
  ctx.beginPath();
  ctx.moveTo(-10, 30);
  ctx.quadraticCurveTo(-14, -8, 12, -18); // Sloped Rear Roof Corner
  ctx.lineTo(158, -18);                   // Flat Top Roof Line
  ctx.quadraticCurveTo(188, -6, 192, 30);  // Front Visor Overhang Curve
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#997A00";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // Canopy Fabric Rib Seams & Straps
  ctx.strokeStyle = "rgba(0,0,0,0.2)";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(35, -18); ctx.lineTo(35, 30);
  ctx.moveTo(85, -18); ctx.lineTo(85, 30);
  ctx.moveTo(135, -18); ctx.lineTo(135, 30);
  ctx.stroke();

  // Rear Side Window Cutout in Yellow Canopy (Classic Auto Style)
  ctx.fillStyle = "#1A1D24";
  ctx.beginPath();
  ctx.roundRect(5, -6, 32, 22, 4);
  ctx.fill();
  ctx.strokeStyle = "#997A00";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Rear Window Glass Tint
  ctx.fillStyle = "rgba(0, 240, 255, 0.25)";
  ctx.fillRect(8, -3, 26, 16);

  // F) FRONT WINDSHIELD GLASS & FRAME
  ctx.fillStyle = "#12141A";
  ctx.beginPath();
  ctx.moveTo(148, -12);
  ctx.lineTo(184, -4);
  ctx.lineTo(176, 32);
  ctx.lineTo(144, 30);
  ctx.closePath();
  ctx.fill();

  // Glass Window Tint & Shine
  const glassGrad = ctx.createLinearGradient(150, -10, 180, 30);
  glassGrad.addColorStop(0, "rgba(0, 240, 255, 0.75)");
  glassGrad.addColorStop(1, "rgba(0, 240, 255, 0.15)");
  ctx.fillStyle = glassGrad;
  ctx.beginPath();
  ctx.moveTo(150, -9);
  ctx.lineTo(181, -2);
  ctx.lineTo(174, 28);
  ctx.lineTo(147, 26);
  ctx.closePath();
  ctx.fill();

  // Dual Windshield Wipers
  ctx.strokeStyle = "#000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(150, 24); ctx.lineTo(168, 5);
  ctx.stroke();

  // Driver Rearview Side Mirror
  ctx.fillStyle = "#111";
  ctx.fillRect(186, 6, 7, 14);
  ctx.strokeStyle = "#111";
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(178, 13);
  ctx.lineTo(186, 13);
  ctx.stroke();

  // G) MAIN HEADLIGHT & AMBER SIDE TURN INDICATORS
  ctx.fillStyle = isHornFlashing ? "#FFFFFF" : "#FFEA00";
  ctx.shadowColor = "#FFEA00";
  ctx.shadowBlur = isHornFlashing ? 30 : 15;
  ctx.beginPath();
  ctx.arc(194, 52, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0; // Reset

  // Headlight Chrome Rim
  ctx.strokeStyle = "#E5E7EB";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Amber Indicator Lamp (Top Nose)
  ctx.fillStyle = "#FF9900";
  ctx.beginPath();
  ctx.arc(188, 38, 4, 0, Math.PI * 2);
  ctx.fill();

  // H) SPINNING 5-SPOKE ALLOY WHEELS (REAR & FRONT)
  drawSpinningWheel(ctx, 32, 86, 20, wheelRot);
  drawSpinningWheel(ctx, 162, 86, 18, wheelRot);

  ctx.restore();
}

// DRAW ROTATING 5-SPOKE ALLOY WHEEL WITH SILVER RIM
function drawSpinningWheel(ctx, wx, wy, radius, rot) {
  ctx.save();
  ctx.translate(wx, wy);

  // Black Rubber Tire
  ctx.fillStyle = "#12141A";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2E3342";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Tire Tread Details
  ctx.strokeStyle = "#08090C";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Silver Alloy Rim
  ctx.fillStyle = "#D1D5DB";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.58, 0, Math.PI * 2);
  ctx.fill();

  // Rotating 5-Spoke Alloy Pattern
  ctx.rotate(rot);
  ctx.strokeStyle = "#1F2937";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((radius * 0.58) * Math.cos(angle), (radius * 0.58) * Math.sin(angle));
    ctx.stroke();
  }

  // Center Gold Wheel Hub Nut
  ctx.fillStyle = "#FFC800";
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

// -------------------------------------------------------------
// INTERACTIVE FUNCTIONS & MOOD TOGGLES
// -------------------------------------------------------------
export function cycleScene() {
  currentMoodIndex = (currentMoodIndex + 1) % SCENE_MOODS.length;
  const mood = SCENE_MOODS[currentMoodIndex];
  showToast(`🖼 Mood: ${mood.name}`);
}

export function cycleBassPreset() {
  currentPresetIndex = (currentPresetIndex + 1) % BASS_PRESETS.length;
  const preset = BASS_PRESETS[currentPresetIndex];
  const btn = document.getElementById('btnBassPreset');

  if (btn) btn.textContent = preset.name;
  showToast(`🔥 EQ Preset: ${preset.name}`);
}

// -------------------------------------------------------------
// 15-SECOND PURE QUOTE TYPOGRAPHY AUTO-CHANGE
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
// PLEASANT & MELODIC WARM HORN CHIME (WEB AUDIO API)
// -------------------------------------------------------------
export function triggerHornSound() {
  hornJumpY = -18;
  hornFlash = 12;

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
  // Silent fallback
}

// -------------------------------------------------------------
// PLAYBACK CONTROLS
// -------------------------------------------------------------
export function togglePlayPause() {
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
  if (ytPlayer && typeof ytPlayer.nextVideo === 'function') {
    ytPlayer.nextVideo();
  }
}

export function prevTrack() {
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

  // Initialize Pure Code Canvas Engine
  initCanvasEngine();

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
