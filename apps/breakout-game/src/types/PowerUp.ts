import * as Phaser from 'phaser';

/**
 * Enum for all available power-up types in the game
 */
export enum PowerUpType {
  MULTI_BALL = 'multiball',
  PADDLE_GROW = 'expand',
  PADDLE_SHRINK = 'shrink',
  SPEED_DOWN = 'slow',
  SPEED_UP = 'fast',
  EXTRA_LIFE = 'extraLife',
  LASER = 'laser',
  STICKY = 'sticky',
  SHIELD = 'shield',
  FIREBALL = 'fireball',
  SCORE_MULTIPLIER = 'scoreMultiplier'
}

/**
 * Class for managing power-up related constants and utilities
 */
export class PowerUpConfig {
  // Probability weights for each power-up type (higher = more common)
  static readonly PROBABILITIES: Record<PowerUpType, number> = {
    [PowerUpType.MULTI_BALL]: 20,
    [PowerUpType.PADDLE_GROW]: 25,
    [PowerUpType.PADDLE_SHRINK]: 15,
    [PowerUpType.SPEED_DOWN]: 20,
    [PowerUpType.SPEED_UP]: 15,
    [PowerUpType.EXTRA_LIFE]: 5,
    [PowerUpType.LASER]: 10,
    [PowerUpType.STICKY]: 10,
    [PowerUpType.SHIELD]: 10,
    [PowerUpType.FIREBALL]: 10,
    [PowerUpType.SCORE_MULTIPLIER]: 15
  };

  // Duration in milliseconds for temporary power-ups
  static readonly DURATIONS: Record<PowerUpType, number> = {
    [PowerUpType.MULTI_BALL]: 0,        // Permanent until ball is lost
    [PowerUpType.PADDLE_GROW]: 10000,       // 10 seconds
    [PowerUpType.PADDLE_SHRINK]: 8000,        // 8 seconds
    [PowerUpType.SPEED_DOWN]: 10000,         // 10 seconds
    [PowerUpType.SPEED_UP]: 10000,         // 10 seconds
    [PowerUpType.EXTRA_LIFE]: 0,       // Instant effect
    [PowerUpType.LASER]: 15000,        // 15 seconds
    [PowerUpType.STICKY]: 12000,       // 12 seconds
    [PowerUpType.SHIELD]: 20000,       // 20 seconds
    [PowerUpType.FIREBALL]: 15000,     // 15 seconds
    [PowerUpType.SCORE_MULTIPLIER]: 20000  // Added from the .tsx file
  };

  // Colors for each power-up type (for visual identification)
  static readonly COLORS: Record<PowerUpType, string> = {
    [PowerUpType.MULTI_BALL]: '#FF5500',
    [PowerUpType.PADDLE_GROW]: '#00FF00',
    [PowerUpType.PADDLE_SHRINK]: '#FF0000',
    [PowerUpType.SPEED_DOWN]: '#0000FF',
    [PowerUpType.SPEED_UP]: '#FFFF00',
    [PowerUpType.EXTRA_LIFE]: '#FF00FF',
    [PowerUpType.LASER]: '#00FFFF',
    [PowerUpType.STICKY]: '#8800FF',
    [PowerUpType.SHIELD]: '#FFFFFF',
    [PowerUpType.FIREBALL]: '#FF8800',
    [PowerUpType.SCORE_MULTIPLIER]: '#8B5CF6'
  };

  /**
   * Get a random power-up type based on probability weights
   */
  static getRandomType(): PowerUpType {
    // Calculate total weight
    const totalWeight = Object.values(this.PROBABILITIES).reduce((sum, weight) => sum + weight, 0);

    // Get a random value between 0 and total weight
    const randomValue = Math.random() * totalWeight;

    // Find the power-up type based on the random value
    let cumulativeWeight = 0;
    for (const type of Object.values(PowerUpType)) {
      cumulativeWeight += this.PROBABILITIES[type];
      if (randomValue <= cumulativeWeight) {
        return type;
      }
    }

    // Fallback to a default type
    return PowerUpType.PADDLE_GROW;
  }

  /**
   * Get the color for a power-up type
   */
  static getColor(type: PowerUpType): string {
    return this.COLORS[type] || '#FFFFFF';
  }

  /**
   * Get the duration for a power-up type
   */
  static getDuration(type: PowerUpType): number {
    return this.DURATIONS[type] || 0;
  }

  /**
   * Check if a power-up is temporary (has duration)
   */
  static isTemporary(type: PowerUpType): boolean {
    return this.DURATIONS[type] > 0;
  }
}

