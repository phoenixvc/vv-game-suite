import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUpType';
import { TextUtils } from '../utils/TextUtils';
import { PowerUpHandler } from './PowerUpHandler';

export class ScoreMultiplierPowerUp implements PowerUpHandler {
  type = PowerUpType.SCORE_MULTIPLIER;
  private multiplierText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text | null = null;
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Matter.Sprite, duration: number): void {
    // Store the multiplier in the scene data
    scene.data.set('scoreMultiplier', 2);
    
    // Show visual indicator using TextUtils
    this.multiplierText = TextUtils.createText(
      scene, 
      scene.scale.width - 160, 
      80, 
      `Score x2 ${TextUtils.cryptoSymbol('BTC')}`, 
      24,
      '#8B5CF6'
    );
    
    // Ensure text stays fixed to the camera
    this.multiplierText.setScrollFactor(0);
    
    scene.data.set('multiplierText', this.multiplierText);
    
    // Notify the UI manager about the power-up
    scene.getEventManager()?.emit('powerUpCollected', {
      type: this.type,
      duration: duration
    });
    }
  
  remove(scene: BreakoutScene): void {
    scene.data.set('scoreMultiplier', 1);
    
    // Remove visual indicator
    if (this.multiplierText) {
      this.multiplierText.destroy();
      this.multiplierText = null;
  }
    
    // Notify the UI manager about the expired power-up
    scene.getEventManager()?.emit('powerUpExpired', {
      type: this.type
    });
}
}