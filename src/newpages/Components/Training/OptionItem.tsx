// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * Les 4 états visuels possibles d'une option
 *
 * idle        → pas encore répondu, option cliquable
 * selected    → cette option a été choisie (avant feedback)
 * correct     → cette option est la bonne réponse (après feedback)
 * incorrect   → cette option a été choisie mais c'est faux
 * disabled    → pas encore répondu mais une autre a été choisie
 */
export type EtatOption =
  | 'idle'
  | 'selected'
  | 'correct'
  | 'incorrect'
  | 'disabled';

interface OptionItemProps {
  // Lettre de l'option (A, B, C, D...)
  lettre: string;
  // Texte de l'option
  texte: string;
  // État visuel actuel
  etat: EtatOption;
  // Callback quand l'utilisateur clique
  onClick: () => void;
  // Mode lecture seule (retour arrière)
  lectureSeule?: boolean;
}

// ============================================================
// UTILITAIRES
// ============================================================

/**
 * Retourne les classes Tailwind selon l'état de l'option
 */
const getStylesOption = (etat: EtatOption) => {
  switch (etat) {

    case 'correct':
      return {
        conteneur: `
          bg-green-50 border-2 border-green-400
          cursor-default
        `,
        lettre: 'bg-green-500 text-white',
        texte: 'text-green-700 font-semibold',
        icone: '✓',
        iconeStyle: 'text-green-500',
      };

    case 'incorrect':
      return {
        conteneur: `
          bg-red-50 border-2 border-red-400
          cursor-default
        `,
        lettre: 'bg-red-500 text-white',
        texte: 'text-red-600 font-semibold',
        icone: '✗',
        iconeStyle: 'text-red-500',
      };

    case 'selected':
      return {
        conteneur: `
          bg-blue-50 border-2 border-blue-400
          cursor-default
        `,
        lettre: 'bg-blue-500 text-white',
        texte: 'text-blue-700 font-semibold',
        icone: null,
        iconeStyle: '',
      };

    case 'disabled':
      return {
        conteneur: `
          bg-white border-2 border-gray-100
          cursor-not-allowed opacity-40
        `,
        lettre: 'bg-gray-200 text-gray-400',
        texte: 'text-gray-400',
        icone: null,
        iconeStyle: '',
      };

    case 'idle':
    default:
      return {
        conteneur: `
          bg-white border-2 border-gray-200
          hover:border-blue-300 hover:bg-blue-50/50
          hover:shadow-sm cursor-pointer
          active:scale-[0.99]
        `,
        lettre: 'bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600',
        texte: 'text-gray-700',
        icone: null,
        iconeStyle: '',
      };
  }
};

// ============================================================
// COMPOSANT — OptionItem
// ============================================================

/**
 * OptionItem
 *
 * Représente une option de réponse dans une question QCM.
 *
 * 5 états visuels :
 * - idle     : cliquable, hover effect
 * - selected : sélectionnée avant feedback (bleu)
 * - correct  : bonne réponse révélée (vert + ✓)
 * - incorrect: mauvaise réponse choisie (rouge + ✗)
 * - disabled : non sélectionnable (une autre a été choisie)
 *
 * Mode lecture seule :
 * - Affiché quand l'utilisateur revient en arrière
 * - Même rendu visuel mais aucun clic possible
 */
const OptionItem = ({
  lettre,
  texte,
  etat,
  onClick,
  lectureSeule = false,
}: OptionItemProps) => {

  // ----------------------------------------------------------
  // DONNÉES DÉRIVÉES
  // ----------------------------------------------------------

  const styles = getStylesOption(etat);

  /** L'option est-elle cliquable ? */
  const estCliquable =
    etat === 'idle' && !lectureSeule;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div
      role={estCliquable ? 'button' : undefined}
      tabIndex={estCliquable ? 0 : undefined}
      onClick={estCliquable ? onClick : undefined}
      onKeyDown={(e) => {
        if (estCliquable && e.key === 'Enter') onClick();
      }}
      aria-label={`Option ${lettre} : ${texte}`}
      aria-disabled={!estCliquable}
      aria-pressed={etat === 'selected' || etat === 'correct' || etat === 'incorrect'}
      className={`
        group relative flex items-center gap-3
        p-3.5 rounded-2xl w-full
        transition-all duration-200
        select-none outline-none
        focus-visible:ring-2 focus-visible:ring-blue-400
        focus-visible:ring-offset-1
        ${styles.conteneur}
      `}
    >

      {/* ── Lettre de l'option (A, B, C, D) ── */}
      <div
        className={`
          w-8 h-8 rounded-xl flex items-center justify-center
          text-sm font-bold flex-shrink-0
          transition-all duration-200
          ${styles.lettre}
        `}
      >
        {lettre}
      </div>

      {/* ── Texte de l'option ── */}
      <p
        className={`
          flex-1 text-sm leading-snug
          transition-colors duration-200
          ${styles.texte}
        `}
      >
        {texte}
      </p>

      {/* ── Icône résultat (✓ ou ✗) ── */}
      {styles.icone && (
        <div
          className={`
            w-6 h-6 flex items-center justify-center
            flex-shrink-0 text-lg font-bold
            ${styles.iconeStyle}
          `}
          aria-hidden="true"
        >
          {styles.icone}
        </div>
      )}

    </div>
  );
};

export default OptionItem;