/**
 * UILevelDisplay - Manages the level display in the HUD
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { TextUtils } from '@/utils/TextUtils';
import * as Phaser from 'phaser';
import UIConstants from '../UIConstants';

class UILevelDisplay {
  private scene: BreakoutScene;
  private levelText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createLevelText();
  }

  /**
   * Create the level text display
   */
  private createLevelText(): void {
    const { width } = this.scene.scale;
    
    // Create level text with TextUtils
    this.levelText = TextUtils.createLevelText(
      this.scene,
      width / 2,
      UIConstants.LEVEL.Y,
      1 // Default to level 1
    );
    this.levelText.setOrigin(0.5, 0);
  }

  /**
   * Update the level display
   * @param level The current level to display
   */
  public updateLevel(level: number): void {
    TextUtils.updateText(this.levelText, `Level ${level}`);
    
    // Add a visual effect when level changes
    this.animateLevelChange();
  }

  /**
   * Animate the level text when it changes
   */
  private animateLevelChange(): void {
    // Scale up and down animation
    this.scene.tweens.add({
      targets: this.levelText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 200,
      yoyo: true,
      ease: 'Power2'
    });
  }

  /**
   * Get the level text game object
   * @returns The Phaser text object for the level
   */
  public getLevelText(): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.levelText;
  }

/**
 * Apply NeuralIquid theme to the level display
 */
public applyNeuralIquidTheme(): void {
  try {
    // Apply theme colors from neuraliquid-theme.css
    if (this.levelText) {
      if (this.levelText instanceof Phaser.GameObjects.Text) {
        // Text objects have setColor method
        this.levelText.setColor('#4682ff'); // --primary-blue
      } else if (this.levelText instanceof Phaser.GameObjects.BitmapText) {
        // BitmapText objects use setTint instead
        this.levelText.setTint(0x4682ff); // --primary-blue as hex number
      }
    }
  } catch (error) {
    console.error('Error applying NeuralIquid theme to level display:', error);
  }
}

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.levelText) {
      this.levelText.destroy();
    }
  }
}

export default UILevelDisplay;