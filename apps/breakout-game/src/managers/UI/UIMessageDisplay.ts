/**
 * UIMessageDisplay - Handles displaying temporary messages on screen
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import UIConstants from './UIConstants';

class UIMessageDisplay {
  private scene: BreakoutScene;
  private messageText: Phaser.GameObjects.Text;
  private currentTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createMessageText();
  }

  /**
   * Create the message text object
   */
  private createMessageText(): void {
    const { width, height } = this.scene.scale;
    
    // Create centered message text that's initially invisible
    this.messageText = this.scene.add.text(
      width / 2,
      height / 2 - UIConstants.MESSAGE.Y_OFFSET,
      '',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    );
    
    this.messageText.setOrigin(0.5);
    this.messageText.setAlpha(0);
    
    // Make sure messages are always on top
    this.messageText.setDepth(1100);
  }

  /**
   * Show a message on screen
   * @param message The message to display
   * @param duration How long to show the message (in ms)
   */
  public showMessage(message: string, duration: number = 2000): void {
    // Stop any existing tween
    if (this.currentTween) {
      this.currentTween.stop();
    }
    
    // Update the message text
    this.messageText.setText(message);
    
    // Reset the message state
    this.messageText.setAlpha(0);
    this.messageText.setScale(1);
    
    // Create a sequence of tweens using separate add calls
    
    // Fade in and scale up
    this.currentTween = this.scene.tweens.add({
      targets: this.messageText,
      alpha: 1,
      scale: 1.2,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        // Scale back to normal
        this.scene.tweens.add({
          targets: this.messageText,
          scale: 1,
          duration: 200,
          ease: 'Power2',
          onComplete: () => {
            // Hold
            this.scene.time.delayedCall(duration - 500, () => {
              // Fade out
              this.scene.tweens.add({
                targets: this.messageText,
                alpha: 0,
                duration: 300,
                ease: 'Power2'
    });
            });
          }
        });
      }
    });
  }
    
  /**
   * Apply NeuralIquid theme to message display
   */
  public applyNeuralIquidTheme(): void {
    try {
      if (this.messageText) {
        // Apply theme colors from neuraliquid-theme.css
        this.messageText.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_WHITE);
        this.messageText.setStroke(UIConstants.COLORS.NEURAL_LIQUID.PRIMARY_BLUE, 4);
  }
    } catch (error) {
      console.error('Error applying NeuralIquid theme to message display:', error);
}
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.currentTween) {
      this.currentTween.stop();
    }
    
    if (this.messageText) {
      this.messageText.destroy();
    }
  }
}

export default UIMessageDisplay;