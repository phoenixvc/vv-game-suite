import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class StickyPaddlePowerUp implements PowerUpHandler {
  type = PowerUpType.STICKY;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    paddle.setData('sticky', true);
    
    // Visual indication
    paddle.setTint(0xFFFF00); // Yellow tint
  }
  
  remove(scene: BreakoutScene): void {
    const paddle = scene['paddle'];
    paddle.setData('sticky', false);
    paddle.clearTint();
  }
}