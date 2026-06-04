// src/games/math-Puzzle/components/MathJigsaw.tsx
//
// Refonte complète avec thème CAHIER DE CLASSE
// - Background texture papier réglé
// - Typographie chaleureuse
// - Tons crème et vert encre
// - Aspect éducatif authentique

import { useState, useCallback, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

import {
  generatePuzzle,
  gradeLevels,
  type GradeLevel,
  type MathPiece,
} from "@/games/math-Puzzle/lib/mathOperations";

import PuzzleGrid from "./PuzzleGrid";
import PieceTray  from "./PieceTray";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  RotateCcw,
  Trophy,
  Puzzle,
  Sparkles,
  Star,
  Clock,
  Target,
  Zap,
  XCircle,
} from "lucide-react";

// ─────────────────────────────────────────────
// CONSTANTES
// ─────────────────────────────────────────────
const GRID_SIZE    = 4;
const TOTAL_PIECES = GRID_SIZE * GRID_SIZE;

function createPuzzleSet(grade: GradeLevel) {
  const puzzle = generatePuzzle(grade, TOTAL_PIECES);
  return {
    pieces:         puzzle,
    shuffledPieces: [...puzzle].sort(() => Math.random() - 0.5),
  };
}

// ─────────────────────────────────────────────
// TYPE STATS
// ─────────────────────────────────────────────
interface GameStats {
  correct:   number;
  wrong:     number;
  maxCombo:  number;
  duration:  number;
}

// ─────────────────────────────────────────────
// CONFETTI CANNON (couleurs cahier)
// ─────────────────────────────────────────────
function fireConfetti() {
  const opts = {
    particleCount: 120,
    spread:        80,
    startVelocity: 45,
    gravity:       0.9,
    ticks:         250,
    colors:        ["#2d7a4f", "#4a9d6f", "#f4a261", "#e76f51", "#d4a574", "#8b7355"],
  };
  
  confetti({ ...opts, origin: { x: 0.15, y: 1 }, angle: 60 });
  confetti({ ...opts, origin: { x: 0.85, y: 1 }, angle: 120 });
  
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread:        120,
      startVelocity: 35,
      origin:        { x: 0.5, y: 0.7 },
      colors:        ["#f9e9d2", "#e8d5b7", "#c9b896"],
    });
  }, 400);
}

