// src/games/ztype-quiz/engine/Renderer.ts

import { THEME_COLORS } from '../config/constants';

type Mode = 'sante' | 'academique' | 'anglais' | 'culture';

// ============================================
// TYPE PROJECTILE
// ============================================

/**
 * Projectile — représente un tir du vaisseau vers une cible
 * Créé dans useZTypeGame, passé au renderer pour le dessin
 */
export interface Projectile {
  id:     number;   // identifiant unique
  x:      number;   // position courante X
  y:      number;   // position courante Y
  tx:     number;   // position cible X (ennemi)
  ty:     number;   // position cible Y (ennemi)
  speed:  number;   // vitesse de déplacement en px/s
  angle:  number;   // angle de rotation du sprite (calculé une fois au spawn)
  done:   boolean;  // true quand le projectile a atteint sa cible
}

/**
 * Renderer — Gère tout le dessin sur le canvas
 *
 * Couches de dessin (dans l'ordre) :
 * 1. Fond (image galaxie ou dégradé)
 * 2. Grille cyber verte défilante
 *    → Fallback Canvas pur si image pas encore chargée (visible immédiatement)
 * 3. Overlay vert Z-Type
 * 4. Projectiles plasma
 * 5. Ennemis (dessinés par useZTypeGame)
 * 6. Vaisseau joueur (sprite PNG, rotation instantanée)
 */
export class Renderer {
  private ctx:  CanvasRenderingContext2D;
  private mode: Mode;

  // ── Images ───────────────────────────────────────────────────
  private bgImage:         HTMLImageElement | null = null;
  private bgLoaded:        boolean = false;
  private gridImage:       HTMLImageElement | null = null;
  private gridLoaded:      boolean = false;
  private shipImage:       HTMLImageElement | null = null;
  private shipLoaded:      boolean = false;
  private projectileImage: HTMLImageElement | null = null;
  private projectileLoaded: boolean = false;

  // ── Grille défilement ────────────────────────────────────────
  private gridOffsetY: number = 0;
  private gridSpeed:   number = 40;

  // ── Taille d'affichage du vaisseau ───────────────────────────
  // Sprite original 500×500px → affiché en SHIP_SIZE × SHIP_SIZE px
  private readonly SHIP_SIZE = 60;

  // ── Taille d'affichage du projectile ─────────────────────────
  // Sprite plasma → affiché en PROJ_W × PROJ_H px
  // L'image est plus haute que large (fuseau vertical)
  private readonly PROJ_W = 23;
  private readonly PROJ_H = 50;

  constructor(ctx: CanvasRenderingContext2D, mode: Mode) {
    this.ctx  = ctx;
    this.mode = mode;
  }

  // ============================================
  // GETTER PUBLIC
  // ============================================

  getCanvas(): HTMLCanvasElement {
    return this.ctx.canvas;
  }

