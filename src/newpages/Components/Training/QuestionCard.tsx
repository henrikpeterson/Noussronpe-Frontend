import { useMemo } from 'react';
import OptionItem, { EtatOption } from './OptionItem';
import FeedbackBanner from './FeedbackBanner';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface Option {
  id: number;
  texte: string;
  correcte: boolean;
  explication?: string;
}

interface QuestionCardProps {
  // Numéro de la question (base 1, pour l'affichage)
  numeroQuestion: number;
  // Nombre total de questions dans l'exercice courant
  totalQuestions: number;
  // Texte de la question
  texteQuestion: string;
  // Points de la question
  points: number;
  // Liste des options de réponse
  options: Option[];
  // Texte de l'option choisie par l'utilisateur (null = pas encore)
  reponseChoisie: string | null;
  // La question a-t-elle été répondue ?
  estRepondue: boolean;
  // Mode lecture seule (retour arrière sur question déjà répondue)
  lectureSeule?: boolean;

  // ── Props feedback ──
  feedbackVisible: boolean;
  feedbackEstCorrecte: boolean | null;
  feedbackExplication: string | null;
  feedbackBonneReponse: string | null;

  // ── Props navigation ──
  peutRevenirEnArriere: boolean;
  estDerniereQuestion: boolean;
  soumissionEnCours: boolean;

  // ── Callbacks ──
  onChoisirReponse: (texteOption: string) => void;
  onContinuer: () => void;
  onRetour: () => void;
}

// ============================================================
// UTILITAIRES
// ============================================================

/**
 * LETTRES_OPTIONS
 * Tableau des lettres associées aux options (A, B, C, D...)
 */
const LETTRES_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F'];

/**
 * determinerEtatOption
 *
 * Calcule l'état visuel d'une option selon le contexte :
 * - Avant réponse : toutes les options sont en état "idle"
 * - Après réponse :
 *   → L'option correcte passe en "correct"
 *   → L'option choisie (si fausse) passe en "incorrect"
 *   → Les autres passent en "disabled"
 *
 * @param option          - L'option à évaluer
 * @param reponseChoisie  - Texte de la réponse choisie (null = pas encore)
 * @param estRepondue     - La question a-t-elle été répondue ?
 */
const determinerEtatOption = (
  option: Option,
  reponseChoisie: string | null,
  estRepondue: boolean
): EtatOption => {

  // ── Avant réponse ──
  if (!estRepondue) return 'idle';

  // ── Après réponse ──

  // Cette option est la bonne réponse → toujours verte
  if (option.correcte) return 'correct';

  // Cette option a été choisie mais c'est faux → rouge
  if (option.texte === reponseChoisie && !option.correcte) return 'incorrect';

  // Toutes les autres → grisées
  return 'disabled';
};

// ============================================================
// COMPOSANT PRINCIPAL — QuestionCard
// ============================================================

/**
 * QuestionCard
 *
 * Carte affichant une question QCM avec ses options.
 * Orchestre OptionItem et FeedbackBanner.
 *
 * Cycle de vie d'une question :
 * 1. Affichage initial → toutes options en état "idle"
 * 2. Clic sur une option → appel onChoisirReponse()
 * 3. Feedback visible → options passent en correct/incorrect/disabled
 * 4. Clic "Continuer" → appel onContinuer() → question suivante
 *
 * Mode lecture seule (retour arrière) :
 * → Même rendu mais aucune option n'est cliquable
 * → Le feedback est affiché directement
 * → Seul le bouton "Retour" / "Continuer" est actif
 */
