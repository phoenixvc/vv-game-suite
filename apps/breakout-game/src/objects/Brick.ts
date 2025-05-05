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

export class Brick extends Phaser.Physics.Matter.Sprite {
  private brickType: string;
  private brickValue: number;
  private brickHealth: number;
  private originalTint: number = 0xffffff;

  constructor(scene: Phaser.Scene, config: BrickConfig) {
    super(scene.matter.world, config.x, config.y, config.texture, config.frame);

    this.brickType = config.type || 'normal';
    this.brickValue = config.value || 100;
    this.brickHealth = config.health || 1;

    scene.add.existing(this);
    scene.matter.add.gameObject(this, { isStatic: true });

    this.setData('type', this.brickType);
    this.setData('value', this.brickValue);
    this.setData('health', this.brickHealth);

    if (config.width && config.height) {
      this.setDisplaySize(config.width, config.height);
    }

    this.applyBrickStyling();
    this.originalTint = this.tintTopLeft ?? 0xffffff;
  }

  public hit(damage: number = 1): boolean {
    this.brickHealth -= damage;

    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 50,
      yoyo: true
    });

    this.applyDamageEffect();

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
        this.setTint(0xFFD700); // Gold
        break;
      case 'hard':
        this.setTint(0xA0A0A0); // Silver
        break;
      case 'price':
        this.setTint(0x3B82F6); // Blue
        break;
      case 'volume':
        this.setTint(0xEF4444); // Red
        break;
      case 'liquidity':
        this.setTint(0x10B981); // Green
        break;
      default:
        this.setTint(0xffffff); // Default white
        break;
    }

    this.originalTint = this.tintTopLeft ?? 0xffffff;
  }

  private applyDamageEffect(): void {
    if (this.brickHealth > 0) {
      const damageRatio = this.brickHealth / (this.getData('health') || 1);
      const darkenFactor = 0.7 + (0.3 * damageRatio);

      const baseTint = this.originalTint;
      const r = ((baseTint >> 16) & 0xff) * darkenFactor;
      const g = ((baseTint >> 8) & 0xff) * darkenFactor;
      const b = (baseTint & 0xff) * darkenFactor;

      this.setTint(
        (Math.floor(r) << 16) |
        (Math.floor(g) << 8) |
        Math.floor(b)
      );
    }
  }

  public destroyIfDead(): boolean {
    if (this.brickHealth <= 0) {
      this.destroy();
      return true;
    }
    return false;
  }
}
