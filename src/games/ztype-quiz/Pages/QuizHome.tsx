// src/games/ztype-quiz/pages/QuizHome.tsx
import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Heart, BookOpen, Globe, Shuffle } from 'lucide-react';

type Mode = 'sante' | 'academique' | 'anglais' | 'culture';
type Difficulty = 'easy' | 'medium' | 'hard';

interface QuizHomeProps {
  onStart: (mode: Mode, difficulty: Difficulty) => void;
}

const MODES = [
  {
    mode: 'sante' as Mode,
    label: 'Santé Préventive',
    desc: 'Hygiène, nutrition, premiers secours',
    emoji: '🫀',
    selectedClass: 'border-emerald-400 shadow-emerald-500/40',
    selectedBg: 'bg-gradient-to-br from-emerald-500/25 to-green-600/15',
    iconColor: 'text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.35)',
    accentBar: 'from-emerald-400 to-green-400',
    hoverBorder: 'hover:border-emerald-500/50',
    hoverBg: 'hover:bg-emerald-500/8',
  },
  {
    mode: 'academique' as Mode,
    label: 'Académique',
    desc: 'Sciences, maths, culture générale',
    emoji: '🎓',
    selectedClass: 'border-amber-400 shadow-amber-500/40',
    selectedBg: 'bg-gradient-to-br from-amber-500/25 to-yellow-600/15',
    iconColor: 'text-amber-400',
    glowColor: 'rgba(251, 191, 36, 0.35)',
    accentBar: 'from-amber-400 to-yellow-400',
    hoverBorder: 'hover:border-amber-500/50',
    hoverBg: 'hover:bg-amber-500/8',
  },
  {
    mode: 'anglais' as Mode,
    label: 'Anglais',
    desc: 'Vocabulaire, traductions, expressions',
    emoji: '🌍',
    selectedClass: 'border-sky-400 shadow-sky-500/40',
    selectedBg: 'bg-gradient-to-br from-sky-500/25 to-cyan-600/15',
    iconColor: 'text-sky-400',
    glowColor: 'rgba(56, 189, 248, 0.35)',
    accentBar: 'from-sky-400 to-cyan-400',
    hoverBorder: 'hover:border-sky-500/50',
    hoverBg: 'hover:bg-sky-500/8',
  },
  {
    mode: 'culture' as Mode,
    label: 'Culture General',
    desc: 'Un peu de tout, surprise !',
    emoji: '🎲',
    selectedClass: 'border-fuchsia-400 shadow-fuchsia-500/40',
    selectedBg: 'bg-gradient-to-br from-fuchsia-500/25 to-purple-600/15',
    iconColor: 'text-fuchsia-400',
    glowColor: 'rgba(232, 121, 249, 0.35)',
    accentBar: 'from-fuchsia-400 to-purple-400',
    hoverBorder: 'hover:border-fuchsia-500/50',
    hoverBg: 'hover:bg-fuchsia-500/8',
  },
] as const;

const DIFFICULTIES = [
  {
    diff: 'easy' as Difficulty,
    label: 'FACILE',
    desc: 'Réponses courtes, vitesse lente',
    emoji: '🟢',
    selectedBg: 'bg-gradient-to-r from-emerald-500 to-green-500',
    selectedShadow: 'shadow-emerald-500/50',
    hoverBg: 'hover:bg-emerald-500/15 hover:border-emerald-500/60',
    hoverText: 'hover:text-emerald-300',
    dotColor: 'bg-emerald-400',
    dotGlow: 'shadow-emerald-400/80',
    idleBorder: 'border-emerald-500/55',
    idleText: 'text-emerald-300/80',
    idleGlow: '0 0 14px rgba(52,211,153,0.2), inset 0 0 12px rgba(52,211,153,0.07)',
  },
  {
    diff: 'medium' as Difficulty,
    label: 'MOYEN',
    desc: 'Pièges, vitesse moyenne',
    emoji: '🟡',
    selectedBg: 'bg-gradient-to-r from-amber-500 to-yellow-500',
    selectedShadow: 'shadow-amber-500/50',
    hoverBg: 'hover:bg-amber-500/15 hover:border-amber-500/60',
    hoverText: 'hover:text-amber-300',
    dotColor: 'bg-amber-400',
    dotGlow: 'shadow-amber-400/80',
    idleBorder: 'border-amber-500/55',
    idleText: 'text-amber-300/80',
    idleGlow: '0 0 14px rgba(251,191,36,0.2), inset 0 0 12px rgba(251,191,36,0.07)',
  },
  {
    diff: 'hard' as Difficulty,
    label: 'DIFFICILE',
    desc: 'Questions dures, rapide',
    emoji: '🔴',
    selectedBg: 'bg-gradient-to-r from-rose-500 to-red-500',
    selectedShadow: 'shadow-rose-500/50',
    hoverBg: 'hover:bg-rose-500/15 hover:border-rose-500/60',
    hoverText: 'hover:text-rose-300',
    dotColor: 'bg-rose-400',
    dotGlow: 'shadow-rose-400/80',
    idleBorder: 'border-rose-500/55',
    idleText: 'text-rose-300/80',
    idleGlow: '0 0 14px rgba(251,113,133,0.2), inset 0 0 12px rgba(251,113,133,0.07)',
  },
] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
};
const childVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

