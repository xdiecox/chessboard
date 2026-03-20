import React, { useState } from 'react';
import { RotateCcw, Play, Edit2, UserPlus, Upload, Image as ImageIcon } from 'lucide-react';

// Character definitions
const PAWN_SVG = (color: string) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full ${color} drop-shadow-md`}>
    <path 
      d="M50 15c-8.3 0-15 6.7-15 15 0 5.4 2.8 10.1 7.1 12.8-5.4 2.6-9.1 8-9.1 14.2 0 4.1 1.6 7.8 4.2 10.6-6.1 2.4-10.2 8.3-10.2 15.4h46c0-7.1-4.1-13-10.2-15.4 2.6-2.8 4.2-6.5 4.2-10.6 0-6.2-3.7-11.6-9.1-14.2 4.3-2.7 7.1-7.4 7.1-12.8 0-8.3-6.7-15-15-15z" 
      fill="currentColor" 
      stroke="black"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

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

const KING_SVG = (color: string) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full ${color} drop-shadow-md`}>
    <path 
      d="M50 10l5 10h10v5h-10l-5 10-5-10h-10v-5h10l5-10z M25 40l10 15h30l10-15 M30 55v25h40v-25 M25 80h50v10H25z" 
      fill="currentColor" 
      stroke="black"
      strokeWidth="4"
      strokeLinejoin="round"
    />
    <path d="M35 55l5 10h20l5-10" fill="none" stroke="black" strokeWidth="2" />
  </svg>
);

