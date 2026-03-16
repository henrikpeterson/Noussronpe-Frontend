/**
 * Constantes globales du jeu Z-Quiz Togo
 */

// ============================================
// CANVAS — Format portrait 9:16 (arcade cabinet)
// ============================================

export const CANVAS = {
  WIDTH: 450,
  HEIGHT: 800,
  ASPECT_RATIO: 450 / 800,
} as const;

// ============================================
// VAGUES
// ============================================

export const TOTAL_WAVES = 5;
export const WAVE_ANNOUNCE_DURATION = 2000;

export const WAVE_BONUS = {
  PERFECT: 500,
  GREAT: 300,
  GOOD: 100,
  NONE: 0,
} as const;

// ============================================
// SCORING
// ============================================

export const BASE_SCORE = 100;

// ============================================
// COMBO
// ============================================

export const COMBO_TIERS = [
  { threshold: 20, multiplier: 10, label: 'DIVIN !',      color: '#ff00ff' },
  { threshold: 16, multiplier: 8,  label: 'LÉGENDAIRE !', color: '#ff0000' },
  { threshold: 12, multiplier: 5,  label: 'Incroyable !', color: '#ff8800' },
  { threshold: 8,  multiplier: 3,  label: 'Super !',      color: '#ffff00' },
  { threshold: 5,  multiplier: 2,  label: 'Combo !',      color: '#00ff88' },
  { threshold: 0,  multiplier: 1,  label: '',             color: '#ffffff' },
] as const;

export const LIFE_GAIN_COMBO = 15;

// ============================================
// VIES
// ============================================

export const MAX_LIVES = 5;

// ============================================
// PARTICULES
// ============================================

export const PARTICLES_PER_EXPLOSION = 25;
export const PARTICLE_LIFETIME = 1200;
export const PARTICLE_MAX_SPEED = 300;

// ============================================
// SPAWN
// ============================================

export const MIN_SPAWN_INTERVAL = 800;

// ============================================
// COULEURS PAR THÉMATIQUE
// ============================================

export const THEME_COLORS = {
  sante:      '#00ff88',
  academique: '#ffaa00',
  anglais:    '#0096ff',
  mixte:      '#aa00ff',
} as const;

// ============================================
// STOCKAGE LOCAL
// ============================================

export const STORAGE_KEYS = {
  HIGH_SCORE:   'zquiz_high_score',
  BEST_COMBO:   'zquiz_best_combo',
  TOTAL_GAMES:  'zquiz_total_games',
} as const;