import * as Phaser from 'phaser';

export interface BrickConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  type?: string;
  value?: number;
  health?: number;
  texture: string;
  frame?: string | number;
}

export class Brick extends Phaser.Physics.Arcade.Sprite {
  private brickType: string;
  private brickValue: number;
  private brickHealth: number;
  private originalTint: number;
  
  constructor(scene: Phaser.Scene, config: BrickConfig) {
    super(scene, config.x, config.y, config.texture, config.frame);
    
    this.brickType = config.type || 'normal';
    this.brickValue = config.value || 100;
    this.brickHealth = config.health || 1;
    this.originalTint = this.tint;
    
    // Set up the brick
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // true = static body
    
    this.setData('type', this.brickType);
    this.setData('value', this.brickValue);
    this.setData('health', this.brickHealth);
    
    // Set size if provided
    if (config.width && config.height) {
      this.setDisplaySize(config.width, config.height);
    }
    
    // Apply special styling based on type
    this.applyBrickStyling();
  }
  
  public hit(damage: number = 1): boolean {
    this.brickHealth -= damage;
    
    // Visual feedback for hit
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 50,
      yoyo: true
    });
    
    // Apply damage visual effect
    this.applyDamageEffect();
    
    // Return true if brick is destroyed
    return this.brickHealth <= 0;
  }
  
  public getValue(): number {
    return this.brickValue;
  }
  
  public getType(): string {
    return this.brickType;
  }
  
  private applyBrickStyling(): void {
    switch (this.brickType) {
      case 'special':
        this.setTint(0xFFD700); // Gold color for special bricks
        break;
      case 'hard':
        this.setTint(0xA0A0A0); // Silver color for hard bricks
        break;
      case 'price':
        this.setTint(0x3B82F6); // Blue for price data
        break;
      case 'volume':
        this.setTint(0xEF4444); // Red for volume data
        break;
      case 'liquidity':
        this.setTint(0x10B981); // Green for liquidity data
        break;
      default:
        // Normal brick keeps default tint
        break;
    }
  }
  
  private applyDamageEffect(): void {
    if (this.brickHealth > 0) {
      // Darken the brick as it takes damage
      const damageRatio = this.brickHealth / (this.getData('health') || 1);
      const darkenFactor = 0.7 + (0.3 * damageRatio);
      
      // Apply tint based on damage
      const r = ((this.originalTint >> 16) & 0xFF) * darkenFactor;
      const g = ((this.originalTint >> 8) & 0xFF) * darkenFactor;
      const b = (this.originalTint & 0xFF) * darkenFactor;
      
      this.setTint(
        Math.floor(r) << 16 | 
        Math.floor(g) << 8 | 
        Math.floor(b)
      );
    }
  }
}