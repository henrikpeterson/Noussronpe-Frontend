import { useState, useEffect } from 'react';
import { assistanceService } from '../api';
import { Matiere } from '../api';

export const useReferenceData = () => {
  const [matieres, setMatieres] = useState<Matiere[]>([]);
  const [typesQuestions, setTypesQuestions] = useState<Array<{code: string, libelle: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chargerDonneesReference = async () => {
    setLoading(true);
    setError(null);
    try {
      const [matieresResponse, typesResponse] = await Promise.all([
        assistanceService.getMatieres(),
        assistanceService.getTypesQuestions()
      ]);
      
      setMatieres(matieresResponse.data);
      setTypesQuestions(typesResponse.data);
    } catch (err: any) {
      setError('Erreur lors du chargement des données');
      console.error('Erreur reference data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chargerDonneesReference();
  }, []);

  return {
    matieres,
    typesQuestions,
    loading,
    error,
    recharger: chargerDonneesReference
  };
};