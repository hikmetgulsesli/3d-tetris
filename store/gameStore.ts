/**
 * Game Store
 * 
 * US-002: Game state management using Zustand
 * Provides backward-compatible interface for US-009 UI panels
 */

import { create } from 'zustand';
import type {
  GameStatus,
  Board,
  CurrentPiece,
  TetrominoType,
} from '../types';
import {
  createInitialScoreState,
  GAME_CONFIG,
} from '../types';
import { getRandomTetrominoType, getSpawnOffset } from '../lib/tetrominos';
import { createEmptyBoard } from '../lib/gameLogic';

/** Game state type alias for UI compatibility */
export type GameState = 'start' | 'playing' | 'paused' | 'gameover';

/** Stats interface for game scoring */
export interface GameStats {
  score: number;
  level: number;
  lines: number;
  combo: number;
}

/** Complete game store with state and actions */
export interface GameStore {
  // Game state (UI-compatible naming)
  gameState: GameState;
  status: GameStatus;
  
  // Stats (flattened for UI compatibility)
  score: number;
  level: number;
  lines: number;
  combo: number;
  highScore: number;
  
  // Core game state
  board: Board;
  currentPiece: CurrentPiece | null;
  nextPieces: TetrominoType[];
  holdPiece: TetrominoType | null;
  hasHeld: boolean;
  canHold: boolean;
  
  // Game state actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  endGame: () => void;
  restartGame: () => void;
  resetGame: () => void;
  
  // Stats actions (UI-compatible)
  addScore: (points: number) => void;
  addLines: (count: number) => void;
  resetCombo: () => void;
  incrementCombo: () => void;
  updateHighScore: () => void;
  
  // Core state actions
  setCurrentPiece: (piece: CurrentPiece | null) => void;
  setBoard: (board: Board | ((prev: Board) => Board)) => void;
  setNextPieces: (pieces: TetrominoType[] | ((prev: TetrominoType[]) => TetrominoType[])) => void;
  setHoldPiece: (piece: TetrominoType | null) => void;
  setHasHeld: (hasHeld: boolean) => void;
  setCanHold: (canHold: boolean) => void;
  setStatus: (status: GameStatus) => void;
  setGameState: (gameState: GameState) => void;
  
  // Score updates
  updateScore: (updates: Partial<{ score: number; level: number; lines: number; combo: number; highScore: number }>) => void;
}

/** Generate random next pieces queue */
function generateNextPieces(count: number = GAME_CONFIG.NEXT_PIECES_COUNT): TetrominoType[] {
  const pieces: TetrominoType[] = [];
  for (let i = 0; i < count; i++) {
    pieces.push(getRandomTetrominoType());
  }
  return pieces;
}

/** Spawn a new piece from the queue */
function spawnPiece(nextPieces: TetrominoType[]): {
  piece: CurrentPiece;
  updatedNextPieces: TetrominoType[];
} {
  const type = nextPieces[0];
  const offset = getSpawnOffset(type);
  const piece: CurrentPiece = {
    type,
    position: { x: offset.x, y: offset.y },
    rotation: 0,
  };
  const updatedNextPieces = [...nextPieces.slice(1), getRandomTetrominoType()];
  return { piece, updatedNextPieces };
}

/** Map GameStatus to GameState */
function statusToGameState(status: GameStatus): GameState {
  switch (status) {
    case 'menu': return 'start';
    case 'playing': return 'playing';
    case 'paused': return 'paused';
    case 'gameover': return 'gameover';
    default: return 'start';
  }
}

/** Map GameState to GameStatus */
function gameStateToStatus(gameState: GameState): GameStatus {
  switch (gameState) {
    case 'start': return 'menu';
    case 'playing': return 'playing';
    case 'paused': return 'paused';
    case 'gameover': return 'gameover';
    default: return 'menu';
  }
}

/** Load high score from localStorage (safely for SSR) */
function loadHighScore(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const saved = localStorage.getItem('tetris-high-score');
    return saved ? parseInt(saved, 10) : 0;
  } catch {
    return 0;
  }
}

/** Save high score to localStorage */
function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('tetris-high-score', score.toString());
  } catch {
    // Ignore storage errors
  }
}

/** Line clear scoring */
const LINE_SCORES: Record<number, number> = {
  1: 100,
  2: 300,
  3: 500,
  4: 800,
};

/** Calculate score for line clears */
export function calculateLineScore(lines: number, level: number, combo: number): number {
  const baseScore = LINE_SCORES[lines] || 0;
  const levelMultiplier = level;
  const comboMultiplier = 1 + combo * GAME_CONFIG.COMBO_MULTIPLIER;
  return Math.floor(baseScore * levelMultiplier * comboMultiplier);
}

