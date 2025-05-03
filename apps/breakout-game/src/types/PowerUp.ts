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

  applyEffect(game: Phaser.Scene) {
    switch (this.type) {
      case PowerUpType.EXTRA_LIFE:
        if ('addLife' in game && typeof game.addLife === 'function') {
          game.addLife();
        }
        break;
      case PowerUpType.PADDLE_GROW:
        if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
          game.paddle.setScale(1.5, 1);
        }
        if ('setPowerUpTimer' in game && typeof game.setPowerUpTimer === 'function') {
          game.setPowerUpTimer(this, 10000); // 10 seconds
        }
        break;
      case PowerUpType.PADDLE_SHRINK:
        if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
          game.paddle.setScale(0.5, 1);
        }
        if ('setPowerUpTimer' in game && typeof game.setPowerUpTimer === 'function') {
          game.setPowerUpTimer(this, 10000); // 10 seconds
        }
        break;
      case PowerUpType.MULTI_BALL:
        if ('addMultiBall' in game && typeof game.addMultiBall === 'function') {
          game.addMultiBall();
        }
        break;
      case PowerUpType.SPEED_UP:
        if ('ball' in game && game.ball instanceof Phaser.Physics.Arcade.Sprite) {
          game.ball.setVelocity(game.ball.body.velocity.x * 1.5, game.ball.body.velocity.y * 1.5);
        }
        if ('setPowerUpTimer' in game && typeof game.setPowerUpTimer === 'function') {
          game.setPowerUpTimer(this, 10000); // 10 seconds
        }
        break;
      case PowerUpType.STICKY:
        if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
          game.paddle.setSticky(true);
        }
        if ('setPowerUpTimer' in game && typeof game.setPowerUpTimer === 'function') {
          game.setPowerUpTimer(this, 10000); // 10 seconds
        }
        break;
      case PowerUpType.LASER:
        if ('enableLaser' in game && typeof game.enableLaser === 'function') {
          game.enableLaser();
        }
        break;
      case PowerUpType.SHIELD:
        if ('addShield' in game && typeof game.addShield === 'function') {
          game.addShield();
        }
        break;
      default:
        console.warn(`Unknown power-up type: ${this.type}`);
        break;
    }
  }

  removeEffect(game: Phaser.Scene) {
    switch (this.type) {
      case PowerUpType.PADDLE_GROW:
        if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
          game.paddle.setScale(1, 1);
        }
        break;
      case PowerUpType.PADDLE_SHRINK:
        if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
          game.paddle.setScale(1, 1);
        }
        break;
      case PowerUpType.SPEED_UP:
        if ('ball' in game && game.ball instanceof Phaser.Physics.Arcade.Sprite) {
          game.ball.setVelocity(game.ball.body.velocity.x / 1.5, game.ball.body.velocity.y / 1.5);
        }
        break;
      case PowerUpType.STICKY:
        if ('paddle' in game && game.paddle instanceof Phaser.GameObjects.Sprite) {
          game.paddle.setSticky(false);
        }
        break;
      // Add other power-up expiration logic here
    }
  }
}
