/** Game Board Types and Logic
 * 
 * US-007: Line clearing, scoring, and particle effects
 */

import type { TetrominoType, Position, Rotation, ActiveTetromino, Cell } from '../types/tetromino';
import type { Particle, LineClearResult } from '../types/game';
import { TETROMINOS } from './tetrominos';

/** Game board dimensions */
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

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

/** Legacy game state interface (for processLineClear compatibility) */
export interface GameStateLegacy {
  /** Current score */
  score: number;
  /** Current level */
  level: number;
  /** Total lines cleared */
  lines: number;
  /** Current combo count */
  combo: number;
  /** High score from localStorage */
  highScore: number;
}

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

/** Calculate score for line clear (legacy function for compatibility) */
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

/** Calculate fall speed based on level (in ms per grid cell) - legacy, use getFallSpeed from types/game.ts */
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

/** Initial game state (legacy compatibility) */
export function createInitialGameState(): GameStateLegacy {
  return {
    score: 0,
    level: 1,
    lines: 0,
    combo: 0,
    highScore: 0,
  };
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

/** Check if position is within board bounds */
export function isWithinBounds(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

/** Check if a cell is occupied */
export function isCellOccupied(board: Board, x: number, y: number): boolean {
  if (!isWithinBounds(x, y)) return true;
  return board[y][x].filled;
}

/** Check collision for a piece at given position and rotation */
export function checkCollision(
  type: TetrominoType,
  position: Position,
  rotation: Rotation,
  board: Board
): boolean {
  const piece = TETROMINOS[type];
  const cells = piece.rotations[rotation];

  for (const [relX, relY] of cells) {
    const x = position.x + relX;
    const y = position.y + relY;

    if (!isWithinBounds(x, y) || isCellOccupied(board, x, y)) {
      return true;
    }
  }

  return false;
}

/** Check collision at spawn position */
export function checkSpawnCollision(
  type: TetrominoType,
  position: Position,
  board: Board
): boolean {
  return checkCollision(type, position, 0, board);
}

/** Try to move a piece by dx, dy */
export function tryMove(
  piece: ActiveTetromino,
  dx: number,
  dy: number,
  board: Board
): Position | null {
  const newPosition: Position = {
    x: piece.position.x + dx,
    y: piece.position.y + dy,
  };

  if (checkCollision(piece.type, newPosition, piece.rotation, board)) {
    return null;
  }

  return newPosition;
}

/** Wall kick offsets (simplified SRS) */
const WALL_KICKS_JLSTZ: Position[][] = [
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }],
];

const WALL_KICKS_I: Position[][] = [
  [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],
  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],
];

/** Get wall kick offsets for piece type */
function getWallKicks(type: TetrominoType, fromRotation: Rotation, clockwise: boolean): Position[] {
  const kicks = type === 'I' ? WALL_KICKS_I : WALL_KICKS_JLSTZ;
  const rotationIndex = clockwise ? fromRotation : (fromRotation + 3) % 4;
  return kicks[rotationIndex];
}

/** Try to rotate with wall kicks */
export function tryRotateWithKick(
  piece: ActiveTetromino,
  clockwise: boolean,
  board: Board
): { rotation: Rotation; position: Position } | null {
  const newRotation = ((piece.rotation + (clockwise ? 1 : 3)) % 4) as Rotation;
  const kicks = getWallKicks(piece.type, piece.rotation, clockwise);

  for (const kick of kicks) {
    const newPosition: Position = {
      x: piece.position.x + kick.x,
      y: piece.position.y + kick.y,
    };

    if (!checkCollision(piece.type, newPosition, newRotation, board)) {
      return { rotation: newRotation, position: newPosition };
    }
  }

  return null;
}

/** Get drop position for hard drop */
export function getDropPosition(
  piece: ActiveTetromino,
  board: Board
): Position {
  let y = piece.position.y;

  while (true) {
    const newY = y + 1;
    const testPosition: Position = { x: piece.position.x, y: newY };

    if (checkCollision(piece.type, testPosition, piece.rotation, board)) {
      break;
    }

    y = newY;
  }

  return { x: piece.position.x, y };
}

/** Lock piece onto board */
export function lockPiece(piece: ActiveTetromino, board: Board): Board {
  const newBoard: Board = board.map(row => [...row]);
  const pieceData = TETROMINOS[piece.type];
  const cells = pieceData.rotations[piece.rotation];

  for (const [relX, relY] of cells) {
    const x = piece.position.x + relX;
    const y = piece.position.y + relY;

    if (isWithinBounds(x, y)) {
      newBoard[y][x] = { filled: true, type: piece.type };
    }
  }

  return newBoard;
}

/** Process line clear and update game state */
export function processLineClear(
  board: Board,
  gameState: GameStateLegacy
): { board: Board; gameState: GameStateLegacy; result: LineClearResult; particles: Particle[] } {
  const completeRows = findCompleteRows(board);
  const linesCleared = completeRows.length;
  
  if (linesCleared === 0) {
    return {
      board,
      gameState: { ...gameState, combo: 0 }, // Reset combo
      result: { linesCleared: 0, scoreEarned: 0, isTetris: false, clearedRows: [] },
      particles: [],
    };
  }
  
  // Calculate new combo and score
  const newCombo = gameState.combo + 1;
  const scoreEarned = calculateLineClearScore(linesCleared, gameState.level, newCombo);
  const newScore = gameState.score + scoreEarned;
  const newLines = gameState.lines + linesCleared;
  const newLevel = calculateLevel(newLines);
  
  // Update high score if needed
  const newHighScore = Math.max(newScore, gameState.highScore);
  if (newHighScore > gameState.highScore) {
    saveHighScore(newHighScore);
  }
  
  // Clear the rows
  const newBoard = clearRows(board, completeRows);
  
  // Create particles
  const particles = createLineClearParticles(completeRows, board);
  
  return {
    board: newBoard,
    gameState: {
      ...gameState,
      score: newScore,
      level: newLevel,
      lines: newLines,
      combo: newCombo,
      highScore: newHighScore,
    },
    result: {
      linesCleared,
      scoreEarned,
      isTetris: linesCleared === 4,
      clearedRows: completeRows,
    },
    particles,
  };
}
