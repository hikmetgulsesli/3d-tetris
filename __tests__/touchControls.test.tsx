/**
 * Touch Controls Tests
 * 
 * US-011: Mobile responsive with touch controls
 * 
 * Tests for:
 * - useTouchControls hook functionality
 * - TouchControls component rendering
 * - Button click handlers
 * - Touch target sizing (44x44px minimum)
 * - Mobile responsive layout
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useTouchControls } from '../hooks/useTouchControls';
import { TouchControls } from '../components/TouchControls';
import { GameAction } from '../types/keyboard';

describe('useTouchControls', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('should return enabled state', () => {
    const { result } = renderHook(() =>
      useTouchControls({ onAction: mockOnAction, enabled: true })
    );
    expect(result.current.isEnabled).toBe(true);
  });

  it('should return disabled state when enabled is false', () => {
    const { result } = renderHook(() =>
      useTouchControls({ onAction: mockOnAction, enabled: false })
    );
    expect(result.current.isEnabled).toBe(false);
  });

  it('should accept custom thresholds', () => {
    const { result } = renderHook(() =>
      useTouchControls({
        onAction: mockOnAction,
        enabled: true,
        swipeThreshold: 50,
        tapThreshold: 300,
        holdThreshold: 500,
      })
    );
    expect(result.current.isEnabled).toBe(true);
  });
});

describe('TouchControls Component', () => {
  const mockOnAction = vi.fn();

  beforeEach(() => {
    mockOnAction.mockClear();
  });

  it('should render all three buttons when enabled', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} />);
    
    expect(screen.getByLabelText('Hold piece')).toBeInTheDocument();
    expect(screen.getByLabelText('Pause game')).toBeInTheDocument();
    expect(screen.getByLabelText('Hard drop')).toBeInTheDocument();
  });

  it('should trigger HOLD action when hold button clicked', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} canHold={true} />);
    
    const holdButton = screen.getByLabelText('Hold piece');
    fireEvent.click(holdButton);
    
    expect(mockOnAction).toHaveBeenCalledWith('HOLD');
  });

  it('should trigger PAUSE action when pause button clicked', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} isPaused={false} />);
    
    const pauseButton = screen.getByLabelText('Pause game');
    fireEvent.click(pauseButton);
    
    expect(mockOnAction).toHaveBeenCalledWith('PAUSE');
  });

  it('should trigger HARD_DROP action when drop button clicked', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} />);
    
    const dropButton = screen.getByLabelText('Hard drop');
    fireEvent.click(dropButton);
    
    expect(mockOnAction).toHaveBeenCalledWith('HARD_DROP');
  });

  it('should disable hold button when canHold is false', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} canHold={false} />);
    
    const holdButton = screen.getByLabelText('Hold piece') as HTMLButtonElement;
    expect(holdButton.disabled).toBe(true);
  });

  it('should show RESUME label when paused', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} isPaused={true} />);
    
    expect(screen.getByLabelText('Resume game')).toBeInTheDocument();
  });

  it('should not render when disabled', () => {
    const { container } = render(<TouchControls onAction={mockOnAction} enabled={false} />);
    
    expect(container.firstChild).toBeNull();
  });

  it('should have minimum touch target styling of 44x44px', () => {
    render(<TouchControls onAction={mockOnAction} enabled={true} />);
    
    const buttons = screen.getAllByRole('button');
    
    // All three buttons should exist
    expect(buttons).toHaveLength(3);
    
    // Check that buttons have proper styling for touch targets
    buttons.forEach(button => {
      const style = (button as HTMLButtonElement).style;
      // Verify style properties are set for accessibility
      expect(style.minWidth).toBe('44px');
      expect(style.minHeight).toBe('44px');
    });
  });
});


