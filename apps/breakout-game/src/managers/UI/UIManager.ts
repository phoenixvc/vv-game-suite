/**
 * UIManager - Main manager for all UI components in the game
 * Orchestrates the creation, updating, and destruction of UI elements
 */

import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import UIHudContainer from './HUD/UIHudContainer';
import UILivesDisplay from './HUD/UILivesDisplay';
import UIScoreDisplay from './HUD/UIScoreDisplay';
import UISettingsPanel from './Settings';
import UIGameOverPanel from './UIGameOverPanel';
import UIMessageDisplay from './UIMessageDisplay';
import UIPauseMenu from './UIPauseMenu';
import UIPowerUpDisplay from './UIPowerUpDisplay';
import UIThemeIntegration from './UIThemeIntegration';
import UIMultiplierDisplay from '@/ui/UIMultiplierDisplay';

class UIManager {
  private scene: BreakoutScene;
  private hudContainer: UIHudContainer;
  private scoreDisplay: UIScoreDisplay;
  private livesDisplay: UILivesDisplay;
  private messageDisplay: UIMessageDisplay;
  private pauseMenu: UIPauseMenu;
  private settingsPanel: UISettingsPanel;
  private gameOverPanel: UIGameOverPanel;
  private powerUpDisplay: UIPowerUpDisplay;
  private themeIntegration: UIThemeIntegration;
  private consecutiveHitsText: Phaser.GameObjects.Text | null = null;
  private multiplierDisplay: UIMultiplierDisplay | null = null;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.initializeUI();
  }

  /**
   * Update the lives display
   * @param lives The updated lives count
   */
  public updateLives(lives: number): void {
    // Call the private handler method
    this.handleLivesUpdated(lives);
  }

  /**
   * Update the lives display
   * @param lives The updated lives count
   */
  public showGameOver(score: number): void {
    // Call the private handler method
    this.gameOverPanel.show(score);
  }
  
  /**
   * Update the lives display
   * @param lives The updated lives count
   */
  public updateGameScore(score: number): void {
    // Call the private handler method
    this.scoreDisplay.updateScore(score);
  }
  
/**
 * Update the game theme
 * @param theme The theme name to apply
 */
public updateTheme(theme: string): void {
  // Call the private handler method or directly use the theme integration
  this.themeIntegration.setTheme(theme);
}

/**
 * Handle level update
 * @param level The current level number
 */
public updateLevel(level: number): void {
  // Show level message
  this.showMessage(`Level ${level}`, 2000);
  
  this.scene.getEventManager().emit('levelUpdated', { level });
}

/**
 * Show level complete message
 * @param level The completed level number
 */
public showLevelComplete(level: number): void {
  this.showMessage(`Level ${level} Complete!`, 2000);
}

/**
 * Initialize the UI with default values
 * This method is called when the game first starts
 */
public updateInitialUI(): void {
  // Update score to 0
  this.handleScoreUpdated(0);
  
  // Update lives to default value (typically 3)
  this.handleLivesUpdated(3);
  
  // Show welcome message
  this.showMessage('Get Ready!', 2000);
}

public updateMultiplier(multiplier: number): void {
  if (this.multiplierDisplay) {
    this.multiplierDisplay.updateMultiplier(multiplier);
  }
}
/**
 * Update the consecutive hits display
 * @param hits The number of consecutive hits
 */
public updateConsecutiveHits(hits: number): void {
  if (this.consecutiveHitsText) {
    // Only show if there are hits
    if (hits > 0) {
      this.consecutiveHitsText.setText(`Consecutive Hits: ${hits}`);
      this.consecutiveHitsText.setAlpha(1);
      
      // Animate the text
      this.scene.tweens.add({
        targets: this.consecutiveHitsText,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true,
        ease: 'Power2',
        onComplete: () => {
          if (this.consecutiveHitsText) {
            this.consecutiveHitsText.setScale(1);
          }
        }
      });
    } else {
      // Hide when hits are reset to 0
      this.consecutiveHitsText.setAlpha(0);
    }
  }
}


/**
 * Initialize all UI components
 */
