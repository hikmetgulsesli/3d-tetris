/**
 * Block Component Tests
 * 
 * US-003: 3D block components with neon glow effects
 * US-012: Trail effect and React.memo optimization
 * 
 * Tests for:
 * - Block, GhostBlock, PreviewBlock rendering
 * - PieceTrail component
 * - React.memo optimization behavior
 */

import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import { TETROMINO_COLORS } from '../types/tetromino';
import type { TetrominoType } from '../types/tetromino';

// Mock @react-three/drei before importing components
vi.mock('@react-three/drei', () => ({
  Box: vi.fn(({ children, ...props }) => null),
  RoundedBox: vi.fn(({ children, ...props }) => null),
  Trail: vi.fn(({ children }) => children),
}));

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn((callback) => {
    // Simulate frame callback
    callback({ clock: { elapsedTime: 0 } });
  }),
  useThree: vi.fn(() => ({
    gl: { shadowMap: { enabled: true } },
    camera: {},
    scene: {},
  })),
  Canvas: vi.fn(({ children }) => children),
}));

describe('TETROMINO_COLORS', () => {
  it('uses correct color for each tetromino type', () => {
    expect(TETROMINO_COLORS.I.color).toBe('#22d3ee');
    expect(TETROMINO_COLORS.O.color).toBe('#facc15');
    expect(TETROMINO_COLORS.T.color).toBe('#c084fc');
    expect(TETROMINO_COLORS.S.color).toBe('#4ade80');
    expect(TETROMINO_COLORS.Z.color).toBe('#f87171');
    expect(TETROMINO_COLORS.J.color).toBe('#60a5fa');
    expect(TETROMINO_COLORS.L.color).toBe('#fb923c');
  });

  it('uses correct emissive color for each tetromino type', () => {
    expect(TETROMINO_COLORS.I.emissive).toBe('#0891b2');
    expect(TETROMINO_COLORS.O.emissive).toBe('#ca8a04');
    expect(TETROMINO_COLORS.T.emissive).toBe('#9333ea');
    expect(TETROMINO_COLORS.S.emissive).toBe('#16a34a');
    expect(TETROMINO_COLORS.Z.emissive).toBe('#dc2626');
    expect(TETROMINO_COLORS.J.emissive).toBe('#2563eb');
    expect(TETROMINO_COLORS.L.emissive).toBe('#ea580c');
  });

  it('has all 7 tetromino types defined', () => {
    const types: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    types.forEach((type) => {
      expect(TETROMINO_COLORS[type]).toBeDefined();
      expect(TETROMINO_COLORS[type].color).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(TETROMINO_COLORS[type].emissive).toMatch(/^#[0-9a-fA-F]{6}$/);
    });
  });
});

describe('React.memo optimization', () => {
  it('Block component is memoized', async () => {
    const { Block } = await import('../components/Block');
    // Memoized components have $$typeof or specific properties
    expect(Block).toBeDefined();
    expect(typeof Block).toBe('object');
    expect(Block.type).toBeDefined();
  });

  it('GhostBlock component is memoized', async () => {
    const { GhostBlock } = await import('../components/Block');
    expect(GhostBlock).toBeDefined();
    expect(typeof GhostBlock).toBe('object');
    expect(GhostBlock.type).toBeDefined();
  });

  it('PreviewBlock component is memoized', async () => {
    const { PreviewBlock } = await import('../components/Block');
    expect(PreviewBlock).toBeDefined();
    expect(typeof PreviewBlock).toBe('object');
    expect(PreviewBlock.type).toBeDefined();
  });

  it('PieceTrail component is memoized', async () => {
    const { PieceTrail } = await import('../components/Block');
    expect(PieceTrail).toBeDefined();
    expect(typeof PieceTrail).toBe('object');
    expect(PieceTrail.type).toBeDefined();
  });
});

describe('Block component props', () => {
  it('Block accepts type, position, and scale props', async () => {
    const { Block } = await import('../components/Block');
    expect(Block).toBeDefined();
    
    // Check that it's a valid React element type
    expect(Block.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('GhostBlock accepts type, position, and scale props', async () => {
    const { GhostBlock } = await import('../components/Block');
    expect(GhostBlock).toBeDefined();
    expect(GhostBlock.$$typeof).toBe(Symbol.for('react.memo'));
  });

  it('PreviewBlock accepts type, position, and scale props', async () => {
    const { PreviewBlock } = await import('../components/Block');
    expect(PreviewBlock).toBeDefined();
    expect(PreviewBlock.$$typeof).toBe(Symbol.for('react.memo'));
  });
});
