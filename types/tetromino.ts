/**
 * Tetromino Type Definitions
 * 
 * US-003: Tetromino definitions and 3D block component
 */

/** The 7 standard tetromino types */
export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';

/** Represents a single cell coordinate in a tetromino shape */
export type Cell = [number, number];

/** Rotation state (0 = spawn, 1 = 90° CW, 2 = 180°, 3 = 270° CW) */
export type Rotation = 0 | 1 | 2 | 3;

/** Tetromino piece definition with all rotation states */
export interface TetrominoPiece {
  type: TetrominoType;
  color: string;
  emissive: string;
  rotations: Cell[][]; // Array of 4 rotation states, each with cell coordinates
}

/** Position on the game board */
export interface Position {
  x: number;
  y: number;
}

/** An active tetromino in the game */
export interface ActiveTetromino {
  type: TetrominoType;
  rotation: Rotation;
  position: Position;
}

/** Neon color definitions for each tetromino type */
export const TETROMINO_COLORS: Record<TetrominoType, { color: string; emissive: string }> = {
  I: { color: '#22d3ee', emissive: '#0891b2' }, // Cyan
  O: { color: '#facc15', emissive: '#ca8a04' }, // Yellow
  T: { color: '#c084fc', emissive: '#9333ea' }, // Purple
  S: { color: '#4ade80', emissive: '#16a34a' }, // Green
  Z: { color: '#f87171', emissive: '#dc2626' }, // Red
  J: { color: '#60a5fa', emissive: '#2563eb' }, // Blue
  L: { color: '#fb923c', emissive: '#ea580c' }, // Orange
};
