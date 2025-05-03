import { PowerUpType } from '../types/PowerUp';

export interface PowerUpConfig {
  x: number;
  y: number;
  type: PowerUpType | string;
  texture?: string;
  duration?: number;
  velocity?: { x?: number; y?: number };
}

export class PowerUp extends Phaser.Physics.Arcade.Image {
  private powerUpType: PowerUpType | string;
  private powerUpDuration: number;
  
  constructor(scene: Phaser.Scene, config: PowerUpConfig) {
    const texture = config.texture || `powerup_${config.type}`;
    super(scene, config.x, config.y, texture);
    
    this.powerUpType = config.type;
    this.powerUpDuration = config.duration || 10000; // Default 10 seconds
    
    // Set up the power-up
    scene.add.existing(this);
    scene.physics.add.existing(this);
    
    // Store data in the game object
    this.setData('type', this.powerUpType);
    this.setData('duration', this.powerUpDuration);
    
    // Set velocity
    const velocity = config.velocity || { y: 150 };
    this.setVelocity(velocity.x || 0, velocity.y || 150);
    
    // Add visual effects
    this.addVisualEffects();
  }
  
  public getType(): PowerUpType | string {
    return this.powerUpType;
  }
  
  public getDuration(): number {
    return this.powerUpDuration;
  }
  
  private addVisualEffects(): void {
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
  }
  
  private applyTintByType(): void {
    switch (this.powerUpType) {
      case PowerUpType.EXTRA_LIFE:
      case 'extraLife':
        this.setTint(0x10B981); // Green
        break;
      case PowerUpType.PADDLE_GROW:
      case 'paddleGrow':
        this.setTint(0x3B82F6); // Blue
        break;
      case PowerUpType.PADDLE_SIZE_DECREASE:
      case 'paddleShrink':
        this.setTint(0xEF4444); // Red
        break;
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
  }
}