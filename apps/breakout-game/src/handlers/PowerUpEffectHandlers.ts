// File: PowerUpEffectHandlers.ts

import { PowerUp } from "@/objects";
import { PowerUpType } from "@/types/PowerUpType";
import { PowerUpUtils } from "@/utils/PowerUpUtils";

export interface BreakoutGame extends Phaser.Scene {
  paddle?: Phaser.GameObjects.Sprite;
  ball?: Phaser.Physics.Matter.Sprite;
  data: Phaser.Data.DataManager;
  addLife?: () => void;
  addMultiBall?: () => void;
  setPowerUpTimer?: (powerUp: PowerUp, duration: number) => void;
  enableLaser?: () => void;
  addShield?: () => void;
  enableFireball?: () => void;
  disableLaser?: () => void;
  removeShield?: () => void;
  disableFireball?: () => void;
  getBallManager?: () => any;
  getPaddleManager?: () => any;
  getPowerUpManager?: () => any;
  getLives?: () => number;
  setLives?: (lives: number) => void;
}

export const PowerUpEffects = {
  apply: (powerUp: PowerUp, game: BreakoutGame): void => {
    const type = powerUp.getType() as PowerUpType;
    const duration = powerUp.getDuration();

    switch (type) {
      case PowerUpType.EXTRA_LIFE:
        if (typeof game.addLife === 'function') {
          game.addLife();
        } else if (typeof game.setLives === 'function' && typeof game.getLives === 'function') {
          const currentLives = game.getLives();
          if (typeof currentLives === 'number') {
            game.setLives(currentLives + 1);
          }
        }
        break;
      case PowerUpType.PADDLE_GROW:
        game.paddle?.setScale(1.5, 1);
        break;
      case PowerUpType.PADDLE_SHRINK:
        game.paddle?.setScale(0.5, 1);
        break;
      case PowerUpType.MULTI_BALL:
        if (typeof game.addMultiBall === 'function') {
          game.addMultiBall();
        } else {
          game.getBallManager()?.createMultipleBalls?.(2);
        }
        break;
      case PowerUpType.SPEED_DOWN:
        if (game.ball?.body) {
          const { x, y } = game.ball.body.velocity;
          game.ball.setVelocity(x / 1.5, y / 1.5);
        }
        break;
      case PowerUpType.SPEED_UP:
        if (game.ball?.body) {
          const { x, y } = game.ball.body.velocity;
          game.ball.setVelocity(x * 1.5, y * 1.5);
        } else {
          game.getBallManager()?.setSpeedMultiplier?.(1.5);
        }
        break;
      case PowerUpType.STICKY:
        game.getPaddleManager()?.setSticky?.(true);
        break;
      case PowerUpType.LASER:
        if (typeof game.enableLaser === 'function') {
          game.enableLaser();
        } else {
          game.getPaddleManager()?.enableLaser?.(true);
        }
        break;
      case PowerUpType.SHIELD:
        if (typeof game.addShield === 'function') {
          game.addShield();
        } else {
          game.getPowerUpManager()?.addShield?.();
        }
        break;
      case PowerUpType.FIREBALL:
        game.enableFireball?.();
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        game.data?.set('scoreMultiplier', 2);
        const text = game.add.text(game.scale.width - 160, 80, 'Score x2', {
          fontSize: '24px',
          color: '#8B5CF6',
          fontFamily: 'Arial'
        }).setScrollFactor(0);
        game.data?.set('multiplierText', text);
        break;
    }

    if (PowerUpUtils.isTemporary(type)) {
      game.setPowerUpTimer?.(powerUp, duration);
    }
  },

  remove: (powerUp: PowerUp, game: BreakoutGame): void => {
    const type = powerUp.getType() as PowerUpType;

    switch (type) {
      case PowerUpType.PADDLE_GROW:
      case PowerUpType.PADDLE_SHRINK:
        game.paddle?.setScale(1, 1);
        break;
      case PowerUpType.SPEED_DOWN:
        if (game.ball?.body) {
          const { x, y } = game.ball.body.velocity;
          game.ball.setVelocity(x * 1.5, y * 1.5);
        }
        break;
      case PowerUpType.SPEED_UP:
        if (game.ball?.body) {
          const { x, y } = game.ball.body.velocity;
          game.ball.setVelocity(x / 1.5, y / 1.5);
        } else {
          game.getBallManager()?.setSpeedMultiplier?.(1);
        }
        break;
      case PowerUpType.STICKY:
        game.getPaddleManager()?.setSticky?.(false);
        break;
      case PowerUpType.LASER:
        if (typeof game.disableLaser === 'function') {
          game.disableLaser();
        } else {
          game.getPaddleManager()?.enableLaser?.(false);
        }
        break;
      case PowerUpType.SHIELD:
        if (typeof game.removeShield === 'function') {
          game.removeShield();
        } else {
          game.getPowerUpManager()?.removeShield?.();
        }
        break;
      case PowerUpType.FIREBALL:
        game.disableFireball?.();
        break;
      case PowerUpType.SCORE_MULTIPLIER:
        game.data?.set('scoreMultiplier', 1);
        game.data?.get('multiplierText')?.destroy();
        break;
    }
  }
};
