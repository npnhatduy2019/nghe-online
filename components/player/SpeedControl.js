'use client';

import { useState } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { PLAYBACK_SPEEDS } from '@/utils/constants';

/**
 * SpeedControl — Playback speed selector dropdown.
 */
export default function SpeedControl() {
  const { playbackSpeed, setSpeed } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (speed) => {
    setSpeed(speed);
    setIsOpen(false);
  };

  return (
    <div className="speed-control">
      <button
        className="speed-control__trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Playback speed: ${playbackSpeed}x`}
        title="Tốc độ phát"
      >
        {playbackSpeed}x
      </button>

      {isOpen && (
        <>
          <div
            className="speed-control__backdrop"
            onClick={() => setIsOpen(false)}
          />
          <div className="speed-control__dropdown" role="listbox">
            {PLAYBACK_SPEEDS.map((speed) => (
              <button
                key={speed}
                className={`speed-control__option ${
                  speed === playbackSpeed ? 'is-active' : ''
                }`}
                onClick={() => handleSelect(speed)}
                role="option"
                aria-selected={speed === playbackSpeed}
              >
                {speed}x
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
