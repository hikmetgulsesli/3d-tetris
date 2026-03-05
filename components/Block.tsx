/**
 * Block Components
 * 
 * US-003: 3D Block components
 * Placeholder implementation - full 3D blocks will be implemented in future stories
 */

import React from 'react';
import type { TetrominoType } from '../types/tetromino';

interface BlockProps {
  type: TetrominoType;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  position?: [number, number, number];
}

/**
 * 3D Block Component
 * Placeholder for the actual 3D block implementation
 */
export function Block({ type }: BlockProps) {
  return (
    <div 
      data-testid={`block-${type}`}
      style={{
        width: 'var(--block-size)',
        height: 'var(--block-size)',
        background: `var(--tetromino-${type.toLowerCase()})`,
        borderRadius: 'var(--radius-sm)',
      }}
    />
  );
}

/**
 * Ghost Block Component
 * Shows where the piece will land
 */
export function GhostBlock({ type }: BlockProps) {
  return (
    <div 
      data-testid={`ghost-block-${type}`}
      style={{
        width: 'var(--block-size)',
        height: 'var(--block-size)',
        background: 'transparent',
        border: `2px dashed var(--tetromino-${type.toLowerCase()})`,
        borderRadius: 'var(--radius-sm)',
        opacity: 0.5,
      }}
    />
  );
}

/**
 * Preview Block Component
 * For showing next pieces and hold piece
 */
export function PreviewBlock({ type }: { type: TetrominoType }) {
  return (
    <div 
      data-testid={`preview-block-${type}`}
      style={{
        width: 'calc(var(--block-size) * 2)',
        height: 'calc(var(--block-size) * 2)',
        background: `var(--tetromino-${type.toLowerCase()})`,
        borderRadius: 'var(--radius-md)',
        opacity: 0.8,
      }}
    />
  );
}

export default Block;
