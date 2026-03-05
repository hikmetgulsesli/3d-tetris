/**
 * Game Board Logic
 * 
 * US-007: Line clearing, scoring, and particle effects
 */

import type { TetrominoType } from '../types/tetromino';
import type { Board, Particle } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';

/** Create an empty game board */
export function createEmptyBoard(): Board {
  return Array(BOARD_HEIGHT).fill(null).map(() =>
    Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false }))
  );
}

/** Check if a row is complete (all cells filled) */
export function isRowComplete(board: Board, row: number): boolean {
  return board[row].every(cell => cell.filled);
}

/** Find all complete rows */
export function findCompleteRows(board: Board): number[] {
  const completeRows: number[] = [];
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (isRowComplete(board, row)) {
      completeRows.push(row);
    }
  }
  return completeRows;
}

/** Clear rows and shift rows above down */
export function clearRows(board: Board, rowsToClear: number[]): Board {
  const newBoard = board.map(row => [...row]);
  
  // Sort rows in descending order so we clear from bottom to top
  const sortedRows = [...rowsToClear].sort((a, b) => b - a);
  
  for (const row of sortedRows) {
    // Remove the cleared row
    newBoard.splice(row, 1);
    // Add new empty row at the top
    newBoard.unshift(
      Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false }))
    );
  }
  
  return newBoard;
}

/** Calculate score for line clear */
export function calculateLineClearScore(linesCleared: number, level: number, combo: number): number {
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

/** Calculate fall speed based on level (in ms per grid cell) */
export function calculateFallSpeed(level: number): number {
  // Start at 1000ms, decrease by 5% per level, minimum 50ms
  const speed = 1000 * Math.pow(0.95, level - 1);
  return Math.max(50, Math.floor(speed));
}

/** Calculate level from lines cleared */
export function calculateLevel(lines: number): number {
  return Math.floor(lines / 10) + 1;
}

/** Create particles for line clear effect */
export function createLineClearParticles(
  clearedRows: number[],
  board: Board
): Particle[] {
  const particles: Particle[] = [];
  
  for (const row of clearedRows) {
    for (let col = 0; col < BOARD_WIDTH; col++) {
      const cell = board[row][col];
      if (cell.filled && cell.type) {
        // Create multiple particles per cell
        for (let i = 0; i < 5; i++) {
          particles.push({
            id: `${row}-${col}-${i}-${Date.now()}`,
            x: col - BOARD_WIDTH / 2 + 0.5,
            y: BOARD_HEIGHT / 2 - row - 0.5,
            z: 0,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3 + 0.2, // Upward bias
            vz: (Math.random() - 0.5) * 0.3,
            color: getParticleColor(cell.type!),
            life: 1.0,
            maxLife: 1.0,
          });
        }
      }
    }
  }
  
  return particles;
}

/** Get particle color based on tetromino type */
function getParticleColor(type: TetrominoType): string {
  const colors: Record<TetrominoType, string> = {
    I: '#22d3ee',
    O: '#facc15',
    T: '#c084fc',
    S: '#4ade80',
    Z: '#f87171',
    J: '#60a5fa',
    L: '#fb923c',
  };
  return colors[type];
}

/** Update particles (move and fade) */
export function updateParticles(particles: Particle[]): Particle[] {
  return particles
    .map(p => ({
      ...p,
      x: p.x + p.vx,
      y: p.y + p.vy,
      z: p.z + p.vz,
      vy: p.vy - 0.01, // Gravity
      life: p.life - 0.02,
    }))
    .filter(p => p.life > 0);
}

/** Load high score from localStorage */
export function loadHighScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const saved = localStorage.getItem('tetris-high-score');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

/** Save high score to localStorage */
export function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tetris-high-score', score.toString());
  } catch {
    // Ignore storage errors
  }
}

/** Check if new high score */
export function isNewHighScore(score: number, highScore: number): boolean {
  return score > highScore;
}
