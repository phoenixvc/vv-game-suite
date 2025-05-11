/**
 * Glow and neon shadow effects
 * These are computed lazily to reduce initial bundle size
 */
export const glowShadows = {
  get neon() {
    return '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #0073e6, 0 0 20px #0073e6, 0 0 25px #0073e6, 0 0 30px #0073e6, 0 0 35px #0073e6';
  },
  
  get neonRed() {
    return '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #ff0000, 0 0 20px #ff0000, 0 0 25px #ff0000, 0 0 30px #ff0000, 0 0 35px #ff0000';
  },
  
  get neonGreen() {
    return '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #00ff00, 0 0 20px #00ff00, 0 0 25px #00ff00, 0 0 30px #00ff00, 0 0 35px #00ff00';
  },
  
  get neonPurple() {
    return '0 0 5px #fff, 0 0 10px #fff, 0 0 15px #9b59b6, 0 0 20px #9b59b6, 0 0 25px #9b59b6, 0 0 30px #9b59b6, 0 0 35px #9b59b6';
  },
  
  get softGlow() {
    return '0 0 10px rgba(255, 255, 255, 0.5), 0 0 20px rgba(255, 255, 255, 0.3)';
  }
} as const;