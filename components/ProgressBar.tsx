import React from 'react';

interface ProgressBarProps {
  current: number;
  duration: number;
  onSeek: (time: number) => void;
  isMobile?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ current, duration, onSeek, isMobile = false }) => {
  
  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const percent = duration ? (current / duration) * 100 : 0;

  return (
    <div className={`w-full group select-none ${isMobile ? 'mb-1' : 'mb-2 md:mb-4'}`}>
      <div 
        className={`relative w-full cursor-pointer rounded-full flex items-center transition-all duration-300 ${
            isMobile ? 'h-1 group-hover:h-1.5' : 'h-2 md:h-1 group-hover:h-2'
        }`}
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const p = (e.clientX - rect.left) / rect.width;
          onSeek(p * duration);
        }}
      >
        {/* Background Track */}
        <div className="absolute inset-0 bg-white/20 rounded-full"></div>

        {/* Active Track */}
        <div 
             className="h-full bg-white rounded-full transition-all duration-100 ease-linear relative"
             style={{ width: `${percent}%` }}
        >
            {/* Thumb Indicator (visible on hover or drag) */}
            <div className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity ${
                isMobile ? 'w-2 h-2' : 'w-3 h-3'
            }`}></div>
        </div>
        
        {/* Input for accessible seeking - overlaid and invisible */}
        <input 
          type="range" 
          min="0" 
          max={duration || 0} 
          value={current || 0} 
          onChange={(e) => onSeek(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {/* Time labels: Show on desktop, hide on mobile to save space unless hovered? Let's hide on compact mobile */}
      {!isMobile && (
        <div className="flex justify-between text-[10px] md:text-xs text-white/50 font-medium mt-1 md:mt-2">
            <span>{formatTime(current)}</span>
            <span>{formatTime(duration)}</span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;