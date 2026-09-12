// src/hooks/useLeconsRoadmap.ts - PHASE 2
// Hook pour Roadmap - remplace MOCK_CHAPTERS

import { useState, useEffect, useMemo } from 'react';
import { getLeconsRoadmap, type LeconRoadmapApi } from '@/newpages/data/revision';

export type ChapterStatus = 'completed' | 'current' | 'locked';

export interface LeconEnrichie extends LeconRoadmapApi {
  status: ChapterStatus; // pour compatibilité avec ton UI existante
  themeTitre: string;
}

interface UseLeconsRoadmapReturn {
  lecons: LeconEnrichie[];
  isLoading: boolean;
  error: string | null;
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  isAuthenticated: boolean;
  refetch: () => void;
}

export function useLeconsRoadmap(matiereSlug: string, classe: string | null): UseLeconsRoadmapReturn {
  const [data, setData] = useState<LeconRoadmapApi[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoadmap = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getLeconsRoadmap(matiereSlug, classe);
      setData(response.lecons);
      setIsAuthenticated(response.is_authenticated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur chargement roadmap');
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (matiereSlug) {
      fetchRoadmap();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [matiereSlug, classe]);

  // Transforme données backend -> format UI + calcule status
  const leconsEnrichies = useMemo<LeconEnrichie[]>(() => {
    return data.map((lecon): LeconEnrichie => {
      let status: ChapterStatus = 'locked';
      
      if (lecon.is_locked) {
        status = 'locked';
      } else if (lecon.progression.statut === 'termine') {
        status = 'completed';
      } else {
        // en_cours ou non_commence mais déverrouillé = current
        status = 'current';
      }

      return {
        ...lecon,
        status,
        themeTitre: lecon.theme.titre,
      };
    });
  }, [data]);

  const completedCount = useMemo(() => 
    leconsEnrichies.filter(l => l.status === 'completed').length,
    [leconsEnrichies]
  );

  const totalCount = leconsEnrichies.length;
  const progressPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return {
    lecons: leconsEnrichies,
    isLoading,
    error,
    completedCount,
    totalCount,
    progressPercentage,
    isAuthenticated,
    refetch: fetchRoadmap,
  };
}
