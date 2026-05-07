import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Track } from '../types';

interface PlayerContextType {
  tracks: Track[];
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  shuffle: boolean;
  repeat: 'none' | 'all' | 'one';
  queue: Track[];
  addTracks: (tracks: Track[]) => void;
  removeTrack: (id: string) => void;
  playTrack: (track: Track) => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (vol: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
  toggleLike: (id: string) => void;
  likedTracks: Track[];
  audioRef: React.RefObject<HTMLAudioElement | null>;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const likedTracks = tracks.filter(t => t.liked);

  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      if (repeat === 'one') {
        audio.currentTime = 0;
        audio.play();
      } else {
        nextTrackInternal();
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('durationchange', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('durationchange', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const nextTrackInternal = useCallback(() => {
    setTracks(prev => {
      setCurrentTrack(curr => {
        if (!curr || prev.length === 0) return curr;
        const idx = prev.findIndex(t => t.id === curr.id);
        let nextIdx: number;
        if (shuffle) {
          nextIdx = Math.floor(Math.random() * prev.length);
        } else {
          nextIdx = (idx + 1) % prev.length;
        }
        if (nextIdx === idx && prev.length > 1) return curr;
        const next = prev[nextIdx];
        if (audioRef.current) {
          audioRef.current.src = next.url;
          audioRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
        return next;
      });
      return prev;
    });
  }, [shuffle]);

  const addTracks = useCallback((newTracks: Track[]) => {
    setTracks(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const unique = newTracks.filter(t => !existingIds.has(t.id));
      return [...prev, ...unique];
    });
  }, []);

  const removeTrack = useCallback((id: string) => {
    setTracks(prev => {
      const filtered = prev.filter(t => t.id !== id);
      return filtered;
    });
    setCurrentTrack(curr => {
      if (curr?.id === id) {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.src = '';
        }
        setIsPlaying(false);
        return null;
      }
      return curr;
    });
  }, []);

  const playTrack = useCallback((track: Track) => {
    if (audioRef.current) {
      audioRef.current.src = track.url;
      audioRef.current.play().catch(() => {});
    }
    setCurrentTrack(track);
    setIsPlaying(true);
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  }, [isPlaying, currentTrack]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  const setVolume = useCallback((vol: number) => {
    setVolumeState(vol);
  }, []);

  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);

  const toggleRepeat = useCallback(() => {
    setRepeat(r => {
      if (r === 'none') return 'all';
      if (r === 'all') return 'one';
      return 'none';
    });
  }, []);

  const nextTrack = useCallback(() => {
    setTracks(prev => {
      setCurrentTrack(curr => {
        if (!curr || prev.length === 0) return curr;
        const idx = prev.findIndex(t => t.id === curr.id);
        let nextIdx: number;
        if (shuffle) {
          nextIdx = Math.floor(Math.random() * prev.length);
        } else {
          nextIdx = (idx + 1) % prev.length;
        }
        const next = prev[nextIdx];
        if (audioRef.current) {
          audioRef.current.src = next.url;
          audioRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
        return next;
      });
      return prev;
    });
  }, [shuffle]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    setTracks(prev => {
      setCurrentTrack(curr => {
        if (!curr || prev.length === 0) return curr;
        const idx = prev.findIndex(t => t.id === curr.id);
        const prevIdx = (idx - 1 + prev.length) % prev.length;
        const prevT = prev[prevIdx];
        if (audioRef.current) {
          audioRef.current.src = prevT.url;
          audioRef.current.play().catch(() => {});
        }
        setIsPlaying(true);
        return prevT;
      });
      return prev;
    });
  }, []);

  const toggleLike = useCallback((id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, liked: !t.liked } : t));
    setCurrentTrack(curr => curr?.id === id ? { ...curr, liked: !curr.liked } : curr);
  }, []);

  return (
    <PlayerContext.Provider value={{
      tracks,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      shuffle,
      repeat,
      queue: tracks,
      addTracks,
      removeTrack,
      playTrack,
      togglePlay,
      seek,
      setVolume,
      toggleShuffle,
      toggleRepeat,
      nextTrack,
      prevTrack,
      toggleLike,
      likedTracks,
      audioRef,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
