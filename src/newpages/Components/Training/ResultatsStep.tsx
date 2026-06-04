import { useState, useEffect } from 'react';
import { trainingService, Epreuve } from '@/api';
import { FiltresEpreuves } from './TrainingModule';
import EpreuveCard from './EpreuveCard';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface ResultatsStepProps {
  // Filtres sélectionnés à l'Étape 1 (toujours matiereId + classeId)
  filtresEpreuves: FiltresEpreuves;
  // Noms résolus des filtres pour l'affichage des badges
  nomMatiere: string;
  nomClasse: string;
  nomType: string | null;
  // Callback quand l'utilisateur clique "Traiter le sujet"
  onTraiter: (epreuveId: number) => void;
  // Callback pour revenir à l'Étape 1 (modifier les filtres)
  onModifierFiltres: () => void;

  onNombreResultatsChange: (nombre: number) => void;
  onLoadingChange: (loading: boolean) => void
}

// ============================================================
// SOUS-COMPOSANT — Badge de filtre actif
// ============================================================

interface FiltreActifBadgeProps {
  icone: string;
  texte: string;
}

/**
 * FiltreActifBadge
 *
 * Pill affiché dans l'en-tête de ResultatsStep
 * pour rappeler les filtres actifs à l'utilisateur.
 */
const FiltreActifBadge = ({ icone, texte }: FiltreActifBadgeProps) => (
  <span
    className="
      inline-flex items-center gap-1.5 px-3 py-1.5
      bg-blue-50 border border-blue-200
      text-blue-700 text-xs font-semibold
      rounded-full
    "
  >
    <span>{icone}</span>
    {texte}
  </span>
);

// ============================================================
// SOUS-COMPOSANT — Skeleton de chargement
// ============================================================

/**
 * EpreuveCardSkeleton
 *
 * Placeholder animé affiché pendant le chargement des épreuves.
 * Reproduit la structure visuelle d'une EpreuveCard.
 */
const EpreuveCardSkeleton = () => (
  <div className="bg-gray-900 rounded-2xl overflow-hidden 
    border border-gray-800 animate-pulse"
  >
    {/* Zone haute placeholder */}
    <div className="h-36 bg-gray-800" />

    {/* Corps placeholder */}
    <div className="p-3 space-y-2.5">
      {/* Titre */}
      <div className="h-4 bg-gray-800 rounded-lg w-3/4" />
      <div className="h-3 bg-gray-800 rounded-lg w-1/2" />

      {/* Badges */}
      <div className="flex gap-1.5 pt-1">
        <div className="h-5 w-14 bg-gray-800 rounded-full" />
        <div className="h-5 w-12 bg-gray-800 rounded-full" />
        <div className="h-5 w-16 bg-gray-800 rounded-full" />
      </div>

      {/* Boutons */}
      <div className="flex gap-2 pt-1">
        <div className="h-8 flex-1 bg-gray-800 rounded-xl" />
        <div className="h-8 flex-[2] bg-gray-800 rounded-xl" />
      </div>
    </div>
  </div>
);

// ============================================================
// COMPOSANT PRINCIPAL — ResultatsStep
// ============================================================

/**
 * ResultatsStep
 *
 * Étape 2 du parcours d'entraînement.
 *
 * Responsabilités :
 * - Appeler l'API avec les filtres reçus de TrainingModule
 * - Afficher les skeletons pendant le chargement
 * - Afficher la grille de 3 colonnes d'EpreuveCard
 * - Gérer l'état vide (aucun résultat)
 * - Gérer l'état d'erreur API
 * - Afficher les filtres actifs en en-tête
 * - Permettre le retour à l'Étape 1 via "Modifier"
 */
