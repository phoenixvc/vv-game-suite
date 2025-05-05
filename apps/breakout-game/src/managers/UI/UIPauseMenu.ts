/**
 * UIPauseMenu - Handles the pause menu overlay
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import UIConstants from './UIConstants';

class UIPauseMenu {
  private scene: BreakoutScene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private titleText: Phaser.GameObjects.Text;
  private resumeButton: Phaser.GameObjects.Rectangle;
  private resumeText: Phaser.GameObjects.Text;
  private settingsButton: Phaser.GameObjects.Rectangle;
  private settingsText: Phaser.GameObjects.Text;
  private quitButton: Phaser.GameObjects.Rectangle;
  private quitText: Phaser.GameObjects.Text;
  private isVisible: boolean = false;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createPauseMenu();
  }

  /**
   * Create the pause menu elements
   */
  private createPauseMenu(): void {
    const { width, height } = this.scene.scale;
    
    // Create container for all pause menu elements
    this.container = this.scene.add.container(0, 0);
    
    // Create semi-transparent background
    this.background = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width,
      height,
      0x000000,
      0.7
    );
    this.container.add(this.background);
    
    // Create title text
    this.titleText = this.scene.add.text(
      width / 2,
      height / 2 - 150,
      'GAME PAUSED',
      {
        fontFamily: 'Arial',
        fontSize: '36px',
        color: '#ffffff',
        align: 'center'
      }
    );
    this.titleText.setOrigin(0.5);
    this.container.add(this.titleText);
    
    // Create resume button
    this.resumeButton = this.createButton(width / 2, height / 2 - 50);
    this.resumeText = this.createButtonText(width / 2, height / 2 - 50, 'RESUME');
    this.container.add([this.resumeButton, this.resumeText]);
    
    // Create settings button
    this.settingsButton = this.createButton(width / 2, height / 2 + 30);
    this.settingsText = this.createButtonText(width / 2, height / 2 + 30, 'SETTINGS');
    this.container.add([this.settingsButton, this.settingsText]);
    
    // Create quit button
    this.quitButton = this.createButton(width / 2, height / 2 + 110);
    this.quitText = this.createButtonText(width / 2, height / 2 + 110, 'QUIT GAME');
    this.container.add([this.quitButton, this.quitText]);
    
    // Set up button interactions
    this.setupButtonInteractions();
    
    // Make sure pause menu is always on top
    this.container.setDepth(2000);
    
    // Hide the menu initially
    this.container.setVisible(false);
    this.isVisible = false;
  }

  /**
   * Create a button rectangle
   * @param x X position
   * @param y Y position
   * @returns The button rectangle
   */
  private createButton(x: number, y: number): Phaser.GameObjects.Rectangle {
    const button = this.scene.add.rectangle(
      x, y, 200, 50, 0x333333
    );
    button.setStrokeStyle(2, 0xffffff);
    button.setInteractive({ useHandCursor: true });
    return button;
  }

  /**
   * Create button text
   * @param x X position
   * @param y Y position
   * @param label Button label
   * @returns The button text
   */
  private createButtonText(x: number, y: number, label: string): Phaser.GameObjects.Text {
    const text = this.scene.add.text(
      x, y, label,
      {
        fontFamily: 'Arial',
        fontSize: '24px',
        color: '#ffffff',
        align: 'center'
      }
    );
    text.setOrigin(0.5);
    return text;
  }

  /**
   * Set up button interactions
   */
  private setupButtonInteractions(): void {
    // Resume button
    this.resumeButton.on('pointerdown', () => {
      this.scene.scene.resume();
      this.scene.getEventManager().emit('gameResumed');
      this.hide();
    });
    
    // Settings button
    this.settingsButton.on('pointerdown', () => {
      this.scene.getEventManager().emit('openSettings');
    });
    
    // Quit button
    this.quitButton.on('pointerdown', () => {
      this.scene.getEventManager().emit('quitGame');
      this.scene.scene.start('MainMenu');
    });
    
    // Add hover effects for all buttons
    [this.resumeButton, this.settingsButton, this.quitButton].forEach(button => {
      button.on('pointerover', () => {
        button.fillColor = 0x555555;
      });
      
      button.on('pointerout', () => {
        button.fillColor = 0x333333;
      });
    });
  }

  /**
   * Show the pause menu
   */
  public show(): void {
    this.container.setVisible(true);
    this.isVisible = true;
    
    // Add a fade-in effect
    this.container.setAlpha(0);
    this.scene.tweens.add({
      targets: this.container,
      alpha: 1,
      duration: 200,
      ease: 'Power2'
    });
  }

  /**
   * Hide the pause menu
   */
  public hide(): void {
    // Add a fade-out effect
    this.scene.tweens.add({
      targets: this.container,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        this.container.setVisible(false);
        this.isVisible = false;
      }
    });
  }

  /**
   * Check if the pause menu is visible
   * @returns True if the menu is visible
   */
  public isMenuVisible(): boolean {
    return this.isVisible;
  }

  /**
   * Apply NeuralIquid theme to pause menu
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Apply theme colors from neuraliquid-theme.css
      this.titleText.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_WHITE);
      
      // Apply to buttons
      [this.resumeButton, this.settingsButton, this.quitButton].forEach(button => {
        button.setFillStyle(0x111527); // --panel-bg
        button.setStrokeStyle(2, 0x1e2642); // --border-color
      });
      
      // Apply to button texts
      [this.resumeText, this.settingsText, this.quitText].forEach(text => {
        text.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_LIGHT);
      });
    } catch (error) {
      console.error('Error applying NeuralIquid theme to pause menu:', error);
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

export default UIPauseMenu;