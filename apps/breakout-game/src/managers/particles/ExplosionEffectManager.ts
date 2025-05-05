import * as Phaser from 'phaser';
import ParticleController from '../../controllers/ParticleController';
import ParticleManager from '../ParticleManager';

/**
 * Manages explosion and general particle effects
 */
export class ExplosionEffectManager {
  private manager: ParticleManager;
  private scene: Phaser.Scene;
  
  // Explosion effect configurations
  private static readonly EXPLOSION_SPEED = { min: 50, max: 200 };
  private static readonly EXPLOSION_LIFESPAN = 500;
  private static readonly EXPLOSION_PARTICLE_COUNT = 20;
  private static readonly DEFAULT_PARTICLES_LIFESPAN = 800;
  
  constructor(manager: ParticleManager) {
    this.manager = manager;
    this.scene = manager.getScene();
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
    particleCount: number = ExplosionEffectManager.EXPLOSION_PARTICLE_COUNT
  ): ParticleController {
    try {
      // Create emitter configuration
      const emitterConfig: Phaser.Types.GameObjects.Particles.ParticleEmitterConfig = {
        speed: ExplosionEffectManager.EXPLOSION_SPEED,
        angle: ParticleManager.FULL_ANGLE_RANGE,
        scale: { start: 0.5, end: 0 },
        alpha: ParticleManager.DEFAULT_ALPHA,
        lifespan: ExplosionEffectManager.EXPLOSION_LIFESPAN,
        tint: { onEmit: () => color },
        blendMode: ParticleManager.DEFAULT_SCREEN_BLEND_MODE,
        frequency: ParticleManager.ONE_TIME_BURST, // Emit all particles at once
        quantity: particleCount
      };
      
      // Create the emitter directly
      const emitter = this.scene.add.particles(x, y, 'particle', emitterConfig);
      
      // Track this emitter
      this.manager.trackEmitter(emitter);
      
      // Create and store controller
      const controller = new ParticleController(this.scene, emitter, ExplosionEffectManager.EXPLOSION_LIFESPAN);
      this.manager.addParticleController(controller);
      
      return controller;
    } catch (e) {
      console.warn('[ExplosionEffectManager] Error creating explosion:', e);
      return null;
    }
  }
  
  /**
   * Create a directional effect based on the edge that was hit
   * @param x X position
   * @param y Y position
   * @param angle Angle of impact in radians
   * @param color Color of particles
   */
  public createParticleDirectionalEffect(x: number, y: number, angle: number, color: number = 0xffffff) {
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
      this.manager.trackEmitter(particles);
      
      // Store reference to this for use in callbacks
      const self = this;
      
      // Stop emitting after a short time and destroy
      this.scene.time.delayedCall(200, () => {
        try {
          if (this.manager.isEmitterActive(particles)) {
            particles.stop();
            this.scene.time.delayedCall(500, () => {
              try {
                if (this.manager.isEmitterActive(particles)) {
                  particles.destroy();
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
      console.warn('[ExplosionEffectManager] Error creating directional effect:', e);
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
      const count = config.count || 10;
      const speed = config.speed || { min: 50, max: 150 };
      const scale = config.scale || { start: 0.4, end: 0 };
      const lifespan = config.lifespan || ExplosionEffectManager.DEFAULT_PARTICLES_LIFESPAN;
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
      console.warn('[ExplosionEffectManager] Error creating particles:', e);
      return null;
    }
  }
}