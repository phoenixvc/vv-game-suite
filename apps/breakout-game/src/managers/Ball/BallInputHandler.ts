import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Handles input events for ball launching
 */
class BallInputHandler {
  private scene: BreakoutScene;
  private onLaunchCallback: () => void;
  
  constructor(scene: BreakoutScene, onLaunchCallback: () => void) {
    this.scene = scene;
    this.onLaunchCallback = onLaunchCallback;
    this.setupEventListeners();
  }
  
  /**
   * Set up input event listeners
   */
  private setupEventListeners(): void {
    // Set up input listeners for ball launch
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.keyboard.on('keydown-SPACE', this.handleSpaceKey, this);
  }
  
  /**
   * Handle space key press to launch the ball
   */
  private handleSpaceKey = (): void => {
    console.log('Space key pressed, attempting to launch ball');
    this.onLaunchCallback();
  }
  
  /**
   * Handle pointer down events (mouse or touch)
   */
  private handlePointerDown = (): void => {
    console.log('Pointer down detected, attempting to launch ball');
    this.onLaunchCallback();
  }
  
  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    // Remove pointer event listeners
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    
    // Remove keyboard event listeners
    this.scene.input.keyboard.off('keydown-SPACE', this.handleSpaceKey, this);
  }
}

export default BallInputHandler;