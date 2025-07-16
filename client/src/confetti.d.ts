declare module 'canvas-confetti' {
  interface ConfettiOptions {
    /**
     * The number of confetti to launch. More is always fun... but be cool, there's a lot of math involved.
     * Default: 50
     */
    particleCount?: number;
    
    /**
     * How quickly the confetti fall. Default: 1
     */
    gravity?: number;
    
    /**
     * How rapidly the particles decelerate (basically determines how far they fly). Default: 1
     */
    drift?: number;
    
    /**
     * How far off center the confetti can go, in degrees. 
     * 90 is all the way from the center to the edge, 45 is half way. Default: 45
     */
    ticks?: number;
    
    /**
     * How wide to spread the origin point. Default: 45
     */
    spread?: number;
    
    /**
     * How many degrees the confetti can rotate. Default: 80
     */
    angle?: number;
    
    /**
     * Where to start firing confetti from. Default: 0.5, meaning from the middle
     */
    origin?: {
      x?: number;
      y?: number;
    };
    
    /**
     * Colors to cycle through
     */
    colors?: string[];
    
    /**
     * Use gradients instead of solid colors
     */
    gradient?: boolean | string[];
    
    /**
     * Shapes to use. Default: Square
     */
    shapes?: ('square' | 'circle')[];
    
    /**
     * Random factor for the shape. Default: 0 (no randomness)
     */
    scalar?: number;
    
    /**
     * Disableanimation loop entirely. This is a one-shot confetti launch.
     */
    disableForReducedMotion?: boolean;
    
    /**
     * Whether the canvas should automatically resize to fill the parent
     */
    resize?: boolean;
    
    /**
     * If resize is true, these values will be used to constrain the canvas
     */
    useWorker?: boolean;
  }

  interface CreateTypes {
    /**
     * Call to create a confetti cannon and shoot it at will.
     */
    (options?: ConfettiOptions): CreateTypes;

    /**
     * Fire off some confetti.
     */
    (): CreateTypes;

    /**
     * Pass an options object to override the default confetti parameters.
     */
    (options: ConfettiOptions): CreateTypes;

    /**
     * Wind down the animation and remove the canvas from the DOM.
     */
    reset(): void;
  }

  /**
   * Fire off some confetti.
   */
  function confetti(options?: ConfettiOptions): CreateTypes;

  /**
   * Create a confetti cannon that you can reuse.
   */
  function create(canvas: HTMLCanvasElement, options?: { resize?: boolean, useWorker?: boolean }): CreateTypes;

  export { confetti as default, create };
}