/**
 * Type exports
 */

export * from './tetromino';
export * from './keyboard';
export * from './game-state';

// Re-export from game.ts - avoid conflicts by explicitly exporting
export type {
  TetrominoType,
  ActiveTetromino,
  Position,
  Rotation,
  Cell,
  GameStatus,
  BoardCell,
  Board,
  Score,
  PieceQueue,
  GameConfig,
  Particle,
  LineClearResult,
  CurrentPiece,
} from './game';
export {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  DEFAULT_GAME_CONFIG,
  SOFT_DROP_SCORE,
  HARD_DROP_SCORE,
  LINE_CLEAR_SCORES,
  getFallSpeed,
  calculateLineScore,
  calculateLineClearScore,
  createInitialGameState,
  GAME_CONFIG,
  createInitialScoreState,
} from './game';
