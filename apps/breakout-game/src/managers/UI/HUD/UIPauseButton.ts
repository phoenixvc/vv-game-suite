/**
 * UIPauseButton - Manages the pause button in the HUD
 */

import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { TextUtils } from '@/utils/TextUtils';

class UIPauseButton {
  private scene: BreakoutScene;
  private pauseButton: Phaser.GameObjects.Rectangle;
  private pauseIcon: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createPauseButton();
  }

  /**
   * Create the pause button
   */
  private createPauseButton(): void {
    // Create a simple pause button in the top-right corner
    this.pauseButton = this.scene.add.rectangle(
      this.scene.scale.width - 20,
      20,
      30, 30,
      0x333333, 0.8
    );
    this.pauseButton.setInteractive({ useHandCursor: true });
    
    // Use TextUtils for the pause icon
    this.pauseIcon = TextUtils.createText(
      this.scene,
      this.scene.scale.width - 20,
      20,
      '❚❚',
      16
    );
    this.pauseIcon.setOrigin(0.5);
    
    // Set up button interaction
    this.setupButtonInteraction();
  }

  /**
   * Set up button interaction
   */
  private setupButtonInteraction(): void {
    this.pauseButton.on('pointerdown', () => {
      if (this.scene.scene.isPaused()) {
        this.scene.scene.resume();
        this.scene.getEventManager().emit('gameResumed');
      } else {
        this.scene.scene.pause();
        this.scene.getEventManager().emit('gamePaused');
      }
    });

    // Add hover effects
    this.pauseButton.on('pointerover', () => {
      this.pauseButton.fillColor = 0x444444;
    });

    this.pauseButton.on('pointerout', () => {
      this.pauseButton.fillColor = 0x333333;
    });
  }

  /**
   * Get the pause button game object
   * @returns The Phaser rectangle for the pause button
   */
  public getPauseButton(): Phaser.GameObjects.Rectangle {
    return this.pauseButton;
  }

  /**
   * Get the pause icon game object
   * @returns The Phaser text for the pause icon
   */
  public getPauseIcon(): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.pauseIcon;
  }

  /**
   * Apply NeuralIquid theme to the pause button
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Apply theme colors from neuraliquid-theme.css
      this.pauseButton.setFillStyle(0x111527, 0.8); // --panel-bg with transparency
      this.pauseButton.setStrokeStyle(1, 0x1e2642); // --border-color
      
      // Update icon color
      if (this.pauseIcon instanceof Phaser.GameObjects.Text) {
        this.pauseIcon.setColor('#e0e6ff'); // --text-light
      } else if (this.pauseIcon instanceof Phaser.GameObjects.BitmapText) {
        this.pauseIcon.setTint(0xe0e6ff); // --text-light
      }
    } catch (error) {
      console.error('Error applying NeuralIquid theme to pause button:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.pauseButton) {
      this.pauseButton.destroy();
    }
    
    if (this.pauseIcon) {
      this.pauseIcon.destroy();
    }
  }
}

export default UIPauseButton;