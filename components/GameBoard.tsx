'use client';

import React from 'react';

/**
 * Game Board Placeholder Component
 * 
 * This is a placeholder for the actual 3D game board.
 * US-010 focuses on game states, not the board implementation.
 */
export function GameBoard() {
  return (
    <div 
      className="flex items-center justify-center"
      style={{ 
        width: '300px',
        height: '600px',
        background: 'var(--color-bg-card)',
        border: '2px solid rgba(0, 240, 255, 0.2)',
        borderRadius: '8px',
        padding: '1rem',
      }}
      data-testid="game-board"
    >
      <div 
        className="w-full h-full rounded"
        style={{ background: 'rgba(0, 0, 0, 0.5)' }}
      />
    </div>
  );
}

export default GameBoard;
