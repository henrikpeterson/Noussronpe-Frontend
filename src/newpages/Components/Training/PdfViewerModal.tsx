import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ============================================================
// CONFIGURATION — Worker PDF.js
// Nécessaire pour que react-pdf fonctionne correctement
// Le worker est chargé depuis le CDN unpkg pour éviter
// les problèmes de configuration webpack/vite
// ============================================================
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface PdfViewerModalProps {
  // URL publique du PDF à afficher
  urlPdf: string;
  // Titre affiché dans l'en-tête de la modale
  titre: string;
  // Callback pour fermer la modale
  onFermer: () => void;
}

// ============================================================
// COMPOSANT — PdfViewerModal
// ============================================================

/**
 * PdfViewerModal
 *
 * Visionneuse PDF intégrée basée sur react-pdf (PDF.js).
 *
 * Avantages vs iframe / window.open :
 * - Rendu canvas → aucun téléchargement déclenché sur mobile
 * - Fonctionne sur Chrome Android, Safari iOS, Firefox Mobile
 * - Pagination contrôlée par l'utilisateur
 * - Pas de dépendance à Google Docs Viewer
 *
 * Fonctionnalités :
 * - Chargement avec indicateur de progression
 * - Navigation page par page (précédent / suivant)
 * - Saut direct à une page via input
 * - Adaptation automatique à la largeur de l'écran
 * - Fermeture via overlay, croix ou touche Échap
 * - Scroll bloqué sur le body pendant l'ouverture
 */
