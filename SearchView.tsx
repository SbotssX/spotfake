import React, { useState } from 'react';
import { usePlayer } from '../context/PlayerContext';

const GENRES = [
  { name: 'Pop', color: 'from-pink-500 to-rose-600', emoji: '🎤' },
  { name: 'Rock', color: 'from-orange-500 to-red-600', emoji: '🎸' },
  { name: 'Hip-Hop', color: 'from-yellow-500 to-amber-600', emoji: '🎧' },
  { name: 'Electrónica', color: 'from-blue-500 to-cyan-600', emoji: '🎛️' },
  { name: 'R&B', color: 'from-purple-500 to-violet-600', emoji: '🎶' },
  { name: 'Latin', color: 'from-green-500 to-emerald-600', emoji: '💃' },
  { name: 'Jazz', color: 'from-amber-700 to-yellow-800', emoji: '🎷' },
  { name: 'Clásica', color: 'from-slate-500 to-gray-600', emoji: '🎻' },
  { name: 'Reggaeton', color: 'from-lime-500 to-green-600', emoji: '🔊' },
  { name: 'Blues', color: 'from-sky-700 to-blue-800', emoji: '🎺' },
  { name: 'Country', color: 'from-amber-600 to-orange-700', emoji: '🤠' },
  { name: 'Metal', color: 'from-gray-700 to-zinc-800', emoji: '🤘' },
];

interface SearchViewProps {
  initialQuery?: string;
}

export const SearchView: React.FC<SearchViewProps> = ({ initialQuery = '' }) => {
  const { tracks, playTrack, currentTrack } = usePlayer();
  const [query, setQuery] = useState(initialQuery);

  const results = query.trim()
    ? tracks.filter(t =>
        t.name.toLowerCase().includes(query.toLowerCase()) ||
        t.artist.toLowerCase().includes(query.toLowerCase()) ||
        t.album.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  return (
    <div className="flex-1 overflow-y-auto bg-[#121212] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-2xl font-bold mb-6">Buscar</h1>

        {/* Search Input */}
        <div className="relative mb-8">
          <svg viewBox="0 0 24 24" fill="#b3b3b3" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2">
            <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 11.166C1.126 18.61 5.353 23.537 10.533 23.537c2.507 0 4.787-1.194 6.512-3.102l3.974 3.305a.985.985 0 0 0 1.392-.169 1.12 1.12 0 0 0-.164-1.476l-3.976-3.308c1.085-1.617 1.706-3.623 1.706-5.842 0-6.24-4.226-11.166-9.444-11.166zm-7.178 11.166c0-5.063 3.221-9.001 7.178-9.001 3.978 0 7.222 3.938 7.222 9.001S14.512 21.372 10.533 21.372c-3.978 0-7.178-3.939-7.178-9.001z" />
          </svg>
          <input
            type="text"
            placeholder="¿Qué quieres escuchar?"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-white text-black text-base rounded-full pl-12 pr-6 py-3.5 outline-none focus:ring-2 focus:ring-white/40 placeholder-gray-400 font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
              </svg>
            </button>
          )}
        </div>

        {/* Results */}
        {results.length > 0 && (
          <section className="mb-8">
            <h2 className="text-white text-xl font-bold mb-4">Resultados para "{query}"</h2>
            <div className="space-y-1">
              {results.map((track) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`flex items-center gap-4 p-3 rounded-md cursor-pointer group transition-colors ${
                      isActive ? 'bg-white/10' : 'hover:bg-white/5'
                    }`}
                  >
                    <div className="w-12 h-12 bg-[#282828] rounded flex items-center justify-center text-2xl flex-shrink-0">
                      {track.type === 'video' ? '🎬' : '🎵'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</p>
                      <p className="text-[#b3b3b3] text-xs truncate">{track.artist}</p>
                    </div>
                    <div className="text-[#b3b3b3] text-sm">
                      {track.type === 'video' ? 'Video' : 'Canción'}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {query && results.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white text-xl font-bold mb-2">No se encontraron resultados para</p>
            <p className="text-white text-xl font-bold">"{query}"</p>
            <p className="text-[#b3b3b3] text-sm mt-4">Comprueba que todas las palabras estén escritas correctamente o usa menos palabras o diferentes.</p>
          </div>
        )}

        {/* Genres (shown when no query) */}
        {!query && (
          <section>
            <h2 className="text-white text-xl font-bold mb-4">Explorar todo</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {GENRES.map((genre) => (
                <div
                  key={genre.name}
                  className={`bg-gradient-to-br ${genre.color} rounded-lg p-5 cursor-pointer hover:scale-105 transition-transform overflow-hidden relative h-32`}
                >
                  <span className="text-white font-bold text-lg">{genre.name}</span>
                  <span className="absolute -bottom-2 -right-2 text-6xl opacity-80">{genre.emoji}</span>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
