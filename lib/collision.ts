/**
 * Collision Detection and Game Logic
 * 
 * US-006/US-007: Piece movement, collision detection, line clearing
 */

import type { ActiveTetromino, Position, Rotation, TetrominoType, Cell } from '../types/tetromino';
import type { Board, BoardCell } from '../types/game';
import { BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';
import { TETROMINOS } from './tetrominos';

// Re-export board constants for backwards compatibility
export { BOARD_WIDTH, BOARD_HEIGHT } from '../types/game';

/** Check if a position is within board bounds (alias for isWithinBounds) */
export function isInBounds(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

/** Check if a position is within board bounds */
export function isWithinBounds(x: number, y: number): boolean {
  return x >= 0 && x < BOARD_WIDTH && y >= 0 && y < BOARD_HEIGHT;
}

/** Check if a cell is occupied on the board */
export function isCellOccupied(board: Board, x: number, y: number): boolean {
  if (!isWithinBounds(x, y)) return true; // Out of bounds is treated as occupied
  return board[y][x].filled;
}

/** Get piece cells at a position and rotation */
export function getPieceCells(
  type: TetrominoType,
  rotation: Rotation,
  position: Position
): { x: number; y: number }[] {
  const piece = TETROMINOS[type];
  const cells = piece.rotations[rotation];
  
  return cells.map(([relX, relY]) => ({
    x: position.x + relX,
    y: position.y + relY,
  }));
}

/** Check collision for a piece at a given position and rotation */
export function checkCollision(
  type: TetrominoType,
  rotation: Rotation,
  position: Position,
  board: Board
): boolean;
export function checkCollision(
  type: TetrominoType,
  position: Position,
  rotation: Rotation,
  board: Board
): boolean;
export function checkCollision(
  type: TetrominoType,
  arg2: Rotation | Position,
  arg3: Position | Rotation | Board,
  arg4?: Board
): boolean {
  // Handle both signature variants
  let rotation: Rotation;
  let position: Position;
  let board: Board;
  
  if (typeof arg2 === 'number') {
    // First signature: type, rotation, position, board
    rotation = arg2;
    position = arg3 as Position;
    board = arg4 as Board;
  } else {
    // Second signature: type, position, rotation, board
    position = arg2;
    rotation = arg3 as Rotation;
    board = arg4 as Board;
  }

  const piece = TETROMINOS[type];
  const cells = piece.rotations[rotation];

  for (const [relX, relY] of cells) {
    const x = position.x + relX;
    const y = position.y + relY;

    // Check bounds and collision with locked pieces
    if (!isWithinBounds(x, y) || isCellOccupied(board, x, y)) {
      return true;
    }
  }

  return false;
}

/** Check collision at spawn position (for game over detection) */
export function checkSpawnCollision(
  type: TetrominoType,
  position: Position,
  board: Board
): boolean {
  return checkCollision(type, 0, position, board);
}

/** Try to move a piece by dx, dy - returns new position if valid, null if blocked */
export function tryMove(
  piece: ActiveTetromino,
  dx: number,
  dy: number,
  board: Board
): Position | null {
  const newPosition: Position = {
    x: piece.position.x + dx,
    y: piece.position.y + dy,
  };

  if (checkCollision(piece.type, piece.rotation, newPosition, board)) {
    return null;
  }

  return newPosition;
}

/** Wall kick offsets for rotations (simplified SRS) */
const WALL_KICKS_JLSTZ: Position[][] = [
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: 1 }, { x: 0, y: -2 }, { x: -1, y: -2 }], // 0->1
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: -1 }, { x: 0, y: 2 }, { x: 1, y: 2 }],   // 1->2
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }, { x: 0, y: -2 }, { x: 1, y: -2 }],   // 2->3
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: -1, y: -1 }, { x: 0, y: 2 }, { x: -1, y: 2 }], // 3->0
];

const WALL_KICKS_I: Position[][] = [
  [{ x: 0, y: 0 }, { x: -2, y: 0 }, { x: 1, y: 0 }, { x: -2, y: -1 }, { x: 1, y: 2 }],  // 0->1
  [{ x: 0, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 2 }, { x: 2, y: -1 }],  // 1->2
  [{ x: 0, y: 0 }, { x: 2, y: 0 }, { x: -1, y: 0 }, { x: 2, y: 1 }, { x: -1, y: -2 }],  // 2->3
  [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: -2, y: 0 }, { x: 1, y: -2 }, { x: -2, y: 1 }],  // 3->0
];

