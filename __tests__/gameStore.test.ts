/**
 * Game Store Tests
 * 
 * US-002: Tests for game state management and store actions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useGameStore, calculateLineScore } from '../store/gameStore';
import { createEmptyBoard, createInitialScoreState, GAME_CONFIG } from '../types/game';
import type { TetrominoType } from '../types';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Game Store', () => {
  beforeEach(() => {
    // Reset store to initial state before each test
    useGameStore.setState({
      gameState: 'start',
      status: 'menu',
      board: createEmptyBoard(),
      currentPiece: null,
      nextPieces: [],
      holdPiece: null,
      hasHeld: false,
      canHold: true,
      score: 0,
      level: 1,
      lines: 0,
      combo: 0,
      highScore: 0,
    });
    vi.clearAllMocks();
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('start');
      expect(state.status).toBe('menu');
      expect(state.board).toHaveLength(GAME_CONFIG.BOARD_HEIGHT);
      expect(state.board[0]).toHaveLength(GAME_CONFIG.BOARD_WIDTH);
      expect(state.currentPiece).toBeNull();
      expect(state.nextPieces).toEqual([]);
      expect(state.holdPiece).toBeNull();
      expect(state.hasHeld).toBe(false);
      expect(state.canHold).toBe(true);
      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
      expect(state.lines).toBe(0);
      expect(state.combo).toBe(0);
      expect(state.highScore).toBe(0);
    });

    it('should have all required actions', () => {
      const state = useGameStore.getState();
      
      expect(typeof state.startGame).toBe('function');
      expect(typeof state.pauseGame).toBe('function');
      expect(typeof state.resumeGame).toBe('function');
      expect(typeof state.endGame).toBe('function');
      expect(typeof state.restartGame).toBe('function');
      expect(typeof state.resetGame).toBe('function');
      expect(typeof state.setCurrentPiece).toBe('function');
      expect(typeof state.setBoard).toBe('function');
      expect(typeof state.setNextPieces).toBe('function');
      expect(typeof state.setHoldPiece).toBe('function');
      expect(typeof state.setHasHeld).toBe('function');
      expect(typeof state.setCanHold).toBe('function');
      expect(typeof state.addScore).toBe('function');
      expect(typeof state.addLines).toBe('function');
      expect(typeof state.resetCombo).toBe('function');
      expect(typeof state.incrementCombo).toBe('function');
      expect(typeof state.updateHighScore).toBe('function');
    });
  });

  describe('startGame', () => {
    it('should start the game with correct state', () => {
      useGameStore.getState().startGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('playing');
      expect(state.status).toBe('playing');
      expect(state.currentPiece).not.toBeNull();
      expect(state.nextPieces).toHaveLength(GAME_CONFIG.NEXT_PIECES_COUNT);
      expect(state.holdPiece).toBeNull();
      expect(state.hasHeld).toBe(false);
      expect(state.canHold).toBe(true);
      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
      expect(state.lines).toBe(0);
      expect(state.combo).toBe(0);
    });

    it('should load high score from localStorage', () => {
      localStorageMock.getItem.mockReturnValue('5000');
      
      useGameStore.getState().startGame();
      const state = useGameStore.getState();
      
      expect(localStorageMock.getItem).toHaveBeenCalledWith('tetris-high-score');
      expect(state.highScore).toBe(5000);
    });

    it('should handle missing high score in localStorage', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      useGameStore.getState().startGame();
      const state = useGameStore.getState();
      
      expect(state.highScore).toBe(0);
    });
  });

  describe('pauseGame', () => {
    it('should pause a playing game', () => {
      useGameStore.setState({ status: 'playing', gameState: 'playing' });
      
      useGameStore.getState().pauseGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('paused');
      expect(state.status).toBe('paused');
    });

    it('should resume a paused game when paused', () => {
      useGameStore.setState({ status: 'paused', gameState: 'paused' });
      
      useGameStore.getState().pauseGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('playing');
      expect(state.status).toBe('playing');
    });

    it('should not change state if game is not playing or paused', () => {
      useGameStore.setState({ status: 'menu', gameState: 'start' });
      
      useGameStore.getState().pauseGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('start');
      expect(state.status).toBe('menu');
    });
  });

  describe('resumeGame', () => {
    it('should resume a paused game', () => {
      useGameStore.setState({ status: 'paused', gameState: 'paused' });
      
      useGameStore.getState().resumeGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('playing');
      expect(state.status).toBe('playing');
    });

    it('should not resume if game is not paused', () => {
      useGameStore.setState({ status: 'menu', gameState: 'start' });
      
      useGameStore.getState().resumeGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('start');
    });
  });

  describe('endGame', () => {
    it('should end the game and save high score', () => {
      useGameStore.setState({ 
        status: 'playing', 
        gameState: 'playing',
        score: 5000, 
        highScore: 3000 
      });
      
      useGameStore.getState().endGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('gameover');
      expect(state.status).toBe('gameover');
      expect(state.highScore).toBe(5000);
      expect(localStorageMock.setItem).toHaveBeenCalledWith('tetris-high-score', '5000');
    });
  });

  describe('restartGame', () => {
    it('should restart the game with fresh state', () => {
      useGameStore.setState({
        status: 'gameover',
        gameState: 'gameover',
        score: 5000,
        lines: 20,
        level: 3,
      });
      
      useGameStore.getState().restartGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('playing');
      expect(state.status).toBe('playing');
      expect(state.score).toBe(0);
      expect(state.level).toBe(1);
      expect(state.lines).toBe(0);
      expect(state.currentPiece).not.toBeNull();
    });
  });

  describe('resetGame', () => {
    it('should reset game to initial state', () => {
      // Set up a playing state
      useGameStore.setState({
        status: 'playing',
        gameState: 'playing',
        score: 1000,
        currentPiece: { type: 'I', position: { x: 3, y: 5 }, rotation: 0 },
      });
      
      useGameStore.getState().resetGame();
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('start');
      expect(state.status).toBe('menu');
      expect(state.currentPiece).toBeNull();
      expect(state.score).toBe(0);
    });

    it('should save high score when resetting with higher score', () => {
      useGameStore.setState({
        status: 'gameover',
        gameState: 'gameover',
        score: 5000,
        highScore: 3000,
      });
      
      useGameStore.getState().resetGame();
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('tetris-high-score', '5000');
    });
  });

  describe('setCurrentPiece', () => {
    it('should set the current piece', () => {
      const piece = { type: 'T' as TetrominoType, position: { x: 3, y: 0 }, rotation: 0 };
      
      useGameStore.getState().setCurrentPiece(piece);
      const state = useGameStore.getState();
      
      expect(state.currentPiece).toEqual(piece);
    });

    it('should clear the current piece', () => {
      useGameStore.setState({
        currentPiece: { type: 'I', position: { x: 3, y: 0 }, rotation: 0 },
      });
      
      useGameStore.getState().setCurrentPiece(null);
      const state = useGameStore.getState();
      
      expect(state.currentPiece).toBeNull();
    });
  });

  describe('setBoard', () => {
    it('should set the board directly', () => {
      const newBoard = createEmptyBoard();
      newBoard[0][0] = { filled: true, type: 'I' };
      
      useGameStore.getState().setBoard(newBoard);
      const state = useGameStore.getState();
      
      expect(state.board[0][0]).toEqual({ filled: true, type: 'I' });
    });

    it('should set the board using a function', () => {
      useGameStore.getState().setBoard((prev) => {
        const newBoard = [...prev];
        newBoard[0] = [...newBoard[0]];
        newBoard[0][0] = { filled: true, type: 'O' };
        return newBoard;
      });
      
      const state = useGameStore.getState();
      expect(state.board[0][0]).toEqual({ filled: true, type: 'O' });
    });
  });

  describe('setNextPieces', () => {
    it('should set next pieces directly', () => {
      const pieces: TetrominoType[] = ['I', 'O', 'T'];
      
      useGameStore.getState().setNextPieces(pieces);
      const state = useGameStore.getState();
      
      expect(state.nextPieces).toEqual(pieces);
    });

    it('should set next pieces using a function', () => {
      useGameStore.setState({ nextPieces: ['I', 'O'] as TetrominoType[] });
      
      useGameStore.getState().setNextPieces((prev) => [...prev, 'T'] as TetrominoType[]);
      
      const state = useGameStore.getState();
      expect(state.nextPieces).toEqual(['I', 'O', 'T']);
    });
  });

  describe('setHoldPiece', () => {
    it('should set the hold piece', () => {
      useGameStore.getState().setHoldPiece('J');
      const state = useGameStore.getState();
      
      expect(state.holdPiece).toBe('J');
    });

    it('should clear the hold piece', () => {
      useGameStore.setState({ holdPiece: 'L' as TetrominoType });
      
      useGameStore.getState().setHoldPiece(null);
      const state = useGameStore.getState();
      
      expect(state.holdPiece).toBeNull();
    });
  });

  describe('setHasHeld', () => {
    it('should set hasHeld flag', () => {
      useGameStore.getState().setHasHeld(true);
      const state = useGameStore.getState();
      
      expect(state.hasHeld).toBe(true);
    });
  });

  describe('setCanHold', () => {
    it('should set canHold flag', () => {
      useGameStore.getState().setCanHold(false);
      const state = useGameStore.getState();
      
      expect(state.canHold).toBe(false);
    });
  });

  describe('addScore', () => {
    it('should add to the score', () => {
      useGameStore.getState().addScore(1000);
      const state = useGameStore.getState();
      
      expect(state.score).toBe(1000);
    });
  });

  describe('addLines', () => {
    it('should add lines and update score', () => {
      useGameStore.setState({
        level: 1,
        lines: 0,
        score: 0,
        combo: 0,
      });
      
      useGameStore.getState().addLines(2);
      const state = useGameStore.getState();
      
      expect(state.lines).toBe(2);
      expect(state.score).toBe(300); // 300 * 1.0 * 1
    });

    it('should level up after 10 lines', () => {
      useGameStore.setState({
        lines: 9,
        level: 1,
        score: 0,
        combo: 0,
      });
      
      useGameStore.getState().addLines(1);
      const state = useGameStore.getState();
      
      expect(state.level).toBe(2);
    });

    it('should save high score when beaten', () => {
      useGameStore.setState({
        score: 5000,
        highScore: 3000,
        level: 1,
        lines: 0,
        combo: 0,
      });
      
      useGameStore.getState().addLines(1);
      
      expect(localStorageMock.setItem).toHaveBeenCalledWith('tetris-high-score', '5100');
    });
  });

  describe('resetCombo', () => {
    it('should reset combo to 0', () => {
      useGameStore.setState({ combo: 5 });
      
      useGameStore.getState().resetCombo();
      const state = useGameStore.getState();
      
      expect(state.combo).toBe(0);
    });
  });

  describe('incrementCombo', () => {
    it('should increment combo', () => {
      useGameStore.setState({ combo: 2 });
      
      useGameStore.getState().incrementCombo();
      const state = useGameStore.getState();
      
      expect(state.combo).toBe(3);
    });
  });

  describe('setStatus', () => {
    it('should set game status directly', () => {
      useGameStore.getState().setStatus('gameover');
      const state = useGameStore.getState();
      
      expect(state.status).toBe('gameover');
      expect(state.gameState).toBe('gameover');
    });
  });

  describe('setGameState', () => {
    it('should set game state directly', () => {
      useGameStore.getState().setGameState('paused');
      const state = useGameStore.getState();
      
      expect(state.gameState).toBe('paused');
      expect(state.status).toBe('paused');
    });
  });
});

describe('calculateLineScore', () => {
  it('should calculate score for 1 line', () => {
    expect(calculateLineScore(1, 1, 0)).toBe(100);
  });

  it('should calculate score for 4 lines (Tetris)', () => {
    expect(calculateLineScore(4, 1, 0)).toBe(800);
  });

  it('should apply level multiplier', () => {
    expect(calculateLineScore(1, 2, 0)).toBe(200);
    expect(calculateLineScore(4, 3, 0)).toBe(2400);
  });

  it('should apply combo multiplier', () => {
    // 100 * 1 * 1.1 = 110
    expect(calculateLineScore(1, 1, 1)).toBe(110);
    // 100 * 1 * 1.2 = 120
    expect(calculateLineScore(1, 1, 2)).toBe(120);
  });

  it('should apply both level and combo multipliers', () => {
    // 100 * 2 * 1.1 = 220
    expect(calculateLineScore(1, 2, 1)).toBe(220);
  });
});
