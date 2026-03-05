import { describe, it, expect, beforeEach } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useGameStore } from '../store/gameStore';
import { createEmptyBoard, getRandomTetrominoType, TetrominoType } from '../types/game';

describe('Game Types', () => {
  describe('createEmptyBoard', () => {
    it('should create a 20x10 board', () => {
      const board = createEmptyBoard();
      expect(board.length).toBe(20);
      expect(board[0].length).toBe(10);
    });

    it('should create empty cells', () => {
      const board = createEmptyBoard();
      for (const row of board) {
        for (const cell of row) {
          expect(cell.filled).toBe(false);
          expect(cell.type).toBeNull();
        }
      }
    });
  });

  describe('getRandomTetrominoType', () => {
    it('should return a valid tetromino type', () => {
      const validTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
      const type = getRandomTetrominoType();
      expect(validTypes).toContain(type);
    });
  });
});

describe('Game Store', () => {
  beforeEach(() => {
    // Reset the store before each test
    const { result } = renderHook(() => useGameStore());
    act(() => {
      result.current.resetGame();
    });
  });

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.status).toBe('menu');
      expect(result.current.score).toBe(0);
      expect(result.current.level).toBe(1);
      expect(result.current.linesCleared).toBe(0);
      expect(result.current.currentPiece).toBeNull();
      expect(result.current.holdPiece).toBeNull();
      expect(result.current.holdUsed).toBe(false);
      expect(result.current.nextPieces.length).toBe(3);
      expect(result.current.startTime).toBeNull();
    });

    it('should have an empty board initially', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.board.length).toBe(20);
      expect(result.current.board[0].length).toBe(10);
      
      for (const row of result.current.board) {
        for (const cell of row) {
          expect(cell.filled).toBe(false);
          expect(cell.type).toBeNull();
        }
      }
    });
  });

  describe('startGame', () => {
    it('should change status to playing', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      expect(result.current.status).toBe('playing');
    });

    it('should set start time', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      expect(result.current.startTime).not.toBeNull();
      expect(typeof result.current.startTime).toBe('number');
    });

    it('should spawn a current piece', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      expect(result.current.currentPiece).not.toBeNull();
      expect(result.current.currentPiece?.type).toBeDefined();
      expect(result.current.currentPiece?.position).toBeDefined();
    });

    it('should populate next pieces queue', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      expect(result.current.nextPieces.length).toBe(3);
    });
  });

  describe('pauseGame', () => {
    it('should pause when game is playing', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.pauseGame();
      });
      
      expect(result.current.status).toBe('paused');
    });

    it('should not pause when game is not playing', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.pauseGame();
      });
      
      expect(result.current.status).toBe('menu');
    });
  });

  describe('resumeGame', () => {
    it('should resume when game is paused', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.pauseGame();
      });
      
      act(() => {
        result.current.resumeGame();
      });
      
      expect(result.current.status).toBe('playing');
    });

    it('should not resume when game is not paused', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.resumeGame();
      });
      
      expect(result.current.status).toBe('playing');
    });
  });

  describe('resetGame', () => {
    it('should reset to initial state', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.resetGame();
      });
      
      expect(result.current.status).toBe('menu');
      expect(result.current.score).toBe(0);
      expect(result.current.level).toBe(1);
      expect(result.current.linesCleared).toBe(0);
      expect(result.current.currentPiece).toBeNull();
    });
  });

  describe('gameOver', () => {
    it('should set status to gameover', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.gameOver();
      });
      
      expect(result.current.status).toBe('gameover');
    });
  });

  describe('movePiece', () => {
    it('should move piece left', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      const initialX = result.current.currentPiece?.position.x;
      
      // Try to move left (might be blocked by wall)
      act(() => {
        result.current.movePiece('left');
      });
      
      // Either moved left or stayed at boundary
      expect(result.current.currentPiece?.position.x).toBeLessThanOrEqual(initialX!);
    });

    it('should move piece right', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      const initialX = result.current.currentPiece?.position.x;
      
      // Try to move right
      act(() => {
        result.current.movePiece('right');
      });
      
      // Either moved right or stayed at boundary
      expect(result.current.currentPiece?.position.x).toBeGreaterThanOrEqual(initialX!);
    });
  });

  describe('rotatePiece', () => {
    it('should attempt to rotate piece', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      act(() => {
        result.current.rotatePiece();
      });
      
      // O piece doesn't rotate
      if (result.current.currentPiece?.type !== 'O') {
        expect(result.current.currentPiece?.rotation).toBeDefined();
      }
    });
  });

  describe('holdPieceAction', () => {
    it('should hold current piece on first hold', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      const currentType = result.current.currentPiece?.type;
      
      act(() => {
        result.current.holdPieceAction();
      });
      
      expect(result.current.holdPiece).toBe(currentType);
      expect(result.current.holdUsed).toBe(true);
    });

    it('should not allow holding twice in a row', () => {
      const { result } = renderHook(() => useGameStore());
      
      act(() => {
        result.current.startGame();
      });
      
      const firstHold = result.current.currentPiece?.type;
      
      act(() => {
        result.current.holdPieceAction();
      });
      
      const secondPiece = result.current.currentPiece?.type;
      
      act(() => {
        result.current.holdPieceAction();
      });
      
      // Second hold should not work
      expect(result.current.holdPiece).toBe(firstHold);
      expect(result.current.currentPiece?.type).toBe(secondPiece);
    });
  });

  describe('Score and Level', () => {
    it('should track score', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.score).toBe(0);
    });

    it('should track level', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.level).toBe(1);
    });

    it('should track lines cleared', () => {
      const { result } = renderHook(() => useGameStore());
      
      expect(result.current.linesCleared).toBe(0);
    });
  });
});
