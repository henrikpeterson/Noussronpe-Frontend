import { useState, useEffect, useCallback, useRef } from "react";
import { useGame } from "@/games/PuzzleGame/contexts/GameContext";
import { LEVELS } from "@/games/PuzzleGame/data/puzzleData";
import { ArrowLeft, Eye, Lightbulb, Timer, Zap, Trophy } from "lucide-react";

function playSnapSound() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 800;
    osc.type = "sine";
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.15);
  } catch { /* empty */ }
}

function playErrorSound() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 200;
    osc.type = "square";
    gain.gain.setValueAtTime(0.2, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.2);
  } catch { /* empty */ }
}

function playWinSound() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = "sine";
      gain.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.12 + 0.3);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.3);
    });
  } catch { /* empty */ }
}

function spawnParticles(container: HTMLElement, x: number, y: number) {
  const colors = ["#38BDF8", "#7DD3FC", "#0EA5E9", "#BAE6FD", "#0284C7"]; // Tons bleu ciel
  for (let i = 0; i < 8; i++) {
    const p = document.createElement("div");
    p.className = "particle";
    const angle = (Math.PI * 2 * i) / 8;
    const dist = 30 + Math.random() * 20;
    p.style.cssText = `
      left: ${x}px; top: ${y}px;
      width: 6px; height: 6px;
      border-radius: 50%;
      background: ${colors[i % colors.length]};
      --tx: ${Math.cos(angle) * dist}px;
      --ty: ${Math.sin(angle) * dist}px;
      position: absolute;
      pointer-events: none;
      animation: particleOut 0.6s ease-out forwards;
    `;
    container.appendChild(p);
    setTimeout(() => p.remove(), 600);
  }
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  if (a.every((v, i) => v === arr[i])) {
    [a[0], a[a.length - 1]] = [a[a.length - 1], a[0]];
  }
  return a;
}

