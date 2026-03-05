/**
 * 3D Block Components
 * 
 * US-003: 3D block components with neon glow effects
 * US-012: Trail effect and React.memo optimization
 * 
 * Features:
 * - Block: Main 3D tetromino block with glow effect
 * - GhostBlock: Semi-transparent preview of where piece will land
 * - PreviewBlock: Smaller block for next/hold piece displays
 * - Trail: Motion trail effect for falling pieces
 */

'use client';

import React, { memo, useRef } from 'react';
import { RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINO_COLORS } from '../types/tetromino';

// Common block props
interface BlockProps {
  type: TetrominoType;
  position?: [number, number, number];
  scale?: number;
}

/**
 * Main 3D block component with neon glow effect
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const Block = memo(function Block({ 
  type, 
  position = [0, 0, 0],
  scale = 1,
}: BlockProps) {
  const colors = TETROMINO_COLORS[type];
  
  return (
    <RoundedBox
      position={position}
      scale={[scale, scale, scale]}
      radius={0.05}
      smoothness={4}
      castShadow
      receiveShadow
    >
      <meshStandardMaterial
        color={colors.color}
        emissive={colors.emissive}
        emissiveIntensity={0.5}
        roughness={0.2}
        metalness={0.8}
      />
    </RoundedBox>
  );
});

/**
 * Ghost block for previewing where piece will land
 * Semi-transparent with subtle glow
 */
export const GhostBlock = memo(function GhostBlock({ 
  type, 
  position = [0, 0, 0],
  scale = 1,
}: BlockProps) {
  const colors = TETROMINO_COLORS[type];
  
  return (
    <RoundedBox
      position={position}
      scale={[scale, scale, scale]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial
        color={colors.color}
        transparent
        opacity={0.25}
        emissive={colors.emissive}
        emissiveIntensity={0.2}
      />
    </RoundedBox>
  );
});

/**
 * Smaller preview block for next/hold piece displays
 */
export const PreviewBlock = memo(function PreviewBlock({ 
  type, 
  position = [0, 0, 0],
  scale = 0.8,
}: BlockProps) {
  const colors = TETROMINO_COLORS[type];
  
  return (
    <RoundedBox
      position={position}
      scale={[scale, scale, scale]}
      radius={0.05}
      smoothness={4}
    >
      <meshStandardMaterial
        color={colors.color}
        emissive={colors.emissive}
        emissiveIntensity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </RoundedBox>
  );
});

/**
 * Trail component that renders behind falling pieces
 * Uses Drei Trail for smooth motion trails
 */
export interface TrailProps {
  /** Children to render with trail effect */
  children: React.ReactNode;
  /** Trail color */
  color?: string;
  /** Trail width */
  width?: number;
  /** Trail length (number of frames to keep) */
  length?: number;
  /** Trail decay rate */
  decay?: number;
  /** Trail attenuation */
  attenuation?: number;
}

/**
 * Trail effect for falling pieces
 * Renders a glowing trail behind moving pieces
 */
export const PieceTrail = memo(function PieceTrail({
  children,
  color = '#00f0ff',
  width = 0.5,
}: TrailProps) {
  const ref = useRef<THREE.Group>(null);
  
  // Animate trail visibility
  useFrame((state) => {
    if (ref.current) {
      // Subtle pulsing effect on trail intensity
      const intensity = 0.5 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      ref.current.userData.intensity = intensity;
    }
  });

  // Simplified trail using custom geometry
  // Full Trail component from Drei can be heavy, so we use a lighter approach
  return (
    <group ref={ref}>
      {/* Render multiple faded copies for trail effect */}
      {Array.from({ length: 4 }).map((_, i) => (
        <group 
          key={i}
          position={[0, -i * 0.15, 0]}
          scale={[1 - i * 0.1, 1 - i * 0.1, 1 - i * 0.1]}
        >
          <mesh>
            <boxGeometry args={[width * (1 - i * 0.2), 0.1, width * (1 - i * 0.2)]} />
            <meshBasicMaterial 
              color={color} 
              transparent 
              opacity={0.15 - i * 0.03}
            />
          </mesh>
        </group>
      ))}
      {children}
    </group>
  );
});

export default Block;
