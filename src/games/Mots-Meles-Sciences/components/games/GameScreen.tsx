import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Classe, CLASSES, GridState, HINT_COSTS, LEVEL_COMPLETE_BONUS, LEVELS, MAX_WORDS_PER_GRID, PlacedWord, POINTS_PER_WORD, Question } from "@/games/Mots-Meles-Sciences/game/types";
import { buildGrid } from "@/games/Mots-Meles-Sciences/game/gridEngine";
import { pickQuestions } from "@/games/Mots-Meles-Sciences/game/questionLoader";
import { GameHeader } from "./GameHeader";
import { WordGrid } from "./WordGrid";
import { QuestionCard } from "./QuestionCard";
import { PauseModal } from "./PauseModal";
import { LevelCompleteModal } from "./LevelCompleteModal";
import { toast } from "sonner";
import { bestScoreKey, loadProgress, saveProgress } from "@/games/Mots-Meles-Sciences/game/storage";
import { useIsMobile } from "@/hooks/use-mobile";

// On mobile, cap grid size to keep cells comfortably large
function mobileGridSize(baseSize: number, isMobile: boolean): number {
  if (!isMobile) return baseSize;
  return Math.min(baseSize, Math.max(10, baseSize - 2));
}


interface GameScreenProps {
  classe: Classe;
  level: number;
  onQuit: () => void;
  onLevelComplete: (level: number, score: number) => void;
}

const ENCOURAGEMENTS = ["Bravo !", "Excellent !", "Super !", "Continue !", "Tu es fort !", "Magnifique !"];

