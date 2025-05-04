import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Manages UI elements related to balls
 */
class BallUIManager {
  private scene: BreakoutScene;
  private startPrompt?: Phaser.GameObjects.Text;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Create the start prompt
   */
  public createStartPrompt(): void {
    // Remove existing prompt if it exists
    this.removeStartPrompt();
    
    // Create new prompt
    const { width, height } = this.scene.scale;
    
    this.startPrompt = this.scene.add.text(
      width / 2,
      height / 2,
      'Click or press SPACE to launch',
      {
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    );
    
    this.startPrompt.setOrigin(0.5);
    this.startPrompt.setDepth(100);
    
    // Add a pulsing animation
    this.scene.tweens.add({
      targets: this.startPrompt,
      alpha: { from: 1, to: 0.5 },
      duration: 800,
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
  
  /**
   * Remove the start prompt
   */
  public removeStartPrompt(): void {
    if (this.startPrompt) {
      this.startPrompt.destroy();
      this.startPrompt = undefined;
    }
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.removeStartPrompt();
  }
}

export default BallUIManager;