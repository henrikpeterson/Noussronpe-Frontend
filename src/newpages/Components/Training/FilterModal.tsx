import { useState, useEffect, useRef } from 'react';

// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * Une option affichable dans la modale
 */
export interface FilterOption {
  // Identifiant unique de l'option (number pour classe/matière, string pour type)
  id: number | string;
  // Texte principal affiché
  label: string;
  // Texte secondaire optionnel (ex: "Aucun filtre sur le type")
  sousTitre?: string;
}

interface FilterModalProps {
  // Titre affiché en haut de la modale
  titre: string;
  // Liste des options à afficher
  options: FilterOption[];
  // Valeur actuellement sélectionnée (pour pré-sélectionner)
  valeurActuelle: number | string | null;
  // Callback quand l'utilisateur confirme sa sélection
  onConfirmer: (valeur: number | string) => void;
  // Callback pour fermer sans appliquer de changement
  onFermer: () => void;
}

// ============================================================
// COMPOSANT — FilterModal
// ============================================================

/**
 * FilterModal
 *
 * Modale générique de sélection d'un filtre.
 * Utilisée pour les 3 filtres : Matière, Niveau, Type d'épreuve.
 *
 * Fonctionnalités :
 * - Pré-sélection de la valeur actuelle à l'ouverture
 * - Sélection temporaire avant confirmation
 * - Recherche dans la liste (si plus de 5 options)
 * - Fermeture via overlay, croix ou touche Échap
 * - Animation d'entrée slide-up
 * - Accessibilité clavier complète
 */
