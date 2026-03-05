/**
 * Sound Effects Tests
 * 
 * US-012: Sound effects and final polish
 * 
 * Tests for:
 * - Web Audio API synthesis
 * - Line clear, Tetris, Game Over, Lock, Rotate sounds
 * - Mute toggle functionality
 * - localStorage persistence
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useSoundEffects } from '../hooks/useSoundEffects';

describe('useSoundEffects', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should initialize with sound enabled by default', () => {
    const { result } = renderHook(() => useSoundEffects());
    expect(result.current.enabled).toBe(true);
  });

  it('should initialize with sound disabled when specified', () => {
    const { result } = renderHook(() => useSoundEffects({ enabled: false }));
    expect(result.current.enabled).toBe(false);
  });

  it('should toggle sound on/off', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.enabled).toBe(true);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.enabled).toBe(false);
    
    act(() => {
      result.current.toggle();
    });
    
    expect(result.current.enabled).toBe(true);
  });

  it('should mute sound', () => {
    const { result } = renderHook(() => useSoundEffects({ enabled: true }));
    
    act(() => {
      result.current.mute();
    });
    
    expect(result.current.enabled).toBe(false);
  });

  it('should unmute sound', () => {
    const { result } = renderHook(() => useSoundEffects({ enabled: false }));
    
    act(() => {
      result.current.unmute();
    });
    
    expect(result.current.enabled).toBe(true);
  });

  it('should persist mute preference to localStorage', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    act(() => {
      result.current.mute();
    });
    
    expect(localStorage.getItem('tetris-mute')).toBe('true');
    
    act(() => {
      result.current.unmute();
    });
    
    expect(localStorage.getItem('tetris-mute')).toBe('false');
  });

  it('should load saved mute preference from localStorage', () => {
    localStorage.setItem('tetris-mute', 'true');
    
    const { result } = renderHook(() => useSoundEffects());
    
    expect(result.current.enabled).toBe(false);
  });

  it('should not throw when playing sounds when muted', () => {
    const { result } = renderHook(() => useSoundEffects({ enabled: false }));
    
    expect(() => {
      act(() => {
        result.current.play('LINE_CLEAR');
      });
    }).not.toThrow();
  });

  it('should not throw when initializing AudioContext on first play', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(() => {
      act(() => {
        result.current.play('LINE_CLEAR');
      });
    }).not.toThrow();
  });

  it('should not throw when playing LINE_CLEAR sound', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(() => {
      act(() => {
        result.current.play('LINE_CLEAR');
      });
    }).not.toThrow();
  });

  it('should not throw when playing TETRIS sound', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(() => {
      act(() => {
        result.current.play('TETRIS');
      });
    }).not.toThrow();
  });

  it('should not throw when playing GAME_OVER sound', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(() => {
      act(() => {
        result.current.play('GAME_OVER');
      });
    }).not.toThrow();
  });

  it('should not throw when playing LOCK sound', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(() => {
      act(() => {
        result.current.play('LOCK');
      });
    }).not.toThrow();
  });

  it('should not throw when playing ROTATE sound', () => {
    const { result } = renderHook(() => useSoundEffects());
    
    expect(() => {
      act(() => {
        result.current.play('ROTATE');
      });
    }).not.toThrow();
  });
});
