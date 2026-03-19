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

const CHARACTERS = [
  { id: 'white-pawn', color: 'text-zinc-100', bg: 'bg-zinc-100', border: 'border-zinc-300', shadow: 'shadow-zinc-900/40', ring: 'ring-zinc-100/60', isEmpty: false, type: 'pawn', canMove: true },
  { id: 'star', color: 'text-yellow-400', bg: 'bg-yellow-400', border: 'border-yellow-200', shadow: 'shadow-yellow-900/40', ring: 'ring-yellow-400/60', isEmpty: false, type: 'star', canMove: false },
  { id: 'empty-2', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-3', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-4', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-5', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-6', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
  { id: 'empty-7', color: 'text-transparent', bg: 'bg-transparent', border: 'border-transparent', shadow: '', ring: '', isEmpty: true },
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

  const handleSquareClick = (row: number, col: number) => {
    if (isEditorMode) {
      const newBoard = board.map(r => [...r]);
      // If clicking a square with the SAME character, remove it. Otherwise, place/replace with active character.
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

      const selectedCharId = board[selected.row][selected.col];
      const selectedCharDef = CHARACTERS.find(c => c.id === selectedCharId);

      // If selected character cannot move, deselect and return
      if (selectedCharDef && !selectedCharDef.canMove) {
        setSelected(null);
        return;
      }

      // Valid move: one square up (only if empty)
      const isForwardMove = selected.row - 1 === row && selected.col === col && board[row][col] === '';
      // Valid capture: one square diagonally up (only if occupied by different color)
      const isCaptureMove = selected.row - 1 === row && Math.abs(selected.col - col) === 1 && board[row][col] !== '' && board[row][col] !== board[selected.row][selected.col];

      if (isForwardMove || isCaptureMove) {
        const movingCharId = board[selected.row][selected.col];
        const capturedCharId = board[row][col];
        
        if (isCaptureMove && capturedCharId) {
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

  const getCharStyles = (id: string) => CHARACTERS.find(c => c.id === id) || CHARACTERS[0];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-2 md:p-4 font-sans">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header */}
        <div className="w-full flex flex-col items-center mb-6">
          <div className="text-center">
            <h1 className="text-5xl font-black tracking-tighter flex items-center justify-center gap-3 mb-2">
              <span className="bg-red-600 text-white px-4 py-1 rounded-sm shadow-lg shadow-red-900/20">ZONA</span>
              <span className="text-zinc-100">CHESS</span>
            </h1>
          </div>
        </div>

        {/* Top Controls Bar */}
        <div className="w-full max-w-[400px] sm:max-w-[464px] md:max-w-[528px] flex items-center justify-between mb-4 px-1">
          {/* Left: Game Mode Info */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isEditorMode ? 'bg-zinc-500' : 'bg-red-600 animate-pulse'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-widest ${isEditorMode ? 'text-zinc-400' : 'text-red-600'}`}>
                {isEditorMode ? 'Modo Editor' : 'Modo Juego'}
              </span>
            </div>
            <p className="text-[8px] text-zinc-600 font-mono tracking-[0.2em] uppercase mt-0.5 ml-4">
              {isEditorMode ? 'Configuración' : 'Simulación'}
            </p>
          </div>

          {/* Center: Reset Button */}
          <button 
            onClick={resetGame}
            className="flex flex-col items-center gap-1 text-zinc-500 hover:text-zinc-100 transition-colors group"
            title="Limpiar todo"
          >
            <div className="p-2 bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800/50 rounded-lg transition-all active:scale-90">
              <RotateCcw size={16} className="group-hover:rotate-[-45deg] transition-transform" />
            </div>
            <span className="text-[8px] font-bold uppercase tracking-tighter opacity-50 group-hover:opacity-100">Reiniciar</span>
          </button>

          {/* Right: Start/Edit Toggle */}
          <div className="flex items-center">
            {isEditorMode ? (
              <button 
                onClick={() => {
                  setIsEditorMode(false);
                  playToggleSound(true);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all active:scale-95 shadow-lg shadow-red-900/20 flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Play size={14} fill="currentColor" />
                Iniciar Juego
              </button>
            ) : (
              <button 
                onClick={() => {
                  setIsEditorMode(true);
                  playToggleSound(false);
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold rounded-lg transition-all active:scale-95 border border-zinc-700 flex items-center gap-2 text-xs uppercase tracking-wider"
              >
                <Edit2 size={14} />
                Editar
              </button>
            )}
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center gap-2">
          
          <div className="flex flex-col items-center">
            {/* Main Board Container */}
            <div className={`relative p-0.5 bg-[#262421] rounded-lg shadow-2xl overflow-hidden border-4 border-[#262421] transition-all duration-100 ${isCapturing ? 'animate-shake ring-4 ring-red-500/50' : ''}`}>
              {isCapturing && (
                <div className="absolute inset-0 bg-white/10 z-50 pointer-events-none animate-pulse" />
              )}
          {/* The 8x8 Grid */}
          <div className="grid grid-cols-8 border-none">
            {board.map((row, rowIndex) => (
              row.map((charId, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;
                const isSelected = selected?.row === rowIndex && selected?.col === colIndex;
                const selectedCharId = selected ? board[selected.row][selected.col] : null;
                
                // Pawn movement rules
                const isForwardMove = selected && selected.row - 1 === rowIndex && selected.col === colIndex && charId === '';
                const isCaptureMove = selected && selected.row - 1 === rowIndex && Math.abs(selected.col - colIndex) === 1 && charId !== '' && charId !== selectedCharId;
                
                // Only show indicator for forward move, not for captures
                const showMoveIndicator = !isEditorMode && isForwardMove && selectedCharId !== null;
                const showCaptureIndicator = !isEditorMode && isCaptureMove && selectedCharId !== null;
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

                    <span className="select-none transform transition-transform active:scale-90 z-20 flex items-center justify-center">
                      {charStyles ? (
                        <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 relative flex items-center justify-center">
                          {charStyles.type === 'star' ? STAR_SVG(charStyles.color) : PAWN_SVG(charStyles.color)}
                        </div>
                      ) : null}
                    </span>
                  </div>
                );
              })
            ))}
          </div>

          {/* Lobby Bar (Characters) - Only in Editor Mode */}
          {isEditorMode && (
            <div className="grid grid-cols-8 border-t-4 border-[#262421] bg-[#262421]">
              {CHARACTERS.map((char) => (
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
                      {char.type === 'star' ? STAR_SVG(char.color) : PAWN_SVG(char.color)}
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
                        {charStyles.type === 'star' ? STAR_SVG(charStyles.color) : PAWN_SVG(charStyles.color)}
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
