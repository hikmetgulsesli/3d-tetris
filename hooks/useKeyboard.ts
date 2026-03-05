/**
 * Keyboard Input Hook
 * 
 * US-005: Keyboard input handling
 * 
 * Handles keyboard events for the game with support for:
 * - Key mapping to game actions
 * - Key repeat for movement keys
 * - Preventing default browser behavior for game keys
 */

import { useCallback, useEffect, useRef } from 'react';
import {
  GameAction,
  KeyboardHandler,
  KeyRepeatConfig,
  DEFAULT_KEY_REPEAT,
  KEY_MAPPINGS,
  REPEAT_KEYS,
  PREVENT_DEFAULT_KEYS,
} from '../types/keyboard';

export interface UseKeyboardOptions {
  /** Callback function when a game action is triggered */
  onAction: KeyboardHandler;
  /** Whether keyboard input is enabled */
  enabled?: boolean;
  /** Key repeat configuration */
  keyRepeat?: KeyRepeatConfig;
}

/**
 * Hook for handling keyboard input in the game
 * 
 * @param options - Configuration options
 * @returns Object with enabled state
 */
export function useKeyboard({
  onAction,
  enabled = true,
  keyRepeat = DEFAULT_KEY_REPEAT,
}: UseKeyboardOptions): { enabled: boolean } {
  // Track which keys are currently pressed
  const pressedKeys = useRef<Set<string>>(new Set());
  // Track key repeat timeouts
  const repeatTimeouts = useRef<Map<string, number>>(new Map());
  const repeatIntervals = useRef<Map<string, number>>(new Map());

  // Clear all timeouts and intervals
  const clearRepeats = useCallback(() => {
    repeatTimeouts.current.forEach((timeout) => {
      window.clearTimeout(timeout);
    });
    repeatIntervals.current.forEach((interval) => {
      window.clearInterval(interval);
    });
    repeatTimeouts.current.clear();
    repeatIntervals.current.clear();
    pressedKeys.current.clear();
  }, []);

  // Handle key down event
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      const key = event.key;
      const action = KEY_MAPPINGS[key];

      // Prevent default for game keys to avoid browser scrolling
      if (PREVENT_DEFAULT_KEYS.has(key)) {
        event.preventDefault();
      }

      // If key is already pressed, ignore (handled by repeat)
      if (pressedKeys.current.has(key)) {
        return;
      }

      // Mark key as pressed
      pressedKeys.current.add(key);

      // Trigger action if mapped
      if (action) {
        onAction(action);

        // Set up key repeat for movement keys
        if (REPEAT_KEYS.has(key)) {
          // Initial delay before repeat starts
          const timeout = window.setTimeout(() => {
            // Start repeating
            const interval = window.setInterval(() => {
              onAction(action);
            }, keyRepeat.repeatInterval);
            repeatIntervals.current.set(key, interval);
          }, keyRepeat.initialDelay);
          repeatTimeouts.current.set(key, timeout);
        }
      }
    },
    [enabled, onAction, keyRepeat]
  );

  // Handle key up event
  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      const key = event.key;

      // Remove key from pressed set
      pressedKeys.current.delete(key);

      // Clear any pending timeouts/intervals for this key
      const timeout = repeatTimeouts.current.get(key);
      if (timeout) {
        window.clearTimeout(timeout);
        repeatTimeouts.current.delete(key);
      }
      const interval = repeatIntervals.current.get(key);
      if (interval) {
        window.clearInterval(interval);
        repeatIntervals.current.delete(key);
      }
    },
    []
  );

  // Handle window blur (clear all keys when window loses focus)
  const handleBlur = useCallback(() => {
    clearRepeats();
  }, [clearRepeats]);

  // Set up event listeners
  useEffect(() => {
    if (!enabled) {
      clearRepeats();
      return;
    }

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
      clearRepeats();
    };
  }, [enabled, handleKeyDown, handleKeyUp, handleBlur, clearRepeats]);

  return { enabled };
}

export default useKeyboard;
