import express from 'express';
import { spawn } from 'child_process';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());

// Cache to store URLs (expire in 4 hours)
const cache = new Map();

app.get('/stream', async (req, res) => {
  const { id } = req.query;
  if (!id) return res.status(400).json({ error: 'Missing id' });

  // Check cache
  const cached = cache.get(id);
  if (cached && cached.expires > Date.now()) {
    return res.json({ url: cached.url, source: 'cache' });
  }

  try {
    const url = await extractAudioUrl(id);
    
    // Cache for 4 hours (YouTube URLs usually expire after 6 hours)
    cache.set(id, { url, expires: Date.now() + 4 * 60 * 60 * 1000 });

    res.json({ url, source: 'yt-dlp' });
  } catch (err) {
    console.error(`[Error] ${id}:`, err.message);
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.send('OK');
});

function extractAudioUrl(videoId) {
  return new Promise((resolve, reject) => {
    const ytUrl = `https://www.youtube.com/watch?v=${videoId}`;

    // Use yt-dlp to extract the best audio URL
    const proc = spawn('yt-dlp', [
      '-f', 'bestaudio[ext=m4a]/bestaudio/best',
      '--get-url',
      '--no-playlist',
      '--no-warnings',
      // Spoof User-Agent to avoid blocks
      '--add-header', 'User-Agent:Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      '--extractor-args', 'youtube:player_client=web,mweb',
      ytUrl
    ]);

    let output = '';
    let errorOutput = '';

    proc.stdout.on('data', (d) => output += d.toString());
    proc.stderr.on('data', (d) => errorOutput += d.toString());

    proc.on('close', (code) => {
      const audioUrl = output.trim().split('\n')[0];
      if (code === 0 && audioUrl && audioUrl.startsWith('http')) {
        resolve(audioUrl);
      } else {
        reject(new Error(errorOutput || 'yt-dlp failed to extract URL'));
      }
    });

    // Handle process crash
    proc.on('error', (err) => {
      reject(new Error(`Failed to start yt-dlp: ${err.message}`));
    });
  });
}

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
