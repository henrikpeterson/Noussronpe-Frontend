export type Classe = "6eme" | "5eme" | "4eme" | "3eme";

export type Direction =
  | "E"   // east →
  | "W"   // west ←
  | "N"   // north ↑
  | "S"   // south ↓
  | "NE"  // ↗
  | "NW"  // ↖
  | "SE"  // ↘
  | "SW"; // ↙

export interface Question {
  id: number;
  question: string;
  reponse: string;
  indices: string[];
  categorie: string;
}

export interface QuestionsFile {
  classe: string;
  matiere: string;
  questions: Question[];
}

export interface PlacedWord {
  question: Question;
  word: string;          // normalized: A-Z only
  cells: { r: number; c: number }[];
  found: boolean;
  hintsUsed: number;     // 0..3
  pointsLost: number;
}

export interface GridState {
  size: number;
  letters: string[][];          // [row][col]
  cellWord: (number | null)[][]; // index in placedWords for that cell, null if random
}

export interface LevelConfig {
  level: number;
  questionCount: number;
  gridSize: number;
}

export interface GameProgress {
  classe: Classe;
  level: number;          // 1..10
  totalScore: number;
  bestScores: Record<string, number>; // key: `${classe}-${level}`
}

export const LEVELS: LevelConfig[] = [
  { level: 1, questionCount: 5, gridSize: 12 },
  { level: 2, questionCount: 10, gridSize: 13 },
  { level: 3, questionCount: 15, gridSize: 14 },
  { level: 4, questionCount: 20, gridSize: 15 },
  { level: 5, questionCount: 25, gridSize: 16 },
  { level: 6, questionCount: 30, gridSize: 17 },
  { level: 7, questionCount: 35, gridSize: 18 },
  { level: 8, questionCount: 40, gridSize: 19 },
  { level: 9, questionCount: 45, gridSize: 19 },
  { level: 10, questionCount: 50, gridSize: 20 },
];

export const MAX_WORDS_PER_GRID = 10;
export const POINTS_PER_WORD = 10;
export const LEVEL_COMPLETE_BONUS = 50;
export const HINT_COSTS = [5, 5, 10];

export const CLASSES: { id: Classe; label: string; emoji: string; tagline: string }[] = [
  { id: "6eme", label: "6ème", emoji: "🌱", tagline: "Premiers pas en PCT" },
  { id: "5eme", label: "5ème", emoji: "🔬", tagline: "Découvre la matière" },
  { id: "4eme", label: "4ème", emoji: "⚡", tagline: "Explore l'électricité" },
  { id: "3eme", label: "3ème", emoji: "🚀", tagline: "Maîtrise la science" },
];
