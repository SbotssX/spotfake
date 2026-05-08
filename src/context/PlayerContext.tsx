import React, { createContext, useContext, useState, useRef, useCallback, useEffect } from 'react';
import { Track } from '../types';
import { saveTracksForUser, loadTracksForUser, PersistedTrack } from './trackStorage';

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
  storageReady: boolean;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error('usePlayer must be used within PlayerProvider');
  return ctx;
};

const getActiveUser = (): string | null => localStorage.getItem('spotifake_session');

const persistedToTrack = (p: PersistedTrack): Track => ({
  id: p.id,
  name: p.name,
  artist: p.artist,
  album: p.album,
  duration: p.duration,
  url: URL.createObjectURL(p.fileBlob),
  type: p.type,
  file: new File([p.fileBlob], p.fileName, { type: p.fileBlob.type }),
  liked: p.liked,
  addedAt: new Date(p.addedAt),
});

const trackToPersisted = (t: Track): PersistedTrack => ({
  id: t.id,
  name: t.name,
  artist: t.artist,
  album: t.album,
  duration: t.duration,
  type: t.type,
  liked: t.liked,
  addedAt: t.addedAt.toISOString(),
  fileBlob: t.file,
  fileName: t.file.name,
  fileSize: t.file.size,
});

export const PlayerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState<'none' | 'all' | 'one'>('none');
  const [storageReady, setStorageReady] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const tracksRef = useRef<Track[]>([]);

  const likedTracks = tracks.filter(t => t.liked);

  useEffect(() => { tracksRef.current = tracks; }, [tracks]);

  // Cargar canciones guardadas al iniciar
  useEffect(() => {
    const username = getActiveUser();
    if (!username) { setStorageReady(true); return; }
    loadTracksForUser(username).then(persisted => {
      if (persisted.length > 0) {
        setTracks(persisted.map(persistedToTrack));
      }
      setStorageReady(true);
    });
  }, []);

  // Guardar canciones cuando cambien (debounced 500ms)
  useEffect(() => {
    if (!storageReady) return;
    const username = getActiveUser();
    if (!username) return;
    const timer = setTimeout(() => {
      saveTracksForUser(username, tracks.map(trackToPersisted));
    }, 500);
    return () => clearTimeout(timer);
  }, [tracks, storageReady]);

  // Configurar elemento de audio
  useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    audio.volume = volume;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleDurationChange = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setRepeat(currentRepeat => {
        if (currentRepeat === 'one') {
          audio.currentTime = 0;
          audio.play();
        } else {
          const prev = tracksRef.current;
          setCurrentTrack(curr => {
            if (!curr || prev.length === 0) return curr;
            const idx = prev.findIndex(t => t.id === curr.id);
            const nextIdx = (idx + 1) % prev.length;
            if (nextIdx === idx && prev.length > 1) return curr;
            const next = prev[nextIdx];
            audio.src = next.url;
            audio.play().catch(() => {});
            setIsPlaying(true);
            return next;
          });
        }
        return currentRepeat;
      });
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
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const addTracks = useCallback((newTracks: Track[]) => {
    setTracks(prev => {
      const existingIds = new Set(prev.map(t => t.id));
      const unique = newTracks.filter(t => !existingIds.has(t.id));
      return [...prev, ...unique];
    });
  }, []);

  const removeTrack = useCallback((id: string) => {
    setTracks(prev => prev.filter(t => t.id !== id));
    setCurrentTrack(curr => {
      if (curr?.id === id) {
        if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ''; }
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

  const setVolume = useCallback((vol: number) => setVolumeState(vol), []);
  const toggleShuffle = useCallback(() => setShuffle(s => !s), []);
  const toggleRepeat = useCallback(() => {
    setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none');
  }, []);

  const nextTrack = useCallback(() => {
    const prev = tracksRef.current;
    setCurrentTrack(curr => {
      if (!curr || prev.length === 0) return curr;
      const idx = prev.findIndex(t => t.id === curr.id);
      const nextIdx = shuffle ? Math.floor(Math.random() * prev.length) : (idx + 1) % prev.length;
      const next = prev[nextIdx];
      if (audioRef.current) { audioRef.current.src = next.url; audioRef.current.play().catch(() => {}); }
      setIsPlaying(true);
      return next;
    });
  }, [shuffle]);

  const prevTrack = useCallback(() => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      return;
    }
    const prev = tracksRef.current;
    setCurrentTrack(curr => {
      if (!curr || prev.length === 0) return curr;
      const idx = prev.findIndex(t => t.id === curr.id);
      const prevIdx = (idx - 1 + prev.length) % prev.length;
      const prevT = prev[prevIdx];
      if (audioRef.current) { audioRef.current.src = prevT.url; audioRef.current.play().catch(() => {}); }
      setIsPlaying(true);
      return prevT;
    });
  }, []);

  const toggleLike = useCallback((id: string) => {
    setTracks(prev => prev.map(t => t.id === id ? { ...t, liked: !t.liked } : t));
    setCurrentTrack(curr => curr?.id === id ? { ...curr, liked: !curr.liked } : curr);
  }, []);

  return (
    <PlayerContext.Provider value={{
      tracks, currentTrack, isPlaying, currentTime, duration, volume,
      shuffle, repeat, queue: tracks, addTracks, removeTrack, playTrack,
      togglePlay, seek, setVolume, toggleShuffle, toggleRepeat,
      nextTrack, prevTrack, toggleLike, likedTracks, audioRef, storageReady,
    }}>
      {children}
    </PlayerContext.Provider>
  );
};
