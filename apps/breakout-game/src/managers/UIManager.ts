import Phaser from 'phaser';
export class UIManager {
  private scene: Phaser.Scene;
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private levelText: Phaser.GameObjects.Text;
  private marketOverlayText: Phaser.GameObjects.Text;
  private levelThemeText: Phaser.GameObjects.Text;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Create score text
    this.scoreText = this.scene.add.text(20, 20, 'Score: 0', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
    
    // Create lives text
    this.livesText = this.scene.add.text(this.scene.scale.width - 160, 20, 'Lives: 3', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
    
    // Create level text
    this.levelText = this.scene.add.text(this.scene.scale.width / 2, 20, 'Level: 1', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setScrollFactor(0);
    
    // Create market overlay text
    this.marketOverlayText = this.scene.add.text(20, 60, '', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
    
    // Create level theme text
    this.levelThemeText = this.scene.add.text(this.scene.scale.width / 2, 50, '', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5).setScrollFactor(0);
  }
  
  updateScore(score: number): void {
    this.scoreText.setText(`Score: ${score}`);
  }
  
  updateLives(lives: number): void {
    this.livesText.setText(`Lives: ${lives}`);
  }
  
  updateLevel(level: number): void {
    this.levelText.setText(`Level: ${level}`);
    }
  
  updateMarketOverlay(marketData: any): void {
    if (marketData) {
      const overlayText = `Price: ${marketData.price}, Volume: ${marketData.volume}, Trend: ${marketData.trend}`;
      this.marketOverlayText.setText(overlayText);
    }
  }
  
  updateLevelTheme(theme: string): void {
    this.levelThemeText.setText(`Theme: ${theme}`);
  }
  showGameOver(): void {
    this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'GAME OVER', {
      fontSize: '48px',
      color: '#FF0000',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2 + 60, 'Click to restart', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
  }
  
  showLevelComplete(): void {
    this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2, 'LEVEL COMPLETE!', {
      fontSize: '48px',
      color: '#00FF00',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
    
    this.scene.add.text(this.scene.scale.width / 2, this.scene.scale.height / 2 + 60, 'Next level starting...', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setOrigin(0.5);
}
}