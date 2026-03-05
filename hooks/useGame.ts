/**
 * Game State Hook
 * 
 * US-006: Game loop, piece movement, and collision detection
 * 
 * Manages complete game state including:
 * - Game loop with requestAnimationFrame
 * - Piece spawning and queue management
 * - Movement, rotation, and collision handling
 * - Line clearing and scoring
 * - Game over detection
 */

import { useCallback, useEffect, useRef, useState } from 'react';
import type { 
  GameState, 
  GameConfig, 
  Score, 
  PieceQueue,
  Board
} from '../types/game';
import type { ActiveTetromino, TetrominoType, Position } from '../types/tetromino';
import type { GameAction } from '../types/keyboard';
import { 
  DEFAULT_GAME_CONFIG,
  getFallSpeed,
  SOFT_DROP_SCORE,
  HARD_DROP_SCORE,
  LINE_CLEAR_SCORES,
  calculateLineScore,
} from '../types/game';
import {
  checkSpawnCollision,
  tryMove,
  tryRotateWithKick,
  getDropPosition,
  lockPiece,
  findCompleteLines,
  clearLines,
} from '../lib/collision';
import {
  createEmptyBoard,
  loadHighScore,
  saveHighScore,
} from '../lib/gameLogic';
import { getRandomTetrominoType, getSpawnOffset } from '../lib/tetrominos';

/** Generate a random piece queue */
function generateQueue(length: number = 7): TetrominoType[] {
  const queue: TetrominoType[] = [];
  for (let i = 0; i < length; i++) {
    queue.push(getRandomTetrominoType());
  }
  return queue;
}

/** Refill queue and update next preview */
function refillQueue(queue: TetrominoType[], maxPreview: number): PieceQueue {
  // Ensure we have enough pieces
  while (queue.length < maxPreview + 1) {
    queue.push(getRandomTetrominoType());
  }
  
  return {
    pieces: queue,
    next: queue.slice(0, maxPreview),
  };
}

/** Get next piece from queue */
function getNextPiece(queue: PieceQueue, maxPreview: number): { type: TetrominoType; updatedQueue: PieceQueue } {
  const [nextType, ...remaining] = queue.pieces;
  const newQueue = refillQueue(remaining, maxPreview);
  return { type: nextType, updatedQueue: newQueue };
}

/** Create initial game state */
function createInitialState(config: GameConfig, highScore: number = 0): GameState {
  const queue = refillQueue(generateQueue(7), config.maxQueuePreview);
  
  return {
    status: 'START',
    board: createEmptyBoard(),
    activePiece: null,
    heldPiece: null,
    canHold: true,
    queue,
    score: {
      current: 0,
      high: highScore,
      lines: 0,
      level: 1,
      combo: 0,
    },
    gameOverReason: null,
  };
}



export interface UseGameOptions {
  config?: Partial<GameConfig>;
}

export interface UseGameReturn {
  gameState: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  handleAction: (action: GameAction) => void;
}

/**
 * Main game state hook
 */
