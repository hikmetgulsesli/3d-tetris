/**
 * UI Panel Components for 3D Tetris
 * US-009: UI panels - Score, controls, and game status
 */

import React from 'react';
import { TetrominoType } from '../types/tetromino';

// Tetromino shapes for preview (4x4 grid representation)
const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  T: [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  S: [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [1, 1, 0, 0],
    [0, 0, 0, 0],
  ],
  Z: [
    [0, 0, 0, 0],
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [0, 0, 0, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
  L: [
    [0, 0, 0, 0],
    [0, 0, 1, 0],
    [1, 1, 1, 0],
    [0, 0, 0, 0],
  ],
};

// CSS color mapping
const TETROMINO_CSS_COLORS: Record<TetrominoType, string> = {
  I: 'var(--tetromino-i)',
  O: 'var(--tetromino-o)',
  T: 'var(--tetromino-t)',
  S: 'var(--tetromino-s)',
  Z: 'var(--tetromino-z)',
  J: 'var(--tetromino-j)',
  L: 'var(--tetromino-l)',
};

interface PiecePreviewProps {
  type: TetrominoType;
  size?: 'small' | 'medium' | 'large';
}

export function PiecePreview({ type, size = 'medium' }: PiecePreviewProps) {
  const shape = TETROMINO_SHAPES[type];
  const color = TETROMINO_CSS_COLORS[type];
  
  const blockSize = size === 'small' ? 14 : size === 'large' ? 22 : 18;
  const gap = size === 'small' ? 1 : 2;
  
  return (
    <div
      className="piece-preview"
      data-testid={`piece-preview-${type}`}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(4, ${blockSize}px)`,
        gap: `${gap}px`,
      }}
    >
      {shape.flat().map((cell, index) => {
        const isFilled = cell === 1;
        
        return (
          <div
            key={index}
            style={{
              width: blockSize,
              height: blockSize,
              borderRadius: 3,
              backgroundColor: isFilled ? color : 'transparent',
              boxShadow: isFilled ? `inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 10px ${color}` : 'none',
            }}
          />
        );
      })}
    </div>
  );
}

interface HoldPiecePanelProps {
  piece: TetrominoType | null;
}

export function HoldPiecePanel({ piece }: HoldPiecePanelProps) {
  return (
    <div className="panel" data-testid="hold-piece-panel">
      <div className="panel-title">Hold Piece (C)</div>
      <div
        className="hold-piece-preview"
        style={{
          width: 100,
          height: 100,
          background: 'rgba(0,0,0,0.3)',
          borderRadius: 8,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {piece ? (
          <PiecePreview type={piece} size="large" />
        ) : (
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.75rem' }}>
            Empty
          </span>
        )}
      </div>
    </div>
  );
}

interface ControlItemProps {
  action: string;
  keys: string | string[];
}

function ControlItem({ action, keys }: ControlItemProps) {
  const keyArray = Array.isArray(keys) ? keys : [keys];
  
  return (
    <div
      className="control-item"
      data-testid={`control-${action.toLowerCase().replace(/\s+/g, '-')}`}
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0.5rem 0',
        fontSize: 'var(--text-sm)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span style={{ color: 'var(--color-text-secondary)' }}>{action}</span>
      <span>
        {keyArray.map((key, index) => (
          <kbd
            key={index}
            className="key"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: 28,
              height: 24,
              padding: '0 0.5rem',
              background: 'var(--color-bg-card)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 4,
              fontFamily: 'var(--font-heading)',
              fontSize: '0.75rem',
              color: 'var(--color-text-primary)',
              marginLeft: index > 0 ? 4 : 0,
            }}
          >
            {key}
          </kbd>
        ))}
      </span>
    </div>
  );
}

export function ControlsPanel() {
  return (
    <div className="panel" data-testid="controls-panel">
      <div className="panel-title">Controls</div>
      <ControlItem action="Move" keys={['←', '→']} />
      <ControlItem action="Rotate" keys="↑" />
      <ControlItem action="Soft Drop" keys="↓" />
      <ControlItem action="Hard Drop" keys="SPACE" />
      <ControlItem action="Hold" keys="C" />
      <ControlItem action="Pause" keys="P" />
    </div>
  );
}

interface ScorePanelProps {
  score: number;
  level: number;
  lines: number;
  combo: number;
  highScore: number;
}

export function ScorePanel({ score, level, lines, combo, highScore }: ScorePanelProps) {
  return (
    <div className="panel" data-testid="score-panel">
      <div className="panel-title">Score</div>
      <div
        className="score-value"
        style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'var(--text-xl)',
          fontWeight: 700,
          color: 'var(--color-accent-cyan)',
          textShadow: '0 0 20px rgba(0, 240, 255, 0.3)',
          textAlign: 'center',
          fontVariantNumeric: 'tabular-nums',
        }}
        data-testid="score-value"
      >
        {score.toLocaleString()}
      </div>
      
      <StatRow label="Level" value={level.toString()} />
      <StatRow label="Lines" value={lines.toString()} />
      <StatRow 
        label="Combo" 
        value={`×${combo}`}
        valueColor={combo > 1 ? 'var(--color-accent-green)' : undefined}
      />
      
      <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="panel-title" style={{ marginBottom: '0.5rem' }}>High Score</div>
        <div
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'var(--text-lg)',
            fontWeight: 700,
            color: 'var(--color-accent-yellow)',
            textAlign: 'center',
            fontVariantNumeric: 'tabular-nums',
          }}
          data-testid="high-score-value"
        >
          {highScore.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

interface StatRowProps {
  label: string;
  value: string;
  valueColor?: string;
}

function StatRow({ label, value, valueColor }: StatRowProps) {
  return (
    <div
      className="stat-row"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: '0.75rem',
        paddingTop: '0.75rem',
        borderTop: '1px solid rgba(255,255,255,0.05)',
      }}
    >
      <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)' }}>
        {label}
      </span>
      <span
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 600,
          color: valueColor || 'var(--color-text-primary)',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </span>
    </div>
  );
}

interface NextPiecesPanelProps {
  pieces: TetrominoType[];
}

export function NextPiecesPanel({ pieces }: NextPiecesPanelProps) {
  return (
    <div className="panel" data-testid="next-pieces-panel">
      <div className="panel-title">Next Pieces</div>
      <div
        className="next-list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
        }}
      >
        {pieces.slice(0, 3).map((piece, index) => (
          <div
            key={index}
            className="next-item"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
            data-testid={`next-piece-${index}`}
          >
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.7rem',
                color: 'var(--color-text-secondary)',
                width: 20,
              }}
            >
              {index + 1}
            </span>
            <PiecePreview type={piece} size="small" />
          </div>
        ))}
        {pieces.length === 0 && (
          <span style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem' }}>
            No pieces queued
          </span>
        )}
      </div>
    </div>
  );
}

interface GameActionsPanelProps {
  gameState: 'start' | 'playing' | 'paused' | 'gameover';
  onStart: () => void;
  onPause: () => void;
  onRestart: () => void;
}

export function GameActionsPanel({ gameState, onStart, onPause, onRestart }: GameActionsPanelProps) {
  return (
    <div
      className="game-actions"
      style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '1.5rem',
        justifyContent: 'center',
      }}
      data-testid="game-actions"
    >
      {gameState === 'start' && (
        <button
          className="btn btn-primary"
          onClick={onStart}
          data-testid="start-button"
        >
          START
        </button>
      )}
      
      {gameState === 'playing' && (
        <button
          className="btn btn-secondary"
          onClick={onPause}
          data-testid="pause-button"
        >
          PAUSE
        </button>
      )}
      
      {(gameState === 'paused' || gameState === 'gameover') && (
        <>
          <button
            className="btn btn-primary"
            onClick={gameState === 'paused' ? onStart : onRestart}
            data-testid="resume-button"
          >
            {gameState === 'paused' ? 'RESUME' : 'RESTART'}
          </button>
          {gameState === 'paused' && (
            <button
              className="btn btn-secondary"
              onClick={onRestart}
              data-testid="restart-button"
            >
              RESTART
            </button>
          )}
        </>
      )}
    </div>
  );
}
