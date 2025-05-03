import BreakoutScene from '../scenes/BreakoutScene';

export class UIManager {
  private scene: BreakoutScene;
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;
  private marketOverlayText: Phaser.GameObjects.Text;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Score display
    this.scoreText = scene.add.text(20, 20, 'Score: 0', { 
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
    
    // Lives display
    this.livesText = scene.add.text(scene.scale.width - 160, 20, 'Lives: 3', {
      fontSize: '24px',
      color: '#FFFFFF',
      fontFamily: 'Arial' 
    }).setScrollFactor(0);
    
    // Create market overlay text
    this.marketOverlayText = scene.add.text(20, 60, '', {
      fontSize: '18px',
      color: '#FFFFFF',
      fontFamily: 'Arial'
    }).setScrollFactor(0);
  }
  
  public updateScoreText(score: number): void {
    this.scoreText.setText(`Score: ${score}`);
  }
  
  public updateLivesText(lives: number): void {
    this.livesText.setText(`Lives: ${lives}`);
  }
  
  public displayMarketDataOverlay(marketData: any): void {
    if (marketData) {
      const overlayText = `Price: ${marketData.price}, Volume: ${marketData.volume}, Trend: ${marketData.trend}`;
      this.marketOverlayText.setText(overlayText);
    }
  }
  
  public showGameOver(): void {
    this.scene.add.text(this.scene.scale.width/2, this.scene.scale.height/2, 'GAME OVER', {
      fontSize: '48px',
      color: '#FF0000'
    }).setOrigin(0.5);
  }
}