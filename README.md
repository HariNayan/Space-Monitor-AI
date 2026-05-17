<p align="center">
  <h1 align="center">🛰️ SPACE MONITOR v3.0</h1>
  <p align="center">
    <strong>Agentic AI-Powered Interactive Space Simulator & Mission Control Dashboard</strong>
  </p>
  <p align="center">
    A real-time space intelligence dashboard featuring a 3D solar system simulation, AI-powered chat assistant, live NASA telemetry feeds, and 15+ mission monitoring panels — all in a retro-futuristic command center aesthetic.
  </p>
  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#architecture">Architecture</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#api-reference">API Reference</a> •
    <a href="#project-structure">Project Structure</a>
  </p>
</p>

---

## 🌌 Overview

**Space Monitor** is a full-stack, real-time space situational awareness dashboard that combines:

- **3D Solar System Visualization** — Interactive Three.js scene with textured planets, real NASA orbital data from JPL Horizons, and smooth camera controls
- **Agentic AI Chat** — Conversational AI assistant powered by OpenRouter (Gemma, Qwen, LLaMA) with streaming responses, intent classification, and quiz generation
- **Live Mission Telemetry** — 15+ data panels pulling from NASA APIs, ISS tracker, SpaceX launches, JWST, Voyager, and more
- **Military-Grade UI** — Dense, information-rich layout inspired by real mission control interfaces with monospace typography and dark-theme aesthetics

---

## ✨ Features

### 🪐 3D Solar System Engine
- **Vanilla Three.js** renderer (no R3F dependency at runtime) for maximum performance
- **8 textured planets** with accurate relative sizing, self-rotation, cloud layers (Earth), and Saturn ring system
- **NASA JPL Horizons integration** — real orbital positions fetched via server-side API proxy
- **Interactive controls** — orbit, zoom, click-to-select planets with smooth camera interpolation
- **Procedural starfield** — 12,800+ stars with Milky Way band simulation
- **Sun with dynamic glow** — pulsating point light, multi-layer glow effect, emissive texture mapping
- **Planet selection** — emissive pulse highlighting, floating name labels, camera fly-in on AI navigation

### 🤖 Agentic AI System
- **Intent Classification** — Orchestrator agent classifies user messages into `navigate`, `explain`, or `quiz` intents
- **Streaming Responses** — Server-Sent Events (SSE) for real-time token-by-token AI responses
- **Multi-Model Fallback** — Automatically cycles through 5 free models if rate-limited (Gemma → Qwen → LLaMA → Phi → Mistral)
- **Conversation Memory** — Per-session history (10-turn sliding window) for contextual responses
- **Quiz Generation** — AI-generated multiple-choice questions about celestial bodies with explanations
- **Planet Navigation** — Natural language commands like "Take me to Mars" trigger camera fly-in + info panel
- **Adaptive Difficulty** — Beginner vs. Advanced response modes with different system prompts

### 📡 Live Data Panels (15+)

| Panel | Data Source | Update Interval |
|-------|-----------|-----------------|
| **NASA Live Feed** | YouTube NASA TV embed | Real-time |
| **ISS Tracker** | Open Notify API (proxied) | 10 seconds |
| **Space News** | Spaceflight News API v4 | 5 minutes |
| **NEO Asteroids** | NASA NeoWs API | 10 minutes |
| **Upcoming Launches** | The Space Devs LL2 API | 10 minutes |
| **Solar Flares** | NASA DONKI API | On load |
| **Mars Perseverance** | NASA Mars Photos API | On load |
| **Deep Space Network** | Simulated DSN telemetry | 200ms tick |
| **JWST Telemetry** | Simulated instrument temps | 1s tick |
| **Exoplanets** | Curated catalog (rotating) | 4s cycle |
| **Artemis Ops** | Simulated mission phases | 100ms tick |
| **Voyager 1 & 2** | Live distance counter | 1s tick |
| **Pulsar Timing** | Animated X-ray scanner | CSS animation |
| **Planet Info Panel** | Curated encyclopedia (9 bodies) | On selection |
| **News Ticker** | Spaceflight News API headlines | 30s scroll |

### 🎨 UI/UX Design
- **Ultra-dense 6-column grid layout** — maximum information density
- **Monospace typography** — Courier New throughout for command-center authenticity
- **Color palette** — Dark navy `#060810` base, gold accents `#e8d5a3`, green status `#4a8c6f`, blue data `#6a9fd8`
- **Zero-radius design** — No border-radius anywhere for sharp, utilitarian feel
- **Custom scrollbars** — Themed thin scrollbars matching the dark UI
- **Responsive scrolling** — Full-page vertical scroll with fixed hero viewport

---

