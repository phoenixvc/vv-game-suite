import { Ball } from '@/objects/Ball';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import MatterJS from 'matter-js';
import * as Phaser from 'phaser';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';

export class BallBrickCollisionHandler implements CollisionHandlerInterface {
  private scene: BreakoutScene;
  private minBallSpeed = 5; // Minimum ball speed to maintain
  private maxBallSpeed = 15; // Maximum ball speed to prevent too fast movement
  private restitution = 1.0; // Perfect elasticity for bouncy rebounds
  
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
    
    // Check if this is a ball-brick collision
    const physicsManager = this.scene.getPhysicsManager();
    if (!physicsManager) return false;
    
    const isBallBrickCollision = this.checkCollisionCategories(
      bodyA.collisionFilter?.category || 0,
      bodyB.collisionFilter?.category || 0,
      physicsManager.ballCategory,
      physicsManager.brickCategory
    );
    
    if (!isBallBrickCollision) return false;
    
    // Get ball and brick game objects
    const ball = bodyA.label?.includes('ball') ? bodyA.gameObject : bodyB.gameObject;
    const brick = bodyA.label?.includes('brick') ? bodyA.gameObject : bodyB.gameObject;
    
    if (!ball || !brick) return false;
    
    // Calculate the rebound direction before processing the collision
    this.applyNewtonianRebound(
      ball as Phaser.Physics.Matter.Sprite, 
      brick as Phaser.Physics.Matter.Sprite,
      bodyA.label?.includes('ball') ? bodyA : bodyB,
      bodyA.label?.includes('brick') ? bodyA : bodyB
    );
    
    // Increment consecutive hit counter if the ball is a Ball instance
    if (ball instanceof Ball) {
      ball.incrementHitCounter();
    }
    
    // Process the collision (score, brick destruction, etc.)
    this.processBallBrickCollision(ball, brick);
    
    return true;
  }
  
  /**
   * Apply Newtonian physics for ball rebound from brick
   */
  private applyNewtonianRebound(
    ball: Phaser.Physics.Matter.Sprite, 
    brick: Phaser.Physics.Matter.Sprite,
    ballBody: MatterJS.BodyType,
    brickBody: MatterJS.BodyType
  ): void {
    if (!ball.body) {
      console.warn('Ball has no physics body');
      return;
    }
    
    // Get the collision normal from Matter.js collision data if available
    // If not, calculate it based on positions
    let normalX: number;
    let normalY: number;
    
    // Calculate normal based on relative positions (more reliable than collision data)
    // Determine which side of the brick was hit based on ball position relative to brick
    const brickHalfWidth = brick.displayWidth / 2;
    const brickHalfHeight = brick.displayHeight / 2;
    
    // Calculate relative position of ball to brick center
    const relX = ball.x - brick.x;
    const relY = ball.y - brick.y;
    
    // Determine the closest edge
    const absX = Math.abs(relX);
    const absY = Math.abs(relY);
    
    if (absX / brickHalfWidth > absY / brickHalfHeight) {
      // Ball hit left or right side
      normalX = relX > 0 ? 1 : -1;
      normalY = 0;
    } else {
      // Ball hit top or bottom
      normalX = 0;
      normalY = relY > 0 ? 1 : -1;
    }
    
    // Get current velocity
    const vx = ball.body.velocity.x;
    const vy = ball.body.velocity.y;
    
    // Calculate the dot product of velocity and normal
    const dotProduct = vx * normalX + vy * normalY;
    
    // Only reflect if the ball is moving toward the brick
    if (dotProduct < 0) {
      // Calculate reflection using the formula: v' = v - 2(v·n)n
      const reflectVx = vx - 2 * dotProduct * normalX;
      const reflectVy = vy - 2 * dotProduct * normalY;
      
      // Calculate current speed
      const currentSpeed = Math.sqrt(vx * vx + vy * vy);
      const newSpeed = Math.sqrt(reflectVx * reflectVx + reflectVy * reflectVy);
      
      // Apply restitution coefficient (bounciness)
      const finalSpeed = currentSpeed * this.restitution;
      
      // Ensure minimum speed
      const targetSpeed = Math.max(finalSpeed, this.minBallSpeed);
      
      // Cap at maximum speed
      const clampedSpeed = Math.min(targetSpeed, this.maxBallSpeed);
      
      // Scale the velocity to match the target speed
      const speedRatio = clampedSpeed / newSpeed;
      const finalVx = reflectVx * speedRatio;
      const finalVy = reflectVy * speedRatio;
      
      // Apply the new velocity to the ball
      ball.setVelocity(finalVx, finalVy);
      
      console.log(`Ball rebounded: (${vx.toFixed(2)}, ${vy.toFixed(2)}) -> (${finalVx.toFixed(2)}, ${finalVy.toFixed(2)})`);
      console.log(`Normal: (${normalX}, ${normalY}), Speed: ${currentSpeed.toFixed(2)} -> ${clampedSpeed.toFixed(2)}`);
    }
    
    // Ensure the ball is visible and active
    ball.setVisible(true);
    ball.setActive(true);
  }
  
  private processBallBrickCollision(
    ball: Phaser.GameObjects.GameObject,
    brick: Phaser.GameObjects.GameObject
  ): void {
    // Guard: Ensure 'ball' is not destroyed here
    if (!(ball instanceof Phaser.Physics.Matter.Sprite)) {
      console.warn('Ball object is not a Matter Sprite');
      return;
    }
  
    // Guard: Ensure 'brick' is a Brick
    if (!(brick instanceof Phaser.Physics.Matter.Sprite)) {
      console.warn('Brick object is not a Matter Sprite');
      return;
    }
  
    // Handle brick collision
    const brickManager = this.scene.getBrickManager();
    if (brickManager?.handleBrickCollision) {
      brickManager.handleBrickCollision(ball, brick);
    }
  
    // Only apply effects to brick
    const particleManager = this.scene.getParticleManager();
    if (particleManager?.createBrickHitEffect) {
      particleManager.createBrickHitEffect(brick);
    }
  
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballBrickCollision', { ball, brick });
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