/**
 * UIPowerUpDisplay
 * Displays active power-ups and their remaining duration
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import UIConstants from './UIConstants';

class UIPowerUpDisplay {
  private scene: BreakoutScene;
  private container: Phaser.GameObjects.Container;
  private activePowerUps: Map<string, PowerUpIndicator> = new Map();
  private maxDisplayedPowerUps: number = 5;
  private powerUpSpacing: number = 70;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(100); // Above most game elements but below UI overlays
    this.initialize();
  }

  /**
   * Initialize the power-up display
   */
  private initialize(): void {
    const { width } = this.scene.scale;
    
    // Position the container in the top-right corner with some padding
    this.container.setPosition(width - 20, 20);
  }

  /**
   * Add a power-up to the display
   * @param type Type of power-up
   * @param duration Duration in milliseconds
   * @param icon Icon key for the power-up (from the texture atlas)
   */
  public addPowerUp(type: string, duration: number, icon: string): void {
    // If this power-up is already active, remove it first
    if (this.activePowerUps.has(type)) {
      this.removePowerUp(type);
    }
    
    // Create a new power-up indicator
    const indicator = new PowerUpIndicator(this.scene, type, duration, icon);
    this.activePowerUps.set(type, indicator);
    
    // Add to container
    this.container.add(indicator.getDisplayObjects());
    
    // Rearrange all power-ups
    this.rearrangePowerUps();
    
    // Set up automatic removal when duration expires
    this.scene.time.delayedCall(duration, () => {
      this.removePowerUp(type);
    });
  }

  /**
   * Remove a power-up from the display
   * @param type Type of power-up to remove
   */
  public removePowerUp(type: string): void {
    const indicator = this.activePowerUps.get(type);
    if (indicator) {
      // Remove display objects from container
      indicator.getDisplayObjects().forEach(obj => {
        this.container.remove(obj);
      });
      
      // Destroy the indicator
      indicator.destroy();
      
      // Remove from active power-ups
      this.activePowerUps.delete(type);
      
      // Rearrange remaining power-ups
      this.rearrangePowerUps();
    }
  }

  /**
   * Rearrange all power-up indicators
   */
  private rearrangePowerUps(): void {
    let index = 0;
    this.activePowerUps.forEach(indicator => {
      // Position each indicator vertically
      indicator.setPosition(0, index * this.powerUpSpacing);
      index++;
    });
  }

  /**
   * Update all active power-up indicators
   * @param time Current game time
   * @param delta Time delta since last update
   */
  public update(time: number, delta: number): void {
    this.activePowerUps.forEach(indicator => {
      indicator.update(delta);
    });
  }

  /**
   * Apply NeuralIquid theme to power-up display
   */
  public applyNeuralIquidTheme(): void {
    try {
      this.activePowerUps.forEach(indicator => {
        indicator.applyNeuralIquidTheme();
      });
    } catch (error) {
      console.error('Error applying NeuralIquid theme to power-up display:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Destroy all active power-up indicators
    this.activePowerUps.forEach(indicator => {
      indicator.destroy();
    });
    
    // Clear the map
    this.activePowerUps.clear();
    
    // Destroy the container
    this.container.destroy();
  }
}

/**
 * Helper class for individual power-up indicators
 */
class PowerUpIndicator {
  private scene: Phaser.Scene;
  private type: string;
  private duration: number;
  private remainingTime: number;
  private icon: Phaser.GameObjects.Sprite;
  private background: Phaser.GameObjects.Rectangle;
  private progressBar: Phaser.GameObjects.Rectangle;
  private label: Phaser.GameObjects.Text;
  private displayObjects: Phaser.GameObjects.GameObject[] = [];

  constructor(scene: Phaser.Scene, type: string, duration: number, iconKey: string) {
    this.scene = scene;
    this.type = type;
    this.duration = duration;
    this.remainingTime = duration;
    
    // Create display elements
    this.createDisplayElements(iconKey);
  }

  /**
   * Create all display elements for this power-up
   * @param iconKey Texture key for the icon
   */
  private createDisplayElements(iconKey: string): void {
    // Background rectangle
    this.background = this.scene.add.rectangle(0, 0, 60, 60, 0x000000, 0.6);
    this.background.setOrigin(1, 0); // Align to top-right
    
    // Progress bar
    this.progressBar = this.scene.add.rectangle(0, 0, 60, 5, 0x00ff00, 1);
    this.progressBar.setOrigin(1, 0);
    this.progressBar.setPosition(0, 60); // Position at the bottom of background
    
    // Icon
    this.icon = this.scene.add.sprite(0, 0, iconKey);
    this.icon.setOrigin(1, 0);
    this.icon.setPosition(-5, 5); // Center in the background with some padding
    this.icon.setScale(0.7); // Scale down to fit
    
    // Label (power-up name)
    this.label = this.scene.add.text(0, 0, this.formatTypeName(this.type), {
      fontFamily: 'Arial',
      fontSize: '12px',
      color: '#ffffff',
      align: 'right'
    });
    this.label.setOrigin(1, 0);
    this.label.setPosition(-5, 45); // Position at the bottom of the icon
    
    // Add all objects to the display objects array
    this.displayObjects = [this.background, this.progressBar, this.icon, this.label];
  }

  /**
   * Format the power-up type name for display
   * @param type Power-up type
   */
  private formatTypeName(type: string): string {
    // Convert camelCase or snake_case to Title Case
    return type
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  /**
   * Update the power-up indicator
   * @param delta Time delta since last update
   */
  public update(delta: number): void {
    // Update remaining time
    this.remainingTime -= delta;
    if (this.remainingTime < 0) {
      this.remainingTime = 0;
    }
    
    // Update progress bar width based on remaining time
    const progress = this.remainingTime / this.duration;
    this.progressBar.width = 60 * progress;
    
    // Update color based on remaining time
    if (progress < 0.2) {
      this.progressBar.fillColor = 0xff0000; // Red when almost expired
    } else if (progress < 0.5) {
      this.progressBar.fillColor = 0xffff00; // Yellow when halfway
    } else {
      this.progressBar.fillColor = 0x00ff00; // Green when plenty of time
    }
  }

  /**
   * Set the position of this indicator
   * @param x X position
   * @param y Y position
   */
  public setPosition(x: number, y: number): void {
    const offsetX = x;
    const offsetY = y;
    
    this.background.setPosition(offsetX, offsetY);
    this.progressBar.setPosition(offsetX, offsetY + 60);
    this.icon.setPosition(offsetX - 5, offsetY + 5);
    this.label.setPosition(offsetX - 5, offsetY + 45);
  }

  /**
   * Get all display objects for this indicator
   */
  public getDisplayObjects(): Phaser.GameObjects.GameObject[] {
    return this.displayObjects;
  }

   /**
   * Apply NeuralIquid theme to this indicator
   */
   public applyNeuralIquidTheme(): void {
    try {
      // Update colors to match NeuralIquid theme
      // Convert hex string color to number format that Phaser expects
      const bgColor = parseInt(UIConstants.COLORS.NEURAL_LIQUID.PANEL_BG.replace('#', '0x'), 16);
      this.background.setFillStyle(bgColor, 0.8);
      this.label.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_WHITE);
      
      // Progress bar colors are dynamically set based on remaining time
    } catch (error) {
      console.error('Error applying NeuralIquid theme to power-up indicator:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Destroy all display objects
    this.displayObjects.forEach(obj => {
      obj.destroy();
    });
    
    // Clear the array
    this.displayObjects = [];
  }
}

export default UIPowerUpDisplay;