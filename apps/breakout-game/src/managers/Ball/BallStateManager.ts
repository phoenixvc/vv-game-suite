import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import BallController from '../../controllers/BallController';

/**
 * Manages ball state (attached, launched, etc.)
 */
class BallStateManager {
  private scene: BreakoutScene;
  private balls: Phaser.Physics.Matter.Sprite[] = [];
  private ballControllers: BallController[] = [];
  private activeBall?: Phaser.Physics.Matter.Sprite;
  
  // Ball state
  private ballAttachedToPaddle: boolean = false;
  private attachedPaddle: Phaser.Physics.Matter.Sprite | null = null;
  private ballLaunched: boolean = false;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Add a ball to the state manager
   */
  public addBall(ball: Phaser.Physics.Matter.Sprite, controller: BallController): void {
    this.balls.push(ball);
    this.ballControllers.push(controller);
    
    // Set as active ball if we don't have one
    if (!this.activeBall) {
      this.activeBall = ball;
    }
  }
  
  /**
   * Remove a ball by ID
   */
  public removeBall(ballId: string): void {
    const ballIndex = this.balls.findIndex(ball => 
      ball && ball.getData('id') === ballId
    );
    
    if (ballIndex !== -1) {
      // Remove from arrays
      this.balls.splice(ballIndex, 1);
      this.ballControllers.splice(ballIndex, 1);
      
      // Reset active ball if it was removed
      if (this.activeBall && this.activeBall.getData('id') === ballId) {
        this.activeBall = this.getActiveBall();
      }
    }
  }
  
  /**
   * Set ball as attached to paddle
   */
  public attachBallToPaddle(ball: Phaser.Physics.Matter.Sprite, paddle: Phaser.Physics.Matter.Sprite): void {
    this.ballAttachedToPaddle = true;
    this.attachedPaddle = paddle;
    this.ballLaunched = false;
  }
  
  /**
   * Set ball as launched
   */
  public setBallLaunched(): void {
    this.ballLaunched = true;
    this.ballAttachedToPaddle = false;
    this.attachedPaddle = null;
  }
  
  /**
   * Get the first active ball
   */
  public getActiveBall(): Phaser.Physics.Matter.Sprite | undefined {
    // If we have a stored active ball, return it if it's still active
    if (this.activeBall && this.activeBall.active) {
      return this.activeBall;
    }
    
    // Otherwise, find the first active ball
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      if (ball && ball.active) {
        const controller = ball.getData('controller');
        if (controller && controller.isActive !== false) {
          this.activeBall = ball; // Update active ball reference
          return ball;
        }
      }
    }
    
    return undefined;
  }
  
  /**
   * Get all active balls
   */
  public getAllBalls(): Phaser.Physics.Matter.Sprite[] {
    return this.balls.filter(ball => {
      if (!ball || !ball.active) return false;
      
      const controller = ball.getData('controller');
      return controller && controller.isActive !== false;
    });
  }
  
  /**
   * Get all ball controllers
   */
  public getAllBallControllers(): BallController[] {
    return this.ballControllers.filter(controller => 
      controller && controller.isActive !== false
    );
  }
  
  /**
   * Check if the ball is attached to the paddle
   */
  public isBallAttachedToPaddle(): boolean {
    return this.ballAttachedToPaddle;
  }
  
  /**
   * Check if the ball has been launched
   */
  public isBallLaunched(): boolean {
    return this.ballLaunched;
  }
  
  /**
   * Get the attached paddle
   */
  public getAttachedPaddle(): Phaser.Physics.Matter.Sprite | null {
    return this.attachedPaddle;
  }
  
  /**
   * Check if there are any active balls
   */
  public hasActiveBalls(): boolean {
    return this.getAllBalls().length > 0;
  }
  
  /**
   * Clear all balls
   */
  public clearBalls(): void {
    this.balls = [];
    this.ballControllers = [];
    this.activeBall = undefined;
    this.ballAttachedToPaddle = false;
    this.attachedPaddle = null;
    this.ballLaunched = false;
  }
}

export default BallStateManager;