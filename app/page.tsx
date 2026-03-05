/**
 * 3D Tetris Game Page
 * 
 * US-012: Sound effects and final polish
 * 
 * Features:
 * - Web Audio API synthesized sound effects
 * - Line clear, Tetris, Game Over, Lock, Rotate sounds
 * - Mute toggle with localStorage persistence
 * - Trail effect on falling pieces
 * - React.memo optimizations for 60fps
 * - Full game integration
 */

'use client';

import React, { useState, useCallback, useEffect, memo } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTouchControls } from '../hooks/useTouchControls';
import { useSoundEffects } from '../hooks/useSoundEffects';
import { TouchControls, MuteButton } from '../components';
import { GameAction } from '../types/keyboard';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINOS, getRandomTetrominoType, getSpawnOffset } from '../lib/tetrominos';

/**
 * Game state type
 */
type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/**
 * Score state interface
 */
interface ScoreState {
  score: number;
  level: number;
  lines: number;
  highScore: number;
}

/**
 * Cell on the game board
 */
type BoardCell = TetrominoType | null;

/**
 * Active piece state
 */
interface ActivePiece {
  type: TetrominoType;
  x: number;
  y: number;
  rotation: number;
}

// Board dimensions
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

// Scoring for line clears
const LINE_SCORES = [0, 100, 300, 500, 800];

/**
 * Create empty board
 */
function createEmptyBoard(): BoardCell[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

/**
 * Check if piece position is valid
 */
function isValidPosition(
  board: BoardCell[][],
  piece: ActivePiece
): boolean {
  const tetromino = TETROMINOS[piece.type];
  const cells = tetromino.rotations[piece.rotation % 4];
  
  for (const [dx, dy] of cells) {
    const x = piece.x + dx;
    const y = piece.y + dy;
    
    // Check bounds
    if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
      return false;
    }
    
    // Check collision with locked pieces (ignore if above board)
    if (y >= 0 && board[y][x] !== null) {
      return false;
    }
  }
  
  return true;
}

/**
 * Lock piece to board
 */
function lockPiece(
  board: BoardCell[][],
  piece: ActivePiece
): BoardCell[][] {
  const newBoard = board.map(row => [...row]);
  const tetromino = TETROMINOS[piece.type];
  const cells = tetromino.rotations[piece.rotation % 4];
  
  for (const [dx, dy] of cells) {
    const x = piece.x + dx;
    const y = piece.y + dy;
    
    if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
      newBoard[y][x] = piece.type;
    }
  }
  
  return newBoard;
}

/**
 * Clear completed lines and return new board + number cleared
 */
function clearLines(board: BoardCell[][]): { board: BoardCell[][]; lines: number } {
  const newBoard: BoardCell[][] = [];
  let linesCleared = 0;
  
  for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
    if (board[y].every(cell => cell !== null)) {
      linesCleared++;
    } else {
      newBoard.unshift([...board[y]]);
    }
  }
  
  // Add empty rows at top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }
  
  return { board: newBoard, lines: linesCleared };
}

/**
 * Get ghost piece position (where piece would land)
 */
function getGhostPosition(
  board: BoardCell[][],
  piece: ActivePiece
): ActivePiece {
  let ghostY = piece.y;
  
  while (isValidPosition(board, { ...piece, y: ghostY + 1 })) {
    ghostY++;
  }
  
  return { ...piece, y: ghostY };
}

/**
 * Score Board Component - Memoized for performance
 */
const ScoreBoard = memo(function ScoreBoard({ 
  score, 
  level, 
  lines, 
  highScore,
  isMobile 
}: { 
  score: number; 
  level: number; 
  lines: number; 
  highScore: number;
  isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        width: '100%',
        maxWidth: '400px',
        background: 'rgba(26, 26, 46, 0.8)',
        border: '1px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '12px',
        padding: '8px 12px',
        marginBottom: '12px',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Score</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{score.toLocaleString()}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Level</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#00f0ff' }}>{level}</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Lines</div>
          <div style={{ fontSize: '16px', fontWeight: 600, color: '#a855f7' }}>{lines}</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.8)',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
    }}>
      <h3 style={{
        fontSize: '14px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        margin: '0 0 12px 0',
        letterSpacing: '1px',
      }}>Score</h3>
      <div style={{ marginBottom: '12px' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>
          {score.toLocaleString()}
        </div>
        <div style={{ fontSize: '11px', color: '#64748b' }}>High: {highScore.toLocaleString()}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>LEVEL</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#00f0ff' }}>{level}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '10px', color: '#94a3b8' }}>LINES</div>
          <div style={{ fontSize: '18px', fontWeight: 600, color: '#a855f7' }}>{lines}</div>
        </div>
      </div>
    </div>
  );
});

