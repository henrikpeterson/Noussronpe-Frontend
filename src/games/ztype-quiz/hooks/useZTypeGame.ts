// src/games/ztype-quiz/hooks/useZTypeGame.ts

import { useRef, useReducer, useCallback, useEffect } from 'react';

import { Renderer }      from '../engine/Renderer';
import type { Projectile } from '../engine/Renderer';
import { GameLoop }      from '../engine/GameLoop';
import { EnemyManager }  from '../engine/EnemyManager';
import { WaveManager }   from '../engine/WaveManager';
import type { Question } from '../engine/WaveManager';
import type { Enemy }    from '../engine/EnemyManager';

import {
  BASE_SCORE,
  COMBO_TIERS,
  LIFE_GAIN_COMBO,
  MAX_LIVES,
} from '../config/constants';

import { getDifficultyConfig } from '../config/difficulty';

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// TYPES PUBLICS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

type Mode       = 'sante' | 'academique' | 'anglais' | 'culture';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameStatus = 'idle' | 'playing' | 'paused' | 'waveTransition' | 'gameover';

export interface GameResults {
  score:          number;
  wave:           number;
  correctAnswers: number;
  totalAttempts:  number;
  accuracy:       number;
  maxCombo:       number;
  duration:       number;
  isVictory:      boolean;
}

export interface UseZTypeGameReturn {
  gameStatus:      GameStatus;
  score:           number;
  lives:           number;
  combo:           number;
  wave:            number;
  currentQuestion: string;
  isVictory:       boolean;
  initGame:        (ctx: CanvasRenderingContext2D) => void;
  handleKeyPress:  (letter: string) => void;
  pause:           () => void;
  resume:          () => void;
  cleanup:         () => void;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// REDUCER — STATE & ACTIONS
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface GameState {
  status:          GameStatus;
  score:           number;
  lives:           number;
  combo:           number;
  wave:            number;
  currentQuestion: string;
  isVictory:       boolean;
}

type GameAction =
  | { type: 'INIT';           payload: { lives: number; currentQuestion: string } }
  | { type: 'SET_STATUS';     payload: GameStatus }
  | { type: 'SET_QUESTION';   payload: string }
  | { type: 'NEXT_WAVE';      payload: { wave: number } }
  | { type: 'CORRECT_ANSWER'; payload: { points: number; gainLife: boolean } }
  | { type: 'WRONG_ANSWER';   payload: { livesLost: number } }
  | { type: 'BOTTOM_HIT';     payload: { livesLost: number } }
  | { type: 'GAME_OVER';      payload: { isVictory: boolean } };

const initialState: GameState = {
  status:          'idle',
  score:           0,
  lives:           0,
  combo:           0,
  wave:            1,
  currentQuestion: '',
  isVictory:       false,
};

/**
 * gameReducer — Fonction pure extraite du hook.
 * Toutes les transitions d'état passent ici.
 * Pas d'effets de bord, pas de refs, pas d'appels externes.
 */
function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {

    case 'INIT':
      return { ...initialState, status: 'playing', lives: action.payload.lives, currentQuestion: action.payload.currentQuestion };

    case 'SET_STATUS':
      return { ...state, status: action.payload };

    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.payload };

    case 'NEXT_WAVE':
      return { ...state, wave: action.payload.wave };

    case 'CORRECT_ANSWER': {
      const newCombo = state.combo + 1;
      const newLives = action.payload.gainLife
        ? Math.min(state.lives + 1, MAX_LIVES)
        : state.lives;
      return { ...state, score: state.score + action.payload.points, combo: newCombo, lives: newLives };
    }

    case 'WRONG_ANSWER': {
      const newLives = Math.max(state.lives - action.payload.livesLost, 0);
      return {
        ...state,
        combo:  0,
        lives:  newLives,
        status: newLives <= 0 ? 'gameover' : state.status,
      };
    }

    case 'BOTTOM_HIT': {
      const newLives = Math.max(state.lives - action.payload.livesLost, 0);
      return {
        ...state,
        combo:  0,
        lives:  newLives,
        status: newLives <= 0 ? 'gameover' : state.status,
      };
    }

    case 'GAME_OVER':
      return { ...state, status: 'gameover', isVictory: action.payload.isVictory };