// ─────────────────────────────────────────────
// COMPOSANT PRINCIPAL
// ─────────────────────────────────────────────
export default function MathJigsaw() {
  // ✅ GÉNÉRER UNE SEULE FOIS pour l'initialisation
  const initialState = useMemo(() => createPuzzleSet("6eme"), []);
  
  const [grade, setGrade] = useState<GradeLevel>("6eme");
  const [pieces, setPieces] = useState<MathPiece[]>(initialState.pieces);
  const [shuffledPieces, setShuffled] = useState<MathPiece[]>(initialState.shuffledPieces);
  
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [highlightCell, setHighlight]   = useState<number | null>(null);
  const [wrongCell, setWrongCell]       = useState<number | null>(null);
  const [showVictory, setShowVictory]   = useState(false);
  const [sparklePos, setSparklePos]     = useState<{ x: number; y: number } | null>(null);

  const correctRef  = useRef(0);
  const wrongRef    = useRef(0);
  const comboRef    = useRef(0);
  const maxComboRef = useRef(0);
  const startTime   = useRef(Date.now());
  const [stats, setStats] = useState<GameStats | null>(null);

  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const isComplete = solved.size === TOTAL_PIECES;
  const progress   = (solved.size / TOTAL_PIECES) * 100;

  const startTimer = () => {
    startTime.current = Date.now();
    setElapsed(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsed(Math.floor((Date.now() - startTime.current) / 1000));
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) { clearInterval(timerRef.current); timerRef.current = null; }
  };

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, []);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (isComplete && !showVictory) {
      stopTimer();
      const duration = Math.floor((Date.now() - startTime.current) / 1000);
      setStats({
        correct:  correctRef.current,
        wrong:    wrongRef.current,
        maxCombo: maxComboRef.current,
        duration,
      });
      setTimeout(() => {
        setShowVictory(true);
        fireConfetti();
      }, 700);
    }
  }, [isComplete, showVictory]);

  const handleDrop = useCallback(
    (pieceId: number, cellIndex: number, dropX?: number, dropY?: number) => {
      const piece      = pieces.find((p) => p.id === pieceId);
      const targetPiece = pieces[cellIndex];
      if (!piece || !targetPiece) return;

      if (piece.id === targetPiece.id) {
        correctRef.current++;
        comboRef.current++;
        if (comboRef.current > maxComboRef.current) {
          maxComboRef.current = comboRef.current;
        }

        setSolved((prev) => {
          const next = new Set(prev);
          next.add(piece.id);
          return next;
        });

        setHighlight(cellIndex);
        setTimeout(() => setHighlight(null), 700);

        if (dropX !== undefined && dropY !== undefined) {
          setSparklePos({ x: dropX, y: dropY });
          setTimeout(() => setSparklePos(null), 800);
        }

      } else {
        wrongRef.current++;
        comboRef.current = 0;
        setWrongCell(cellIndex);
        setTimeout(() => setWrongCell(null), 500);
      }
    },
    [pieces]
  );

  const restart = (newGrade?: GradeLevel) => {
    const g = newGrade ?? grade;
    const next = createPuzzleSet(g);
    setPieces(next.pieces);
    setShuffled(next.shuffledPieces);
    setSolved(new Set());
    setHighlight(null);
    setWrongCell(null);
    setShowVictory(false);
    setStats(null);
    correctRef.current  = 0;
    wrongRef.current    = 0;
    comboRef.current    = 0;
    maxComboRef.current = 0;
    startTimer();
  };

  const handleGradeChange = (value: string) => {
    const g = value as GradeLevel;
    setGrade(g);
    restart(g);
  };

  const getStars = (correct: number, wrong: number): number => {
    const total    = correct + wrong;
    const accuracy = total > 0 ? correct / total : 1;
    if (accuracy >= 0.9) return 3;
    if (accuracy >= 0.7) return 2;
    return 1;
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-4 py-4 sm:py-8 relative overflow-hidden">

      {/* ════════════════════════════════════════════════════════════════
          BACKGROUND CAHIER DE CLASSE
          ════════════════════════════════════════════════════════════════ */}
      
      {/* Fond papier crème */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          background: `
            linear-gradient(to bottom, 
              #faf8f3 0%, 
              #f5f1e8 50%, 
              #f0ebe0 100%
            )
          `,
        }}
      />

      {/* Texture papier (grain subtil) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.15]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px 180px',
        }}
      />

      {/* Lignes de cahier (effet Seyes) */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.12] pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 31px,
              #2d7a4f 31px,
              #2d7a4f 32px
            )
          `,
          backgroundSize: '100% 32px',
          backgroundPosition: '0 60px',
        }}
      />

      {/* Marge rouge verticale (cahier classique) */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-20 z-0 pointer-events-none opacity-20"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, transparent calc(100% - 2px), #c44536 calc(100% - 2px), #c44536 100%)',
        }}
      />

      {/* Ombres douces sur les bords (effet page) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 100px rgba(139, 115, 85, 0.08)',
        }}
      />

      {/* Sparkle overlay */}
      <AnimatePresence>
        {sparklePos && (
          <SparkleEffect x={sparklePos.x} y={sparklePos.y} />
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════════════════════════
          📝 CONTENU (relatif, au-dessus du background)
          ════════════════════════════════════════════════════════════════ */}
      <div className="relative z-10 flex flex-col items-center w-full">

        {/* Header */}
        <motion.div
          className="text-center mb-3"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Instruction style "surligneur jaune" */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg mb-2 border-2 border-amber-600/40"
            style={{
              background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.15)',
            }}
          >
            <span className="text-xs font-black text-amber-950">!</span>
            <span className="text-[10px] font-black uppercase tracking-wider text-amber-950/90">
              🧩 Glisse la bonne opération sur le résultat
            </span>
          </div>
          
          {/* Titre avec typo chaleureuse */}
          <h1 
            className="text-3xl sm:text-4xl font-[900] tracking-tight leading-none"
            style={{
              color: '#2d3748',
              fontFamily: '"Nunito", "Comic Neue", "Quicksand", sans-serif',
              textShadow: '1px 1px 0 rgba(45, 122, 79, 0.1)',
            }}
          >
            Math
            <span 
              className="text-transparent bg-clip-text"
              style={{
                backgroundImage: 'linear-gradient(135deg, #2d7a4f 0%, #4a9d6f 100%)',
              }}
            >
              Puzzle
            </span>
          </h1>
        </motion.div>

        {/* Contrôles */}
        <motion.div
          className="flex items-center gap-2 sm:gap-3 mb-4 flex-wrap justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
        >
          {/* Sélecteur de classe */}
          <Select value={grade} onValueChange={handleGradeChange}>
            <SelectTrigger 
              className="w-[130px] font-semibold rounded-xl shadow-sm text-sm border-2"
              style={{
                background: '#ffffff',
                borderColor: '#4a9d6f',
                color: '#2d3748',
              }}
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {gradeLevels.map((g) => (
                <SelectItem key={g.value} value={g.value}>
                  {g.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Restart */}
          <Button
            variant="outline"
            size="icon"
            onClick={() => restart()}
            className="rounded-xl border-2 shadow-sm hover:bg-[#f0ebe0]"
            style={{
              borderColor: '#4a9d6f',
              background: '#ffffff',
            }}
            title="Nouveau puzzle"
          >
            <RotateCcw className="w-4 h-4" style={{ color: '#2d7a4f' }} />
          </Button>

          {/* Progression */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 shadow-sm"
            style={{
              background: '#ffffff',
              borderColor: '#d4a574',
            }}
          >
            <Star className="w-3.5 h-3.5" style={{ color: '#d4a574' }} />
            <span className="text-sm font-bold" style={{ color: '#2d3748' }}>
              {solved.size}/{TOTAL_PIECES}
            </span>
          </div>

          {/* Erreurs */}
          <div 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border-2 shadow-sm"
            style={{
              background: '#ffffff',
              borderColor: '#c44536',
            }}
          >
            <XCircle className="w-3.5 h-3.5" style={{ color: '#c44536' }} />
            <span className="text-sm font-bold" style={{ color: '#2d3748' }}>
              {wrongRef.current}
            </span>
          </div>
        </motion.div>

        {/* Barre de progression */}
        <motion.div
          className="w-full max-w-[500px] h-3 rounded-full mb-4 overflow-hidden shadow-inner"
          style={{
            background: '#e8d5b7',
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <motion.div
            className="h-full rounded-full relative"
            style={{
              backgroundImage: 'linear-gradient(90deg, #2d7a4f 0%, #4a9d6f 100%)',
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 120, damping: 18 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer rounded-full" />
          </motion.div>
        </motion.div>

        {/* Grille */}
        <PuzzleGrid
          pieces={pieces}
          solved={solved}
          gridSize={GRID_SIZE}
          highlightCell={highlightCell}
          wrongCell={wrongCell}
          onDrop={handleDrop}
        />

        {/* Zone de pièces */}
        <AnimatePresence mode="wait">
          {!isComplete && (
            <motion.div
              key="tray"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <PieceTray pieces={shuffledPieces} solved={solved} />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Popup victoire */}
        <AnimatePresence>
          {showVictory && stats && (
            <VictoryPopup
              stats={stats}
              grade={grade}
              gradeLevels={gradeLevels}
              getStars={getStars}
              formatTime={formatTime}
              onReplay={() => restart()}
              onNewGrade={(g) => { setGrade(g as GradeLevel); restart(g as GradeLevel); }}
            />
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SPARKLE EFFECT (couleurs cahier)
// ─────────────────────────────────────────────
function SparkleEffect({ x, y }: { x: number; y: number }) {
  const particles = Array.from({ length: 10 }, (_, i) => i);
  const colors    = ["#2d7a4f", "#4a9d6f", "#f4a261", "#d4a574", "#8b7355"];

  return (
    <div
      className="pointer-events-none fixed z-50"
      style={{ left: x, top: y, transform: "translate(-50%, -50%)" }}
    >
      {particles.map((i) => {
        const angle = (360 / particles.length) * i;
        const dist  = 30 + Math.random() * 30;
        const color = colors[i % colors.length];
        return (
          <motion.div
            key={i}
            className="absolute w-2 h-2 rounded-full"
            style={{ background: color }}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{
              x: Math.cos((angle * Math.PI) / 180) * dist,
              y: Math.sin((angle * Math.PI) / 180) * dist,
              scale: 0,
              opacity: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}
      <motion.div
        className="absolute text-lg"
        style={{ transform: "translate(-50%, -50%)" }}
        initial={{ scale: 0, opacity: 1 }}
        animate={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        ✨
      </motion.div>
    </div>
  );
}

// ─────────────────────────────────────────────
// VICTORY POPUP
// ─────────────────────────────────────────────
interface VictoryPopupProps {
  stats:       GameStats;
  grade:       GradeLevel;
  gradeLevels: { value: string; label: string }[];
  getStars:    (correct: number, wrong: number) => number;
  formatTime:  (s: number) => string;
  onReplay:    () => void;
  onNewGrade:  (grade: string) => void;
}

function VictoryPopup({
  stats,
  grade,
  gradeLevels,
  getStars,
  formatTime,
  onReplay,
  onNewGrade,
}: VictoryPopupProps) {
  const stars    = getStars(stats.correct, stats.wrong);
  const accuracy = stats.correct + stats.wrong > 0
    ? Math.round((stats.correct / (stats.correct + stats.wrong)) * 100)
    : 100;

  const statRows = [
    { icon: <Target className="w-4 h-4" style={{ color: '#2d7a4f' }} />,   label: "Précision",      value: `${accuracy}%`,             color: "#2d7a4f" },
    { icon: <Clock  className="w-4 h-4" style={{ color: '#4a9d6f' }} />,   label: "Temps",          value: formatTime(stats.duration), color: "#4a9d6f" },
    { icon: <Zap    className="w-4 h-4" style={{ color: '#f4a261' }} />,   label: "Meilleur combo", value: `×${stats.maxCombo}`,       color: "#f4a261" },
    { icon: <XCircle className="w-4 h-4" style={{ color: '#c44536' }} />,  label: "Erreurs",        value: `${stats.wrong}`,           color: "#c44536" },
  ];

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <motion.div
        className="relative z-10 w-full max-w-sm rounded-3xl shadow-2xl border-2 overflow-hidden"
        style={{
          background: '#faf8f3',
          borderColor: '#4a9d6f',
        }}
        initial={{ scale: 0.7, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div 
          className="h-2 w-full"
          style={{
            backgroundImage: 'linear-gradient(90deg, #2d7a4f 0%, #4a9d6f 100%)',
          }}
        />

        <div className="px-6 py-6 flex flex-col items-center gap-4">

          <motion.div
            initial={{ rotate: -15, scale: 0 }}
            animate={{ rotate: 0,   scale: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <Trophy className="w-16 h-16" style={{ color: '#d4a574' }} />
          </motion.div>

          <div className="text-center">
            <h2 
              className="text-2xl font-extrabold tracking-tight"
              style={{ 
                color: '#2d3748',
                fontFamily: '"Nunito", "Comic Neue", sans-serif',
              }}
            >
              🎉 Félicitations !
            </h2>
            <p className="text-sm mt-1" style={{ color: '#6b7280' }}>
              Puzzle complété en {formatTime(stats.duration)}
            </p>
          </div>

          <div className="flex gap-1.5">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0, rotate: -30 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ delay: 0.2 + s * 0.1, type: "spring", stiffness: 300 }}
              >
                <Star
                  className={`w-9 h-9 ${
                    s <= stars
                      ? "fill-current"
                      : "opacity-30"
                  }`}
                  style={{ color: s <= stars ? '#d4a574' : '#9ca3af' }}
                />
              </motion.div>
            ))}
          </div>

          <div className="w-full grid grid-cols-2 gap-2">
            {statRows.map(({ icon, label, value, color }, i) => (
              <motion.div
                key={label}
                className="flex flex-col items-center gap-1 rounded-2xl p-3 border-2"
                style={{
                  background: '#ffffff',
                  borderColor: '#e8d5b7',
                }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.07 }}
              >
                {icon}
                <span className="text-lg font-extrabold" style={{ color }}>
                  {value}
                </span>
                <span 
                  className="text-[10px] uppercase tracking-widest font-semibold"
                  style={{ color: '#9ca3af' }}
                >
                  {label}
                </span>
              </motion.div>
            ))}
          </div>

          <motion.p
            className="text-sm text-center px-2"
            style={{ color: '#6b7280' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            {stars === 3
              ? "🏆 Score parfait ! Tu maîtrises ce niveau !"
              : stars === 2
              ? "⭐ Bien joué ! Quelques erreurs mais tu t'en sors !"
              : "💪 Continue à t'entraîner pour améliorer ta précision !"}
          </motion.p>

          <motion.div
            className="w-full flex flex-col gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Button
              onClick={onReplay}
              className="w-full font-bold rounded-xl py-5 shadow-lg text-white"
              style={{
                backgroundImage: 'linear-gradient(135deg, #2d7a4f 0%, #4a9d6f 100%)',
              }}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Rejouer ce niveau
            </Button>

            {grade !== "terminale" && (
              <Button
                variant="outline"
                onClick={() => {
                  const idx  = gradeLevels.findIndex((g) => g.value === grade);
                  const next = gradeLevels[idx + 1];
                  if (next) onNewGrade(next.value);
                }}
                className="w-full rounded-xl border-2 font-semibold py-5"
                style={{
                  borderColor: '#4a9d6f',
                  background: '#ffffff',
                  color: '#2d3748',
                }}
              >
                Niveau suivant →
              </Button>
            )}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}