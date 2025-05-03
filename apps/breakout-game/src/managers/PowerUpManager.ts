import { PowerUp, PowerUpConfig } from '../objects/PowerUp';
import { PowerUpFactory } from '../powerups/PowerUpFactory';
import { ShieldPowerUp } from '../powerups/ShieldPowerUp';
import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';

export class PowerUpManager {
  private scene: BreakoutScene;
  private powerUps: Phaser.GameObjects.Group;
  
  // Store timers in a map instead of on the scene object
  private powerUpTimers: Map<string, Phaser.Time.TimerEvent> = new Map();

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Create power-ups group
    this.powerUps = scene.add.group({
      classType: PowerUp,
      runChildUpdate: true
    });
  }
  
  public createPowerUp(x: number, y: number): void {
    const powerUpTypes = [
      PowerUpType.EXTRA_LIFE, 
      PowerUpType.PADDLE_GROW, 
      PowerUpType.SHIELD,
      PowerUpType.MULTI_BALL,
      PowerUpType.SPEED_UP
    ];
    const type = powerUpTypes[Phaser.Math.Between(0, powerUpTypes.length - 1)];
    
    const powerUpConfig: PowerUpConfig = {
      x,
      y,
      type,
      duration: 10000, // 10 seconds
      velocity: { y: 150 }
    };
  
    const powerUp = new PowerUp(this.scene, powerUpConfig);
    this.powerUps.add(powerUp);
  }
  
  public collectPowerUp(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    // Extract the game objects
    const paddle = object1 as unknown as Phaser.Physics.Arcade.Sprite;
    const powerUp = object2 as unknown as PowerUp;
    
    if (!powerUp || !(powerUp instanceof PowerUp)) {
      return;
    }
    
    const type = powerUp.getType() as PowerUpType;
    const duration = powerUp.getDuration();
    
    try {
      // Get the appropriate handler for this power-up type
      const handler = PowerUpFactory.getHandler(type);
      
      // Apply the power-up effect
      handler.apply(this.scene, paddle, duration);
      
      // Set timer for timed power-ups
      if (type !== PowerUpType.EXTRA_LIFE && type !== PowerUpType.MULTI_BALL) {
        this.setPowerUpTimer(type, duration, handler);
      }
      
      this.scene.events.emit('collectPowerUp', { type, duration });
    } catch (error) {
      console.error(`Error applying power-up: ${error}`);
    }
    
    powerUp.destroy();
  }
  
  public addShield(): void {
    const shieldHandler = PowerUpFactory.getHandler(PowerUpType.SHIELD) as ShieldPowerUp;
    shieldHandler.apply(this.scene, this.scene['paddle'], 15000);
  }
  
  public isShieldActive(): boolean {
    const shieldHandler = PowerUpFactory.getHandler(PowerUpType.SHIELD) as ShieldPowerUp;
    return shieldHandler.isActive();
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
  
  public getPowerUpsGroup(): Phaser.GameObjects.Group {
    return this.powerUps;
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
        handler.remove(this.scene);
      } catch (error) {
        // Ignore errors for power-up types that don't have handlers
  }
    });
    
    // Clean up the power-ups group
    this.powerUps.clear(true, true);
}
}