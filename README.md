# 🛺 TEMPU WALA — Hard Bhojpuri Phonk Internet Radio

> **"Buri Nazar Wale Tera Phonk Kala 🔊"**
> A single-page live internet radio microsite dedicated to hard Bhojpuri Phonk, styled around Indian highway truck & tempo culture (Horn OK Please signage, hand-painted mudflap wisdom, dhaba neon, chrome bumpers).

---

## 🎨 Concept & Design Direction

- **Culture & Aesthetic**: Inspired by highway dhabas, hand-painted rear-truck slogans, reflective hazard stripes, and high-octane street art.
- **Palette**:
  - `Asphalt Black`: `#090A0F`
  - `Hazard Yellow`: `#FFC800`
  - `Truck Red`: `#FF2A2A`
  - `Neon Cyan`: `#00F0FF`
  - `Mudflap Rubber`: `#181A22`
  - `Signal Green`: `#00FF66`
- **Typography**: Display font `Bungee` / `Black Ops One`, body font `Space Grotesk`, monospace `JetBrains Mono`.
- **Audio Embed**: Real Spotify playlist embed (`0y6yspZCEbwnNyUgNDyf0V`) with open-in-app action links.
- **Micro-Interactions**: Interactive Web Audio API pressure horn (`BLOW HORN!`), Dhaba Neon toggle, Bass Boost mode, and dynamic listener counter.

---

## 📁 Project Structure

```text
tempu-wala/
├── index.html            # Main HTML document
├── package.json          # Node project config & Vite dev server
├── README.md             # Documentation
├── .gitignore            # Git ignore rules
├── public/
│   └── favicon.svg       # SVG Favicon (🛺 Tempo icon)
└── src/
    ├── styles/
    │   └── main.css      # CSS design system & custom properties
    ├── scripts/
    │   └── main.js       # Audio synth, mode toggles & UI interactivity
    └── assets/
        └── og-image.png  # OpenGraph preview asset
```

---

## 🚀 Local Development Setup

Ensure you have [Node.js](https://nodejs.org/) installed (v18+ recommended).

1. Clone or navigate to the project directory:
   ```bash
   cd tempu-wala
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

---

## 📦 Production Build & Deployment

### Build for Production
To bundle static assets into the `dist/` directory:
```bash
npm run build
```

### Static Deploy (Vercel / Netlify)

- **Vercel**:
  ```bash
  npx vercel
  ```

- **Netlify**:
  ```bash
  npx netlify deploy --prod
  ```

---

## ⚡ Technical Highlights

- **Zero Framework Overhead**: Vanilla HTML5, CSS3, and ES6 JavaScript.
- **Web Audio API**: Synthetic dual-tone Indian pressure horn sound (`POO-POOO!`) generated live without external sound files.
- **Accessibility & Motion**: Includes keyboard focus indicators (`:focus-visible`) and respects `prefers-reduced-motion`.
