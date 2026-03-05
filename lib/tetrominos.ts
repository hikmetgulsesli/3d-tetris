/**
 * Tetromino Definitions
 * 
 * US-003: All 7 standard tetromino shapes with rotation states
 */

import type { TetrominoPiece, TetrominoType } from '../types/tetromino';
import { TETROMINO_COLORS } from '../types/tetromino';

/**
 * I-Piece (Cyan)
 * 
 * Rotation states:
 * 0: [0,1][1,1][2,1][3,1]  (horizontal)
 * 1: [2,0][2,1][2,2][2,3]  (vertical)
 * 2: [0,2][1,2][2,2][3,2]  (horizontal)
 * 3: [1,0][1,1][1,2][1,3]  (vertical)
 */
const I_PIECE: TetrominoPiece = {
  type: 'I',
  color: TETROMINO_COLORS.I.color,
  emissive: TETROMINO_COLORS.I.emissive,
  rotations: [
    [[0, 1], [1, 1], [2, 1], [3, 1]],  // 0°
    [[2, 0], [2, 1], [2, 2], [2, 3]],  // 90°
    [[0, 2], [1, 2], [2, 2], [3, 2]],  // 180°
    [[1, 0], [1, 1], [1, 2], [1, 3]],  // 270°
  ],
};

/**
 * O-Piece (Yellow)
 * 
 * O-piece doesn't rotate (same in all states)
 */
const O_PIECE: TetrominoPiece = {
  type: 'O',
  color: TETROMINO_COLORS.O.color,
  emissive: TETROMINO_COLORS.O.emissive,
  rotations: [
    [[0, 0], [1, 0], [0, 1], [1, 1]],  // All same
    [[0, 0], [1, 0], [0, 1], [1, 1]],  // All same
    [[0, 0], [1, 0], [0, 1], [1, 1]],  // All same
    [[0, 0], [1, 0], [0, 1], [1, 1]],  // All same
  ],
};

/**
 * T-Piece (Purple)
 * 
 * Rotation states:
 * 0:    [1]      1:   [0]      2:         3:   [0]
 *     [0][1][2]      [1][1]      [1]      [1][1]
 *                    [2]      [0][1][2]      [2]
 */
const T_PIECE: TetrominoPiece = {
  type: 'T',
  color: TETROMINO_COLORS.T.color,
  emissive: TETROMINO_COLORS.T.emissive,
  rotations: [
    [[0, 1], [1, 1], [2, 1], [1, 0]],  // 0° - T pointing up
    [[1, 0], [1, 1], [1, 2], [0, 1]],  // 90° - T pointing right
    [[0, 1], [1, 1], [2, 1], [1, 2]],  // 180° - T pointing down
    [[1, 0], [1, 1], [1, 2], [2, 1]],  // 270° - T pointing left
  ],
};

/**
 * S-Piece (Green)
 * 
 * Rotation states:
 * 0:      [1][2]    1:   [1]
 *      [0][1]           [1][2]
 *                        [2]
 */
const S_PIECE: TetrominoPiece = {
  type: 'S',
  color: TETROMINO_COLORS.S.color,
  emissive: TETROMINO_COLORS.S.emissive,
  rotations: [
    [[0, 1], [1, 1], [1, 0], [2, 0]],  // 0°
    [[1, 0], [1, 1], [0, 1], [0, 2]],  // 90°
    [[0, 1], [1, 1], [1, 2], [2, 2]],  // 180°
    [[2, 0], [2, 1], [1, 1], [1, 2]],  // 270°
  ],
};

/**
 * Z-Piece (Red)
 * 
 * Rotation states:
 * 0:   [0][1]      1:      [1]
 *         [1][2]      [1][2]
 *                    [2]
 */
const Z_PIECE: TetrominoPiece = {
  type: 'Z',
  color: TETROMINO_COLORS.Z.color,
  emissive: TETROMINO_COLORS.Z.emissive,
  rotations: [
    [[0, 0], [1, 0], [1, 1], [2, 1]],  // 0°
    [[1, 0], [1, 1], [0, 1], [0, 2]],  // 90°
    [[0, 1], [1, 1], [1, 2], [2, 2]],  // 180°
    [[2, 0], [2, 1], [1, 1], [1, 2]],  // 270°
  ],
};

/**
 * J-Piece (Blue)
 * 
 * Rotation states:
 * 0:   [0]      1:   [0][1]      2:         3:      [2]
 *      [0][1][2]        [1]      [0][1][2]      [0][1]
 *                         [2]      [2]           [0]
 */
const J_PIECE: TetrominoPiece = {
  type: 'J',
  color: TETROMINO_COLORS.J.color,
  emissive: TETROMINO_COLORS.J.emissive,
  rotations: [
    [[0, 0], [0, 1], [1, 1], [2, 1]],  // 0°
    [[1, 0], [1, 1], [1, 2], [0, 2]],  // 90°
    [[0, 1], [1, 1], [2, 1], [2, 2]],  // 180°
    [[2, 0], [1, 0], [1, 1], [1, 2]],  // 270°
  ],
};

/**
 * L-Piece (Orange)
 * 
 * Rotation states:
 * 0:         [2]    1:   [0]      2:   [0]      3:   [0][1]
 *      [0][1][2]        [1]          [0][1][2]        [1]
 *                    [0][1]                          [2]
 */
const L_PIECE: TetrominoPiece = {
  type: 'L',
  color: TETROMINO_COLORS.L.color,
  emissive: TETROMINO_COLORS.L.emissive,
  rotations: [
    [[2, 0], [0, 1], [1, 1], [2, 1]],  // 0°
    [[0, 0], [1, 0], [1, 1], [1, 2]],  // 90°
    [[0, 1], [1, 1], [2, 1], [0, 2]],  // 180°
    [[1, 0], [1, 1], [1, 2], [2, 2]],  // 270°
  ],
};

/** Map of all tetromino pieces by type */
export const TETROMINOS: Record<TetrominoType, TetrominoPiece> = {
  I: I_PIECE,
  O: O_PIECE,
  T: T_PIECE,
  S: S_PIECE,
  Z: Z_PIECE,
  J: J_PIECE,
  L: L_PIECE,
};

/**
 * Get all tetromino types as an array
 */
export function getAllTetrominoTypes(): TetrominoType[] {
  return ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
}

/**
 * Get a random tetromino type
 */
export function getRandomTetrominoType(): TetrominoType {
  const types = getAllTetrominoTypes();
  return types[Math.floor(Math.random() * types.length)];
}

/**
 * Get the spawn position offset for a tetromino type
 * Returns the offset needed to center the piece at the top of the board
 */
export function getSpawnOffset(type: TetrominoType): { x: number; y: number } {
  // Standard spawn position: center the piece horizontally, start at top
  const offsets: Record<TetrominoType, { x: number; y: number }> = {
    I: { x: 3, y: 0 },  // I-piece is 4 wide, starts at x=3
    O: { x: 4, y: 0 },  // O-piece is 2 wide, starts at x=4
    T: { x: 3, y: 0 },  // T-piece is 3 wide, starts at x=3
    S: { x: 3, y: 0 },  // S-piece is 3 wide, starts at x=3
    Z: { x: 3, y: 0 },  // Z-piece is 3 wide, starts at x=3
    J: { x: 3, y: 0 },  // J-piece is 3 wide, starts at x=3
    L: { x: 3, y: 0 },  // L-piece is 3 wide, starts at x=3
  };
  return offsets[type];
}
