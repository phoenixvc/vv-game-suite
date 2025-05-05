import * as Phaser from 'phaser';

/**
 * Controls a single particle effect in the game
 */
class ParticleController {
  private scene: Phaser.Scene;
  private particles: Phaser.GameObjects.Particles.ParticleEmitter;
  private duration: number;
  private active: boolean = true;
  private timer: Phaser.Time.TimerEvent;

  /**
   * Create a particle controller
   * @param scene The scene this particle effect belongs to
   * @param particles The particle emitter to control
   * @param duration Duration in ms before auto-destroying (0 for permanent)
   */
  constructor(
    scene: Phaser.Scene, 
    particles: Phaser.GameObjects.Particles.ParticleEmitter, 
    duration: number = 0
  ) {
    this.scene = scene;
    this.particles = particles;
    this.duration = duration;
    
    // Set up auto-destroy timer if duration is specified
    if (duration > 0) {
      this.timer = this.scene.time.delayedCall(duration, () => {
        this.stop();
      });
    }
  }

  /**
   * Update the particle effect position
   * @param x New x position
   * @param y New y position
   */
  public setPosition(x: number, y: number): void {
    if (this.active && this.particles) {
      // Use the emitter's x and y properties
      this.particles.x = x;
      this.particles.y = y;
      }
    }
  
  /**
   * Stop emitting new particles but let existing ones finish
   */
  public stop(): void {
    if (this.active && this.particles) {
      // Stop the emitter
      this.particles.stop();
      
      // Clean up completely after last particle is gone
      // Use a reasonable default for lifespan
      const lifespan = 1000;
      
      this.scene.time.delayedCall(lifespan, () => {
        this.destroy();
      });
    }
  }
      
  /**
   * Immediately destroy the particle effect
   */
  public destroy(): void {
    if (this.active) {
      this.active = false;
      
      if (this.timer) {
        this.timer.remove();
  }
  
      if (this.particles) {
        // Stop the emitter
        this.particles.stop();
        
        // Destroy the particle emitter
        this.particles.destroy();
      }
    }
  }

  /**
   * Check if the particle effect is still active
   */
  public isActive(): boolean {
    return this.active;
    }
  
  /**
   * Get the particle emitter
   */
  public getEmitter(): Phaser.GameObjects.Particles.ParticleEmitter | null {
    if (this.particles) {
      return this.particles;
    }
    return null;
  }
  
  /**
   * Set the particle emission rate
   * @param quantity Number of particles to emit per second
   */
  public setFrequency(quantity: number): void {
    if (this.active && this.particles) {
      // Set the frequency property
      this.particles.frequency = 1000 / quantity;
    }
  }
  
  /**
   * Emit a burst of particles
   * @param count Number of particles to emit
   */
  public emitParticles(count: number): void {
    if (this.active && this.particles) {
      // Emit particles
      this.particles.emitParticle(count);
}
  }

  /**
   * Set the particle tint color
   * Note: In Phaser, tint is typically set at particle creation time
   * This method may not work as expected after the emitter is created
   * @param tint Color value as a hex number
   */
  public setTint(tint: number): void {
    console.warn('Particle tint cannot be changed after creation');
  }
  /**
   * Set the particle scale
   * Note: In Phaser, scale is typically set at particle creation time
   * This method may not work as expected after the emitter is created
   * @param start Starting scale
   * @param end Ending scale
   */
  public setScale(start: number, end: number): void {
    console.warn('Particle scale cannot be changed after creation');
  }
  /**
   * Set the particle speed
   * Note: In Phaser, speed is typically set at particle creation time
   * This method may not work as expected after the emitter is created
   * @param min Minimum speed
   * @param max Maximum speed
   */
  public setSpeed(min: number, max: number): void {
    console.warn('Particle speed cannot be changed after creation');
  }
  
  /**
   * Set the particle lifespan
   * Note: In Phaser, lifespan is typically set at particle creation time
   * This method may not work as expected after the emitter is created
   * @param lifespan Lifespan in milliseconds
   */
  public setLifespan(lifespan: number): void {
    console.warn('Particle lifespan cannot be changed after creation');
  }
  
  /**
   * Set the particle alpha
   * Note: In Phaser, alpha is typically set at particle creation time
   * This method may not work as expected after the emitter is created
   * @param start Starting alpha
   * @param end Ending alpha
   */
  public setAlpha(start: number, end: number): void {
    console.warn('Particle alpha cannot be changed after creation');
  }
  
  /**
   * Set the particle blend mode
   * Note: In Phaser, blend mode is typically set at particle creation time
   * This method may not work as expected after the emitter is created
   * @param blendMode Blend mode to use
   */
  public setBlendMode(blendMode: Phaser.BlendModes): void {
    console.warn('Particle blend mode cannot be changed after creation');
  }
  
  /**
   * Pause the particle emitter
   */
  public pause(): void {
    if (this.active && this.particles) {
      this.particles.pause();
    }
  }
  
  /**
   * Resume the particle emitter
   */
  public resume(): void {
    if (this.active && this.particles) {
      this.particles.resume();
    }
  }
  
  /**
   * Update the particle effect (called each frame)
   * @param time Current time
   * @param delta Time since last frame
   */
  public update(time: number, delta: number): void {
    // This method can be used for custom updates if needed
  }
}
export default ParticleController;