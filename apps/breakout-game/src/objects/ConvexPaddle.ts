import * as Phaser from 'phaser';
import { Paddle, PaddleOptions } from './Paddle';

export class ConvexPaddle extends Paddle {
  constructor(opts: PaddleOptions) {
    super(opts);
    
    // Apply convex shape
    this.applyConvexShape();
    
    // Set data for identification
    this.setData('paddleType', 'convex');
    this.setData('isConvex', true);
    this.setData('isConcave', false);
    
    // Set special property for convex paddle - speed boost on hit
    this.setData('speedBoostFactor', 1.15); // 15% speed increase per hit
  }
  
  /**
   * Apply a convex shape to the paddle
   */
  private applyConvexShape() {
    // Get dimensions
    const width = this.width;
    const height = this.height;
    
    // Create a unique texture name for this paddle
    const textureName = `convex_paddle_${Date.now()}`;
    
    // Create a graphics object to draw the convex paddle
    const graphics = this.scene.add.graphics();
    
    // Draw the convex paddle shape
    graphics.clear();
    
    // Make the convex paddle visually VERY different - use a more pronounced dome shape
    // and a completely different color scheme (red/orange instead of blue)
    
    // Fill with gradient - bright orange/red for convex paddle
    const gradientSteps = 5;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      
      // Use vibrant red-orange colors for convex paddle
      const color1 = new Phaser.Display.Color(255, 80, 0);  // Bright orange-red
      const color2 = new Phaser.Display.Color(220, 30, 0);  // Deep red
      
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        color1,
        color2,
        gradientSteps,
        i
      );
      
      const fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
      graphics.fillStyle(fillColor);
      
      // Draw convex shape with a much more pronounced dome
      const heightRatio = 0.35; // Increased from 0.2 to make dome more obvious
      const currentHeight = height - (ratio * height * heightRatio);
      const yOffset = (height - currentHeight) / 2;
      
      // Draw a rounded rectangle with progressively deeper convex top
      const cornerRadius = height / 3;
      
      // Draw the main body
      graphics.fillRoundedRect(0, yOffset, width, currentHeight, cornerRadius);
      
