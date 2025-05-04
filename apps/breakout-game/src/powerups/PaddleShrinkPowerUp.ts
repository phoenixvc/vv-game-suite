import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class PaddleShrinkPowerUp implements PowerUpHandler {
  type = PowerUpType.PADDLE_SHRINK;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    paddle.setScale(0.5, 1);
    
    // Add visual feedback
    scene.cameras.main.flash(300, 255, 0, 0); // Flash red
  }
  
  remove(scene: BreakoutScene): void {
    scene['paddle'].setScale(1, 1);
  }
}