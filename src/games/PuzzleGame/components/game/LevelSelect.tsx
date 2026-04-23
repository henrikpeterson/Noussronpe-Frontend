import { useGame } from "@/games/PuzzleGame/contexts/GameContext";
import { LEVELS } from "@/games/PuzzleGame/data/puzzleData";
import { ArrowLeft, Star, CheckCircle, Clock, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function LevelSelect() {
  const { currentLevel, results, selectImage, goToMenu } = useGame();
  const level = LEVELS.find((l) => l.id === currentLevel);
  if (!level) return null;

  const totalStars = level.images.reduce((sum, img) => {
    return sum + (results[img.id]?.stars || 0);
  }, 0);
  const maxStars = level.images.length * 3;
  const completedCount = level.images.filter(img => results[img.id]).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 1, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Header */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-20 bg-white/90 backdrop-blur-xl border-b-2 border-yellow-400/30 shadow-2xl shadow-blue-300/50"
      >
        <div className="flex items-center justify-between p-4 max-w-7xl mx-auto flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.1, rotate: -5 }}
              whileTap={{ scale: 0.95 }}
              onClick={goToMenu}
              className="p-3 rounded-xl bg-gradient-to-br from-yellow-400 to-yellow-500 text-blue-900 shadow-lg shadow-yellow-500/30 hover:shadow-xl hover:shadow-yellow-400/50 transition-all border-2 border-yellow-300"
            >
              <ArrowLeft className="w-5 h-5" strokeWidth={3} />
            </motion.button>
            
            <div>
              <h2 className="font-display font-black text-2xl text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 bg-clip-text">
                Niveau {level.id} — {level.name}
              </h2>
              <div className="flex items-center gap-4 mt-1 flex-wrap">
                <span className="text-sm text-blue-900 font-body flex items-center gap-1.5 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                  <Zap className="w-4 h-4 text-yellow-400" />
                  Grille {level.grid}×{level.grid}
                </span>
                <span className="text-sm text-blue-900 font-body flex items-center gap-1.5 bg-blue-100 px-3 py-1 rounded-full border border-blue-300">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  {level.timeLimit}s
                </span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6">
            <div className="text-center px-4 py-2 rounded-xl bg-white border-2 border-yellow-400">
              <p className="text-3xl font-black text-yellow-500">{completedCount}<span className="text-blue-600 text-xl">/{level.images.length}</span></p>
              <p className="text-xs text-blue-700 font-bold uppercase tracking-wider">Puzzles</p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-white border-2 border-yellow-400">
              <div className="flex gap-1 justify-center mb-1">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                  />
                ))}
              </div>
              <p className="text-xl font-black text-yellow-500">{totalStars}<span className="text-blue-600 text-sm">/{maxStars}</span></p>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-blue-200">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(completedCount / level.images.length) * 100}%` }}
            className="h-full bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 shadow-lg shadow-yellow-400/50"
          />
        </div>
      </motion.div>

      {/* Gallery */}
      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {level.images.map((img, index) => {
            const result = results[img.id];
            const completed = !!result;

            return (
              <motion.div
                key={img.id}
                initial={{ scale: 0, opacity: 0, rotateY: -90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                transition={{ 
                  delay: index * 0.05,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ 
                  y: -12, 
                  scale: 1.05,
                  rotateY: 5,
                  z: 50,
                }}
                className="group relative rounded-2xl overflow-hidden cursor-pointer shadow-xl shadow-blue-300/50 hover:shadow-2xl hover:shadow-yellow-500/30 transition-all duration-300 border-2 border-blue-300 hover:border-yellow-400"
                style={{
                  transformStyle: 'preserve-3d',
                }}
                onClick={() => selectImage(img)}
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-blue-100">
                  <img
                    src={img.url}
                    alt={img.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                  />
                  
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900 via-blue-700/50 to-transparent" />
                  
                  {/* Completion overlay */}
                  {completed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-green-500/20 backdrop-blur-[1px]"
                    />
                  )}

                  {/* Glow effect on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/0 group-hover:from-yellow-400/20 transition-all duration-300" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-blue-900 via-blue-800/95 to-transparent">
                  <p className="text-sm font-display font-bold text-white drop-shadow-lg truncate mb-2">
                    {img.name}
                  </p>
                  
                  {completed ? (
                    <div className="flex items-center justify-between">
                      <div className="flex gap-0.5">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-5 h-5 ${
                              s <= result.stars ? "text-yellow-400 drop-shadow-[0_0_6px_rgba(250,204,21,0.8)]" : "text-blue-300/30"
                            }`}
                            fill={s <= result.stars ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <span className="text-xs font-black text-yellow-400 bg-blue-900/90 px-2 py-1 rounded-full border border-yellow-400/50">
                        {result.points}pts
                      </span>
                    </div>
                  ) : (
                    <div className="px-3 py-2 rounded-lg bg-gradient-to-r from-yellow-400 to-yellow-500 text-blue-900 text-xs font-black text-center uppercase tracking-wider group-hover:from-yellow-300 group-hover:to-yellow-400 transition-all shadow-lg">
                      Jouer
                    </div>
                  )}
                </div>

                {/* Completion badge */}
                {completed && (
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="absolute top-3 right-3"
                  >
                    <div className="bg-gradient-to-br from-green-400 to-green-500 rounded-full p-1.5 shadow-xl shadow-green-500/50 border-2 border-green-300">
                      <CheckCircle className="w-5 h-5 text-white" strokeWidth={3} />
                    </div>
                  </motion.div>
                )}

                {/* Corner decorations */}
                <div className="absolute top-0 left-0 w-12 h-12 border-t-2 border-l-2 border-yellow-400/0 group-hover:border-yellow-400/60 rounded-tl-2xl transition-all duration-300" />
                <div className="absolute bottom-0 right-0 w-12 h-12 border-b-2 border-r-2 border-yellow-400/0 group-hover:border-yellow-400/60 rounded-br-2xl transition-all duration-300" />
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}