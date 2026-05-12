'use client';

import { useRef, useCallback } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';

/**
 * VolumeControl — Volume slider with mute toggle.
 */
export default function VolumeControl() {
  const { volume, setVolume } = usePlayer();
  const prevVolume = useRef(volume);

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      prevVolume.current = volume;
      setVolume(0);
    } else {
      setVolume(prevVolume.current || 0.8);
    }
  }, [volume, setVolume]);

  const handleChange = useCallback(
    (e) => {
      setVolume(parseFloat(e.target.value));
    },
    [setVolume]
  );

  const getVolumeIcon = () => {
    if (volume === 0) return '🔇';
    if (volume < 0.3) return '🔈';
    if (volume < 0.7) return '🔉';
    return '🔊';
  };

  return (
    <div className="volume-control">
      <button
        className="volume-control__icon-btn"
        onClick={toggleMute}
        aria-label={volume === 0 ? 'Unmute' : 'Mute'}
        title={volume === 0 ? 'Bật tiếng' : 'Tắt tiếng'}
      >
        {getVolumeIcon()}
      </button>
      <input
        className="volume-control__slider"
        type="range"
        min="0"
        max="1"
        step="0.01"
        value={volume}
        onChange={handleChange}
        aria-label="Volume"
        style={{
          '--volume-percent': `${volume * 100}%`,
        }}
      />
    </div>
  );
}