export function useGame(options: UseGameOptions = {}): UseGameReturn {
  const config = { ...DEFAULT_GAME_CONFIG, ...options.config };
  const [gameState, setGameState] = useState<GameState>(() => 
    createInitialState(config, loadHighScore())
  );
  
  // Refs for game loop
  const lastTickRef = useRef<number>(0);
  const animationFrameRef = useRef<number | null>(null);
  const softDropRef = useRef<boolean>(false);
  
  // Spawn a new piece
  const spawnPiece = useCallback((currentState: GameState): GameState | null => {
    const { type, updatedQueue } = getNextPiece(currentState.queue, config.maxQueuePreview);
    const spawnOffset = getSpawnOffset(type);
    const spawnPosition: Position = { x: spawnOffset.x, y: spawnOffset.y };
    
    // Check for game over (collision at spawn)
    if (checkSpawnCollision(type, spawnPosition, currentState.board)) {
      // Update high score if needed
      const newHighScore = Math.max(currentState.score.current, currentState.score.high);
      saveHighScore(newHighScore);
      
      return {
        ...currentState,
        status: 'GAME_OVER',
        gameOverReason: 'Stack too high - no room for new piece',
        score: {
          ...currentState.score,
          high: newHighScore,
        },
      };
    }
    
    return {
      ...currentState,
      activePiece: {
        type,
        rotation: 0,
        position: spawnPosition,
      },
      canHold: true,
      queue: updatedQueue,
    };
  }, [config.maxQueuePreview]);
  
  // Lock piece and handle line clears
  const lockPieceAndClear = useCallback((currentState: GameState): GameState => {
    if (!currentState.activePiece) return currentState;
    
    // Lock the piece
    const newBoard = lockPiece(currentState.activePiece, currentState.board);
    
    // Find and clear complete lines
    const completeRows = findCompleteLines(newBoard);
    const { board: clearedBoard, linesCleared } = clearLines(newBoard, completeRows);
    
    // Update score
    let newScore = { ...currentState.score };
    if (linesCleared > 0) {
      const lineScore = calculateLineScore(linesCleared, currentState.score.combo, currentState.score.level);
      newScore = {
        ...newScore,
        current: newScore.current + lineScore,
        lines: newScore.lines + linesCleared,
        combo: currentState.score.combo + 1,
        // Level up every 10 lines
        level: Math.floor((newScore.lines + linesCleared) / 10) + 1,
      };
    } else {
      // Reset combo if no lines cleared
      newScore.combo = 0;
    }
    
    const afterClearState: GameState = {
      ...currentState,
      board: clearedBoard,
      activePiece: null,
      score: newScore,
    };
    
    // Spawn next piece
    return spawnPiece(afterClearState) || afterClearState;
  }, [spawnPiece]);
  
  // Game tick (called on each frame when playing)
  const gameTick = useCallback((deltaTime: number) => {
    setGameState(currentState => {
      if (currentState.status !== 'PLAYING' || !currentState.activePiece) {
        return currentState;
      }
      
      const fallSpeed = getFallSpeed(currentState.score.level, config);
      // Soft drop is 10x faster
      const effectiveSpeed = softDropRef.current ? fallSpeed / 10 : fallSpeed;
      
      lastTickRef.current += deltaTime;
      
      if (lastTickRef.current >= effectiveSpeed) {
        lastTickRef.current = 0;
        
        // Try to move down
        const newPosition = tryMove(
          currentState.activePiece,
          0,
          1,
          currentState.board
        );
        
        if (newPosition) {
          // Add soft drop score
          let newScore = currentState.score;
          if (softDropRef.current) {
            newScore = {
              ...newScore,
              current: newScore.current + SOFT_DROP_SCORE,
            };
          }
          
          return {
            ...currentState,
            activePiece: {
              ...currentState.activePiece,
              position: newPosition,
            },
            score: newScore,
          };
        } else {
          // Can't move down - lock the piece
          return lockPieceAndClear(currentState);
        }
      }
      
      return currentState;
    });
  }, [config, lockPieceAndClear]);
  
  // Game loop using requestAnimationFrame
  useEffect(() => {
    if (gameState.status !== 'PLAYING') {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }
    
    let lastTime = performance.now();
    
    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      
      gameTick(deltaTime);
      animationFrameRef.current = requestAnimationFrame(loop);
    };
    
    lastTickRef.current = 0;
    animationFrameRef.current = requestAnimationFrame(loop);
    
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [gameState.status, gameTick]);
  
  // Start game
  const startGame = useCallback(() => {
    setGameState(prev => {
      const highScore = Math.max(prev.score.high, prev.score.current);
      const newState = createInitialState(config, highScore);
      const withPiece = spawnPiece(newState);
      return withPiece ? { ...withPiece, status: 'PLAYING' } : newState;
    });
  }, [config, spawnPiece]);
  
  // Pause game
  const pauseGame = useCallback(() => {
    setGameState(prev => prev.status === 'PLAYING' ? { ...prev, status: 'PAUSED' } : prev);
  }, []);
  
  // Resume game
  const resumeGame = useCallback(() => {
    setGameState(prev => prev.status === 'PAUSED' ? { ...prev, status: 'PLAYING' } : prev);
  }, []);
  
  // Restart game
  const restartGame = useCallback(() => {
    setGameState(prev => {
      const highScore = Math.max(prev.score.high, prev.score.current);
      saveHighScore(highScore);
      const newState = createInitialState(config, highScore);
      const withPiece = spawnPiece(newState);
      return withPiece ? { ...withPiece, status: 'PLAYING' } : newState;
    });
  }, [config, spawnPiece]);
  
  // Handle game actions
  const handleAction = useCallback((action: GameAction) => {
    setGameState(currentState => {
      if (currentState.status === 'START' && action === 'HARD_DROP') {
        // Start game on space/enter
        const newState = createInitialState(config, currentState.score.high);
        const withPiece = spawnPiece(newState);
        return withPiece ? { ...withPiece, status: 'PLAYING' } : newState;
      }
      
      if (currentState.status === 'PAUSED') {
        if (action === 'PAUSE') {
          return { ...currentState, status: 'PLAYING' };
        }
        return currentState;
      }
      
      if (currentState.status === 'GAME_OVER') {
        if (action === 'HARD_DROP' || action === 'PAUSE') {
          restartGame();
        }
        return currentState;
      }
      
      if (currentState.status !== 'PLAYING' || !currentState.activePiece) {
        return currentState;
      }
      
      const piece = currentState.activePiece;
      
      switch (action) {
        case 'MOVE_LEFT': {
          const newPos = tryMove(piece, -1, 0, currentState.board);
          if (newPos) {
            return { ...currentState, activePiece: { ...piece, position: newPos } };
          }
          break;
        }
        
        case 'MOVE_RIGHT': {
          const newPos = tryMove(piece, 1, 0, currentState.board);
          if (newPos) {
            return { ...currentState, activePiece: { ...piece, position: newPos } };
          }
          break;
        }
        
        case 'SOFT_DROP': {
          softDropRef.current = true;
          const newPos = tryMove(piece, 0, 1, currentState.board);
          if (newPos) {
            return {
              ...currentState,
              activePiece: { ...piece, position: newPos },
              score: {
                ...currentState.score,
                current: currentState.score.current + SOFT_DROP_SCORE,
              },
            };
          } else {
            // Lock piece if can't soft drop
            return lockPieceAndClear(currentState);
          }
        }
        
        case 'HARD_DROP': {
          const dropPos = getDropPosition(piece, currentState.board);
          const dropDistance = dropPos.y - piece.position.y;
          const newScore = currentState.score.current + dropDistance * HARD_DROP_SCORE;
          
          const droppedPiece = { ...piece, position: dropPos };
          const withDroppedPiece = {
            ...currentState,
            activePiece: droppedPiece,
            score: { ...currentState.score, current: newScore },
          };
          
          return lockPieceAndClear(withDroppedPiece);
        }
        
        case 'ROTATE_CW': {
          const result = tryRotateWithKick(piece, true, currentState.board);
          if (result) {
            return {
              ...currentState,
              activePiece: {
                ...piece,
                rotation: result.rotation,
                position: result.position,
              },
            };
          }
          break;
        }
        
        case 'ROTATE_CCW': {
          const result = tryRotateWithKick(piece, false, currentState.board);
          if (result) {
            return {
              ...currentState,
              activePiece: {
                ...piece,
                rotation: result.rotation,
                position: result.position,
              },
            };
          }
          break;
        }
        
        case 'HOLD': {
          if (!currentState.canHold) break;
          
          const currentType = piece.type;
          const heldType = currentState.heldPiece;
          
          if (heldType) {
            // Swap with held piece
            const spawnOffset = getSpawnOffset(heldType);
            const newPiece: ActiveTetromino = {
              type: heldType,
              rotation: 0,
              position: { x: spawnOffset.x, y: spawnOffset.y },
            };
            
            // Check if spawn is valid
            if (checkSpawnCollision(heldType, newPiece.position, currentState.board)) {
              // Game over
              const newHighScore = Math.max(currentState.score.current, currentState.score.high);
              saveHighScore(newHighScore);
              return {
                ...currentState,
                status: 'GAME_OVER',
                gameOverReason: 'Stack too high - no room for held piece',
                score: { ...currentState.score, high: newHighScore },
              };
            }
            
            return {
              ...currentState,
              activePiece: newPiece,
              heldPiece: currentType,
              canHold: false,
            };
          } else {
            // Hold current and spawn next
            const { type: nextType, updatedQueue } = getNextPiece(currentState.queue, config.maxQueuePreview);
            const spawnOffset = getSpawnOffset(nextType);
            const newPiece: ActiveTetromino = {
              type: nextType,
              rotation: 0,
              position: { x: spawnOffset.x, y: spawnOffset.y },
            };
            
            // Check if spawn is valid
            if (checkSpawnCollision(nextType, newPiece.position, currentState.board)) {
              const newHighScore = Math.max(currentState.score.current, currentState.score.high);
              saveHighScore(newHighScore);
              return {
                ...currentState,
                status: 'GAME_OVER',
                gameOverReason: 'Stack too high - no room for next piece',
                score: { ...currentState.score, high: newHighScore },
              };
            }
            
            return {
              ...currentState,
              activePiece: newPiece,
              heldPiece: currentType,
              canHold: false,
              queue: updatedQueue,
            };
          }
        }
        
        case 'PAUSE': {
          return { ...currentState, status: 'PAUSED' };
        }
      }
      
      return currentState;
    });
  }, [config, restartGame, lockPieceAndClear, spawnPiece]);
  
  // Handle soft drop key release
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        softDropRef.current = false;
      }
    };
    
    window.addEventListener('keyup', handleKeyUp);
    return () => window.removeEventListener('keyup', handleKeyUp);
  }, []);
  
  return {
    gameState,
    startGame,
    pauseGame,
    resumeGame,
    restartGame,
    handleAction,
  };
}

export default useGame;
