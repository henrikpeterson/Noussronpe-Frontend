import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Eraser, Lightbulb, RotateCcw, ChevronRight, PenLine, Trophy, X } from "lucide-react";
import { getTextBuilderLevel } from "@/games/Link-Learn/data/textBuilderLevels";
// ✅ NOUVEAU : Import de la fonction de sauvegarde
import { saveTextBuilderLevel } from "@/games/Link-Learn/hooks/useGameProgress";

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

interface ScoreChange {
  id: string;
  value: number;
  type: 'error' | 'reset';
}

export default function TextBuilderPage() {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const id = parseInt(levelId || "1");
  const level = getTextBuilderLevel(id);

  const [placedIndices, setPlacedIndices] = useState<number[]>([]);
  const [shuffledOrder, setShuffledOrder] = useState<number[]>([]);
  const [shakeIdx, setShakeIdx] = useState<number | null>(null);
  const [hintIdx, setHintIdx] = useState<number | null>(null);
  const [completed, setCompleted] = useState(false);
  const [timer, setTimer] = useState(level?.timerSeconds || 0);
  const [timerActive, setTimerActive] = useState(false);
  
  // Système d'erreurs et indices
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [showWarningPopup, setShowWarningPopup] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const MAX_HINTS = 2;
  const [showTranslation, setShowTranslation] = useState(false);

  // NOUVEAU : Système de points
  const [currentScore, setCurrentScore] = useState(10);
  const [scoreChanges, setScoreChanges] = useState<ScoreChange[]>([]);

  const writingRef = useRef<HTMLDivElement>(null);
  const chunks = useMemo(() => level?.chunks || [], [level]);

  // NOUVEAU : Fonction pour mettre à jour le score avec animation
  const updateScore = useCallback((change: number, type: 'error' | 'reset') => {
    setCurrentScore(prev => {
      const newScore = Math.max(0, Math.min(10, prev + change));
      return Math.round(newScore * 10) / 10; // Arrondir à 1 décimale
    });
    
    // Ajouter animation
    const changeId = Date.now().toString() + Math.random();
    setScoreChanges(prev => [...prev, { id: changeId, value: change, type }]);
    
    // Retirer après animation
    setTimeout(() => {
      setScoreChanges(prev => prev.filter(c => c.id !== changeId));
    }, 2000);
  }, []);

  // Reset on level change
  useEffect(() => {
    setPlacedIndices([]);
    setShuffledOrder(shuffleArray(chunks.map((_, i) => i)));
    setCompleted(false);
    setShakeIdx(null);
    setHintIdx(null);
    setConsecutiveErrors(0);
    setShowWarningPopup(false);
    setHintsUsed(0);
    setShowTranslation(false);
    setCurrentScore(10); //  NOUVEAU : Reset score
    setScoreChanges([]); //  NOUVEAU : Reset animations
    
    if (level?.timerSeconds) {
      setTimer(level.timerSeconds);
      setTimerActive(true);
    } else {
      setTimer(0);
      setTimerActive(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, chunks.length]);

  // Timer
  useEffect(() => {
    if (!timerActive || timer <= 0) return;
    const interval = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { setTimerActive(false); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  // Auto-scroll writing zone
  useEffect(() => {
    if (writingRef.current) {
      writingRef.current.scrollTop = writingRef.current.scrollHeight;
    }
  }, [placedIndices]);
  
  // NOUVEAU : Sauvegarder la progression quand le niveau est terminé
  useEffect(() => {
    if (completed && level) {
      console.log('💾 Sauvegarde du niveau', level.id, 'avec score:', currentScore);
      saveTextBuilderLevel(level.id, currentScore);
    }
  }, [completed, currentScore, level]);
   

  const resetGame = useCallback(() => {
    setPlacedIndices([]);
    setShuffledOrder(shuffleArray(chunks.map((_, i) => i)));
    setCompleted(false);
    setShakeIdx(null);
    setHintIdx(null);
    setConsecutiveErrors(0);
    setShowWarningPopup(false);
    setHintsUsed(0);
    setShowTranslation(false);
    setCurrentScore(10); // ✅ NOUVEAU : Reset score
    setScoreChanges([]); // ✅ NOUVEAU : Reset animations
    
    if (level?.timerSeconds) {
      setTimer(level.timerSeconds);
      setTimerActive(true);
    }
  }, [chunks, level]);

  const handleChunkClick = useCallback((chunkIndex: number) => {
    if (completed) return;
    const nextExpected = placedIndices.length;
    
    if (chunkIndex === nextExpected) {
      // Bonne réponse
      setPlacedIndices(prev => {
        const next = [...prev, chunkIndex];
        if (next.length === chunks.length) {
          setCompleted(true);
          setTimerActive(false);
        }
        return next;
      });
      setShakeIdx(null);
      setHintIdx(null);
      setConsecutiveErrors(0);
    } else {
      // Mauvaise réponse
      setShakeIdx(chunkIndex);
      setTimeout(() => setShakeIdx(null), 500);
      
      const newConsecutiveErrors = consecutiveErrors + 1;
      setConsecutiveErrors(newConsecutiveErrors);
      
      //NOUVEAU : Perdre 0.5 point
      if (level) {
        updateScore(-level.scoring.penalties.wrongAnswer, 'error');
      }
      
      // Après 3 erreurs consécutives : popup d'avertissement
      if (newConsecutiveErrors === 3) {
        setShowWarningPopup(true);
      }
      
      // Après 5 erreurs consécutives : reset complet
      if (newConsecutiveErrors >= 5) {
        // ✅ NOUVEAU : Perdre 1 point supplémentaire pour le reset
        if (level) {
          updateScore(-level.scoring.penalties.consecutiveErrorsReset, 'reset');
        }
        setTimeout(() => {
          resetGame();
        }, 500);
      }
    }
  }, [placedIndices, chunks.length, completed, consecutiveErrors, resetGame, level, updateScore]);

  const handleUndo = useCallback(() => {
    if (placedIndices.length === 0 || completed) return;
    setPlacedIndices(prev => prev.slice(0, -1));
  }, [placedIndices, completed]);

  const handleHint = useCallback(() => {
    if (hintsUsed >= MAX_HINTS) return;
    
    const nextExpected = placedIndices.length;
    if (nextExpected < chunks.length) {
      setHintIdx(nextExpected);
      setHintsUsed(prev => prev + 1);
      setTimeout(() => setHintIdx(null), 2000);
    }
  }, [placedIndices, chunks.length, hintsUsed]);

  const handleRetry = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Dynamic font size
  const fontSize = useMemo(() => {
    const total = chunks.join(" ").length;
    if (total > 400) return "text-xs";
    if (total > 250) return "text-sm";
    return "text-base";
  }, [chunks]);

  const timerExpired = !!level?.timerSeconds && timer === 0 && !completed;

  if (!level) {
    return (
      <div className="h-[100dvh] bg-background flex items-center justify-center">
        <p className="font-display text-xl text-foreground">Niveau introuvable</p>
      </div>
    );
  }

  const difficultyLabel = level.difficulty === "beginner" ? "Débutant" : level.difficulty === "intermediate" ? "Intermédiaire" : "Avancé";
  const availableChunks = shuffledOrder.filter(i => !placedIndices.includes(i));
  
  // NOUVEAU : Vérifier si le score est suffisant
  const isPassing = currentScore >= level.scoring.passingScore;

  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden" style={{ background: "#FDFCF8" }}>
      {/* Header */}
      <div className="flex-shrink-0 px-4 pt-3 pb-2">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => navigate("/text-builder")} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={22} />
          </button>
          <div className="text-center flex-1">
            <h1 className="font-display font-bold text-foreground text-lg leading-tight">{level.title}</h1>
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <span className="bg-sky-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shadow-sm">
                {difficultyLabel}
              </span>
              <span className="text-muted-foreground text-xs font-body">{level.topic}</span>
            </div>
          </div>
          <div className="w-6" />
        </div>

        {/* Instruction badge + Timer + Score */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <div className="flex items-center gap-1.5 bg-[hsl(30,100%,50%)] text-white px-3 py-1 rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="font-black text-[11px] uppercase tracking-wider">Reconstitue le texte</span>
          </div>
          
          {level.timerSeconds && (
            <div className={`font-display font-bold text-sm px-3 py-1 rounded-full ${timer <= 15 ? "bg-destructive text-white animate-pulse" : "bg-secondary text-foreground"}`}>
              ⏱ {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, "0")}
            </div>
          )}

          {/* ✅ NOUVEAU : Affichage du score */}
          <div className="relative font-display font-bold text-sm px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 text-white shadow-md">
            <span className="relative z-10">⭐ {currentScore.toFixed(1)}/10</span>
            
            {/* Animations de changement de score */}
            <AnimatePresence>
              {scoreChanges.map((change) => (
                <motion.div
                  key={change.id}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{ opacity: 0, y: -40, scale: 1.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className={`absolute -top-2 right-0 font-bold text-base pointer-events-none ${
                    change.value > 0 ? 'text-green-500' : 'text-red-500'
                  }`}
                  style={{ textShadow: '0 0 4px rgba(0,0,0,0.3)' }}
                >
                  {change.value > 0 ? '+' : ''}{change.value.toFixed(1)}
                  {change.type === 'error' && ' ❌'}
                  {change.type === 'reset' && ' 🔄'}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Tools */}
        <div className="flex items-center justify-center gap-3">
          <button onClick={handleUndo} disabled={placedIndices.length === 0 || completed}
            className="flex items-center gap-1 text-xs font-body font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            <Eraser size={14} /> Effacer
          </button>
          <button 
            onClick={handleHint} 
            disabled={completed || hintsUsed >= MAX_HINTS}
            className="flex items-center gap-1 text-xs font-body font-semibold text-muted-foreground hover:text-foreground disabled:opacity-30 transition-colors">
            <Lightbulb size={14} /> Indice ({hintsUsed}/{MAX_HINTS})
          </button>
          <button onClick={handleRetry}
            className="flex items-center gap-1 text-xs font-body font-semibold text-muted-foreground hover:text-foreground transition-colors">
            <RotateCcw size={14} /> Rejouer
          </button>
        </div>
      </div>

      {/* Word Cloud (Source Zone) */}
      <div className="flex-shrink-0 px-3 py-3">
        <div className="flex flex-wrap gap-2 justify-center min-h-[60px]">
          <AnimatePresence mode="popLayout">
            {availableChunks.map((chunkIdx) => {
              const isShaking = shakeIdx === chunkIdx;
              const isHinted = hintIdx === chunkIdx;
              return (
                <motion.button
                  key={`chunk-${chunkIdx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    x: isShaking ? [0, -6, 6, -6, 6, 0] : 0,
                    boxShadow: isHinted
                      ? "0 0 16px 4px hsl(35 90% 55% / 0.6)"
                      : "0 2px 8px hsl(218 30% 50% / 0.1)",
                  }}
                  exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{
                    layout: { type: "spring", stiffness: 400, damping: 30 },
                    x: isShaking ? { duration: 0.4 } : {},
                  }}
                  onClick={() => handleChunkClick(chunkIdx)}
                  className={`
                    px-3 py-1.5 rounded-xl font-body font-semibold cursor-pointer select-none
                    border transition-colors
                    ${isShaking
                      ? "bg-destructive/10 border-destructive text-destructive"
                      : isHinted
                        ? "bg-phase-words-light border-phase-words text-foreground"
                        : "bg-white/80 backdrop-blur-sm border-bubble-border text-foreground hover:border-foreground/30"
                    }
                  `}
                  style={{ fontSize: chunks.join(" ").length > 300 ? "11px" : "13px" }}
                >
                  {chunks[chunkIdx]}
                </motion.button>
              );
            })}
          </AnimatePresence>
        </div>
      </div>

      {/* Notebook / Writing Zone */}
      <div className="flex-1 min-h-0 px-3 pb-3">
        <div className="relative h-full rounded-2xl overflow-hidden border border-paper-lines/60"
          style={{
            background: `
              repeating-linear-gradient(
                transparent,
                transparent 31px,
                hsl(218 50% 80% / 0.35) 31px,
                hsl(218 50% 80% / 0.35) 32px
              ),
              linear-gradient(90deg, transparent 39px, hsl(6 60% 70% / 0.25) 39px, hsl(6 60% 70% / 0.25) 41px, transparent 41px)
            `,
            backgroundColor: "#FDFCF8",
          }}
        >
          <div className="absolute top-2 right-3 text-muted-foreground/30">
            <PenLine size={18} />
          </div>

          <div ref={writingRef} className="h-full overflow-y-auto p-4 pl-12 pt-3">
            <div className={`flex flex-wrap gap-x-1.5 gap-y-0 leading-[32px] ${fontSize}`}>
              <AnimatePresence mode="popLayout">
                {placedIndices.map((chunkIdx) => (
                  <motion.span
                    key={`placed-${chunkIdx}`}
                    layout
                    initial={{ opacity: 0, y: -20, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="font-body font-semibold text-ink inline-block"
                    style={{ color: "hsl(218 60% 25%)" }}
                  >
                    {chunks[chunkIdx]}
                  </motion.span>
                ))}
              </AnimatePresence>

              {!completed && !timerExpired && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="inline-block w-0.5 h-5 bg-ink rounded-full align-middle ml-0.5"
                  style={{ backgroundColor: "hsl(218 60% 25%)" }}
                />
              )}
            </div>

            {/* Traduction française */}
            <AnimatePresence>
              {showTranslation && level.translation && completed && ( 
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <div className="flex items-start gap-2 mb-2">
                    <p className="text-[11px] font-bold text-sky-600 uppercase tracking-wide">
                      Traduction en français
                    </p>
                  </div>
                  <p className={`font-body font-bold text-foreground leading-relaxed ${fontSize}`}>
                    {level.translation}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Progress */}
            <div className="mt-4">
              <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-accent rounded-full"
                  animate={{ width: `${(placedIndices.length / chunks.length) * 100}%` }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </div>
              <p className="text-[10px] text-muted-foreground font-body mt-1 text-right">
                {placedIndices.length}/{chunks.length}
              </p>
            </div>
          </div>
        </div>
      </div> 

      {/* Overlays */}
      <AnimatePresence>
        {/* Popup d'avertissement après 3 erreurs */}
        {showWarningPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm"
            onClick={() => setShowWarningPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.7, opacity: 0, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowWarningPopup(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
              
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
                className="text-7xl mb-4"
              >
                😰
              </motion.div>
              
              <h2 className="font-display text-2xl font-bold text-foreground mb-2">
                Attention !
              </h2>
              <p className="font-body text-muted-foreground text-base mb-6 leading-relaxed">
                Prends ton temps et lis bien chaque mot avant de cliquer. <br/>
                <span className="text-destructive font-semibold">
                  Encore 2 erreurs et le niveau redémarre !
                </span>
              </p>
              
              <button
                onClick={() => setShowWarningPopup(false)}
                className="px-6 py-3 rounded-xl bg-foreground text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity"
              >
                J'ai compris 👍
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ✅ NOUVEAU : Popup de complétion avec validation du score */}
        {completed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-end justify-center pb-6 px-4 pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
              className="bg-white rounded-3xl p-6 text-center shadow-2xl max-w-sm w-full pointer-events-auto relative"
            >
              <button 
                onClick={() => setCompleted(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
              
              {isPassing ? (
                // Score validé (≥ 7/10)
                <>
                  <motion.div
                    initial={{ rotate: -20, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Trophy className="mx-auto text-amber-500 mb-3" size={48} />
                  </motion.div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">Bravo ! 🎉</h2>
                  <div className="text-4xl mb-3">⭐ {currentScore.toFixed(1)}/10</div>
                  <p className="font-body text-muted-foreground text-sm mb-6">
                    Score validé ! Niveau suivant débloqué 🔓
                  </p>
                  
                  <div className="flex gap-3 justify-center">
                    {level.translation && (
                      <button 
                        onClick={() => setShowTranslation(!showTranslation)}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-blue-500 text-white font-display font-bold text-sm flex items-center gap-2 hover:from-sky-600 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
                      >
                        🇫🇷 {showTranslation ? "Masquer" : "Voir"} traduction
                      </button>
                    )}
                    {getTextBuilderLevel(id + 1) && (
                      <button 
                        onClick={() => navigate(`/text-builder/${id + 1}`)}
                        className="px-5 py-2.5 rounded-xl bg-foreground text-primary-foreground font-display font-bold text-sm flex items-center gap-1 hover:opacity-90 transition-opacity"
                      >
                        Suivant <ChevronRight size={16} />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                // Score insuffisant (< 7/10)
                <>
                  <div className="text-6xl mb-3">😢</div>
                  <h2 className="font-display text-2xl font-bold text-foreground mb-1">
                    Pas encore...
                  </h2>
                  <div className="text-4xl mb-3 text-orange-500">⭐ {currentScore.toFixed(1)}/10</div>
                  <p className="font-body text-muted-foreground text-sm mb-6">
                    Il te faut <span className="font-bold text-foreground">7/10</span> minimum pour débloquer le niveau suivant.
                  </p>
                  
                  <button 
                    onClick={() => {
                      setCompleted(false);
                      resetGame();
                    }}
                    className="px-6 py-2.5 rounded-xl bg-foreground text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity w-full"
                  >
                    🔄 Réessayer
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}

        {timerExpired && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-foreground/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl p-8 mx-6 text-center shadow-2xl max-w-sm w-full"
            >
              <h2 className="font-display text-2xl font-bold text-destructive mb-1">⏰ Temps écoulé !</h2>
              <p className="font-body text-muted-foreground text-sm mb-6">Essaie encore, tu peux y arriver !</p>
              <button onClick={handleRetry}
                className="px-6 py-2.5 rounded-xl bg-foreground text-primary-foreground font-display font-bold text-sm hover:opacity-90 transition-opacity">
                🔄 Réessayer
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}