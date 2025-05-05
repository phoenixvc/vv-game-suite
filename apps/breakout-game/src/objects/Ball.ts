import * as Phaser from 'phaser';

export class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
    super(scene.matter.world, x, y, texture);
    
    // Add to scene
    scene.add.existing(this);
    
    // Configure physics body
    this.setCircle(this.width / 2);
    this.setBounce(1);
    this.setFriction(0, 0);
    this.setFrictionAir(0);
    
    // Set data property
    this.setData('isBall', true);
    
    // Set label for collision detection
    if (this.body) {
      (this.body as MatterJS.BodyType).label = 'ball';
    }
  }

  launch(initialVelocity: Phaser.Math.Vector2) {
    this.setVelocity(initialVelocity.x, initialVelocity.y);
  }

  resetToPaddle(paddle: Phaser.Physics.Matter.Sprite) {
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