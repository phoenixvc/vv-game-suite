import { PowerUpType } from './PowerUpType';

export const PowerUpProbabilities: Record<PowerUpType, number> = {
  [PowerUpType.MULTI_BALL]: 20,
  [PowerUpType.PADDLE_GROW]: 25,
  [PowerUpType.PADDLE_SHRINK]: 15,
  [PowerUpType.SPEED_DOWN]: 20,
  [PowerUpType.SPEED_UP]: 15,
  [PowerUpType.EXTRA_LIFE]: 5,
  [PowerUpType.LASER]: 10,
  [PowerUpType.STICKY]: 10,
  [PowerUpType.SHIELD]: 10,
  [PowerUpType.FIREBALL]: 10,
  [PowerUpType.SCORE_MULTIPLIER]: 15
};