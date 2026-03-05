import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { Game } from '../components/Game';
import { StartScreen } from '../components/StartScreen';
import { PauseOverlay } from '../components/PauseOverlay';
import { GameOverScreen } from '../components/GameOverScreen';
import { ControlBar } from '../components/ControlBar';
import { getHighScore, saveHighScore, isNewHighScore, HIGH_SCORE_KEY } from '../types/game-state';

describe('Game States (US-010)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ============================================
  // Start Screen Tests
  // ============================================
  describe('Start Screen', () => {
    it('should render start screen with title and start button', () => {
      const onStart = vi.fn();
      render(<StartScreen onStart={onStart} />);

      expect(screen.getByText('TETRIS')).toBeInTheDocument();
      expect(screen.getByText('3D')).toBeInTheDocument();
      expect(screen.getByTestId('start-button')).toBeInTheDocument();
    });

    it('should call onStart when start button is clicked', () => {
      const onStart = vi.fn();
      render(<StartScreen onStart={onStart} />);

      fireEvent.click(screen.getByTestId('start-button'));
      expect(onStart).toHaveBeenCalledTimes(1);
    });

    it('should have correct styling classes for neon effect', () => {
      const onStart = vi.fn();
      render(<StartScreen onStart={onStart} />);

      const startScreen = screen.getByTestId('start-screen');
      expect(startScreen).toBeInTheDocument();
      
      const title = screen.getByText('TETRIS');
      expect(title).toHaveClass('animate-glow');
    });
  });

  // ============================================
  // Pause Overlay Tests
  // ============================================
  describe('Pause Overlay', () => {
    it('should render pause overlay with title and buttons', () => {
      const onResume = vi.fn();
      const onRestart = vi.fn();
      render(<PauseOverlay onResume={onResume} onRestart={onRestart} />);

      expect(screen.getByText('PAUSED')).toBeInTheDocument();
      expect(screen.getByTestId('resume-button')).toBeInTheDocument();
      expect(screen.getByTestId('restart-button')).toBeInTheDocument();
    });

    it('should call onResume when resume button is clicked', () => {
      const onResume = vi.fn();
      const onRestart = vi.fn();
      render(<PauseOverlay onResume={onResume} onRestart={onRestart} />);

      fireEvent.click(screen.getByTestId('resume-button'));
      expect(onResume).toHaveBeenCalledTimes(1);
    });

    it('should call onRestart when restart button is clicked', () => {
      const onResume = vi.fn();
      const onRestart = vi.fn();
      render(<PauseOverlay onResume={onResume} onRestart={onRestart} />);

      fireEvent.click(screen.getByTestId('restart-button'));
      expect(onRestart).toHaveBeenCalledTimes(1);
    });

    it('should have backdrop blur effect styling', () => {
      const onResume = vi.fn();
      const onRestart = vi.fn();
      render(<PauseOverlay onResume={onResume} onRestart={onRestart} />);

      const overlay = screen.getByTestId('pause-overlay');
      expect(overlay).toBeInTheDocument();
      expect(overlay).toHaveStyle({ backdropFilter: 'blur(4px)' });
    });
  });

  // ============================================
  // Game Over Screen Tests
  // ============================================
  describe('Game Over Screen', () => {
    const mockScoreData = {
      score: 15650,
      level: 4,
      lines: 32,
      maxCombo: 3,
    };

    it('should render game over screen with score', () => {
      const onPlayAgain = vi.fn();
      const onMenu = vi.fn();
      render(
        <GameOverScreen
          scoreData={mockScoreData}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
        />
      );

      expect(screen.getByTestId('game-over-screen')).toBeInTheDocument();
      expect(screen.getByTestId('final-score')).toHaveTextContent('15,650');
      expect(screen.getByTestId('play-again-button')).toBeInTheDocument();
      expect(screen.getByTestId('menu-button')).toBeInTheDocument();
    });

    it('should display stats grid with level, lines, and max combo', () => {
      const onPlayAgain = vi.fn();
      const onMenu = vi.fn();
      render(
        <GameOverScreen
          scoreData={mockScoreData}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
        />
      );

      expect(screen.getByText('Level')).toBeInTheDocument();
      expect(screen.getByText('4')).toBeInTheDocument();
      expect(screen.getByText('Lines')).toBeInTheDocument();
      expect(screen.getByText('32')).toBeInTheDocument();
      expect(screen.getByText('Max Combo')).toBeInTheDocument();
      expect(screen.getByText('×3')).toBeInTheDocument();
    });

    it('should call onPlayAgain when play again button is clicked', () => {
      const onPlayAgain = vi.fn();
      const onMenu = vi.fn();
      render(
        <GameOverScreen
          scoreData={mockScoreData}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
        />
      );

      fireEvent.click(screen.getByTestId('play-again-button'));
      expect(onPlayAgain).toHaveBeenCalledTimes(1);
    });

    it('should call onMenu when menu button is clicked', () => {
      const onPlayAgain = vi.fn();
      const onMenu = vi.fn();
      render(
        <GameOverScreen
          scoreData={mockScoreData}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
        />
      );

      fireEvent.click(screen.getByTestId('menu-button'));
      expect(onMenu).toHaveBeenCalledTimes(1);
    });

    it('should show new record badge when score is higher than high score', () => {
      // Set a lower high score
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify({ score: 10000, date: new Date().toISOString() }));

      const onPlayAgain = vi.fn();
      const onMenu = vi.fn();
      render(
        <GameOverScreen
          scoreData={mockScoreData}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
        />
      );

      expect(screen.getByTestId('new-record-badge')).toBeInTheDocument();
      expect(screen.getByText('NEW RECORD!')).toBeInTheDocument();
    });

    it('should not show new record badge when score is lower than high score', () => {
      // Set a higher high score
      localStorage.setItem(HIGH_SCORE_KEY, JSON.stringify({ score: 20000, date: new Date().toISOString() }));

      const onPlayAgain = vi.fn();
      const onMenu = vi.fn();
      render(
        <GameOverScreen
          scoreData={mockScoreData}
          onPlayAgain={onPlayAgain}
          onMenu={onMenu}
        />
      );

      expect(screen.queryByTestId('new-record-badge')).not.toBeInTheDocument();
    });
  });

  // ============================================
  // Control Bar Tests
  // ============================================
  describe('Control Bar', () => {
    it('should show start button when in START state', () => {
      const onStart = vi.fn();
      const onPause = vi.fn();
      const onRestart = vi.fn();
      render(
        <ControlBar
          gameState="START"
          onStart={onStart}
          onPause={onPause}
          onRestart={onRestart}
        />
      );

      expect(screen.getByTestId('control-start')).toBeInTheDocument();
      expect(screen.queryByTestId('control-pause')).not.toBeInTheDocument();
      expect(screen.queryByTestId('control-restart')).not.toBeInTheDocument();
    });

    it('should show pause and restart buttons when in PLAYING state', () => {
      const onStart = vi.fn();
      const onPause = vi.fn();
      const onRestart = vi.fn();
      render(
        <ControlBar
          gameState="PLAYING"
          onStart={onStart}
          onPause={onPause}
          onRestart={onRestart}
        />
      );

      expect(screen.queryByTestId('control-start')).not.toBeInTheDocument();
      expect(screen.getByTestId('control-pause')).toBeInTheDocument();
      expect(screen.getByTestId('control-restart')).toBeInTheDocument();
      expect(screen.getByText('PAUSE')).toBeInTheDocument();
    });

    it('should show resume and restart buttons when in PAUSED state', () => {
      const onStart = vi.fn();
      const onPause = vi.fn();
      const onRestart = vi.fn();
      render(
        <ControlBar
          gameState="PAUSED"
          onStart={onStart}
          onPause={onPause}
          onRestart={onRestart}
        />
      );

      expect(screen.queryByTestId('control-start')).not.toBeInTheDocument();
      expect(screen.getByTestId('control-pause')).toBeInTheDocument();
      expect(screen.getByTestId('control-restart')).toBeInTheDocument();
      expect(screen.getByText('RESUME')).toBeInTheDocument();
    });

    it('should call onPause when pause button is clicked', () => {
      const onStart = vi.fn();
      const onPause = vi.fn();
      const onRestart = vi.fn();
      render(
        <ControlBar
          gameState="PLAYING"
          onStart={onStart}
          onPause={onPause}
          onRestart={onRestart}
        />
      );

      fireEvent.click(screen.getByTestId('control-pause'));
      expect(onPause).toHaveBeenCalledTimes(1);
    });

    it('should call onRestart when restart button is clicked', () => {
      const onStart = vi.fn();
      const onPause = vi.fn();
      const onRestart = vi.fn();
      render(
        <ControlBar
          gameState="PLAYING"
          onStart={onStart}
          onPause={onPause}
          onRestart={onRestart}
        />
      );

      fireEvent.click(screen.getByTestId('control-restart'));
      expect(onRestart).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================
  // Game State Integration Tests
  // ============================================
  describe('Game Component Integration', () => {
    it('should start with START screen visible', () => {
      render(<Game />);
      expect(screen.getByTestId('start-screen')).toBeInTheDocument();
    });

    it('should transition from START to PLAYING when start button is clicked', async () => {
      render(<Game />);
      
      fireEvent.click(screen.getByTestId('start-button'));
      
      await waitFor(() => {
        expect(screen.queryByTestId('start-screen')).not.toBeInTheDocument();
        expect(screen.getByTestId('game-container')).toBeInTheDocument();
      });
    });

    it('should show pause overlay when pause is triggered', async () => {
      render(<Game />);
      
      // Start the game
      fireEvent.click(screen.getByTestId('start-button'));
      
      await waitFor(() => {
        expect(screen.queryByTestId('start-screen')).not.toBeInTheDocument();
      });

      // Click pause button
      fireEvent.click(screen.getByTestId('control-pause'));
      
      await waitFor(() => {
        expect(screen.getByTestId('pause-overlay')).toBeInTheDocument();
      });
    });
  });

  // ============================================
  // LocalStorage High Score Tests
  // ============================================
  describe('High Score Management', () => {
    it('should return null when no high score exists', () => {
      expect(getHighScore()).toBeNull();
    });

    it('should save high score to localStorage', () => {
      saveHighScore(10000);
      const highScore = getHighScore();
      expect(highScore).not.toBeNull();
      expect(highScore?.score).toBe(10000);
    });

    it('should not update high score if new score is lower', () => {
      saveHighScore(20000);
      saveHighScore(15000);
      const highScore = getHighScore();
      expect(highScore?.score).toBe(20000);
    });

    it('should update high score if new score is higher', () => {
      saveHighScore(10000);
      saveHighScore(25000);
      const highScore = getHighScore();
      expect(highScore?.score).toBe(25000);
    });

    it('should correctly identify new high score', () => {
      saveHighScore(10000);
      expect(isNewHighScore(15000)).toBe(true);
      expect(isNewHighScore(5000)).toBe(false);
    });

    it('should handle localStorage errors gracefully', () => {
      // Mock localStorage to throw error
      const originalGetItem = Storage.prototype.getItem;
      Storage.prototype.getItem = vi.fn(() => { throw new Error('Storage error'); });
      
      expect(getHighScore()).toBeNull();
      
      // Restore
      Storage.prototype.getItem = originalGetItem;
    });
  });
});
