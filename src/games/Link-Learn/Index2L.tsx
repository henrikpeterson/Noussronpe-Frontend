import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useGameProgress } from "@/games/Link-Learn/hooks/useGameProgress";

export default function Index() {
  const navigate = useNavigate();
  const { progress } = useGameProgress();

  return (
    <div className="min-h-screen bg-background paper-texture flex flex-col items-center justify-center px-4 overflow-hidden">
      {/* Decorative ink dots */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-ink/5"
            style={{
              width: 6 + Math.random() * 20,
              height: 6 + Math.random() * 20,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -8, 0],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center relative z-10"
      >
        {/* Logo / Title */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-2"
        >
          <span className="text-6xl">🖊️</span>
        </motion.div>

        <h1 className="text-5xl md:text-6xl font-display font-extrabold text-foreground mb-2">
          Word<span className="text-accent">Link</span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-muted-foreground font-body text-base md:text-lg mb-8 max-w-xs mx-auto"
        >
          Relie les mots, maîtrise les langues&nbsp;!
        </motion.p>

        {/* Play button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/game/${progress.currentLevel}`)}
          className="bg-foreground text-primary-foreground font-display font-bold text-xl px-10 py-4 rounded-2xl shadow-lg hover:shadow-xl transition-shadow mb-4 block mx-auto"
        >
          ▶ Jouer — Niveau {progress.currentLevel}
        </motion.button>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/levels")}
            className="bg-secondary text-secondary-foreground font-body font-semibold text-sm px-8 py-3 rounded-xl hover:bg-secondary/80 transition-colors"
          >
            📋 Word Link
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/text-builder")}
            className="bg-secondary text-secondary-foreground font-body font-semibold text-sm px-8 py-3 rounded-xl hover:bg-secondary/80 transition-colors"
          >
            📖 Text Builder
          </motion.button>
        </div>

        {/* Stats */}
        {progress.completedLevels.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex gap-6 justify-center text-sm font-body"
          >
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-foreground">
                {progress.completedLevels.length}
              </div>
              <div className="text-muted-foreground">niveaux</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-display font-bold text-accent">
                {Object.values(progress.scores).reduce((a, b) => a + b, 0)} ⭐
              </div>
              <div className="text-muted-foreground">étoiles</div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
