/**
 * Touch Controls Hook
 * 
 * US-011: Mobile responsive with touch controls
 * 
 * Handles touch gestures for mobile gameplay:
 * - Swipe left/right to move piece
 * - Swipe down for soft drop
 * - Tap to rotate
 * - Hold and release for hard drop
 * - Touch targets minimum 44x44px
 */

import { useCallback, useEffect, useRef } from 'react';
import { GameAction } from '../types/keyboard';

export interface UseTouchControlsOptions {
  /** Callback function when a game action is triggered */
  onAction: (action: GameAction) => void;
  /** Whether touch input is enabled */
  enabled?: boolean;
  /** Minimum swipe distance in pixels to trigger an action */
  swipeThreshold?: number;
  /** Maximum tap duration in milliseconds */
  tapThreshold?: number;
  /** Minimum hold duration for hard drop in milliseconds */
  holdThreshold?: number;
}

export interface TouchState {
  isEnabled: boolean;
  isTouching: boolean;
}

/**
 * Hook for handling touch gestures in the game
 * 
 * @param options - Configuration options
 * @returns Touch state object
 */
export function useTouchControls({
  onAction,
  enabled = true,
  swipeThreshold = 30,
  tapThreshold = 200,
  holdThreshold = 400,
}: UseTouchControlsOptions): TouchState {
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isHoldingRef = useRef(false);
  const holdTimeoutRef = useRef<number | null>(null);
  const hasTriggeredHoldRef = useRef(false);

  const clearHoldTimeout = useCallback(() => {
    if (holdTimeoutRef.current) {
      window.clearTimeout(holdTimeoutRef.current);
      holdTimeoutRef.current = null;
    }
  }, []);

  const handleTouchStart = useCallback(
    (event: TouchEvent) => {
      if (!enabled) return;

      const touch = event.touches[0];
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        time: Date.now(),
      };
      isHoldingRef.current = true;
      hasTriggeredHoldRef.current = false;

      // Set up hold detection for hard drop
      holdTimeoutRef.current = window.setTimeout(() => {
        if (isHoldingRef.current) {
          hasTriggeredHoldRef.current = true;
        }
      }, holdThreshold);
    },
    [enabled, holdThreshold]
  );

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      if (!enabled || !touchStartRef.current) return;

      // Prevent scrolling while playing
      event.preventDefault();
    },
    [enabled]
  );

  const handleTouchEnd = useCallback(
    (event: TouchEvent) => {
      if (!enabled || !touchStartRef.current) return;

      clearHoldTimeout();
      isHoldingRef.current = false;

      const touch = event.changedTouches[0];
      const startX = touchStartRef.current.x;
      const startY = touchStartRef.current.y;
      const startTime = touchStartRef.current.time;
      const endX = touch.clientX;
      const endY = touch.clientY;
      const endTime = Date.now();

      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const duration = endTime - startTime;

      touchStartRef.current = null;

      // If hold was triggered, it's a hard drop
      if (hasTriggeredHoldRef.current) {
        onAction('HARD_DROP');
        return;
      }

      // Check for swipe gestures
      const absX = Math.abs(deltaX);
      const absY = Math.abs(deltaY);

      if (absX > swipeThreshold || absY > swipeThreshold) {
        // Determine primary direction
        if (absX > absY) {
          // Horizontal swipe
          if (deltaX > 0) {
            onAction('MOVE_RIGHT');
          } else {
            onAction('MOVE_LEFT');
          }
        } else {
          // Vertical swipe
          if (deltaY > 0) {
            onAction('SOFT_DROP');
          }
          // Swipe up could be used for rotation (alternative)
        }
      } else if (duration < tapThreshold) {
        // Short tap = rotate
        onAction('ROTATE_CW');
      }
    },
    [enabled, onAction, swipeThreshold, tapThreshold, clearHoldTimeout]
  );

  const handleTouchCancel = useCallback(() => {
    clearHoldTimeout();
    isHoldingRef.current = false;
    touchStartRef.current = null;
    hasTriggeredHoldRef.current = false;
  }, [clearHoldTimeout]);

  // Set up event listeners on window
  useEffect(() => {
    if (!enabled) {
      clearHoldTimeout();
      return;
    }

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchCancel);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchCancel);
      clearHoldTimeout();
    };
  }, [enabled, handleTouchStart, handleTouchMove, handleTouchEnd, handleTouchCancel, clearHoldTimeout]);

  return {
    isEnabled: enabled,
    isTouching: isHoldingRef.current,
  };
}

export default useTouchControls;
