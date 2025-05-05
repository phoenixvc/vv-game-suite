import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import MatterJS from 'matter-js';
import * as Phaser from 'phaser';
import { PowerUp } from '../../objects/PowerUp';
import { PowerUpFactory } from '../../powerups/PowerUpFactory';
import { PowerUpType } from '../../types/PowerUpType';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';

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
    
    // Check if one body is a paddle and the other is a power-up
    const isPaddlePowerUpCollision = 
      (bodyA.label === 'paddle' && bodyB.label === 'powerUp') ||
      (bodyA.label === 'powerUp' && bodyB.label === 'paddle');
    
    if (!isPaddlePowerUpCollision) return false;
    
    // Get paddle and power-up game objects
    const paddle = bodyA.label === 'paddle' ? bodyA.gameObject : bodyB.gameObject;
    const powerUp = bodyA.label === 'powerUp' ? bodyA.gameObject : bodyB.gameObject;
    
    if (!paddle || !powerUp) {
      console.warn('Paddle or PowerUp object not found in collision');
      return false;
    }
    
    console.log(`Paddle collided with PowerUp: ${(powerUp as PowerUp).getType()}`);
    
    // Process the collision
    this.processPaddlePowerUpCollision(paddle as Phaser.Physics.Matter.Sprite, powerUp as PowerUp);
    return true;
  }
  
  private processPaddlePowerUpCollision(
    paddle: Phaser.Physics.Matter.Sprite,
    powerUp: PowerUp
  ): void {
    try {
      // Get the power-up type and duration
      const powerUpType = powerUp.getType() as PowerUpType;
      const duration = powerUp.getDuration();
      
      console.log(`Processing power-up collision: ${powerUpType}, duration: ${duration}`);
      
      // Get the power-up handler from the factory
      const powerUpFactory = PowerUpFactory;
      const handler = powerUpFactory.getHandler(powerUpType);
      
      if (!handler) {
        console.error(`No handler found for power-up type: ${powerUpType}`);
        return;
      }
      
      // Apply the power-up effect
      handler.apply(this.scene, paddle, duration);
      
      // Set a timer to remove the effect after the duration
      this.scene.time.delayedCall(duration, () => {
        handler.remove(this.scene);
        
        // Emit an event for the power-up expiration
        const eventManager = this.scene.getEventManager();
        if (eventManager) {
          eventManager.emit('powerUpExpired', { type: powerUpType });
        }
      });
      
      // Emit an event for the power-up collection
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('powerUpCollected', { 
          type: powerUpType,
          duration: duration
        });
      }
      
      // Play a sound effect
      // const audioManager = this.scene.getAudioManager();
      // if (audioManager) {
      //   audioManager.playSoundEffect('powerup');
      // }
      
      // Create a visual effect
      const particleManager = this.scene.getParticleManager();
      if (particleManager && typeof particleManager.createPowerUpEffect === 'function') {
        // Convert PowerUpType to a number or use the appropriate parameter type
        const powerUpTypeValue = this.getPowerUpTypeValue(powerUpType);
        particleManager.createPowerUpEffect(powerUp.x, powerUp.y, powerUpTypeValue);
      }
      
      // Destroy the power-up object
      powerUp.destroy();
    } catch (error) {
      console.error('Error processing paddle-powerup collision:', error);
    }
  }

  /**
   * Convert PowerUpType to a numeric value for particle effects
   * This helps bridge the gap between string enum types and methods expecting numbers
   */
  private getPowerUpTypeValue(powerUpType: PowerUpType | string): number {
    // Since PowerUpType is a string enum, we need to handle the actual string values
    switch (powerUpType) {
      case PowerUpType.MULTI_BALL:
      case 'multiball':
        return 1;
      case PowerUpType.PADDLE_GROW:
      case 'expand':
        return 2;
      case PowerUpType.PADDLE_SHRINK:
      case 'shrink':
        return 3;
      case PowerUpType.SPEED_DOWN:
      case 'slow':
        return 4;
      case PowerUpType.SPEED_UP:
      case 'fast':
        return 5;
      case PowerUpType.EXTRA_LIFE:
      case 'extraLife':
        return 6;
      case PowerUpType.LASER:
      case 'laser':
        return 7;
      case PowerUpType.STICKY:
      case 'sticky':
        return 8;
      case PowerUpType.SHIELD:
      case 'shield':
        return 9;
      case PowerUpType.FIREBALL:
      case 'fireball':
        return 10;
      case PowerUpType.SCORE_MULTIPLIER:
      case 'scoreMultiplier':
        return 11;
      default:
        console.warn(`Unknown power-up type for particle effect: ${powerUpType}`);
        return 0; // Default value
    }
  }
}