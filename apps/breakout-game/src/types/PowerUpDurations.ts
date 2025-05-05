import { PowerUpType } from './PowerUpType';

export const PowerUpDurations: Record<PowerUpType, number> = {
  [PowerUpType.MULTI_BALL]: 0,
  [PowerUpType.PADDLE_GROW]: 10000,
  [PowerUpType.PADDLE_SHRINK]: 8000,
  [PowerUpType.SPEED_DOWN]: 10000,
  [PowerUpType.SPEED_UP]: 10000,
  [PowerUpType.EXTRA_LIFE]: 0,
  [PowerUpType.LASER]: 15000,
  [PowerUpType.STICKY]: 12000,
  [PowerUpType.SHIELD]: 20000,
  [PowerUpType.FIREBALL]: 15000,
  [PowerUpType.SCORE_MULTIPLIER]: 20000
};