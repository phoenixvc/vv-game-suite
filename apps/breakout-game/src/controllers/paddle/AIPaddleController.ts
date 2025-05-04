import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import BasePaddleController from './BasePaddleController';

/**
 * Paddle controller that uses AI to track the ball
 */
class AIPaddleController extends BasePaddleController {
  private difficulty: number = 0.5; // 0 to 1, higher = better
  private predictionFactor: number = 0.5; // How much to predict ball movement
  
  constructor(
    scene: BreakoutScene, 
    paddle?: Phaser.Physics.Matter.Sprite, 
    orientation: 'horizontal' | 'vertical' = 'horizontal',
    difficulty: number = 0.5
  ) {
    super(scene, paddle, orientation);
    this.difficulty = Phaser.Math.Clamp(difficulty, 0, 1);
    
    // Set prediction factor based on difficulty
    this.predictionFactor = this.difficulty * 0.8;
  }
  
  /**
   * Set the AI difficulty level
   * @param difficulty Value from 0 (easy) to 1 (hard)
   */
  setDifficulty(difficulty: number): void {
    this.difficulty = Phaser.Math.Clamp(difficulty, 0, 1);
    this.predictionFactor = this.difficulty * 0.8;
  }
  
  /**
   * Update paddle position based on AI logic
   */
  update(): void {
    if (!this.isActive || !this.paddle) return;
    
    // Get the active ball
    const ballManager = this.scene.getBallManager();
    const ball = ballManager?.getActiveBall();
    if (!ball) return;
    
    // Calculate reaction speed based on difficulty
    const reactionSpeed = 0.05 + (this.difficulty * 0.15);
    
    // Get ball velocity for prediction
    const ballVelocity = ball.body?.velocity as Phaser.Math.Vector2;
    
    if (this.orientation === 'horizontal') {
      // Horizontal paddle movement
      
      // Predict where the ball will be
      let targetX = ball.x;
      
      // Add simple prediction based on ball velocity
      if (ballVelocity) {
        // Only predict if ball is moving toward this paddle
        const isPaddleAtBottom = this.paddle.y > this.scene.scale.height / 2;
        const isBallMovingTowardPaddle = (isPaddleAtBottom && ballVelocity.y > 0) || 
                                        (!isPaddleAtBottom && ballVelocity.y < 0);
        
        if (isBallMovingTowardPaddle) {
          // Calculate time to reach paddle
          const distanceY = Math.abs(this.paddle.y - ball.y);
          const timeToReach = ballVelocity.y !== 0 ? distanceY / Math.abs(ballVelocity.y) : 0;
          
          // Predict x position
          targetX += ballVelocity.x * timeToReach * this.predictionFactor;
        }
      }
      
      // Add some randomness based on inverse of difficulty
      const randomFactor = (1 - this.difficulty) * 50;
      targetX += Phaser.Math.Between(-randomFactor, randomFactor);
      
      // Move toward target with reaction speed
      const dx = targetX - this.paddle.x;
      this.paddle.x += dx * reactionSpeed;
      
    } else {
      // Vertical paddle movement
      
      // Predict where the ball will be
      let targetY = ball.y;
      
      // Add simple prediction based on ball velocity
      if (ballVelocity) {
        // Only predict if ball is moving toward this paddle
        const isPaddleAtRight = this.paddle.x > this.scene.scale.width / 2;
        const isBallMovingTowardPaddle = (isPaddleAtRight && ballVelocity.x > 0) || 
                                        (!isPaddleAtRight && ballVelocity.x < 0);
        
        if (isBallMovingTowardPaddle) {
          // Calculate time to reach paddle
          const distanceX = Math.abs(this.paddle.x - ball.x);
          const timeToReach = ballVelocity.x !== 0 ? distanceX / Math.abs(ballVelocity.x) : 0;
          
          // Predict y position
          targetY += ballVelocity.y * timeToReach * this.predictionFactor;
        }
      }
      
      // Add some randomness based on inverse of difficulty
      const randomFactor = (1 - this.difficulty) * 50;
      targetY += Phaser.Math.Between(-randomFactor, randomFactor);
      
      // Move toward target with reaction speed
      const dy = targetY - this.paddle.y;
      this.paddle.y += dy * reactionSpeed;
    }
    
    // Keep paddle within bounds
    this.keepPaddleInBounds();
  }
}

export default AIPaddleController;