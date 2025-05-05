import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import ParticleController from '../../controllers/ParticleController';
import ParticleManager from '../ParticleManager';

/**
 * Manages power-up related particle effects
 */
export class PowerUpEffectManager {
  private manager: ParticleManager;
  private scene: Phaser.Scene;
  
  // Power-up effect configurations
  private static readonly POWERUP_SPEED = { min: 10, max: 30 };
  private static readonly POWERUP_SCALE = { start: 0.2, end: 0 };
  private static readonly POWERUP_LIFESPAN = 500;
  
  constructor(manager: ParticleManager) {
    this.manager = manager;
    this.scene = manager.getScene();
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
        speed: PowerUpEffectManager.POWERUP_SPEED,
        scale: PowerUpEffectManager.POWERUP_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: PowerUpEffectManager.POWERUP_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_BLEND_MODE,
        frequency: ParticleManager.CONTINUOUS_EMISSION
      };

      // Create the emitter directly
      const emitter = this.scene.add.particles(x, y, 'particle', emitterConfig);
      
      // Track this emitter
      this.manager.trackEmitter(emitter);

      // Create controller
      const controller = new ParticleController(this.scene as BreakoutScene, emitter);
      this.manager.addParticleController(controller);

      return controller;
    } catch (e) {
      console.warn('[PowerUpEffectManager] Error creating power-up effect:', e);
      return null;
    }
  }
}