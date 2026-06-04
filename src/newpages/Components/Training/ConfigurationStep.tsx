import { Classe, Matiere, TypeEpreuve } from '@/api';
import { FiltresEpreuves, ModaleType } from './TrainingModule';
import TrainingCard from './TrainingCard';
import FilterModal from './FilterModal';

// ============================================================
// TYPES & INTERFACES
// ============================================================

interface ConfigurationStepProps {
  // Données de référence chargées depuis l'API
  classes: Classe[];
  matieres: Matiere[];
  typesEpreuve: TypeEpreuve[];

  // Filtres actuellement sélectionnés
  filtresEpreuves: FiltresEpreuves;

  // Labels résolus depuis TrainingModule
  // (plus besoin de les recalculer ici)
  labelMatiere: string | null;
  labelClasse: string | null;
  labelType: string | null;

  // Modale actuellement ouverte (null = aucune)
  modaleOuverte: ModaleType;

  // Le bouton Continuer est-il activé ?
  peutContinuer: boolean;

  // Callbacks vers le parent (TrainingModule)
  onFiltreChange: (
    champ: keyof FiltresEpreuves,
    valeur: number | string | null
  ) => void;
  onFiltreReset: (champ: keyof FiltresEpreuves) => void;
  onOuvrirModale: (type: ModaleType) => void;
  onFermerModale: () => void;
  onContinuer: () => void;
}

// ============================================================
// COMPOSANT PRINCIPAL — ConfigurationStep
// ============================================================

/**
 * ConfigurationStep
 *
 * Étape 1 du parcours d'entraînement.
 *
 * Responsabilités :
 * - Afficher deux cartes empilées verticalement
 *   (Épreuves active + Exercices Libres désactivée)
 * - Construire les options pour chaque modale
 * - Orchestrer l'ouverture/fermeture des modales
 * - Déléguer le rendu des cartes à TrainingCard
 * - Déléguer le rendu des modales à FilterModal
 *
 * Changement vs version précédente :
 * - Les labels (nomMatiere, nomClasse, nomType) sont
 *   maintenant reçus directement en props depuis
 *   TrainingModule au lieu d'être recalculés ici.
 *   Cela évite la duplication de logique et garantit
 *   une source de vérité unique.
 */
const ConfigurationStep = ({
  classes,
  matieres,
  typesEpreuve,
  filtresEpreuves,
  labelMatiere,
  labelClasse,
  labelType,
  modaleOuverte,
  peutContinuer,
  onFiltreChange,
  onFiltreReset,
  onOuvrirModale,
  onFermerModale,
  onContinuer,
}: ConfigurationStepProps) => {

  // ----------------------------------------------------------
  // CONSTRUCTION DES OPTIONS POUR LES MODALES
  // Chaque option suit le format { id, label, sousTitre? }
  // attendu par le composant FilterModal
  // ----------------------------------------------------------

  /**
   * Options pour la modale Matière
   */
  const optionsMatieres = matieres.map((m) => ({
    id: m.id,
    label: m.nom,
  }));

  /**
   * Options pour la modale Niveau (Classe)
   */
  const optionsClasses = classes.map((c) => ({
    id: c.id,
    label: c.nom,
  }));

  /**
   * Options pour la modale Type d'épreuve
   * On ajoute une option "Tous les types" en tête de liste
   * car ce filtre est optionnel
   */
  const optionsTypes = [
    {
      id: 'tous',
      label: 'Tous les types',
      sousTitre: 'Aucun filtre sur le type',
    },
    ...typesEpreuve.map((t) => ({
      id: t.code,
      label: t.libelle,
    })),
  ];

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="max-w-2xl mx-auto px-4 py-1">
      {/* ── Cartes empilées verticalement ── */}
      <div className="space-y-5">

        {/*CARTE 1 — Épreuves (active)*/}
        <TrainingCard
          icone="📝"
          titre="Épreuves"
          description="Entraîne-toi sur de vrais sujets d'examen"
          // Labels résolus reçus directement du parent
          labelMatiere={labelMatiere}
          labelClasse={labelClasse}
          labelType={labelType}
          // Callbacks filtres
          onOuvrirModaleMatiere={() => onOuvrirModale('matiere')}
          onOuvrirModaleClasse={() => onOuvrirModale('classe')}
          onOuvrirModaleType={() => onOuvrirModale('type')}
          onResetMatiere={() => onFiltreReset('matiereId')}
          onResetClasse={() => onFiltreReset('classeId')}
          onResetType={() => onFiltreReset('typeEpreuve')}
          // Bouton principal
          peutContinuer={peutContinuer}
          onContinuer={onContinuer} couleur={'vert'}/>

        {/*
            CARTE 2 — Exercices Libres (désactivée)
            Les données ne sont pas encore disponibles.
            La carte est affichée mais non interactive.
       */}
        <TrainingCard
          icone="🎯"
          titre="Exercices Libres"
          description="Des exercices ciblés par compétence"
          badge="Prochainement"
          disabled={true}
          // Filtres vides non interactifs
          labelMatiere={null}
          labelClasse={null}
          labelType={null}
          // Callbacks vides (carte désactivée)
          onOuvrirModaleMatiere={() => { } }
          onOuvrirModaleClasse={() => { } }
          onOuvrirModaleType={() => { } }
          onResetMatiere={() => { } }
          onResetClasse={() => { } }
          onResetType={() => { } }
          // Bouton désactivé
          peutContinuer={false}
          onContinuer={() => { } } couleur={'jaune'}        />

      </div>

      {/* ════════════════════════════════
          MODALES
          Rendues en dehors du flux des cartes
          pour éviter les problèmes de z-index
      ════════════════════════════════ */}

      {/* Modale Matière */}
      {modaleOuverte === 'matiere' && (
        <FilterModal
          titre="Choisir une matière"
          options={optionsMatieres}
          valeurActuelle={filtresEpreuves.matiereId}
          onConfirmer={(valeur) =>
            onFiltreChange('matiereId', valeur)
          }
          onFermer={onFermerModale}
        />
      )}

      {/* Modale Niveau */}
      {modaleOuverte === 'classe' && (
        <FilterModal
          titre="Choisir un niveau"
          options={optionsClasses}
          valeurActuelle={filtresEpreuves.classeId}
          onConfirmer={(valeur) =>
            onFiltreChange('classeId', valeur)
          }
          onFermer={onFermerModale}
        />
      )}

      {/* Modale Type d'épreuve */}
      {modaleOuverte === 'type' && (
        <FilterModal
          titre="Choisir un type d'épreuve"
          options={optionsTypes}
          // Si typeEpreuve est null on pré-sélectionne 'tous'
          valeurActuelle={filtresEpreuves.typeEpreuve ?? 'tous'}
          onConfirmer={(valeur) =>
            onFiltreChange(
              'typeEpreuve',
              // 'tous' signifie pas de filtre → on stocke null
              valeur === 'tous' ? null : valeur
            )
          }
          onFermer={onFermerModale}
        />
      )}

    </div>
  );
};

export default ConfigurationStep;