export default function PuzzleBoard() {
  const { currentLevel, currentImage, completePuzzle, useHint, totalPoints, goToLevel } = useGame();
  const level = LEVELS.find((l) => l.id === currentLevel);
  const grid = level?.grid || 3;
  const totalPieces = grid * grid;
  const timeLimit = level?.timeLimit || 120;

  const [pieces, setPieces] = useState<number[]>([]);
  const [correct, setCorrect] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [errors, setErrors] = useState(0);
  const [combo, setCombo] = useState(0);
  const [maxCombo, setMaxCombo] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [hintActive, setHintActive] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [moves, setMoves] = useState(0);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);
  const [draggingPos, setDraggingPos] = useState<{ x: number; y: number } | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const boardRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const pieceRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  // Initialize puzzle
  useEffect(() => {
    const indices = Array.from({ length: totalPieces }, (_, i) => i);
    setPieces(shuffleArray(indices));
    setCorrect(new Set());
    setTimeLeft(timeLimit);
    setErrors(0);
    setCombo(0);
    setMaxCombo(0);
    setCompleted(false);
    setMoves(0);
    setDragIndex(null);
    setDragOver(null);
    setDraggingPos(null);
  }, [currentImage, totalPieces, timeLimit]);

  // Timer
  useEffect(() => {
    if (completed) return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          setCompleted(true);
          completePuzzle(0, errors, timeLimit);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [completed, errors, timeLimit, completePuzzle]);

  // Check completion
  useEffect(() => {
    if (pieces.length === 0) return;
    const allCorrect = pieces.every((p, i) => p === i);
    if (allCorrect && !completed) {
      setCompleted(true);
      clearInterval(timerRef.current);
      playWinSound();
      completePuzzle(timeLeft, errors, timeLimit);
    }
  }, [pieces, completed, timeLeft, errors, timeLimit, completePuzzle]);

  const performSwap = useCallback((fromPos: number, toPos: number) => {
    if (completed) return;
    if (correct.has(fromPos) || correct.has(toPos)) return;

    setPieces((prev) => {
      const next = [...prev];
      [next[fromPos], next[toPos]] = [next[toPos], next[fromPos]];

      const newCorrect = new Set(correct);
      let anyNewCorrect = false;

      if (next[fromPos] === fromPos) { newCorrect.add(fromPos); anyNewCorrect = true; }
      if (next[toPos] === toPos) { newCorrect.add(toPos); anyNewCorrect = true; }

      if (anyNewCorrect) {
        playSnapSound();
        setCombo((c) => { const n = c + 1; setMaxCombo((m) => Math.max(m, n)); return n; });
        setCorrect(newCorrect);
        if (boardRef.current) {
          const rect = boardRef.current.getBoundingClientRect();
          const pieceSize = rect.width / grid;
          [fromPos, toPos].forEach((pos) => {
            if (next[pos] === pos) {
              const col = pos % grid;
              const row = Math.floor(pos / grid);
              spawnParticles(boardRef.current!, col * pieceSize + pieceSize / 2, row * pieceSize + pieceSize / 2);
            }
          });
        }
      } else {
        playErrorSound();
        setErrors((e) => e + 1);
        setCombo(0);
      }

      setMoves((m) => m + 1);
      return next;
    });
  }, [correct, completed, grid]);

  // --- Pointer-based drag & drop ---
  const handlePointerDown = useCallback((e: React.PointerEvent, position: number) => {
    if (completed || correct.has(position)) return;
    e.preventDefault();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    
    const el = pieceRefs.current.get(position);
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setDragIndex(position);
    setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setDraggingPos({ x: e.clientX, y: e.clientY });
  }, [completed, correct]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (dragIndex === null) return;
    e.preventDefault();
    setDraggingPos({ x: e.clientX, y: e.clientY });

    if (boardRef.current) {
      const rect = boardRef.current.getBoundingClientRect();
      const cellW = rect.width / grid;
      const cellH = rect.height / grid;
      const col = Math.floor((e.clientX - rect.left) / cellW);
      const row = Math.floor((e.clientY - rect.top) / cellH);
      if (col >= 0 && col < grid && row >= 0 && row < grid) {
        setDragOver(row * grid + col);
      } else {
        setDragOver(null);
      }
    }
  }, [dragIndex, grid]);

  const handlePointerUp = useCallback(() => {
    if (dragIndex !== null && dragOver !== null && dragIndex !== dragOver) {
      performSwap(dragIndex, dragOver);
    }
    setDragIndex(null);
    setDragOver(null);
    setDraggingPos(null);
  }, [dragIndex, dragOver, performSwap]);

  const handleHint = () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    if (useHint()) {
      setHintActive(true);
      setTimeout(() => setHintActive(false), 2000);
    }
  };

  const timerPercent = (timeLeft / timeLimit) * 100;
  // Dégradé de la barre de temps
  const timerColor = timeLeft > timeLimit * 0.5 ? "bg-sky-400" : timeLeft > timeLimit * 0.2 ? "bg-amber-400" : "bg-red-500";

  if (!currentImage || !level) return null;

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col bg-[#FDFCF8] overflow-hidden select-none" onPointerMove={handlePointerMove} onPointerUp={handlePointerUp}>
      
      {/* --- FOND CAHIER SEYÈS --- */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-80">
        <div className="absolute inset-0" 
             style={{ 
               backgroundImage: 'linear-gradient(#BAE6FD 1px, transparent 1px)', // Lignes bleu ciel
               backgroundSize: '100% 28px', // Espacement des lignes
               backgroundPosition: '0 14px' 
             }} 
        />
        {/* Marge rouge */}
        <div className="absolute top-0 left-[8%] sm:left-[10%] bottom-0 w-px bg-red-300/80 shadow-[1px_0_3px_rgba(239,68,68,0.2)]" />
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex-1 flex flex-col w-full max-w-lg mx-auto">
        
        {/* Top bar */}
        <div className="flex items-center justify-between p-4 gap-3 mt-2">
          <button onClick={goToLevel} className="p-2.5 rounded-xl bg-white text-sky-600 shadow-sm border border-sky-100 hover:bg-sky-50 hover:border-sky-200 transition-all shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 text-center bg-white/70 backdrop-blur-sm py-2 px-4 rounded-full border border-sky-100 shadow-sm">
            <p className="font-bold text-base text-sky-900 truncate">{currentImage.name}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0 bg-white px-3 py-2 rounded-xl shadow-sm border border-sky-100">
            <Trophy className="w-4 h-4 text-amber-500" />
            <span className="font-bold text-sm text-slate-700">{totalPoints}</span>
          </div>
        </div>

        {/* Stats bar : Style trait de stylo */}
        <div className="px-5 py-2 flex items-center gap-4 text-sm font-medium">
          <div className="flex items-center gap-1.5 text-sky-800 bg-white/80 px-2 py-1 rounded-lg shadow-sm border border-sky-50">
            <Timer className="w-4 h-4" />
            <span className={`w-8 ${timeLeft <= 10 ? "text-red-600 font-bold animate-pulse" : ""}`}>{timeLeft}s</span>
          </div>
          <div className="flex-1 h-2.5 bg-sky-100 rounded-full overflow-hidden shadow-inner border border-sky-200/50">
            <div className={`h-full ${timerColor} transition-all duration-1000 rounded-full`} style={{ width: `${timerPercent}%` }} />
          </div>
          {combo >= 3 && (
            <div className="flex items-center gap-1 text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <Zap className="w-3.5 h-3.5" /> ×{combo}
            </div>
          )}
          <span className="text-red-500 font-bold bg-white/80 px-2 py-1 rounded-lg shadow-sm border border-red-50">
            ❌ {errors}
          </span>
        </div>

        {/* Action buttons */}
        <div className="px-4 py-3 flex gap-3 justify-center">
          <button
            onClick={() => setShowPreview(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-sky-700 font-bold shadow-sm border border-sky-100 hover:bg-sky-50 transition-colors"
          >
            <Eye className="w-4 h-4" /> Aperçu
          </button>
          <button
            onClick={handleHint}
            disabled={totalPoints < 100}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-sky-700 font-bold shadow-sm border border-sky-100 hover:bg-sky-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Lightbulb className="w-4 h-4 text-amber-500" /> Indice (-100)
          </button>
        </div>

        {/* Puzzle board : Style "Photo collée dans le cahier" */}
        <div className="flex-1 flex items-start justify-center p-4">
          <div
            ref={boardRef}
            className="relative w-full max-w-[min(85vw,450px)] aspect-square rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.12)] bg-sky-50/50 backdrop-blur-sm border-4 border-white p-1 touch-none"
            style={{ display: "grid", gridTemplateColumns: `repeat(${grid}, 1fr)`, gap: "2px" }}
          >
            {(hintActive || showPreview) ? (
              <img
                src={currentImage.url}
                alt={currentImage.name}
                className="absolute inset-0 w-full h-full object-cover rounded-xl z-10"
                style={{ gridColumn: `1 / -1`, gridRow: `1 / -1` }}
              />
            ) : (
              pieces.map((pieceIndex, position) => {
                const col = pieceIndex % grid;
                const row = Math.floor(pieceIndex / grid);
                const isCorrect = correct.has(position);
                const isDragging = dragIndex === position;
                const isOver = dragOver === position && dragIndex !== null && !isCorrect;

                const tx = -(col * 100) / grid; 
                const ty = -(row * 100) / grid;

                return (
                  <div
                    key={position}
                    ref={(el) => { if (el) pieceRefs.current.set(position, el); }}
                    className={`relative overflow-hidden rounded-lg transition-transform duration-150
                      ${isCorrect ? "ring-2 ring-emerald-400 ring-offset-2 ring-offset-sky-50" : "cursor-grab active:cursor-grabbing"}
                      ${isDragging ? "opacity-50 scale-90 shadow-inner" : "shadow-sm"}
                      ${isOver ? "ring-4 ring-sky-400 scale-105 z-10" : ""}
                    `}
                    onPointerDown={(e) => handlePointerDown(e, position)}
                    style={{ aspectRatio: "1", touchAction: "none" }}
                  >
                    <img
                      src={currentImage.url}
                      alt=""
                      draggable={false}
                      style={{
                        position: "absolute",
                        width: `${grid * 100}%`,
                        height: `${grid * 100}%`,
                        maxWidth: "none",
                        transform: `translate(${tx}%, ${ty}%)`,
                        pointerEvents: "none",
                        userSelect: "none",
                      }}
                    />
                    {isCorrect && (
                      <div className="absolute inset-0 bg-emerald-500/20 flex items-center justify-center backdrop-blur-[1px]">
                        <span className="text-2xl drop-shadow-md text-white font-bold">✓</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Floating drag ghost */}
      {dragIndex !== null && draggingPos && currentImage && (() => {
        const ghostCol = pieces[dragIndex] % grid;
        const ghostRow = Math.floor(pieces[dragIndex] / grid);
        return (
          <div
            className="fixed pointer-events-none z-50 rounded-xl shadow-2xl ring-4 ring-sky-400 opacity-95 overflow-hidden"
            style={{
              left: draggingPos.x - dragOffset.x,
              top: draggingPos.y - dragOffset.y,
              width: boardRef.current ? (boardRef.current.getBoundingClientRect().width - 8) / grid : 60,
              height: boardRef.current ? (boardRef.current.getBoundingClientRect().height - 8) / grid : 60,
            }}
          >
            <img
              src={currentImage.url}
              alt=""
              draggable={false}
              style={{
                position: "absolute",
                width: `${grid * 100}%`,
                height: `${grid * 100}%`,
                maxWidth: "none",
                transform: `translate(${-(ghostCol * 100) / grid}%, ${-(ghostRow * 100) / grid}%)`,
                pointerEvents: "none",
              }}
            />
          </div>
        );
      })()}

      {/* Preview modal : Style polaroïd/cahier */}
      {showPreview && (
        <div className="fixed inset-0 z-50 bg-sky-900/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setShowPreview(false)}>
          <div className="bg-white rounded-[2rem] p-4 max-w-sm w-full shadow-2xl border-4 border-white transform transition-all" onClick={(e) => e.stopPropagation()}>
            <div className="rounded-2xl overflow-hidden border border-sky-100">
              <img src={currentImage.url} alt={currentImage.name} className="w-full" />
            </div>
            <p className="text-center font-black text-lg mt-4 text-sky-900">{currentImage.name}</p>
            <button onClick={() => setShowPreview(false)} className="w-full mt-4 bg-sky-100 hover:bg-sky-200 text-sky-800 font-bold py-3 rounded-xl transition-colors">
              Fermer le modèle
            </button>
          </div>
        </div>
      )}

      {/* Combo indicator : Style Sticker */}
      {combo >= 2 && (
        <div className="fixed top-24 right-4 bg-amber-400 text-white px-4 py-2 rounded-2xl shadow-lg font-black text-lg transform rotate-3 border-2 border-white animate-bounce">
          🔥 Combo {combo}!
        </div>
      )}
    </div>
  );
}