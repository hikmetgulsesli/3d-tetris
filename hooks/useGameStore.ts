/**
 * Game Store Hook
 * 
 * US-008: Game state management with ghost piece, hold piece, and next piece preview
 */

import { useState, useCallback, useMemo, useRef } from 'react';
import type { TetrominoType, Position, Rotation, ActiveTetromino } from '../types/tetromino';
import { TETROMINOS, getRandomTetrominoType, getSpawnOffset } from '../lib/tetrominos';

/** Game board dimensions */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

/** Game state types */
export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/** A locked block on the board */
export interface LockedBlock {
  x: number;
  y: number;
  type: TetrominoType;
}

/** Score tracking */
export interface Score {
  points: number;
  level: number;
  lines: number;
}

/** High score storage */
const HIGH_SCORE_KEY = 'tetris-high-score';

export interface UseGameStoreReturn {
  // Game state
  gameState: GameState;
  board: (TetrominoType | null)[][];
  
  // Current piece
  currentPiece: ActiveTetromino | null;
  
  // Ghost piece (where current piece will land)
  ghostPosition: Position | null;
  
  // Hold piece
  holdPiece: TetrominoType | null;
  canHold: boolean;
  
  // Next pieces preview
  nextPieces: TetrominoType[];
  
  // Score
  score: Score;
  highScore: number;
  
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  moveLeft: () => void;
  moveRight: () => void;
  moveDown: () => void;
  hardDrop: () => void;
  rotateCW: () => void;
  rotateCCW: () => void;
  hold: () => void;
}

/**
 * Generate a shuffled bag of 7 tetromino types
 */
function generateBag(): TetrominoType[] {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  // Fisher-Yates shuffle
  for (let i = types.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [types[i], types[j]] = [types[j], types[i]];
  }
  return types;
}

/**
 * Get next piece from the queue, generating new bags as needed
 */
function getNextPiece(queue: TetrominoType[]): { piece: TetrominoType; newQueue: TetrominoType[] } {
  if (queue.length === 0) {
    queue = generateBag();
  }
  const piece = queue.shift()!;
  if (queue.length < 6) {
    queue = [...queue, ...generateBag()];
  }
  return { piece, newQueue: queue };
}

/**
 * Create an empty board
 */
function createEmptyBoard(): (TetrominoType | null)[][] {
  return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
}

/**
 * Calculate lines cleared and points
 */
function calculateScore(linesCleared: number, level: number): number {
  const linePoints = [0, 100, 300, 500, 800];
  return (linePoints[linesCleared] || 0) * level;
}

/**
 * Game store hook for managing Tetris game state
 */
