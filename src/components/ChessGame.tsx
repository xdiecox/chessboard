import React, { useState, useEffect } from 'react';
import { RotateCcw, Play, Edit2, UserPlus, Upload, Image as ImageIcon, RefreshCw, ArrowRight, Trophy, Smile } from 'lucide-react';

// Character definitions
const STAR_SVG = (color: string) => (
  <svg viewBox="0 0 24 24" className={`w-full h-full ${color} drop-shadow-md`}>
    <path 
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" 
      fill="currentColor" 
      stroke="black"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

const PIECE_IMAGES: Record<string, string> = {
  'white-pawn': 'https://lichess1.org/assets/piece/cburnett/wP.svg',
  'white-knight': 'https://lichess1.org/assets/piece/cburnett/wN.svg',
  'white-bishop': 'https://lichess1.org/assets/piece/cburnett/wB.svg',
  'white-rook': 'https://lichess1.org/assets/piece/cburnett/wR.svg',
  'white-queen': 'https://lichess1.org/assets/piece/cburnett/wQ.svg',
  'white-king': 'https://lichess1.org/assets/piece/cburnett/wK.svg',
  'black-pawn': 'https://lichess1.org/assets/piece/cburnett/bP.svg',
  'black-knight': 'https://lichess1.org/assets/piece/cburnett/bN.svg',
  'black-bishop': 'https://lichess1.org/assets/piece/cburnett/bB.svg',
  'black-rook': 'https://lichess1.org/assets/piece/cburnett/bR.svg',
  'black-queen': 'https://lichess1.org/assets/piece/cburnett/bQ.svg',
  'black-king': 'https://lichess1.org/assets/piece/cburnett/bK.svg',
};

const renderPiece = (char: any) => {
  if (char.type === 'star') return STAR_SVG(char.color);
  const imageUrl = PIECE_IMAGES[char.id];
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt={char.id} 
        className="w-full h-full object-contain pointer-events-none" 
        referrerPolicy="no-referrer"
      />
    );
  }
  return null;
};

