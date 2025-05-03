export class AdaptiveRenderer {
  private scene: Phaser.Scene;
  private lastFpsCheck: number = 0;
  private fpsCheckInterval: number = 1000; // Check every second
  private fpsThreshold: number = 50; // Threshold for quality adjustment
  private qualityLevel: number = 2; // Medium quality by default (1=low, 2=medium, 3=high)
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Set up automatic performance monitoring
    this.scene.events.on('update', this.monitorPerformance, this);
    
    // Clean up when scene shuts down
    this.scene.events.once('shutdown', this.destroy, this);
  }
  
  /**
   * Automatically monitors performance and adjusts quality as needed
   * This is called automatically on each update
   */
  private monitorPerformance(): void {
    const currentTime = this.scene.time.now;
    
    // Only check FPS periodically to avoid overhead
    if (currentTime - this.lastFpsCheck > this.fpsCheckInterval) {
      this.lastFpsCheck = currentTime;
      this.adjustQuality(this.scene.game.loop.actualFps);
    }
  }
  
  /**
   * Adjusts the game quality based on current FPS
   * @param currentFPS - The current frames per second
   */
  private adjustQuality(currentFPS: number): void {
    // If FPS is too low, reduce quality
    if (currentFPS < this.fpsThreshold && this.qualityLevel > 1) {
      this.qualityLevel--;
      this.applyQualitySettings();
    } 
    // If FPS is good and we're not at max quality, increase quality
    else if (currentFPS > this.fpsThreshold + 10 && this.qualityLevel < 3) {
      this.qualityLevel++;
      this.applyQualitySettings();
    }
  }
  
  /**
   * Applies quality settings based on current quality level
   */
  private applyQualitySettings(): void {
    switch (this.qualityLevel) {
      case 1: // Low quality
        this.scene.scale.setZoom(1);
        this.scene.cameras.main.setRoundPixels(true);
        this.disableParticles();
        break;
      case 2: // Medium quality
        this.scene.scale.setZoom(window.devicePixelRatio > 1 ? 1.5 : 1);
        this.scene.cameras.main.setRoundPixels(false);
        break;
      case 3: // High quality
        this.scene.scale.setZoom(window.devicePixelRatio);
        this.scene.cameras.main.setRoundPixels(false);
        break;
    }
    
    // Log quality change
    console.log(`Quality adjusted to level ${this.qualityLevel} (FPS: ${this.scene.game.loop.actualFps})`);
  }
  
  /**
   * Disables particle effects for low-end devices
   */
  private disableParticles(): void {
    // Find and disable any particle emitters
    const particles = this.scene.children.getChildren().filter(
      child => child instanceof Phaser.GameObjects.Particles.ParticleEmitter
    );
    
    particles.forEach(emitter => {
      (emitter as Phaser.GameObjects.Particles.ParticleEmitter).stop();
    });
  }
  
  /**
   * Clean up when the scene is destroyed
   */
  public destroy(): void {
    this.scene.events.off('update', this.monitorPerformance, this);
  }
  
  /**
   * Public method to manually set quality level
   * @param level - Quality level (1=low, 2=medium, 3=high)
   */
  public setQualityLevel(level: number): void {
    if (level >= 1 && level <= 3) {
      this.qualityLevel = level;
      this.applyQualitySettings();
    }
  }
}
