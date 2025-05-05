import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUpType';
import { PowerUpHandler } from './PowerUpHandler';

export class StickyPaddlePowerUp implements PowerUpHandler {
  type = PowerUpType.STICKY;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Matter.Sprite, duration: number): void {
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