export class AdaptiveRenderer {
  private scene: Phaser.Scene;
  private targetFPS: number;
  private isLowQuality: boolean = false;
  private originalMinFPS: number;
  private originalTargetFPS: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.targetFPS = 60;
    // Store the original FPS settings
    this.originalMinFPS = scene.game.loop.minFps;
    this.originalTargetFPS = scene.game.loop.targetFps;

    scene.game.events.on('poststep', () => {
      const currentFPS = scene.game.loop.actualFps;
      this.adjustQuality(currentFPS);
    });
  }

  private adjustQuality(currentFPS: number) {
    // Only change quality settings when there's a significant change in performance
    // to avoid constantly toggling settings
    if (currentFPS < 45 && !this.isLowQuality) {
      this.isLowQuality = true;
      
      // Apply to all textures in the game - use proper Phaser texture filtering
      try {
        const textureManager = this.scene.textures;
        const textureKeys = textureManager.getTextureKeys();
        textureKeys.forEach(key => {
          // Skip __DEFAULT and __MISSING which are special textures
          if (key !== '__DEFAULT' && key !== '__MISSING') {
            const texture = textureManager.get(key);
            // Use type assertion to access setFilter method
            (texture as any).setFilter && (texture as any).setFilter(0); // 0 = NEAREST
          }
        });
      } catch (e) {
        console.warn('Could not adjust texture filtering:', e);
      }
      
      // Reduce the target frame rate - use only minFps and targetFps
      this.scene.game.loop.minFps = 30;
      this.scene.game.loop.targetFps = 30;
      
      console.log('Switched to low quality mode');
    } 
    else if (currentFPS > 55 && this.isLowQuality) {
      this.isLowQuality = false;
      
      // Restore texture filtering
      try {
        const textureManager = this.scene.textures;
        const textureKeys = textureManager.getTextureKeys();
        textureKeys.forEach(key => {
          // Skip __DEFAULT and __MISSING which are special textures
          if (key !== '__DEFAULT' && key !== '__MISSING') {
            const texture = textureManager.get(key);
            // Use type assertion to access setFilter method
            (texture as any).setFilter && (texture as any).setFilter(1); // 1 = LINEAR
          }
        });
      } catch (e) {
        console.warn('Could not adjust texture filtering:', e);
      }
      
      // Restore the original frame rate settings
      this.scene.game.loop.minFps = this.originalMinFPS;
      this.scene.game.loop.targetFps = this.originalTargetFPS;
      
      console.log('Switched to high quality mode');
    }
  }
}