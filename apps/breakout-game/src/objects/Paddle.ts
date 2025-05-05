import * as Phaser from 'phaser';

export interface PaddleOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'horizontal' | 'vertical';
  collisionCategory: number;
  collidesWith: number[];
  texture: string;
}

export class Paddle extends Phaser.Physics.Matter.Sprite {
  constructor(opts: PaddleOptions) {
    const { scene, x, y, texture } = opts;
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);

    const width = opts.width;
    const height = opts.height;

    this.setBody({ type: 'rectangle', width, height });
    this.setStatic(true);
    this.setCollisionCategory(opts.collisionCategory);
    this.setCollidesWith(opts.collidesWith);
    this.setFriction(0);
    this.setFrictionAir(0);

    (this.body as MatterJS.BodyType).label = 'paddle';
  }
}
