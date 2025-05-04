import * as Phaser from 'phaser';
import MatterJS from 'matter-js';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

export class PaddlePowerUpCollisionHandler implements CollisionHandlerInterface {
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
    
    // Check if this is a paddle-powerup collision
    const physicsManager = this.scene.getPhysicsManager();
    if (!physicsManager) return false;
    
    const isPaddlePowerUpCollision = this.checkCollisionCategories(
      bodyA.collisionFilter?.category || 0,
      bodyB.collisionFilter?.category || 0,
      physicsManager.paddleCategory,
      physicsManager.powerUpCategory
    );
    
    if (!isPaddlePowerUpCollision) return false;
    
    // Get paddle and powerup game objects
    const paddle = bodyA.label?.includes('paddle') ? bodyA.gameObject : bodyB.gameObject;
    const powerUp = bodyA.label?.includes('powerup') ? bodyA.gameObject : bodyB.gameObject;
    
    if (!paddle || !powerUp) return false;
    
    // Process the collision
    this.processPaddlePowerUpCollision(paddle, powerUp);
    return true;
  }
  
  private processPaddlePowerUpCollision(
    paddle: Phaser.GameObjects.GameObject,
    powerUp: Phaser.GameObjects.GameObject
  ): void {
    // Use the PowerUpManager to handle the collection
    const powerUpManager = this.scene.getPowerUpManager();
    if (powerUpManager && typeof powerUpManager.collectPowerUp === 'function') {
      const paddleSprite = paddle as Phaser.Physics.Matter.Sprite;
      const powerUpSprite = powerUp as Phaser.Physics.Matter.Sprite;
      powerUpManager.collectPowerUp(paddleSprite, powerUpSprite);
    }
    
    // Create particle effect for power-up collection
    const particleManager = this.scene.getParticleManager();
    if (particleManager && typeof particleManager.createParticles === 'function') {
      const powerUpSprite = powerUp as Phaser.Physics.Matter.Sprite;
      const color = powerUpSprite.getData('color') || 0x00ffff;
      
      particleManager.createParticles(powerUpSprite.x, powerUpSprite.y, {
        color,
        count: 15,
        speed: { min: 50, max: 150 },
        scale: { start: 0.4, end: 0 },
        lifespan: 500,
        duration: 500,
        blendMode: Phaser.BlendModes.ADD
      });
    }
    
    // Emit an event for the paddle-powerup collision
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('paddlePowerUpCollision', { 
        paddle: paddle as Phaser.Physics.Matter.Sprite, 
        powerUp: powerUp as Phaser.Physics.Matter.Sprite
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