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
  { name: "⚡ BASS: OVERDRIVE", speedBoost: 3.5, bounce: 4 },
  { name: "🌙 BASS: DHABA NIGHT", speedBoost: 1.8, bounce: 2.5 },
  { name: "🏎 BASS: CRUISE", speedBoost: 1.0, bounce: 1.8 },
  { name: "🎵 BASS: NORMAL", speedBoost: 0, bounce: 1.2 }
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

  // Generate Initial Roadside Elements
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
  const currentSpeed = (isPlaying ? 3.2 : 1.6) + preset.speedBoost;

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
    const y = roadY - 40 - Math.sin((x + frameCount * 0.25) * 0.008) * 35;
    ctx.lineTo(x, y);
  }
  ctx.lineTo(canvas.width, roadY);
  ctx.closePath();
  ctx.fill();

  // 4. Draw Road Asphalt & Solid Shoulder Markings
  ctx.fillStyle = mood.road;
  ctx.fillRect(0, roadY, canvas.width, canvas.height - roadY);

  // Solid Upper White Shoulder Line & Grass
  ctx.fillStyle = "#0D1E12";
  ctx.fillRect(0, roadY, canvas.width, 10);
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(0, roadY + 10, canvas.width, 3);

  // Solid Lower White Edge Line
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 4);

  // 5. Moving Dashed Center Line & Cat's Eye Reflectors
  ctx.strokeStyle = mood.line;
  ctx.lineWidth = 6;
  ctx.setLineDash([45, 40]);
  ctx.lineDashOffset = -frameCount * currentSpeed * 1.2;
  ctx.beginPath();
  ctx.moveTo(0, roadY + 80);
  ctx.lineTo(canvas.width, roadY + 80);
  ctx.stroke();
  ctx.setLineDash([]);

  // Reflective Cat's Eyes along center line
  ctx.fillStyle = "#FFC800";
  ctx.shadowColor = "#FFC800";
  ctx.shadowBlur = 6;
  const studOffset = (frameCount * currentSpeed * 1.2) % 85;
  for (let sx = -studOffset; sx < canvas.width; sx += 85) {
    ctx.fillRect(sx, roadY + 78, 6, 4);
  }
  ctx.shadowBlur = 0;

  // 6. Draw Parallax Roadside Elements (Milestones & Poles)
  roadsideElements.forEach(el => {
    el.x -= currentSpeed * 0.7;
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

  const bounceFactor = isPlaying ? preset.bounce : 1.1;
  const suspensionY = Math.sin(frameCount * 0.18) * bounceFactor + hornJumpY;

  // 8. Auto Rickshaw Position Calculations
  const autoX = canvas.width > 768 ? canvas.width * 0.38 : canvas.width * 0.15;
  const autoY = roadY - 118 + suspensionY;

  wheelRotation += currentSpeed * 0.05;

  // 9. DRAW THE ULTIMATE MASTERPIECE BIHAR AUTO TEMPO
  drawMasterpieceAuto(ctx, autoX, autoY, wheelRotation, hornFlash > 0);

  // 10. Smoke Ring Exhaust Particles
  if (frameCount % 5 === 0) {
    exhaustParticles.push({
      x: autoX - 18,
      y: autoY + 86,
      radius: 3 + Math.random() * 3,
      alpha: 0.55,
      vx: -currentSpeed * 0.35 - Math.random() * 1.2,
      vy: -Math.random() * 0.7
    });
  }

  ctx.fillStyle = "rgba(190, 200, 215, 0.4)";
  for (let i = exhaustParticles.length - 1; i >= 0; i--) {
    const p = exhaustParticles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.radius += 0.28;
    p.alpha -= 0.015;

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
// REDESIGNED MASTERPIECE VECTOR DRAWING — ACCURATE CLASSIC BIHAR AUTO RICKSHAW
// Viewed from side-right perspective, facing right
// -------------------------------------------------------------
function drawMasterpieceAuto(ctx, x, y, wheelRot, isHornFlashing) {
  ctx.save();
  ctx.translate(x, y);

  // ─── COORDINATE SYSTEM (all relative to x,y bottom-left of chassis) ───
  // Vehicle faces RIGHT. Width ~220px. Height ~130px.
  // Wheels sit at y=0 (ground). Body rises to y=-130.

  const W = 220;  // Total vehicle length
  const H = 100;  // Chassis height above wheel centres
  const WY = 0;   // Wheel centre Y (ground level)
  const RW = 35;  // Rear wheel X
  const FW = 185; // Front wheel X

  // ── HEADLIGHT CONE BEAM ────────────────────────────────────────────────
  const beamGrad = ctx.createLinearGradient(W + 5, -H * 0.5, canvas.width * 0.8, -H * 0.3);
  beamGrad.addColorStop(0, isHornFlashing ? "rgba(255,255,200,0.92)" : "rgba(255,230,130,0.50)");
  beamGrad.addColorStop(0.5, "rgba(255,200,60,0.18)");
  beamGrad.addColorStop(1, "rgba(255,180,0,0)");
  ctx.fillStyle = beamGrad;
  ctx.beginPath();
  ctx.moveTo(W + 5, -H * 0.55);
  ctx.lineTo(canvas.width, -H * 1.1);
  ctx.lineTo(canvas.width, H * 0.3);
  ctx.lineTo(W + 5, -H * 0.2);
  ctx.closePath();
  ctx.fill();

  // ── GROUND SHADOW ──────────────────────────────────────────────────────
  ctx.fillStyle = "rgba(0,0,0,0.5)";
  ctx.beginPath();
  ctx.ellipse(W * 0.45, WY + 14, W * 0.52, 11, 0, 0, Math.PI * 2);
  ctx.fill();

  // ── REAR MUDFLAP "HORN OK PLEASE" ──────────────────────────────────────
  ctx.fillStyle = "#0A0C10";
  ctx.beginPath();
  ctx.roundRect(-18, -H * 0.35, 13, 28, [2, 2, 4, 4]);
  ctx.fill();
  ctx.fillStyle = "#FFC800";
  ctx.font = "bold 6.5px 'JetBrains Mono', monospace";
  ctx.textAlign = "center";
  ctx.fillText("HORN OK", -11, -H * 0.35 + 11);
  ctx.fillText("PLEASE", -11, -H * 0.35 + 22);

  // ── REAR TAIL LAMP ─────────────────────────────────────────────────────
  ctx.fillStyle = "#FF1500";
  ctx.shadowColor = "#FF3300"; ctx.shadowBlur = 14;
  ctx.beginPath(); ctx.roundRect(-14, -H * 0.55, 8, 16, 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "#9CA3AF"; ctx.lineWidth = 1.2;
  ctx.strokeRect(-14, -H * 0.55, 8, 16);

  // ══════════════════════════════════════════════════════════════════
  // CHASSIS LOWER GREEN BODY  (main hull)
  // ══════════════════════════════════════════════════════════════════
  const gBody = ctx.createLinearGradient(0, -H, 0, WY - 10);
  gBody.addColorStop(0, "#00E676");
  gBody.addColorStop(0.25, "#00C853");
  gBody.addColorStop(0.65, "#00893A");
  gBody.addColorStop(1, "#004D20");
  ctx.fillStyle = gBody;

  ctx.beginPath();
  // Rear bottom corner
  ctx.moveTo(0, WY - 10);
  // Rear vertical edge (slightly angled)
  ctx.lineTo(-2, -H * 0.28);
  // Rear-top shoulder curve
  ctx.quadraticCurveTo(-4, -H * 0.30, 5, -H * 0.32);
  // Roof rail (straight along top)
  ctx.lineTo(W * 0.78, -H * 0.32);
  // Front shoulder — steep slant down to bumper nose
  ctx.quadraticCurveTo(W * 0.92, -H * 0.32, W * 0.95, -H * 0.18);
  ctx.quadraticCurveTo(W + 4, -H * 0.05, W + 2, WY - 10);
  // Bottom chassis rail back
  ctx.lineTo(0, WY - 10);
  ctx.closePath();
  ctx.fill();

  // Body outline
  ctx.strokeStyle = "#003318"; ctx.lineWidth = 2;
  ctx.stroke();

  // Body gloss highlight stripe
  const gHighlight = ctx.createLinearGradient(0, -H * 0.32, 0, -H * 0.20);
  gHighlight.addColorStop(0, "rgba(255,255,255,0.38)");
  gHighlight.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gHighlight;
  ctx.beginPath();
  ctx.moveTo(5, -H * 0.32);
  ctx.lineTo(W * 0.78, -H * 0.32);
  ctx.quadraticCurveTo(W * 0.90, -H * 0.32, W * 0.93, -H * 0.26);
  ctx.lineTo(W * 0.88, -H * 0.24);
  ctx.lineTo(8, -H * 0.24);
  ctx.closePath();
  ctx.fill();

  // ── FRONT BUMPER / GRILLE NOSE ─────────────────────────────────────────
  const gBumper = ctx.createLinearGradient(W * 0.88, 0, W + 8, 0);
  gBumper.addColorStop(0, "#1C202A");
  gBumper.addColorStop(1, "#0A0C12");
  ctx.fillStyle = gBumper;
  ctx.beginPath();
  ctx.moveTo(W * 0.88, -H * 0.30);
  ctx.quadraticCurveTo(W * 0.96, -H * 0.30, W + 4, -H * 0.14);
  ctx.quadraticCurveTo(W + 8, -H * 0.02, W + 4, WY - 10);
  ctx.lineTo(W * 0.88, WY - 10);
  ctx.closePath();
  ctx.fill();

  // Bumper horizontal ribs
  ctx.strokeStyle = "#374151"; ctx.lineWidth = 1.2;
  for (let rib = 0; rib < 3; rib++) {
    const ry = -H * 0.24 + rib * 8;
    ctx.beginPath();
    ctx.moveTo(W * 0.89, ry);
    ctx.lineTo(W + 2, ry + 4);
    ctx.stroke();
  }

  // Steel tubular bumper guard bar
  ctx.strokeStyle = "#4B5563"; ctx.lineWidth = 4;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(W + 4, -H * 0.12);
  ctx.lineTo(W + 6, WY - 14);
  ctx.stroke();
  ctx.lineCap = "butt";

  // ══════════════════════════════════════════════════════════════════
  // OPEN PASSENGER COMPARTMENT SIDE (doorway)
  // ══════════════════════════════════════════════════════════════════
  ctx.fillStyle = "#080A0F";
  ctx.beginPath();
  ctx.roundRect(30, -H * 0.31, 108, H * 0.52, [8, 8, 0, 0]);
  ctx.fill();
  ctx.strokeStyle = "#003318"; ctx.lineWidth = 1.8; ctx.stroke();

  // Interior — rear bench seat
  const gSeat = ctx.createLinearGradient(0, -H * 0.14, 0, WY - 12);
  gSeat.addColorStop(0, "#1A5C44");
  gSeat.addColorStop(1, "#0F3A2A");
  ctx.fillStyle = gSeat;
  ctx.fillRect(34, -H * 0.15, 48, 22);

  // Seat cushion stitching lines
  ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(34 + 16, -H * 0.15); ctx.lineTo(34 + 16, -H * 0.15 + 22);
  ctx.moveTo(34 + 32, -H * 0.15); ctx.lineTo(34 + 32, -H * 0.15 + 22);
  ctx.stroke();

  // Front passenger bench
  ctx.fillStyle = gSeat;
  ctx.fillRect(90, -H * 0.15, 38, 22);

  // Backrest padding
  ctx.fillStyle = "#1A5C44";
  ctx.fillRect(34, -H * 0.26, 12, 24);

  // Chrome side passenger handrail
  ctx.strokeStyle = "#E2E8F0"; ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(132, -H * 0.30);
  ctx.lineTo(132, WY - 14);
  ctx.stroke();
  ctx.lineCap = "butt";

  // ── WHEEL ARCHES (over wheels) ─────────────────────────────────────────
  ctx.fillStyle = "#0C0E14";
  // Rear fender arch
  ctx.beginPath();
  ctx.arc(RW, WY - 4, 29, Math.PI, 0);
  ctx.fill();
  // Front fender arch
  ctx.beginPath();
  ctx.arc(FW, WY - 4, 27, Math.PI, 0);
  ctx.fill();

  // ══════════════════════════════════════════════════════════════════
  // YELLOW CANOPY ROOF HOOD
  // ══════════════════════════════════════════════════════════════════
  const gRoof = ctx.createLinearGradient(0, -H * 1.30, 0, -H * 0.32);
  gRoof.addColorStop(0, "#FFFA55");
  gRoof.addColorStop(0.3, "#FFD600");
  gRoof.addColorStop(0.75, "#E0A800");
  gRoof.addColorStop(1, "#8A6200");
  ctx.fillStyle = gRoof;

  ctx.beginPath();
  // Rear bottom of canopy
  ctx.moveTo(-6, -H * 0.32);
  // Rear canopy slope up to peak
  ctx.quadraticCurveTo(-12, -H * 0.85, 10, -H * 1.28);
  // Flat canopy ceiling
  ctx.lineTo(W * 0.73, -H * 1.28);
  // Front canopy visor overhang curves down
  ctx.quadraticCurveTo(W * 0.90, -H * 1.22, W * 0.95, -H * 0.32);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = "#7A5500"; ctx.lineWidth = 2.2;
  ctx.stroke();

  // Canopy top gloss sheen
  const gRoofSheen = ctx.createLinearGradient(0, -H * 1.28, 0, -H * 1.05);
  gRoofSheen.addColorStop(0, "rgba(255,255,255,0.40)");
  gRoofSheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gRoofSheen;
  ctx.beginPath();
  ctx.moveTo(12, -H * 1.26);
  ctx.lineTo(W * 0.72, -H * 1.26);
  ctx.quadraticCurveTo(W * 0.87, -H * 1.22, W * 0.92, -H * 1.10);
  ctx.lineTo(W * 0.80, -H * 1.06);
  ctx.lineTo(14, -H * 1.06);
  ctx.closePath();
  ctx.fill();

  // Canopy fabric seam stitch lines (vertical ribs)
  ctx.strokeStyle = "rgba(0,0,0,0.18)"; ctx.lineWidth = 1.8;
  ctx.beginPath();
  [0.22, 0.44, 0.65].forEach(t => {
    const sx = 10 + t * (W * 0.73 - 10);
    ctx.moveTo(sx, -H * 1.27);
    ctx.lineTo(sx - 4 + t * 10, -H * 0.34);
  });
  ctx.stroke();

  // ── REAR CANOPY OVAL SIDE WINDOW ───────────────────────────────────────
  ctx.fillStyle = "#10131A";
  ctx.beginPath();
  ctx.roundRect(4, -H * 1.10, 28, 22, 7);
  ctx.fill();
  ctx.strokeStyle = "#7A5500"; ctx.lineWidth = 1.8; ctx.stroke();

  // Window tint glass
  const gWin = ctx.createLinearGradient(4, -H * 1.10, 32, -H * 0.88);
  gWin.addColorStop(0, "rgba(0,240,255,0.50)");
  gWin.addColorStop(1, "rgba(0,120,180,0.12)");
  ctx.fillStyle = gWin;
  ctx.beginPath();
  ctx.roundRect(6, -H * 1.08, 24, 18, 5);
  ctx.fill();

  // Window glare streak
  ctx.strokeStyle = "rgba(255,255,255,0.45)"; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(8, -H * 1.06); ctx.lineTo(14, -H * 0.94);
  ctx.stroke();

  // ══════════════════════════════════════════════════════════════════
  // FRONT DRIVER CABIN — WINDSHIELD + FRAME
  // ══════════════════════════════════════════════════════════════════
  // Dark cabin frame
  ctx.fillStyle = "#0D0F16";
  ctx.beginPath();
  ctx.moveTo(W * 0.68, -H * 1.25);
  ctx.lineTo(W * 0.92, -H * 1.14);
  ctx.lineTo(W * 0.94, -H * 0.34);
  ctx.lineTo(W * 0.68, -H * 0.34);
  ctx.closePath();
  ctx.fill();

  // Windshield glass
  const gGlass = ctx.createLinearGradient(W * 0.70, -H * 1.22, W * 0.90, -H * 0.38);
  gGlass.addColorStop(0, "rgba(0,240,255,0.78)");
  gGlass.addColorStop(0.5, "rgba(0,200,255,0.35)");
  gGlass.addColorStop(1, "rgba(0,120,200,0.10)");
  ctx.fillStyle = gGlass;
  ctx.beginPath();
  ctx.moveTo(W * 0.695, -H * 1.22);
  ctx.lineTo(W * 0.905, -H * 1.11);
  ctx.lineTo(W * 0.92, -H * 0.37);
  ctx.lineTo(W * 0.695, -H * 0.37);
  ctx.closePath();
  ctx.fill();

  // Glass glare diagonal streak
  ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(W * 0.72, -H * 1.18); ctx.lineTo(W * 0.76, -H * 0.72);
  ctx.stroke();
  ctx.lineCap = "butt";

  // Single windshield wiper blade
  ctx.strokeStyle = "#000"; ctx.lineWidth = 2.2; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(W * 0.72, -H * 0.42);
  ctx.quadraticCurveTo(W * 0.78, -H * 0.66, W * 0.87, -H * 0.62);
  ctx.stroke();
  ctx.lineCap = "butt";

  // ── REARVIEW MIRROR ────────────────────────────────────────────────────
  ctx.fillStyle = "#0D0F16";
  ctx.beginPath();
  ctx.roundRect(W * 0.93, -H * 1.00, 10, 16, 3);
  ctx.fill();
  // Mirror arm
  ctx.strokeStyle = "#374151"; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(W * 0.93, -H * 0.92); ctx.lineTo(W * 0.89, -H * 0.92);
  ctx.stroke();
  ctx.lineCap = "butt";

  // ══════════════════════════════════════════════════════════════════
  // HEADLIGHT ASSEMBLY
  // ══════════════════════════════════════════════════════════════════
  // Chrome surround ring
  ctx.fillStyle = "#D1D5DB";
  ctx.beginPath();
  ctx.arc(W + 4, -H * 0.50, 12, 0, Math.PI * 2);
  ctx.fill();

  // Headlight lens
  ctx.fillStyle = isHornFlashing ? "#FFFFFF" : "#FFF176";
  ctx.shadowColor = "#FFD600";
  ctx.shadowBlur = isHornFlashing ? 35 : 16;
  ctx.beginPath();
  ctx.arc(W + 4, -H * 0.50, 9.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // Lens glare dot
  ctx.fillStyle = "rgba(255,255,255,0.85)";
  ctx.beginPath();
  ctx.arc(W + 1, -H * 0.54, 3, 0, Math.PI * 2);
  ctx.fill();

  // Amber turn signal (top)
  ctx.fillStyle = "#FF8C00";
  ctx.shadowColor = "#FF8C00"; ctx.shadowBlur = 8;
  ctx.beginPath();
  ctx.arc(W + 2, -H * 0.70, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;

  // ══════════════════════════════════════════════════════════════════
  // CHASSIS FLOOR RAILS & UNDERCARRIAGE DETAIL
  // ══════════════════════════════════════════════════════════════════
  ctx.fillStyle = "#0A0D13";
  ctx.fillRect(0, WY - 12, W + 4, 10);

  // Chassis rivet dots
  ctx.fillStyle = "#374151";
  for (let rx = 15; rx < W; rx += 30) {
    ctx.beginPath();
    ctx.arc(rx, WY - 7, 2, 0, Math.PI * 2);
    ctx.fill();
  }

  // ══════════════════════════════════════════════════════════════════
  // SPINNING ALLOY WHEELS
  // ══════════════════════════════════════════════════════════════════
  drawSpinningWheel(ctx, RW, WY, 23, wheelRot, true);   // Rear wheel (larger)
  drawSpinningWheel(ctx, FW, WY, 19, wheelRot, false);  // Front wheel (smaller single)

  ctx.restore();
}

// DRAW ROTATING 5-SPOKE ALLOY WHEEL WITH SILVER RIM & TREADS
function drawSpinningWheel(ctx, wx, wy, radius, rot) {
  ctx.save();
  ctx.translate(wx, wy);

  // Black Rubber Outer Tire
  ctx.fillStyle = "#0F1117";
  ctx.beginPath();
  ctx.arc(0, 0, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2A2F3D";
  ctx.lineWidth = 3.5;
  ctx.stroke();

  // Outer Tread Groove Ring
  ctx.strokeStyle = "#07080B";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
  ctx.stroke();

  // Inner Silver Alloy Rim Base
  ctx.fillStyle = "#E5E7EB";
  ctx.beginPath();
  ctx.arc(0, 0, radius * 0.58, 0, Math.PI * 2);
  ctx.fill();

  // Rotating 5-Spoke Alloy Pattern
  ctx.rotate(rot);
  ctx.strokeStyle = "#111827";
  ctx.lineWidth = 3;
  for (let i = 0; i < 5; i++) {
    const angle = (i * Math.PI * 2) / 5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo((radius * 0.58) * Math.cos(angle), (radius * 0.58) * Math.sin(angle));
    ctx.stroke();
  }

  // Center Brass Lug Nut
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

// REAL-TIME PROGRESS TRACKER & REVOLVING SONG PROGRESS RING
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
    
    // 1) Update bottom progress bar fill width
    if (fillEl) fillEl.style.width = `${pct * 100}%`;

    // 2) Update revolving progress ring stroke offset around track thumbnail
    if (ringCircle) {
      const circumference = 144.51; // 2 * PI * 23
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
