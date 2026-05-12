'use client';

import { usePlayer } from '@/contexts/PlayerContext';

/**
 * Header — App header with logo, queue toggle, and language.
 */
export default function Header({ onQueueToggle }) {
  const { queue } = usePlayer();

  return (
    <header className="header" role="banner">
      <a href="/" className="header__logo" aria-label="YTMusic Player Home">
        <span className="header__logo-icon">🎧</span>
        <span>YTMusic</span>
      </a>
      <div className="header__actions">
        <button
          className="icon-btn"
          onClick={onQueueToggle}
          aria-label="Toggle queue"
          title="Hàng đợi"
        >
          📋
          {queue.length > 0 && (
            <span className="header__badge">{queue.length}</span>
          )}
        </button>
        <button
          className="icon-btn"
          aria-label="Toggle language"
          title="VI / EN"
        >
          🌐
        </button>
      </div>
    </header>
  );
}
