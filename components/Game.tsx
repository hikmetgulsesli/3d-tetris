'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { GameState, ScoreData, saveHighScore } from '../types/game-state';
import { useKeyboard } from '../hooks/useKeyboard';
import { StartScreen } from './StartScreen';
import { PauseOverlay } from './PauseOverlay';
import { GameOverScreen } from './GameOverScreen';
import { ControlBar } from './ControlBar';
import { GameBoard } from './GameBoard';

/**
 * Main Game Component
 * 
 * US-010: Game states management
 * - Handles START, PLAYING, PAUSED, GAME_OVER states
 * - Integrates keyboard controls
 * - Manages score persistence
 */
export function Game() {
  const [gameState, setGameState] = useState<GameState>('START');
  const [scoreData, setScoreData] = useState<ScoreData>({
    score: 0,
    level: 1,
    lines: 0,
    maxCombo: 0,
  });

  // Start the game
  const startGame = useCallback(() => {
    setScoreData({ score: 0, level: 1, lines: 0, maxCombo: 0 });
    setGameState('PLAYING');
  }, []);

  // Pause/Resume the game
  const togglePause = useCallback(() => {
    setGameState((prev) => {
      if (prev === 'PLAYING') return 'PAUSED';
      if (prev === 'PAUSED') return 'PLAYING';
      return prev;
    });
  }, []);

  // Restart the game
  const restartGame = useCallback(() => {
    // Save high score before restarting if game was in progress, paused, or over
    if (gameState !== 'START') {
      saveHighScore(scoreData.score);
    }
    setScoreData({ score: 0, level: 1, lines: 0, maxCombo: 0 });
    setGameState('PLAYING');
  }, [gameState, scoreData.score]);

  // Go back to menu
  const goToMenu = useCallback(() => {
    // Save high score before going to menu
    saveHighScore(scoreData.score);
    setGameState('START');
  }, [scoreData.score]);

  // Handle game over - exposed for game logic integration
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleGameOver = useCallback((finalScoreData: ScoreData) => {
    setScoreData(finalScoreData);
    saveHighScore(finalScoreData.score);
    setGameState('GAME_OVER');
  }, []);

  // Keyboard action handler
  const handleAction = useCallback(
    (action: string) => {
      switch (action) {
        case 'PAUSE':
          if (gameState === 'PLAYING' || gameState === 'PAUSED') {
            togglePause();
          }
          break;
        case 'HARD_DROP':
          // Start game from start screen with space/enter
          if (gameState === 'START') {
            startGame();
          } else if (gameState === 'GAME_OVER') {
            // Restart from game over
            restartGame();
          }
          break;
        default:
          // Other actions only work when playing
          if (gameState === 'PLAYING') {
            // These will be handled by the actual game logic
          }
          break;
      }
    },
    [gameState, startGame, togglePause, restartGame]
  );

  // Set up keyboard controls
  useKeyboard({
    onAction: handleAction,
    enabled: true,
  });

  // Handle Enter key for start/game over
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (gameState === 'START') {
          startGame();
        } else if (gameState === 'GAME_OVER') {
          restartGame();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, restartGame]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background */}
      <div className="starfield" />
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />

      {/* Game States */}
      {gameState === 'START' && <StartScreen onStart={startGame} />}
      
      {gameState === 'PAUSED' && (
        <PauseOverlay onResume={togglePause} onRestart={restartGame} />
      )}
      
      {gameState === 'GAME_OVER' && (
        <GameOverScreen
          scoreData={scoreData}
          onPlayAgain={restartGame}
          onMenu={goToMenu}
        />
      )}

      {/* Main Game Area (visible in all states except START) */}
      {gameState !== 'START' && (
        <div 
          className="min-h-screen flex items-center justify-center p-4"
          style={{
            filter: gameState === 'PAUSED' ? 'blur(2px)' : 'none',
            opacity: gameState === 'PAUSED' ? 0.4 : 1,
            transition: 'filter 0.3s, opacity 0.3s',
          }}
          data-testid="game-container"
        >
          <GameBoard />
        </div>
      )}

      {/* Control Bar */}
      {gameState !== 'START' && (
        <ControlBar
          gameState={gameState}
          onStart={startGame}
          onPause={togglePause}
          onRestart={restartGame}
        />
      )}
    </div>
  );
}

export default Game;
