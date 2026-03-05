'use client';

import React from 'react';

interface PauseOverlayProps {
  onResume: () => void;
  onRestart: () => void;
}

/**
 * Pause Overlay Component
 * 
 * US-010: Pause overlay appears when P/Escape pressed during game
 * - Semi-transparent backdrop with blur
 * - Centered PAUSED text with pulse animation
 * - Resume and Restart buttons
 * - Keyboard hint
 */
export function PauseOverlay({ onResume, onRestart }: PauseOverlayProps) {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-[100]"
      style={{ 
        background: 'rgba(10, 10, 18, 0.85)',
        backdropFilter: 'blur(4px)',
      }}
      data-testid="pause-overlay"
    >
      <div 
        className="text-center p-8 md:p-12 rounded-2xl"
        style={{ 
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.9), rgba(18, 18, 31, 0.95))',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 0 60px rgba(168, 85, 247, 0.2)',
        }}
      >
        {/* Pause Title */}
        <h1 
          className="text-5xl md:text-6xl font-bold tracking-widest mb-4 animate-glow"
          style={{ 
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, var(--color-accent-purple), #c084fc)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(168, 85, 247, 0.5))',
          }}
        >
          PAUSED
        </h1>
        
        {/* Subtitle */}
        <p 
          className="text-base tracking-widest mb-8"
          style={{ 
            fontFamily: 'var(--font-body)',
            color: 'var(--color-text-secondary)',
          }}
        >
          GAME ON HOLD
        </p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={onResume}
            className="btn-primary"
            data-testid="resume-button"
          >
            RESUME
          </button>
          <button
            onClick={onRestart}
            className="btn-secondary"
            data-testid="restart-button"
          >
            RESTART
          </button>
        </div>
        
        {/* Keyboard Hint */}
        <p 
          className="text-sm mt-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Press <span className="key-badge">P</span> or <span className="key-badge">ESC</span> to resume
        </p>
      </div>
    </div>
  );
}

export default PauseOverlay;
