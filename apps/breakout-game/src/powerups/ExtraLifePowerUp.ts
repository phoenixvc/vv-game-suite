import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class ExtraLifePowerUp implements PowerUpHandler {
  type = PowerUpType.EXTRA_LIFE;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    // Increment lives directly
    const currentLives = parseInt(scene['livesText'].text.replace('Lives: ', ''));
    scene['lives'] = currentLives + 1;
    scene['livesText'].setText(`Lives: ${scene['lives']}`);
    
    // Add visual feedback
    scene.cameras.main.flash(500, 0, 255, 0); // Flash green
  }
  
  remove(scene: BreakoutScene): void {
    // No cleanup needed for extra life power-up
  }
}