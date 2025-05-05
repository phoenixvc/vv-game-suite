import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import ParticleController from '../controllers/ParticleController';
import ErrorManager from './ErrorManager';

/**
 * Manages particle effects in the game
 */
class ParticleManager {
  private scene: BreakoutScene;
  private phasorScene: Phaser.Scene;
  private particleControllers: ParticleController[] = [];
  private particleTextures: string[] = ['particle', 'square', 'circle'];
  private errorManager: ErrorManager;
  
  // Default particle configurations
  private static readonly DEFAULT_BLEND_MODE = Phaser.BlendModes.ADD;
  private static readonly DEFAULT_SCREEN_BLEND_MODE = Phaser.BlendModes.SCREEN;
  private static readonly DEFAULT_LIFESPAN = 600;
  private static readonly DEFAULT_EXPLOSION_LIFESPAN = 500;
  private static readonly DEFAULT_TRAIL_LIFESPAN = 300;
  private static readonly DEFAULT_PARTICLES_LIFESPAN = 800;
  private static readonly DEFAULT_POWERUP_LIFESPAN = 500;
  private static readonly BRICK_HIT_LIFESPAN = 300;
  private static readonly BRICK_DESTROY_LIFESPAN = 600;
  
  // Particle speed ranges
  private static readonly POWERUP_SPEED = { min: 10, max: 30 };
  private static readonly EXPLOSION_SPEED = { min: 50, max: 200 };
  private static readonly TRAIL_SPEED = { min: 0, max: 10 };
  private static readonly DEFAULT_SPEED = { min: 50, max: 150 };
  private static readonly BRICK_HIT_SPEED = { min: 20, max: 80 };
  
  // Particle scale ranges
  private static readonly DEFAULT_SCALE = { start: 0.5, end: 0 };
  private static readonly SMALL_SCALE = { start: 0.2, end: 0 };
  private static readonly MEDIUM_SCALE = { start: 0.4, end: 0 };
  private static readonly BRICK_HIT_SCALE = { start: 0.3, end: 0 };
  
  // Particle alpha range
  private static readonly DEFAULT_ALPHA = { start: 1, end: 0 };
  
  // Emission frequencies
  private static readonly CONTINUOUS_EMISSION = 100;
  private static readonly TRAIL_EMISSION = 50;
  private static readonly ONE_TIME_BURST = -1;
  
  // Default angle range
  private static readonly FULL_ANGLE_RANGE = { min: 0, max: 360 };
  
  // Default particle counts
  private static readonly DEFAULT_PARTICLE_COUNT = 10;
  private static readonly EXPLOSION_PARTICLE_COUNT = 20;
  private static readonly BRICK_HIT_PARTICLE_COUNT = 5;
  private static readonly BRICK_DESTROY_PARTICLE_COUNT = 15;
  
  // Track active particles to avoid accessing destroyed objects
  private activeParticles: Set<Phaser.GameObjects.Particles.ParticleEmitter> = new Set();
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.phasorScene = scene as Phaser.Scene;
    
    // Get or create ErrorManager
    this.errorManager = scene.getErrorManager ? scene.getErrorManager() : null;
    if (!this.errorManager) {
      // Create our own instance if not available from scene
      this.errorManager = new ErrorManager(scene);
    }
    
