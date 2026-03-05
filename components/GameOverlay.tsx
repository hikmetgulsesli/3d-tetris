/**
 * Game Overlay Component
 * 
 * US-008: Overlay for start screen, paused, and game over states
 */

import type { GameState, Score } from '../hooks/useGameStore';

interface GameOverlayProps {
  /** Current game state */
  gameState: GameState;
  /** Current score */
  score: Score;
  /** High score */
  highScore: number;
  /** Start game callback */
  onStart: () => void;
  /** Resume game callback */
  onResume: () => void;
  /** Reset game callback */
  onReset: () => void;
}

/**
 * GameOverlay component - displays state-based overlays
 */
export function GameOverlay({
  gameState,
  score,
  highScore,
  onStart,
  onResume,
  onReset,
}: GameOverlayProps) {
  if (gameState === 'PLAYING') {
    return null;
  }

  // Start screen
  if (gameState === 'START') {
    return (
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <h1 className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 mb-4 tracking-tight">
          TETRIS 3D
        </h1>
        <p className="text-slate-400 mb-8 text-lg">Next-generation block stacking</p>
        
        <div className="flex flex-col items-center space-y-4">
          <button
            onClick={onStart}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25"
          >
            Press ENTER to Start
          </button>
          
          <p className="text-slate-500 text-sm mt-4">
            Use arrow keys to move • Space to hard drop
          </p>
        </div>
      </div>
    );
  }

  // Paused screen
  if (gameState === 'PAUSED') {
    return (
      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <h2 className="text-5xl font-black text-yellow-400 mb-4 tracking-wider">PAUSED</h2>
        <p className="text-slate-400 mb-8">Game is paused</p>
        
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={onResume}
            className="px-6 py-2 bg-green-600 hover:bg-green-500 text-white font-bold rounded-lg transition-colors"
          >
            Resume (P)
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold rounded-lg transition-colors"
          >
            Quit Game
          </button>
        </div>
      </div>
    );
  }

  // Game Over screen
  if (gameState === 'GAME_OVER') {
    const isNewHighScore = score.points > 0 && score.points >= highScore;
    
    return (
      <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-sm flex flex-col items-center justify-center z-10">
        <h2 className="text-5xl font-black text-red-500 mb-4 tracking-wider">GAME OVER</h2>
        
        {isNewHighScore && (
          <div className="mb-4 px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full">
            <span className="text-black font-bold text-sm uppercase tracking-wider">🏆 New High Score!</span>
          </div>
        )}
        
        <div className="bg-slate-900/80 rounded-2xl border border-slate-700 p-6 mb-8 min-w-[250px]">
          <div className="text-center mb-4">
            <p className="text-slate-400 text-sm uppercase tracking-wider">Final Score</p>
            <p className="text-4xl font-mono font-bold text-white tabular-nums">
              {score.points.toLocaleString()}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-slate-500 text-xs uppercase">Level</p>
              <p className="text-xl font-mono font-bold text-yellow-400">{score.level}</p>
            </div>
            <div>
              <p className="text-slate-500 text-xs uppercase">Lines</p>
              <p className="text-xl font-mono font-bold text-cyan-400">{score.lines}</p>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-4 pt-4 text-center">
            <p className="text-slate-500 text-xs uppercase">High Score</p>
            <p className="text-lg font-mono font-bold text-amber-400 tabular-nums">
              {highScore.toLocaleString()}
            </p>
          </div>
        </div>
        
        <div className="flex flex-col items-center space-y-3">
          <button
            onClick={onStart}
            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-full text-lg transition-all transform hover:scale-105 active:scale-95 shadow-lg shadow-cyan-500/25"
          >
            Play Again
          </button>
          <button
            onClick={onReset}
            className="px-6 py-2 text-slate-400 hover:text-slate-300 font-medium transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return null;
}

export default GameOverlay;
