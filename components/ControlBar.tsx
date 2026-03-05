'use client';

import React from 'react';
import { GameState } from '../types/game-state';

interface ControlBarProps {
  gameState: GameState;
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
}

/**
 * Control Bar Component
 * 
 * US-010: Bottom control bar with Start/Pause/Restart buttons
 * - Shows different buttons based on game state
 * - Styled with neon accent colors and glass-morphism
 */
export function ControlBar({ gameState, onStart, onPause, onRestart }: ControlBarProps) {
  const isPlaying = gameState === 'PLAYING';
  const isPaused = gameState === 'PAUSED';
  const isGameOver = gameState === 'GAME_OVER';
  const isStart = gameState === 'START';

  return (
    <div 
      className="fixed bottom-0 left-0 right-0 flex justify-center gap-4 p-4 z-50"
      style={{ 
        background: 'linear-gradient(to top, rgba(10, 10, 18, 0.95), transparent)',
      }}
      data-testid="control-bar"
    >
      {/* Start Button - shown when not playing */}
      {(isStart || isGameOver) && (
        <button
          onClick={onStart}
          className="btn-primary"
          data-testid="control-start"
        >
          START
        </button>
      )}
      
      {/* Pause/Resume Button - shown when playing or paused */}
      {(isPlaying || isPaused) && (
        <button
          onClick={onPause}
          className="btn-primary"
          style={{
            background: isPaused 
              ? 'linear-gradient(135deg, var(--color-accent-green), #16a34a)'
              : 'linear-gradient(135deg, var(--color-accent-purple), #9333ea)',
          }}
          data-testid="control-pause"
        >
          {isPaused ? 'RESUME' : 'PAUSE'}
        </button>
      )}
      
      {/* Restart Button - shown when playing, paused, or game over */}
      {(!isStart) && (
        <button
          onClick={onRestart}
          className="btn-secondary"
          data-testid="control-restart"
        >
          RESTART
        </button>
      )}
    </div>
  );
}

export default ControlBar;
