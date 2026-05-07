import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

interface NowPlayingModalProps {
  open: boolean;
  onClose: () => void;
}

export const NowPlayingModal: React.FC<NowPlayingModalProps> = ({ open, onClose }) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    shuffle,
    repeat,
    togglePlay,
    seek,
    setVolume,
    toggleShuffle,
    toggleRepeat,
    nextTrack,
    prevTrack,
    toggleLike,
  } = usePlayer();

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Panel */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 flex flex-col md:hidden
          bg-gradient-to-b from-[#1a1a2e] via-[#16213e] to-[#0f0f0f]
          rounded-t-3xl transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
          ${open ? 'translate-y-0' : 'translate-y-full'}
        `}
        style={{ height: '92dvh', paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-white/20 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
          <button onClick={onClose} className="text-white/70 hover:text-white transition-colors p-1">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path d="M12 13.414l-4.293 4.293-1.414-1.414L10.586 12 6.293 7.707l1.414-1.414L12 10.586l4.293-4.293 1.414 1.414L13.414 12l4.293 4.293-1.414 1.414z" />
            </svg>
          </button>
          <div className="text-center">
            <p className="text-white/50 text-xs font-semibold uppercase tracking-widest">Reproduciendo ahora</p>
          </div>
          <button
            onClick={() => currentTrack && toggleLike(currentTrack.id)}
            className={`p-1 transition-colors ${currentTrack?.liked ? 'text-[#1DB954]' : 'text-white/70 hover:text-white'}`}
          >
            <svg viewBox="0 0 24 24" fill={currentTrack?.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-6 h-6">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" />
            </svg>
          </button>
        </div>

        {/* Album art */}
        <div className="flex-1 flex items-center justify-center px-10 py-4 min-h-0">
          <div
            className={`aspect-square w-full max-w-[280px] rounded-2xl flex items-center justify-center shadow-2xl
              bg-gradient-to-br from-[#1DB954]/30 to-[#121212]
              border border-white/10
              transition-transform duration-300
              ${isPlaying ? 'scale-100' : 'scale-90'}
            `}
            style={{ boxShadow: '0 30px 80px rgba(29,185,84,0.25)' }}
          >
            <span className="text-8xl select-none">
              {currentTrack ? (currentTrack.type === 'video' ? '🎬' : '🎵') : '🎵'}
            </span>
          </div>
        </div>

        {/* Track info + controls */}
        <div className="flex-shrink-0 px-6 pb-4 flex flex-col gap-5">
          {/* Title & artist */}
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h2 className="text-white font-bold text-xl truncate">
                {currentTrack?.name ?? 'Sin reproducción'}
              </h2>
              <p className="text-white/50 text-sm truncate mt-0.5">
                {currentTrack?.artist ?? '—'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="flex flex-col gap-1">
            <div className="relative w-full h-1 group">
              <input
                type="range"
                min={0}
                max={duration || 100}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #1DB954 ${progress}%, rgba(255,255,255,0.15) ${progress}%)`
                }}
              />
            </div>
            <div className="flex justify-between">
              <span className="text-white/40 text-xs">{formatTime(currentTime)}</span>
              <span className="text-white/40 text-xs">{formatTime(duration)}</span>
            </div>
          </div>

          {/* Main controls */}
          <div className="flex items-center justify-between">
            {/* Shuffle */}
            <button
              onClick={toggleShuffle}
              className={`transition-colors ${shuffle ? 'text-[#1DB954]' : 'text-white/40 hover:text-white'}`}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356A2.25 2.25 0 0 1 11.16 4.5h1.949l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
                <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.946l-1.016-1.018a.75.75 0 1 1 1.061-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06l1.016-1.018H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.937z" />
              </svg>
            </button>

            {/* Prev */}
            <button onClick={prevTrack} className="text-white hover:text-white/70 transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-7 h-7">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
              </svg>
            </button>

            {/* Play/Pause */}
            <button
              onClick={togglePlay}
              className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-transform"
            >
              {isPlaying ? (
                <svg viewBox="0 0 16 16" fill="black" className="w-6 h-6">
                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="black" className="w-6 h-6">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                </svg>
              )}
            </button>

            {/* Next */}
            <button onClick={nextTrack} className="text-white hover:text-white/70 transition-colors">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-7 h-7">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
              </svg>
            </button>

            {/* Repeat */}
            <button
              onClick={toggleRepeat}
              className={`transition-colors relative ${repeat !== 'none' ? 'text-[#1DB954]' : 'text-white/40 hover:text-white'}`}
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L7.939 13.75l1.829-1.829a.75.75 0 1 1 1.06 1.06L9.811 14h2.439A2.25 2.25 0 0 0 14.5 11.75v-5A2.25 2.25 0 0 0 12.25 4.5h-8.5A2.25 2.25 0 0 0 1.5 6.75v5A2.25 2.25 0 0 0 3.75 14H5v1.5H3.75A3.75 3.75 0 0 1 0 11.75v-7z" />
              </svg>
              {repeat === 'one' && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#1DB954] rounded-full text-[7px] flex items-center justify-center text-black font-bold">1</span>
              )}
            </button>
          </div>

          {/* Volume */}
          <div className="flex items-center gap-3">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-white/40 flex-shrink-0">
              <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.8l5.8 3.35V2.85L2.817 6.15z" />
            </svg>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolume}
              className="flex-1 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, rgba(255,255,255,0.7) ${volume * 100}%, rgba(255,255,255,0.15) ${volume * 100}%)`
              }}
            />
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-white/40 flex-shrink-0">
              <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.8l5.8 3.35V2.85L2.817 6.15z" />
              <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.128v1.55z" />
              <path d="M13.5 15.206a7.752 7.752 0 0 0 0-14.412v1.55a6.252 6.252 0 0 1 0 11.312v1.55z" />
            </svg>
          </div>
        </div>
      </div>
    </>
  );
};
