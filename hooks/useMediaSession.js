'use client';

import { useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';

/**
 * useMediaSession — Integrates with the Media Session API for
 * lock screen controls, Bluetooth headphone buttons, and
 * notification media controls on mobile.
 */
export default function useMediaSession() {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    playNextTrack,
    playPrevTrack,
    seek,
    currentTime,
    duration,
  } = usePlayer();

  // Set metadata when track changes
  useEffect(() => {
    if (!('mediaSession' in navigator) || !currentTrack) return;

    navigator.mediaSession.metadata = new MediaMetadata({
      title: currentTrack.title || 'Unknown',
      artist: currentTrack.channel?.name || currentTrack.author || 'Unknown',
      album: 'YTMusic Player',
      artwork: currentTrack.thumbnail
        ? [
            { src: currentTrack.thumbnail, sizes: '512x512', type: 'image/jpeg' },
          ]
        : [],
    });
  }, [currentTrack]);

  // Set playback state
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;
    navigator.mediaSession.playbackState = isPlaying ? 'playing' : 'paused';
  }, [isPlaying]);

  // Set action handlers
  useEffect(() => {
    if (!('mediaSession' in navigator)) return;

    const handlers = {
      play: () => togglePlay(),
      pause: () => togglePlay(),
      previoustrack: () => playPrevTrack(),
      nexttrack: () => playNextTrack(),
      seekto: (details) => {
        if (details.seekTime != null) {
          seek(details.seekTime);
        }
      },
      seekbackward: (details) => {
        const skipTime = details.seekOffset || 10;
        seek(Math.max(0, currentTime - skipTime));
      },
      seekforward: (details) => {
        const skipTime = details.seekOffset || 10;
        seek(Math.min(duration, currentTime + skipTime));
      },
    };

    for (const [action, handler] of Object.entries(handlers)) {
      try {
        navigator.mediaSession.setActionHandler(action, handler);
      } catch {
        // Some actions not supported on all browsers
      }
    }

    // Update position state
    if (navigator.mediaSession.setPositionState && duration > 0) {
      try {
        navigator.mediaSession.setPositionState({
          duration: duration,
          playbackRate: 1,
          position: Math.min(currentTime, duration),
        });
      } catch {
        // ignore
      }
    }

    return () => {
      for (const action of Object.keys(handlers)) {
        try {
          navigator.mediaSession.setActionHandler(action, null);
        } catch {
          // ignore
        }
      }
    };
  }, [togglePlay, playNextTrack, playPrevTrack, seek, currentTime, duration]);
}
