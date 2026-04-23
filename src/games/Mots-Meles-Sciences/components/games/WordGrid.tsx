import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GridState, PlacedWord } from "@/games/Mots-Meles-Sciences/game/types";
import { lineBetween, matchWord } from "@/games/Mots-Meles-Sciences/game/gridEngine";
import { cn } from "@/lib/utils";

interface WordGridProps {
  grid: GridState;
  placed: PlacedWord[];
  hintReveals: { r: number; c: number }[];
  autoHints?: { r: number; c: number; colorIndex: number }[];
  onWordFound: (placedIndex: number) => void;
  onWrongAttempt: () => void;
  paused?: boolean;
}

interface Pos { r: number; c: number; }

export function WordGrid({ grid, placed, hintReveals, autoHints = [], onWordFound, onWrongAttempt, paused }: WordGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [start, setStart] = useState<Pos | null>(null);
  const [current, setCurrent] = useState<Pos | null>(null);
  const [errorCells, setErrorCells] = useState<Pos[] | null>(null);
  const [recentlyFound, setRecentlyFound] = useState<number | null>(null);

  const foundCells = useMemo(() => {
    const m = new Map<string, true>();
    placed.forEach(p => {
      if (p.found) p.cells.forEach(c => m.set(`${c.r},${c.c}`, true));
    });
    return m;
  }, [placed]);

  const hintMap = useMemo(() => {
    const m = new Map<string, true>();
    hintReveals.forEach(c => m.set(`${c.r},${c.c}`, true));
    return m;
  }, [hintReveals]);

  const autoHintMap = useMemo(() => {
    const m = new Map<string, number>();
    autoHints.forEach(h => m.set(`${h.r},${h.c}`, h.colorIndex));
    return m;
  }, [autoHints]);

  const selectionCells = useMemo<Pos[]>(() => {
    if (!start || !current) return [];
    return lineBetween(start, current) ?? [start];
  }, [start, current]);

  const selectionMap = useMemo(() => {
    const m = new Map<string, true>();
    selectionCells.forEach(c => m.set(`${c.r},${c.c}`, true));
    return m;
  }, [selectionCells]);

  function getCellFromPoint(clientX: number, clientY: number): Pos | null {
    const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
    if (!el) return null;
    const cell = el.closest("[data-cell]") as HTMLElement | null;
    if (!cell) return null;
    const r = Number(cell.dataset.row);
    const c = Number(cell.dataset.col);
    if (Number.isFinite(r) && Number.isFinite(c)) return { r, c };
    return null;
  }

  function handleStart(p: Pos) {
    if (paused) return;
    setStart(p);
    setCurrent(p);
  }

  function handleMove(p: Pos) {
    if (!start || paused) return;
    if (!current || current.r !== p.r || current.c !== p.c) {
      setCurrent(p);
    }
  }

  function handleEnd() {
    if (!start || !current) {
      setStart(null);
      setCurrent(null);
      return;
    }
    const cells = selectionCells;
    if (cells.length >= 2) {
      const idx = matchWord(cells, placed);
      if (idx !== null) {
        setRecentlyFound(idx);
        onWordFound(idx);
        window.setTimeout(() => setRecentlyFound(null), 700);
      } else {
        setErrorCells(cells);
        onWrongAttempt();
        window.setTimeout(() => setErrorCells(null), 400);
      }
    }
    setStart(null);
    setCurrent(null);
  }

  // Pointer events
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onPointerDown = (e: PointerEvent) => {
      const p = getCellFromPoint(e.clientX, e.clientY);
      if (p) {
        e.preventDefault();
        handleStart(p);
      }
    };
    const onPointerMove = (e: PointerEvent) => {
      if (!start) return;
      const p = getCellFromPoint(e.clientX, e.clientY);
      if (p) handleMove(p);
    };
    const onPointerUp = () => handleEnd();

    el.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointercancel", onPointerUp);
    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      window.removeEventListener("pointercancel", onPointerUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, current, placed, paused]);

  const errorMap = useMemo(() => {
    const m = new Map<string, true>();
    errorCells?.forEach(c => m.set(`${c.r},${c.c}`, true));
    return m;
  }, [errorCells]);

  // Cell sizing: max(34px minimum on mobile, dynamic calc)
  const gap = 3;
  const cellSize = `max(34px, min(calc((100vw - 32px - ${gap * (grid.size - 1)}px) / ${grid.size}), calc((min(65vh, 65dvh)) / ${grid.size})))`;

  return (
    <div className="w-full flex justify-center overflow-x-auto">
      <div
        ref={containerRef}
        className="paper-card rounded-2xl p-2 sm:p-3 touch-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${grid.size}, ${cellSize})`,
          gap: `${gap}px`,
        }}
      >
        {grid.letters.map((row, r) =>
          row.map((letter, c) => {
            const key = `${r},${c}`;
            const isFound = foundCells.has(key);
            const isSelected = selectionMap.has(key);
            const isError = errorMap.has(key);
            const isHint = hintMap.has(key);
            const autoHintColor = autoHintMap.get(key);
            return (
              <motion.div
                key={key}
                data-cell
                data-row={r}
                data-col={c}
                initial={false}
                animate={
                  isFound && recentlyFound !== null && placed[recentlyFound]?.cells.some(pc => pc.r === r && pc.c === c)
                    ? { scale: [1, 1.25, 1] }
                    : {}
                }
                transition={{ duration: 0.45 }}
                className={cn(
                  "grid-cell",
                  isFound && "grid-cell-found",
                  !isFound && isSelected && "grid-cell-selected",
                  !isFound && !isSelected && isHint && "grid-cell-hint",
                  !isFound && !isSelected && !isHint && autoHintColor !== undefined && `grid-cell-autohint-${autoHintColor}`,
                  isError && "grid-cell-error",
                )}
                style={{
                  width: cellSize,
                  height: cellSize,
                  fontSize: `calc(${cellSize} * 0.6)`,
                }}
              >
                {letter}
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
