import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Home, Trophy, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LevelCompleteModalProps {
  open: boolean;
  level: number;
  score: number;
  bestScore: number;
  hasNext: boolean;
  onNext: () => void;
  onQuit: () => void;
}

const MESSAGES = ["Bravo !", "Excellent !", "Super travail !", "Tu es fort !", "Continue comme ça !"];

export function LevelCompleteModal({ open, level, score, bestScore, hasNext, onNext, onQuit }: LevelCompleteModalProps) {
  const message = MESSAGES[level % MESSAGES.length];
  const isNewBest = score >= bestScore;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 240, damping: 20 }}
            className="paper-card rounded-3xl p-6 sm:p-8 w-full max-w-sm flex flex-col gap-4 text-center"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-20 h-20 mx-auto rounded-full bg-gradient-accent flex items-center justify-center shadow-glow"
            >
              <Trophy className="w-10 h-10 text-accent-foreground" />
            </motion.div>

            <h2 className="text-3xl sm:text-4xl font-bold text-primary" style={{ fontFamily: "Fredoka, sans-serif" }}>
              {message}
            </h2>
            <p className="text-sm text-muted-foreground">Niveau {level} terminé</p>

            <div className="bg-gradient-primary rounded-2xl px-4 py-3 text-primary-foreground">
              <div className="flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-3xl font-bold tabular-nums">{score}</span>
                <span className="text-sm opacity-80">pts</span>
              </div>
              {isNewBest && score > 0 && (
                <p className="text-xs mt-1 text-accent">⭐ Nouveau meilleur score !</p>
              )}
            </div>

            {hasNext ? (
              <Button onClick={onNext} className="btn-touch bg-gradient-success text-success-foreground font-bold">
                Niveau suivant <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <div className="paper-card rounded-xl p-3 text-sm font-semibold text-primary">
                🎉 Tu as terminé toute la classe !
              </div>
            )}
            <Button onClick={onQuit} variant="ghost" className="btn-touch">
              <Home className="w-4 h-4 mr-2" /> Retour
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
