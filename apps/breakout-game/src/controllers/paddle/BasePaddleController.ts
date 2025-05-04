import * as Phaser from 'phaser';
import { PHYSICS } from '../../constants/GameConstants';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Base class for paddle controllers that handles common functionality
 */
abstract class BasePaddleController {
  protected scene: BreakoutScene;
  protected paddle?: Phaser.Physics.Matter.Sprite;
  protected speed: number = PHYSICS.PADDLE.MOVE_SPEED;
  protected isActive: boolean = true;
  protected orientation: 'horizontal' | 'vertical';
  
  constructor(scene: BreakoutScene, paddle?: Phaser.Physics.Matter.Sprite, orientation: 'horizontal' | 'vertical' = 'horizontal') {
    this.scene = scene;
    this.orientation = orientation;
    
    if (paddle) {
      this.setPaddle(paddle);
    }
    
    // Listen for game state changes
    this.setupEventListeners();
  }
  
  /**
   * Set the paddle this controller will control
   */
  setPaddle(paddle: Phaser.Physics.Matter.Sprite): void {
    this.paddle = paddle;
    
    // Add sticky property if needed
    if (typeof (this.paddle as any).setSticky !== 'function') {
      (this.paddle as any).setSticky = (isSticky: boolean) => {
        this.paddle?.setData('sticky', isSticky);
      };
    }
  }
  
  /**
   * Set up event listeners
   */
  protected setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    // Listen for game state changes
    eventManager.on('gamePaused', () => { this.isActive = false; }, this);
    eventManager.on('gameResumed', () => { this.isActive = true; }, this);
  }
  
  /**
   * Update paddle position and behavior
   * This method should be implemented by subclasses
   */
  abstract update(): void;
  
  /**
   * Keep paddle within screen bounds
   */
  protected keepPaddleInBounds(): void {
    if (!this.paddle) return;
    
    if (this.orientation === 'horizontal') {
      // Horizontal paddle bounds
      this.paddle.x = Phaser.Math.Clamp(
        this.paddle.x,
        this.paddle.displayWidth / 2,
        this.scene.scale.width - this.paddle.displayWidth / 2
      );
    } else {
      // Vertical paddle bounds
      this.paddle.y = Phaser.Math.Clamp(
        this.paddle.y,
        this.paddle.displayHeight / 2,
        this.scene.scale.height - this.paddle.displayHeight / 2
      );
    }
  }
  
  /**
   * Set paddle stickiness
   */
  setSticky(isSticky: boolean): void {
    if (!this.paddle) return;
    
    this.paddle.setData('sticky', isSticky);
  }
  
  /**
   * Check if paddle is sticky
   */
  isSticky(): boolean {
    if (!this.paddle) return false;
    
    return !!this.paddle.getData('sticky');
  }
  
  /**
   * Set paddle speed
   */
  setSpeed(speed: number): void {
    this.speed = speed;
  }
  
  /**
   * Get the current paddle
   */
  getPaddle(): Phaser.Physics.Matter.Sprite | undefined {
    return this.paddle;
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('gamePaused', null, this);
      eventManager.off('gameResumed', null, this);
    }
  }
}

export default BasePaddleController;