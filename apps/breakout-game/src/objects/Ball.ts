import * as Phaser from 'phaser';

export class Ball extends Phaser.Physics.Matter.Sprite {
  private ballTexture: string;
  private glowEffect?: Phaser.FX.Glow;
  
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string = 'ball') {
    super(scene.matter.world, x, y, texture);
    
    // Store the texture name
    this.ballTexture = texture;
    
    // Add to scene
    scene.add.existing(this);
    
    // Configure physics body
    this.setCircle(this.width / 2);
    this.setBounce(1);
    this.setFriction(0, 0);
    
    // Reduce air friction to almost zero
    this.setFrictionAir(0.0005);
    
    // Set data property
    this.setData('isBall', true);
    this.setData('consecutiveHits', 0);
    
    // Set label for collision detection
    if (this.body) {
      (this.body as MatterJS.BodyType).label = 'ball';
    }
    
    // Apply a texture if not already textured
    this.applyBallTexture();
    
    // Add rotation for visual effect
    this.scene.events.on('update', this.updateRotation, this);
    
    // Try to add glow effect
    try {
      if (this.postFX) {
        this.glowEffect = this.postFX.addGlow(0xffffff, 0.5, 0, false, 0.1, 16);
      }
    } catch (error) {
      console.warn('Failed to add glow effect to ball:', error);
    }
  }
  
  /**
   * Apply a texture to the ball
   */
  applyBallTexture() {
    // If we're using the default ball texture, create a more interesting one
    if (this.ballTexture === 'ball') {
      // Get a reference to the scene
      const scene = this.scene;
      
      // Create a unique texture name for this ball
      const textureName = `ball_textured_${Date.now()}`;
      
      // Create an SVG-like texture for the ball
      const graphics = scene.add.graphics();
      
      // Draw the ball texture - a circle with some details
      graphics.clear();
      
      // Outer circle (main ball)
      graphics.fillStyle(0xffffff);
      graphics.fillCircle(16, 16, 15);
      
      // Inner gradient effect - create multiple circles with decreasing sizes
      const gradientColors = [0xf0f0f0, 0xe8e8e8, 0xe0e0e0, 0xd8d8d8];
      const gradientSizes = [13, 10, 8, 6];
      
      for (let i = 0; i < gradientColors.length; i++) {
        graphics.fillStyle(gradientColors[i]);
        graphics.fillCircle(16, 16, gradientSizes[i]);
      }
      
      // Add curved lines for tennis ball look
      graphics.lineStyle(1.5, 0xcccccc, 0.8);
      
      // Top curve
      graphics.beginPath();
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = 5 + 22 * t;
        const y = 16 - 11 * Math.sin(Math.PI * t);
        if (i === 0) {
          graphics.moveTo(x, y);
        } else {
          graphics.lineTo(x, y);
        }
      }
      graphics.strokePath();
      
      // Bottom curve
      graphics.beginPath();
      for (let i = 0; i <= 10; i++) {
        const t = i / 10;
        const x = 5 + 22 * t;
        const y = 16 + 11 * Math.sin(Math.PI * t);
        if (i === 0) {
          graphics.moveTo(x, y);
        } else {
          graphics.lineTo(x, y);
        }
      }
      graphics.strokePath();
      
      // Add colored quadrants for better rotation visibility
      
      // Top-right quadrant (blue)
      graphics.fillStyle(0x3388ff, 0.2);
      graphics.beginPath();
      graphics.moveTo(16, 16);
      graphics.arc(16, 16, 13, -Math.PI/2, 0);
      graphics.lineTo(16, 16);
      graphics.fillPath();
      
      // Bottom-right quadrant (orange)
      graphics.fillStyle(0xff8833, 0.2);
      graphics.beginPath();
      graphics.moveTo(16, 16);
      graphics.arc(16, 16, 13, 0, Math.PI/2);
      graphics.lineTo(16, 16);
      graphics.fillPath();
      
      // Add dots for even more visible rotation
      graphics.fillStyle(0x333333, 0.5);
      graphics.fillCircle(22, 10, 1.5);   // Top right dot
      graphics.fillCircle(10, 22, 1.5);   // Bottom left dot
      
      // Add highlight for 3D effect
      graphics.fillStyle(0xffffff, 0.8);
      graphics.fillCircle(11, 11, 5);
      graphics.fillStyle(0xffffff, 0.9);
      graphics.fillCircle(9, 9, 2);
      
      // Generate a texture from the graphics object
      graphics.generateTexture(textureName, 32, 32);
      
      // Clean up the graphics object
      graphics.destroy();
      
      // Apply the new texture to the ball
      this.setTexture(textureName);
      
      // Store the texture name
      this.ballTexture = textureName;
    }
  }
  
  /**
   * Update the ball's rotation based on its velocity
   */
  updateRotation() {
    if (this.body && this.body.velocity) {
      const velocity = this.body.velocity;
      const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
      
      // Rotate based on direction and speed
      const direction = Math.atan2(velocity.y, velocity.x);
      
      // Adjust rotation speed based on ball speed, but make it more noticeable
      const rotationSpeed = 0.08 * (speed / 5);
      
      // Add a small random variation to make rotation look more natural
      const randomFactor = 1 + (Math.random() * 0.1 - 0.05); // ±5% variation
      
      this.rotation += rotationSpeed * randomFactor;
      
      // Update glow intensity based on speed
      if (this.glowEffect && speed > 5) {
        const normalizedSpeed = Math.min(speed / 20, 1); // Normalize speed to 0-1
        this.glowEffect.outerStrength = 1 + normalizedSpeed * 2;
        
        // Change glow color based on speed
        if (speed > 15) {
          this.glowEffect.color = 0xffff00; // Yellow at high speed
        } else if (speed > 10) {
          this.glowEffect.color = 0xff8800; // Orange at medium-high speed
        } else {
          this.glowEffect.color = 0xffffff; // White at normal speed
        }
      }
      
      // Optional: Add a small wobble effect for high speeds
      if (speed > 10) {
        const wobbleAmount = 0.01 * Math.sin(this.scene.time.now / 50);
        this.setScale(1 + wobbleAmount, 1 - wobbleAmount);
      } else {
        this.setScale(1, 1); // Reset scale for normal speeds
      }
    }
  }

  /**
   * Launch the ball with an initial velocity
   */
  launch(initialVelocity: Phaser.Math.Vector2) {
    this.setVelocity(initialVelocity.x, initialVelocity.y);
    
    // Reset consecutive hits when launching
    this.setData('consecutiveHits', 0);
    this.emitHitCounterUpdate();
    
    // Add a launch effect
    this.scene.tweens.add({
      targets: this,
      scale: { from: 0.7, to: 1 },
      alpha: { from: 0.7, to: 1 },
      duration: 200,
      ease: 'Back.easeOut'
    });
  }

  /**
   * Reset the ball to a paddle position
   */
  resetToPaddle(paddle: Phaser.Physics.Matter.Sprite) {
    this.setPosition(paddle.x, paddle.y - paddle.height);
    this.setVelocity(0, 0);
    
    // Reset consecutive hits when resetting
    this.setData('consecutiveHits', 0);
    this.emitHitCounterUpdate();
    
    // Reset rotation and scale
    this.rotation = 0;
    this.setScale(1, 1);
  }

  /**
   * Increment the consecutive hit counter
   */
  incrementHitCounter() {
    const currentHits = this.getData('consecutiveHits') || 0;
    this.setData('consecutiveHits', currentHits + 1);
    this.emitHitCounterUpdate();
    
    // Visual feedback for hits - more dynamic effect
    this.scene.tweens.add({
      targets: this,
      scale: { from: 1.3, to: 1 },
      duration: 150,
      ease: 'Bounce.easeOut'
    });
    
    // Add a flash effect
    const flashColor = currentHits > 5 ? 0xffff00 : 0xffffff; // Yellow for high combos
    this.setTintFill(flashColor);
    this.scene.time.delayedCall(50, () => {
      this.clearTint();
    });
  }
  
  /**
   * Reset the consecutive hit counter (e.g., when hitting a wall)
   */
  resetHitCounter() {
    this.setData('consecutiveHits', 0);
    this.emitHitCounterUpdate();
  }
  
  /**
   * Emit an event to update the hit counter in the HUD
   */
  emitHitCounterUpdate() {
    const eventManager = (this.scene as any).getEventManager?.();
    if (eventManager) {
      eventManager.emit('consecutiveHitUpdated', { 
        hits: this.getData('consecutiveHits') || 0 
      });
    }
  }

  /**
   * Apply a power-up effect to the ball
   */
  applyPowerUp(type: string) {
    switch (type) {
      case 'extraLife':
        // Implement extra life logic
        break;
      case 'paddleGrow':
        // Implement paddle grow logic
        break;
      // Add other power-up types here
    }
  }
  
  /**
   * Clean up resources when the ball is destroyed
   */
  destroy() {
    // Remove update listener
    this.scene.events.off('update', this.updateRotation, this);
    
    // Call parent destroy method
    super.destroy();
  }
}