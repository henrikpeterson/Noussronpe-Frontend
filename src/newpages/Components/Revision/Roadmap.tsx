import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Lock, CheckCircle2, Coins, PlayCircle } from "lucide-react";
import type { SelectedSubject, SelectedChapter } from "./RevisionModule";

/**
 * 🛤️ ÉTAPE B : ROADMAP - PARCOURS DES CHAPITRES
 * Ligne verticale avec nœuds hexagonaux cliquables
 */

interface RoadmapProps {
  subject: SelectedSubject;
  onSelectChapter: (chapter: SelectedChapter) => void;
  onBack: () => void;
}

// Données fictives des chapitres (à remplacer par vos vraies données)
const MOCK_CHAPTERS = [
  { id: "ch1", title: "Les nombres entiers", status: "completed", price: 0 },
  { id: "ch2", title: "Les fractions", status: "completed", price: 0 },
  { id: "ch3", title: "Les équations", status: "current", price: 50 },
  { id: "ch4", title: "Les fonctions linéaires", status: "locked", price: 100 },
  { id: "ch5", title: "La géométrie plane", status: "locked", price: 100 },
  { id: "ch6", title: "Les statistiques", status: "locked", price: 150 },
  { id: "ch7", title: "Les probabilités", status: "locked", price: 150 },
  { id: "ch8", title: "Les puissances", status: "locked", price: 200 },
];

