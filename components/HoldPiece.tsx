/**
 * Hold Piece Component
 * 
 * US-008: Displays the currently held piece
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { PreviewBlock } from './Block';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINOS } from '../lib/tetrominos';

interface HoldPieceProps {
  /** Currently held tetromino type (null if empty) */
  piece: TetrominoType | null;
  /** Whether hold can be used (disabled after hold until next piece) */
  canHold: boolean;
}

/**
 * 3D Scene for hold piece
 */
function HoldPieceScene({ type }: { type: TetrominoType }) {
  const piece = TETROMINOS[type];
  const cells = piece.rotations[0];
  
  // Calculate center offset for the piece
  const minX = Math.min(...cells.map(([x]) => x));
  const maxX = Math.max(...cells.map(([x]) => x));
  const minY = Math.min(...cells.map(([, y]) => y));
  const maxY = Math.max(...cells.map(([, y]) => y));
  
  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />
      
      {/* Directional light */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Render the held piece */}
      {cells.map(([x, y], index) => (
        <PreviewBlock
          key={`hold-${type}-${index}`}
          position={[(x - centerX) * 0.7, (y - centerY) * 0.7, 0]}
          type={type}
          scale={0.6}
        />
      ))}
    </>
  );
}

/**
 * HoldPiece component - displays the held tetromino
 */
export function HoldPiece({ piece, canHold }: HoldPieceProps) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-purple-400 font-bold text-sm mb-2 uppercase tracking-wider">Hold</h3>
      <div 
        className={`
          w-24 h-24 bg-slate-900/80 backdrop-blur-sm rounded-xl border 
          ${canHold ? 'border-slate-700/50' : 'border-slate-800/50 opacity-50'}
          p-2 flex items-center justify-center
        `}
      >
        {piece ? (
          <Canvas
            camera={{
              position: [0, 0, 6],
              fov: 50,
            }}
            gl={{ antialias: true, alpha: true }}
            dpr={[1, 2]}
          >
            <HoldPieceScene type={piece} />
          </Canvas>
        ) : (
          <span className="text-slate-600 text-xs">Empty</span>
        )}
      </div>
      <p className="text-slate-500 text-xs mt-2">Press C</p>
    </div>
  );
}

export default HoldPiece;
