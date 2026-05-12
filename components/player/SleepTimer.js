'use client';

import { useState, useEffect } from 'react';
import { usePlayer } from '@/contexts/PlayerContext';

export default function SleepTimer() {
  const { setSleepTimer, sleepTimerTarget } = usePlayer();
  const [isOpen, setIsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');

  // Update time left every second
  useEffect(() => {
    if (!sleepTimerTarget) {
      setTimeLeft('');
      return;
    }

    const interval = setInterval(() => {
      const remaining = sleepTimerTarget - Date.now();
      if (remaining <= 0) {
        setTimeLeft('');
        setIsOpen(false);
        clearInterval(interval);
      } else {
        const mins = Math.floor(remaining / 60000);
        const secs = Math.floor((remaining % 60000) / 1000);
        setTimeLeft(`${mins}:${secs < 10 ? '0' : ''}${secs}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [sleepTimerTarget]);

  const options = [15, 30, 45, 60, 90, 120];

  const handleSelect = (mins) => {
    setSleepTimer(mins);
    setIsOpen(false);
  };

  return (
    <div className="sleep-timer" style={{ position: 'relative' }}>
      <button 
        className={`player-controls__btn player-controls__btn--sm ${sleepTimerTarget ? 'is-active' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        title="Hẹn giờ tắt"
        style={{ color: sleepTimerTarget ? 'var(--color-primary)' : 'inherit', display: 'flex', alignItems: 'center', gap: '4px' }}
      >
        <span>⏱️</span>
        {timeLeft && <span style={{ fontSize: '0.7rem' }}>{timeLeft}</span>}
      </button>

      {isOpen && (
        <div className="sleep-timer__menu" style={{ 
          position: 'absolute', 
          bottom: '100%', 
          right: '0', 
          marginBottom: '10px',
          background: 'var(--color-surface)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-md)',
          padding: '8px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          boxShadow: 'var(--shadow-lg)',
          zIndex: 100,
          minWidth: '120px'
        }}>
          <div style={{ fontSize: '0.8rem', padding: '4px', textAlign: 'center', color: 'var(--color-text-muted)' }}>
            Hẹn giờ tắt
          </div>
          {options.map(mins => (
            <button 
              key={mins}
              onClick={() => handleSelect(mins)}
              style={{
                padding: '8px',
                background: 'transparent',
                border: 'none',
                color: 'var(--color-text)',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: '4px',
              }}
              onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              {mins} phút
            </button>
          ))}
          {sleepTimerTarget && (
             <button 
               onClick={() => handleSelect(null)}
               style={{
                 padding: '8px',
                 background: 'transparent',
                 border: 'none',
                 color: 'var(--color-error)',
                 textAlign: 'left',
                 cursor: 'pointer',
                 borderRadius: '4px',
                 marginTop: '4px',
                 borderTop: '1px solid var(--color-border)'
               }}
               onMouseOver={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
               onMouseOut={e => e.currentTarget.style.background = 'transparent'}
             >
               Tắt hẹn giờ
             </button>
          )}
        </div>
      )}
    </div>
  );
}