      // Draw the convex top curve - more pronounced dome shape
      const curveHeight = height * heightRatio * (1 - ratio);
      if (curveHeight > 0) {
        graphics.fillStyle(fillColor);
        graphics.beginPath();
        
        // Start at left corner
        graphics.moveTo(cornerRadius, yOffset);
        
        // Draw the convex curve - use a more pronounced sine curve
        for (let x = 0; x <= width; x++) {
          const normalizedX = x / width;
          // Use sin function with power to create a more pronounced dome
          const curveY = yOffset - curveHeight * Math.pow(Math.sin(Math.PI * normalizedX), 0.8);
          graphics.lineTo(x, curveY);
        }
        
        // Complete the shape
        graphics.lineTo(width - cornerRadius, yOffset);
        graphics.lineTo(cornerRadius, yOffset);
        graphics.closePath();
        graphics.fillPath();
      }
    }
    
    // Add a highlight at the bottom for 3D effect
    graphics.fillStyle(0xffffff, 0.3);
    graphics.fillRect(width * 0.1, height * 0.7, width * 0.8, height * 0.2);
    
    // Add multiple glow lines on the convex surface for a more distinct look
    graphics.lineStyle(1, 0xff8800, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.2, height * 0.3);
    graphics.lineTo(width * 0.8, height * 0.3);
    graphics.strokePath();
    
    // Add a second glow line
    graphics.lineStyle(1, 0xff5500, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.15, height * 0.4);
    graphics.lineTo(width * 0.85, height * 0.4);
    graphics.strokePath();
    
    // Add a third glow line
    graphics.lineStyle(1, 0xff3300, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.1, height * 0.5);
    graphics.lineTo(width * 0.9, height * 0.5);
    graphics.strokePath();
    
    // Add flame-like details at the edges for a more distinct look
    graphics.fillStyle(0xff3300, 0.7);
    graphics.beginPath();
    graphics.moveTo(width * 0.05, height * 0.3);
    graphics.lineTo(width * 0.15, height * 0.1);
    graphics.lineTo(width * 0.2, height * 0.3);
    graphics.closePath();
    graphics.fillPath();
    
    graphics.fillStyle(0xff3300, 0.7);
    graphics.beginPath();
    graphics.moveTo(width * 0.95, height * 0.3);
    graphics.lineTo(width * 0.85, height * 0.1);
    graphics.lineTo(width * 0.8, height * 0.3);
    graphics.closePath();
    graphics.fillPath();
    
    // Add speed boost indicators at the edges
    graphics.fillStyle(0xff3300, 0.7);
    graphics.fillCircle(width * 0.2, height * 0.85, height * 0.08);
    graphics.fillCircle(width * 0.8, height * 0.85, height * 0.08);
    
    // Generate the texture
    graphics.generateTexture(textureName, width, height);
    graphics.destroy();
    
    // Apply the texture
    this.setTexture(textureName);
          
    // Add a stronger glow effect for the convex paddle
    try {
      if (this.postFX) {
        this.postFX.addGlow(0xff3300, 4, 0, false, 0.2, 10); // Brighter, wider glow
      }
    } catch (error) {
      console.warn('Failed to add glow effect to convex paddle:', error);
    }
  }
  
  /**
   * Calculate bounce angle based on where the ball hits the paddle
   * Convex paddles redirect the ball away from the center
   */
  calculateBounceAngle(hitPosition: { x: number, y: number }): number {
    // Extract the x position from the hitPosition object
    const ballX = hitPosition.x;
    
    // Get the relative position of the ball on the paddle (-1 to 1)
    const relativePos = (ballX - this.x) / (this.width / 2);
    
    // Base angle (in radians)
    const baseAngle = -Math.PI / 2; // Straight up
    
    // For convex paddle, we want to redirect more away from the center
    // The closer to the center, the more angled the bounce
    const maxAngleOffset = Math.PI / 3; // 60 degrees max
    
    // Use a cubic function but with inverted sign to push away from center
    // We use Math.abs to make sure the ball always goes away from center
    const angleOffset = maxAngleOffset * Math.sign(relativePos) * 
                        (1 - Math.pow(Math.abs(relativePos) - 1, 2));
    
    return baseAngle + angleOffset;
  }

  /**
   * Override the onBallHit method to increase ball speed
   * This is the special ability of the convex paddle
   */
  public onBallHit(ball: Phaser.Physics.Arcade.Body): void {
    // Call the parent method first
    super.onBallHit(ball);
    
    // Get the speed boost factor
    const speedBoostFactor = this.getData('speedBoostFactor') || 1.15;
    
    // Increase ball speed
    const currentVelocity = new Phaser.Math.Vector2(ball.velocity.x, ball.velocity.y);
    const currentSpeed = currentVelocity.length();
    
    // Calculate new speed with boost
    let newSpeed = currentSpeed * speedBoostFactor;
    
    // Cap the speed at a maximum value to prevent it from getting too fast
    const maxSpeed = 600; // Maximum ball speed
    if (newSpeed > maxSpeed) {
      newSpeed = maxSpeed;
    }
    
    // Apply the new speed while maintaining direction
    currentVelocity.normalize().scale(newSpeed);
    ball.setVelocity(currentVelocity.x, currentVelocity.y);
    
    // Visual feedback for speed boost
    this.showSpeedBoostEffect(ball);
    
    // Emit an event that the ball speed was boosted
    const eventManager = this.scene.events;
    eventManager.emit('ballSpeedBoosted', { 
      ball, 
      speedFactor: speedBoostFactor,
      newSpeed 
    });
  }
  
  /**
   * Show visual effect when speed is boosted
   */
  private showSpeedBoostEffect(ball: Phaser.Physics.Arcade.Body): void {
    // Create a particle emitter for flame effect
    try {
      const particles = this.scene.add.particles(ball.x, ball.y, 'particle', {
        speed: { min: 50, max: 100 },
        angle: { min: -30, max: 30 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 300,
        tint: [0xff8800, 0xff4400, 0xff0000],
        quantity: 10
      });
      
      // Follow the ball briefly
      this.scene.time.delayedCall(300, () => {
        particles.destroy();
      });
      
      // Flash the paddle briefly
      this.scene.tweens.add({
        targets: this,
        alpha: 0.7,
        duration: 100,
        yoyo: true,
        repeat: 1
      });
      
      // Add a text indicator
      const boostText = this.scene.add.text(
        ball.x, 
        ball.y - 20, 
        'SPEED UP!', 
        { 
          fontFamily: 'Arial', 
          fontSize: '16px', 
          color: '#ff3300',
          stroke: '#000000',
          strokeThickness: 3
        }
      ).setOrigin(0.5);
      
      // Animate and remove the text
      this.scene.tweens.add({
        targets: boostText,
        y: boostText.y - 30,
        alpha: 0,
        duration: 800,
        onComplete: () => boostText.destroy()
      });
      
    } catch (error) {
      console.warn('Failed to create speed boost effect:', error);
    }
  }
}