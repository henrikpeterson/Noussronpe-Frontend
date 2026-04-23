import { motion } from "framer-motion";
import { ArrowLeft, Pause, Trophy, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface GameHeaderProps {
  classeLabel: string;
  level: number;
  score: number;
  foundCount: number;
  totalCount: number;
  elapsedSec: number;
  onBack: () => void;
  onPause: () => void;
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = s % 60;
  return `${String(m).padStart(1, "0")}:${String(sec).padStart(2, "0")}`;
}

export function GameHeader({
  classeLabel, level, score, foundCount, totalCount, elapsedSec, onBack, onPause,
}: GameHeaderProps) {
  const progress = totalCount === 0 ? 0 : (foundCount / totalCount) * 100;

  return (
    <header className="sticky top-0 z-20 paper-card rounded-none border-x-0 border-t-0 px-2 sm:px-4 py-2 sm:py-3 safe-top">
      <div className="max-w-6xl mx-auto flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="btn-touch shrink-0 hover:bg-primary/10"
          aria-label="Retour"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div className="flex flex-col min-w-0 flex-1">
          <div className="flex items-baseline gap-1.5 min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-primary truncate">
              {classeLabel}
            </h1>
            <span className="text-xs text-muted-foreground shrink-0">• Niveau {level}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <Progress value={progress} className="h-1.5 flex-1" />
            <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground shrink-0 tabular-nums">
              {foundCount}/{totalCount}
            </span>
          </div>
        </div>

        <motion.div
          key={score}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          className="flex items-center gap-1 px-2 sm:px-3 py-1 rounded-lg bg-gradient-accent text-accent-foreground font-bold shrink-0"
        >
          <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="text-sm sm:text-base tabular-nums">{score}</span>
        </motion.div>

        <div className="hidden xs:flex items-center gap-1 text-xs sm:text-sm font-semibold text-muted-foreground tabular-nums shrink-0">
          <Timer className="w-3.5 h-3.5" />
          {formatTime(elapsedSec)}
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onPause}
          className="btn-touch shrink-0 hover:bg-primary/10"
          aria-label="Pause"
        >
          <Pause className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
}
