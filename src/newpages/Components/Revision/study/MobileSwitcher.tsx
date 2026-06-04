/**
 * ════════════════════════════════════════════════════════════════════════
 * MOBILESWITCHER - Tabs bottom (Mobile only)
 * ════════════════════════════════════════════════════════════════════════
 * 
 * RÔLE :
 * - Affiche 2 boutons en bas de l'écran sur mobile
 * - Permet de basculer entre Théorie et Pratique
 * - Style : Fixed bottom, 2 colonnes, icônes géantes
 * 
 * DESIGN :
 * - Inspiré de Coddy : grandes icônes, pas de texte
 * - Tab active : bordure du haut colorée + bg légèrement teinté
 * - Tab inactive : gris
 * 
 * VISIBILITY :
 * - Visible uniquement sur < 1024px
 * 
 * ════════════════════════════════════════════════════════════════════════
 */

import { motion } from 'framer-motion';
import type { MobileSwitcherProps } from '@/newpages/Components/Revision/study/types';

const MobileSwitcher = ({ 
  activePanel, 
  onSwitch, 
  isPracticeLocked = false 
}: MobileSwitcherProps) => {
  
  /**
   * ═══════════════════════════════════════════════════════════
   * CONFIGURATION DES TABS
   * ═══════════════════════════════════════════════════════════
   */
  const tabs = [
    {
      id: 'theory' as const,
      icon: '📄',
      label: 'Théorie',
      color: '#3B82F6', // Bleu
    },
    {
      id: 'practice' as const,
      icon: '📋',
      label: 'Pratique',
      color: '#10B981', // Vert
      locked: isPracticeLocked,
    },
  ];

  /**
   * ═══════════════════════════════════════════════════════════
   * RENDER
   * ═══════════════════════════════════════════════════════════
   */
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 
                    bg-white border-t-2 border-slate-200 
                    shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      
      <div className="grid grid-cols-2 h-16">
        
        {tabs.map((tab) => {
          const isActive = activePanel === tab.id;
          const isLocked = tab.locked || false;

          return (
            <motion.button
              key={tab.id}
              onClick={() => {
                if (!isLocked) {
                  onSwitch(tab.id);
                }
              }}
              disabled={isLocked}
              
              // ─────────────────────────────────────────────
              // ANIMATION (légère scale au tap)
              // ─────────────────────────────────────────────
              whileTap={!isLocked ? { scale: 0.95 } : {}}
              
              // ─────────────────────────────────────────────
              // STYLES CONDITIONNELS
              // ─────────────────────────────────────────────
              className={`
                relative flex flex-col items-center justify-center 
                transition-all duration-300
                ${isActive 
                  ? 'bg-gradient-to-t from-blue-50/50 to-white' 
                  : 'bg-white text-slate-600'
                }
                ${isLocked ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              
              {/* ─────────────────────────────────────────── */}
              {/* BORDURE DU HAUT (active uniquement) */}
              {/* ─────────────────────────────────────────── */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: tab.color }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}

              {/* ─────────────────────────────────────────── */}
              {/* ICÔNE GRANDE */}
              {/* ─────────────────────────────────────────── */}
              <span className={`text-3xl transition-transform ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                {tab.icon}
              </span>

              {/* ─────────────────────────────────────────── */}
              {/* LABEL (optionnel, petit texte) */}
              {/* ─────────────────────────────────────────── */}
              <span className={`text-[10px] font-bold mt-0.5 ${
                isActive ? 'text-slate-900' : 'text-slate-500'
              }`}>
                {tab.label}
              </span>

              {/* ─────────────────────────────────────────── */}
              {/* ICÔNE LOCK (si verrouillé) */}
              {/* ─────────────────────────────────────────── */}
              {isLocked && (
                <span className="absolute top-2 right-2 text-xs">🔒</span>
              )}

            </motion.button>
          );
        })}

      </div>
    </div>
  );
};

export default MobileSwitcher;