import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Class to display and animate score multipliers
 */
export class UIMultiplierDisplay {
  private scene: BreakoutScene;
  private container: Phaser.GameObjects.Container;
  private multiplierText: Phaser.GameObjects.Text;
  private multiplierLabel: Phaser.GameObjects.Text;
  private background: Phaser.GameObjects.Rectangle;
  private currentMultiplier: number = 1;
  private isAnimating: boolean = false;
  private tween: Phaser.Tweens.Tween | null = null;
  
  constructor(scene: BreakoutScene, x: number, y: number) {
    this.scene = scene;
    
    // Create container for all multiplier UI elements
    this.container = this.scene.add.container(x, y);
    
    // Create background
    this.background = this.scene.add.rectangle(0, 0, 120, 60, 0x000000, 0.6);
    this.background.setStrokeStyle(2, 0xffffff);
    this.background.setOrigin(0.5);
    
    // Create label text
    this.multiplierLabel = this.scene.add.text(0, -15, 'MULTIPLIER', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#ffffff',
      align: 'center'
    });
    this.multiplierLabel.setOrigin(0.5);
    
    // Create multiplier text
    this.multiplierText = this.scene.add.text(0, 10, 'x1.0', {
      fontFamily: 'Arial',
      fontSize: '24px',
      fontStyle: 'bold',
      color: '#ffffff',
      align: 'center'
    });
    this.multiplierText.setOrigin(0.5);
    
    // Add elements to container
    this.container.add([this.background, this.multiplierLabel, this.multiplierText]);
    
    // Initially hide the container
    this.container.setAlpha(0);
  }
  
  /**
   * Update the displayed multiplier value
   * @param multiplier The new multiplier value
   */
  public updateMultiplier(multiplier: number): void {
    // Store the current multiplier
    const previousMultiplier = this.currentMultiplier;
    this.currentMultiplier = multiplier;
    
    // Format the multiplier text (always show one decimal place)
    const formattedMultiplier = `x${multiplier.toFixed(1)}`;
    this.multiplierText.setText(formattedMultiplier);
    
    // Set text color based on multiplier value
    if (multiplier >= 3) {
      this.multiplierText.setColor('#ff0000'); // Red for high multipliers
    } else if (multiplier >= 2) {
      this.multiplierText.setColor('#ffff00'); // Yellow for medium multipliers
    } else if (multiplier > 1) {
      this.multiplierText.setColor('#00ff00'); // Green for small multipliers
    } else {
      this.multiplierText.setColor('#ffffff'); // White for base multiplier
    }
    
    // Animate the multiplier change
    this.animateMultiplierChange(previousMultiplier, multiplier);
  }
  
  /**
   * Animate the multiplier change
   * @param from Previous multiplier value
   * @param to New multiplier value
   */
  private animateMultiplierChange(from: number, to: number): void {
    // Stop any ongoing animation
    if (this.tween) {
      this.tween.stop();
      this.tween = null;
    }
    
    // If multiplier is 1 (base value), fade out the display
    if (to === 1) {
      this.tween = this.scene.tweens.add({
        targets: this.container,
        alpha: 0,
        duration: 500,
        ease: 'Power2'
      });
      return;
    }
    
    // If multiplier increased, show celebration animation
    if (to > from) {
      // Make sure container is visible
      this.container.setAlpha(1);
      
      // Scale up and back animation
      this.tween = this.scene.tweens.add({
        targets: this.multiplierText,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 200,
        yoyo: true,
        ease: 'Back.easeOut',
        onComplete: () => {
          this.multiplierText.setScale(1);
        }
      });
    } 
    // If multiplier decreased but still above 1, show subtle animation
    else if (to > 1) {
      // Make sure container is visible
      this.container.setAlpha(1);
      
      // Subtle shake animation
      this.tween = this.scene.tweens.add({
        targets: this.multiplierText,
        x: { from: -5, to: 0 },
        duration: 100,
        ease: 'Sine.easeInOut',
        yoyo: true
      });
    }
  }
  
  /**
   * Show the multiplier display
   */
  public show(): void {
    this.container.setAlpha(1);
  }
  
  /**
   * Hide the multiplier display
   */
  public hide(): void {
    this.container.setAlpha(0);
  }
  
  /**
   * Set the position of the multiplier display
   */
  public setPosition(x: number, y: number): void {
    this.container.setPosition(x, y);
  }
  
  /**
   * Get the container for this UI element
   */
  public getContainer(): Phaser.GameObjects.Container {
    return this.container;
  }
  
  /**
   * Clean up resources
   */
  public destroy(): void {
    if (this.tween) {
      this.tween.stop();
    }
    this.container.destroy();
  }
}

export default UIMultiplierDisplay;