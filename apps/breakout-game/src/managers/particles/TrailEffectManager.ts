import * as Phaser from 'phaser';
import ParticleController from '../../controllers/ParticleController';
import ParticleManager from '../ParticleManager';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Manages trail particle effects
 */
export class TrailEffectManager {
  private manager: ParticleManager;
  private scene: Phaser.Scene;
  
  // Trail effect configurations
  private static readonly TRAIL_SPEED = { min: 0, max: 10 };
  private static readonly TRAIL_SCALE = { start: 0.2, end: 0 };
  private static readonly TRAIL_LIFESPAN = 300;
  private static readonly TRAIL_EMISSION = 50;
  
  constructor(manager: ParticleManager) {
    this.manager = manager;
    this.scene = manager.getScene();
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
        console.warn('[TrailEffectManager] Cannot create trail for null target');
        return null;
      }
      
      // Safely get target position
      const x = this.manager.safeGetX(target);
      const y = this.manager.safeGetY(target);
      
      // Create emitter configuration
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: TrailEffectManager.TRAIL_SPEED,
        scale: TrailEffectManager.TRAIL_SCALE,
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: TrailEffectManager.TRAIL_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_BLEND_MODE,
        frequency: TrailEffectManager.TRAIL_EMISSION,
        follow: target
      };

      // Create the emitter directly
      const emitter = this.scene.add.particles(x, y, 'particle', emitterConfig);
      
      // Track this emitter
      this.manager.trackEmitter(emitter);

      // Create and store controller
      const controller = new ParticleController(this.scene as BreakoutScene, emitter, duration);
      this.manager.addParticleController(controller);

      return controller;
    } catch (e) {
      console.warn('[TrailEffectManager] Error creating trail:', e);
      return null;
    }
  }
}