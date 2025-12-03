import React, { useState, useEffect, useRef } from 'react';
import { Song, PlayerState, LyricsState, SyncedLine } from './types';
import { PLAYLIST, CUSTOM_LYRICS_LRC } from './constants';
import CoverArt from './components/CoverArt';
import Controls from './components/Controls';
import ProgressBar from './components/ProgressBar';
import LyricsPanel from './components/LyricsPanel';

// Simple LRC Parser
const parseLrc = (lrcString: string): SyncedLine[] => {
  const lines = lrcString.split('\n');
  const result: SyncedLine[] = [];
  
  // Regex to extract time like [00:08.52]
  const timeRegex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;

  lines.forEach(line => {
    const match = timeRegex.exec(line);
    if (match) {
      const minutes = parseInt(match[1], 10);
      const seconds = parseInt(match[2], 10);
      const milliseconds = parseInt(match[3], 10);
      
      const timeInSeconds = minutes * 60 + seconds + milliseconds / 100;
      const text = line.replace(timeRegex, '').trim();
      
      if (text) {
        result.push({ time: timeInSeconds, text });
      }
    }
  });

  return result.sort((a, b) => a.time - b.time);
};

const App: React.FC = () => {
  // --- State ---
  const [playlist, setPlaylist] = useState<Song[]>(PLAYLIST);
  const [currentSong, setCurrentSong] = useState<Song>(PLAYLIST[0]);
  const [playerState, setPlayerState] = useState<PlayerState>(PlayerState.PAUSED);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [lyrics, setLyrics] = useState<LyricsState>({ lines: [], isLoading: false, error: null });

  // --- Refs ---
  const audioRef = useRef<HTMLAudioElement>(null);

  // --- Effects ---

  // Handle Song Change
  useEffect(() => {
    setPlayerState(PlayerState.LOADING);
    setCurrentTime(0);
    
    // Load Audio
    if (audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
      audioRef.current.load();
      // Auto play
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setPlayerState(PlayerState.PLAYING))
          .catch(() => setPlayerState(PlayerState.PAUSED));
      }
    }

    // Load Lyrics (Static for the demo song, or generic for others)
    if (currentSong.id === 'custom-1') {
      const parsed = parseLrc(CUSTOM_LYRICS_LRC);
      setLyrics({ lines: parsed, isLoading: false, error: null });
    } else {
      // Fallback for other songs
      setLyrics({ 
        lines: [
          { time: 0, text: "Lyrics not available for this track." }
        ], 
        isLoading: false, 
        error: null 
      });
    }
  }, [currentSong]);

  // --- Audio Event Handlers ---
  const onTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const onLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const onEnded = () => {
    handleNext();
  };

  // --- Control Handlers ---
  const handlePlayPause = () => {
    if (!audioRef.current) return;
    
    if (playerState === PlayerState.PLAYING) {
      audioRef.current.pause();
      setPlayerState(PlayerState.PAUSED);
    } else {
      audioRef.current.play();
      setPlayerState(PlayerState.PLAYING);
    }
  };

  const handleNext = () => {
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentSong(playlist[nextIndex]);
  };

  const handlePrev = () => {
    const currentIndex = playlist.findIndex(s => s.id === currentSong.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentSong(playlist[prevIndex]);
  };

  const handleSeek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  // --- Render ---

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white select-none font-sans">
      {/* Background Layer - Full Screen Blur */}
      <div 
        className="absolute inset-0 z-0 transition-all duration-1000 ease-in-out opacity-50 blur-[80px] scale-110" 
        style={{
            backgroundImage: `url(${currentSong.coverUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
        }} 
      />
      <div className="absolute inset-0 z-0 bg-black/60" />

      {/* Main Content Layout */}
      <div className="relative z-10 w-full h-full flex flex-col md:flex-row">
        
        {/* === LYRICS AREA (Mobile: Top / Desktop: Right) === */}
        <div className="flex-1 min-h-0 relative order-1 md:order-2 overflow-hidden">
            <LyricsPanel 
                lyricsState={lyrics} 
                currentTime={currentTime} 
                onLineClick={handleSeek}
            />
        </div>

        {/* === PLAYER CONTROLS AREA (Mobile: Bottom / Desktop: Left) === */}
        <div className="shrink-0 z-50 order-2 md:order-1
            w-full md:w-[450px]
            bg-zinc-900/90 md:bg-transparent backdrop-blur-2xl md:backdrop-blur-none
            border-t border-white/10 md:border-none
            transition-all duration-300
        ">
            
            {/* 1. Mobile Bottom Bar Layout */}
            <div className="flex md:hidden flex-col p-4 pt-2 gap-3 pb-8">
                {/* Progress Bar Top of Mobile Controls */}
                <ProgressBar current={currentTime} duration={duration} onSeek={handleSeek} isMobile={true} />
                
                <div className="flex items-center gap-4">
                    {/* Small Cover */}
                    <div className="w-12 h-12 rounded-lg shadow-lg overflow-hidden shrink-0 relative ring-1 ring-white/10">
                        <CoverArt src={currentSong.coverUrl} state={playerState} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h1 className="text-sm font-bold truncate text-white leading-tight">{currentSong.title}</h1>
                        <p className="text-xs text-white/60 truncate leading-tight mt-0.5">{currentSong.artist}</p>
                    </div>

                    {/* Mini Controls */}
                    <Controls 
                        state={playerState} 
                        onPlayPause={handlePlayPause} 
                        onNext={handleNext} 
                        onPrev={handlePrev} 
                        isMobile={true}
                    />
                </div>
            </div>

            {/* 2. Desktop Sidebar Layout */}
            <div className="hidden md:flex flex-col justify-center h-full p-12 gap-8 text-center md:text-left">
                {/* Big Cover Art */}
                <div className="w-full aspect-square rounded-2xl shadow-2xl overflow-hidden relative group ring-1 ring-white/10 shrink-0">
                    <CoverArt src={currentSong.coverUrl} state={playerState} />
                </div>

                {/* Song Info */}
                <div className="w-full">
                    <h1 className="text-3xl font-bold truncate tracking-tight text-white">{currentSong.title}</h1>
                    <p className="text-lg text-white/60 truncate mt-2 font-medium">{currentSong.artist}</p>
                </div>

                {/* Progress & Controls */}
                <div className="w-full mt-2">
                    <ProgressBar current={currentTime} duration={duration} onSeek={handleSeek} />
                    <Controls 
                        state={playerState} 
                        onPlayPause={handlePlayPause} 
                        onNext={handleNext} 
                        onPrev={handlePrev} 
                    />
                </div>
            </div>
        </div>

      </div>

      {/* Hidden Audio Element */}
      <audio 
        ref={audioRef}
        onTimeUpdate={onTimeUpdate}
        onLoadedMetadata={onLoadedMetadata}
        onEnded={onEnded}
      />
    </div>
  );
};

export default App;