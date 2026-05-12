'use client';

import { useRef, useCallback } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';
import { formatTime } from '@/utils/formatTime';

/**
 * ProgressBar — Seekable progress bar with time display.
 */
export default function ProgressBar() {
  const { currentTime, duration, seek, isLoading } = usePlayer();
  const barRef = useRef(null);
  const isDragging = useRef(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = useCallback(
    (e) => {
      if (!barRef.current || !duration) return;

      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      seek(ratio * duration);
    },
    [duration, seek]
  );

  const handleMouseDown = useCallback(
    (e) => {
      isDragging.current = true;
      handleSeek(e);

      const handleMouseMove = (e) => {
        if (isDragging.current) handleSeek(e);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };

      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    },
    [handleSeek]
  );

  const handleTouchStart = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (!barRef.current || !duration) return;

      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      seek(ratio * duration);
    },
    [duration, seek]
  );

  const handleTouchMove = useCallback(
    (e) => {
      const touch = e.touches[0];
      if (!barRef.current || !duration) return;

      const rect = barRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(touch.clientX - rect.left, rect.width));
      const ratio = x / rect.width;
      seek(ratio * duration);
    },
    [duration, seek]
  );

  return (
    <div className="progress-bar-container">
      <span className="progress-bar__time">{formatTime(currentTime)}</span>
      <div
        ref={barRef}
        className="progress-bar"
        role="slider"
        aria-label="Seek"
        aria-valuemin={0}
        aria-valuemax={duration || 0}
        aria-valuenow={currentTime}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <div className="progress-bar__track">
          <div
            className="progress-bar__fill"
            style={{ width: `${progress}%` }}
          />
          <div
            className="progress-bar__thumb"
            style={{ left: `${progress}%` }}
          />
        </div>
        {isLoading && <div className="progress-bar__loading" />}
      </div>
      <span className="progress-bar__time">{formatTime(duration)}</span>
    </div>
  );
}
