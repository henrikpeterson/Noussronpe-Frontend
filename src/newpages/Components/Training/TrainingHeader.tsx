import { motion, AnimatePresence } from "framer-motion";

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface FiltreActifBadgeProps {
  icone: string;
  texte: string;
}

/**
 * FiltreActifBadge
 * Badge affiché dans le header quand on est à l'étape 2
 */
const FiltreActifBadge = ({ icone, texte }: FiltreActifBadgeProps) => (
  <span
    className="
      inline-flex items-center gap-1.5 px-3 py-1
      bg-white/20 border border-white/30
      text-white text-xs font-semibold
      rounded-full backdrop-blur-sm
    "
  >
    <span>{icone}</span>
    {texte}
  </span>
);

interface TrainingHeaderProps {
  // ── Étape actuelle du parcours ──
  etape: number;

  // ── Props Étape 1 ──
  title?: string;
  subtitle?: string;
  colorVariant?: "green" | "blue" | "red";

  // ── Props Étape 2 ──
  // Callback du bouton retour ←
  onRetour?: () => void;
  // Noms des filtres actifs
  nomMatiere?: string;
  nomClasse?: string;
  nomType?: string | null;
  // Nombre de résultats pour le sous-titre
  nombreResultats?: number;
  // Chargement en cours dans ResultatsStep
  loadingResultats?: boolean;
  colo1variant? : "green" | "blue" | "red";
}

// ============================================================
// COMPOSANT — TrainingHeader
// ============================================================

/**
 * TrainingHeader
 *
 * Header dynamique du module d'entraînement.
 * S'adapte selon l'étape active :
 *
 * Étape 1 — Header simple
 * ├── Titre : "Choisis ton mode d'entraînement"
 * └── Sous-titre : "Sélectionne une matière..."
 *
 * Étape 2 — Header résultats
 * ├── Bouton retour ←
 * ├── Titre : "Sujets disponibles"
 * ├── Sous-titre : "X sujets trouvés" ou "Recherche..."
 * ├── Badges : matière + classe + type
 * └── Bouton "Modifier"
 */
const TrainingHeader = ({
  etape,
  title = "Choisis ton mode d'entraînement",
  subtitle = "Sélectionne une matière pour progresser à ton rythme.",
  colorVariant = "green",
  onRetour,
  nomMatiere,
  nomClasse,
  nomType,
  nombreResultats,
  loadingResultats = false,
}: TrainingHeaderProps) => {

  // ----------------------------------------------------------
  // THÈMES DE COULEUR
  // ----------------------------------------------------------
  const themes = {
    green: "bg-[#58cc02] border-[#46a302]",
    blue:  "bg-[#1cb0f6] border-[#1899d6]",
    red:   "bg-[#F73434] border-[#9E3737]",
  };
  
  // ----------------------------------------------------------
  // SOUS-TITRE DYNAMIQUE — Étape 2
  // ----------------------------------------------------------
  const sousTitreResultats = loadingResultats
    ? "Recherche en cours..."
    : nombreResultats !== undefined
      ? `${nombreResultats} sujet${nombreResultats > 1 ? "s" : ""} trouvé${nombreResultats > 1 ? "s" : ""}`
      : "";

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`
        ${themes[colorVariant]}
        border-b-4
        rounded-2xl
        mb-7
        text-white
        font-fredoka
        shadow-sm
        max-w-3xl
        mx-auto
        overflow-hidden
      `}
    >
      <AnimatePresence mode="wait">

        {/* ════════════════════════════════════════════════════
            ÉTAPE 1 — Header simple
        ════════════════════════════════════════════════════ */}
        {etape === 1 && (
          <motion.div
            key="header-etape-1"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:px-6 md:py-4"
          >
            <div className="flex flex-col gap-1">

              {/* Titre */}
              <h1 className="text-xl md:text-2xl font-fredoka leading-none">
                {title}
              </h1>

              {/* Sous-titre */}
              {subtitle && (
                <p className="text-white/100 text-xs md:text-sm 
                  font-bold opacity-90"
                >
                  {subtitle}
                </p>
              )}

            </div>
          </motion.div>
        )}

        {/* ════════════════════════════════════════════════════
            ÉTAPE 2 — Header résultats
        ════════════════════════════════════════════════════ */}
        {etape === 2 && (
          <motion.div
            key="header-etape-2"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="p-4 md:px-6 md:py-4"
          >

            {/* ── Ligne 1 : Bouton retour + Titre ── */}
            <div className="flex items-center gap-3 mb-3">

              {/* Bouton retour ← */}
              {onRetour && (
                <button
                  onClick={onRetour}
                  aria-label="Retour à la configuration des filtres"
                  className="
                    w-8 h-8 flex items-center justify-center
                    rounded-xl bg-white/20 hover:bg-white/30
                    border border-white/30
                    text-white
                    transition-all duration-200 flex-shrink-0
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-white/50
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
                </button>
              )}

              {/* Titre + Sous-titre */}
              <div>
                <h1 className="text-xl md:text-2xl font-fredoka leading-none">
                  Sujets disponibles
                </h1>
                <p className="text-white/80 text-xs md:text-sm 
                  font-bold mt-0.5"
                >
                  {sousTitreResultats}
                </p>
              </div>

            </div>

            {/* ── Ligne 2 : Badges filtres + Bouton Modifier ── */}
            <div className="flex flex-wrap items-center gap-2">

              {/* Badge Matière */}
              {nomMatiere && (
                <FiltreActifBadge icone="📚" texte={nomMatiere} />
              )}

              {/* Badge Classe */}
              {nomClasse && (
                <FiltreActifBadge icone="🎓" texte={nomClasse} />
              )}

              {/* Badge Type (optionnel) */}
              {nomType && (
                <FiltreActifBadge icone="📋" texte={nomType} />
              )}

              {/* Séparateur */}
              <div className="w-px h-4 bg-white/30" />

              {/* Bouton Modifier */}
              {onRetour && (
                <button
                  onClick={onRetour}
                  className="
                    inline-flex items-center gap-1.5
                    px-3 py-1 rounded-full
                    bg-white/20 hover:bg-white/30
                    border border-white/30
                    text-white text-xs font-semibold
                    transition-all duration-200
                    focus:outline-none focus-visible:ring-2
                    focus-visible:ring-white/50
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 
                        2h11a2 2 0 002-2v-5m-1.414-9.414a2 
                        2 0 112.828 2.828L11.828 15H9v-2.828
                        l8.586-8.586z"
                    />
                  </svg>
                  Modifier
                </button>
              )}

            </div>

          </motion.div>
        )}

      </AnimatePresence>
    </motion.div>
  );
};

export default TrainingHeader;