/**
 * Game Store - React Context for 3D Tetris Game State
 * 
 * US-009: UI panels - Score, controls, and game status
 */

'use client';

import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import type { TetrominoType } from '../types/tetromino';

export type GameStatus = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

export interface GameState {
  status: GameStatus;
  score: number;
  level: number;
  lines: number;
  combo: number;
  highScore: number;
  holdPiece: TetrominoType | null;
  nextPieces: TetrominoType[];
}

const initialState: GameState = {
  status: 'START',
  score: 0,
  level: 1,
  lines: 0,
  combo: 0,
  highScore: 0,
  holdPiece: null,
  nextPieces: [],
};

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'PAUSE_GAME' }
  | { type: 'RESUME_GAME' }
  | { type: 'RESTART_GAME' }
  | { type: 'GAME_OVER' }
  | { type: 'UPDATE_SCORE'; payload: { score: number; lines: number; combo: number } }
  | { type: 'SET_HIGH_SCORE'; payload: number }
  | { type: 'SET_HOLD_PIECE'; payload: TetrominoType | null }
  | { type: 'SET_NEXT_PIECES'; payload: TetrominoType[] }
  | { type: 'LEVEL_UP' };

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        status: 'PLAYING',
        score: 0,
        level: 1,
        lines: 0,
        combo: 0,
        holdPiece: null,
        nextPieces: generateNextPieces(),
      };
    case 'PAUSE_GAME':
      return { ...state, status: 'PAUSED' };
    case 'RESUME_GAME':
      return { ...state, status: 'PLAYING' };
    case 'RESTART_GAME':
      return {
        ...initialState,
        highScore: state.highScore,
        status: 'PLAYING',
        nextPieces: generateNextPieces(),
      };
    case 'GAME_OVER':
      const newHighScore = Math.max(state.score, state.highScore);
      if (newHighScore > state.highScore) {
        localStorage.setItem('tetris-high-score', newHighScore.toString());
      }
      return { ...state, status: 'GAME_OVER', highScore: newHighScore };
    case 'UPDATE_SCORE': {
      const { score, lines, combo } = action.payload;
      const newLines = state.lines + lines;
      const newLevel = Math.floor(newLines / 10) + 1;
      return {
        ...state,
        score: state.score + score,
        lines: newLines,
        level: newLevel,
        combo,
      };
    }
    case 'SET_HIGH_SCORE':
      return { ...state, highScore: action.payload };
    case 'SET_HOLD_PIECE':
      return { ...state, holdPiece: action.payload };
    case 'SET_NEXT_PIECES':
      return { ...state, nextPieces: action.payload };
    case 'LEVEL_UP':
      return { ...state, level: state.level + 1 };
    default:
      return state;
  }
}

function generateNextPieces(): TetrominoType[] {
  const pieces: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
  const shuffled = [...pieces].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

interface GameContextType {
  state: GameState;
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  restartGame: () => void;
  gameOver: () => void;
  updateScore: (score: number, lines: number, combo: number) => void;
  setHoldPiece: (piece: TetrominoType | null) => void;
  setNextPieces: (pieces: TetrominoType[]) => void;
}

const GameContext = createContext<GameContextType | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Load high score from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('tetris-high-score');
    if (saved) {
      dispatch({ type: 'SET_HIGH_SCORE', payload: parseInt(saved, 10) });
    }
  }, []);

  const startGame = useCallback(() => {
    dispatch({ type: 'START_GAME' });
  }, []);

  const pauseGame = useCallback(() => {
    dispatch({ type: 'PAUSE_GAME' });
  }, []);

  const resumeGame = useCallback(() => {
    dispatch({ type: 'RESUME_GAME' });
  }, []);

  const restartGame = useCallback(() => {
    dispatch({ type: 'RESTART_GAME' });
  }, []);

  const gameOver = useCallback(() => {
    dispatch({ type: 'GAME_OVER' });
  }, []);

  const updateScore = useCallback((score: number, lines: number, combo: number) => {
    dispatch({ type: 'UPDATE_SCORE', payload: { score, lines, combo } });
  }, []);

  const setHoldPiece = useCallback((piece: TetrominoType | null) => {
    dispatch({ type: 'SET_HOLD_PIECE', payload: piece });
  }, []);

  const setNextPieces = useCallback((pieces: TetrominoType[]) => {
    dispatch({ type: 'SET_NEXT_PIECES', payload: pieces });
  }, []);

  return (
    <GameContext.Provider
      value={{
        state,
        startGame,
        pauseGame,
        resumeGame,
        restartGame,
        gameOver,
        updateScore,
        setHoldPiece,
        setNextPieces,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
