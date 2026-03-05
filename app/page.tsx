/**
 * 3D Tetris Game Page
 * 
 * US-011: Mobile responsive with touch controls
 * 
 * Features:
 * - Responsive layout (mobile-first, desktop 1024px+)
 * - Touch controls for mobile (swipe, tap, hold)
 * - On-screen buttons for Hold, Pause, Hard Drop
 * - Compact score bar on mobile
 * - Hidden side panels on mobile
 * - Touch targets minimum 44x44px
 * - Supports 320px to 375px widths
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useKeyboard } from '../hooks/useKeyboard';
import { useTouchControls } from '../hooks/useTouchControls';
import { TouchControls } from '../components/TouchControls';
import { GameAction } from '../types/keyboard';

/**
 * Game state type
 */
type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/**
 * Score state interface
 */
interface ScoreState {
  score: number;
  level: number;
  lines: number;
  highScore: number;
}

/**
 * Main game page component
 */
export default function TetrisPage() {
  // Game state
  const [gameState, setGameState] = useState<GameState>('START');
  const [score, setScore] = useState<ScoreState>({
    score: 0,
    level: 1,
    lines: 0,
    highScore: 0,
  });
  const [canHold, setCanHold] = useState(true);

  // Load high score on mount
  useEffect(() => {
    const saved = localStorage.getItem('tetris-highscore');
    if (saved) {
      setScore(prev => ({ ...prev, highScore: parseInt(saved, 10) }));
    }
  }, []);

  // Save high score when it changes
  useEffect(() => {
    if (score.score > score.highScore) {
      localStorage.setItem('tetris-highscore', score.score.toString());
      setScore(prev => ({ ...prev, highScore: score.score }));
    }
  }, [score.score, score.highScore]);

  /**
   * Handle game actions from keyboard or touch
   */
  const handleAction = useCallback((action: GameAction) => {
    if (gameState === 'START' && action === 'HARD_DROP') {
      setGameState('PLAYING');
      return;
    }

    if (gameState === 'GAME_OVER' && action === 'HARD_DROP') {
      // Reset game
      setScore({ score: 0, level: 1, lines: 0, highScore: score.highScore });
      setGameState('PLAYING');
      setCanHold(true);
      return;
    }

    if (gameState === 'PLAYING' || gameState === 'PAUSED') {
      switch (action) {
        case 'PAUSE':
          setGameState(prev => prev === 'PAUSED' ? 'PLAYING' : 'PAUSED');
          break;
        case 'HOLD':
          if (canHold) {
            setCanHold(false);
            // Hold logic would go here
          }
          break;
        case 'MOVE_LEFT':
        case 'MOVE_RIGHT':
        case 'SOFT_DROP':
        case 'HARD_DROP':
        case 'ROTATE_CW':
        case 'ROTATE_CCW':
          if (gameState === 'PLAYING') {
            // Game logic would go here
            console.log('Action:', action);
          }
          break;
      }
    }
  }, [gameState, canHold, score.highScore]);

  // Set up keyboard controls
  useKeyboard({
    onAction: handleAction,
    enabled: true,
  });

  // Set up touch controls (state only - handlers attached to game board)
  const touchState = useTouchControls({
    onAction: handleAction,
    enabled: gameState === 'PLAYING' || gameState === 'START',
  });

  /**
   * Handle touch events on game board
   */
  const handleBoardTouchStart = useCallback((e: React.TouchEvent) => {
    if (!touchState.isEnabled) return;
    
    const touch = e.touches[0];
    const element = e.currentTarget;
    
    // Create and dispatch native touch event to the hook
    const nativeEvent = new TouchEvent('touchstart', {
      touches: [touch],
      cancelable: true,
    });
    
    element.dispatchEvent(nativeEvent);
  }, [touchState.isEnabled]);

  /**
   * Check if device is mobile (less than 1024px)
   */
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="tetris-page" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a12 0%, #12121f 50%, #1a1a2e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: isMobile ? '8px' : '20px',
      fontFamily: "'Space Grotesk', 'DM Sans', sans-serif",
      overflow: 'hidden',
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: isMobile ? '8px' : '16px',
      }}>
        <h1 style={{
          fontSize: isMobile ? '1.5rem' : '2.5rem',
          fontWeight: 700,
          background: 'linear-gradient(135deg, #00f0ff, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          margin: 0,
          textShadow: '0 0 30px rgba(0, 240, 255, 0.3)',
        }}>
          TETRIS 3D
        </h1>
      </header>

      {/* Mobile Score Bar (compact) */}
      {isMobile && (
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          width: '100%',
          maxWidth: '400px',
          background: 'rgba(26, 26, 46, 0.8)',
          border: '1px solid rgba(0, 240, 255, 0.2)',
          borderRadius: '12px',
          padding: '8px 12px',
          marginBottom: '12px',
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Score</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#fff' }}>{score.score.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Level</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#00f0ff' }}>{score.level}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase' }}>Lines</div>
            <div style={{ fontSize: '16px', fontWeight: 600, color: '#a855f7' }}>{score.lines}</div>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <div style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: 'flex-start',
        gap: isMobile ? '12px' : '20px',
        width: '100%',
        maxWidth: isMobile ? '100%' : '1200px',
        justifyContent: 'center',
      }}>
        {/* Left Panel - Hold & Controls (hidden on mobile) */}
        {!isMobile && (
          <aside style={{
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {/* Hold Piece */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                color: '#94a3b8',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                letterSpacing: '1px',
              }}>Hold</h3>
              <div style={{
                width: '100%',
                height: '80px',
                background: 'rgba(0, 0, 0, 0.3)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <span style={{ color: '#666', fontSize: '12px' }}>Empty</span>
              </div>
            </div>

            {/* Controls Info */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                color: '#94a3b8',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                letterSpacing: '1px',
              }}>Controls</h3>
              <div style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: '1.8' }}>
                <div>← → Move</div>
                <div>↓ Soft Drop</div>
                <div>↑ Z/X Rotate</div>
                <div>Space Hard Drop</div>
                <div>C Hold</div>
                <div>P Pause</div>
              </div>
            </div>
          </aside>
        )}

        {/* Game Board */}
        <main style={{
          position: 'relative',
          flex: 'none',
        }}>
          {/* Game Board Container */}
          <div
            className="game-board"
            onTouchStart={handleBoardTouchStart}
            style={{
              width: isMobile ? '280px' : '300px',
              height: isMobile ? '448px' : '600px',
              background: 'rgba(10, 10, 18, 0.9)',
              border: '2px solid rgba(0, 240, 255, 0.3)',
              borderRadius: '8px',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 0 40px rgba(0, 240, 255, 0.1), inset 0 0 40px rgba(0, 0, 0, 0.5)',
              touchAction: 'none', // Prevent default touch behavior
            }}
          >
            {/* Grid Lines */}
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: isMobile ? '28px 22.4px' : '30px 30px',
              pointerEvents: 'none',
            }} />

            {/* Start Screen */}
            {gameState === 'START' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.85)',
                zIndex: 10,
              }}>
                <div style={{
                  fontSize: isMobile ? '18px' : '24px',
                  fontWeight: 600,
                  color: '#fff',
                  marginBottom: '16px',
                  textAlign: 'center',
                }}>
                  Ready to Play?
                </div>
                <div style={{
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#00f0ff',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}>
                  {isMobile ? 'Tap to Start' : 'Press SPACE to Start'}
                </div>
              </div>
            )}

            {/* Pause Overlay */}
            {gameState === 'PAUSED' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.85)',
                zIndex: 10,
              }}>
                <div style={{
                  fontSize: isMobile ? '24px' : '32px',
                  fontWeight: 700,
                  color: '#eab308',
                  letterSpacing: '4px',
                }}>
                  PAUSED
                </div>
                <div style={{
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#94a3b8',
                  marginTop: '16px',
                }}>
                  {isMobile ? 'Tap RESUME' : 'Press P to Resume'}
                </div>
              </div>
            )}

            {/* Game Over Overlay */}
            {gameState === 'GAME_OVER' && (
              <div style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.9)',
                zIndex: 10,
              }}>
                <div style={{
                  fontSize: isMobile ? '20px' : '28px',
                  fontWeight: 700,
                  color: '#ef4444',
                  marginBottom: '16px',
                }}>
                  GAME OVER
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '14px', color: '#94a3b8' }}>Final Score</div>
                  <div style={{ fontSize: isMobile ? '24px' : '32px', fontWeight: 700, color: '#fff' }}>
                    {score.score.toLocaleString()}
                  </div>
                  {score.score >= score.highScore && score.score > 0 && (
                    <div style={{ fontSize: '12px', color: '#22c55e', marginTop: '4px' }}>
                      New High Score!
                    </div>
                  )}
                </div>
                <div style={{
                  fontSize: isMobile ? '12px' : '14px',
                  color: '#00f0ff',
                  marginTop: '24px',
                  animation: 'pulse 1.5s ease-in-out infinite',
                }}>
                  {isMobile ? 'Tap to Restart' : 'Press SPACE to Restart'}
                </div>
              </div>
            )}
          </div>

          {/* Mobile Touch Controls */}
          {isMobile && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '12px',
              marginTop: '12px',
            }}>
              <TouchControls
                onAction={handleAction}
                enabled={true}
                isPaused={gameState === 'PAUSED'}
                canHold={canHold}
              />
            </div>
          )}

          {/* Mobile Gesture Hints */}
          {isMobile && gameState === 'PLAYING' && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '16px',
              marginTop: '8px',
              fontSize: '11px',
              color: '#64748b',
            }}>
              <span>← Swipe Move →</span>
              <span>• Tap Rotate</span>
              <span>↓ Swipe Drop</span>
            </div>
          )}
        </main>

        {/* Right Panel - Score & Next (hidden on mobile) */}
        {!isMobile && (
          <aside style={{
            width: '180px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}>
            {/* Score Board */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                color: '#94a3b8',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                letterSpacing: '1px',
              }}>Score</h3>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '24px', fontWeight: 700, color: '#fff' }}>
                  {score.score.toLocaleString()}
                </div>
                <div style={{ fontSize: '11px', color: '#64748b' }}>High: {score.highScore.toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>LEVEL</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#00f0ff' }}>{score.level}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '10px', color: '#94a3b8' }}>LINES</div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#a855f7' }}>{score.lines}</div>
                </div>
              </div>
            </div>

            {/* Next Pieces */}
            <div style={{
              background: 'rgba(26, 26, 46, 0.8)',
              border: '1px solid rgba(0, 240, 255, 0.2)',
              borderRadius: '12px',
              padding: '16px',
            }}>
              <h3 style={{
                fontSize: '14px',
                color: '#94a3b8',
                textTransform: 'uppercase',
                margin: '0 0 12px 0',
                letterSpacing: '1px',
              }}>Next</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{
                    width: '100%',
                    height: '48px',
                    background: 'rgba(0, 0, 0, 0.3)',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: '#666', fontSize: '10px' }}>?</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .touch-btn:active {
          transform: scale(0.95) !important;
        }
      `}</style>
    </div>
  );
}
