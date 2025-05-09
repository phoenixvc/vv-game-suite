import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUp, PowerUpConfig } from '../objects/PowerUp';
import { PowerUpFactory } from '../powerups/PowerUpFactory';
import { ShieldPowerUp } from '../powerups/ShieldPowerUp';
import { PowerUpType } from '../types/PowerUpType';

// Define available power-up types
const powerUpTypes: PowerUpType[] = [
  PowerUpType.MULTI_BALL,
  PowerUpType.PADDLE_GROW,
  PowerUpType.PADDLE_SHRINK,
  PowerUpType.SPEED_DOWN,
  PowerUpType.SPEED_UP,
  PowerUpType.EXTRA_LIFE,
  PowerUpType.SHIELD,
  PowerUpType.LASER
];

class PowerUpManager {
  private scene: BreakoutScene;
  private powerUps: PowerUp[] = [];
  
  // Store timers in a map instead of on the scene object
  private powerUpTimers: Map<string, Phaser.Time.TimerEvent> = new Map();

  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  public createPowerUp(x: number, y: number): void {
    try {
      // Get a random power-up type
      const type = powerUpTypes[Phaser.Math.Between(0, powerUpTypes.length - 1)];
      
      const powerUpConfig: PowerUpConfig = {
        x,
        y,
        type,
        duration: 10000, // 10 seconds
        velocity: { y: 2 } // Use smaller values for Matter.js
      };
    
      // Create the power-up with Matter.js physics
      const powerUp = new PowerUp(this.scene, powerUpConfig);
      this.powerUps.push(powerUp);
      
      // Set collision properties for Matter.js
      const physicsManager = this.scene.getPhysicsManager();
      if (physicsManager) {
        powerUp.setCollisionCategory(physicsManager.powerUpCategory);
        powerUp.setCollidesWith([physicsManager.paddleCategory]);
        
        // Set a label for collision detection
        powerUp.setBody({
          type: 'circle',
          radius: powerUp.width / 2
        }, {
          label: 'powerUp',
          isSensor: true // Make it a sensor so it doesn't affect physics
        });
      }
      
      // Add to scene's update list
      this.scene.events.on('update', () => this.checkOutOfBounds());
      
      console.log(`Created power-up of type ${type} at (${x}, ${y})`);
    } catch (error) {
      console.error('Error creating power-up:', error);
    }
  }
  
  /**
   * Check if any power-ups are out of bounds and remove them
   */
  private checkOutOfBounds(): void {
    const { height } = this.scene.scale;
    
    // Filter out power-ups that are below the screen
    this.powerUps = this.powerUps.filter(powerUp => {
      if (powerUp.y > height + 50) {
        if (powerUp.body) {
          this.scene.matter.world.remove(powerUp.body);
        }
        powerUp.destroy();
        return false;
      }
      return true;
    });
  }
  
  /**
   * Handle power-up collection
   */
  public collectPowerUp(paddle: Phaser.Physics.Matter.Sprite, powerUp: Phaser.Physics.Matter.Image): void {
    if (!powerUp || !powerUp.getData) return;
    
    // Get power-up type
    const powerUpType = powerUp.getData('type') as PowerUpType;
    
    // Apply power-up effect based on type
    switch (powerUpType) {
      case PowerUpType.MULTI_BALL:
        const ballManager = this.scene.getBallManager();
        if (ballManager) {
          ballManager.activateMultiBall(2);
        }
        break;
      case PowerUpType.PADDLE_GROW:
        this.expandPaddle(paddle);
        break;
      case PowerUpType.PADDLE_SHRINK:
        this.shrinkPaddle(paddle);
        break;
      case PowerUpType.SPEED_DOWN:
        const slowBallManager = this.scene.getBallManager();
        if (slowBallManager) {
          slowBallManager.applySpeedMultiplier(0.7);
        }
        break;
      case PowerUpType.SPEED_UP:
        const fastBallManager = this.scene.getBallManager();
        if (fastBallManager) {
          fastBallManager.applySpeedMultiplier(1.3);
        }
        break;
      case PowerUpType.EXTRA_LIFE:
        this.addExtraLife();
        break;
      case PowerUpType.SHIELD:
        this.addShield();
        break;
      case PowerUpType.LASER:
        // Implement laser power-up
        break;
      // Add more power-up types as needed
    }
    
    // Emit event for power-up collection
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('powerUpCollected', {
        type: powerUpType,
        duration: 10000, // Default duration
        x: powerUp.x,
        y: powerUp.y,
        paddleId: paddle.getData('id')
      });
    }
    
