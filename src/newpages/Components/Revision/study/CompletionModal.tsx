// src/newpages/Components/Revision/study/CompletionModal.tsx - PHASE 3 - 100% Backend
// Fix de l'erreur TypeScript : ajoute bonnesReponses + progression

import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, Target, TrendingUp } from 'lucide-react';


// Props étendues pour backend
export interface CompletionModalProps {
  isOpen: boolean;
  score: number; // % depuis backend finaliserTentative
  totalQuestions: number;
  bonnesReponses?: number; // NEW - vient de backend bonnes_reponses
  progression?: {
    statut: string;
    meilleur_score: number | null;
  } | null; // NEW - pour afficher si leçon terminée à 75%
  onClose: () => void;
  onRestart: () => void;
  onBackToDashboard: () => void;
}

const CompletionModal = ({
  isOpen,
  score,
  totalQuestions,
  bonnesReponses,
  progression,
  onClose,
  onRestart,
  onBackToDashboard
}: CompletionModalProps) => {

  // Si backend fournit bonnesReponses, on l'utilise, sinon calcul fallback (ancien comportement)
  const correctAnswers = bonnesReponses ?? Math.round((score / 100) * totalQuestions);
  
  // Message selon score (ton ancien code)
  let message = '';
  let emoji = '🎉';
  let colorClass = 'from-green-500 to-emerald-600';

  if (score >= 80) {
    message = 'Excellent travail !';
    emoji = '🎉';
    colorClass = 'from-green-500 to-emerald-600';
  } else if (score >= 60) {
    message = 'Bon travail !';
    emoji = '👏';
    colorClass = 'from-blue-500 to-indigo-600';
  } else if (score >= 40) {
    message = 'Pas mal !';
    emoji = '💪';
    colorClass = 'from-amber-500 to-orange-600';
  } else {
    message = "Continue à t'entraîner !";
    emoji = '📚';
    colorClass = 'from-slate-500 to-slate-600';
  }

  const isLeconTerminee = progression?.statut === 'termine';

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative"
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4 text-slate-600" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2, stiffness: 200 }}
                  className="text-7xl mb-4"
                >
                  {emoji}
                </motion.div>

                <h2 className="text-3xl font-black text-slate-900 mb-2">
                  {message}
                </h2>

                <p className="text-slate-600 mb-2">
                  Tu as terminé ce chapitre avec succès.
                </p>

                {/* Badge leçon terminée à 75% */}
                {isLeconTerminee && (
                  <div className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-200 text-emerald-800 text-xs font-black px-3 py-1 rounded-full mb-4">
                    <Trophy className="w-3.5 h-3.5" />
                    Leçon terminée à 75% !
                  </div>
                )}

                {totalQuestions > 0 && (
                  <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-slate-200 rounded-2xl p-6 mb-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="w-4 h-4 text-green-600" />
                          <p className="text-4xl font-black text-green-600">
                            {correctAnswers}/{totalQuestions}
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Bonnes réponses</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <TrendingUp className="w-4 h-4 text-blue-600" />
                          <p className="text-4xl font-black text-blue-600">
                            {score}%
                          </p>
                        </div>
                        <p className="text-sm text-slate-600 font-medium">Score</p>
                        {progression?.meilleur_score && progression.meilleur_score !== score && (
                          <p className="text-xs text-slate-500 mt-1">
                            Meilleur : {progression.meilleur_score}%
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Barre progression seuil 75% */}
                    <div className="mt-4">
                      <div className="flex justify-between text-[11px] font-bold text-slate-500 mb-1">
                        <span>0%</span>
                        <span className="text-amber-600">Seuil 75%</span>
                        <span>100%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden relative">
                        <div className="absolute left-[75%] top-0 bottom-0 w-0.5 bg-amber-500" />
                        <div
                          className={`h-full rounded-full transition-all duration-700 bg-gradient-to-r ${colorClass}`}
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <motion.button
                    onClick={onRestart}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 border-2 border-slate-300 rounded-xl font-bold text-slate-700 hover:bg-slate-50 transition-all"
                  >
                    Refaire
                  </motion.button>
                  <motion.button
                    onClick={onBackToDashboard}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 h-12 bg-[#0080FF] hover:bg-[#0066CC] text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
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
