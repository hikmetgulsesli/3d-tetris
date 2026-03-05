'use client';

import React, { useEffect, useState } from 'react';
import './globals.css';
import {
  HoldPiecePanel,
  ControlsPanel,
  ScorePanel,
  NextPiecesPanel,
  GameActionsPanel,
} from '../components';
import { useGameStore } from '../store';
import { getRandomTetrominoType } from '../lib/tetrominos';
import type { TetrominoType } from '../types';

// Generate initial next pieces
function generateNextPieces(count: number): TetrominoType[] {
  const pieces: TetrominoType[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push(getRandomTetrominoType());
  }
  return pieces;
}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  
  const {
    gameState,
    score,
    level,
    lines,
    combo,
    highScore,
    nextPieces,
    holdPiece,
    startGame,
    pauseGame,
    restartGame,
    setNextPieces,
  } = useGameStore();

  // Initialize next pieces on mount
  useEffect(() => {
    setMounted(true);
    if (nextPieces.length === 0) {
      setNextPieces(generateNextPieces(5));
    }
  }, [nextPieces.length, setNextPieces]);

  const handleStart = () => {
    if (gameState === 'start') {
      startGame();
    } else if (gameState === 'paused') {
      pauseGame(); // Toggle
    }
  };

  const handlePause = () => {
    pauseGame();
  };

  const handleRestart = () => {
    restartGame();
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div
      className="game-container"
      style={{
        minHeight: '100vh',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Starfield Background */}
      <div className="stars" />

      {/* Main Game Layout */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '280px 1fr 280px',
          gap: '2rem',
          height: '100vh',
          padding: '1.5rem',
          position: 'relative',
          zIndex: 'var(--z-base)',
        }}
      >
        {/* Left Panel */}
        <div
          className="side-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <HoldPiecePanel piece={holdPiece} />
          <ControlsPanel />
        </div>

        {/* Center Game Area */}
        <div
          className="game-area"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Game Title */}
          <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
            <h1
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-lg)',
                fontWeight: 700,
                letterSpacing: '0.2em',
                background: 'linear-gradient(135deg, var(--color-accent-cyan), #00d4ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              TETRIS 3D
            </h1>
          </div>

          {/* Game Board Placeholder */}
          <div
            className="game-board-container"
            style={{
              position: 'relative',
              background: 'var(--color-bg-card)',
              border: '2px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '8px',
              padding: '1rem',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.1), inset 0 0 60px rgba(0,0,0,0.3)',
            }}
            data-testid="game-board-container"
          >
            <div
              className="game-board"
              style={{
                width: 300,
                height: 600,
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {gameState === 'start' && (
                <div
                  style={{
                    textAlign: 'center',
                    color: 'var(--color-text-secondary)',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-base)',
                      animation: 'blink 1.5s ease-in-out infinite',
                    }}
                  >
                    Press ENTER to Start
                  </p>
                </div>
              )}
              
              {gameState === 'paused' && (
                <div
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 700,
                      color: 'var(--color-accent-yellow)',
                      textShadow: '0 0 20px rgba(234, 179, 8, 0.5)',
                    }}
                  >
                    PAUSED
                  </h2>
                </div>
              )}
              
              {gameState === 'gameover' && (
                <div
                  style={{
                    textAlign: 'center',
                  }}
                >
                  <h2
                    style={{
                      fontFamily: 'var(--font-heading)',
                      fontSize: 'var(--text-2xl)',
                      fontWeight: 700,
                      color: 'var(--color-accent-red)',
                      textShadow: '0 0 20px rgba(239, 68, 68, 0.5)',
                    }}
                  >
                    GAME OVER
                  </h2>
                  <p style={{ marginTop: '1rem', color: 'var(--color-text-secondary)' }}>
                    Final Score: {score.toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Game Actions */}
          <GameActionsPanel
            gameState={gameState}
            onStart={handleStart}
            onPause={handlePause}
            onRestart={handleRestart}
          />
        </div>

        {/* Right Panel */}
        <div
          className="side-panel"
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          <ScorePanel
            score={score}
            level={level}
            lines={lines}
            combo={combo}
            highScore={highScore}
          />
          <NextPiecesPanel pieces={nextPieces} />
        </div>
      </div>
    </div>
  );
}
