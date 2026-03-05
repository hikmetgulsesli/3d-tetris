/**
 * 3D Block Component
 * 
 * US-003: Tetromino definitions and 3D block component
 */

'use client';

import React from 'react';
import { RoundedBox } from '@react-three/drei';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINO_COLORS } from '../types/tetromino';

interface BlockProps {
  type: TetrominoType;
  position: [number, number, number];
  size?: number;
}

/**
 * 3D Block component for active tetromino pieces
 */
export function Block({ type, position, size = 1 }: BlockProps) {
  const colors = TETROMINO_COLORS[type];

  return (
    <RoundedBox
      position={position}
      args={[size * 0.95, size * 0.95, size * 0.95]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial
        color={colors.color}
        emissive={colors.emissive}
        emissiveIntensity={0.3}
        roughness={0.2}
        metalness={0.1}
      />
    </RoundedBox>
  );
}

interface GhostBlockProps {
  position: [number, number, number];
  size?: number;
}

/**
 * Ghost block showing where piece will land
 */
export function GhostBlock({ position, size = 1 }: GhostBlockProps) {
  return (
    <RoundedBox
      position={position}
      args={[size * 0.95, size * 0.95, size * 0.95]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.2}
        roughness={0.5}
      />
    </RoundedBox>
  );
}

interface PreviewBlockProps {
  type: TetrominoType;
  position?: [number, number, number];
  size?: number;
}

/**
 * Smaller preview block for next/hold pieces
 */
export function PreviewBlock({ type, position = [0, 0, 0], size = 0.5 }: PreviewBlockProps) {
  const colors = TETROMINO_COLORS[type];

  return (
    <RoundedBox
      position={position}
      args={[size * 0.9, size * 0.9, size * 0.9]}
      radius={0.02}
      smoothness={2}
    >
      <meshStandardMaterial
        color={colors.color}
        emissive={colors.emissive}
        emissiveIntensity={0.4}
        roughness={0.2}
        metalness={0.1}
      />
    </RoundedBox>
  );
}