    this.createParticleTextures();
  }

  /**
   * Create default particle textures if they don't exist
   */
  private createParticleTextures(): void {
    try {
      // Create a basic particle texture if it doesn't exist
      if (!this.scene.textures.exists('particle')) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('particle', 16, 16);
        graphics.destroy();
      }

      // Create a square particle
      if (!this.scene.textures.exists('square')) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffffff);
        graphics.fillRect(0, 0, 16, 16);
        graphics.generateTexture('square', 16, 16);
        graphics.destroy();
      }

      // Create a circle particle
      if (!this.scene.textures.exists('circle')) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xffffff);
        graphics.fillCircle(8, 8, 8);
        graphics.generateTexture('circle', 16, 16);
        graphics.destroy();
      }
    } catch (e) {
      console.warn('[ParticleManager] Error creating particle textures:', e);
    }
  }
  
  /**
   * Create a particle emitter with specified texture and configuration
   * @param texture The texture key to use for particles
   * @param config Optional configuration for the emitter
   * @returns The created particle emitter
   */
  public createEmitter(texture: string, config?: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig): Phaser.GameObjects.Particles.ParticleEmitter {
    try {
      // Default config
      const defaultConfig = {
        speed: ParticleManager.DEFAULT_SPEED,
        scale: ParticleManager.DEFAULT_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: ParticleManager.DEFAULT_LIFESPAN,
        blendMode: ParticleManager.DEFAULT_BLEND_MODE
      };
      
      // Merge the provided config with the default config
      const finalConfig = config ? { ...defaultConfig, ...config } : defaultConfig;
      
      // Create the particle emitter directly (Phaser 3.60+ style)
      const emitter = this.scene.add.particles(0, 0, texture, finalConfig);
      
      // Track this emitter
      this.activeParticles.add(emitter);
      
      return emitter;
    } catch (e) {
      console.warn('[ParticleManager] Error creating emitter:', e);
      return null;
    }
  }
  
  /**
   * Create an explosion effect
   * @param x X position
   * @param y Y position
   * @param color Color of the explosion
   * @param particleCount Number of particles
   * @returns Controller for the created effect
   */
  public createExplosion(
    x: number, 
    y: number, 
    color: number = 0xff8800, 
    particleCount: number = ParticleManager.EXPLOSION_PARTICLE_COUNT
  ): ParticleController {
    try {
      // Create emitter configuration
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: ParticleManager.EXPLOSION_SPEED,
        angle: ParticleManager.FULL_ANGLE_RANGE,
        scale: ParticleManager.DEFAULT_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: ParticleManager.DEFAULT_EXPLOSION_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_SCREEN_BLEND_MODE,
        frequency: ParticleManager.ONE_TIME_BURST, // Emit all particles at once
        quantity: particleCount
      };
      
      // Create the emitter directly (it's now a GameObject in v3.60+)
      const emitter = this.scene.add.particles(x, y, 'particle', emitterConfig);
      
      // Track this emitter
      this.activeParticles.add(emitter);
      
      // Create and store controller
      const controller = new ParticleController(this.scene, emitter, ParticleManager.DEFAULT_EXPLOSION_LIFESPAN);
      this.particleControllers.push(controller);
      
      return controller;
    } catch (e) {
      console.warn('[ParticleManager] Error creating explosion:', e);
      return null;
    }
  }

  /**
   * Create a trail effect that follows an object
   * @param target Object to follow
   * @param color Color of the trail
   * @param duration How long the trail should last (0 for permanent)
   * @returns Controller for the created effect
   */
  public createTrail(
    target: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform,
    color: number = 0x00ffff,
    duration: number = 0
  ): ParticleController {
    try {
      // Safety check for target
      if (!target) {
        console.warn('[ParticleManager] Cannot create trail for null target');
        return null;
      }
      
      // Safely get target position
      const x = this.safeGetX(target);
      const y = this.safeGetY(target);
      
      // Create emitter configuration
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: ParticleManager.TRAIL_SPEED,
        scale: ParticleManager.SMALL_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: ParticleManager.DEFAULT_TRAIL_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_BLEND_MODE,
        frequency: ParticleManager.TRAIL_EMISSION,
        follow: target
      };

      // Create the emitter directly (it's now a GameObject in v3.60+)
      const emitter = this.scene.add.particles(x, y, 'particle', emitterConfig);
      
      // Track this emitter
      this.activeParticles.add(emitter);

      // Create and store controller
      const controller = new ParticleController(this.scene, emitter, duration);
      this.particleControllers.push(controller);

      return controller;
    } catch (e) {
      console.warn('[ParticleManager] Error creating trail:', e);
      return null;
    }
  }

  /**
   * Create particles at a specific position
   * @param x X position
   * @param y Y position
   * @param config Configuration options for the particles
   * @returns Controller for the created effect
   */
  public createParticles(
    x: number,
    y: number,
    config: {
      texture?: string,
      color?: number,
      duration?: number,
      count?: number,
      speed?: { min: number, max: number },
      scale?: { start: number, end: number },
      lifespan?: number,
      blendMode?: number,
      angle?: { min: number, max: number }
    } = {}
  ): ParticleController {
    try {
      // Set defaults for particle configuration
      const texture = config.texture || 'particle';
      const color = config.color || 0xffffff;
      const duration = config.duration || 1000;
      const count = config.count || ParticleManager.DEFAULT_PARTICLE_COUNT;
      const speed = config.speed || ParticleManager.DEFAULT_SPEED;
      const scale = config.scale || ParticleManager.MEDIUM_SCALE;
      const lifespan = config.lifespan || ParticleManager.DEFAULT_PARTICLES_LIFESPAN;
      const blendMode = config.blendMode || ParticleManager.DEFAULT_SCREEN_BLEND_MODE;
      const angle = config.angle || ParticleManager.FULL_ANGLE_RANGE;
      
      // Create emitter configuration
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: speed,
        scale: scale,
        alpha: ParticleManager.DEFAULT_ALPHA,
        angle: angle,
        lifespan: lifespan,
        tint: { onEmit: () => color },
        blendMode: blendMode,
        frequency: ParticleManager.ONE_TIME_BURST, // Emit all particles at once
        quantity: count
      };
      
      // Create the emitter directly (it's now a GameObject in v3.60+)
      const emitter = this.scene.add.particles(x, y, texture, emitterConfig);
      
      // Track this emitter
      this.activeParticles.add(emitter);
      
      // Create and store controller
      const controller = new ParticleController(this.scene, emitter, duration);
      this.particleControllers.push(controller);
      
      return controller;
    } catch (e) {
      console.warn('[ParticleManager] Error creating particles:', e);
      return null;
    }
  }

  /**
   * Safely get X position of an object
   */
  private safeGetX(obj: any): number {
    if (!obj) return 0;
    
    try {
      // First try direct x property
      if (typeof obj.x === 'number') {
        return obj.x;
      }
      
      // Then try position.x
      if (obj.position && typeof obj.position.x === 'number') {
        return obj.position.x;
      }
      
      // Try body.position.x for physics objects
      if (obj.body && obj.body.position && typeof obj.body.position.x === 'number') {
        return obj.body.position.x;
      }
      
      // Use ErrorManager's safeAccess if available
      if (this.errorManager) {
        return this.errorManager.safeAccess(obj, 'x', 0);
      }
      
      return 0;
    } catch (e) {
      // Don't log the error here to avoid spamming the console
      return 0;
    }
  }
  
  /**
   * Safely get Y position of an object
   */
  private safeGetY(obj: any): number {
    if (!obj) return 0;
    
    try {
      // First try direct y property
      if (typeof obj.y === 'number') {
        return obj.y;
      }
      
      // Then try position.y
      if (obj.position && typeof obj.position.y === 'number') {
        return obj.position.y;
      }
      
      // Try body.position.y for physics objects
      if (obj.body && obj.body.position && typeof obj.body.position.y === 'number') {
        return obj.body.position.y;
      }
      
      // Use ErrorManager's safeAccess if available
      if (this.errorManager) {
        return this.errorManager.safeAccess(obj, 'y', 0);
      }
      
      return 0;
    } catch (e) {
      // Don't log the error here to avoid spamming the console
      return 0;
    }
  }

  /**
   * Check if a particle emitter is still active and valid
   */
  private isEmitterActive(emitter: Phaser.GameObjects.Particles.ParticleEmitter): boolean {
    if (!emitter) return false;
    
    try {
      // Check if the emitter is in our active set
      if (!this.activeParticles.has(emitter)) {
        return false;
      }
      
      // Check if the emitter has been destroyed by accessing a property
      // This will throw an error if the object has been destroyed
      const active = emitter.active;
      return active !== undefined;
    } catch (e) {
      // If accessing properties throws an error, the object is likely destroyed
      return false;
    }
  }

  /**
   * Create a particle effect when a brick is hit
   * @param brick The brick that was hit
   * @param color Color to use for particles
   */
  public createBrickHitEffect(brick: Phaser.Physics.Matter.Sprite, color?: number): void {
    try {
      // Safety check for brick
      if (!brick) {
        // Silent fail - this is an expected case when objects are destroyed
        return;
      }
      
      // Use default position if brick is not valid
      let x = 0;
      let y = 0;
      let brickValid = false;
      
      try {
        // Check if the brick is valid by accessing a property
        const test = brick.active;
        brickValid = test !== undefined;
        
        if (brickValid) {
          // Safely get brick position
          x = this.safeGetX(brick);
          y = this.safeGetY(brick);
        }
      } catch (e) {
        // Brick is not valid, use default position
        brickValid = false;
      }
      
      // If brick is not valid, exit silently
      if (!brickValid) {
        return;
      }
      
      // Use brick tint if color not specified
      if (!color) {
        // Safely access tintTopLeft
        color = this.errorManager ? 
          this.errorManager.safeAccess(brick, 'tintTopLeft', 0xffffff) : 
          (brick.tintTopLeft || 0xffffff);
      }

      // Create a small particle burst at the brick's position
      this.createParticles(x, y, {
        color,
        count: ParticleManager.BRICK_HIT_PARTICLE_COUNT,
        speed: ParticleManager.BRICK_HIT_SPEED,
        scale: ParticleManager.BRICK_HIT_SCALE,
        lifespan: ParticleManager.BRICK_HIT_LIFESPAN,
        duration: ParticleManager.BRICK_HIT_LIFESPAN
      });
    } catch (e) {
      // Silent fail - don't log this error to avoid console spam
    }
  }

