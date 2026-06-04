import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface FeedbackBannerProps {
  // Le feedback est-il visible ?
  visible: boolean;
  // La réponse était-elle correcte ?
  estCorrecte: boolean | null;
  // Explication affichée sous le titre
  explication: string | null;
  // Texte de la bonne réponse (affiché si mauvaise réponse)
  bonneReponse: string | null;
  // Callback du bouton "Continuer"
  onContinuer: () => void;
  // Callback du bouton "Retour" (optionnel)
  onRetour?: () => void;
  // Peut-on revenir en arrière ?
  peutRevenirEnArriere?: boolean;
  // Soumission en cours (dernier exercice)
  soumissionEnCours?: boolean;
  // Est-ce la dernière question du dernier exercice ?
  estDerniere?: boolean;
}

// ============================================================
// COMPOSANT — FeedbackBanner
// ============================================================

/**
 * FeedbackBanner
 *
 * Bandeau de feedback affiché en bas du panneau quiz
 * après que l'utilisateur a répondu à une question.
 *
 * Deux variantes visuelles :
 * - Verte  : bonne réponse ✅ + explication + bouton Continuer
 * - Rouge  : mauvaise réponse ❌ + bonne réponse révélée
 *            + explication + bouton Continuer
 *
 * Fonctionnalités :
 * - Animation slide-up à l'apparition
 * - Bouton "Continuer" avec raccourci clavier Enter
 * - Bouton "Retour" si navigation arrière possible
 * - État de chargement sur le bouton si soumission en cours
 */
const FeedbackBanner = ({
  visible,
  estCorrecte,
  explication,
  bonneReponse,
  onContinuer,
  onRetour,
  peutRevenirEnArriere = false,
  soumissionEnCours = false,
  estDerniere = false,
}: FeedbackBannerProps) => {

  // ----------------------------------------------------------
  // REF — Focus automatique sur le bouton Continuer
  // Permet la navigation clavier (Enter pour continuer)
  // ----------------------------------------------------------
  const boutonContinuerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (visible && boutonContinuerRef.current) {
      // Petit délai pour laisser l'animation se terminer
      const timer = setTimeout(() => {
        boutonContinuerRef.current?.focus();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  // ----------------------------------------------------------
  // DONNÉES DÉRIVÉES
  // ----------------------------------------------------------

  /** Texte du bouton principal selon le contexte */
  const texteBoutonContinuer = soumissionEnCours
    ? 'Soumission en cours...'
    : estDerniere
      ? 'Terminer l\'épreuve'
      : 'Continuer';

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <AnimatePresence>
      {visible && estCorrecte !== null && (
        <motion.div
          key="feedback-banner"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className={`
            w-full rounded-2xl overflow-hidden
            ${estCorrecte
              ? 'bg-green-50 border border-green-200'
              : 'bg-red-50 border border-red-200'
            }
          `}
        >
          <div className="p-4">

            {/* ── En-tête du feedback ── */}
            <div className="flex items-center gap-2 mb-2">

              {/* Icône résultat */}
              <div
                className={`
                  w-6 h-6 rounded-full flex items-center
                  justify-center flex-shrink-0 text-sm
                  ${estCorrecte
                    ? 'bg-green-500 text-white'
                    : 'bg-red-500 text-white'
                  }
                `}
              >
                {estCorrecte ? '✓' : '✗'}
              </div>

              {/* Titre */}
              <p
                className={`
                  font-bold text-sm
                  ${estCorrecte ? 'text-green-700' : 'text-red-700'}
                `}
              >
                {estCorrecte ? 'Bonne réponse !' : 'Mauvaise réponse !'}
              </p>

            </div>

            {/* ── Bonne réponse révélée (si mauvaise réponse) ── */}
            {!estCorrecte && bonneReponse && (
              <div className="mb-2 px-3 py-2 bg-green-100 
                rounded-xl border border-green-200"
              >
                <p className="text-xs text-green-600 font-medium mb-0.5">
                  La bonne réponse était :
                </p>
                <p className="text-sm text-green-800 font-semibold">
                  {bonneReponse}
                </p>
              </div>
            )}

            {/* ── Explication ── */}
            {explication && (
              <div className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0">
                  {estCorrecte ? '💡' : 'ℹ️'}
                </span>
                <p
                  className={`
                    text-xs leading-relaxed
                    ${estCorrecte ? 'text-green-700' : 'text-red-700'}
                  `}
                >
                  {explication}
                </p>
              </div>
            )}

          </div>

          {/* ── Zone boutons ── */}
          <div
            className={`
              px-4 pb-4 flex items-center gap-2
            `}
          >

            {/* Bouton Retour (optionnel) */}
            {peutRevenirEnArriere && onRetour && (
              <button
                onClick={onRetour}
                aria-label="Revenir à la question précédente"
                className="
                  flex items-center gap-1.5
                  px-4 py-3 rounded-2xl
                  bg-white border-2 border-gray-200
                  hover:border-gray-300 hover:bg-gray-50
                  text-gray-600 text-sm font-semibold
                  transition-all duration-200
                  focus:outline-none focus-visible:ring-2
                  focus-visible:ring-gray-400
                  flex-shrink-0
                "
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Retour
              </button>
            )}

            {/* Bouton Continuer */}
            <button
              ref={boutonContinuerRef}
              onClick={!soumissionEnCours ? onContinuer : undefined}
              disabled={soumissionEnCours}
              aria-label={texteBoutonContinuer}
              className={`
                flex-1 flex items-center justify-center gap-2
                py-3 rounded-2xl
                font-bold text-sm tracking-wide
                transition-all duration-200
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-offset-2
                active:scale-[0.98]
                ${soumissionEnCours
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : estCorrecte
                    ? `bg-green-500 hover:bg-green-600
                       text-white shadow-md shadow-green-200
                       focus-visible:ring-green-400`
                    : `bg-blue-500 hover:bg-blue-600
                       text-white shadow-md shadow-blue-200
                       focus-visible:ring-blue-400`
                }
              `}
            >

              {/* Spinner si soumission en cours */}
              {soumissionEnCours ? (
                <>
                  <div className="w-4 h-4 border-2 border-gray-400
                    border-t-transparent rounded-full animate-spin"
                  />
                  <span>{texteBoutonContinuer}</span>
                </>
              ) : (
                <>
                  <span>{texteBoutonContinuer}</span>
                  {!estDerniere && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                      />
                    </svg>
                  )}
                </>
              )}

            </button>

          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackBanner;