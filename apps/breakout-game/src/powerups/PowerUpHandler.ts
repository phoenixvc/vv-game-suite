import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';

export interface PowerUpHandler {
  type: PowerUpType;
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void;
  remove(scene: BreakoutScene): void;
}