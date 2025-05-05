import * as Phaser from 'phaser';
import ParticleController from '../../controllers/ParticleController';
import ParticleManager from '../ParticleManager';

/**
 * Manages bounce effect particles
 */
export class BounceEffectManager {
  private manager: ParticleManager;
  private scene: Phaser.Scene;
  
  // Bounce effect configuration
  private static readonly BOUNCE_SPEED = { min: 30, max: 80 };
  private static readonly BOUNCE_SCALE = { start: 0.3, end: 0 };
  private static readonly BOUNCE_LIFESPAN = 300;
  private static readonly BOUNCE_PARTICLE_COUNT = 8;
  
  constructor(manager: ParticleManager) {
    this.manager = manager;
    this.scene = manager.getScene();
  }
  
  /**
   * Create a bounce effect at the specified position
   * @param x X position
   * @param y Y position
   * @param color Color of the bounce effect particles
   * @returns Controller for the created effect
   */
  public createBounceEffect(
    x: number,
    y: number,
    color: number = 0x4444ff
  ): ParticleController {
    try {
      // Create a small burst of particles at the bounce point
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: BounceEffectManager.BOUNCE_SPEED,
        scale: BounceEffectManager.BOUNCE_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: BounceEffectManager.BOUNCE_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_SCREEN_BLEND_MODE,
        frequency: ParticleManager.ONE_TIME_BURST, // Emit all particles at once
        quantity: BounceEffectManager.BOUNCE_PARTICLE_COUNT,
        angle: ParticleManager.FULL_ANGLE_RANGE
      };
      
      // Create the emitter directly
      const emitter = this.scene.add.particles(x, y, 'circle', emitterConfig);
      
      // Track this emitter
      this.manager.trackEmitter(emitter);
      
      // Create and store controller
      const controller = new ParticleController(this.scene, emitter, BounceEffectManager.BOUNCE_LIFESPAN);
      this.manager.addParticleController(controller);
      
      return controller;
    } catch (e) {
      console.warn('[BounceEffectManager] Error creating bounce effect:', e);
      return null;
    }
  }
}