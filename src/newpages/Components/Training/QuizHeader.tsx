import { motion } from 'framer-motion';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface QuizHeaderProps {
  // Titre de l'épreuve
  titreEpreuve: string;
  // Progression globale
  progression: {
    questionsRepondues: number;
    totalQuestions: number;
    pourcentage: number;
    exerciceActuel: number;
    totalExercices: number;
  };
  // Callback du bouton Abandonner
  onAbandonner: () => void;
}

// ============================================================
// SOUS-COMPOSANT — Barre de progression
// ============================================================

interface BarreProgressionProps {
  pourcentage: number;
}

/**
 * BarreProgressionAnimee
 *
 * Barre de progression globale du quiz.
 * Animée via framer-motion à chaque changement de valeur.
 */
const BarreProgressionAnimee = ({ pourcentage }: BarreProgressionProps) => (
  <div className="flex items-center gap-3 flex-1 max-w-sm">

    {/* Piste de la barre */}
    <div
      className="
        flex-1 h-3 rounded-full
        bg-gray-200 overflow-hidden
      "
      role="progressbar"
      aria-valuenow={pourcentage}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={`Progression : ${pourcentage}%`}
    >
      {/* Remplissage animé */}
      <motion.div
        className="
          h-full rounded-full
          bg-gradient-to-r from-blue-400 to-indigo-500
        "
        initial={{ width: 0 }}
        animate={{ width: `${pourcentage}%` }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </div>

    {/* Pourcentage */}
    <span className="text-xs font-bold text-gray-500 w-8 text-right">
      {pourcentage}%
    </span>

  </div>
);

// ============================================================
// SOUS-COMPOSANT — Bouton Abandonner
// ============================================================

interface BoutonAbandonnerProps {
  onClick: () => void;
}

/**
 * BoutonAbandonner
 *
 * Bouton de fermeture/abandon du quiz.
 * Affiché en haut à gauche comme dans Coddy.
 */
const BoutonAbandonner = ({ onClick }: BoutonAbandonnerProps) => (
  <button
    onClick={onClick}
    aria-label="Abandonner l'épreuve"
    className="
      flex items-center gap-2
      px-3 py-2 rounded-xl
      text-gray-400 hover:text-red-500
      hover:bg-red-50
      transition-all duration-200
      focus:outline-none focus-visible:ring-2
      focus-visible:ring-red-400
      group flex-shrink-0
    "
  >
    {/* Icône × */}
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="
        w-5 h-5 transition-transform duration-200
        group-hover:rotate-90
      "
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>

    {/* Texte masqué sur mobile */}
    <span className="hidden sm:inline text-sm font-semibold">
      Abandonner
    </span>
  </button>
);

// ============================================================
// SOUS-COMPOSANT — Indicateur Exercice
// ============================================================

interface IndicateurExerciceProps {
  exerciceActuel: number;
  totalExercices: number;
  questionsRepondues: number;
  totalQuestions: number;
}

/**
 * IndicateurExercice
 *
 * Affiche la position actuelle dans le parcours :
 * - Numéro d'exercice actuel / total
 * - Nombre de questions répondues / total
 */
const IndicateurExercice = ({
  exerciceActuel,
  totalExercices,
  questionsRepondues,
  totalQuestions,
}: IndicateurExerciceProps) => (
  <div className="flex flex-col items-end flex-shrink-0">

    {/* Exercice X/Y */}
    <div className="flex items-baseline gap-1">
      <span className="text-xs text-gray-400 uppercase tracking-wider
        font-semibold hidden sm:inline"
      >
        Exercice
      </span>
      <span className="text-sm font-bold text-gray-700">
        {exerciceActuel}
      </span>
      <span className="text-xs text-gray-400 font-medium">
        /{totalExercices}
      </span>
    </div>

    {/* Questions répondues X/Y */}
    <div className="flex items-baseline gap-1 mt-0.5">
      <span className="text-[10px] text-gray-400 font-medium">
        {questionsRepondues}/{totalQuestions} questions
      </span>
    </div>

  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL — QuizHeader
// ============================================================

/**
 * QuizHeader
 *
 * Header fixe du quiz interactif.
 * Inspiré du design Coddy avec les éléments de Reviz.
 *
 * Structure (gauche → centre → droite) :
 * ┌─────────────────────────────────────────────────┐
 * │ × Abandonner │ ══════════ 33% │ Exercice 1/3   │
 * │              │   Titre        │ 4/12 questions  │
 * └─────────────────────────────────────────────────┘
 *
 * Fixé en haut de l'écran (sticky)
 * Séparé du contenu par une bordure subtile
 */
const QuizHeader = ({
  titreEpreuve,
  progression,
  onAbandonner,
}: QuizHeaderProps) => {

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <header
      className="
        sticky top-0 z-40
        bg-white/95 backdrop-blur-sm
        border-b border-gray-100
        shadow-sm
      "
    >
      <div
        className="
          flex items-center justify-between
          px-4 py-3 gap-4
          max-w-screen-2xl mx-auto
        "
      >

        {/* ── GAUCHE : Bouton Abandonner ── */}
        <BoutonAbandonner onClick={onAbandonner} />

        {/* ── CENTRE : Titre + Barre de progression ── */}
        <div className="flex flex-col items-center gap-1.5 flex-1 min-w-0">

          {/* Titre de l'épreuve (tronqué si trop long) */}
          <p
            className="
              text-xs text-gray-400 font-medium
              truncate max-w-xs text-center
              hidden sm:block
            "
          >
            {titreEpreuve}
          </p>

          {/* Barre de progression */}
          <BarreProgressionAnimee
            pourcentage={progression.pourcentage}
          />

        </div>

        {/* ── DROITE : Indicateur exercice/questions ── */}
        <IndicateurExercice
          exerciceActuel={progression.exerciceActuel}
          totalExercices={progression.totalExercices}
          questionsRepondues={progression.questionsRepondues}
          totalQuestions={progression.totalQuestions}
        />

      </div>

      {/* ── Barre de progression secondaire (mobile) ──
          Affichée uniquement sur mobile sous le header
          car la barre principale peut être trop petite */}
      <div className="sm:hidden h-1 bg-gray-100">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
          initial={{ width: 0 }}
          animate={{ width: `${progression.pourcentage}%` }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        />
      </div>

    </header>
  );
};

export default QuizHeader;