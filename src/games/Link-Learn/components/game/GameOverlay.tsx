import { motion, AnimatePresence } from "framer-motion";

interface GameOverlayProps {
  completed: boolean;
  timerExpired: boolean;
  levelNum: number;
  onNavigateLevels: () => void;
  onNextLevel: () => void;
  onRetry: () => void;
}

export default function GameOverlay({
  completed, timerExpired, levelNum, onNavigateLevels, onNextLevel, onRetry,
}: GameOverlayProps) {
  return (
    <AnimatePresence>
      {completed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="bg-bubble rounded-3xl p-8 text-center shadow-[0_20px_60px_hsl(218_45%_20%/0.15)] max-w-xs mx-4 border border-border/50"
          >
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="text-6xl mb-4"
            >
              🎉
            </motion.div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">Bravo !</h2>
            <p className="text-muted-foreground font-body text-sm mb-6">Niveau {levelNum} complété !</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={onNavigateLevels}
                className="bg-secondary text-secondary-foreground font-body font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-secondary/80 transition-colors"
              >
                Niveaux
              </button>
              {levelNum < 40 && (
                <button
                  onClick={onNextLevel}
                  className="bg-foreground text-primary-foreground font-display font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
                >
                  Suivant ▶
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}

      {timerExpired && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-foreground/30 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="bg-bubble rounded-3xl p-8 text-center shadow-[0_20px_60px_hsl(218_45%_20%/0.15)] max-w-xs mx-4 border border-border/50"
          >
            <div className="text-6xl mb-4">⏰</div>
            <h2 className="font-display text-2xl font-bold text-foreground mb-1">Temps écoulé !</h2>
            <div className="flex gap-3 justify-center mt-4">
              <button
                onClick={onNavigateLevels}
                className="bg-secondary text-secondary-foreground font-body font-semibold px-5 py-2.5 rounded-xl text-sm hover:bg-secondary/80 transition-colors"
              >
                Niveaux
              </button>
              <button
                onClick={onRetry}
                className="bg-foreground text-primary-foreground font-display font-bold px-5 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
              >
                Réessayer 🔄
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
