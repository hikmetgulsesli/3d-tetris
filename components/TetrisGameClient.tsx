/**
 * Tetris Game Client Component
 * 
 * US-008: Client-only component for Three.js game
 */

'use client';

import { useEffect, useCallback } from 'react';
import { useGameStore, useKeyboard } from '@/hooks';
import { 
  GameBoard, 
  NextPieces, 
  HoldPiece, 
  ScoreBoard, 
  Controls,
  GameOverlay 
} from '@/components';

export default function TetrisGameClient() {
  const {
    gameState,
    board,
    currentPiece,
    ghostPosition,
    holdPiece,
    canHold,
    nextPieces,
    score,
    highScore,
    startGame,
    pauseGame,
    resetGame,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotateCW,
    rotateCCW,
    hold,
  } = useGameStore();

  // Handle keyboard actions
  const handleAction = useCallback((action: string) => {
    switch (action) {
      case 'MOVE_LEFT':
        moveLeft();
        break;
      case 'MOVE_RIGHT':
        moveRight();
        break;
      case 'SOFT_DROP':
        moveDown();
        break;
      case 'HARD_DROP':
        hardDrop();
        break;
      case 'ROTATE_CW':
        rotateCW();
        break;
      case 'ROTATE_CCW':
        rotateCCW();
        break;
      case 'HOLD':
        hold();
        break;
      case 'PAUSE':
        pauseGame();
        break;
    }
  }, [moveLeft, moveRight, moveDown, hardDrop, rotateCW, rotateCCW, hold, pauseGame]);

  // Set up keyboard input
  useKeyboard({
    onAction: handleAction,
    enabled: gameState !== 'START',
  });

  // Handle Enter key for start screen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && gameState === 'START') {
        startGame();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  // Game loop for gravity
  useEffect(() => {
    if (gameState !== 'PLAYING') return;

    const dropInterval = Math.max(100, 1000 - (score.level - 1) * 80);
    
    const interval = setInterval(() => {
      moveDown();
    }, dropInterval);

    return () => clearInterval(interval);
  }, [gameState, score.level, moveDown]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Background glow effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-0 flex flex-col items-center justify-center min-h-screen p-4">
        {/* Header */}
        <header className="mb-4 text-center">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500">
              TETRIS 3D
            </span>
          </h1>
        </header>

        {/* Main game area */}
        <div className="flex flex-col lg:flex-row items-start justify-center gap-4 w-full max-w-6xl">
          {/* Left panel */}
          <aside className="flex flex-row lg:flex-col gap-4 order-2 lg:order-1">
            <HoldPiece piece={holdPiece} canHold={canHold} />
            <Controls />
          </aside>

          {/* Center - Game Board */}
          <div className="relative order-1 lg:order-2 flex-1 max-w-lg w-full aspect-[10/20] lg:aspect-auto lg:h-[600px]">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm rounded-2xl border border-slate-700/50 overflow-hidden">
              <GameBoard
                board={board}
                currentPiece={currentPiece}
                ghostPosition={ghostPosition}
              />
              
              {/* Overlays */}
              <GameOverlay
                gameState={gameState}
                score={score}
                highScore={highScore}
                onStart={startGame}
                onResume={pauseGame}
                onReset={resetGame}
              />
            </div>
          </div>

          {/* Right panel */}
          <aside className="flex flex-row lg:flex-col gap-4 order-3">
            <ScoreBoard score={score} highScore={highScore} />
            <NextPieces pieces={nextPieces} />
          </aside>
        </div>

        {/* Mobile controls hint */}
        <p className="mt-4 text-slate-500 text-sm lg:hidden">
          Use keyboard controls to play
        </p>
      </div>
    </main>
  );
}
