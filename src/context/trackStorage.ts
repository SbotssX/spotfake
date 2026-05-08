// Helpers para guardar y leer canciones en IndexedDB
// Las canciones se guardan por usuario usando la clave spotifake_tracks_{username}

const DB_NAME = 'spotifake_db';
const DB_VERSION = 1;
const STORE = 'tracks';

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'storageKey' });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export interface PersistedTrack {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  type: 'audio' | 'video';
  liked: boolean;
  addedAt: string;
  fileBlob: Blob;
  fileName: string;
  fileSize: number;
}

export async function saveTracksForUser(username: string, tracks: PersistedTrack[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    const store = tx.objectStore(STORE);
    store.put({ storageKey: `tracks_${username}`, tracks });
    return new Promise((resolve, reject) => {
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (e) {
    console.warn('Error guardando en IndexedDB:', e);
  }
}

export async function loadTracksForUser(username: string): Promise<PersistedTrack[]> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readonly');
    const store = tx.objectStore(STORE);
    const req = store.get(`tracks_${username}`);
    return new Promise((resolve) => {
      req.onsuccess = () => resolve(req.result?.tracks ?? []);
      req.onerror = () => resolve([]);
    });
  } catch (e) {
    console.warn('Error leyendo IndexedDB:', e);
    return [];
  }
}

export async function deleteTracksForUser(username: string): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).delete(`tracks_${username}`);
  } catch (e) {
    console.warn('Error borrando de IndexedDB:', e);
  }
}
