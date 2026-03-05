'use client';

import React from 'react';
import { ScoreData, getHighScore, isNewHighScore } from '../types/game-state';

interface GameOverScreenProps {
  scoreData: ScoreData;
  onPlayAgain: () => void;
  onMenu: () => void;
}

/**
 * Game Over Screen Component
 * 
 * US-010: Game Over screen with final score and high score
 * - Final score display with high score comparison
 * - Level, lines, and max combo stats
 * - Play Again and Menu buttons
 * - New record badge if applicable
 */
export function GameOverScreen({ scoreData, onPlayAgain, onMenu }: GameOverScreenProps) {
  // Memoize to avoid double localStorage reads
  const { highScore, isNewRecord } = React.useMemo(() => {
    const hs = getHighScore();
    const newRecord = isNewHighScore(scoreData.score);
    return { highScore: hs, isNewRecord: newRecord };
  }, [scoreData.score]);
  
  // Format number with commas
  const formatNumber = (num: number): string => {
    return num.toLocaleString();
  };

  return (
    <div 
      className="fixed inset-0 flex flex-col items-center justify-center z-[100]"
      style={{ 
        background: 'radial-gradient(ellipse at center, rgba(239, 68, 68, 0.1) 0%, rgba(10, 10, 18, 0.95) 70%)',
      }}
      data-testid="game-over-screen"
    >
      <div 
        className="text-center p-8 md:p-12 rounded-2xl max-w-lg w-[90%]"
        style={{ 
          background: 'linear-gradient(135deg, rgba(26, 26, 46, 0.95), rgba(18, 18, 31, 0.98))',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 0 80px rgba(239, 68, 68, 0.3), 0 0 120px rgba(239, 68, 68, 0.1)',
        }}
      >
        {/* Game Over Badge */}
        <div 
          className="inline-block px-6 py-2 rounded-full text-sm font-semibold tracking-widest mb-6"
          style={{ 
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-red-dark))',
            color: '#fff',
            boxShadow: '0 0 20px rgba(239, 68, 68, 0.4)',
          }}
        >
          GAME OVER
        </div>
        
        {/* Game Over Title */}
        <h1 
          className="text-4xl md:text-5xl font-bold tracking-widest mb-8"
          style={{ 
            fontFamily: 'var(--font-heading)',
            background: 'linear-gradient(135deg, var(--color-accent-red), var(--color-accent-red-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            filter: 'drop-shadow(0 0 20px rgba(239, 68, 68, 0.5))',
          }}
        >
          GAME OVER
        </h1>
        
        {/* Score Section */}
        <div 
          className="rounded-xl p-6 mb-6"
          style={{ background: 'rgba(0, 0, 0, 0.3)' }}
        >
          <div 
            className="text-xs font-semibold tracking-widest uppercase mb-2"
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-secondary)',
            }}
          >
            Final Score
          </div>
          <div 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ 
              fontFamily: 'var(--font-heading)',
              color: 'var(--color-text-primary)',
            }}
            data-testid="final-score"
          >
            {formatNumber(scoreData.score)}
          </div>
          
          {/* High Score */}
          <div className="flex justify-center items-center gap-2 text-sm mb-4">
            <span style={{ color: 'var(--color-text-secondary)' }}>High Score:</span>
            <span 
              className="font-semibold"
              style={{ 
                fontFamily: 'var(--font-heading)',
                color: 'var(--color-accent-yellow)',
              }}
              data-testid="high-score"
            >
              {formatNumber(highScore?.score ?? 0)}
            </span>
          </div>
          
          {/* New Record Badge */}
          {isNewRecord && (
            <div 
              className="inline-block px-4 py-2 rounded-lg text-sm font-semibold tracking-widest animate-glow"
              style={{ 
                fontFamily: 'var(--font-heading)',
                background: 'linear-gradient(135deg, var(--color-accent-yellow), var(--color-accent-yellow-dark))',
                color: '#000',
              }}
              data-testid="new-record-badge"
            >
              NEW RECORD!
            </div>
          )}
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <StatBox label="Level" value={scoreData.level} />
          <StatBox label="Lines" value={scoreData.lines} />
          <StatBox label="Max Combo" value={`×${scoreData.maxCombo}`} />
        </div>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-4">
          <button
            onClick={onPlayAgain}
            className="btn-primary"
            style={{
              background: 'linear-gradient(135deg, var(--color-accent-green), var(--color-accent-green-dark))',
              boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)',
            }}
            data-testid="play-again-button"
          >
            PLAY AGAIN
          </button>
          <button
            onClick={onMenu}
            className="btn-secondary"
            data-testid="menu-button"
          >
            MENU
          </button>
        </div>
        
        {/* Keyboard Hint */}
        <p 
          className="text-sm mt-4"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          Press <span className="key-badge">ENTER</span> to play again
        </p>
      </div>
    </div>
  );
}

/**
 * Stat Box Component
 */
function StatBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div 
      className="rounded-lg p-4"
      style={{ background: 'rgba(255, 255, 255, 0.03)' }}
    >
      <div 
        className="text-xs uppercase tracking-widest mb-2"
        style={{ color: 'var(--color-text-secondary)' }}
      >
        {label}
      </div>
      <div 
        className="text-xl md:text-2xl font-semibold"
        style={{ 
          fontFamily: 'var(--font-heading)',
          color: 'var(--color-text-primary)',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default GameOverScreen;
