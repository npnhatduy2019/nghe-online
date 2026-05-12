import { NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Cache for audio URLs (they expire after ~6 hours)
const urlCache = new Map();
const CACHE_TTL = 60 * 60 * 1000; // 1 hour

function getCached(key) {
  const entry = urlCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    urlCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key, data) {
  if (urlCache.size > 50) {
    const firstKey = urlCache.keys().next().value;
    urlCache.delete(firstKey);
  }
  urlCache.set(key, { data, timestamp: Date.now() });
}

// Invidious instances for fallback
const INVIDIOUS_INSTANCES = [
  'https://inv.tux.pizza',
  'https://invidious.weblibre.org',
  'https://invidious.lunar.icu',
  'https://invidious.projectsegfau.lt',
  'https://inv.makerlab.tech',
  'https://inv.nadeko.net',
  'https://invidious.nerdvpn.de',
];

/**
 * GET /api/stream?id={videoId}
 * 
 * Extract audio stream URL from YouTube video.
 * Uses fallback chain: ytdl-core → Invidious → Piped
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get('id');

    // Validate
    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Missing parameter: id', code: 'MISSING_PARAM' },
        { status: 400 }
      );
    }

    // Validate video ID format (11 alphanumeric chars)
    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid video ID format', code: 'INVALID_PARAM' },
        { status: 400 }
      );
    }

    // Check cache
    const cached = getCached(videoId);
    if (cached) {
      return NextResponse.json({ success: true, data: cached, cached: true });
    }

    // Try extraction with fallback chain
    let result = null;

    // 1. Try yt-dlp (Option A)
    try {
      result = await extractWithYtDlp(videoId);
    } catch (err) {
      console.warn('[API/stream] yt-dlp failed or not installed:', err.message);

      // 2. Try Cobalt API (Option B)
      try {
        result = await extractWithCobalt(videoId);
      } catch (err2) {
        console.warn('[API/stream] Cobalt API failed:', err2.message);

        // 3. Try Invidious
        try {
          result = await extractWithInvidious(videoId);
          result.source = 'invidious';
        } catch (err3) {
          console.warn('[API/stream] Invidious failed:', err3.message);

          // 4. Try Piped
          try {
            result = await extractWithPiped(videoId);
            result.source = 'piped';
          } catch (err4) {
            console.error('[API/stream] All providers failed');
            throw new Error('All audio extraction providers failed');
          }
        }
      }
    }

    // Cache result
    setCache(videoId, result);

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('[API/stream] Error:', error.message);
    return NextResponse.json(
      { success: false, error: error.message || 'Audio extraction failed', code: 'EXTRACTION_FAILED' },
      { status: 500 }
    );
  }
}

/**
 * Extract audio using yt-dlp child process (Option A)
 */
async function extractWithYtDlp(videoId) {
  return new Promise((resolve, reject) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    const proc = spawn('yt-dlp', [
      '-f', 'bestaudio[ext=m4a]/bestaudio/best',
      '--get-url',
      '--no-playlist',
      url
    ]);

    let output = '';
    let errorOutput = '';

    proc.stdout.on('data', (d) => output += d.toString());
    proc.stderr.on('data', (d) => errorOutput += d.toString());

    proc.on('close', (code) => {
      if (code === 0 && output.trim()) {
        const audioUrl = output.trim().split('\n')[0];
        resolve({
          id: videoId,
          audioUrl: audioUrl,
          source: 'yt-dlp',
        });
      } else {
        reject(new Error(errorOutput || 'yt-dlp failed'));
      }
    });
    
    // In case yt-dlp is not installed
    proc.on('error', (err) => {
      reject(new Error(`Failed to start yt-dlp: ${err.message}`));
    });
  });
}

/**
 * Extract audio using Cobalt API (Option B)
 */
async function extractWithCobalt(videoId) {
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const res = await fetch('https://api.cobalt.tools/api/json', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: url,
      isAudioOnly: true,
    }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) {
    throw new Error('Cobalt API request failed');
  }

  const data = await res.json();
  if (data.status === 'error' || !data.url) {
    throw new Error(data.text || 'Cobalt API returned an error');
  }

  return {
    id: videoId,
    audioUrl: data.url,
    source: 'cobalt',
  };
}

/**
 * Fallback: Extract via Invidious API
 */
async function extractWithInvidious(videoId) {
  let lastError;
  for (const instance of INVIDIOUS_INSTANCES) {
    try {
      const res = await fetch(`${instance}/api/v1/videos/${videoId}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;

      const data = await res.json();
      const audioStream = data.adaptiveFormats
        ?.filter((f) => f.type?.startsWith('audio/'))
        ?.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))?.[0];

      if (!audioStream?.url) continue;

      return {
        id: videoId,
        title: data.title,
        author: data.author || 'Unknown',
        duration: data.lengthSeconds || 0,
        thumbnail: data.videoThumbnails?.[0]?.url || '',
        audioUrl: audioStream.url,
        expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      };
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('All Invidious instances failed');
}

/**
 * Fallback: Extract via Piped API
 */
async function extractWithPiped(videoId) {
  const pipedInstances = [
    'https://pipedapi.in.projectsegfau.lt',
    'https://pipedapi.us.projectsegfau.lt',
    'https://api.piped.projectsegfau.lt',
    'https://pipedapi.kavin.rocks',
    'https://pipedapi.syncpundit.io',
    'https://piped-api.garudalinux.org',
  ];

  let lastError;
  for (const instance of pipedInstances) {
    try {
      const res = await fetch(`${instance}/streams/${videoId}`, {
        signal: AbortSignal.timeout(8000),
      });
      if (!res.ok) continue;

      const data = await res.json();
      const audioStream = data.audioStreams
        ?.sort((a, b) => (b.bitrate || 0) - (a.bitrate || 0))?.[0];

      if (!audioStream?.url) continue;

      return {
        id: videoId,
        title: data.title,
        author: data.uploader || 'Unknown',
        duration: data.duration || 0,
        thumbnail: data.thumbnailUrl || '',
        audioUrl: audioStream.url,
        expiresAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      };
    } catch (err) {
      lastError = err;
      continue;
    }
  }
  throw lastError || new Error('All Piped instances failed');
}
