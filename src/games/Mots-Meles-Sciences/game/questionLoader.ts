import q6 from "@/games/Mots-Meles-Sciences/data/questions_6eme.json";
import q5 from "@/games/Mots-Meles-Sciences/data/questions_5eme.json";
import q4 from "@/games/Mots-Meles-Sciences/data/questions_4eme.json";
import q3 from "@/games/Mots-Meles-Sciences/data/questions_3eme.json";
import { Classe, Question, QuestionsFile } from "./types";

const MAP: Record<Classe, QuestionsFile> = {
  "6eme": q6 as QuestionsFile,
  "5eme": q5 as QuestionsFile,
  "4eme": q4 as QuestionsFile,
  "3eme": q3 as QuestionsFile,
};

export function getQuestions(classe: Classe): Question[] {
  return MAP[classe]?.questions ?? [];
}

/** Pick `count` questions randomly (without replacement) from the pool, repeating if needed. */
export function pickQuestions(classe: Classe, count: number, seed?: number): Question[] {
  const pool = [...getQuestions(classe)];
  if (pool.length === 0) return [];
  const result: Question[] = [];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  while (result.length < count) {
    for (const q of shuffled) {
      if (result.length >= count) break;
      result.push(q);
    }
  }
  return result.slice(0, count);
}
