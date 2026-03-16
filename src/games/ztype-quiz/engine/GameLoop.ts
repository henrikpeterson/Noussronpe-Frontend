// src/games/ztype-quiz/engine/GameLoop.ts

/**
 * GameLoop — Boucle principale du jeu
 *
 * Responsabilités (et RIEN d'autre) :
 * - requestAnimationFrame
 * - Calcul du deltaTime
 * - Appeler onUpdate et onDraw à chaque frame
 * - Pause / Resume / Stop
 *
 * Ne connaît PAS le Renderer.
 * Ne connaît PAS le jeu.
 * Juste une horloge qui tourne.
 */

/** Maximum deltaTime pour éviter les sauts (changement d'onglet) */
const MAX_DELTA_TIME = 0.1; // 100ms

export class GameLoop {
  private isRunning: boolean = false;
  private lastTime: number = 0;
  private frameId: number | null = null;

  /** Callback appelé à chaque frame avec le deltaTime */
  private onUpdate: (deltaTime: number) => void;

  /** Callback appelé après update pour dessiner */
  private onDraw: () => void;

  constructor(
    onUpdate: (deltaTime: number) => void,
    onDraw: () => void
  ) {
    this.onUpdate = onUpdate;
    this.onDraw = onDraw;
  }

  /** Démarre la boucle */
  start(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  /** Arrête complètement la boucle */
  stop(): void {
    this.isRunning = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /** Met en pause */
  pause(): void {
    this.isRunning = false;
    if (this.frameId !== null) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
  }

  /** Reprend après une pause */
  resume(): void {
    if (this.isRunning) return;
    this.isRunning = true;
    this.lastTime = performance.now();
    this.tick();
  }

  /** Boucle interne */
  private tick = (): void => {
    if (!this.isRunning) return;

    const now = performance.now();
    const deltaTime = Math.min((now - this.lastTime) / 1000, MAX_DELTA_TIME);
    this.lastTime = now;

    // 1. Mise à jour logique
    this.onUpdate(deltaTime);

    // 2. Dessin
    this.onDraw();

    // 3. Prochaine frame
    this.frameId = requestAnimationFrame(this.tick);
  };

  /** État actuel */
  get running(): boolean {
    return this.isRunning;
  }
}