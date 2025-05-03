import { PowerUpType } from '../types/PowerUp';
import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUp, PowerUpConfig } from '../objects/PowerUp';

export class PowerUpManager {
  private scene: BreakoutScene;
  private powerUps: Phaser.GameObjects.Group;
  private shield: boolean = false;
  private shieldTimer: Phaser.Time.TimerEvent | null = null;
  private shieldIndicator: Phaser.GameObjects.Text;
  private ballShieldEffect: Phaser.GameObjects.Arc | null = null;

  // Store timers in a map instead of on the scene object
  private powerUpTimers: Map<string, Phaser.Time.TimerEvent> = new Map();

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Create power-ups group
    this.powerUps = scene.add.group({
      classType: PowerUp,
      runChildUpdate: true
    });
    
    // Create shield indicator (initially hidden)
    this.shieldIndicator = scene.add.text(scene.scale.width - 160, 50, 'Shield: Active', {
      fontSize: '24px',
      color: '#61AEEE',
      fontFamily: 'Arial'
    }).setScrollFactor(0).setVisible(false);
  }
  
  public createPowerUp(x: number, y: number): void {
    const powerUpTypes = [PowerUpType.EXTRA_LIFE, PowerUpType.PADDLE_GROW, 'shield'];
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
    
    const type = powerUp.getType();
    const duration = powerUp.getDuration();
    
    // Apply the power-up effect
    if (type === 'shield') {
      this.addShield();
    } else if (type === PowerUpType.EXTRA_LIFE) {
      this.scene.addLife();
    } else if (type === PowerUpType.PADDLE_GROW) {
      paddle.setScale(1.5, 1);
      this.setPowerUpTimer('paddleGrow', duration);
    }
    
    this.scene.events.emit('collectPowerUp', { type, duration });
    powerUp.destroy();
  }
  
  // The rest of the methods remain the same
  public addShield(): void {
    this.shield = true;
    this.shieldIndicator.setVisible(true);
    
    // Create a visual effect around the ball to indicate shield is active
    this.ballShieldEffect = this.scene.add.circle(
      this.scene.getBall().x,
      this.scene.getBall().y,
      this.scene.getBall().width * 0.75,
      0x61AEEE,
      0.5
    );
    
    // Make the shield effect follow the ball
    this.scene.events.on('update', () => {
      if (this.shield && this.ballShieldEffect) {
        const ball = this.scene.getBall();
        this.ballShieldEffect.setPosition(ball.x, ball.y);
  }
    });
  
    // Set a timer for the shield duration
    if (this.shieldTimer) {
      this.shieldTimer.remove();
}
    this.shieldTimer = this.scene.time.delayedCall(15000, () => {
      // Disable shield after 15 seconds
      this.shield = false;
      this.shieldIndicator.setVisible(false);
    if (this.ballShieldEffect) {
      this.ballShieldEffect.destroy();
      this.ballShieldEffect = null;
    }
    });
    
    // Add a visual feedback
    this.scene.cameras.main.flash(500, 0, 100, 255); // Flash blue
  }
  
  public setPowerUpTimer(powerUpType: string, duration: number): void {
    // Clear existing timer if any
    if (this.powerUpTimers.has(powerUpType)) {
      const existingTimer = this.powerUpTimers.get(powerUpType);
      if (existingTimer) {
        existingTimer.remove();
}
    }
    
    // Set new timer
    const timer = this.scene.time.delayedCall(duration, () => {
      // Revert the effect when timer expires
      if (powerUpType === 'paddleGrow') {
        this.scene.getPaddle().setScale(1, 1);
      } else if (powerUpType === 'paddleShrink') {
        this.scene.getPaddle().setScale(1, 1);
      }
      
      // Remove the timer from our map
      this.powerUpTimers.delete(powerUpType);
    });
    
    // Store the timer in our map
    this.powerUpTimers.set(powerUpType, timer);
  }
  
  public isShieldActive(): boolean {
    return this.shield;
  }
  
  public getPowerUps(): Phaser.GameObjects.Group {
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
    
    // Clear shield timer
    if (this.shieldTimer) {
      this.shieldTimer.remove();
      this.shieldTimer = null;
    }
    
    // Clear shield effect
    if (this.ballShieldEffect) {
      this.ballShieldEffect.destroy();
      this.ballShieldEffect = null;
    }
  }
}