## 🏗️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Next.js** | 16.2.3 | React framework with App Router, API routes, SSR |
| **React** | 19.2.5 | UI component library |
| **Three.js** | 0.183.2 | 3D WebGL rendering engine |
| **Zustand** | 5.0.0 | Lightweight state management (atomic selectors) |
| **TypeScript** | 5.4.5 | Type safety |
| **Tailwind CSS** | 4.2.2 | Utility CSS (minimal usage — mostly inline styles) |

### Backend
| Technology | Purpose |
|-----------|---------|
| **FastAPI** | Async Python web framework |
| **Uvicorn** | ASGI server with hot reload |
| **httpx** | Async HTTP client for OpenRouter & NASA APIs |
| **Pydantic** | Request/response validation |
| **python-dotenv** | Environment variable management |

### External APIs
| API | Usage |
|-----|-------|
| **OpenRouter** | LLM inference (Gemma, Qwen, LLaMA, Phi, Mistral) |
| **NASA JPL Horizons** | Real planetary orbital positions |
| **NASA NeoWs** | Near-Earth Object tracking |
| **NASA DONKI** | Solar flare events |
| **NASA Mars Photos** | Perseverance rover latest images |
| **Open Notify** | ISS real-time position |
| **Spaceflight News API** | Space news articles |
| **The Space Devs** | Upcoming rocket launches |

---

## 🏛️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     BROWSER (Port 3000)                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │  3D Scene     │  │  AI Chat     │  │  Data Panels     │  │
│  │  (Three.js)   │  │  (SSE Stream)│  │  (REST + Fetch)  │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘  │
│         │                 │                    │            │
│  ┌──────┴─────────────────┴────────────────────┴─────────┐  │
│  │              Zustand Store (spaceStore.ts)             │  │
│  │  • chatHistory    • currentCameraTarget                │  │
│  │  • isAiProcessing • showInfoPanel • lastCameraAction   │  │
│  └───────────────────────────┬───────────────────────────┘  │
│                              │                              │
│  ┌───────────────────────────┴───────────────────────────┐  │
│  │           Next.js API Routes (Server-Side)            │  │
│  │  /api/iss          → Proxy to Open Notify             │  │
│  │  /api/nasa-horizons → Proxy to JPL Horizons           │  │
│  └───────────────────────────────────────────────────────┘  │
└──────────────────────────────┬──────────────────────────────┘
                               │
                    ┌──────────┴──────────┐
                    │ FastAPI (Port 8000) │
                    │                     │
                    │  POST /api/chat     │
                    │  ┌───────────────┐  │
                    │  │ Orchestrator  │  │
                    │  │    Agent      │  │
                    │  └───┬───┬───┬───┘  │
                    │      │   │   │      │
                    │   nav quiz explain  │
                    │      │   │   │      │
                    │  ┌───┴───┴───┴───┐  │
                    │  │  OpenRouter   │  │
                    │  │  (5 models)   │  │
                    │  └───────────────┘  │
                    │                     │
                    │  ConversationMemory │
                    │  (10-turn window)   │
                    └─────────────────────┘
```

### State Management Strategy

The app uses **atomic Zustand selectors** to prevent the WebGL 3D scene from re-rendering when unrelated state changes (like chat messages):

```typescript
// Each component subscribes to ONLY the slice it needs
const target = useSpaceStore((state) => state.currentCameraTarget);  // SceneContent
const chat = useSpaceStore((state) => state.chatHistory);            // ChatPanel
const show = useSpaceStore((state) => state.showInfoPanel);          // PlanetInfoOverlay
```

The `SceneContent` component uses **vanilla Three.js** (not React Three Fiber) to completely decouple the 3D engine from React's reconciliation cycle. Planet positions, camera movement, and animations are all driven by `requestAnimationFrame` with mutable refs.

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **Python** ≥ 3.9
- **npm** ≥ 9.x
- **OpenRouter API Key** — [Get one free at openrouter.ai](https://openrouter.ai)
- **NASA API Key** *(optional)* — [Get one at api.nasa.gov](https://api.nasa.gov) (falls back to `DEMO_KEY`)

### 1. Clone the Repository

```bash
git clone https://github.com/HariNayan/Agentic-Ai-and-NLP-Driven-Space-Simulator.git
cd Agentic-Ai-and-NLP-Driven-Space-Simulator
```

### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Activate (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
OPENROUTER_API_KEY=sk-or-v1-your-key-here
MODEL=minimax/minimax-m2.5:free
```

