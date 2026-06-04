import { useState, useEffect, useCallback } from 'react';
import {
  trainingService,
  EpreuveInteractive,
  SoumissionReponse,
  ResultatSoumission,
} from '../api';

// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * Représente une position dans le parcours
 * (quel exercice + quelle question)
 */
interface PositionParcours {
  exerciceIdx: number;
  questionIdx: number;
}

/**
 * Représente une réponse enregistrée pour une question
 * avec son résultat (correcte ou non)
 */
interface ReponseEnregistree {
  questionId: number;
  reponseChoisie: string;
  estCorrecte: boolean;
}

/**
 * État du feedback affiché après une réponse
 */
interface EtatFeedback {
  visible: boolean;
  estCorrecte: boolean | null;
  explication: string | null;
  bonneReponse: string | null;
}

/**
 * Tout ce que retourne useQuizV2
 * Organisé en 4 catégories : données, navigation, actions, état
 */
export interface UseQuizV2Return {
  // ── Données de l'épreuve ──
  epreuve: EpreuveInteractive | null;
  loading: boolean;
  error: string | null;

  // ── Position actuelle dans le parcours ──
  exerciceActuelIdx: number;
  questionActuelleIdx: number;

  // ── Données de la question courante ──
  questionCourante: {
    id: number;
    texte: string;
    points: number;
    options: { id: number; texte: string; correcte: boolean; explication?: string }[];
  } | null;

  // ── Données de l'exercice courant ──
  exerciceCourant: {
    id: number;
    competence: string;
    enonce: string;
    consigne: string;
    nombreQuestions: number;
  } | null;

  // ── État de la réponse courante ──
  reponseChoisie: string | null;
  estRepondue: boolean;
  feedback: EtatFeedback;

  // ── Historique (pour retour arrière) ──
  peutRevenirEnArriere: boolean;

  // ── Progression globale ──
  progression: {
    questionsRepondues: number;
    totalQuestions: number;
    pourcentage: number;
    exerciceActuel: number;
    totalExercices: number;
  };

  // ── Résultat final (après soumission) ──
  resultat: ResultatSoumission | null;
  soumissionEnCours: boolean;

  // ── Actions ──
  choisirReponse: (texteOption: string) => void;
  continuer: () => void;
  revenirEnArriere: () => void;
  abandonner: () => void;
}

// ============================================================
// HOOK — useQuizV2
// ============================================================

/**
 * useQuizV2
 *
 * Hook de gestion du quiz interactif question par question.
 * Inspiré du comportement de Coddy.tech :
 * - Une seule question affichée à la fois
 * - Feedback immédiat après chaque réponse
 * - Navigation séquentielle avec possibilité de reculer
 * - Soumission automatique après la dernière question
 *
 * Différences avec useQuiz (v1) :
 * - Navigation question par question (vs toutes visibles)
 * - Feedback immédiat avec explication (vs feedback global)
 * - Historique de navigation (vs pas de retour arrière)
 * - Soumission auto (vs bouton manuel)
 *
 * @param epreuveId - ID de l'épreuve interactive à charger
 */
