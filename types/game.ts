/**
 * Game State Types
 * 
 * US-002: Game state management and core types
 */

import type { TetrominoType, Position } from './tetromino';

/** Game status states */
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

/** A single cell on the board */
export interface BoardCell {
  /** Whether the cell is filled with a piece */
  filled: boolean;
  /** The tetromino type that filled this cell (null if empty) */
  type: TetrominoType | null;
}

/** The game board - 10 columns x 20 rows */
export type Board = BoardCell[][];

/** Information about the current active piece */
export interface CurrentPiece {
  /** The tetromino type */
  type: TetrominoType;
  /** Current position on the board */
  position: Position;
  /** Current rotation state (0-3) */
  rotation: number;
}

/** Scoring information */
export interface ScoreState {
  /** Current score */
  score: number;
  /** Current level (starts at 1) */
  level: number;
  /** Total lines cleared */
  lines: number;
  /** Current combo count (resets on non-clearing drop) */
  combo: number;
  /** High score (loaded from localStorage) */
  highScore: number;
}

/** Complete game state */
export interface GameState {
  /** Current game status */
  status: GameStatus;
  /** The game board grid */
  board: Board;
  /** Current active piece (null if not playing) */
  currentPiece: CurrentPiece | null;
  /** Queue of next pieces (preview shows up to 3) */
  nextPieces: TetrominoType[];
  /** Currently held piece (can only hold once per drop) */
  holdPiece: TetrominoType | null;
  /** Whether hold has been used this turn */
  hasHeld: boolean;
  /** Scoring information */
  score: ScoreState;
}

/** Game configuration constants */
export const GAME_CONFIG = {
  /** Board width (columns) */
  BOARD_WIDTH: 10,
  /** Board height (rows) */
  BOARD_HEIGHT: 20,
  /** Number of next pieces to show in preview */
  NEXT_PIECES_COUNT: 3,
  /** Initial fall speed in ms per row */
  INITIAL_FALL_SPEED: 1000,
  /** Speed increase per level (percentage reduction) */
  SPEED_INCREASE_PER_LEVEL: 0.1,
  /** Lines needed to level up */
  LINES_PER_LEVEL: 10,
  /** Scoring for lines cleared (indexed by lines - 1) */
  LINE_SCORES: [100, 300, 500, 800],
  /** Combo multiplier increment per combo */
  COMBO_MULTIPLIER: 0.1,
} as const;

/** Create an empty board */
export function createEmptyBoard(): Board {
  return Array(GAME_CONFIG.BOARD_HEIGHT)
    .fill(null)
    .map(() =>
      Array(GAME_CONFIG.BOARD_WIDTH)
        .fill(null)
        .map(() => ({ filled: false, type: null }))
    );
}

/** Create initial score state */
export function createInitialScoreState(): ScoreState {
  return {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    highScore: 0,
  };
}

/** Create initial game state */
export function createInitialGameState(): GameState {
  return {
    status: 'menu',
    board: createEmptyBoard(),
    currentPiece: null,
    nextPieces: [],
    holdPiece: null,
    hasHeld: false,
    score: createInitialScoreState(),
  };
}
