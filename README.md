# 🌌 Ambient OS

> **A futuristic, glassmorphism ambient music experience that breathes with your environment.**

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

---

## ✨ The Vibe

**Ambient OS** isn't just a music player—it's an atmospheric operating system for your focus, relaxation, and workout sessions. Built with a **Glassmorphism UI** and a **WebGL-accelerated Particle Engine**, it bridges the gap between your digital workspace and the physical world outside your window.

---

## 🚀 Core Features

| Feature | Description |
| :--- | :--- |
| **🌀 3D Coverflow Carousel** | A buttery-smooth, WebGL-powered carousel to flip through 8 distinct "Vibes" with authentic depth and perspective. |
| **🎵 Curated Telugu Soundscapes** | 8 Hand-crafted moods: **GYM, Chill/Cafe, Study/Focus, Night Drive, Sleep, Chaganti, Garikapati, Love/Romance** — powered by YouTube Data API v3. |
| **☀️ Live Environment Sync** | Uses `navigator.geolocation` + **Open-Meteo API** (no key required!) to fetch real-time Weather, Temperature, and Time of Day. |
| **🎨 Dynamic Particle Engine** | Custom **HTML5 Canvas** renderer: <br>🌧️ *Rain* (velocity-based streaks) ❄️ *Snow/Frost* (turbulent drift) ☀️ *Heat Orbs* (glowing pulse) ☁️ *Volumetric Clouds* (perlin noise). |
| **🌅 Adaptive Gradients** | Background atmosphere shifts seamlessly: **Sunrise → Day → Sunset → Night** based on calculated solar position. |
| **📱 Mobile-First Gestures** | Native-like **Swipe/Drag** support on the Carousel & Player (Pointer Events + Passive Listeners). |
| **🔊 Media Session API** | Full **Lock Screen / Notification Center / Hardware Key** control support (Play, Pause, Next, Prev, Seek, Artwork). |
| **🌐 Modern CSS Architecture** | **CSS Logical Properties** (`inline-start`, `block-size`) for true RTL/LTR readiness; Container Queries for micro-layouts. |

---

## 🎭 The 8 Vibes (Moods)

| Vibe | Icon | Intent | Audio Profile |
| :--- | :---: | :--- | :--- |
| **GYM** | 💪 | High-Intensity Training | Fast BPM, Heavy Bass, Motivation Speech Snippets |
| **CHILL / CAFE** | ☕ | Deep Work / Relaxing | Lo-Fi Beats, Acoustic Telugu Covers, Ambient Noise |
| **STUDY / FOCUS** | 🧠 | Flow State / Pomodoro | Minimalist Piano, Alpha Waves, Zero Lyrics |
| **NIGHT DRIVE** | 🌃 | Late Night Cruising | Synthwave, Retro Telugu Remixes, Atmospheric Pads |
| **SLEEP** | 😴 | Wind Down / Insomnia Relief | Delta Waves, Slow Rain SFX, Drone Textures |
| **CHAGANTI** | 🕉️ | Spiritual / Pravachanam | Chaganti Koteswara Rao Discourses, Vedic Chants |
| **GARIKAPATI** | 📜 | Literary / Intellectual | Garikapati Narasimha Rao Sahitya, Avadhanam |
| **LOVE / ROMANCE** | ❤️ | Evenings / Date Night | Melody Hits, Duets, Soulful Lyrics |

---

## 🛠️ Tech Stack

*   **Framework:** React 18 + Vite
*   **Styling:** Vanilla CSS, CSS Variables, CSS 3D Transforms
*   **3D / Graphics:** Custom CSS 3D Transforms (Coverflow) + Vanilla JS Canvas API (Particles)
*   **APIs:** YouTube Data API v3, Open-Meteo (Weather/Geocoding), Browser APIs (Geolocation, MediaSession)

---

## ⚡ Getting Started

### Prerequisites
*   Node.js `>= 18.0.0`
*   **YouTube Data API Key**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/ambient-os.git
cd ambient-os

# 2. Install dependencies
npm install

# 3. Configure Environment Variables
# Create a .env file and add your YOUTUBE_API_KEY
echo "VITE_YOUTUBE_API_KEY=your_api_key_here" > .env

# 4. Start the development server
npm run dev
```

Open `http://localhost:5173` and grant **Location Permission** when prompted for the full "Live Sync" experience.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! 

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feat/amazing-particle`)
3.  Commit your Changes (`git commit -m 'feat: add meteor shower particle type'`)
4.  Push to the Branch (`git push origin feat/amazing-particle`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the **MIT License**.

<p align="center">
  Made with ☕, 🎧, and <code>requestAnimationFrame</code>.
</p>
