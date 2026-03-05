/**
 * Game State Types
 * 
 * US-010: Game states - Menu, Pause, Game Over screens
 */

/** Game state machine states */
export type GameState = 'START' | 'PLAYING' | 'PAUSED' | 'GAME_OVER';

/** Score data for game over screen */
export interface ScoreData {
  score: number;
  level: number;
  lines: number;
  maxCombo: number;
}

/** High score storage */
export interface HighScore {
  score: number;
  date: string;
}

/** Local storage key for high score */
export const HIGH_SCORE_KEY = 'tetris3d-highscore';

/**
 * Get high score from localStorage
 */
export function getHighScore(): HighScore | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(HIGH_SCORE_KEY);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

/**
 * Save high score to localStorage
 */
export function saveHighScore(score: number): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getHighScore();
    if (!current || score > current.score) {
      localStorage.setItem(
        HIGH_SCORE_KEY,
        JSON.stringify({ score, date: new Date().toISOString() })
      );
    }
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Check if score is a new high score
 */
export function isNewHighScore(score: number): boolean {
  const highScore = getHighScore();
  return !highScore || score > highScore.score;
}
