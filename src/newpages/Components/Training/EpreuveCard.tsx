import { useState } from 'react';
import { Epreuve } from '@/api';
import PdfViewerModal from './PdfViewerModal';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface EpreuveCardProps {
  // Données complètes de l'épreuve
  epreuve: Epreuve;
  // Callback quand l'utilisateur clique "Traiter le sujet"
  onTraiter: (epreuveId: number) => void;
}

// ============================================================
// UTILITAIRES
// ============================================================

/**
 * Génère une couleur de placeholder cohérente
 * basée sur le nom de la matière.
 * La même matière aura toujours la même couleur.
 */
const getCouleurMatiere = (nomMatiere: string): string => {
  const couleurs: Record<string, string> = {
    mathematiques:  'from-blue-600 to-blue-800',
    maths:          'from-blue-600 to-blue-800',
    physique:       'from-violet-600 to-violet-800',
    chimie:         'from-purple-600 to-purple-800',
    svt:            'from-green-600 to-green-800',
    biologie:       'from-emerald-600 to-emerald-800',
    histoire:       'from-orange-600 to-orange-800',
    geographie:     'from-amber-600 to-amber-800',
    français:       'from-rose-600 to-rose-800',
    francais:       'from-rose-600 to-rose-800',
    philosophie:    'from-indigo-600 to-indigo-800',
    anglais:        'from-cyan-600 to-cyan-800',
    espagnol:       'from-red-600 to-red-800',
    allemand:       'from-yellow-600 to-yellow-800',
    informatique:   'from-teal-600 to-teal-800',
  };

  // Normalisation : minuscules + suppression des accents
  const nomNormalise = nomMatiere
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  // Recherche par inclusion du nom normalisé
  const cle = Object.keys(couleurs).find((k) =>
    nomNormalise.includes(k)
  );

  // Fallback : gris si matière non reconnue
  return cle ? couleurs[cle] : 'from-gray-600 to-gray-800';
};

/**
 * Formate la durée pour l'affichage
 * Ex: "02:00:00" → "2h00"  |  "01:30:00" → "1h30"
 */
const formatDuree = (duree: string): string => {
  try {
    const parties = duree.split(':');
    if (parties.length < 2) return duree;
    const heures = parseInt(parties[0], 10);
    const minutes = parseInt(parties[1], 10);
    if (heures === 0) return `${minutes}min`;
    if (minutes === 0) return `${heures}h`;
    return `${heures}h${String(minutes).padStart(2, '0')}`;
  } catch {
    return duree;
  }
};

// ============================================================
// SOUS-COMPOSANT — Badge
// ============================================================

interface BadgeProps {
  icone: string;
  texte: string;
  variante?: 'default' | 'type' | 'annee';
}

/**
 * Badge
 * Petit pill d'information affiché en bas de la carte.
 * Utilisé pour : type, classe, matière, année, durée.
 */
