import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.82:8000'; // Remplace par l'URL de ton backend
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface Classe {
  id: number;
  nom: string;
}

export interface Matiere {
  id: number;
  nom: string; 
}

export interface Epreuve {
  id : number;
  titre: string;
  classe: Classe;
  matiere: Matiere;
  ecole: string;
  duree: string;
  type_epreuve: string;
  annee: number;
  pdf: string;
  description ?: string; 
}

export interface TypeEpreuve{
  code: string;
  libelle: string;
}

export interface EpreuveFiltreesResponse {
  filtres_appliques: {
    classe?: string;
    matiere?: string;
    type_epreuve?: string;
  };

  nombre_resultats: number;
  epreuves: Epreuve[];
}

export interface EpreuvesByClasseMatiereResponse {
  classe: string;
  matiere: string;
  nombre_epreuves: number;
  epreuves: Epreuve[];
}

export interface EpreuveInteractive {
  id: number;
  titre: string;
  matiere: string;      // ← String (StringRelatedField)
  classe: string;       // ← String (StringRelatedField)  
  annee: number;        // ← Number
  type_epreuve: string;
  description?: string;
  duree: string;
  pdf: string;
  exercices: Exercice[]; // ← Array d'objets
}

export interface Exercice {
  id: number;
  competence: string;
  enonce: string;
  consigne: string;
  questions: Question[];
}

export interface Question {
  id: number;
  texte_question: string;
  points: number;
  options: Option[];
}

export interface Option {
  texte_option: string;
  correcte: boolean;
  explication?: string;
}

export interface SoumissionReponse {
  question: number;
  reponse_donnee: string;
}

export interface ResultatSoumission {
  id: number;
  eleve: string;
  epreuve: string;
  temps_total: number;
  reponses: Array<{
    id: number;
    question: number;
    reponse_donnee: string;
    est_correcte: boolean;
    points_obtenus: number;
  }>;
  total_points_epreuve: number;
  total_exercices: number;
  total_questions: number;
  resultat: {
    reponses_fournies: number;
    bonnes_reponses: number;
    score_total: number;
    pourcentage: number;
    commentaire: string;
  };

}

//SERVICES - Les fonctions qui appellent votre API Django
export const trainingService = {
  /**
   * Récupère toutes les classes
   * GET api/TrainingAndEvaluation/classes/
   */

  async getClasses(): Promise<Classe[]> {
    const response = await api.get('api/TrainingAndEvaluation/classes/');
    return response.data;
  },

    /**
   * Récupère toutes les matières avec leurs classes associées
   * GET api/TrainingAndEvaluation/matieres/
   */

  async getMatieres(): Promise<Matiere[]> {
    const response = await api.get('api/TrainingAndEvaluation/matieres/');
    return response.data;
  },

  async getEpreuvesDetails(EpreuveId: number): Promise<Epreuve>{
    const response = await api.get(`api/TrainingAndEvaluation/epreuve/${EpreuveId}/`);
    return response.data;
  },
  
  /**
   * Récupère les types d'épreuves disponibles
   * GET /TrainingAndEvaluation/type-epreuves/
   */

  async getTypesEpreuve(): Promise<TypeEpreuve[]> {
    const response = await api.get('api/TrainingAndEvaluation/type-epreuves/');
    return response.data;
  },

  /**
   * Compte les épreuves par matière pour une classe spécifique
   * GET /TrainingAndEvaluation/classes/1/epreuves/count/
   */

  async getEpreuveCountByClasse(classeId: number): Promise<{
    matiere_id: number;
    matiere: string;
    nb_epreuves: number;
  }[]>{
    const response = await api.get(
      `api/TrainingAndEvaluation/classes/${classeId}/epreuves/count/`
    );
    return response.data;
  },

   /**
   * Compte les épreuves pour une matière spécifique
   * GET /TrainingAndEvaluation/matiere/1/epreuves/count/
   * Retourne: { "matiere": "Mathématiques", "nb_epreuves": 5 }
   */
  async getEpreuvesCountByMatiere(matiereId: number): Promise<{
    matiere: string;
    nb_epreuves: number;
  }> {
    const response = await api.get(
      `api/TrainingAndEvaluation/matiere/${matiereId}/epreuves/count/`
    );
    return response.data;
  },

  /**
   * Récupère les épreuves avec filtres
   * GET /TrainingAndEvaluation/epreuves/filtres/?classe=1&matiere=2&type_epreuve=DS
   */
  async getEpreuvesFiltreees(filters:{
    classe?: number;
    matiere?: number;
    type_epreuve?: string;
  }): Promise<EpreuveFiltreesResponse>{
    const params: any = {};

    if(filters.classe) params.classe = filters.classe.toString();
    if(filters.matiere) params.matiere = filters.matiere.toString();
    if (filters.type_epreuve) params.type_epreuve = filters.type_epreuve;

    const response = await api.get('api/TrainingAndEvaluation/epreuves/filtres/',{params});
    return response.data;
  },

  /**
   * Récupère les épreuves pour une classe et matière spécifiques
   * GET /TrainingAndEvaluation/classes/1/matiere/2/epreuves/
   */

  async getEpreuveByClasseMatiere(
    classeId: number, 
    matiereId: number
  ): Promise<EpreuvesByClasseMatiereResponse> {
    const response = await api.get(
      `api/TrainingAndEvaluation/classes/${classeId}/matiere/${matiereId}/epreuves/`
    );
    return response.data;
  },

  //Récupèration du contenu interactif d'une épreuve
  async getEpreuveInteractive(epreuveId:number): Promise<EpreuveInteractive>{
    const response = await api.get(`api/TrainingAndEvaluation/epreuve/${epreuveId}/interactive/`)
    return response.data;
  },

  //Soumission des reponses d'une epreuve
  async soumettreReponses(epreuveId: number,reponses: SoumissionReponse[]): Promise<ResultatSoumission> {
    const response = await api.post(`api/TrainingAndEvaluation/epreuve/${epreuveId}/soumettre/`, {reponses: reponses});
    return response.data;
  }

};

export default api;
