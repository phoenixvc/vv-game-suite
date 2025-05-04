import { PowerUpType } from '../types/PowerUp';

export interface PowerUpConfig {
  x: number;
  y: number;
  type: PowerUpType | string;
  texture?: string;
  duration?: number;
  velocity?: { x?: number; y?: number };
}

export class PowerUp extends Phaser.Physics.Matter.Image {
  private powerUpType: PowerUpType | string;
  private powerUpDuration: number;
  
  constructor(scene: Phaser.Scene, config: PowerUpConfig) {
    // Make sure we have a valid scene and config
    if (!scene || !config) {
      console.error('[PowerUp] Invalid scene or config provided');
      // Call super with minimal valid parameters to avoid constructor errors
      super(scene.matter.world, 0, 0, '');
      this.powerUpType = '';
      this.powerUpDuration = 0;
      return;
    }
    
    const texture = config.texture || `powerup_${config.type}`;
    
    // Use Matter.js physics for the power-up
    super(scene.matter.world, config.x, config.y, texture);
    
    this.powerUpType = config.type;
    this.powerUpDuration = config.duration || 10000; // Default 10 seconds
    
    try {
      // Add to scene
      scene.add.existing(this);
      
      // Set the origin to center (fixes the 0,0 origin issue)
      this.setOrigin(0.5, 0.5);
      
      // Store data in the game object
      this.setData('type', this.powerUpType);
      this.setData('duration', this.powerUpDuration);
      
      // Configure Matter.js physics body
      this.setCircle(this.width / 2);
      this.setBounce(0.8);
      this.setFriction(0, 0);
      
      // Set velocity using Matter.js
      const velocity = config.velocity || { y: 2 };
      this.setVelocity(velocity.x || 0, velocity.y || 2);
      
      // Log the position and origin for debugging
      console.log(`PowerUp created at (${this.x}, ${this.y}) with origin (${this.originX}, ${this.originY})`);
      
      // Add visual effects
      this.addVisualEffects();
    } catch (error) {
      console.error('[PowerUp] Error initializing power-up:', error);
    }
  }
  
  public getType(): PowerUpType | string {
    return this.powerUpType;
  }
  
  public getDuration(): number {
    return this.powerUpDuration;
  }
  
  private addVisualEffects(): void {
    try {
      // Safety check for scene
      if (!this.scene || !this.scene.tweens || !this.scene.tweens.add) {
        return;
      }
      
      // Add a pulsating effect
      this.scene.tweens.add({
        targets: this,
        scale: { from: 0.9, to: 1.1 },
        duration: 800,
        yoyo: true,
        repeat: -1
      });
      
      // Add a slight rotation
      this.scene.tweens.add({
        targets: this,
        angle: { from: -5, to: 5 },
        duration: 1200,
        yoyo: true,
        repeat: -1
      });
      
      // Add a glow effect based on type
      this.setAlpha(0.9);
      
      // Apply tint based on power-up type
      this.applyTintByType();
    } catch (error) {
      console.error('[PowerUp] Error adding visual effects:', error);
    }
  }
  
  private applyTintByType(): void {
    try {
      switch (this.powerUpType) {
        case PowerUpType.EXTRA_LIFE:
        case 'extraLife':
          this.setTint(0x10B981); // Green
          break;
        case PowerUpType.PADDLE_GROW:
        case 'paddleGrow':
          this.setTint(0x3B82F6); // Blue
          break;
        case PowerUpType.PADDLE_SHRINK:
        case 'paddleShrink':
          this.setTint(0xEF4444); // Red
          break;
        case PowerUpType.SHIELD:
        case 'shield':
          this.setTint(0x61AEEE); // Light blue
          break;
        case PowerUpType.MULTI_BALL:
        case 'multiBall':
          this.setTint(0xF59E0B); // Amber
          break;
        case PowerUpType.SCORE_MULTIPLIER:
        case 'scoreMultiplier':
          this.setTint(0x8B5CF6); // Purple
          break;
        default:
          // Default tint - white
          break;
      }
    } catch (error) {
      console.error('[PowerUp] Error applying tint:', error);
    }
  }
}