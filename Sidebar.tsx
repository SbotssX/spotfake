import React from 'react';
import { View } from '../types';
import { usePlayer } from '../context/PlayerContext';

interface SidebarProps {
  view: View;
  setView: (v: View) => void;
}

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8 text-[#1DB954]">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'white' : '#b3b3b3'} className="w-6 h-6">
    <path d="M12.5 3.247a1 1 0 0 0-1 0L4 7.577V20h4.5v-6a1 1 0 0 1 1-1h5a1 1 0 0 1 1 1v6H20V7.577l-7.5-4.33zm-2-1.732a3 3 0 0 1 3 0l7.5 4.33A2 2 0 0 1 22 7.577V21a1 1 0 0 1-1 1h-6.5a1 1 0 0 1-1-1v-6h-3v6a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7.577a2 2 0 0 1 1-1.732l7.5-4.33z" />
  </svg>
);

const SearchIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'white' : '#b3b3b3'} className="w-6 h-6">
    <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 11.166C1.126 18.61 5.353 23.537 10.533 23.537c2.507 0 4.787-1.194 6.512-3.102l3.974 3.305a.985.985 0 0 0 1.392-.169 1.12 1.12 0 0 0-.164-1.476l-3.976-3.308c1.085-1.617 1.706-3.623 1.706-5.842 0-6.24-4.226-11.166-9.444-11.166zm-7.178 11.166c0-5.063 3.221-9.001 7.178-9.001 3.978 0 7.222 3.938 7.222 9.001S14.512 21.372 10.533 21.372c-3.978 0-7.178-3.939-7.178-9.001z" />
  </svg>
);

const LibraryIcon = ({ active }: { active: boolean }) => (
  <svg viewBox="0 0 24 24" fill={active ? 'white' : '#b3b3b3'} className="w-6 h-6">
    <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
  </svg>
);



export const Sidebar: React.FC<SidebarProps> = ({ view, setView }) => {
  const { tracks, likedTracks } = usePlayer();

  return (
    <aside className="w-60 bg-black flex flex-col h-full flex-shrink-0">
      {/* Logo */}
      <div className="px-6 pt-6 pb-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('home')}>
          <SpotifyLogo />
          <span className="text-white font-bold text-xl tracking-tight">Spotifake</span>
        </div>
      </div>

      {/* Main Nav */}
      <nav className="px-3 mb-4">
        <button
          onClick={() => setView('home')}
          className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-md transition-colors ${view === 'home' ? 'text-white font-bold' : 'text-[#b3b3b3] hover:text-white'}`}
        >
          <HomeIcon active={view === 'home'} />
          <span className="text-sm font-semibold">Inicio</span>
        </button>
        <button
          onClick={() => setView('search')}
          className={`flex items-center gap-4 w-full px-3 py-2.5 rounded-md transition-colors ${view === 'search' ? 'text-white font-bold' : 'text-[#b3b3b3] hover:text-white'}`}
        >
          <SearchIcon active={view === 'search'} />
          <span className="text-sm font-semibold">Buscar</span>
        </button>
      </nav>

      {/* Library */}
      <div className="mx-3 bg-[#121212] rounded-lg flex-1 overflow-hidden flex flex-col min-h-0">
        <div className="flex items-center justify-between px-4 pt-4 pb-2">
          <button
            onClick={() => setView('library')}
            className="flex items-center gap-3 text-[#b3b3b3] hover:text-white transition-colors"
          >
            <LibraryIcon active={view === 'library'} />
            <span className="text-sm font-bold">Tu biblioteca</span>
          </button>
          <button className="text-[#b3b3b3] hover:text-white transition-colors p-1 rounded-full hover:bg-white/10">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2z" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 scrollbar-hide">
          {/* Biblioteca */}
          <button
            onClick={() => setView('library')}
            className={`flex items-center gap-3 w-full px-2 py-2 rounded-md transition-colors ${view === 'library' ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'}`}
          >
            <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="#b3b3b3" className="w-5 h-5">
                <path d="M3 22a1 1 0 0 1-1-1V3a1 1 0 0 1 2 0v18a1 1 0 0 1-1 1zM15.5 2.134A1 1 0 0 0 14 3v18a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6.464a1 1 0 0 0-.5-.866l-6-3.464zM9 2a1 1 0 0 0-1 1v18a1 1 0 1 0 2 0V3a1 1 0 0 0-1-1z" />
              </svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-white text-sm font-semibold truncate">Biblioteca</p>
              <p className="text-[#b3b3b3] text-xs">{tracks.length} canciones</p>
            </div>
          </button>

          {/* Canciones que te gustan */}
          <button
            onClick={() => setView('liked')}
            className={`flex items-center gap-3 w-full px-2 py-2 rounded-md transition-colors ${view === 'liked' ? 'bg-[#282828]' : 'hover:bg-[#1a1a1a]'}`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-blue-300 rounded flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M13.723 18.654l-3.61 3.609c-.375.369-.885.58-1.437.58s-1.063-.211-1.438-.58l-8.27-8.357A4.344 4.344 0 0 1 0 10.826c0-1.201.478-2.297 1.25-3.091l.149-.149A4.317 4.317 0 0 1 4.435 6.37c1.2 0 2.295.467 3.097 1.229L9 9.068l2.467-2.469A4.317 4.317 0 0 1 14.563 5.4c1.2 0 2.295.467 3.096 1.229l.149.148A4.344 4.344 0 0 1 19 9.875c0 1.2-.478 2.298-1.252 3.092l-4.025 5.687z" />
              </svg>
            </div>
            <div className="text-left min-w-0">
              <p className="text-white text-sm font-semibold truncate">Canciones que te g...</p>
              <p className="text-[#b3b3b3] text-xs">{likedTracks.length} canciones</p>
            </div>
          </button>

          {/* Tracks list */}
          {tracks.map(track => (
            <button
              key={track.id}
              onClick={() => setView('library')}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-md hover:bg-[#1a1a1a] transition-colors"
            >
              <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 text-lg">
                {track.type === 'video' ? '🎬' : '🎵'}
              </div>
              <div className="text-left min-w-0">
                <p className="text-white text-sm font-medium truncate">{track.name}</p>
                <p className="text-[#b3b3b3] text-xs truncate">{track.artist}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
};
