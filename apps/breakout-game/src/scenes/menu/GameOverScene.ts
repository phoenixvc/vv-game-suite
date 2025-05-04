// Example of updating a GameOverScene to use TextUtils
import * as Phaser from 'phaser';
import { TextUtils } from '../../utils/TextUtils';

export default class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  
  constructor() {
    super('GameOverScene');
  }
  
  init(data: { score: number }): void {
    this.score = data.score || 0;
  }
  
  create(): void {
    const { width, height } = this.scale;
    
    // Create game over text using TextUtils
    const gameOverText = TextUtils.createTitleText(
      this,
      width / 2,
      height * 0.3,
      'GAME OVER',
      48,
      '#FF5252'  // Red color
    );
    gameOverText.setOrigin(0.5);
    
    // Create score text using TextUtils
    const scoreText = TextUtils.createText(
      this,
      width / 2,
      height * 0.4,
      `Final Score: ${this.score} ${TextUtils.cryptoSymbol('BTC')}`,
      32
    );
    scoreText.setOrigin(0.5);
    
    // Create restart button with TextUtils
    const restartButton = this.add.rectangle(width / 2, height * 0.6, 200, 60, 0x4CAF50);
    restartButton.setInteractive({ useHandCursor: true });
    
    const restartText = TextUtils.createText(
      this,
      width / 2,
      height * 0.6,
      'PLAY AGAIN',
      28
    );
    restartText.setOrigin(0.5);
    
    // Create menu button with TextUtils
    const menuButton = this.add.rectangle(width / 2, height * 0.7, 200, 60, 0x2196F3);
    menuButton.setInteractive({ useHandCursor: true });
    
    const menuText = TextUtils.createText(
      this,
      width / 2,
      height * 0.7,
      'MAIN MENU',
      28
    );
    menuText.setOrigin(0.5);
    
    // Set up button interactions
    restartButton.on('pointerdown', () => {
      this.scene.start('BreakoutScene');
    });
    
    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });
  }
}