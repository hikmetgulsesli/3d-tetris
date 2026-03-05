/**
 * Collision Detection Tests
 * 
 * US-006: Game loop, piece movement, and collision detection
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  isWithinBounds,
  isCellOccupied,
  checkCollision,
  checkSpawnCollision,
  tryMove,
  tryRotateWithKick,
  getDropPosition,
  lockPiece,
  findCompleteRows,
  clearRows,
} from '../lib/gameLogic';
import type { ActiveTetromino, Position } from '../types/tetromino';
import type { Board } from '../types/game';
import { createEmptyBoard } from '../lib/gameLogic';

describe('isWithinBounds', () => {
  it('should return true for positions within bounds', () => {
    expect(isWithinBounds(0, 0)).toBe(true);
    expect(isWithinBounds(5, 10)).toBe(true);
    expect(isWithinBounds(9, 19)).toBe(true);
  });
  
  it('should return false for positions outside bounds', () => {
    expect(isWithinBounds(-1, 0)).toBe(false);
    expect(isWithinBounds(0, -1)).toBe(false);
    expect(isWithinBounds(10, 0)).toBe(false);
    expect(isWithinBounds(0, 20)).toBe(false);
  });
});

describe('isCellOccupied', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return false for empty cell', () => {
    expect(isCellOccupied(board, 5, 5)).toBe(false);
  });
  
  it('should return true for filled cell', () => {
    board[5][5] = { filled: true, type: 'I' };
    expect(isCellOccupied(board, 5, 5)).toBe(true);
  });
  
  it('should return true for out of bounds', () => {
    expect(isCellOccupied(board, -1, 5)).toBe(true);
    expect(isCellOccupied(board, 10, 5)).toBe(true);
    expect(isCellOccupied(board, 5, 20)).toBe(true);
  });
});

describe('checkCollision', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return false for valid position', () => {
    const position: Position = { x: 4, y: 0 };
    expect(checkCollision('O', position, 0, board)).toBe(false);
  });
  
  it('should return true for wall collision (left)', () => {
    const position: Position = { x: -1, y: 0 };
    expect(checkCollision('O', position, 0, board)).toBe(true);
  });
  
  it('should return true for wall collision (right)', () => {
    const position: Position = { x: 9, y: 0 };
    expect(checkCollision('O', position, 0, board)).toBe(true);
  });
  
  it('should return true for floor collision', () => {
    const position: Position = { x: 0, y: 19 };
    expect(checkCollision('O', position, 0, board)).toBe(true);
  });
  
  it('should return true for collision with locked blocks', () => {
    board[5][5] = { filled: true, type: 'T' };
    
    const position: Position = { x: 4, y: 4 };
    expect(checkCollision('O', position, 0, board)).toBe(true);
  });
});

describe('checkSpawnCollision', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return false for valid spawn', () => {
    const position: Position = { x: 4, y: 0 };
    expect(checkSpawnCollision('O', position, board)).toBe(false);
  });
  
  it('should return true when spawn is blocked', () => {
    board[0][4] = { filled: true, type: 'I' };
    board[0][5] = { filled: true, type: 'I' };
    board[1][4] = { filled: true, type: 'I' };
    board[1][5] = { filled: true, type: 'I' };
    
    const position: Position = { x: 4, y: 0 };
    expect(checkSpawnCollision('O', position, board)).toBe(true);
  });
});

describe('tryMove', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return new position for valid move', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const newPos = tryMove(piece, 1, 0, board);
    
    expect(newPos).toEqual({ x: 5, y: 0 });
  });
  
  it('should return null for invalid move', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 0, y: 0 } };
    const newPos = tryMove(piece, -1, 0, board);
    
    expect(newPos).toBeNull();
  });
  
  it('should handle downward movement', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const newPos = tryMove(piece, 0, 1, board);
    
    expect(newPos).toEqual({ x: 4, y: 1 });
  });
});

describe('tryRotateWithKick', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return rotation and position for valid rotation', () => {
    const piece: ActiveTetromino = { type: 'T', rotation: 0, position: { x: 4, y: 5 } };
    const result = tryRotateWithKick(piece, true, board);
    
    expect(result).not.toBeNull();
    expect(result?.rotation).toBe(1);
  });
  
  it('should perform wall kick when needed', () => {
    const piece: ActiveTetromino = { type: 'T', rotation: 0, position: { x: 0, y: 5 } };
    const result = tryRotateWithKick(piece, true, board);
    
    expect(result).not.toBeNull();
    expect(result!.position.x).toBeGreaterThanOrEqual(0);
  });
});

describe('getDropPosition', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return floor position when no obstacles', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const dropPos = getDropPosition(piece, board);
    
    expect(dropPos.y).toBe(18);
  });
  
  it('should stop at obstacles', () => {
    board[15][4] = { filled: true, type: 'I' };
    board[15][5] = { filled: true, type: 'I' };
    
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const dropPos = getDropPosition(piece, board);
    
    expect(dropPos.y).toBeLessThan(15);
  });
  
  it('should maintain x position', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 7, y: 5 } };
    const dropPos = getDropPosition(piece, board);
    
    expect(dropPos.x).toBe(7);
  });
});

describe('lockPiece', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should lock piece to board', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const newBoard = lockPiece(piece, board);
    
    expect(newBoard[0][4]).toEqual({ filled: true, type: 'O' });
    expect(newBoard[0][5]).toEqual({ filled: true, type: 'O' });
    expect(newBoard[1][4]).toEqual({ filled: true, type: 'O' });
    expect(newBoard[1][5]).toEqual({ filled: true, type: 'O' });
  });
  
  it('should not modify original board', () => {
    const piece: ActiveTetromino = { type: 'O', rotation: 0, position: { x: 4, y: 0 } };
    const newBoard = lockPiece(piece, board);
    
    expect(board[0][4]).toEqual({ filled: false, type: null });
    expect(newBoard[0][4]).toEqual({ filled: true, type: 'O' });
  });
});

describe('findCompleteRows', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return empty array when no complete lines', () => {
    const lines = findCompleteRows(board);
    expect(lines).toHaveLength(0);
  });
  
  it('should find single complete line', () => {
    for (let x = 0; x < 10; x++) {
      board[19][x] = { filled: true, type: 'I' };
    }
    const lines = findCompleteRows(board);
    
    expect(lines).toEqual([19]);
  });
  
  it('should find multiple complete lines', () => {
    for (let x = 0; x < 10; x++) {
      board[18][x] = { filled: true, type: 'T' };
      board[19][x] = { filled: true, type: 'I' };
    }
    const lines = findCompleteRows(board);
    
    expect(lines).toContain(18);
    expect(lines).toContain(19);
    expect(lines).toHaveLength(2);
  });
});

describe('clearRows', () => {
  let board: Board;
  
  beforeEach(() => {
    board = createEmptyBoard();
  });
  
  it('should return new board when clearing lines', () => {
    for (let x = 0; x < 10; x++) {
      board[19][x] = { filled: true, type: 'I' };
    }
    const result = clearRows(board, [19]);
    
    expect(result).toBeDefined();
    expect(result[0].every((cell: { filled: boolean }) => !cell.filled)).toBe(true);
  });
  
  it('should preserve non-cleared lines', () => {
    for (let x = 0; x < 10; x++) {
      board[17][x] = { filled: true, type: 'O' };
    }
    for (let x = 0; x < 10; x++) {
      board[19][x] = { filled: true, type: 'I' };
    }
    const result = clearRows(board, [19]);
    
    // Row 17 should now be at 18 (shifted down by 1)
    expect(result[18].every((cell: { filled: boolean }) => cell.filled)).toBe(true);
  });
});