const Roadmap = ({ subject, onSelectChapter, onBack }: RoadmapProps) => {
  const [hoveredChapter, setHoveredChapter] = useState<string | null>(null);

  // Calcul progression
  const completedCount = MOCK_CHAPTERS.filter(ch => ch.status === "completed").length;
  const totalCount = MOCK_CHAPTERS.length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="space-y-8">
      
      {/* ═══ Header avec bouton retour ═══ */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.button
            onClick={onBack}
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.95 }}
            className="w-12 h-12 bg-white border-2 border-slate-200 rounded-2xl flex items-center justify-center hover:border-slate-300 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-700" />
          </motion.button>

          <div>
            <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
              {subject.name}
              <span className="text-2xl">📖</span>
            </h2>
            <p className="text-slate-600 text-base font-medium mt-1">
              Suis ton parcours chapitre par chapitre
            </p>
          </div>
        </div>

        {/* Badge progression */}
        <div className="hidden md:flex items-center gap-3 bg-white border-2 border-slate-100 rounded-2xl px-5 py-3">
          <div className="text-right">
            <p className="text-xs text-slate-600 font-semibold">Progression</p>
            <p className="text-xl font-black" style={{ color: subject.color }}>
              {completedCount}/{totalCount}
            </p>
          </div>
          <div className="w-16 h-16">
            <svg className="transform -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" stroke="#E2E8F0" strokeWidth="3" />
              <circle 
                cx="18" 
                cy="18" 
                r="16" 
                fill="none" 
                stroke={subject.color}
                strokeWidth="3"
                strokeDasharray={`${progressPercentage} 100`}
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* ═══ ROADMAP VERTICALE ═══ */}
      <div className="max-w-3xl mx-auto bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-lg">
        
        <div className="relative">
          
          {/* Ligne verticale centrale */}
          <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-slate-200 via-slate-300 to-slate-200" />

          {/* Liste des chapitres */}
          <div className="space-y-6">
            {MOCK_CHAPTERS.map((chapter, index) => {
              const isLocked = chapter.status === "locked";
              const isCompleted = chapter.status === "completed";
              const isCurrent = chapter.status === "current";
              const isHovered = hoveredChapter === chapter.id;

              return (
                <motion.div
                  key={chapter.id}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  onMouseEnter={() => setHoveredChapter(chapter.id)}
                  onMouseLeave={() => setHoveredChapter(null)}
                  className="relative flex items-center gap-6"
                >
                  
                  {/* ═══ NŒUD HEXAGONAL ═══ */}
                  <motion.button
                    onClick={() => {
                      if (!isLocked) {
                        onSelectChapter({
                          id: chapter.id,
                          title: chapter.title,
                          price: chapter.price,
                        });
                      }
                    }}
                    disabled={isLocked}
                    whileHover={!isLocked ? { scale: 1.15, rotate: 5 } : {}}
                    whileTap={!isLocked ? { scale: 0.95 } : {}}
                    className="relative z-10 flex-shrink-0"
                  >
                    {/* Hexagone SVG */}
                    <div className="relative w-16 h-16">
                      <svg viewBox="0 0 100 100" className="w-full h-full">
                        {/* Ombre */}
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill="rgba(0,0,0,0.1)"
                          transform="translate(2, 2)"
                        />
                        {/* Hexagone principal */}
                        <polygon
                          points="50,5 93,27.5 93,72.5 50,95 7,72.5 7,27.5"
                          fill={
                            isCompleted 
                              ? subject.color 
                              : isCurrent 
                                ? "#FFF" 
                                : "#F1F5F9"
                          }
                          stroke={
                            isCompleted || isCurrent 
                              ? subject.color 
                              : "#CBD5E1"
                          }
                          strokeWidth="4"
                          className="transition-all duration-300"
                        />
                      </svg>

                      {/* Icône centrale */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        {isCompleted && (
                          <CheckCircle2 className="w-7 h-7 text-white" />
                        )}
                        {isCurrent && (
                          <PlayCircle 
                            className="w-7 h-7" 
                            style={{ color: subject.color }}
                          />
                        )}
                        {isLocked && (
                          <Lock className="w-6 h-6 text-slate-400" />
                        )}
                      </div>

                      {/* Effet pulse pour chapitre actuel */}
                      {isCurrent && (
                        <motion.div
                          animate={{ 
                            scale: [1, 1.3, 1],
                            opacity: [0.5, 0, 0.5]
                          }}
                          transition={{ 
                            duration: 2, 
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                          className="absolute inset-0 rounded-full"
                          style={{ 
                            border: `3px solid ${subject.color}`,
                          }}
                        />
                      )}
                    </div>
                  </motion.button>

                  {/* ═══ CARTE INFO CHAPITRE ═══ */}
                  <motion.div
                    animate={{
                      scale: isHovered && !isLocked ? 1.02 : 1,
                      x: isHovered && !isLocked ? 4 : 0,
                    }}
                    className={`flex-1 bg-gradient-to-r ${
                      isCompleted 
                        ? 'from-green-50 to-emerald-50 border-green-200' 
                        : isCurrent 
                          ? 'from-blue-50 to-indigo-50 border-blue-200'
                          : 'from-slate-50 to-slate-100 border-slate-200'
                    } border-2 rounded-2xl p-4 transition-all duration-300 ${
                      isLocked ? 'opacity-60' : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isLocked) {
                        onSelectChapter({
                          id: chapter.id,
                          title: chapter.title,
                          price: chapter.price,
                        });
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      
                      {/* Titre + numéro */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <span className="text-xs font-black text-slate-500">
                            Chapitre {index + 1}
                          </span>
                          {isCompleted && (
                            <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">
                              ✓ Terminé
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">
                              ⚡ En cours
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-black text-slate-900">
                          {chapter.title}
                        </h4>
                      </div>

                      {/* Prix en jetons */}
                      {chapter.price > 0 && (
                        <div className="flex items-center gap-2 bg-white/70 rounded-xl px-3 py-2 border border-slate-200">
                          <Coins className="w-4 h-4 text-amber-600" />
                          <span className="text-sm font-black text-slate-900">
                            {chapter.price}
                          </span>
                        </div>
                      )}

                      {/* Badge gratuit */}
                      {chapter.price === 0 && !isCompleted && (
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                          Gratuit
                        </span>
                      )}
                    </div>

                    {/* Tooltip verrouillé */}
                    {isLocked && isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs text-slate-600 font-medium"
                      >
                        🔒 Termine les chapitres précédents pour déverrouiller
                      </motion.div>
                    )}
                  </motion.div>

                </motion.div>
              );
            })}
          </div>

        </div>

        {/* Message de fin */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-8 text-center bg-gradient-to-r from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5"
        >
          <p className="text-sm font-bold text-indigo-900">
            🎯 Continue comme ça ! Il te reste {totalCount - completedCount} chapitres à maîtriser
          </p>
        </motion.div>

      </div>

    </div>
  );
};

export default Roadmap;