import { useState, useEffect, useCallback } from 'react';
import teacherApi from '../../teacherApi';
import { AssistanceRequest, AssistanceReponse } from '../api';

export const useTeacherAssistance = () => {
  const [demandesEnAttente, setDemandesEnAttente] = useState<AssistanceRequest[]>([]);
  const [demandesRepondues, setDemandesRepondues] = useState<AssistanceRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Charger toutes les demandes pour les enseignants
  const chargerDemandes = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Charger les demandes en attente et répondues en parallèle
      const [enAttente, repondues] = await Promise.all([
        teacherApi.get('apiv1/AssistancePedagogique/demandes/En_attente/'),
        teacherApi.get('apiv1/AssistancePedagogique/demandes/Repondue/')
      ]);

      console.log("API En_attente réponse:", enAttente.data);
      console.log("API Repondue réponse:", repondues.data);
      console.log("Demandes en_attente:", enAttente.data?.demandes?.length || 0);
      console.log("Demandes repondues:", repondues.data?.demandes?.length || 0);
      
      // on prend juste le tableau
      setDemandesEnAttente(enAttente.data.demandes || []);
      setDemandesRepondues(repondues.data.demandes || []);
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erreur lors du chargement';
      setError(errorMessage);
      console.error('Erreur chargement demandes:', err);
      
      // Si token expiré ou invalide
      if (err.response?.status === 401) {
        localStorage.removeItem('teacher_access_token');
        localStorage.removeItem('teacher_user');
        window.location.href = '/';
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Répondre à une demande
  const repondreDemande = async (assistanceId: number, data: {
    message: string;
    image?: File;
  }): Promise<AssistanceReponse> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('message', data.message);
      if (data.image) {
        formData.append('image', data.image);
      }

      console.log("=== ENVOI RÉPONSE ===");
      console.log("Assistance ID:", assistanceId);
      console.log("Message:", data.message);

      // Utilisez teacherApi pour envoyer le token enseignant
      const response = await teacherApi.post(
        `apiv1/AssistancePedagogique/reponse/${assistanceId}`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      // Recharger les données après succès
      await chargerDemandes();
      
      return response.data;
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erreur lors de la réponse';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Chargement initial
  useEffect(() => {
    chargerDemandes();
  }, [chargerDemandes]);

  return {
    // ÉTAT
    demandesEnAttente,
    demandesRepondues,
    loading,
    error,
    
    // ACTIONS
    chargerDemandes,
    repondreDemande,
    
    // UTILITAIRES
    clearError: () => setError(null)
  };
};