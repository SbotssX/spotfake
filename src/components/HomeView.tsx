import React, { useEffect } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { View } from '../types';

interface HomeViewProps {
  setView: (v: View) => void;
}

const greetings = () => {
  const h = new Date().getHours();
  if (h < 12) return 'Buenos días';
  if (h < 18) return 'Buenas tardes';
  return 'Buenas noches';
};

const GENRES = [
  { name: 'Pop', color: 'from-pink-500 to-rose-600', emoji: '🎤' },
  { name: 'Rock', color: 'from-orange-500 to-red-600', emoji: '🎸' },
  { name: 'Hip-Hop', color: 'from-yellow-500 to-amber-600', emoji: '🎧' },
  { name: 'Electrónica', color: 'from-blue-500 to-cyan-600', emoji: '🎛️' },
  { name: 'R&B', color: 'from-purple-500 to-violet-600', emoji: '🎶' },
  { name: 'Latin', color: 'from-green-500 to-emerald-600', emoji: '💃' },
  { name: 'Jazz', color: 'from-amber-700 to-yellow-800', emoji: '🎷' },
  { name: 'Clásica', color: 'from-slate-500 to-gray-600', emoji: '🎻' },
];

const FEATURED = [
  { title: 'Éxitos del momento', subtitle: 'Las canciones más escuchadas', color: 'from-indigo-800 to-purple-900', emoji: '🔥' },
  { title: 'Vibes del verano', subtitle: 'Energía pura para tu día', color: 'from-orange-700 to-pink-800', emoji: '☀️' },
  { title: 'Chill & Relax', subtitle: 'Para los momentos tranquilos', color: 'from-teal-700 to-cyan-800', emoji: '🌊' },
  { title: 'Workout Mode', subtitle: 'Actívate con la mejor música', color: 'from-red-700 to-orange-800', emoji: '💪' },
  { title: 'Lo-Fi Beats', subtitle: 'Concentración y estudio', color: 'from-amber-700 to-yellow-800', emoji: '📚' },
  { title: 'Party Mix', subtitle: 'Para no parar de bailar', color: 'from-fuchsia-700 to-pink-800', emoji: '🎉' },
];

export const HomeView: React.FC<HomeViewProps> = ({ setView }) => {
  const { tracks, playTrack, currentTrack, isPlaying } = usePlayer();
  useEffect(() => {
    // Keep component updated
  }, []);

  const recentTracks = [...tracks].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()).slice(0, 6);

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a3e] via-[#121212] to-[#121212]">
      {/* Top gradient section */}
      <div className="p-6">
        <h1 className="text-white text-3xl font-bold mb-6">{greetings()}</h1>

        {/* Quick access grid */}
        {recentTracks.length > 0 && (
          <div className="grid grid-cols-3 gap-3 mb-8">
            {recentTracks.map((track) => {
              const isActive = currentTrack?.id === track.id;
              return (
                <button
                  key={track.id}
                  onClick={() => playTrack(track)}
                  className={`flex items-center gap-3 rounded-md overflow-hidden transition-colors group relative ${
                    isActive ? 'bg-[#3e3e3e]' : 'bg-[#282828] hover:bg-[#3e3e3e]'
                  }`}
                >
                  <div className="w-14 h-14 bg-[#3e3e3e] flex items-center justify-center text-2xl flex-shrink-0">
                    {track.type === 'video' ? '🎬' : '🎵'}
                  </div>
                  <span className="text-white text-sm font-bold truncate pr-2 text-left">{track.name}</span>
                  {isActive && isPlaying && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <svg viewBox="0 0 24 24" fill="#1DB954" className="w-5 h-5 animate-pulse">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                      </svg>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Featured playlists */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Playlists destacadas</h2>
            <button className="text-[#b3b3b3] hover:text-white text-sm font-semibold transition-colors">
              Mostrar todo
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {FEATURED.map((item) => (
              <div
                key={item.title}
                className={`bg-gradient-to-br ${item.color} rounded-lg p-4 cursor-pointer hover:scale-105 transition-transform group relative overflow-hidden`}
              >
                <div className="text-4xl mb-3">{item.emoji}</div>
                <h3 className="text-white text-sm font-bold leading-tight">{item.title}</h3>
                <p className="text-white/70 text-xs mt-1 leading-tight">{item.subtitle}</p>
                <button className="absolute bottom-3 right-3 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0">
                  <svg viewBox="0 0 24 24" fill="black" className="w-5 h-5">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Genres */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white text-xl font-bold">Explorar géneros</h2>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {GENRES.map((genre) => (
              <div
                key={genre.name}
                className={`bg-gradient-to-br ${genre.color} rounded-lg p-5 cursor-pointer hover:scale-105 transition-transform overflow-hidden relative h-28`}
              >
                <span className="text-white font-bold text-lg">{genre.name}</span>
                <span className="absolute -bottom-2 -right-2 text-5xl opacity-80">{genre.emoji}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Your library section */}
        {tracks.length > 0 ? (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Tu música</h2>
              <button
                onClick={() => setView('library')}
                className="text-[#b3b3b3] hover:text-white text-sm font-semibold transition-colors"
              >
                Ver todo
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {tracks.slice(0, 6).map((track) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => playTrack(track)}
                    className={`bg-[#181818] hover:bg-[#282828] p-4 rounded-lg cursor-pointer group transition-colors relative ${isActive ? 'bg-[#282828]' : ''}`}
                  >
                    <div className="w-full aspect-square bg-[#282828] rounded-md flex items-center justify-center text-4xl mb-3 relative">
                      {track.type === 'video' ? '🎬' : '🎵'}
                      <button className="absolute bottom-2 right-2 w-10 h-10 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-lg translate-y-2 group-hover:translate-y-0">
                        <svg viewBox="0 0 24 24" fill="black" className="w-5 h-5">
                          {isActive && isPlaying ? (
                            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                          ) : (
                            <path d="M8 5v14l11-7z" />
                          )}
                        </svg>
                      </button>
                    </div>
                    <h3 className={`text-sm font-semibold truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</h3>
                    <p className="text-[#b3b3b3] text-xs truncate mt-1">{track.artist}</p>
                  </div>
                );
              })}
            </div>
          </section>
        ) : (
          <section className="mb-8">
            <div className="bg-[#181818] rounded-xl p-8 text-center">
              <div className="text-6xl mb-4">🎵</div>
              <h3 className="text-white text-xl font-bold mb-2">Tu biblioteca está vacía</h3>
              <p className="text-[#b3b3b3] text-sm mb-6">Empieza a subir tu música favorita y aparecerá aquí</p>
              <button
                onClick={() => setView('upload')}
                className="bg-[#1DB954] text-black font-bold px-8 py-3 rounded-full hover:bg-[#1ed760] transition-colors"
              >
                Subir música
              </button>
            </div>
          </section>
        )}

        {/* Spacer */}
        <div className="h-8" />
      </div>
    </div>
  );
};
