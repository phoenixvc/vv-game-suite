/**
 * UIThemeDisplay - Manages the theme display in the HUD
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { TextUtils } from '@/utils/TextUtils';
import * as Phaser from 'phaser';
import UIConstants from '../UIConstants';

class UIThemeDisplay {
  private scene: BreakoutScene;
  private themeText: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private currentTheme: string = 'Default';

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createThemeText();
  }

  /**
   * Create the theme text display
   */
  private createThemeText(): void {
    const { width } = this.scene.scale;
    
    // Create theme text with TextUtils
    this.themeText = TextUtils.createText(
      this.scene,
      width / 2,
      UIConstants.THEME.Y,
      `Theme: ${this.currentTheme}`,
      18,
      '#ffff00'
    );
    this.themeText.setOrigin(0.5, 0);
    this.themeText.setAlpha(0); // Make invisible - theme now only shown in settings
  }

  /**
   * Update the theme display
   * @param theme The current theme to display
   */
  public updateTheme(theme: string): void {
    this.currentTheme = theme;
    TextUtils.updateText(this.themeText, `Theme: ${theme}`);
    
    // Apply visual changes based on the theme
    this.applyThemeVisuals(theme);
  }

  /**
   * Apply visual changes based on the current theme
   * @param theme The current theme name
   */
  private applyThemeVisuals(theme: string): void {
    let color = UIConstants.COLORS.DEFAULT; // Default color
    
    // Apply different visual styles based on the theme
    switch (theme) {
      case 'Night':
        color = UIConstants.COLORS.NIGHT;
        break;
      case 'Retro':
        color = UIConstants.COLORS.RETRO;
        break;
      case 'Future':
        color = UIConstants.COLORS.FUTURE;
        break;
      case 'Neon':
        color = UIConstants.COLORS.NEON;
        break;
      case 'NeuralIquid':
        color = UIConstants.COLORS.NEURAL_LIQUID.ACCENT_CYAN;
        break;
    }
    
    // Apply color based on whether it's BitmapText or Text
    if (this.themeText instanceof Phaser.GameObjects.BitmapText) {
      this.themeText.setTint(Phaser.Display.Color.HexStringToColor(color).color);
    } else {
      (this.themeText as Phaser.GameObjects.Text).setStyle({ color });
    }
  }

  /**
   * Show the theme text (fade in)
   */
  public showThemeText(): void {
    this.scene.tweens.add({
      targets: this.themeText,
      alpha: 1,
      duration: 500,
      ease: 'Power2'
    });
  }

  /**
   * Hide the theme text (fade out)
   */
  public hideThemeText(): void {
    this.scene.tweens.add({
      targets: this.themeText,
      alpha: 0,
      duration: 500,
      ease: 'Power2'
    });
  }

  /**
   * Get the theme text game object
   * @returns The Phaser text object for the theme
   */
  public getThemeText(): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.themeText;
  }

/**
 * Apply NeuralIquid theme to the theme display
 */
public applyNeuralIquidTheme(): void {
  try {
    // Apply theme colors from neuraliquid-theme.css
    if (this.themeText) {
      if (this.themeText instanceof Phaser.GameObjects.Text) {
        // Text objects have setColor method
        this.themeText.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_LIGHT);
      } else if (this.themeText instanceof Phaser.GameObjects.BitmapText) {
        // BitmapText objects use setTint instead
        // Convert hex string to number if needed
        const colorValue = typeof UIConstants.COLORS.NEURAL_LIQUID.TEXT_LIGHT === 'string' 
          ? Phaser.Display.Color.HexStringToColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_LIGHT).color
          : UIConstants.COLORS.NEURAL_LIQUID.TEXT_LIGHT;
        this.themeText.setTint(colorValue);
      }
    }
  } catch (error) {
    console.error('Error applying NeuralIquid theme to theme display:', error);
  }
}

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.themeText) {
      this.themeText.destroy();
    }
  }
}

export default UIThemeDisplay;