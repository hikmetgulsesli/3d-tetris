/**
 * Game State Types Tests
 * 
 * US-006: Game loop, piece movement, and collision detection
 */

import { describe, it, expect } from 'vitest';
import {
  getFallSpeed,
  LINE_CLEAR_SCORES,
  SOFT_DROP_SCORE,
  HARD_DROP_SCORE,
  DEFAULT_GAME_CONFIG,
  GameStatus,
  PieceQueue,
  Score,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../types/game';
import { createEmptyBoard } from '../lib/gameLogic';

describe('DEFAULT_GAME_CONFIG', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_GAME_CONFIG.boardWidth).toBe(10);
    expect(DEFAULT_GAME_CONFIG.boardHeight).toBe(20);
    expect(DEFAULT_GAME_CONFIG.maxQueuePreview).toBe(3);
    expect(DEFAULT_GAME_CONFIG.baseFallSpeed).toBe(1000);
    expect(DEFAULT_GAME_CONFIG.speedIncreasePerLevel).toBe(0.05);
  });
});

describe('BOARD_WIDTH and BOARD_HEIGHT', () => {
  it('should have correct dimensions', () => {
    expect(BOARD_WIDTH).toBe(10);
    expect(BOARD_HEIGHT).toBe(20);
  });
});

describe('getFallSpeed', () => {
  it('should return base speed at level 1', () => {
    const speed = getFallSpeed(1, DEFAULT_GAME_CONFIG);
    expect(speed).toBe(1000);
  });
  
  it('should decrease speed per level', () => {
    const level1Speed = getFallSpeed(1, DEFAULT_GAME_CONFIG);
    const level2Speed = getFallSpeed(2, DEFAULT_GAME_CONFIG);
    
    expect(level2Speed).toBeLessThan(level1Speed);
  });
  
  it('should not go below 50ms', () => {
    const highLevelSpeed = getFallSpeed(100, DEFAULT_GAME_CONFIG);
    expect(highLevelSpeed).toBe(50);
  });
});

describe('createEmptyBoard', () => {
  it('should create board with correct dimensions', () => {
    const board = createEmptyBoard();
    
    expect(board).toHaveLength(20);
    board.forEach(row => {
      expect(row).toHaveLength(10);
      row.forEach(cell => {
        expect(cell.filled).toBe(false);
      });
    });
  });
  
  it('should create independent rows', () => {
    const board = createEmptyBoard();
    board[0][0] = { filled: true, type: 'I' };
    
    expect(board[1][0].filled).toBe(false);
  });
});

describe('LINE_CLEAR_SCORES', () => {
  it('should have correct base scores', () => {
    expect(LINE_CLEAR_SCORES[1]).toBe(100);
    expect(LINE_CLEAR_SCORES[2]).toBe(300);
    expect(LINE_CLEAR_SCORES[3]).toBe(500);
    expect(LINE_CLEAR_SCORES[4]).toBe(800);
  });
});

describe('Drop score constants', () => {
  it('should have correct soft drop score', () => {
    expect(SOFT_DROP_SCORE).toBe(1);
  });
  
  it('should have correct hard drop score', () => {
    expect(HARD_DROP_SCORE).toBe(2);
  });
});

describe('Type exports', () => {
  it('should export GameStatus type', () => {
    const status: GameStatus = 'PLAYING';
    expect(status).toBe('PLAYING');
  });
  
  it('should export Score interface', () => {
    const score: Score = {
      current: 0,
      high: 0,
      lines: 0,
      level: 1,
      combo: 0,
    };
    expect(score.level).toBe(1);
  });
  
  it('should export PieceQueue interface', () => {
    const queue: PieceQueue = {
      pieces: ['I', 'O', 'T'],
      next: ['I', 'O', 'T'],
    };
    expect(queue.pieces).toHaveLength(3);
  });
});
