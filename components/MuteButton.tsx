/**
 * Mute Button Component
 * 
 * US-012: Sound effects and final polish
 * 
 * Toggle button for muting/unmuting game sounds
 * Persists preference to localStorage
 */

'use client';

import React, { memo } from 'react';

export interface MuteButtonProps {
  /** Whether sound is currently enabled */
  enabled: boolean;
  /** Toggle callback */
  onToggle: () => void;
  /** Button size in pixels */
  size?: number;
}

/**
 * Mute toggle button with speaker icon
 * Optimized with React.memo to prevent unnecessary re-renders
 */
export const MuteButton = memo(function MuteButton({
  enabled,
  onToggle,
  size = 40,
}: MuteButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={enabled ? 'Mute sound' : 'Unmute sound'}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        border: '1px solid rgba(0, 240, 255, 0.3)',
        background: enabled 
          ? 'rgba(0, 240, 255, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        touchAction: 'manipulation',
        WebkitTapHighlightColor: 'transparent',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = enabled 
          ? 'rgba(0, 240, 255, 0.2)' 
          : 'rgba(239, 68, 68, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = enabled 
          ? 'rgba(0, 240, 255, 0.1)' 
          : 'rgba(239, 68, 68, 0.1)';
      }}
    >
      {enabled ? (
        // Speaker icon
        <svg 
          width={size * 0.5} 
          height={size * 0.5} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#00f0ff" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      ) : (
        // Muted speaker icon
        <svg 
          width={size * 0.5} 
          height={size * 0.5} 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="#ef4444" 
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
});

export default MuteButton;