const ResultatsStep = ({
  filtresEpreuves,
  nomMatiere,
  nomClasse,
  nomType,
  onTraiter,
  onModifierFiltres,
  onNombreResultatsChange, // ← nouveau
  onLoadingChange,         // ← nouveau
}: ResultatsStepProps) => {

  // ----------------------------------------------------------
  // STATE
  // ----------------------------------------------------------

  /** Liste des épreuves retournées par l'API */
  const [epreuves, setEpreuves] = useState<Epreuve[]>([]);

  /** Chargement en cours */
  const [loading, setLoading] = useState<boolean>(true);

  /** Message d'erreur (null = pas d'erreur) */
  const [erreur, setErreur] = useState<string | null>(null);

  // ----------------------------------------------------------
  // EFFET — Chargement des épreuves filtrées
  // Se relance si les filtres changent
  // ----------------------------------------------------------

  useEffect(() => {
    let isMounted = true;

    const chargerEpreuves = async () => {
      try {
        setLoading(true);
        onLoadingChange(true);
        setErreur(null);

        // Construction de l'objet filtres pour l'API
        // On envoie uniquement les filtres renseignés
        const filtres = {
          classe:       filtresEpreuves.classeId   ?? undefined,
          matiere:      filtresEpreuves.matiereId  ?? undefined,
          type_epreuve: filtresEpreuves.typeEpreuve ?? undefined,
        };

        const response = await trainingService.getEpreuvesFiltreees(filtres);

        if (!isMounted) return;

        setEpreuves(response.epreuves);
        onNombreResultatsChange(response.epreuves.length);

      } catch (err) {
        if (!isMounted) return;
        console.error('Erreur chargement épreuves:', err);
        setErreur('Impossible de charger les épreuves. Réessaie plus tard.');
      } finally {
        if (isMounted) setLoading(false);
        onLoadingChange(false);
      }
    };

    chargerEpreuves();

    return () => {
      isMounted = false;
    };

  // On recharge si les filtres changent
  }, [
    filtresEpreuves.matiereId,
    filtresEpreuves.classeId,
    filtresEpreuves.typeEpreuve,
  ]);

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* ════════════════════════════════════════════════════
          ÉTAT : CHARGEMENT — Grille de skeletons
      ════════════════════════════════════════════════════ */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 
          lg:grid-cols-3 gap-4"
        >
          {/* On affiche 6 skeletons pour simuler une page remplie */}
          {Array.from({ length: 6 }).map((_, index) => (
            <EpreuveCardSkeleton key={index} />
          ))}
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          ÉTAT : ERREUR
      ════════════════════════════════════════════════════ */}
      {!loading && erreur && (
        <div className="flex flex-col items-center justify-center 
          py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-red-50 
            flex items-center justify-center mb-4"
          >
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-gray-800 font-bold text-lg mb-2">
            Une erreur est survenue
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mb-6">
            {erreur}
          </p>
          <div className="flex gap-3">
            {/* Réessayer */}
            <button
              onClick={() => {
                setLoading(true);
                setErreur(null);
              }}
              className="
                px-5 py-2.5 rounded-xl
                bg-blue-500 hover:bg-blue-600
                text-white text-sm font-semibold
                transition-colors duration-200
              "
            >
              Réessayer
            </button>
            {/* Modifier les filtres */}
            <button
              onClick={onModifierFiltres}
              className="
                px-5 py-2.5 rounded-xl
                bg-gray-100 hover:bg-gray-200
                text-gray-600 text-sm font-semibold
                transition-colors duration-200
              "
            >
              Modifier les filtres
            </button>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          ÉTAT : AUCUN RÉSULTAT
      ════════════════════════════════════════════════════ */}
      {!loading && !erreur && epreuves.length === 0 && (
        <div className="flex flex-col items-center justify-center 
          py-20 text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gray-100 
            flex items-center justify-center mb-4"
          >
            <span className="text-3xl">🔍</span>
          </div>
          <h2 className="text-gray-800 font-bold text-lg mb-2">
            Aucun sujet trouvé
          </h2>
          <p className="text-gray-400 text-sm max-w-sm mb-6">
            Aucune épreuve ne correspond à ta sélection.
            Essaie de modifier tes filtres.
          </p>
          <button
            onClick={onModifierFiltres}
            className="
              px-6 py-3 rounded-xl
              bg-gradient-to-r from-blue-500 to-indigo-500
              hover:from-blue-600 hover:to-indigo-600
              text-white text-sm font-semibold
              shadow-md transition-all duration-200
              active:scale-[0.98]
            "
          >
            ← Modifier les filtres
          </button>
        </div>
      )}

      {/* ════════════════════════════════════════════════════
          ÉTAT : RÉSULTATS — Grille 3 colonnes
      ════════════════════════════════════════════════════ */}
      {!loading && !erreur && epreuves.length > 0 && (
        <>
          {/* Grille responsive :
              - Mobile  : 1 colonne
              - Tablette: 2 colonnes
              - Desktop : 3 colonnes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 
            lg:grid-cols-3 gap-4"
          >
            {epreuves.map((epreuve) => (
              <EpreuveCard
                key={epreuve.id}
                epreuve={epreuve}
                onTraiter={onTraiter}
              />
            ))}
          </div>

          {/* Pied de page — Nombre total de résultats */}
          <div className="mt-8 text-center">
            <p className="text-gray-400 text-sm">
              {epreuves.length} sujet{epreuves.length > 1 ? 's' : ''} affiché{epreuves.length > 1 ? 's' : ''}
              {' '}pour{' '}
              <span className="font-semibold text-gray-600">
                {nomMatiere}
              </span>
              {' '}en{' '}
              <span className="font-semibold text-gray-600">
                {nomClasse}
              </span>
            </p>
          </div>
        </>
      )}

    </div>
  );
};

export default ResultatsStep;