const QuizHome: React.FC<QuizHomeProps> = ({ onStart }) => {
  const [selectedMode, setSelectedMode] = React.useState<Mode>('sante');
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<Difficulty>('easy');

  const handleStart = useCallback(() => {
    onStart(selectedMode, selectedDifficulty);
  }, [onStart, selectedMode, selectedDifficulty]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') handleStart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleStart]);

  const currentMode = MODES.find(m => m.mode === selectedMode)!;
  const currentDiff = DIFFICULTIES.find(d => d.diff === selectedDifficulty)!;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="min-h-screen text-white flex flex-col items-center justify-center px-4 py-8 sm:p-8 relative overflow-hidden"
      style={{
        background: 'radial-gradient(ellipse at 20% 30%, #1e1b4b 0%, #0f0a1e 40%, #0a0014 70%, #000008 100%)',
      }}
    >
      {/* ===== Nebula / glow de fond ===== */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(ellipse 60% 40% at 15% 20%, rgba(99,40,180,0.18) 0%, transparent 60%),
            radial-gradient(ellipse 50% 35% at 85% 75%, rgba(30,80,180,0.14) 0%, transparent 60%),
            radial-gradient(ellipse 40% 30% at 50% 50%, rgba(80,20,140,0.1) 0%, transparent 70%)
          `,
        }}
      />

      {/* ===== Étoiles de fond ===== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 70 }).map((_, i) => {
          const size = Math.random() * 2.5 + 0.5;
          const isBright = Math.random() > 0.85;
          return (
            <div
              key={i}
              className="absolute rounded-full animate-pulse"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: isBright ? Math.random() * 0.5 + 0.5 : Math.random() * 0.3 + 0.1,
                background: isBright
                  ? `hsl(${Math.random() * 60 + 180}, 80%, 90%)`
                  : 'white',
                boxShadow: isBright ? `0 0 ${size * 3}px rgba(150,220,255,0.6)` : 'none',
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 2}s`,
              }}
            />
          );
        })}
      </div>

      {/* ===== Contenu principal ===== */}
      <div className="relative z-10 text-center max-w-4xl w-full">

        {/* ---- Logo ---- */}
        <motion.div variants={childVariants} className="mb-1">
          <h1
            className="text-5xl sm:text-7xl font-extrabold tracking-wider"
            style={{
              background: 'linear-gradient(135deg, #67e8f9 0%, #4ade80 45%, #facc15 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 0 30px rgba(103, 232, 249, 0.3))',
              letterSpacing: '0.08em',
            }}
          >
            Z-QUIZ TOGO
          </h1>
        </motion.div>

        <motion.p
          variants={childVariants}
          className="text-base sm:text-lg text-indigo-200/60 mb-10 max-w-xl mx-auto leading-relaxed"
        >
          Révise en t'amusant ! Tape les bonnes réponses
          avant qu'elles ne touchent le sol.
        </motion.p>

        {/* ===== Choix de la thématique ===== */}
        <motion.section variants={childVariants} className="mb-10">
          <h2
            className="text-lg sm:text-xl font-bold mb-5 tracking-widest uppercase"
            style={{
              background: 'linear-gradient(90deg, #67e8f9, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.15em',
            }}
          >
            Choisis ta thématique
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
            {MODES.map((item) => {
              const isSelected = selectedMode === item.mode;
              

              return (
                <motion.button
                  key={item.mode}
                  whileHover={{ scale: 1.04, y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedMode(item.mode)}
                  aria-pressed={isSelected}
                  className={`
                    relative p-5 rounded-2xl border-2 backdrop-blur-sm
                    transition-all duration-300 cursor-pointer text-left
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/60
                    ${isSelected
                      ? `${item.selectedBg} ${item.selectedClass} shadow-xl`
                      : `bg-white/[0.04] border-white/10 ${item.hoverBorder} ${item.hoverBg}`
                    }
                  `}
                  style={isSelected ? { boxShadow: `0 8px 32px ${item.glowColor}, 0 0 0 1px ${item.glowColor}` } : {}}
                >
                  {/* Barre de couleur en haut */}
                  <div
                    className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${item.accentBar} transition-all duration-300 ${isSelected ? 'opacity-100' : 'opacity-0'}`}
                  />

                  {/* Checkmark animé */}
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, rotate: -90 }}
                      animate={{ scale: 1, rotate: 0 }}
                      className={`absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${item.iconColor}`}
                      style={{ background: 'rgba(255,255,255,0.12)' }}
                    >
                      ✓
                    </motion.div>
                  )}

                  {/* Emoji grand + icône */}
                  <div className="mb-3 flex flex-col items-center">
                    <span className="text-3xl mb-1">{item.emoji}</span>

                  </div>

                  <span className={`text-sm sm:text-base font-bold block text-center transition-colors duration-300 ${isSelected ? 'text-white' : 'text-white/60'}`}>
                    {item.label}
                  </span>
                  <span className={`text-xs mt-1 block text-center leading-snug transition-colors duration-300 ${isSelected ? 'text-white/70' : 'text-white/30'}`}>
                    {item.desc}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ===== Choix de la difficulté ===== */}
        <motion.section variants={childVariants} className="mb-10">
          <h2
            className="text-lg sm:text-xl font-bold mb-5 tracking-widest uppercase"
            style={{
              background: 'linear-gradient(90deg, #67e8f9, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '0.15em',
            }}
          >
            Choisis ta difficulté
          </h2>

          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            {DIFFICULTIES.map((item) => {
              const isSelected = selectedDifficulty === item.diff;

              return (
                <motion.button
                  key={item.diff}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setSelectedDifficulty(item.diff)}
                  aria-pressed={isSelected}
                  className={`
                    relative px-7 py-4 rounded-xl font-bold text-sm sm:text-base
                    transition-all duration-300 cursor-pointer border-2
                    focus:outline-none focus:ring-2 focus:ring-cyan-400/60
                    min-w-[140px]
                    ${isSelected
                      ? `${item.selectedBg} border-transparent text-white shadow-xl ${item.selectedShadow}`
                      : `bg-white/[0.03] ${item.idleBorder} ${item.idleText} ${item.hoverBg} ${item.hoverText}`
                    }
                  `}
                >
                  {/* Dot indicateur */}
                  <span className="flex items-center justify-center gap-2 mb-1">
                    <span
                      className={`inline-block w-2.5 h-2.5 rounded-full transition-all duration-300 ${item.dotColor} ${isSelected ? `shadow-lg ${item.dotGlow}` : 'opacity-40'}`}
                    />
                    <span className="font-extrabold tracking-wide">{item.label}</span>
                  </span>
                  <span className={`block text-xs font-normal leading-snug transition-opacity duration-300 ${isSelected ? 'opacity-80' : 'opacity-40'}`}>
                    {item.desc}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </motion.section>

        {/* ===== Bouton JOUER ===== */}
        <motion.div variants={childVariants}>
          <motion.button
            whileHover={{
              scale: 1.06,
              boxShadow: `0 0 60px ${currentMode.glowColor}, 0 0 20px rgba(0,255,200,0.2)`,
            }}
            whileTap={{ scale: 0.97 }}
            onClick={handleStart}
            className="
              mt-4 px-12 py-5
              text-white text-xl sm:text-2xl font-extrabold
              rounded-2xl
              transition-all duration-300
              inline-flex items-center gap-3
              focus:outline-none focus:ring-4 focus:ring-cyan-400/50
              tracking-widest
            "
            style={{
              background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
              boxShadow: '0 0 30px rgba(6,182,212,0.35), 0 4px 20px rgba(0,0,0,0.4)',
            }}
          >
            <Play className="w-6 h-6 fill-white" />
            JOUER !
          </motion.button>

          <p className="text-white/25 text-xs mt-3">
            ou appuie sur{' '}
            <kbd className="px-2 py-0.5 rounded text-white/50 font-mono text-xs border border-white/20 bg-white/10">
              Entrée
            </kbd>
          </p>
        </motion.div>
      </div>
      
    </motion.div>
  );
};

export default QuizHome;