// File: PowerUp.ts
import { PowerUpType } from '@/types/PowerUpType';
import { PowerUpUtils } from '@/utils/PowerUpUtils';
import * as Phaser from 'phaser';

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
  private tweens: Phaser.Tweens.Tween[] = [];

  constructor(scene: Phaser.Scene, config: PowerUpConfig) {
    const initialX = config?.x ?? 0;
    const initialY = config?.y ?? 0;
    let initialTexture = config?.texture || `powerup_${config?.type || 'default'}`;

    super(scene.matter.world, initialX, initialY, initialTexture);
    scene.add.existing(this);

    if (!scene.textures.exists(initialTexture)) {
      console.warn(`[PowerUp] Texture '${initialTexture}' not found. Using fallback.`);
      initialTexture = 'powerup_default';

      if (!scene.textures.exists(initialTexture)) {
        createBasicTexture(scene, config.type);
        initialTexture = 'powerup_basic';
      }

      this.setTexture(initialTexture);
    }

    this.powerUpType = config.type;
    this.powerUpDuration = config.duration || PowerUpUtils.getDuration(config.type as PowerUpType);

    this.setCircle(this.width / 2);
    this.setBounce(0.8);
    this.setFriction(0, 0);
    this.setData('type', this.powerUpType);
    this.setData('duration', this.powerUpDuration);

    const physicsManager = (scene as any).getPhysicsManager?.();
    if (physicsManager) {
      const powerUpCategory = physicsManager.powerUpCategory || 0x0008;
      const paddleCategory = physicsManager.paddleCategory || 0x0004;
      this.setCollisionCategory(powerUpCategory);
      this.setCollidesWith(paddleCategory | (physicsManager.worldCategory ?? 0x0001));
    }

    const velocity = config.velocity || { y: 2 };
    this.setVelocity(velocity.x || 0, velocity.y || 2);

    if (this.body) {
      (this.body as MatterJS.BodyType).label = 'powerUp';
    }

    this.addVisualEffects();
    this.on('destroy', this.cleanup, this);
  }

  public getType(): PowerUpType | string {
    return this.powerUpType;
  }

  public getDuration(): number {
    return this.powerUpDuration;
  }

  private addVisualEffects(): void {
    if (!this.scene || !this.scene.tweens?.add) return;

    this.tweens.push(
      this.scene.tweens.add({
        targets: this,
        scale: { from: 0.9, to: 1.1 },
        duration: 800,
        yoyo: true,
        repeat: -1
      }),
      this.scene.tweens.add({
        targets: this,
        angle: { from: -5, to: 5 },
        duration: 1200,
        yoyo: true,
        repeat: -1
      })
    );

    this.setAlpha(0.9);
    this.applyTintByType();
  }

  private applyTintByType(): void {
    const color = PowerUpUtils.getColor(this.powerUpType as PowerUpType);
    if (color) this.setTint(Phaser.Display.Color.HexStringToColor(color).color);
  }

  private cleanup(): void {
    this.tweens.forEach(tween => tween?.stop());
    this.tweens = [];
    console.log(`PowerUp ${this.powerUpType} cleaned up`);
  }

  public destroy(): void {
    this.cleanup();
    super.destroy();
  }

  public update(): void {
    if (this.y > this.scene.cameras.main.height + 50) {
      console.log(`PowerUp ${this.powerUpType} went off-screen, destroying`);
      this.destroy();
    }
  }
}

function createBasicTexture(scene: Phaser.Scene, type: PowerUpType | string): void {
  const graphics = scene.add.graphics();
  const radius = 16;
  const color = PowerUpUtils.getColor(type as PowerUpType);
  graphics.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 1).fillCircle(radius, radius, radius);
  graphics.lineStyle(2, 0xFFFFFF, 1).strokeCircle(radius, radius, radius);
  graphics.generateTexture('powerup_basic', radius * 2, radius * 2);
  graphics.destroy();
}