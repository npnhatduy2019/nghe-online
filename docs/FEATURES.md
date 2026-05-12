# ✨ Feature Specifications — YTMusic Player

## Feature Matrix

| # | Feature | Priority | Phase | Status |
|---|---------|----------|-------|--------|
| F1 | YouTube Search | 🔴 Critical | 1 | ✅ Done |
| F2 | Audio Playback | 🔴 Critical | 2 | ✅ Done |
| F3 | Player Controls (play/pause/next/prev) | 🔴 Critical | 2 | ✅ Done |
| F4 | Background Playback | 🔴 Critical | 2 | ✅ Done |
| F5 | Queue Management | 🟡 Important | 2 | ✅ Done |
| F6 | Playback Speed | 🟡 Important | 2 | ✅ Done |
| F7 | Sleep Timer | 🟡 Important | 3 | ⬜ Todo |
| F8 | Seek Bar / Progress | 🔴 Critical | 2 | ✅ Done |
| F9 | Volume Control | 🟡 Important | 2 | ✅ Done |
| F10 | Repeat / Shuffle | 🟢 Nice-to-have | 2 | ✅ Done |
| F11 | Search History | 🟢 Nice-to-have | 3 | ⬜ Todo |
| F12 | Playlist Save/Load | 🟢 Nice-to-have | 3 | ⬜ Todo |
| F13 | Mini Player | 🟢 Nice-to-have | 3 | ⬜ Todo |
| F14 | Keyboard Shortcuts | 🟢 Nice-to-have | 3 | ⬜ Todo |
| F15 | PWA / Installable | 🔴 Critical | 4 | 🟡 Partial |
| F16 | i18n (VI + EN) | 🟡 Important | 4 | ⬜ Todo |
| F17 | Dark/Light Theme | 🟢 Nice-to-have | 4 | 🟡 Dark only |
| F18 | Authentication | 🟢 Future | — | ⬜ Future |

---

## F1: YouTube Search ✅

**User Story:** As a user, I want to search for YouTube videos so that I can find content to listen to.

**Implementation:** `app/api/search/route.js` + `components/search/`

**Acceptance Criteria:**
- [x] Search bar visible at top of page
- [x] Results appear after submitting search
- [x] Each result shows: thumbnail, title, channel name, duration
- [x] Click result → starts playback
- [x] Shows loading skeleton while fetching
- [x] Handles empty results gracefully
- [x] Displays error message if search fails
- [x] "Add to queue" button on each result

**Technical Details:**
- Uses `ytsr` library (no API key needed)
- Server-side in-memory cache (5 min TTL)
- Results limited to video type only (filters out channels, playlists)
- Responsive grid: 1 col mobile → 2 cols tablet → 3 cols desktop

## F2: Audio Playback ✅

**User Story:** As a user, I want to play audio from YouTube videos without watching the video.

**Implementation:** `app/api/stream/route.js` + `contexts/PlayerContext.js`

**Acceptance Criteria:**
- [x] Audio extracted as audio-only stream (no video data)
- [x] Plays using HTML5 `<audio>` element (created programmatically)
- [ ] Automatically refreshes audio URL if expired (todo)
- [x] Falls back to alternative providers if primary fails
- [x] Shows loading state while extracting audio URL

**Technical Details:**
- Fallback chain: `@distube/ytdl-core` → Invidious API → Piped API
- Audio URLs cached server-side (1 hour TTL)
- Audio element managed in PlayerContext (not in DOM)
- Autoplay attempted after URL load

## F3: Player Controls ✅

**User Story:** As a user, I want basic playback controls.

**Implementation:** `components/player/PlayerControls.js`

**Controls:**
- [x] **Play/Pause** button (gradient purple, prominent)
- [x] **Next** — plays next track in queue
- [x] **Previous** — restarts if > 3s in, otherwise goes to previous
- [x] All controls accessible via touch on mobile
- [x] **Repeat** — cycles through none → all → one
- [x] **Shuffle** — toggles shuffle mode

## F4: Background Playback ✅

**User Story:** As a user, I want audio to keep playing when I lock my phone or switch apps.

**Implementation:** `hooks/useMediaSession.js`

**Acceptance Criteria:**
- [x] Audio continues when screen is off (mobile) — via HTML5 Audio
- [x] Audio continues when browser tab is in background
- [x] Lock screen shows: track title, artist, thumbnail
- [x] Lock screen controls: play/pause, next, previous
- [x] Bluetooth headphone buttons work (play/pause, next)
- [x] Implemented via Media Session API

## F5: Queue Management ✅

**User Story:** As a user, I want to add multiple songs to a queue and manage them.

**Implementation:** `components/queue/QueuePanel.js` + `contexts/PlayerContext.js`

**Acceptance Criteria:**
- [x] "Add to queue" button on search results
- [x] "Play next" option (via playNext action)
- [x] Queue panel shows all upcoming tracks
- [ ] Drag-to-reorder tracks in queue (API ready, UI todo)
- [x] Remove individual tracks from queue
- [x] Clear entire queue
- [x] Queue persists in localStorage
- [x] Queue badge count in header

## F6: Playback Speed ✅

**Implementation:** `components/player/SpeedControl.js`

**Options:** 0.5x, 0.75x, 1.0x (default), 1.25x, 1.5x, 2.0x
- [x] Dropdown selector
- [x] Speed persists in localStorage

## F7: Sleep Timer — ⬜ Todo (Phase 3)

**Presets:** 15 min, 30 min, 45 min, 60 min, 90 min, Custom
- [ ] Countdown display visible
- [ ] Fade-out audio in last 30 seconds
- [ ] Cancel timer option

## F8: Seek Bar / Progress ✅

**Implementation:** `components/player/ProgressBar.js`

- [x] Visual progress bar with gradient fill
- [x] Click to seek
- [x] Drag to seek (mouse)
- [x] Touch to seek (mobile)
- [x] Current time / total time display
- [x] Thumb appears on hover
- [x] Loading shimmer animation when buffering

## F9: Volume Control ✅

**Implementation:** `components/player/VolumeControl.js`

- [x] Volume slider (0–100%)
- [x] Mute/unmute toggle
- [x] Volume icon changes based on level (🔇🔈🔉🔊)
- [x] Volume persists in localStorage
- [x] Hidden on mobile (uses device volume)

## F10: Repeat / Shuffle ✅

**Implementation:** In `PlayerControls.js` + `PlayerContext.js`

- [x] Repeat none → all → one cycle
- [x] Visual indicator when active (purple highlight)
- [x] Shuffle toggle
- [x] Settings persist in localStorage

## F11–F14: Phase 3 features — See `ROADMAP.md`

## F15: PWA 🟡 Partial

**Acceptance Criteria:**
- [x] `manifest.json` with app name, icons, theme colors
- [ ] Service Worker caches app shell
- [ ] "Install app" prompt on mobile browsers
- [ ] Works offline (shows cached UI, queue from localStorage)
- [ ] Standalone display mode (no browser chrome)

**Note:** Basic manifest.json created. PWA icons and Service Worker still needed.

## F16: i18n — ⬜ Todo

**Languages:** Vietnamese (`vi`), English (`en`)
- [ ] Language toggle in header (button placeholder exists)
- [ ] All UI strings use translation keys
- [ ] Language preference saved in localStorage
- [ ] Default language detected from browser