Start the backend server:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install
```

Create a `.env.local` file in the `frontend/` directory:

```env
NEXT_PUBLIC_NASA_API_KEY=your-nasa-api-key-here
```

Start the development server:

```bash
npm run dev
```

Or build and run production:

```bash
npm run build
npm run start
```

### 4. Open the Dashboard

Navigate to **http://localhost:3000** in your browser.

---

## 📡 API Reference

### Backend Endpoints (`localhost:8000`)

#### `POST /api/chat`
Process user chat messages with intent classification.

**Request Body:**
```json
{
  "message": "Take me to Jupiter",
  "selected_planet": "Earth",
  "user_level": "beginner",
  "session_id": "session_123",
  "history": []
}
```

**Response (Navigate):**
```json
{
  "intent": "navigate",
  "target": "Jupiter",
  "message": "Navigating to Jupiter!"
}
```

**Response (Quiz):**
```json
{
  "intent": "quiz",
  "quiz": {
    "question": "What is Jupiter's Great Red Spot?",
    "options": ["A volcano", "A storm", "A crater", "A moon"],
    "correct": "A storm",
    "explanation": "The Great Red Spot is a massive storm..."
  }
}
```

**Response (Explain):** Returns `text/event-stream` with SSE tokens:
```
data: {"token": "Jupiter "}
data: {"token": "is "}
data: {"token": "the "}
data: {"token": "largest..."}
```

#### `POST /api/session/clear`
Clear conversation memory for a session.

#### `GET /api/test`
Test AI connectivity across all fallback models.

#### `GET /`
Health check endpoint.

### Frontend API Routes (`localhost:3000`)

#### `GET /api/iss`
Proxies ISS position data from Open Notify API to avoid CORS issues.

#### `GET /api/nasa-horizons?nasaId=399&dateStr=2026-05-17&timeStr=07:00`
Proxies NASA JPL Horizons API for real planetary orbital positions. Returns parsed X/Y heliocentric coordinates.

---

## 📁 Project Structure

```
Space/
├── README.md
├── SETUP.md
│
├── backend/                          # FastAPI Python backend
│   ├── .env                          # API keys (OPENROUTER_API_KEY, MODEL)
│   ├── main.py                       # FastAPI app, routes, CORS, streaming
│   ├── agents.py                     # AI agent system (orchestrator, quiz, explainer)
│   ├── schemas.py                    # Pydantic models (CameraAction, SimulatorResponse)
│   ├── requirements.txt              # Python dependencies
│   └── venv/                         # Python virtual environment
│
├── frontend/                         # Next.js 16 frontend
│   ├── .env.local                    # NASA API key
│   ├── next.config.js                # Next.js configuration
│   ├── package.json                  # Node.js dependencies & scripts
│   ├── tsconfig.json                 # TypeScript configuration
│   ├── tailwind.config.cjs           # Tailwind CSS config
│   ├── postcss.config.cjs            # PostCSS config
│   │
│   ├── public/
│   │   └── textures/                 # Planet texture images (JPG/PNG)
│   │       ├── sun.jpg
│   │       ├── mercury.jpg
│   │       ├── venus.jpg
│   │       ├── earth.jpg
│   │       ├── earth_clouds.jpg
│   │       ├── mars.jpg
│   │       ├── jupiter.jpg
│   │       ├── saturn.jpg
│   │       ├── saturn_ring.png
│   │       ├── uranus.jpg
│   │       └── neptune.jpg
│   │
│   └── src/
│       ├── app/
│       │   ├── layout.tsx            # Root HTML layout
│       │   ├── page.tsx              # Main dashboard page (Home component)
│       │   ├── globals.css           # Global styles, CSS variables, animations
│       │   └── api/
│       │       ├── iss/route.ts      # ISS position proxy
│       │       └── nasa-horizons/route.ts  # JPL Horizons proxy
│       │
│       ├── components/
│       │   ├── SceneContent.tsx      # 3D solar system (vanilla Three.js)
│       │   ├── SolarSystem.tsx       # 2D SVG solar system (legacy/fallback)
│       │   ├── ISSTracker.tsx        # ISS position display
│       │   ├── NewsPanel.tsx         # Space news feed
│       │   ├── AsteroidPanel.tsx     # Near-Earth Object tracker
│       │   ├── LaunchPanel.tsx       # Upcoming launches
│       │   │
│       │   ├── UI/
│       │   │   ├── ChatPanel.tsx     # AI chat interface with streaming
│       │   │   ├── PlanetInfoPanel.tsx # Planet encyclopedia sidebar
│       │   │   ├── LiveDataPanel.tsx  # Live telemetry data display
│       │   │   ├── StatusBar.tsx      # Top status bar
│       │   │   └── VoiceButton.tsx    # Speech-to-text input
│       │   │
│       │   └── panels/
│       │       ├── SolarFlaresPanel.tsx    # NASA DONKI solar flare data
│       │       ├── MarsRoverPanel.tsx      # Perseverance latest photo
│       │       ├── DeepSpaceNetworkPanel.tsx # Simulated DSN telemetry
│       │       ├── JWSTPanel.tsx           # James Webb telescope data
│       │       ├── ExoplanetPanel.tsx      # Exoplanet catalog carousel
│       │       ├── ArtemisPanel.tsx        # Artemis mission tracker
│       │       ├── VoyagerPanel.tsx        # Voyager 1 & 2 distance counter
│       │       └── PulsarPanel.tsx         # Pulsar timing animation
│       │
│       ├── store/
│       │   └── spaceStore.ts         # Zustand global state
│       │
│       └── utils/
│           └── orbitalScale.ts       # Orbital distance scaling utilities
```

---

## 🧠 AI Agent Architecture

The backend implements a **multi-agent system** with specialized roles:

### 1. Orchestrator Agent
Classifies user intent into one of three categories using a lightweight LLM call:
- **`navigate`** — User wants to travel to a celestial body → returns JSON with target
- **`explain`** — User asks a question → triggers streaming explanation
- **`quiz`** — User wants a quiz → generates MCQ via quiz agent

### 2. Explainer Agent (Streaming)
Generates educational responses with two difficulty modes:
- **Beginner** — Simple language, fun analogies, ≤120 words
- **Advanced** — Technical terminology, real measurements, ≤150 words

### 3. Quiz Agent
Generates multiple-choice questions with 4 options, correct answer, and explanation.

### 4. Navigation Fallback
Rule-based fallback when LLM is rate-limited — parses celestial body names and action keywords from the message directly.

### Model Fallback Chain
```
minimax/minimax-m2.5:free
  → google/gemma-2-9b-it:free
    → qwen/qwen-2.5-72b-instruct:free
      → meta-llama/llama-3.1-8b-instruct:free
        → microsoft/phi-3-mini-128k-instruct:free
          → mistralai/mistral-7b-instruct:free
