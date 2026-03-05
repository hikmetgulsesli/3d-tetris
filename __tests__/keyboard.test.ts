/**
 * Keyboard Input Tests
 * 
 * US-005: Keyboard input handling
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useKeyboard } from '../hooks/useKeyboard';
import {
  KEY_MAPPINGS,
  REPEAT_KEYS,
  PREVENT_DEFAULT_KEYS,
  DEFAULT_KEY_REPEAT,
  GameAction,
} from '../types/keyboard';

describe('KEY_MAPPINGS', () => {
  it('should map ArrowLeft to MOVE_LEFT', () => {
    expect(KEY_MAPPINGS.ArrowLeft).toBe('MOVE_LEFT');
  });

  it('should map ArrowRight to MOVE_RIGHT', () => {
    expect(KEY_MAPPINGS.ArrowRight).toBe('MOVE_RIGHT');
  });

  it('should map ArrowDown to SOFT_DROP', () => {
    expect(KEY_MAPPINGS.ArrowDown).toBe('SOFT_DROP');
  });

  it('should map ArrowUp to ROTATE_CW', () => {
    expect(KEY_MAPPINGS.ArrowUp).toBe('ROTATE_CW');
  });

  it('should map Space to HARD_DROP', () => {
    expect(KEY_MAPPINGS[' ']).toBe('HARD_DROP');
  });

  it('should map z/Z to ROTATE_CCW', () => {
    expect(KEY_MAPPINGS.z).toBe('ROTATE_CCW');
    expect(KEY_MAPPINGS.Z).toBe('ROTATE_CCW');
  });

  it('should map x/X to ROTATE_CW', () => {
    expect(KEY_MAPPINGS.x).toBe('ROTATE_CW');
    expect(KEY_MAPPINGS.X).toBe('ROTATE_CW');
  });

  it('should map c/C to HOLD', () => {
    expect(KEY_MAPPINGS.c).toBe('HOLD');
    expect(KEY_MAPPINGS.C).toBe('HOLD');
  });

  it('should map p/P/Escape to PAUSE', () => {
    expect(KEY_MAPPINGS.p).toBe('PAUSE');
    expect(KEY_MAPPINGS.P).toBe('PAUSE');
    expect(KEY_MAPPINGS.Escape).toBe('PAUSE');
  });
});

describe('REPEAT_KEYS', () => {
  it('should include ArrowLeft for repeat', () => {
    expect(REPEAT_KEYS.has('ArrowLeft')).toBe(true);
  });

  it('should include ArrowRight for repeat', () => {
    expect(REPEAT_KEYS.has('ArrowRight')).toBe(true);
  });

  it('should include ArrowDown for repeat', () => {
    expect(REPEAT_KEYS.has('ArrowDown')).toBe(true);
  });

  it('should not include Space for repeat', () => {
    expect(REPEAT_KEYS.has(' ')).toBe(false);
  });
});

describe('PREVENT_DEFAULT_KEYS', () => {
  it('should include all arrow keys', () => {
    expect(PREVENT_DEFAULT_KEYS.has('ArrowLeft')).toBe(true);
    expect(PREVENT_DEFAULT_KEYS.has('ArrowRight')).toBe(true);
    expect(PREVENT_DEFAULT_KEYS.has('ArrowDown')).toBe(true);
    expect(PREVENT_DEFAULT_KEYS.has('ArrowUp')).toBe(true);
  });

  it('should include Space', () => {
    expect(PREVENT_DEFAULT_KEYS.has(' ')).toBe(true);
  });

  it('should include Escape', () => {
    expect(PREVENT_DEFAULT_KEYS.has('Escape')).toBe(true);
  });
});

describe('DEFAULT_KEY_REPEAT', () => {
  it('should have initialDelay of 200ms', () => {
    expect(DEFAULT_KEY_REPEAT.initialDelay).toBe(200);
  });

  it('should have repeatInterval of 50ms', () => {
    expect(DEFAULT_KEY_REPEAT.repeatInterval).toBe(50);
  });
});

describe('useKeyboard', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return enabled state', () => {
    const { result } = renderHook(() =>
      useKeyboard({ onAction: mockOnAction, enabled: true })
    );
    expect(result.current.enabled).toBe(true);
  });

  it('should return disabled state when enabled is false', () => {
    const { result } = renderHook(() =>
      useKeyboard({ onAction: mockOnAction, enabled: false })
    );
    expect(result.current.enabled).toBe(false);
  });

  describe('Key handling', () => {
    it('should trigger action on keydown', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('MOVE_LEFT');
    });

    it('should trigger MOVE_RIGHT on ArrowRight', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('MOVE_RIGHT');
    });

    it('should trigger SOFT_DROP on ArrowDown', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('SOFT_DROP');
    });

    it('should trigger HARD_DROP on Space', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('HARD_DROP');
    });

    it('should trigger ROTATE_CW on ArrowUp', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('ROTATE_CW');
    });

    it('should trigger ROTATE_CCW on z key', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'z' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('ROTATE_CCW');
    });

    it('should trigger HOLD on c key', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'c' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('HOLD');
    });

    it('should trigger PAUSE on p key', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('PAUSE');
    });

    it('should trigger PAUSE on Escape key', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      });

      expect(mockOnAction).toHaveBeenCalledWith('PAUSE');
    });

    it('should not trigger action when disabled', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: false }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });

      expect(mockOnAction).not.toHaveBeenCalled();
    });

    it('should not trigger action for unmapped keys', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' }));
      });

      expect(mockOnAction).not.toHaveBeenCalled();
    });
  });

  describe('Key repeat', () => {
    it('should repeat MOVE_LEFT after initial delay', () => {
      renderHook(() =>
        useKeyboard({
          onAction: mockOnAction,
          enabled: true,
          keyRepeat: { initialDelay: 200, repeatInterval: 50 },
        })
      );

      // Press key
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });
      expect(mockOnAction).toHaveBeenCalledTimes(1);

      // After initial delay, should start repeating
      act(() => {
        vi.advanceTimersByTime(200);
      });

      // After first interval
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(mockOnAction).toHaveBeenCalledTimes(2);

      // After second interval
      act(() => {
        vi.advanceTimersByTime(50);
      });
      expect(mockOnAction).toHaveBeenCalledTimes(3);
    });

    it('should stop repeating on keyup', () => {
      renderHook(() =>
        useKeyboard({
          onAction: mockOnAction,
          enabled: true,
          keyRepeat: { initialDelay: 200, repeatInterval: 50 },
        })
      );

      // Press and hold
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });
      expect(mockOnAction).toHaveBeenCalledTimes(1);

      // Release key before repeat starts
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keyup', { key: 'ArrowLeft' }));
      });

      // Advance time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should still only have 1 call
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });

    it('should not repeat non-repeat keys like HARD_DROP', () => {
      renderHook(() =>
        useKeyboard({
          onAction: mockOnAction,
          enabled: true,
          keyRepeat: { initialDelay: 200, repeatInterval: 50 },
        })
      );

      // Press space
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
      });
      expect(mockOnAction).toHaveBeenCalledTimes(1);

      // Advance time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should still only have 1 call
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
  });

  describe('Prevent default', () => {
    it('should prevent default for arrow keys', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      const event = new KeyboardEvent('keydown', { key: 'ArrowLeft', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default for Space', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      const event = new KeyboardEvent('keydown', { key: ' ', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });

    it('should prevent default for Escape', () => {
      renderHook(() => useKeyboard({ onAction: mockOnAction, enabled: true }));

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      act(() => {
        window.dispatchEvent(event);
      });

      expect(preventDefaultSpy).toHaveBeenCalled();
    });
  });

  describe('Window blur', () => {
    it('should clear all keys on window blur', () => {
      renderHook(() =>
        useKeyboard({
          onAction: mockOnAction,
          enabled: true,
          keyRepeat: { initialDelay: 200, repeatInterval: 50 },
        })
      );

      // Press key
      act(() => {
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
      });

      // Window loses focus
      act(() => {
        window.dispatchEvent(new Event('blur'));
      });

      // Advance time
      act(() => {
        vi.advanceTimersByTime(500);
      });

      // Should only have initial call
      expect(mockOnAction).toHaveBeenCalledTimes(1);
    });
  });
});