const ROOK_SVG = (color: string) => (
  <svg viewBox="0 0 100 100" className={`w-full h-full ${color} drop-shadow-md`}>
    <path 
      d="M25 15v15h10v-10h10v10h10v-10h10v10h10v-15h-50z M30 30l5 10h30l5-10 M35 40v35h30v-35 M25 75h50v15H25z" 
      fill="currentColor" 
      stroke="black"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

const renderPieceSVG = (char: any) => {
  if (char.type === 'star') return STAR_SVG(char.color);
  if (char.type === 'king') return KING_SVG(char.color);
  if (char.type === 'rook') return ROOK_SVG(char.color);
  return PAWN_SVG(char.color);
};

const CHARACTERS = [
  { id: 'black-pawn', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'black-king', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'king', canMove: true },
  { id: 'black-rook', color: 'text-zinc-900', bg: 'bg-zinc-900', border: 'border-zinc-700', shadow: 'shadow-black/40', ring: 'ring-zinc-900/60', isEmpty: false, type: 'rook', canMove: true },
  { id: 'empty-4', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-5', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-6', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-7', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-8', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'white-pawn', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'white-king', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'king', canMove: true },
  { id: 'white-rook', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'rook', canMove: true },
  { id: 'blue-pawn', color: 'text-blue-500', bg: 'bg-blue-500', border: 'border-blue-300', shadow: 'shadow-blue-900/40', ring: 'ring-blue-500/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'green-pawn', color: 'text-emerald-500', bg: 'bg-emerald-500', border: 'border-emerald-300', shadow: 'shadow-emerald-900/40', ring: 'ring-emerald-500/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'star', color: 'text-yellow-400', bg: 'bg-yellow-400', border: 'border-yellow-200', shadow: 'shadow-yellow-900/40', ring: 'ring-yellow-400/60', isEmpty: false, type: 'star', canMove: false },
  { id: 'purple-star', color: 'text-purple-400', bg: 'bg-purple-400', border: 'border-purple-200', shadow: 'shadow-purple-900/40', ring: 'ring-purple-400/60', isEmpty: false, type: 'star', canMove: false },
  { id: 'orange-star', color: 'text-orange-400', bg: 'bg-orange-400', border: 'border-orange-200', shadow: 'shadow-orange-900/40', ring: 'ring-orange-400/60', isEmpty: false, type: 'star', canMove: false },
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
      // Pawn movement: one square up (only if empty)
      const isForward = rowDiff === -1 && colDiff === 0 && !toChar;
      // Pawn capture: one square diagonally up
      const isCapture = rowDiff === -1 && absColDiff === 1 && toChar && !toChar.isEmpty;
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
          setCapturedChars(prev => [...prev, capturedCharId]);
          playCaptureSound();
          setIsCapturing(true);
          setTimeout(() => setIsCapturing(false), 500);
        } else {
          playPopSound();
        }

        const newBoard = board.map(r => [...r]);
        newBoard[selected.row][selected.col] = '';
        newBoard[row][col] = movingCharId;
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
    playResetSound();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-2 md:p-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header - Removed Title */}

        <div className="w-full flex flex-col items-center justify-center gap-2">
          
          <div className="flex flex-row items-start gap-4">
            {/* Left Column: Board + Captured Lobby */}
            <div className="flex flex-col gap-4 items-center">
              {/* Main Board Container */}
              <div className={`relative bg-[#262421] rounded-lg shadow-2xl overflow-hidden border-4 border-[#262421] transition-all duration-100 ${isCapturing ? 'animate-shake ring-4 ring-red-500/50' : ''}`}>
                {isCapturing && (
                  <div className="absolute inset-0 bg-white/10 z-50 pointer-events-none animate-pulse" />
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
                              {renderPieceSVG(char)}
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
          <div className="grid grid-cols-8 border-none">
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
                      ${isDark ? 'bg-[#769656]' : 'bg-[#eeeed2]'}
                      ${isSelected && charStyles ? `ring-4 ring-inset ${charStyles.ring} z-10` : ''}
                      ${isEditorMode ? 'hover:brightness-110' : 'hover:brightness-95'}
                    `}
                  >
                    {/* Internal Coordinates */}
                    {showLetter && (
                      <span className={`absolute bottom-0.5 left-0.5 text-[8px] sm:text-[10px] font-bold select-none ${isDark ? 'text-[#eeeed2]' : 'text-[#769656]'}`}>
                        {letter}
                      </span>
                    )}
                    {showNumber && (
                      <span className={`absolute top-0.5 right-0.5 text-[8px] sm:text-[10px] font-bold select-none ${isDark ? 'text-[#eeeed2]' : 'text-[#769656]'}`}>
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
                          {renderPieceSVG(charStyles)}
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
                      {renderPieceSVG(char)}
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

        {/* Captured Pieces Lobby (Bottom) - Only show in Game Mode */}
        {!isEditorMode && (
          <div className="w-[332px] sm:w-[460px] md:w-[524px] mt-0">
            <div className="bg-[#161512] rounded-xl border-2 border-[#262421] p-4 min-h-[200px] flex items-start gap-4">
              {/* Upload Button */}
              <div className="relative group shrink-0 mt-2">
                <input 
                  type="file" 
                  id="player-image" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <label 
                  htmlFor="player-image"
                  className={`
                    w-20 h-20 rounded-xl border-2 border-dashed 
                    flex flex-col items-center justify-center gap-1 cursor-pointer
                    transition-all duration-500 overflow-hidden relative
                    ${playerImage ? 'border-transparent shadow-xl' : 'border-zinc-800 hover:border-red-600/50 bg-zinc-950/50'}
                  `}
                >
                  {playerImage ? (
                    <>
                      <img src={playerImage} alt="Jugador" className="w-full h-full object-contain p-1 drop-shadow-[0_0_2px_rgba(0,0,0,1)]" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload className="text-white" size={14} />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-6 h-6 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 group-hover:text-red-500 group-hover:bg-red-500/10 transition-all">
                        <ImageIcon size={14} />
                      </div>
                      <div className="text-center">
                        <p className="text-[7px] font-bold text-zinc-400 uppercase tracking-widest">JUGADOR</p>
                      </div>
                    </>
                  )}
                </label>
              </div>

              {/* Vertical Divider */}
              <div className="w-px h-32 bg-zinc-800/50 mt-2" />

              {/* Captured Pieces List */}
              <div className="flex flex-wrap gap-2 items-start overflow-y-auto custom-scrollbar pt-2 max-h-[160px]">
                {capturedChars.length === 0 ? (
                  <p className="text-zinc-600 text-[10px] uppercase tracking-widest font-bold ml-2">Sin capturas</p>
                ) : (
                  capturedChars.map((charId, index) => {
                    const charStyles = getCharStyles(charId);
                    return (
                      <div 
                        key={`${charId}-${index}`}
                        className="w-12 h-12 rounded-lg bg-zinc-900/50 border border-zinc-800 flex items-center justify-center animate-in animate-glow"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <div className="w-8 h-8">
                          {renderPieceSVG(charStyles)}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        )}
      </div>

        {/* Right Sidebar Controls */}
        <div className="flex flex-col gap-6 pt-4">
          {/* 1. Start/Edit Toggle */}
          <button 
            onClick={() => {
              const nextMode = !isEditorMode;
              setIsEditorMode(nextMode);
              playToggleSound(!nextMode);
            }}
            className={`
              p-3 rounded-xl transition-all active:scale-90 shadow-lg
              ${isEditorMode 
                ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20' 
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'}
            `}
            title={isEditorMode ? "Iniciar Juego" : "Editar"}
          >
            {isEditorMode ? <Play size={20} fill="currentColor" /> : <Edit2 size={20} />}
          </button>

          {/* 2. Reset Button */}
          <button 
            onClick={resetGame}
            className="p-3 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-xl text-zinc-500 hover:text-zinc-100 transition-all active:scale-90 group"
            title="Reiniciar"
          >
            <RotateCcw size={20} className="group-hover:rotate-[-45deg] transition-transform" />
          </button>

          {/* 3. Status Indicator */}
          <div className="flex justify-center py-2">
            <div 
              className={`w-3 h-3 rounded-full transition-all duration-500 ${isEditorMode ? 'bg-zinc-700' : 'bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.5)]'}`}
              title={isEditorMode ? "Modo Editor" : "Modo Juego"}
            />
          </div>
        </div>
      </div>

      {/* Captured Pieces Lobby (Bottom) - Removed from here, now inside the board column */}
    </div>
  </div>

  <style dangerouslySetInnerHTML={{ __html: `
    @keyframes slide-in-from-left {
      from { transform: translateX(-20px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-4px) rotate(-1deg); }
      50% { transform: translateX(4px) rotate(1deg); }
      75% { transform: translateX(-4px) rotate(-1deg); }
    }
    @keyframes glow {
      0% { box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
      50% { box-shadow: 0 0 20px rgba(239, 68, 68, 0.5); border-color: rgba(239, 68, 68, 0.5); }
      100% { box-shadow: 0 0 0px rgba(239, 68, 68, 0); }
    }
    .animate-glow { animation: glow 1s ease-out; }
    .animate-shake { animation: shake 0.15s ease-in-out infinite; }
    .animate-in { animation: slide-in-from-left 0.5s ease-out; }
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #27272a; border-radius: 10px; }
  `}} />
</div>
  );
}
