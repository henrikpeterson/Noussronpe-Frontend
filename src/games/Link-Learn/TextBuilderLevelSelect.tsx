import { useState, useMemo, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BookOpen, X, ChevronLeft, ChevronRight, Lock } from "lucide-react";
import { allTextBuilderLevels, textBuilderPhases } from "@/games/Link-Learn/data/textBuilderLevels";
// ✅ Import des fonctions de progression
import { 
  getTextBuilderProgress, 
  getTextBuilderLevelProgress, 
  isTextBuilderLevelUnlocked 
} from "@/games/Link-Learn/hooks/useGameProgress";

const phaseColorMap: Record<string, string> = {
  "phase-discovery": "from-[hsl(200,80%,55%)] to-[hsl(200,80%,40%)]",
  "phase-words": "from-[hsl(35,90%,55%)] to-[hsl(35,90%,40%)]",
  "phase-mastery": "from-[hsl(6,78%,57%)] to-[hsl(6,78%,42%)]",
};

const difficultyLabels: Record<string, string> = {
  beginner: "Débutant",
  intermediate: "Intermédiaire",
  advanced: "Avancé",
};

// ✅ Fonction pour calculer les étoiles selon le score
function getStars(score: number): number {
  if (score >= 9.5) return 3;
  if (score >= 8) return 2;
  if (score >= 7) return 1;
  return 0;
}

// Composant pour conteneur avec boutons de scroll
function ScrollableContainer({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    const observer = new ResizeObserver(checkScroll);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 5);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -200 : 200,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative">
      {showLeftButton && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-bubble-border rounded-full p-1.5 shadow-md hover:bg-white transition-all"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
      )}
      <div ref={scrollRef} onScroll={checkScroll} className={className}>
        {children}
      </div>
      {showRightButton && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-bubble-border rounded-full p-1.5 shadow-md hover:bg-white transition-all"
        >
          <ChevronRight size={16} className="text-foreground" />
        </button>
      )}
    </div>
  );
}

