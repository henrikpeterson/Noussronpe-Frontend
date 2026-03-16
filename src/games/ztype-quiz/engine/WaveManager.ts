// src/games/ztype-quiz/engine/WaveManager.ts

import { TOTAL_WAVES } from '../config/constants';
import { getWaveConfig } from '../config/difficulty';
import type { SpawnData } from './EnemyManager';

// ============================================
// TYPES
// ============================================

export interface Question {
  question: string;
  correctAnswer: string;
  traps: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface WaveState {
  currentWave: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  fallDuration: number;
  isWaveComplete: boolean;
  isGameComplete: boolean;
}

// ============================================
// WAVE MANAGER
// ============================================

export class WaveManager {
  private allQuestions: Question[] = [];
  private waveQuestions: Question[] = [];
  private questionIndex: number = 0;
  private waveIndex: number = 0;
  private difficulty: 'easy' | 'medium' | 'hard';
  private goodAnswersCount: number;
  private trapsCount: number;

  /**
   * Textes des mots actuellement à l'écran
   * Mis à jour par le hook via syncActiveWords()
   * Permet d'éviter les doublons dans le pool
   */
  private activeWordTexts: Set<string> = new Set();

  constructor(difficulty: 'easy' | 'medium' | 'hard', goodAnswers: number, traps: number) {
    this.difficulty = difficulty;
    this.goodAnswersCount = goodAnswers;
    this.trapsCount = traps;
  }

  // ============================================
  // SYNCHRONISATION DU POOL ACTIF
  // ============================================

  /**
   * Appelé par le hook avant chaque fillPool()
   * Informe le WaveManager des mots déjà visibles à l'écran
   * pour éviter de spawner des doublons
   */
  syncActiveWords(activeTexts: string[]): void {
    this.activeWordTexts = new Set(activeTexts.map((t) => t.toLowerCase()));
  }

  private isAlreadyActive(text: string): boolean {
    return this.activeWordTexts.has(text.toLowerCase());
  }

  // ============================================
  // CHARGEMENT DES QUESTIONS
  // ============================================

  loadQuestions(questions: Question[]): void {
    const filtered = questions.filter((q) => q.difficulty === this.difficulty);
    this.allQuestions = this.shuffle(filtered);
    this.prepareWave();
  }

  private shuffle<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // ============================================
  // GESTION DES VAGUES
  // ============================================

  private prepareWave(): void {
    const waveConfig = getWaveConfig(this.difficulty, this.waveIndex);

    let usedCount = 0;
    for (let i = 0; i < this.waveIndex; i++) {
      const prevConfig = getWaveConfig(this.difficulty, i);
      usedCount += prevConfig.questions;
    }

    this.waveQuestions = this.allQuestions.slice(
      usedCount,
      usedCount + waveConfig.questions
    );

    this.questionIndex = 0;
    this.activeWordTexts.clear();
  }

  nextWave(): boolean {
    this.waveIndex++;
    if (this.waveIndex >= TOTAL_WAVES) return false;
    this.prepareWave();
    return true;
  }

  // ============================================
  // DISTRIBUTION DES QUESTIONS
  // ============================================

  getCurrentQuestion(): Question | null {
    if (this.questionIndex >= this.waveQuestions.length) return null;
    return this.waveQuestions[this.questionIndex];
  }

  nextQuestion(): boolean {
    this.questionIndex++;
    return this.questionIndex < this.waveQuestions.length;
  }

  /**
   * Retourne les mots à spawner pour compléter le pool
   *
   * RÈGLE CLÉS :
   * - Ne jamais spawner un mot déjà à l'écran (syncActiveWords requis)
   * - La bonne réponse actuelle est toujours incluse SI elle n'est pas déjà active
   * - Compléter avec bonnes réponses futures puis pièges
   * - Retourner EXACTEMENT le nombre manquant (jamais plus)
   */
  getWordsToSpawn(currentPoolCount: number, poolSize: number): SpawnData[] {
    const wordsNeeded = poolSize - currentPoolCount;
    if (wordsNeeded <= 0) return [];

    const currentQuestion = this.getCurrentQuestion();
    if (!currentQuestion) return [];

    const words: SpawnData[] = [];

    // ── 1. Bonne réponse actuelle ──────────────────────────────────────────
    // Uniquement si elle n'est PAS déjà à l'écran
    if (!this.isAlreadyActive(currentQuestion.correctAnswer)) {
      words.push({
        text: currentQuestion.correctAnswer,
        isCorrect: true,
        isTrap: false,
      });
    }

    if (words.length >= wordsNeeded) return words.slice(0, wordsNeeded);

    // ── 2. Bonnes réponses de questions futures ────────────────────────────
    const futureStart = this.questionIndex + 1;
    const futureEnd = Math.min(
      futureStart + this.goodAnswersCount,
      this.waveQuestions.length
    );

    for (let i = futureStart; i < futureEnd && words.length < wordsNeeded; i++) {
      const futureAnswer = this.waveQuestions[i].correctAnswer;
      if (!this.isAlreadyActive(futureAnswer)) {
        words.push({
          text: futureAnswer,
          isCorrect: false,
          isTrap: false,
        });
      }
    }

    if (words.length >= wordsNeeded) return words.slice(0, wordsNeeded);

    // ── 3. Pièges ──────────────────────────────────────────────────────────
    const availableTraps = this.getTrapsForCurrentQuestion();
    for (const trap of availableTraps) {
      if (words.length >= wordsNeeded) break;
      if (!this.isAlreadyActive(trap)) {
        words.push({
          text: trap,
          isCorrect: false,
          isTrap: true,
        });
      }
    }

    if (words.length >= wordsNeeded) return words.slice(0, wordsNeeded);

    // ── 4. Réponses extras (si pool encore incomplet) ──────────────────────
    const extras = this.getExtraGoodAnswers(futureEnd, wordsNeeded - words.length);
    words.push(...extras);

    return words.slice(0, wordsNeeded);
  }

  private getTrapsForCurrentQuestion(): string[] {
    const current = this.getCurrentQuestion();
    if (!current) return [];

    const traps = [...current.traps];
    for (const q of this.waveQuestions) {
      if (q !== current) traps.push(...q.traps);
    }

    const unique = [...new Set(traps)];
    return this.shuffle(unique);
  }

  private getExtraGoodAnswers(startIndex: number, count: number): SpawnData[] {
    const extras: SpawnData[] = [];
    for (
      let i = startIndex;
      i < this.allQuestions.length && extras.length < count;
      i++
    ) {
      const text = this.allQuestions[i].correctAnswer;
      if (!this.isAlreadyActive(text)) {
        extras.push({ text, isCorrect: false, isTrap: false });
      }
    }
    return extras;
  }

  // ============================================
  // ÉTAT
  // ============================================

  getState(): WaveState {
    const waveConfig = getWaveConfig(this.difficulty, this.waveIndex);
    return {
      currentWave: this.waveIndex + 1,
      currentQuestionIndex: this.questionIndex,
      totalQuestions: waveConfig.questions,
      fallDuration: waveConfig.fallDuration,
      isWaveComplete: this.questionIndex >= this.waveQuestions.length,
      isGameComplete: this.waveIndex >= TOTAL_WAVES,
    };
  }

  getQuestionText(): string {
    const current = this.getCurrentQuestion();
    return current ? current.question : '';
  }

  getCorrectAnswer(): string {
    const current = this.getCurrentQuestion();
    return current ? current.correctAnswer : '';
  }

  reset(): void {
    this.waveIndex = 0;
    this.questionIndex = 0;
    this.allQuestions = this.shuffle(this.allQuestions);
    this.prepareWave();
  }
}