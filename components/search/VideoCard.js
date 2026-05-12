'use client';

/**
 * VideoCard — Individual search result card with thumbnail, title, and actions.
 *
 * @param {Object} props
 * @param {Object} props.track - Track data { id, title, channel, duration, thumbnail, views }
 * @param {Function} props.onPlay - Called when user clicks to play
 * @param {Function} props.onAddToQueue - Called when user clicks "Add to queue"
 */
export default function VideoCard({ track, onPlay, onAddToQueue }) {
  const handlePlay = (e) => {
    e.stopPropagation();
    onPlay(track);
  };

  const handleAddToQueue = (e) => {
    e.stopPropagation();
    onAddToQueue(track);
  };

  return (
    <article
      className="video-card"
      onClick={handlePlay}
      role="button"
      tabIndex={0}
      aria-label={`Play ${track.title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handlePlay(e);
        }
      }}
    >
      {/* Thumbnail */}
      <div className="video-card__thumbnail-wrapper">
        <img
          className="video-card__thumbnail"
          src={track.thumbnail}
          alt={track.title}
          loading="lazy"
        />
        {track.duration && (
          <span className="video-card__duration">{track.duration}</span>
        )}
        <div className="video-card__play-overlay">
          <span className="video-card__play-btn" aria-hidden="true">▶</span>
        </div>
      </div>

      {/* Info */}
      <div className="video-card__info">
        <h3 className="video-card__title">{track.title}</h3>
        {track.channel && (
          <p className="video-card__channel">{track.channel.name || track.channel}</p>
        )}
        <div className="video-card__meta">
          {track.views && <span>{track.views}</span>}
          {track.views && track.duration && <span className="video-card__meta-dot" />}
          {track.isLive && <span style={{ color: 'var(--color-error)' }}>● LIVE</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="video-card__actions">
        <button
          className="video-card__action-btn"
          onClick={handleAddToQueue}
          aria-label={`Add ${track.title} to queue`}
        >
          ＋ Thêm vào hàng đợi
        </button>
      </div>
    </article>
  );
}
