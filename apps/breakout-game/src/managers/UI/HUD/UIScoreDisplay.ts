/**
 * UIScoreDisplay - Manages the score display in the HUD
 */

import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { TextUtils } from '@/utils/TextUtils';
import UIConstants from '../UIConstants';

class UIScoreDisplay {
  private scene: BreakoutScene;
  private scoreText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private cryptoSymbol: string = 'BTC';

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createScoreText();
  }

  /**
   * Create the score text display
   */
  private createScoreText(): void {
    // Create score text with TextUtils
    this.scoreText = TextUtils.createScoreText(
      this.scene,
      UIConstants.SCORE.X,
      UIConstants.SCORE.Y,
      0,
      this.cryptoSymbol
    );
    this.scoreText.setOrigin(0, 0);
  }

  /**
   * Update the score display
   * @param score The current score to display
   */
  public updateScore(score: number): void {
    TextUtils.updateScoreText(this.scoreText, score, this.cryptoSymbol);
  }

  /**
   * Get the score text game object
   * @returns The Phaser text object for the score
   */
  public getScoreText(): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.scoreText;
  }

  /**
   * Set the crypto symbol used for the score
   * @param symbol The crypto symbol to use (e.g., 'BTC', 'ETH')
   */
  public setCryptoSymbol(symbol: string): void {
    this.cryptoSymbol = symbol;
    // Update the display with the current score
    const currentScore = parseInt(this.scoreText.text.replace(/[^0-9]/g, '')) || 0;
    this.updateScore(currentScore);
  }

/**
 * Apply NeuralIquid theme to the score display
 */
public applyNeuralIquidTheme(): void {
  try {
    // Apply theme colors from neuraliquid-theme.css
    if (this.scoreText) {
      if (this.scoreText instanceof Phaser.GameObjects.Text) {
        // Text objects have setColor method
        this.scoreText.setColor('#00e2ff'); // --accent-cyan
      } else if (this.scoreText instanceof Phaser.GameObjects.BitmapText) {
        // BitmapText objects use setTint instead
        this.scoreText.setTint(0x00e2ff); // --accent-cyan
      }
    }
  } catch (error) {
    console.error('Error applying NeuralIquid theme to score display:', error);
  }
}

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.scoreText) {
      this.scoreText.destroy();
    }
  }
}

export default UIScoreDisplay;