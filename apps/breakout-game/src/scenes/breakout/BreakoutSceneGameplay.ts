import BreakoutScene from './BreakoutScene';

/**
 * Handles gameplay-related functionality for the BreakoutScene
 */
export class BreakoutSceneGameplay {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Method needed for compatibility with LevelManager
   * Creates bricks based on provided signals
   */
  public createBricks = (signals: any[]): void => {
    const brickManager = this.scene['brickManager'];
    if (brickManager && typeof brickManager.createBricksForLevel === 'function') {
      brickManager.createBricksForLevel(1, signals);
    }
  }
  
  /**
   * Method needed for BallManager
   * Resets the ball position
   */
  public resetBall = (): void => {
    const ballManager = this.scene['ballManager'];
    if (ballManager) {
      ballManager.resetBall(this.scene['paddles']);
    }
  }
  
  /**
   * Method needed for InputManager
   * Starts the game by launching the ball
   */
  public startGame = (): void => {
    // Launch the ball using BallManager
    const ballManager = this.scene['ballManager'];
    if (ballManager) {
      ballManager.launchBall();
    }
    
    // Emit game started event
    const eventManager = this.scene['eventManager'];
    if (eventManager) {
      eventManager.emit('gameStarted');
    }
  }
  
  /**
   * Method for PowerUpManager to use TimeManager
   * Sets a timer for power-up duration
   */
  public setPowerUpTimer = (powerUp: any, duration: number): void => {
    const timeManager = this.scene['timeManager'];
    if (timeManager) {
      timeManager.setPowerUpTimer(
        powerUp.type,
        duration,
        () => powerUp.removeEffect(this.scene),
        this.scene
      );
    }
  }
}