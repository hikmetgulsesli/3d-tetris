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
        width: '30px',
        height: '30px',
        background: `var(--tetromino-${type.toLowerCase()})`,
        borderRadius: '4px',
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
        width: '30px',
        height: '30px',
        background: 'transparent',
        border: `2px dashed var(--tetromino-${type.toLowerCase()})`,
        borderRadius: '4px',
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
        width: '60px',
        height: '60px',
        background: `var(--tetromino-${type.toLowerCase()})`,
        borderRadius: '8px',
        opacity: 0.8,
      }}
    />
  );
}

export default Block;
