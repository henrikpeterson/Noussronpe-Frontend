/**
 * ════════════════════════════════════════════════════════════════════════
 * COMPLETIONMODAL - Pop-up de félicitations
 * ════════════════════════════════════════════════════════════════════════
 * 
 * RÔLE :
 * - S'affiche quand user termine un quiz ou des flashcards
 * - Affiche le score (pour quiz) ou message de félicitations
 * - 2 boutons : Refaire / Retour au tableau de bord
 * 
 * DESIGN :
 * - Modal centrée, overlay sombre
 * - Emoji festif (🎉)
 * - Stats visuelles (score, nombre correct)
 * - Boutons stylés
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { CompletionModalProps } from '@/newpages/Components/Revision/study/types';

const CompletionModal = ({ 
  isOpen, 
  score, 
  totalQuestions, 
  onClose, 
  onRestart, 
  onBackToDashboard 
}: CompletionModalProps) => {
  
  /**
   * ═══════════════════════════════════════════════════════════
   * CALCULS
   * ═══════════════════════════════════════════════════════════
   */
  const correctAnswers = Math.round((score / 100) * totalQuestions);
  
  // Déterminer le message selon le score
  let message = '';
  let emoji = '🎉';

  if (score >= 80) {
    message = 'Excellent travail !';
    emoji = '🎉';
  } else if (score >= 60) {
    message = 'Bon travail !';
    emoji = '👏';
  } else if (score >= 40) {
    message = 'Pas mal !';
    emoji = '💪';
  } else {
    message = 'Continue à t\'entraîner !';
    emoji = '📚';
  }

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ═══ OVERLAY (fond sombre) ═══ */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 
                       flex items-center justify-center p-4"
          >
            
            {/* ═══ MODAL ═══ */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()} // Empêcher fermeture au clic
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full 
                         p-8 relative"
            >
              
              {/* ─────────────────────────────────────────── */}
              {/* BOUTON FERMER */}
              {/* ─────────────────────────────────────────── */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 
                           rounded-full bg-slate-100 hover:bg-slate-200 
                           flex items-center justify-center 
                           transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>

              {/* ─────────────────────────────────────────── */}
              {/* CONTENU */}
              {/* ─────────────────────────────────────────── */}
              <div className="text-center">
                
                {/* Emoji festif */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: 'spring', 
                    delay: 0.2, 
                    stiffness: 200 
                  }}
                  className="text-7xl mb-4"
                >
                  {emoji}
                </motion.div>

                {/* Titre */}
                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  {message}
                </h2>

                {/* Sous-titre */}
                <p className="text-slate-600 mb-6">
                  Tu as terminé ce chapitre avec succès.
                </p>

                {/* ─────────────────────────────────────────── */}
                {/* STATS (affichées uniquement si quiz) */}
                {/* ─────────────────────────────────────────── */}
                {totalQuestions > 0 && (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 
                                  border-2 border-slate-200 rounded-2xl p-6 mb-6">
                    
                    <div className="grid grid-cols-2 gap-4">
                      
                      {/* Bonnes réponses */}
                      <div className="text-center">
                        <p className="text-4xl font-black text-green-600 mb-1">
                          {correctAnswers}/{totalQuestions}
                        </p>
                        <p className="text-sm text-slate-600 font-medium">
                          Bonnes réponses
                        </p>
                      </div>

                      {/* Score en % */}
                      <div className="text-center">
                        <p className="text-4xl font-black text-blue-600 mb-1">
                          {score}%
                        </p>
                        <p className="text-sm text-slate-600 font-medium">
                          Score
                        </p>
                      </div>

                    </div>
                  </div>
                )}

                {/* ─────────────────────────────────────────── */}
                {/* BOUTONS D'ACTION */}
                {/* ─────────────────────────────────────────── */}
                <div className="flex gap-3">
                  
                  {/* Bouton Refaire */}
                  <motion.button
                    onClick={onRestart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 border-2 border-slate-300 
                               rounded-xl font-bold text-slate-700 
                               hover:bg-slate-50 transition-all"
                  >
                    Refaire
                  </motion.button>

                  {/* Bouton Retour Dashboard */}
                  <motion.button
                    onClick={onBackToDashboard}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 bg-[#0080FF] hover:bg-[#0066CC] 
                               text-white font-bold rounded-xl 
                               transition-all shadow-lg hover:shadow-xl"
                  >
                    Retour
                  </motion.button>

                </div>

              </div>

            </motion.div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CompletionModal;