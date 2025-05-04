/**
 * Configuration for all particle effects in the game
 */
export const ParticleEffectsConfig = {
  // Brick-related effects
  BRICK: {
    HIT: {
      color: 0xffffff,
      count: 5,
      speed: { min: 20, max: 80 },
      scale: { start: 0.3, end: 0 },
      lifespan: 300,
      duration: 300
    },
    DESTROY: {
      default: {
        color: 0xffffff,
        count: 15,
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
        lifespan: 600,
        duration: 600
      },
      explosive: {
        color: 0xff0000,
        count: 20,
        speed: { min: 60, max: 180 },
        scale: { start: 0.6, end: 0 },
        lifespan: 800,
        duration: 800
      },
      reinforced: {
        color: 0x888888,
        count: 12,
        speed: { min: 40, max: 120 },
        scale: { start: 0.4, end: 0 },
        lifespan: 500,
        duration: 500
      },
      powerup: {
        color: 0x00ff00,
        count: 15,
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
        lifespan: 600,
        duration: 600
      },
      indestructible: {
        color: 0x444444,
        count: 8,
        speed: { min: 30, max: 100 },
        scale: { start: 0.3, end: 0 },
        lifespan: 400,
        duration: 400
      }
    }
  },
  
  // Ball-related effects
  BALL: {
    LAUNCH: {
      color: 0xffffff,
      count: 10,
      speed: { min: 30, max: 80 },
      scale: { start: 0.3, end: 0 },
      lifespan: 300,
      duration: 300
    },
    TRAIL: {
      color: 0xaaaaff,
      count: 1,
      speed: { min: 0, max: 10 },
      scale: { start: 0.2, end: 0 },
      lifespan: 200,
      frequency: 30,
      blendMode: 'ADD'
    }
  },
  
  // Paddle-related effects
  PADDLE: {
    HIT: {
      color: 0x00ffff,
      count: 5,
      speed: { min: 20, max: 60 },
      scale: { start: 0.2, end: 0 },
      lifespan: 200,
      duration: 200
    }
  },
  
  // Power-up related effects
  POWERUP: {
    COLLECT: {
      MULTIBALL: {
        color: 0xff00ff,
        count: 20,
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        duration: 500
      },
      EXPAND: {
        color: 0x00ffff,
        count: 20,
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        duration: 500
      },
      LASER: {
        color: 0xff0000,
        count: 20,
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        duration: 500
      },
      SLOW: {
        color: 0x0000ff,
        count: 20,
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        duration: 500
      },
      EXTRA_LIFE: {
        color: 0xffff00,
        count: 20,
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        duration: 500
      },
      default: {
        color: 0x00ff00,
        count: 20,
        speed: { min: 50, max: 200 },
        scale: { start: 0.5, end: 0 },
        lifespan: 500,
        duration: 500
      }
    },
    EXPIRE: {
      color: 0xaaaaaa,
      count: 10,
      speed: { min: 10, max: 30 },
      scale: { start: 0.3, end: 0 },
      lifespan: 400,
      duration: 400
    },
    GLOW: {
      color: 0x00ff00,
      count: 1,
      speed: { min: 10, max: 30 },
      scale: { start: 0.2, end: 0 },
      lifespan: 500,
      duration: 0, // Continuous effect
      blendMode: 'ADD'
    }
  },
  
  // Wall-related effects
  WALL: {
    HIT: {
      color: 0xffffff,
      count: 3,
      speed: { min: 20, max: 50 },
      scale: { start: 0.2, end: 0 },
      lifespan: 200,
      duration: 200
    }
  },
  
  // Explosion effects
  EXPLOSION: {
    SMALL: {
      color: 0xff8800,
      count: 15,
      speed: { min: 50, max: 150 },
      scale: { start: 0.4, end: 0 },
      lifespan: 400,
      duration: 400
    },
    MEDIUM: {
      color: 0xff8800,
      count: 20,
      speed: { min: 50, max: 200 },
      scale: { start: 0.5, end: 0 },
      lifespan: 500,
      duration: 500
    },
    LARGE: {
      color: 0xff8800,
      count: 30,
      speed: { min: 50, max: 250 },
      scale: { start: 0.6, end: 0 },
      lifespan: 600,
      duration: 600
    }
  }
};

/**
 * Get a particle effect configuration by path
 * @param path Path to the configuration (e.g., 'BRICK.HIT', 'POWERUP.COLLECT.MULTIBALL')
 * @returns The particle effect configuration or a default if not found
 */
export function getParticleConfig(path: string): any {
  const pathParts = path.split('.');
  let config: any = ParticleEffectsConfig;
  
  for (const part of pathParts) {
    if (config[part]) {
      config = config[part];
    } else {
      console.warn(`Particle effect config not found for path: ${path}`);
      return {
        color: 0xffffff,
        count: 10,
        speed: { min: 30, max: 100 },
        scale: { start: 0.4, end: 0 },
        lifespan: 400,
        duration: 400
      };
    }
  }
  
  return config;
}

export default ParticleEffectsConfig;