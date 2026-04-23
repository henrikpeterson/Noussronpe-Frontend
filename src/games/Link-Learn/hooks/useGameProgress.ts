import { useState, useEffect } from 'react';

// ========================================
//WORDLINK PROGRESS (jeu original)
// ========================================
interface WordLinkProgress {
  currentLevel: number;
  completedLevels: number[];
  scores: Record<number, number>;
}

const WORDLINK_STORAGE_KEY = 'wordlink-progress';

const defaultWordLinkProgress: WordLinkProgress = {
  currentLevel: 1,
  completedLevels: [],
  scores: {},
};

// ========================================
// TEXT BUILDER PROGRESS (nouveau jeu)
// ========================================
interface LevelProgress {
  completed: boolean;
  bestScore: number;
  attempts: number;
  lastPlayedAt: number;
}

interface TextBuilderProgress {
  levels: Record<number, LevelProgress>;
  totalPoints: number;
}

const TEXTBUILDER_STORAGE_KEY = 'textbuilder-progress';

const defaultTextBuilderProgress: TextBuilderProgress = {
  levels: {},
  totalPoints: 0,
};

// ========================================
// 🎮 HOOK POUR WORDLINK (ancien système)
// ========================================
export function useGameProgress() {
  const [progress, setProgress] = useState<WordLinkProgress>(() => {
    try {
      const saved = localStorage.getItem(WORDLINK_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultWordLinkProgress;
    } catch {
      return defaultWordLinkProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(WORDLINK_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const completeLevel = (level: number, score: number) => {
    setProgress(prev => ({
      currentLevel: Math.max(prev.currentLevel, level + 1),
      completedLevels: prev.completedLevels.includes(level) 
        ? prev.completedLevels 
        : [...prev.completedLevels, level],
      scores: { ...prev.scores, [level]: Math.max(prev.scores[level] || 0, score) },
    }));
  };

  const resetProgress = () => {
    setProgress(defaultWordLinkProgress);
  };

  return { progress, completeLevel, resetProgress };
}

// ========================================
// 📝 HOOK POUR TEXT BUILDER (nouveau système)
// ========================================
export function useTextBuilderProgress() {
  const [progress, setProgress] = useState<TextBuilderProgress>(() => {
    try {
      const saved = localStorage.getItem(TEXTBUILDER_STORAGE_KEY);
      return saved ? JSON.parse(saved) : defaultTextBuilderProgress;
    } catch {
      return defaultTextBuilderProgress;
    }
  });

  useEffect(() => {
    localStorage.setItem(TEXTBUILDER_STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  // Enregistrer le score d'un niveau
  const saveLevel = (levelId: number, score: number) => {
    setProgress(prev => {
      const current = prev.levels[levelId];
      
      const newLevelProgress: LevelProgress = {
        completed: score >= 7,
        bestScore: current ? Math.max(current.bestScore, score) : score,
        attempts: current ? current.attempts + 1 : 1,
        lastPlayedAt: Date.now(),
      };
      
      const newLevels = { ...prev.levels, [levelId]: newLevelProgress };
      const totalPoints = Object.values(newLevels).reduce((sum, l) => sum + l.bestScore, 0);
      
      return { levels: newLevels, totalPoints };
    });
  };

  // Récupérer la progression d'un niveau
  const getLevelProgress = (levelId: number): LevelProgress | null => {
    return progress.levels[levelId] || null;
  };

  // Vérifier si un niveau est débloqué
  const isLevelUnlocked = (levelId: number): boolean => {
    if (levelId === 1) return true;
    return progress.levels[levelId - 1]?.completed === true;
  };

  // Calculer les étoiles
  const getStars = (score: number): number => {
    if (score >= 9.5) return 3;
    if (score >= 8) return 2;
    if (score >= 7) return 1;
    return 0;
  };

  // Réinitialiser
  const resetProgress = () => {
    setProgress(defaultTextBuilderProgress);
  };

  return {
    progress,
    saveLevel,
    getLevelProgress,
    isLevelUnlocked,
    getStars,
    resetProgress,
  };
}

// ========================================
// 📌 FONCTIONS STANDALONE (sans hook)
// ========================================

// Pour Text Builder
export function getTextBuilderProgress(): TextBuilderProgress {
  try {
    const saved = localStorage.getItem(TEXTBUILDER_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultTextBuilderProgress;
  } catch {
    return defaultTextBuilderProgress;
  }
}

export function saveTextBuilderLevel(levelId: number, score: number): void {
  const current = getTextBuilderProgress();
  const levelProgress = current.levels[levelId];
  
  const newLevelProgress: LevelProgress = {
    completed: score >= 7,
    bestScore: levelProgress ? Math.max(levelProgress.bestScore, score) : score,
    attempts: levelProgress ? levelProgress.attempts + 1 : 1,
    lastPlayedAt: Date.now(),
  };
  
  const newLevels = { ...current.levels, [levelId]: newLevelProgress };
  const totalPoints = Object.values(newLevels).reduce((sum, l) => sum + l.bestScore, 0);
  
  localStorage.setItem(TEXTBUILDER_STORAGE_KEY, JSON.stringify({
    levels: newLevels,
    totalPoints,
  }));
}

export function getTextBuilderLevelProgress(levelId: number): LevelProgress | null {
  const progress = getTextBuilderProgress();
  return progress.levels[levelId] || null;
}

export function isTextBuilderLevelUnlocked(levelId: number): boolean {
  if (levelId === 1) return true;
  const progress = getTextBuilderProgress();
  return progress.levels[levelId - 1]?.completed === true;
}

// Pour WordLink (compatibilité)
export function getWordLinkProgress(): WordLinkProgress {
  try {
    const saved = localStorage.getItem(WORDLINK_STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultWordLinkProgress;
  } catch {
    return defaultWordLinkProgress;
  }
}