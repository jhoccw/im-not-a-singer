export interface Song {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
  duration?: number; // Duration in seconds
}

export enum PlayerState {
  PAUSED,
  PLAYING,
  LOADING
}

export interface SyncedLine {
  time: number;
  text: string;
}

export interface LyricsState {
  lines: SyncedLine[];
  isLoading: boolean;
  error: string | null;
}

export interface SongInsight {
  mood: string;
  meaning: string;
}
