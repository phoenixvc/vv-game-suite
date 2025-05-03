import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';
import { ShieldPowerUp } from './ShieldPowerUp';
import { ExtraLifePowerUp } from './ExtraLifePowerUp';
import { PaddleGrowPowerUp } from './PaddleGrowPowerUp';
import { MultiBallPowerUp } from './MultiBallPowerUp';
import { SpeedUpPowerUp } from './SpeedUpPowerUp';
import { StickyPaddlePowerUp } from './StickyPaddlePowerUp';
import { LaserPowerUp } from './LaserPowerUp';
import { ScoreMultiplierPowerUp } from './ScoreMultiplierPowerUp';
import { PaddleShrinkPowerUp } from './PaddleShrinkPowerUp';

export class PowerUpFactory {
  private static handlers = new Map<PowerUpType, PowerUpHandler>();
  
  static getHandler(type: PowerUpType): PowerUpHandler {
    if (!this.handlers.has(type)) {
      switch (type) {
        case PowerUpType.SHIELD:
          this.handlers.set(type, new ShieldPowerUp());
          break;
        case PowerUpType.EXTRA_LIFE:
          this.handlers.set(type, new ExtraLifePowerUp());
          break;
        case PowerUpType.PADDLE_GROW:
          this.handlers.set(type, new PaddleGrowPowerUp());
          break;
        case PowerUpType.MULTI_BALL:
          this.handlers.set(type, new MultiBallPowerUp());
          break;
        case PowerUpType.SPEED_UP:
          this.handlers.set(type, new SpeedUpPowerUp());
          break;
        case PowerUpType.STICKY:
          this.handlers.set(type, new StickyPaddlePowerUp());
          break;
        case PowerUpType.LASER:
          this.handlers.set(type, new LaserPowerUp());
          break;
        case PowerUpType.SCORE_MULTIPLIER:
          this.handlers.set(type, new ScoreMultiplierPowerUp());
          break;
        case PowerUpType.PADDLE_SHRINK:
          this.handlers.set(type, new PaddleShrinkPowerUp());
          break;
        default:
          throw new Error(`Unknown power-up type: ${type}`);
      }
    }
    
    return this.handlers.get(type)!;
  }
}