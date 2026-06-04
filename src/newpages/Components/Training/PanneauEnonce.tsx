import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface PanneauEnonceProps {
  // Numéro de l'exercice (base 1, pour l'affichage)
  numeroExercice: number;
  // Nombre total d'exercices
  totalExercices: number;
  // Compétence visée par l'exercice
  competence: string;
  // Consigne de l'exercice
  consigne: string;
  // Énoncé HTML brut (contient potentiellement des <img> et <video>)
  enonce: string;
}

// ============================================================
// UTILITAIRES
// ============================================================

/**
 * preparerEnonce
 *
 * Transforme l'énoncé HTML brut reçu de Django :
 * - Remplace les chemins relatifs /media/ par des URLs absolues
 * - Utilise VITE_API_BASE_URL depuis les variables d'environnement
 *
 * Exemple :
 * '<img src="/media/images/exo1.png">'
 * → '<img src="http://0.0.0.0:8000/media/images/exo1.png">'
 *
 * @param enonce - HTML brut de l'énoncé
 */
const preparerEnonce = (enonce: string): string => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? '';

  return enonce.replace(
    /(<img[^>]+src="|<video[^>]+src=")\/media\//g,
    `$1${apiBaseUrl}/media/`
  );
};

// ============================================================
// SOUS-COMPOSANT — Modale Zoom Image
// ============================================================

interface ModaleZoomImageProps {
  src: string;
  alt: string;
  onFermer: () => void;
}

/**
 * ModaleZoomImage
 *
 * Modale affichant une image en plein écran.
 * Déclenchée au clic sur une image de l'énoncé.
 *
 * Fermeture :
 * - Clic sur l'overlay
 * - Touche Échap
 * - Bouton × en haut à droite
 */
const ModaleZoomImage = ({
  src,
  alt,
  onFermer,
}: ModaleZoomImageProps) => {

  // ----------------------------------------------------------
  // EFFETS
  // ----------------------------------------------------------

  /** Fermeture via la touche Échap */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFermer();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onFermer]);

  /** Blocage du scroll body pendant l'ouverture */
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <AnimatePresence>
      <motion.div
        key="modale-zoom"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="
          fixed inset-0 z-50
          bg-black/85 backdrop-blur-sm
          flex items-center justify-center
          p-4 sm:p-8
        "
        onClick={onFermer}
        role="dialog"
        aria-modal="true"
        aria-label="Image en plein écran"
      >

        {/* ── Bouton fermer ── */}
        <button
          onClick={onFermer}
          aria-label="Fermer l'image"
          className="
            absolute top-4 right-4 z-10
            w-10 h-10 flex items-center justify-center
            rounded-full bg-white/10 hover:bg-white/20
            text-white border border-white/20
            transition-all duration-200
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-white/50
            text-xl font-light
          "
        >
          ×
        </button>

        {/* ── Image zoomée ── */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          // Stoppe la propagation pour ne pas fermer
          // au clic sur l'image elle-même
          onClick={(e) => e.stopPropagation()}
          className="
            relative max-w-full max-h-full
            flex items-center justify-center
          "
        >
          <img
            src={src}
            alt={alt}
            className="
              max-w-full max-h-[85vh]
              object-contain rounded-2xl
              shadow-2xl
            "
          />

          {/* ── Indication mobile ── */}
          <p className="
            absolute -bottom-8 left-1/2 -translate-x-1/2
            text-white/50 text-xs whitespace-nowrap
            sm:hidden
          ">
            Appuie en dehors pour fermer
          </p>

        </motion.div>

      </motion.div>
    </AnimatePresence>
  );
};

// ============================================================
// COMPOSANT PRINCIPAL — PanneauEnonce
// ============================================================

/**
 * PanneauEnonce
 *
 * Panneau gauche du split screen du quiz.
 * Affiche l'énoncé HTML d'un exercice avec :
 *
 * - Transformation des URLs médias relatives → absolues
 * - Styles injectés pour le HTML brut Django
 *   (images responsives, tableaux, titres, listes...)
 * - Zoom au clic sur les images via ModaleZoomImage
 * - Scroll indépendant si l'énoncé est long
 * - Indicateur de position (Exercice X/Y)
 *
 * Note technique :
 * Les clics sur les <img> sont interceptés via un
 * addEventListener sur le conteneur (ref) car le HTML
 * est injecté via dangerouslySetInnerHTML et on ne peut
 * pas y mettre directement des handlers React.
 */
