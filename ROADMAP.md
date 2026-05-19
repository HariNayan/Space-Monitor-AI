# Roadmap

## Vision

Space Monitor's long-term goal is to become the most scientifically accurate, open, and interactive space education platform — where real mission data meets conversational AI, all in a single browser tab.

## Current State (v3.0)

3D solar system with Kepler orbital engine, 14 live NASA/NOAA/JPL data panels (8 real APIs + 6 computed), conversational AI co-pilot with tool-use and streaming SSE, 9-lesson adaptive curriculum, and 69 passing tests.

---

## Milestone 1 — Scientific Integrity (Priority: High)

- [x] Replace dead InSight API with Curiosity REMS (archived InSight fallback)
- [ ] Switch from static mean longitude tables to live JPL Horizons ephemeris with 24h cache
- [ ] Add real physical context to AI explanations: Io's tidal heating, Titan's methane lakes, Uranus axial tilt cause
- [ ] Validate orbital element accuracy against published JPL data for all 8 planets
- [ ] Add data source labels on every panel so users know what's live vs computed vs cached

## Milestone 2 — AI Architecture (Priority: High)

- [x] Replace `TOOL_CALL:` string parsing with proper structured function calling via NVIDIA API schema
- [ ] Pin the primary model and use fallback only on hard failure; add exponential backoff for rate limits
- [ ] Add localStorage persistence for curriculum progress via Zustand persist middleware
- [ ] Expand explain agent response length — 120 words is too shallow for real learning
- [ ] Add source citations in AI explanations ("According to NASA JPL...")

## Milestone 3 — Developer Experience (Priority: Medium)

- [x] GitHub Actions CI: run 69 tests automatically on every PR (Node 20 + Python 3.11 jobs)
- [x] CONTRIBUTING.md with local setup, code style guide, and PR checklist
- [ ] Add `docker-compose.yml` as optional convenience (not required)
- [ ] Add good-first-issue GitHub labels with tagged issues ready for contributors
- [ ] Add pre-commit hooks for linting (eslint + ruff)

## Milestone 4 — Educational Depth (Priority: Medium)

- [ ] Expand curriculum from 9 to 27 lessons (3 levels × 9 lessons each)
- [ ] Add a "Mission Mode": guided tours like "Follow Voyager's journey" or "Trace Apollo 11"
- [ ] Add comparison mode: select two planets/moons and get a side-by-side data panel
- [ ] Add a timeline scrubber — see where planets were on any date (past or future) using the Kepler solver

## Milestone 5 — Real-time & Performance (Priority: Low)

- [ ] Replace SSE streaming with WebSocket for bidirectional AI communication
- [ ] Add service worker for offline mode — cached orbital math works without internet
- [ ] Mobile responsive layout for the dashboard grid
- [ ] Add WebGL performance profiling and adaptive quality settings for low-end devices

## How to Contribute

See [CONTRIBUTING.md](./CONTRIBUTING.md). All skill levels welcome. Good entry points: writing tests, fixing broken panel APIs, adding lessons to the curriculum JSON.

## What's NOT on the Roadmap

- **User accounts/auth** — adds complexity, against the open/no-login philosophy
- **Mobile app** — PWA is sufficient
- **Paid features** — this stays free and open
