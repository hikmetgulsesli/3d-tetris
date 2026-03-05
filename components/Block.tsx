/**
 * 3D Block Component
 * 
 * US-003: Reusable 3D Block using @react-three/drei Box
 * Features: beveled edges, glow materials, neon colors
 */

'use client';

import React from 'react';
import { Box, RoundedBox } from '@react-three/drei';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINO_COLORS } from '../types/tetromino';

interface BlockProps {
  /** Tetromino type for color */
  type: TetrominoType;
  /** X position on the board */
  x: number;
  /** Y position on the board */
  y: number;
  /** Z position (for layering) */
  z?: number;
  /** Block size (default: 1) */
  size?: number;
  /** Whether to use rounded/beveled edges */
  beveled?: boolean;
  /** Glow intensity (default: 0.5) */
  glowIntensity?: number;
}

/**
 * 3D Block Component
 * 
 * Renders a single tetromino block with:
 * - Neon color based on tetromino type
 * - Emissive glow effect
 * - Optional beveled/rounded edges for visual polish
 */
export function Block({
  type,
  x,
  y,
  z = 0,
  size = 1,
  beveled = true,
  glowIntensity = 0.5,
}: BlockProps): React.ReactElement {
  const colors = TETROMINO_COLORS[type];
  
  // Calculate position (center the block on the grid cell)
  const position: [number, number, number] = [
    x * size,
    y * size,
    z * size,
  ];

  // Material properties with glow
  const materialProps = {
    color: colors.color,
    emissive: colors.emissive,
    emissiveIntensity: glowIntensity,
    roughness: 0.2,
    metalness: 0.1,
  };

  if (beveled) {
    return (
      <RoundedBox
        position={position}
        args={[size * 0.95, size * 0.95, size * 0.95]}
        radius={size * 0.1}
        smoothness={4}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial {...materialProps} />
      </RoundedBox>
    );
  }

  return (
    <Box
      position={position}
      args={[size * 0.95, size * 0.95, size * 0.95]}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial {...materialProps} />
    </Box>
  );
}

/**
 * Ghost Block Component
 * 
 * Renders a semi-transparent block showing where a piece will land
 */
export function GhostBlock({
  type,
  x,
  y,
  z = 0,
  size = 1,
}: Omit<BlockProps, 'beveled' | 'glowIntensity'>): React.ReactElement {
  const colors = TETROMINO_COLORS[type];
  const position: [number, number, number] = [
    x * size,
    y * size,
    z * size,
  ];

  return (
    <Box
      position={position}
      args={[size * 0.9, size * 0.9, size * 0.9]}
    >
      <meshStandardMaterial
        color={colors.color}
        transparent
        opacity={0.3}
        emissive={colors.emissive}
        emissiveIntensity={0.2}
      />
    </Box>
  );
}

/**
 * Preview Block Component
 * 
 * Renders a smaller block for next piece preview
 */
export function PreviewBlock({
  type,
  x,
  y,
  z = 0,
  size = 0.5,
}: Omit<BlockProps, 'beveled' | 'glowIntensity'>): React.ReactElement {
  return (
    <Block
      type={type}
      x={x}
      y={y}
      z={z}
      size={size}
      beveled={true}
      glowIntensity={0.3}
    />
  );
}

export default Block;
