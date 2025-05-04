import * as Phaser from 'phaser';
import MatterJS from 'matter-js';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

export class BallWallCollisionHandler implements CollisionHandlerInterface {
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
    
    // Check if this is a ball-wall collision
    const physicsManager = this.scene.getPhysicsManager();
    if (!physicsManager) return false;
    
    const isBallWallCollision = this.checkCollisionCategories(
      bodyA.collisionFilter?.category || 0,
      bodyB.collisionFilter?.category || 0,
      physicsManager.ballCategory,
      physicsManager.wallCategory
    );
    
    if (!isBallWallCollision) return false;
    
    // Get ball and wall game objects
    const ball = bodyA.label?.includes('ball') ? bodyA.gameObject : bodyB.gameObject;
    const wall = bodyA.label?.includes('wall') ? bodyA.gameObject : bodyB.gameObject;
    
    if (!ball || !wall) return false;
    
    // Process the collision
    this.processBallWallCollision(ball, wall);
    return true;
  }
  
  private processBallWallCollision(
    ball: Phaser.GameObjects.GameObject,
    wall: Phaser.GameObjects.GameObject
  ): void {
    // Add sound effects or visual feedback for wall collision
    const soundManager = this.scene.getSoundManager?.();
    if (soundManager && typeof soundManager.playSound === 'function') {
      soundManager.playSound('wallHit');
    }
    
    // Create subtle particle effect at collision point
    const particleManager = this.scene.getParticleManager();
    if (particleManager && typeof particleManager.createParticles === 'function') {
      const ballSprite = ball as Phaser.Physics.Matter.Sprite;
      particleManager.createParticles(ballSprite.x, ballSprite.y, {
        count: 3,
        speed: { min: 20, max: 50 },
        scale: { start: 0.2, end: 0 },
        lifespan: 200,
        duration: 200
      });
    }
    
    // Emit an event for the ball-wall collision
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballWallCollision', { 
        ball: ball as Phaser.Physics.Matter.Sprite, 
        wall: wall as Phaser.Physics.Matter.Sprite
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