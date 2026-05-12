'use client';

import { usePlayer } from '@/contexts/PlayerContext';
import { REPEAT_MODES } from '@/utils/constants';

/**
 * PlayerControls — Play/pause, next, prev, repeat, shuffle buttons.
 */
export default function PlayerControls() {
  const {
    isPlaying,
    isLoading,
    togglePlay,
    playNextTrack,
    playPrevTrack,
    cycleRepeat,
    toggleShuffle,
    repeatMode,
    isShuffle,
    queue,
  } = usePlayer();

  const repeatIcon = repeatMode === REPEAT_MODES.ONE ? '🔂' : '🔁';
  const repeatActive = repeatMode !== REPEAT_MODES.NONE;

  return (
    <div className="player-controls">
      {/* Shuffle */}
      <button
        className={`player-controls__btn player-controls__btn--sm ${isShuffle ? 'is-active' : ''}`}
        onClick={toggleShuffle}
        aria-label={isShuffle ? 'Disable shuffle' : 'Enable shuffle'}
        title={isShuffle ? 'Tắt trộn bài' : 'Bật trộn bài'}
      >
        🔀
      </button>

      {/* Previous */}
      <button
        className="player-controls__btn"
        onClick={playPrevTrack}
        aria-label="Previous track"
        title="Bài trước"
      >
        ⏮
      </button>

      {/* Play/Pause */}
      <button
        className="player-controls__btn player-controls__btn--play"
        onClick={togglePlay}
        disabled={isLoading}
        aria-label={isPlaying ? 'Pause' : 'Play'}
        title={isPlaying ? 'Tạm dừng' : 'Phát'}
      >
        {isLoading ? (
          <span className="player-controls__spinner" />
        ) : isPlaying ? (
          '⏸'
        ) : (
          '▶'
        )}
      </button>

      {/* Next */}
      <button
        className="player-controls__btn"
        onClick={playNextTrack}
        disabled={queue.length === 0}
        aria-label="Next track"
        title="Bài tiếp"
      >
        ⏭
      </button>

      {/* Repeat */}
      <button
        className={`player-controls__btn player-controls__btn--sm ${repeatActive ? 'is-active' : ''}`}
        onClick={cycleRepeat}
        aria-label={`Repeat mode: ${repeatMode}`}
        title={`Lặp: ${repeatMode === 'none' ? 'Tắt' : repeatMode === 'one' ? '1 bài' : 'Tất cả'}`}
      >
        {repeatIcon}
      </button>
    </div>
  );
}
