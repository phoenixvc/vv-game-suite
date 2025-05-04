import * as Phaser from 'phaser';

export class Ball extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCircle(this.width / 2);
    this.setCollideWorldBounds(true);
    this.setBounce(1, 1);
    this.setData('isBall', true);
  }

  launch(initialVelocity: Phaser.Math.Vector2) {
    this.setVelocity(initialVelocity.x, initialVelocity.y);
  }

  resetToPaddle(paddle: Phaser.Physics.Arcade.Sprite) {
    this.setPosition(paddle.x, paddle.y - paddle.height);
    this.setVelocity(0, 0);
  }

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
}
