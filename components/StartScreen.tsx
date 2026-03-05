'use client';

import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

/**
 * Start Screen Component
 * 
 * US-010: Start screen with title and 'Press ENTER to Start'
 * - Full-screen overlay with space theme
 * - Animated title with glow effect
 * - Blinking start text
 * - Control hints at bottom
 */
export function StartScreen({ onStart }: StartScreenProps) {
  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-[100]"
      style={{ background: 'var(--color-bg-primary)' }}
      data-testid="start-screen"
    >
      {/* Starfield */}
      <div className="starfield" />
      
      {/* Nebula effects */}
      <div className="nebula nebula-1" />
      <div className="nebula nebula-2" />
      
      <div className="text-center z-10 px-8">
        {/* Game Title */}
        <h1 
          className="text-6xl md:text-8xl font-bold tracking-wider mb-2 animate-glow"
          style={{ 
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, var(--color-accent-cyan), var(--color-accent-cyan-dark), var(--color-accent-cyan-darker))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 30px rgba(0, 240, 255, 0.5))',
          }}
        >
          TETRIS
        </h1>
        
        {/* Subtitle */}
        <div 
          className="text-2xl md:text-3xl font-medium mb-16 tracking-[0.3em]"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent-cyan)',
            opacity: 0.8,
          }}
        >
          3D
        </div>
        
        {/* Start Text */}
        <button
          onClick={onStart}
          className="text-xl md:text-2xl font-semibold tracking-widest animate-blink cursor-pointer hover:scale-105 transition-transform"
          style={{ 
            fontFamily: 'var(--font-heading)',
            color: 'var(--color-accent-purple)',
            textShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
            background: 'none',
            border: 'none',
          }}
          data-testid="start-button"
        >
          PRESS ENTER TO START
        </button>
        
        {/* Controls Hint */}
        <div 
          className="mt-16 text-sm opacity-70"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <span className="key-badge">←</span>
          <span className="key-badge">→</span> Move
          <span className="key-badge">↑</span> Rotate
          <span className="key-badge">↓</span> Soft Drop
          <span className="key-badge">SPACE</span> Hard Drop
        </div>
      </div>
    </div>
  );
}

export default StartScreen;
