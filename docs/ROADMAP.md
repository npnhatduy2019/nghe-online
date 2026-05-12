# 🗺️ Development Roadmap — YTMusic Player

## Phase Overview

```
Phase 1 (Foundation)     ████████████████████ 100% ✅
Phase 2 (Core Player)    ████████████████████ 100% ✅
Phase 3 (Advanced)       ░░░░░░░░░░░░░░░░░░░░  0%
Phase 4 (Polish/Deploy)  ░░░░░░░░░░░░░░░░░░░░  0%
```

**Last updated:** 2026-05-12

---

## Phase 1: Foundation ✅ COMPLETED

> Goal: Working search + results UI with beautiful design

| # | Task | Est. | Status |
|---|------|------|--------|
| 1.1 | Init Next.js project with App Router | 30 min | ✅ Done |
| 1.2 | CSS Design System (colors, fonts, spacing, dark mode) | 2 hr | ✅ Done |
| 1.3 | Root layout (fonts, meta, PWA head tags) | 1 hr | ✅ Done |
| 1.4 | Header component (logo, search, language toggle) | 1 hr | ✅ Done |
| 1.5 | SearchBar component (input, debounce, submit) | 1.5 hr | ✅ Done |
| 1.6 | API route: `/api/search` (ytsr integration) | 1.5 hr | ✅ Done |
| 1.7 | SearchResults + VideoCard components | 2 hr | ✅ Done |
| 1.8 | Loading skeletons | 1 hr | ✅ Done |
| 1.9 | Responsive layout (mobile-first) | 1 hr | ✅ Done |

**Deliverable:** ✅ User can search YouTube and see results.

**Notes:**
- Next.js 16.2.6 (Turbopack) used
- `ytsr` library is deprecated but functional — may need replacement in future
- `serverExternalPackages` config required for ytsr + ytdl-core compatibility with Turbopack
- Staggered card animations implemented for search results

---

## Phase 2: Core Player ✅ COMPLETED

> Goal: Full audio playback with background support

| # | Task | Est. | Status |
|---|------|------|--------|
| 2.1 | API route: `/api/stream` (ytdl-core + fallbacks) | 2 hr | ✅ Done |
| 2.2 | PlayerContext (state management) | 2 hr | ✅ Done |
| 2.3 | useAudioPlayer hook (HTML5 audio control) | 2 hr | ✅ Done (integrated into PlayerContext) |
| 2.4 | AudioPlayer UI (now playing bar, fixed bottom) | 2 hr | ✅ Done |
| 2.5 | PlayerControls (play/pause, next, prev) | 1.5 hr | ✅ Done |
| 2.6 | ProgressBar (seekable, time display) | 1.5 hr | ✅ Done |
| 2.7 | VolumeControl | 1 hr | ✅ Done |
| 2.8 | SpeedControl (0.5x–2x) | 1 hr | ✅ Done |
| 2.9 | useMediaSession hook (background + lock screen) | 1.5 hr | ✅ Done |
| 2.10 | QueuePanel (add, remove, reorder) | 2 hr | ✅ Done |

**Deliverable:** ✅ Full audio player with background playback.

**Notes:**
- Audio extraction uses fallback chain: ytdl-core → Invidious → Piped
- Some long videos (1+ hour mixes) may fail extraction
- Queue and settings persist in localStorage
- Repeat modes: none → all → one (cycle)
- Shuffle mode implemented
- Media Session API provides lock screen controls on mobile
- Player bar slides up with animation when track is selected

---

## Phase 3: Advanced Features (Todo)

> Goal: Polish UX with timer, playlist, and shortcuts

| # | Task | Est. | Status |
|---|------|------|--------|
| 3.1 | SleepTimer (presets, countdown, fade-out) | 2 hr | ⬜ |
| 3.2 | Repeat mode (none / one / all) | 1 hr | ✅ Done (in Phase 2) |
| 3.3 | Shuffle mode | 1 hr | ✅ Done (in Phase 2) |
| 3.4 | Search history (localStorage) | 1.5 hr | ⬜ |
| 3.5 | Playlist save/load (localStorage) | 2 hr | ⬜ |
| 3.6 | MiniPlayer (compact mode when scrolling) | 1.5 hr | ⬜ |
| 3.7 | Keyboard shortcuts (Space, arrows, M, etc.) | 1.5 hr | ⬜ |
| 3.8 | Toast notifications (added to queue, etc.) | 1 hr | ⬜ |
| 3.9 | Error handling & retry logic | 1.5 hr | ⬜ |

**Deliverable:** Polished UX with all secondary features.

---

## Phase 4: Polish & Deploy (Todo)

> Goal: PWA, i18n, deploy to Vercel

| # | Task | Est. | Status |
|---|------|------|--------|
| 4.1 | PWA manifest.json | 1 hr | ✅ Done (basic) |
| 4.2 | Service Worker (cache app shell) | 2 hr | ⬜ |
| 4.3 | i18n setup (vi.json + en.json) | 2 hr | ⬜ |
| 4.4 | Language switcher component | 1 hr | ⬜ |
| 4.5 | Performance optimization | 1.5 hr | ⬜ |
| 4.6 | Vercel deployment + config | 1 hr | ⬜ |
| 4.7 | Mobile testing (Android + iOS) | 1 hr | ⬜ |
| 4.8 | Final bug fixes | 1 hr | ⬜ |

**Deliverable:** Production-ready PWA deployed on Vercel.

---

## Future Phases (Post-MVP)

| Feature | Priority | Notes |
|---------|----------|-------|
| User authentication | Medium | Login to sync playlists across devices |
| Cloud playlist sync | Medium | Save playlists to database |
| Lyrics display | Low | Fetch lyrics from external API |
| Equalizer | Low | Web Audio API frequency bands |
| Social sharing | Low | Share playlists with friends |
| Offline caching | Medium | Cache audio for offline playback |
| Recommendations | Low | "Related" videos suggestion |

---

## Definition of Done

A task is "Done" when:
- [x] Code is written and working
- [x] Responsive on mobile and desktop
- [ ] Error states handled (partial — basic error UI done)
- [x] Loading states implemented
- [ ] Accessible (proper ARIA labels) (partial)
- [ ] No console errors/warnings (partial — ytsr deprecation warnings)
