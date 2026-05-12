# 🔌 API Documentation — YTMusic Player

> **Status:** `/api/search` ✅ and `/api/stream` ✅ implemented. `/api/suggestions` planned.
> **Last updated:** 2026-05-12

## Base URL
- **Dev**: `http://localhost:3000`
- **Prod**: `https://your-app.vercel.app`

## Endpoints

### 1. `GET /api/search?q={query}&limit={limit}`

Search YouTube videos by keyword.

| Param | Type | Required | Default | Description |
|-------|------|----------|---------|-------------|
| `q` | string | ✅ | — | Search query |
| `limit` | number | ❌ | 20 | Max results (1-50) |

**Success (200):**
```json
{
  "success": true,
  "results": [
    {
      "id": "dQw4w9WgXcQ",
      "title": "Lofi Hip Hop Radio",
      "channel": { "name": "Lofi Girl" },
      "duration": "3:45",
      "durationSeconds": 225,
      "thumbnail": "https://i.ytimg.com/vi/.../hqdefault.jpg",
      "views": "1.2M views",
      "isLive": false
    }
  ]
}
```

### 2. `GET /api/stream?id={videoId}`

Extract audio stream URL from a YouTube video.

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | ✅ | YouTube video ID (11 chars) |

**Success (200):**
```json
{
  "success": true,
  "data": {
    "id": "dQw4w9WgXcQ",
    "title": "Lofi Hip Hop Radio",
    "author": "Lofi Girl",
    "duration": 225,
    "thumbnail": "https://i.ytimg.com/vi/.../maxresdefault.jpg",
    "audioUrl": "https://rr3---sn-xxx.googlevideo.com/videoplayback?...",
    "expiresAt": "2026-05-12T14:00:00Z",
    "source": "ytdl-core"
  }
}
```

> **Note:** `audioUrl` expires after ~6 hours. Frontend must refresh on failure.

### 3. `GET /api/suggestions?q={partial}` (Future)

Returns autocomplete suggestions.

## Data Models

```javascript
// Track — core data model
{ id, title, channel, duration, durationSeconds, thumbnail, audioUrl? }

// PlayerState
{ isPlaying, currentTime, duration, volume, playbackSpeed, repeatMode, isShuffle }

// SleepTimerState
{ isActive, endTime, remaining, preset }
```

## Error Format

```json
{ "success": false, "error": "Human-readable message", "code": "ERROR_CODE" }
```

| Code | Status | Description |
|------|--------|-------------|
| `MISSING_PARAM` | 400 | Required parameter missing |
| `INVALID_PARAM` | 400 | Invalid format |
| `VIDEO_NOT_FOUND` | 404 | Video unavailable |
| `EXTRACTION_FAILED` | 500 | All providers failed |
| `RATE_LIMITED` | 429 | Too many requests |

## Caching

| Data | TTL | Location |
|------|-----|----------|
| Search results | 5 min | Server memory |
| Audio URLs | 1 hour | Server memory |
| Suggestions | 10 min | Server memory |
