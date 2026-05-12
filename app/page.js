'use client';

import { useState, useCallback } from 'react';
import Header from '@/components/layout/Header';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import AudioPlayer from '@/components/player/AudioPlayer';
import QueuePanel from '@/components/queue/QueuePanel';
import { usePlayer } from '@/contexts/PlayerContext';

export default function HomePage() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [query, setQuery] = useState('');
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const { playTrack, addToQueue, currentTrack } = usePlayer();

  const handleSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) return;

    setQuery(searchQuery);
    setIsLoading(true);
    setError(null);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=12`);
      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Search failed');
      }

      setResults(data.results || []);
    } catch (err) {
      console.error('[HomePage] Search error:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handlePlay = useCallback((track) => {
    playTrack(track);
  }, [playTrack]);

  const handleAddToQueue = useCallback((track) => {
    addToQueue(track);
    setToastMessage(`Đã thêm "${track.title}" vào hàng đợi`);
    setTimeout(() => setToastMessage(''), 3000);
  }, [addToQueue]);

  return (
    <>
      <Header onQueueToggle={() => setIsQueueOpen(!isQueueOpen)} />
      <main className={`main ${currentTrack ? 'has-player' : ''}`}>
        {!hasSearched && (
          <section className="hero animate-fade-in-up">
            <h1 className="hero__title">Nghe Nhạc YouTube</h1>
            <p className="hero__subtitle">
              Tìm kiếm và nghe nhạc từ YouTube dưới dạng audio — tiết kiệm data, phát nền khi tắt màn hình.
            </p>
            <div className="hero__search-wrapper">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="hero__features">
              <span className="hero__feature-tag">🎵 Audio Only</span>
              <span className="hero__feature-tag">📱 Background Play</span>
              <span className="hero__feature-tag">⚡ Tốc độ phát</span>
              <span className="hero__feature-tag">⏱️ Hẹn giờ</span>
              <span className="hero__feature-tag">📋 Hàng đợi</span>
            </div>
          </section>
        )}

        {hasSearched && (
          <div className="animate-fade-in">
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <SearchBar onSearch={handleSearch} initialQuery={query} />
            </div>
            <SearchResults
              results={results}
              isLoading={isLoading}
              error={error}
              query={query}
              onPlay={handlePlay}
              onAddToQueue={handleAddToQueue}
              onRetry={() => handleSearch(query)}
            />
          </div>
        )}
      </main>

      <AudioPlayer />
      <QueuePanel isOpen={isQueueOpen} onClose={() => setIsQueueOpen(false)} />
      {toastMessage && (
        <div className="toast animate-fade-in-up">
          {toastMessage}
        </div>
      )}
    </>
  );
}
