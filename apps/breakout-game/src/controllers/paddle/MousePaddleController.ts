import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import BasePaddleController from './BasePaddleController';

/**
 * Paddle controller that handles mouse/touch input
 */
class MousePaddleController extends BasePaddleController {
  private pointerHandler: (pointer: Phaser.Input.Pointer) => void;
  
  constructor(
    scene: BreakoutScene, 
    paddle?: Phaser.Physics.Matter.Sprite, 
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ) {
    super(scene, paddle, orientation);
    
    // Create bound handler function
    this.pointerHandler = this.handlePointerMove.bind(this);
    
    // Initialize pointer controls
    this.setupPointerControls();
  }
  
  /**
   * Set up mouse/touch controls
   */
  private setupPointerControls(): void {
    this.scene.input.on('pointermove', this.pointerHandler);
  }
  
  /**
   * Handle pointer movement
   */
  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    if (!this.isActive || !this.paddle) return;
    
    if (this.orientation === 'horizontal') {
      // Move horizontal paddle to pointer x position
      this.paddle.x = Phaser.Math.Clamp(
        pointer.x,
        this.paddle.displayWidth / 2,
        this.scene.scale.width - this.paddle.displayWidth / 2
      );
    } else {
      // Move vertical paddle to pointer y position
      this.paddle.y = Phaser.Math.Clamp(
        pointer.y,
        this.paddle.displayHeight / 2,
        this.scene.scale.height - this.paddle.displayHeight / 2
      );
    }
  }
  
  /**
   * Update method (not needed for mouse control as it's event-based)
   */
  update(): void {
    // Mouse movement is handled by events, so no update needed
    // But we still keep the paddle within bounds as a safety measure
    if (this.paddle) {
      this.keepPaddleInBounds();
    }
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    super.cleanup();
    
    // Remove pointer listeners
    this.scene.input.off('pointermove', this.pointerHandler);
  }
}

export default MousePaddleController;