const FilterModal = ({
  titre,
  options,
  valeurActuelle,
  onConfirmer,
  onFermer,
}: FilterModalProps) => {

  // ----------------------------------------------------------
  // STATE LOCAL
  // ----------------------------------------------------------

  /**
   * Sélection temporaire — ne devient effective
   * qu'après clic sur "Confirmer"
   */
  const [selectionTemp, setSelectionTemp] = useState<
    number | string | null
  >(valeurActuelle);

  /**
   * Terme de recherche pour filtrer les options
   * Visible uniquement si options.length > 5
   */
  const [recherche, setRecherche] = useState('');

  /**
   * Contrôle l'animation d'entrée/sortie de la modale
   */
  const [estVisible, setEstVisible] = useState(false);

  // ----------------------------------------------------------
  // REFS
  // ----------------------------------------------------------

  /** Référence sur l'input de recherche pour le focus auto */
  const inputRechercheRef = useRef<HTMLInputElement>(null);

  /** Référence sur le conteneur de la modale pour le focus trap */
  const modaleRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------
  // EFFETS
  // ----------------------------------------------------------

  /**
   * Animation d'entrée : on déclenche la visibilité
   * au prochain tick pour que la transition CSS s'applique
   */
  useEffect(() => {
    const timer = setTimeout(() => setEstVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  /**
   * Focus automatique sur l'input de recherche
   * si la liste est longue
   */
  useEffect(() => {
    if (options.length > 5 && inputRechercheRef.current) {
      inputRechercheRef.current.focus();
    }
  }, [options.length]);

  /**
   * Fermeture via la touche Échap
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleFermerAvecAnimation();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  /**
   * Bloque le scroll du body pendant que la modale est ouverte
   */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  /**
   * Fermeture avec animation de sortie (slide-down)
   * avant d'appeler onFermer()
   */
  const handleFermerAvecAnimation = () => {
    setEstVisible(false);
    setTimeout(() => onFermer(), 300);
  };

  /**
   * Confirmation de la sélection
   * Déclenche onConfirmer puis ferme la modale
   */
  const handleConfirmer = () => {
    if (selectionTemp !== null) {
      onConfirmer(selectionTemp);
      handleFermerAvecAnimation();
    }
  };

  // ----------------------------------------------------------
  // OPTIONS FILTRÉES PAR LA RECHERCHE
  // ----------------------------------------------------------

  const optionsFiltrees = options.filter((option) =>
    option.label.toLowerCase().includes(recherche.toLowerCase())
  );

  // ----------------------------------------------------------
  // ÉTAT DÉRIVÉ
  // ----------------------------------------------------------

  /** La sélection a-t-elle changé par rapport à la valeur initiale ? */
  const aChange = selectionTemp !== valeurActuelle;

  /** Affiche-t-on la barre de recherche ? */
  const afficherRecherche = options.length > 5;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (

    /* ── OVERLAY ── */
    <div
      className={`
        fixed inset-0 z-50 flex items-end sm:items-center 
        justify-center p-4 sm:p-6
        transition-all duration-300
        ${estVisible
          ? 'bg-black/50 backdrop-blur-sm'
          : 'bg-black/0 backdrop-blur-none'
        }
      `}
      onClick={handleFermerAvecAnimation}
      role="dialog"
      aria-modal="true"
      aria-label={titre}
    >

      {/* ── CONTENEUR DE LA MODALE ── */}
      <div
        ref={modaleRef}
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-white w-full max-w-md rounded-3xl
          flex flex-col overflow-hidden
          shadow-2xl shadow-black/20
          transition-all duration-300
          ${estVisible
            ? 'translate-y-0 opacity-100 scale-100'
            : 'translate-y-8 opacity-0 scale-95'
          }
        `}
        style={{ maxHeight: '80vh' }}
      >

        {/* ════════════════════════════════════════════════════
            EN-TÊTE
        ════════════════════════════════════════════════════ */}
        <div className="relative px-6 pt-6 pb-4 flex-shrink-0">

          {/* Trait décoratif en haut (style bottom sheet) */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 
            w-10 h-1 rounded-full bg-gray-200 sm:hidden" 
          />

          {/* Titre + bouton fermer */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">
                {titre}
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                {options.length} option{options.length > 1 ? 's' : ''} disponible{options.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* Bouton fermer */}
            <button
              onClick={handleFermerAvecAnimation}
              aria-label="Fermer la modale"
              className="
                w-9 h-9 flex items-center justify-center
                rounded-2xl bg-gray-100 hover:bg-gray-200
                text-gray-500 hover:text-gray-700
                transition-all duration-200
                focus:outline-none focus-visible:ring-2 
                focus-visible:ring-gray-400
                text-lg font-light
              "
            >
              ×
            </button>
          </div>

          {/* ── BARRE DE RECHERCHE (si liste longue) ── */}
          {afficherRecherche && (
            <div className="relative mt-4">
              {/* Icône loupe */}
              <div className="absolute left-3.5 top-1/2 -translate-y-1/2 
                text-gray-400 pointer-events-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
                  />
                </svg>
              </div>

              <input
                ref={inputRechercheRef}
                type="text"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
                placeholder="Rechercher..."
                aria-label="Rechercher dans la liste"
                className="
                  w-full pl-10 pr-4 py-3 rounded-2xl
                  bg-gray-50 border border-gray-200
                  text-sm text-gray-700 placeholder-gray-400
                  focus:outline-none focus:ring-2 focus:ring-blue-300
                  focus:border-blue-300 focus:bg-white
                  transition-all duration-200
                "
              />

              {/* Bouton effacer la recherche */}
              {recherche && (
                <button
                  onClick={() => setRecherche('')}
                  aria-label="Effacer la recherche"
                  className="
                    absolute right-3 top-1/2 -translate-y-1/2
                    w-5 h-5 flex items-center justify-center
                    rounded-full bg-gray-300 hover:bg-gray-400
                    text-white text-xs font-bold
                    transition-colors duration-200
                  "
                >
                  ×
                </button>
              )}
            </div>
          )}

          {/* Séparateur */}
          <div className="h-px bg-gradient-to-r from-transparent 
            via-gray-100 to-transparent mt-4" 
          />
        </div>

        {/* ════════════════════════════════════════════════════
            LISTE DES OPTIONS — scrollable
        ════════════════════════════════════════════════════ */}
        <div className="overflow-y-auto flex-1 px-3 py-2">

          {/* Aucun résultat */}
          {optionsFiltrees.length === 0 ? (
            <div className="flex flex-col items-center justify-center 
              py-12 text-center"
            >
              <span className="text-4xl mb-3">🔍</span>
              <p className="text-gray-500 font-medium text-sm">
                Aucun résultat pour
              </p>
              <p className="text-gray-400 text-sm mt-0.5">
                « {recherche} »
              </p>
              <button
                onClick={() => setRecherche('')}
                className="mt-4 text-blue-500 text-sm font-medium 
                  hover:underline"
              >
                Effacer la recherche
              </button>
            </div>
          ) : (

            /* Liste des options */
            <div className="space-y-1.5 pb-2">
              {optionsFiltrees.map((option) => {
                const estSelectionne = selectionTemp === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => setSelectionTemp(option.id)}
                    aria-pressed={estSelectionne}
                    aria-label={option.label}
                    className={`
                      w-full text-left px-4 py-3.5 rounded-2xl
                      transition-all duration-200 outline-none
                      border-2 group
                      focus-visible:ring-2 focus-visible:ring-blue-400
                      focus-visible:ring-offset-1
                      ${estSelectionne
                        /* Option sélectionnée */
                        ? `bg-gradient-to-r from-blue-50 to-indigo-50
                           border-blue-300`
                        /* Option non sélectionnée */
                        : `bg-white border-transparent
                           hover:bg-gray-50 hover:border-gray-200`
                      }
                    `}
                  >
                    <div className="flex items-center justify-between gap-3">

                      {/* Texte de l'option */}
                      <div className="flex-1 min-w-0">
                        <p
                          className={`
                            font-semibold text-sm leading-tight truncate
                            transition-colors duration-200
                            ${estSelectionne
                              ? 'text-blue-700'
                              : 'text-gray-700 group-hover:text-gray-900'
                            }
                          `}
                        >
                          {option.label}
                        </p>

                        {/* Sous-titre optionnel */}
                        {option.sousTitre && (
                          <p
                            className={`
                              text-xs mt-0.5 leading-tight truncate
                              transition-colors duration-200
                              ${estSelectionne
                                ? 'text-blue-400'
                                : 'text-gray-400'
                              }
                            `}
                          >
                            {option.sousTitre}
                          </p>
                        )}
                      </div>

                      {/* Indicateur de sélection */}
                      <div
                        className={`
                          w-6 h-6 rounded-full flex-shrink-0
                          flex items-center justify-center
                          border-2 transition-all duration-200
                          ${estSelectionne
                            ? 'bg-blue-500 border-blue-500 scale-110'
                            : 'bg-white border-gray-200 group-hover:border-blue-300'
                          }
                        `}
                      >
                        {estSelectionne && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-3 h-3 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>

                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ════════════════════════════════════════════════════
            PIED DE MODALE — Bouton de confirmation
        ════════════════════════════════════════════════════ */}
        <div className="px-6 pb-6 pt-3 flex-shrink-0">

          {/* Séparateur */}
          <div className="h-px bg-gradient-to-r from-transparent 
            via-gray-100 to-transparent mb-4" 
          />

          {/* Indicateur de sélection en cours */}
          {selectionTemp !== null && (
            <div className="flex items-center gap-2 mb-3 px-1">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <p className="text-xs text-gray-500">
                Sélectionné :{' '}
                <span className="font-semibold text-blue-600">
                  {options.find((o) => o.id === selectionTemp)?.label}
                </span>
              </p>
            </div>
          )}

          {/* Bouton Confirmer */}
          <div className="relative">

            {/* Halo lumineux quand le bouton est actif */}
            {selectionTemp !== null && aChange && (
              <div
                className="
                  absolute inset-0 rounded-2xl blur-md
                  bg-gradient-to-r from-blue-400 to-indigo-400
                  opacity-30 scale-95
                "
              />
            )}

            <button
              onClick={handleConfirmer}
              disabled={selectionTemp === null}
              className={`
                relative w-full py-4 rounded-2xl
                font-semibold text-sm tracking-wide
                transition-all duration-300 outline-none
                focus-visible:ring-2 focus-visible:ring-blue-400
                focus-visible:ring-offset-2
                ${selectionTemp === null
                  /* Rien de sélectionné */
                  ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  : aChange
                    /* Nouvelle sélection différente */
                    ? `bg-gradient-to-r from-blue-500 to-indigo-500
                       hover:from-blue-600 hover:to-indigo-600
                       text-white shadow-lg
                       active:scale-[0.98] transform`
                    /* Même valeur que l'actuelle */
                    : `bg-gray-100 text-gray-500
                       hover:bg-gray-200 
                       active:scale-[0.98] transform`
                }
              `}
            >
              {selectionTemp === null
                ? 'Sélectionne une option'
                : aChange
                  ? `Confirmer — ${options.find((o) => o.id === selectionTemp)?.label}`
                  : 'Déjà sélectionné'
              }
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default FilterModal;