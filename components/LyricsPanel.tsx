import React, { useEffect, useRef, useState } from 'react';
import { LyricsState } from '../types';

interface LyricsPanelProps {
  lyricsState: LyricsState;
  currentTime: number;
  onLineClick: (time: number) => void;
}

const LyricsPanel: React.FC<LyricsPanelProps> = ({ lyricsState, currentTime, onLineClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeLineIndex, setActiveLineIndex] = useState(0);

  useEffect(() => {
    if (!lyricsState.lines.length) return;

    // Find the current line based on time
    // We want the last line that has a time <= currentTime
    let index = -1;
    for (let i = 0; i < lyricsState.lines.length; i++) {
        if (lyricsState.lines[i].time <= currentTime) {
            index = i;
        } else {
            break; // Since lines are sorted, we can stop early
        }
    }
    
    setActiveLineIndex(index);
  }, [currentTime, lyricsState.lines]);

  useEffect(() => {
    // Scroll active line into view
    if (activeLineIndex >= 0 && containerRef.current) {
        const activeEl = containerRef.current.children[activeLineIndex] as HTMLElement;
        if (activeEl) {
            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
  }, [activeLineIndex]);

  if (lyricsState.isLoading) {
    return <div className="h-full flex items-center justify-center text-white/50">Loading lyrics...</div>;
  }

  if (lyricsState.error) {
    return <div className="h-full flex items-center justify-center text-red-400">{lyricsState.error}</div>;
  }

  return (
    <div className="h-full w-full relative group">
        {/* Gradient Masks for smooth fade out at top/bottom */}
        <div className="absolute top-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-b from-black/0 to-transparent z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-16 md:h-32 bg-gradient-to-t from-black/0 to-transparent z-10 pointer-events-none" />

        <div 
            ref={containerRef}
            className="h-full overflow-y-auto no-scrollbar py-[45vh] md:py-[40vh] space-y-8 md:space-y-10 px-4 md:px-4 text-center md:text-left"
            style={{ scrollBehavior: 'smooth' }}
        >
            {lyricsState.lines.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                
                return (
                    <p 
                        key={idx} 
                        onClick={() => onLineClick(line.time)}
                        className={`transition-all duration-500 ease-out font-bold leading-tight cursor-pointer origin-center md:origin-left
                            ${isActive 
                                ? 'text-3xl md:text-5xl lg:text-6xl text-white opacity-100 scale-100' 
                                : 'text-xl md:text-3xl lg:text-4xl text-white/30 opacity-40 hover:opacity-100 hover:text-white/60 blur-[0.5px] hover:blur-none'
                            }
                        `}
                    >
                        {line.text}
                    </p>
                );
            })}
             {lyricsState.lines.length === 0 && (
                <div className="text-white/30 text-xl md:text-2xl mt-20">No Lyrics Available</div>
            )}
        </div>
    </div>
  );
};

export default LyricsPanel;