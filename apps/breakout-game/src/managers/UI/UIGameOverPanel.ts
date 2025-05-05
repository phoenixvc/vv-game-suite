/**
 * UIGameOverPanel
 * Game over screen that displays final score and options to restart or quit
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import UIComponent from './UIComponent';
import UIConstants from './UIConstants';

class UIGameOverPanel extends UIComponent {
  private scene: BreakoutScene;
  private container: Phaser.GameObjects.Container;
  private background: Phaser.GameObjects.Rectangle;
  private gameOverText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private restartButton: Phaser.GameObjects.Text;
  private quitButton: Phaser.GameObjects.Text;
  private finalScore: number = 0;

  constructor(scene: BreakoutScene) {
    super('game-over-panel');
    this.scene = scene;
    this.container = this.scene.add.container(0, 0);
    this.container.setDepth(1000); // Ensure it's on top of other game elements
    this.createGameOverPanel();
    this.hide();
  }

  /**
   * Create the game over panel elements
   */
  private createGameOverPanel(): void {
    const { width, height } = this.scene.scale;
    
    // Semi-transparent background
    this.background = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width * 0.8,
      height * 0.7,
      0x000000,
      0.8
    );
    
    // Game over text
    this.gameOverText = this.scene.add.text(
      width / 2,
      height * 0.3,
      'GAME OVER',
      {
        fontFamily: 'Arial',
        fontSize: '48px',
        color: '#ff0000',
        stroke: '#000000',
        strokeThickness: 6,
        align: 'center'
      }
    );
    this.gameOverText.setOrigin(0.5);
    
    // Score text
    this.scoreText = this.scene.add.text(
      width / 2,
      height * 0.45,
      'Final Score: 0',
      {
        fontFamily: 'Arial',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
        align: 'center'
      }
    );
    this.scoreText.setOrigin(0.5);
    
    // Restart button
    this.restartButton = this.scene.add.text(
      width / 2,
      height * 0.6,
      'Play Again',
      {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        backgroundColor: '#4a4a4a',
        padding: { x: 20, y: 10 }
      }
    );
    this.restartButton.setOrigin(0.5);
    this.restartButton.setInteractive({ useHandCursor: true });
    this.restartButton.on('pointerover', () => {
      this.restartButton.setColor('#ffff00');
    });
    this.restartButton.on('pointerout', () => {
      this.restartButton.setColor('#ffffff');
    });
    this.restartButton.on('pointerdown', () => {
      this.onRestartGame();
    });
    
    // Quit button
    this.quitButton = this.scene.add.text(
      width / 2,
      height * 0.7,
      'Quit to Menu',
      {
        fontFamily: 'Arial',
        fontSize: '28px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
        align: 'center',
        backgroundColor: '#4a4a4a',
        padding: { x: 20, y: 10 }
      }
    );
    this.quitButton.setOrigin(0.5);
    this.quitButton.setInteractive({ useHandCursor: true });
    this.quitButton.on('pointerover', () => {
      this.quitButton.setColor('#ffff00');
    });
    this.quitButton.on('pointerout', () => {
      this.quitButton.setColor('#ffffff');
    });
    this.quitButton.on('pointerdown', () => {
      this.onQuitToMenu();
    });
    
    // Add all elements to the container
    this.container.add([
      this.background,
      this.gameOverText,
      this.scoreText,
      this.restartButton,
      this.quitButton
    ]);
  }

  /**
   * Show the game over panel with the final score
   * @param score Final score to display
   */
  public show(score: number = 0): void {
    this.finalScore = score;
    this.scoreText.setText(`Final Score: ${score}`);
    this.container.setVisible(true);
    
    // Add a slight animation effect
    this.scene.tweens.add({
      targets: this.container,
      alpha: { from: 0, to: 1 },
      duration: 500,
      ease: 'Power2'
    });
  }

  /**
   * Hide the game over panel
   */
  public hide(): void {
    this.container.setVisible(false);
  }

  /**
   * Handle restart game button click
   */
  private onRestartGame(): void {
    // Hide the panel
    this.hide();
    
    // Restart the current scene
    this.scene.scene.restart();
  }

  /**
   * Handle quit to menu button click
   */
  private onQuitToMenu(): void {
    // Hide the panel
    this.hide();
    
    // Stop the current scene and go to the main menu
    this.scene.scene.stop();
    this.scene.scene.start('MainMenu');
  }

  /**
   * Apply NeuralIquid theme to the game over panel
   */
  public applyNeuralIquidTheme(): void {
    try {
      // Update colors to match NeuralIquid theme
      this.gameOverText.setColor(UIConstants.COLORS.NEURAL_LIQUID.ACCENT_CYAN); // Use accent cyan for emphasis
      this.scoreText.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_WHITE);
      this.scoreText.setStroke(UIConstants.COLORS.NEURAL_LIQUID.PRIMARY_BLUE, 4);
      
      this.restartButton.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_WHITE);
      this.restartButton.setStroke(UIConstants.COLORS.NEURAL_LIQUID.PRIMARY_BLUE, 3);
      
      this.quitButton.setColor(UIConstants.COLORS.NEURAL_LIQUID.TEXT_WHITE);
      this.quitButton.setStroke(UIConstants.COLORS.NEURAL_LIQUID.PRIMARY_BLUE, 3);
      // Update background with panel background color
      const bgColor = parseInt(UIConstants.COLORS.NEURAL_LIQUID.PANEL_BG.replace('#', '0x'), 16);
      this.background.setFillStyle(bgColor, 0.9);
    } catch (error) {
      console.error('Error applying NeuralIquid theme to game over panel:', error);
    }
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Remove event listeners
    this.restartButton.removeAllListeners();
    this.quitButton.removeAllListeners();
    
    // Destroy container and all its contents
    this.container.destroy();
  }
}

export default UIGameOverPanel;