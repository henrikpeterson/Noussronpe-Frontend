/**
 * ════════════════════════════════════════════════════════════════════════
 * FLASHCARDVIEW - Interface Flashcards
 * ════════════════════════════════════════════════════════════════════════
 * 
 * RÔLE :
 * - Affiche une carte question/réponse
 * - Animation flip pour révéler la réponse
 * - Bouton "Suivant" pour avancer
 * 
 * DESIGN :
 * - Carte 3D avec effet flip horizontal
 * - Face avant : question + bouton "Afficher réponse"
 * - Face arrière : réponse + bouton "Suivant"
 * 
 * ANIMATION :
 * - Transition flip douce (rotateY)
 * - Changement de gradient avant/arrière
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { FlashcardViewProps } from '@/newpages/Components/Revision/study/types';

const FlashcardView = ({ 
  cards, 
  currentIndex, 
  onNext, 
  onComplete,
  subjectColor 
}: FlashcardViewProps) => {
  
  /**
   * ═══════════════════════════════════════════════════════════
   * ÉTAT LOCAL
   * ═══════════════════════════════════════════════════════════
   */
  const [isFlipped, setIsFlipped] = useState(false);

  // Carte actuelle
  const currentCard = cards[currentIndex];

  /**
   * ═══════════════════════════════════════════════════════════
   * RESET À CHAQUE NOUVELLE CARTE
   * ═══════════════════════════════════════════════════════════
   */
  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  /**
   * ═══════════════════════════════════════════════════════════
   * HANDLERS
   * ═══════════════════════════════════════════════════════════
   */

  // ─────────────────────────────────────────────────────────
  // Flip pour révéler la réponse
  // ─────────────────────────────────────────────────────────
  const handleFlip = () => {
    setIsFlipped(true);
  };

  // ─────────────────────────────────────────────────────────
  // Passer à la carte suivante
  // ─────────────────────────────────────────────────────────
  const handleNext = () => {
    if (currentIndex >= cards.length - 1) {
      // Dernière carte → Compléter
      onComplete();
    } else {
      // Carte suivante
      onNext();
    }
  };

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 border-2 border-slate-100 
                    shadow-lg min-h-[500px] flex flex-col">
      
      {/* ═══ PROGRESSION ═══ */}
      <div className="mb-6">
        <p className="text-sm font-bold text-slate-600 mb-2">
          Carte {currentIndex + 1} / {cards.length}
        </p>
        
        <div className="w-full bg-slate-200 rounded-full h-1.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ 
              width: `${((currentIndex + 1) / cards.length) * 100}%` 
            }}
            transition={{ duration: 0.4 }}
            className="h-full rounded-full"
            style={{ backgroundColor: subjectColor }}
          />
        </div>
      </div>

      {/* ═══ CARTE FLIP ═══ */}
      <div className="flex-1 flex items-center justify-center perspective-1000">
        
        <AnimatePresence mode="wait">
          
          {/* ─────────────────────────────────────────────── */}
          {/* FACE AVANT : QUESTION */}
          {/* ─────────────────────────────────────────────── */}
          {!isFlipped ? (
            <motion.div
              key="question"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full max-w-2xl"
            >
              <div className="bg-gradient-to-br from-slate-50 to-slate-100 
                              border-2 border-slate-200 rounded-3xl p-8 
                              shadow-xl min-h-[300px] flex flex-col 
                              justify-center items-center">
                
                {/* Question */}
                <h3 className="text-2xl md:text-3xl font-bold text-slate-900 
                               text-center mb-8">
                  {currentCard.question}
                </h3>

                {/* Hint (optionnel) */}
                {currentCard.hint && (
                  <p className="text-sm text-slate-600 italic text-center mb-6">
                    💡 {currentCard.hint}
                  </p>
                )}

                {/* Bouton flip */}
                <motion.button
                  onClick={handleFlip}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#0080FF] hover:bg-[#0066CC] 
                             text-white font-bold rounded-xl 
                             shadow-lg hover:shadow-xl transition-all"
                >
                  Afficher la réponse
                </motion.button>
              </div>
            </motion.div>

          ) : (

            /* ─────────────────────────────────────────────── */
            /* FACE ARRIÈRE : RÉPONSE */
            /* ─────────────────────────────────────────────── */
            <motion.div
              key="answer"
              initial={{ rotateY: -90, opacity: 0 }}
              animate={{ rotateY: 0, opacity: 1 }}
              exit={{ rotateY: 90, opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeInOut' }}
              className="w-full max-w-2xl"
            >
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 
                              border-2 border-green-200 rounded-3xl p-8 
                              shadow-xl min-h-[300px] flex flex-col 
                              justify-center items-center">
                
                {/* Icône checkmark */}
                <div className="text-5xl mb-4">✅</div>

                {/* Réponse */}
                <p className="text-xl md:text-2xl font-bold text-green-900 
                              text-center mb-8">
                  {currentCard.answer}
                </p>

                {/* Bouton suivant */}
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-[#0080FF] hover:bg-[#0066CC] 
                             text-white font-bold rounded-xl 
                             shadow-lg hover:shadow-xl transition-all"
                >
                  {currentIndex >= cards.length - 1 ? 'Terminer' : 'Suivant →'}
                </motion.button>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* ═══ NOTE INFORMATIVE ═══ */}
      <p className="text-xs text-slate-500 text-center mt-4">
        💡 Prends le temps de bien mémoriser chaque carte
      </p>

    </div>
  );
};

export default FlashcardView;