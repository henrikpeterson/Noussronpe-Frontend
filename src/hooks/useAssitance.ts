import { useState, useEffect } from 'react';
import { AssistanceRequest, AssistanceReponse, assistanceService } from '../api';

export const useAssistance = (autoLoad = true) => {
    const [demandes, setDemandes] = useState<AssistanceRequest[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (autoLoad) {
            chargerMesDemandes();
        }
    }, [autoLoad])

    const chargerMesDemandes = async () => {
        setLoading(true);
        setError(null);
        try {
           const data = await assistanceService.mesDemandes();
           setDemandes(data); 
        } catch (err: any) { 
            setError(err.response?.data?.error || 'Erreur lors du chargement');
            console.error('Erreur chargement demandes:', err);
        } finally {
          setLoading(false);
        }
    };
    
    // CRÉER une demande
    const creeDemande = async (data: {
        titre: string;
        type_question: string;
        description: string;
        matiere: number;
        image?: File;
    }) => {
        setLoading(true);
        setError(null);
        try {
          const response = await assistanceService.creerDemande(data);
          setDemandes(prev => [response, ...prev]);
          return response;   
        } catch (err:any) {
          const errorMessage = err.response?.data?.error || 'Erreur lors de la création';
          setError(errorMessage);
          throw new Error(errorMessage);
        } finally{
           setLoading(false);
        }
    };

    // RÉPONDRE à une demande
    const repondre = async (assistanceId: number, data : {
        message: string;
        image?: File
    }) => {
      setLoading(true);
      setError(null);
      try {
        const response = await assistanceService.repondre(assistanceId, data);
        // Mettre à jour la demande avec la nouvelle réponse
        setDemandes(prev => prev.map(demande => 
            demande.id === assistanceId
            ?{
               ...demande,
               reponses: [...demande.reponses, response],
               statut: "repondue" // ← Met à jour le statut
            }
            : demande
        ));
        return response
      } catch (err: any) {
        const errorMessage = err.response?.data?.error || 'Erreur lors de la réponse';
        setError(errorMessage);
        throw new Error(errorMessage);
      }finally{
         setLoading(false);
      }
    };

  // RECHARGER les demandes
  const recharger = () => {
    chargerMesDemandes();
  };

  // EFFACER les erreurs
  const clearError = () => {
    setError(null);
  };
   
    return {
    // ÉTAT
    demandes,
    loading,
    error,
    chargerMesDemandes,
    // ACTIONS
    creeDemande,
    repondre,
    recharger,
    clearError,
    
    // UTILITAIRES
    demandesEnAttente: demandes.filter(d => d.statut === 'en_attente'),
    demandesResolues: demandes.filter(d => d.statut === 'repondue')
  };

}