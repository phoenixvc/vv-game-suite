import * as Phaser from 'phaser';
import { Paddle, PaddleOptions } from './Paddle';

export class ConcavePaddle extends Paddle {
  constructor(opts: PaddleOptions) {
    super(opts);
    
    // Apply concave shape
    this.applyConcaveShape();
    
    // Set data for identification
    this.setData('paddleType', 'concave');
    
    // Set special property for concave paddle - better control
    this.setData('controlFactor', 1.5); // 50% better ball control
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
    
    // Fill with gradient - blue colors for concave paddle
    const gradientSteps = 5;
    for (let i = 0; i < gradientSteps; i++) {
      const ratio = i / gradientSteps;
      
      // Fix: Use proper Phaser.Display.Color objects instead of plain objects
      const color1 = new Phaser.Display.Color(0, 120, 255);
      const color2 = new Phaser.Display.Color(0, 80, 200);
      
      const color = Phaser.Display.Color.Interpolate.ColorWithColor(
        color1,
        color2,
        gradientSteps,
        i
      );
      
      const fillColor = Phaser.Display.Color.GetColor(color.r, color.g, color.b);
      graphics.fillStyle(fillColor);
      
      // Draw concave shape with progressively smaller height
      const depthRatio = 0.2; // Maximum depth of the concave curve
      const currentHeight = height - (ratio * height * depthRatio);
      const yOffset = (height - currentHeight) / 2;
      
      // Draw a rounded rectangle with progressively deeper concave top
      const cornerRadius = height / 3;
      
      // Draw the main body
      graphics.fillRoundedRect(0, yOffset, width, currentHeight, cornerRadius);
      
      // Draw the concave top curve
      const curveDepth = height * depthRatio * (1 - ratio);
      if (curveDepth > 0) {
        graphics.fillStyle(fillColor);
        graphics.beginPath();
        
        // Start at left corner
        graphics.moveTo(cornerRadius, yOffset);
        
        // Draw the concave curve
        for (let x = 0; x <= width; x++) {
          const normalizedX = x / width;
          // Use sin function to create a smooth curve
          const curveY = yOffset - curveDepth * Math.sin(Math.PI * normalizedX);
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
    
    // Add glow lines on the concave surface
    graphics.lineStyle(1, 0x00ffff, 0.5);
    graphics.beginPath();
    graphics.moveTo(width * 0.2, height * 0.3);
    graphics.lineTo(width * 0.8, height * 0.3);
    graphics.strokePath();
    
    // Add "CONTROL" text to make it visually distinct
    graphics.lineStyle(1, 0x00ffff, 0.8);
    
    // Add a second glow line
    graphics.lineStyle(1, 0x00aaff, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.15, height * 0.4);
    graphics.lineTo(width * 0.85, height * 0.4);
    graphics.strokePath();
    
    // Add a third glow line
    graphics.lineStyle(1, 0x0088ff, 0.6);
    graphics.beginPath();
    graphics.moveTo(width * 0.1, height * 0.5);
    graphics.lineTo(width * 0.9, height * 0.5);
    graphics.strokePath();
    
    // Add control indicators at the edges
    graphics.fillStyle(0x00aaff, 0.7);
    graphics.fillCircle(width * 0.2, height * 0.85, height * 0.08);
    graphics.fillCircle(width * 0.8, height * 0.85, height * 0.08);
    
    // Generate the texture
    graphics.generateTexture(textureName, width, height);
    graphics.destroy();
    
    // Apply the texture
    this.setTexture(textureName);
    
    // Add a glow effect
    try {
      if (this.postFX) {
        this.postFX.addGlow(0x0088ff, 2, 0, false, 0.1, 8);
      }
    } catch (error) {
      console.warn('Failed to add glow effect to concave paddle:', error);
    }
  }
  
  /**
   * Calculate bounce angle based on where the ball hits the paddle
   * Concave paddles redirect the ball toward the center
   */
  calculateBounceAngle(ballX: number): number {
    // Get the relative position of the ball on the paddle (-1 to 1)
    const relativePos = (ballX - this.x) / (this.width / 2);
    
    // Base angle (in radians)
    const baseAngle = -Math.PI / 2; // Straight up
    
    // For concave paddle, we want to redirect more toward the center
    // The closer to the center, the more vertical the bounce
    const maxAngleOffset = Math.PI / 4; // 45 degrees max
    
    // Use a cubic function to create stronger redirection from the sides
    const angleOffset = maxAngleOffset * Math.pow(relativePos, 3);
    
    return baseAngle + angleOffset;
}
  
  /**
   * Override the onBallHit method to provide better control
   * This is the special ability of the concave paddle
   */
  public onBallHit(ball: Phaser.Physics.Arcade.Body): void {
    // Call the parent method first
    super.onBallHit(ball);
    
    // Get the control factor
    const controlFactor = this.getData('controlFactor') || 1.5;
    
    // Calculate the relative position on the paddle (-1 to 1)
    const relativePos = (ball.x - this.x) / (this.width / 2);
    
    // Calculate how close to the center the hit was (0 = center, 1 = edge)
    const centerProximity = Math.abs(relativePos);
    
    // If hit is close to center, reduce horizontal velocity for more control
    if (centerProximity < 0.5) {
      // Reduce horizontal velocity more when closer to center
      const reductionFactor = 1 - ((0.5 - centerProximity) * controlFactor);
      ball.velocity.x *= reductionFactor;
      
      // Ensure minimum horizontal velocity to prevent straight up shots
      const minHorizontalVelocity = 20;
      if (Math.abs(ball.velocity.x) < minHorizontalVelocity) {
        ball.velocity.x = Math.sign(ball.velocity.x) * minHorizontalVelocity;
      }
      
      // Visual feedback for control
      this.showControlEffect(ball);
    }
    
    // Emit an event that the ball control was applied
    const eventManager = this.scene.events;
    eventManager.emit('ballControlApplied', { 
      ball, 
      controlFactor,
      centerProximity
    });
  }
  
  /**
   * Show visual effect when control is applied
   */
  private showControlEffect(ball: Phaser.Physics.Arcade.Body): void {
    try {
      // Create a particle emitter for control effect
      const particles = this.scene.add.particles(ball.x, ball.y, 'particle', {
        speed: { min: 30, max: 60 },
        angle: { min: -150, max: -30 },
        scale: { start: 0.4, end: 0 },
        blendMode: 'ADD',
        lifespan: 300,
        tint: [0x0088ff, 0x00aaff, 0x00ffff],
        quantity: 8
      });
      
      // Follow the ball briefly
      this.scene.time.delayedCall(300, () => {
        particles.destroy();
      });
      
      // Pulse the paddle briefly
      this.scene.tweens.add({
        targets: this,
        alpha: 0.8,
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
      console.warn('Failed to create control effect:', error);
    }
  }
}