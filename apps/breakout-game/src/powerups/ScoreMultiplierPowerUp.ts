import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class ScoreMultiplierPowerUp implements PowerUpHandler {
  type = PowerUpType.SCORE_MULTIPLIER;
  private multiplierText: Phaser.GameObjects.Text | null = null;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    // Store the multiplier in the scene data
    scene.data.set('scoreMultiplier', 2);
    
    // Show visual indicator
    this.multiplierText = scene.add.text(
      scene.scale.width - 160, 
      80, 
      'Score x2', 
      {
        fontSize: '24px',
        color: '#8B5CF6',
        fontFamily: 'Arial'
      }
    ).setScrollFactor(0);
    
    scene.data.set('multiplierText', this.multiplierText);
  }
  
  remove(scene: BreakoutScene): void {
    scene.data.set('scoreMultiplier', 1);
    
    // Remove visual indicator
    if (this.multiplierText) {
      this.multiplierText.destroy();
      this.multiplierText = null;
    }
  }
}