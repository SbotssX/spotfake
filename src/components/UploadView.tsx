import React, { useCallback, useRef, useState } from 'react';
import { usePlayer } from '../context/PlayerContext';
import { Track } from '../types';

const generateId = () => Math.random().toString(36).substr(2, 9);

const getFileInfo = (file: File): Promise<{ duration: number; url: string }> => {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const media = file.type.startsWith('video') ? document.createElement('video') : document.createElement('audio');
    media.src = url;
    media.onloadedmetadata = () => resolve({ duration: media.duration, url });
    media.onerror = () => resolve({ duration: 0, url });
  });
};

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const formatDuration = (s: number) => {
  if (!s || isNaN(s)) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
};

const ACCEPTED = '.mp3,.mp4,.wav,.ogg,.flac,.aac,.webm,.m4a';

export const UploadView: React.FC = () => {
  const { addTracks, tracks, removeTrack, playTrack, currentTrack } = usePlayer();
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback(async (files: File[]) => {
    setLoading(true);
    const accepted = files.filter(f =>
      f.type.startsWith('audio/') || f.type.startsWith('video/') ||
      /\.(mp3|mp4|wav|ogg|flac|aac|webm|m4a)$/i.test(f.name)
    );

    const newTracks: Track[] = [];
    for (const file of accepted) {
      const { duration, url } = await getFileInfo(file);
      const nameParts = file.name.replace(/\.[^.]+$/, '');
      const parts = nameParts.split(' - ');
      newTracks.push({
        id: generateId(),
        name: parts.length > 1 ? parts.slice(1).join(' - ').trim() : nameParts,
        artist: parts.length > 1 ? parts[0].trim() : 'Artista desconocido',
        album: 'Mi biblioteca',
        duration,
        url,
        type: file.type.startsWith('video/') ? 'video' : 'audio',
        file,
        liked: false,
        addedAt: new Date(),
      });
    }
    addTracks(newTracks);
    setLoading(false);
  }, [addTracks]);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  }, [processFiles]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      processFiles(Array.from(e.target.files));
      e.target.value = '';
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-gradient-to-b from-[#1a1a2e] via-[#121212] to-[#121212] p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-white text-3xl font-bold mb-1">Bienvenido</h1>
        <p className="text-[#b3b3b3] text-sm mb-6">Sube tus archivos de música y video para empezar</p>

        {/* Drop Zone */}
        <div
          className={`border-2 border-dashed rounded-xl p-16 text-center cursor-pointer transition-all duration-200 mb-8 ${
            dragging
              ? 'border-[#1DB954] bg-[#1DB954]/10'
              : 'border-[#535353] hover:border-[#b3b3b3] bg-[#282828]/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            multiple
            accept={ACCEPTED}
            className="hidden"
            onChange={onFileChange}
          />
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${dragging ? 'bg-[#1DB954]' : 'bg-[#535353]'}`}>
            {loading ? (
              <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="white" className="w-8 h-8">
                <path d="M11 11V3h2v8h8v2h-8v8h-2v-8H3v-2z" />
              </svg>
            )}
          </div>
          <h3 className="text-white text-xl font-bold mb-2">
            {loading ? 'Procesando archivos...' : 'Sube tus archivos'}
          </h3>
          <p className="text-[#b3b3b3] text-sm mb-3">
            {dragging ? '¡Suelta aquí!' : 'Arrastra y suelta o haz clic para seleccionar'}
          </p>
          <p className="text-[#535353] text-xs">MP3 • MP4 • WAV • OGG • FLAC • AAC • WebM • M4A</p>
        </div>

        {/* Tracks Table */}
        {tracks.length > 0 ? (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-white text-xl font-bold">Tu biblioteca</h2>
              <span className="text-[#b3b3b3] text-sm">{tracks.length} canciones</span>
            </div>
            <div className="bg-[#181818] rounded-xl overflow-hidden">
              {/* Header — escritorio */}
              <div className="hidden md:grid grid-cols-[2rem_1fr_1fr_5rem_5rem_2rem] gap-4 px-6 py-3 border-b border-[#282828] text-[#b3b3b3] text-xs uppercase tracking-wider font-medium">
                <span>#</span>
                <span>Título</span>
                <span>Artista</span>
                <span>Duración</span>
                <span>Tamaño</span>
                <span></span>
              </div>
              {/* Header — móvil */}
              <div className="grid md:hidden grid-cols-[2rem_1fr_4rem_4rem_2rem] gap-2 px-3 py-3 border-b border-[#282828] text-[#b3b3b3] text-xs uppercase tracking-wider font-medium">
                <span>#</span>
                <span>Título</span>
                <span>Dur.</span>
                <span>Tam.</span>
                <span></span>
              </div>

              {tracks.map((track, idx) => {
                const isActive = currentTrack?.id === track.id;
                return (
                  <div key={track.id}>
                    {/* Fila escritorio */}
                    <div
                      className={`hidden md:grid grid-cols-[2rem_1fr_1fr_5rem_5rem_2rem] gap-4 px-6 py-3 items-center group cursor-pointer transition-colors ${
                        isActive ? 'bg-[#282828]' : 'hover:bg-[#282828]/50'
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <span className={`text-sm ${isActive ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}>
                        {isActive ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                          </svg>
                        ) : idx + 1}
                      </span>
                      <div className="min-w-0 flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 text-lg">
                          {track.type === 'video' ? '🎬' : '🎵'}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</p>
                          <p className="text-[#b3b3b3] text-xs truncate">{track.album}</p>
                        </div>
                      </div>
                      <span className="text-[#b3b3b3] text-sm truncate">{track.artist}</span>
                      <span className="text-[#b3b3b3] text-sm">{formatDuration(track.duration)}</span>
                      <span className="text-[#b3b3b3] text-sm">{formatFileSize(track.file.size)}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }} className="text-[#b3b3b3] hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                      </button>
                    </div>

                    {/* Fila móvil */}
                    <div
                      className={`grid md:hidden grid-cols-[2rem_1fr_4rem_4rem_2rem] gap-2 px-3 py-3 items-center group cursor-pointer transition-colors ${
                        isActive ? 'bg-[#282828]' : 'hover:bg-[#282828]/50'
                      }`}
                      onClick={() => playTrack(track)}
                    >
                      <span className={`text-sm ${isActive ? 'text-[#1DB954]' : 'text-[#b3b3b3]'}`}>
                        {isActive ? (
                          <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 animate-pulse">
                            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
                          </svg>
                        ) : idx + 1}
                      </span>
                      <div className="min-w-0 flex items-center gap-2">
                        <div className="w-8 h-8 bg-[#282828] rounded flex items-center justify-center flex-shrink-0 text-sm">
                          {track.type === 'video' ? '🎬' : '🎵'}
                        </div>
                        <div className="min-w-0">
                          <p className={`text-sm font-medium truncate ${isActive ? 'text-[#1DB954]' : 'text-white'}`}>{track.name}</p>
                          <p className="text-[#b3b3b3] text-xs truncate">{track.artist}</p>
                        </div>
                      </div>
                      <span className="text-[#b3b3b3] text-xs text-right">{formatDuration(track.duration)}</span>
                      <span className="text-[#b3b3b3] text-xs text-right">{formatFileSize(track.file.size)}</span>
                      <button onClick={(e) => { e.stopPropagation(); removeTrack(track.id); }} className="text-[#b3b3b3] hover:text-red-400 transition-colors">
                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" /></svg>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#b3b3b3] text-sm">Tu biblioteca está vacía. ¡Sube algo!</p>
          </div>
        )}
      </div>
    </div>
  );
};
