import { Ball } from '@/objects/Ball';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import MatterJS from 'matter-js';
import * as Phaser from 'phaser';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';

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
    
    // Get labels for debugging
    const labelA = bodyA.label || '';
    const labelB = bodyB.label || '';
    
    // Log collision labels for debugging
    console.debug(`Collision between: ${labelA} and ${labelB}`);
    
    // Check for both wall and vault collisions
    const isBallWallCollision = this.checkCollisionCategories(
      bodyA.collisionFilter?.category || 0,
      bodyB.collisionFilter?.category || 0,
      physicsManager.ballCategory,
      physicsManager.wallCategory
    );
    
    // If not a ball-wall collision, check if it's a ball-vault collision
    const isBallVaultCollision = !isBallWallCollision && 
      ((labelA.includes('ball') && labelB.includes('vault')) || 
       (labelB.includes('ball') && labelA.includes('vault')));
    
    // If neither type of collision, exit
    if (!isBallWallCollision && !isBallVaultCollision) return false;
    
    // Check if at least one of the objects is a ball
    const hasBall = labelA.includes('ball') || labelB.includes('ball');
    if (!hasBall) return false;
    
    // Get ball and wall/vault game objects
    const ball = labelA.includes('ball') ? bodyA.gameObject : bodyB.gameObject;
    const wallOrVault = labelA.includes('ball') ? bodyB.gameObject : bodyA.gameObject;
    
    if (!ball || !wallOrVault) return false;
    
    // Reset consecutive hit counter when ball hits a wall
    if (ball instanceof Ball) {
      ball.resetHitCounter();
    }
    
    // Process the collision - use a different method for vault if needed
    if (isBallVaultCollision) {
      this.processBallVaultCollision(ball, wallOrVault);
    } else {
      this.processBallWallCollision(ball, wallOrVault);
    }
    
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
  
  // Method to handle vault collisions specifically
  private processBallVaultCollision(
    ball: Phaser.GameObjects.GameObject,
    vault: Phaser.GameObjects.GameObject
  ): void {
    // Add sound effects or visual feedback for vault collision
    const soundManager = this.scene.getSoundManager?.();
    if (soundManager && typeof soundManager.playSound === 'function') {
      soundManager.playSound('vaultHit');
    }
    
    // Create more dramatic particle effect for vault collision
    const particleManager = this.scene.getParticleManager();
    if (particleManager && typeof particleManager.createParticles === 'function') {
      const ballSprite = ball as Phaser.Physics.Matter.Sprite;
      particleManager.createParticles(ballSprite.x, ballSprite.y, {
        count: 8,
        speed: { min: 30, max: 70 },
        scale: { start: 0.3, end: 0 },
        lifespan: 300,
        duration: 300,
        tint: 0xffaa00 // Orange color for vault hits
      });
    }
    
    // Emit an event for the ball-vault collision
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballVaultCollision', { 
        ball: ball as Phaser.Physics.Matter.Sprite, 
        vault: vault as Phaser.Physics.Matter.Sprite
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