import React from 'react';
import { Play, Pause } from 'lucide-react';
import { PlayerState } from '../types';

interface ControlsProps {
  state: PlayerState;
  onPlayPause: () => void;
  isMobile?: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, onPlayPause, isMobile = false }) => {
  if (isMobile) {
    // Mobile Compact Controls
    return (
      <div className="flex items-center justify-end gap-4">
        <button 
          onClick={onPlayPause}
          className="
              relative flex items-center justify-center
              w-10 h-10 rounded-full 
              bg-white text-black 
              active:scale-95 transition-all shadow-md
          "
        >
          {state === PlayerState.PLAYING ? (
            <Pause className="w-5 h-5" fill="currentColor" strokeWidth={0} />
          ) : (
            <Play className="w-5 h-5 ml-0.5" fill="currentColor" strokeWidth={0} />
          )}
        </button>
      </div>
    );
  }

  // Desktop Standard Controls
  return (
    <div className="flex items-center justify-center w-full mt-2 md:mt-6">
      <button 
        onClick={onPlayPause}
        className="
            relative group flex items-center justify-center
            w-14 h-14 md:w-20 md:h-20 rounded-full 
            bg-white text-black 
            shadow-[0_0_20px_rgba(255,255,255,0.3)] 
            hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] 
            hover:scale-105 active:scale-95 
            transition-all duration-300
        "
        aria-label={state === PlayerState.PLAYING ? "Pause" : "Play"}
      >
        {state === PlayerState.PLAYING ? (
          <Pause className="w-6 h-6 md:w-9 md:h-9" fill="currentColor" strokeWidth={0} />
        ) : (
          <Play className="w-6 h-6 md:w-9 md:h-9 ml-1" fill="currentColor" strokeWidth={0} />
        )}
      </button>
    </div>
  );
};

export default Controls;