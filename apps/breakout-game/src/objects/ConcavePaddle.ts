import * as Phaser from 'phaser';
import { Paddle, PaddleOptions } from './Paddle';

export class ConcavePaddle extends Paddle {
  constructor(opts: PaddleOptions) {
    super(opts);
    
    // Apply concave shape
    this.applyConcaveShape();
    
    // Set data for identification
    this.setData('paddleType', 'concave');
    this.setData('isConcave', true);
    this.setData('isConvex', false);
    
    // Set special property for concave paddle - ball control
    this.setData('ballControlFactor', 0.8); // Higher value means more control
  }
  
  /**
   * Apply a concave shape to the paddle
   */
  private applyConcaveShape() {
    // Get dimensions
    const width = this.width;
    const height = this.height;
    
    // Create a unique texture name for this paddle
    const textureName = `concave_paddle_${Date.now()}`;
    
    // Create a graphics object to draw the concave paddle
    const graphics = this.scene.add.graphics();
    
    // Draw the concave paddle shape
    graphics.clear();
    
    // Make the concave paddle visually different - use a curved inward shape
    // and a blue/cyan color scheme
    
    // Fill with gradient - blue/cyan for concave paddle
    const gradientSteps = 5;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      
      // Use blue/cyan colors for concave paddle
      const color1 = new Phaser.Display.Color(0, 180, 255);  // Light blue
      const color2 = new Phaser.Display.Color(0, 100, 180);  // Darker blue
      
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        color1,
        color2,
        gradientSteps,
        i
      );
      
      const fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
      graphics.fillStyle(fillColor);
      
      // Draw concave shape with a curve inward
      const heightRatio = 0.35; // How deep the concave curve goes
      const currentHeight = height - (ratio * height * heightRatio);
      const yOffset = (height - currentHeight) / 2;
      
      // Draw a rounded rectangle with progressively deeper concave top
      const cornerRadius = height / 3;
      
      // Draw the main body
      graphics.fillRoundedRect(0, yOffset, width, currentHeight, cornerRadius);
      
