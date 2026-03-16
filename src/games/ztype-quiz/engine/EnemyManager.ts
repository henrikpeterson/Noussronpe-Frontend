// src/games/ztype-quiz/engine/EnemyManager.ts

// ============================================
// TYPES
// ============================================

export interface Enemy {
  id:            number;
  fullText:      string;
  remainingText: string;
  x:             number;
  y:             number;
  speed:         number;  // vitesse verticale (px/s)
  vx:            number;  // vitesse horizontale (px/s) — mouvement gauche/droite
  isCorrect:     boolean;
  isTrap:        boolean;
  isTargeted:    boolean;
}

export interface SpawnData {
  text:      string;
  isCorrect: boolean;
  isTrap:    boolean;
}

// ============================================
// CONSTANTES
// ============================================

/** Marge gauche/droite pour ne pas couper les mots */
const HORIZONTAL_MARGIN = 60;

/** Hauteur estimée d'un mot (badge + padding) */
const ENEMY_HEIGHT = 28;

/** Largeur estimée par caractère (police monospace) */
const CHAR_WIDTH = 9;

/** Espacement vertical minimum entre deux mots */
const MIN_VERTICAL_GAP = 50;

/** Espacement horizontal minimum entre deux mots */
const MIN_HORIZONTAL_GAP = 60;

/** Décalage Y aléatoire au spawn — étale les arrivées dans le temps */
const SPAWN_Y_STAGGER = 160;

/**
 * Vitesse horizontale min/max (px/s)
 * Assez lente pour être lisible, assez rapide pour réduire les chevauchements
 * Les mots rebondissent sur les bords comme dans Z-Type original
 */
const VX_MIN = 18;
const VX_MAX = 20;

// ============================================
// ENEMY MANAGER
// ============================================

export class EnemyManager {
  private enemies:      Enemy[] = [];
  private nextId:       number  = 0;
  private fallSpeed:    number  = 100;
  private canvasWidth:  number  = 450;
  private canvasHeight: number  = 800;

  setCanvasSize(width: number, height?: number): void {
    this.canvasWidth  = width;
    if (height) this.canvasHeight = height;
  }

  setFallSpeed(speed: number): void {
    this.fallSpeed = speed;
  }

  // ──────────────────────────────────────────────────────────
  // UTILITAIRES INTERNES
  // ──────────────────────────────────────────────────────────

  private estimateWordWidth(text: string): number {
    return text.length * CHAR_WIDTH + 28; // +28 = padding du badge
  }

  private hasCollision(x: number, y: number, wordWidth: number): boolean {
    for (const enemy of this.enemies) {
      const ew = this.estimateWordWidth(enemy.fullText);

      const hOverlap = Math.abs(x - enemy.x) <
        (wordWidth / 2 + ew / 2 + MIN_HORIZONTAL_GAP);

      const vOverlap = Math.abs(y - enemy.y) <
        (ENEMY_HEIGHT + MIN_VERTICAL_GAP);

      if (hOverlap && vOverlap) return true;
    }
    return false;
  }

  private findSafeX(y: number, wordWidth: number): number {
    const minX = HORIZONTAL_MARGIN + wordWidth / 2;
    const maxX = this.canvasWidth - HORIZONTAL_MARGIN - wordWidth / 2;

    if (minX >= maxX) return this.canvasWidth / 2;

    // 1. 14 tentatives aléatoires
    for (let i = 0; i < 14; i++) {
      const x = Math.random() * (maxX - minX) + minX;
      if (!this.hasCollision(x, y, wordWidth)) return x;
    }

    // 2. Repli : 4 colonnes triées par densité croissante
    const cols = 4;
    const positions = Array.from({ length: cols }, (_, i) =>
      minX + (i / (cols - 1)) * (maxX - minX)
    );
    const scored = positions
      .map((x) => ({
        x,
        score: this.enemies.filter((e) => Math.abs(e.x - x) < 80).length,
      }))
      .sort((a, b) => a.score - b.score);

    return scored[0].x;
  }

  // ──────────────────────────────────────────────────────────
  // SPAWN
  // ──────────────────────────────────────────────────────────

  /**
   * Spawn un ennemi avec :
   * - Y décalé aléatoirement au-dessus de l'écran (arrivées étalées)
   * - X sans collision avec les mots existants
   * - vx aléatoire gauche ou droite (mouvement horizontal)
   */
  spawn(data: SpawnData): void {
    const wordWidth = this.estimateWordWidth(data.text);
    const y         = -(Math.random() * SPAWN_Y_STAGGER + ENEMY_HEIGHT);
    const x         = this.findSafeX(y, wordWidth);

    // Vitesse horizontale aléatoire, direction aléatoire (gauche ou droite)
    const speed  = VX_MIN + Math.random() * (VX_MAX - VX_MIN);
    const vx     = Math.random() < 0.5 ? speed : -speed;

    this.enemies.push({
      id:            this.nextId++,
      fullText:      data.text,
      remainingText: data.text,
      x,
      y,
      speed:         this.fallSpeed,
      vx,
      isCorrect:     data.isCorrect,
      isTrap:        data.isTrap,
      isTargeted:    false,
    });
  }

  // ──────────────────────────────────────────────────────────
  // UPDATE (appelé à 60fps)
  // ──────────────────────────────────────────────────────────

  /**
   * Met à jour toutes les positions
   *
   * Mouvement vertical : descente constante
   * Mouvement horizontal : déplacement + rebond sur les bords
   *   → quand le bord gauche ou droit est atteint, vx s'inverse
   *   → le mot rebondit sans jamais sortir de l'écran
   *
   * @returns Les ennemis qui ont touché le bas
   */
  update(deltaTime: number, canvasHeight: number): Enemy[] {
    const touchedBottom: Enemy[] = [];

    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      // ── Descente verticale ──────────────────────────────
      enemy.y += enemy.speed * deltaTime;

      // ── Mouvement horizontal + rebond ───────────────────
      const wordWidth = this.estimateWordWidth(enemy.fullText);
      const minX      = HORIZONTAL_MARGIN + wordWidth / 2;
      const maxX      = this.canvasWidth - HORIZONTAL_MARGIN - wordWidth / 2;

      enemy.x += enemy.vx * deltaTime;

      // Rebond bord gauche
      if (enemy.x < minX) {
        enemy.x  = minX;
        enemy.vx = Math.abs(enemy.vx); // forcer vers la droite
      }

      // Rebond bord droit
      if (enemy.x > maxX) {
        enemy.x  = maxX;
        enemy.vx = -Math.abs(enemy.vx); // forcer vers la gauche
      }

      // ── Touché le bas → retirer ─────────────────────────
      if (enemy.y >= canvasHeight - 50) {
        touchedBottom.push(enemy);
        this.enemies.splice(i, 1);
      }
    }

    return touchedBottom;
  }

  // ──────────────────────────────────────────────────────────
  // HELPERS
  // ──────────────────────────────────────────────────────────

  removeById(id: number): void {
    const index = this.enemies.findIndex((e) => e.id === id);
    if (index !== -1) this.enemies.splice(index, 1);
  }

  updateCorrectAnswer(correctText: string): void {
    for (const enemy of this.enemies) {
      enemy.isCorrect =
        enemy.fullText.toLowerCase() === correctText.toLowerCase();
    }
  }

  getCount():              number          { return this.enemies.length; }
  getEnemies():            readonly Enemy[] { return this.enemies; }
  clear():                 void            { this.enemies = []; }
}