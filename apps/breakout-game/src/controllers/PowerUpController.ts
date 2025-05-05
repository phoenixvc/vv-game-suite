import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

/**
 * Controls individual power-up behavior
 */
class PowerUpController {
  private scene: BreakoutScene;
  private powerUp: Phaser.Physics.Matter.Sprite;
  private type: string;
  private isActive: boolean = true;
  private duration: number;
  private animationTween?: Phaser.Tweens.Tween;
  
  constructor(scene: BreakoutScene, powerUp: Phaser.Physics.Matter.Sprite, type: string, duration: number = 10000) {
    this.scene = scene;
    this.powerUp = powerUp;
    this.type = type;
    this.duration = duration;
    
    // Initialize power-up
    this.initPowerUp();
    
    // Set up visual appearance
    this.setupVisuals();
  }
  
  /**
   * Initialize power-up properties
   */
  private initPowerUp(): void {
    // Store data on the power-up
    this.powerUp.setData('type', this.type);
    this.powerUp.setData('controller', this);
    this.powerUp.setData('duration', this.duration);
    
    // Set physics properties
    const physicsManager = this.scene['physicsManager'];
    if (physicsManager) {
      this.powerUp.setCollisionCategory(physicsManager.powerUpCategory);
      this.powerUp.setCollidesWith([physicsManager.paddleCategory, physicsManager.wallCategory]);
    }
    
    // Set velocity downward
    this.powerUp.setVelocity(0, 2);
  }
  
  /**
   * Set up visual appearance
   */
  private setupVisuals(): void {
    // Set tint based on power-up type
    const tints = {
      expand: 0x00ff00,
      shrink: 0xff0000,
      multiball: 0xffff00,
      laser: 0xff00ff,
      sticky: 0x00ffff,
      slow: 0x0000ff,
      fast: 0xffa500,
      extralife: 0xff69b4
    };
    
    const tint = tints[this.type] || 0xffffff;
    this.powerUp.setTint(tint);
    
    // Start animation
    this.startAnimation();
  }
  
  /**
   * Start power-up animation
   */
  private startAnimation(): void {
    // Rotation animation
    this.animationTween = this.scene.tweens.add({
      targets: this.powerUp,
      angle: 360,
      duration: 2000,
      repeat: -1,
      ease: 'Linear'
    });
    
    // Pulsing scale animation
    this.scene.tweens.add({
      targets: this.powerUp,
      scale: 1.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });
  }
  
  /**
   * Update method called every frame
   */
  update(): void {
    if (!this.isActive) return;
    
    // Check if power-up is out of bounds
    this.checkBounds();
  }
  
  /**
   * Check if power-up is out of bounds
   */
  private checkBounds(): void {
    if (
      this.powerUp.y > this.scene.scale.height + 50 ||
      this.powerUp.x < -50 ||
      this.powerUp.x > this.scene.scale.width + 50
    ) {
      this.destroy();
    }
  }
  
  /**
   * Apply power-up effect when collected
   */
  applyEffect(paddle: Phaser.Physics.Matter.Sprite): void {
    if (!this.isActive) return;
    
    // Apply effect based on power-up type
    switch (this.type) {
      case 'expand':
        this.applyExpandEffect(paddle);
        break;
      case 'shrink':
        this.applyShrinkEffect(paddle);
        break;
      case 'multiball':
        this.applyMultiballEffect();
        break;
      case 'laser':
        this.applyLaserEffect(paddle);
        break;
      case 'sticky':
        this.applyStickyEffect(paddle);
        break;
      case 'slow':
        this.applySlowEffect();
        break;
      case 'fast':
        this.applyFastEffect();
        break;
      case 'extralife':
        this.applyExtraLifeEffect();
        break;
    }
    
    // Emit collection event
    this.scene['eventManager']?.emit('powerUpCollected', {
      type: this.type,
      paddle: paddle,
      duration: this.duration
    });
    
    // Destroy this power-up
    this.destroy();
  }
  
  /**
   * Apply expand paddle effect
   */
  private applyExpandEffect(paddle: Phaser.Physics.Matter.Sprite): void {
    const paddleController = paddle.getData('controller');
    if (!paddleController) return;
    
    // Get paddle edge
    const edge = paddle.getData('edge');
    const isVertical = edge === 'left' || edge === 'right';
    
    // Scale paddle
    if (isVertical) {
      paddle.setScale(1, 1.5);
    } else {
      paddle.setScale(1.5, 1);
    }
    
    // Set timer to revert
    this.scene['timeManager']?.createTimer(
      `powerup_${this.type}_${Date.now()}`,
      this.duration,
      () => {
        if (paddle.active) {
          paddle.setScale(1, 1);
        }
      }
    );
  }
  
