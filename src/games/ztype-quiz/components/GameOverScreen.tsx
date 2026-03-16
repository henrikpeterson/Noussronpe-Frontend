// src/games/ztype-quiz/components/GameOverScreen.tsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Home, Share2, Trophy, Target, Zap, Clock, Award } from 'lucide-react';
import type { GameResults } from '../hooks/useZTypeGame';
import { THEME_COLORS } from '../config/constants';

// ============================================
// TYPES
// ============================================

type Mode = 'sante' | 'academique' | 'anglais' | 'culture';
type Difficulty = 'easy' | 'medium' | 'hard';

interface GameOverScreenProps {
  /** Résultats de la partie */
  results: GameResults;
  /** Mode joué */
  mode: Mode;
  /** Difficulté jouée */
  difficulty: Difficulty;
  /** Rejouer (même mode, même difficulté) */
  onReplay: () => void;
  /** Retour au menu principal */
  onGoHome: () => void;
}

// ============================================
// LABELS
// ============================================

const MODE_LABELS: Record<Mode, string> = {
  sante: 'Santé Préventive',
  academique: 'Académique',
  anglais: 'Anglais',
  culture: 'Mode Mixte',
};

const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  easy: 'Facile',
  medium: 'Moyen',
  hard: 'Difficile',
};

// ============================================
// ANIMATIONS
// ============================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const childVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

// ============================================
// COMPOSANT
// ============================================

/**
 * GameOverScreen — Écran de fin de partie
 *
 * Affiche :
 * - Victoire ou défaite
 * - Score avec animation montante
 * - Stats détaillées
 * - Boutons rejouer / menu / partager
 *
 * Apparaît par dessus le jeu avec un fond semi-transparent.
 */
