import { useState } from 'react';
import { useTrainingData } from '@/hooks/useTrainingData';
import ConfigurationStep from './ConfigurationStep';
import ResultatsStep from './ResultatsStep';
import TrainingHeader from './TrainingHeader'
import { useNavigate } from 'react-router-dom';

// ============================================================
// TYPES & INTERFACES
// ============================================================

/**
 * Les 4 étapes du parcours d'entraînement
 * 1 = Configuration (choix des filtres)
 * 2 = Résultats (liste des épreuves filtrées)
 * 3 = Pratique (quiz - page séparée via router)
 * 4 = Score (résultats finaux)
 */
type Etape = 1 | 2 | 3 | 4;

/**
 * Filtres sélectionnés par l'utilisateur à l'Étape 1
 * matiereId et classeId sont obligatoires pour continuer
 * typeEpreuve est optionnel
 */
export interface FiltresEpreuves {
  matiereId: number | null;
  classeId: number | null;
  typeEpreuve: string | null;
}

/**
 * Modale active à un instant T
 * Une seule modale peut être ouverte à la fois
 */
export type ModaleType = 'matiere' | 'classe' | 'type' | null;

// ============================================================
// VALEURS PAR DÉFAUT
// ============================================================

const FILTRES_INITIAUX: FiltresEpreuves = {
  matiereId: null,
  classeId: null,
  typeEpreuve: null,
};

// ============================================================
// COMPOSANT PRINCIPAL
// ============================================================

/**
 * TrainingModule
 *
 * Composant parent qui orchestre l'intégralité du parcours
 * d'entraînement en 4 étapes.
 *
 * Responsabilités :
 * - Maintenir l'étape courante
 * - Maintenir les filtres sélectionnés (persistants entre étapes)
 * - Résoudre les labels des filtres depuis les données de référence
 * - Maintenir l'ID de l'épreuve sélectionnée à l'étape 2
 * - Passer les données et callbacks aux composants enfants
 */
