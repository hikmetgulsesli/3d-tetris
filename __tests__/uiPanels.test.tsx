/**
 * UI Panels Component Tests
 * 
 * US-009: UI panels - Score, controls, and game status
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Import components after mock setup
import { GameProvider, useGame } from '../lib/gameStore';
import {
  LeftPanel,
  RightPanel,
  HoldPiecePanel,
  ControlsPanel,
  ScorePanel,
  NextPiecesPanel,
  GameStatusOverlay,
  GameTitle,
  GameControls,
} from '../components/UIPanels';

// Test wrapper with GameProvider
function TestWrapper({ children }: { children: React.ReactNode }) {
  return <GameProvider>{children}</GameProvider>;
}

describe('GameTitle', () => {
  it('renders the game title', () => {
    render(
      <TestWrapper>
        <GameTitle />
      </TestWrapper>
    );
    
    const title = screen.getByTestId('game-title');
    expect(title).toBeDefined();
    expect(title.textContent).toContain('TETRIS 3D');
  });
});

describe('LeftPanel', () => {
  it('renders hold piece panel and controls panel', () => {
    render(
      <TestWrapper>
        <LeftPanel />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('left-panel')).toBeDefined();
    expect(screen.getByTestId('hold-panel')).toBeDefined();
    expect(screen.getByTestId('controls-panel')).toBeDefined();
  });
});

describe('RightPanel', () => {
  it('renders score panel and next pieces panel', () => {
    render(
      <TestWrapper>
        <RightPanel />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('right-panel')).toBeDefined();
    expect(screen.getByTestId('score-panel')).toBeDefined();
    expect(screen.getByTestId('next-pieces-panel')).toBeDefined();
  });
});

describe('HoldPiecePanel', () => {
  it('renders hold panel with empty state', () => {
    render(
      <TestWrapper>
        <HoldPiecePanel />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('hold-panel')).toBeDefined();
    expect(screen.getByText('Hold (C)')).toBeDefined();
  });
});

describe('ControlsPanel', () => {
  it('renders all control references', () => {
    render(
      <TestWrapper>
        <ControlsPanel />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('controls-panel')).toBeDefined();
    expect(screen.getByText('Controls')).toBeDefined();
    
    // Check for specific controls
    expect(screen.getByText('Move')).toBeDefined();
    expect(screen.getByText('Soft Drop')).toBeDefined();
    expect(screen.getByText('Hard Drop')).toBeDefined();
    expect(screen.getByText('Rotate')).toBeDefined();
    expect(screen.getByText('Hold')).toBeDefined();
    expect(screen.getByText('Pause')).toBeDefined();
  });
  
  it('displays keyboard shortcuts', () => {
    render(
      <TestWrapper>
        <ControlsPanel />
      </TestWrapper>
    );
    
    // Check for keyboard shortcuts
    expect(screen.getByText('← / →')).toBeDefined();
    expect(screen.getByText('Space')).toBeDefined();
    expect(screen.getByText('↑ / Z')).toBeDefined();
    expect(screen.getByText('C')).toBeDefined();
    expect(screen.getByText('P / Esc')).toBeDefined();
  });
});

describe('ScorePanel', () => {
  it('renders score panel with initial values', () => {
    render(
      <TestWrapper>
        <ScorePanel />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('score-panel')).toBeDefined();
    expect(screen.getByText('Score')).toBeDefined();
    expect(screen.getByText('Level')).toBeDefined();
    expect(screen.getByText('Lines')).toBeDefined();
  });
  
  it('displays score with tabular-nums formatting', () => {
    render(
      <TestWrapper>
        <ScorePanel />
      </TestWrapper>
    );
    
    const scoreCounter = screen.getByTestId('counter-score');
    expect(scoreCounter.classList.contains('tabular-nums')).toBe(true);
    expect(scoreCounter.textContent).toBe('0000000');
  });
  
  it('displays level and lines counters', () => {
    render(
      <TestWrapper>
        <ScorePanel />
      </TestWrapper>
    );
    
    const levelCounter = screen.getByTestId('counter-level');
    const linesCounter = screen.getByTestId('counter-lines');
    
    expect(levelCounter.classList.contains('tabular-nums')).toBe(true);
    expect(linesCounter.classList.contains('tabular-nums')).toBe(true);
  });
});

describe('NextPiecesPanel', () => {
  it('renders next pieces panel', () => {
    render(
      <TestWrapper>
        <NextPiecesPanel />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('next-pieces-panel')).toBeDefined();
    expect(screen.getByText('Next')).toBeDefined();
  });
});

describe('GameStatusOverlay', () => {
  it('shows start screen when status is START', () => {
    render(
      <TestWrapper>
        <GameStatusOverlay />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('game-status-overlay')).toBeDefined();
    expect(screen.getByText('TETRIS 3D')).toBeDefined();
    expect(screen.getByText('Start Game')).toBeDefined();
  });
  
  it('hides overlay when game is playing', () => {
    function PlayingGame() {
      const { startGame } = useGame();
      
      React.useEffect(() => {
        startGame();
      }, [startGame]);
      
      return <GameStatusOverlay />;
    }
    
    render(
      <TestWrapper>
        <PlayingGame />
      </TestWrapper>
    );
    
    expect(screen.queryByTestId('game-status-overlay')).toBeNull();
  });
});

describe('GameControls', () => {
  it('renders start button when game is at start', () => {
    render(
      <TestWrapper>
        <GameControls />
      </TestWrapper>
    );
    
    expect(screen.getByTestId('game-controls')).toBeDefined();
    expect(screen.getByText('Start')).toBeDefined();
  });
  
  it('changes to pause button when game starts', () => {
    function StartedGame() {
      const { startGame } = useGame();
      
      React.useEffect(() => {
        startGame();
      }, [startGame]);
      
      return <GameControls />;
    }
    
    render(
      <TestWrapper>
        <StartedGame />
      </TestWrapper>
    );
    
    expect(screen.getByText('Pause')).toBeDefined();
  });
  
  it('shows resume and restart buttons when paused', () => {
    function PausedGame() {
      const { startGame, pauseGame } = useGame();
      
      React.useEffect(() => {
        startGame();
        setTimeout(pauseGame, 10);
      }, [startGame, pauseGame]);
      
      return <GameControls />;
    }
    
    render(
      <TestWrapper>
        <PausedGame />
      </TestWrapper>
    );
    
    // Wait for state update
    setTimeout(() => {
      expect(screen.getByText('Resume')).toBeDefined();
      expect(screen.getByText('Restart')).toBeDefined();
    }, 50);
  });
});