const PanneauEnonce = ({
  numeroExercice,
  totalExercices,
  competence,
  consigne,
  enonce,
}: PanneauEnonceProps) => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  /**
   * URL de l'image actuellement zoomée
   * null = aucune modale ouverte
   */
  const [imageZoomee, setImageZoomee] = useState<string | null>(null);

  // ----------------------------------------------------------
  // REF — Conteneur du HTML brut
  // Utilisé pour intercepter les clics sur les <img>
  // ----------------------------------------------------------
  const conteneurEnonceRef = useRef<HTMLDivElement>(null);

  // ----------------------------------------------------------
  // ÉNONCÉ PRÉPARÉ
  // URLs relatives → absolues
  // ----------------------------------------------------------
  const enoncePreparé = preparerEnonce(enonce);

  // ----------------------------------------------------------
  // HANDLER — Clic sur une image de l'énoncé
  // ----------------------------------------------------------

  /**
   * handleClicImage
   *
   * Ouvre la modale de zoom avec l'image cliquée.
   * Mémoïsé pour éviter les re-registrations de l'event listener.
   */
  const handleClicImage = useCallback((e: Event) => {
    const cible = e.target as HTMLElement;

    // On vérifie que c'est bien une image qui a été cliquée
    if (cible.tagName === 'IMG') {
      const img = cible as HTMLImageElement;
      // On stoppe la propagation pour éviter les comportements
      // par défaut du navigateur sur les images
      e.preventDefault();
      e.stopPropagation();
      setImageZoomee(img.src);
    }
  }, []);

  // ----------------------------------------------------------
  // EFFET — Enregistrement de l'event listener sur les <img>
  // Se réenregistre quand l'énoncé change (nouvel exercice)
  // ----------------------------------------------------------

  useEffect(() => {
    const conteneur = conteneurEnonceRef.current;
    if (!conteneur) return;

    // On attend que le DOM soit mis à jour avec le nouvel HTML
    // avant d'attacher les listeners
    const timer = setTimeout(() => {
      const images = conteneur.querySelectorAll('img');

      images.forEach((img) => {
        // Style curseur pour indiquer que c'est cliquable
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', handleClicImage);
      });
    }, 50);

    // Nettoyage : on retire les listeners quand l'énoncé change
    return () => {
      clearTimeout(timer);
      const images = conteneur.querySelectorAll('img');
      images.forEach((img) => {
        img.removeEventListener('click', handleClicImage);
      });
    };
  }, [enoncePreparé, handleClicImage]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <>
      {/* ════════════════════════════════════════════════════
          PANNEAU PRINCIPAL
      ════════════════════════════════════════════════════ */}
      <div
        className="
          h-full flex flex-col
          bg-white overflow-hidden
        "
      >

        {/* ── EN-TÊTE DU PANNEAU ── */}
        <div
          className="
            flex-shrink-0 px-6 pt-6 pb-4
            border-b border-gray-100
          "
        >

          {/* Indicateur Mission X/Y */}
          <div className="flex items-center gap-2 mb-3">
            <div
              className="
                w-8 h-8 rounded-xl flex items-center justify-center
                bg-green-500 flex-shrink-0
              "
            >
              {/* Icône document */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-white"
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
            </div>
            <div>
              <p className="text-xs text-green-600 font-semibold uppercase tracking-wider">
                Mission {numeroExercice}/{totalExercices}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-0.5">
                {competence}
              </p>
            </div>
          </div>

          {/* Titre de l'énoncé */}
          <h2 className="text-lg font-bold text-gray-800">
            Énoncé du problème
          </h2>

          {/* Consigne */}
          {consigne && (
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              {consigne}
            </p>
          )}

        </div>

        {/* ── CONTENU DE L'ÉNONCÉ — scrollable ── */}
        <div
          className="
            flex-1 overflow-y-auto
            px-6 py-5
            scroll-smooth
          "
        >

          {/* HTML brut de l'énoncé Django
              Les styles sont injectés via la classe
              "enonce-contenu" définie dans index.css */}
          <div
            ref={conteneurEnonceRef}
            dangerouslySetInnerHTML={{ __html: enoncePreparé }}
            className="enonce-contenu"
          />

        </div>

        {/* ── PIED DU PANNEAU : Indication zoom ── */}
        <div
          className="
            flex-shrink-0 px-6 py-3
            border-t border-gray-50
            bg-gray-50/50
          "
        >
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Clique sur une image pour l'agrandir
          </p>
        </div>

      </div>

      {/* ════════════════════════════════════════════════════
          MODALE ZOOM IMAGE
          Rendue en dehors du panneau pour éviter
          les problèmes de z-index avec le split
      ════════════════════════════════════════════════════ */}
      {imageZoomee && (
        <ModaleZoomImage
          src={imageZoomee}
          alt="Image de l'énoncé agrandie"
          onFermer={() => setImageZoomee(null)}
        />
      )}

    </>
  );
};

export default PanneauEnonce;