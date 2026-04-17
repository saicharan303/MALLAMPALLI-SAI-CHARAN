import React from 'react';
import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Music, Gamepad2, Sparkles, Terminal } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center bg-black static-noise scanlines selection:bg-neon-pink/50">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-neon-pink/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-neon-cyan/10 rounded-full blur-[150px] animate-pulse delay-1000" />
        
        {/* Aggressive Grid */}
        <div className="absolute inset-0 opacity-[0.05]" 
             style={{ 
               backgroundImage: `linear-gradient(#00f2ff 1px, transparent 1px), linear-gradient(90deg, #00f2ff 1px, transparent 1px)`,
               backgroundSize: '30px 30px'
             }} 
        />
      </div>

      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 mb-12 flex flex-col items-center group cursor-crosshair"
      >
        <div className="flex items-center gap-6 mb-6 px-4 screen-tear">
          <Gamepad2 className="w-10 h-10 text-neon-cyan animate-bounce" />
          <h1 
            data-text="GLITCH_SYSTEM"
            className="text-6xl md:text-9xl font-digital tracking-tighter text-white uppercase glitch"
          >
            GLITCH<span className="text-neon-pink">SYSTEM</span>
          </h1>
          <Music className="w-10 h-10 text-neon-pink animate-spin-slow" />
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 px-6 py-2 bg-neon-cyan/5 border border-neon-cyan/30 rounded-none skew-x-12 backdrop-blur-md">
            <Terminal className="w-4 h-4 text-neon-cyan" />
            <span className="text-xs font-mono uppercase tracking-[0.5em] text-neon-cyan animate-pulse">
              KERNEL_ACCESS_GRANTED // PROTOCOL_SNK_01
            </span>
          </div>
          <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-[1em] mt-2 skew-x-[-12deg]">
            SYNCHRONIZING_NEURAL_STREAMS...
          </div>
        </div>
      </motion.header>

      {/* Main Container */}
      <main className="relative z-10 w-full max-w-7xl px-4 flex flex-col lg:flex-row items-center justify-center gap-16 lg:items-start lg:skew-x-2">
        
        {/* Left Buffer / Status */}
        <motion.aside
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden xl:flex flex-col gap-4 w-48 text-[9px] font-mono text-neon-cyan/40 uppercase tracking-tighter leading-none"
        >
          {Array.from({ length: 15 }).map((_, i) => (
             <div key={i} className="flex justify-between border-b border-neon-cyan/10 pb-1">
               <span>HEX_ADDR_{i.toString(16).padStart(2, '0')}</span>
               <span className="animate-pulse">0x{Math.random().toString(16).slice(2, 6).toUpperCase()}</span>
             </div>
          ))}
        </motion.aside>

        {/* Game Window */}
        <motion.section
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="flex-shrink-0 relative group"
        >
          {/* Jarring Border Frame */}
          <div className="absolute -inset-4 border-2 border-neon-pink/20 skew-y-1 group-hover:skew-y-0 transition-transform duration-500 pointer-events-none" />
          <div className="absolute -inset-2 border border-neon-cyan/20 -skew-x-1 group-hover:skew-x-0 transition-transform duration-500 pointer-events-none" />
          <SnakeGame />
        </motion.section>

        {/* Info & Music Controls */}
        <motion.section
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col gap-8 w-full max-w-md lg:-skew-x-2"
        >
          <div className="space-y-6">
             <div className="bg-black border-2 border-white/10 p-8 rounded-none relative overflow-hidden group">
                {/* Internal Scanline effect */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-neon-cyan/5 to-transparent h-20 animate-scanline pointer-events-none" />
                
                <h4 className="text-sm font-digital uppercase tracking-widest text-neon-pink mb-6 flex items-center gap-3">
                  <div className="w-2 h-2 bg-neon-pink animate-ping" />
                  CORE_METRICS
                </h4>
                <ul className="space-y-4 text-xs font-mono tracking-tighter">
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">_MODULE</span>
                    <span className="text-white glitch" data-text="REPTILE_V3">REPTILE_V3</span>
                  </li>
                  <li className="flex justify-between border-b border-white/5 pb-2">
                    <span className="text-zinc-500">_AUDIO</span>
                    <span className="text-white animate-pulse">BITSTREAM_LOCKED</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-zinc-500">_ENTROPY</span>
                    <span className="text-neon-cyan">{(Math.random() * 100).toFixed(4)}%</span>
                  </li>
                </ul>
             </div>

             <MusicPlayer />
          </div>

          <div className="p-8 border-2 border-neon-cyan/20 bg-black rounded-none skew-y-1 hover:skew-y-0 transition-transform">
            <h5 className="text-xs font-digital text-neon-cyan uppercase tracking-widest mb-4">_INSTRUCTIONS</h5>
            <p className="text-[11px] text-zinc-500 font-mono leading-relaxed uppercase tracking-widest">
              Direct the <span className="text-neon-cyan">CYBER_ENTITY</span> using navigational arrows. 
              Terminate <span className="text-neon-pink">DATA_NODES</span> to expand memory. 
              Avoid <span className="text-neon-pink">BOUNDARY_ERRORS</span> and <span className="text-neon-pink">SELF_INTERSECTION</span>.
            </p>
          </div>
        </motion.section>
      </main>

      {/* Footer Decoration */}
      <footer className="mt-20 mb-12 relative z-10 opacity-20 hover:opacity-100 transition-opacity">
        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-[1em] animate-pulse">
          &lt;SYSTEM_ID: AIS-998 // BUILD_REBORN_2026&gt;
        </p>
      </footer>

      {/* Extreme Screen Tearing Overlay (Conditional) */}
      <div className="fixed inset-0 pointer-events-none z-[100] bg-white opacity-0 animate-flicker mix-blend-difference" />
    </div>
  );
}