const PdfViewerModal = ({
  urlPdf,
  titre,
  onFermer,
}: PdfViewerModalProps) => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  /** Nombre total de pages du PDF (connu après chargement) */
  const [nombrePages, setNombrePages] = useState<number>(0);

  /** Page actuellement affichée (base 1) */
  const [pageActuelle, setPageActuelle] = useState<number>(1);

  /** Valeur de l'input de saisie directe de page */
  const [inputPage, setInputPage] = useState<string>('1');

  /** Le PDF est-il en cours de chargement ? */
  const [chargement, setChargement] = useState<boolean>(true);

  /** Y a-t-il une erreur de chargement ? */
  const [erreur, setErreur] = useState<boolean>(false);

  /** Contrôle l'animation d'entrée/sortie */
  const [estVisible, setEstVisible] = useState<boolean>(false);

  /** Largeur du conteneur pour adapter le rendu PDF */
  const [largeurPage, setLargeurPage] = useState<number>(600);

  // ----------------------------------------------------------
  // EFFETS
  // ----------------------------------------------------------

  /**
   * Animation d'entrée au montage
   */
  useEffect(() => {
    const timer = setTimeout(() => setEstVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

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

  /**
   * Calcule la largeur optimale du PDF selon la taille de l'écran
   * - Mobile  : pleine largeur moins les marges
   * - Desktop : largeur fixe maximale de 750px
   */
  useEffect(() => {
    const calculerLargeur = () => {
      const largeurEcran = window.innerWidth;
      if (largeurEcran < 640) {
        // Mobile : on soustrait les padding de la modale (32px)
        setLargeurPage(largeurEcran - 32);
      } else if (largeurEcran < 1024) {
        // Tablette
        setLargeurPage(560);
      } else {
        // Desktop
        setLargeurPage(750);
      }
    };

    calculerLargeur();
    window.addEventListener('resize', calculerLargeur);
    return () => window.removeEventListener('resize', calculerLargeur);
  }, []);

  /**
   * Synchronise l'input de page avec la page actuelle
   * quand on navigue via les boutons précédent/suivant
   */
  useEffect(() => {
    setInputPage(String(pageActuelle));
  }, [pageActuelle]);

  // ----------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------

  /**
   * Fermeture avec animation de sortie
   */
  const handleFermerAvecAnimation = () => {
    setEstVisible(false);
    setTimeout(() => onFermer(), 300);
  };

  /**
   * Appelé par react-pdf quand le document est chargé avec succès
   * Récupère le nombre total de pages
   */
  const handleDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNombrePages(numPages);
    setChargement(false);
    setErreur(false);
  };

  /**
   * Appelé par react-pdf en cas d'erreur de chargement
   */
  const handleDocumentLoadError = () => {
    setChargement(false);
    setErreur(true);
  };

  /**
   * Navigation vers la page précédente
   */
  const handlePagePrecedente = () => {
    setPageActuelle((prev) => Math.max(prev - 1, 1));
  };

  /**
   * Navigation vers la page suivante
   */
  const handlePageSuivante = () => {
    setPageActuelle((prev) => Math.min(prev + 1, nombrePages));
  };

  /**
   * Saut direct à une page via l'input
   * Valide que la valeur est un nombre dans les bornes
   */
  const handleInputPageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputPage(e.target.value);
  };

  const handleInputPageConfirm = () => {
    const page = parseInt(inputPage, 10);
    if (!isNaN(page) && page >= 1 && page <= nombrePages) {
      setPageActuelle(page);
    } else {
      // Valeur invalide → on remet la page actuelle
      setInputPage(String(pageActuelle));
    }
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (

    /* ── OVERLAY ── */
    <div
      className={`
        fixed inset-0 z-50 flex items-center justify-center p-4
        transition-all duration-300
        ${estVisible
          ? 'bg-black/70 backdrop-blur-sm'
          : 'bg-black/0 backdrop-blur-none'
        }
      `}
      onClick={handleFermerAvecAnimation}
      role="dialog"
      aria-modal="true"
      aria-label={`Visionneuse PDF — ${titre}`}
    >

      {/* ── CONTENEUR PRINCIPAL DE LA MODALE ── */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`
          bg-gray-900 w-full rounded-3xl overflow-hidden
          flex flex-col shadow-2xl
          transition-all duration-300
          ${estVisible
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 translate-y-4'
          }
        `}
        style={{
          maxWidth: '820px',
          maxHeight: '92vh',
        }}
      >

        {/* ════════════════════════════════════════════════════
            EN-TÊTE DE LA MODALE
        ════════════════════════════════════════════════════ */}
        <div className="flex items-center justify-between 
          px-5 py-4 bg-gray-800 flex-shrink-0"
        >
          {/* Icône + Titre */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-red-500/20 
              flex items-center justify-center flex-shrink-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-red-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium uppercase 
                tracking-wider"
              >
                Aperçu du sujet
              </p>
              <h3 className="text-white font-bold text-sm truncate">
                {titre}
              </h3>
            </div>
          </div>

          {/* Bouton fermer */}
          <button
            onClick={handleFermerAvecAnimation}
            aria-label="Fermer la visionneuse"
            className="
              w-9 h-9 flex items-center justify-center flex-shrink-0
              rounded-xl bg-gray-700 hover:bg-gray-600
              text-gray-400 hover:text-white
              transition-all duration-200 ml-3
              focus:outline-none focus-visible:ring-2
              focus-visible:ring-white/50
              text-lg font-light
            "
          >
            ×
          </button>
        </div>

        {/* ════════════════════════════════════════════════════
            ZONE DE RENDU PDF — scrollable
        ════════════════════════════════════════════════════ */}
        <div className="overflow-y-auto flex-1 flex flex-col 
          items-center bg-gray-950 py-6 px-4"
        >

          {/* ── État : Chargement ── */}
          {chargement && (
            <div className="flex flex-col items-center justify-center 
              py-20 gap-4"
            >
              <div className="w-12 h-12 border-4 border-blue-500 
                border-t-transparent rounded-full animate-spin"
              />
              <p className="text-gray-400 text-sm font-medium">
                Chargement du document...
              </p>
            </div>
          )}

          {/* ── État : Erreur ── */}
          {erreur && (
            <div className="flex flex-col items-center justify-center 
              py-20 gap-4 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 
                flex items-center justify-center"
              >
                <span className="text-3xl">⚠️</span>
              </div>
              <div>
                <p className="text-white font-semibold mb-1">
                  Impossible de charger le document
                </p>
                <p className="text-gray-400 text-sm">
                  Vérifie ta connexion ou réessaie plus tard
                </p>
              </div>
              <button
                onClick={() => {
                  setErreur(false);
                  setChargement(true);
                }}
                className="px-5 py-2.5 bg-blue-500 hover:bg-blue-600 
                  text-white text-sm font-semibold rounded-xl 
                  transition-colors duration-200"
              >
                Réessayer
              </button>
            </div>
          )}

          {/* ── Rendu PDF via react-pdf ── */}
          <Document
            file={urlPdf}
            onLoadSuccess={handleDocumentLoadSuccess}
            onLoadError={handleDocumentLoadError}
            loading={null}
            error={null}
          >
            {/* On affiche uniquement la page actuelle */}
            {!erreur && (
              <Page
                pageNumber={pageActuelle}
                width={largeurPage}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="rounded-xl overflow-hidden shadow-2xl"
                loading={
                  <div className="flex items-center justify-center 
                    py-10"
                  >
                    <div className="w-8 h-8 border-4 border-blue-500 
                      border-t-transparent rounded-full animate-spin"
                    />
                  </div>
                }
              />
            )}
          </Document>

        </div>

        {/* ════════════════════════════════════════════════════
            BARRE DE NAVIGATION — Pagination
            Affichée uniquement quand le PDF est chargé
        ════════════════════════════════════════════════════ */}
        {!chargement && !erreur && nombrePages > 0 && (
          <div className="flex items-center justify-between 
            px-5 py-3 bg-gray-800 flex-shrink-0 gap-3"
          >

            {/* Bouton Page Précédente */}
            <button
              onClick={handlePagePrecedente}
              disabled={pageActuelle <= 1}
              aria-label="Page précédente"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl
                text-sm font-semibold transition-all duration-200
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-white/50
                ${pageActuelle <= 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                }
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
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="hidden sm:inline">Précédent</span>
            </button>

            {/* Indicateur de page central — Input + Total */}
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Page</span>

              {/* Input saisie directe */}
              <input
                type="number"
                min={1}
                max={nombrePages}
                value={inputPage}
                onChange={handleInputPageChange}
                onBlur={handleInputPageConfirm}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleInputPageConfirm();
                }}
                aria-label="Numéro de page"
                className="
                  w-12 text-center py-1.5 rounded-lg
                  bg-gray-700 border border-gray-600
                  text-white text-sm font-semibold
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                  focus:border-blue-500
                  [appearance:textfield]
                  [&::-webkit-outer-spin-button]:appearance-none
                  [&::-webkit-inner-spin-button]:appearance-none
                "
              />

              <span className="text-gray-400 text-sm">
                sur{' '}
                <span className="text-white font-semibold">
                  {nombrePages}
                </span>
              </span>
            </div>

            {/* Bouton Page Suivante */}
            <button
              onClick={handlePageSuivante}
              disabled={pageActuelle >= nombrePages}
              aria-label="Page suivante"
              className={`
                flex items-center gap-2 px-4 py-2 rounded-xl
                text-sm font-semibold transition-all duration-200
                focus:outline-none focus-visible:ring-2
                focus-visible:ring-white/50
                ${pageActuelle >= nombrePages
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-gray-700 hover:bg-gray-600 text-white'
                }
              `}
            >
              <span className="hidden sm:inline">Suivant</span>
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
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>

          </div>
        )}

      </div>
    </div>
  );
};

export default PdfViewerModal;