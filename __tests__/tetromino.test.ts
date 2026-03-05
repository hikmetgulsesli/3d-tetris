/**
 * Tetromino Tests
 * 
 * Tests for tetromino definitions and rotations
 */

import { describe, it, expect } from 'vitest';
import {
  TETROMINOS,
  getAllTetrominoTypes,
  getRandomTetrominoType,
  getSpawnOffset,
} from '../lib/tetrominos';
import type { TetrominoType, Rotation } from '../types/tetromino';

describe('TETROMINOS', () => {
  describe('All 7 tetromino types exist', () => {
    const expectedTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    
    expectedTypes.forEach((type) => {
      it(`should have ${type} piece defined`, () => {
        expect(TETROMINOS[type]).toBeDefined();
        expect(TETROMINOS[type].type).toBe(type);
      });
    });
  });

  describe('Each tetromino has correct properties', () => {
    it('should have color and emissive properties', () => {
      Object.values(TETROMINOS).forEach((piece) => {
        expect(piece.color).toBeDefined();
        expect(piece.emissive).toBeDefined();
        expect(piece.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(piece.emissive).toMatch(/^#[0-9a-fA-F]{6}$/);
      });
    });

    it('should have exactly 4 rotation states', () => {
      Object.values(TETROMINOS).forEach((piece) => {
        expect(piece.rotations).toHaveLength(4);
      });
    });

    it('should have exactly 4 cells per rotation', () => {
      Object.values(TETROMINOS).forEach((piece) => {
        piece.rotations.forEach((rotation) => {
          expect(rotation).toHaveLength(4);
          rotation.forEach((cell) => {
            expect(cell).toHaveLength(2);
            expect(typeof cell[0]).toBe('number');
            expect(typeof cell[1]).toBe('number');
          });
        });
      });
    });
  });

  describe('Tetromino colors are correct', () => {
    it('I-piece should be cyan (#22d3ee)', () => {
      expect(TETROMINOS.I.color).toBe('#22d3ee');
      expect(TETROMINOS.I.emissive).toBe('#0891b2');
    });

    it('O-piece should be yellow (#facc15)', () => {
      expect(TETROMINOS.O.color).toBe('#facc15');
      expect(TETROMINOS.O.emissive).toBe('#ca8a04');
    });

    it('T-piece should be purple (#c084fc)', () => {
      expect(TETROMINOS.T.color).toBe('#c084fc');
      expect(TETROMINOS.T.emissive).toBe('#9333ea');
    });

    it('S-piece should be green (#4ade80)', () => {
      expect(TETROMINOS.S.color).toBe('#4ade80');
      expect(TETROMINOS.S.emissive).toBe('#16a34a');
    });

    it('Z-piece should be red (#f87171)', () => {
      expect(TETROMINOS.Z.color).toBe('#f87171');
      expect(TETROMINOS.Z.emissive).toBe('#dc2626');
    });

    it('J-piece should be blue (#60a5fa)', () => {
      expect(TETROMINOS.J.color).toBe('#60a5fa');
      expect(TETROMINOS.J.emissive).toBe('#2563eb');
    });

    it('L-piece should be orange (#fb923c)', () => {
      expect(TETROMINOS.L.color).toBe('#fb923c');
      expect(TETROMINOS.L.emissive).toBe('#ea580c');
    });
  });

  describe('Rotation states are valid', () => {
    const rotations: Rotation[] = [0, 1, 2, 3];

    Object.values(TETROMINOS).forEach((piece) => {
      describe(`${piece.type}-piece rotations`, () => {
        rotations.forEach((rotation) => {
          it(`rotation ${rotation} should have 4 cells`, () => {
            const cells = piece.rotations[rotation];
            expect(cells).toHaveLength(4);
          });
        });
      });
    });
  });

  describe('O-piece special case', () => {
    it('should have the same rotation for all states', () => {
      const oPiece = TETROMINOS.O;
      const firstRotation = JSON.stringify(oPiece.rotations[0]);
      
      for (let i = 1; i < 4; i++) {
        expect(JSON.stringify(oPiece.rotations[i])).toBe(firstRotation);
      }
    });
  });
});

describe('getAllTetrominoTypes', () => {
  it('should return all 7 tetromino types', () => {
    const types = getAllTetrominoTypes();
    expect(types).toHaveLength(7);
    expect(types.sort()).toEqual(['I', 'J', 'L', 'O', 'S', 'T', 'Z']);
  });
});

describe('getRandomTetrominoType', () => {
  it('should return a valid tetromino type', () => {
    const type = getRandomTetrominoType();
    const allTypes = getAllTetrominoTypes();
    expect(allTypes).toContain(type);
  });

  it('should return different types over multiple calls (probabilistic)', () => {
    const types = new Set<TetrominoType>();
    for (let i = 0; i < 20; i++) {
      types.add(getRandomTetrominoType());
    }
    // Over 20 calls, we should get at least 3 different types (high probability)
    expect(types.size).toBeGreaterThanOrEqual(3);
  });
});

describe('getSpawnOffset', () => {
  it('should return spawn offset for all piece types', () => {
    const allTypes = getAllTetrominoTypes();
    allTypes.forEach((type) => {
      const offset = getSpawnOffset(type);
      expect(offset).toHaveProperty('x');
      expect(offset).toHaveProperty('y');
      expect(typeof offset.x).toBe('number');
      expect(typeof offset.y).toBe('number');
    });
  });

  it('should have y=0 for all pieces', () => {
    const allTypes = getAllTetrominoTypes();
    allTypes.forEach((type) => {
      const offset = getSpawnOffset(type);
      expect(offset.y).toBe(0);
    });
  });

  it('O-piece should have x=4', () => {
    expect(getSpawnOffset('O').x).toBe(4);
  });

  it('I-piece should have x=3', () => {
    expect(getSpawnOffset('I').x).toBe(3);
  });
});
