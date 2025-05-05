/**
 * UIHudContainer - Main container for all HUD elements
 * Manages the background and positioning of HUD components
 */

import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import UIConstants from '../UIConstants';

class UIHudContainer {
  private scene: BreakoutScene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createContainer();
  }

  /**
   * Create the HUD container and background
   */
  private createContainer(): void {
    const { width } = this.scene.scale;
    
    // Create container for HUD at the very top of the screen
    this.container = this.scene.add.container(0, 0);
    
    // Create semi-transparent background for HUD
    this.background = this.scene.add.rectangle(
      width / 2, 
      UIConstants.HUD_HEIGHT / 2, 
      width, 
      UIConstants.HUD_HEIGHT, 
      0x000000, 
      0.7
    );
    this.container.add(this.background);
    
    // Make sure HUD is always on top
    this.container.setDepth(1000);
  }

  /**
   * Add a game object to the HUD container
   * @param gameObject The game object to add to the HUD
   */
  public add(gameObject: Phaser.GameObjects.GameObject | Phaser.GameObjects.GameObject[]): void {
    this.container.add(gameObject);
  }

  /**
   * Get the HUD container
   * @returns The Phaser container for the HUD
   */
  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  /**
   * Get the HUD background
   * @returns The Phaser rectangle used as the HUD background
   */
  public getBackground(): Phaser.GameObjects.Rectangle {
    return this.background;
  }

  /**
   * Get the HUD height
   * @returns The height of the HUD in pixels
   */
  public getHeight(): number {
    return UIConstants.HUD_HEIGHT;
  }

  /**
   * Apply NeuralIquid theme to the HUD
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Apply to HUD background using theme colors from neuraliquid-theme.css
      if (this.background) {
        this.background.setFillStyle(0x111527, 0.9); // --panel-bg with transparency
        this.background.setStrokeStyle(1, 0x1e2642); // --border-color
      }
    } catch (error) {
      console.error('Error applying NeuralIquid theme to HUD:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.container) {
      this.container.destroy();
    }
  }
}

export default UIHudContainer;