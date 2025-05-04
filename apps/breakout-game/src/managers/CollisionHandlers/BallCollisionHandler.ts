import MatterJS from 'matter-js';
import * as Phaser from 'phaser';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

export class BallCollisionHandler implements CollisionHandlerInterface {
  private scene: BreakoutScene;
  private speedMultiplier: number = 1;
  private initialBallVelocity: number = 5; // Default value, should be set from BallManager
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  handleCollision(
    bodyA: MatterJS.BodyType, 
    bodyB: MatterJS.BodyType,
    stage: 'start' | 'active' | 'end'
  ): boolean {
    // This is a base class that can be extended by specific ball collision handlers
    return false;
  }
  
  /**
   * Calculate the bounce angle when a ball hits a paddle
   * @param ball The ball sprite
   * @param paddle The paddle sprite
   */
  public calculateBallAngle(ball: Phaser.Physics.Matter.Sprite, paddle: Phaser.Physics.Matter.Sprite): void {
    // Get the position of the ball relative to the paddle
    const ballCenterX = ball.x;
    const paddleWidth = paddle.displayWidth;
    const paddleCenterX = paddle.x;
    
    // Calculate how far from the center of the paddle the ball hit
    // -1 = far left, 0 = center, 1 = far right
    const hitPosition = (ballCenterX - paddleCenterX) / (paddleWidth / 2);
    
    // Calculate the angle based on hit position
    // Constrain the angle to avoid too horizontal bounces
    const maxAngle = Math.PI / 3; // 60 degrees
    const bounceAngle = hitPosition * maxAngle;
    
    // Calculate the velocity components
    const speed = this.initialBallVelocity * this.getSpeedMultiplier();
    const velocityX = Math.sin(bounceAngle) * speed;
    const velocityY = -Math.cos(bounceAngle) * speed; // Negative to go upward
    
    // Apply the new velocity to the ball
    ball.setVelocity(velocityX, velocityY);
    
    // Emit an event for the bounce
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballBounced', { 
        ball,
        angle: bounceAngle,
        hitPosition
      });
    }
  }
  
  /**
   * Get the current speed multiplier
   */
  protected getSpeedMultiplier(): number {
    return this.speedMultiplier || 1;
  }
  
  /**
   * Set the speed multiplier for all balls
   */
  public setSpeedFactor(factor: number): void {
    this.speedMultiplier = factor;
  }
  
  /**
   * Set the initial ball velocity
   */
  public setInitialVelocity(velocity: number): void {
    this.initialBallVelocity = velocity;
  }
  
  /**
   * Check if two categories match a collision pair (in any order)
   */
  protected checkCollisionCategories(
    categoryA: number, 
    categoryB: number,
    expectedA: number,
    expectedB: number
  ): boolean {
    return (categoryA === expectedA && categoryB === expectedB) || 
           (categoryA === expectedB && categoryB === expectedA);
  }
}