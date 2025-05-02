export class AdaptiveRenderer {
  private scene: Phaser.Scene;
  private targetFPS: number;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.targetFPS = 60;

    scene.game.events.on('poststep', () => {
      const currentFPS = scene.game.loop.actualFps;
      this.adjustQuality(currentFPS);
    });
  }

  private adjustQuality(currentFPS: number) {
    if (currentFPS < 45) {
      this.scene.textures.setFilter('nearest');
      this.scene.game.renderer.antialias = false;
    } else {
      this.scene.textures.setFilter('linear');
      this.scene.game.renderer.antialias = true;
    }
  }
}
