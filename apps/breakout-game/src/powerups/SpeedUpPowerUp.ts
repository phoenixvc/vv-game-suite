import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUpType';
import { PowerUpHandler } from './PowerUpHandler';

export class SpeedUpPowerUp implements PowerUpHandler {
  type = PowerUpType.SPEED_UP;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Matter.Sprite, duration: number): void {
    const ball = scene['ball'];
    
    // Add null check for ball.body
    if (ball && ball.body) {
      ball.setVelocity(ball.body.velocity.x * 1.5, ball.body.velocity.y * 1.5);
    }
    
    // Add visual feedback
    scene.cameras.main.flash(300, 255, 0, 0); // Flash red
  }
  
  remove(scene: BreakoutScene): void {
    const ball = scene['ball'];
    if (ball && ball.body) {
      ball.setVelocity(ball.body.velocity.x / 1.5, ball.body.velocity.y / 1.5);
}
  }
}