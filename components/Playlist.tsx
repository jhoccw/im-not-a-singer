import React from 'react';
import { Song, PlayerState } from '../types';
import { Play, BarChart2 } from 'lucide-react';

interface PlaylistProps {
  songs: Song[];
  currentSong: Song;
  playerState: PlayerState;
  onSelect: (song: Song) => void;
}

const Playlist: React.FC<PlaylistProps> = ({ songs, currentSong, playerState, onSelect }) => {
  return (
    <div className="w-full space-y-2 mt-4 overflow-y-auto no-scrollbar max-h-[60vh]">
      {songs.map((song) => {
        const isCurrent = song.id === currentSong.id;
        const isPlaying = isCurrent && playerState === PlayerState.PLAYING;

        return (
          <div 
            key={song.id}
            onClick={() => onSelect(song)}
            className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-all duration-200 
              ${isCurrent ? 'bg-white/20' : 'hover:bg-white/10'}
            `}
          >
            <div className="relative w-12 h-12 rounded bg-gray-800 overflow-hidden shrink-0">
              <img src={song.coverUrl} alt={song.title} className="w-full h-full object-cover" />
              <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isCurrent ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                {isPlaying ? (
                   <BarChart2 size={16} className="text-white animate-pulse" />
                ) : (
                   <Play size={16} className="text-white fill-current" />
                )}
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 className={`text-base font-medium truncate ${isCurrent ? 'text-white' : 'text-gray-300'}`}>
                {song.title}
              </h4>
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Playlist;
