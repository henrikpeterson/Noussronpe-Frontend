/**
 * Configuration des niveaux de difficulté
 * Chaque difficulté définit tous les paramètres qui changent :
 * vies, pool, pièges, questions par vague, vitesse de descente.
 */

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface WaveConfig {
  /** Nombre de questions dans cette vague */
  questions: number;
  /** Temps de descente du haut au bas en secondes */
  fallDuration: number;
}

export interface DifficultyConfig {
  /** Nom affiché */
  label: string;
  /** Description affichée dans l'UI */
  description: string;
  /** Emoji indicateur */
  emoji: string;
  /** Vies de départ */
  startingLives: number;
  /** Nombre total de réponses visibles simultanément */
  poolSize: number;
  /** Nombre de bonnes réponses futures dans le pool */
  goodAnswers: number;
  /** Nombre de pièges dans le pool */
  traps: number;
  /** Score multiplicateur pour cette difficulté */
  scoreMultiplier: number;
  /** Configuration de chaque vague (questions + vitesse) */
  waves: [WaveConfig, WaveConfig, WaveConfig, WaveConfig, WaveConfig];
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    label: 'Facile',
    description: 'Réponses courtes, vitesse lente, idéal pour débuter',
    emoji: '🟢',
    startingLives: 4,
    poolSize: 6,
    goodAnswers: 5,
    traps: 1,
    scoreMultiplier: 1.0,
    waves: [
      { questions: 5,  fallDuration: 75 },
      { questions: 7,  fallDuration: 70 },
      { questions: 10, fallDuration: 65 },
      { questions: 12, fallDuration: 60 },
      { questions: 16, fallDuration: 55 },
    ],
  },
  medium: {
    label: 'Moyen',
    description: 'Pièges modérés, vitesse moyenne, challenge équilibré',
    emoji: '🟡',
    startingLives: 3,
    poolSize: 10,
    goodAnswers: 8,
    traps: 2,
    scoreMultiplier: 1.5,
    waves: [
      { questions: 6,  fallDuration: 70 }, 
      { questions: 8,  fallDuration: 65 },
      { questions: 11, fallDuration: 60 },
      { questions: 13, fallDuration: 55 },
      { questions: 16, fallDuration: 50 },
    ],
  },
  hard: {
    label: 'Difficile',
    description: 'Questions dures, vitesse rapide, pour les experts',
    emoji: '🔴',
    startingLives: 2,
    poolSize: 12,
    goodAnswers: 9,
    traps: 3,
    scoreMultiplier: 2.0,
    waves: [
      { questions: 7,  fallDuration: 55 },
      { questions: 9,  fallDuration: 50 },
      { questions: 12, fallDuration: 45 },
      { questions: 14, fallDuration: 40 },
      { questions: 17, fallDuration: 35 },
    ],
  },
} as const;

/**
 * Récupère la config pour une difficulté donnée
 */
export function getDifficultyConfig(difficulty: Difficulty): DifficultyConfig {
  return DIFFICULTY_SETTINGS[difficulty];
}

/**
 * Récupère la config d'une vague spécifique
 * @param difficulty - niveau choisi
 * @param waveIndex - index de la vague (0-4)
 */
export function getWaveConfig(difficulty: Difficulty, waveIndex: number): WaveConfig {
  const config = DIFFICULTY_SETTINGS[difficulty];
  return config.waves[Math.min(waveIndex, config.waves.length - 1)];
}