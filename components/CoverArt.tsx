import React from 'react';
import { PlayerState } from '../types';

interface CoverArtProps {
  src: string;
  state: PlayerState;
}

const CoverArt: React.FC<CoverArtProps> = ({ src, state }) => {
  return (
    <div className="w-full h-full relative group">
      <img 
        src={src} 
        alt="Cover Art" 
        className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
          state === PlayerState.PLAYING ? 'animate-breathe' : ''
        }`}
      />
      {/* Subtle shine on hover */}
      <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300"></div>
    </div>
  );
};

export default CoverArt;