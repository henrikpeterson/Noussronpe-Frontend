// src/hooks/useMatieres.ts - V2 - Classe auto depuis User connecté
// Plus de prop classe, plus de dropdown. Récupère Class depuis user.

import { useState, useEffect, useMemo } from 'react';
import { SUBJECTS, type Subject as StaticSubject } from '@/newpages/data/Subjects';
import { getMatieresByClasse, getCurrentUserWithClasse, normalizeSlug, type MatiereRevisionApi } from '@/newpages/data/revision';

export interface MatiereEnrichie extends StaticSubject {
  apiId: number;
  slug: string;
  nbThemes: number;
  nbLecons: number;
  nbEpreuves: number;
  isAvailable: boolean;
  descriptionApi: string;
  classeUser: string | null; // pour debug
}

interface UseMatieresReturn {
  matieres: MatiereEnrichie[];
  isLoading: boolean;
  error: string | null;
  classeUser: string | null; // "6ème", "3ème", etc.
  isAuthenticated: boolean;
  refetch: () => void;
}

export function useMatieres(): UseMatieresReturn {
  const [apiMatieres, setApiMatieres] = useState<MatiereRevisionApi[]>([]);
  const [classeUser, setClasseUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchAll = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Récupère user connecté + sa Class
      const currentUser = await getCurrentUserWithClasse();
      
      if (currentUser && currentUser.Class) {
        // CONNECTÉ : on a sa classe (ex: "3ème")
        setClasseUser(currentUser.Class);
        setIsAuthenticated(true);
        
        // 2. Fetch matières de SA classe uniquement
        const matieres = await getMatieresByClasse(currentUser.Class);
        setApiMatieres(matieres);
      } else {
        // ANONYME : pas de user ou pas de Class
        setClasseUser(null);
        setIsAuthenticated(false);
        
        // Pour anonyme, on affiche 6ème comme vitrine (puisque tu as du contenu partout maintenant)
        // Ou tu peux mettre null pour afficher tout
        const matieres = await getMatieresByClasse('6eme');
        setApiMatieres(matieres);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur');
      setApiMatieres([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const matieresEnrichies = useMemo<MatiereEnrichie[]>(() => {
    // Merge STATIC (couleur/image) + API (compteurs réels)
    // Si API vide pour cette classe, on garde STATIC mais isAvailable=false (jamais de grille vide)
    return SUBJECTS.map((staticSub): MatiereEnrichie => {
      const normalizedStaticId = normalizeSlug(staticSub.id);
      const apiMatch = apiMatieres.find(api => {
        const normalizedApiSlug = normalizeSlug(api.slug);
        return normalizedApiSlug === normalizedStaticId || 
               normalizedApiSlug.includes(normalizedStaticId) ||
               normalizedStaticId.includes(normalizedApiSlug);
      });

      if (apiMatch && apiMatch.nb_lecons > 0) {
        return {
          ...staticSub,
          apiId: apiMatch.id,
          slug: apiMatch.slug,
          nbThemes: apiMatch.nb_themes,
          nbLecons: apiMatch.nb_lecons,
          nbEpreuves: apiMatch.nb_epreuves,
          isAvailable: true,
          descriptionApi: apiMatch.description,
          chapters: apiMatch.nb_lecons,
          exercises: apiMatch.nb_epreuves,
          classeUser: classeUser,
        };
      } else {
        return {
          ...staticSub,
          apiId: 0,
          slug: staticSub.id,
          nbThemes: 0,
          nbLecons: 0,
          nbEpreuves: 0,
          isAvailable: false,
          descriptionApi: staticSub.description,
          chapters: 0,
          exercises: 0,
          classeUser: classeUser,
        };
      }
    });
  }, [apiMatieres, classeUser]);

  return {
    matieres: matieresEnrichies,
    isLoading,
    error,
    classeUser,
    isAuthenticated,
    refetch: fetchAll,
  };
}
