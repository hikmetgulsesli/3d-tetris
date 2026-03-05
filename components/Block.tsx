/**
 * Block Components
 * 
 * US-003: Tetromino definitions and 3D block component
 * Stub implementation for build compatibility
 */

'use client';

import React from 'react';

interface BlockProps {
  color?: string;
  emissive?: string;
  size?: number;
}

export function Block({ color = '#22d3ee', emissive = '#0891b2', size = 30 }: BlockProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        boxShadow: `0 0 10px ${emissive}`,
        borderRadius: 4,
      }}
    />
  );
}

export function GhostBlock({ size = 30 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px dashed rgba(255, 255, 255, 0.3)',
        borderRadius: 4,
      }}
    />
  );
}

export function PreviewBlock({ color = '#22d3ee', size = 20 }: BlockProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: 2,
      }}
    />
  );
}
