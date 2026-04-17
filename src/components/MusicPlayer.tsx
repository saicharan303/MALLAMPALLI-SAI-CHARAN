import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music2 } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: "Cyber Pulse",
    artist: "AI Synth Engine",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#00f2ff",
  },
  {
    id: 2,
    title: "Neon Nights",
    artist: "Neural Rhythm",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#ff00ff",
  },
  {
    id: 3,
    title: "Digital Dreams",
    artist: "Vapor Ghost",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#39ff14",
  },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.log("Audio play blocked", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(p) ? 0 : p);
    };

    const handleEnd = () => {
      handleNext();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnd);
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [currentTrackIndex]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const p = x / rect.width;
    if (audioRef.current) {
      audioRef.current.currentTime = p * audioRef.current.duration;
    }
  };

  return (
    <div className="w-full max-w-md bg-black border-4 border-neon-cyan p-8 shadow-[0_0_50px_rgba(0,242,255,0.2)] relative overflow-hidden group">
      {/* Jarring accent lines */}
      <div className="absolute top-0 right-0 w-20 h-1 bg-neon-pink" />
      <div className="absolute bottom-0 left-0 w-20 h-1 bg-neon-pink" />
      
      <audio ref={audioRef} src={currentTrack.url} />
      
      <div className="flex items-center gap-6 mb-8 relative">
        <div 
          className="w-20 h-20 bg-black border-2 border-neon-cyan flex items-center justify-center relative overflow-hidden screen-tear"
        >
          <Music2 className="w-10 h-10 relative z-10 text-neon-cyan" />
          <motion.div 
            animate={isPlaying ? { 
              scale: [1, 2, 1], 
              opacity: [0.1, 0.4, 0.1],
              rotate: [0, 90, 180, 270, 360]
            } : {}}
            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
            className="absolute inset-0 bg-neon-cyan"
          />
        </div>
        
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="flex flex-col"
            >
              <h3 className="text-2xl font-digital truncate text-white uppercase tracking-widest glitch" data-text={currentTrack.title}>
                {currentTrack.title}
              </h3>
              <p className="text-[10px] text-neon-cyan font-mono tracking-[0.5em] mt-2 animate-pulse">
                SOURCE::[ {currentTrack.artist} ]
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-6">
        {/* Progress Bar */}
        <div className="flex justify-between items-center mb-1">
          <span className="text-[9px] font-mono text-neon-cyan uppercase">_TRACK_POSITION</span>
          <span className="text-[9px] font-mono text-neon-pink uppercase">{progress.toFixed(2)}%</span>
        </div>
        <div 
          className="h-4 w-full bg-zinc-900 border border-white/10 cursor-pointer relative overflow-hidden"
          onClick={handleProgressClick}
        >
          <div 
            className="absolute top-0 left-0 h-full transition-all duration-100 ease-linear bg-neon-cyan shadow-[0_0_15px_#00f2ff]"
            style={{ width: `${progress}%` }}
          />
          {/* Subtle glitch segments on bar */}
          <div className="absolute inset-0 opacity-10 pointer-events-none" 
               style={{ background: 'repeating-linear-gradient(90deg, transparent, transparent 10px, #fff 10px, #fff 11px)' }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3 group/vol">
            <Volume2 className="w-4 h-4 text-neon-cyan group-hover:text-neon-pink transition-colors" />
            <div className="w-12 h-1.5 bg-zinc-900 border border-white/5">
              <div className="w-2/3 h-full bg-neon-cyan" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <button 
              onClick={handlePrev}
              className="text-white hover:text-neon-cyan transition-colors transform hover:-translate-x-1"
            >
              <SkipBack className="w-7 h-7" />
            </button>
            <button 
              onClick={togglePlay}
              className="w-16 h-16 flex items-center justify-center border-4 border-white text-white hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
            >
              {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
            </button>
            <button 
              onClick={handleNext}
              className="text-white hover:text-neon-cyan transition-colors transform hover:translate-x-1"
            >
              <SkipForward className="w-7 h-7" />
            </button>
          </div>

          <div className="text-[9px] font-mono text-zinc-600 uppercase tracking-widest text-right">
            DB_IDX: 0{currentTrackIndex + 1}<br/>
            LEN: 03:44
          </div>
        </div>
      </div>
    </div>
  );
}
