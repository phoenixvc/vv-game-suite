import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import AIPaddleController from './AIPaddleController';
import BasePaddleController from './BasePaddleController';
import KeyboardPaddleController from './KeyboardPaddleController';
import MousePaddleController from './MousePaddleController';

/**
 * Factory class for creating appropriate paddle controllers
 */
class PaddleController {
  private controller: BasePaddleController;
  
  /**
   * Create a paddle controller based on the provided parameters
   * 
   * @param scene The BreakoutScene instance
   * @param paddleOrId Either a paddle sprite or a paddle ID string
   * @param orientationOrOptions Either the orientation string or control options
   * @param options Additional options
   */
  constructor(
    scene: BreakoutScene,
    paddleOrId?: Phaser.Physics.Matter.Sprite | string,
    orientationOrOptions?: 'horizontal' | 'vertical' | { controlType?: 'keyboard' | 'mouse' | 'touch' | 'ai', difficulty?: number },
    options?: { controlType?: 'keyboard' | 'mouse' | 'touch' | 'ai', difficulty?: number }
  ) {
    // Parse parameters
    let paddle: Phaser.Physics.Matter.Sprite | undefined;
    let paddleId: string = 'default';
    let orientation: 'horizontal' | 'vertical' = 'horizontal';
    let controlType: 'keyboard' | 'mouse' | 'touch' | 'ai' = 'keyboard';
    let difficulty: number = 0.5;
    
    // Handle different parameter combinations
    if (paddleOrId instanceof Phaser.Physics.Matter.Sprite) {
      // First param is a paddle sprite
      paddle = paddleOrId;
      
      // Get paddleId from sprite data if available
      paddleId = paddle.getData('id') || 'default';
      
      // Check if the second parameter is orientation or options
      if (typeof orientationOrOptions === 'string') {
        orientation = orientationOrOptions;
        
        // Get options from the third parameter if provided
        if (options) {
          controlType = options.controlType || controlType;
          difficulty = options.difficulty !== undefined ? options.difficulty : difficulty;
        }
      } else if (orientationOrOptions && typeof orientationOrOptions === 'object') {
        // Second parameter is options
        controlType = orientationOrOptions.controlType || controlType;
        difficulty = orientationOrOptions.difficulty !== undefined ? orientationOrOptions.difficulty : difficulty;
      }
    } else if (typeof paddleOrId === 'string') {
      // First param is paddleId
      paddleId = paddleOrId;
      
      // Check if the second parameter is orientation or options
      if (typeof orientationOrOptions === 'string') {
        orientation = orientationOrOptions;
        
        // Get options from the third parameter if provided
        if (options) {
          controlType = options.controlType || controlType;
          difficulty = options.difficulty !== undefined ? options.difficulty : difficulty;
        }
      } else if (orientationOrOptions && typeof orientationOrOptions === 'object') {
        // Second parameter is options
        controlType = orientationOrOptions.controlType || controlType;
        difficulty = orientationOrOptions.difficulty !== undefined ? orientationOrOptions.difficulty : difficulty;
      }
    }
    
    // Create the appropriate controller based on control type
    switch (controlType) {
      case 'mouse':
      case 'touch':
        this.controller = new MousePaddleController(scene, paddle, orientation);
        break;
      case 'ai':
        this.controller = new AIPaddleController(scene, paddle, orientation, difficulty);
        break;
      case 'keyboard':
      default:
        this.controller = new KeyboardPaddleController(scene, paddle, orientation, paddleId);
        break;
    }
  }
  
  /**
   * Set the paddle this controller will control
   */
  setPaddle(paddle: Phaser.Physics.Matter.Sprite): void {
    this.controller.setPaddle(paddle);
  }
  
  /**
   * Update paddle position and behavior
   */
  update(): void {
    this.controller.update();
  }
  
  /**
   * Enable control of the paddle
   */
  enableControl(): void {
    this.controller.enableControl();
  }
  
  /**
   * Disable control of the paddle
   */
  disableControl(): void {
    this.controller.disableControl();
  }
  
  /**
   * Check if control is enabled
   */
  isControlEnabled(): boolean {
    return this.controller.isControlEnabled();
  }
  
  /**
   * Set paddle stickiness
   */
  setSticky(isSticky: boolean): void {
    this.controller.setSticky(isSticky);
  }
  
  /**
   * Check if paddle is sticky
   */
  isSticky(): boolean {
    return this.controller.isSticky();
  }
  
  /**
   * Set paddle speed
   */
  setSpeed(speed: number): void {
    this.controller.setSpeed(speed);
  }
  
  /**
   * Get the current paddle
   */
  getPaddle(): Phaser.Physics.Matter.Sprite | undefined {
    return this.controller.getPaddle();
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    this.controller.cleanup();
  }
}

export default PaddleController;