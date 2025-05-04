import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class PaddleGrowPowerUp implements PowerUpHandler {
  type = PowerUpType.PADDLE_GROW;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    paddle.setScale(1.5, 1);
    
    // Add visual feedback
    scene.cameras.main.flash(300, 0, 0, 255); // Flash blue
  }
  
  remove(scene: BreakoutScene): void {
    scene['paddle'].setScale(1, 1);
  }
}