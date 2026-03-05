/**
 * Particle Effects Component
 * 
 * US-007: Line clearing, scoring, and particle effects
 * 
 * Renders particle explosions when lines are cleared
 */

'use client';

import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import type { Particle } from '../types/game';
import { updateParticles } from '../lib/gameLogic';

interface ParticlesProps {
  /** Array of particles to render */
  particles: Particle[];
  /** Callback when particles are updated */
  onParticlesUpdate: (particles: Particle[]) => void;
}

/**
 * Particle effect component for line clear explosions
 */
export function Particles({ particles, onParticlesUpdate }: ParticlesProps) {
  // Update particles each frame
  useFrame(() => {
    if (particles.length > 0) {
      const updated = updateParticles(particles);
      onParticlesUpdate(updated);
    }
  });

  // Create positions and colors for particles
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(particles.length * 3);
    const col = new Float32Array(particles.length * 3);

    particles.forEach((particle, i) => {
      pos[i * 3] = particle.x;
      pos[i * 3 + 1] = particle.y;
      pos[i * 3 + 2] = particle.z;

      // Parse hex color to RGB
      const hex = particle.color.replace('#', '');
      col[i * 3] = parseInt(hex.substring(0, 2), 16) / 255;
      col[i * 3 + 1] = parseInt(hex.substring(2, 4), 16) / 255;
      col[i * 3 + 2] = parseInt(hex.substring(4, 6), 16) / 255;
    });

    return { positions: pos, colors: col };
  }, [particles]);

  if (particles.length === 0) return null;

  return (
    <Points positions={positions}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
          args={[colors, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.15}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </Points>
  );
}

export default Particles;