      // Draw the concave top curve
      const curveHeight = height * heightRatio * (1 - ratio);
      if (curveHeight > 0) {
        graphics.fillStyle(fillColor);
        graphics.beginPath();
        
        // Start at left corner
        graphics.moveTo(cornerRadius, yOffset);
        
        // Draw the concave curve - use a sine curve but inverted
        for (let x = 0; x <= width; x++) {
          const normalizedX = x / width;
          // Use inverted sin function to create concave curve
          const curveY = yOffset + curveHeight * Math.pow(Math.sin(Math.PI * normalizedX), 0.8);
          graphics.lineTo(x, curveY);
        }
        
        // Complete the shape
        graphics.lineTo(width - cornerRadius, yOffset);
        graphics.lineTo(cornerRadius, yOffset);
        graphics.closePath();
        graphics.fillPath();
      }
    }
    
    // Add a highlight at the top for 3D effect
    graphics.fillStyle(0xffffff, 0.3);
    graphics.fillRect(width * 0.1, height * 0.1, width * 0.8, height * 0.2);
    
    // Add glow lines on the concave surface
    graphics.lineStyle(1, 0x00ccff, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.2, height * 0.3);
    graphics.lineTo(width * 0.8, height * 0.3);
    graphics.strokePath();
    
    // Add a second glow line
    graphics.lineStyle(1, 0x0088ff, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.15, height * 0.4);
    graphics.lineTo(width * 0.85, height * 0.4);
    graphics.strokePath();
    
    // Add a third glow line
    graphics.lineStyle(1, 0x0066ff, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.1, height * 0.5);
    graphics.lineTo(width * 0.9, height * 0.5);
    graphics.strokePath();
    
    // Generate the texture
    graphics.generateTexture(textureName, width, height);
    graphics.destroy();
    
    // Apply the texture
    this.setTexture(textureName);
    
    // Add a glow effect for the concave paddle
    try {
      if (this.postFX) {
        this.postFX.addGlow(0x00aaff, 4, 0, false, 0.2, 10);
      }
    } catch (error) {
      console.warn('Failed to add glow effect to concave paddle:', error);
    }
  }
  
  /**
   * Calculate bounce angle based on where the ball hits the paddle
   * Concave paddles redirect the ball toward the center
   */
  calculateBounceAngle(hitPosition: { x: number, y: number }): number {
    // Extract the x position from the hitPosition object
    const ballX = hitPosition.x;
    
    // Get the relative position of the ball on the paddle (-1 to 1)
    const relativePos = (ballX - this.x) / (this.width / 2);
    
    // Base angle (in radians)
    const baseAngle = -Math.PI / 2; // Straight up
    
    // For concave paddle, we want to redirect more toward the center
    // The further from the center, the more angled the bounce toward center
    const maxAngleOffset = Math.PI / 3; // 60 degrees max
    
    // Use a cubic function to push toward center
    // We use Math.sign to determine direction (left or right of center)
    const angleOffset = -maxAngleOffset * Math.sign(relativePos) * 
                        Math.pow(Math.abs(relativePos), 2);
    
    return baseAngle + angleOffset;
  }

  /**
   * Override the onBallHit method to provide better ball control
   * This is the special ability of the concave paddle
   */
  public onBallHit(ball: Phaser.Physics.Arcade.Body): void {
    // Call the parent method first
    super.onBallHit(ball);
    
    // Get the ball control factor
    const ballControlFactor = this.getData('ballControlFactor') || 0.8;
    
    // Apply more predictable trajectory for concave paddle
    // This simulates the ball being "guided" by the concave shape
    const currentVelocity = new Phaser.Math.Vector2(ball.velocity.x, ball.velocity.y);
    
    // Normalize the horizontal component based on the control factor
    // Higher control factor means more vertical and less horizontal movement
    if (Math.abs(currentVelocity.x) > 50) {
      // Reduce horizontal velocity component
      currentVelocity.x *= (1 - ballControlFactor * 0.5);
      
      // Ensure vertical component is strong enough
      if (Math.abs(currentVelocity.y) < 200) {
        // Boost vertical component
        currentVelocity.y = -Math.abs(currentVelocity.y) * 1.2;
      }
      
      // Apply the adjusted velocity
      ball.setVelocity(currentVelocity.x, currentVelocity.y);
    }
    
    // Visual feedback for ball control
    this.showBallControlEffect(ball);
    
    // Emit an event that the ball trajectory was controlled
    const eventManager = this.scene.events;
    eventManager.emit('ballTrajectoryControlled', { 
      ball, 
      controlFactor: ballControlFactor
    });
  }
  
  /**
   * Show visual effect when ball control is applied
   */
  private showBallControlEffect(ball: Phaser.Physics.Arcade.Body): void {
    // Create a particle emitter for control effect
    try {
      const particles = this.scene.add.particles(ball.x, ball.y, 'particle', {
        speed: { min: 50, max: 100 },
        angle: { min: 230, max: 310 },
        scale: { start: 0.4, end: 0 },
        blendMode: 'ADD',
        lifespan: 300,
        tint: [0x00aaff, 0x0088ff, 0x0066ff],
        quantity: 8
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
      const controlText = this.scene.add.text(
        ball.x, 
        ball.y - 20, 
        'CONTROL!', 
        { 
          fontFamily: 'Arial', 
          fontSize: '16px', 
          color: '#00aaff',
          stroke: '#000000',
          strokeThickness: 3
        }
      ).setOrigin(0.5);
      
      // Animate and remove the text
      this.scene.tweens.add({
        targets: controlText,
        y: controlText.y - 30,
        alpha: 0,
        duration: 800,
        onComplete: () => controlText.destroy()
      });
      
    } catch (error) {
      console.warn('Failed to create ball control effect:', error);
    }
  }
}