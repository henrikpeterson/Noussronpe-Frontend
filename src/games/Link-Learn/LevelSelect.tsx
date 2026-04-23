import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { phaseInfo, allLevels } from "@/games/Link-Learn/data/levels";
import { useGameProgress } from "@/games/Link-Learn/hooks/useGameProgress";

const phaseColors: Record<string, string> = {
  "phase-discovery": "from-[hsl(200,80%,55%)] to-[hsl(200,80%,40%)]",
  "phase-social": "from-[hsl(280,60%,55%)] to-[hsl(280,60%,40%)]",
  "phase-words": "from-[hsl(35,90%,55%)] to-[hsl(35,90%,40%)]",
  "phase-fluency": "from-[hsl(145,63%,42%)] to-[hsl(145,63%,30%)]",
  "phase-mastery": "from-[hsl(6,78%,57%)] to-[hsl(6,78%,42%)]",
};

export default function LevelSelect() {
  const navigate = useNavigate();
  const { progress } = useGameProgress();

  return (
    <div className="min-h-screen bg-background paper-texture">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => navigate("/")}
          className="mb-4 text-muted-foreground font-body text-sm hover:text-foreground transition-colors"
        >
          ← Retour
        </motion.button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-display font-bold text-foreground mb-6 text-center"
        >
          Niveaux
        </motion.h1>

        <div className="space-y-6">
          {phaseInfo.map((phase, pi) => (
            <motion.div
              key={phase.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: pi * 0.1 }}
            >
              <div className={`rounded-2xl bg-gradient-to-r ${phaseColors[phase.color]} p-3 mb-3`}>
                <h2 className="text-accent-foreground font-display text-lg font-bold">
                  {phase.icon} Phase {phase.phase}: {phase.name}
                </h2>
                <p className="text-accent-foreground/80 text-xs font-body">
                  Niveaux {phase.levels}
                </p>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {allLevels
                  .filter(l => l.phase === phase.phase)
                  .map(level => {
                    const isCompleted = progress.completedLevels.includes(level.level);
                    const isUnlocked = level.level <= progress.currentLevel;
                    const score = progress.scores[level.level];

                    return (
                      <motion.button
                        key={level.level}
                        whileHover={isUnlocked ? { scale: 1.08 } : {}}
                        whileTap={isUnlocked ? { scale: 0.95 } : {}}
                        onClick={() => isUnlocked && navigate(`/game/${level.level}`)}
                        className={`
                          relative aspect-square rounded-xl font-display text-lg font-bold
                          flex flex-col items-center justify-center gap-0.5 transition-all
                          ${isCompleted
                            ? "bg-accent text-accent-foreground shadow-md"
                            : isUnlocked
                              ? "bg-bubble border-2 border-bubble-border text-foreground shadow-sm hover:shadow-md"
                              : "bg-muted text-muted-foreground/40 cursor-not-allowed"
                          }
                        `}
                      >
                        {!isUnlocked && (
                          <span className="text-xs">🔒</span>
                        )}
                        <span>{level.level}</span>
                        {isCompleted && score !== undefined && (
                          <span className="text-[10px] font-body">
                            {"⭐".repeat(Math.min(score, 3))}
                          </span>
                        )}
                      </motion.button>
                    );
                  })}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

