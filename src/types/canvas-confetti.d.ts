declare module 'canvas-confetti' {
  interface Options {
    particleCount?: number;
    angle?: number;
    spread?: number;
    origin?: { x?: number; y?: number };
    colors?: string[];
    startVelocity?: number;
    decay?: number;
    gravity?: number;
    drift?: number;
    ticks?: number;
    shapes?: string[];
    scalar?: number;
    zIndex?: number;
    disableForReducedMotion?: boolean;
  }

  function confetti(options?: Options): Promise<null>;
  
  namespace confetti {
    function reset(): void;
    function create(canvas: HTMLCanvasElement, options?: { resize?: boolean; useWorker?: boolean }): (options?: Options) => Promise<null>;
  }

  export = confetti;
}
