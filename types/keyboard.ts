/**
 * Keyboard Input Types
 * 
 * US-005: Keyboard input handling
 */

/** Game actions that can be triggered by keyboard input */
export type GameAction = 
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'SOFT_DROP'
  | 'HARD_DROP'
  | 'ROTATE_CW'
  | 'ROTATE_CCW'
  | 'HOLD'
  | 'PAUSE'
  | 'CONFIRM';

/** Keyboard event handler type */
export type KeyboardHandler = (action: GameAction) => void;

/** Configuration for key repeat behavior */
export interface KeyRepeatConfig {
  /** Initial delay before key repeat starts (in milliseconds) */
  initialDelay: number;
  /** Interval between repeated key events (in milliseconds) */
  repeatInterval: number;
}

/** Default key repeat configuration */
export const DEFAULT_KEY_REPEAT: KeyRepeatConfig = {
  initialDelay: 200,
  repeatInterval: 50,
};

/** Mapping of keyboard keys to game actions */
export const KEY_MAPPINGS: Record<string, GameAction> = {
  // Movement
  ArrowLeft: 'MOVE_LEFT',
  ArrowRight: 'MOVE_RIGHT',
  ArrowDown: 'SOFT_DROP',
  
  // Rotation
  ArrowUp: 'ROTATE_CW',
  z: 'ROTATE_CCW',
  Z: 'ROTATE_CCW',
  x: 'ROTATE_CW',
  X: 'ROTATE_CW',
  
  // Hard drop
  ' ': 'HARD_DROP',
  
  // Hold
  c: 'HOLD',
  C: 'HOLD',
  
  // Pause
  p: 'PAUSE',
  P: 'PAUSE',
  Escape: 'PAUSE',
  
  // Confirm/Start
  Enter: 'CONFIRM',
};

/** Set of keys that should have repeat behavior */
export const REPEAT_KEYS = new Set(['ArrowLeft', 'ArrowRight', 'ArrowDown']);

/** Set of keys that should prevent default browser behavior */
export const PREVENT_DEFAULT_KEYS = new Set([
  'ArrowLeft',
  'ArrowRight',
  'ArrowDown',
  'ArrowUp',
  ' ',
  'Escape',
  'Enter',
]);
