/**
 * Score Board Component
 * 
 * US-008: Displays score, level, and lines cleared
 */

import type { Score } from '../hooks/useGameStore';

interface ScoreBoardProps {
  /** Current score state */
  score: Score;
  /** High score from localStorage */
  highScore: number;
}

/**
 * ScoreBoard component - displays game statistics
 */
export function ScoreBoard({ score, highScore }: ScoreBoardProps) {
  return (
    <div className="flex flex-col items-center space-y-4">
      <h3 className="text-green-400 font-bold text-sm uppercase tracking-wider">Stats</h3>
      
      <div className="w-32 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 space-y-3">
        {/* Score */}
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Score</p>
          <p className="text-white font-mono font-bold text-lg tabular-nums">
            {score.points.toLocaleString()}
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-700/50" />
        
        {/* Level */}
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Level</p>
          <p className="text-yellow-400 font-mono font-bold text-xl tabular-nums">
            {score.level}
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-700/50" />
        
        {/* Lines */}
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wider">Lines</p>
          <p className="text-cyan-400 font-mono font-bold text-lg tabular-nums">
            {score.lines}
          </p>
        </div>
        
        {/* Divider */}
        <div className="border-t border-slate-700/50" />
        
        {/* High Score */}
        <div className="text-center">
          <p className="text-slate-400 text-xs uppercase tracking-wider">High Score</p>
          <p className="text-amber-400 font-mono font-bold text-sm tabular-nums">
            {highScore.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ScoreBoard;
