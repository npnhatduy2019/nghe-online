'use client';

import { createContext, useContext, useReducer, useCallback, useEffect, useRef } from 'react';
import { getFromStorage, setToStorage } from '@/utils/storage';
import {
  STORAGE_KEYS,
  REPEAT_MODES,
  DEFAULT_VOLUME,
  DEFAULT_SPEED,
} from '@/utils/constants';

const PlayerContext = createContext(null);

// ─── Action Types ────────────────────────────────────────
const ACTIONS = {
  SET_TRACK: 'SET_TRACK',
  SET_PLAYING: 'SET_PLAYING',
  SET_LOADING: 'SET_LOADING',
  SET_DURATION: 'SET_DURATION',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_VOLUME: 'SET_VOLUME',
  SET_SPEED: 'SET_SPEED',
  SET_REPEAT: 'SET_REPEAT',
  SET_SHUFFLE: 'SET_SHUFFLE',
  SET_QUEUE: 'SET_QUEUE',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  CLEAR_QUEUE: 'CLEAR_QUEUE',
  PLAY_NEXT_IN_QUEUE: 'PLAY_NEXT_IN_QUEUE',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SET_ERROR: 'SET_ERROR',
  SET_AUDIO_URL: 'SET_AUDIO_URL',
  REORDER_QUEUE: 'REORDER_QUEUE',
  SET_SLEEP_TIMER_TARGET: 'SET_SLEEP_TIMER_TARGET',
};

// ─── Initial State ───────────────────────────────────────
function getInitialState() {
  return {
    currentTrack: null,
    audioUrl: null,
    isPlaying: false,
    isLoading: false,
    duration: 0,
    currentTime: 0,
    volume: DEFAULT_VOLUME,
    playbackSpeed: DEFAULT_SPEED,
    repeatMode: REPEAT_MODES.NONE,
    isShuffle: false,
    queue: [],
    history: [],
    error: null,
    sleepTimerTarget: null,
  };
}

// ─── Reducer ─────────────────────────────────────────────
function playerReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_TRACK:
      return {
        ...state,
        currentTrack: action.payload,
        audioUrl: null,
        isLoading: true,
        error: null,
        currentTime: 0,
        duration: 0,
      };

    case ACTIONS.SET_AUDIO_URL:
      return { ...state, audioUrl: action.payload, isLoading: false };

    case ACTIONS.SET_PLAYING:
      return { ...state, isPlaying: action.payload };

    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_DURATION:
      return { ...state, duration: action.payload };

    case ACTIONS.SET_CURRENT_TIME:
      return { ...state, currentTime: action.payload };

    case ACTIONS.SET_VOLUME:
      return { ...state, volume: action.payload };

    case ACTIONS.SET_SPEED:
      return { ...state, playbackSpeed: action.payload };

    case ACTIONS.SET_REPEAT:
      return { ...state, repeatMode: action.payload };

    case ACTIONS.SET_SHUFFLE:
      return { ...state, isShuffle: action.payload };

    case ACTIONS.SET_QUEUE:
      return { ...state, queue: action.payload };

    case ACTIONS.ADD_TO_QUEUE:
      return { ...state, queue: [...state.queue, action.payload] };

    case ACTIONS.REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: state.queue.filter((_, i) => i !== action.payload),
      };

    case ACTIONS.CLEAR_QUEUE:
      return { ...state, queue: [] };

    case ACTIONS.REORDER_QUEUE:
      return { ...state, queue: action.payload };

    case ACTIONS.ADD_TO_HISTORY:
      return {
        ...state,
        history: [action.payload, ...state.history].slice(0, 50),
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ACTIONS.SET_SLEEP_TIMER_TARGET:
      return { ...state, sleepTimerTarget: action.payload };

    default:
      return state;
  }
}

