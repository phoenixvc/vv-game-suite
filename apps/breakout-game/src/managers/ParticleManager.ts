import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import ParticleController from '../controllers/ParticleController';
import ErrorManager from './ErrorManager';
import { BounceEffectManager } from './particles/BounceEffectManager';
import { BrickEffectManager } from './particles/BrickEffectManager';
import { ExplosionEffectManager } from './particles/ExplosionEffectManager';
import { PowerUpEffectManager } from './particles/PowerUpEffectManager';
import { TrailEffectManager } from './particles/TrailEffectManager';

/**
 * Manages particle effects in the game
 * Restructured to use specialized effect managers
 */
class ParticleManager {
  private scene: BreakoutScene;
  private phasorScene: Phaser.Scene;
  private particleControllers: ParticleController[] = [];
  private particleTextures: string[] = ['particle', 'square', 'circle'];
  private errorManager: ErrorManager;
  private defaultParticleColor: number = 0xffffff;
  
  // Specialized effect managers
  private bounceEffectManager: BounceEffectManager;
  private brickEffectManager: BrickEffectManager;
  private explosionEffectManager: ExplosionEffectManager;
  private powerUpEffectManager: PowerUpEffectManager;
  private trailEffectManager: TrailEffectManager;
  
  // Track active particles to avoid accessing destroyed objects
  private activeParticles: Set<Phaser.GameObjects.Particles.ParticleEmitter> = new Set();
  
  // Default particle configurations
  static readonly DEFAULT_BLEND_MODE = Phaser.BlendModes.ADD;
  static readonly DEFAULT_SCREEN_BLEND_MODE = Phaser.BlendModes.SCREEN;
  static readonly DEFAULT_LIFESPAN = 600;
  static readonly DEFAULT_ALPHA = { start: 1, end: 0 };
  static readonly ONE_TIME_BURST = -1;
  static readonly CONTINUOUS_EMISSION = 100;
  static readonly FULL_ANGLE_RANGE = { min: 0, max: 360 };
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.phasorScene = scene as Phaser.Scene;
    
    // Get or create ErrorManager
    this.errorManager = scene.getErrorManager ? scene.getErrorManager() : null;
    if (!this.errorManager) {
      // Create our own instance if not available from scene
      this.errorManager = new ErrorManager(scene);
    }
      
    // Create particle textures
    this.createParticleTextures();
    
