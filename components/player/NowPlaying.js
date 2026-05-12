'use client';

import { usePlayer } from '@/contexts/PlayerContext';

/**
 * NowPlaying — Shows current track info (thumbnail, title, channel).
 */
export default function NowPlaying() {
  const { currentTrack, isLoading } = usePlayer();

  if (!currentTrack) return null;

  return (
    <div className="now-playing">
      <div className="now-playing__thumb-wrapper">
        {isLoading && <div className="now-playing__loading-ring" />}
        <img
          className="now-playing__thumb"
          src={currentTrack.thumbnail}
          alt={currentTrack.title}
          width={48}
          height={48}
        />
      </div>
      <div className="now-playing__info">
        <p className="now-playing__title">{currentTrack.title}</p>
        <p className="now-playing__channel">
          {currentTrack.channel?.name || currentTrack.author || ''}
        </p>
      </div>
    </div>
  );
}
