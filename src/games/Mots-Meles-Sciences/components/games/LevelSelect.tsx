import { motion } from "framer-motion";
import { ArrowLeft, Lock, Star, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Classe, CLASSES, LEVELS } from "@/games/Mots-Meles-Sciences/game/types";
import { GameProgress } from "@/games/Mots-Meles-Sciences/game/types";
import { bestScoreKey } from "@/games/Mots-Meles-Sciences/game/storage";

interface LevelSelectProps {
  classe: Classe;
  progress: GameProgress;
  onSelect: (level: number) => void;
  onBack: () => void;
}

export function LevelSelect({ classe, progress, onSelect, onBack }: LevelSelectProps) {
  const cls = CLASSES.find(c => c.id === classe)!;
  // Highest unlocked level: max(level for which classe matches, 1) — simple: always all unlocked? We'll lock by best progress.
  const unlockedUpTo = Math.max(
    1,
    ...Object.entries(progress.bestScores)
      .filter(([k]) => k.startsWith(`${classe}-`))
      .map(([k]) => Number(k.split("-")[1]) + 1),
  );

  return (
    <div className="min-h-screen paper-bg flex flex-col">
      <header className="sticky top-0 z-10 paper-card rounded-none border-x-0 border-t-0 px-2 py-2 safe-top">
        <div className="max-w-4xl mx-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onBack} className="btn-touch" aria-label="Retour">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base sm:text-lg font-bold text-primary truncate">
              {cls.emoji} {cls.label} — Niveaux
            </h1>
            <p className="text-xs text-muted-foreground truncate">{cls.tagline}</p>
          </div>
        </div>
      </header>

      <main className="flex-1 px-3 sm:px-4 py-4 sm:py-6 max-w-4xl mx-auto w-full">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3">
          {LEVELS.map((lvl, i) => {
            const locked = lvl.level > unlockedUpTo;
            const best = progress.bestScores[bestScoreKey(classe, lvl.level)] ?? 0;
            return (
              <motion.button
                key={lvl.level}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.04 }}
                whileHover={!locked ? { scale: 1.05, y: -2 } : {}}
                whileTap={!locked ? { scale: 0.96 } : {}}
                onClick={() => !locked && onSelect(lvl.level)}
                disabled={locked}
                className={`paper-card rounded-2xl p-3 sm:p-4 flex flex-col items-center gap-1 btn-touch transition-all ${
                  locked ? "opacity-50 cursor-not-allowed" : "hover:shadow-card"
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center font-bold text-lg sm:text-xl ${
                  locked ? "bg-muted text-muted-foreground" : "bg-gradient-primary text-primary-foreground"
                }`}>
                  {locked ? <Lock className="w-4 h-4" /> : lvl.level}
                </div>
                <p className="text-xs font-semibold text-foreground">Niveau {lvl.level}</p>
                <p className="text-[10px] text-muted-foreground">
                  {lvl.questionCount} mots • {lvl.gridSize}×{lvl.gridSize}
                </p>
                {best > 0 && (
                  <div className="flex items-center gap-0.5 text-[10px] font-bold text-accent">
                    <Star className="w-3 h-3 fill-current" />
                    {best}
                  </div>
                )}
                {!locked && best === 0 && (
                  <Play className="w-3 h-3 text-success" />
                )}
              </motion.button>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6 px-4">
          Termine un niveau pour débloquer le suivant 🔓
        </p>
      </main>
    </div>
  );
}