    // Initialize specialized effect managers
    this.bounceEffectManager = new BounceEffectManager(this);
    this.brickEffectManager = new BrickEffectManager(this);
    this.explosionEffectManager = new ExplosionEffectManager(this);
    this.powerUpEffectManager = new PowerUpEffectManager(this);
    this.trailEffectManager = new TrailEffectManager(this);
  }
  
  /**
   * Update particle colors based on the current theme
   * @param particleColor The color to apply to particles
   */
  public updateParticleColors(particleColor: number): void {
    try {
      // Store the new default particle color
      this.defaultParticleColor = particleColor;
      
      // Update color for all active particle emitters
      this.activeParticles.forEach(emitter => {
        try {
          if (emitter) {
            // For new particles, update the configuration
            if (emitter.config) {
              emitter.config.tint = particleColor;
            }
            
            // For existing particles, we can't change their color directly
            // as Phaser doesn't support changing particle tint after creation
            // But we can store the color for future particles
          }
        } catch (error) {
          // Silently catch errors for individual emitters
        }
      });
      
      // Update all particle controllers
      this.particleControllers.forEach(controller => {
        try {
          if (controller) {
            // The controller has a setTint method but it only logs a warning
            // We'll use it anyway to maintain the API consistency
            controller.setTint(particleColor);
          }
        } catch (error) {
          // Silently catch errors for individual controllers
        }
      });
      
      // Store the color in the registry for future particles
      this.scene.registry.set('particleColor', particleColor);
      
      // Emit an event that particle colors have been updated
      const eventManager = this.scene.getEventManager?.();
      if (eventManager) {
        eventManager.emit('particleColorsUpdated', { color: particleColor });
      }
      
      console.log(`Updated particle colors to ${particleColor.toString(16)}`);
    } catch (error) {
      console.error('Error updating particle colors:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to update particle colors', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Get the scene
   */
  getScene(): BreakoutScene {
    return this.scene;
  }
  
  /**
   * Add a particle controller to be tracked
   */
  addParticleController(controller: ParticleController): void {
    this.particleControllers.push(controller);
  }
    
  /**
   * Add an emitter to be tracked
   */
  trackEmitter(emitter: Phaser.GameObjects.Particles.ParticleEmitter): void {
    this.activeParticles.add(emitter);
  }

  /**
   * Get the current default particle color
   */
  getDefaultParticleColor(): number {
    return this.defaultParticleColor;
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
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
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
   * Safely get X position of an object
   */
  safeGetX(obj: any): number {
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
  safeGetY(obj: any): number {
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
  isEmitterActive(emitter: Phaser.GameObjects.Particles.ParticleEmitter): boolean {
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

  // Delegate methods to specialized managers
  
  /**
   * Create a bounce effect at the specified position
   */
  public createBounceEffect(x: number, y: number, color: number = 0x4444ff, particleScale?: number, particleCount?: number): ParticleController {
    return this.bounceEffectManager.createBounceEffect(x, y, color);
  }
  
  /**
   * Create a particle effect when a brick is hit
   */
  public createBrickHitEffect(brick: Phaser.Physics.Matter.Sprite, color?: number): void {
    this.brickEffectManager.createBrickHitEffect(brick, color);
  }
  
  /**
   * Create a particle effect when a brick is destroyed
   */
  public createBrickDestroyEffect(brick: Phaser.GameObjects.GameObject, color?: number): void {
    this.brickEffectManager.createBrickDestroyEffect(brick, color);
  }
  
  /**
   * Create an explosion effect
   */
  public createExplosion(x: number, y: number, color: number = 0xff8800, particleCount: number = 20): ParticleController {
    return this.explosionEffectManager.createExplosion(x, y, color, particleCount);
  }
  
  /**
   * Create a particle effect for a power-up
   */
  public createPowerUpEffect(x: number, y: number, color: number = 0x00ff00): ParticleController {
    return this.powerUpEffectManager.createPowerUpEffect(x, y, color);
  }
  
  /**
   * Create a trail effect that follows an object
   */
  public createTrail(target: Phaser.GameObjects.GameObject & Phaser.GameObjects.Components.Transform, color: number = 0x00ffff, duration: number = 0): ParticleController {
    return this.trailEffectManager.createTrail(target, color, duration);
  }
  
  /**
   * Create a directional effect based on the edge that was hit
   */
  public createParticleDirectionalEffect(x: number, y: number, angle: number, color: number = 0xffffff) {
    return this.explosionEffectManager.createParticleDirectionalEffect(x, y, angle, color);
  }
  
  /**
   * Create particles at a specific position
   */
  public createParticles(x: number, y: number, config: any = {}): ParticleController {
    return this.explosionEffectManager.createParticles(x, y, config);
  }

  /**
   * Create a visual effect to show ball spin
   * @param ball The ball sprite to create the spin effect for
   * @param color The color of the spin effect particles
   * @param spinMagnitude The magnitude of the spin (affects particle speed and direction)
   */
  public createSpinEffect(
    ball: Phaser.Physics.Matter.Sprite,
    color: number,
    spinMagnitude: number
  ): void {
    try {
      // Create particles that rotate around the ball to show spin direction
      const particles = this.scene.add.particles(ball.x, ball.y, 'particle', {
        speed: 20,
        scale: { start: 0.2, end: 0 },
        blendMode: 'ADD',
        lifespan: 200,
        quantity: 1,
        frequency: 20,
        tint: color
      });
      
      // In Phaser 3.60+, the particles object is the emitter itself
      const emitter = particles;
      
      // Track this emitter
      this.activeParticles.add(emitter);
      
      // Update emitter position in scene update
      const updateListener = () => {
        if (ball.active) {
          particles.setPosition(ball.x, ball.y);
          
          // Create a circular path around the ball
          const radius = ball.displayWidth * 0.7;
          const angle = this.scene.time.now * 0.01 * (spinMagnitude > 0 ? 1 : -1);
          
          // Set emitter properties based on spin
          emitter.speedX ={ min: -20 * spinMagnitude, max: 20 * spinMagnitude };
          emitter.speedY ={ min: -20 * spinMagnitude, max: 20 * spinMagnitude };
        } else {
          // Ball is no longer active, destroy particles
          particles.destroy();
          this.scene.events.off('update', updateListener);
          this.activeParticles.delete(emitter);
        }
      };
      
      // Add update listener
      this.scene.events.on('update', updateListener);
      
      // Destroy particles after a short time
      this.scene.time.delayedCall(500, () => {
        if (particles && particles.active) {
          particles.destroy();
          this.scene.events.off('update', updateListener);
          this.activeParticles.delete(emitter);
        }
      });
    } catch (error) {
      console.error('Error creating spin effect:', error);
    }
  }

  /**
   * Create speed lines behind a fast-moving object
   * @param object The game object to create speed lines behind
   * @param speedFactor Factor that affects the intensity of the speed lines
   */
  public createSpeedLines(
    object: Phaser.Physics.Matter.Sprite,
    speedFactor: number = 1.0
  ): void {
    try {
      if (!object || !object.body) return;
      
      // Get velocity
      const velocity = object.body.velocity;
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      
      // Only create speed lines if the object is moving fast enough
      if (speed < 5) return;
      
      // Calculate normalized velocity vector (direction)
      const normalizedVelocity = {
        x: velocity.x / speed,
        y: velocity.y / speed
      };
      
      // Calculate position behind the object
      const offsetDistance = object.displayWidth * 0.6;
      const position = {
        x: object.x - normalizedVelocity.x * offsetDistance,
        y: object.y - normalizedVelocity.y * offsetDistance
      };
      
      // Calculate angle based on velocity direction
      const angle = Math.atan2(velocity.y, velocity.x) * (180 / Math.PI);
      
      // Create speed line particles
      const particles = this.scene.add.particles(position.x, position.y, 'particle', {
        speed: 5,
        scale: { start: 0.3, end: 0.1 },
        alpha: { start: 0.7, end: 0 },
        lifespan: 200 * speedFactor,
        blendMode: Phaser.BlendModes.ADD,
        angle: angle + 180, // Emit in the opposite direction of movement
        frequency: 10 / speedFactor, // Emit more particles at higher speeds
        quantity: 1,
        tint: 0x88ccff
      });
      
      // In Phaser 3.60+, the particles object is the emitter itself
      const emitter = particles;
      this.activeParticles.add(emitter);
      
      // Auto-destroy after a short time
      this.scene.time.delayedCall(300, () => {
        if (particles && particles.active) {
          particles.destroy();
          this.activeParticles.delete(emitter);
        }
      });
    } catch (error) {
      console.error('Error creating speed lines:', error);
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