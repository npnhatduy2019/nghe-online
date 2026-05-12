'use client';

import { usePlayer } from '@/contexts/PlayerContext';

/**
 * QueuePanel — Slide-out panel showing upcoming tracks in the queue.
 */
export default function QueuePanel({ isOpen, onClose }) {
  const {
    queue,
    currentTrack,
    removeFromQueue,
    clearQueue,
    playTrack,
  } = usePlayer();

  if (!isOpen) return null;

  return (
    <>
      <div className="queue-panel__backdrop" onClick={onClose} />
      <aside className="queue-panel" role="complementary" aria-label="Queue">
        <div className="queue-panel__header">
          <h2 className="queue-panel__title">
            Hàng đợi
            {queue.length > 0 && (
              <span className="queue-panel__count">{queue.length}</span>
            )}
          </h2>
          <div className="queue-panel__header-actions">
            {queue.length > 0 && (
              <button
                className="queue-panel__clear-btn"
                onClick={clearQueue}
                aria-label="Clear queue"
              >
                Xóa tất cả
              </button>
            )}
            <button
              className="queue-panel__close-btn"
              onClick={onClose}
              aria-label="Close queue"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Now Playing */}
        {currentTrack && (
          <div className="queue-panel__section">
            <h3 className="queue-panel__section-title">Đang phát</h3>
            <div className="queue-item queue-item--active">
              <img
                className="queue-item__thumb"
                src={currentTrack.thumbnail}
                alt=""
                width={48}
                height={36}
              />
              <div className="queue-item__info">
                <p className="queue-item__title">{currentTrack.title}</p>
                <p className="queue-item__channel">
                  {currentTrack.channel?.name || currentTrack.author || ''}
                </p>
              </div>
              <span className="queue-item__now-indicator">♫</span>
            </div>
          </div>
        )}

        {/* Queue list */}
        <div className="queue-panel__section">
          <h3 className="queue-panel__section-title">Tiếp theo</h3>
          {queue.length === 0 ? (
            <div className="queue-panel__empty">
              <p>Chưa có bài nào trong hàng đợi</p>
              <p className="queue-panel__empty-hint">
                Tìm kiếm và thêm bài hát vào hàng đợi
              </p>
            </div>
          ) : (
            <div className="queue-panel__list">
              {queue.map((track, index) => (
                <div
                  key={`${track.id}-${index}`}
                  className="queue-item"
                  onClick={() => {
                    removeFromQueue(index);
                    playTrack(track);
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <span className="queue-item__index">{index + 1}</span>
                  <img
                    className="queue-item__thumb"
                    src={track.thumbnail}
                    alt=""
                    width={48}
                    height={36}
                  />
                  <div className="queue-item__info">
                    <p className="queue-item__title">{track.title}</p>
                    <p className="queue-item__channel">
                      {track.channel?.name || track.author || ''}
                    </p>
                  </div>
                  <button
                    className="queue-item__remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFromQueue(index);
                    }}
                    aria-label={`Remove ${track.title} from queue`}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
