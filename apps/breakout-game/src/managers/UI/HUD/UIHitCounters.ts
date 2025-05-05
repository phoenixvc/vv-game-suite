/**
 * UIHitCounters - Manages the ball and paddle hit counters in the HUD
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import UIConstants from '../UIConstants';

class UIHitCounters {
  private scene: BreakoutScene;
  private ballHitCounterText: Phaser.GameObjects.Text;
  private paddleHitCounterText: Phaser.GameObjects.Text;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createHitCounters();
  }

  /**
   * Create the hit counter displays
   */
  private createHitCounters(): void {
    const { width } = this.scene.scale;
    
    // Create ball hit counter text (left of center, below main HUD)
    this.ballHitCounterText = this.scene.add.text(
      width / 2 - 100, 
      UIConstants.HUD_HEIGHT + 5, 
      'Ball Hits: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '14px', 
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5, 0);
    
    // Create paddle hit counter text (right of center, below main HUD)
    this.paddleHitCounterText = this.scene.add.text(
      width / 2 + 100, 
      UIConstants.HUD_HEIGHT + 5, 
      'Paddle Hits: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '14px', 
        color: '#00ffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5, 0);
  }

  /**
   * Update the ball hit counter display
   * @param hits The current number of consecutive ball hits
   */
  public updateBallHitCounter(hits: number): void {
    // Update the text
    this.ballHitCounterText.setText(`Ball Hits: ${hits}`);
    
    // Scale effect for visual feedback
    this.scene.tweens.add({
      targets: this.ballHitCounterText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Change color based on hit count for visual feedback
    if (hits >= 10) {
      this.ballHitCounterText.setColor('#ff0000'); // Red for high combo
    } else if (hits >= 5) {
      this.ballHitCounterText.setColor('#ffaa00'); // Orange for medium combo
    } else {
      this.ballHitCounterText.setColor('#ffff00'); // Yellow for low combo
    }
  }

  /**
   * Update the paddle hit counter display
   * @param hits The current number of consecutive paddle hits
   */
  public updatePaddleHitCounter(hits: number): void {
    // Update the text
    this.paddleHitCounterText.setText(`Paddle Hits: ${hits}`);
    
    // Scale effect for visual feedback
    this.scene.tweens.add({
      targets: this.paddleHitCounterText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Change color based on hit count for visual feedback
    if (hits >= 10) {
      this.paddleHitCounterText.setColor('#ff00ff'); // Magenta for high combo
    } else if (hits >= 5) {
      this.paddleHitCounterText.setColor('#00ffaa'); // Teal for medium combo
    } else {
      this.paddleHitCounterText.setColor('#00ffff'); // Cyan for low combo
    }
  }

  /**
   * Get the ball hit counter text game object
   * @returns The Phaser text object for ball hits
   */
  public getBallHitCounterText(): Phaser.GameObjects.Text {
    return this.ballHitCounterText;
  }

  /**
   * Get the paddle hit counter text game object
   * @returns The Phaser text object for paddle hits
   */
  public getPaddleHitCounterText(): Phaser.GameObjects.Text {
    return this.paddleHitCounterText;
  }

  /**
   * Apply NeuralIquid theme to the hit counters
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Apply theme colors from neuraliquid-theme.css
      // Reset colors to default theme colors first
      this.ballHitCounterText.setColor(UIConstants.COLORS.NEURAL_LIQUID.ACCENT_CYAN);
      this.paddleHitCounterText.setColor(UIConstants.COLORS.NEURAL_LIQUID.PRIMARY_PURPLE);
      
      // Add stroke for better visibility
      this.ballHitCounterText.setStroke('#000000', 2);
      this.paddleHitCounterText.setStroke('#000000', 2);
    } catch (error) {
      console.error('Error applying NeuralIquid theme to hit counters:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.ballHitCounterText) {
      this.ballHitCounterText.destroy();
    }
    
    if (this.paddleHitCounterText) {
      this.paddleHitCounterText.destroy();
    }
  }
}

export default UIHitCounters;