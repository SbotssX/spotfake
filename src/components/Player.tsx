import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { NowPlayingModal } from './NowPlayingModal';

const formatTime = (s: number) => {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const Player: React.FC = () => {
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

  const [showVolume, setShowVolume] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  const VolumeIcon = () => {
    if (volume === 0) return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M13.86 5.47a.75.75 0 0 0-1.061 0l-1.47 1.47-1.47-1.47A.75.75 0 0 0 8.8 6.53L10.269 8l-1.47 1.47a.75.75 0 1 0 1.06 1.06l1.47-1.47 1.47 1.47a.75.75 0 0 0 1.06-1.06L12.39 8l1.47-1.47a.75.75 0 0 0 0-1.06z" />
        <path d="M10.116 1.5A.75.75 0 0 0 8.991.85l-6.925 4a3.642 3.642 0 0 0-1.33 4.967 3.639 3.639 0 0 0 1.33 1.332l6.925 4a.75.75 0 0 0 1.125-.649v-1.906a4.73 4.73 0 0 1-1.5-.694v1.3L2.817 9.852a2.141 2.141 0 0 1-.781-2.92c.187-.324.456-.594.781-.78l5.8-3.35v1.3c.45-.313.956-.55 1.5-.694V1.5z" />
      </svg>
    );
    if (volume < 0.5) return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.8l5.8 3.35V2.85L2.817 6.15z" />
        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.128v1.55z" />
      </svg>
    );
    return (
      <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
        <path d="M9.741.85a.75.75 0 0 1 .375.65v13a.75.75 0 0 1-1.125.65l-6.925-4a3.642 3.642 0 0 1-1.33-4.967 3.639 3.639 0 0 1 1.33-1.332l6.925-4a.75.75 0 0 1 .75 0zm-6.924 5.3a2.139 2.139 0 0 0 0 3.8l5.8 3.35V2.85L2.817 6.15z" />
        <path d="M11.5 13.614a5.752 5.752 0 0 0 0-11.228v1.55a4.252 4.252 0 0 1 0 8.128v1.55z" />
        <path d="M13.5 15.206a7.752 7.752 0 0 0 0-14.412v1.55a6.252 6.252 0 0 1 0 11.312v1.55z" />
      </svg>
    );
  };

  return (
    <>
      <NowPlayingModal open={showModal} onClose={() => setShowModal(false)} />

      {/* ── MÓVIL: barra compacta ── */}
      <footer className="flex md:hidden bg-[#181818] border-t border-[#282828] flex-shrink-0 items-center px-3 gap-2 h-16">
        {/* Portada + info — abre modal */}
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 min-w-0 flex-1 text-left"
        >
          <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 text-lg">
            {currentTrack ? (currentTrack.type === 'video' ? '🎬' : '🎵') : '🎵'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-white text-sm font-medium truncate leading-tight">
              {currentTrack?.name ?? 'Sin reproducción'}
            </p>
            <p className="text-[#b3b3b3] text-xs truncate leading-tight">
              {currentTrack?.artist ?? '—'}
            </p>
          </div>
        </button>

        {/* Like */}
        {currentTrack && (
          <button
            onClick={() => toggleLike(currentTrack.id)}
            className={`flex-shrink-0 p-1 transition-colors ${currentTrack.liked ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}
          >
            <svg viewBox="0 0 24 24" fill={currentTrack.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" />
            </svg>
          </button>
        )}

        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className="flex-shrink-0 w-9 h-9 bg-white rounded-full flex items-center justify-center active:scale-95 transition-transform"
        >
          {isPlaying ? (
            <svg viewBox="0 0 16 16" fill="black" className="w-4 h-4">
              <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
            </svg>
          ) : (
            <svg viewBox="0 0 16 16" fill="black" className="w-4 h-4">
              <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
            </svg>
          )}
        </button>

        {/* Next */}
        <button onClick={nextTrack} className="flex-shrink-0 p-1 text-[#b3b3b3] active:text-white transition-colors">
          <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
            <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
          </svg>
        </button>
      </footer>

      {/* ── ESCRITORIO: player completo ── */}
      <footer className="hidden md:flex h-[90px] bg-[#181818] border-t border-[#282828] items-center px-4 gap-4 flex-shrink-0">
        {/* Left: Track info */}
        <div className="flex items-center gap-3 w-72 min-w-0">
          {currentTrack ? (
            <>
              <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 text-2xl">
                {currentTrack.type === 'video' ? '🎬' : '🎵'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{currentTrack.name}</p>
                <p className="text-[#b3b3b3] text-xs truncate">{currentTrack.artist}</p>
              </div>
              <button
                onClick={() => toggleLike(currentTrack.id)}
                className={`flex-shrink-0 transition-colors ${currentTrack.liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}
              >
                <svg viewBox="0 0 24 24" fill={currentTrack.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                  <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" />
                </svg>
              </button>
            </>
          ) : (
            <div className="text-[#b3b3b3] text-sm">No hay nada reproduciéndose</div>
          )}
        </div>

        {/* Center: Controls */}
        <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleShuffle} className={`transition-colors hover:scale-105 ${shuffle ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356A2.25 2.25 0 0 1 11.16 4.5h1.949l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
                <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.946l-1.016-1.018a.75.75 0 1 1 1.061-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06l1.016-1.018H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.937z" />
              </svg>
            </button>
            <button onClick={prevTrack} className="text-[#b3b3b3] hover:text-white transition-colors hover:scale-105">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
              </svg>
            </button>
            <button onClick={togglePlay} className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              {isPlaying ? (
                <svg viewBox="0 0 16 16" fill="black" className="w-4 h-4">
                  <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
                </svg>
              ) : (
                <svg viewBox="0 0 16 16" fill="black" className="w-4 h-4">
                  <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
                </svg>
              )}
            </button>
            <button onClick={nextTrack} className="text-[#b3b3b3] hover:text-white transition-colors hover:scale-105">
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
                <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
              </svg>
            </button>
            <button onClick={toggleRepeat} className={`transition-colors hover:scale-105 relative ${repeat !== 'none' ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}>
              <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
                <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L7.939 13.75l1.829-1.829a.75.75 0 1 1 1.06 1.06L9.811 14h2.439A2.25 2.25 0 0 0 14.5 11.75v-5A2.25 2.25 0 0 0 12.25 4.5h-8.5A2.25 2.25 0 0 0 1.5 6.75v5A2.25 2.25 0 0 0 3.75 14H5v1.5H3.75A3.75 3.75 0 0 1 0 11.75v-7z" />
              </svg>
              {repeat === 'one' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1DB954] rounded-full text-[6px] flex items-center justify-center text-black font-bold">1</span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 w-full max-w-lg">
            <span className="text-[#b3b3b3] text-xs w-9 text-right">{formatTime(currentTime)}</span>
            <div className="flex-1 relative group">
              <input
                type="range" min={0} max={duration || 100} value={currentTime} onChange={handleSeek}
                className="w-full h-1 bg-[#535353] rounded-full appearance-none cursor-pointer"
                style={{ background: `linear-gradient(to right, ${progress > 0 ? '#1DB954' : '#b3b3b3'} ${progress}%, #535353 ${progress}%)` }}
              />
            </div>
            <span className="text-[#b3b3b3] text-xs w-9">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Right: Volume */}
        <div className="flex items-center gap-2 w-48 justify-end">
          <button onClick={() => setShowVolume(!showVolume)} className="text-[#b3b3b3] hover:text-white transition-colors">
            <VolumeIcon />
          </button>
          <div className="flex-1 relative group">
            <input
              type="range" min={0} max={1} step={0.01} value={volume} onChange={handleVolume}
              className="w-full h-1 rounded-full appearance-none cursor-pointer"
              style={{ background: `linear-gradient(to right, #fff ${volume * 100}%, #535353 ${volume * 100}%)` }}
            />
          </div>
        </div>
      </footer>
    </>
  );
      {/* Left: Track info */}
      <div className="flex items-center gap-3 w-72 min-w-0">
        {currentTrack ? (
          <>
            {/* En móvil toda esta sección abre el modal */}
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-3 min-w-0 flex-1 text-left md:pointer-events-none"
            >
              <div className="w-14 h-14 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 text-2xl">
                {currentTrack.type === 'video' ? '🎬' : '🎵'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-white text-sm font-medium truncate">{currentTrack.name}</p>
                <p className="text-[#b3b3b3] text-xs truncate">{currentTrack.artist}</p>
              </div>
            </button>
            <button
              onClick={() => toggleLike(currentTrack.id)}
              className={`flex-shrink-0 transition-colors ${currentTrack.liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}
            >
              <svg viewBox="0 0 24 24" fill={currentTrack.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
                <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" />
              </svg>
            </button>
          </>
        ) : (
          <div className="text-[#b3b3b3] text-sm">No hay nada reproduciéndose</div>
        )}
      </div>

      {/* Center: Controls */}
      <div className="flex flex-col items-center gap-2 flex-1 min-w-0">
        <div className="flex items-center gap-4">
          {/* Shuffle */}
          <button
            onClick={toggleShuffle}
            className={`transition-colors hover:scale-105 ${shuffle ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M13.151.922a.75.75 0 1 0-1.06 1.06L13.109 3H11.16a3.75 3.75 0 0 0-2.873 1.34l-6.173 7.356A2.25 2.25 0 0 1 .39 12.5H0V14h.391a3.75 3.75 0 0 0 2.873-1.34l6.173-7.356A2.25 2.25 0 0 1 11.16 4.5h1.949l-1.017 1.018a.75.75 0 0 0 1.06 1.06L15.98 3.75 13.15.922zM.391 3.5H0V2h.391c1.109 0 2.16.49 2.873 1.34L4.89 5.277l-.979 1.167-1.796-2.14A2.25 2.25 0 0 0 .39 3.5z" />
              <path d="m7.5 10.723.98-1.167.957 1.14a2.25 2.25 0 0 0 1.724.804h1.946l-1.016-1.018a.75.75 0 1 1 1.061-1.06l2.829 2.828-2.829 2.828a.75.75 0 1 1-1.06-1.06l1.016-1.018H11.16a3.75 3.75 0 0 1-2.873-1.34l-.787-.937z" />
            </svg>
          </button>

          {/* Prev */}
          <button onClick={prevTrack} className="text-[#b3b3b3] hover:text-white transition-colors hover:scale-105">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
              <path d="M3.3 1a.7.7 0 0 1 .7.7v5.15l9.95-5.744a.7.7 0 0 1 1.05.606v12.575a.7.7 0 0 1-1.05.607L4 9.149V14.3a.7.7 0 0 1-.7.7H1.7a.7.7 0 0 1-.7-.7V1.7a.7.7 0 0 1 .7-.7h1.6z" />
            </svg>
          </button>

          {/* Play/Pause */}
          <button
            onClick={togglePlay}
            className="w-9 h-9 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
          >
            {isPlaying ? (
              <svg viewBox="0 0 16 16" fill="black" className="w-4 h-4">
                <path d="M2.7 1a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7H2.7zm8 0a.7.7 0 0 0-.7.7v12.6a.7.7 0 0 0 .7.7h2.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-2.6z" />
              </svg>
            ) : (
              <svg viewBox="0 0 16 16" fill="black" className="w-4 h-4">
                <path d="M3 1.713a.7.7 0 0 1 1.05-.607l10.89 6.288a.7.7 0 0 1 0 1.212L4.05 14.894A.7.7 0 0 1 3 14.288V1.713z" />
              </svg>
            )}
          </button>

          {/* Next */}
          <button onClick={nextTrack} className="text-[#b3b3b3] hover:text-white transition-colors hover:scale-105">
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-5 h-5">
              <path d="M12.7 1a.7.7 0 0 0-.7.7v5.15L2.05 1.107A.7.7 0 0 0 1 1.712v12.575a.7.7 0 0 0 1.05.607L12 9.149V14.3a.7.7 0 0 0 .7.7h1.6a.7.7 0 0 0 .7-.7V1.7a.7.7 0 0 0-.7-.7h-1.6z" />
            </svg>
          </button>

          {/* Repeat */}
          <button
            onClick={toggleRepeat}
            className={`transition-colors hover:scale-105 relative ${repeat !== 'none' ? 'text-[#1DB954]' : 'text-[#b3b3b3] hover:text-white'}`}
          >
            <svg viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4">
              <path d="M0 4.75A3.75 3.75 0 0 1 3.75 1h8.5A3.75 3.75 0 0 1 16 4.75v5a3.75 3.75 0 0 1-3.75 3.75H9.81l1.018 1.018a.75.75 0 1 1-1.06 1.06L7.939 13.75l1.829-1.829a.75.75 0 1 1 1.06 1.06L9.811 14h2.439A2.25 2.25 0 0 0 14.5 11.75v-5A2.25 2.25 0 0 0 12.25 4.5h-8.5A2.25 2.25 0 0 0 1.5 6.75v5A2.25 2.25 0 0 0 3.75 14H5v1.5H3.75A3.75 3.75 0 0 1 0 11.75v-7z" />
            </svg>
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#1DB954] rounded-full text-[6px] flex items-center justify-center text-black font-bold">1</span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-2 w-full max-w-lg">
          <span className="text-[#b3b3b3] text-xs w-9 text-right">{formatTime(currentTime)}</span>
          <div className="flex-1 relative group">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-[#535353] rounded-full appearance-none cursor-pointer accent-white group-hover:accent-[#1DB954]"
              style={{
                background: `linear-gradient(to right, ${progress > 0 ? '#1DB954' : '#b3b3b3'} ${progress}%, #535353 ${progress}%)`
              }}
            />
          </div>
          <span className="text-[#b3b3b3] text-xs w-9">{formatTime(duration)}</span>
        </div>
      </div>
{/* Right: Volume */}
<div className="flex items-center gap-2 w-48 justify-end">
  <button
    onClick={() => setShowVolume(!showVolume)}
    className="text-[#b3b3b3] hover:text-white transition-colors"
  >
    <VolumeIcon />
  </button>
</div>
);
};

export default Player;