```

---

## ⚡ Performance Optimizations

| Optimization | Impact |
|-------------|--------|
| **Vanilla Three.js** (not R3F) | 3D scene fully decoupled from React reconciliation |
| **Atomic Zustand selectors** | Components only re-render when their specific slice changes |
| **`React.memo` on all components** | Prevents cascading re-renders from parent |
| **Dynamic import with `ssr: false`** | Three.js bundle loaded client-side only |
| **Mutable refs for animation state** | Camera, planet positions, angles stored in refs, not state |
| **`requestAnimationFrame` loop** | Animation independent of React render cycle |
| **Pixel ratio capped at 2** | Prevents excessive GPU load on HiDPI displays |
| **Texture loading with fallback** | Graceful degradation to solid colors if textures fail |
| **Server-side API proxies** | NASA Horizons & ISS calls avoid CORS and reduce client requests |

---

## 🎨 Design System

### Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--bg` | `#060810` | Page background |
| `--panel` | `#0a0c14` | Panel backgrounds |
| `--border` | `#161a26` | Primary borders |
| `--border2` | `#1e2335` | Secondary borders |
| `--text` | `#c8ccd8` | Body text |
| `--muted` | `#4a5070` | Muted/secondary text |
| `--accent` | `#e8d5a3` | Gold accent (headers, highlights) |
| `--blue` | `#6a9fd8` | Data values, links |
| `--green` | `#4a8c6f` | Status: online/active |
| `--red` | `#c0473a` | Status: hazardous/error |

### Typography
- **Primary:** `'Courier New', monospace` — all text
- **Sizes:** 7px (labels) → 10px (body) → 16px (planet names)
- **Letter spacing:** 0.05em–0.14em for uppercase labels

---

## 🔧 Environment Variables

### Backend (`.env`)
| Variable | Required | Description |
|----------|----------|-------------|
| `OPENROUTER_API_KEY` | ✅ | OpenRouter API key for LLM inference |
| `MODEL` | ❌ | Primary model (default: `google/gemma-2-9b-it:free`) |

### Frontend (`.env.local`)
| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_NASA_API_KEY` | ❌ | NASA API key (falls back to `DEMO_KEY`) |

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- **[NASA JPL Horizons](https://ssd.jpl.nasa.gov/horizons/)** — Real planetary ephemeris data
- **[NASA Open APIs](https://api.nasa.gov/)** — NeoWs, DONKI, Mars Photos
- **[Open Notify](http://open-notify.org/)** — ISS position tracking
- **[Spaceflight News API](https://api.spaceflightnewsapi.net/)** — Space news aggregation
- **[The Space Devs](https://thespacedevs.com/)** — Launch schedule data
- **[OpenRouter](https://openrouter.ai/)** — Multi-model LLM inference
- **[Three.js](https://threejs.org/)** — WebGL 3D rendering engine
- **[Solar System Scope](https://www.solarsystemscope.com/textures/)** — Planet textures

---

<p align="center">
  <strong>Built by Harinayan ❤️ for space exploration</strong>
</p>
