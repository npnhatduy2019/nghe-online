# 📋 Project Context — YTMusic Player

## What is this project?

**YTMusic Player** (Nghe Online) is a web-based audio player that extracts and plays audio from YouTube videos directly in the browser. It solves the problem of wanting to listen to YouTube content as audio-only — especially on mobile devices where the screen can be turned off while audio continues playing.

## Why does this project exist?

YouTube's official app stops playback when the screen is off (unless you have YouTube Premium). This project provides a free, lightweight alternative for personal use that:

- Extracts audio-only streams from YouTube (saves bandwidth)
- Continues playback in the background / with screen off
- Works as a PWA (installable on mobile like a native app)
- Provides a clean, focused listening experience

## Current Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1: Foundation | ✅ Complete | Search UI, results grid, design system |
| Phase 2: Core Player | ✅ Complete | Audio playback, controls, queue, Media Session |
| Phase 3: Advanced | ⬜ Not started | Sleep timer, playlists, shortcuts |
| Phase 4: Polish & Deploy | ⬜ Not started | PWA, i18n, Vercel deployment |

## Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | Next.js 16 (App Router) | Built-in API routes, easy Vercel deployment, Turbopack dev |
| Audio Extraction | `@distube/ytdl-core` | Actively maintained fork of `ytdl-core`, Node.js native |
| YouTube Search | `ytsr` | No API key required, free, simple (deprecated but functional) |
| Styling | Vanilla CSS | Maximum control, no build dependencies, optimal performance |
| State Management | React Context + localStorage | Simple, no external deps, persistence across sessions |
| Background Playback | HTML5 `<audio>` + Media Session API | Native browser support, lock screen controls |
| Deployment | Vercel | Free tier, serverless functions, automatic deploys |
| i18n | Custom (Vietnamese + English) | Lightweight, no heavy i18n library needed initially |
| Auth | None (Phase 1-2) → Auth (Future) | MVP first, auth will be added later |
| Mobile Priority | Mobile-first responsive | Primary use case is mobile listening |
| PWA | Yes | Critical for background playback on mobile |

## Target Users

- Personal use (the project creator and friends)
- People who want to listen to YouTube content as audio
- Users who want background playback on mobile without YouTube Premium

## Legal Notice

> ⚠️ Extracting audio from YouTube may violate YouTube's Terms of Service. This project is intended for **personal, non-commercial use only**. Consider YouTube Music Premium for an official solution.

## Project Timeline

- **Started**: May 12, 2026
- **Phase 1 completed**: May 12, 2026
- **Phase 2 completed**: May 12, 2026
- **Target MVP**: ~7 working days
- **Deployment**: Vercel (free tier)

## Technical Notes

### Known Issues
- `ytsr` package is deprecated (v3.8.4) — some YouTube result types (`lockupViewModel`, `gridShelfViewModel`) are not parsed. May need replacement with YouTube Data API v3 or alternative library.
- Long videos (1+ hour mixes) may fail audio extraction due to format limitations.
- Turbopack requires `serverExternalPackages: ['ytsr', '@distube/ytdl-core']` in next.config.mjs.

### Dependencies (Production)
| Package | Version | Purpose |
|---------|---------|---------|
| `next` | 16.2.6 | React framework |
| `react` | latest | UI library |
| `react-dom` | latest | React DOM |
| `@distube/ytdl-core` | latest | YouTube audio extraction |
| `ytsr` | 3.8.4 | YouTube search |

## Related Resources

- [YouTube Data API](https://developers.google.com/youtube/v3)
- [@distube/ytdl-core](https://github.com/distubejs/ytdl-core)
- [ytsr](https://github.com/TimeForANinja/node-ytsr)
- [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)
- [PWA Documentation](https://web.dev/progressive-web-apps/)
- [Next.js App Router](https://nextjs.org/docs/app)