    // Remove power-up from the game
    if (powerUp.body) {
      this.scene.matter.world.remove(powerUp.body);
    }
    
    // Remove from our array
    this.powerUps = this.powerUps.filter(p => p !== powerUp);
    
    powerUp.destroy();
  }

  public addShield(): void {
    const shieldHandler = PowerUpFactory.getHandler(PowerUpType.SHIELD) as ShieldPowerUp;
    if (shieldHandler) {
      shieldHandler.apply(this.scene, this.scene['paddle'], 15000);
    }
  }
  
  public isShieldActive(): boolean {
    const shieldHandler = PowerUpFactory.getHandler(PowerUpType.SHIELD) as ShieldPowerUp;
    return shieldHandler ? shieldHandler.isActive() : false;
  }
  
  private setPowerUpTimer(powerUpType: PowerUpType, duration: number, handler: any): void {
    const timerKey = powerUpType.toString();
    
    // Clear existing timer if any
    if (this.powerUpTimers.has(timerKey)) {
      const existingTimer = this.powerUpTimers.get(timerKey);
      if (existingTimer) {
        existingTimer.remove();
      }
    }
    
    // Set new timer
    const timer = this.scene.time.delayedCall(duration, () => {
      // Remove the effect when timer expires
      handler.remove(this.scene);
      
      // Remove the timer from our map
      this.powerUpTimers.delete(timerKey);
    });
    
    // Store the timer in our map
    this.powerUpTimers.set(timerKey, timer);
  }
  
  public getPowerUps(): PowerUp[] {
    return this.powerUps;
  }
  
  /**
   * Expand the paddle
   */
  private expandPaddle(paddle: Phaser.Physics.Matter.Sprite): void {
    const edge = paddle.getData('edge');
    const isVertical = edge === 'left' || edge === 'right';
    
    // Increase size by 50%
    if (isVertical) {
      paddle.displayHeight *= 1.5;
    } else {
      paddle.displayWidth *= 1.5;
    }
    
    // Set timeout to revert size
    this.scene.time.delayedCall(10000, () => {
      if (isVertical) {
        paddle.displayHeight /= 1.5;
      } else {
        paddle.displayWidth /= 1.5;
      }
    });
  }
  
  /**
   * Shrink the paddle
   */
  private shrinkPaddle(paddle: Phaser.Physics.Matter.Sprite): void {
    const edge = paddle.getData('edge');
    const isVertical = edge === 'left' || edge === 'right';
    
    // Decrease size by 30%
    if (isVertical) {
      paddle.displayHeight *= 0.7;
    } else {
      paddle.displayWidth *= 0.7;
    }
    
    // Set timeout to revert size
    this.scene.time.delayedCall(10000, () => {
      if (isVertical) {
        paddle.displayHeight /= 0.7;
      } else {
        paddle.displayWidth /= 0.7;
      }
    });
  }

  /**
   * Add an extra life
   */
  private addExtraLife(): void {
    // Get GameStateManager to handle lives
    const gameStateManager = this.scene['gameStateManager'];
    if (gameStateManager && typeof gameStateManager.getLives === 'function') {
      const currentLives = gameStateManager.getLives();
      
      // Update UI through UIManager
      const uiManager = this.scene.getUIManager();
      if (uiManager) {
        uiManager.updateLives(currentLives + 1);
      }
    }
  }
  
  /**
   * Cleans up all timers and effects
   * Should be called when the scene is shutdown
   */
  public cleanup(): void {
    // Clear all power-up timers
    this.powerUpTimers.forEach(timer => {
      timer.remove();
    });
    this.powerUpTimers.clear();
    
    // Clean up all active power-ups
    Object.values(PowerUpType).forEach(type => {
      try {
        const handler = PowerUpFactory.getHandler(type as PowerUpType);
        if (handler && typeof handler.remove === 'function') {
          handler.remove(this.scene);
        }
      } catch (error) {
        // Ignore errors for power-up types that don't have handlers
      }
    });
    
    // Clean up all power-ups
    this.powerUps.forEach(powerUp => {
      if (powerUp.body) {
        this.scene.matter.world.remove(powerUp.body);
      }
      powerUp.destroy();
    });
    this.powerUps = [];
    
    // Remove update listener
    this.scene.events.off('update');
  }
}

export default PowerUpManager;