  // ============================================
  // CHARGEMENT DES IMAGES
  // ============================================

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img   = new Image();
      img.onload  = () => resolve(img);
      img.onerror = reject;
      img.src     = src;
    });
  }

  async loadBackground(src: string): Promise<void> {
    this.bgImage  = await this.loadImage(src);
    this.bgLoaded = true;
  }

  async loadGrid(src: string): Promise<void> {
    this.gridImage  = await this.loadImage(src);
    this.gridLoaded = true;
  }

  /** Charge le sprite PNG du vaisseau (500×500, fond transparent) */
  async loadShip(src: string): Promise<void> {
    this.shipImage  = await this.loadImage(src);
    this.shipLoaded = true;
  }

  /**
   * Charge le sprite PNG du projectile plasma
   * À appeler dans initGame : await renderer.loadProjectile(plasmaSrc)
   */
  async loadProjectile(src: string): Promise<void> {
    this.projectileImage  = await this.loadImage(src);
    this.projectileLoaded = true;
  }

  setMode(mode: Mode) { this.mode = mode; }

  private get themeColor(): string {
    return THEME_COLORS[this.mode];
  }

  // ============================================
  // UPDATE (appelé à chaque frame)
  // ============================================

  update(deltaTime: number) {
    const tileH = this.gridLoaded && this.gridImage
      ? this.gridImage.height
      : 80;

    this.gridOffsetY += this.gridSpeed * deltaTime;
    if (this.gridOffsetY >= tileH) {
      this.gridOffsetY -= tileH;
    }
  }

  // ============================================
  // DRAW BACKGROUND + GRILLE
  // ============================================

  drawBackground() {
    const { width, height } = this.ctx.canvas;

    if (this.bgLoaded && this.bgImage) {
      this.drawCoverImage(this.bgImage, width, height);
    } else {
      this.drawFallbackBackground(width, height);
    }

    if (this.gridLoaded && this.gridImage) {
      this.drawScrollingGridImage(width, height);
    } else {
      this.drawFallbackGrid(width, height);
    }

    this.drawGreenOverlay(width, height);
  }

  private drawCoverImage(img: HTMLImageElement, width: number, height: number) {
    const scale   = Math.max(width / img.width, height / img.height);
    const scaledW = img.width  * scale;
    const scaledH = img.height * scale;
    const offsetX = (width  - scaledW) / 2;
    const offsetY = (height - scaledH) / 2;
    this.ctx.drawImage(img, offsetX, offsetY, scaledW, scaledH);
  }

  private drawFallbackBackground(width: number, height: number) {
    const grad = this.ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0,   '#020810');
    grad.addColorStop(0.4, '#050f18');
    grad.addColorStop(1,   '#020608');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, width, height);
  }

  private drawScrollingGridImage(width: number, height: number) {
    if (!this.gridImage) return;
    const tileH = this.gridImage.height;

    this.ctx.save();
    this.ctx.globalAlpha = 0.35;
    this.ctx.drawImage(this.gridImage, 0, this.gridOffsetY - tileH, width, tileH);
    this.ctx.drawImage(this.gridImage, 0, this.gridOffsetY,         width, tileH);
    if (this.gridOffsetY + tileH < height) {
      this.ctx.drawImage(this.gridImage, 0, this.gridOffsetY + tileH, width, tileH);
    }
    this.ctx.restore();
  }

  private drawFallbackGrid(width: number, height: number) {
    const tileSize = 40;
    const offsetY  = this.gridOffsetY % tileSize;

    this.ctx.save();
    this.ctx.strokeStyle = 'rgba(0, 200, 80, 0.25)';
    this.ctx.lineWidth   = 0.5;

    for (let y = offsetY - tileSize; y < height + tileSize; y += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
    for (let x = 0; x < width + tileSize; x += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    this.ctx.restore();
  }

  private drawGreenOverlay(width: number, height: number) {
    this.ctx.save();
    this.ctx.fillStyle = 'rgba(31, 187, 109, 0.18)';
    this.ctx.fillRect(0, 0, width, height);
    this.ctx.restore();
  }

  // ============================================
  // PROJECTILES PLASMA
  // ============================================

  /**
   * Dessine tous les projectiles actifs
   *
   * Chaque projectile est dessiné :
   * - Centré sur sa position (x, y)
   * - Orienté vers sa cible grâce à l'angle pré-calculé au spawn
   * - Avec un glow cyan pour l'effet lumineux
   *
   * Si le sprite n'est pas chargé : fallback cercle cyan lumineux
   *
   * @param projectiles - Liste des projectiles actifs (depuis useZTypeGame)
   */
  drawProjectiles(projectiles: readonly Projectile[]): void {
    for (const proj of projectiles) {
      if (proj.done) continue; // ne pas dessiner les projectiles arrivés

      this.ctx.save();

      // Se déplacer au centre du projectile puis tourner vers la cible
      this.ctx.translate(proj.x, proj.y);
      this.ctx.rotate(proj.angle);

      if (this.projectileLoaded && this.projectileImage) {
        // ── Sprite plasma ─────────────────────────────────────

        // Glow intense cyan — appliqué 2 fois pour amplifier l'effet lumineux
        this.ctx.shadowBlur  = 100;
        this.ctx.shadowColor = '#ffffffff';

        // Premier dessin : glow extérieur large
        this.ctx.globalAlpha = 0.5;
        this.ctx.drawImage(
          this.projectileImage,
          -this.PROJ_W,          // légèrement plus grand pour le halo
          -this.PROJ_H,
          this.PROJ_W * 2,
          this.PROJ_H * 2,
        );

        // Deuxième dessin : sprite net par-dessus, pleine opacité
        this.ctx.globalAlpha = 1;
        this.ctx.shadowBlur  = 100;
        this.ctx.drawImage(
          this.projectileImage,
          -this.PROJ_W / 2,
          -this.PROJ_H / 2,
          this.PROJ_W,
          this.PROJ_H,
        );

      } else {
        // ── Fallback : cercle cyan lumineux bien visible ───────
        this.ctx.shadowBlur  = 70;
        this.ctx.shadowColor = '#00f0ff';
        this.ctx.fillStyle   = '#00f0ff';
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 6, 0, Math.PI * 2);
        this.ctx.fill();

        // Halo extérieur semi-transparent
        this.ctx.globalAlpha = 0.3;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 12, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.ctx.shadowBlur = 0;
      this.ctx.restore();
    }
  }

  // ============================================
  // VAISSEAU — sprite PNG + rotation instantanée
  // ============================================

  /**
   * Dessine le vaisseau centré en (x, y)
   *
   * @param x       - Position X (centre du canvas)
   * @param y       - Position Y (bas du canvas)
   * @param targetX - X de la cible (undefined → pointe vers le haut)
   * @param targetY - Y de la cible
   *
   * Rotation instantanée :
   *   angle = atan2(dy, dx) + PI/2
   *   +PI/2 car le sprite pointe vers le HAUT (axe Y négatif)
   */
  drawShip(x: number, y: number, targetX?: number, targetY?: number) {
    this.ctx.save();
    this.ctx.translate(x, y);

    let angle = 0;
    if (targetX !== undefined && targetY !== undefined) {
      angle = Math.atan2(targetY - y, targetX - x) + Math.PI / 2;
    }
    this.ctx.rotate(angle);

    const size = this.SHIP_SIZE;
    const half = size / 2;

    if (this.shipLoaded && this.shipImage) {
      this.ctx.shadowBlur  = 35;
      this.ctx.shadowColor = this.themeColor;
      this.ctx.drawImage(this.shipImage, -half, -half, size, size);

    } else {
      // Fallback Canvas si sprite pas encore chargé
      this.ctx.shadowBlur  = 25;
      this.ctx.shadowColor = this.themeColor;
      this.ctx.fillStyle   = this.themeColor;

      this.ctx.beginPath();
      this.ctx.moveTo(0,   -25);
      this.ctx.lineTo(20,   15);
      this.ctx.lineTo(8,    10);
      this.ctx.lineTo(5,    25);
      this.ctx.lineTo(0,    18);
      this.ctx.lineTo(-5,   25);
      this.ctx.lineTo(-8,   10);
      this.ctx.lineTo(-20,  15);
      this.ctx.closePath();
      this.ctx.fill();

      const flicker = Math.random() * 0.3 + 0.7;
      this.ctx.beginPath();
      this.ctx.moveTo(-4, 25);
      this.ctx.lineTo(0,  25 + 15 * flicker);
      this.ctx.lineTo(4,  25);
      this.ctx.fillStyle   = `rgba(255, 150, 50, ${flicker})`;
      this.ctx.shadowColor = `rgba(255, 100, 0, 0.8)`;
      this.ctx.fill();
    }

    this.ctx.shadowBlur = 0;
    this.ctx.restore();
  }

  clear() {
    const { width, height } = this.ctx.canvas;
    this.ctx.clearRect(0, 0, width, height);
  }
}