export default function TextBuilderLevelSelect() {
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("beginner");
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  // ✅ Récupérer la progression globale
  const playerProgress = getTextBuilderProgress();

  const availableTopics = useMemo(() => {
    const levels = allTextBuilderLevels.filter(l => l.difficulty === selectedDifficulty);
    const topics = new Set(levels.map(l => l.topic));
    return Array.from(topics).sort();
  }, [selectedDifficulty]);

  const filteredLevels = useMemo(() => {
    return allTextBuilderLevels.filter(level => {
      const matchesDifficulty = level.difficulty === selectedDifficulty;
      const matchesSearch = 
        level.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        level.topic.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesTopic = !selectedTopic || level.topic === selectedTopic;
      return matchesDifficulty && matchesSearch && matchesTopic;
    });
  }, [searchQuery, selectedDifficulty, selectedTopic]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedTopic(null);
  };

  const handleDifficultyChange = (difficulty: string) => {
    setSelectedDifficulty(difficulty);
    setSelectedTopic(null);
  };

  return (
    <div className="min-h-[100dvh] paper-texture flex flex-col" style={{ backgroundColor: "#FDFCF8" }}>
      <div className="max-w-lg mx-auto w-full px-3 sm:px-4 py-4 flex-1 flex flex-col">
        <div className="flex-shrink-0">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate("/")}
            className="mb-3 text-muted-foreground font-body text-sm hover:text-foreground transition-colors flex items-center gap-1 active:scale-95"
          >
            <ArrowLeft size={18} /> Retour
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-4"
          >
            <BookOpen className="mx-auto text-foreground mb-2" size={32} />
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-foreground">Text Builder</h1>
            
            {/* ✅ Score total du joueur */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-1.5 rounded-full font-display font-bold text-sm shadow-md">
                ⭐ {playerProgress.totalPoints.toFixed(1)} points
              </div>
            </div>
          </motion.div>

          {/* Tabs difficulté */}
          <ScrollableContainer className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {textBuilderPhases.map((phase) => {
              const count = allTextBuilderLevels.filter(l => l.difficulty === phase.difficulty).length;
              const isActive = selectedDifficulty === phase.difficulty;
              
              return (
                <button
                  key={phase.difficulty}
                  onClick={() => handleDifficultyChange(phase.difficulty)}
                  className={`flex-1 min-w-[100px] px-3 py-2.5 rounded-xl font-body font-bold text-xs sm:text-sm transition-all active:scale-95 relative ${
                    isActive
                      ? `bg-gradient-to-r ${phaseColorMap[phase.color]} text-white shadow-md`
                      : "bg-white/80 border border-bubble-border text-foreground hover:border-sky-500"
                  }`}
                >
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-base">{phase.icon}</span>
                    <span className="text-[10px] sm:text-xs">{difficultyLabels[phase.difficulty]}</span>
                    <span className={`text-[9px] ${isActive ? 'text-white/80' : 'text-muted-foreground'}`}>
                      {count} textes
                    </span>
                  </div>
                  {isActive && (
                    <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-white/50 rounded-full" />
                  )}
                </button>
              );
            })}
          </ScrollableContainer>

          {/* Filtres thèmes */}
          {availableTopics.length > 1 && (
            <div className="mb-3">
              <ScrollableContainer className="flex gap-1.5 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                <button
                  onClick={() => setSelectedTopic(null)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all active:scale-95 ${
                    !selectedTopic ? "bg-sky-500 text-white shadow-sm" : "bg-secondary text-foreground hover:bg-sky-100"
                  }`}
                >
                  Tous
                </button>
                {availableTopics.map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-body font-semibold transition-all active:scale-95 ${
                      selectedTopic === topic ? "bg-sky-500 text-white shadow-sm" : "bg-secondary text-foreground hover:bg-sky-100"
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </ScrollableContainer>
            </div>
          )}

          <div className="flex items-center justify-between mb-3">
            <p className="text-xs sm:text-sm font-body text-muted-foreground">
              <span className="font-semibold text-foreground">{filteredLevels.length}</span> résultat{filteredLevels.length > 1 ? "s" : ""}
            </p>
            
            {(searchQuery || selectedTopic) && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={clearFilters}
                className="text-xs font-body text-muted-foreground hover:text-foreground flex items-center gap-1 active:scale-90 transition-transform"
              >
                <X size={12} /> Effacer filtres
              </motion.button>
            )}
          </div>
        </div>

        {/* Liste des niveaux */}
        <div className="flex-1 overflow-y-auto -mx-3 px-3 sm:-mx-4 sm:px-4 pb-6">
          <AnimatePresence mode="wait">
            {filteredLevels.length > 0 ? (
              <motion.div
                key={selectedDifficulty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-2 gap-2 sm:gap-3"
              >
                {filteredLevels.map((level, idx) => {
                  // ✅ Récupérer les données de progression
                  const progress = getTextBuilderLevelProgress(level.id);
                  const unlocked = isTextBuilderLevelUnlocked(level.id);
                  const stars = progress ? getStars(progress.bestScore) : 0;
                  
                  return (
                    <motion.button
                      key={level.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      whileHover={unlocked ? { scale: 1.03 } : {}}
                      whileTap={unlocked ? { scale: 0.97 } : {}}
                      onClick={() => unlocked && navigate(`/text-builder/${level.id}`)}
                      disabled={!unlocked}
                      className={`rounded-xl bg-white/80 backdrop-blur-sm border p-2.5 sm:p-3 text-left shadow-sm transition-all relative overflow-hidden ${
                        unlocked 
                          ? "border-bubble-border hover:shadow-md cursor-pointer" 
                          : "border-gray-300 opacity-60 cursor-not-allowed"
                      }`}
                    >
                      {/* ✅ Cadenas si verrouillé */}
                      {!unlocked && (
                        <div className="absolute inset-0 bg-gray-900/10 backdrop-blur-[2px] flex items-center justify-center z-10">
                          <div className="bg-gray-800 text-white rounded-full p-2 shadow-lg">
                            <Lock size={20} />
                          </div>
                        </div>
                      )}

                      {/* ✅ Étoiles en haut à droite */}
                      {progress && stars > 0 && (
                        <div className="absolute top-1 right-1 flex gap-0.5">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <span key={i} className={`text-sm ${i < stars ? 'text-amber-400' : 'text-gray-300'}`}>
                              ⭐
                            </span>
                          ))}
                        </div>
                      )}

                      {/* ✅ Score en haut à gauche */}
                      {progress && progress.bestScore > 0 && (
                        <div className="absolute top-1 left-1">
                          <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                            {progress.bestScore.toFixed(1)}/10
                          </div>
                        </div>
                      )}

                      {/* Titre */}
                      <div className="font-display font-black text-foreground text-sm sm:text-base line-clamp-2 min-h-[2.5rem] sm:min-h-[2.8rem] leading-tight mt-6">
                        {level.title}
                      </div>
                      
                      {/* Infos du niveau */}
                      <div className="flex items-center gap-1 sm:gap-1.5 mt-1.5 flex-wrap">
                        <span className="text-[10px] sm:text-xs font-body font-bold text-foreground bg-secondary px-2 py-0.5 rounded-full">
                          {level.topic}
                        </span>
                        <span className="text-[10px] sm:text-xs font-body font-semibold text-foreground">
                          {level.chunks.length} blocs
                        </span>
                        {/* ✅ Badge mode directement sur la carte */}
                        <span className={`text-[9px] sm:text-[10px] font-body font-bold px-1.5 py-0.5 rounded-full ${
                          level.mode === "fill-gaps" 
                            ? "bg-purple-100 text-purple-700" 
                            : "bg-blue-100 text-blue-700"
                        }`}>
                          {level.mode === "fill-gaps" ? "🔤 Gaps" : "📝 Builder"}
                        </span>
                      </div>
                      
                      {/* Timer si présent */}
                      {level.timerSeconds && (
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground font-body mt-1 block">
                          ⏱ {level.timerSeconds}s
                        </span>
                      )}

                      {/* Nombre de tentatives */}
                      {progress && progress.attempts > 0 && (
                        <span className="text-[9px] text-muted-foreground font-body mt-0.5 block">
                          {progress.attempts} tentative{progress.attempts > 1 ? 's' : ''}
                        </span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <p className="text-5xl mb-3">🔍</p>
                <p className="font-display text-lg font-bold text-foreground mb-2">
                  Aucun texte trouvé
                </p>
                <p className="text-muted-foreground font-body text-xs sm:text-sm mb-4 px-4">
                  Essaie de modifier ta recherche
                </p>
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 bg-sky-500 text-white rounded-xl font-body font-semibold text-sm hover:bg-sky-600 transition-colors active:scale-95"
                >
                  Réinitialiser
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}