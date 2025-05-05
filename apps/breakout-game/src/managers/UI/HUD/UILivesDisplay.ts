/**
 * UILivesDisplay - Manages the lives display in the HUD
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { TextUtils } from '@/utils/TextUtils';
import * as Phaser from 'phaser';
import UIConstants from '../UIConstants';

class UILivesDisplay {
  private scene: BreakoutScene;
  private livesText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private cryptoSymbol: string = 'ETH';
  private livesIcons: Phaser.GameObjects.Image[] = [];

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createLivesDisplay();
  }

  /**
   * Create the lives display
   */
  private createLivesDisplay(): void {
    // Create lives text with TextUtils
    this.livesText = TextUtils.createLivesText(
      this.scene,
      UIConstants.LIVES.X,
      UIConstants.LIVES.Y,
      3, // Default to 3 lives
      this.cryptoSymbol
    );
    this.livesText.setOrigin(1, 0);
  }

  /**
   * Update the lives display
   * @param lives The current number of lives to display
   */
  public updateLives(lives: number): void {
    TextUtils.updateLivesText(this.livesText, lives, this.cryptoSymbol);
    
    // Optional: Update visual life icons if they're being used
    this.updateLivesIcons(lives);
  }

  /**
   * Update visual life icons (optional feature)
   * @param lives Number of lives to display
   */
  private updateLivesIcons(lives: number): void {
    // Clear existing icons
    this.livesIcons.forEach(icon => icon.destroy());
    this.livesIcons = [];
    
    // Only create icons if we want visual representation
    // This is optional and can be enabled based on game settings
    const useIcons = false; // Set to true to enable visual icons
    
    if (useIcons) {
      const iconSize = 20;
      const spacing = 25;
      const startX = UIConstants.LIVES.X - 100; // Adjust position as needed
      
      for (let i = 0; i < lives; i++) {
        const icon = this.scene.add.image(
          startX - (i * spacing), 
          UIConstants.LIVES.Y + 10,
          'life-icon'
        );
        icon.setScale(iconSize / icon.width);
        this.livesIcons.push(icon);
      }
    }
  }

  /**
   * Get the lives text game object
   * @returns The Phaser text object for lives
   */
  public getLivesText(): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.livesText;
  }

  /**
   * Set the crypto symbol used for lives
   * @param symbol The crypto symbol to use (e.g., 'BTC', 'ETH')
   */
  public setCryptoSymbol(symbol: string): void {
    this.cryptoSymbol = symbol;
    // Update the display with current lives
    const currentLives = parseInt(this.livesText.text.replace(/[^0-9]/g, '')) || 3;
    this.updateLives(currentLives);
  }

  /**
   * Apply NeuralIquid theme to the lives display
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Apply theme colors from neuraliquid-theme.css
      if (this.livesText) {
        if (this.livesText instanceof Phaser.GameObjects.Text) {
          // Text objects have setColor method
          this.livesText.setColor('#9370ff'); // --accent-cyan
        } else if (this.livesText instanceof Phaser.GameObjects.BitmapText) {
          // BitmapText objects use setTint instead
          this.livesText.setTint(0x9370ff); // --accent-cyan
        }
      }
    } catch (error) {
      console.error('Error applying NeuralIquid theme to lives display:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.livesText) {
      this.livesText.destroy();
    }
    
    this.livesIcons.forEach(icon => icon.destroy());
    this.livesIcons = [];
  }
}

export default UILivesDisplay;