const GameOverScreen: React.FC<GameOverScreenProps> = ({
  results,
  mode,
  difficulty,
  onReplay,
  onGoHome,
}) => {
  const themeColor = THEME_COLORS[mode];

  /** Score animé qui monte de 0 au score final */
  const [displayScore, setDisplayScore] = useState(0);

  // Animation du score qui monte
  useEffect(() => {
    if (results.score === 0) return;

    const duration = 2000; // 2 secondes
    const steps = 60;
    const increment = results.score / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(Math.floor(increment * step), results.score);
      setDisplayScore(current);

      if (step >= steps) {
        setDisplayScore(results.score);
        clearInterval(timer);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [results.score]);

  /**
   * Formate le temps en minutes et secondes
   */
  function formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins > 0) return `${mins}m ${secs}s`;
    return `${secs}s`;
  }

  /**
   * Message selon la performance
   */
  function getPerformanceMessage(): { text: string; emoji: string } {
    if (results.isVictory) {
      if (results.accuracy >= 90) return { text: 'Exceptionnel !', emoji: '🏆' };
      if (results.accuracy >= 70) return { text: 'Très bien joué !', emoji: '🌟' };
      return { text: 'Bravo, tu as gagné !', emoji: '✨' };
    }
    if (results.accuracy >= 60) return { text: 'Presque ! Réessaie !', emoji: '💪' };
    if (results.accuracy >= 30) return { text: 'Continue à réviser !', emoji: '📚' };
    return { text: 'N\'abandonne pas !', emoji: '🔥' };
  }

  /**
   * Partage WhatsApp
   */
  function handleShare(): void {
    const message = [
      '🎮 Z-Quiz Togo',
      `📚 Mode : ${MODE_LABELS[mode]}`,
      `⚡ Difficulté : ${DIFFICULTY_LABELS[difficulty]}`,
      `🏆 Score : ${results.score.toLocaleString()} pts`,
      `🎯 Précision : ${results.accuracy}%`,
      `🔥 Meilleur combo : x${results.maxCombo}`,
      `⏱️ Temps : ${formatDuration(results.duration)}`,
      '',
      results.isVictory ? '✅ VICTOIRE !' : `📊 Vague ${results.wave}/5`,
      '',
      'Tu peux faire mieux ? Essaie !',
    ].join('\n');

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  }

  const perf = getPerformanceMessage();

  // ============================================
  // RENDU
  // ============================================

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md px-4 py-8 overflow-y-auto"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {/* ===== Titre ===== */}
      <motion.div variants={childVariants} className="text-center mb-3 sm:mb-6">
        <span className="text-5xl mb-2 block">{perf.emoji}</span>
        <h2
          className="text-4xl sm:text-5xl font-black tracking-wider"
          style={{ color: results.isVictory ? '#00ff88' : '#ff4444' }}
        >
          {results.isVictory ? 'VICTOIRE' : 'GAME OVER'}
        </h2>
        <p className="text-gray-400 text-lg mt-2">{perf.text}</p>
      </motion.div>

      {/* ===== Score animé ===== */}
      <motion.div variants={childVariants} className="text-center mb-4 sm:mb-8">
        <span className="text-[10px] uppercase tracking-widest text-gray-500">
          Score Final
        </span>
        <div
          className="text-5xl sm:text-6xl font-black tabular-nums"
          style={{
            color: themeColor,
            textShadow: `0 0 30px ${themeColor}60`,
          }}
        >
          {displayScore.toLocaleString()}
        </div>
      </motion.div>

      {/* ===== Stats ===== */}
      <motion.div
        variants={childVariants}
        className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4 sm:mb-8 w-full max-w-lg"
      >
        {/* Vague */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <Trophy className="w-5 h-5 mx-auto mb-2 text-yellow-400" />
          <div className="text-2xl font-bold text-yellow-400">
            {results.wave}/5
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            Vague
          </div>
        </div>

        {/* Précision */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <Target className="w-5 h-5 mx-auto mb-2 text-green-400" />
          <div className="text-2xl font-bold text-green-400">
            {results.accuracy}%
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            Précision
          </div>
        </div>

        {/* Combo */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <Zap className="w-5 h-5 mx-auto mb-2 text-pink-400" />
          <div className="text-2xl font-bold text-pink-400">
            x{results.maxCombo}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            Meilleur Combo
          </div>
        </div>

        {/* Bonnes réponses */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <Award className="w-5 h-5 mx-auto mb-2 text-cyan-400" />
          <div className="text-2xl font-bold text-cyan-400">
            {results.correctAnswers}/{results.totalAttempts}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            Bonnes Réponses
          </div>
        </div>

        {/* Temps */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <Clock className="w-5 h-5 mx-auto mb-2 text-orange-400" />
          <div className="text-2xl font-bold text-orange-400">
            {formatDuration(results.duration)}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            Temps Total
          </div>
        </div>

        {/* Mode */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
          <div
            className="text-2xl font-bold"
            style={{ color: themeColor }}
          >
            {DIFFICULTY_LABELS[difficulty]}
          </div>
          <div className="text-[10px] uppercase tracking-widest text-gray-500 mt-1">
            {MODE_LABELS[mode]}
          </div>
        </div>
      </motion.div>

      {/* ===== Boutons ===== */}
      <motion.div
        variants={childVariants}
        className="flex flex-col sm:flex-row gap-3 w-full max-w-md"
      >
        {/* Rejouer */}
        <button
          onClick={onReplay}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-4 rounded-xl
            bg-green-600 hover:bg-green-500
            text-white font-bold text-lg
            transition-all duration-200
            hover:shadow-[0_0_20px_rgba(0,255,100,0.3)]
          "
        >
          <RotateCcw className="w-5 h-5" />
          Rejouer
        </button>

        {/* Menu */}
        <button
          onClick={onGoHome}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-4 rounded-xl
            bg-yellow-600 hover:bg-yellow-500
            text-white font-bold text-lg
            transition-all duration-200
            hover:shadow-[0_0_20px_rgba(255,200,0,0.3)]
          "
        >
          <Home className="w-5 h-5" />
          Menu
        </button>

        {/* Partager */}
        <button
          onClick={handleShare}
          className="
            flex-1 flex items-center justify-center gap-2
            px-6 py-4 rounded-xl
            bg-white/5 hover:bg-white/10
            text-gray-300 hover:text-white font-bold text-lg
            border border-gray-700/50 hover:border-gray-500
            transition-all duration-200
          "
        >
          <Share2 className="w-5 h-5" />
          Partager
        </button>
      </motion.div>

      {/* ===== Indication clavier ===== */}
      <motion.p
        variants={childVariants}
        className="mt-6 text-gray-600 text-xs"
      >
        Appuie sur <kbd className="px-2 py-0.5 bg-white/10 rounded text-gray-400">Entrée</kbd> pour rejouer
      </motion.p>
    </motion.div>
  );
};

export default GameOverScreen;