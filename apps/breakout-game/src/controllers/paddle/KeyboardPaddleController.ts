import * as Phaser from 'phaser';
import BasePaddleController from './BasePaddleController';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Paddle controller that handles keyboard input
 */
class KeyboardPaddleController extends BasePaddleController {
  private keys: Record<string, Phaser.Input.Keyboard.Key> = {};
  private paddleId: string;
  
  constructor(
    scene: BreakoutScene, 
    paddle?: Phaser.Physics.Matter.Sprite, 
    orientation: 'horizontal' | 'vertical' = 'horizontal',
    paddleId: string = 'default'
  ) {
    super(scene, paddle, orientation);
    this.paddleId = paddleId;
    
    // Initialize keyboard controls
    this.setupKeyboardControls();
  }
  
  /**
   * Set up keyboard controls based on paddle ID and orientation
   */
  private setupKeyboardControls(): void {
    // Create keyboard keys based on paddle ID
    switch (this.paddleId) {
      case 'bottom':
        this.keys.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        this.keys.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        break;
      case 'top':
        this.keys.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        this.keys.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        break;
      case 'left':
        this.keys.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        this.keys.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        break;
      case 'right':
        this.keys.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.keys.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        break;
      default:
        // Default to arrow keys for horizontal, WS for vertical
        if (this.orientation === 'horizontal') {
          this.keys.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
          this.keys.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        } else {
          this.keys.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
          this.keys.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        }
        break;
    }
  }
  
  /**
   * Update paddle position based on keyboard input
   */
  update(): void {
    if (!this.isActive || !this.paddle) return;
    
    if (this.orientation === 'horizontal') {
      // Horizontal paddle movement
      if (this.keys.left && this.keys.left.isDown) {
        this.paddle.x -= this.speed;
      } else if (this.keys.right && this.keys.right.isDown) {
        this.paddle.x += this.speed;
      }
    } else {
      // Vertical paddle movement
      if (this.keys.up && this.keys.up.isDown) {
        this.paddle.y -= this.speed;
      } else if (this.keys.down && this.keys.down.isDown) {
        this.paddle.y += this.speed;
      }
    }
    
    // Keep paddle within bounds
    this.keepPaddleInBounds();
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    super.cleanup();
    
    // Remove keyboard keys
    Object.values(this.keys).forEach(key => {
      this.scene.input.keyboard.removeKey(key.keyCode);
    });
  }
}

export default KeyboardPaddleController;