import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useQuizV2 } from '../hooks/useQuizV2';
import QuizHeader from '@/newpages/Components/Training/QuizHeader';
import PanneauEnonce from '@/newpages/Components/Training/PanneauEnonce';
import PanneauQuiz from '@/newpages/Components/Training/PanneauQuiz';

// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * Onglet actif sur mobile
 * Sur desktop les deux panneaux sont visibles simultanément
 */
type OngletMobile = 'enonce' | 'quiz';

// ============================================================
// SOUS-COMPOSANT — Sélecteur d'onglets mobile
// ============================================================

interface OngletsMobileProps {
  ongletActif: OngletMobile;
  onChangerOnglet: (onglet: OngletMobile) => void;
}

/**
 * OngletsMobile
 *
 * Barre de navigation en bas de l'écran sur mobile.
 * Permet de basculer entre l'énoncé et le quiz.
 * Inspiré du design Coddy mobile.
 */
const OngletsMobile = ({
  ongletActif,
  onChangerOnglet,
}: OngletsMobileProps) => (
  <div
    className="
      flex-shrink-0 flex
      border-t border-gray-200
      bg-white
      sm:hidden
    "
  >

    {/* Onglet Énoncé */}
    <button
      onClick={() => onChangerOnglet('enonce')}
      aria-label="Voir l'énoncé"
      aria-pressed={ongletActif === 'enonce'}
      className={`
        flex-1 flex flex-col items-center justify-center
        gap-1 py-3
        text-xs font-semibold
        transition-all duration-200
        border-t-2
        ${ongletActif === 'enonce'
          ? 'border-blue-500 text-blue-600 bg-blue-50/50'
          : 'border-transparent text-gray-400 hover:text-gray-600'
        }
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 
            01-2-2V5a2 2 0 012-2h5.586a1 
            1 0 01.707.293l5.414 5.414a1 
            1 0 01.293.707V19a2 2 0 
            01-2 2z"
        />
      </svg>
      Énoncé
    </button>

    {/* Onglet Quiz */}
    <button
      onClick={() => onChangerOnglet('quiz')}
      aria-label="Voir les questions"
      aria-pressed={ongletActif === 'quiz'}
      className={`
        flex-1 flex flex-col items-center justify-center
        gap-1 py-3
        text-xs font-semibold
        transition-all duration-200
        border-t-2
        ${ongletActif === 'quiz'
          ? 'border-blue-500 text-blue-600 bg-blue-50/50'
          : 'border-transparent text-gray-400 hover:text-gray-600'
        }
      `}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.228 9c.549-1.165 2.03-2 3.772-2 
            2.21 0 4 1.343 4 3 0 1.4-1.278 
            2.575-3.006 2.907-.542.104-.994.54
            -.994 1.093m0 3h.01M21 12a9 9 0 
            11-18 0 9 9 0 0118 0z"
        />
      </svg>
      Questions
    </button>

  </div>
);

// ============================================================
// SOUS-COMPOSANT — Modale de confirmation d'abandon
// ============================================================

interface ModaleAbandonProps {
  onConfirmer: () => void;
  onAnnuler: () => void;
}

/**
 * ModaleAbandon
 *
 * Modale de confirmation avant d'abandonner le quiz.
 * Évite les abandons accidentels.
 */
const ModaleAbandon = ({
  onConfirmer,
  onAnnuler,
}: ModaleAbandonProps) => (
  <div
    className="
      fixed inset-0 z-50
      bg-black/60 backdrop-blur-sm
      flex items-center justify-center
      p-4
    "
    onClick={onAnnuler}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      className="
        bg-white rounded-3xl p-6
        w-full max-w-sm
        shadow-2xl
      "
    >

      {/* Icône */}
      <div
        className="
          w-14 h-14 rounded-2xl bg-red-100
          flex items-center justify-center
          mx-auto mb-4
        "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 
              4h13.856c1.54 0 2.502-1.667 
              1.732-3L13.732 4c-.77-1.333
              -2.694-1.333-3.464 0L3.34 
              16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>

      {/* Titre */}
      <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
        Abandonner l'épreuve ?
      </h3>

      {/* Description */}
      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
        Ta progression sera perdue et tu retourneras
        à la liste des sujets.
      </p>

      {/* Boutons */}
      <div className="flex flex-col gap-2">

        {/* Confirmer l'abandon */}
        <button
          onClick={onConfirmer}
          className="
            w-full py-3.5 rounded-2xl
            bg-red-500 hover:bg-red-600
            text-white font-bold text-sm
            transition-colors duration-200
            active:scale-[0.98]
          "
        >
          Oui, abandonner
        </button>

        {/* Continuer le quiz */}
        <button
          onClick={onAnnuler}
          className="
            w-full py-3.5 rounded-2xl
            bg-gray-100 hover:bg-gray-200
            text-gray-700 font-bold text-sm
            transition-colors duration-200
            active:scale-[0.98]
          "
        >
          Continuer l'épreuve
        </button>

      </div>

    </div>
  </div>
);

// ============================================================
// SOUS-COMPOSANT — Handle de redimensionnement
// ============================================================

/**
 * ResizeHandle
 *
 * Barre centrale draggable entre les deux panneaux.
 * Visible uniquement sur desktop.
 * Change de couleur au survol et pendant le drag.
 */
const ResizeHandle = () => (
  <PanelResizeHandle
    className="
      hidden sm:flex
      w-1.5 items-center justify-center
      bg-gray-100 hover:bg-blue-200
      transition-colors duration-200
      group relative
    "
  >
    {/* Indicateur visuel central */}
    <div
      className="
        absolute w-1 h-10 rounded-full
        bg-gray-300 group-hover:bg-blue-400
        group-data-[resize-handle-active]:bg-blue-500
        transition-colors duration-200
      "
    />
  </PanelResizeHandle>
);

// ============================================================
// COMPOSANT PRINCIPAL — QuizPage
// ============================================================

/**
 * QuizPage
 *
 * Page entière du quiz interactif — Étape 3 du parcours.
 * Route : /quiz/:epreuveId
 *
 * Architecture :
 * - Utilise useQuizV2 pour toute la logique
 * - Split screen redimensionnable sur desktop (react-resizable-panels)
 * - Onglets sur mobile (Énoncé / Questions)
 * - Modale de confirmation avant abandon
 * - Redirection vers ScorePage après soumission
 *
 * Structure :
 * ┌─────────────────────────────────────────────┐
 * │              QuizHeader (sticky)            │
 * ├──────────────────────┬──────────────────────┤
 * │                      │                      │
 * │    PanneauEnonce     │    PanneauQuiz       │
 * │    (gauche)          │    (droite)          │
 * │                      │                      │
 * │    Énoncé HTML       │    Question          │
 * │    + Images          │    + Options         │
 * │    scrollable        │    + Feedback        │
 * │                      │                      │
 * ├──────────────────────┴──────────────────────┤
 * │         OngletsMobile (mobile only)         │
 * └─────────────────────────────────────────────┘
 */
const QuizPage = () => {

  // ----------------------------------------------------------
  // ROUTER
  // ----------------------------------------------------------

  /**
   * Récupération de l'ID de l'épreuve depuis l'URL
   * Route attendue : /quiz/:epreuveId
   */
  const { epreuveId } = useParams<{ epreuveId: string }>();
  const navigate = useNavigate();

  /**
   * Conversion de l'ID en number
   * Si invalide → on redirige vers la page précédente
   */
  const epreuveIdNumber = epreuveId ? parseInt(epreuveId, 10) : null;

  // ----------------------------------------------------------
  // HOOK PRINCIPAL
  // ----------------------------------------------------------

  const {
    // Données
    epreuve,
    loading,
    error,
    exerciceCourant,
    questionCourante,
    exerciceActuelIdx,
    questionActuelleIdx,
    
    // État réponse
    reponseChoisie,
    estRepondue,
    feedback,
    // Navigation
    peutRevenirEnArriere,
    // Progression
    progression,
    // Résultat
    resultat,
    soumissionEnCours,
    // Actions
    choisirReponse,
    continuer,
    revenirEnArriere,
    abandonner,
  } = useQuizV2(epreuveIdNumber ?? 0);

  // ----------------------------------------------------------
  // STATE LOCAL
  // ----------------------------------------------------------

  /** Onglet actif sur mobile */
  const [ongletMobile, setOngletMobile] = useState<OngletMobile>('enonce');

  /** Modale de confirmation d'abandon visible ? */
  const [modaleAbandonVisible, setModaleAbandonVisible] =
    useState<boolean>(false);

  // ----------------------------------------------------------
  // EFFETS
  // ----------------------------------------------------------

  /**
   * Redirection vers la page de score après soumission
   * Le résultat est passé via le state de navigation
   * pour éviter un appel API supplémentaire
   */
  useEffect(() => {
    if (resultat) {
      navigate(`/quiz/${epreuveIdNumber}/score`, {
        state: {
          resultat,
          titreEpreuve: epreuve?.titre ?? '',
        },
        replace: true,
      });
    }
  }, [resultat, navigate, epreuveIdNumber, epreuve]);

  /**
   * Sur mobile : bascule automatiquement vers l'onglet Quiz
   * quand une nouvelle question apparaît
   * (après "Continuer" → on veut voir la nouvelle question)
   */
  useEffect(() => {
    if (estRepondue === false) {
      setOngletMobile('quiz');
    }
  }, [questionActuelleIdx, exerciceActuelIdx]);

  /**
   * Redirection si l'ID est invalide
   */
  useEffect(() => {
    if (!epreuveIdNumber || isNaN(epreuveIdNumber)) {
      navigate(-1);
    }
  }, [epreuveIdNumber, navigate]);

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  /**
   * Demande de confirmation avant abandon
   */
  const handleDemanderAbandon = useCallback(() => {
    setModaleAbandonVisible(true);
  }, []);

  /**
   * Confirmation de l'abandon
   * Réinitialise le hook et retourne à la page précédente
   */
  const handleConfirmerAbandon = useCallback(() => {
    abandonner();
    navigate(-1);
  }, [abandonner, navigate]);

  /**
   * Annulation de l'abandon
   */
  const handleAnnulerAbandon = useCallback(() => {
    setModaleAbandonVisible(false);
  }, []);

  // ----------------------------------------------------------
  // RENDER — ID invalide
  // ----------------------------------------------------------

  if (!epreuveIdNumber || isNaN(epreuveIdNumber)) {
    return null;
  }

  // ----------------------------------------------------------
  // RENDER — Chargement initial
  // ----------------------------------------------------------

  if (loading) {
    return (
      <div
        className="
          fixed inset-0 flex items-center justify-center
          bg-white
        "
      >
        <div className="text-center">
          <div
            className="
              w-14 h-14 border-4 border-blue-500
              border-t-transparent rounded-full
              animate-spin mx-auto mb-4
            "
          />
          <p className="text-gray-600 font-semibold text-sm">
            Chargement de l'épreuve...
          </p>
          <p className="text-gray-400 text-xs mt-1">
            Prépare-toi !
          </p>
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDER — Erreur
  // ----------------------------------------------------------

  if (error) {
    return (
      <div
        className="
          fixed inset-0 flex items-center justify-center
          bg-white p-6
        "
      >
        <div className="text-center max-w-sm">

          <div
            className="
              w-16 h-16 rounded-2xl bg-red-50
              flex items-center justify-center
              mx-auto mb-4
            "
          >
            <span className="text-3xl">⚠️</span>
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Impossible de charger l'épreuve
          </h2>
          <p className="text-gray-500 text-sm mb-6 leading-relaxed">
            {error}
          </p>

          <div className="flex flex-col gap-2">
            <button
              onClick={() => window.location.reload()}
              className="
                px-6 py-3 rounded-xl
                bg-blue-500 hover:bg-blue-600
                text-white font-semibold text-sm
                transition-colors duration-200
              "
            >
              Réessayer
            </button>
            <button
              onClick={() => navigate(-1)}
              className="
                px-6 py-3 rounded-xl
                bg-gray-100 hover:bg-gray-200
                text-gray-600 font-semibold text-sm
                transition-colors duration-200
              "
            >
              Retour
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // RENDER — Page principale
  // ----------------------------------------------------------

  return (
    <>
      {/* ════════════════════════════════════════════════════
          PAGE QUIZ — Plein écran fixe
          overflow hidden pour éviter le double scroll
      ════════════════════════════════════════════════════ */}
      <div
        className="
          fixed inset-0 flex flex-col
          bg-white overflow-hidden
        "
      >

        {/* ── HEADER (sticky) ── */}
        <QuizHeader
          titreEpreuve={epreuve?.titre ?? ''}
          progression={progression}
          onAbandonner={handleDemanderAbandon}
        />

        {/* ════════════════════════════════════════════════
            DESKTOP — Split screen redimensionnable
            Visible uniquement sur sm et plus
        ════════════════════════════════════════════════ */}
        <div className="hidden sm:flex flex-1 overflow-hidden">
          <PanelGroup
            direction="horizontal"
            className="w-full h-full"
          >

            {/* ── Panneau Gauche : Énoncé ── */}
            <Panel
              defaultSize={50}
              minSize={30}
              maxSize={70}
              className="overflow-hidden"
            >
              {exerciceCourant && (
                <PanneauEnonce
                  numeroExercice={exerciceActuelIdx + 1}
                  totalExercices={progression.totalExercices}
                  competence={exerciceCourant.competence}
                  consigne={exerciceCourant.consigne}
                  enonce={exerciceCourant.enonce}
                />
              )}
            </Panel>

            {/* ── Handle de redimensionnement ── */}
            <ResizeHandle />

            {/* ── Panneau Droit : Quiz ── */}
            <Panel
              defaultSize={50}
              minSize={30}
              maxSize={70}
              className="overflow-hidden"
            >
              <PanneauQuiz
                exerciceCourant={exerciceCourant}
                questionCourante={questionCourante}
                questionActuelleIdx={questionActuelleIdx}
                exerciceActuelIdx={exerciceActuelIdx}
                totalExercices={progression.totalExercices}
                reponseChoisie={reponseChoisie}
                estRepondue={estRepondue}
                feedback={feedback}
                peutRevenirEnArriere={peutRevenirEnArriere}
                soumissionEnCours={soumissionEnCours}
                onChoisirReponse={choisirReponse}
                onContinuer={continuer}
                onRetour={revenirEnArriere}
              />
            </Panel>

          </PanelGroup>
        </div>

        {/* ════════════════════════════════════════════════
            MOBILE — Onglets (Énoncé / Quiz)
            Visible uniquement sous sm
        ════════════════════════════════════════════════ */}
        <div className="flex sm:hidden flex-1 flex-col overflow-hidden">

          {/* Contenu de l'onglet actif */}
          <div className="flex-1 overflow-hidden">

            {/* Onglet Énoncé */}
            {ongletMobile === 'enonce' && exerciceCourant && (
              <PanneauEnonce
                numeroExercice={exerciceActuelIdx + 1}
                totalExercices={progression.totalExercices}
                competence={exerciceCourant.competence}
                consigne={exerciceCourant.consigne}
                enonce={exerciceCourant.enonce}
              />
            )}

            {/* Onglet Quiz */}
            {ongletMobile === 'quiz' && (
              <PanneauQuiz
                exerciceCourant={exerciceCourant}
                questionCourante={questionCourante}
                questionActuelleIdx={questionActuelleIdx}
                exerciceActuelIdx={exerciceActuelIdx}
                totalExercices={progression.totalExercices}
                reponseChoisie={reponseChoisie}
                estRepondue={estRepondue}
                feedback={feedback}
                peutRevenirEnArriere={peutRevenirEnArriere}
                soumissionEnCours={soumissionEnCours}
                onChoisirReponse={choisirReponse}
                onContinuer={continuer}
                onRetour={revenirEnArriere}
              />
            )}

          </div>

          {/* Barre d'onglets mobile */}
          <OngletsMobile
            ongletActif={ongletMobile}
            onChangerOnglet={setOngletMobile}
          />

        </div>

      </div>

      {/* ════════════════════════════════════════════════════
          MODALE DE CONFIRMATION D'ABANDON
          Rendue en dehors du layout pour le z-index
      ════════════════════════════════════════════════════ */}
      {modaleAbandonVisible && (
        <ModaleAbandon
          onConfirmer={handleConfirmerAbandon}
          onAnnuler={handleAnnulerAbandon}
        />
      )}

    </>
  );
};

export default QuizPage;