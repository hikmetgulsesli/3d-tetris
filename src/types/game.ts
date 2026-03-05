/**
 * Core types for 3D Tetris game
 */

/** Represents the 7 tetromino types */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** Represents a position on the board (x, y coordinates) */
export interface Position {
  x: number;
  y: number;
}

/** Represents a single cell on the board */
export interface Cell {
  /** Whether the cell is filled */
  filled: boolean;
  /** The tetromino type that filled this cell (null if empty) */
  type: TetrominoType | null;
}

/** Represents the game board (10x20 grid) */
export type Board = Cell[][];

/** Represents a tetromino piece with its current state */
export interface Tetromino {
  /** The type of tetromino */
  type: TetrominoType;
  /** Current position on the board */
  position: Position;
  /** Current rotation state (0-3) */
  rotation: number;
  /** The shape matrix for the current rotation */
  shape: number[][];
}

/** Game status states */
export type GameStatus = 'menu' | 'playing' | 'paused' | 'gameover';

/** Represents the complete game state */
export interface GameState {
  /** The 10x20 game board */
  board: Board;
  /** The currently active tetromino */
  currentPiece: Tetromino | null;
  /** Queue of next pieces to spawn (3 pieces) */
  nextPieces: TetrominoType[];
  /** The piece currently held (can be null) */
  holdPiece: TetrominoType | null;
  /** Whether hold has been used this turn */
  holdUsed: boolean;
  /** Current score */
  score: number;
  /** Current level (affects drop speed) */
  level: number;
  /** Total lines cleared */
  linesCleared: number;
  /** Current game status */
  status: GameStatus;
  /** Game start time */
  startTime: number | null;
  /** Time spent paused */
  pausedTime: number;
}

/** Initial empty board (10 columns x 20 rows) */
export const createEmptyBoard = (): Board => {
  return Array(20)
    .fill(null)
    .map(() =>
      Array(10)
        .fill(null)
        .map(() => ({ filled: false, type: null }))
    );
};

/** Tetromino shape definitions (0 = empty, 1 = filled) */
export const TETROMINO_SHAPES: Record<TetrominoType, number[][][]> = {
  I: [
    [[0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0], [0, 0, 0, 0]],
    [[0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0], [0, 0, 1, 0]],
    [[0, 0, 0, 0], [0, 0, 0, 0], [1, 1, 1, 1], [0, 0, 0, 0]],
    [[0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0], [0, 1, 0, 0]],
  ],
  O: [
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
    [[1, 1], [1, 1]],
  ],
  T: [
    [[0, 1, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 1, 0]],
    [[0, 1, 0], [1, 1, 0], [0, 1, 0]],
  ],
  S: [
    [[0, 1, 1], [1, 1, 0], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 1], [0, 0, 1]],
    [[0, 0, 0], [0, 1, 1], [1, 1, 0]],
    [[1, 0, 0], [1, 1, 0], [0, 1, 0]],
  ],
  Z: [
    [[1, 1, 0], [0, 1, 1], [0, 0, 0]],
    [[0, 0, 1], [0, 1, 1], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 0], [0, 1, 1]],
    [[0, 1, 0], [1, 1, 0], [1, 0, 0]],
  ],
  J: [
    [[1, 0, 0], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 1], [0, 1, 0], [0, 1, 0]],
    [[0, 0, 0], [1, 1, 1], [0, 0, 1]],
    [[0, 1, 0], [0, 1, 0], [1, 1, 0]],
  ],
  L: [
    [[0, 0, 1], [1, 1, 1], [0, 0, 0]],
    [[0, 1, 0], [0, 1, 0], [0, 1, 1]],
    [[0, 0, 0], [1, 1, 1], [1, 0, 0]],
    [[1, 1, 0], [0, 1, 0], [0, 1, 0]],
  ],
};

/** Tetromino colors matching design tokens */
export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0ff', // cyan
  O: '#eab308', // yellow
  T: '#a855f7', // purple
  S: '#22c55e', // green
  Z: '#ef4444', // red
  J: '#3b82f6', // blue
  L: '#f97316', // orange
};

/** Get a random tetromino type */
export const getRandomTetrominoType = (): TetrominoType => {
  const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  return types[Math.floor(Math.random() * types.length)];
};

/** Create a new tetromino with the given type */
export const createTetromino = (type: TetrominoType): Tetromino => {
  const shape = TETROMINO_SHAPES[type][0];
  const startX = type === 'O' ? 4 : 3;
  return {
    type,
    position: { x: startX, y: 0 },
    rotation: 0,
    shape,
  };
};
