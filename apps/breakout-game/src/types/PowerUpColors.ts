import { PowerUpType } from './PowerUpType';

export const PowerUpColors: Record<PowerUpType, string> = {
  [PowerUpType.MULTI_BALL]: '#FF5500',
  [PowerUpType.PADDLE_GROW]: '#00FF00',
  [PowerUpType.PADDLE_SHRINK]: '#FF0000',
  [PowerUpType.SPEED_DOWN]: '#0000FF',
  [PowerUpType.SPEED_UP]: '#FFFF00',
  [PowerUpType.EXTRA_LIFE]: '#FF00FF',
  [PowerUpType.LASER]: '#00FFFF',
  [PowerUpType.STICKY]: '#8800FF',
  [PowerUpType.SHIELD]: '#FFFFFF',
  [PowerUpType.FIREBALL]: '#FF8800',
  [PowerUpType.SCORE_MULTIPLIER]: '#8B5CF6'
};