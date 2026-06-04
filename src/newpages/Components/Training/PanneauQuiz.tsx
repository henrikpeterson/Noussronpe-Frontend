import { useMemo } from 'react';
import QuestionCard from './QuestionCard';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface Option {
  id: number;
  texte: string;
  correcte: boolean;
  explication?: string;
}

interface QuestionCourante {
  id: number;
  texte: string;
  points: number;
  options: Option[];
}

interface ExerciceCourant {
  id: number;
  competence: string;
  enonce: string;
  consigne: string;
  nombreQuestions: number;
}

interface FeedbackEtat {
  visible: boolean;
  estCorrecte: boolean | null;
  explication: string | null;
  bonneReponse: string | null;
}

interface PanneauQuizProps {
  // ── Données de l'exercice courant ──
  exerciceCourant: ExerciceCourant | null;
  // ── Données de la question courante ──
  questionCourante: QuestionCourante | null;
  // ── Index de la question (base 0) ──
  questionActuelleIdx: number;
  // ── Index de l'exercice (base 0) ──
  exerciceActuelIdx: number;
  // ── Nombre total d'exercices ──
  totalExercices: number;

  // ── État de la réponse ──
  reponseChoisie: string | null;
  estRepondue: boolean;
  lectureSeule?: boolean;

  // ── État du feedback ──
  feedback: FeedbackEtat;

  // ── Navigation ──
  peutRevenirEnArriere: boolean;
  soumissionEnCours: boolean;

  // ── Callbacks ──
  onChoisirReponse: (texteOption: string) => void;
  onContinuer: () => void;
  onRetour: () => void;
}

// ============================================================
// COMPOSANT PRINCIPAL — PanneauQuiz
// ============================================================

/**
 * PanneauQuiz
 *
 * Panneau droit du split screen du quiz.
 * Affiche la question courante avec ses options
 * et le feedback après réponse.
 *
 * Responsabilités :
 * - Calculer si c'est la dernière question du dernier exercice
 * - Calculer le numéro de question pour l'affichage (base 1)
 * - Gérer les états de chargement et d'erreur locaux
 * - Déléguer le rendu à QuestionCard
 * - Scroll automatique vers le haut à chaque nouvelle question
 *
 * Ce composant NE gère PAS :
 * - La logique de navigation (useQuizV2)
 * - Le split screen (QuizPage)
 * - L'énoncé (PanneauEnonce)
 */
