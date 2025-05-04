import * as Phaser from 'phaser';
import ParticleController from '../controllers/ParticleController';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Manages particle effects in the game
 */
class ParticleManager {
  private scene: BreakoutScene;
  private phasorScene: Phaser.Scene;
  private particleControllers: ParticleController[] = [];
  private particleTextures: string[] = ['particle', 'square', 'circle'];
  
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
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.phasorScene = scene as Phaser.Scene;
    this.createParticleTextures();
  }

  /**
   * Create default particle textures if they don't exist
   */
  private createParticleTextures(): void {
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
  }
  /**
   * Create a particle emitter with specified texture and configuration
   * @param texture The texture key to use for particles
   * @param config Optional configuration for the emitter
   * @returns The created particle emitter
   */
  public createEmitter(texture: string, config?: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig): Phaser.GameObjects.Particles.ParticleEmitter {
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
    return emitter;
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
    
    // Create and store controller
    const controller = new ParticleController(this.scene, emitter, ParticleManager.DEFAULT_EXPLOSION_LIFESPAN);
    this.particleControllers.push(controller);
    
    return controller;
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
    const emitter = this.scene.add.particles(target.x, target.y, 'particle', emitterConfig);

    // Create and store controller
    const controller = new ParticleController(this.scene, emitter, duration);
    this.particleControllers.push(controller);

    return controller;
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
    
    // Create and store controller
    const controller = new ParticleController(this.scene, emitter, duration);
    this.particleControllers.push(controller);
    
    return controller;
  }

  /**
   * Create a particle effect when a brick is hit
   * @param brick The brick that was hit
   * @param color Color to use for particles
   */
  public createBrickHitEffect(brick: Phaser.Physics.Matter.Sprite, color?: number): void {
    if (!brick) return;
    
    // Use brick tint if color not specified
    if (!color && brick.tintTopLeft) {
      color = brick.tintTopLeft;
    } else {
      color = 0xffffff;
}

    // Create a small particle burst at the brick's position
    this.createParticles(brick.x, brick.y, {
      color,
      count: ParticleManager.BRICK_HIT_PARTICLE_COUNT,
      speed: ParticleManager.BRICK_HIT_SPEED,
      scale: ParticleManager.BRICK_HIT_SCALE,
      lifespan: ParticleManager.BRICK_HIT_LIFESPAN,
      duration: ParticleManager.BRICK_HIT_LIFESPAN
    });
  }

  /**
   * Create a particle effect when a brick is destroyed
   * @param brick The brick that was destroyed
   * @param color Color to use for particles
   */
  public createBrickDestroyEffect(brick: Phaser.Physics.Matter.Sprite, color?: number): void {
    if (!brick) return;
    
    // Use brick tint if color not specified
    if (!color && brick.tintTopLeft) {
      color = brick.tintTopLeft;
    } else {
      color = 0xffffff;
    }
    
    // Create a larger particle burst with square particles
    this.createParticles(brick.x, brick.y, {
      texture: 'square',
      color,
      count: ParticleManager.BRICK_DESTROY_PARTICLE_COUNT,
      speed: ParticleManager.DEFAULT_SPEED,
      scale: ParticleManager.DEFAULT_SCALE,
      lifespan: ParticleManager.BRICK_DESTROY_LIFESPAN,
      duration: ParticleManager.BRICK_DESTROY_LIFESPAN
    });
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

    // Wrap it in your controller
    const controller = new ParticleController(this.scene, emitter);
    this.particleControllers.push(controller);

    return controller;
  }

  /**
   * Update all particle controllers
   */
  public update(): void {
    // Remove inactive controllers from the array
    this.particleControllers = this.particleControllers.filter(controller => {
      return controller.isActive();
    });
  }

  /**
   * Clean up all particle effects
   */
  public cleanup(): void {
    // Destroy all particle controllers
    this.particleControllers.forEach(controller => {
      controller.destroy();
    });
    
    // Clear the array
    this.particleControllers = [];
  }
}

export default ParticleManager;