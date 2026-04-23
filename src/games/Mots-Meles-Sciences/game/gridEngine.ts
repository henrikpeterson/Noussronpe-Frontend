import { Direction, GridState, PlacedWord, Question } from "./types";

const DIRS: Record<Direction, { dr: number; dc: number }> = {
  E:  { dr: 0,  dc: 1 },
  W:  { dr: 0,  dc: -1 },
  N:  { dr: -1, dc: 0 },
  S:  { dr: 1,  dc: 0 },
  NE: { dr: -1, dc: 1 },
  NW: { dr: -1, dc: -1 },
  SE: { dr: 1,  dc: 1 },
  SW: { dr: 1,  dc: -1 },
};

const ALL_DIRS = Object.keys(DIRS) as Direction[];
const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

/** Normalize a French word: uppercase, strip accents/spaces/non-letters */
export function normalizeWord(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z]/g, "");
}

function rand(n: number) { return Math.floor(Math.random() * n); }

function tryPlace(
  letters: string[][],
  cellWord: (number | null)[][],
  word: string,
  size: number,
  wordIdx: number,
): { r: number; c: number }[] | null {
  const dirs = [...ALL_DIRS].sort(() => Math.random() - 0.5);
  for (const dir of dirs) {
    const { dr, dc } = DIRS[dir];
    // Compute valid starting bounds
    const len = word.length;
    if (len > size) continue;

    // pick random starting positions
    const starts: { r: number; c: number }[] = [];
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const endR = r + dr * (len - 1);
        const endC = c + dc * (len - 1);
        if (endR < 0 || endR >= size || endC < 0 || endC >= size) continue;
        starts.push({ r, c });
      }
    }
    starts.sort(() => Math.random() - 0.5);

    for (const { r, c } of starts) {
      let ok = true;
      const cells: { r: number; c: number }[] = [];
      for (let i = 0; i < len; i++) {
        const rr = r + dr * i;
        const cc = c + dc * i;
        const existing = letters[rr][cc];
        if (existing !== "" && existing !== word[i]) { ok = false; break; }
        cells.push({ r: rr, c: cc });
      }
      if (!ok) continue;
      // commit
      cells.forEach((cell, i) => {
        letters[cell.r][cell.c] = word[i];
        cellWord[cell.r][cell.c] = wordIdx;
      });
      return cells;
    }
  }
  return null;
}

export interface BuildGridResult {
  grid: GridState;
  placed: PlacedWord[];
  unplaced: Question[];
}

/**
 * Build a grid with up to MAX words from the queue.
 * Returns placed words, leftover questions to keep for next batch.
 */
export function buildGrid(size: number, questions: Question[], maxWords: number): BuildGridResult {
  const letters: string[][] = Array.from({ length: size }, () => Array(size).fill(""));
  const cellWord: (number | null)[][] = Array.from({ length: size }, () => Array(size).fill(null));

  // Sort by length descending (place longest first → easier to fit short ones around)
  const sorted = [...questions].sort((a, b) => b.reponse.length - a.reponse.length);

  const placed: PlacedWord[] = [];
  const unplaced: Question[] = [];

  for (const q of sorted) {
    if (placed.length >= maxWords) {
      unplaced.push(q);
      continue;
    }
    const word = normalizeWord(q.reponse);
    if (word.length === 0 || word.length > size) {
      unplaced.push(q);
      continue;
    }
    const cells = tryPlace(letters, cellWord, word, size, placed.length);
    if (cells) {
      placed.push({
        question: q,
        word,
        cells,
        found: false,
        hintsUsed: 0,
        pointsLost: 0,
      });
    } else {
      unplaced.push(q);
    }
  }

  // Fill empty cells with random letters
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (letters[r][c] === "") {
        letters[r][c] = LETTERS[rand(LETTERS.length)];
      }
    }
  }

  return {
    grid: { size, letters, cellWord },
    placed,
    unplaced,
  };
}

/** Compute the straight line of cells between two grid positions if they form
 *  a valid straight or 45° diagonal line. Returns null otherwise. */
export function lineBetween(
  start: { r: number; c: number },
  end: { r: number; c: number },
): { r: number; c: number }[] | null {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  if (dr === 0 && dc === 0) return [start];

  const stepR = Math.sign(dr);
  const stepC = Math.sign(dc);

  // Must be horizontal, vertical, or 45° diagonal
  if (dr !== 0 && dc !== 0 && Math.abs(dr) !== Math.abs(dc)) return null;

  const len = Math.max(Math.abs(dr), Math.abs(dc)) + 1;
  const cells: { r: number; c: number }[] = [];
  for (let i = 0; i < len; i++) {
    cells.push({ r: start.r + stepR * i, c: start.c + stepC * i });
  }
  return cells;
}

/** Check if a sequence of cells matches one of the placed words (forward or reverse). */
export function matchWord(
  cells: { r: number; c: number }[],
  placed: PlacedWord[],
): number | null {
  if (cells.length < 2) return null;
  for (let i = 0; i < placed.length; i++) {
    const pw = placed[i];
    if (pw.found) continue;
    if (pw.cells.length !== cells.length) continue;
    const sameForward = pw.cells.every((pc, k) => pc.r === cells[k].r && pc.c === cells[k].c);
    const reversed = [...pw.cells].reverse();
    const sameReverse = reversed.every((pc, k) => pc.r === cells[k].r && pc.c === cells[k].c);
    if (sameForward || sameReverse) return i;
  }
  return null;
}
