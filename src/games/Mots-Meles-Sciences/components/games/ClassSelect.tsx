import { motion } from "framer-motion";
import { CLASSES, Classe } from "@/games/Mots-Meles-Sciences/game/types";
import { BookOpen } from "lucide-react";

interface ClassSelectProps {
  onSelect: (c: Classe) => void;
}

export function ClassSelect({ onSelect }: ClassSelectProps) {
  return (
    <div className="min-h-screen paper-bg flex flex-col">
      <header className="px-4 pt-6 pb-4 sm:pt-10 sm:pb-8 text-center safe-top">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
          className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-primary shadow-glow mb-3"
        >
          <BookOpen className="w-8 h-8 sm:w-10 sm:h-10 text-primary-foreground" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-5xl font-bold text-primary"
          style={{ fontFamily: "Fredoka, sans-serif" }}
        >
          PCT en Poche
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm sm:text-base text-muted-foreground mt-2 px-4"
        >
          Mots mêlés • Physique-Chimie-Technologie
        </motion.p>
      </header>

      <main className="flex-1 px-4 pb-8 max-w-4xl mx-auto w-full">
        <h2 className="text-base sm:text-lg font-semibold text-primary mb-3 sm:mb-4 text-center">
          Choisis ta classe
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {CLASSES.map((c, i) => (
            <motion.button
              key={c.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, type: "spring", stiffness: 240, damping: 20 }}
              whileHover={{ scale: 1.04, y: -4 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => onSelect(c.id)}
              className="paper-card rounded-2xl p-4 sm:p-6 flex flex-col items-center gap-2 sm:gap-3 text-center hover:shadow-card transition-shadow btn-touch"
            >
              <span className="text-4xl sm:text-5xl">{c.emoji}</span>
              <h3 className="text-xl sm:text-2xl font-bold text-primary" style={{ fontFamily: "Fredoka, sans-serif" }}>
                {c.label}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-tight">
                {c.tagline}
              </p>
            </motion.button>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 px-4">
          Trouve les mots cachés dans la grille en glissant ton doigt 👆
        </p>
      </main>
    </div>
  );
}
