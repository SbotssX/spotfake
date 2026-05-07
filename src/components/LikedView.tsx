import React from 'react';
import { usePlayer } from '../context/PlayerContext';

const formatDuration = (s: number) => {
  if (!s || isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const LikedView: React.FC = () => {
  const { likedTracks, playTrack, currentTrack, isPlaying, toggleLike } = usePlayer();

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#4a0080] via-[#121212] to-[#121212] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-end gap-6 mb-8">
          <div className="w-48 h-48 bg-gradient-to-br from-indigo-600 to-blue-300 rounded-lg flex items-center justify-center shadow-2xl">
            <svg viewBox="0 0 24 24" fill="white" className="w-24 h-24">
              <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-xs uppercase font-bold mb-1">Lista de reproducción</p>
            <h1 className="text-white text-6xl font-black mb-4">Canciones que te gustan</h1>
            <p className="text-white/70 text-sm">
              <strong className="text-white">Spotifake</strong> • {likedTracks.length} canciones
            </p>
          </div>
        </div>

        {/* Play button */}
        {likedTracks.length > 0 && (
          <div className="flex items-center gap-6 mb-8">
            <button
              onClick={() => likedTracks.length > 0 && playTrack(likedTracks[0])}
              className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        )}

        {/* Tracks */}
        {likedTracks.length > 0 ? (
          <div>
            <div className="grid grid-cols-[2rem_1fr_1fr_4rem_2rem] gap-4 px-4 py-2 border-b border-white/10 text-[#b3b3b3] text-xs uppercase tracking-wider font-medium mb-2">
              <span>#</span>
              <span>Título</span>
              <span>Artista</span>
              <span>Duración</span>
              <span></span>
            </div>

            {likedTracks.map((track, idx) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <div
                  key={track.id}
                  className={`grid grid-cols-[2rem_1fr_1fr_4rem_2rem] gap-4 px-4 py-3 items-center group cursor-pointer rounded-md transition-colors ${
                    isActive ? 'bg-white/10' : 'hover:bg-white/5'
                  }`}
                  onClick={() => playTrack(track)}
                >
                  <div className="text-sm">
                    {isActive ? (
                      <svg viewBox="0 0 24 24" fill="#1DB954" className="w-4 h-4">
                        {isPlaying ? (
                          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                        ) : (
                          <path d="M8 5v14l11-7z" />
                        )}
                      </svg>
                    ) : (
                      <>
                        <span className="text-[#b3b3b3] group-hover:hidden">{idx + 1}</span>
                        <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 hidden group-hover:block">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center text-xl flex-shrink-0">
                      {track.type === 'video' ? '🎬' : '🎵'}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</p>
                      <p className="text-[#b3b3b3] text-xs truncate">{track.album}</p>
                    </div>
                  </div>

                  <span className="text-[#b3b3b3] text-sm truncate">{track.artist}</span>
                  <span className="text-[#b3b3b3] text-sm">{formatDuration(track.duration)}</span>

                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }}
                    className="text-[#1DB954] hover:scale-110 transition-transform"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                      <path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" />
                    </svg>
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">💔</div>
            <h3 className="text-white text-xl font-bold mb-2">Aún no tienes canciones que te gustan</h3>
            <p className="text-[#b3b3b3] text-sm">Guarda canciones tocando el corazón</p>
          </div>
        )}
      </div>
    </div>
  );
};