/** Initial stats */
const INITIAL_STATS = {
  score: 0,
  level: 1,
  lines: 0,
  combo: 0,
};

/** Create the game store */
export const useGameStore = create<GameStore>((set, get) => ({
  // Initial state - both naming conventions
  gameState: 'start',
  status: 'menu',
  
  // Flattened stats (UI compatibility)
  ...INITIAL_STATS,
  highScore: 0,
  
  // Core game state
  board: createEmptyBoard(),
  currentPiece: null,
  nextPieces: [],
  holdPiece: null,
  hasHeld: false,
  canHold: true,

  // Game state actions
  startGame: () => {
    const highScore = loadHighScore();
    const nextPieces = generateNextPieces();
    const { piece, updatedNextPieces } = spawnPiece(nextPieces);

    set({
      gameState: 'playing',
      status: 'playing',
      board: createEmptyBoard(),
      currentPiece: piece,
      nextPieces: updatedNextPieces,
      holdPiece: null,
      hasHeld: false,
      canHold: true,
      ...INITIAL_STATS,
      highScore,
    });
  },

  pauseGame: () => {
    const { status } = get();
    if (status === 'playing') {
      set({ gameState: 'paused', status: 'paused' });
    } else if (status === 'paused') {
      set({ gameState: 'playing', status: 'playing' });
    }
  },

  resumeGame: () => {
    const { status } = get();
    if (status === 'paused') {
      set({ gameState: 'playing', status: 'playing' });
    }
  },

  endGame: () => {
    const { score, highScore } = get();
    const newHighScore = Math.max(score, highScore);
    saveHighScore(newHighScore);
    set({ gameState: 'gameover', status: 'gameover', highScore: newHighScore });
  },

  restartGame: () => {
    const { highScore } = get();
    const nextPieces = generateNextPieces();
    const { piece, updatedNextPieces } = spawnPiece(nextPieces);

    set({
      gameState: 'playing',
      status: 'playing',
      board: createEmptyBoard(),
      currentPiece: piece,
      nextPieces: updatedNextPieces,
      holdPiece: null,
      hasHeld: false,
      canHold: true,
      ...INITIAL_STATS,
      highScore,
    });
  },

  resetGame: () => {
    const { score, highScore } = get();
    const finalHighScore = Math.max(score, highScore);
    saveHighScore(finalHighScore);
    
    set({
      gameState: 'start',
      status: 'menu',
      board: createEmptyBoard(),
      currentPiece: null,
      nextPieces: [],
      holdPiece: null,
      hasHeld: false,
      canHold: true,
      ...INITIAL_STATS,
      highScore: finalHighScore,
    });
  },

  // Stats actions (UI-compatible)
  addScore: (points: number) => {
    set((state) => ({ score: state.score + points }));
  },

  addLines: (count: number) => {
    set((state) => {
      const newLines = state.lines + count;
      const newLevel = Math.floor(newLines / GAME_CONFIG.LINES_PER_LEVEL) + 1;
      const lineScore = calculateLineScore(count, state.level, state.combo);
      const newScore = state.score + lineScore;
      const newHighScore = Math.max(newScore, state.highScore);

      // Save high score if it changed
      if (newHighScore > state.highScore) {
        saveHighScore(newHighScore);
      }

      return {
        lines: newLines,
        level: newLevel,
        score: newScore,
        highScore: newHighScore,
        combo: state.combo + 1,
      };
    });
  },

  resetCombo: () => {
    set({ combo: 0 });
  },

  incrementCombo: () => {
    set((state) => ({ combo: state.combo + 1 }));
  },

  updateHighScore: () => {
    set((state) => {
      const newHighScore = Math.max(state.score, state.highScore);
      saveHighScore(newHighScore);
      return { highScore: newHighScore };
    });
  },

  // Core state actions
  setCurrentPiece: (piece) => {
    set({ currentPiece: piece });
  },

  setBoard: (board) => {
    set((state) => ({
      board: typeof board === 'function' ? board(state.board) : board,
    }));
  },

  setNextPieces: (pieces) => {
    set((state) => ({
      nextPieces: typeof pieces === 'function' ? pieces(state.nextPieces) : pieces,
    }));
  },

  setHoldPiece: (piece) => {
    set({ holdPiece: piece });
  },

  setHasHeld: (hasHeld) => {
    set({ hasHeld });
  },

  setCanHold: (canHold) => {
    set({ canHold });
  },

  setStatus: (status) => {
    set({ status, gameState: statusToGameState(status) });
  },

  setGameState: (gameState) => {
    set({ gameState, status: gameStateToStatus(gameState) });
  },

  updateScore: (updates) => {
    set((state) => ({
      ...state,
      ...updates,
    }));
  },
}));