/**
 * Next Pieces Preview - Memoized for performance
 */
const NextPieces = memo(function NextPieces({ 
  nextPieces 
}: { 
  nextPieces: TetrominoType[];
}) {
  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.8)',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
    }}>
      <h3 style={{
        fontSize: '14px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        margin: '0 0 12px 0',
        letterSpacing: '1px',
      }}>Next</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {nextPieces.map((type, i) => (
          <div key={i} style={{
            width: '100%',
            height: '48px',
            background: 'rgba(0, 0, 0, 0.3)',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 'bold',
            color: TETROMINOS[type]?.color || '#fff',
            textShadow: `0 0 10px ${TETROMINOS[type]?.emissive || '#fff'}`,
          }}>
            {type}
          </div>
        ))}
      </div>
    </div>
  );
});

/**
 * Hold Piece Display - Memoized for performance
 */
const HoldPiece = memo(function HoldPiece({ 
  type,
  canHold 
}: { 
  type: TetrominoType | null;
  canHold: boolean;
}) {
  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.8)',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
    }}>
      <h3 style={{
        fontSize: '14px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        margin: '0 0 12px 0',
        letterSpacing: '1px',
      }}>Hold</h3>
      <div style={{
        width: '100%',
        height: '80px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold',
        color: type ? TETROMINOS[type]?.color : '#666',
        textShadow: type ? `0 0 15px ${TETROMINOS[type]?.emissive}` : 'none',
        opacity: canHold ? 1 : 0.5,
      }}>
        {type || '—'}
      </div>
    </div>
  );
});

/**
 * Controls Info - Memoized for performance
 */
const ControlsInfo = memo(function ControlsInfo() {
  return (
    <div style={{
      background: 'rgba(26, 26, 46, 0.8)',
      border: '1px solid rgba(0, 240, 255, 0.2)',
      borderRadius: '12px',
      padding: '16px',
    }}>
      <h3 style={{
        fontSize: '14px',
        color: '#94a3b8',
        textTransform: 'uppercase',
        margin: '0 0 12px 0',
        letterSpacing: '1px',
      }}>Controls</h3>
      <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.8' }}>
        <div>← → Move</div>
        <div>↓ Soft Drop</div>
        <div>↑ Z/X Rotate</div>
        <div>Space Hard Drop</div>
        <div>C Hold</div>
        <div>P Pause</div>
      </div>
    </div>
  );
});

/**
 * Game Board Display - Memoized for performance
 */
