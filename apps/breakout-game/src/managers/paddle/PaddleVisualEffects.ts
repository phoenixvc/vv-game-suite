import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Handles the visual effects for paddles
 */
export class PaddleVisualEffects {
  private scene: BreakoutScene;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }

  /**
   * Apply visual effects to make the paddle look appropriate (convex or concave)
   */
  applyPaddleVisualEffects(paddle: Phaser.Physics.Matter.Sprite): void {
    try {
      const isVertical = paddle.getData('isVertical');
      const edge = paddle.getData('edge');
      const isConcave = paddle.getData('isConcave');
      
      // Set a base tint color based on the edge
      let tintColor = 0x3355ff; // Default blue
      
      switch (edge) {
        case 'bottom':
          tintColor = 0x3355ff; // Blue
          break;
        case 'top':
          tintColor = 0xff5533; // Red
          break;
        case 'left':
          tintColor = 0x33ff55; // Green
          break;
        case 'right':
          tintColor = 0xffff33; // Yellow
          break;
      }
      
      // Apply the tint
      paddle.setTint(tintColor);
      
      // Store original tint for later use
      paddle.setData('originalTint', tintColor);
      
      // Create a visual effect using a graphics object
      const graphics = this.scene.add.graphics();
      
      // Draw an appropriate shape
      const width = Math.ceil(paddle.displayWidth);
      const height = Math.ceil(paddle.displayHeight);
      
      // Use a texture key specific to this paddle
      const shapeType = isConcave ? 'concave' : 'convex';
      const textureKey = `${shapeType}_paddle_${edge}_${width}x${height}`;
      
      // Only create the texture if it doesn't exist
      if (!this.scene.textures.exists(textureKey)) {
        // Clear any previous drawing
        graphics.clear();
        
        // Set fill style
        graphics.fillStyle(tintColor, 1);
        
        // Calculate curve bulge (15% of width/height for better visibility)
        const bulgeAmount = isVertical ? height * 0.15 : width * 0.15;
        
        if (isVertical) {
          this.drawVerticalPaddle(graphics, edge, width, height, bulgeAmount, isConcave);
        } else {
          this.drawHorizontalPaddle(graphics, edge, width, height, bulgeAmount, isConcave);
        }
        
        // Add a shadow effect to enhance the 3D appearance
        this.addShadowEffect(graphics, edge, width, height, isVertical);
        
        // Generate the texture
        graphics.generateTexture(textureKey, width, height);
        
        // Clear the graphics object
        graphics.clear();
      }
      
      // Apply the texture to the paddle
      paddle.setTexture(textureKey);
      
      // Add a glow effect if postFX is available
      if (paddle.postFX) {
        paddle.postFX.addGlow(tintColor, 4, 0, false, 0.1, 16);
      }
    } catch (error) {
      console.warn('Error applying paddle visual effects:', error);
    }
  }

  /**
   * Create a visual effect to show ball spin
   * @param ball The ball sprite
   * @param color The color of the spin effect
   * @param spinAmount The amount of spin (affects the visual intensity)
   */
  createSpinEffect(ball: Phaser.Physics.Matter.Sprite, color: number, spinAmount: number): void {
    try {
      // Create a particle emitter for the spin effect
      const particles = this.scene.add.particles(ball.x, ball.y, 'particle', {
        speed: { min: 20, max: 50 },
        angle: { min: 0, max: 360 },
        scale: { start: 0.5, end: 0 },
        blendMode: 'ADD',
        lifespan: 200,
        tint: color,
        quantity: Math.min(Math.ceil(spinAmount * 2), 5), // 1-5 particles based on spin amount
        follow: ball,
        followOffset: { x: 0, y: 0 },
        emitting: false
      });
      
      // Create a one-time burst effect
      particles.explode(Math.min(Math.ceil(spinAmount * 5), 10), ball.x, ball.y);
      
      // Auto-destroy the emitter after the effect completes
      this.scene.time.delayedCall(300, () => {
        particles.destroy();
      });
      
      // Add a temporary glow effect to the ball if postFX is available
      if (ball.postFX) {
        const glowEffect = ball.postFX.addGlow(color, 4, 0, false, 0.5);
        
        // Remove the glow effect after a short time
        this.scene.time.delayedCall(300, () => {
          if (ball.postFX && glowEffect) {
            ball.postFX.remove(glowEffect);
          }
        });
      }
      
      // Add a small trail effect based on the ball's direction
      const velocity = {
        x: ball.body.velocity.x,
        y: ball.body.velocity.y
      };
      
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      const normalizedVelocity = {
        x: velocity.x / speed,
        y: velocity.y / speed
      };
      
      // Create a small trail in the opposite direction of movement
      const trailParticles = this.scene.add.particles(ball.x, ball.y, 'particle', {
        speed: { min: 10, max: 30 },
        angle: {
          min: Math.atan2(-normalizedVelocity.y, -normalizedVelocity.x) * 180 / Math.PI - 15,
          max: Math.atan2(-normalizedVelocity.y, -normalizedVelocity.x) * 180 / Math.PI + 15
        },
        scale: { start: 0.4, end: 0 },
        blendMode: 'ADD',
        lifespan: 150,
        tint: color,
        quantity: 1,
        frequency: 20,
        follow: ball,
        followOffset: { x: 0, y: 0 },
        emitting: true
      });
      
      // Stop emitting and destroy after a short time
      this.scene.time.delayedCall(200, () => {
        trailParticles.stopFollow();
        trailParticles.emitting = false;
      });
      
      this.scene.time.delayedCall(400, () => {
        trailParticles.destroy();
      });
    } catch (error) {
      console.warn('Error creating spin effect:', error);
    }
  }

  /**
   * Draw a vertical paddle (left or right edge)
   */
  private drawVerticalPaddle(
    graphics: Phaser.GameObjects.Graphics,
    edge: string,
    width: number,
    height: number,
    bulgeAmount: number,
    isConcave: boolean
  ): void {
    if (edge === 'left') {
      if (isConcave) {
        // Concave on the right side
        // Draw the base rectangle
        graphics.fillRect(0, 0, width, height);
        
        // Cut out the concave part
        graphics.fillStyle(0x000000, 0);
        graphics.beginPath();
        graphics.moveTo(width - bulgeAmount, 0);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          // Concave curve formula: x = width - bulgeAmount * (1 - 4 * (t - 0.5)²)
          const x = width - bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(width, height);
        graphics.lineTo(width, 0);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to concave edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          const x = width - bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      } else {
        // Convex on the right side
        // Draw the base rectangle
        graphics.fillRect(0, 0, width - bulgeAmount, height);
        
        // Draw the bulging part
        graphics.beginPath();
        graphics.moveTo(width - bulgeAmount, 0);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          // Convex curve formula: x = (width - bulgeAmount) + bulgeAmount * (1 - 4 * (t - 0.5)²)
          // This creates a bulge outward in the middle
          const x = (width - bulgeAmount) + bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(width - bulgeAmount, height);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to convex edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          const x = (width - bulgeAmount) + bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      }
    } else {
      // Right paddle
      if (isConcave) {
        // Concave on the left side
        // Draw the base rectangle
        graphics.fillRect(0, 0, width, height);
        
        // Cut out the concave part
        graphics.fillStyle(0x000000, 0);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(bulgeAmount, 0);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          // Concave curve formula: x = bulgeAmount * (1 - 4 * (t - 0.5)²)
          const x = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(0, height);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to concave edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          const x = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      } else {
        // Convex on the left side
        // Draw the base rectangle
        graphics.fillRect(bulgeAmount, 0, width - bulgeAmount, height);
        
        // Draw the bulging part
        graphics.beginPath();
        graphics.moveTo(bulgeAmount, 0);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          // Convex curve formula: x = bulgeAmount * (1 - 4 * (t - 0.5)²)
          // This creates a bulge outward in the middle
          const x = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(bulgeAmount, height);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to convex edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const y = height * t;
          const x = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      }
    }
  }

  /**
   * Draw a horizontal paddle (top or bottom edge)
   */
  private drawHorizontalPaddle(
    graphics: Phaser.GameObjects.Graphics,
    edge: string,
    width: number,
    height: number,
    bulgeAmount: number,
    isConcave: boolean
  ): void {
    if (edge === 'bottom') {
      if (isConcave) {
        // Concave on the top side
        // Draw the base rectangle
        graphics.fillRect(0, 0, width, height);
        
        // Cut out the concave part
        graphics.fillStyle(0x000000, 0);
        graphics.beginPath();
        graphics.moveTo(0, 0);
        graphics.lineTo(0, bulgeAmount);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          // Concave curve formula: y = bulgeAmount * (1 - 4 * (t - 0.5)²)
          const y = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(width, 0);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to concave edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          const y = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      } else {
        // Convex on the top side
        // Draw the base rectangle
        graphics.fillRect(0, bulgeAmount, width, height - bulgeAmount);
        
        // Draw the bulging part
        graphics.beginPath();
        graphics.moveTo(0, bulgeAmount);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          // Convex curve formula: y = bulgeAmount * (1 - 4 * (t - 0.5)²)
          // This creates a bulge outward in the middle
          const y = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(width, bulgeAmount);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to convex edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          const y = bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      }
    } else {
      // Top paddle
      if (isConcave) {
        // Concave on the bottom side
        // Draw the base rectangle
        graphics.fillRect(0, 0, width, height);
        
        // Cut out the concave part
        graphics.fillStyle(0x000000, 0);
        graphics.beginPath();
        graphics.moveTo(0, height);
        graphics.lineTo(0, height - bulgeAmount);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          // Concave curve formula: y = height - bulgeAmount * (1 - 4 * (t - 0.5)²)
          const y = height - bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(width, height);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to concave edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          const y = height - bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      } else {
        // Convex on the bottom side
        // Draw the base rectangle
        graphics.fillRect(0, 0, width, height - bulgeAmount);
        
        // Draw the bulging part
        graphics.beginPath();
        graphics.moveTo(0, height - bulgeAmount);
        
        // Draw curve points
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          // Convex curve formula: y = (height - bulgeAmount) + bulgeAmount * (1 - 4 * (t - 0.5)²)
          // This creates a bulge outward in the middle
          const y = (height - bulgeAmount) + bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          graphics.lineTo(x, y);
        }
        
        graphics.lineTo(width, height - bulgeAmount);
        graphics.closePath();
        graphics.fillPath();
        
        // Add highlight to convex edge
        graphics.lineStyle(2, 0xffffff, 0.7);
        graphics.beginPath();
        for (let i = 0; i <= 20; i++) {
          const t = i / 20;
          const x = width * t;
          const y = (height - bulgeAmount) + bulgeAmount * (1 - 4 * Math.pow(t - 0.5, 2));
          if (i === 0) {
            graphics.moveTo(x, y);
          } else {
            graphics.lineTo(x, y);
          }
        }
        graphics.strokePath();
      }
    }
  }

 private addShadowEffect(
   graphics: Phaser.GameObjects.Graphics,
   edge: string,
   width: number,
   height: number,
   isVertical: boolean
 ): void {
   graphics.fillStyle(0x000000, 0.3);
   if (isVertical) {
     if (edge === 'left') {
       graphics.fillRect(0, 0, width * 0.2, height);
     } else {
       graphics.fillRect(width * 0.8, 0, width * 0.2, height);
     }
   } else {
     if (edge === 'bottom') {
       graphics.fillRect(0, height * 0.8, width, height * 0.2);
     } else {
       graphics.fillRect(0, 0, width, height * 0.2);
     }
   }
 }
}

export default PaddleVisualEffects;