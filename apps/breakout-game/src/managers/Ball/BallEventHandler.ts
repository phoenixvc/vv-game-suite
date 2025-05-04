import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import BallController from '../../controllers/BallController';

/**
 * Handles events related to balls
 */
class BallEventHandler {
  private scene: BreakoutScene;
  private onAllBallsLostCallback: () => void;
  private onBallOutOfBoundsCallback: (ballId: string) => void;
  
  constructor(
    scene: BreakoutScene, 
    onAllBallsLostCallback: () => void,
    onBallOutOfBoundsCallback: (ballId: string) => void
  ) {
    this.scene = scene;
    this.onAllBallsLostCallback = onAllBallsLostCallback;
    this.onBallOutOfBoundsCallback = onBallOutOfBoundsCallback;
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    // Get event manager
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    // Listen for ball out of bounds
    eventManager.on('ballOutOfBounds', this.handleBallOutOfBounds, this);
    
    // Listen for level progress check
    eventManager.on('checkLevelProgress', this.checkBallCount, this);
    
    // Listen for game ready and paddles created
    eventManager.on('gameReady', this.handleGameReady, this);
    eventManager.on('paddlesCreated', this.handlePaddlesCreated, this);
  }
  
  /**
   * Handle ball out of bounds
   */
  private handleBallOutOfBounds = (data: { ballId: string }): void => {
    this.onBallOutOfBoundsCallback(data.ballId);
  }
  
  /**
   * Check if there are any balls left
   */
  private checkBallCount = (): void => {
    // This will be called by BallManager which has the actual ball count
    // The callback will handle the logic
  }
  
  /**
   * Handle game ready event
   */
  private handleGameReady = (): void => {
    // Delegate to BallManager
    this.scene.getBallManager()?.ensureBallOnPaddle();
  }
  
  /**
   * Handle paddles created event
   */
  private handlePaddlesCreated = (): void => {
    // Delegate to BallManager
    this.scene.getBallManager()?.ensureBallOnPaddle();
  }
  
  /**
   * Emit ball launched event
   */
  public emitBallLaunched(ball: Phaser.Physics.Matter.Sprite, velocity: { x: number, y: number }): void {
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballLaunched', { ball, velocity });
    }
  }
  
  /**
   * Emit all balls lost event
   */
  public emitAllBallsLost(): void {
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('allBallsLost');
    }
  }
  
  /**
   * Clean up event listeners
   */
  public cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('ballOutOfBounds', this.handleBallOutOfBounds, this);
      eventManager.off('checkLevelProgress', this.checkBallCount, this);
      eventManager.off('gameReady', this.handleGameReady, this);
      eventManager.off('paddlesCreated', this.handlePaddlesCreated, this);
    }
  }
}

export default BallEventHandler;