export const useQuizV2 = (epreuveId: number): UseQuizV2Return => {

  // ----------------------------------------------------------
  // STATE — Données de l'épreuve
  // ----------------------------------------------------------

  /** Données complètes de l'épreuve chargée depuis l'API */
  const [epreuve, setEpreuve] = useState<EpreuveInteractive | null>(null);

  /** Chargement initial de l'épreuve */
  const [loading, setLoading] = useState<boolean>(true);

  /** Erreur de chargement ou de soumission */
  const [error, setError] = useState<string | null>(null);

  // ----------------------------------------------------------
  // STATE — Navigation dans le parcours
  // ----------------------------------------------------------

  /**
   * Index de l'exercice actuellement affiché
   * Base 0 : 0 = premier exercice
   */
  const [exerciceActuelIdx, setExerciceActuelIdx] = useState<number>(0);

  /**
   * Index de la question actuellement affichée
   * dans l'exercice courant. Base 0.
   */
  const [questionActuelleIdx, setQuestionActuelleIdx] = useState<number>(0);

  /**
   * Historique de navigation — permet le retour arrière
   * Chaque entrée = une position visitée dans l'ordre
   * Ex: [{ex:0,q:0}, {ex:0,q:1}, {ex:1,q:0}]
   */
  const [historique, setHistorique] = useState<PositionParcours[]>([
    { exerciceIdx: 0, questionIdx: 0 },
  ]);

  /**
   * Position dans l'historique (pour naviguer en arrière)
   * Normalement = historique.length - 1 (fin de l'historique)
   * Diminue quand on recule
   */
  const [positionHistorique, setPosisionHistorique] = useState<number>(0);

  // ----------------------------------------------------------
  // STATE — Réponses
  // ----------------------------------------------------------

  /**
   * Texte de l'option choisie pour la question courante
   * null = pas encore répondu
   */
  const [reponseChoisie, setReponseChoisie] = useState<string | null>(null);

  /**
   * true si l'utilisateur a cliqué sur une option
   * déclenche l'affichage du feedback
   */
  const [estRepondue, setEstRepondue] = useState<boolean>(false);

  /**
   * Toutes les réponses accumulées pour la soumission finale
   * Map questionId → texte de la réponse choisie
   */
  const [toutesLesReponses, setToutesLesReponses] = useState<
    Record<number, string>
  >({});

  /**
   * Historique détaillé des réponses (pour affichage retour arrière)
   * Map questionId → ReponseEnregistree complète
   */
  const [reponsesEnregistrees, setReponsesEnregistrees] = useState<
    Record<number, ReponseEnregistree>
  >({});

  // ----------------------------------------------------------
  // STATE — Feedback
  // ----------------------------------------------------------

  /**
   * État complet du feedback affiché après une réponse
   */
  const [feedback, setFeedback] = useState<EtatFeedback>({
    visible: false,
    estCorrecte: null,
    explication: null,
    bonneReponse: null,
  });

  // ----------------------------------------------------------
  // STATE — Soumission
  // ----------------------------------------------------------

  /** Résultat retourné par l'API après soumission */
  const [resultat, setResultat] = useState<ResultatSoumission | null>(null);

  /** true pendant l'appel API de soumission */
  const [soumissionEnCours, setSoumissionEnCours] = useState<boolean>(false);

  // ----------------------------------------------------------
  // EFFET — Chargement de l'épreuve au montage
  // ----------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const chargerEpreuve = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await trainingService.getEpreuveInteractive(epreuveId);

        if (!isMounted) return;

        // Vérification que l'épreuve contient des exercices
        if (!data.exercices || data.exercices.length === 0) {
          setError("Cette épreuve ne contient aucun exercice.");
          return;
        }

        setEpreuve(data);

      } catch (err) {
        if (!isMounted) return;
        console.error('useQuizV2 — Erreur chargement épreuve:', err);
        setError("Impossible de charger l'épreuve. Réessaie plus tard.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    chargerEpreuve();

    return () => {
      isMounted = false;
    };
  }, [epreuveId]);

  // ----------------------------------------------------------
  // DONNÉES DÉRIVÉES
  // ----------------------------------------------------------

  /** Liste des exercices de l'épreuve */
  const exercices = epreuve?.exercices ?? [];

  /** Exercice actuellement affiché */
  const exerciceCourantData = exercices[exerciceActuelIdx] ?? null;

  /** Question actuellement affichée */
  const questionCouranteData =
    exerciceCourantData?.questions[questionActuelleIdx] ?? null;

  /**
   * Calcul du total de questions sur tous les exercices
   */
  const totalQuestions = exercices.reduce(
    (sum, ex) => sum + ex.questions.length,
    0
  );

  /**
   * Calcul du nombre de questions déjà répondues
   */
  const questionsRepondues = Object.keys(toutesLesReponses).length;

  /**
   * Pourcentage de progression global
   */
  const pourcentageProgression =
    totalQuestions > 0
      ? Math.round((questionsRepondues / totalQuestions) * 100)
      : 0;

  /**
   * L'utilisateur peut-il reculer ?
   * OUI si : il y a un historique avant la position actuelle
   *          ET la question courante est déjà répondue
   */
  const peutRevenirEnArriere =
    positionHistorique > 0 && estRepondue;

  // ----------------------------------------------------------
  // HELPERS INTERNES
  // ----------------------------------------------------------

  /**
   * Réinitialise l'état de la question courante
   * Appelé quand on avance OU quand on recule
   */
  const reinitialiserEtatQuestion = useCallback(
    (questionId: number, reponseExistante?: ReponseEnregistree) => {

      if (reponseExistante) {
        // Mode lecture seule — question déjà répondue
        // On affiche la réponse et le feedback sans permettre
        // de modifier
        setReponseChoisie(reponseExistante.reponseChoisie);
        setEstRepondue(true);
        setFeedback({
          visible: true,
          estCorrecte: reponseExistante.estCorrecte,
          explication: null, // Sera récupéré depuis les options
          bonneReponse: null,
        });
      } else {
        // Mode normal — question non encore répondue
        setReponseChoisie(null);
        setEstRepondue(false);
        setFeedback({
          visible: false,
          estCorrecte: null,
          explication: null,
          bonneReponse: null,
        });
      }
    },
    []
  );

  /**
   * Soumission automatique de toutes les réponses à l'API
   * Appelée quand la dernière question est répondue
   */
   const soumettre = useCallback(
    async (reponsesFinales: Record<number, string>) => {
      try {
        setSoumissionEnCours(true);

        // ── AJOUT ICI ──
        // Vérification du token avant toute soumission
        // Supporte les deux types d'utilisateurs :
        // élève (students_access_token) et enseignant (teacher_access_token)
        const token =
          localStorage.getItem('students_access_token') ||
          localStorage.getItem('teacher_access_token');

        if (!token) {
          setError('Vous devez être connecté pour soumettre l\'épreuve');
          setSoumissionEnCours(false);
          return;
        }
        // ── FIN AJOUT ──

        // Transformation du Record en tableau SoumissionReponse[]
        const reponsesArray: SoumissionReponse[] = Object.entries(
          reponsesFinales
        ).map(([questionId, reponse]) => ({
          question: parseInt(questionId, 10),
          reponse_donnee: reponse,
        }));

        const result = await trainingService.soumettreReponses(
          epreuveId,
          reponsesArray
        );

        setResultat(result);

      } catch (err: any) {
        console.error('useQuizV2 — Erreur soumission:', err);

        if (err.response?.status === 401) {
          setError('Session expirée. Veuillez vous reconnecter.');
        } else {
          setError(
            'Erreur lors de la soumission : ' +
            (err.response?.data?.error || err.message)
          );
        }
      } finally {
        setSoumissionEnCours(false);
      }
    },
    [epreuveId]
  );

  // ----------------------------------------------------------
  // ACTION — Choisir une réponse
  // ----------------------------------------------------------

  /**
   * choisirReponse
   *
   * Appelée quand l'utilisateur clique sur une option.
   * - Enregistre la réponse
   * - Calcule si c'est correct
   * - Affiche le feedback immédiat
   * - Stocke dans l'historique des réponses
   *
   * Ne fait rien si la question est déjà répondue (lecture seule)
   *
   * @param texteOption - Texte de l'option cliquée
   */
  const choisirReponse = useCallback(
    (texteOption: string) => {

      // Garde : on ne peut pas rechoisir si déjà répondu
      if (estRepondue || !questionCouranteData) return;

      // Recherche de l'option dans les données
      const optionChoisie = questionCouranteData.options.find(
        (o) => o.texte_option === texteOption
      );

      if (!optionChoisie) return;

      const estCorrecte = optionChoisie.correcte;

      // Recherche de la bonne réponse pour l'afficher dans le feedback
      const bonneOption = questionCouranteData.options.find(
        (o) => o.correcte
      );

      // Mise à jour de l'état de réponse
      setReponseChoisie(texteOption);
      setEstRepondue(true);

      // Affichage du feedback
      setFeedback({
        visible: true,
        estCorrecte,
        explication: optionChoisie.explication ?? bonneOption?.explication ?? null,
        bonneReponse: estCorrecte ? null : bonneOption?.texte_option ?? null,
      });

      // Enregistrement de la réponse dans l'accumulateur global
      const questionId = questionCouranteData.id;

      setToutesLesReponses((prev) => ({
        ...prev,
        [questionId]: texteOption,
      }));

      // Enregistrement dans l'historique détaillé (pour retour arrière)
      setReponsesEnregistrees((prev) => ({
        ...prev,
        [questionId]: {
          questionId,
          reponseChoisie: texteOption,
          estCorrecte,
        },
      }));
    },
    [estRepondue, questionCouranteData]
  );

  // ----------------------------------------------------------
  // ACTION — Continuer (avancer dans le parcours)
  // ----------------------------------------------------------

  /**
   * continuer
   *
   * Appelée quand l'utilisateur clique sur "Continuer"
   * après avoir répondu à une question.
   *
   * Logique de navigation :
   * 1. Y a-t-il une question suivante dans l'exercice courant ?
   *    → OUI : on avance à cette question
   * 2. Y a-t-il un exercice suivant ?
   *    → OUI : on passe au premier question du prochain exercice
   * 3. C'était la dernière question du dernier exercice ?
   *    → On soumet automatiquement
   */
  const continuer = useCallback(() => {

    // Garde : on doit avoir répondu avant de continuer
    if (!estRepondue || !exerciceCourantData) return;

    const questionsExerciceCourant = exerciceCourantData.questions;
    const estDerniereQuestionExercice =
      questionActuelleIdx >= questionsExerciceCourant.length - 1;
    const estDernierExercice =
      exerciceActuelIdx >= exercices.length - 1;

    if (!estDerniereQuestionExercice) {
      // ── CAS 1 : Question suivante dans le même exercice ──
      const nouvelleQuestionIdx = questionActuelleIdx + 1;
      const nouvellePosition: PositionParcours = {
        exerciceIdx: exerciceActuelIdx,
        questionIdx: nouvelleQuestionIdx,
      };

      setQuestionActuelleIdx(nouvelleQuestionIdx);

      // Ajout dans l'historique
      setHistorique((prev) => [...prev, nouvellePosition]);
      setPosisionHistorique((prev) => prev + 1);

      // Réinitialisation pour la nouvelle question
      const nouvelleQuestion =
        exerciceCourantData.questions[nouvelleQuestionIdx];
      const reponseExistante = nouvelleQuestion
        ? reponsesEnregistrees[nouvelleQuestion.id]
        : undefined;

      reinitialiserEtatQuestion(
        nouvelleQuestion?.id ?? 0,
        reponseExistante
      );

    } else if (!estDernierExercice) {
      // ── CAS 2 : Premier question du prochain exercice ──
      const nouvelExerciceIdx = exerciceActuelIdx + 1;
      const nouvellePosition: PositionParcours = {
        exerciceIdx: nouvelExerciceIdx,
        questionIdx: 0,
      };

      setExerciceActuelIdx(nouvelExerciceIdx);
      setQuestionActuelleIdx(0);

      // Ajout dans l'historique
      setHistorique((prev) => [...prev, nouvellePosition]);
      setPosisionHistorique((prev) => prev + 1);

      // Réinitialisation pour la première question du nouvel exercice
      const premierQuestion = exercices[nouvelExerciceIdx]?.questions[0];
      const reponseExistante = premierQuestion
        ? reponsesEnregistrees[premierQuestion.id]
        : undefined;

      reinitialiserEtatQuestion(
        premierQuestion?.id ?? 0,
        reponseExistante
      );

    } else {
      // ── CAS 3 : Dernière question du dernier exercice ──
      // Soumission automatique avec toutes les réponses accumulées
      // On inclut la réponse de la question courante qui vient
      // d'être enregistrée dans toutesLesReponses via choisirReponse()
      soumettre(toutesLesReponses);
    }

  }, [
    estRepondue,
    exerciceCourantData,
    questionActuelleIdx,
    exerciceActuelIdx,
    exercices,
    reponsesEnregistrees,
    toutesLesReponses,
    reinitialiserEtatQuestion,
    soumettre,
  ]);

  // ----------------------------------------------------------
  // ACTION — Revenir en arrière
  // ----------------------------------------------------------

  /**
   * revenirEnArriere
   *
   * Recule d'une position dans l'historique de navigation.
   * La question précédente est affichée en MODE LECTURE SEULE :
   * - La réponse déjà donnée est visible
   * - Le feedback est affiché
   * - L'utilisateur NE PEUT PAS modifier sa réponse
   *
   * Conditions pour reculer :
   * - Il doit y avoir un historique avant la position actuelle
   * - La question courante doit être déjà répondue
   */
  const revenirEnArriere = useCallback(() => {

    // Garde : vérification de la possibilité de reculer
    if (!peutRevenirEnArriere) return;

    const nouvellePosition = positionHistorique - 1;
    const positionCible = historique[nouvellePosition];

    if (!positionCible) return;

    // Navigation vers la position précédente
    setPosisionHistorique(nouvellePosition);
    setExerciceActuelIdx(positionCible.exerciceIdx);
    setQuestionActuelleIdx(positionCible.questionIdx);

    // Chargement de la réponse déjà donnée pour cette question
    const questionCible =
      exercices[positionCible.exerciceIdx]
        ?.questions[positionCible.questionIdx];

    if (questionCible) {
      const reponseExistante = reponsesEnregistrees[questionCible.id];
      reinitialiserEtatQuestion(questionCible.id, reponseExistante);
    }

  }, [
    peutRevenirEnArriere,
    positionHistorique,
    historique,
    exercices,
    reponsesEnregistrees,
    reinitialiserEtatQuestion,
  ]);

  // ----------------------------------------------------------
  // ACTION — Abandonner
  // ----------------------------------------------------------

  /**
   * abandonner
   *
   * Réinitialise complètement le hook.
   * Le composant parent est responsable de la navigation
   * (retour à l'étape 2 par exemple).
   */
  const abandonner = useCallback(() => {
    setExerciceActuelIdx(0);
    setQuestionActuelleIdx(0);
    setHistorique([{ exerciceIdx: 0, questionIdx: 0 }]);
    setPosisionHistorique(0);
    setReponseChoisie(null);
    setEstRepondue(false);
    setToutesLesReponses({});
    setReponsesEnregistrees({});
    setFeedback({
      visible: false,
      estCorrecte: null,
      explication: null,
      bonneReponse: null,
    });
    setResultat(null);
  }, []);

  // ----------------------------------------------------------
  // EFFET — Gestion de la navigation "avancer" dans l'historique
  // Quand on a reculé puis qu'on re-clique Continuer
  // on doit avancer dans l'historique existant
  // sans créer de doublon
  // ----------------------------------------------------------

  /**
   * Vérifie si la position suivante existe déjà dans l'historique
   * Si oui on navigue dans l'historique existant
   * Si non on crée une nouvelle entrée (géré dans continuer())
   */
  const positionSuivanteExisteDansHistorique =
    positionHistorique < historique.length - 1;

  // ----------------------------------------------------------
  // CONSTRUCTION DES DONNÉES EXPOSÉES
  // ----------------------------------------------------------

  /**
   * Données de la question courante formatées pour les composants
   */
  const questionCourante = questionCouranteData
    ? {
        id: questionCouranteData.id,
        texte: questionCouranteData.texte_question,
        points: questionCouranteData.points,
        options: questionCouranteData.options.map((o) => ({
          id: o.id,
          texte: o.texte_option,
          correcte: o.correcte,
          explication: o.explication,
        })),
      }
    : null;

  /**
   * Données de l'exercice courant formatées pour les composants
   */
  const exerciceCourant = exerciceCourantData
    ? {
        id: exerciceCourantData.id,
        competence: exerciceCourantData.competence,
        enonce: exerciceCourantData.enonce,
        consigne: exerciceCourantData.consigne,
        nombreQuestions: exerciceCourantData.questions.length,
      }
    : null;

  // ----------------------------------------------------------
  // RETOUR DU HOOK
  // ----------------------------------------------------------

  return {
    // ── Données de l'épreuve ──
    epreuve,
    loading,
    error,

    // ── Position actuelle ──
    exerciceActuelIdx,
    questionActuelleIdx,

    // ── Données formatées ──
    questionCourante,
    exerciceCourant,

    // ── État de la réponse courante ──
    reponseChoisie,
    estRepondue,
    feedback,

    // ── Navigation ──
    peutRevenirEnArriere,

    // ── Progression globale ──
    progression: {
      questionsRepondues,
      totalQuestions,
      pourcentage: pourcentageProgression,
      exerciceActuel: exerciceActuelIdx + 1,
      totalExercices: exercices.length,
    },

    // ── Résultat final ──
    resultat,
    soumissionEnCours,

    // ── Actions ──
    choisirReponse,
    continuer,
    revenirEnArriere,
    abandonner,
  };
};