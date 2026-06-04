/**
 * ════════════════════════════════════════════════════════════════════════
 * MODESELECTOR - Choix Quiz ou Flashcard
 * ════════════════════════════════════════════════════════════════════════
 * 
 * RÔLE :
 * - Affiche 2 boutons stylisés (Quiz / Flashcard)
 * - Style hexagonal/3D inspiré du Roadmap
 * - Animation hover/tap avec Framer Motion
 * 
 * DESIGN :
 * - Boutons rectangulaires avec effet 3D subtil
 * - Icônes emoji grandes + texte
 * - Effet hover : légère élévation + changement ombre
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import type { ModeSelectorProps } from '@/newpages/Components/Revision/study/types';

const ModeSelector = ({ onSelect }: ModeSelectorProps) => {
  
  /**
   * ═══════════════════════════════════════════════════════════
   * CONFIGURATION DES MODES
   * ═══════════════════════════════════════════════════════════
   */
  const modes = [
    {
      id: 'quiz' as const,
      icon: '📝',
      title: 'Quiz',
      description: 'Questions à choix multiples',
      gradient: 'from-blue-50 to-indigo-50',
      hoverGradient: 'from-blue-100 to-indigo-100',
    },
    {
      id: 'flashcard' as const,
      icon: '🎴',
      title: 'Flashcards',
      description: 'Cartes mémo interactives',
      gradient: 'from-green-50 to-emerald-50',
      hoverGradient: 'from-green-100 to-emerald-100',
    },
  ];

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <div className="bg-white rounded-3xl p-8 border-2 border-slate-100 
                    shadow-lg min-h-[500px] flex flex-col items-center 
                    justify-center">
      
      {/* ═══ TITRE ═══ */}
      <h2 className="text-2xl md:text-3xl font-black text-slate-900 
                     text-center mb-3">
        Comment veux-tu t'entraîner ?
      </h2>

      <p className="text-slate-600 text-sm md:text-base text-center mb-10">
        Choisis ton mode d'apprentissage
      </p>

      {/* ═══ BOUTONS MODES ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        
        {modes.map((mode) => (
          <motion.button
            key={mode.id}
            onClick={() => onSelect(mode.id)}
            
            // ─────────────────────────────────────────────────
            // ANIMATIONS FRAMER MOTION
            // ─────────────────────────────────────────────────
            whileHover={{ 
              scale: 1.05,      // Légère augmentation
              y: -4,            // Lift vers le haut
            }}
            whileTap={{ 
              scale: 0.98,      // Compression au clic
              y: 0,
            }}
            
            // ─────────────────────────────────────────────────
            // STYLES (effet 3D avec gradients + ombre)
            // ─────────────────────────────────────────────────
            className={`group relative bg-gradient-to-br ${mode.gradient} 
                       hover:bg-gradient-to-br hover:${mode.hoverGradient}
                       border-2 border-slate-200 hover:border-slate-300
                       rounded-3xl p-8 
                       shadow-lg hover:shadow-2xl 
                       transition-all duration-300`}
          >
            
            {/* Effet de surbrillance au hover (optionnel) */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/50 to-transparent 
                            rounded-3xl opacity-0 group-hover:opacity-100 
                            transition-opacity pointer-events-none" />

            {/* Contenu du bouton */}
            <div className="relative z-10 text-center">
              
              {/* Icône emoji grande */}
              <div className="text-6xl md:text-7xl mb-4">
                {mode.icon}
              </div>

              {/* Titre du mode */}
              <h3 className="text-xl md:text-2xl font-black text-slate-900 mb-2">
                {mode.title}
              </h3>

              {/* Description */}
              <p className="text-sm md:text-base text-slate-600 font-medium">
                {mode.description}
              </p>

            </div>

          </motion.button>
        ))}

      </div>

      {/* ═══ NOTE INFORMATIVE ═══ */}
      <p className="text-xs text-slate-500 text-center mt-8 max-w-md">
        💡 Tu devras terminer le mode choisi avant de pouvoir en sélectionner un autre
      </p>

    </div>
  );
};

export default ModeSelector;