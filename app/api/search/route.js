import { NextResponse } from 'next/server';
import ytsr from 'ytsr';

// Simple in-memory cache
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  // Limit cache size
  if (cache.size > 100) {
    const firstKey = cache.keys().next().value;
    cache.delete(firstKey);
  }
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * GET /api/search?q={query}&limit={limit}
 * 
 * Search YouTube videos using ytsr.
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = Math.min(Math.max(parseInt(searchParams.get('limit')) || 20, 1), 50);

    // Validate
    if (!query || !query.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing parameter: q', code: 'MISSING_PARAM' },
        { status: 400 }
      );
    }

    const trimmedQuery = query.trim();

    // Check cache
    const cacheKey = `search:${trimmedQuery}:${limit}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({ success: true, results: cached, cached: true });
    }

    // Search YouTube
    const searchResults = await ytsr(trimmedQuery, { limit });

    // Format results — only video type
    const results = searchResults.items
      .filter((item) => item.type === 'video')
      .map((item) => ({
        id: item.id,
        title: item.title,
        channel: {
          name: item.author?.name || 'Unknown',
          url: item.author?.url || '',
          verified: item.author?.verified || false,
        },
        duration: item.duration || null,
        durationSeconds: parseDuration(item.duration),
        thumbnail: item.bestThumbnail?.url || item.thumbnails?.[0]?.url || '',
        views: item.views ? formatViews(item.views) : '',
        uploadedAt: item.uploadedAt || '',
        isLive: item.isLive || false,
        url: item.url,
      }));

    // Cache results
    setCache(cacheKey, results);

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error('[API/search] Error:', error.message);
    return NextResponse.json(
      { success: false, error: 'Search failed. Please try again.', code: 'SEARCH_FAILED' },
      { status: 500 }
    );
  }
}

/**
 * Parse duration string "3:45" or "1:02:30" to seconds.
 */
function parseDuration(duration) {
  if (!duration) return 0;
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return parts[0] || 0;
}

/**
 * Format view count number to human-readable string.
 */
function formatViews(views) {
  if (typeof views === 'string') return views;
  if (views >= 1_000_000_000) return `${(views / 1_000_000_000).toFixed(1)}B views`;
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M views`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K views`;
  return `${views} views`;
}