/**
 * Create a particle effect when a brick is destroyed
 * @param brick The brick that was destroyed
 * @param color Color to use for particles
 */
public createBrickDestroyEffect(brick: Phaser.GameObjects.GameObject, color?: number): void {
  try {
    // Safety check for brick
    if (!brick) {
      // Silent fail - this is an expected case when objects are destroyed
      return;
    }
    
    // Use default position if brick is not valid
    let x = 0;
    let y = 0;
    let brickValid = false;
    
    try {
      // Check if the brick is valid by accessing a property
      const test = 'active' in brick ? brick.active : false;
      brickValid = test !== undefined;
      
      if (brickValid) {
        // Safely get brick position
        x = this.safeGetX(brick);
        y = this.safeGetY(brick);
      }
    } catch (e) {
      // Brick is not valid, use default position
      brickValid = false;
    }
    
    // If brick is not valid, exit silently
    if (!brickValid) {
      return;
    }
    
    // Use brick tint if color not specified and brick is a sprite
    if (!color && brick instanceof Phaser.GameObjects.Sprite) {
      // Safely access tintTopLeft
      color = this.errorManager ? 
        this.errorManager.safeAccess(brick, 'tintTopLeft', 0xffffff) : 
        (brick.tintTopLeft || 0xffffff);
    }
    
    // Default color if still not set
    if (!color) {
      color = 0xffffff;
    }
    
    // Create a larger particle burst with square particles
    this.createParticles(x, y, {
      texture: 'square',
      color,
      count: ParticleManager.BRICK_DESTROY_PARTICLE_COUNT,
      speed: ParticleManager.DEFAULT_SPEED,
      scale: ParticleManager.DEFAULT_SCALE,
      lifespan: ParticleManager.BRICK_DESTROY_LIFESPAN,
      duration: ParticleManager.BRICK_DESTROY_LIFESPAN
    });
  } catch (e) {
    // Silent fail - don't log this error to avoid console spam
  }
}
  
