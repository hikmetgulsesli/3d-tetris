/**
 * Type Exports
 * 
 * Central export point for all TypeScript types
 */

// Tetromino types
export type {
  TetrominoType,
  Cell,
  Rotation,
  TetrominoPiece,
  Position,
  ActiveTetromino,
} from './tetromino';
export { TETROMINO_COLORS } from './tetromino';

// Game state types
export type {
  GameStatus,
  BoardCell,
  Board,
  CurrentPiece,
  ScoreState,
  GameState,
} from './game';
export {
  GAME_CONFIG,
  createEmptyBoard,
  createInitialScoreState,
  createInitialGameState,
} from './game';

// Keyboard types
export type {
  GameAction,
  KeyboardHandler,
  KeyRepeatConfig,
} from './keyboard';
export {
  DEFAULT_KEY_REPEAT,
  KEY_MAPPINGS,
  REPEAT_KEYS,
  PREVENT_DEFAULT_KEYS,
} from './keyboard';
