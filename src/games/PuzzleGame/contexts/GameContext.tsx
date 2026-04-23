import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { LEVELS, calculateStars, calculatePoints, type PuzzleImage, type Level } from "@/games/PuzzleGame/data/puzzleData";

interface PuzzleResult {
  imageId: string;
  stars: number;
  points: number;
  bestTime: number;
}

interface GameState {
  totalPoints: number;
  results: Record<string, PuzzleResult>;
  currentLevel: number | null;
  currentImage: PuzzleImage | null;
  screen: "menu" | "level" | "puzzle" | "complete";
}

interface GameContextType extends GameState {
  levels: Level[];
  isLevelUnlocked: (levelId: number) => boolean;
  getLevelStars: (levelId: number) => number;
  selectLevel: (levelId: number) => void;
  selectImage: (image: PuzzleImage) => void;
  completePuzzle: (timeLeft: number, errors: number, totalTime: number) => void;
  useHint: () => boolean;
  goToMenu: () => void;
  goToLevel: () => void;
}

const GameContext = createContext<GameContextType | null>(null);

const STORAGE_KEY = "african-puzzle-game";

function loadState(): Partial<GameState> {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { totalPoints: parsed.totalPoints || 0, results: parsed.results || {} };
    }
  } catch { /* empty */ }
  return { totalPoints: 0, results: {} };
}

function saveState(totalPoints: number, results: Record<string, PuzzleResult>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ totalPoints, results }));
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const saved = loadState();
  const [state, setState] = useState<GameState>({
    totalPoints: saved.totalPoints || 0,
    results: saved.results || {},
    currentLevel: null,
    currentImage: null,
    screen: "menu",
  });

  useEffect(() => {
    saveState(state.totalPoints, state.results);
  }, [state.totalPoints, state.results]);

  const isLevelUnlocked = useCallback((levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return false;
    return state.totalPoints >= level.requiredPoints;
  }, [state.totalPoints]);

  const getLevelStars = useCallback((levelId: number) => {
    const level = LEVELS.find(l => l.id === levelId);
    if (!level) return 0;
    return level.images.reduce((sum, img) => {
      const result = state.results[img.id];
      return sum + (result?.stars || 0);
    }, 0);
  }, [state.results]);

  const selectLevel = useCallback((levelId: number) => {
    setState(s => ({ ...s, currentLevel: levelId, screen: "level" }));
  }, []);

  const selectImage = useCallback((image: PuzzleImage) => {
    setState(s => ({ ...s, currentImage: image, screen: "puzzle" }));
  }, []);

  const completePuzzle = useCallback((timeLeft: number, errors: number, totalTime: number) => {
    const level = LEVELS.find(l => l.id === state.currentLevel);
    if (!level || !state.currentImage) return;

    const underTime = timeLeft > totalTime * 0.3;
    const noErrors = errors === 0;
    const stars = calculateStars(true, underTime, noErrors);
    const combo = noErrors ? 3 : 0;
    const points = calculatePoints(level.grid, timeLeft, stars, combo);

    const existingResult = state.results[state.currentImage.id];
    const isBetter = !existingResult || points > existingResult.points;

    setState(s => ({
      ...s,
      totalPoints: isBetter ? s.totalPoints + points - (existingResult?.points || 0) : s.totalPoints,
      results: {
        ...s.results,
        [state.currentImage!.id]: isBetter
          ? { imageId: state.currentImage!.id, stars, points, bestTime: totalTime - timeLeft }
          : existingResult,
      },
      screen: "complete",
    }));
  }, [state.currentLevel, state.currentImage, state.results]);

  const useHint = useCallback(() => {
    if (state.totalPoints < 100) return false;
    setState(s => ({ ...s, totalPoints: s.totalPoints - 100 }));
    return true;
  }, [state.totalPoints]);

  const goToMenu = useCallback(() => {
    setState(s => ({ ...s, screen: "menu", currentLevel: null, currentImage: null }));
  }, []);

  const goToLevel = useCallback(() => {
    setState(s => ({ ...s, screen: "level", currentImage: null }));
  }, []);

  return (
    <GameContext.Provider value={{
      ...state,
      levels: LEVELS,
      isLevelUnlocked,
      getLevelStars,
      selectLevel,
      selectImage,
      completePuzzle,
      useHint,
      goToMenu,
      goToLevel,
    }}>
      {children}
    </GameContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be inside GameProvider");
  return ctx;
}
