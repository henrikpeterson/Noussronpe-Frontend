// src/.../FlashcardView.tsx - FIX V2 - Rules of Hooks
// Tous les hooks AVANT les return

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlashCard } from './types';

interface Props {
  cards: FlashCard[];
  currentIndex: number;
  onNext: () => void;
  onComplete: () => void;
  subjectColor?: string;
}

const FlashcardView = ({ cards, currentIndex, onNext, onComplete, subjectColor = '#3B82F6' }: Props) => {
  // TOUS LES HOOKS EN HAUT, AVANT TOUT RETURN
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  // Maintenant seulement les guards (après les hooks)
  if (!cards || cards.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-amber-200 text-center">
        <p className="text-6xl mb-4">🃏</p>
        <p className="font-bold text-slate-800">Aucune flashcard pour cette leçon</p>
        <p className="text-sm text-slate-500 mt-2">Le contenu arrive bientôt.</p>
        <button onClick={onComplete} className="mt-4 px-6 py-2 bg-slate-100 rounded-xl">
          Retour
        </button>
      </div>
    );
  }

  if (currentIndex >= cards.length) {
    return (
      <div className="bg-white rounded-3xl p-8 border-2 border-green-200 text-center">
        <p className="text-6xl mb-4">🎉</p>
        <p className="font-bold text-slate-800">Toutes les cartes vues !</p>
        <button onClick={onComplete} className="mt-4 px-8 py-3 bg-[#0080FF] text-white font-bold rounded-xl">
          Terminer
        </button>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  if (!currentCard) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center">
        <p className="text-slate-600">Carte introuvable (index {currentIndex})</p>
        <button onClick={onComplete} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-xl">
          Terminer
        </button>
      </div>
    );
  }

  const handleFlip = () => setIsFlipped(true);
  const handleNext = () => {
    if (currentIndex >= cards.length - 1) onComplete();
    else onNext();
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 shadow-lg min-h-[500px] flex flex-col">
      <div className="mb-6">
        <p className="text-sm font-bold text-slate-600 mb-2">
          Carte {currentIndex + 1} / {cards.length}
        </p>
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full"
            style={{ backgroundColor: subjectColor }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center">
        <AnimatePresence mode="wait">
          {!isFlipped ? (
            <motion.div
              key={`q-${currentCard.id}-${currentIndex}`}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-3xl p-8 shadow-xl min-h-[300px] flex flex-col justify-center items-center">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 text-center mb-8">
                  {currentCard.question}
                </h3>
                {currentCard.hint && (
                  <p className="text-sm text-slate-600 italic text-center mb-6">
                    💡 {currentCard.hint}
                  </p>
                )}
                <motion.button
                  onClick={handleFlip}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold rounded-xl shadow-lg"
                >
                  Afficher la réponse
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={`a-${currentCard.id}-${currentIndex}`}
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-3xl p-8 shadow-xl min-h-[300px] flex flex-col justify-center items-center">
                <div className="text-5xl mb-4">✅</div>
                <p className="text-xl md:text-2xl font-bold text-green-900 text-center mb-8">
                  {currentCard.answer}
                </p>
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold rounded-xl shadow-lg"
                >
                  {currentIndex >= cards.length - 1 ? 'Terminer' : 'Suivant →'}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <p className="text-xs text-slate-500 text-center mt-4">
        💡 Prends le temps de bien mémoriser chaque carte
      </p>
    </div>
  );
};

export default FlashcardView;
