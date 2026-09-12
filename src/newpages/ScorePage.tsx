import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ResultatSoumission } from '../api';

// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * State passé via navigate() depuis QuizPage
 */
interface ScorePageLocationState {
  resultat: ResultatSoumission;
  titreEpreuve: string;
}

// ============================================================
// UTILITAIRES
// ============================================================

/**
 * calculerNoteSur20
 *
 * Convertit un pourcentage en note sur 20
 * Arrondi au quart le plus proche (0.25, 0.50, 0.75)
 *
 * Exemples :
 * 75.5% → 15.1 → 15.25/20
 * 36.4% → 7.28 → 7.25/20
 * 100%  → 20/20
 * 50%   → 10/20
 */
const calculerNoteSur20 = (pourcentage: number): number => {
  const noteExacte = (pourcentage / 100) * 20;
  // Arrondi au quart le plus proche
  return Math.round(noteExacte * 4) / 4;
};

/**
 * formaterNote
 *
 * Formate la note pour l'affichage
 * Supprime le .0 si la note est entière
 * Garde .25, .5, .75 si nécessaire
 *
 * Exemples :
 * 15.0  → "15"
 * 15.25 → "15.25"
 * 15.5  → "15.5"
 * 15.75 → "15.75"
 */
const formaterNote = (note: number): string => {
  if (Number.isInteger(note)) return String(note);
  return note.toString();
};

/**
 * getMentionNote
 *
 * Retourne la mention, le message et la couleur
 * selon la note obtenue sur 20
 */
const getMentionNote = (note: number): {
  mention: string;
  message: string;
  couleur: 'vert' | 'orange' | 'rouge';
  icone: string;
} => {
  if (note === 20) return {
    mention: 'Parfait !',
    message: 'Résultat exceptionnel ! Tu as tout bon !',
    couleur: 'vert',
    icone: '🏆',
  };
  if (note >= 16) return {
    mention: 'Excellent !',
    message: 'Excellent travail ! Continue comme ça !',
    couleur: 'vert',
    icone: '🌟',
  };
  if (note >= 14) return {
    mention: 'Très Bien',
    message: 'Très bien ! Tu maîtrises bien le sujet !',
    couleur: 'vert',
    icone: '👏',
  };
  if (note >= 12) return {
    mention: 'Bien',
    message: 'Bien ! Encore quelques efforts et tu y es !',
    couleur: 'orange',
    icone: '💪',
  };
  if (note >= 10) return {
    mention: 'Passable',
    message: 'Passable. Tu peux faire mieux avec un peu de révision !',
    couleur: 'orange',
    icone: '📚',
  };
  if (note >= 8) return {
    mention: 'Insuffisant',
    message: 'Insuffisant. Revois ce chapitre attentivement !',
    couleur: 'rouge',
    icone: '🔄',
  };
  return {
    mention: 'En difficulté',
    message: 'En difficulté. N\'hésite pas à demander de l\'aide !',
    couleur: 'rouge',
    icone: '💡',
  };
};

/**
 * getStylesCouleur
 *
 * Retourne les classes Tailwind selon la couleur de la note
 */
const getStylesCouleur = (couleur: 'vert' | 'orange' | 'rouge') => {
  switch (couleur) {
    case 'vert':
      return {
        note: 'text-green-600',
        badge: 'bg-green-100 text-green-700 border-green-200',
        barre: 'bg-green-500',
        boutonRejouer: 'bg-green-500 hover:bg-green-600 shadow-green-200',
      };
    case 'orange':
      return {
        note: 'text-orange-500',
        badge: 'bg-orange-100 text-orange-700 border-orange-200',
        barre: 'bg-orange-500',
        boutonRejouer: 'bg-orange-500 hover:bg-orange-600 shadow-orange-200',
      };
    case 'rouge':
      return {
        note: 'text-red-500',
        badge: 'bg-red-100 text-red-700 border-red-200',
        barre: 'bg-red-500',
        boutonRejouer: 'bg-red-500 hover:bg-red-600 shadow-red-200',
      };
  }
};

// ============================================================
// SOUS-COMPOSANT — Ligne décorative style cahier
// ============================================================

/**
 * LignesCahier
 *
 * Lignes horizontales décoratives style feuille d'examen
 * affichées en arrière-plan de la carte de note
 */
const LignesCahier = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
    {Array.from({ length: 12 }).map((_, i) => (
      <div
        key={i}
        className="absolute w-full border-b border-blue-100/60"
        style={{ top: `${(i + 1) * 36}px` }}
      />
    ))}
    {/* Marge rouge verticale style cahier */}
    <div className="absolute left-14 top-0 bottom-0 border-l-2 border-red-200/40" />
  </div>
);