const GameBoard = memo(function GameBoard({
  board,
  currentPiece,
  ghostPiece,
  gameState,
  isMobile,
  onTouchStart,
}: {
  board: BoardCell[][];
  currentPiece: ActivePiece | null;
  ghostPiece: ActivePiece | null;
  gameState: GameState;
  isMobile: boolean;
  onTouchStart?: (e: React.TouchEvent) => void;
}) {
  // Render piece cells
  const renderPieceCells = (piece: ActivePiece, isGhost: boolean = false) => {
    if (!piece) return null;
    
    const tetromino = TETROMINOS[piece.type];
    const cells = tetromino.rotations[piece.rotation % 4];
    
    return cells.map(([dx, dy], i) => {
      const x = piece.x + dx;
      const y = piece.y + dy;
      
      if (x < 0 || x >= BOARD_WIDTH || y < 0 || y >= BOARD_HEIGHT) return null;
      
      return (
        <div
          key={`${isGhost ? 'ghost' : 'piece'}-${i}`}
          style={{
            position: 'absolute',
            left: `${x * 10}%`,
            top: `${y * 5}%`,
            width: '10%',
            height: '5%',
            background: isGhost 
              ? `${tetromino.color}40` 
              : tetromino.color,
            border: `1px solid ${isGhost ? tetromino.color : tetromino.emissive}`,
            boxShadow: isGhost 
              ? 'none' 
              : `0 0 10px ${tetromino.emissive}`,
            opacity: isGhost ? 0.4 : 1,
          }}
        />
      );
    });
  };

  return (
    <div
      className="game-board"
      onTouchStart={onTouchStart}
      style={{
        width: isMobile ? '280px' : '300px',
        height: isMobile ? '448px' : '600px',
        background: 'rgba(10, 10, 18, 0.9)',
        border: '2px solid rgba(0, 240, 255, 0.3)',
        borderRadius: '8px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 0 40px rgba(0, 240, 255, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.5)',
        touchAction: 'none',
      }}
    >
      {/* Grid Lines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: isMobile ? '28px 22.4px' : '30px 30px',
        pointerEvents: 'none',
      }} />

      {/* Locked pieces */}
      {board.map((row, y) =>
        row.map((cell, x) => {
          if (!cell) return null;
          const colors = TETROMINOS[cell];
          return (
            <div
              key={`${x}-${y}`}
              style={{
                position: 'absolute',
                left: `${x * 10}%`,
                top: `${y * 5}%`,
                width: '10%',
                height: '5%',
                background: colors.color,
                border: `1px solid ${colors.emissive}`,
                boxShadow: `0 0 10px ${colors.emissive}`,
              }}
            />
          );
        })
      )}

      {/* Ghost piece (landing preview) */}
      {ghostPiece && renderPieceCells(ghostPiece, true)}

      {/* Current piece with trail effect */}
      {currentPiece && (
        <>
          {/* Trail effect */}
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`trail-${i}`}
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                right: 0,
                bottom: 0,
                opacity: 0.1 - i * 0.03,
                transform: `translateY(${(i + 1) * -5}%)`,
                pointerEvents: 'none',
              }}
            >
              {renderPieceCells(currentPiece)}
            </div>
          ))}
          {/* Actual piece */}
          {renderPieceCells(currentPiece)}
        </>
      )}

      {/* Start Screen */}
      {gameState === 'START' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 10,
        }}>
          <div style={{
            fontSize: isMobile ? '18px' : '24px',
            fontWeight: 600,
            color: '#fff',
            marginBottom: '16px',
            textAlign: 'center',
          }}>
            Ready to Play?
          </div>
          <div style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#00f0ff',
            animation: 'pulse 1.5s ease-in-out infinite',
          }}>
            {isMobile ? 'Tap to Start' : 'Press SPACE to Start'}
          </div>
        </div>
      )}

      {/* Pause Overlay */}
      {gameState === 'PAUSED' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.85)',
          zIndex: 10,
        }}>
          <div style={{
            fontSize: isMobile ? '24px' : '32px',
            fontWeight: 700,
            color: '#eab308',
            letterSpacing: '4px',
          }}>
            PAUSED
          </div>
          <div style={{
            fontSize: isMobile ? '12px' : '14px',
            color: '#94a3b8',
            marginTop: '16px',
          }}>
            {isMobile ? 'Tap RESUME' : 'Press P to Resume'}
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === 'GAME_OVER' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(0, 0, 0, 0.9)',
          zIndex: 10,
        }}>
          <div style={{
            fontSize: isMobile ? '20px' : '28px',
            fontWeight: 700,
            color: '#ef4444',
            marginBottom: '16px',
          }}>
            GAME OVER
          </div>
        </div>
      )}
    </div>
  );
});

/**
 * Main game page component
 * Optimized with React.memo for 60fps performance
 */
