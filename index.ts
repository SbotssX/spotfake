export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  duration: number;
  url: string;
  type: 'audio' | 'video';
  cover?: string;
  file: File;
  liked: boolean;
  addedAt: Date;
}

export type View = 'home' | 'upload' | 'library' | 'search' | 'liked';
