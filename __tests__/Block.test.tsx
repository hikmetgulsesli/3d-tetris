/**
 * Block Component Tests
 * 
 * Tests for 3D Block component rendering
 */

import { describe, it, expect, vi } from 'vitest';
import { TETROMINO_COLORS } from '../types/tetromino';
import type { TetrominoType } from '../types/tetromino';

// Mock @react-three/drei before importing components
vi.mock('@react-three/drei', () => ({
  Box: vi.fn(({ children, ...props }) => null),
  RoundedBox: vi.fn(({ children, ...props }) => null),
}));

// Mock @react-three/fiber
vi.mock('@react-three/fiber', () => ({
  useFrame: vi.fn(),
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