const QuestionCard = ({
  numeroQuestion,
  totalQuestions,
  texteQuestion,
  points,
  options,
  reponseChoisie,
  estRepondue,
  lectureSeule = false,
  feedbackVisible,
  feedbackEstCorrecte,
  feedbackExplication,
  feedbackBonneReponse,
  peutRevenirEnArriere,
  estDerniereQuestion,
  soumissionEnCours,
  onChoisirReponse,
  onContinuer,
  onRetour,
}: QuestionCardProps) => {

  // ----------------------------------------------------------
  // DONNÉES DÉRIVÉES
  // Mémoïsées pour éviter les recalculs à chaque render
  // ----------------------------------------------------------

  /**
   * États calculés de chaque option
   * Se recalcule uniquement quand reponseChoisie ou estRepondue change
   */
  const etatsOptions = useMemo(
    () =>
      options.map((option) =>
        determinerEtatOption(option, reponseChoisie, estRepondue)
      ),
    [options, reponseChoisie, estRepondue]
  );

  /**
   * Message d'invite affiché sous la question
   * Change selon l'état de la question
   */
  const messageInvite = estRepondue
    ? null
    : lectureSeule
      ? null
      : 'Choisis une réponse pour continuer';

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* ════════════════════════════════════════════════════
          EN-TÊTE DE LA QUESTION
      ════════════════════════════════════════════════════ */}
      <div className="flex flex-col gap-3">

        {/* ── Indicateur de position + Points ── */}
        <div className="flex items-center justify-between">

          {/* Position : Question X/Y */}
          <div className="flex items-center gap-2">
            <div
              className="
                w-8 h-8 rounded-xl flex items-center justify-center
                bg-gradient-to-br from-blue-500 to-indigo-500
                text-white text-sm font-bold
                shadow-sm shadow-blue-200
                flex-shrink-0
              "
            >
              {numeroQuestion}
            </div>
            <span className="text-xs text-gray-400 font-medium">
              Question{' '}
              <span className="text-gray-600 font-semibold">
                {numeroQuestion}
              </span>
              {' '}/{' '}
              <span className="text-gray-600 font-semibold">
                {totalQuestions}
              </span>
            </span>
          </div>

          {/* Points de la question */}
          <div
            className="
              flex items-center gap-1
              px-2.5 py-1 rounded-full
              bg-amber-50 border border-amber-200
            "
          >
            <span className="text-amber-500 text-xs">⭐</span>
            <span className="text-amber-700 text-xs font-bold">
              {points} pt{points > 1 ? 's' : ''}
            </span>
          </div>

        </div>

        {/* ── Texte de la question ── */}
        <h2
          className="
            text-base font-bold text-gray-800
            leading-snug
          "
        >
          {texteQuestion}
        </h2>

        {/* ── Message d'invite (avant réponse) ── */}
        {messageInvite && (
          <p className="text-xs text-gray-400 italic">
            {messageInvite}
          </p>
        )}

        {/* ── Badge lecture seule ── */}
        {lectureSeule && (
          <div
            className="
              inline-flex items-center gap-1.5
              px-2.5 py-1 rounded-full w-fit
              bg-gray-100 border border-gray-200
            "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-3 h-3 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 
                  0 8.268 2.943 9.542 7-1.274 4.057-5.064 
                  7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            <span className="text-xs text-gray-400 font-medium">
              Consultation uniquement
            </span>
          </div>
        )}

      </div>

      {/* ════════════════════════════════════════════════════
          LISTE DES OPTIONS
      ════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col gap-2"
        role="group"
        aria-label="Options de réponse"
      >
        {options.map((option, index) => (
          <OptionItem
            key={option.id}
            lettre={LETTRES_OPTIONS[index] ?? String(index + 1)}
            texte={option.texte}
            etat={etatsOptions[index]}
            onClick={() => onChoisirReponse(option.texte)}
            lectureSeule={lectureSeule}
          />
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          FEEDBACK + BOUTON CONTINUER
          Affiché uniquement après avoir répondu
      ════════════════════════════════════════════════════ */}
      <FeedbackBanner
        visible={feedbackVisible}
        estCorrecte={feedbackEstCorrecte}
        explication={feedbackExplication}
        bonneReponse={feedbackBonneReponse}
        onContinuer={onContinuer}
        onRetour={onRetour}
        peutRevenirEnArriere={peutRevenirEnArriere}
        soumissionEnCours={soumissionEnCours}
        estDerniere={estDerniereQuestion}
      />

    </div>
  );
};

export default QuestionCard;