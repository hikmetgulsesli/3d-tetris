/**
 * Game Store
 * 
 * US-009: UI panels - Game state management using React Context
 */

'use client';

import React, { createContext, useContext, useReducer, useCallback } from 'react';
import type { TetrominoType } from '../types/tetromino';

// Game state types
export type GameStatus = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  lines: number;
  highScore: number;
  currentPiece: TetrominoType | null;
  nextPieces: TetrominoType[];
  holdPiece: TetrominoType | null;
  canHold: boolean;
}

// Initial state
const getInitialState = (): GameState => ({
  status: 'START',
  score: 0,
  level: 1,
  lines: 0,
  highScore: 0,
  currentPiece: null,
  nextPieces: [],
  holdPiece: null,
  canHold: true,
});

// Action types
type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'RESTART_GAME'; payload?: TetrominoType[] }
  | { type: 'UPDATE_SCORE'; payload: { score: number; lines: number } }
  | { type: 'SET_LEVEL'; payload: number }
  | { type: 'SET_NEXT_PIECES'; payload: TetrominoType[] }
  | { type: 'SET_CURRENT_PIECE'; payload: TetrominoType | null }
  | { type: 'HOLD_PIECE'; payload: TetrominoType }
  | { type: 'SET_HIGH_SCORE'; payload: number }
  | { type: 'RESET_HOLD' };

// Lines cleared to points mapping
const LINE_POINTS = [0, 100, 300, 500, 800];

// Calculate score for lines cleared
export function calculateScore(linesCleared: number, level: number, combo: number = 0): number {
  if (linesCleared < 1 || linesCleared > 4) return 0;
  const basePoints = LINE_POINTS[linesCleared];
  const levelMultiplier = level;
  const comboBonus = combo > 0 ? combo * 50 : 0;
  return (basePoints * levelMultiplier) + comboBonus;
}

// Reducer
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        status: 'PLAYING',
        score: 0,
        level: 1,
        lines: 0,
        canHold: true,
      };

    case 'PAUSE_GAME':
      return {
        ...state,
        status: 'PAUSED',
      };

    case 'RESUME_GAME':
      return {
        ...state,
        status: 'PLAYING',
      };

    case 'GAME_OVER':
      const newHighScore = Math.max(state.score, state.highScore);
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tetris-highscore', newHighScore.toString());
      }
      return {
        ...state,
        status: 'GAME_OVER',
        highScore: newHighScore,
      };

    case 'RESTART_GAME':
      return {
        ...getInitialState(),
        highScore: state.highScore,
        status: 'PLAYING',
        nextPieces: action.payload || [],
      };

    case 'UPDATE_SCORE': {
      const newLines = state.lines + action.payload.lines;
      const newLevel = Math.floor(newLines / 10) + 1;
      return {
        ...state,
        score: state.score + action.payload.score,
        lines: newLines,
        level: newLevel,
      };
    }

    case 'SET_LEVEL':
      return {
        ...state,
        level: action.payload,
      };

    case 'SET_NEXT_PIECES':
      return {
        ...state,
        nextPieces: action.payload,
      };

    case 'SET_CURRENT_PIECE':
      return {
        ...state,
        currentPiece: action.payload,
      };

    case 'HOLD_PIECE':
      if (!state.canHold) return state;
      return {
        ...state,
        holdPiece: action.payload,
        canHold: false,
      };

    case 'RESET_HOLD':
      return {
        ...state,
        canHold: true,
      };

    case 'SET_HIGH_SCORE':
      return {
        ...state,
        highScore: action.payload,
      };

    default:
      return state;
  }
}

// Context type
interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  gameOver: () => void;
  restartGame: (nextPieces?: TetrominoType[]) => void;
  addScore: (linesCleared: number, combo?: number) => void;
  setNextPieces: (pieces: TetrominoType[]) => void;
  setCurrentPiece: (piece: TetrominoType | null) => void;
  holdPiece: (piece: TetrominoType) => void;
  resetHold: () => void;
  setHighScore: (score: number) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, getInitialState(), (initial) => {
    // Load high score from localStorage on init
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tetris-highscore');
      if (saved) {
        return { ...initial, highScore: parseInt(saved, 10) };
      }
    }
    return initial;
  });

  const startGame = useCallback(() => dispatch({ type: 'START_GAME' }), []);
  const pauseGame = useCallback(() => dispatch({ type: 'PAUSE_GAME' }), []);
  const resumeGame = useCallback(() => dispatch({ type: 'RESUME_GAME' }), []);
  const gameOver = useCallback(() => dispatch({ type: 'GAME_OVER' }), []);
  const restartGame = useCallback((nextPieces?: TetrominoType[]) => 
    dispatch({ type: 'RESTART_GAME', payload: nextPieces }), []);
  
  const addScore = useCallback((linesCleared: number, combo: number = 0) => {
    const points = calculateScore(linesCleared, state.level, combo);
    dispatch({ type: 'UPDATE_SCORE', payload: { score: points, lines: linesCleared } });
  }, [state.level]);

  const setNextPieces = useCallback((pieces: TetrominoType[]) => 
    dispatch({ type: 'SET_NEXT_PIECES', payload: pieces }), []);

  const setCurrentPiece = useCallback((piece: TetrominoType | null) => 
    dispatch({ type: 'SET_CURRENT_PIECE', payload: piece }), []);

  const holdPiece = useCallback((piece: TetrominoType) => {
    if (state.canHold) {
      dispatch({ type: 'HOLD_PIECE', payload: piece });
    }
  }, [state.canHold]);

  const resetHold = useCallback(() => dispatch({ type: 'RESET_HOLD' }), []);
  
  const setHighScore = useCallback((score: number) => 
    dispatch({ type: 'SET_HIGH_SCORE', payload: score }), []);

  return (
    <GameContext.Provider
      value={{
        state,
        dispatch,
        startGame,
        pauseGame,
        resumeGame,
        gameOver,
        restartGame,
        addScore,
        setNextPieces,
        setCurrentPiece,
        holdPiece,
        resetHold,
        setHighScore,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

// Hook
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export default useGame;
