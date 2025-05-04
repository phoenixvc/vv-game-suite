import * as Phaser from 'phaser';
import MatterJS from 'matter-js';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

export class LaserBrickCollisionHandler implements CollisionHandlerInterface {
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
    
    // Check if this is a laser-brick collision
    const physicsManager = this.scene.getPhysicsManager();
    if (!physicsManager) return false;
    
    const isLaserBrickCollision = this.checkCollisionCategories(
      bodyA.collisionFilter?.category || 0,
      bodyB.collisionFilter?.category || 0,
      physicsManager.laserCategory,
      physicsManager.brickCategory
    );
    
    if (!isLaserBrickCollision) return false;
    
    // Get laser and brick game objects
    const laser = bodyA.label?.includes('laser') ? bodyA.gameObject : bodyB.gameObject;
    const brick = bodyA.label?.includes('brick') ? bodyA.gameObject : bodyB.gameObject;
    
    if (!laser || !brick) return false;
    
    // Process the collision
    this.processLaserBrickCollision(laser, brick);
    return true;
  }
  
  private processLaserBrickCollision(
    laser: Phaser.GameObjects.GameObject,
    brick: Phaser.GameObjects.GameObject
  ): void {
    // Use the BrickManager to handle the collision
    const brickManager = this.scene.getBrickManager();
    if (brickManager && typeof brickManager.handleBrickCollision === 'function') {
      brickManager.handleBrickCollision(laser, brick);
    }
    
    // Create particle effects for laser hit
    const particleManager = this.scene.getParticleManager();
    if (particleManager && typeof particleManager.createParticles === 'function') {
      const laserSprite = laser as Phaser.Physics.Matter.Sprite;
      const brickSprite = brick as Phaser.Physics.Matter.Sprite;
      
      // Get laser color or use default
      const color = laserSprite.getData('color') || 0xff0000;
      
      particleManager.createParticles(brickSprite.x, brickSprite.y, {
        color,
        count: 10,
        speed: { min: 30, max: 100 },
        scale: { start: 0.3, end: 0 },
        lifespan: 400,
        duration: 400,
        blendMode: Phaser.BlendModes.ADD
      });
    }
    
    // Emit an event for the laser-brick collision
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('laserBrickCollision', { 
        laser: laser as Phaser.Physics.Matter.Sprite, 
        brick: brick as Phaser.Physics.Matter.Sprite
      });
    }
    
    // Destroy the laser
    if ('destroy' in laser && typeof laser.destroy === 'function') {
      laser.destroy();
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