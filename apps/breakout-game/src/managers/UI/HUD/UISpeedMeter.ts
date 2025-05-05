/**
 * UISpeedMeter - Manages the ball speed meter display
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import UIConstants from '../UIConstants';

class UISpeedMeter {
  private scene: BreakoutScene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private speedBar: Phaser.GameObjects.Rectangle;
  private speedText: Phaser.GameObjects.Text;
  private maxBallSpeed: number = 20; // Maximum expected ball speed for meter

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createSpeedMeter();
  }

  /**
   * Create the speed meter display
   */
  private createSpeedMeter(): void {
    const { width, height } = this.scene.scale;
    
    // Create speed meter container (bottom right)
    this.container = this.scene.add.container(
      width - UIConstants.SPEED_METER.X_OFFSET, 
      height - UIConstants.SPEED_METER.Y_OFFSET
    );
    
    // Create speed meter background
    this.background = this.scene.add.rectangle(
      0, 0, 
      UIConstants.SPEED_METER.WIDTH, 
      UIConstants.SPEED_METER.HEIGHT, 
      0x333333
    );
    this.container.add(this.background);
    
    // Create speed meter bar
    this.speedBar = this.scene.add.rectangle(
      -UIConstants.SPEED_METER.WIDTH / 2, 0, 
      0, 
      UIConstants.SPEED_METER.BAR_HEIGHT, 
      0x00ff00
    );
    this.speedBar.setOrigin(0, 0.5);
    this.container.add(this.speedBar);
    
    // Create speed text
    this.speedText = this.scene.add.text(
      0, 
      -15, 
      'Speed: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '14px', 
        color: '#ffffff' 
      }
    ).setOrigin(0.5, 1);
    this.container.add(this.speedText);
    
    // Make sure speed meter is always on top
    this.container.setDepth(1000);
  }

  /**
   * Update the speed meter display
   * @param speed The current ball speed
   */
  public updateSpeedMeter(speed: number): void {
    // Calculate percentage of max speed
    const percentage = Math.min(speed / this.maxBallSpeed, 1);
    
    // Update bar width (max width is 100)
    const barWidth = percentage * UIConstants.SPEED_METER.WIDTH;
    this.speedBar.width = barWidth;
    
    // Update bar color based on speed
    if (percentage < 0.3) {
      this.speedBar.fillColor = 0x00ff00; // Green for slow
    } else if (percentage < 0.7) {
      this.speedBar.fillColor = 0xffff00; // Yellow for medium
    } else {
      this.speedBar.fillColor = 0xff0000; // Red for fast
    }
    
    // Update speed text
    this.speedText.setText(`Speed: ${speed.toFixed(1)}`);
  }

  /**
   * Set the maximum expected ball speed
   * @param maxSpeed The maximum expected ball speed
   */
  public setMaxBallSpeed(maxSpeed: number): void {
    this.maxBallSpeed = maxSpeed;
  }

  /**
   * Get the speed meter container
   * @returns The Phaser container for the speed meter
   */
  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }

  /**
   * Apply NeuralIquid theme to the speed meter
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Apply theme colors from neuraliquid-theme.css
      this.background.setFillStyle(0x111527); // --panel-bg
      this.background.setStrokeStyle(1, 0x1e2642); // --border-color
      
      // Update the speed bar colors based on the current percentage
      this.updateSpeedMeterColors();
      
      // Update text color
      this.speedText.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_LIGHT);
    } catch (error) {
      console.error('Error applying NeuralIquid theme to speed meter:', error);
    }
  }

  /**
   * Update speed meter colors based on the NeuralIquid theme
   */
  private updateSpeedMeterColors(): void {
    // Get the current speed percentage
    const percentage = this.speedBar.width / UIConstants.SPEED_METER.WIDTH;
    
    // Use theme colors for the gradient
    if (percentage < 0.3) {
      this.speedBar.fillColor = 0x4682ff; // --primary-blue for slow
    } else if (percentage < 0.7) {
      this.speedBar.fillColor = 0x00e2ff; // --accent-cyan for medium
    } else {
      this.speedBar.fillColor = 0x9370ff; // --primary-purple for fast
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

export default UISpeedMeter;