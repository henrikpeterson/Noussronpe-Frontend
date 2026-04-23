import { Classe, GameProgress } from "./types";

const KEY = "pct-en-poche-progress-v1";

const defaultProgress: GameProgress = {
  classe: "6eme",
  level: 1,
  totalScore: 0,
  bestScores: {},
};

export function loadProgress(): GameProgress {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...defaultProgress };
    return { ...defaultProgress, ...JSON.parse(raw) };
  } catch {
    return { ...defaultProgress };
  }
}

export function saveProgress(p: GameProgress) {
  try {
    localStorage.setItem(KEY, JSON.stringify(p));
  } catch {
    /* ignore */
  }
}

export function bestScoreKey(classe: Classe, level: number) {
  return `${classe}-${level}`;
}
