import { motion, AnimatePresence } from "framer-motion";
import { Play, Home, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PauseModalProps {
  open: boolean;
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

export function PauseModal({ open, onResume, onRestart, onQuit }: PauseModalProps) {
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
            initial={{ scale: 0.85, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.85, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="paper-card rounded-3xl p-6 sm:p-8 w-full max-w-sm flex flex-col gap-3"
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-primary mb-2" style={{ fontFamily: "Fredoka, sans-serif" }}>
              ⏸ En pause
            </h2>
            <p className="text-center text-sm text-muted-foreground mb-2">
              Reprends quand tu es prêt !
            </p>
            <Button onClick={onResume} className="btn-touch bg-gradient-primary text-primary-foreground font-bold">
              <Play className="w-4 h-4 mr-2" /> Reprendre
            </Button>
            <Button onClick={onRestart} variant="outline" className="btn-touch font-semibold">
              <RotateCcw className="w-4 h-4 mr-2" /> Recommencer le niveau
            </Button>
            <Button onClick={onQuit} variant="ghost" className="btn-touch text-muted-foreground">
              <Home className="w-4 h-4 mr-2" /> Quitter
            </Button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
