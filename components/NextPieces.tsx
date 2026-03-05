/**
 * Next Pieces Preview Component
 * 
 * US-008: Displays the next 3 upcoming pieces
 */

'use client';

import { Canvas } from '@react-three/fiber';
import { PreviewBlock } from './Block';
import type { TetrominoType } from '../types/tetromino';
import { TETROMINOS } from '../lib/tetrominos';

interface NextPiecesProps {
  /** Array of next tetromino types */
  pieces: TetrominoType[];
}

/**
 * Single preview piece in 3D
 */
function PreviewPiece({ type, offsetY }: { type: TetrominoType; offsetY: number }) {
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
    <group position={[0, offsetY, 0]}>
      {cells.map(([x, y], index) => (
        <PreviewBlock
          key={`preview-${type}-${index}`}
          position={[(x - centerX) * 0.7, (y - centerY) * 0.7, 0]}
          type={type}
          scale={0.6}
        />
      ))}
    </group>
  );
}

/**
 * 3D Scene for next pieces
 */
function NextPiecesScene({ pieces }: { pieces: TetrominoType[] }) {
  // Show up to 3 pieces
  const displayPieces = pieces.slice(0, 3);
  
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.6} />
      
      {/* Directional light */}
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      
      {/* Render each preview piece */}
      {displayPieces.map((type, index) => (
        <PreviewPiece
          key={`next-${index}-${type}`}
          type={type}
          offsetY={1.5 - index * 2.5}
        />
      ))}
    </>
  );
}

/**
 * NextPieces component - displays the next 3 upcoming tetrominos
 */
export function NextPieces({ pieces }: NextPiecesProps) {
  return (
    <div className="flex flex-col items-center">
      <h3 className="text-cyan-400 font-bold text-sm mb-2 uppercase tracking-wider">Next</h3>
      <div className="w-24 h-64 bg-slate-900/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-2">
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 50,
          }}
          gl={{ antialias: true, alpha: true }}
          dpr={[1, 2]}
        >
          <NextPiecesScene pieces={pieces} />
        </Canvas>
      </div>
    </div>
  );
}

export default NextPieces;
