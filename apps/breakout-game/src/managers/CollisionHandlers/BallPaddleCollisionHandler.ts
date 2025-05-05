import { Ball } from '@/objects/Ball';
import { Paddle } from '@/objects/Paddle';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import MatterJS from 'matter-js';
import * as Phaser from 'phaser';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';

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
    
    // Increment the paddle hit counter if it's our custom Paddle class
    // Method 1: Check if the method exists on the object directly
    if ('incrementPaddleHitCounter' in paddleSprite && 
        typeof (paddleSprite as any).incrementPaddleHitCounter === 'function') {
      (paddleSprite as any).incrementPaddleHitCounter();
    }
    // Method 2: Try to cast to our Paddle class
    else if (paddleSprite instanceof Paddle) {
      paddleSprite.incrementPaddleHitCounter();
    }
    // Method 3: Use a data property as a fallback
    else if (paddleSprite.getData('isPaddle')) {
      // Try to access the method through scene's paddle manager if available
      const paddleManager = this.scene.getPaddleManager?.();
      if (paddleManager) {
        // Check if the method exists on the manager
        if (typeof (paddleManager as any).incrementPaddleHits === 'function') {
          (paddleManager as any).incrementPaddleHits(paddleSprite);
    }
        // Alternatively, emit an event that the manager might be listening for
        else {
          const eventManager = this.scene.getEventManager();
    if (eventManager) {
            eventManager.emit('paddleHit', { paddle: paddleSprite });
          }
        }
      }
    }
    
    // Increment the ball hit counter if it's our custom Ball class
    // Method 1: Check if the method exists on the object
    if ('incrementHitCounter' in ballSprite && 
        typeof (ballSprite as any).incrementHitCounter === 'function') {
      (ballSprite as any).incrementHitCounter();
  }
    // Method 2: Try to cast to our Ball class
    else if (ballSprite instanceof Ball) {
      ballSprite.incrementHitCounter();
  }
    // Method 3: Use a data property as a fallback
    else if (ballSprite.getData('isBall')) {
      // Try to access the method through scene's ball manager
      const ballManager = this.scene.getBallManager();
      if (ballManager) {
        // Check if the method exists on the manager
        if (typeof (ballManager as any).incrementBallHits === 'function') {
          (ballManager as any).incrementBallHits(ballSprite);
        }
        // Alternatively, emit an event that the manager might be listening for
        else {
          const eventManager = this.scene.getEventManager();
          if (eventManager) {
            eventManager.emit('ballHit', { ball: ballSprite });
          }
        }
      }
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