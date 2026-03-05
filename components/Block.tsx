/**
 * 3D Block Components
 * 
 * US-008: 3D block rendering with ghost piece and preview support
 */

'use client';


import { RoundedBox } from '@react-three/drei';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINO_COLORS } from '../types/tetromino';

interface BlockProps {
  /** Position in 3D space */
  position: [number, number, number];
  /** Tetromino type for color */
  type: TetrominoType;
  /** Optional scale (default: 1) */
  scale?: number;
}

/**
 * Standard 3D block for locked pieces and current piece
 */
export function Block({ position, type, scale = 1 }: BlockProps) {
  const colors = TETROMINO_COLORS[type];
  
  return (
    <RoundedBox
      position={position}
      args={[0.95 * scale, 0.95 * scale, 0.95 * scale]}
      radius={0.1 * scale}
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

/**
 * Ghost block - semi-transparent outline showing where piece will land
 */
export function GhostBlock({ position, type, scale = 1 }: BlockProps) {
  const colors = TETROMINO_COLORS[type];
  
  return (
    <RoundedBox
      position={position}
      args={[0.95 * scale, 0.95 * scale, 0.95 * scale]}
      radius={0.1 * scale}
      smoothness={4}
    >
      <meshStandardMaterial
        color={colors.color}
        transparent
        opacity={0.25}
        emissive={colors.emissive}
        emissiveIntensity={0.1}
        roughness={0.5}
        metalness={0}
        wireframe={false}
      />
    </RoundedBox>
  );
}

/**
 * Preview block - smaller block for next/hold piece displays
 */
export function PreviewBlock({ position, type, scale = 0.6 }: BlockProps) {
  const colors = TETROMINO_COLORS[type];
  
  return (
    <RoundedBox
      position={position}
      args={[0.95 * scale, 0.95 * scale, 0.95 * scale]}
      radius={0.1 * scale}
      smoothness={4}
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

/**
 * Get block positions for a tetromino at a given position
 */
export function getBlockPositions(
  type: TetrominoType,
  rotation: number,
  position: { x: number; y: number }
): { x: number; y: number }[] {
  const cells = getTetrominoCells(type, rotation);
  
  return cells.map(([dx, dy]) => ({
    x: position.x + dx,
    y: position.y + dy,
  }));
}

/**
 * Get cells for a tetromino type and rotation
 * This avoids dynamic require
 */
function getTetrominoCells(type: TetrominoType, rotation: number): [number, number][] {
  // Import from tetrominos module statically
  const rotations: Record<TetrominoType, [number, number][][]> = {
    I: [
      [[0, 1], [1, 1], [2, 1], [3, 1]],
      [[2, 0], [2, 1], [2, 2], [2, 3]],
      [[0, 2], [1, 2], [2, 2], [3, 2]],
      [[1, 0], [1, 1], [1, 2], [1, 3]],
    ],
    O: [
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]],
    ],
    T: [
      [[0, 1], [1, 1], [2, 1], [1, 0]],
      [[1, 0], [1, 1], [1, 2], [0, 1]],
      [[0, 1], [1, 1], [2, 1], [1, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 1]],
    ],
    S: [
      [[0, 1], [1, 1], [1, 0], [2, 0]],
      [[1, 0], [1, 1], [0, 1], [0, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[2, 0], [2, 1], [1, 1], [1, 2]],
    ],
    Z: [
      [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [0, 1], [0, 2]],
      [[0, 1], [1, 1], [1, 2], [2, 2]],
      [[2, 0], [2, 1], [1, 1], [1, 2]],
    ],
    J: [
      [[0, 0], [0, 1], [1, 1], [2, 1]],
      [[1, 0], [1, 1], [1, 2], [0, 2]],
      [[0, 1], [1, 1], [2, 1], [2, 2]],
      [[2, 0], [1, 0], [1, 1], [1, 2]],
    ],
    L: [
      [[2, 0], [0, 1], [1, 1], [2, 1]],
      [[0, 0], [1, 0], [1, 1], [1, 2]],
      [[0, 1], [1, 1], [2, 1], [0, 2]],
      [[1, 0], [1, 1], [1, 2], [2, 2]],
    ],
  };
  
  return rotations[type][rotation % 4];
}
