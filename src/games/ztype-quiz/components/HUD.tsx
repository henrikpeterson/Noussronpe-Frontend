// src/games/ztype-quiz/components/HUD.tsx

import React from 'react';
import { COMBO_TIERS, THEME_COLORS } from '../config/constants';

// ============================================
// TYPES
// ============================================

type Mode = 'sante' | 'academique' | 'anglais' | 'culture';

interface HUDProps {
  /** Combo actuel (streak) — pour le label combo centre écran */
  combo: number;
    /** Vies restantes */
  lives: number;
  /** Nombre max de vies */
  maxLives: number;
  /** Mode de jeu actuel — pour la couleur thème */
  mode: Mode;
  /** Texte de la question actuelle */
  currentQuestion: string;
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

/**
 * Retourne le tier de combo actuel (label + couleur)
 */
function getComboTier(combo: number): { label: string; color: string } {
  for (const tier of COMBO_TIERS) {
    if (combo >= tier.threshold && tier.label) {
      return { label: tier.label, color: tier.color };
    }
  }
  return { label: '', color: '#ffffff' };
}
/**
 * Génère les cœurs de vie
 * ❤ = vie restante, 🖤 = vie perdue
 */
function renderHearts(lives: number, maxLives: number): string {
  let hearts = '';
  for (let i = 0; i < maxLives; i++) {
    hearts += i < lives ? '❤️' : '🖤';
  }
  return hearts;
}
// ============================================
// COMPOSANT
// ============================================

/**
 * HUD — Affichage tête haute du jeu
 *
 * Affiche :
 * - Score
 * - Vies (cœurs)
 * - Combo (avec couleur et label)
 * - Vague actuelle
 * - Mode de jeu
 * - Question actuelle
 *
 * C'est un overlay React par dessus le Canvas.
 * pointer-events: none pour ne pas bloquer les clics.
 */
const HUD: React.FC<HUDProps> = ({
  lives,
  maxLives,
  combo,
  mode,
  currentQuestion,
}) => {
  const themeColor = THEME_COLORS[mode];
  const comboTier = getComboTier(combo);

  return (
    <div className="absolute inset-0 pointer-events-none z-10">



      {/* ===== LABEL COMBO (centre écran) ===== */}
      {comboTier.label && (
        <div className="absolute top-20 left-1/2 -translate-x-1/2">
          <span
            className="text-3xl font-black uppercase tracking-widest animate-bounce"
            style={{
              color: comboTier.color,
              textShadow: `0 0 20px ${comboTier.color}80`,
            }}
          >
            {comboTier.label}
          </span>
        </div>
      )}

        <div className="flex flex-col items-center">
          <span className="text-[10px] uppercase tracking-widest text-gray-500">
            Vies
          </span>
          <span className="text-xl">
            {renderHearts(lives, maxLives)}
          </span>
        </div>

      {/* ===== QUESTION ACTUELLE ===== */}
      {currentQuestion && (
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-full px-5">
          <div
            className="relative flex items-center justify-center px-5 py-2 rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, rgba(129, 127, 6, 0.15) 0%, rgba(4, 105, 80, 0.82) 20%, rgba(134, 132, 21, 0.82) 80%, rgba(151, 100, 34, 0.15) 100%)',
              border: `1px solid ${themeColor}45`,
              boxShadow: `0 0 24px ${themeColor}22, 0 2px 12px rgba(0,0,0,0.6)`,
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Ligne lumineuse en haut */}
            <div
              className="absolute top-0 left-8 right-8 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${themeColor}90, transparent)` }}
            />

            {/* Ligne lumineuse en bas */}
            <div
              className="absolute bottom-0 left-8 right-8 h-px"
              style={{ background: `linear-gradient(90deg, transparent, ${themeColor}40, transparent)` }}
            />

            {/* Losange décoratif gauche */}
            <div
              className="mr-3 w-1.5 h-1.5 rotate-45 flex-shrink-0"
              style={{ background: themeColor, boxShadow: `0 0 6px ${themeColor}` }}
            />

            {/* Texte */}
            <span
              className="text-sm tracking-widest text-center leading-snug uppercase"
              style={{
                color: 'rgba(255, 255, 255, 0.95)',
                textShadow: `0 0 12px ${themeColor}60, 0 1px 4px rgba(244, 248, 13, 0.9)`,
                letterSpacing: '0.08em',
              }}
            >
              {currentQuestion}
            </span>

            {/* Losange décoratif droit */}
            <div
              className="ml-3 w-1.5 h-1.5 rotate-45 flex-shrink-0"
              style={{ background: themeColor, boxShadow: `0 0 6px ${themeColor}` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default HUD;