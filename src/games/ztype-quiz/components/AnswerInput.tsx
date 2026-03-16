// src/games/ztype-quiz/components/AnswerInput.tsx

import React, { useEffect, useCallback } from 'react';

interface AnswerInputProps {
  /** Appelé à CHAQUE lettre tapée */
  onKeyPress: (letter: string) => void;
  /** Le jeu est-il actif ? */
  isActive: boolean;
}

/**
 * AnswerInput — Capture les lettres tapées
 *
 * Pas d'input visible.
 * Capture directement les touches du clavier.
 * Chaque lettre → onKeyPress(letter)
 *
 * Pourquoi pas d'input visible ?
 * → Z-Type n'a pas de champ de saisie
 * → L'élève tape directement
 * → Les lettres disparaissent de l'ennemi
 * → C'est le feedback visuel
 */
const AnswerInput: React.FC<AnswerInputProps> = ({ onKeyPress, isActive }) => {

  /** Capture les touches du clavier */
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isActive) return;

      // Ignorer les touches spéciales
      if (e.key.length !== 1) return;

      // Ignorer si Ctrl/Alt/Meta est pressé
      if (e.ctrlKey || e.altKey || e.metaKey) return;

      // Envoyer la lettre
      onKeyPress(e.key);
    },
    [isActive, onKeyPress]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Pas de rendu visible
  // Le feedback est sur le Canvas (lettres qui disparaissent)
  return null;
};

export default AnswerInput;