const Badge = ({ icone, texte, variante = 'default' }: BadgeProps) => {
  const styles = {
    default: 'bg-gray-800 text-gray-300',
    type:    'bg-blue-900/60 text-blue-300',
    annee:   'bg-gray-700 text-gray-400',
  };

  return (
    <span
      className={`
        inline-flex items-center gap-1 px-2 py-0.5
        rounded-full text-[10px] font-medium
        ${styles[variante]}
      `}
    >
      <span className="text-[9px]">{icone}</span>
      {texte}
    </span>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL — EpreuveCard
// ============================================================

/**
 * EpreuveCard
 *
 * Carte compacte représentant une épreuve dans la grille
 * de résultats. Inspirée visuellement de la référence
 * (fond sombre, image haute, badges en bas).
 *
 * Contient :
 * - Placeholder coloré (couleur par matière) + icône PDF
 * - Titre + description courte
 * - Badges : type | classe | matière | année | durée
 * - Bouton "Voir le PDF"      → ouvre PdfViewerModal
 * - Bouton "Traiter le sujet" → déclenche onTraiter()
 */
const EpreuveCard = ({ epreuve, onTraiter }: EpreuveCardProps) => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  /** Contrôle l'affichage de la visionneuse PDF */
  const [pdfOuvert, setPdfOuvert] = useState<boolean>(false);

  // ----------------------------------------------------------
  // DONNÉES DÉRIVÉES
  // ----------------------------------------------------------

  const couleurGradient = getCouleurMatiere(epreuve.matiere.nom);
  const dureeFormatee   = formatDuree(epreuve.duree);

  /**
   * URL publique du PDF via l'endpoint Django
   */
  const urlPdf = `http://192.168.100.12:8000/api/TrainingAndEvaluation/epreuve/${epreuve.id}/pdf/`;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <>
      {/*CARTE*/}
      <div
        className="
          group relative bg-gray-900 rounded-2xl overflow-hidden
          flex flex-col
          border border-gray-800
          hover:border-gray-600
          transition-all duration-300
          hover:shadow-xl hover:shadow-black/40
          hover:-translate-y-0.5
        "
      >

        {/* ── ZONE HAUTE : Placeholder coloré ── */}
        <div
          className={`
            relative h-36 bg-gradient-to-br ${couleurGradient}
            flex flex-col items-center justify-center gap-2
            overflow-hidden flex-shrink-0
          `}
        >
          {/* Cercles décoratifs en arrière-plan */}
          <div className="absolute -top-4 -right-4 w-24 h-24 
            rounded-full bg-white/5" 
          />
          <div className="absolute -bottom-6 -left-6 w-32 h-32 
            rounded-full bg-black/10" 
          />

          {/* Icône PDF */}
          <div className="relative z-10 w-12 h-12 rounded-xl 
            bg-white/15 backdrop-blur-sm
            flex items-center justify-center
            border border-white/20
          ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-6 h-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 
                  00-3.375-3.375h-1.5A1.125 1.125 0 
                  0113.5 7.125v-1.5a3.375 3.375 0 
                  00-3.375-3.375H8.25m0 12.75h7.5m-7.5 
                  3H12M10.5 2.25H5.625c-.621 0-1.125.504
                  -1.125 1.125v17.25c0 .621.504 1.125 
                  1.125 1.125h12.75c.621 0 1.125-.504 
                  1.125-1.125V11.25a9 9 0 00-9-9z"
              />
            </svg>
          </div>

          {/* Année en overlay */}
          <span className="relative z-10 text-white/70 
            text-xs font-semibold tracking-widest uppercase"
          >
            {epreuve.annee}
          </span>

          {/* Overlay sombre au hover pour les boutons */}
          <div className="
            absolute inset-0 bg-black/0 group-hover:bg-black/30
            transition-all duration-300 z-20
            flex items-center justify-center gap-2
            opacity-0 group-hover:opacity-100
          ">
            {/* Bouton aperçu rapide PDF */}
            <button
              onClick={() => setPdfOuvert(true)}
              aria-label="Aperçu rapide du PDF"
              className="
                w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30
                backdrop-blur-sm border border-white/30
                flex items-center justify-center
                text-white transition-all duration-200
                hover:scale-110
              "
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
                  d="M2.458 12C3.732 7.943 7.523 5 
                    12 5c4.478 0 8.268 2.943 9.542 
                    7-1.274 4.057-5.064 7-9.542 
                    7-4.477 0-8.268-2.943-9.542-7z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* ── CORPS DE LA CARTE ── */}
        <div className="flex flex-col flex-1 p-3 gap-2.5">

          {/* Titre */}
          <h3
            className="
              text-white font-bold text-sm leading-snug
              line-clamp-2
            "
          >
            {epreuve.titre}
          </h3>

          {/* Description (si disponible) */}
          {epreuve.description && (
            <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
              {epreuve.description}
            </p>
          )}

          {/* ── BADGES ── */}
          <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
            <Badge
              icone="📋"
              texte={epreuve.type_epreuve}
              variante="type"
            />
            <Badge
              icone="🎓"
              texte={epreuve.classe.nom}
            />
            <Badge
              icone="📚"
              texte={epreuve.matiere.nom}
            />
            <Badge
              icone="⏱"
              texte={dureeFormatee}
              variante="annee"
            />
          </div>

          {/* ── BOUTONS D'ACTION ── */}
          <div className="flex gap-2 mt-1">

            {/* Bouton Voir le PDF */}
            <button
              onClick={() => setPdfOuvert(true)}
              aria-label="Voir le PDF de l'épreuve"
              className="
                flex-1 flex items-center justify-center gap-1.5
                py-2 rounded-xl bg-gray-800 hover:bg-gray-700
                text-gray-300 hover:text-white
                text-xs font-semibold
                border border-gray-700 hover:border-gray-500
                transition-all duration-200
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
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
                  d="M2.458 12C3.732 7.943 7.523 5 12 
                    5c4.478 0 8.268 2.943 9.542 7-1.274 
                    4.057-5.064 7-9.542 7-4.477 0-8.268
                    -2.943-9.542-7z"
                />
              </svg>
              PDF
            </button>

            {/* Bouton Traiter le sujet */}
            <button
              onClick={() => onTraiter(epreuve.id)}
              aria-label="Traiter ce sujet"
              className="
                flex-[2] flex items-center justify-center gap-1.5
                py-2 rounded-xl
                bg-gradient-to-r from-blue-500 to-indigo-500
                hover:from-blue-600 hover:to-indigo-600
                text-white text-xs font-semibold
                shadow-md shadow-blue-900/30
                transition-all duration-200
                active:scale-[0.98]
              "
            >
              Traiter le sujet
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-3.5 h-3.5"
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
            </button>

          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          VISIONNEUSE PDF
          Rendue en dehors de la carte pour éviter
          les problèmes de z-index et d'overflow
      ════════════════════════════════════════════════════ */}
      {pdfOuvert && (
        <PdfViewerModal
          urlPdf={urlPdf}
          titre={epreuve.titre}
          onFermer={() => setPdfOuvert(false)}
        />
      )}
    </>
  );
};

export default EpreuveCard;