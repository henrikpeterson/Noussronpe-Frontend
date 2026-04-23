import { useGame } from "@/games/PuzzleGame/contexts/GameContext";
import { Star, Lock, Trophy, Sparkles, Award } from "lucide-react";
import { motion } from "framer-motion";

export default function MainMenu() {
  const { levels, totalPoints, isLevelUnlocked, getLevelStars, selectLevel } = useGame();

  return (
   <div className="min-h-screen bg-gradient-to-br from-blue-400 via-blue-300 to-blue-500 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-yellow-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Decorative stars */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
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

      {/* African pattern overlay */}
      <div className="absolute inset-0 african-pattern opacity-5" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center pt-12 pb-8 px-4"
        >
          <motion.div
            animate={{ 
              y: [0, -10, 0],
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
            className="inline-block"
          >
            <h1 className="text-6xl md:text-7xl font-display font-black mb-3">
              <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent drop-shadow-2xl filter drop-shadow-[0_0_30px_rgba(250,204,21,0.5)]">
                🌍 AfriPuzzle
              </span>
            </h1>
          </motion.div>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-blue-900 font-body text-xl font-medium mb-6"
          >
            Découvre l'Afrique pièce par pièce
          </motion.p>

          {/* Trophy counter */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-yellow-400 to-yellow-500 shadow-2xl shadow-yellow-500/50 border-2 border-yellow-300"
          >
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, -10, 0],
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <Trophy className="w-7 h-7 text-blue-900" fill="currentColor" />
            </motion.div>
            <span className="text-blue-900 font-display text-3xl font-black">{totalPoints}</span>
            <span className="text-blue-800 font-body text-sm font-bold uppercase tracking-wider">points</span>
          </motion.div>
        </motion.div>

        {/* Levels Grid */}
        <div className="px-4 pb-12 max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {levels.map((level, index) => {
              const unlocked = isLevelUnlocked(level.id);
              const stars = getLevelStars(level.id);
              const maxStars = level.images.length * 3;
              const progress = (stars / maxStars) * 100;

              return (
                <div
                  key={level.id}
                  className={`
                    relative rounded-2xl p-5 cursor-pointer transition-all duration-200
                    ${unlocked 
                      ? 'bg-white shadow-lg hover:shadow-xl border-2 border-yellow-400' 
                      : 'bg-gray-100 border-2 border-gray-300 cursor-not-allowed'
                    }
                  `}
                  onClick={() => unlocked && selectLevel(level.id)}
                >
                  {/* Level number badge */}
                  <div className={`
                    absolute -top-3 -right-3 w-12 h-12 rounded-xl
                    flex items-center justify-center font-display text-xl font-black
                    ${unlocked 
                      ? 'bg-yellow-400 text-blue-900 border-2 border-yellow-500' 
                      : 'bg-gray-400 text-gray-600 border-2 border-gray-500'
                    }
                  `}>
                    {level.id}
                  </div>

                  {/* Content */}
                  <div className="relative">
                    {/* Title */}
                    <div className="mb-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`
                          px-2 py-1 rounded-lg text-xs font-bold
                          ${unlocked 
                            ? 'bg-yellow-400 text-blue-900' 
                            : 'bg-gray-400 text-gray-600'
                          }
                        `}>
                          {level.grid}×{level.grid}
                        </span>
                      </div>
                      
                      <h3 className={`
                        font-display text-xl font-bold
                        ${unlocked ? 'text-blue-900' : 'text-gray-500'}
                      `}>
                        {level.name}
                      </h3>
                      
                      <p className={`text-sm ${unlocked ? 'text-blue-700' : 'text-gray-400'}`}>
                        {level.images.length} puzzles
                      </p>
                    </div>

                    {/* Stars */}
                    <div className={`flex items-center justify-between mb-3 ${!unlocked ? 'opacity-40' : ''}`}>
                      <div className="flex gap-1">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`w-6 h-6 ${stars >= s ? "text-yellow-400" : "text-gray-300"}`}
                            fill={stars >= s ? "currentColor" : "none"}
                            strokeWidth={2}
                          />
                        ))}
                      </div>
                      
                      <div className={`text-sm font-bold ${unlocked ? 'text-blue-800' : 'text-gray-500'}`}>
                        {stars}/{maxStars} ⭐
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className={`bg-blue-100 rounded-full h-2.5 overflow-hidden ${!unlocked ? 'opacity-40' : ''}`}>
                      <div
                        style={{ width: `${progress}%` }}
                        className="h-full bg-yellow-400 transition-all duration-500"
                      />
                    </div>

                    {/* Locked banner at bottom */}
                    {!unlocked && (
                      <div className="mt-3 flex items-center justify-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-lg">
                        <Lock className="w-4 h-4" />
                        <span className="text-sm font-bold">Requis : {level.requiredPoints} points</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

