export enum PowerUpType {
  EXTRA_LIFE = 'extraLife',
  PADDLE_GROW = 'paddleGrow',
  PADDLE_SHRINK = 'paddleShrink',
  MULTI_BALL = 'multiBall',
  SPEED_UP = 'speedUp',
  STICKY = 'sticky',
  LASER = 'laser',
  SHIELD = 'shield',
  PADDLE_SIZE_DECREASE = "PADDLE_SIZE_DECREASE",
  SCORE_MULTIPLIER = "SCORE_MULTIPLIER"
}

// Define an interface for paddles with sticky property
interface StickyPaddle extends Phaser.GameObjects.Sprite {
  setSticky?: (isSticky: boolean) => void;
}
export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  // Use declare to avoid overwriting the base property
  declare type: PowerUpType;
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
          // Safe access to velocity properties with null checks
          const ballBody = game.ball.body;
          if (ballBody && ballBody.velocity) {
            const velocityX = ballBody.velocity.x || 0;
            const velocityY = ballBody.velocity.y || 0;
            game.ball.setVelocity(velocityX * 1.5, velocityY * 1.5);
          }
        }
        if ('setPowerUpTimer' in game && typeof game.setPowerUpTimer === 'function') {
          game.setPowerUpTimer(this, 10000); // 10 seconds
        }
        break;
      case PowerUpType.STICKY:
        if ('paddle' in game) {
          // Cast to our interface that includes the setSticky method
          const paddle = game.paddle as StickyPaddle;
          if (paddle && typeof paddle.setSticky === 'function') {
            paddle.setSticky(true);
          } else {
            console.warn('Paddle does not have setSticky method');
          }
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
          // Safe access to velocity properties with null checks
          const ballBody = game.ball.body;
          if (ballBody && ballBody.velocity) {
            const velocityX = ballBody.velocity.x || 0;
            const velocityY = ballBody.velocity.y || 0;
            game.ball.setVelocity(velocityX / 1.5, velocityY / 1.5);
          }
        }
        break;
      case PowerUpType.STICKY:
        if ('paddle' in game) {
          // Cast to our interface that includes the setSticky method
          const paddle = game.paddle as StickyPaddle;
          if (paddle && typeof paddle.setSticky === 'function') {
            paddle.setSticky(false);
          }
        }
        break;
      // Add other power-up expiration logic here
    }
  }
}