    default:
      return state;
  }
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// UTILITAIRES PURS — extraits du hook, jamais recréés
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function getComboMultiplier(combo: number): number {
  for (const tier of COMBO_TIERS) {
    if (combo >= tier.threshold) return tier.multiplier;
  }
  return 1;
}

function drawEnemy(ctx: CanvasRenderingContext2D, enemy: Enemy): void {
  const { x, y, fullText, remainingText, isTargeted, isTrap } = enemy;
  ctx.save();

  // ── Couleurs selon l'état ────────────────────────────────
  // Ciblé   : cyan vif
  // Piège   : rouge
  // Normal  : blanc légèrement verdâtre (cohérent avec la teinte Z-Type)
  let mainColor   = '#ffffffff'; // blanc-vert doux pour les mots normaux
  if (isTargeted) mainColor = '#00f0ff'; // cyan quand ciblé
  if (isTrap)     mainColor = '#ff5555'; // rouge pour les pièges

  // Toxigenesis Bold — police futuriste chargée au démarrage dans initGame
  // Taille légèrement augmentée car la police est plus étroite que Courier New
  const font = isTargeted ? '14px "Courier New"'
                          : '600 16px "Courier New"';
  const padding   = { x: 12, y: 6 };

  // ── Mesure du texte ──────────────────────────────────────
  ctx.font = font;
  const displayText = fullText;
  const textW       = ctx.measureText(displayText).width;
  const boxW        = textW + padding.x * 2;
  const boxH        = 20;
  const boxX        = x - boxW / 2;
  const boxY        = y - boxH / 2;

  // Fond semi-transparent très sombre pour la lisibilité
  ctx.fillStyle   = isTargeted
    ? 'rgba(0, 20, 30, 0.88)'
    : isTrap
      ? 'rgba(30, 0, 0, 0.82)'
      : 'rgba(0, 10, 8, 0.80)';

  ctx.beginPath();
  ctx.roundRect(boxX, boxY, boxW, boxH, 5);
  ctx.fill();

  // ── Bordure colorée ──────────────────────────────────────
  ctx.strokeStyle = mainColor + (isTargeted ? 'cc' : '55');
  ctx.lineWidth   = isTargeted ? 1.5 : 0.8;
  ctx.stroke();

  // ── Texte lettre par lettre ──────────────────────────────
  ctx.shadowBlur   = isTargeted ? 12 : 0;
  ctx.shadowColor  = mainColor;
  ctx.textAlign    = 'left';
  ctx.textBaseline = 'middle';

  const typedCount = fullText.length - remainingText.length;
  const startX     = boxX + padding.x;

  let cursorX = startX;
  for (let i = 0; i < displayText.length; i++) {
    const char  = displayText[i];
    const charW = ctx.measureText(char).width;

    if (i < typedCount) {
      // Lettre déjà tapée → grisée et barrée
      ctx.fillStyle = 'rgba(120, 140, 120, 0.35)';
    } else if (i === typedCount && isTargeted) {
      // Prochaine lettre à taper → surlignée
      ctx.fillStyle = '#ffffff';
      ctx.shadowBlur = 18;
    } else {
      ctx.fillStyle  = mainColor;
      ctx.shadowBlur = isTargeted ? 8 : 0;
    }

    ctx.fillText(char, cursorX, y);
    cursorX += charW;
  }

  // ── Indicateur de ciblage (petit triangle en bas) ───────
  if (isTargeted) {
    ctx.fillStyle   = mainColor;
    ctx.shadowBlur  = 10;
    ctx.shadowColor = mainColor;
    ctx.beginPath();
    ctx.moveTo(x - 4, boxY + boxH + 2);
    ctx.lineTo(x + 4, boxY + boxH + 2);
    ctx.lineTo(x,     boxY + boxH + 8);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// HOOK PRINCIPAL
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export function useZTypeGame(
  mode:         Mode,
  difficulty:   Difficulty,
  questions:    Question[],
  onGameOver:   (results: GameResults) => void,
  bgImageSrc:   string,
  gridImageSrc: string,
  shipImageSrc:    string,
  plasmaImageSrc:  string,
): UseZTypeGameReturn {

  const [state, dispatch] = useReducer(gameReducer, initialState);

  // ── Refs engine ────────────────────────────────────────────
  const rendererRef  = useRef<Renderer | null>(null);
  const gameLoopRef  = useRef<GameLoop | null>(null);
  const enemyMgrRef  = useRef<EnemyManager | null>(null);
  const waveMgrRef   = useRef<WaveManager | null>(null);
  const targetedRef  = useRef<Enemy | null>(null);
  const waveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Ref projectiles ────────────────────────────────────────
  // Tableau mutable des projectiles actifs.
  // Géré en ref (pas en state) car muté à 60fps → pas de re-render.
  const projectilesRef = useRef<Projectile[]>([]);

  // Compteur d'ID unique pour chaque projectile
  const projNextIdRef  = useRef<number>(0);

  // Vitesse des projectiles en px/s
  // Assez rapide pour sembler instantané, assez lent pour être visible
  const PROJECTILE_SPEED = 600;

  // ── Ref miroir du state complet ────────────────────────────
  // Permet aux callbacks de la game loop de lire les valeurs
  // courantes SANS être dans leurs dépendances (évite les closures périmées).
  const stateRef = useRef(state);
  useEffect(() => { stateRef.current = state; }, [state]);

  // ── Stats non-rendues ──────────────────────────────────────
  const statsRef = useRef({ correctAnswers: 0, totalAttempts: 0, maxCombo: 0, startTime: 0 });

  const diffConfig = getDifficultyConfig(difficulty);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // UTILITAIRES ENGINE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const getFallSpeed = useCallback(
    (h: number, d: number) => h / d, []
  );

  const removeCurrentCorrectAnswer = useCallback(() => {
    const em = enemyMgrRef.current;
    if (!em) return;
    for (const e of em.getEnemies()) {
      if (e.isCorrect) { em.removeById(e.id); break; }
    }
  }, []);

  /** Remplit le pool — appelé sur événement uniquement, jamais à 60fps */
  const fillPool = useCallback(() => {
    const em = enemyMgrRef.current;
    const wm = waveMgrRef.current;
    if (!em || !wm) return;

    wm.syncActiveWords(em.getEnemies().map((e) => e.fullText));
    const words = wm.getWordsToSpawn(em.getCount(), diffConfig.poolSize);
    for (const word of words) em.spawn(word);
  }, [diffConfig.poolSize]);

  const syncQuestion = useCallback(() => {
    const wm = waveMgrRef.current;
    if (!wm) return;
    dispatch({ type: 'SET_QUESTION', payload: wm.getQuestionText() });
  }, []);

  const syncCorrectFlags = useCallback(() => {
    const em = enemyMgrRef.current;
    const wm = waveMgrRef.current;
    if (!em || !wm) return;
    em.updateCorrectAnswer(wm.getCorrectAnswer());
  }, []);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // FIN DE PARTIE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const endGame = useCallback((isVictory: boolean) => {
    gameLoopRef.current?.stop();
    dispatch({ type: 'GAME_OVER', payload: { isVictory } });

    // score et wave lus via stateRef → pas de closure périmée
    const { score, wave } = stateRef.current;
    const stats    = statsRef.current;
    const duration = Math.floor((Date.now() - stats.startTime) / 1000);
    const accuracy = stats.totalAttempts > 0
      ? Math.floor((stats.correctAnswers / stats.totalAttempts) * 100)
      : 0;

    onGameOver({ score, wave, correctAnswers: stats.correctAnswers,
      totalAttempts: stats.totalAttempts, accuracy,
      maxCombo: stats.maxCombo, duration, isVictory });
  }, [onGameOver]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // GESTION DES VAGUES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleWaveComplete = useCallback(() => {
    const wm = waveMgrRef.current;
    const em = enemyMgrRef.current;
    const gl = gameLoopRef.current;
    if (!wm || !em || !gl) return;

    gl.pause();
    dispatch({ type: 'SET_STATUS', payload: 'waveTransition' });
    targetedRef.current = null;
    em.clear();

    const hasNext = wm.nextWave();
    if (!hasNext) { endGame(true); return; }

    const nextWave = wm.getState();
    dispatch({ type: 'NEXT_WAVE', payload: { wave: nextWave.currentWave } });

    // Timer stocké en ref → nettoyé proprement au démontage
    waveTimerRef.current = setTimeout(() => {
      waveTimerRef.current = null;
      const canvas = rendererRef.current?.getCanvas();
      if (canvas) {
        em.setFallSpeed(getFallSpeed(canvas.height, nextWave.fallDuration));
      }
      syncQuestion();
      fillPool();
      syncCorrectFlags();
      dispatch({ type: 'SET_STATUS', payload: 'playing' });
      gl.resume();
    }, 2000);
  }, [endGame, fillPool, syncQuestion, syncCorrectFlags, getFallSpeed]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // AVANCER À LA QUESTION SUIVANTE
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const advanceQuestion = useCallback(() => {
    const wm = waveMgrRef.current;
    if (!wm) return;
    const hasMore = wm.nextQuestion();
    if (!hasMore) {
      handleWaveComplete();
    } else {
      syncQuestion();
      syncCorrectFlags();
      fillPool();
    }
  }, [handleWaveComplete, syncQuestion, syncCorrectFlags, fillPool]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ENNEMI DÉTRUIT
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PROJECTILES
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /**
   * Tire un projectile depuis le vaisseau vers la cible (ennemi)
   *
   * Calcule l'angle une seule fois au spawn pour que le sprite
   * plasma pointe toujours dans la bonne direction pendant tout
   * son trajet. L'angle est fixe car la cible est un ennemi en
   * mouvement — on vise la position au moment du tir (comme Z-Type).
   *
   * @param shipX  - Position X du vaisseau (centre du canvas)
   * @param shipY  - Position Y du vaisseau (bas du canvas)
   * @param target - L'ennemi ciblé
   */
  const fireProjectile = useCallback((
    shipX: number,
    shipY: number,
    target: Enemy,
  ) => {
    // Calcul de l'angle entre le vaisseau et la cible au moment du tir
    // +PI/2 car le sprite plasma pointe vers le HAUT par défaut
    const angle = Math.atan2(target.y - shipY, target.x - shipX) + Math.PI / 2;

    const proj: Projectile = {
      id:    projNextIdRef.current++,
      x:     shipX,      // départ depuis le vaisseau
      y:     shipY,
      tx:    target.x,   // destination : position actuelle de l'ennemi
      ty:    target.y,
      speed: PROJECTILE_SPEED,
      angle,
      done:  false,
    };

    projectilesRef.current.push(proj);
  }, []);

  /**
   * Met à jour tous les projectiles actifs (appelé dans la game loop à 60fps)
   *
   * Chaque projectile se déplace en ligne droite vers sa cible (tx, ty).
   * Quand il est assez proche (< 8px), il est marqué "done" et sera retiré
   * du tableau au prochain passage de nettoyage.
   *
   * @param deltaTime - Temps écoulé depuis la dernière frame (secondes)
   */
  const updateProjectiles = useCallback((deltaTime: number) => {
    const projs = projectilesRef.current;

    for (const proj of projs) {
      if (proj.done) continue;

      // Vecteur direction vers la cible
      const dx   = proj.tx - proj.x;
      const dy   = proj.ty - proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 8) {
        // Projectile arrivé à destination → marquer comme terminé
        proj.done = true;
        continue;
      }

      // Normaliser le vecteur et avancer selon la vitesse
      const nx = dx / dist;
      const ny = dy / dist;
      proj.x  += nx * proj.speed * deltaTime;
      proj.y  += ny * proj.speed * deltaTime;
    }

    // Nettoyer les projectiles terminés hors de la boucle de mise à jour
    projectilesRef.current = projs.filter((p) => !p.done);
  }, []);

  const handleEnemyDestroyed = useCallback((enemy: Enemy) => {
    const em = enemyMgrRef.current;
    if (!em) return;

    targetedRef.current = null;
    em.removeById(enemy.id);
    statsRef.current.totalAttempts++;

    if (enemy.isCorrect) {
      statsRef.current.correctAnswers++;

      // Combo lu depuis stateRef → valeur exacte, pas de décalage d'un rendu
      const currentCombo = stateRef.current.combo;
      const multiplier   = getComboMultiplier(currentCombo);
      const points       = BASE_SCORE * multiplier;
      const newCombo     = currentCombo + 1;
      const gainLife     = newCombo === LIFE_GAIN_COMBO;

      if (newCombo > statsRef.current.maxCombo) statsRef.current.maxCombo = newCombo;

      dispatch({ type: 'CORRECT_ANSWER', payload: { points, gainLife } });
      advanceQuestion();

    } else {
      // Lire les vies depuis stateRef avant le dispatch
      if (stateRef.current.lives - 1 <= 0) {
        endGame(false);
        return;
      }
      dispatch({ type: 'WRONG_ANSWER', payload: { livesLost: 1 } });
      removeCurrentCorrectAnswer();
      advanceQuestion();
    }
  }, [advanceQuestion, endGame, removeCurrentCorrectAnswer]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // ENNEMIS QUI TOUCHENT LE BAS
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const handleEnemiesReachedBottom = useCallback((enemies: Enemy[]) => {
    if (enemies.length === 0) return;

    let livesLost     = 0;
    let advanceNeeded = false;

    for (const enemy of enemies) {
      if (targetedRef.current?.id === enemy.id) targetedRef.current = null;
      livesLost++;
      if (enemy.isCorrect) advanceNeeded = true;
    }

    // Un seul dispatch pour toutes les vies perdues simultanément (fix bug 2)
    dispatch({ type: 'BOTTOM_HIT', payload: { livesLost } });

    if (stateRef.current.lives - livesLost <= 0) {
      endGame(false);
      return;
    }

    if (advanceNeeded) advanceQuestion();
    fillPool();
  }, [fillPool, advanceQuestion, endGame]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // SAISIE LETTRE PAR LETTRE (Z-TYPE)
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const findEnemyStartingWith = useCallback((
  letter: string, enemies: readonly Enemy[]
): Enemy | null => {

  // ── Priorité 1 : bonne réponse qui commence par cette lettre ──
  // Si elle existe, on la cible TOUJOURS en premier
  for (const enemy of enemies) {
    if (enemy.isTargeted) continue;
    if (!enemy.isCorrect) continue;
    const first = enemy.remainingText[0]?.toLowerCase();
    if (first === letter) return enemy as Enemy;
  }

  // ── Priorité 2 : n'importe quel mot (le plus bas = le plus dangereux) ──
  // Comportement original — seulement si aucune bonne réponse ne matche
  let best: Enemy | null = null;
  let bestY = -Infinity;
  for (const enemy of enemies) {
    if (enemy.isTargeted) continue;
    const first = enemy.remainingText[0]?.toLowerCase();
    if (first === letter && enemy.y > bestY) { best = enemy as Enemy; bestY = enemy.y; }
  }
  return best;

}, []);

  const handleKeyPress = useCallback((letter: string) => {
    if (stateRef.current.status !== 'playing') return;
    const em = enemyMgrRef.current;
    if (!em) return;

    const norm    = letter.toLowerCase();
    const enemies = em.getEnemies();

    if (!targetedRef.current) {
      const target = findEnemyStartingWith(norm, enemies);
      if (!target) return;
      targetedRef.current  = target;
      target.isTargeted    = true;
      target.remainingText = target.remainingText.slice(1);

      // Tirer un projectile vers la cible lors du premier ciblage
      const canvas = rendererRef.current?.getCanvas();
      if (canvas) {
        fireProjectile(canvas.width / 2, canvas.height - 60, target);
      }

      if (target.remainingText.length === 0) handleEnemyDestroyed(target);
      return;
    }

    const target     = targetedRef.current;
    const nextLetter = target.remainingText[0]?.toLowerCase();

    if (norm === nextLetter) {
      target.remainingText = target.remainingText.slice(1);

      // Tirer un projectile à chaque lettre correcte tapée
      const canvas = rendererRef.current?.getCanvas();
      if (canvas) {
        fireProjectile(canvas.width / 2, canvas.height - 60, target);
      }

      if (target.remainingText.length === 0) handleEnemyDestroyed(target);
    } else {
      target.remainingText = target.fullText;
      target.isTargeted    = false;
      targetedRef.current  = null;
    }
  }, [findEnemyStartingWith, fireProjectile, handleEnemyDestroyed]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // INITIALISATION
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const initGame = useCallback(async (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;

    // ── Chargement de la police Toxigenesis Bold ──────────────
    // On charge la police via FontFace API avant de lancer le jeu
    // pour éviter que le premier frame affiche un fallback de police.
    // Le fichier .otf doit être dans : assets/fonts/toxigenesis_bd.otf
    try {
      const font = new FontFace(
        'Toxigenesis',
        'url(/src/games/ztype-quiz/assets/fonts/toxigenesis_bd.otf)',
      );
      await font.load();
      document.fonts.add(font);
    } catch (e) {
      // Si la police ne charge pas, Courier New sera utilisé en fallback
      console.warn('[ZTypeGame] Police Toxigenesis non chargée, fallback Courier New', e);
    }

    const renderer = new Renderer(ctx, mode);
    await renderer.loadBackground(bgImageSrc);
    await renderer.loadGrid(gridImageSrc);
    await renderer.loadShip(shipImageSrc);
    // Charger le sprite plasma du projectile
    await renderer.loadProjectile(plasmaImageSrc);
    rendererRef.current = renderer;

    const em = new EnemyManager();
    em.setCanvasSize(canvas.width, canvas.height);
    enemyMgrRef.current = em;

    const wm = new WaveManager(difficulty, diffConfig.goodAnswers, diffConfig.traps);
    wm.loadQuestions(questions);
    waveMgrRef.current = wm;

    const initWave = wm.getState();
    em.setFallSpeed(getFallSpeed(canvas.height, initWave.fallDuration));

    fillPool();
    syncCorrectFlags();

    statsRef.current    = { correctAnswers: 0, totalAttempts: 0, maxCombo: 0, startTime: Date.now() };
    targetedRef.current = null;

    // Lire la question APRÈS que le WaveManager est prêt
    const firstQuestion = wm.getQuestionText();
    dispatch({ type: 'INIT', payload: { lives: diffConfig.startingLives, currentQuestion: firstQuestion } });

    const gl = new GameLoop(
      (dt) => {
        renderer.update(dt);
        // Mettre à jour les positions des projectiles à chaque frame
        updateProjectiles(dt);
        const fallen = em.update(dt, canvas.height);
        if (fallen.length > 0) handleEnemiesReachedBottom(fallen);
        // fillPool appelé dans handleEnemiesReachedBottom uniquement → pas de 60fps sync
      },
      () => {
        renderer.clear();
        renderer.drawBackground();
        // Dessiner les projectiles AVANT les ennemis
        // pour qu'ils apparaissent sous les mots (ordre de profondeur correct)
        renderer.drawProjectiles(projectilesRef.current);
        for (const enemy of em.getEnemies()) drawEnemy(ctx, enemy);
        // Passer la position de la cible pour la rotation instantanée
        const target = targetedRef.current;
        if (target) {
          renderer.drawShip(canvas.width / 2, canvas.height - 60, target.x, target.y);
        } else {
          renderer.drawShip(canvas.width / 2, canvas.height - 60);
        }
      }
    );

    gameLoopRef.current = gl;
    gl.start();
  }, [mode, bgImageSrc, gridImageSrc, shipImageSrc, plasmaImageSrc, difficulty, diffConfig.goodAnswers, diffConfig.traps, diffConfig.startingLives, questions, getFallSpeed, fillPool, syncCorrectFlags, updateProjectiles, handleEnemiesReachedBottom]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // PAUSE / RESUME / CLEANUP
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  const pause = useCallback(() => {
    if (stateRef.current.status !== 'playing') return;
    gameLoopRef.current?.pause();
    dispatch({ type: 'SET_STATUS', payload: 'paused' });
  }, []);

  const resume = useCallback(() => {
    if (stateRef.current.status !== 'paused') return;
    gameLoopRef.current?.resume();
    dispatch({ type: 'SET_STATUS', payload: 'playing' });
  }, []);

  const cleanup = useCallback(() => {
    if (waveTimerRef.current !== null) {
      clearTimeout(waveTimerRef.current);
      waveTimerRef.current = null;
    }
    gameLoopRef.current?.stop();
    enemyMgrRef.current?.clear();
    targetedRef.current     = null;
    projectilesRef.current   = [];
    gameLoopRef.current = null;
    rendererRef.current = null;
    enemyMgrRef.current = null;
    waveMgrRef.current  = null;
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  // RETOUR
  // ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  return {
    gameStatus:      state.status,
    score:           state.score,
    lives:           state.lives,
    combo:           state.combo,
    wave:            state.wave,
    currentQuestion: state.currentQuestion,
    isVictory:       state.isVictory,
    initGame,
    handleKeyPress,
    pause,
    resume,
    cleanup,
  };
}