/**
 * Touch Controls Component
 * 
 * US-011: Mobile responsive with touch controls
 * 
 * On-screen buttons for mobile gameplay:
 * - Hold button
 * - Pause button
 * - Hard Drop button
 * - All touch targets minimum 44x44px
 */

'use client';

import React from 'react';
import { GameAction } from '../types/keyboard';

export interface TouchControlsProps {
  /** Callback function when a game action is triggered */
  onAction: (action: GameAction) => void;
  /** Whether the controls are visible/enabled */
  enabled?: boolean;
  /** Current game state */
  isPaused?: boolean;
  /** Whether hold is available */
  canHold?: boolean;
}

/**
 * Mobile touch control buttons
 * Provides on-screen buttons for Hold, Pause, and Hard Drop
 * All buttons meet minimum 44x44px touch target requirement
 */
export function TouchControls({
  onAction,
  enabled = true,
  isPaused = false,
  canHold = true,
}: TouchControlsProps) {
  if (!enabled) return null;

  return (
    <div className="touch-controls">
      {/* Hold Button */}
      <button
        type="button"
        className="touch-btn touch-btn-hold"
        onClick={() => onAction('HOLD')}
        disabled={!canHold}
        aria-label="Hold piece"
        style={{
          minWidth: '44px',
          minHeight: '44px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 600,
          background: canHold 
            ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.8), rgba(147, 51, 234, 0.9))'
            : 'rgba(100, 100, 100, 0.3)',
          border: '1px solid rgba(168, 85, 247, 0.5)',
          borderRadius: '12px',
          color: canHold ? '#fff' : '#666',
          cursor: canHold ? 'pointer' : 'not-allowed',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: canHold ? '0 0 15px rgba(168, 85, 247, 0.4)' : 'none',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
      >
        HOLD
      </button>

      {/* Pause Button */}
      <button
        type="button"
        className="touch-btn touch-btn-pause"
        onClick={() => onAction('PAUSE')}
        aria-label={isPaused ? 'Resume game' : 'Pause game'}
        style={{
          minWidth: '44px',
          minHeight: '44px',
          padding: '12px 20px',
          fontSize: '14px',
          fontWeight: 600,
          background: isPaused
            ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.8), rgba(22, 163, 74, 0.9))'
            : 'linear-gradient(135deg, rgba(234, 179, 8, 0.8), rgba(202, 138, 4, 0.9))',
          border: isPaused 
            ? '1px solid rgba(34, 197, 94, 0.5)'
            : '1px solid rgba(234, 179, 8, 0.5)',
          borderRadius: '12px',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPaused 
            ? '0 0 15px rgba(34, 197, 94, 0.4)'
            : '0 0 15px rgba(234, 179, 8, 0.4)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
      >
        {isPaused ? 'RESUME' : 'PAUSE'}
      </button>

      {/* Hard Drop Button */}
      <button
        type="button"
        className="touch-btn touch-btn-harddrop"
        onClick={() => onAction('HARD_DROP')}
        aria-label="Hard drop"
        style={{
          minWidth: '44px',
          minHeight: '44px',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: 600,
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.8), rgba(8, 145, 178, 0.9))',
          border: '1px solid rgba(0, 240, 255, 0.5)',
          borderRadius: '12px',
          color: '#fff',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 0 15px rgba(0, 240, 255, 0.4)',
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          userSelect: 'none',
        }}
      >
        DROP
      </button>
    </div>
  );
}

export default TouchControls;
