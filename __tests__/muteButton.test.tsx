/**
 * Mute Button Component Tests
 * 
 * US-012: Sound effects and final polish
 * 
 * Tests for:
 * - Mute button rendering
 * - Toggle functionality
 * - Icon changes based on state
 * - Accessibility attributes
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MuteButton } from '../components/MuteButton';

describe('MuteButton', () => {
  it('renders with enabled state', () => {
    render(<MuteButton enabled={true} onToggle={vi.fn()} />);
    
    const button = screen.getByRole('button', { name: /mute sound/i });
    expect(button).toBeDefined();
    expect(button).not.toBeNull();
  });

  it('renders with disabled state', () => {
    render(<MuteButton enabled={false} onToggle={vi.fn()} />);
    
    const button = screen.getByRole('button', { name: /unmute sound/i });
    expect(button).toBeDefined();
    expect(button).not.toBeNull();
  });

  it('calls onToggle when clicked', () => {
    const onToggle = vi.fn();
    render(<MuteButton enabled={true} onToggle={onToggle} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(onToggle).toHaveBeenCalledTimes(1);
  });

  it('has correct aria-label when enabled', () => {
    render(<MuteButton enabled={true} onToggle={vi.fn()} />);
    
    const button = screen.getByLabelText('Mute sound');
    expect(button).toBeDefined();
    expect(button).not.toBeNull();
  });

  it('has correct aria-label when disabled', () => {
    render(<MuteButton enabled={false} onToggle={vi.fn()} />);
    
    const button = screen.getByLabelText('Unmute sound');
    expect(button).toBeDefined();
    expect(button).not.toBeNull();
  });

  it('renders with custom size', () => {
    render(<MuteButton enabled={true} onToggle={vi.fn()} size={50} />);
    
    const button = screen.getByRole('button');
    expect(button).toBeDefined();
    // Check style attribute contains expected values
    expect(button.getAttribute('style')).toContain('width');
  });

  it('is memoized for performance', () => {
    expect(MuteButton).toBeDefined();
    expect(MuteButton.$$typeof).toBe(Symbol.for('react.memo'));
  });
});