const PanneauQuiz = ({
  exerciceCourant,
  questionCourante,
  questionActuelleIdx,
  exerciceActuelIdx,
  totalExercices,
  reponseChoisie,
  estRepondue,
  lectureSeule = false,
  feedback,
  peutRevenirEnArriere,
  soumissionEnCours,
  onChoisirReponse,
  onContinuer,
  onRetour,
}: PanneauQuizProps) => {

  // ----------------------------------------------------------
  // DONNÉES DÉRIVÉES
  // ----------------------------------------------------------

  /**
   * Numéro de question pour l'affichage (base 1)
   */
  const numeroQuestion = questionActuelleIdx + 1;

  /**
   * Est-ce la dernière question du dernier exercice ?
   * Détermine le texte du bouton "Continuer" vs "Terminer"
   */
  const estDerniereQuestion = useMemo(() => {
    if (!exerciceCourant) return false;

    const estDernierExercice = exerciceActuelIdx >= totalExercices - 1;
    const estDerniereQuestionExercice =
      questionActuelleIdx >= exerciceCourant.nombreQuestions - 1;

    return estDernierExercice && estDerniereQuestionExercice;
  }, [
    exerciceCourant,
    exerciceActuelIdx,
    questionActuelleIdx,
    totalExercices,
  ]);

  // ----------------------------------------------------------
  // RENDER — État : Chargement
  // ----------------------------------------------------------

  if (!questionCourante || !exerciceCourant) {
    return (
      <div
        className="
          h-full flex items-center justify-center
          bg-gray-50
        "
      >
        <div className="text-center">
          <div
            className="
              w-10 h-10 border-4 border-blue-500
              border-t-transparent rounded-full
              animate-spin mx-auto mb-3
            "
          />
          <p className="text-gray-400 text-sm font-medium">
            Chargement de la question...
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDER — Contenu principal
  // ----------------------------------------------------------

  return (
    <div
      className="
        h-full flex flex-col
        bg-gray-50/50
      "
    >

      {/* ════════════════════════════════════════════════════
          EN-TÊTE DU PANNEAU QUIZ
          Barre de progression de l'exercice courant
      ════════════════════════════════════════════════════ */}
      <div
        className="
          flex-shrink-0 px-6 pt-5 pb-4
          border-b border-gray-100 bg-white
        "
      >

        {/* ── Titre section ── */}
        <div className="flex items-center justify-between mb-3">

          {/* Label "Questions d'analyse" */}
          <div className="flex items-center gap-2">
            <div
              className="
                w-7 h-7 rounded-lg bg-amber-100
                flex items-center justify-center
              "
            >
              <span className="text-sm">💡</span>
            </div>
            <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
              Questions d'analyse
            </p>
          </div>

          {/* Compteur questions de l'exercice */}
          <span
            className="
              text-xs font-semibold text-gray-400
              bg-gray-100 px-2.5 py-1 rounded-full
            "
          >
            {exerciceCourant.nombreQuestions} question{exerciceCourant.nombreQuestions > 1 ? 's' : ''}
          </span>

        </div>

        {/* ── Barre de progression de l'exercice courant ── */}
        <div className="space-y-1.5">

          {/* Piste */}
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="
                h-full rounded-full
                bg-gradient-to-r from-blue-400 to-indigo-500
                transition-all duration-500 ease-out
              "
              style={{
                width: `${Math.round(
                  (numeroQuestion / exerciceCourant.nombreQuestions) * 100
                )}%`,
              }}
            />
          </div>

          {/* Label progression */}
          <p className="text-[10px] text-gray-400 font-medium">
            Question {numeroQuestion} sur {exerciceCourant.nombreQuestions}
          </p>

        </div>

      </div>

      {/* ════════════════════════════════════════════════════
          ZONE PRINCIPALE — Question + Options + Feedback
          Scrollable si le contenu dépasse la hauteur
      ════════════════════════════════════════════════════ */}
      <div
        className="
          flex-1 overflow-y-auto
          px-6 py-5
          scroll-smooth
        "
      >
        <QuestionCard
          // ── Numérotation ──
          numeroQuestion={numeroQuestion}
          totalQuestions={exerciceCourant.nombreQuestions}
          // ── Contenu de la question ──
          texteQuestion={questionCourante.texte}
          points={questionCourante.points}
          options={questionCourante.options}
          // ── État de la réponse ──
          reponseChoisie={reponseChoisie}
          estRepondue={estRepondue}
          lectureSeule={lectureSeule}
          // ── Feedback ──
          feedbackVisible={feedback.visible}
          feedbackEstCorrecte={feedback.estCorrecte}
          feedbackExplication={feedback.explication}
          feedbackBonneReponse={feedback.bonneReponse}
          // ── Navigation ──
          peutRevenirEnArriere={peutRevenirEnArriere}
          estDerniereQuestion={estDerniereQuestion}
          soumissionEnCours={soumissionEnCours}
          // ── Callbacks ──
          onChoisirReponse={onChoisirReponse}
          onContinuer={onContinuer}
          onRetour={onRetour}
        />
      </div>

      {/* ════════════════════════════════════════════════════
          PIED DU PANNEAU
          Indication de navigation clavier (desktop)
      ════════════════════════════════════════════════════ */}
      {estRepondue && !soumissionEnCours && (
        <div
          className="
            flex-shrink-0 px-6 py-3
            border-t border-gray-100
            bg-white
            hidden sm:flex items-center
            justify-center gap-2
          "
        >
          <kbd
            className="
              px-2 py-0.5 rounded-md
              bg-gray-100 border border-gray-200
              text-gray-500 text-xs font-mono
              shadow-sm
            "
          >
            Enter
          </kbd>
          <span className="text-xs text-gray-400">
            pour continuer
          </span>
        </div>
      )}

    </div>
  );
};

export default PanneauQuiz;