/**
 * UI Panels Tests
 * US-009: Test suite for UI panel components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import {
  HoldPiecePanel,
  ControlsPanel,
  ScorePanel,
  NextPiecesPanel,
  GameActionsPanel,
  PiecePreview,
} from '../components/ui-panels';
import type { TetrominoType } from '../types/tetromino';

describe('PiecePreview', () => {
  const tetrominoTypes: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

  it.each(tetrominoTypes)('renders %s piece preview', (type) => {
    render(<PiecePreview type={type} />);
    expect(screen.getByTestId(`piece-preview-${type}`)).toBeInTheDocument();
  });

  it('renders with small size', () => {
    render(<PiecePreview type="I" size="small" />);
    expect(screen.getByTestId('piece-preview-I')).toBeInTheDocument();
  });

  it('renders with large size', () => {
    render(<PiecePreview type="O" size="large" />);
    expect(screen.getByTestId('piece-preview-O')).toBeInTheDocument();
  });
});

describe('HoldPiecePanel', () => {
  it('renders empty state when no piece is held', () => {
    render(<HoldPiecePanel piece={null} />);
    expect(screen.getByTestId('hold-piece-panel')).toBeInTheDocument();
    expect(screen.getByText('Empty')).toBeInTheDocument();
  });

  it('renders held piece', () => {
    render(<HoldPiecePanel piece="T" />);
    expect(screen.getByTestId('hold-piece-panel')).toBeInTheDocument();
    expect(screen.getByTestId('piece-preview-T')).toBeInTheDocument();
  });

  it.each(['I', 'O', 'S', 'Z', 'J', 'L'] as TetrominoType[])('renders %s piece', (type) => {
    render(<HoldPiecePanel piece={type} />);
    expect(screen.getByTestId(`piece-preview-${type}`)).toBeInTheDocument();
  });
});

describe('ControlsPanel', () => {
  it('renders all control items', () => {
    render(<ControlsPanel />);
    expect(screen.getByTestId('controls-panel')).toBeInTheDocument();
    
    // Check all control actions are rendered
    expect(screen.getByTestId('control-move')).toBeInTheDocument();
    expect(screen.getByTestId('control-rotate')).toBeInTheDocument();
    expect(screen.getByTestId('control-soft-drop')).toBeInTheDocument();
    expect(screen.getByTestId('control-hard-drop')).toBeInTheDocument();
    expect(screen.getByTestId('control-hold')).toBeInTheDocument();
    expect(screen.getByTestId('control-pause')).toBeInTheDocument();
  });

  it('displays correct key mappings', () => {
    render(<ControlsPanel />);
    
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getByText('Rotate')).toBeInTheDocument();
    expect(screen.getByText('Soft Drop')).toBeInTheDocument();
    expect(screen.getByText('Hard Drop')).toBeInTheDocument();
    expect(screen.getByText('Hold')).toBeInTheDocument();
    expect(screen.getByText('Pause')).toBeInTheDocument();
  });
});

describe('ScorePanel', () => {
  it('renders score with tabular numbers', () => {
    render(<ScorePanel score={12450} level={3} lines={24} combo={2} highScore={45200} />);
    expect(screen.getByTestId('score-panel')).toBeInTheDocument();
    expect(screen.getByTestId('score-value')).toHaveTextContent('12,450');
  });

  it('displays level, lines, and combo', () => {
    render(<ScorePanel score={1000} level={5} lines={50} combo={3} highScore={10000} />);
    
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    
    expect(screen.getByText('Lines')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
    
    expect(screen.getByText('Combo')).toBeInTheDocument();
    expect(screen.getByText('×3')).toBeInTheDocument();
  });

  it('displays high score', () => {
    render(<ScorePanel score={1000} level={1} lines={10} combo={0} highScore={99999} />);
    expect(screen.getByTestId('high-score-value')).toHaveTextContent('99,999');
  });

  it('formats numbers with locale', () => {
    render(<ScorePanel score={1234567} level={99} lines={999} combo={10} highScore={9999999} />);
    expect(screen.getByTestId('score-value')).toHaveTextContent('1,234,567');
  });
});

describe('NextPiecesPanel', () => {
  const mockPieces: TetrominoType[] = ['T', 'I', 'S', 'Z', 'J'];

  it('renders next pieces panel', () => {
    render(<NextPiecesPanel pieces={mockPieces} />);
    expect(screen.getByTestId('next-pieces-panel')).toBeInTheDocument();
  });

  it('displays up to 3 next pieces', () => {
    render(<NextPiecesPanel pieces={mockPieces} />);
    
    expect(screen.getByTestId('next-piece-0')).toBeInTheDocument();
    expect(screen.getByTestId('next-piece-1')).toBeInTheDocument();
    expect(screen.getByTestId('next-piece-2')).toBeInTheDocument();
    
    // Should not render 4th piece
    expect(screen.queryByTestId('next-piece-3')).not.toBeInTheDocument();
  });

  it('renders empty state when no pieces', () => {
    render(<NextPiecesPanel pieces={[]} />);
    expect(screen.getByText('No pieces queued')).toBeInTheDocument();
  });

  it('renders correct piece previews', () => {
    render(<NextPiecesPanel pieces={mockPieces} />);
    
    expect(screen.getByTestId('piece-preview-T')).toBeInTheDocument();
    expect(screen.getByTestId('piece-preview-I')).toBeInTheDocument();
    expect(screen.getByTestId('piece-preview-S')).toBeInTheDocument();
  });
});

describe('GameActionsPanel', () => {
  const mockHandlers = {
    onStart: vi.fn(),
    onPause: vi.fn(),
    onRestart: vi.fn(),
  };

  it('shows start button in start state', () => {
    render(<GameActionsPanel gameState="start" {...mockHandlers} />);
    expect(screen.getByTestId('start-button')).toBeInTheDocument();
    expect(screen.getByText('START')).toBeInTheDocument();
  });

  it('shows pause button in playing state', () => {
    render(<GameActionsPanel gameState="playing" {...mockHandlers} />);
    expect(screen.getByTestId('pause-button')).toBeInTheDocument();
    expect(screen.getByText('PAUSE')).toBeInTheDocument();
  });

  it('shows resume and restart buttons in paused state', () => {
    render(<GameActionsPanel gameState="paused" {...mockHandlers} />);
    expect(screen.getByTestId('resume-button')).toBeInTheDocument();
    expect(screen.getByTestId('restart-button')).toBeInTheDocument();
    expect(screen.getByText('RESUME')).toBeInTheDocument();
  });

  it('shows restart button in gameover state', () => {
    render(<GameActionsPanel gameState="gameover" {...mockHandlers} />);
    expect(screen.getByTestId('resume-button')).toBeInTheDocument();
    expect(screen.getByText('RESTART')).toBeInTheDocument();
  });

  it('calls onStart when start button clicked', () => {
    render(<GameActionsPanel gameState="start" {...mockHandlers} />);
    fireEvent.click(screen.getByTestId('start-button'));
    expect(mockHandlers.onStart).toHaveBeenCalled();
  });

  it('calls onPause when pause button clicked', () => {
    render(<GameActionsPanel gameState="playing" {...mockHandlers} />);
    fireEvent.click(screen.getByTestId('pause-button'));
    expect(mockHandlers.onPause).toHaveBeenCalled();
  });

  it('calls onRestart when restart button clicked', () => {
    render(<GameActionsPanel gameState="paused" {...mockHandlers} />);
    fireEvent.click(screen.getByTestId('restart-button'));
    expect(mockHandlers.onRestart).toHaveBeenCalled();
  });
});