// ─── Provider ────────────────────────────────────────────
export function PlayerProvider({ children }) {
  const [state, dispatch] = useReducer(playerReducer, null, getInitialState);
  const audioRef = useRef(null);
  const isInitialized = useRef(false);
  const sleepTimerRef = useRef(null);
  const lastSavedTimeRef = useRef(0);

  // Hydrate persisted state from localStorage
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const volume = getFromStorage(STORAGE_KEYS.VOLUME, DEFAULT_VOLUME);
    const speed = getFromStorage(STORAGE_KEYS.SPEED, DEFAULT_SPEED);
    const repeat = getFromStorage(STORAGE_KEYS.REPEAT, REPEAT_MODES.NONE);
    const shuffle = getFromStorage(STORAGE_KEYS.SHUFFLE, false);
    const queue = getFromStorage(STORAGE_KEYS.QUEUE, []);
    const history = getFromStorage(STORAGE_KEYS.HISTORY, []);

    dispatch({ type: ACTIONS.SET_VOLUME, payload: volume });
    dispatch({ type: ACTIONS.SET_SPEED, payload: speed });
    dispatch({ type: ACTIONS.SET_REPEAT, payload: repeat });
    dispatch({ type: ACTIONS.SET_SHUFFLE, payload: shuffle });
    dispatch({ type: ACTIONS.SET_QUEUE, payload: queue });
    if (history.length > 0) {
      // Restore history
      history.forEach((track) => {
        dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
      });
    }

    // Restore last playing track and time
    const savedTrack = getFromStorage(STORAGE_KEYS.CURRENT_TRACK, null);
    const savedTime = getFromStorage(STORAGE_KEYS.CURRENT_TIME, 0);
    if (savedTrack) {
      dispatch({ type: ACTIONS.SET_TRACK, payload: savedTrack });
      // We will seek to savedTime after audio is loaded
      lastSavedTimeRef.current = savedTime;
    }
  }, []);

  // Persist queue changes
  useEffect(() => {
    if (isInitialized.current) {
      setToStorage(STORAGE_KEYS.QUEUE, state.queue);
    }
  }, [state.queue]);

  // Persist settings changes
  useEffect(() => {
    setToStorage(STORAGE_KEYS.VOLUME, state.volume);
  }, [state.volume]);

  useEffect(() => {
    setToStorage(STORAGE_KEYS.SPEED, state.playbackSpeed);
  }, [state.playbackSpeed]);

  useEffect(() => {
    setToStorage(STORAGE_KEYS.REPEAT, state.repeatMode);
  }, [state.repeatMode]);

  useEffect(() => {
    setToStorage(STORAGE_KEYS.SHUFFLE, state.isShuffle);
  }, [state.isShuffle]);

  // ─── Audio element management ──────────────────────────
  // Create audio element once
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;

    // iOS Audio Unlock: Safari requires audio to be played synchronously on user interaction
    const unlockAudio = () => {
      if (!audio.src || audio.src === window.location.href) {
        // Play a silent base64 mp3 to unlock the audio element
        audio.src = 'data:audio/mp3;base64,//OExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq';
        audio.play().then(() => {
          audio.pause();
        }).catch(() => {});
      }
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };

    document.addEventListener('touchstart', unlockAudio, { once: true });
    document.addEventListener('click', unlockAudio, { once: true });

    const onTimeUpdate = () => {
      const time = audio.currentTime;
      dispatch({ type: ACTIONS.SET_CURRENT_TIME, payload: time });
      
      // Save current time every ~5 seconds
      if (Math.abs(time - lastSavedTimeRef.current) > 5) {
         lastSavedTimeRef.current = time;
         setToStorage(STORAGE_KEYS.CURRENT_TIME, time);
      }
    };

    const onDurationChange = () => {
      if (audio.duration && isFinite(audio.duration)) {
        dispatch({ type: ACTIONS.SET_DURATION, payload: audio.duration });
      }
    };

    const onPlay = () => dispatch({ type: ACTIONS.SET_PLAYING, payload: true });
    const onPause = () => dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
    const onEnded = () => handleTrackEnded();
    const onError = (e) => {
      console.error('[PlayerContext] Audio error:', e);
      dispatch({ type: ACTIONS.SET_ERROR, payload: 'Không thể phát audio. Thử lại sau.' });
    };
    const onWaiting = () => dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    const onCanPlay = () => {
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      // If we have a saved time to restore, seek to it
      if (lastSavedTimeRef.current > 0 && audio.currentTime < 1) {
        audio.currentTime = lastSavedTimeRef.current;
        // Only restore once per track load
        lastSavedTimeRef.current = 0;
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('waiting', onWaiting);
    audio.addEventListener('canplay', onCanPlay);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('waiting', onWaiting);
      audio.removeEventListener('canplay', onCanPlay);
      document.removeEventListener('touchstart', unlockAudio);
      document.removeEventListener('click', unlockAudio);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync volume to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = state.volume;
    }
  }, [state.volume]);

  // Sync playback speed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = state.playbackSpeed;
    }
  }, [state.playbackSpeed]);

  // ─── Fetch audio URL when track changes ────────────────
  useEffect(() => {
    if (!state.currentTrack) return;

    // Save track
    setToStorage(STORAGE_KEYS.CURRENT_TRACK, state.currentTrack);
    // Reset saved time on new track unless we just restored it in the initial load
    if (lastSavedTimeRef.current > 0 && getFromStorage(STORAGE_KEYS.CURRENT_TRACK)?.id !== state.currentTrack.id) {
       lastSavedTimeRef.current = 0;
       setToStorage(STORAGE_KEYS.CURRENT_TIME, 0);
    }

    let cancelled = false;

    async function fetchAudioUrl() {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        const res = await fetch(`/api/stream?id=${state.currentTrack.id}`);
        const data = await res.json();

        if (cancelled) return;

        if (!data.success) {
          throw new Error(data.error || 'Failed to get audio URL');
        }

        dispatch({ type: ACTIONS.SET_AUDIO_URL, payload: data.data.audioUrl });

        // Set audio source and play
        if (audioRef.current) {
          audioRef.current.src = data.data.audioUrl;
          audioRef.current.playbackRate = state.playbackSpeed;
          try {
            await audioRef.current.play();
          } catch (playErr) {
            console.warn('[PlayerContext] Autoplay blocked:', playErr.message);
          }
        }
      } catch (err) {
        if (!cancelled) {
          console.error('[PlayerContext] Stream error:', err);
          dispatch({ type: ACTIONS.SET_ERROR, payload: err.message });
        }
      }
    }

    fetchAudioUrl();
    return () => { cancelled = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.currentTrack]);

  // ─── Track ended handler ───────────────────────────────
  const handleTrackEnded = useCallback(() => {
    const { repeatMode, queue, isShuffle, currentTrack } = state;

    // Repeat one: replay same track
    if (repeatMode === REPEAT_MODES.ONE && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    // Has next in queue
    if (queue.length > 0) {
      let nextIndex = 0;
      if (isShuffle) {
        nextIndex = Math.floor(Math.random() * queue.length);
      }

      const nextTrack = queue[nextIndex];
      const newQueue = queue.filter((_, i) => i !== nextIndex);

      if (currentTrack) {
        dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: currentTrack });
      }
      dispatch({ type: ACTIONS.SET_QUEUE, payload: newQueue });
      dispatch({ type: ACTIONS.SET_TRACK, payload: nextTrack });
      return;
    }

    // Repeat all with history: restart from beginning
    if (repeatMode === REPEAT_MODES.ALL && state.history.length > 0) {
      const allTracks = [...state.history].reverse();
      if (currentTrack) allTracks.push(currentTrack);

      const firstTrack = allTracks[0];
      const restQueue = allTracks.slice(1);

      dispatch({ type: ACTIONS.SET_QUEUE, payload: restQueue });
      dispatch({ type: ACTIONS.SET_TRACK, payload: firstTrack });
      return;
    }

    // No more tracks — stop
    dispatch({ type: ACTIONS.SET_PLAYING, payload: false });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.repeatMode, state.queue, state.isShuffle, state.currentTrack, state.history]);

  // ─── Actions ───────────────────────────────────────────
  const playTrack = useCallback((track) => {
    if (state.currentTrack) {
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: state.currentTrack });
    }
    dispatch({ type: ACTIONS.SET_TRACK, payload: track });
  }, [state.currentTrack]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !state.audioUrl) return;

    if (state.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(() => {});
    }
  }, [state.isPlaying, state.audioUrl]);

  const seek = useCallback((time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: ACTIONS.SET_CURRENT_TIME, payload: time });
    }
  }, []);

  const setVolume = useCallback((vol) => {
    dispatch({ type: ACTIONS.SET_VOLUME, payload: Math.max(0, Math.min(1, vol)) });
  }, []);

  const setSpeed = useCallback((speed) => {
    dispatch({ type: ACTIONS.SET_SPEED, payload: speed });
  }, []);

  const cycleRepeat = useCallback(() => {
    const modes = [REPEAT_MODES.NONE, REPEAT_MODES.ALL, REPEAT_MODES.ONE];
    const currentIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentIndex + 1) % modes.length];
    dispatch({ type: ACTIONS.SET_REPEAT, payload: nextMode });
  }, [state.repeatMode]);

  const toggleShuffle = useCallback(() => {
    dispatch({ type: ACTIONS.SET_SHUFFLE, payload: !state.isShuffle });
  }, [state.isShuffle]);

  const addToQueue = useCallback((track) => {
    dispatch({ type: ACTIONS.ADD_TO_QUEUE, payload: track });
  }, []);

  const playNext = useCallback((track) => {
    dispatch({
      type: ACTIONS.SET_QUEUE,
      payload: [track, ...state.queue],
    });
  }, [state.queue]);

  const removeFromQueue = useCallback((index) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_QUEUE, payload: index });
  }, []);

  const clearQueue = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_QUEUE });
  }, []);

  const reorderQueue = useCallback((newQueue) => {
    dispatch({ type: ACTIONS.REORDER_QUEUE, payload: newQueue });
  }, []);

  const playNextTrack = useCallback(() => {
    handleTrackEnded();
  }, [handleTrackEnded]);

  const playPrevTrack = useCallback(() => {
    // If more than 3 seconds in, restart current track
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }

    // Go to previous track from history
    if (state.history.length > 0) {
      const prevTrack = state.history[0];
      const newHistory = state.history.slice(1);

      // Put current track back to front of queue
      if (state.currentTrack) {
        dispatch({
          type: ACTIONS.SET_QUEUE,
          payload: [state.currentTrack, ...state.queue],
        });
      }

      dispatch({ type: ACTIONS.SET_TRACK, payload: prevTrack });
      // We need to manually set history since SET_TRACK doesn't modify it
      // Actually, we store history separately
    } else if (audioRef.current) {
      // No history — restart current track
      audioRef.current.currentTime = 0;
    }
  }, [state.history, state.currentTrack, state.queue]);

  const setSleepTimer = useCallback((minutes) => {
    if (sleepTimerRef.current) {
      clearTimeout(sleepTimerRef.current);
      sleepTimerRef.current = null;
    }

    if (minutes === null || minutes <= 0) {
      dispatch({ type: ACTIONS.SET_SLEEP_TIMER_TARGET, payload: null });
      return;
    }

    const targetTime = Date.now() + minutes * 60 * 1000;
    dispatch({ type: ACTIONS.SET_SLEEP_TIMER_TARGET, payload: targetTime });

    sleepTimerRef.current = setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      dispatch({ type: ACTIONS.SET_SLEEP_TIMER_TARGET, payload: null });
    }, minutes * 60 * 1000);
  }, []);

  const value = {
    ...state,
    audioRef,
    playTrack,
    togglePlay,
    seek,
    setVolume,
    setSpeed,
    cycleRepeat,
    toggleShuffle,
    addToQueue,
    playNext,
    removeFromQueue,
    clearQueue,
    reorderQueue,
    playNextTrack,
    playPrevTrack,
    setSleepTimer,
  };

  return (
    <PlayerContext.Provider value={value}>
      {children}
    </PlayerContext.Provider>
  );
}

/**
 * Hook to access the PlayerContext.
 */
export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error('usePlayer must be used within a PlayerProvider');
  }
  return context;
}

export default PlayerContext;