/** Get wall kick offsets for a piece type */
function getWallKicks(type: TetrominoType, fromRotation: Rotation, clockwise: boolean): Position[] {
  const kicks = type === 'I' ? WALL_KICKS_I : WALL_KICKS_JLSTZ;
  const rotationIndex = clockwise ? fromRotation : (fromRotation + 3) % 4;
  return kicks[rotationIndex];
}

/** Try simple rotation without wall kicks */
export function tryRotate(
  piece: ActiveTetromino,
  clockwise: boolean,
  board: Board
): Rotation | null {
  const newRotation = (piece.rotation + (clockwise ? 1 : 3)) % 4 as Rotation;
  
  if (!checkCollision(piece.type, newRotation, piece.position, board)) {
    return newRotation;
  }
  
  return null;
}

/** Try to rotate a piece with wall kicks */
export function tryRotateWithKick(
  piece: ActiveTetromino,
  clockwise: boolean,
  board: Board
): { rotation: Rotation; position: Position } | null {
  const newRotation = (piece.rotation + (clockwise ? 1 : 3)) % 4 as Rotation;
  const kicks = getWallKicks(piece.type, piece.rotation, clockwise);

  for (const kick of kicks) {
    const newPosition: Position = {
      x: piece.position.x + kick.x,
      y: piece.position.y + kick.y,
    };

    if (!checkCollision(piece.type, newRotation, newPosition, board)) {
      return { rotation: newRotation, position: newPosition };
    }
  }

  return null;
}

/** Get the drop position (where the piece would land) */
export function getDropPosition(
  piece: ActiveTetromino,
  board: Board
): Position {
  let y = piece.position.y;

  while (true) {
    const newY = y + 1;
    const testPosition: Position = { x: piece.position.x, y: newY };
    
    if (checkCollision(piece.type, piece.rotation, testPosition, board)) {
      break;
    }
    
    y = newY;
  }

  return { x: piece.position.x, y };
}

/** Lock a piece onto the board (alias for lockPiece) */
export function lockPieceToBoard(piece: ActiveTetromino, board: Board): Board {
  return lockPiece(piece, board);
}

/** Lock a piece onto the board */
export function lockPiece(piece: ActiveTetromino, board: Board): Board {
  const newBoard: Board = board.map(row => [...row]);
  const pieceData = TETROMINOS[piece.type];
  const cells = pieceData.rotations[piece.rotation];

  for (const [relX, relY] of cells) {
    const x = piece.position.x + relX;
    const y = piece.position.y + relY;

    if (isWithinBounds(x, y)) {
      newBoard[y][x] = { filled: true, type: piece.type };
    }
  }

  return newBoard;
}

/** Check if a row is empty */
export function isRowEmpty(board: Board, row: number): boolean {
  return board[row].every(cell => !cell.filled);
}

/** Find all complete lines on the board */
export function findCompleteLines(board: Board): number[] {
  const completeLines: number[] = [];

  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (board[row].every(cell => cell.filled)) {
      completeLines.push(row);
    }
  }

  return completeLines;
}

/** Clear lines and return updated board */
export function clearLines(board: Board, linesToClear: number[]): { board: Board; linesCleared: number } {
  if (linesToClear.length === 0) {
    return { board, linesCleared: 0 };
  }

  const newBoard: Board = board.map(row => [...row]);

  // Sort in descending order to clear from bottom to top
  const sortedLines = [...linesToClear].sort((a, b) => b - a);

  for (const line of sortedLines) {
    // Remove the completed line
    newBoard.splice(line, 1);
    // Add a new empty line at the top
    newBoard.unshift(Array(BOARD_WIDTH).fill(null).map(() => ({ filled: false } as BoardCell)));
  }

  return { board: newBoard, linesCleared: linesToClear.length };
}

/** Get the highest row that contains a block (lowest index = highest on screen) */
export function getHighestBlockRow(board: Board): number | null {
  for (let row = 0; row < BOARD_HEIGHT; row++) {
    if (board[row].some(cell => cell.filled)) {
      return row;
    }
  }
  return null;
}
