'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import useMediaSession from '@/hooks/useMediaSession';
import PlayerControls from './PlayerControls';
import ProgressBar from './ProgressBar';
import VolumeControl from './VolumeControl';
import SpeedControl from './SpeedControl';
import NowPlaying from './NowPlaying';

/**
 * AudioPlayer — Main player container fixed at the bottom of the screen.
 */
export default function AudioPlayer() {
  const { currentTrack, error } = usePlayer();

  // Enable Media Session API
  useMediaSession();

  // Don't render if no track is selected
  if (!currentTrack) return null;

  return (
    <div className="audio-player" role="region" aria-label="Audio Player">
      <ProgressBar />
      {error && (
        <div className="audio-player__error" style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', background: 'var(--color-error)', color: 'white', padding: 'var(--space-2) var(--space-4)', borderRadius: 'var(--radius-full)', fontSize: 'var(--font-size-sm)', boxShadow: 'var(--shadow-md)', zIndex: 100 }}>
          {error === 'All audio extraction providers failed' ? 'Không thể phát bài này (có thể là Livestream hoặc video bị chặn).' : error}
        </div>
      )}
      <div className="audio-player__content">
        <NowPlaying />
        <PlayerControls />
        <div className="audio-player__secondary">
          <VolumeControl />
          <SpeedControl />
        </div>
      </div>
    </div>
  );
}
