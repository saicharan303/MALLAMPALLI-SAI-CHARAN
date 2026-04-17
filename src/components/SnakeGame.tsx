import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Play, RotateCcw, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 2;

type Point = { x: number; y: number };
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isPaused, setIsPaused] = useState(true);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 15, y: 15 });
    setDirection('RIGHT');
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    setIsPaused(true);
  };

  const moveSnake = useCallback(() => {
    if (gameOver || isPaused) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setGameOver(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check if food is eaten
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((s) => Math.max(s - SPEED_INCREMENT, 50));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, gameOver, isPaused, generateFood, score, highScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !gameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, gameOver, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-8 p-8 md:p-12 bg-black border-4 border-neon-cyan mb-4 relative overflow-hidden group">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-neon-pink z-20" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-neon-pink z-20" />
      
      <div className="w-full flex justify-between items-center mb-6 px-4">
        <div className="flex flex-col">
          <span className="text-[12px] uppercase tracking-[0.3em] text-neon-cyan font-digital mb-2">_QUANTUM_DATA</span>
          <span className="text-4xl font-digital text-neon-cyan text-glow-cyan font-bold leading-none glitch" data-text={score.toString().padStart(4, '0')}>
            {score.toString().padStart(4, '0')}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-[12px] uppercase tracking-[0.3em] text-neon-pink font-digital mb-2">_PEAK_MEMORY</span>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-neon-pink animate-pulse" />
            <span className="text-4xl font-digital text-neon-pink text-glow-pink font-bold leading-none">
              {highScore.toString().padStart(4, '0')}
            </span>
          </div>
        </div>
      </div>

      <div 
        className="relative bg-black border-4 border-neon-cyan/50 rounded-none overflow-hidden group-hover:border-neon-pink transition-colors duration-300"
        style={{ 
          width: 'min(85vw, 450px)', 
          height: 'min(85vw, 450px)',
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
        }}
      >
        {/* Aggressive Grid Pattern */}
        <div className="absolute inset-0 grid grid-cols-20 grid-rows-20 pointer-events-none opacity-20">
           {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, i) => (
             <div key={i} className="border-[1px] border-neon-cyan/10" />
           ))}
        </div>

        {/* Scanline Overlay for board */}
        <div className="absolute inset-0 scanlines pointer-events-none z-10 opacity-30" />

        {/* Snake Rendering */}
        {snake.map((segment, i) => (
          <div
            key={`${segment.x}-${segment.y}-${i}`}
            className={`${i === 0 ? 'bg-neon-cyan shadow-[0_0_20px_#00f2ff] z-20 scale-110' : 'bg-neon-cyan/40 border border-neon-cyan/20'} rounded-none`}
            style={{
              gridColumnStart: segment.x + 1,
              gridRowStart: segment.y + 1,
            }}
          >
             {i === 0 && <div className="w-full h-full bg-white opacity-20 animate-pulse" />}
          </div>
        ))}

        {/* Food Rendering */}
        <motion.div
          animate={{ 
            scale: [1, 1.5, 1], 
            rotate: [0, 90, 180, 270, 360],
            backgroundColor: ['#ff00ff', '#00f2ff', '#ff00ff']
          }}
          transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
          className="rounded-none shadow-[0_0_25px_#ff00ff] z-10"
          style={{
            gridColumnStart: food.x + 1,
            gridRowStart: food.y + 1,
          }}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(isPaused || gameOver) && (
            <motion.div 
              initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              animate={{ opacity: 1, backdropFilter: 'blur(8px)' }}
              exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
              className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center p-8 text-center z-[100] screen-tear"
            >
              {gameOver ? (
                <>
                  <motion.h2 
                    initial={{ scale: 0.5, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    data-text="SYSTEM_FAILURE"
                    className="text-6xl font-digital text-neon-pink mb-6 glitch"
                  >
                    SYSTEM_FAILURE
                  </motion.h2>
                  <p className="text-neon-cyan mb-10 font-digital text-2xl tracking-[0.2em] uppercase">
                    DATA_RECOVERY_FEE: {score} BIT
                  </p>
                  <button
                    onClick={resetGame}
                    className="flex items-center gap-4 px-12 py-4 bg-neon-pink text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-colors shadow-[0_0_40px_rgba(255,0,255,0.5)] skew-x-12 active:skew-x-0"
                  >
                    <RotateCcw className="w-6 h-6" /> RE_INITIALIZE
                  </button>
                </>
              ) : (
                <>
                  <div className="relative mb-10">
                    <Play className="w-24 h-24 text-neon-cyan animate-pulse" />
                    <div className="absolute inset-0 border-2 border-neon-cyan animate-ping opacity-20" />
                  </div>
                  <button
                    onClick={() => setIsPaused(false)}
                    className="px-16 py-4 bg-neon-cyan text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-colors shadow-[0_0_40px_rgba(0,242,255,0.5)] -skew-x-12 active:skew-x-0"
                  >
                    CONTINUE_SESSION
                  </button>
                  <p className="mt-8 text-sm text-neon-cyan/40 font-mono uppercase tracking-[0.5em] animate-pulse">
                    READY_FOR_UPSTREAM_SYNC
                  </p>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* On-screen Controls (Mobile/Touch support) */}
      <div className="grid grid-cols-3 gap-4 mt-4">
        <div />
        <button 
          onClick={() => direction !== 'DOWN' && setDirection('UP')}
          className="p-6 bg-zinc-950 border-2 border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center justify-center group/btn"
        >
          <ChevronUp className="w-8 h-8 group-active/btn:scale-150 transition-transform" />
        </button>
        <div />
        <button 
          onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
          className="p-6 bg-zinc-950 border-2 border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center justify-center group/btn"
        >
          <ChevronLeft className="w-8 h-8 group-active/btn:scale-150 transition-transform" />
        </button>
        <button 
          onClick={() => direction !== 'UP' && setDirection('DOWN')}
          className="p-6 bg-zinc-950 border-2 border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center justify-center group/btn"
        >
          <ChevronDown className="w-8 h-8 group-active/btn:scale-150 transition-transform" />
        </button>
        <button 
          onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
          className="p-6 bg-zinc-950 border-2 border-neon-cyan/30 text-neon-cyan hover:border-neon-cyan hover:bg-neon-cyan/10 transition-all flex items-center justify-center group/btn"
        >
          <ChevronRight className="w-8 h-8 group-active/btn:scale-150 transition-transform" />
        </button>
      </div>
    </div>
  );
}