private initializeUI(): void {
  
  const gameWidth = this.scene.scale.width;
  const gameHeight = this.scene.scale.height;

  // Create UI components in order of layering (bottom to top)
  this.hudContainer = new UIHudContainer(this.scene);
  
  // Create HUD components
  this.scoreDisplay = new UIScoreDisplay(this.scene);
  this.livesDisplay = new UILivesDisplay(this.scene);
  
  // Add HUD components to the HUD container
  this.hudContainer.add([
    this.scoreDisplay.getScoreText(), 
    this.livesDisplay.getLivesText()
  ]);
  
  // Create other UI components
  this.powerUpDisplay = new UIPowerUpDisplay(this.scene);
  this.messageDisplay = new UIMessageDisplay(this.scene);
  this.pauseMenu = new UIPauseMenu(this.scene);
  this.settingsPanel = new UISettingsPanel(this.scene); // Pass the scene parameter
  this.gameOverPanel = new UIGameOverPanel(this.scene);
  
  // Initialize theme integration
  this.themeIntegration = new UIThemeIntegration(this.scene);
  this.themeIntegration.initialize(); // Make sure to initialize the theme integration
  this.consecutiveHitsText = this.scene.add.text(
    gameWidth / 2, // Center horizontally
    gameHeight - 40, // Near bottom of screen
    'Consecutive Hits: 0',
    {
      fontFamily: 'Arial',
      fontSize: '16px',
      color: '#ffffff',
      align: 'center'
    }
  );
  this.consecutiveHitsText.setOrigin(0.5);
  this.consecutiveHitsText.setAlpha(0);
  this.multiplierDisplay = new UIMultiplierDisplay(
    this.scene, 
    gameWidth - 70, // Position from right edge
    60 // Position from top edge
  );
  // Set up event listeners
  this.setupEventListeners();
}

  /**
   * Set up event listeners for UI interactions
   */
  private setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    
    // Game state events
    eventManager.on('gameStarted', this.handleGameStarted, this);
    eventManager.on('gamePaused', this.handleGamePaused, this);
    eventManager.on('gameResumed', this.handleGameResumed, this);
    eventManager.on('gameOver', this.handleGameOver, this);
    
    // Gameplay events
    eventManager.on('scoreUpdated', this.handleScoreUpdated, this);
    eventManager.on('livesUpdated', this.handleLivesUpdated, this);
    eventManager.on('levelComplete', this.handleLevelComplete, this);
    eventManager.on('powerUpCollected', this.handlePowerUpCollected, this);
    eventManager.on('powerUpExpired', this.handlePowerUpExpired, this);
    
    // Theme events
    eventManager.on('themeChanged', this.handleThemeChanged, this);
  }

  /**
   * Handle game started event
   */
  private handleGameStarted(): void {
    this.messageDisplay.showMessage('Game Started!', 1500);
  }

  /**
   * Handle game paused event
   */
  private handleGamePaused(): void {
    this.pauseMenu.show();
  }

  /**
   * Handle game resumed event
   */
  private handleGameResumed(): void {
    this.pauseMenu.hide();
  }

  /**
   * Handle game over event
   * @param data Event data containing score and other stats
   */
  private handleGameOver(data: any): void {
    this.gameOverPanel.show(data.score);
  }

  /**
   * Handle score updated event
   * @param score The updated score
   */
  private handleScoreUpdated(score: number): void {
    // Update the score display directly
    this.scoreDisplay.updateScore(score);
  }

  /**
   * Handle lives updated event
   * @param lives The updated lives count
   */
  private handleLivesUpdated(lives: number): void {
    // Update the lives display directly
    this.livesDisplay.updateLives(lives);
  }

  /**
   * Handle level complete event
   * @param level The completed level number
   */
  private handleLevelComplete(level: number): void {
    this.messageDisplay.showMessage(`Level ${level} Complete!`, 2000);
  }

  /**
   * Handle power-up collected event
   * @param data Power-up data
   */
  private handlePowerUpCollected(data: any): void {
    // Make sure to provide all required parameters for addPowerUp
    this.powerUpDisplay.addPowerUp(
      data.type, 
      data.duration, 
      data.icon || 'default-powerup-icon' // Provide a default icon if not in data
    );
    this.messageDisplay.showMessage(`${data.type} Power-Up!`, 1000);
  }

  /**
   * Handle power-up expired event
   * @param data Power-up data
   */
  private handlePowerUpExpired(data: any): void {
    this.powerUpDisplay.removePowerUp(data.type);
  }

  /**
   * Handle theme changed event
   * @param theme The new theme name
   */
  private handleThemeChanged(theme: string): void {
    // Use setTheme instead of applyTheme since that's what's in UIThemeIntegration
    this.themeIntegration.setTheme(theme);
  }

  /**
   * Show a message on screen
   * @param message The message to display
   * @param duration How long to show the message (in ms)
   */
  public showMessage(message: string, duration: number = 2000): void {
    this.messageDisplay.showMessage(message, duration);
  }

  /**
   * Update method to be called in the scene's update loop
   * @param time Current time
   * @param delta Time since last update
   */
  public update(time: number, delta: number): void {
    // Update components that need per-frame updates
    this.powerUpDisplay.update(time, delta);
  }

  /**
   * Apply the NeuralIquid theme to all UI components
   */
  public applyNeuralIquidTheme(): void {
    this.themeIntegration.applyNeuralIquidTheme();
    
    // Apply theme to all UI components
    this.hudContainer.applyNeuralIquidTheme();
    this.scoreDisplay.applyNeuralIquidTheme();
    this.livesDisplay.applyNeuralIquidTheme();
    this.messageDisplay.applyNeuralIquidTheme();
    this.pauseMenu.applyNeuralIquidTheme();
    this.gameOverPanel.applyNeuralIquidTheme();
    this.powerUpDisplay.applyNeuralIquidTheme();
  }

  /**
   * Clean up all UI resources
   */
  public destroy(): void {

    
  if (this.consecutiveHitsText) {
    this.consecutiveHitsText.destroy();
    this.consecutiveHitsText = null;
  }  
  if (this.multiplierDisplay) {
    this.multiplierDisplay.destroy();
    this.multiplierDisplay = null;
  }
    // Clean up all components
    this.hudContainer.destroy();
    this.scoreDisplay.destroy();
    this.livesDisplay.destroy();
    this.messageDisplay.destroy();
    this.pauseMenu.destroy();
    this.settingsPanel.destroy();
    this.gameOverPanel.destroy();
    this.powerUpDisplay.destroy();
    this.themeIntegration.destroy();
    
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    eventManager.off('gameStarted', this.handleGameStarted, this);
    eventManager.off('gamePaused', this.handleGamePaused, this);
    eventManager.off('gameResumed', this.handleGameResumed, this);
    eventManager.off('gameOver', this.handleGameOver, this);
    eventManager.off('scoreUpdated', this.handleScoreUpdated, this);
    eventManager.off('livesUpdated', this.handleLivesUpdated, this);
    eventManager.off('levelComplete', this.handleLevelComplete, this);
    eventManager.off('powerUpCollected', this.handlePowerUpCollected, this);
    eventManager.off('powerUpExpired', this.handlePowerUpExpired, this);
    eventManager.off('themeChanged', this.handleThemeChanged, this);
  }
}

export default UIManager;