export function GameScreen({ classe, level, onQuit, onLevelComplete }: GameScreenProps) {
  const cls = CLASSES.find(c => c.id === classe)!;
  const config = LEVELS.find(l => l.level === level) ?? LEVELS[0];
  const isMobile = useIsMobile();
  const gridSize = mobileGridSize(config.gridSize, isMobile);

  // Pool of remaining questions (not yet placed in any grid this level)
  const [queue, setQueue] = useState<Question[]>([]);
  const [grid, setGrid] = useState<GridState>(() => buildGrid(gridSize, [], MAX_WORDS_PER_GRID).grid);
  const [placed, setPlaced] = useState<PlacedWord[]>([]);
  const [foundTotal, setFoundTotal] = useState(0);
  const [score, setScore] = useState(0);
  const [paused, setPaused] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [batchKey, setBatchKey] = useState(0);
  const startedAtRef = useRef<number>(Date.now());
  const wordStartTimeRef = useRef<number>(Date.now());

  // Hint reveals: cells that were unveiled by hint level 1 or 2
  const [hintReveals, setHintReveals] = useState<{ r: number; c: number }[]>([]);

  // Initialize level
  useEffect(() => {
    const allQuestions = pickQuestions(classe, config.questionCount);
    const built = buildGrid(gridSize, allQuestions, MAX_WORDS_PER_GRID);
    setQueue(built.unplaced);
    setGrid(built.grid);
    setPlaced(built.placed);
    setFoundTotal(0);
    setScore(0);
    setPaused(false);
    setCompleted(false);
    setElapsed(0);
    setHintReveals([]);
    autoHintPositions.current.clear();
    setBatchKey(k => k + 1);
    startedAtRef.current = Date.now();
    wordStartTimeRef.current = Date.now();
  }, [classe, level, gridSize, config.questionCount]);

  // Timer
  useEffect(() => {
    if (paused || completed) return;
    const id = window.setInterval(() => {
      setElapsed(Math.floor((Date.now() - startedAtRef.current) / 1000));
    }, 1000);
    return () => window.clearInterval(id);
  }, [paused, completed]);

  // Visible question cards (max 3 unfound)
  const visibleCards = useMemo(() => {
    const unfound: { pw: PlacedWord; index: number }[] = [];
    placed.forEach((pw, i) => { if (!pw.found) unfound.push({ pw, index: i }); });
    return unfound.slice(0, 3);
  }, [placed]);

  // Auto-hint: for each visible card, pick a stable random cell to highlight
  // Use a ref to store random positions per placed index so they don't change on re-render
  const autoHintPositions = useRef<Map<number, number>>(new Map());
  const autoHints = useMemo(() => {
    const hints: { r: number; c: number; colorIndex: number }[] = [];
    visibleCards.forEach(({ pw, index }, cardIdx) => {
      if (pw.found || pw.cells.length === 0) return;
      if (!autoHintPositions.current.has(index)) {
        const len = pw.cells.length;
        const pos = len <= 2 ? 0 : 1 + Math.floor(Math.random() * (len - 2));
        autoHintPositions.current.set(index, pos);
      }
      const pos = autoHintPositions.current.get(index)!;
      const cell = pw.cells[pos];
      hints.push({ r: cell.r, c: cell.c, colorIndex: cardIdx });
    });
    return hints;
  }, [visibleCards]);

  function fireConfetti(small = false) {
    confetti({
      particleCount: small ? 30 : 120,
      spread: small ? 50 : 80,
      origin: { y: 0.6 },
      colors: ["#facc15", "#22c55e", "#3b82f6", "#ef4444"],
      scalar: small ? 0.7 : 1,
    });
  }

  function nextBatchOrComplete(updatedPlaced: PlacedWord[]) {
    const allFoundInBatch = updatedPlaced.every(p => p.found);
    if (!allFoundInBatch) return;

    if (queue.length === 0) {
      // Level complete
      const finalScore = score + LEVEL_COMPLETE_BONUS;
      setScore(finalScore);
      setCompleted(true);
      window.setTimeout(() => fireConfetti(false), 200);
      window.setTimeout(() => fireConfetti(false), 500);
    } else {
      // Build next batch
      window.setTimeout(() => {
        const built = buildGrid(gridSize, queue, MAX_WORDS_PER_GRID);
        setQueue(built.unplaced);
        setGrid(built.grid);
        setPlaced(built.placed);
        setHintReveals([]);
        autoHintPositions.current.clear();
        setBatchKey(k => k + 1);
        wordStartTimeRef.current = Date.now();
        toast.success("Nouvelle grille !", { duration: 1500 });
      }, 800);
    }
  }

  function handleWordFound(idx: number) {
    setPlaced(prev => {
      const next = [...prev];
      const target = { ...next[idx], found: true };
      next[idx] = target;

      // Compute points: base + speed bonus - hint penalty
      const elapsedForWord = (Date.now() - wordStartTimeRef.current) / 1000;
      const speedBonus = Math.max(0, Math.floor(15 - elapsedForWord));
      const earned = POINTS_PER_WORD + speedBonus - target.pointsLost;
      setScore(s => s + Math.max(1, earned));
      setFoundTotal(n => n + 1);
      wordStartTimeRef.current = Date.now();

      const msg = ENCOURAGEMENTS[Math.floor(Math.random() * ENCOURAGEMENTS.length)];
      toast.success(`${msg} +${Math.max(1, earned)} pts`, { duration: 1500 });
      fireConfetti(true);

      // Check batch end after state settles
      window.setTimeout(() => nextBatchOrComplete(next), 0);
      return next;
    });
  }

  function handleWrongAttempt() {
    toast.error("Essaie encore !", { duration: 1000 });
  }

  function handleHint(idx: number) {
    setPlaced(prev => {
      const next = [...prev];
      const target = { ...next[idx] };
      if (target.hintsUsed >= 3 || target.found) return prev;
      const hintLevel = target.hintsUsed + 1;
      const cost = HINT_COSTS[target.hintsUsed];
      target.hintsUsed = hintLevel;
      target.pointsLost += cost;
      next[idx] = target;
      setScore(s => Math.max(0, s - cost));

      // Reveal cells based on hint level
      const wordCells = target.cells;
      if (hintLevel === 1) {
        // Reveal first letter
        setHintReveals(prevR => [...prevR, wordCells[0]]);
      } else if (hintLevel === 2) {
        setHintReveals(prevR => [...prevR, wordCells[0], wordCells[wordCells.length - 1]]);
      } else if (hintLevel === 3) {
        // Auto-find the word
        target.found = true;
        setHintReveals(prevR => [...prevR, ...wordCells]);
        setFoundTotal(n => n + 1);
        toast.info("Mot révélé !", { duration: 1500 });
        window.setTimeout(() => nextBatchOrComplete(next), 200);
      }
      return next;
    });
  }

  function handlePauseClick() { setPaused(true); }
  function handleResume() { setPaused(false); }
  function handleRestart() {
    setPaused(false);
    // re-trigger init
    const allQuestions = pickQuestions(classe, config.questionCount);
    const built = buildGrid(gridSize, allQuestions, MAX_WORDS_PER_GRID);
    setQueue(built.unplaced);
    setGrid(built.grid);
    setPlaced(built.placed);
    setFoundTotal(0);
    setScore(0);
    setCompleted(false);
    setElapsed(0);
    setHintReveals([]);
    autoHintPositions.current.clear();
    setBatchKey(k => k + 1);
    startedAtRef.current = Date.now();
    wordStartTimeRef.current = Date.now();
  }

  function handleNextLevel() {
    const nextLvl = level + 1;
    if (LEVELS.find(l => l.level === nextLvl)) {
      onLevelComplete(level, score);
      // Parent navigates; but to make it instant within game, we could just rebuild here.
      // We rely on parent to remount with new level prop.
      setTimeout(() => {
        const evt = new CustomEvent("pct-go-level", { detail: { level: nextLvl } });
        window.dispatchEvent(evt);
      }, 100);
    } else {
      onQuit();
    }
  }

  function handleQuit() {
    onLevelComplete(level, score);
    onQuit();
  }

  // Save best score when completed
  useEffect(() => {
    if (!completed) return;
    const p = loadProgress();
    const key = bestScoreKey(classe, level);
    if (!p.bestScores[key] || score > p.bestScores[key]) {
      p.bestScores[key] = score;
    }
    p.classe = classe;
    p.level = Math.max(p.level, level);
    saveProgress(p);
  }, [completed, classe, level, score]);

  const bestScore = loadProgress().bestScores[bestScoreKey(classe, level)] ?? 0;

  return (
    <div className="min-h-screen min-h-[100dvh] paper-bg flex flex-col">
      <GameHeader
        classeLabel={cls.label}
        level={level}
        score={score}
        foundCount={foundTotal}
        totalCount={config.questionCount}
        elapsedSec={elapsed}
        onBack={handleQuit}
        onPause={handlePauseClick}
      />

      <main className="flex-1 flex flex-col items-center px-2 py-2 sm:py-4 gap-2 sm:gap-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={batchKey}
            initial={{ opacity: 0, rotateY: 20, scale: 0.95 }}
            animate={{ opacity: 1, rotateY: 0, scale: 1 }}
            exit={{ opacity: 0, rotateY: -20, scale: 0.95 }}
            transition={{ duration: 0.5 }}
            className="w-full"
          >
            <WordGrid
              grid={grid}
              placed={placed}
              hintReveals={hintReveals}
              autoHints={autoHints}
              onWordFound={handleWordFound}
              onWrongAttempt={handleWrongAttempt}
              paused={paused}
            />
          </motion.div>
        </AnimatePresence>

        {/* Question cards */}
        <div className="w-full max-w-4xl px-1">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <AnimatePresence mode="popLayout">
              {visibleCards.map(({ pw, index }, cardIdx) => (
                <QuestionCard key={`${batchKey}-${index}`} pw={pw} index={index} cardColorIndex={cardIdx} onHint={handleHint} />
              ))}
            </AnimatePresence>
            {visibleCards.length === 0 && (
              <div className="paper-card rounded-2xl p-4 text-center text-sm text-muted-foreground w-full">
                Préparation de la prochaine grille...
              </div>
            )}
          </div>
        </div>
      </main>

      <PauseModal
        open={paused}
        onResume={handleResume}
        onRestart={handleRestart}
        onQuit={handleQuit}
      />

      <LevelCompleteModal
        open={completed}
        level={level}
        score={score}
        bestScore={bestScore}
        hasNext={!!LEVELS.find(l => l.level === level + 1)}
        onNext={handleNextLevel}
        onQuit={handleQuit}
      />
    </div>
  );
}