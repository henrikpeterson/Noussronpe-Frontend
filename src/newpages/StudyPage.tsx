/**
 * ════════════════════════════════════════════════════════════════════════
 * STUDYPAGE - Page indépendante d'étude (VERSION CORRIGÉE)
 * ════════════════════════════════════════════════════════════════════════
 */

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StudyView from '@/newpages/Components/Revision/StudyView';
import { SUBJECTS } from "@/newpages/data/Subjects";

/**
 * ═══════════════════════════════════════════════════════════
 * ✅ DÉFINITION LOCALE DES INTERFACES
 * (Plus besoin d'importer depuis RevisionModule)
 * ═══════════════════════════════════════════════════════════
 */
interface SelectedSubject {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

interface SelectedChapter {
  id: string;
  title: string;
  price: number;
}

const StudyPage = () => {
  
  /**
   * ═══════════════════════════════════════════════════════════
   * RÉCUPÉRATION DES PARAMÈTRES URL
   * ═══════════════════════════════════════════════════════════
   */
  const { subjectId, chapterId } = useParams<{
    subjectId: string;
    chapterId: string;
  }>();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  /**
   * ═══════════════════════════════════════════════════════════
   * ÉTAT
   * ═══════════════════════════════════════════════════════════
   */
  const [subject, setSubject] = useState<SelectedSubject | null>(null);
  const [chapter, setChapter] = useState<SelectedChapter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * ═══════════════════════════════════════════════════════════
   * CHARGEMENT DES DONNÉES
   * ═══════════════════════════════════════════════════════════
   */
  useEffect(() => {
    // ─────────────────────────────────────────────────────────
    // Vérification paramètres
    // ─────────────────────────────────────────────────────────
    if (!subjectId || !chapterId) {
      setError('Paramètres manquants dans l\'URL');
      setIsLoading(false);
      return;
    }

    // ─────────────────────────────────────────────────────────
    // Récupérer les infos de la matière
    // ─────────────────────────────────────────────────────────
    const subjectData = SUBJECTS.find(s => s.id === subjectId);
    
    if (!subjectData) {
      setError(`Matière "${subjectId}" introuvable`);
      setIsLoading(false);
      return;
    }

    setSubject({
      id: subjectData.id,
      name: subjectData.name,
      color: subjectData.color,
      gradient: subjectData.gradient,
    });

    // ─────────────────────────────────────────────────────────
    // Récupérer les infos du chapitre depuis query params
    // ─────────────────────────────────────────────────────────
    const chapterTitle = searchParams.get('title') || `Chapitre ${chapterId}`;
    const chapterPrice = parseInt(searchParams.get('price') || '0', 10);

    setChapter({
      id: chapterId,
      title: chapterTitle,
      price: chapterPrice,
    });

    setIsLoading(false);
  }, [subjectId, chapterId, searchParams]);

  /**
   * ═══════════════════════════════════════════════════════════
   * NAVIGATION RETOUR
   * ═══════════════════════════════════════════════════════════
   */
  const handleBack = () => {
    // Retour direct au dashboard
    navigate('/');
  };

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER - ÉTATS DE CHARGEMENT
   * ═══════════════════════════════════════════════════════════
   */
  
  // ─────────────────────────────────────────────────────────
  // LOADING STATE
  // ─────────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center 
                      bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-slate-600 font-medium text-lg">
            Chargement du chapitre...
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────
  // ERROR STATE
  // ─────────────────────────────────────────────────────────
  if (error || !subject || !chapter) {
    return (
      <div className="min-h-screen flex items-center justify-center 
                      bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-md px-4">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Oups !
          </h2>
          <p className="text-slate-600 mb-6">
            {error || 'Impossible de charger ce chapitre'}
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-500 hover:bg-blue-600 
                       text-white font-bold rounded-xl 
                       transition-colors shadow-lg hover:shadow-xl"
          >
            ← Retour au Dashboard
          </button>
        </div>
      </div>
    );
  }

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER - STUDYVIEW
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <div className="min-h-screen">
      {/* ✅ StudyView en plein écran, hors Dashboard */}
      <StudyView 
        subject={subject}
        chapter={chapter}
        onBack={handleBack}
      />
    </div>
  );
};

export default StudyPage;