/**
 * Type exports
 */

export * from './tetromino';
export { TETROMINO_COLORS } from './tetromino';
export * from './keyboard';
export * from './game-state';

// Export from game.ts explicitly to avoid naming conflicts with game-state.ts
export type {
  GameStatus,
  Board,
  BoardCell,
  Score,
  PieceQueue,
  CurrentPiece,
  GameConfig,
  Particle,
  LineClearResult,
  ScoreState,
  GameState as GameStoreState,
} from './game';

// Export values/constants separately
export {
  BOARD_WIDTH,
  BOARD_HEIGHT,
  SOFT_DROP_SCORE,
  HARD_DROP_SCORE,
  LINE_CLEAR_SCORES,
  getFallSpeed,
  calculateLineScore,
  calculateLineClearScore,
  createInitialGameState,
  createEmptyBoard,
  createInitialScoreState,
  GAME_CONFIG,
} from './game';