export function useGameStore(): UseGameStoreReturn {
  // Game state
  const [gameState, setGameState] = useState<GameState>('START');
  const [board, setBoard] = useState<(TetrominoType | null)[][]>(createEmptyBoard);
  
  // Current piece
  const [currentPiece, setCurrentPiece] = useState<ActiveTetromino | null>(null);
  
  // Hold piece
  const [holdPiece, setHoldPiece] = useState<TetrominoType | null>(null);
  const [canHold, setCanHold] = useState(true);
  
  // Next pieces queue
  const [nextPieces, setNextPieces] = useState<TetrominoType[]>(() => generateBag());
  
  // Score
  const [score, setScore] = useState<Score>({ points: 0, level: 1, lines: 0 });
  const [highScore, setHighScore] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(HIGH_SCORE_KEY);
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  // Refs for stable callbacks
  const gameStateRef = useRef(gameState);
  const currentPieceRef = useRef(currentPiece);
  const boardRef = useRef(board);
  const scoreRef = useRef(score);
  const nextPiecesRef = useRef(nextPieces);
  const holdPieceRef = useRef(holdPiece);
  const canHoldRef = useRef(canHold);

  // Keep refs in sync
  gameStateRef.current = gameState;
  currentPieceRef.current = currentPiece;
  boardRef.current = board;
  scoreRef.current = score;
  nextPiecesRef.current = nextPieces;
  holdPieceRef.current = holdPiece;
  canHoldRef.current = canHold;

  /**
   * Check if a piece at a given position is valid (no collision)
   */
  const isValidPosition = useCallback((
    type: TetrominoType,
    rotation: Rotation,
    position: Position
  ): boolean => {
    const piece = TETROMINOS[type];
    const cells = piece.rotations[rotation];
    
    for (const [dx, dy] of cells) {
      const x = position.x + dx;
      const y = position.y + dy;
      
      // Check bounds
      if (x < 0 || x >= BOARD_WIDTH || y >= BOARD_HEIGHT) {
        return false;
      }
      
      // Check collision with locked blocks (ignore above board)
      if (y >= 0 && boardRef.current[y][x] !== null) {
        return false;
      }
    }
    
    return true;
  }, []);

  /**
   * Calculate ghost piece position (where current piece would land)
   */
  const ghostPosition = useMemo((): Position | null => {
    if (!currentPiece) return null;
    
    let ghostY = currentPiece.position.y;
    
    // Drop until collision
    while (isValidPosition(
      currentPiece.type,
      currentPiece.rotation,
      { x: currentPiece.position.x, y: ghostY + 1 }
    )) {
      ghostY++;
    }
    
    return { x: currentPiece.position.x, y: ghostY };
  }, [currentPiece, isValidPosition]);

  /**
   * Spawn a new piece from the queue
   */
  const spawnPiece = useCallback((type?: TetrominoType): boolean => {
    const pieceType = type || (() => {
      const { piece, newQueue } = getNextPiece(nextPiecesRef.current);
      nextPiecesRef.current = newQueue;
      setNextPieces(newQueue);
      return piece;
    })();
    
    const offset = getSpawnOffset(pieceType);
    const newPiece: ActiveTetromino = {
      type: pieceType,
      rotation: 0,
      position: offset,
    };
    
    // Check if spawn position is valid
    if (!isValidPosition(pieceType, 0, offset)) {
      return false;
    }
    
    setCurrentPiece(newPiece);
    setCanHold(true);
    return true;
  }, [isValidPosition]);

  /**
   * Lock the current piece to the board
   */
  const lockPiece = useCallback(() => {
    if (!currentPieceRef.current) return;
    
    const { type, rotation, position } = currentPieceRef.current;
    const piece = TETROMINOS[type];
    const cells = piece.rotations[rotation];
    
    const newBoard = boardRef.current.map(row => [...row]);
    
    for (const [dx, dy] of cells) {
      const x = position.x + dx;
      const y = position.y + dy;
      
      if (y >= 0 && y < BOARD_HEIGHT && x >= 0 && x < BOARD_WIDTH) {
        newBoard[y][x] = type;
      }
    }
    
    // Check for cleared lines
    let linesCleared = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell !== null)) {
        // Remove this line and add empty line at top
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(null));
        linesCleared++;
        y++; // Check the same row again
      }
    }
    
    // Update score
    if (linesCleared > 0) {
      const newLines = scoreRef.current.lines + linesCleared;
      const newLevel = Math.floor(newLines / 10) + 1;
      const points = calculateScore(linesCleared, scoreRef.current.level);
      
      const newScore = {
        points: scoreRef.current.points + points,
        level: newLevel,
        lines: newLines,
      };
      
      setScore(newScore);
      scoreRef.current = newScore;
    }
    
    setBoard(newBoard);
    boardRef.current = newBoard;
    
    // Spawn next piece
    if (!spawnPiece()) {
      // Game over
      setGameState('GAME_OVER');
      
      // Update high score
      if (scoreRef.current.points > highScore) {
        setHighScore(scoreRef.current.points);
        if (typeof window !== 'undefined') {
          localStorage.setItem(HIGH_SCORE_KEY, scoreRef.current.points.toString());
        }
      }
    }
  }, [spawnPiece, highScore]);

  /**
   * Move current piece left
   */
  const moveLeft = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current) return;
    
    const newPosition = {
      x: currentPieceRef.current.position.x - 1,
      y: currentPieceRef.current.position.y,
    };
    
    if (isValidPosition(currentPieceRef.current.type, currentPieceRef.current.rotation, newPosition)) {
      const newPiece = { ...currentPieceRef.current, position: newPosition };
      setCurrentPiece(newPiece);
      currentPieceRef.current = newPiece;
    }
  }, [isValidPosition]);

  /**
   * Move current piece right
   */
  const moveRight = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current) return;
    
    const newPosition = {
      x: currentPieceRef.current.position.x + 1,
      y: currentPieceRef.current.position.y,
    };
    
    if (isValidPosition(currentPieceRef.current.type, currentPieceRef.current.rotation, newPosition)) {
      const newPiece = { ...currentPieceRef.current, position: newPosition };
      setCurrentPiece(newPiece);
      currentPieceRef.current = newPiece;
    }
  }, [isValidPosition]);

  /**
   * Move current piece down (soft drop)
   */
  const moveDown = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current) return;
    
    const newPosition = {
      x: currentPieceRef.current.position.x,
      y: currentPieceRef.current.position.y + 1,
    };
    
    if (isValidPosition(currentPieceRef.current.type, currentPieceRef.current.rotation, newPosition)) {
      const newPiece = { ...currentPieceRef.current, position: newPosition };
      setCurrentPiece(newPiece);
      currentPieceRef.current = newPiece;
    } else {
      // Lock piece if can't move down
      lockPiece();
    }
  }, [isValidPosition, lockPiece]);

  /**
   * Hard drop - instantly drop piece to bottom
   */
  const hardDrop = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current) return;
    
    // Find drop position
    let dropY = currentPieceRef.current.position.y;
    while (isValidPosition(
      currentPieceRef.current.type,
      currentPieceRef.current.rotation,
      { x: currentPieceRef.current.position.x, y: dropY + 1 }
    )) {
      dropY++;
    }
    
    // Move to drop position and lock
    const newPiece = { ...currentPieceRef.current, position: { ...currentPieceRef.current.position, y: dropY } };
    setCurrentPiece(newPiece);
    currentPieceRef.current = newPiece;
    lockPiece();
  }, [isValidPosition, lockPiece]);

  /**
   * Rotate piece clockwise
   */
  const rotateCW = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current) return;
    
    const newRotation = ((currentPieceRef.current.rotation + 1) % 4) as Rotation;
    
    // Try rotation
    if (isValidPosition(currentPieceRef.current.type, newRotation, currentPieceRef.current.position)) {
      const newPiece = { ...currentPieceRef.current, rotation: newRotation };
      setCurrentPiece(newPiece);
      currentPieceRef.current = newPiece;
      return;
    }
    
    // Try wall kicks (simple)
    const kicks = [-1, 1, -2, 2];
    for (const kick of kicks) {
      const kickPosition = {
        x: currentPieceRef.current.position.x + kick,
        y: currentPieceRef.current.position.y,
      };
      if (isValidPosition(currentPieceRef.current.type, newRotation, kickPosition)) {
        const newPiece = { ...currentPieceRef.current, rotation: newRotation, position: kickPosition };
        setCurrentPiece(newPiece);
        currentPieceRef.current = newPiece;
        return;
      }
    }
  }, [isValidPosition]);

  /**
   * Rotate piece counter-clockwise
   */
  const rotateCCW = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current) return;
    
    const newRotation = ((currentPieceRef.current.rotation + 3) % 4) as Rotation;
    
    // Try rotation
    if (isValidPosition(currentPieceRef.current.type, newRotation, currentPieceRef.current.position)) {
      const newPiece = { ...currentPieceRef.current, rotation: newRotation };
      setCurrentPiece(newPiece);
      currentPieceRef.current = newPiece;
      return;
    }
    
    // Try wall kicks (simple)
    const kicks = [-1, 1, -2, 2];
    for (const kick of kicks) {
      const kickPosition = {
        x: currentPieceRef.current.position.x + kick,
        y: currentPieceRef.current.position.y,
      };
      if (isValidPosition(currentPieceRef.current.type, newRotation, kickPosition)) {
        const newPiece = { ...currentPieceRef.current, rotation: newRotation, position: kickPosition };
        setCurrentPiece(newPiece);
        currentPieceRef.current = newPiece;
        return;
      }
    }
  }, [isValidPosition]);

  /**
   * Hold current piece
   */
  const hold = useCallback(() => {
    if (gameStateRef.current !== 'PLAYING' || !currentPieceRef.current || !canHoldRef.current) return;
    
    const currentType = currentPieceRef.current.type;
    
    if (holdPieceRef.current) {
      // Swap with held piece
      const heldType = holdPieceRef.current;
      setHoldPiece(currentType);
      holdPieceRef.current = currentType;
      spawnPiece(heldType);
    } else {
      // Store current and spawn new
      setHoldPiece(currentType);
      holdPieceRef.current = currentType;
      spawnPiece();
    }
    
    setCanHold(false);
    canHoldRef.current = false;
  }, [spawnPiece]);

  /**
   * Start a new game
   */
  const startGame = useCallback(() => {
    const newBoard = createEmptyBoard();
    setBoard(newBoard);
    boardRef.current = newBoard;
    
    setScore({ points: 0, level: 1, lines: 0 });
    scoreRef.current = { points: 0, level: 1, lines: 0 };
    
    setHoldPiece(null);
    holdPieceRef.current = null;
    setCanHold(true);
    canHoldRef.current = true;
    
    const queue = generateBag();
    nextPiecesRef.current = queue;
    setNextPieces(queue);
    
    setGameState('PLAYING');
    spawnPiece();
  }, [spawnPiece]);

  /**
   * Pause the game
   */
  const pauseGame = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
    }
  }, []);

  /**
   * Resume the game
   */
  const resumeGame = useCallback(() => {
    if (gameStateRef.current === 'PAUSED') {
      setGameState('PLAYING');
    }
  }, []);

  /**
   * Toggle pause state
   */
  const togglePause = useCallback(() => {
    if (gameStateRef.current === 'PLAYING') {
      setGameState('PAUSED');
    } else if (gameStateRef.current === 'PAUSED') {
      setGameState('PLAYING');
    }
  }, []);

  /**
   * Reset the game to start screen
   */
  const resetGame = useCallback(() => {
    setGameState('START');
    setBoard(createEmptyBoard());
    setCurrentPiece(null);
    setHoldPiece(null);
    setCanHold(true);
    setScore({ points: 0, level: 1, lines: 0 });
  }, []);

  return {
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
    pauseGame: gameState === 'PLAYING' ? pauseGame : resumeGame,
    resumeGame,
    resetGame,
    moveLeft,
    moveRight,
    moveDown,
    hardDrop,
    rotateCW,
    rotateCCW,
    hold,
  };
}

export default useGameStore;
