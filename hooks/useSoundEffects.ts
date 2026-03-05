/**
 * Sound Effects Hook
 * 
 * US-012: Sound effects and final polish
 * 
 * Web Audio API based sound synthesis for retro arcade feel:
 * - Line clear: short chime
 * - Tetris (4 lines): special celebratory sound
 * - Game over: descending tone
 * - Piece lock: short thud
 * - Rotation: subtle click
 * 
 * All sounds are synthesized - no external assets needed.
 */

import { useCallback, useEffect, useRef, useState } from 'react';

export type SoundType = 'LINE_CLEAR' | 'TETRIS' | 'GAME_OVER' | 'LOCK' | 'ROTATE';

export interface UseSoundEffectsOptions {
  /** Whether sound is initially enabled */
  enabled?: boolean;
}

export interface SoundEffectsState {
  /** Whether sound is enabled */
  enabled: boolean;
  /** Toggle sound on/off */
  toggle: () => void;
  /** Play a sound effect */
  play: (type: SoundType) => void;
  /** Mute sound */
  mute: () => void;
  /** Unmute sound */
  unmute: () => void;
}

/**
 * Hook for synthesizing sound effects using Web Audio API
 * 
 * @param options - Configuration options
 * @returns Sound effects state and controls
 */
export function useSoundEffects(options: UseSoundEffectsOptions = {}): SoundEffectsState {
  const { enabled: initialEnabled = true } = options;
  
  const [enabled, setEnabled] = useState(initialEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);

  // Initialize audio context on first user interaction
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current && typeof window !== 'undefined') {
      try {
        audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        masterGainRef.current = audioContextRef.current.createGain();
        masterGainRef.current.gain.value = 0.3; // Master volume
        masterGainRef.current.connect(audioContextRef.current.destination);
      } catch {
        // Audio context not supported
      }
    }
  }, []);

  // Load saved mute preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('tetris-mute');
      if (saved !== null) {
        setEnabled(saved !== 'true');
      }
    }
  }, []);

  // Save mute preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tetris-mute', (!enabled).toString());
    }
  }, [enabled]);

  /**
   * Play a synthesized line clear chime
   */
  const playLineClear = useCallback(() => {
    if (!enabled || !audioContextRef.current || !masterGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;
    
    // Create oscillator for chime sound
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(523.25, now); // C5
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.1); // C6
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
    
    osc.connect(gain);
    gain.connect(master);
    
    osc.start(now);
    osc.stop(now + 0.15);
  }, [enabled]);

  /**
   * Play a special Tetris (4 lines) celebratory sound
   */
  const playTetris = useCallback(() => {
    if (!enabled || !audioContextRef.current || !masterGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;
    
    // Arpeggio: C - E - G - C
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq, now + index * 0.08);
      
      gain.gain.setValueAtTime(0.15, now + index * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.01, now + index * 0.08 + 0.2);
      
      osc.connect(gain);
      gain.connect(master);
      
      osc.start(now + index * 0.08);
      osc.stop(now + index * 0.08 + 0.2);
    });
  }, [enabled]);

  /**
   * Play game over descending tone
   */
  const playGameOver = useCallback(() => {
    if (!enabled || !audioContextRef.current || !masterGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now); // A4
    osc.frequency.exponentialRampToValueAtTime(110, now + 1); // A2
    
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.linearRampToValueAtTime(0.01, now + 1);
    
    osc.connect(gain);
    gain.connect(master);
    
    osc.start(now);
    osc.stop(now + 1);
  }, [enabled]);

  /**
   * Play piece lock thud sound
   */
  const playLock = useCallback(() => {
    if (!enabled || !audioContextRef.current || !masterGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;
    
    // Short noise burst for thud effect
    const bufferSize = ctx.sampleRate * 0.05;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 200;
    
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(master);
    
    noise.start(now);
    noise.stop(now + 0.05);
  }, [enabled]);

  /**
   * Play rotation click sound
   */
  const playRotate = useCallback(() => {
    if (!enabled || !audioContextRef.current || !masterGainRef.current) return;
    
    const ctx = audioContextRef.current;
    const master = masterGainRef.current;
    const now = ctx.currentTime;
    
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
    
    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.03);
    
    osc.connect(gain);
    gain.connect(master);
    
    osc.start(now);
    osc.stop(now + 0.03);
  }, [enabled]);

  /**
   * Play a sound by type
   */
  const play = useCallback((type: SoundType) => {
    initAudioContext();
    
    switch (type) {
      case 'LINE_CLEAR':
        playLineClear();
        break;
      case 'TETRIS':
        playTetris();
        break;
      case 'GAME_OVER':
        playGameOver();
        break;
      case 'LOCK':
        playLock();
        break;
      case 'ROTATE':
        playRotate();
        break;
    }
  }, [initAudioContext, playLineClear, playTetris, playGameOver, playLock, playRotate]);

  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
    initAudioContext();
  }, [initAudioContext]);

  const mute = useCallback(() => {
    setEnabled(false);
  }, []);

  const unmute = useCallback(() => {
    setEnabled(true);
    initAudioContext();
  }, [initAudioContext]);

  return {
    enabled,
    toggle,
    play,
    mute,
    unmute,
  };
}

export default useSoundEffects;
