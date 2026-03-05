import { create } from 'zustand';
import {
  Board,
  GameState,
  GameStatus,
  Position,
  Tetromino,
  TetrominoType,
  createEmptyBoard,
  createTetromino,
  getRandomTetrominoType,
  TETROMINO_SHAPES,
} from '../types/game';

/** Game store state interface */
interface GameStoreState extends GameState {
  // Actions
  startGame: () => void;
  pauseGame: () => void;
  resumeGame: () => void;
  resetGame: () => void;
  gameOver: () => void;
  
  // Piece actions
  spawnPiece: () => void;
  movePiece: (direction: 'left' | 'right' | 'down') => boolean;
  rotatePiece: () => boolean;
  hardDrop: () => void;
  holdPieceAction: () => void;
  
  // Board actions
  lockPiece: () => void;
  clearLines: () => number;
  
  // Internal helpers
  isValidPosition: (piece: Tetromino, newPosition: Position, newRotation?: number) => boolean;
}

/** Number of next pieces to show in the queue */
const NEXT_PIECES_COUNT = 3;

/** Calculate score based on lines cleared and level */
const calculateScore = (linesCleared: number, level: number): number => {
  const basePoints: Record<number, number> = {
    1: 100,
    2: 300,
    3: 600,
    4: 1000,
  };
  return (basePoints[linesCleared] || 0) * level;
};

/** Generate next pieces queue */
const generateNextPieces = (count: number): TetrominoType[] => {
  return Array(count).fill(null).map(() => getRandomTetrominoType());
};

/** Initial game state */
const getInitialState = (): GameState => ({
  board: createEmptyBoard(),
  currentPiece: null,
  nextPieces: generateNextPieces(NEXT_PIECES_COUNT),
  holdPiece: null,
  holdUsed: false,
  score: 0,
  level: 1,
  linesCleared: 0,
  status: 'menu' as GameStatus,
  startTime: null,
  pausedTime: 0,
});

/** Create the game store */
export const useGameStore = create<GameStoreState>((set, get) => ({
  ...getInitialState(),

  /** Start a new game */
  startGame: () => {
    const newNextPieces = generateNextPieces(NEXT_PIECES_COUNT);
    const firstPiece = createTetromino(newNextPieces[0]);
    const remainingPieces = [...newNextPieces.slice(1), getRandomTetrominoType()];
    
    set({
      ...getInitialState(),
      status: 'playing',
      startTime: Date.now(),
      currentPiece: firstPiece,
      nextPieces: remainingPieces,
    });
  },

  /** Pause the game */
  pauseGame: () => {
    const { status } = get();
    if (status === 'playing') {
      set({ status: 'paused' });
    }
  },

  /** Resume the game */
  resumeGame: () => {
    const { status, pausedTime, startTime } = get();
    if (status === 'paused' && startTime) {
      const pauseDuration = Date.now() - (startTime + pausedTime);
      set({
        status: 'playing',
        pausedTime: pausedTime + pauseDuration,
      });
    }
  },

  /** Reset the game to menu */
  resetGame: () => {
    set(getInitialState());
  },

  /** End the game */
  gameOver: () => {
    set({ status: 'gameover' });
  },

  /** Check if a position is valid for the current piece */
  isValidPosition: (piece: Tetromino, newPosition: Position, newRotation?: number): boolean => {
    const { board } = get();
    const rotation = newRotation ?? piece.rotation;
    const shape = TETROMINO_SHAPES[piece.type][rotation];
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const boardX = newPosition.x + x;
          const boardY = newPosition.y + y;
          
          // Check boundaries
          if (boardX < 0 || boardX >= 10 || boardY >= 20) {
            return false;
          }
          
          // Check collision with locked pieces (only if within board)
          if (boardY >= 0 && board[boardY][boardX].filled) {
            return false;
          }
        }
      }
    }
    return true;
  },

  /** Spawn a new piece from the next queue */
  spawnPiece: () => {
    const { nextPieces, isValidPosition } = get();
    const newPiece = createTetromino(nextPieces[0]);
    
    // Check if the new piece can be placed
    if (!isValidPosition(newPiece, newPiece.position)) {
      set({ status: 'gameover' });
      return;
    }
    
    set({
      currentPiece: newPiece,
      nextPieces: [...nextPieces.slice(1), getRandomTetrominoType()],
      holdUsed: false,
    });
  },

  /** Move the current piece */
  movePiece: (direction: 'left' | 'right' | 'down'): boolean => {
    const { currentPiece, isValidPosition, lockPiece } = get();
    if (!currentPiece) return false;
    
    const newPosition = { ...currentPiece.position };
    
    switch (direction) {
      case 'left':
        newPosition.x -= 1;
        break;
      case 'right':
        newPosition.x += 1;
        break;
      case 'down':
        newPosition.y += 1;
        break;
    }
    
    if (isValidPosition(currentPiece, newPosition)) {
      set({ currentPiece: { ...currentPiece, position: newPosition } });
      return true;
    }
    
    // If moving down and collision occurs, lock the piece
    if (direction === 'down') {
      lockPiece();
    }
    
    return false;
  },

  /** Rotate the current piece */
  rotatePiece: (): boolean => {
    const { currentPiece, isValidPosition } = get();
    if (!currentPiece) return false;
    
    // O piece doesn't rotate
    if (currentPiece.type === 'O') return false;
    
    const newRotation = (currentPiece.rotation + 1) % 4;
    
    // Try basic rotation
    if (isValidPosition(currentPiece, currentPiece.position, newRotation)) {
      set({
        currentPiece: {
          ...currentPiece,
          rotation: newRotation,
          shape: TETROMINO_SHAPES[currentPiece.type][newRotation],
        },
      });
      return true;
    }
    
    // Try wall kicks (basic implementation)
    const kicks = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: -1 },
      { x: 1, y: -1 },
      { x: -1, y: -1 },
    ];
    
    for (const kick of kicks) {
      const newPosition = {
        x: currentPiece.position.x + kick.x,
        y: currentPiece.position.y + kick.y,
      };
      if (isValidPosition(currentPiece, newPosition, newRotation)) {
        set({
          currentPiece: {
            ...currentPiece,
            position: newPosition,
            rotation: newRotation,
            shape: TETROMINO_SHAPES[currentPiece.type][newRotation],
          },
        });
        return true;
      }
    }
    
    return false;
  },

  /** Hard drop the current piece */
  hardDrop: () => {
    const { currentPiece, isValidPosition, lockPiece } = get();
    if (!currentPiece) return;
    
    let dropDistance = 0;
    const newPosition = { ...currentPiece.position };
    
    while (isValidPosition(currentPiece, { ...newPosition, y: newPosition.y + 1 })) {
      newPosition.y += 1;
      dropDistance++;
    }
    
    set({
      currentPiece: { ...currentPiece, position: newPosition },
    });
    
    // Add bonus points for hard drop
    if (dropDistance > 0) {
      set((state) => ({ score: state.score + dropDistance * 2 }));
    }
    
    lockPiece();
  },

  /** Hold the current piece */
  holdPieceAction: () => {
    const { currentPiece, holdPiece, holdUsed } = get();
    if (!currentPiece || holdUsed) return;
    
    if (holdPiece === null) {
      // First hold - swap with next piece
      const { nextPieces } = get();
      set({
        holdPiece: currentPiece.type,
        currentPiece: createTetromino(nextPieces[0]),
        nextPieces: [...nextPieces.slice(1), getRandomTetrominoType()],
        holdUsed: true,
      });
    } else {
      // Swap with held piece
      set({
        currentPiece: createTetromino(holdPiece),
        holdPiece: currentPiece.type,
        holdUsed: true,
      });
    }
  },

  /** Lock the current piece to the board */
  lockPiece: () => {
    const { currentPiece, board, clearLines, spawnPiece, gameOver } = get();
    if (!currentPiece) return;
    
    const newBoard: Board = board.map((row) => [...row]);
    const shape = currentPiece.shape;
    
    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const boardX = currentPiece.position.x + x;
          const boardY = currentPiece.position.y + y;
          
          if (boardY >= 0 && boardY < 20 && boardX >= 0 && boardX < 10) {
            newBoard[boardY][boardX] = {
              filled: true,
              type: currentPiece.type,
            };
          }
        }
      }
    }
    
    set({ board: newBoard, currentPiece: null });
    
    // Clear lines and update score
    clearLines();
    
    // Check for game over (piece locked above visible board)
    for (let x = 0; x < 10; x++) {
      if (newBoard[0][x].filled) {
        gameOver();
        return;
      }
    }
    
    // Spawn next piece
    spawnPiece();
  },

  /** Clear completed lines and return count */
  clearLines: (): number => {
    const { board, level, linesCleared: totalLines } = get();
    let linesClearedCount = 0;
    const newBoard: Board = [];
    
    // Keep non-full rows
    for (let y = 0; y < board.length; y++) {
      const isFull = board[y].every((cell) => cell.filled);
      if (!isFull) {
        newBoard.push([...board[y]]);
      } else {
        linesClearedCount++;
      }
    }
    
    // Add empty rows at the top
    while (newBoard.length < 20) {
      newBoard.unshift(
        Array(10)
          .fill(null)
          .map(() => ({ filled: false, type: null }))
      );
    }
    
    if (linesClearedCount > 0) {
      const newTotalLines = totalLines + linesClearedCount;
      const newLevel = Math.floor(newTotalLines / 10) + 1;
      const scoreIncrease = calculateScore(linesClearedCount, level);
      
      set({
        board: newBoard,
        linesCleared: newTotalLines,
        level: newLevel,
        score: get().score + scoreIncrease,
      });
    }
    
    return linesClearedCount;
  },
}));