  /**
   * Apply shrink paddle effect
   */
  private applyShrinkEffect(paddle: Phaser.Physics.Matter.Sprite): void {
    const paddleController = paddle.getData('controller');
    if (!paddleController) return;
    
    // Get paddle edge
    const edge = paddle.getData('edge');
    const isVertical = edge === 'left' || edge === 'right';
    
    // Scale paddle
    if (isVertical) {
      paddle.setScale(1, 0.5);
    } else {
      paddle.setScale(0.5, 1);
    }
    
    // Set timer to revert
    this.scene['timeManager']?.createTimer(
      `powerup_${this.type}_${Date.now()}`,
      this.duration,
      () => {
        if (paddle.active) {
          paddle.setScale(1, 1);
        }
      }
    );
  }
  
  /**
   * Apply multiball effect
   */
  private applyMultiballEffect(): void {
    // Get ball manager
    const ballManager = this.scene['ballManager'];
    if (!ballManager) return;
    
    // Create 2 additional balls
    for (let i = 0; i < 2; i++) {
      const angle = Math.PI / 4 * (i === 0 ? 1 : -1);
      // Get active ball position to spawn new balls from
      const activeBall = ballManager.getActiveBall();
      if (activeBall) {
        const x = activeBall.x;
        const y = activeBall.y;
        const velocity = {
          x: Math.cos(angle) * 5,
          y: Math.sin(angle) * 5
        };
        
        // Create new ball with position and velocity
        ballManager.createBallWithOptions({
          x,
          y,
          velocity
        });
      } else {
        // If no active ball, create from center
        ballManager.createBall();
      }
    }
  }
  
  /**
   * Apply laser effect
   */
  private applyLaserEffect(paddle: Phaser.Physics.Matter.Sprite): void {
    // Enable laser shooting for paddle
    paddle.setData('canShootLaser', true);
    
    // Set timer to revert
    this.scene['timeManager']?.createTimer(
      `powerup_${this.type}_${Date.now()}`,
      this.duration,
      () => {
        if (paddle.active) {
          paddle.setData('canShootLaser', false);
        }
      }
    );
  }
  
  /**
   * Apply sticky effect
   */
  private applyStickyEffect(paddle: Phaser.Physics.Matter.Sprite): void {
    const paddleController = paddle.getData('controller');
    if (!paddleController) return;
    
    // Make paddle sticky
    paddleController.setSticky(true);
    
    // Set timer to revert
    this.scene['timeManager']?.createTimer(
      `powerup_${this.type}_${Date.now()}`,
      this.duration,
      () => {
        if (paddleController) {
          paddleController.setSticky(false);
        }
      }
    );
  }
  
  /**
   * Apply slow effect
   */
  private applySlowEffect(): void {
    // Get all active balls
    const ballManager = this.scene['ballManager'];
    if (!ballManager) return;
    
    const balls = ballManager.getAllBalls();
    
    // Apply slow effect to all balls
    balls.forEach(ball => {
      const ballController = ball.getData('controller');
      if (ballController) {
        ballController.applyEffect('slow', this.duration);
      }
    });
  }
  
  /**
   * Apply fast effect
   */
  private applyFastEffect(): void {
    // Get all active balls
    const ballManager = this.scene['ballManager'];
    if (!ballManager) return;
    
    const balls = ballManager.getAllBalls();
    
    // Apply fast effect to all balls
    balls.forEach(ball => {
      const ballController = ball.getData('controller');
      if (ballController) {
        ballController.applyEffect('fast', this.duration);
      }
    });
  }
  
  /**
   * Apply extra life effect
   */
  private applyExtraLifeEffect(): void {
    // Get game state manager
    const gameStateManager = this.scene['gameStateManager'];
    if (!gameStateManager) {
      // Fallback to direct scene property
      if (typeof this.scene['lives'] === 'number') {
        this.scene['lives']++;
        // Update UI - Use the handleLivesUpdated method
        const uiManager = this.scene.getUIManager();
        if (uiManager) {
          uiManager.updateLives(this.scene['lives']);
        }
      }
      return;
    }
    
    // Add extra life
    gameStateManager.addLife();
  }
  
  /**
   * Remove effect from the game
   */
  removeEffect(paddle: Phaser.Physics.Matter.Sprite): void {
    // This is called when the power-up effect expires
    // Most of the cleanup is handled in the specific apply methods
    
    // Emit event
    this.scene['eventManager']?.emit('powerUpExpired', {
      type: this.type,
      paddle: paddle
    });
  }
    
  /**
   * Get power-up type
   */
  getType(): string {
    return this.type;
  }
    
  /**
   * Destroy the power-up
   */
  destroy(): void {
    if (!this.isActive) return;
    this.isActive = false;
    
    // Stop animations
    if (this.animationTween) {
      this.animationTween.stop();
    }
    
    // Remove from physics world
    if (this.powerUp.body) {
      this.scene.matter.world.remove(this.powerUp.body as any);
    }

    // Destroy the sprite
    this.powerUp.destroy();
  }
}

export default PowerUpController;