const CHARACTERS = [
  { id: 'black-pawn', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'black-king', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'king', canMove: true },
  { id: 'black-queen', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'queen', canMove: true },
  { id: 'black-rook', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'rook', canMove: true },
  { id: 'black-bishop', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'bishop', canMove: true },
  { id: 'black-knight', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'knight', canMove: true },
  { id: 'empty-7', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-8', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'white-pawn', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'white-king', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'king', canMove: true },
  { id: 'white-queen', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'queen', canMove: true },
  { id: 'white-rook', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'rook', canMove: true },
  { id: 'white-bishop', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'bishop', canMove: true },
  { id: 'white-knight', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'knight', canMove: true },
  { id: 'star', color: 'text-yellow-400', bg: 'bg-yellow-400', border: 'border-yellow-200', shadow: 'shadow-yellow-900/40', ring: 'ring-yellow-400/60', isEmpty: false, type: 'star', canMove: false },
  { id: 'red-star', color: 'text-green-500', bg: 'bg-green-500', border: 'border-green-300', shadow: 'shadow-green-900/40', ring: 'ring-green-500/60', isEmpty: false, type: 'star', canMove: false },
];

const WORLDS_CONFIG = [
  { id: 'pawn', name: 'Mundo Peón', pieceId: 'white-pawn', type: 'pawn' },
  { id: 'king', name: 'Mundo Rey', pieceId: 'white-king', type: 'king' },
  { id: 'rook', name: 'Mundo Torre', pieceId: 'white-rook', type: 'rook' },
  { id: 'bishop', name: 'Mundo Alfil', pieceId: 'white-bishop', type: 'bishop' },
  { id: 'queen', name: 'Mundo Dama', pieceId: 'white-queen', type: 'queen' },
  { id: 'knight', name: 'Mundo Caballo', pieceId: 'white-knight', type: 'knight' }
];

const BLACK_WORLDS_CONFIG = [
  { id: 'bpawn', name: 'Mundo Peón Negro', pieceId: 'white-pawn', type: 'pawn' },
  { id: 'bking', name: 'Mundo Rey Negro', pieceId: 'white-king', type: 'king' },
  { id: 'brook', name: 'Mundo Torre Negro', pieceId: 'white-rook', type: 'rook' },
  { id: 'bbishop', name: 'Mundo Alfil Negro', pieceId: 'white-bishop', type: 'bishop' },
  { id: 'bqueen', name: 'Mundo Dama Negro', pieceId: 'white-queen', type: 'queen' },
  { id: 'bknight', name: 'Mundo Caballo Negro', pieceId: 'white-knight', type: 'knight' }
];

const INITIAL_BOARD = Array(8).fill(null).map(() => Array(8).fill(''));

type Position = { row: number; col: number };

export default function ChessGame() {
  const [board, setBoard] = useState<string[][]>(INITIAL_BOARD.map(row => [...row]));
  const [selected, setSelected] = useState<Position | null>(null);
  const [isEditorMode, setIsEditorMode] = useState(true);
  const [activeCharId, setActiveCharId] = useState(CHARACTERS[0].id);
  const [playerImage, setPlayerImage] = useState<string | null>(null);
  const [capturedChars, setCapturedChars] = useState<string[]>([]);
  const [isCapturing, setIsCapturing] = useState(false);
  const [currentWorld, setCurrentWorld] = useState<{type: string, level: number, mode: 'stars' | 'black'} | null>(null);
  const [showVictory, setShowVictory] = useState(false);

  const playVictorySound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.1, audioCtx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + i * 0.1 + 0.4);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(audioCtx.currentTime + i * 0.1);
        osc.stop(audioCtx.currentTime + i * 0.1 + 0.4);
      });
    } catch (e) {}
  };

  const playCaptureSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // First note (lower)
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      gain1.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.2);
      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);
      osc1.start();
      osc1.stop(audioCtx.currentTime + 0.2);

      // Second note (higher, slightly delayed)
      setTimeout(() => {
        const osc2 = audioCtx.createOscillator();
        const gain2 = audioCtx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, audioCtx.currentTime); // E5
        gain2.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
        osc2.connect(gain2);
        gain2.connect(audioCtx.destination);
        osc2.start();
        osc2.stop(audioCtx.currentTime + 0.3);
      }, 50);

      // Third note (even higher)
      setTimeout(() => {
        const osc3 = audioCtx.createOscillator();
        const gain3 = audioCtx.createGain();
        osc3.type = 'sine';
        osc3.frequency.setValueAtTime(783.99, audioCtx.currentTime); // G5
        gain3.gain.setValueAtTime(0.1, audioCtx.currentTime);
        gain3.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
        osc3.connect(gain3);
        gain3.connect(audioCtx.destination);
        osc3.start();
        osc3.stop(audioCtx.currentTime + 0.4);
      }, 100);

    } catch (e) {
      console.error('Audio context error:', e);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPlayerImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const playPopSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(600, audioCtx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const playToggleSound = (isGameMode: boolean) => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isGameMode ? 660 : 440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.1);
    } catch (e) {}
  };

  const getCharStyles = (id: string) => CHARACTERS.find(c => c.id === id) || CHARACTERS[0];

  const isValidMove = (from: Position, to: Position): { valid: boolean; isCapture: boolean } => {
    const fromCharId = board[from.row][from.col];
    const toCharId = board[to.row][to.col];
    const fromChar = getCharStyles(fromCharId);
    const toChar = toCharId ? getCharStyles(toCharId) : null;

    if (!fromChar || fromChar.isEmpty) return { valid: false, isCapture: false };

    // Basic rule: cannot capture same color
    if (toChar && !toChar.isEmpty && fromChar.color === toChar.color) {
      return { valid: false, isCapture: false };
    }

    const rowDiff = to.row - from.row;
    const colDiff = to.col - from.col;
    const absRowDiff = Math.abs(rowDiff);
    const absColDiff = Math.abs(colDiff);

    if (fromChar.type === 'pawn') {
      const direction = fromChar.id.startsWith('black') ? 1 : -1;
      // Pawn movement: one square in direction (only if empty)
      const isForward = rowDiff === direction && colDiff === 0 && !toChar;
      // Pawn capture: one square diagonally in direction
      const isCapture = rowDiff === direction && absColDiff === 1 && toChar && !toChar.isEmpty;
      return { valid: isForward || isCapture, isCapture: !!isCapture };
    }

    if (fromChar.type === 'king') {
      // King movement: one square in any direction
      const isOneSquare = absRowDiff <= 1 && absColDiff <= 1 && (absRowDiff !== 0 || absColDiff !== 0);
      if (!isOneSquare) return { valid: false, isCapture: false };

      // Cannot capture another King
      if (toChar && toChar.type === 'king') return { valid: false, isCapture: false };

      // Rule: must always be separated from another King with an empty square
      // Check if the target position is adjacent to any other King
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          const checkRow = to.row + r;
          const checkCol = to.col + c;
          // Skip the current "to" square itself (it's where the king is moving)
          if (r === 0 && c === 0) continue;
          
          if (checkRow >= 0 && checkRow < 8 && checkCol >= 0 && checkCol < 8) {
            const otherCharId = board[checkRow][checkCol];
            // If it's the king's original position, we don't count it (it will be empty)
            if (checkRow === from.row && checkCol === from.col) continue;

            if (otherCharId) {
              const otherChar = getCharStyles(otherCharId);
              if (otherChar.type === 'king') return { valid: false, isCapture: false };
            }
          }
        }
      }

      return { valid: true, isCapture: !!toChar };
    }

    if (fromChar.type === 'knight') {
      // Knight movement: "L" shape (2 in one direction, 1 in the other)
      const isLShape = (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
      if (!isLShape) return { valid: false, isCapture: false };
      
      return { valid: true, isCapture: !!toChar };
    }

    if (fromChar.type === 'rook') {
      // Rook movement: any number of squares horizontally or vertically
      const isStraight = rowDiff === 0 || colDiff === 0;
      if (!isStraight) return { valid: false, isCapture: false };

      // Check for path obstruction
      const rowStep = rowDiff === 0 ? 0 : rowDiff / absRowDiff;
      const colStep = colDiff === 0 ? 0 : colDiff / absColDiff;
      
      let currentRow = from.row + rowStep;
      let currentCol = from.col + colStep;
      
      while (currentRow !== to.row || currentCol !== to.col) {
        if (board[currentRow][currentCol]) {
          return { valid: false, isCapture: false };
        }
        currentRow += rowStep;
        currentCol += colStep;
      }
      
      return { valid: true, isCapture: !!toChar };
    }

    if (fromChar.type === 'queen') {
      // Queen movement: combines Rook and Bishop
      const isStraight = rowDiff === 0 || colDiff === 0;
      const isDiagonal = absRowDiff === absColDiff;
      
      if (!isStraight && !isDiagonal) return { valid: false, isCapture: false };

      // Check for path obstruction
      const rowStep = rowDiff === 0 ? 0 : rowDiff / (absRowDiff || 1);
      const colStep = colDiff === 0 ? 0 : colDiff / (absColDiff || 1);
      
      let currentRow = from.row + rowStep;
      let currentCol = from.col + colStep;
      
      while (currentRow !== to.row || currentCol !== to.col) {
        if (board[currentRow][currentCol]) {
          return { valid: false, isCapture: false };
        }
        currentRow += rowStep;
        currentCol += colStep;
      }
      
      return { valid: true, isCapture: !!toChar };
    }

    if (fromChar.type === 'knight') {
      // Knight movement: L-shape (2 in one direction, 1 in the other)
      const isLShape = (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
      if (!isLShape) return { valid: false, isCapture: false };
      
      return { valid: true, isCapture: !!toChar };
    }

    if (fromChar.type === 'bishop') {
      // Bishop movement: any number of squares diagonally
      const isDiagonal = absRowDiff === absColDiff;
      if (!isDiagonal) return { valid: false, isCapture: false };

      // Check for path obstruction
      const rowStep = rowDiff / absRowDiff;
      const colStep = colDiff / absColDiff;

      let currentRow = from.row + rowStep;
      let currentCol = from.col + colStep;

      while (currentRow !== to.row || currentCol !== to.col) {
        if (board[currentRow][currentCol]) {
          return { valid: false, isCapture: false };
        }
        currentRow += rowStep;
        currentCol += colStep;
      }

      return { valid: true, isCapture: !!toChar };
    }

    return { valid: false, isCapture: false };
  };

  const handleSquareClick = (row: number, col: number) => {
    if (isEditorMode) {
      const newBoard = board.map(r => [...r]);
      if (newBoard[row][col] === activeCharId) {
        newBoard[row][col] = '';
      } else {
        newBoard[row][col] = activeCharId;
        playPopSound();
      }
      setBoard(newBoard);
      return;
    }

    const charId = board[row][col];
    const charDef = CHARACTERS.find(c => c.id === charId);

    if (selected) {
      if (selected.row === row && selected.col === col) {
        setSelected(null);
        return;
      }

      const moveResult = isValidMove(selected, { row, col });

      if (moveResult.valid) {
        const movingCharId = board[selected.row][selected.col];
        const capturedCharId = board[row][col];
        
        if (moveResult.isCapture && capturedCharId) {
          setCapturedChars([capturedCharId]);
          playCaptureSound();
          setIsCapturing(true);
          setTimeout(() => setIsCapturing(false), 300);
        } else {
          playPopSound();
        }

        const newBoard = board.map(r => [...r]);
        newBoard[selected.row][selected.col] = '';
        newBoard[row][col] = movingCharId;

        // Check for victory
        const isTarget = (cellId: string) => {
          if (!cellId) return false;
          if (currentWorld?.mode === 'stars') return cellId === 'star';
          return cellId.startsWith('black-') || cellId === 'star';
        };
        const remainingTargets = newBoard.flat().filter(isTarget).length;
        const movingChar = getCharStyles(movingCharId);
        const reachedEnd = movingChar.type === 'pawn' && (
          (movingCharId.startsWith('white') && row === 0) || 
          (movingCharId.startsWith('black') && row === 7)
        );

        if (currentWorld && (remainingTargets === 0 || reachedEnd)) {
          setTimeout(() => {
            setShowVictory(true);
            playVictorySound();
          }, 600);
        }

        setBoard(newBoard);
        setSelected(null);
      } else {
        if (charId && charDef?.canMove) {
          setSelected({ row, col });
          playPopSound();
        } else {
          setSelected(null);
        }
      }
    } else {
      if (charId && charDef?.canMove) {
        setSelected({ row, col });
        playPopSound();
      }
    }
  };

  const handleDragStart = (e: React.DragEvent, row: number, col: number) => {
    const charId = board[row][col];
    const charDef = CHARACTERS.find(c => c.id === charId);
    
    if (charId && (isEditorMode || charDef?.canMove)) {
      setSelected({ row, col });
      e.dataTransfer.effectAllowed = 'move';
      // Create a ghost image or just let default happen
    } else {
      e.preventDefault();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, row: number, col: number) => {
    e.preventDefault();
    if (selected && (selected.row !== row || selected.col !== col)) {
      handleSquareClick(row, col);
    }
  };

  const playResetSound = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {}
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD.map(row => [...row]));
    setSelected(null);
    setIsEditorMode(true);
    setCapturedChars([]);
    setCurrentWorld(null);
    setShowVictory(false);
    playResetSound();
  };

  const generateProceduralWorld = (type: string, level: number, mode: 'stars' | 'black') => {
    const newBoard = INITIAL_BOARD.map(row => [...row]);
    let currentRow: number, currentCol: number;
    const pieceId = `white-${type}`;
    
    // Start position
    if (type === 'pawn') {
      currentRow = 7;
      currentCol = Math.floor(Math.random() * 8);
    } else {
      currentRow = Math.floor(Math.random() * 8);
      currentCol = Math.floor(Math.random() * 8);
    }
    
    newBoard[currentRow][currentCol] = pieceId;
    const targetsToPlace = type === 'pawn' ? 7 : 10;
    let placedTargets = 0;
    let attempts = 0;
    const maxAttempts = 200;

    // Define the piece pool for Soldiers mode as requested:
    // 2 rooks, 2 bishops, 2 knights, 2 pawns, 1 queen, 1 star
    const soldiersPool = [
      'black-rook', 'black-rook',
      'black-bishop', 'black-bishop',
      'black-knight', 'black-knight',
      'black-pawn', 'black-pawn',
      'black-queen',
      'star'
    ].sort(() => Math.random() - 0.5);

    // Simulate moves to place targets (guarantees solvability)
    while (placedTargets < targetsToPlace && attempts < maxAttempts) {
      attempts++;
      const possibleMoves: Position[] = [];
      
      // Check all squares for valid moves from current virtual position
      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          // Simplified move check for generator
          const from = { row: currentRow, col: currentCol };
          const to = { row: r, col: c };
          
          const rowDiff = to.row - from.row;
          const colDiff = to.col - from.col;
          const absRowDiff = Math.abs(rowDiff);
          const absColDiff = Math.abs(colDiff);

          let valid = false;
          if (type === 'pawn') {
            const direction = -1; // White pawn always in these worlds
            valid = rowDiff === direction && absColDiff === 1;
          } else if (type === 'king') {
            valid = absRowDiff <= 1 && absColDiff <= 1 && (absRowDiff !== 0 || absColDiff !== 0);
          } else if (type === 'knight') {
            valid = (absRowDiff === 2 && absColDiff === 1) || (absRowDiff === 1 && absColDiff === 2);
          } else if (type === 'rook') {
            valid = rowDiff === 0 || colDiff === 0;
          } else if (type === 'bishop') {
            valid = absRowDiff === absColDiff;
          } else if (type === 'queen') {
            valid = rowDiff === 0 || colDiff === 0 || absRowDiff === absColDiff;
          }

          if (valid && newBoard[r][c] === '') {
            possibleMoves.push({ row: r, col: c });
          }
        }
      }

      if (possibleMoves.length > 0) {
        const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
        if (mode === 'stars') {
          newBoard[move.row][move.col] = 'star';
        } else {
          // Use the predefined pool for Soldiers mode
          const pieceFromPool = soldiersPool[placedTargets % soldiersPool.length];
          newBoard[move.row][move.col] = pieceFromPool;
        }
        currentRow = move.row;
        currentCol = move.col;
        placedTargets++;
      } else {
        if (type === 'pawn') break;
        currentRow = Math.floor(Math.random() * 8);
        currentCol = Math.floor(Math.random() * 8);
      }
    }

    return newBoard;
  };

  const loadWorld = (worldType: string, level: number = 1, mode: 'stars' | 'black' = 'stars') => {
    const newBoard = generateProceduralWorld(worldType, level, mode);
    setBoard(newBoard);
    setSelected(null);
    setIsEditorMode(false);
    setCapturedChars([]);
    setCurrentWorld({ type: worldType, level, mode });
    setShowVictory(false);
    playToggleSound(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-2 md:p-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header - Removed Title */}

        <div className="w-full flex flex-col items-center justify-center gap-2">
          
          <div className="flex flex-row items-start gap-4 sm:gap-6 md:gap-8">
            {/* Left Area: Worlds + Controls */}
            <div className="flex flex-col gap-4 w-[72px] sm:w-[92px] md:w-[112px] mt-16">
              <div className="flex flex-row items-start gap-2 sm:gap-3 md:gap-4 w-full">
                {/* Left Sidebar 1: Black Worlds */}
                <div className="flex flex-col gap-2 pt-2 items-center flex-1">
                  <div className="text-[7px] sm:text-[8px] font-bold text-zinc-600 uppercase tracking-[0.2em] mb-1 text-center">Soldiers</div>
                  {BLACK_WORLDS_CONFIG.map((world) => {
                    const char = getCharStyles(world.pieceId);
                    const isActive = currentWorld?.type === world.type && currentWorld?.mode === 'black';
                    return (
                      <button
                        key={world.id}
                        onClick={() => loadWorld(world.type, 1, 'black')}
                        className={`
                          group relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-zinc-900/50 border rounded-xl flex items-center justify-center transition-all active:scale-95 overflow-hidden
                          ${isActive ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-zinc-800/50 hover:bg-zinc-800'}
                        `}
                        title={world.name}
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'}`}>
                          {renderPiece(char)}
                        </div>
                        {isActive && (
                          <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-black px-1 rounded-bl-md">
                            L{currentWorld.level}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors" />
                      </button>
                    );
                  })}
                </div>

                {/* Left Sidebar 2: Star Worlds */}
                <div className="flex flex-col gap-2 pt-2 items-center flex-1">
                  <div className="text-[7px] sm:text-[8px] font-bold text-yellow-400 uppercase tracking-[0.2em] mb-1 text-center animate-yellow-glow">Stars</div>
                  {WORLDS_CONFIG.map((world) => {
                    const char = getCharStyles(world.pieceId);
                    const isActive = currentWorld?.type === world.type && currentWorld?.mode === 'stars';
                    return (
                      <button
                        key={world.id}
                        onClick={() => loadWorld(world.type, 1, 'stars')}
                        className={`
                          group relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-zinc-900/50 border rounded-xl flex items-center justify-center transition-all active:scale-95 overflow-hidden
                          ${isActive ? 'border-red-600 shadow-[0_0_15px_rgba(220,38,38,0.2)]' : 'border-zinc-800/50 hover:bg-zinc-800'}
                        `}
                        title={world.name}
                      >
                        <div className={`w-5 h-5 sm:w-6 sm:h-6 transition-opacity ${isActive ? 'opacity-100' : 'opacity-40 group-hover:opacity-100'} animate-yellow-glow`}>
                          {renderPiece(char)}
                        </div>
                        {isActive && (
                          <div className="absolute top-0 right-0 bg-red-600 text-[8px] font-black px-1 rounded-bl-md">
                            L{currentWorld.level}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-red-600/0 group-hover:bg-red-600/5 transition-colors" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mini Captured Lobby - Only in Game Mode */}
              {!isEditorMode && (
                <div className="bg-[#161512] rounded-2xl border border-zinc-800/50 p-2.5 flex flex-col items-center gap-2.5 w-full animate-in fade-in slide-in-from-top-4 duration-500 shadow-xl mt-auto">
                  {/* Win Indicator */}
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_rgba(253,224,71,0.05)]">
                      <Smile size={20} />
                    </div>
                  </div>

                  {/* Horizontal Divider */}
                  <div className="w-6 h-px bg-zinc-800/50 rounded-full" />

                  {/* Captured Pieces - Only last one */}
                  <div className="flex justify-center py-0.5">
                    {capturedChars.length === 0 ? (
                      <div className="w-8 h-8 rounded-lg border border-dashed border-zinc-800/50 flex items-center justify-center opacity-10">
                        <div className="w-3 h-3 rounded-full border border-zinc-700" />
                      </div>
                    ) : (
                      (() => {
                        const charId = capturedChars[capturedChars.length - 1];
                        const charStyles = getCharStyles(charId);
                        return (
                          <div 
                            className="w-10 h-10 rounded-xl bg-white border border-red-100 flex items-center justify-center animate-in animate-glow shadow-inner"
                          >
                            <div className="w-7 h-7">
                              {renderPiece(charStyles)}
                            </div>
                          </div>
                        );
                      })()
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Middle Column: Board + Captured Lobby */}
            <div className="flex flex-col gap-4 items-center">
              {/* Main Board Container */}
              <div className={`relative bg-[#262421] rounded-lg shadow-2xl overflow-hidden border-4 border-[#262421] transition-all duration-100 ${isCapturing ? 'animate-capture-pop ring-4 ring-red-500/50' : ''}`}>
                {isCapturing && (
                  <div className="absolute inset-0 bg-white/5 z-50 pointer-events-none" />
                )}
                
                {/* Top Bar - Always present to keep board fixed */}
                <div className="h-10 sm:h-14 md:h-16 border-b-4 border-[#262421] bg-[#262421]">
                  {isEditorMode ? (
                    <div className="grid grid-cols-8 w-full h-full">
                      {CHARACTERS.slice(0, 8).map((char) => (
                        <div
                          key={char.id}
                          onClick={() => !char.isEmpty && setActiveCharId(char.id)}
                          className={`
                            flex items-center justify-center transition-all duration-300 relative
                            ${char.isEmpty ? 'cursor-default bg-[#1a1816]' : 'cursor-pointer'}
                            ${activeCharId === char.id ? 'bg-[#312e2b]' : (!char.isEmpty ? 'bg-[#262421] hover:bg-[#312e2b]' : '')}
                          `}
                        >
                          {!char.isEmpty && (
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${activeCharId === char.id ? 'scale-110 opacity-100' : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'} transition-all`}>
                              {renderPiece(char)}
                            </div>
                          )}
                          {activeCharId === char.id && !char.isEmpty && (
                            <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 px-4 h-full">
                      <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse shadow-[0_0_8px_rgba(220,38,38,0.5)]" />
                      <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-500">Simulación en curso</span>
                    </div>
                  )}
                </div>

                {/* The 8x8 Grid */}
          <div className="grid grid-cols-8 border-none relative">
            {/* Victory Overlay */}
            {showVictory && (
              <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex flex-col items-center justify-center animate-in fade-in duration-500">
                <div className="bg-zinc-900 border-2 border-red-600/50 p-8 rounded-3xl shadow-[0_0_50px_rgba(220,38,38,0.3)] flex flex-col items-center gap-6 scale-in-center">
                  <div className="relative">
                    <Trophy className="text-yellow-400 w-16 h-16 animate-bounce" />
                    <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse" />
                  </div>
                  
                  <div className="text-center">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-white">¡Mundo Completado!</h2>
                    <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest mt-1">Nivel {currentWorld?.level}</p>
                  </div>

                  <div className="flex gap-4">
                    <button 
                      onClick={() => loadWorld(currentWorld!.type, currentWorld!.level, currentWorld!.mode)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 bg-zinc-800 hover:bg-zinc-700 rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-zinc-700">
                        <RefreshCw className="text-zinc-300 group-hover:rotate-180 transition-transform duration-500" size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Reintentar</span>
                    </button>

                    <button 
                      onClick={() => loadWorld(currentWorld!.type, currentWorld!.level + 1, currentWorld!.mode)}
                      className="flex flex-col items-center gap-2 group"
                    >
                      <div className="w-14 h-14 bg-red-600 hover:bg-red-500 rounded-2xl flex items-center justify-center transition-all active:scale-90 shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                        <ArrowRight className="text-white group-hover:translate-x-1 transition-transform" size={24} />
                      </div>
                      <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Siguiente</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {board.map((row, rowIndex) => (
              row.map((charId, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
                const selectedCharId = selected ? board[selected.row][selected.col] : null;
                
                // Movement rules
                const moveResult = selected ? isValidMove(selected, { row: rowIndex, col: colIndex }) : { valid: false, isCapture: false };
                
                // Only show indicator for non-capture moves
                const showMoveIndicator = !isEditorMode && moveResult.valid && !moveResult.isCapture;
                const showCaptureIndicator = !isEditorMode && moveResult.valid && moveResult.isCapture;
                const charStyles = charId ? getCharStyles(charId) : null;
                
                // Coordinates logic
                const showLetter = rowIndex === 7;
                const showNumber = colIndex === 7;
                const letter = String.fromCharCode(97 + colIndex);
                const number = 8 - rowIndex;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                    className={`
                      w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center 
                      cursor-pointer transition-all duration-200 relative
                      ${isDark ? 'bg-[#b58863]' : 'bg-[#f0d9b5]'}
                      ${isSelected && charStyles ? `ring-4 ring-inset ${charStyles.ring} z-10` : ''}
                      ${isEditorMode ? 'hover:brightness-110' : 'hover:brightness-95'}
                    `}
                  >
                    {/* Internal Coordinates */}
                    {showLetter && (
                      <span className={`absolute bottom-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold select-none ${isDark ? 'text-[#f0d9b5]' : 'text-[#b58863]'}`}>
                        {letter}
                      </span>
                    )}
                    {showNumber && (
                      <span className={`absolute top-0.5 right-0.5 text-[8px] sm:text-[10px] font-bold select-none ${isDark ? 'text-[#f0d9b5]' : 'text-[#b58863]'}`}>
                        {number}
                      </span>
                    )}

                    {/* Valid move indicator (Black dot 50% opacity) */}
                    {showMoveIndicator && (
                      <div className="w-4 h-4 sm:w-5 sm:h-5 bg-black/50 rounded-full z-10" />
                    )}

                    {/* Capture indicator (Red dot) */}
                    {showCaptureIndicator && (
                      <div className="absolute w-3 h-3 sm:w-4 sm:h-4 bg-red-600 rounded-full z-30 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-white/20" />
                    )}

                    <span 
                      draggable={!!charId}
                      onDragStart={(e) => handleDragStart(e, rowIndex, colIndex)}
                      className={`select-none transform transition-transform active:scale-90 z-20 flex items-center justify-center ${charId ? 'cursor-grab active:cursor-grabbing' : ''}`}
                    >
                      {charStyles ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative flex items-center justify-center pointer-events-none">
                          {renderPiece(charStyles)}
                        </div>
                      ) : null}
                    </span>
                  </div>
                );
              })
            ))}
          </div>
          {/* Bottom Lobby Bar (Characters) - Only in Editor Mode */}
          {isEditorMode && (
            <div className="grid grid-cols-8 border-t-4 border-[#262421] bg-[#262421]">
              {CHARACTERS.slice(8, 16).map((char) => (
                <div
                  key={char.id}
                  onClick={() => !char.isEmpty && setActiveCharId(char.id)}
                  className={`
                    w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 flex items-center justify-center 
                    transition-all duration-300 relative
                    ${char.isEmpty ? 'cursor-default bg-[#1a1816]' : 'cursor-pointer'}
                    ${activeCharId === char.id ? 'bg-[#312e2b]' : (!char.isEmpty ? 'bg-[#262421] hover:bg-[#312e2b]' : '')}
                  `}
                >
                  {!char.isEmpty && (
                    <div className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${activeCharId === char.id ? 'scale-110 opacity-100' : 'opacity-60 grayscale-[0.5] hover:opacity-100 hover:grayscale-0'} transition-all`}>
                      {renderPiece(char)}
                    </div>
                  )}
                  {activeCharId === char.id && !char.isEmpty && (
                    <div className="absolute bottom-1 w-1 h-1 bg-white rounded-full" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Sidebar: Controls */}
      <div className="flex flex-col gap-4 mt-16 pt-4">
        <div className="flex flex-col border border-zinc-800/50 rounded-xl overflow-hidden bg-zinc-900/50 w-10 sm:w-12 md:w-14">
          <button 
            onClick={() => {
              const nextMode = !isEditorMode;
              setIsEditorMode(nextMode);
              playToggleSound(!nextMode);
            }}
            className={`
              w-full py-3 transition-all active:scale-95 flex items-center justify-center
              ${isEditorMode 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-inner' 
                : 'bg-transparent hover:bg-zinc-800 text-zinc-300 border-b border-zinc-800/50'}
            `}
            title={isEditorMode ? "Iniciar Juego" : "Editar"}
          >
            {isEditorMode ? <Play size={16} fill="currentColor" /> : <Edit2 size={16} />}
          </button>

          <button 
            onClick={resetGame}
            className="w-full py-3 bg-transparent hover:bg-zinc-800 text-zinc-500 hover:text-zinc-100 transition-all active:scale-95 flex items-center justify-center border-b border-zinc-800/50 group"
            title="Reiniciar"
          >
            <RotateCcw size={16} className="group-hover:rotate-[-45deg] transition-transform" />
          </button>

          <div className="flex items-center justify-center py-3 bg-zinc-900/30">
            <div 
              className={`w-2 h-2 rounded-full transition-all duration-500 ${isEditorMode ? 'bg-zinc-700' : 'bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]'}`}
              title={isEditorMode ? "Modo Editor" : "Modo Juego"}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes slide-in-from-left {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes capture-pop {
      0% { transform: scale(1); }
      50% { transform: scale(1.015); }
      100% { transform: scale(1); }
    }
    @keyframes glow {
      0% { box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
      50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); border-color: rgba(239, 68, 68, 0.5); }
      100% { box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
    }
    @keyframes scale-in-center {
      0% { transform: scale(0); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes yellow-glow {
      0%, 100% { filter: drop-shadow(0 0 15px rgba(253, 224, 71, 1)) drop-shadow(0 0 30px rgba(253, 224, 71, 0.8)); }
    }
    .animate-yellow-glow { filter: drop-shadow(0 0 15px rgba(253, 224, 71, 1)) drop-shadow(0 0 30px rgba(253, 224, 71, 0.8)); }
    .scale-in-center { animation: scale-in-center 0.4s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; }
    .animate-glow { animation: glow 1s ease-out; }
    .animate-capture-pop { animation: capture-pop 0.2s ease-out; }
    .animate-in { animation: slide-in-from-left 0.5s ease-out; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
  `}} />
</div>
</div>
);
}