const TrainingModule = () => {

  // ----------------------------------------------------------
  // DONNÉES GLOBALES
  // Chargées une seule fois au montage via le hook
  // Partagées entre toutes les étapes
  // ----------------------------------------------------------
  const {
    classes,
    matieres,
    typesEpreuve,
    loading: dataLoading,
    error: dataError,
  } = useTrainingData();

  const [nombreResultats, setNombreResultats] = useState<number>(0);
  const [loadingResultats, setLoadingResultats] = useState<boolean>(false);
  
  
  // ----------------------------------------------------------
  // STATE — Navigation entre étapes
  // ----------------------------------------------------------
  const [etape, setEtape] = useState<Etape>(1);
  
  const couleurHeader = etape === 1 
  ? "green"   // Étape 1 — Configuration
  : etape === 2 
    ? "blue"  // Étape 2 — Résultats
    : "red";  // Étape 3 / 4 — Quiz / Score


  // ----------------------------------------------------------
  // STATE — Filtres (persistants entre étape 1 et 2)
  // ----------------------------------------------------------
  const [filtresEpreuves, setFiltresEpreuves] =
    useState<FiltresEpreuves>(FILTRES_INITIAUX);

  // ----------------------------------------------------------
  // STATE — Épreuve sélectionnée à l'étape 2
  // Sera utilisée pour naviguer vers l'étape 3 (quiz)
  // ----------------------------------------------------------
  const [epreuveSelectionneeId, setEpreuveSelectionneeId] = useState<
    number | null
  >(null);

  // ----------------------------------------------------------
  // STATE — Modale active (une seule à la fois)
  // ----------------------------------------------------------
  const [modaleOuverte, setModaleOuverte] = useState<ModaleType>(null);

  // ----------------------------------------------------------
  // LABELS RÉSOLUS — Noms lisibles depuis les IDs des filtres
  // Calculés ici au niveau parent pour être partagés entre
  // ConfigurationStep (badges sur les FilterRow) et
  // ResultatsStep (badges de rappel en en-tête)
  // ----------------------------------------------------------

  const navigate = useNavigate();

  /**
   * Nom de la matière sélectionnée
   * Utilisé dans ConfigurationStep et ResultatsStep
   */
  const nomMatiere = filtresEpreuves.matiereId
    ? matieres.find((m) => m.id === filtresEpreuves.matiereId)?.nom ?? ''
    : '';

  /**
   * Nom de la classe sélectionnée
   * Utilisé dans ConfigurationStep et ResultatsStep
   */
  const nomClasse = filtresEpreuves.classeId
    ? classes.find((c) => c.id === filtresEpreuves.classeId)?.nom ?? ''
    : '';

  /**
   * Libellé du type d'épreuve sélectionné (optionnel)
   * Utilisé dans ConfigurationStep et ResultatsStep
   */
  const nomType = filtresEpreuves.typeEpreuve
    ? typesEpreuve.find(
        (t) => t.code === filtresEpreuves.typeEpreuve
      )?.libelle ?? null
    : null;

  // ============================================================
  // HANDLERS
  // ============================================================

  /**
   * Met à jour un filtre spécifique
   * Appelé depuis ConfigurationStep quand l'utilisateur
   * confirme une sélection dans une modale
   */
  const handleFiltreChange = (
    champ: keyof FiltresEpreuves,
    valeur: number | string | null
  ) => {
    setFiltresEpreuves((prev) => ({
      ...prev,
      [champ]: valeur,
    }));
  };

  /**
   * Réinitialise un filtre spécifique
   * Appelé quand l'utilisateur clique la croix (×) sur un badge
   */
  const handleFiltreReset = (champ: keyof FiltresEpreuves) => {
    setFiltresEpreuves((prev) => ({
      ...prev,
      [champ]: null,
    }));
  };

  /**
   * Ouvre une modale spécifique
   */
  const handleOuvrirModale = (type: ModaleType) => {
    setModaleOuverte(type);
  };

  /**
   * Ferme la modale active
   */
  const handleFermerModale = () => {
    setModaleOuverte(null);
  };

  /**
   * Valide l'étape 1 et passe à l'étape 2
   * Condition : matiereId ET classeId doivent être renseignés
   */
  const handleContinuer = () => {
    if (filtresEpreuves.matiereId && filtresEpreuves.classeId) {
      setEtape(2);
    }
  };

  /**
   * Retourne à l'étape 1 depuis l'étape 2
   * Les filtres sont conservés (pas de reset)
   */
  const handleModifierFiltres = () => {
    setEtape(1);
  };

  /**
   * Sélectionne une épreuve à l'étape 2 et passe à l'étape 3
   * Stocke l'ID de l'épreuve pour la transmettre à la page quiz
   */
  const handleTraiter = (epreuveId: number) => {
    setEpreuveSelectionneeId(epreuveId);
    navigate(`/quiz/${epreuveId}`);
  };

  /**
   * Retourne à l'étape 2 depuis l'étape 4 (score)
   * Permet de recommencer avec les mêmes filtres
   */
  const handleRecommencer = () => {
    setEpreuveSelectionneeId(null);
    setEtape(2);
  };

  // ============================================================
  // CONDITION : Vérification si "Continuer" est possible
  // matiereId ET classeId sont obligatoires
  // ============================================================
  const peutContinuer =
    filtresEpreuves.matiereId !== null &&
    filtresEpreuves.classeId !== null;

  // ============================================================
  // RENDER — État de chargement global
  // ============================================================
  if (dataLoading) {
    return (
      <div className="flex items-center justify-center 
        min-h-screen "
      >
        <div className="text-center">
          <div
            className="
              w-12 h-12 border-4 border-blue-500
              border-t-transparent rounded-full
              animate-spin mx-auto mb-4
            "
          />
          <p className="text-gray-600 font-medium">
            Chargement de l'espace entraînement...
          </p>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — État d'erreur global
  // ============================================================
  if (dataError) {
    return (
      <div className="flex items-center justify-center 
        min-h-screen bg-gray-50"
      >
        <div className="text-center max-w-md px-4">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            Impossible de charger les données
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {dataError}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="
              px-6 py-3 bg-blue-500 hover:bg-blue-600
              text-white rounded-xl font-semibold text-sm
              transition-colors duration-200
            "
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER — Contenu selon l'étape active
  // ============================================================
  return (
    <div className="min-h-screen pt-5 pb-9">
      <TrainingHeader
        // Étape actuelle → header s'adapte automatiquement
        etape={etape}
        // Props étape 1
        title="Choisis ton mode d'entraînement"
        subtitle="Sélectionne une matière pour progresser à ton rythme."
        colorVariant={couleurHeader}
        // Props étape 2
        onRetour={handleModifierFiltres}
        nomMatiere={nomMatiere}
        nomClasse={nomClasse}
        nomType={nomType}
        nombreResultats={nombreResultats}
        loadingResultats={loadingResultats}
        
      />

      {/* ── ÉTAPE 1 : Configuration ── */}
      {etape === 1 && (
        <ConfigurationStep
          // Données de référence
          classes={classes}
          matieres={matieres}
          typesEpreuve={typesEpreuve}
          // Filtres actuels
          filtresEpreuves={filtresEpreuves}
          // Labels résolus pour les FilterRow
          labelMatiere={nomMatiere || null}
          labelClasse={nomClasse || null}
          labelType={nomType}
          // État des modales
          modaleOuverte={modaleOuverte}
          // Condition de validation
          peutContinuer={peutContinuer}
          // Callbacks
          onFiltreChange={handleFiltreChange}
          onFiltreReset={handleFiltreReset}
          onOuvrirModale={handleOuvrirModale}
          onFermerModale={handleFermerModale}
          onContinuer={handleContinuer}
        />
      )}

      {/* ── ÉTAPE 2 : Résultats ── */}
      {etape === 2 && (
        <ResultatsStep
          filtresEpreuves={filtresEpreuves}
          nomMatiere={nomMatiere}
          nomClasse={nomClasse}
          nomType={nomType}
          onTraiter={handleTraiter}
          onModifierFiltres={handleModifierFiltres}
          //Pour synchroniser le header
          onNombreResultatsChange={setNombreResultats}
          onLoadingChange={setLoadingResultats}
        />
      )}

      {/* ── ÉTAPE 3 : Quiz (page séparée) ── */}
      {etape === 3 && epreuveSelectionneeId && (
        // La navigation vers la page quiz sera
        // implémentée ici via useNavigate()
        <div className="flex items-center justify-center 
          min-h-screen bg-gray-50"
        >
          <div className="text-center">
            <p className="text-gray-500 font-medium">
              Chargement du quiz...
            </p>
          </div>
        </div>
      )}

      {/* ── ÉTAPE 4 : Score ── */}
      {etape === 4 && (
        // ScoreStep sera implémenté ultérieurement
        <div className="flex items-center justify-center 
          min-h-screen bg-gray-50"
        >
          <div className="text-center">
            <p className="text-gray-500 font-medium mb-4">
              Étape 4 — Score (à implémenter)
            </p>
            <button
              onClick={handleRecommencer}
              className="
                px-6 py-3 bg-blue-500 hover:bg-blue-600
                text-white rounded-xl font-semibold text-sm
                transition-colors duration-200
              "
            >
              Recommencer
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrainingModule;