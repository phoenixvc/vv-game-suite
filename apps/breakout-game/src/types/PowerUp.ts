export enum PowerUpType {
  EXTRA_LIFE = 'extraLife',
  PADDLE_GROW = 'paddleGrow',
  PADDLE_SHRINK = 'paddleShrink',
  MULTI_BALL = 'multiBall',
  SPEED_UP = 'speedUp',
  STICKY = 'sticky',
  LASER = 'laser',
  SHIELD = 'shield'
}

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  type: PowerUpType;
  duration?: number; // In ms, for timed power-ups

  constructor(scene: Phaser.Scene, x: number, y: number, type: PowerUpType) {
    super(scene, x, y, `powerup_${type}`);
    this.type = type;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setVelocityY(150); // Falls down by default
  }

  applyEffect(game: GameScene) {
    switch (this.type) {
      case PowerUpType.EXTRA_LIFE:
        game.addLife();
        break;
      case PowerUpType.PADDLE_GROW:
        game.paddle.setScale(1.5, 1);
        game.setPowerUpTimer(this, 10000); // 10 seconds
        break;
      // ...other cases
    }
  }

  removeEffect(game: Phaser.Scene) {
    if (this.type === PowerUpType.PADDLE_GROW) {
      if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
        game.paddle.setScale(1, 1);
      }
    }
    // ...other cases
  }
}
