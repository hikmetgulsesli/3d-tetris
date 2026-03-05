/**
 * UI Panels Components
 * 
 * US-009: UI panels - Score, controls, and game status
 * Left panel: Hold piece and controls reference
 * Right panel: Score, Level, Lines, Next pieces
 */

'use client';

import React from 'react';
import { useGame } from '../lib/gameStore';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINO_COLORS } from '../types/tetromino';

// Mini piece preview (2D grid representation)
interface MiniPieceProps {
  type: TetrominoType;
  size?: number;
}

const MINI_SHAPES: Record<TetrominoType, number[][]> = {
  I: [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
  O: [[1, 1], [1, 1]],
  T: [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
  S: [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
  Z: [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
  J: [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
  L: [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
};

export function MiniPiece({ type, size = 80 }: MiniPieceProps) {
  const shape = MINI_SHAPES[type];
  const cellSize = size / 4;
  const colors = TETROMINO_COLORS[type];

  return (
    <div
      className="grid gap-px p-2 rounded-lg"
      style={{
        width: size,
        height: size,
        backgroundColor: 'rgba(10, 10, 18, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        gridTemplateColumns: `repeat(4, ${cellSize}px)`,
        gridTemplateRows: `repeat(4, ${cellSize}px)`,
      }}
    >
      {shape.flat().map((cell, index) => {
        const row = Math.floor(index / 4);
        const col = index % 4;
        return (
          <div
            key={index}
            className="rounded-sm"
            style={{
              width: cellSize - 2,
              height: cellSize - 2,
              backgroundColor: cell ? colors.color : 'transparent',
              boxShadow: cell ? `0 0 6px ${colors.emissive}` : 'none',
              gridRow: row + 1,
              gridColumn: col + 1,
            }}
          />
        );
      })}
    </div>
  );
}

// Hold Piece Panel
export function HoldPiecePanel() {
  const { state } = useGame();
  const { holdPiece } = state;

  return (
    <div
      className="rounded-xl p-4 backdrop-blur-md"
      style={{
        background: 'rgba(26, 26, 46, 0.8)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
      }}
      data-testid="hold-panel"
    >
      <h3
        className="text-sm font-semibold mb-3 tracking-wider uppercase"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Hold (C)
      </h3>
      <div className="flex justify-center items-center h-24">
        {holdPiece ? (
          <MiniPiece type={holdPiece} size={64} />
        ) : (
          <div
            className="flex items-center justify-center h-16 w-16 rounded-lg"
            style={{
              backgroundColor: 'rgba(10, 10, 18, 0.6)',
              border: '1px dashed rgba(255, 255, 255, 0.2)',
            }}
          >
            <span className="text-2xl text-white/20">—</span>
          </div>
        )}
      </div>
    </div>
  );
}

// Controls Reference Panel
const CONTROLS = [
  { key: '← / →', action: 'Move' },
  { key: '↓', action: 'Soft Drop' },
  { key: 'Space', action: 'Hard Drop' },
  { key: '↑ / Z', action: 'Rotate' },
  { key: 'X', action: 'Rotate CW' },
  { key: 'C', action: 'Hold' },
  { key: 'P / Esc', action: 'Pause' },
];

export function ControlsPanel() {
  return (
    <div
      className="rounded-xl p-4 backdrop-blur-md"
      style={{
        background: 'rgba(26, 26, 46, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      data-testid="controls-panel"
    >
      <h3
        className="text-sm font-semibold mb-3 tracking-wider uppercase"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Controls
      </h3>
      <div className="space-y-2">
        {CONTROLS.map((control, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm"
          >
            <kbd
              className="px-2 py-1 rounded text-xs font-mono"
              style={{
                background: 'rgba(10, 10, 18, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--color-accent-cyan)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {control.key}
            </kbd>
            <span
              style={{
                color: 'var(--color-text-primary)',
                fontFamily: 'var(--font-body)',
              }}
            >
              {control.action}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Score Counter Component
interface CounterProps {
  label: string;
  value: number;
  digits?: number;
  color?: string;
}

export function Counter({ label, value, digits = 6, color = 'var(--color-text-primary)' }: CounterProps) {
  const formatted = value.toString().padStart(digits, '0');

  return (
    <div className="text-center">
      <div
        className="text-xs uppercase tracking-wider mb-1"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-secondary)',
        }}
      >
        {label}
      </div>
      <div
        className="text-2xl font-bold tabular-nums"
        style={{
          fontFamily: 'var(--font-heading)',
          color,
          textShadow: color !== 'var(--color-text-primary)' ? `0 0 10px ${color}40` : 'none',
        }}
        data-testid={`counter-${label.toLowerCase().replace(/\s+/g, '-')}`}
      >
        {formatted}
      </div>
    </div>
  );
}

// Score Panel
export function ScorePanel() {
  const { state } = useGame();
  const { score, level, lines } = state;

  return (
    <div
      className="rounded-xl p-4 backdrop-blur-md space-y-4"
      style={{
        background: 'rgba(26, 26, 46, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      data-testid="score-panel"
    >
      <Counter label="Score" value={score} digits={7} color="var(--color-accent-cyan)" />
      <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/10">
        <Counter label="Level" value={level} digits={2} color="var(--color-accent-purple)" />
        <Counter label="Lines" value={lines} digits={3} color="var(--color-accent-green)" />
      </div>
    </div>
  );
}

// Next Pieces Panel
export function NextPiecesPanel() {
  const { state } = useGame();
  const { nextPieces } = state;

  // Fill with placeholders if less than 3 pieces
  const displayPieces: (TetrominoType | null)[] = [...nextPieces];
  while (displayPieces.length < 3) {
    displayPieces.push(null);
  }

  return (
    <div
      className="rounded-xl p-4 backdrop-blur-md"
      style={{
        background: 'rgba(26, 26, 46, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      data-testid="next-pieces-panel"
    >
      <h3
        className="text-sm font-semibold mb-3 tracking-wider uppercase"
        style={{
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-secondary)',
        }}
      >
        Next
      </h3>
      <div className="space-y-2">
        {displayPieces.slice(0, 3).map((piece, index) => (
          <div
            key={index}
            className="flex justify-center items-center h-16"
            style={{
              backgroundColor: index === 0 ? 'rgba(10, 10, 18, 0.4)' : 'transparent',
              borderRadius: '8px',
            }}
          >
            {piece ? (
              <MiniPiece type={piece} size={48} />
            ) : (
              <div
                className="flex items-center justify-center h-12 w-12 rounded-lg"
                style={{
                  backgroundColor: 'rgba(10, 10, 18, 0.6)',
                  border: '1px dashed rgba(255, 255, 255, 0.1)',
                }}
              >
                <span className="text-xl text-white/10">?</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Game Status Overlay
export function GameStatusOverlay() {
  const { state, startGame, resumeGame, restartGame } = useGame();
  const { status, score, highScore } = state;

  if (status === 'PLAYING') return null;

  const overlayContent = () => {
    switch (status) {
      case 'START':
        return (
          <div className="text-center space-y-6">
            <h1
              className="text-5xl font-bold"
              style={{
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              TETRIS 3D
            </h1>
            <p
              className="text-lg animate-pulse"
              style={{ color: 'var(--color-text-secondary)' }}
            >
              Press ENTER to Start
            </p>
            <button
              onClick={startGame}
              className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'var(--color-accent-cyan)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              }}
            >
              Start Game
            </button>
          </div>
        );

      case 'PAUSED':
        return (
          <div className="text-center space-y-6">
            <h2
              className="text-4xl font-bold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-accent-yellow)',
              }}
            >
              PAUSED
            </h2>
            <button
              onClick={resumeGame}
              className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'var(--color-accent-cyan)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              }}
            >
              Resume
            </button>
          </div>
        );

      case 'GAME_OVER':
        const isNewHighScore = score > 0 && score === highScore;
        return (
          <div className="text-center space-y-6">
            <h2
              className="text-4xl font-bold"
              style={{
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-accent-red)',
              }}
            >
              GAME OVER
            </h2>
            <div className="space-y-2">
              <p style={{ color: 'var(--color-text-secondary)' }}>Final Score</p>
              <p
                className="text-3xl font-bold tabular-nums"
                style={{ color: 'var(--color-accent-cyan)' }}
              >
                {score.toLocaleString()}
              </p>
              {isNewHighScore && (
                <p
                  className="text-sm font-semibold animate-pulse"
                  style={{ color: 'var(--color-accent-yellow)' }}
                >
                  🎉 NEW HIGH SCORE! 🎉
                </p>
              )}
              <p
                className="text-sm"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                High Score: <span className="tabular-nums">{highScore.toLocaleString()}</span>
              </p>
            </div>
            <button
              onClick={() => restartGame()}
              className="px-8 py-3 rounded-lg font-semibold transition-all hover:scale-105"
              style={{
                background: 'var(--color-accent-cyan)',
                color: '#000',
                fontFamily: 'var(--font-heading)',
                boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
              }}
            >
              Play Again
            </button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-50 backdrop-blur-sm"
      style={{ backgroundColor: 'rgba(10, 10, 18, 0.85)' }}
      data-testid="game-status-overlay"
    >
      <div
        className="rounded-2xl p-8 max-w-md w-full mx-4"
        style={{
          background: 'rgba(26, 26, 46, 0.95)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          boxShadow: '0 0 40px rgba(0, 0, 0, 0.5)',
        }}
      >
        {overlayContent()}
      </div>
    </div>
  );
}

// Game Title Header
export function GameTitle() {
  return (
    <div className="text-center py-4" data-testid="game-title">
      <h1
        className="text-3xl font-bold tracking-wider"
        style={{
          fontFamily: 'var(--font-heading)',
          background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-purple))',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
        }}
      >
        TETRIS 3D
      </h1>
    </div>
  );
}

// Left Panel (Hold + Controls)
export function LeftPanel() {
  return (
    <div className="flex flex-col gap-4 w-48" data-testid="left-panel">
      <HoldPiecePanel />
      <ControlsPanel />
    </div>
  );
}

// Right Panel (Score + Next)
export function RightPanel() {
  return (
    <div className="flex flex-col gap-4 w-48" data-testid="right-panel">
      <ScorePanel />
      <NextPiecesPanel />
    </div>
  );
}

// Game Controls (Start/Pause/Restart buttons)
export function GameControls() {
  const { state, startGame, pauseGame, resumeGame, restartGame } = useGame();
  const { status } = state;

  return (
    <div className="flex justify-center gap-4 py-4" data-testid="game-controls">
      {status === 'START' && (
        <button
          onClick={startGame}
          className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background: 'var(--color-accent-cyan)',
            color: '#000',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
          }}
        >
          Start
        </button>
      )}

      {status === 'PLAYING' && (
        <button
          onClick={pauseGame}
          className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background: 'var(--color-accent-yellow)',
            color: '#000',
            fontFamily: 'var(--font-heading)',
          }}
        >
          Pause
        </button>
      )}

      {status === 'PAUSED' && (
        <>
          <button
            onClick={resumeGame}
            className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              background: 'var(--color-accent-cyan)',
              color: '#000',
              fontFamily: 'var(--font-heading)',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
            }}
          >
            Resume
          </button>
          <button
            onClick={() => restartGame()}
            className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
            style={{
              background: 'var(--color-accent-red)',
              color: '#fff',
              fontFamily: 'var(--font-heading)',
            }}
          >
            Restart
          </button>
        </>
      )}

      {status === 'GAME_OVER' && (
        <button
          onClick={() => restartGame()}
          className="px-6 py-2 rounded-lg font-semibold transition-all hover:scale-105"
          style={{
            background: 'var(--color-accent-cyan)',
            color: '#000',
            fontFamily: 'var(--font-heading)',
            boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)',
          }}
        >
          Restart
        </button>
      )}
    </div>
  );
}


