import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import * as Phaser from 'phaser';

/**
 * Handles collisions involving power-ups
 */
export class PowerUpCollisionHandler implements CollisionHandlerInterface {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Handle collision between two bodies
   * @param bodyA First body in the collision
   * @param bodyB Second body in the collision
   * @param stage Collision stage (start, active, end)
   * @returns True if the collision was handled, false otherwise
   */
  public handleCollision(
    bodyA: MatterJS.BodyType,
    bodyB: MatterJS.BodyType,
    stage: 'start' | 'active' | 'end'
  ): boolean {
    // Only handle collision start events
    if (stage !== 'start') return false;
    
    // Skip if either body is missing a gameObject
    if (!bodyA.gameObject || !bodyB.gameObject) return false;
    
    // Check if this is a power-up and paddle collision
    const isPowerUpA = this.isPowerUp(bodyA);
    const isPowerUpB = this.isPowerUp(bodyB);
    const isPaddleA = this.isPaddle(bodyA);
    const isPaddleB = this.isPaddle(bodyB);
    
    // Handle power-up and paddle collision
    if ((isPowerUpA && isPaddleB) || (isPowerUpB && isPaddleA)) {
      console.log('PowerUpCollisionHandler: Power-up and paddle collision detected!');
      
      // Get the power-up and paddle objects with proper type assertions
      const powerUp = isPowerUpA 
        ? bodyA.gameObject as Phaser.Physics.Matter.Sprite 
        : bodyB.gameObject as Phaser.Physics.Matter.Sprite;
      
      const paddle = isPowerUpA 
        ? bodyB.gameObject as Phaser.Physics.Matter.Sprite 
        : bodyA.gameObject as Phaser.Physics.Matter.Sprite;
      
      // Get the power-up manager
      const powerUpManager = this.scene.getPowerUpManager();
      if (powerUpManager && typeof powerUpManager.collectPowerUp === 'function') {
        // Call the collectPowerUp method on the power-up manager
        console.log('Calling collectPowerUp on power-up manager');
        powerUpManager.collectPowerUp(powerUp, paddle);
        return true;
      } else {
        console.warn('PowerUpManager not available or missing collectPowerUp method');
    }
  }
  
    return false;
  }
  
  /**
   * Check if a body is a power-up
   * @param body The body to check
   * @returns True if the body is a power-up, false otherwise
   */
  private isPowerUp(body: MatterJS.BodyType): boolean {
    // Check the body label first
    if (body.label === 'powerUp') return true;
    
    // Check the gameObject data
    if (body.gameObject) {
      const gameObject = body.gameObject as Phaser.Physics.Matter.Sprite;
      
      // Check for power-up data or type
      if (gameObject.getData('type') === 'powerUp') return true;
      if (gameObject.name && gameObject.name.includes('powerUp')) return true;
      if (gameObject.texture && gameObject.texture.key.includes('powerUp')) return true;
}
    
    return false;
  }
  
  /**
   * Check if a body is a paddle
   * @param body The body to check
   * @returns True if the body is a paddle, false otherwise
   */
  private isPaddle(body: MatterJS.BodyType): boolean {
    // Check the body label first
    if (body.label === 'paddle') return true;
    
    // Check the gameObject data
    if (body.gameObject) {
      const gameObject = body.gameObject as Phaser.Physics.Matter.Sprite;
      
      // Check for paddle data or type
      if (gameObject.getData('type') === 'paddle') return true;
      if (gameObject.name && gameObject.name.includes('paddle')) return true;
      if (gameObject.texture && gameObject.texture.key.includes('paddle')) return true;
    }
    
    return false;
  }
}