/**
 * Create a directional effect based on the edge that was hit
 * @param x X position
 * @param y Y position
 * @param angle Angle of impact in radians
 * @param color Color of particles
 */
createParticleDirectionalEffect(x: number, y: number, angle: number, color: number = 0xffffff) {
  try {
    // Calculate the direction vector from the angle
    const dirX = Math.cos(angle);
    const dirY = Math.sin(angle);
    
    // Create a particle emitter for the effect
    const particles = this.scene.add.particles(x, y, 'particle', {
      speed: { min: 50, max: 150 },
      scale: { start: 0.5, end: 0 },
      quantity: 10,
      lifespan: 500,
      tint: color,
      emitZone: {
        type: 'edge',
        source: new Phaser.Geom.Line(0, 0, dirX * 20, dirY * 20),
        quantity: 10,
        yoyo: false
      }
    });
    
    // Track this emitter
    this.activeParticles.add(particles);
    
    // Store reference to this for use in callbacks
    const self = this;
    
    // Stop emitting after a short time and destroy
    this.scene.time.delayedCall(200, () => {
      try {
        if (self.isEmitterActive(particles)) {
          particles.stop();
          this.scene.time.delayedCall(500, () => {
            try {
              if (self.isEmitterActive(particles)) {
                particles.destroy();
                // Remove from active particles set
                self.activeParticles.delete(particles);
              }
            } catch (e) {
              // Silent fail
            }
          });
        }
      } catch (e) {
        // Silent fail
      }
    });
    
    return particles;
  } catch (e) {
    console.warn('[ParticleManager] Error creating directional effect:', e);
    return null;
  }
}

  /**
   * Create a particle effect for a power-up
   * @param x X position
   * @param y Y position
   * @param color Color of the power-up
   */
  public createPowerUpEffect(
    x: number,
    y: number,
    color: number = 0x00ff00
  ): ParticleController {
    try {
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: ParticleManager.POWERUP_SPEED,
        scale: ParticleManager.SMALL_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: ParticleManager.DEFAULT_POWERUP_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_BLEND_MODE,
        frequency: ParticleManager.CONTINUOUS_EMISSION
      };

      // Create the emitter directly (it's now a GameObject in v3.60+)
      const emitter = this.scene.add.particles(x, y, 'particle', emitterConfig);
      
      // Track this emitter
      this.activeParticles.add(emitter);

      // Wrap it in your controller
      const controller = new ParticleController(this.scene, emitter);
      this.particleControllers.push(controller);

      return controller;
    } catch (e) {
      console.warn('[ParticleManager] Error creating power-up effect:', e);
      return null;
    }
  }

  /**
   * Update all particle controllers
   */
  public update(): void {
    try {
      // Remove inactive controllers from the array
      this.particleControllers = this.particleControllers.filter(controller => {
        if (!controller) return false;
        
        try {
          const isActive = controller.isActive();
          
          // If the controller is no longer active, remove its emitter from our tracking
          if (!isActive && controller.getEmitter) {
            try {
              const emitter = controller.getEmitter();
              if (emitter) {
                this.activeParticles.delete(emitter);
              }
            } catch (e) {
              // Silent fail
            }
          }
          
          return isActive;
        } catch (e) {
          // If checking isActive throws an error, the controller is likely invalid
          return false;
        }
      });
    } catch (e) {
      console.warn('[ParticleManager] Error updating particle controllers:', e);
    }
  }

  /**
   * Clean up all particle effects
   */
  public cleanup(): void {
    try {
      // Destroy all particle controllers
      this.particleControllers.forEach(controller => {
        if (controller) {
          try {
            controller.destroy();
            
            // Remove emitter from tracking if available
            if (controller.getEmitter) {
              try {
                const emitter = controller.getEmitter();
                if (emitter) {
                  this.activeParticles.delete(emitter);
                }
              } catch (e) {
                // Silent fail
              }
            }
          } catch (e) {
            // Silent fail
          }
        }
      });
      
      // Clean up any remaining tracked particles
      this.activeParticles.forEach(emitter => {
        try {
          if (emitter && emitter.active !== undefined) {
            emitter.destroy();
          }
        } catch (e) {
          // Ignore errors during cleanup
        }
      });
      
      // Clear the arrays
      this.particleControllers = [];
      this.activeParticles.clear();
    } catch (e) {
      console.warn('[ParticleManager] Error cleaning up particle effects:', e);
    }
  }
}

export default ParticleManager;