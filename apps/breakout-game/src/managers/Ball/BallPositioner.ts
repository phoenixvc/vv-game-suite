import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Handles positioning and attaching balls to paddles
 */
class BallPositioner {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Update the ball's position on the paddle
   */
  public updateBallPositionOnPaddle(
    ball: Phaser.Physics.Matter.Sprite, 
    paddle: Phaser.Physics.Matter.Sprite
  ): void {
    if (!ball || !paddle) {
      console.log('Cannot update ball position: invalid ball or paddle');
      return;
    }
    
    const paddleEdge = paddle.getData('edge') || 'bottom';
    
    // Calculate the correct position based on paddle edge
    switch (paddleEdge) {
      case 'top':
        ball.x = paddle.x;
        ball.y = paddle.y + paddle.height / 2 + ball.height / 2 + 2;
        break;
      case 'bottom':
        ball.x = paddle.x;
        ball.y = paddle.y - paddle.height / 2 - ball.height / 2 - 2;
        break;
      case 'left':
        ball.x = paddle.x + paddle.width / 2 + ball.width / 2 + 2;
        ball.y = paddle.y;
        break;
      case 'right':
        ball.x = paddle.x - paddle.width / 2 - ball.width / 2 - 2;
        ball.y = paddle.y;
        break;
      default:
        // If edge is not specified, default to bottom
        ball.x = paddle.x;
        ball.y = paddle.y - paddle.height / 2 - ball.height / 2 - 2;
        break;
    }
    
    // Ensure the ball has no velocity
    if (ball.body) {
      this.scene.matter.body.setVelocity(ball.body as any, { x: 0, y: 0 });
    }
  }
  
  /**
   * Calculate launch angle based on paddle position
   */
  public calculateLaunchAngle(paddle: Phaser.Physics.Matter.Sprite): number {
    let angle = -Math.PI / 2; // Default: straight up
    
    if (paddle) {
      const paddleEdge = paddle.getData('edge') || 'bottom';
      
      // Adjust angle based on which edge of the paddle is facing inward
      switch (paddleEdge) {
        case 'top':
          angle = Math.PI / 2; // Down
          break;
        case 'bottom':
          angle = -Math.PI / 2; // Up
          break;
        case 'left':
          angle = 0; // Right
          break;
        case 'right':
          angle = -Math.PI; // Left
          break;
      }
      
      // Add slight randomness to angle
      const randomFactor = 5;
      angle += (Math.random() - 0.5) * Math.PI / randomFactor;
    } else {
      // Add some randomness to the angle for non-attached balls
      angle += (Math.random() * 0.5 - 0.25); // +/- 0.25 radians
    }
    
    return angle;
  }
}

export default BallPositioner;