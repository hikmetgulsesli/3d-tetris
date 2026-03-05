/**
 * Game Types Tests
 * 
 * US-002: Tests for game state types and utilities
 */

import { describe, it, expect } from 'vitest';
import {
  createEmptyBoard,
  createInitialScoreState,
  createInitialGameState,
  GAME_CONFIG,
} from '../types/game';
import type { GameState, BoardCell, ScoreState } from '../types';

describe('Game Types', () => {
  describe('createEmptyBoard', () => {
    it('should create a board with correct dimensions', () => {
      const board = createEmptyBoard();
      
      expect(board).toHaveLength(GAME_CONFIG.BOARD_HEIGHT);
      board.forEach((row) => {
        expect(row).toHaveLength(GAME_CONFIG.BOARD_WIDTH);
      });
    });

    it('should create an empty board with all cells unfilled', () => {
      const board = createEmptyBoard();
      
      board.forEach((row) => {
        row.forEach((cell: BoardCell) => {
          expect(cell.filled).toBe(false);
          expect(cell.type).toBeNull();
        });
      });
    });

    it('should create independent rows (no shared references)', () => {
      const board = createEmptyBoard();
      
      // Modify one cell
      board[0][0] = { filled: true, type: 'I' };
      
      // Other rows should not be affected
      expect(board[1][0]).toEqual({ filled: false, type: null });
    });
  });

  describe('createInitialScoreState', () => {
    it('should create score state with default values', () => {
      const score = createInitialScoreState();
      
      expect(score.score).toBe(0);
      expect(score.level).toBe(1);
      expect(score.lines).toBe(0);
      expect(score.combo).toBe(0);
      expect(score.highScore).toBe(0);
    });
  });

  describe('createInitialGameState', () => {
    it('should create game state with menu status', () => {
      const state = createInitialGameState();
      
      expect(state.status).toBe('menu');
    });

    it('should create game state with empty board', () => {
      const state = createInitialGameState();
      
      expect(state.board).toHaveLength(GAME_CONFIG.BOARD_HEIGHT);
      state.board.forEach((row) => {
        expect(row).toHaveLength(GAME_CONFIG.BOARD_WIDTH);
      });
    });

    it('should create game state with null current piece', () => {
      const state = createInitialGameState();
      
      expect(state.currentPiece).toBeNull();
    });

    it('should create game state with empty next pieces', () => {
      const state = createInitialGameState();
      
      expect(state.nextPieces).toEqual([]);
    });

    it('should create game state with null hold piece', () => {
      const state = createInitialGameState();
      
      expect(state.holdPiece).toBeNull();
    });

    it('should create game state with hasHeld false', () => {
      const state = createInitialGameState();
      
      expect(state.hasHeld).toBe(false);
    });

    it('should create game state with initial score', () => {
      const state = createInitialGameState();
      
      expect(state.score.score).toBe(0);
      expect(state.score.level).toBe(1);
    });
  });

  describe('GAME_CONFIG', () => {
    it('should have correct board dimensions', () => {
      expect(GAME_CONFIG.BOARD_WIDTH).toBe(10);
      expect(GAME_CONFIG.BOARD_HEIGHT).toBe(20);
    });

    it('should have correct next pieces count', () => {
      expect(GAME_CONFIG.NEXT_PIECES_COUNT).toBe(3);
    });

    it('should have correct initial fall speed', () => {
      expect(GAME_CONFIG.INITIAL_FALL_SPEED).toBe(1000);
    });

    it('should have correct line scores', () => {
      expect(GAME_CONFIG.LINE_SCORES).toEqual([100, 300, 500, 800]);
    });

    it('should have correct lines per level', () => {
      expect(GAME_CONFIG.LINES_PER_LEVEL).toBe(10);
    });

    it('should have correct combo multiplier', () => {
      expect(GAME_CONFIG.COMBO_MULTIPLIER).toBe(0.1);
    });

    it('should have correct speed increase per level', () => {
      expect(GAME_CONFIG.SPEED_INCREASE_PER_LEVEL).toBe(0.1);
    });
  });
});
