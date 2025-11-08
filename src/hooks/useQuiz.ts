import { useState, useEffect } from 'react';
import { trainingService, EpreuveInteractive, SoumissionReponse, ResultatSoumission } 
from '../api';

export const useQuiz = (epreuveId: number) => {
    //On recupere l'epreuve
    const [epreuve, setEpreuve] = useState<EpreuveInteractive | null>(null);

    // On recupere l'exercice actuelle
    const [currentExercice, setCurrentExercice] = useState(0);

    // On recupere les reponses
    const [reponses, setReponses] = useState<Record<number, string>>({});

    // Verification si le hook est en train de charger les données
    const [loading, setLoading] = useState(true);

    // Verification si il ya une erreur ? (null = pas d'erreur)
    const [error, setError] = useState<string | null>(null);

    //Recuperation des resultats
    const [resultat, setResultat] = useState<ResultatSoumission | null>(null);

    const exercices = epreuve?.exercices || [];
    

    useEffect(() =>{
        const chargerEpreuve = async () =>{
            try {
                setLoading(true);
                const data = await trainingService.getEpreuveInteractive(epreuveId);
                console.log('✅ Données reçues:', data);
                setEpreuve(data);
            } catch (err) {
                setError('Erreur lors du chargement de l\'épreuve');
                console.error('Erreur:', err);
            }finally{
                setLoading(false);
            }
        };
        if(epreuveId){
            chargerEpreuve()
        }
    }, [epreuveId]);

    const handleReponseChange = (questionId: number, reponse: string) => {
        console.log('🎯 Reponse changée:', { questionId, reponse });
        setReponses(prev => ({
        ...prev,
        [questionId]: reponse
        }));
    };

    const soumettreEpreuve = async () => {
      try {   
        console.log('🎯 SOUMETTRE_EPREUVE APPELEE');
        // VÉRIFIE SI LE TOKEN EXISTE
        const token = localStorage.getItem('access_token');
        if (!token) {
           setError('Vous devez être connecté pour soumettre l\'épreuve');
           return;
        }
        setLoading(true);
      
        // Préparer les données pour l'API
        const reponsesArray: SoumissionReponse[] = Object.entries(reponses).map(([questionId, reponse]) => ({
            question: parseInt(questionId),
            reponse_donnee: reponse
        }));

        const result = await trainingService.soumettreReponses(epreuveId, reponsesArray);
        setResultat(result);

     } catch (err: any) {
       console.error('💥 Erreur soumission:', err);

       if (err.response?.status === 401) {
       setError('Session expirée. Veuillez vous reconnecter.');
       } else {
         setError('Erreur lors de la soumission: ' + (err.response?.data?.error || err.message));
      }
     } finally{
        setLoading(false)
     }
   };

   // Vérifier si un exercice est complété
    const exerciceEstComplet = (exerciceIndex: number) => {
        const questionsExercice = exercices[exerciceIndex]?.questions || [];
        return questionsExercice.every(q => 
            reponses[q.id] !== undefined && 
            reponses[q.id] !== '');
    };

    // Navigation entre exercices
  const exerciceSuivant = () => {
    if (currentExercice < exercices.length - 1) {
      setCurrentExercice(currentExercice + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const exercicePrecedent = () => {
    if (currentExercice > 0) {
      setCurrentExercice(currentExercice - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return {
    // État
    epreuve,
    exercices,
    currentExercice,
    reponses,
    loading,
    error,
    resultat,
    
    // Actions
    handleReponseChange,
    soumettreEpreuve,
    exerciceSuivant,
    exercicePrecedent,
    setCurrentExercice,
    
    // Utilitaires
    exerciceEstComplet,
    tousExercicesComplets: exercices.every((_, index) => exerciceEstComplet(index)),
    progression: exercices.length > 0 ? ((currentExercice + 1) / exercices.length) * 100 : 0,
    totalQuestions: exercices.reduce((sum, ex) => sum + ex.questions.length, 0),
    questionsRepondues: Object.keys(reponses).length
  };

}