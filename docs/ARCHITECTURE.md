# 🏗️ Architecture — YTMusic Player

> **Status:** Layers 1-3 implemented (Phase 1 & 2 complete). Layer 4 fallback chain implemented.
> **Last updated:** 2026-05-12

## System Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Platform                        │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────────┐ │
│  │   Next.js Frontend   │  │  Vercel Serverless Fns   │ │
│  │                      │  │                          │ │
│  │  ┌────────────────┐  │  │  ┌────────────────────┐  │ │
│  │  │  Search Page   │──┼──┼─▶│  /api/search       │  │ │
│  │  └────────────────┘  │  │  │  (ytsr)            │  │ │
│  │                      │  │  └────────────────────┘  │ │
│  │  ┌────────────────┐  │  │                          │ │
│  │  │  Audio Player  │──┼──┼─▶│  /api/stream       │  │ │
│  │  └────────────────┘  │  │  │  (ytdl-core)       │  │ │
│  │                      │  │  └────────────────────┘  │ │
│  │  ┌────────────────┐  │  │                          │ │
│  │  │  PWA Shell     │  │  │  ┌────────────────────┐  │ │
│  │  │  (Service      │  │  │  │  /api/suggestions  │  │ │
│  │  │   Worker)      │  │  │  │  (future)          │  │ │
│  │  └────────────────┘  │  │  └────────────────────┘  │ │
│  └──────────────────────┘  └──────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                         │
                         ▼
              ┌─────────────────┐
              │    YouTube      │
              │   (Video Data   │
              │    + Streams)   │
              └─────────────────┘
```

## Architecture Layers

### Layer 1: Presentation (Frontend)

| Component | Responsibility |
|-----------|---------------|
| `SearchBar` | User input, search trigger, autocomplete |
| `SearchResults` | Display search results as cards |
| `VideoCard` | Individual result card (thumbnail, title, duration) |
| `AudioPlayer` | Main player: audio element, seek bar, progress |
| `PlayerControls` | Play/pause, next, prev, repeat, shuffle buttons |
| `QueuePanel` | Manage playback queue |
| `SleepTimer` | Countdown timer to stop playback |
| `SpeedControl` | Playback speed selector |
| `MiniPlayer` | Compact floating player |
| `LanguageSwitcher` | Vietnamese / English toggle |

### Layer 2: State Management

```
PlayerContext (React Context) ← contexts/PlayerContext.js ✅
├── currentTrack        # Currently playing track info
├── audioUrl            # Extracted audio stream URL
├── queue[]             # Upcoming tracks
├── history[]           # Previously played tracks (max 50)
├── isPlaying           # Playback state
├── isLoading           # Loading/buffering state
├── duration            # Track duration in seconds
├── currentTime         # Current playback position
├── volume              # 0-1
├── playbackSpeed       # 0.5x - 2x
├── repeatMode          # none | one | all
├── isShuffle           # boolean
└── error               # Error message or null
```

**Audio Element:** Managed via `useRef` in PlayerContext (programmatic, not in DOM).

**Persistence Strategy (implemented ✅):**
- `queue`, `volume`, `playbackSpeed`, `repeatMode`, `isShuffle` → **localStorage**
- `currentTrack`, `audioUrl`, `isPlaying`, `isLoading`, `currentTime`, `error` → **React state only** (ephemeral)

### Layer 3: API Routes (Backend)

All backend logic runs as **Vercel Serverless Functions** (Node.js runtime).

| Route | Method | Input | Output | Library |
|-------|--------|-------|--------|---------|
| `/api/search` | GET | `?q=query&limit=20` | `{ results: Track[] }` | `ytsr` |
| `/api/stream` | GET | `?id=videoId` | `{ url, title, duration, thumbnail }` | `@distube/ytdl-core` |
| `/api/suggestions` | GET | `?q=partial` | `{ suggestions: string[] }` | `ytsr` (future) |

### Layer 4: External Services

| Service | Purpose | Fallback |
|---------|---------|----------|
| YouTube (via ytdl-core) | Primary audio source | Invidious API |
| Invidious API | Fallback audio source | Piped API |
| Piped API | Secondary fallback | Error message |

## Data Flow

### Search Flow
```
User types query
    → SearchBar component
    → Debounce (300ms)
    → fetch('/api/search?q=...')
    → ytsr(query)
    → YouTube returns results
    → API formats response
    → SearchResults renders cards
```

### Playback Flow
```
User clicks "Play" on a VideoCard
    → PlayerContext.playTrack(track)
    → fetch('/api/stream?id=...')
    → ytdl-core extracts audio URL
    → API returns { url, title, ... }
    → <audio> element loads URL
    → Media Session API sets metadata
    → Playback begins
    → Lock screen shows controls (mobile)
```

### Background Playback Flow
```
User locks screen / switches app
    → <audio> element continues playing (HTML5 native)
    → Media Session API maintains notification controls
    → Service Worker keeps connection alive (PWA)
    → User can play/pause/next from lock screen
```

## Key Design Patterns

### 1. Fallback Chain Pattern
Audio extraction uses a chain of providers. If one fails, the next is tried automatically.

```javascript
async function getAudioUrl(videoId) {
  try {
    return await extractWithYtdl(videoId);      // Primary
  } catch {
    try {
      return await extractWithInvidious(videoId); // Fallback 1
    } catch {
      return await extractWithPiped(videoId);     // Fallback 2
    }
  }
}
```

### 2. URL Refresh Pattern
Audio URLs from YouTube expire (~6 hours). The player automatically refreshes the URL when playback fails with a network error.

### 3. Mobile-First Responsive
All CSS is written mobile-first, then scaled up with `min-width` media queries.

```css
/* Mobile (default) */
.player { padding: 8px; }

/* Tablet */
@media (min-width: 768px) { .player { padding: 16px; } }

/* Desktop */
@media (min-width: 1024px) { .player { padding: 24px; } }
```

### 4. Progressive Enhancement
Core audio playback works without JavaScript (HTML5 `<audio>`). JS adds enhanced features like queue, sleep timer, and Media Session.

## Performance Considerations

| Area | Strategy |
|------|----------|
| **Search** | Debounce input (300ms), limit results (20 items) |
| **Audio Loading** | Extract audio-only (no video), use adaptive bitrate |
| **Images** | Next.js `<Image>` with lazy loading for thumbnails |
| **API Caching** | Cache search results (5 min), audio URLs (1 hour) |
| **Bundle Size** | Dynamic imports for non-critical components (QueuePanel, SleepTimer) |
| **Service Worker** | Cache static assets, offline app shell |

## Security Considerations

| Threat | Mitigation |
|--------|-----------|
| API abuse | Rate limiting on API routes (Vercel Edge Config) |
| XSS | React's built-in escaping, no `dangerouslySetInnerHTML` |
| SSRF | Validate videoId format before passing to ytdl-core |
| Data exposure | No sensitive data stored (localStorage only for preferences) |
