// src/games/ztype-quiz/ZTypeQuizPage.tsx
import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import QuizHome from '@/games/ztype-quiz/Pages/QuizHome'; 
import ZTypeGame from '@/games/ztype-quiz/Pages/ZTypeGame';
import GameOverScreen from './components/GameOverScreen';

// import ZTypeGame from './pages/ZTypeGame';              // ← décommenter quand prêt
// import GameOverScreen from './components/GameOverScreen'; // ← décommenter quand prêt

// Types clairs et réutilisables
type Mode = 'sante' | 'academique' | 'anglais' | 'culture';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameState = 'home' | 'playing' | 'gameover';

/** Résultats d'une partie terminée */
interface GameResults {
  score: number;
  wave: number;
  correctAnswers: number;
  totalAttempts: number;
  accuracy: number;
  maxCombo: number;
  duration: number;
  isVictory: boolean;
}

/**
 * Variants Framer Motion pour transitions entre écrans
 */
const pageVariants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    transition: { duration: 0.3 },
  },
};

/**
 * ZTypeQuizPage — Point d'entrée du jeu Z-Type Quiz
 *
 * Route : /quiz/ztype (ou selon ton router)
 *
 * Gère 3 écrans :
 * - home     → QuizHome (choix mode + difficulté)
 * - playing  → ZTypeGame (le jeu Canvas)
 * - gameover → GameOverScreen (stats + rejouer)
 *
 * Flux de données :
 * QuizHome → (mode, difficulty) → ZTypeGame → (results) → GameOverScreen
 *                                                              │
 *                                              onReplay ───→ ZTypeGame (même config)
 *                                              onGoHome ───→ QuizHome
 */
const ZTypeQuizPage: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>('home');
  const [selectedMode, setSelectedMode] = useState<Mode>('sante');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('easy');
  const [gameResults, setGameResults] = useState<GameResults | null>(null);

  /**
   * Appelé par QuizHome quand l'élève clique JOUER
   * Stocke le mode et la difficulté, lance le jeu
   */
  const handleStart = useCallback((mode: Mode, difficulty: Difficulty) => {
    setSelectedMode(mode);
    setSelectedDifficulty(difficulty);
    setGameResults(null);
    setGameState('playing');
  }, []);

  /**
   * Appelé par ZTypeGame quand la partie se termine
   * Reçoit les résultats complets de la partie
   */
  const handleGameOver = useCallback((results: GameResults) => {
    setGameResults(results);
    setGameState('gameover');
  }, []);

  /**
   * Rejouer avec le même mode et la même difficulté
   * Pas besoin de repasser par le menu
   */
  const handleReplay = useCallback(() => {
    setGameResults(null);
    setGameState('playing');
  }, []);

  /**
   * Retour au menu principal
   * Reset complet des résultats
   */
  const handleGoHome = useCallback(() => {
    setGameResults(null);
    setGameState('home');
  }, []);

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={gameState}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        className="min-h-screen"
      >
        {/* ===== Écran d'accueil ===== */}
        {gameState === 'home' && (
          <QuizHome onStart={handleStart} />
        )}

        {/* ===== Jeu actif ===== */}
        {gameState === 'playing' && (
          <ZTypeGame
            mode={selectedMode}
            difficulty={selectedDifficulty}
            onGameOver={handleGameOver}
          />
        )}

        {/* ===== Écran Game Over ===== */}
        {gameState === 'gameover' && gameResults && (
          <GameOverScreen
            results={gameResults}
            mode={selectedMode}
            difficulty={selectedDifficulty}
            onReplay={handleReplay}
            onGoHome={handleGoHome}
          />
        )}
        
      </motion.div>
    </AnimatePresence>
  );
};

export default ZTypeQuizPage;