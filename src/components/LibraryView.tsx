import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const formatDuration = (s: number) => {
  if (!s || isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const LibraryView: React.FC = () => {
  const { tracks, playTrack, currentTrack, isPlaying, removeTrack, toggleLike } = usePlayer();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'artist' | 'date'>('date');

  const filtered = tracks
    .filter(t =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.artist.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'artist') return a.artist.localeCompare(b.artist);
      return b.addedAt.getTime() - a.addedAt.getTime();
    });

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#2a1a4e] via-[#121212] to-[#121212] p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-end gap-6 mb-6">
          <div className="w-48 h-48 bg-gradient-to-br from-indigo-700 to-blue-400 rounded-lg flex items-center justify-center shadow-xl">
            <svg viewBox="0 0 24 24" fill="white" className="w-20 h-20 opacity-80">
              <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
            </svg>
          </div>
          <div>
            <p className="text-[#b3b3b3] text-xs uppercase font-bold mb-1">Lista de reproducción</p>
            <h1 className="text-white text-5xl font-black mb-4">Tu biblioteca</h1>
            <p className="text-[#b3b3b3] text-sm">{tracks.length} canciones</p>
          </div>
        </div>

        {/* Controls */}
        {tracks.length > 0 && (
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => tracks.length > 0 && playTrack(tracks[0])}
              className="w-14 h-14 bg-[#1DB954] rounded-full flex items-center justify-center hover:bg-[#1ed760] hover:scale-105 transition-all shadow-lg"
            >
              <svg viewBox="0 0 24 24" fill="black" className="w-6 h-6">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>

            <div className="flex items-center gap-2 flex-1">
              <div className="relative flex-1 max-w-xs">
                <svg viewBox="0 0 24 24" fill="#b3b3b3" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2">
                  <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 11.166C1.126 18.61 5.353 23.537 10.533 23.537c2.507 0 4.787-1.194 6.512-3.102l3.974 3.305a.985.985 0 0 0 1.392-.169 1.12 1.12 0 0 0-.164-1.476l-3.976-3.308c1.085-1.617 1.706-3.623 1.706-5.842 0-6.24-4.226-11.166-9.444-11.166zm-7.178 11.166c0-5.063 3.221-9.001 7.178-9.001 3.978 0 7.222 3.938 7.222 9.001S14.512 21.372 10.533 21.372c-3.978 0-7.178-3.939-7.178-9.001z" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar en tu biblioteca"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-[#282828] text-white text-sm rounded-full pl-9 pr-4 py-2 outline-none focus:ring-2 focus:ring-white/20 placeholder-[#b3b3b3]"
                />
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-[#b3b3b3] text-sm outline-none cursor-pointer hover:text-white"
              >
                <option value="date" className="bg-[#282828]">Fecha añadida</option>
                <option value="name" className="bg-[#282828]">Título</option>
                <option value="artist" className="bg-[#282828]">Artista</option>
              </select>
            </div>
          </div>
        )}

        {/* Table */}
        {filtered.length > 0 ? (
          <div>
            {/* Header escritorio */}
            <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_3rem_4rem_2rem] gap-4 px-4 py-2 border-b border-[#282828] text-[#b3b3b3] text-xs uppercase tracking-wider font-medium mb-2">
              <span>#</span>
              <span>Título</span>
              <span>Artista</span>
              <span className="text-center">❤</span>
              <span>Duración</span>
              <span></span>
            </div>
            {/* Header móvil */}
            <div className="grid md:hidden grid-cols-[2rem_1fr_3rem_4rem_2rem] gap-2 px-3 py-2 border-b border-[#282828] text-[#b3b3b3] text-xs uppercase tracking-wider font-medium mb-1">
              <span>#</span>
              <span>Título</span>
              <span className="text-center">❤</span>
              <span>Dur.</span>
              <span></span>
            </div>

            {filtered.map((track, idx) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <div key={track.id}>
                  {/* Fila escritorio */}
                  <div
                    className={`hidden md:grid grid-cols-[2rem_1fr_1fr_3rem_4rem_2rem] gap-4 px-4 py-3 items-center group cursor-pointer rounded-md transition-colors ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="text-sm">
                      {isActive ? (
                        <svg viewBox="0 0 24 24" fill="#1DB954" className="w-4 h-4">
                          {isPlaying ? <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /> : <path d="M8 5v14l11-7z" />}
                        </svg>
                      ) : (
                        <>
                          <span className="text-[#b3b3b3] group-hover:hidden">{idx + 1}</span>
                          <svg viewBox="0 0 24 24" fill="white" className="w-4 h-4 hidden group-hover:block"><path d="M8 5v14l11-7z" /></svg>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center text-xl flex-shrink-0">{track.type === 'video' ? '🎬' : '🎵'}</div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</p>
                        <p className="text-[#b3b3b3] text-xs truncate">{track.type === 'video' ? 'Video' : 'Audio'}</p>
                      </div>
                    </div>
                    <span className="text-[#b3b3b3] text-sm truncate">{track.artist}</span>
                    <div className="flex justify-center">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className={`transition-colors ${track.liked ? 'text-[#1DB954]' : 'text-[#b3b3b3] opacity-0 group-hover:opacity-100 hover:text-white'}`}>
                        <svg viewBox="0 0 24 24" fill={track.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" /></svg>
                      </button>
                    </div>
                    <span className="text-[#b3b3b3] text-sm">{formatDuration(track.duration)}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }} className="text-[#b3b3b3] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                    </button>
                  </div>

                  {/* Fila móvil */}
                  <div
                    className={`grid md:hidden grid-cols-[2rem_1fr_3rem_4rem_2rem] gap-2 px-3 py-3 items-center group cursor-pointer rounded-md transition-colors ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="text-sm">
                      {isActive ? (
                        <svg viewBox="0 0 24 24" fill="#1DB954" className="w-4 h-4">
                          {isPlaying ? <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" /> : <path d="M8 5v14l11-7z" />}
                        </svg>
                      ) : (
                        <span className="text-[#b3b3b3]">{idx + 1}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 bg-[#282828] rounded flex items-center justify-center text-sm flex-shrink-0">{track.type === 'video' ? '🎬' : '🎵'}</div>
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</p>
                        <p className="text-[#b3b3b3] text-xs truncate">{track.artist}</p>
                      </div>
                    </div>
                    <div className="flex justify-center">
                      <button onClick={(e) => { e.stopPropagation(); toggleLike(track.id); }} className={`transition-colors ${track.liked ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}>
                        <svg viewBox="0 0 24 24" fill={track.liked ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" className="w-4 h-4"><path d="M12 21.593c-5.63-5.539-11-10.297-11-14.402C1 3.307 4.268 1 7.399 1c1.959 0 3.668.974 4.601 2.093C13.086 1.974 14.793 1 16.601 1 19.732 1 23 3.307 23 7.191c0 4.105-5.371 8.862-11 14.402z" /></svg>
                      </button>
                    </div>
                    <span className="text-[#b3b3b3] text-xs text-right">{formatDuration(track.duration)}</span>
                    <button onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }} className="text-[#b3b3b3] hover:text-red-400 transition-colors">
                      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎵</div>
            <h3 className="text-white text-xl font-bold mb-2">
              {search ? 'No se encontraron resultados' : 'Tu biblioteca está vacía'}
            </h3>
            <p className="text-[#b3b3b3] text-sm">
              {search ? 'Intenta con otro término de búsqueda' : 'Sube tus archivos de música para verlos aquí'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
