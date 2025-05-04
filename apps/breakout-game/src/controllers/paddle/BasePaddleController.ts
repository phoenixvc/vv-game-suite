import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import { PHYSICS } from '../../constants/GameConstants';

/**
 * Base class for paddle controllers that handles common functionality
 */
abstract class BasePaddleController {
  protected scene: BreakoutScene;
  protected paddle?: Phaser.Physics.Matter.Sprite;
  protected speed: number = PHYSICS.PADDLE.MOVE_SPEED;
  protected isActive: boolean = true;
  protected controlEnabled: boolean = false; // Default to disabled until game starts
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
    
    // Store controller reference on the paddle
    paddle.setData('controller', this);
    
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
    
    // Listen for game controls enabled event
    eventManager.on('gameControlsEnabled', () => { this.enableControl(); }, this);
  }
  
  /**
   * Enable control of the paddle
   */
  public enableControl(): void {
    console.log(`Enabling control for paddle ${this.paddle?.getData('id') || 'unknown'}`);
    this.controlEnabled = true;
    
    // Store enabled state on the paddle for reference
    if (this.paddle) {
      this.paddle.setData('controlEnabled', true);
    }
  }
  
  /**
   * Disable control of the paddle
   */
  public disableControl(): void {
    console.log(`Disabling control for paddle ${this.paddle?.getData('id') || 'unknown'}`);
    this.controlEnabled = false;
    
    // Store disabled state on the paddle for reference
    if (this.paddle) {
      this.paddle.setData('controlEnabled', false);
    }
  }
  
  /**
   * Check if control is enabled
   */
  public isControlEnabled(): boolean {
    return this.controlEnabled;
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
      eventManager.off('gameControlsEnabled', null, this);
    }
  }
}

export default BasePaddleController;