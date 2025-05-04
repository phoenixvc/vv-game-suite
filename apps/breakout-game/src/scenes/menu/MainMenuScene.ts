// Example of updating a MainMenuScene to use TextUtils
import * as Phaser from 'phaser';
import { TextUtils } from '../../utils/TextUtils';

export default class MainMenuScene extends Phaser.Scene {
  constructor() {
    super('MainMenuScene');
  }

  create(): void {
    const { width, height } = this.scale;
    
    // Create title text using TextUtils
    const titleText = TextUtils.createTitleText(
      this,
      width / 2,
      height * 0.2,
      'CRYPTO BREAKOUT',
      48,
      '#FFD700'  // Gold color
    );
    titleText.setOrigin(0.5);
    
    // Create start button with TextUtils
    const startButton = this.add.rectangle(width / 2, height * 0.5, 200, 60, 0x4CAF50);
    startButton.setInteractive({ useHandCursor: true });
    
    const startText = TextUtils.createText(
      this,
      width / 2,
      height * 0.5,
      'START GAME',
      28
    );
    startText.setOrigin(0.5);
    
    // Create options button with TextUtils
    const optionsButton = this.add.rectangle(width / 2, height * 0.6, 200, 60, 0x2196F3);
    optionsButton.setInteractive({ useHandCursor: true });
    
    const optionsText = TextUtils.createText(
      this,
      width / 2,
      height * 0.6,
      'OPTIONS',
      28
    );
    optionsText.setOrigin(0.5);
    
    // Set up button interactions
    startButton.on('pointerdown', () => {
      this.scene.start('BreakoutScene');
    });
    
    optionsButton.on('pointerdown', () => {
      this.scene.start('OptionsScene');
    });
  }
}