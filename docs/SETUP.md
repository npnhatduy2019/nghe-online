# 🚀 Development Setup — YTMusic Player

> **Last updated:** 2026-05-12

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | 18.17+ (v24.13.0 tested) | `node --version` |
| npm | 9+ | `npm --version` |
| Git | any | `git --version` |

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url> nghe-online
cd nghe-online

# 2. Install dependencies
npm install

# 3. Create environment file
copy .env.example .env.local

# 4. Start development server
npm run dev
```

Open `http://localhost:3000` in your browser.

## Environment Variables

Create `.env.local` from `.env.example`:

```env
# Required
# (none required for basic functionality)

# Optional — for YouTube Data API (not needed if using ytsr)
# YOUTUBE_API_KEY=your_api_key_here

# Optional — rate limiting
# RATE_LIMIT_SEARCH=30
# RATE_LIMIT_STREAM=20
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (http://localhost:3000) |
| `npm run build` | Build for production |
| `npm run start` | Start production server locally |
| `npm run lint` | Run ESLint |

## Project Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|--------|
| `next` | 16.2.6 | React framework with App Router (Turbopack) |
| `react`, `react-dom` | latest | UI library |
| `@distube/ytdl-core` | latest | Extract audio URLs from YouTube |
| `ytsr` | 3.8.4 | YouTube search without API key (deprecated but functional) |

### Development
| Package | Purpose |
|---------|---------|
| `eslint`, `eslint-config-next` | Linting |

## Troubleshooting

### `ytdl-core` errors
If audio extraction fails, update the library:
```bash
npm update @distube/ytdl-core
```

### Port 3000 in use
```bash
npm run dev -- -p 3001
```

### CORS issues in development
API routes in Next.js handle CORS automatically. If testing with external tools, add CORS headers in the API route.
