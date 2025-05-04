import * as Phaser from 'phaser';
import MatterJS from 'matter-js';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

export class BallPaddleCollisionHandler implements CollisionHandlerInterface {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  handleCollision(
    bodyA: MatterJS.BodyType, 
    bodyB: MatterJS.BodyType,
    stage: 'start' | 'active' | 'end'
  ): boolean {
    // Skip if not start stage
    if (stage !== 'start') return false;
    
    // Check if this is a ball-paddle collision
    const physicsManager = this.scene.getPhysicsManager();
    if (!physicsManager) return false;
    
    const isBallPaddleCollision = this.checkCollisionCategories(
      bodyA.collisionFilter?.category || 0,
      bodyB.collisionFilter?.category || 0,
      physicsManager.ballCategory,
      physicsManager.paddleCategory
    );
    
    if (!isBallPaddleCollision) return false;
    
    // Get ball and paddle game objects
    const ball = bodyA.label?.includes('ball') ? bodyA.gameObject : bodyB.gameObject;
    const paddle = bodyA.label?.includes('paddle') ? bodyA.gameObject : bodyB.gameObject;
    
    if (!ball || !paddle) return false;
    
    // Process the collision
    this.processBallPaddleCollision(ball, paddle);
    return true;
  }
  
  private processBallPaddleCollision(
    ball: Phaser.GameObjects.GameObject,
    paddle: Phaser.GameObjects.GameObject
  ): void {
    // Convert to Matter sprites
    const ballSprite = ball as Phaser.Physics.Matter.Sprite;
    const paddleSprite = paddle as Phaser.Physics.Matter.Sprite;
    
    // Use the BallManager to calculate the bounce angle
    const ballManager = this.scene.getBallManager();
    if (ballManager && typeof ballManager.calculateBallAngle === 'function') {
      ballManager.calculateBallAngle(ballSprite, paddleSprite);
    }
    
    // Emit an event for the ball-paddle collision
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      const edge = paddleSprite.getData('edge') || 'bottom';
      eventManager.emit('ballPaddleCollision', { 
        ball: ballSprite, 
        paddle: paddleSprite,
        edge
      });
    }
    
    // Check for sticky paddle power-up
    if (paddleSprite.getData('sticky') === true) {
      // Implementation for sticky paddle behavior
    }
  }
  
  private checkCollisionCategories(
    categoryA: number, 
    categoryB: number,
    expectedA: number,
    expectedB: number
  ): boolean {
    return (categoryA === expectedA && categoryB === expectedB) || 
           (categoryA === expectedB && categoryB === expectedA);
  }
}