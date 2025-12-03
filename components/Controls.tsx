import React from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import { PlayerState } from '../types';

interface ControlsProps {
  state: PlayerState;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
  isMobile?: boolean;
}

const Controls: React.FC<ControlsProps> = ({ state, onPlayPause, onNext, onPrev, isMobile = false }) => {
  if (isMobile) {
    // Mobile Compact Controls
    return (
      <div className="flex items-center gap-4">
        <button 
          onClick={onPrev} 
          className="text-white/70 hover:text-white active:scale-95 transition-all"
        >
          <SkipBack className="w-5 h-5" strokeWidth={2} fill="currentColor" />
        </button>

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

        <button 
          onClick={onNext} 
          className="text-white/70 hover:text-white active:scale-95 transition-all"
        >
          <SkipForward className="w-5 h-5" strokeWidth={2} fill="currentColor" />
        </button>
      </div>
    );
  }

  // Desktop Standard Controls
  return (
    <div className="flex items-center justify-center w-full mt-2 md:mt-6 gap-6 md:gap-10">
      
      <button 
        onClick={onPrev} 
        className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Previous"
      >
        <SkipBack className="w-6 h-6 md:w-9 md:h-9 opacity-90" strokeWidth={1.5} fill="currentColor" />
      </button>

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

      <button 
        onClick={onNext} 
        className="text-white/70 hover:text-white transition-all duration-300 hover:scale-110 active:scale-95"
        aria-label="Next"
      >
        <SkipForward className="w-6 h-6 md:w-9 md:h-9 opacity-90" strokeWidth={1.5} fill="currentColor" />
      </button>

    </div>
  );
};

export default Controls;