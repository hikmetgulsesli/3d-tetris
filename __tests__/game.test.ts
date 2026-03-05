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
  calculateLineScore,
} from '../types/game';
import {
  createEmptyBoard,
} from '../lib/gameLogic';

describe('DEFAULT_GAME_CONFIG', () => {
  it('should have correct default values', () => {
    expect(DEFAULT_GAME_CONFIG.boardWidth).toBe(10);
    expect(DEFAULT_GAME_CONFIG.boardHeight).toBe(20);
    expect(DEFAULT_GAME_CONFIG.baseFallSpeed).toBe(1000);
    expect(DEFAULT_GAME_CONFIG.speedIncreasePerLevel).toBe(0.05);
    expect(DEFAULT_GAME_CONFIG.maxQueuePreview).toBe(3);
  });
});

describe('getFallSpeed', () => {
  it('should return base speed at level 1', () => {
    const speed = getFallSpeed(1);
    expect(speed).toBe(1000);
  });
  
  it('should decrease speed per level', () => {
    const level1Speed = getFallSpeed(1);
    const level2Speed = getFallSpeed(2);
    
    expect(level2Speed).toBeLessThan(level1Speed);
  });
  
  it('should not go below 50ms', () => {
    const highLevelSpeed = getFallSpeed(100);
    expect(highLevelSpeed).toBe(50);
  });
});

describe('createEmptyBoard', () => {
  it('should create board with default dimensions', () => {
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

describe('calculateLineScore', () => {
  it('should calculate single line correctly', () => {
    const score = calculateLineScore(1, 0, 1);
    expect(score).toBe(100);
  });
  
  it('should calculate tetris correctly', () => {
    const score = calculateLineScore(4, 0, 1);
    expect(score).toBe(800);
  });
  
  it('should apply level multiplier', () => {
    const level1Score = calculateLineScore(4, 0, 1);
    const level2Score = calculateLineScore(4, 0, 2);
    
    expect(level2Score).toBeGreaterThan(level1Score);
  });
  
  it('should apply combo bonus', () => {
    const noCombo = calculateLineScore(1, 0, 1);
    const withCombo = calculateLineScore(1, 2, 1);
    
    expect(withCombo).toBeGreaterThan(noCombo);
  });
  
  it('should return 0 for invalid line count', () => {
    expect(calculateLineScore(0, 0, 1)).toBe(0);
    expect(calculateLineScore(5, 0, 1)).toBe(0);
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
