import * as Phaser from 'phaser';

/**
 * Utility class for paddle physics calculations
 */
export class PaddlePhysics {
  /**
   * Calculate the deflection angle when a ball hits a paddle
   * This creates more realistic and controllable bounces
   * 
   * @param ball The ball that hit the paddle
   * @param paddle The paddle that was hit
   * @param hitPosition The position where the ball hit the paddle
   * @returns The new velocity vector for the ball
   */
  public static calculateBallDeflection(
    ball: Phaser.Physics.Matter.Sprite,
    paddle: Phaser.Physics.Matter.Sprite,
    hitPosition: { x: number, y: number }
  ): { x: number, y: number } {
    try {
      // Get paddle properties
      const isVertical = paddle.getData('isVertical');
      const isConcave = paddle.getData('isConcave');
      
      // Get current ball velocity and speed
      const ballVelocity = { x: ball.body.velocity.x, y: ball.body.velocity.y };
      const currentSpeed = Math.sqrt(ballVelocity.x * ballVelocity.x + ballVelocity.y * ballVelocity.y);
      
      // Calculate relative hit position (-1 to 1)
      let hitFactor;
      if (isVertical) {
        // For vertical paddles, use Y position
        const paddleTop = paddle.y - paddle.displayHeight / 2;
        const paddleBottom = paddle.y + paddle.displayHeight / 2;
        hitFactor = (hitPosition.y - paddleTop) / (paddleBottom - paddleTop) * 2 - 1;
      } else {
        // For horizontal paddles, use X position
        const paddleLeft = paddle.x - paddle.displayWidth / 2;
        const paddleRight = paddle.x + paddle.displayWidth / 2;
        hitFactor = (hitPosition.x - paddleLeft) / (paddleRight - paddleLeft) * 2 - 1;
      }
      
      // Clamp hit factor between -1 and 1
      hitFactor = Math.max(-1, Math.min(1, hitFactor));
      
      // Calculate base angle based on paddle orientation
      let baseAngle;
      if (isVertical) {
        // Vertical paddle: deflect horizontally
        baseAngle = hitFactor * Math.PI / 3; // +/- 60 degrees
        
        // Adjust direction based on which side of paddle was hit
        if ((paddle.x < ball.x && isConcave) || (paddle.x > ball.x && !isConcave)) {
          baseAngle = Math.PI - baseAngle; // Reflect for right paddle
        }
      } else {
        // Horizontal paddle: deflect vertically
        baseAngle = hitFactor * Math.PI / 3; // +/- 60 degrees
        
        // Adjust direction based on which side of paddle was hit
        if ((paddle.y < ball.y && isConcave) || (paddle.y > ball.y && !isConcave)) {
          baseAngle = -baseAngle; // Reflect for bottom paddle
        } else {
          baseAngle = Math.PI - baseAngle; // Top paddle
        }
      }
      
      // Calculate new velocity components
      const newVx = Math.cos(baseAngle) * currentSpeed;
      const newVy = Math.sin(baseAngle) * currentSpeed;
      
      // Return the new velocity vector
      return { x: newVx, y: newVy };
    } catch (error) {
      console.error('Error calculating ball deflection:', error);
      // Return the original velocity if there's an error
      return { x: ball.body.velocity.x, y: ball.body.velocity.y };
    }
  }
  
  /**
   * Apply a visual effect to show the paddle's concave or convex shape
   * 
   * @param paddle The paddle to apply the effect to
   * @param scene The scene containing the paddle
   */
  public static applyPaddleShapeVisual(
    paddle: Phaser.Physics.Matter.Sprite,
    scene: Phaser.Scene
  ): void {
    try {
      // Get paddle properties
      const isVertical = paddle.getData('isVertical');
      const isConcave = paddle.getData('isConcave');
      
      // Create a graphics object to draw the shape overlay
      const graphics = scene.add.graphics();
      
      // Set style based on whether it's concave or convex
      if (isConcave) {
        graphics.lineStyle(2, 0x00ffff, 0.8); // Cyan for concave
      } else {
        graphics.lineStyle(2, 0xff00ff, 0.8); // Magenta for convex
      }
      
      // Draw the curve
      const width = paddle.displayWidth;
      const height = paddle.displayHeight;
      
      if (isVertical) {
        // Vertical paddle
        const x = paddle.x - width / 2;
        const y = paddle.y - height / 2;
        const curveFactor = width * 0.3;
        
        graphics.beginPath();
        graphics.moveTo(x, y);
        
        if (isConcave) {
          // Concave curve (inward)
          graphics.lineTo(x, y + height);
          graphics.moveTo(x + width, y);
          graphics.lineTo(x + width, y + height);
          
          // Draw the curve
          graphics.moveTo(x, y);
          for (let i = 0; i <= 10; i++) {
            const progress = i / 10;
            const curveX = x + width / 2 + Math.sin(progress * Math.PI) * curveFactor;
            const curveY = y + progress * height;
            graphics.lineTo(curveX, curveY);
          }
        } else {
          // Convex curve (outward)
          graphics.lineTo(x, y + height);
          graphics.moveTo(x + width, y);
          graphics.lineTo(x + width, y + height);
          
          // Draw the curve
          graphics.moveTo(x, y);
          for (let i = 0; i <= 10; i++) {
            const progress = i / 10;
            const curveX = x + width / 2 - Math.sin(progress * Math.PI) * curveFactor;
            const curveY = y + progress * height;
            graphics.lineTo(curveX, curveY);
          }
        }
        
        graphics.strokePath();
      } else {
        // Horizontal paddle
        const x = paddle.x - width / 2;
        const y = paddle.y - height / 2;
        const curveFactor = height * 0.3;
        
        graphics.beginPath();
        graphics.moveTo(x, y);
        
        if (isConcave) {
          // Concave curve (inward)
          graphics.lineTo(x + width, y);
          graphics.moveTo(x, y + height);
          graphics.lineTo(x + width, y + height);
          
          // Draw the curve
          graphics.moveTo(x, y);
          for (let i = 0; i <= 10; i++) {
            const progress = i / 10;
            const curveX = x + progress * width;
            const curveY = y + height / 2 + Math.sin(progress * Math.PI) * curveFactor;
            graphics.lineTo(curveX, curveY);
          }
        } else {
          // Convex curve (outward)
          graphics.lineTo(x + width, y);
          graphics.moveTo(x, y + height);
          graphics.lineTo(x + width, y + height);
          
          // Draw the curve
          graphics.moveTo(x, y);
          for (let i = 0; i <= 10; i++) {
            const progress = i / 10;
            const curveX = x + progress * width;
            const curveY = y + height / 2 - Math.sin(progress * Math.PI) * curveFactor;
            graphics.lineTo(curveX, curveY);
          }
        }
        
        graphics.strokePath();
      }
      
      // Store the graphics object with the paddle for later cleanup
      paddle.setData('shapeVisual', graphics);
      
    } catch (error) {
      console.error('Error applying paddle shape visual:', error);
    }
  }
  
  /**
   * Remove the visual effect from a paddle
   * 
   * @param paddle The paddle to remove the effect from
   */
  public static removePaddleShapeVisual(paddle: Phaser.Physics.Matter.Sprite): void {
    try {
      const graphics = paddle.getData('shapeVisual') as Phaser.GameObjects.Graphics;
      if (graphics) {
        graphics.destroy();
        paddle.setData('shapeVisual', null);
      }
    } catch (error) {
      console.error('Error removing paddle shape visual:', error);
    }
  }
}

export default PaddlePhysics;