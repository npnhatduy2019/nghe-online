'use client';

import VideoCard from './VideoCard';

/**
 * SearchResults — Displays search results grid, loading, error, and empty states.
 */
export default function SearchResults({
  results,
  isLoading,
  error,
  query,
  onPlay,
  onAddToQueue,
  onRetry,
}) {
  // Loading state
  if (isLoading) {
    return (
      <div>
        <div className="results-header">
          <h2 className="results-header__title">Đang tìm kiếm...</h2>
        </div>
        <div className="results-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-card__thumb" />
              <div className="skeleton-card__info">
                <div className="skeleton skeleton-card__title" />
                <div className="skeleton skeleton-card__title skeleton-card__title--short" />
                <div className="skeleton skeleton-card__channel" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="error-state">
        <span className="error-state__icon">⚠️</span>
        <h2 className="error-state__title">Lỗi tìm kiếm</h2>
        <p className="error-state__desc">{error}</p>
        <button className="error-state__retry" onClick={onRetry}>
          Thử lại
        </button>
      </div>
    );
  }

  // Empty results
  if (results.length === 0) {
    return (
      <div className="empty-state">
        <span className="empty-state__icon">🔍</span>
        <h2 className="empty-state__title">Không tìm thấy kết quả</h2>
        <p className="empty-state__desc">
          Không có kết quả cho &ldquo;{query}&rdquo;. Hãy thử từ khóa khác.
        </p>
      </div>
    );
  }

  // Results
  return (
    <div>
      <div className="results-header">
        <h2 className="results-header__title">Kết quả cho &ldquo;{query}&rdquo;</h2>
        <span className="results-header__count">{results.length} kết quả</span>
      </div>
      <div className="results-grid">
        {results.map((track) => (
          <VideoCard
            key={track.id}
            track={track}
            onPlay={onPlay}
            onAddToQueue={onAddToQueue}
          />
        ))}
      </div>
    </div>
  );
}
