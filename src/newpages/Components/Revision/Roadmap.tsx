// src/newpages/Components/Revision/Roadmap.tsx - PHASE 2 - 100% Backend
// Remplace MOCK_CHAPTERS + price/Coins par API réelle
// Propre, commenté, production-ready

import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Play, Sparkles, Trophy, BookOpen, Clock } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import type { SelectedSubject } from "./RevisionModule";
import { useLeconsRoadmap, type LeconEnrichie } from '@/hooks/useLeconsRoadmap';

interface RoadmapProps {
  subject: SelectedSubject; // {id: slug ex "svt", name: "SVT", color: "#..."}
  classe: string | null; // "6ème" | "3ème" | null - vient de useMatieres / user.Class
  onBack: () => void;
}

const Roadmap = ({ subject, classe, onBack }: RoadmapProps) => {
  const navigate = useNavigate();
  const {
    lecons,
    isLoading,
    error,
    completedCount,
    totalCount,
    progressPercentage,
    isAuthenticated,
  } = useLeconsRoadmap(subject.id, classe);

  const handleChapterClick = (lecon: LeconEnrichie) => {
    console.log('[Roadmap] Click lecon', lecon.id, lecon.titre, 'status', lecon.status, 'is_locked', lecon.is_locked);
    if (lecon.status === "locked") return;

    // Navigation vers StudyView - on passe leçon id réel
    // StudyView fera ensuite GET /lecons/{id}/ + /questions/ + /flashcards/
    navigate(
      `/study/${subject.id}/${lecon.id}?title=${encodeURIComponent(lecon.titre)}&theme=${encodeURIComponent(lecon.theme.titre)}`
    );
  };

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-6">
        <div className="h-20 bg-slate-100 rounded-3xl animate-pulse mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-40 bg-slate-100 rounded-3xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // ---------- Error ----------
  if (error) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 py-6 text-center">
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
          <p className="text-red-800 font-bold">Erreur chargement parcours: {error}</p>
          <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-100 rounded-xl">Retour</button>
        </div>
      </div>
    );
  }

  // ---------- Empty (pas de leçons pour cette matière/classe) ----------
  if (totalCount === 0) {
    return (
      <div className="w-full max-w-6xl mx-auto px-3 py-6">
        <div className="flex items-center gap-3 mb-6">
          <button onClick={onBack} className="w-11 h-11 bg-slate-100 rounded-2xl flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-black">{subject.name}</h2>
        </div>
        <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-8 text-center">
          <p className="font-black text-amber-900">Aucune leçon pour {subject.name} en {classe || '6ème'} 📚</p>
          <p className="text-sm text-amber-700 mt-2">Le contenu arrive bientôt. Essaie une autre matière.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 md:py-6 space-y-6 md:space-y-8">
      
      {/* En-tête avec progression réelle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 md:p-6 rounded-3xl border-2 border-b-4 border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 md:gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-11 h-11 md:w-12 md:h-12 bg-slate-100 border-2 border-b-4 border-slate-200 hover:bg-slate-200 rounded-2xl flex items-center justify-center transition-all shrink-0 active:translate-y-0.5"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </motion.button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📖</span>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
                {subject.name}
              </h2>
              {classe && (
                <span className="text-xs font-bold bg-slate-100 border border-slate-200 px-2 py-1 rounded-full">
                  {classe}
                </span>
              )}
            </div>
            <p className="text-xs md:text-sm font-bold text-slate-500 mt-0.5">
              {isAuthenticated ? 'Suis ton parcours leçon par leçon' : 'Connecte-toi pour débloquer tout le parcours'}
            </p>
          </div>
        </div>

        {/* Badge Progression réelle depuis backend */}
        <div className="flex items-center gap-4 bg-slate-50 border-2 border-slate-200 rounded-2xl px-4 py-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-amber-600 shrink-0">
            <Trophy className="w-5 h-5" />
          </div>
          <div className="flex-1 sm:w-36">
            <div className="flex justify-between items-center text-xs font-black mb-1.5">
              <span className="text-slate-500">PROGRÈS</span>
              <span className="text-slate-800">{completedCount}/{totalCount} ({progressPercentage}%)</span>
            </div>
            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden p-0.5">
              <div 
                className="h-full rounded-full transition-all duration-500"
                style={{ 
                  width: `${progressPercentage}%`,
                  backgroundColor: subject.color || '#3B82F6'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Grille des Leçons avec Thème parent affiché (ta demande) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {lecons.map((lecon, index) => {
          const isLocked = lecon.status === "locked";
          const isCompleted = lecon.status === "completed";
          const isCurrent = lecon.status === "current";

          return (
            <motion.div
              key={lecon.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.3 }}
              whileHover={!isLocked ? { y: -4 } : {}}
              whileTap={!isLocked ? { scale: 0.98 } : {}}
              onClick={() => handleChapterClick(lecon)}
              className={`relative flex flex-col justify-between p-5 rounded-3xl border-2 transition-all duration-200 select-none ${
                isCompleted
                  ? 'bg-emerald-50/60 border-emerald-300 border-b-[6px] border-b-emerald-500 hover:border-emerald-400 cursor-pointer'
                  : isCurrent
                  ? 'bg-white border-blue-400 border-b-[6px] border-b-blue-600 shadow-md ring-2 ring-blue-400/20 cursor-pointer'
                  : 'bg-slate-100/70 border-slate-200 border-b-[6px] border-b-slate-300 opacity-75 cursor-not-allowed'
              }`}
            >
              {/* Top Bar : Chapitre + Thème + Status */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-xl border ${
                  isCompleted
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : isCurrent
                    ? 'bg-blue-100 text-blue-800 border-blue-200'
                    : 'bg-slate-200 text-slate-600 border-slate-300'
                }`}>
                  Leçon {index + 1}
                </span>

                <div className="flex items-center gap-1.5">
                  {isCompleted && (
                    <span className="flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-xl border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {lecon.progression.meilleur_score ? `${lecon.progression.meilleur_score}%` : 'Fait'}
                    </span>
                  )}
                  {isCurrent && (
                    <span className="flex items-center gap-1 text-xs font-black text-blue-700 bg-blue-100/80 px-2.5 py-1 rounded-xl border border-blue-200 animate-pulse">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      En cours
                    </span>
                  )}
                  {isLocked && (
                    <div className="w-8 h-8 rounded-xl bg-slate-200/80 border border-slate-300 flex items-center justify-center text-slate-500">
                      <Lock className="w-4 h-4" />
                    </div>
                  )}
                </div>
              </div>

              {/* Badge Thème parent - TA DEMANDE */}
              <div className="flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide truncate">
                  {lecon.theme.titre}
                </span>
              </div>

              {/* Titre Leçon */}
              <div className="my-2 min-h-[3rem] flex items-center">
                <h3 className={`text-base md:text-lg font-black leading-snug tracking-tight ${
                  isLocked ? 'text-slate-500' : 'text-slate-900'
                }`}>
                  {lecon.titre}
                </h3>
              </div>

              {/* Pied : durée + QCM/Flashcards + bouton Play */}
              <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
                    <Clock className="w-3 h-3" />
                    {lecon.duree} min
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {lecon.nb_questions} QCM • {lecon.nb_flashcards} cartes
                  </span>
                </div>

                {!isLocked && (
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 border-b-4 transition-transform active:translate-y-0.5 ${
                    isCurrent
                      ? 'bg-blue-600 border-blue-700 text-white shadow-sm'
                      : isCompleted
                      ? 'bg-emerald-600 border-emerald-700 text-white'
                      : 'bg-slate-800 border-slate-900 text-white'
                  }`}>
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                )}
              </div>

              {/* Tooltip si verrouillé */}
              {isLocked && (
                <div className="mt-3 text-[11px] font-bold text-slate-500">
                  {!isAuthenticated
                    ? '🔒 Connecte-toi pour débloquer'
                    : `🔒 Termine la leçon précédente à 75%`}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Bannière motivation */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-5 md:p-6 text-white border-2 border-b-6 border-indigo-700 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-2xl shrink-0">
            🎯
          </div>
          <div>
            <h4 className="font-black text-base md:text-lg">Prêt à relever le défi ?</h4>
            <p className="text-xs md:text-sm text-indigo-100 font-medium">
              Il te reste {totalCount - completedCount} leçon{totalCount - completedCount > 1 ? 's' : ''} à valider pour terminer {subject.name} {classe ? `en ${classe}` : ''}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
