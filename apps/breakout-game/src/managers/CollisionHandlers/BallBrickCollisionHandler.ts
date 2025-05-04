import * as Phaser from 'phaser';
import MatterJS from 'matter-js';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

export class BallBrickCollisionHandler implements CollisionHandlerInterface {
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
    
    // Process the collision
    this.processBallBrickCollision(ball, brick);
    return true;
  }
  
  private processBallBrickCollision(
    ball: Phaser.GameObjects.GameObject,
    brick: Phaser.GameObjects.GameObject
  ): void {
    // Use the BrickManager to handle the collision
    const brickManager = this.scene.getBrickManager();
    if (brickManager && typeof brickManager.handleBrickCollision === 'function') {
      brickManager.handleBrickCollision(ball, brick);
    }
    
    // Create particle effects
    const particleManager = this.scene.getParticleManager();
    if (particleManager && typeof particleManager.createBrickHitEffect === 'function') {
      particleManager.createBrickHitEffect(brick as Phaser.Physics.Matter.Sprite);
    }
    
    // Emit an event for the ball-brick collision
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballBrickCollision', { 
        ball: ball as Phaser.Physics.Matter.Sprite, 
        brick: brick as Phaser.Physics.Matter.Sprite
      });
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