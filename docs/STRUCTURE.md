# 📁 Project Structure — YTMusic Player

> **Last updated:** 2026-05-12 (after Phase 2 completion)

## Directory Tree (Current)

```
nghe-online/
│
├── 📄 next.config.mjs          # Next.js config (serverExternalPackages, images)
├── 📄 package.json             # Dependencies and scripts
├── 📄 vercel.json              # Vercel deployment config (maxDuration: 30)
├── 📄 jsconfig.json            # Path aliases (@/ = ./)
├── 📄 eslint.config.mjs        # ESLint configuration
├── 📄 .gitignore               # Git ignore rules
├── 📄 README.md                # Project overview
│
├── 📂 docs/                    # 📖 Project documentation
│   ├── CONTEXT.md              # Project context and decisions
│   ├── ARCHITECTURE.md         # System architecture
│   ├── STRUCTURE.md            # This file — project structure
│   ├── API.md                  # API documentation
│   ├── FEATURES.md             # Feature specifications
│   ├── SETUP.md                # Development setup guide
│   ├── DEPLOYMENT.md           # Deployment instructions
│   ├── ROADMAP.md              # Development roadmap (with status)
│   └── CONVENTIONS.md          # Code conventions and patterns
│
├── 📂 public/                  # Static assets (served as-is)
│   ├── manifest.json           # PWA manifest ✅
│   ├── favicon.ico             # Favicon ✅
│   └── (icons/ — todo)         # PWA icons (not yet created)
│
├── 📂 app/                     # Next.js App Router
│   ├── layout.js               # Root layout + PlayerProvider ✅
│   ├── page.js                 # Home page (search + results + player) ✅
│   ├── globals.css             # Global styles + CSS design system ✅
│   ├── loading.js              # Loading skeleton ✅
│   ├── error.js                # Error boundary ✅
│   ├── not-found.js            # 404 page ✅
│   │
│   └── 📂 api/                 # API Routes (Serverless Functions)
│       ├── 📂 search/
│       │   └── route.js        # GET /api/search — YouTube search ✅
│       └── 📂 stream/
│           └── route.js        # GET /api/stream — Audio URL extraction ✅
│
├── 📂 components/              # React Components
│   ├── 📂 layout/
│   │   └── Header.js           # App header with logo + queue toggle ✅
│   │
│   ├── 📂 search/              # Search-related components
│   │   ├── SearchBar.js        # Search input with clear + submit ✅
│   │   ├── SearchResults.js    # Results grid with loading/error/empty states ✅
│   │   └── VideoCard.js        # Individual result card ✅
│   │
│   ├── 📂 player/              # Audio player components
│   │   ├── AudioPlayer.js      # Main player container (fixed bottom) ✅
│   │   ├── PlayerControls.js   # Play/pause, next, prev, repeat, shuffle ✅
│   │   ├── ProgressBar.js      # Seekable bar with time display ✅
│   │   ├── VolumeControl.js    # Volume slider + mute ✅
│   │   ├── SpeedControl.js     # Playback speed dropdown ✅
│   │   └── NowPlaying.js       # Current track info display ✅
│   │
│   └── 📂 queue/               # Queue components
│       └── QueuePanel.js       # Slide-out queue panel ✅
│
├── 📂 contexts/                # React Context providers
│   └── PlayerContext.js        # Audio player state + audio element management ✅
│
├── 📂 hooks/                   # Custom React hooks
│   └── useMediaSession.js      # Media Session API (lock screen controls) ✅
│
└── 📂 utils/                   # Pure utility functions
    ├── formatTime.js           # Format seconds → "3:45" ✅
    ├── storage.js              # localStorage read/write with SSR safety ✅
    └── constants.js            # Storage keys, speeds, repeat modes ✅
```

## Not Yet Created (Planned)

```
├── 📂 components/
│   ├── 📂 layout/
│   │   ├── Footer.js           # Footer (Phase 4)
│   │   └── MobileNav.js        # Bottom navigation (Phase 3)
│   │
│   ├── 📂 search/
│   │   └── SearchHistory.js    # Recent searches dropdown (Phase 3)
│   │
│   ├── 📂 player/
│   │   └── MiniPlayer.js       # Compact floating player (Phase 3)
│   │
│   ├── 📂 queue/
│   │   └── PlaylistManager.js  # Save/load playlists (Phase 3)
│   │
│   ├── 📂 timer/
│   │   └── SleepTimer.js       # Sleep timer (Phase 3)
│   │
│   └── 📂 ui/                  # Shared UI primitives (Phase 3-4)
│       ├── Button.js
│       ├── Modal.js
│       ├── Toast.js
│       └── Tooltip.js
│
├── 📂 contexts/
│   ├── LanguageContext.js      # i18n language state (Phase 4)
│   └── ThemeContext.js         # Theme dark/light (Phase 4)
│
├── 📂 hooks/
│   ├── useSleepTimer.js        # Timer countdown logic (Phase 3)
│   ├── useLocalStorage.js      # Generic hook (Phase 3)
│   ├── useDebounce.js          # Debounce hook (Phase 3)
│   └── useKeyboardShortcuts.js # Keyboard bindings (Phase 3)
│
├── 📂 lib/                     # Server-side utilities (Phase 3-4)
│   ├── youtube.js              # Wrappers (currently inline in API routes)
│   ├── fallback.js             # Fallback chain (currently inline)
│   └── cache.js                # Cache module (currently inline)
│
└── 📂 i18n/                    # Internationalization (Phase 4)
    ├── index.js
    ├── vi.json
    └── en.json
```

## File Responsibility Guide

### App Router Files

| File | Purpose | Status |
|------|---------|--------|
| `app/layout.js` | Root HTML, fonts, PlayerProvider wrapping, PWA meta | ✅ |
| `app/page.js` | Main page: SearchBar + SearchResults + AudioPlayer + QueuePanel | ✅ |
| `app/globals.css` | CSS design system + all component styles (~1440 lines) | ✅ |
| `app/loading.js` | Suspense fallback with spinner | ✅ |
| `app/error.js` | Error boundary with retry button | ✅ |
| `app/not-found.js` | 404 page | ✅ |

### API Routes

| Route | File | Purpose | Status |
|-------|------|---------|--------|
| `GET /api/search` | `app/api/search/route.js` | `?q=query&limit=20` → search results | ✅ |
| `GET /api/stream` | `app/api/stream/route.js` | `?id=videoId` → audio stream URL | ✅ |

### Component Architecture

| Component | Props | Context Used |
|-----------|-------|-------------|
| `Header` | `onQueueToggle` | `usePlayer()` for queue count |
| `SearchBar` | `onSearch, initialQuery` | None |
| `SearchResults` | `results, isLoading, error, query, onPlay, onAddToQueue, onRetry` | None |
| `VideoCard` | `track, onPlay, onAddToQueue` | None |
| `AudioPlayer` | None | `usePlayer()` for currentTrack |
| `NowPlaying` | None | `usePlayer()` for currentTrack, isLoading |
| `PlayerControls` | None | `usePlayer()` for all controls |
| `ProgressBar` | None | `usePlayer()` for time, seek |
| `VolumeControl` | None | `usePlayer()` for volume |
| `SpeedControl` | None | `usePlayer()` for speed |
| `QueuePanel` | `isOpen, onClose` | `usePlayer()` for queue |

### Import Aliases

Configured in `jsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": { "@/*": ["./*"] }
  }
}
```