// ============================================================
// SOUS-COMPOSANT — Stat item
// ============================================================

interface StatItemProps {
  label: string;
  valeur: string;
  icone: string;
}

/**
 * StatItem
 * Ligne de statistique dans la carte de note
 */
const StatItem = ({ label, valeur, icone }: StatItemProps) => (
  <div className="flex items-center justify-between py-2">
    <div className="flex items-center gap-2">
      <span className="text-base">{icone}</span>
      <span className="text-sm text-gray-500 font-medium">{label}</span>
    </div>
    <span className="text-sm font-bold text-gray-700">{valeur}</span>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL — ScorePage
// ============================================================

/**
 * ScorePage
 *
 * Page de résultats finale — Étape 4 du parcours d'entraînement.
 * Route : /quiz/:epreuveId/score
 *
 * Reçoit les données via le state de navigation (useLocation)
 * transmis par QuizPage après la soumission.
 *
 * Affiche :
 * - Une carte style feuille d'examen avec la note sur 20
 * - La précision et les statistiques de l'épreuve
 * - Un message personnalisé selon la note
 * - Deux boutons : rejouer et retour à la liste
 *
 * Fond : bleu ciel doux
 */
const ScorePage = () => {

  // ----------------------------------------------------------
  // ROUTER
  // ----------------------------------------------------------

  const { epreuveId } = useParams<{ epreuveId: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  // ----------------------------------------------------------
  // RÉCUPÉRATION DES DONNÉES
  // Transmises via navigate state depuis QuizPage
  // ----------------------------------------------------------

  const state = location.state as ScorePageLocationState | null;
  const resultat = state?.resultat ?? null;
  const titreEpreuve = state?.titreEpreuve ?? 'Épreuve';

  // ----------------------------------------------------------
  // EFFET — Redirection si pas de résultat
  // Empêche l'accès direct à la page sans données
  // ----------------------------------------------------------

  useEffect(() => {
    if (!resultat) {
      navigate(-1);
    }
  }, [resultat, navigate]);

  // ----------------------------------------------------------
  // RENDER — Pas de données
  // ----------------------------------------------------------

  if (!resultat) return null;

  // ----------------------------------------------------------
  // CALCULS
  // ----------------------------------------------------------

  const note = calculerNoteSur20(resultat.resultat.pourcentage);
  const noteFormatee = formaterNote(note);
  const mention = getMentionNote(note);
  const styles = getStylesCouleur(mention.couleur);

  /** Pourcentage de la barre de progression (0 → 100) */
  const pourcentageBarre = resultat.resultat.pourcentage;

  // ----------------------------------------------------------
  // RENDER — Page principale
  // ----------------------------------------------------------

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50
        flex flex-col items-center justify-center
        px-4 py-12
      "
    >

      {/* ════════════════════════════════════════════════════
          CONTENU PRINCIPAL
      ════════════════════════════════════════════════════ */}
      <div className="w-full max-w-lg">

        {/* ── Icône + Titre ── */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center mb-8"
        >

          {/* Icône animée */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, type: 'spring' }}
            className="text-6xl mb-4"
          >
            {mention.icone}
          </motion.div>

          {/* Titre épreuve */}
          <p className="text-sm text-blue-400 font-semibold uppercase tracking-widest mb-1">
            Résultats de l'épreuve
          </p>
          <h1 className="text-xl font-bold text-gray-800 leading-snug">
            {titreEpreuve}
          </h1>

        </motion.div>

        {/* ════════════════════════════════════════════════════
            CARTE STYLE FEUILLE D'EXAMEN
        ════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="
            relative bg-white rounded-3xl
            shadow-xl shadow-blue-100/60
            border border-blue-100
            overflow-hidden
            mb-6
          "
        >

          {/* Lignes style cahier en arrière-plan */}
          <LignesCahier />

          {/* Contenu de la carte */}
          <div className="relative z-10 p-8">

            {/* ── Zone Note Principale ── */}
            <div className="text-center mb-8">

              {/* Label */}
              <p className="text-xs font-bold text-gray-400 uppercase
                tracking-widest mb-4"
              >
                Note obtenue
              </p>

              {/* Badge mention */}
              <div className="flex justify-center mb-4">
                <span
                  className={`
                    px-4 py-1.5 rounded-full text-xs font-bold
                    border uppercase tracking-wider
                    ${styles.badge}
                  `}
                >
                  {mention.mention}
                </span>
              </div>

              {/* ── NOTE PRINCIPALE (style feuille d'examen) ── */}
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4, type: 'spring' }}
                className="
                  relative inline-flex items-baseline
                  justify-center gap-2
                  bg-gray-50 rounded-2xl
                  border-2 border-gray-100
                  px-10 py-6 mb-4
                "
              >
                {/* Note */}
                <span
                  className={`
                    text-7xl font-black tracking-tight
                    leading-none
                    ${styles.note}
                  `}
                >
                  {noteFormatee}
                </span>

                {/* Séparateur + Total */}
                <div className="flex flex-col items-start">
                  <div className="w-8 h-0.5 bg-gray-400 mb-1 rotate-[-20deg]" />
                  <span className="text-2xl font-bold text-gray-400">
                    20
                  </span>
                </div>

              </motion.div>

              {/* Barre de progression colorée */}
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden mx-4">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pourcentageBarre}%` }}
                  transition={{ duration: 0.8, delay: 0.6, ease: 'easeOut' }}
                  className={`h-full rounded-full ${styles.barre}`}
                />
              </div>

              {/* Pourcentage */}
              <p className="text-xs text-gray-400 font-medium mt-2">
                {Math.round(pourcentageBarre)}% de réussite
              </p>

            </div>

            {/* ── Séparateur ── */}
            <div className="h-px bg-gradient-to-r from-transparent
              via-gray-200 to-transparent mb-6"
            />

            {/* ── Statistiques ── */}
            <div className="space-y-1 mb-6">
              <StatItem
                icone=""
                label="Bonnes réponses"
                valeur={`${resultat.resultat.bonnes_reponses} / ${resultat.total_questions}`}
              />
              <StatItem
                icone=""
                label="Questions répondues"
                valeur={`${resultat.resultat.reponses_fournies} / ${resultat.total_questions}`}
              />
              <StatItem
                icone=""
                label="Exercices traités"
                valeur={`${resultat.total_exercices}`}
              />
            </div>

            {/* ── Séparateur ── */}
            <div className="h-px bg-gradient-to-r from-transparent
              via-gray-200 to-transparent mb-6"
            />

            {/* ── Message personnalisé ── */}
            <div
              className={`
                flex items-start gap-3 p-4 rounded-2xl
                ${mention.couleur === 'vert'
                  ? 'bg-green-50 border border-green-100'
                  : mention.couleur === 'orange'
                    ? 'bg-orange-50 border border-orange-100'
                    : 'bg-red-50 border border-red-100'
                }
              `}
            >
              <span className="text-lg flex-shrink-0">💬</span>
              <p
                className={`
                  text-sm font-medium leading-relaxed
                  ${mention.couleur === 'vert'
                    ? 'text-green-700'
                    : mention.couleur === 'orange'
                      ? 'text-orange-700'
                      : 'text-red-700'
                  }
                `}
              >
                {mention.message}
              </p>
            </div>

            {/* ── Commentaire Django (si différent du message) ── */}
            {resultat.resultat.commentaire && (
              <p className="text-xs text-gray-400 text-center mt-3 italic">
                {resultat.resultat.commentaire}
              </p>
            )}

          </div>

        </motion.div>

        {/* ════════════════════════════════════════════════════
            BOUTONS D'ACTION
        ════════════════════════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.7 }}
          className="flex flex-col gap-3"
        >

          {/* Bouton Rejouer */}
          <button
            onClick={() => navigate(`/quiz/${epreuveId}`)}
            className={`
              w-full py-4 rounded-2xl
              text-white font-bold text-sm tracking-wide
              shadow-lg transition-all duration-200
              active:scale-[0.98]
              flex items-center justify-center gap-2
              ${styles.boutonRejouer}
            `}
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
                d="M4 4v5h.582m15.356 2A8.001 8.001 
                  0 004.582 9m0 0H9m11 11v-5h-.581m0 
                  0a8.003 8.003 0 01-15.357-2m15.357 
                  2H15"
              />
            </svg>
            Rejouer ce sujet
          </button>

          {/* Bouton Voir d'autres sujets */}
          <button
            onClick={() => navigate(-2)}
            className="
              w-full py-4 rounded-2xl
              bg-white border-2 border-blue-200
              hover:border-blue-300 hover:bg-blue-50
              text-blue-600 font-bold text-sm tracking-wide
              transition-all duration-200
              active:scale-[0.98]
              flex items-center justify-center gap-2
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Voir d'autres sujets
          </button>

        </motion.div>

      </div>

    </div>
  );
};

export default ScorePage;