import * as Phaser from 'phaser';
import ParticleController from '../../controllers/ParticleController';
import ParticleManager from '../ParticleManager';

/**
 * Manages brick-related particle effects
 */
export class BrickEffectManager {
  private manager: ParticleManager;
  private scene: Phaser.Scene;
  
  // Brick effect configurations
  private static readonly BRICK_HIT_LIFESPAN = 300;
  private static readonly BRICK_DESTROY_LIFESPAN = 600;
  private static readonly BRICK_HIT_SPEED = { min: 20, max: 80 };
  private static readonly BRICK_HIT_SCALE = { start: 0.3, end: 0 };
  private static readonly BRICK_HIT_PARTICLE_COUNT = 5;
  private static readonly BRICK_DESTROY_PARTICLE_COUNT = 15;
  
  constructor(manager: ParticleManager) {
    this.manager = manager;
    this.scene = manager.getScene();
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
          x = this.manager.safeGetX(brick);
          y = this.manager.safeGetY(brick);
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
      if (!color && brick.tintTopLeft) {
        color = brick.tintTopLeft;
      } else if (!color) {
        color = 0xffffff;
      }

      // Create a small particle burst at the brick's position
      this.createParticles(x, y, {
        color,
        count: BrickEffectManager.BRICK_HIT_PARTICLE_COUNT,
        speed: BrickEffectManager.BRICK_HIT_SPEED,
        scale: BrickEffectManager.BRICK_HIT_SCALE,
        lifespan: BrickEffectManager.BRICK_HIT_LIFESPAN,
        duration: BrickEffectManager.BRICK_HIT_LIFESPAN
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
          x = this.manager.safeGetX(brick);
          y = this.manager.safeGetY(brick);
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
      if (!color && brick instanceof Phaser.GameObjects.Sprite && brick.tintTopLeft) {
        color = brick.tintTopLeft;
      }
      
      // Default color if still not set
      if (!color) {
        color = 0xffffff;
      }
      
      // Create a larger particle burst with square particles
      this.createParticles(x, y, {
        texture: 'square',
        color,
        count: BrickEffectManager.BRICK_DESTROY_PARTICLE_COUNT,
        speed: { min: 50, max: 150 },
        scale: { start: 0.5, end: 0 },
        lifespan: BrickEffectManager.BRICK_DESTROY_LIFESPAN,
        duration: BrickEffectManager.BRICK_DESTROY_LIFESPAN
      });
    } catch (e) {
      // Silent fail - don't log this error to avoid console spam
    }
  }
  
  /**
   * Create particles at a specific position
   */
  private createParticles(
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
      const count = config.count || 10;
      const speed = config.speed || { min: 50, max: 150 };
      const scale = config.scale || { start: 0.4, end: 0 };
      const lifespan = config.lifespan || 800;
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
      
      // Create the emitter directly
      const emitter = this.scene.add.particles(x, y, texture, emitterConfig);
      
      // Track this emitter
      this.manager.trackEmitter(emitter);
      
      // Create and store controller
      const controller = new ParticleController(this.scene, emitter, duration);
      this.manager.addParticleController(controller);
      
      return controller;
    } catch (e) {
      console.warn('[BrickEffectManager] Error creating particles:', e);
      return null;
    }
  }
}