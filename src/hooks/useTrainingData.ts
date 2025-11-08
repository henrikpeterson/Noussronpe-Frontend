import {useState, useEffect} from 'react';
import { 
  trainingService, 
  Classe, 
  Matiere, 
  TypeEpreuve,
  Epreuve 
} from '../api';

//Objet qui va stocker combien d'épreuves il y a pour chaque matière
interface ResourceCountsByMatiere {
  [matiereId: string]: number;
}

// 🏫 Objet pour compter les épreuves par CLASSE
interface ResourceCountsByClasse {
  [classeId: string]: {
    matiere_id: number;
    matiere: string;
    nb_epreuves: number;
  }[];
}

/**
 *CE HOOK EST COMME UN ASSISTANT INTELLIGENT
 * Il va chercher TOUTES vos données (classes, matières, épreuves)
 * et les renvoie prêtes à utiliser dans vos pages
 */

export const useTrainingData = ()=> {
    // 1. ÉTATS - La mémoire du hook

    // Liste de toutes les classes (Terminale S, Première S, etc.)
    const [classes, setClasses] = useState<Classe[]>([]);

    // Liste de toutes les matières (Maths, Physique, etc.) 
    const [matieres, setMatieres] = useState<Matiere[]>([]);


    // Liste des types d'épreuves (DS, Composition, Examen)
    const [typesEpreuve, setTypesEpreuve] = useState<TypeEpreuve[]>([]);


    // Verification si le hook est en train de charger les données
    const [loading, setLoading] = useState<boolean>(true);


    // Verification si il ya une erreur ? (null = pas d'erreur)
    const [error, setError] = useState<string | null>(null);
    
    // Combien d'épreuves il y a pour chaque matière
    const [resourceCountsByMatiere, setResourceCountsByMatiere] = useState<ResourceCountsByMatiere>({});

    // Combien il y a t'il par matiere pour chaque classe specifiquement 
    const [resourceCountsByClasse, setResourceCountsByClasse] = useState<ResourceCountsByClasse>({});

  /**
   * Effet pour charger les données initiales au montage du composant
   */

  useEffect(() => {
    let isMounted = true;
    const fetchInitialData = async () => {
        try{

          //On commence le chargement
          setLoading(true);
          setError(null);
          
          //On charge toute ls donnees 
          const [classesData, matieresData, typesData] = await Promise.all([
            trainingService.getClasses(),  // On recupere les classes
            trainingService.getMatieres(), // On recupere les matieres
            trainingService.getTypesEpreuve(), //On recupere les types d'epreuves
            
          ]);

        // Vérification que le composant est toujours monté
        if (!isMounted) return;

        //On stock toutes les donnees dans le hook
        setClasses(classesData);
        setMatieres(matieresData);
        setTypesEpreuve(typesData);

        //ON CHARGE LES DEUX TYPES DE COMPTEURS !
        await Promise.all([
            fetchRessourceCountsByMatiere(matieresData),
            fetchResourceCountsByClasse(classesData)
        ]);

      } catch (err) {
        if (!isMounted) return;
        console.error('Erreur:', err);
        setError('Impossible de charger les données')
      }finally{
        if (isMounted) {
            setLoading(false);
        }
      }
    }
    

    const fetchRessourceCountsByMatiere = async (matiereList: Matiere[]) =>{
        try {
            //On crée un objet vide pour stocker les résultats
            const counts: ResourceCountsByMatiere = {};

            // 🔁 POUR CHAQUE MATIÈRE dans la liste
            for(const matiere of matiereList){
                try {
                    //On appele l'endpoint de l'API pou recuperer le nombre d'épreuves pour cette matière
                    const countData = await trainingService.getEpreuvesCountByMatiere(matiere.id);

                    //On stocke le resultat 
                    counts[matiere.id] = countData.nb_epreuves;
                } catch (error) {
                    counts[matiere.id] = 0;
                }
            }
            //On Sauvegarde tous les comptes dans le hook
            setResourceCountsByMatiere(counts);

        } catch (error) {
          console.error('Erreur comptage matière:', error);
        }
    };

   const fetchResourceCountsByClasse = async (classesList: Classe[]) => {
  try {
    console.log('🏫 Je récupère le DÉTAIL des épreuves par CLASSE...');
    
    const counts: ResourceCountsByClasse = {};
    
    for (const classe of classesList) {
      try {
        console.log(`- Détail pour: ${classe.nom}...`);
        
        // 📞 Cet endpoint retourne un TABLEAU de matières avec leurs comptes
        const countDataArray = await trainingService.getEpreuveCountByClasse(classe.id);
        
        // 💾 Je stocke le TABLEAU COMPLET pour cette classe
        counts[classe.id] = countDataArray;
        
        //console.log(`  ✅ ${classe.nom}: ${countDataArray.length} matières avec épreuves`);
        
      } catch (error) {
        //console.log(`  ❌ Problème pour ${classe.nom}, je mets tableau vide`);
        counts[classe.id] = [];
      }
    }
    
    setResourceCountsByClasse(counts);
    console.log('✅ DÉTAIL PAR CLASSE TERMINÉ !');
    
  } catch (error) {
    console.error('Erreur détail classe:', error);
  }
};
   
  fetchInitialData();
  
  return () => {
      isMounted = false;
    };

 }, []);
   
 //fonction fléchée qui cherche une matière dans une liste 
 //matieres en fonction de son identifiant (id)
 const getMatiereById = (id: number): Matiere | undefined => {
    return matieres.find(matiere => matiere.id === id)
 }

 //fonction fléchée qui cherche une classe dans une liste 
 //classes en fonction de son identifiant (id)
 const getClasseById = (id: number): Classe | undefined => {
    return classes.find(classe => classe.id === id);
  };
  
  //fonction flechee qui retourne le nombre de ressources appartenant
  //a une matiere en fonction de l'id de la matiere 
  const getResourceCountByMatiere = (matiereId: number): number => {
    return resourceCountsByMatiere[matiereId] || 0;
  };

  //fonction flechee qui retourne le nombre de ressources appartenant 
  //a une classe en fonction de l'Id de la classe 
  const getMatieresByClasse = (classeId: number) => {
    return resourceCountsByClasse[classeId] || [];
  };

  return {
    classes,
    matieres,
    typesEpreuve,
    resourceCountsByMatiere,
    resourceCountsByClasse,

    loading,
    error,

    getMatiereById,
    getClasseById,
    getMatieresByClasse,
    getResourceCountByMatiere
  };
 
}

// 📘 Hook pour récupérer les détails d'une épreuve spécifique
export const useEpreuveDetails = (epreuveId?: number) => {
  const [epreuve, setEpreuve] = useState<Epreuve | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!epreuveId) return; // si pas d'ID, on ne lance rien

    const fetchEpreuve = async () => {
      try {
        setLoading(true);
        console.log('🔄 Chargement épreuve ID:', epreuveId);
        const data = await trainingService.getEpreuvesDetails(epreuveId);
        console.log('✅ Épreuve chargée:', data);
        setEpreuve(data);
      } catch (err) {
        console.error("Erreur de récupération de l'épreuve :", err);
        setError("Impossible de charger cette épreuve.");
      } finally {
        setLoading(false);
      }
    };

    fetchEpreuve();
  }, [epreuveId]);

  return { epreuve, loading, error };
};