const TetrisPage = memo(function TetrisPage() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<ScoreState>({
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
  });
  
  // Board state
  const [board, setBoard] = useState<BoardCell[][]>(createEmptyBoard);
  const [currentPiece, setCurrentPiece] = useState<ActivePiece | null>(null);
  const [ghostPiece, setGhostPiece] = useState<ActivePiece | null>(null);
  
  // Next pieces queue
  const [nextPieces, setNextPieces] = useState<TetrominoType[]>([]);
  
  // Hold piece
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState(true);
  
  // Sound effects
  const { enabled: soundEnabled, toggle: toggleSound, play: playSound } = useSoundEffects();
  
  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);

  // Load high score on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tetris-highscore');
      if (saved) {
        setScore(prev => ({ ...prev, highScore: parseInt(saved, 10) }));
      }
      setIsMobile(window.innerWidth < 1024);
      
      const handleResize = () => setIsMobile(window.innerWidth < 1024);
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Save high score when it changes
  useEffect(() => {
    if (score.score > score.highScore) {
      localStorage.setItem('tetris-highscore', score.score.toString());
      setScore(prev => ({ ...prev, highScore: score.score }));
    }
  }, [score.score, score.highScore]);

  // Spawn new piece
  const spawnPiece = useCallback(() => {
    setNextPieces(prev => {
      const queue = [...prev];
      
      // Fill queue if needed
      while (queue.length < 4) {
        queue.push(getRandomTetrominoType());
      }
      
      const type = queue[0];
      const newQueue = queue.slice(1);
      
      const offset = getSpawnOffset(type);
      const newPiece: ActivePiece = {
        type,
        x: offset.x,
        y: offset.y,
        rotation: 0,
      };
      
      // Check if game over
      if (!isValidPosition(board, newPiece)) {
        setGameState('GAME_OVER');
        playSound('GAME_OVER');
      } else {
        setCurrentPiece(newPiece);
      }
      
      return newQueue;
    });
  }, [board, playSound]);

  // Initialize next pieces on mount
  useEffect(() => {
    const initialPieces = Array(4).fill(null).map(() => getRandomTetrominoType());
    setNextPieces(initialPieces);
  }, []);

  // Update ghost piece position
  useEffect(() => {
    if (currentPiece) {
      setGhostPiece(getGhostPosition(board, currentPiece));
    } else {
      setGhostPiece(null);
    }
  }, [currentPiece, board]);

  // Game tick (piece falling)
  useEffect(() => {
    if (gameState !== 'PLAYING' || !currentPiece) return;

    const fallInterval = Math.max(100, 1000 - (score.level - 1) * 100);
    
    const interval = setInterval(() => {
      setCurrentPiece(prev => {
        if (!prev) return prev;
        
        const newPiece = { ...prev, y: prev.y + 1 };
        
        if (isValidPosition(board, newPiece)) {
          return newPiece;
        } else {
          // Lock piece
          const newBoard = lockPiece(board, prev);
          const { board: clearedBoard, lines } = clearLines(newBoard);
          
          setBoard(clearedBoard);
          
          if (lines > 0) {
            // Update score
            const lineScore = LINE_SCORES[lines] * score.level;
            const combo = lines; // Simplified combo
            const totalScore = lineScore + (combo > 1 ? combo * 50 : 0);
            
            setScore(s => ({
              ...s,
              score: s.score + totalScore,
              lines: s.lines + lines,
              level: Math.floor((s.lines + lines) / 10) + 1,
            }));
            
            // Play sound
            playSound(lines === 4 ? 'TETRIS' : 'LINE_CLEAR');
          } else {
            playSound('LOCK');
          }
          
          setCanHold(true);
          
          // Spawn next piece
          setTimeout(() => spawnPiece(), 0);
          
          return null;
        }
      });
    }, fallInterval);

    return () => clearInterval(interval);
  }, [gameState, currentPiece, board, score.level, playSound, spawnPiece]);

  /**
   * Handle game actions from keyboard or touch
   */
  const handleAction = useCallback((action: GameAction) => {
    if (gameState === 'START') {
      if (action === 'HARD_DROP' || action === 'PAUSE') {
        setGameState('PLAYING');
        spawnPiece();
      }
      return;
    }

    if (gameState === 'GAME_OVER') {
      if (action === 'HARD_DROP') {
        // Reset game
        setBoard(createEmptyBoard());
        setScore({ score: 0, level: 1, lines: 0, highScore: score.highScore });
        setHoldPiece(null);
        setCanHold(true);
        setGameState('PLAYING');
        spawnPiece();
      }
      return;
    }

    if (gameState === 'PLAYING' || gameState === 'PAUSED') {
      switch (action) {
        case 'PAUSE':
          setGameState(prev => prev === 'PAUSED' ? 'PLAYING' : 'PAUSED');
          break;
          
        case 'HOLD':
          if (canHold && currentPiece) {
            const currentType = currentPiece.type;
            if (holdPiece) {
              const offset = getSpawnOffset(holdPiece);
              setCurrentPiece({
                type: holdPiece,
                x: offset.x,
                y: offset.y,
                rotation: 0,
              });
            } else {
              setCurrentPiece(null);
              spawnPiece();
            }
            setHoldPiece(currentType);
            setCanHold(false);
          }
          break;
          
        case 'MOVE_LEFT':
          if (gameState === 'PLAYING' && currentPiece) {
            const newPiece = { ...currentPiece, x: currentPiece.x - 1 };
            if (isValidPosition(board, newPiece)) {
              setCurrentPiece(newPiece);
            }
          }
          break;
          
        case 'MOVE_RIGHT':
          if (gameState === 'PLAYING' && currentPiece) {
            const newPiece = { ...currentPiece, x: currentPiece.x + 1 };
            if (isValidPosition(board, newPiece)) {
              setCurrentPiece(newPiece);
            }
          }
          break;
          
        case 'SOFT_DROP':
          if (gameState === 'PLAYING' && currentPiece) {
            const newPiece = { ...currentPiece, y: currentPiece.y + 1 };
            if (isValidPosition(board, newPiece)) {
              setCurrentPiece(newPiece);
              setScore(s => ({ ...s, score: s.score + 1 }));
            }
          }
          break;
          
        case 'HARD_DROP':
          if (gameState === 'PLAYING' && currentPiece && ghostPiece) {
            const dropDistance = ghostPiece.y - currentPiece.y;
            setCurrentPiece(ghostPiece);
            setScore(s => ({ ...s, score: s.score + dropDistance * 2 }));
            playSound('LOCK');
          }
          break;
          
        case 'ROTATE_CW':
          if (gameState === 'PLAYING' && currentPiece) {
            const newPiece = { ...currentPiece, rotation: currentPiece.rotation + 1 };
            if (isValidPosition(board, newPiece)) {
              setCurrentPiece(newPiece);
              playSound('ROTATE');
            } else {
              // Wall kick: try shifting
              const kicks = [1, -1, 2, -2];
              for (const kick of kicks) {
                const kickedPiece = { ...newPiece, x: newPiece.x + kick };
                if (isValidPosition(board, kickedPiece)) {
                  setCurrentPiece(kickedPiece);
                  playSound('ROTATE');
                  break;
                }
              }
            }
          }
          break;
          
        case 'ROTATE_CCW':
          if (gameState === 'PLAYING' && currentPiece) {
            const newPiece = { ...currentPiece, rotation: currentPiece.rotation - 1 };
            if (isValidPosition(board, newPiece)) {
              setCurrentPiece(newPiece);
              playSound('ROTATE');
            } else {
              // Wall kick: try shifting
              const kicks = [1, -1, 2, -2];
              for (const kick of kicks) {
                const kickedPiece = { ...newPiece, x: newPiece.x + kick };
                if (isValidPosition(board, kickedPiece)) {
                  setCurrentPiece(kickedPiece);
                  playSound('ROTATE');
                  break;
                }
              }
            }
          }
          break;
      }
    }
  }, [gameState, currentPiece, board, canHold, holdPiece, ghostPiece, score.highScore, spawnPiece, playSound]);

  // Set up keyboard controls
  useKeyboard({
    onAction: handleAction,
    enabled: true,
  });

  // Set up touch controls
  useTouchControls({
    onAction: handleAction,
    enabled: gameState === 'PLAYING' || gameState === 'START',
  });

  return (
    <div className="tetris-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a12 0%, #12121f 50%, #1a1a2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '8px' : '20px',
      fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: isMobile ? '8px' : '16px',
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <h1 style={{
          fontSize: isMobile ? '1.5rem' : '2.5rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
        }}>
          TETRIS 3D
        </h1>
        <MuteButton enabled={soundEnabled} onToggle={toggleSound} />
      </header>

      {/* Mobile Score Bar */}
      {isMobile && (
        <ScoreBoard 
          score={score.score} 
          level={score.level} 
          lines={score.lines} 
          highScore={score.highScore}
          isMobile={true}
        />
      )}

      {/* Main Game Area */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
        gap: isMobile ? '12px' : '20px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '1200px',
        justifyContent: 'center',
      }}>
        {/* Left Panel */}
        {!isMobile && (
          <aside style={{
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <HoldPiece type={holdPiece} canHold={canHold} />
            <ControlsInfo />
          </aside>
        )}

        {/* Game Board */}
        <main style={{ position: 'relative' }}>
          <GameBoard
            board={board}
            currentPiece={currentPiece}
            ghostPiece={ghostPiece}
            gameState={gameState}
            isMobile={isMobile}
          />

          {/* Mobile Touch Controls */}
          {isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '12px',
            }}>
              <TouchControls
                onAction={handleAction}
                enabled={true}
                isPaused={gameState === 'PAUSED'}
                canHold={canHold}
              />
            </div>
          )}

          {/* Mobile Gesture Hints */}
          {isMobile && gameState === 'PLAYING' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '8px',
              fontSize: '11px',
              color: '#64748b',
            }}>
              <span>← Swipe Move →</span>
              <span>• Tap Rotate</span>
              <span>↓ Swipe Drop</span>
            </div>
          )}
        </main>

        {/* Right Panel */}
        {!isMobile && (
          <aside style={{
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            <ScoreBoard 
              score={score.score} 
              level={score.level} 
              lines={score.lines} 
              highScore={score.highScore}
              isMobile={false}
            />
            <NextPieces nextPieces={nextPieces.slice(0, 3)} />
          </aside>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .touch-btn:active {
          transform: scale(0.95) !important;
        }
      `}</style>
    </div>
  );
});

export default TetrisPage;
