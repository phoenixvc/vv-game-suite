import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import { GAME_STATE } from '../constants/GameConstants';
import { TextUtils } from '../utils/TextUtils';

// Define UI constants
const UI = {
  SCORE: {
    X: 20,
    Y: 20
  },
  LIVES: {
    X: 780, // Assuming 800px width game
    Y: 20
  },
  LEVEL: {
    Y: 20
  },
  THEME: {
    X: 400, // Center of screen (assuming 800px width)
    Y: 50  // Below level text
  }
};

/**
 * UIManager - Manages all UI elements in the game
 * Now with TextUtils integration for bitmap font support
 */
class UIManager {
  private scene: BreakoutScene;
  private scoreText!: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private themeText!: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private messageText!: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
  private gameOverContainer!: Phaser.GameObjects.Container;
  private pauseButton!: Phaser.GameObjects.Image;
  private livesIcons: Phaser.GameObjects.Image[] = [];
  private powerUpIndicators: Map<string, Phaser.GameObjects.Container> = new Map();
  private pausePanel: Phaser.GameObjects.Container | null = null;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createUI();
  }
  
  /**
   * Create all UI elements
   */
  private createUI(): void {
    const { width, height } = this.scene.scale;
    
    // Create score text with TextUtils
    this.scoreText = TextUtils.createScoreText(
      this.scene,
      UI.SCORE.X,
      UI.SCORE.Y,
      0,
      'BTC'
    );
    this.scoreText.setOrigin(0, 0);
    
    // Create lives text with TextUtils
    this.livesText = TextUtils.createLivesText(
      this.scene,
      UI.LIVES.X,
      UI.LIVES.Y,
      GAME_STATE.INITIAL_LIVES,
      'ETH'
    );
    this.livesText.setOrigin(1, 0);
    
    // Create level text with TextUtils
    this.levelText = TextUtils.createLevelText(
      this.scene,
      width / 2,
      UI.LEVEL.Y,
      1
    );
    this.levelText.setOrigin(0.5, 0);
    
    // Create theme text with TextUtils
    this.themeText = TextUtils.createText(
      this.scene,
      width / 2,
      UI.LEVEL.Y + 25,
      'Theme: Default',
      18,
      '#ffff00'
    );
    this.themeText.setOrigin(0.5, 0);
    this.themeText.setAlpha(0.7); // Slightly transparent
    
    // Create message text with TextUtils
    this.messageText = TextUtils.createText(
      this.scene,
      width / 2,
      height / 2,
      '',
      32
    );
    this.messageText.setOrigin(0.5);
    this.messageText.setVisible(false);
    
    // Create game over container (hidden by default)
    this.createGameOverUI();
    
    // Create pause button
    this.createPauseButton();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Create the game over UI
   */
  private createGameOverUI(): void {
    const { width, height } = this.scene.scale;
    
    this.gameOverContainer = this.scene.add.container(
      width / 2,
      height / 2
    );
    
    // Background
    const bg = this.scene.add.rectangle(
      0, 0, 
      width * 0.8, 
      height * 0.6,
      0x000000, 0.8
    );
    bg.setStrokeStyle(2, 0xffffff);
    
    // Game over text with TextUtils
    const gameOverText = TextUtils.createText(
      this.scene,
      0, -100,
      'GAME OVER',
      48,
      '#ff0000'
    );
    gameOverText.setOrigin(0.5);
    gameOverText.setName('gameOverText');
    
    // Final score text with TextUtils
    const finalScoreText = TextUtils.createText(
      this.scene,
      0, -20,
      `Final Score: 0 ${TextUtils.cryptoSymbol('BTC')}`,
      32
    );
    finalScoreText.setOrigin(0.5);
    finalScoreText.setName('finalScoreText');
    
    // Restart button
    const restartButton = this.scene.add.rectangle(
      0, 80,
      200, 60,
      0x0000ff, 1
    );
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.setName('restartButton');
    
    // Restart text with TextUtils
    const restartText = TextUtils.createText(
      this.scene,
      0, 80,
      'RESTART',
      24
    );
    restartText.setOrigin(0.5);
    restartText.setName('restartText');

    // Add elements to container
    this.gameOverContainer.add([bg, gameOverText, finalScoreText, restartButton, restartText]);
    
    // Set up button interaction
    restartButton.on('pointerdown', () => {
      this.scene.scene.restart();
    });
    
    // Hide container initially
    this.gameOverContainer.setVisible(false);
  }
  
  /**
   * Create pause button
   */
  private createPauseButton(): void {
    // Create a simple pause button in the top-right corner
    const pauseButtonBg = this.scene.add.rectangle(
      this.scene.scale.width - 30,
      30,
      40, 40,
      0x333333, 0.8
    );
    pauseButtonBg.setInteractive({ useHandCursor: true });
    
    // Use TextUtils for the pause icon
    const pauseIcon = TextUtils.createText(
      this.scene,
      this.scene.scale.width - 30,
      30,
      '❚❚',
      16
    );
    pauseIcon.setOrigin(0.5);
    
    // Set up button interaction
    pauseButtonBg.on('pointerdown', () => {
      if (this.scene.scene.isPaused()) {
        this.scene.scene.resume();
        this.scene.getEventManager().emit('gameResumed');
      } else {
        this.scene.scene.pause();
        this.scene.getEventManager().emit('gamePaused');
      }
    });
    
    // Store reference
    this.pauseButton = pauseButtonBg as any;
  }
  
  /**
   * Show pause menu
   */
  public showPauseMenu(): void {
    const { width, height } = this.scene.scale;
    
    // Create a container for the pause menu
    this.pausePanel = this.scene.add.container(width / 2, height / 2);
    
    // Add background panel
    const panel = this.scene.add.image(0, 0, 'panel');
    if (!panel.texture.key) {
      // If panel texture failed to load, create a rectangle instead
      const bg = this.scene.add.rectangle(0, 0, 400, 300, 0x000000, 0.8);
      bg.setStrokeStyle(2, 0xffffff);
      this.pausePanel.add(bg);
    } else {
      this.pausePanel.add(panel);
    }
    
    // Add pause title with TextUtils
    const pauseTitle = TextUtils.createTitleText(
      this.scene,
      0,
      -100,
      'GAME PAUSED',
      32
    );
    pauseTitle.setOrigin(0.5);
    this.pausePanel.add(pauseTitle);
    
    // Add resume button
    const resumeButton = this.createButton(0, 0, 'RESUME', () => {
      this.scene.getEventManager().emit('gameResumed');
      this.scene.scene.resume();
      this.hidePauseMenu();
    });
    this.pausePanel.add(resumeButton);
    
    // Add quit button
    const quitButton = this.createButton(0, 80, 'QUIT', () => {
      this.scene.scene.start('MainMenuScene');
    });
    this.pausePanel.add(quitButton);
  }
  
  /**
   * Hide the pause menu
   */
  public hidePauseMenu(): void {
    if (this.pausePanel) {
      this.pausePanel.destroy();
      this.pausePanel = null;
    }
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      // Listen for score updates
      eventManager.on('scoreUpdated', this.updateScore, this);
      eventManager.on('livesUpdated', this.updateLives, this);
      eventManager.on('levelChanged', this.updateLevel, this);
      eventManager.on('themeChanged', this.updateLevelTheme, this);
      eventManager.on('gameOver', this.showGameOver, this);
      eventManager.on('levelComplete', this.showLevelComplete, this);
      eventManager.on('powerUpCollected', this.showPowerUpIndicator, this);
      eventManager.on('powerUpExpired', this.removePowerUpIndicator, this);
      eventManager.on('gamePaused', this.showPauseMenu, this);
      eventManager.on('gameResumed', this.hidePauseMenu, this);
    }
  }
  
  /**
   * Update the initial UI state
   */
  public updateInitialUI(): void {
    // Update score
    this.updateScore({ score: 0 });
    
    // Update lives
    this.updateLives({ lives: 3 });
    
    // Update level
    this.updateLevel({ level: 1 });
    
    // Update theme
    this.updateLevelTheme({ theme: 'Default' });
    
    // Show start message
    this.showMessage('CLICK TO START', 2000);
  }

  /**
   * Update score display
   */
  public updateScore(data: { score: number }): void {
    TextUtils.updateScoreText(this.scoreText, data.score, 'BTC');
  }
  
  /**
   * Update lives display
   */
  public updateLives(data: { lives: number }): void {
    TextUtils.updateLivesText(this.livesText, data.lives, 'ETH');
  }
  
  /**
   * Update level display
   */
  public updateLevel(data: { level: number }): void {
    TextUtils.updateText(this.levelText, `Level ${data.level}`);
  }
  
  /**
   * Update level theme display
   */
  public updateLevelTheme(data: { theme: string } | string): void {
    // Handle both object and string parameter formats
    const theme = typeof data === 'string' ? data : data.theme;
    TextUtils.updateText(this.themeText, `Theme: ${theme}`);
    
    // Apply theme-specific visual changes
    this.applyThemeVisuals(theme);
  }
  
  /**
   * Apply visual changes based on the current theme
   */
  private applyThemeVisuals(theme: string): void {
    let color = '#ffff00'; // Default color
    
    // Apply different visual styles based on the theme
    switch (theme) {
      case 'Night':
        color = '#8080ff';
        break;
      case 'Retro':
        color = '#00ff00';
        break;
      case 'Future':
        color = '#00ffff';
        break;
      case 'Neon':
        color = '#ff00ff';
        break;
    }
    
    // Apply color based on whether it's BitmapText or Text
    if (this.themeText instanceof Phaser.GameObjects.BitmapText) {
      this.themeText.setTint(Phaser.Display.Color.HexStringToColor(color).color);
    } else {
      (this.themeText as Phaser.GameObjects.Text).setStyle({ color });
    }
    
    // Flash the theme text to draw attention to it
    this.scene.tweens.add({
      targets: this.themeText,
      alpha: { from: 1, to: 0.7 },
      duration: 500,
      yoyo: true,
      repeat: 1
    });
  }
  
  /**
   * Show a temporary message
   */
  public showMessage(message: string, duration: number = 2000): void {
    // If messageText already exists, destroy it first
    if (this.messageText) {
      if (this.messageText.getData('timer')) {
        this.scene.time.removeEvent(this.messageText.getData('timer'));
      }
      this.messageText.destroy();
    }
    
    const { width, height } = this.scene.scale;
    
    // Create new message text with TextUtils
    this.messageText = TextUtils.createText(
      this.scene,
      width / 2,
      height / 2 - 50,
      message,
      32
    );
    this.messageText.setOrigin(0.5);
    
    // Add fade out animation
    if (duration > 0) {
      const timer = this.scene.time.delayedCall(duration - 500, () => {
        this.scene.tweens.add({
          targets: this.messageText,
          alpha: 0,
          duration: 500,
          onComplete: () => {
            if (this.messageText) this.messageText.setVisible(false);
          }
        });
      });
      
      this.messageText.setData('timer', timer);
    }
  }
  
  /**
   * Show game over screen
   */
  public showGameOver(data?: any): void {
    // Update final score
    const finalScoreText = this.gameOverContainer.getByName('finalScoreText') as Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text;
    if (finalScoreText) {
      const scoreManager = this.scene.getScoreManager();
      const score = scoreManager ? scoreManager.getScore() : 0;
      TextUtils.updateText(finalScoreText, `Final Score: ${score} ${TextUtils.cryptoSymbol('BTC')}`);
    }
    
    // Show game over container
    this.gameOverContainer.setVisible(true);
  }
  
  /**
   * Show level complete message
   */
  public showLevelComplete(): void {
    this.showMessage('LEVEL COMPLETE!', 2000);
  }
  
  /**
   * Show life lost message
   */
  public showLifeLostMessage(): void {
    this.showMessage('LIFE LOST!', 1500);
  }
  
  /**
   * Create a button with text
   */
  private createButton(
    x: number, 
    y: number, 
    text: string, 
    onClick: () => void
  ): Phaser.GameObjects.Container {
    const button = this.scene.add.container(x, y);
    
    // Add button background
    const bg = this.scene.add.image(0, 0, 'button');
    if (!bg.texture.key) {
      // If button texture failed to load, create a rectangle instead
      const rect = this.scene.add.rectangle(0, 0, 200, 50, 0x444444);
      rect.setStrokeStyle(2, 0xffffff);
      button.add(rect);
    } else {
      button.add(bg);
    }
    
    // Add button text with TextUtils
    const buttonText = TextUtils.createText(this.scene, 0, 0, text, 20);
    buttonText.setOrigin(0.5);
    button.add(buttonText);
    
    // Make button interactive
    bg.setInteractive({ useHandCursor: true })
      .on('pointerdown', onClick)
      .on('pointerover', () => {
        bg.setTint(0x999999);
      })
      .on('pointerout', () => {
        bg.clearTint();
      });
    
    return button;
  }
  
  /**
   * Show power-up indicator
   */
  private showPowerUpIndicator(data: { type: string, duration: number }): void {
    // Create power-up indicator at the bottom of the screen
    const type = data.type;
    const x = 50 + (this.powerUpIndicators.size * 60);
    const y = this.scene.scale.height - 30;
    
    // Create container for the indicator
    const container = this.scene.add.container(x, y);
    
    // Background
    const bg = this.scene.add.circle(0, 0, 25, 0x333333, 0.8);
    
    // Icon or text using TextUtils
    const icon = TextUtils.createText(
      this.scene, 
      0, 
      0, 
      this.getPowerUpIcon(type), 
      16, 
      this.getPowerUpColor(type)
    );
    icon.setOrigin(0.5);
    
    // Add to container
    container.add([bg, icon]);
    
    // Add timer bar
    const timerBar = this.scene.add.rectangle(0, 20, 50, 5, 0x00ff00);
    timerBar.setOrigin(0.5, 0);
    container.add(timerBar);
    
    // Animate timer bar
    this.scene.tweens.add({
      targets: timerBar,
      width: 0,
      duration: data.duration,
      ease: 'Linear'
    });
    
    // Store in map
    this.powerUpIndicators.set(type, container);
    
    // Set timeout to remove indicator
    this.scene.time.delayedCall(data.duration, () => {
      this.removePowerUpIndicator({ type });
    });
  }
  
  /**
   * Remove power-up indicator
   */
  private removePowerUpIndicator(data: { type: string }): void {
    const container = this.powerUpIndicators.get(data.type);
    if (container) {
      container.destroy();
      this.powerUpIndicators.delete(data.type);
      
      // Reposition remaining indicators
      this.repositionPowerUpIndicators();
    }
  }
  
  /**
   * Reposition power-up indicators
   */
  private repositionPowerUpIndicators(): void {
    let index = 0;
    this.powerUpIndicators.forEach((container) => {
      container.x = 50 + (index * 60);
      index++;
    });
  }
  
  /**
   * Get power-up icon
   */
  private getPowerUpIcon(type: string): string {
    switch (type) {
      case 'MULTIBALL': return 'M';
      case 'EXPAND': return 'E';
      case 'SHRINK': return 'S';
      case 'SLOW': return '−';
      case 'FAST': return '+';
      case 'EXTRA_LIFE': return '♥';
      case 'SHIELD': return '◊';
      case 'LASER': return '↑';
      case 'SCORE_MULTIPLIER': return '×2';
      default: return '?';
    }
  }
  
  /**
   * Get power-up color
   */
  private getPowerUpColor(type: string): string {
    switch (type) {
      case 'MULTIBALL': return '#ff00ff';
      case 'EXPAND': return '#00ffff';
      case 'SHRINK': return '#ff0000';
      case 'SLOW': return '#0000ff';
      case 'FAST': return '#ffff00';
      case 'EXTRA_LIFE': return '#ff0000';
      case 'SHIELD': return '#00ff00';
      case 'LASER': return '#ff8800';
      case 'SCORE_MULTIPLIER': return '#8B5CF6';
      default: return '#ffffff';
    }
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('scoreUpdated', this.updateScore, this);
      eventManager.off('livesUpdated', this.updateLives, this);
      eventManager.off('levelChanged', this.updateLevel, this);
      eventManager.off('themeChanged', this.updateLevelTheme, this);
      eventManager.off('gameOver', this.showGameOver, this);
      eventManager.off('levelComplete', this.showLevelComplete, this);
      eventManager.off('powerUpCollected', this.showPowerUpIndicator, this);
      eventManager.off('powerUpExpired', this.removePowerUpIndicator, this);
      eventManager.off('gamePaused', this.showPauseMenu, this);
      eventManager.off('gameResumed', this.hidePauseMenu, this);
    }
    
    // Clear any timers
    if (this.messageText && this.messageText.getData('timer')) {
      this.scene.time.removeEvent(this.messageText.getData('timer'));
    }
    
    // Clear power-up indicators
    this.powerUpIndicators.forEach(container => {
      container.destroy();
    });
    this.powerUpIndicators.clear();
    
    // Clean up UI elements
    if (this.pausePanel) {
      this.pausePanel.destroy();
      this.pausePanel = null;
    }
  }
}

export default UIManager;