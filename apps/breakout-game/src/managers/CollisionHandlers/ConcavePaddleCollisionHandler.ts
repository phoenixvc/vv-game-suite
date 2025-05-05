import * as Phaser from 'phaser';

/**
 * Handles special collision physics for concave paddles
 */
class ConcavePaddleCollisionHandler {
  /**
   * Process a collision between a ball and a concave paddle
   * @param ball The ball object
   * @param paddle The paddle object
   * @param scene The current scene
   */
  static handleCollision(
    ball: Phaser.Physics.Matter.Sprite, 
    paddle: Phaser.Physics.Matter.Sprite,
    scene: Phaser.Scene
  ): void {
    try {
      // Get the relative position of the ball to the paddle
      const paddleCenter = { x: paddle.x, y: paddle.y };
      const ballCenter = { x: ball.x, y: ball.y };
      
      // Calculate relative position
      const relX = ballCenter.x - paddleCenter.x;
      const relY = ballCenter.y - paddleCenter.y;
      
      // Determine if this is a horizontal or vertical paddle
      const isVertical = paddle.getData('isVertical');
      
      // Calculate impact position as a normalized value (-1 to 1)
      let impactPosition: number;
      
      if (isVertical) {
        // For vertical paddles, use Y position relative to paddle height
        impactPosition = relY / (paddle.displayHeight / 2);
      } else {
        // For horizontal paddles, use X position relative to paddle width
        impactPosition = relX / (paddle.displayWidth / 2);
      }
      
      // Clamp the impact position between -1 and 1
      impactPosition = Phaser.Math.Clamp(impactPosition, -1, 1);
      
      // Calculate the angle factor based on impact position
      // Center impacts should have less angle than edge impacts
      const angleFactor = this.calculateAngleFactor(impactPosition);
      
      // Get current velocity
      const velocity = new Phaser.Math.Vector2(ball.body.velocity.x, ball.body.velocity.y);
      const speed = velocity.length();
      
      // Calculate new angle based on impact position and paddle type
      let newAngle: number;
      
      if (isVertical) {
        // Vertical paddle - reflect horizontally with angle based on Y impact
        newAngle = this.calculateVerticalPaddleReflection(paddle, impactPosition, velocity);
      } else {
        // Horizontal paddle - reflect vertically with angle based on X impact
        newAngle = this.calculateHorizontalPaddleReflection(paddle, impactPosition, velocity);
      }
      
      // Apply a slight speed increase on paddle hits (5%)
      const newSpeed = speed * 1.05;
      
      // Set the new velocity
      const newVelocity = new Phaser.Math.Vector2();
      newVelocity.setToPolar(newAngle, newSpeed);
      
      // Apply the new velocity to the ball
      ball.setVelocity(newVelocity.x, newVelocity.y);
      
      // Visual feedback - flash the paddle
      this.createPaddleHitEffect(paddle, scene);
    } catch (error) {
      console.error('Error in concave paddle collision handler:', error);
    }
  }
  
  /**
   * Calculate angle factor based on impact position
   * Creates a more pronounced curve effect for the concave paddle
   */
  private static calculateAngleFactor(impactPosition: number): number {
    // Square the impact position to create a more pronounced curve
    // This makes the center more flat and the edges more angled
    const sign = Math.sign(impactPosition);
    const magnitude = Math.pow(Math.abs(impactPosition), 1.5); // Exponent controls curve shape
    
    return sign * magnitude;
  }
  
  /**
   * Calculate reflection angle for horizontal paddles (top/bottom)
   */
  private static calculateHorizontalPaddleReflection(
    paddle: Phaser.Physics.Matter.Sprite,
    impactPosition: number,
    velocity: Phaser.Math.Vector2
  ): number {
    // Determine if this is a top or bottom paddle
    const isTopPaddle = paddle.getData('edge') === 'top';
    
    // Base angle - straight up or down depending on paddle position
    const baseAngle = isTopPaddle ? Math.PI / 2 : -Math.PI / 2;
    
    // Angle range - how much the ball can deviate from vertical
    const angleRange = Math.PI / 3; // 60 degrees total range
    
    // Calculate angle offset based on impact position
    const angleOffset = impactPosition * angleRange * this.calculateAngleFactor(impactPosition);
    
    // Return the final angle
    return baseAngle + angleOffset;
  }
  
  /**
   * Calculate reflection angle for vertical paddles (left/right)
   */
  private static calculateVerticalPaddleReflection(
    paddle: Phaser.Physics.Matter.Sprite,
    impactPosition: number,
    velocity: Phaser.Math.Vector2
  ): number {
    // Determine if this is a left or right paddle
    const isLeftPaddle = paddle.getData('edge') === 'left';
    
    // Base angle - straight left or right depending on paddle position
    const baseAngle = isLeftPaddle ? 0 : Math.PI;
    
    // Angle range - how much the ball can deviate from horizontal
    const angleRange = Math.PI / 3; // 60 degrees total range
    
    // Calculate angle offset based on impact position
    const angleOffset = impactPosition * angleRange * this.calculateAngleFactor(impactPosition);
    
    // Return the final angle
    return baseAngle + angleOffset;
  }
  
  /**
   * Create visual effects when a paddle is hit
   */
  private static createPaddleHitEffect(paddle: Phaser.Physics.Matter.Sprite, scene: Phaser.Scene): void {
    try {
      // Get original tint
      const originalTint = paddle.getData('originalTint') || 0x3355ff;
      
      // Flash the paddle white
      paddle.setTint(0xffffff);
      
      // Reset to original tint after a short delay
      scene.time.delayedCall(100, () => {
        paddle.setTint(originalTint);
      });
      
      // Create particles if ParticleManager is available
      const breakoutScene = scene.scene.get('BreakoutScene');
      if (breakoutScene && (breakoutScene as any).particleManager) {
        const particleManager = (breakoutScene as any).particleManager;
        
        if (particleManager && typeof particleManager.createBounceEffect === 'function') {
          // Create particles at the paddle position
          particleManager.createBounceEffect(paddle.x, paddle.y, originalTint);
        }
      }
    } catch (error) {
      console.warn('Error creating paddle hit effect:', error);
    }
  }
}

export default ConcavePaddleCollisionHandler;