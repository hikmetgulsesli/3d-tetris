/**
 * 3D Tetris Game - Main Page
 * 
 * US-008: Ghost piece, hold piece, and next piece preview
 */

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Dynamically import the game with SSR disabled (Three.js requires browser APIs)
const TetrisGameClient = dynamic(() => import('@/components/TetrisGameClient'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-cyan-400 text-xl font-bold animate-pulse">Loading Tetris 3D...</div>
    </div>
  ),
});

export default function TetrisGame() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-cyan-400 text-xl font-bold animate-pulse">Loading Tetris 3D...</div>
      </div>
    }>
      <TetrisGameClient />
    </Suspense>
  );
}
