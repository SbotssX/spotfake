import React, { useState } from 'react';
import { PlayerProvider } from './context/PlayerContext';
import { Sidebar } from './components/Sidebar';
import { Player } from './components/Player';
import { HomeView } from './components/HomeView';
import { UploadView } from './components/UploadView';
import { LibraryView } from './components/LibraryView';
import { SearchView } from './components/SearchView';
import { LikedView } from './components/LikedView';
import { View } from './types';

const SpotifyLogo = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-[#1DB954]">
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
  </svg>
);

function AppContent() {
  const [view, setView] = useState<View>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [history, setHistory] = useState<View[]>(['home']);
  const [histIdx, setHistIdx] = useState(0);
  const navigateTo = (v: View) => {
    const newHistory = [...history.slice(0, histIdx + 1), v];
    setHistory(newHistory);
    setHistIdx(newHistory.length - 1);
    setView(v);
  };

  const goBack = () => {
    if (histIdx > 0) {
      const newIdx = histIdx - 1;
      setHistIdx(newIdx);
      setView(history[newIdx]);
    }
  };

  const goForward = () => {
    if (histIdx < history.length - 1) {
      const newIdx = histIdx + 1;
      setHistIdx(newIdx);
      setView(history[newIdx]);
    }
  };

  const handleTopbarSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (view !== 'search') navigateTo('search');
  };

  const handleUploadClick = () => {
    navigateTo('upload');
  };

  return (
    <div className="h-screen flex flex-col bg-black overflow-hidden">
      {/* Main layout */}
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <Sidebar view={view} setView={navigateTo} />

        {/* Main content area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#121212]">
          {/* Topbar */}
          <header className="h-16 flex items-center px-4 gap-4 bg-[#121212]/90 backdrop-blur-sm flex-shrink-0 z-10">
            {/* Nav buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={goBack}
                disabled={histIdx === 0}
                className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:bg-black/80 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M15.957 2.793a1 1 0 0 1 0 1.414L8.164 12l7.793 7.793a1 1 0 1 1-1.414 1.414L5.336 12l9.207-9.207a1 1 0 0 1 1.414 0z" />
                </svg>
              </button>
              <button
                onClick={goForward}
                disabled={histIdx === history.length - 1}
                className="w-8 h-8 bg-black/60 rounded-full flex items-center justify-center text-white disabled:opacity-40 hover:bg-black/80 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M8.043 2.793a1 1 0 0 0 0 1.414L15.836 12l-7.793 7.793a1 1 0 1 0 1.414 1.414L18.664 12 9.457 2.793a1 1 0 0 0-1.414 0z" />
                </svg>
              </button>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-sm">
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="#000" className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2">
                  <path d="M10.533 1.279c-5.18 0-9.407 4.927-9.407 11.166C1.126 18.61 5.353 23.537 10.533 23.537c2.507 0 4.787-1.194 6.512-3.102l3.974 3.305a.985.985 0 0 0 1.392-.169 1.12 1.12 0 0 0-.164-1.476l-3.976-3.308c1.085-1.617 1.706-3.623 1.706-5.842 0-6.24-4.226-11.166-9.444-11.166zm-7.178 11.166c0-5.063 3.221-9.001 7.178-9.001 3.978 0 7.222 3.938 7.222 9.001S14.512 21.372 10.533 21.372c-3.978 0-7.178-3.939-7.178-9.001z" />
                </svg>
                <input
                  type="text"
                  placeholder="¿Qué quieres escuchar?"
                  value={searchQuery}
                  onChange={handleTopbarSearch}
                  onFocus={() => view !== 'search' && navigateTo('search')}
                  className="w-full bg-white text-black text-sm rounded-full pl-9 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-white/40 placeholder-gray-500 font-medium"
                />
              </div>
            </div>

            {/* Right section */}
            <div className="ml-auto flex items-center gap-3">
              <button
                onClick={handleUploadClick}
                className="flex items-center gap-2 bg-white text-black text-sm font-bold px-4 py-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2z" />
                </svg>
                Subir música
              </button>

              <button className="w-9 h-9 bg-[#1DB954] rounded-full flex items-center justify-center hover:scale-105 transition-transform">
                <SpotifyLogo />
              </button>
            </div>
          </header>

          {/* View content */}
          <div className="flex-1 min-h-0 flex">
            {view === 'home' && <HomeView setView={navigateTo} />}
            {view === 'upload' && <UploadView />}
            {view === 'library' && <LibraryView />}
            {view === 'search' && <SearchView initialQuery={searchQuery} />}
            {view === 'liked' && <LikedView />}
          </div>
        </div>
      </div>

      {/* Player bar */}
      <Player />
    </div>
  );
}

export default function App() {
  return (
    <PlayerProvider>
      <AppContent />
    </PlayerProvider>
  );
}
