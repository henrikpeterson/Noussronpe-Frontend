// src/games/ztype-quiz/components/GameCanvas.tsx

import { useRef, useEffect, useCallback } from 'react';

interface GameCanvasProps {
  onContextReady: (ctx: CanvasRenderingContext2D) => void;
  onResize?: (width: number, height: number) => void;
}

/**
 * GameCanvas — Canvas qui remplit son conteneur parent (le rectangle arcade)
 * et NON plus toute la fenêtre.
 */
const GameCanvas: React.FC<GameCanvasProps> = ({ onContextReady, onResize }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const resizeCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    // S'adapte au conteneur arcade (pas à window)
    const rect = parent.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    onResize?.(canvas.width, canvas.height);
  }, [onResize]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas();
    onContextReady(ctx);

    // ResizeObserver : réagit au changement de taille du PARENT
    // (plus fiable que window resize pour un conteneur aspect-ratio)
    const parent = canvas.parentElement;
    if (parent) {
      const observer = new ResizeObserver(() => resizeCanvas());
      observer.observe(parent);
      return () => observer.disconnect();
    }

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [onContextReady, resizeCanvas]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ background: '#050510' }}
    />
  );
};

export default GameCanvas;