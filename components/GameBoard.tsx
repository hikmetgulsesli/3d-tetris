/**
 * Game Board 3D Component
 * 
 * US-008: Renders the 3D Tetris game board with ghost piece
 */

'use client';

import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Block, GhostBlock, getBlockPositions } from './Block';
import type { TetrominoType, ActiveTetromino, Position } from '../types/tetromino';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../hooks/useGameStore';

interface GameBoardProps {
  /** Current game board state */
  board: (TetrominoType | null)[][];
  /** Currently active piece */
  currentPiece: ActiveTetromino | null;
  /** Ghost piece position (where current piece will land) */
  ghostPosition: Position | null;
}

/**
 * Individual board cell component
 */
function BoardCell({ x, y, type }: { x: number; y: number; type: TetrominoType }) {
  // Convert grid coordinates to 3D world coordinates
  // Center the board at (0, 0, 0) with y going up
  const worldX = x - BOARD_WIDTH / 2 + 0.5;
  const worldY = (BOARD_HEIGHT - y) - BOARD_HEIGHT / 2 - 0.5;
  
  return (
    <Block
      position={[worldX, worldY, 0]}
      type={type}
    />
  );
}

/**
 * Current piece component
 */
function CurrentPiece({ piece }: { piece: ActiveTetromino }) {
  const positions = getBlockPositions(piece.type, piece.rotation, piece.position);
  
  return (
    <>
      {positions.map((pos, index) => {
        if (pos.y < 0 || pos.y >= BOARD_HEIGHT || pos.x < 0 || pos.x >= BOARD_WIDTH) {
          return null;
        }
        const worldX = pos.x - BOARD_WIDTH / 2 + 0.5;
        const worldY = (BOARD_HEIGHT - pos.y) - BOARD_HEIGHT / 2 - 0.5;
        
        return (
          <Block
            key={`current-${index}`}
            position={[worldX, worldY, 0]}
            type={piece.type}
          />
        );
      })}
    </>
  );
}

/**
 * Ghost piece component
 */
function GhostPiece({ piece, ghostPosition }: { piece: ActiveTetromino; ghostPosition: Position }) {
  const positions = getBlockPositions(piece.type, piece.rotation, ghostPosition);
  
  return (
    <>
      {positions.map((pos, index) => {
        if (pos.y < 0 || pos.y >= BOARD_HEIGHT || pos.x < 0 || pos.x >= BOARD_WIDTH) {
          return null;
        }
        const worldX = pos.x - BOARD_WIDTH / 2 + 0.5;
        const worldY = (BOARD_HEIGHT - pos.y) - BOARD_HEIGHT / 2 - 0.5;
        
        return (
          <GhostBlock
            key={`ghost-${index}`}
            position={[worldX, worldY, 0]}
            type={piece.type}
          />
        );
      })}
    </>
  );
}

/**
 * Game board grid lines
 */
function GridLines() {
  const points = useMemo(() => {
    const vertices: number[] = [];
    
    // Vertical lines
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      const worldX = x - BOARD_WIDTH / 2;
      vertices.push(
        worldX, -BOARD_HEIGHT / 2, -0.5,
        worldX, BOARD_HEIGHT / 2, -0.5
      );
    }
    
    // Horizontal lines
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      const worldY = y - BOARD_HEIGHT / 2;
      vertices.push(
        -BOARD_WIDTH / 2, worldY, -0.5,
        BOARD_WIDTH / 2, worldY, -0.5
      );
    }
    
    return new Float32Array(vertices);
  }, []);
  
  return (
    <group>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[points, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial color="#3f3f46" opacity={0.3} transparent />
      </lineSegments>
    </group>
  );
}

/**
 * Board container with all locked pieces
 */
function BoardContainer({ board }: { board: (TetrominoType | null)[][] }) {
  const blocks = useMemo(() => {
    const result: { x: number; y: number; type: TetrominoType }[] = [];
    
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        const type = board[y][x];
        if (type) {
          result.push({ x, y, type });
        }
      }
    }
    
    return result;
  }, [board]);
  
  return (
    <>
      {blocks.map((block, index) => (
        <BoardCell
          key={`board-${index}`}
          x={block.x}
          y={block.y}
          type={block.type}
        />
      ))}
    </>
  );
}

/**
 * Main game board scene
 */
function GameScene({ board, currentPiece, ghostPosition }: GameBoardProps) {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.4} />
      
      {/* Main directional light */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={1}
        castShadow
      />
      
      {/* Fill light from opposite side */}
      <directionalLight
        position={[-10, -5, 5]}
        intensity={0.3}
      />
      
      {/* Background stars */}
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={0.5}
      />
      
      {/* Grid lines */}
      <GridLines />
      
      {/* Locked blocks on board */}
      <BoardContainer board={board} />
      
      {/* Ghost piece (shows where piece will land) */}
      {currentPiece && ghostPosition && (
        <GhostPiece piece={currentPiece} ghostPosition={ghostPosition} />
      )}
      
      {/* Current active piece */}
      {currentPiece && <CurrentPiece piece={currentPiece} />}
      
      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={15}
        maxDistance={40}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2}
        target={[0, 0, 0]}
      />
    </>
  );
}

/**
 * GameBoard component - 3D canvas for the Tetris game
 */
export function GameBoard({ board, currentPiece, ghostPosition }: GameBoardProps) {
  return (
    <div className="w-full h-full min-h-[500px]">
      <Canvas
        camera={{
          position: [0, 5, 25],
          fov: 50,
          near: 0.1,
          far: 1000,
        }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
        dpr={[1, 2]}
      >
        <GameScene
          board={board}
          currentPiece={currentPiece}
          ghostPosition={ghostPosition}
        />
      </Canvas>
    </div>
  );
}

export default GameBoard;
