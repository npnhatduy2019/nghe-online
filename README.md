# 🎧 YTMusic Player

> Nghe nhạc từ YouTube dưới dạng audio — hỗ trợ phát nền khi tắt màn hình.
> 
> Listen to YouTube as audio — supports background playback with screen off.

## 📊 Development Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1: Foundation | ✅ Complete | Search UI, results grid, CSS design system |
| Phase 2: Core Player | ✅ Complete | Audio playback, controls, queue, Media Session |
| Phase 3: Advanced | ⬜ Planned | Sleep timer, playlists, keyboard shortcuts |
| Phase 4: Polish & Deploy | ⬜ Planned | PWA, i18n, Vercel deployment |

## ✨ Features

### Implemented ✅
- 🔍 **Search YouTube** — Tìm kiếm nội dung YouTube (via `ytsr`)
- 🎵 **Audio-only playback** — Phát audio, tiết kiệm data
- 📱 **Background playback** — Tiếp tục phát khi tắt màn hình (Media Session API)
- 🎛️ **Full controls** — Play, pause, next, previous, seek
- ⚡ **Playback speed** — 0.5x đến 2x
- 📋 **Queue management** — Quản lý hàng đợi phát (persisted)
- 🔄 **Repeat & Shuffle** — Lặp lại (none/one/all) và phát ngẫu nhiên
- 🔊 **Volume control** — Slider + mute toggle
- 🖥️ **Lock screen controls** — Điều khiển từ màn hình khóa

### Planned ⬜
- ⏱️ **Sleep timer** — Hẹn giờ tắt nhạc
- 📲 **PWA** — Cài đặt như app trên điện thoại
- 🌐 **i18n** — Tiếng Việt + English
- ⌨️ **Keyboard shortcuts** — Phím tắt điều khiển
- 💾 **Playlists** — Lưu/tải playlist

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev
```

Open `http://localhost:3000`

## 🛠️ Tech Stack

- **Next.js 16** — React framework with App Router + Turbopack
- **Vanilla CSS** — Design system with custom properties (~1400 lines)
- **@distube/ytdl-core** — YouTube audio extraction
- **ytsr** — YouTube search (no API key needed)
- **Media Session API** — Background/lock screen playback
- **Vercel** — Hosting target

## 📖 Documentation

| Document | Description |
|----------|-------------|
| [CONTEXT](docs/CONTEXT.md) | Project context, goals, current status |
| [ARCHITECTURE](docs/ARCHITECTURE.md) | System architecture and design patterns |
| [STRUCTURE](docs/STRUCTURE.md) | File and folder structure (with status) |
| [API](docs/API.md) | API endpoints documentation |
| [FEATURES](docs/FEATURES.md) | Feature specifications and acceptance criteria |
| [SETUP](docs/SETUP.md) | Development environment setup |
| [DEPLOYMENT](docs/DEPLOYMENT.md) | Vercel deployment guide |
| [ROADMAP](docs/ROADMAP.md) | Development phases and timeline (with progress) |
| [CONVENTIONS](docs/CONVENTIONS.md) | Code conventions and patterns |

## 📂 Key Files

```
app/
├── layout.js          # Root layout + PlayerProvider
├── page.js            # Main page (search + player)
├── globals.css        # Complete design system
└── api/
    ├── search/route.js  # YouTube search API
    └── stream/route.js  # Audio extraction API (with fallbacks)

components/
├── layout/Header.js
├── search/{SearchBar, SearchResults, VideoCard}.js
├── player/{AudioPlayer, PlayerControls, ProgressBar, VolumeControl, SpeedControl, NowPlaying}.js
└── queue/QueuePanel.js

contexts/PlayerContext.js    # Central state management
hooks/useMediaSession.js     # Media Session API integration
utils/{formatTime, storage, constants}.js
```

## 📄 License

Personal use only. Not for commercial distribution.
