import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUpType';

export interface PowerUpHandler {
  type: PowerUpType;
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Matter.Sprite, duration: number): void;
  remove(scene: BreakoutScene): void;
}
