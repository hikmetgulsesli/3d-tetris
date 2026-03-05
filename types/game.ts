/**
 * Game Board Types
 * 
 * US-007: Line clearing, scoring, and particle effects
 */

import type { TetrominoType, ActiveTetromino } from './tetromino';

export type { TetrominoType, ActiveTetromino, Position, Rotation, Cell } from './tetromino';

/** Game board dimensions */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

/** Game status states (new uppercase version) */
export type GameStatus = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER' | 'menu' | 'playing' | 'paused' | 'gameover';

/** A single cell in the game board */
export interface BoardCell {
  /** Whether the cell is filled */
  filled: boolean;
  /** The tetromino type that filled this cell */
  type?: TetrominoType;
  /** Visual flag for line clearing animation */
  clearing?: boolean;
}

/** The game board as a 2D array */
export type Board = BoardCell[][];

/** Score information */
export interface Score {
  /** Current score */
  current: number;
  /** High score */
  high: number;
  /** Total lines cleared */
  lines: number;
  /** Current level */
  level: number;
  /** Current combo count */
  combo: number;
}

/** Piece queue for next pieces */
export interface PieceQueue {
  /** All pieces in queue */
  pieces: TetrominoType[];
  /** Next pieces to display */
  next: TetrominoType[];
}

/** Game state */
export interface GameState {
  /** Current game status */
  status: GameStatus;
  /** Game board */
  board: Board;
  /** Currently active piece */
  activePiece: ActiveTetromino | null;
  /** Held piece */
  heldPiece: TetrominoType | null;
  /** Whether player can hold */
  canHold: boolean;
  /** Piece queue */
  queue: PieceQueue;
  /** Score information */
  score: Score;
  /** Game over reason */
  gameOverReason: string | null;
}

/** Game configuration */
export interface GameConfig {
  /** Board width in cells */
  boardWidth: number;
  /** Board height in cells */
  boardHeight: number;
  /** Number of next pieces to preview */
  maxQueuePreview: number;
  /** Base fall speed in ms */
  baseFallSpeed: number;
  /** Speed increase per level (percentage) */
  speedIncreasePerLevel: number;
}

/** Default game configuration */
export const DEFAULT_GAME_CONFIG: GameConfig = {
  boardWidth: BOARD_WIDTH,
  boardHeight: BOARD_HEIGHT,
  maxQueuePreview: 3,
  baseFallSpeed: 1000,
  speedIncreasePerLevel: 0.05,
};

/** Particle for line clear effect */
export interface Particle {
  id: string;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  color: string;
  life: number;
  maxLife: number;
}

/** Line clear result */
export interface LineClearResult {
  /** Number of lines cleared */
  linesCleared: number;
  /** Score earned */
  scoreEarned: number;
  /** Whether it was a Tetris (4 lines) */
  isTetris: boolean;
  /** Row indices that were cleared */
  clearedRows: number[];
}

/** Soft drop score per cell */
export const SOFT_DROP_SCORE = 1;

/** Hard drop score per cell */
export const HARD_DROP_SCORE = 2;

/** Line clear base scores by number of lines */
export const LINE_CLEAR_SCORES: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

/** Calculate fall speed based on level and config */
export function getFallSpeed(level: number, config?: Partial<GameConfig>): number {
  const cfg = { ...DEFAULT_GAME_CONFIG, ...config };
  const speed = cfg.baseFallSpeed * Math.pow(1 - cfg.speedIncreasePerLevel, level - 1);
  return Math.max(50, Math.floor(speed));
}

/** Calculate line clear score */
export function calculateLineScore(linesCleared: number, combo: number, level: number): number {
  // Base scores: 1=100, 2=300, 3=500, 4=800
  const baseScores: Record<number, number> = {
    1: 100,
    2: 300,
    3: 500,
    4: 800,
  };
  
  if (linesCleared === 0 || linesCleared > 4) return 0;
  
  const baseScore = baseScores[linesCleared];
  const levelMultiplier = 1 + (level - 1) * 0.1; // 10% increase per level
  const comboMultiplier = 1 + combo * 0.1; // 10% increase per combo
  
  return Math.floor(baseScore * levelMultiplier * comboMultiplier);
}

/** Alias for calculateLineScore with different parameter order */
export function calculateLineClearScore(linesCleared: number, level: number, combo: number): number {
  return calculateLineScore(linesCleared, combo, level);
}

// Re-export from gameLogic (BOARD_WIDTH and BOARD_HEIGHT already defined above)
export {
  createEmptyBoard,
  isRowComplete,
  findCompleteRows,
  clearRows,
  calculateFallSpeed,
  calculateLevel,
  createLineClearParticles,
  updateParticles,
  createInitialGameState,
  loadHighScore,
  saveHighScore,
  isNewHighScore,
  processLineClear,
} from '../lib/gameLogic';

/** Legacy GAME_CONFIG for backward compatibility with US-002 store */
export const GAME_CONFIG = {
  BOARD_WIDTH: 10,
  BOARD_HEIGHT: 20,
  NEXT_PIECES_COUNT: 3,
  INITIAL_FALL_SPEED: 1000,
  SPEED_INCREASE_PER_LEVEL: 0.05,
  LINES_PER_LEVEL: 10,
  LINE_SCORES: [100, 300, 500, 800] as const,
  COMBO_MULTIPLIER: 0.1,
};

/** Legacy ScoreState for backward compatibility */
export interface ScoreState {
  score: number;
  level: number;
  lines: number;
  combo: number;
  highScore: number;
}

/** Legacy CurrentPiece for backward compatibility */
export interface CurrentPiece {
  type: import('./tetromino').TetrominoType;
  position: import('./tetromino').Position;
  rotation: number;
}

/** Legacy createInitialScoreState for backward compatibility */
export function createInitialScoreState(): ScoreState {
  return {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    highScore: 0,
  };
}