// Define interfaces for game objects with custom methods
interface BreakoutGame extends Phaser.Scene {
  paddle?: Phaser.GameObjects.Sprite;
  ball?: Phaser.Physics.Arcade.Sprite;
  data: Phaser.Data.DataManager;
  addLife?: () => void;
  addMultiBall?: () => void;
  setPowerUpTimer?: (powerUp: PowerUp, duration: number) => void;
  enableLaser?: () => void;
  addShield?: () => void;
  enableFireball?: () => void;
  disableLaser?: () => void;
  removeShield?: () => void;
  disableFireball?: () => void;
  getBallManager?: () => any;
  getPaddleManager?: () => any;
  getPowerUpManager?: () => any;
  getLives?: () => number;
  setLives?: (lives: number) => void;
}

// Define an interface for paddles with sticky property
interface StickyPaddle extends Phaser.GameObjects.Sprite {
  setSticky?: (isSticky: boolean) => void;
}

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  // Use declare to avoid overwriting the base property
  declare type: PowerUpType;
  duration?: number; // In ms, for timed power-ups
  active: boolean = false;

  constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
    super(scene, x, y, `powerup_${type}`);
    this.type = type;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Set fall speed based on device performance for consistent gameplay
    const fallSpeed = 150;
    this.setVelocityY(fallSpeed);
    
    // Add animation if available
    this.setupAnimation();
    
    // Set collision bounds
    this.setCollideWorldBounds(false);
    
    // Set appropriate size for hitbox
    this.setSize(32, 32);
    
    // Enable interactive if needed
    this.setInteractive();
  }

  /**
   * Setup animations for power-up if available
   */
  private setupAnimation(): void {
    // Check if animation exists before trying to play it
    const animKey = `powerup_${this.type}_anim`;
    if (this.scene.anims.exists(animKey)) {
      this.play(animKey);
    }
  }

  /**
   * Apply the power-up effect to the game
   * @param game The game scene
   */
  applyEffect(game: BreakoutGame): void {
    this.active = true;
    
    switch (this.type) {
      case PowerUpType.EXTRA_LIFE:
        if (game.addLife) {
          game.addLife();
        } else if (game.getLives && game.setLives) {
          game.setLives(game.getLives() + 1);
        }
        break;
      case PowerUpType.PADDLE_GROW:
        if (game.paddle) {
          game.paddle.setScale(1.5, 1);
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.PADDLE_GROW));
        }
        break;
      case PowerUpType.PADDLE_SHRINK:
        if (game.paddle) {
          game.paddle.setScale(0.5, 1);
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.PADDLE_SHRINK));
        }
        break;
      case PowerUpType.MULTI_BALL:
        if (game.addMultiBall) {
          game.addMultiBall();
        } else if (game.getBallManager && typeof game.getBallManager().createMultipleBalls === 'function') {
          game.getBallManager().createMultipleBalls(2);
        }
        break;
      case PowerUpType.SPEED_DOWN:
        if (game.ball) {
          const ballBody = game.ball.body;
          if (ballBody && 'velocity' in ballBody) {
            const velocityX = ballBody.velocity.x || 0;
            const velocityY = ballBody.velocity.y || 0;
            game.ball.setVelocity(velocityX / 1.5, velocityY / 1.5);
          }
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.SPEED_DOWN));
        }
        break;
      case PowerUpType.SPEED_UP:
        if (game.ball) {
          const ballBody = game.ball.body;
          if (ballBody && 'velocity' in ballBody) {
            const velocityX = ballBody.velocity.x || 0;
            const velocityY = ballBody.velocity.y || 0;
            game.ball.setVelocity(velocityX * 1.5, velocityY * 1.5);
          }
        } else if (game.getBallManager && typeof game.getBallManager().setSpeedMultiplier === 'function') {
          game.getBallManager().setSpeedMultiplier(1.5);
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.SPEED_UP));
        }
        break;
      case PowerUpType.STICKY:
        if (game.paddle) {
          const paddle = game.paddle as StickyPaddle;
          if (paddle.setSticky) {
            paddle.setSticky(true);
          } else if (game.getPaddleManager && typeof game.getPaddleManager().setSticky === 'function') {
            game.getPaddleManager().setSticky(true);
          } else {
            console.warn('Paddle does not have setSticky method');
          }
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.STICKY));
        }
        break;
      case PowerUpType.LASER:
        if (game.enableLaser) {
          game.enableLaser();
        } else if (game.getPaddleManager && typeof game.getPaddleManager().enableLaser === 'function') {
          game.getPaddleManager().enableLaser(true);
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.LASER));
        }
        break;
      case PowerUpType.SHIELD:
        if (game.addShield) {
          game.addShield();
        } else if (game.getPowerUpManager && typeof game.getPowerUpManager().addShield === 'function') {
          game.getPowerUpManager().addShield();
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.SHIELD));
        }
        break;
      case PowerUpType.FIREBALL:
        if (game.enableFireball) {
          game.enableFireball();
        }
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.FIREBALL));
        }
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        // Double the score for each brick hit
        if (game.data) {
          game.data.set('scoreMultiplier', 2);
        }
        // Add visual indicator
        const multiplierText = game.add.text(
          game.scale.width - 160, 
          80, 
          'Score x2', 
          {
            fontSize: '24px',
            color: '#8B5CF6',
            fontFamily: 'Arial'
          }
        ).setScrollFactor(0);
        
        if (game.data) {
          game.data.set('multiplierText', multiplierText);
        }
        
        // Set a timer to revert the effect
        if (game.setPowerUpTimer) {
          game.setPowerUpTimer(this, PowerUpConfig.getDuration(PowerUpType.SCORE_MULTIPLIER));
        }
        break;
      default:
        console.warn(`Unknown power-up type: ${this.type}`);
        break;
    }
  }

  /**
   * Remove the power-up effect from the game
   * @param game The game scene
   */
  removeEffect(game: BreakoutGame): void {
    if (!this.active) return;
    
    this.active = false;
    
    switch (this.type) {
      case PowerUpType.PADDLE_GROW:
      case PowerUpType.PADDLE_SHRINK:
        if (game.paddle) {
          game.paddle.setScale(1, 1);
        }
        break;
      case PowerUpType.SPEED_DOWN:
        if (game.ball) {
          const ballBody = game.ball.body;
          if (ballBody && 'velocity' in ballBody) {
            const velocityX = ballBody.velocity.x || 0;
            const velocityY = ballBody.velocity.y || 0;
            game.ball.setVelocity(velocityX * 1.5, velocityY * 1.5);
          }
        }
        break;
      case PowerUpType.SPEED_UP:
        if (game.ball) {
          const ballBody = game.ball.body;
          if (ballBody && 'velocity' in ballBody) {
            const velocityX = ballBody.velocity.x || 0;
            const velocityY = ballBody.velocity.y || 0;
            game.ball.setVelocity(velocityX / 1.5, velocityY / 1.5);
          }
        } else if (game.getBallManager && typeof game.getBallManager().setSpeedMultiplier === 'function') {
          game.getBallManager().setSpeedMultiplier(1.0);
        }
        break;
      case PowerUpType.STICKY:
        if (game.paddle) {
          const paddle = game.paddle as StickyPaddle;
          if (paddle.setSticky) {
            paddle.setSticky(false);
          } else if (game.getPaddleManager && typeof game.getPaddleManager().setSticky === 'function') {
            game.getPaddleManager().setSticky(false);
          }
        }
        break;
      case PowerUpType.LASER:
        if (game.disableLaser) {
          game.disableLaser();
        } else if (game.getPaddleManager && typeof game.getPaddleManager().enableLaser === 'function') {
          game.getPaddleManager().enableLaser(false);
        }
        break;
      case PowerUpType.SHIELD:
        if (game.removeShield) {
          game.removeShield();
        } else if (game.getPowerUpManager && typeof game.getPowerUpManager().removeShield === 'function') {
          game.getPowerUpManager().removeShield();
        }
        break;
      case PowerUpType.FIREBALL:
        if (game.disableFireball) {
          game.disableFireball();
        }
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        // Reset score multiplier
        if (game.data) {
          game.data.set('scoreMultiplier', 1);
        }
        
        // Remove visual indicator
        const multiplierText = game.data ? game.data.get('multiplierText') : null;
        if (multiplierText) {
          multiplierText.destroy();
        }
        break;
      // MULTIBALL and EXTRA_LIFE don't need removal logic as they're permanent/instant
    }
  }

  /**
   * Update method called every frame
   * @param time The current time
   * @param delta The delta time in ms since the last frame
   */
  update(time: number, delta: number): void {
    super.update(time, delta);
    
    // Check if power-up has fallen off screen and destroy it
    if (this.y > this.scene.sys.game.canvas.height + 50) {
      this.destroy();
    }
  }

  /**
   * Clean up resources when power-up is destroyed
   */
  destroy(fromScene?: boolean): void {
    // If the power-up is active when destroyed, remove its effects
    if (this.active) {
      this.removeEffect(this.scene as BreakoutGame);
    }
    
    super.destroy(fromScene);
  }
  
  /**
   * Factory method to create a power-up with proper sprite and effects
   * @param scene The game scene
   * @param x X position
   * @param y Y position
   * @param type Optional power-up type (random if not specified)
   * @returns A new PowerUp instance
   */
  static create(scene: Phaser.Scene, x: number, y: number, type?: PowerUpType): PowerUp {
    // Use provided type or get a random one
    const powerUpType = type || PowerUpConfig.getRandomType();
    return new PowerUp(scene, x, y, powerUpType);
  }
}