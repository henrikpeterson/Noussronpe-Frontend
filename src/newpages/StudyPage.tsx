// src/pages/StudyPage.tsx - FIX FINAL
// Corrige "PARAMETRE MANQUANT DANS L'URL" + leconId qui était un objet au lieu d'un number

import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import StudyView from '@/newpages/Components/Revision/StudyView';
import { SUBJECTS } from "@/newpages/data/Subjects";

interface SelectedSubject {
  id: string;
  name: string;
  color: string;
  gradient: string;
}

const StudyPage = () => {
  // Route doit être dans App.tsx : /study/:subjectId/:leconId
  const { subjectId, leconId } = useParams<{
    subjectId: string;
    leconId: string;
  }>();
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [subject, setSubject] = useState<SelectedSubject | null>(null);
  const [leconIdNumber, setLeconIdNumber] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('[StudyPage] Params reçus:', { subjectId, leconId, search: searchParams.toString() });

    // Vérification paramètres - c'est ici que tu avais "Paramètres manquants"
    if (!subjectId || !leconId) {
      console.error('[StudyPage] ❌ Params manquants', { subjectId, leconId });
      setError(`Paramètres manquants dans l'URL. Reçu: subjectId=${subjectId}, leconId=${leconId}. Vérifie ta route App.tsx = /study/:subjectId/:leconId`);
      setIsLoading(false);
      return;
    }

    // LeconId doit être un nombre (ex: 10), pas "ch1"
    const numericId = parseInt(leconId, 10);
    if (isNaN(numericId)) {
      console.error('[StudyPage] ❌ leconId pas numérique', leconId);
      setError(`leconId "${leconId}" invalide. Doit être un nombre (ex: 10), pas "ch1". Tu utilises encore MOCK_CHAPTERS ?`);
      setIsLoading(false);
      return;
    }

    setLeconIdNumber(numericId);

    // Récupère matière depuis STATIC (pour couleur)
    const subjectData = SUBJECTS.find(s => s.id === subjectId || s.id === subjectId.toLowerCase());
    
    if (!subjectData) {
      // Fallback : si physique-chimie pas dans STATIC, crée à la volée
      console.warn(`[StudyPage] Matière "${subjectId}" pas dans SUBJECTS, fallback`);
      setSubject({
        id: subjectId,
        name: subjectId,
        color: '#3B82F6',
        gradient: 'from-blue-600 to-indigo-600',
      });
    } else {
      setSubject({
        id: subjectData.id,
        name: subjectData.name,
        color: subjectData.color,
        gradient: subjectData.gradient,
      });
    }

    setIsLoading(false);
  }, [subjectId, leconId, searchParams]);

  const handleBack = () => {
    navigate(-1); // retour roadmap, pas forcément "/"
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-bounce">📚</div>
          <p className="text-slate-600 font-medium">Chargement du chapitre...</p>
          <p className="text-xs text-slate-400 mt-2">subjectId={subjectId} leconId={leconId}</p>
        </div>
      </div>
    );
  }

  if (error || !subject || leconIdNumber === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center max-w-lg px-4">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Oups !</h2>
          <p className="text-slate-600 mb-2">{error || 'Impossible de charger'}</p>
          <p className="text-xs text-slate-400 mb-6">
            Vérifie App.tsx : &lt;Route path="/study/:subjectId/:leconId" element=&lt;StudyPage /&gt; /&gt;
          </p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl">
            ← Retour
          </button>
        </div>
      </div>
    );
  }


  // AVANT : <StudyView subject={subject} leconId={chapter} />
  // MAINTENANT : leconId={leconIdNumber}
  return (
    <div className="min-h-screen">
      <StudyView 
        subject={subject}
        leconId={leconIdNumber} // <-- number, ex: 10
        onBack={handleBack}
      />
    </div>
  );
};

export default StudyPage;