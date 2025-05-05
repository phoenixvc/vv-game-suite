import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

class ScoreManager {
  addScore(value: number) {
    throw new Error('Method not implemented.');
  }
  private scene: BreakoutScene;
  private score: number = 0;
  private highScore: number = 0;
  private combo: number = 1;
  private comboTimer: Phaser.Time.TimerEvent | null = null;
  private comboTimeout: number = 2000; // 2 seconds to maintain combo
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Get high score from registry if available
    this.highScore = this.scene.registry.get('highScore') || 0;
  }
  
  /**
   * Increase the player's score
   * @param points Base points to add
   * @param applyCombo Whether to apply combo multiplier
   */
  public increaseScore(points: number, applyCombo: boolean = true): void {
    // Apply combo multiplier if enabled
    const finalPoints = applyCombo ? points * this.combo : points;
    
    // Update score
    this.score += finalPoints;
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateScore({ score: this.score });
    }
    
    // Emit score changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('scoreChanged', { 
        score: this.score, 
        points: finalPoints,
        combo: this.combo
      });
    }
    
    // Update high score if needed
    if (this.score > this.highScore) {
      this.updateHighScore(this.score);
    }
    
    // Increase combo and reset timer
    if (applyCombo) {
      this.increaseCombo();
    }
  }
  
  /**
   * Update the high score
   * @param newHighScore The new high score
   */
  private updateHighScore(newHighScore: number): void {
    this.highScore = newHighScore;
    this.scene.registry.set('highScore', this.highScore);
    
    // Emit high score changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('highScoreChanged', { 
        highScore: this.highScore 
      });
    }
  }
  
  /**
   * Increase the combo multiplier
   */
  private increaseCombo(): void {
    // Increase combo
    this.combo++;
    
    // Cap combo at a reasonable maximum
    if (this.combo > 10) {
      this.combo = 10;
    }
    
    // Reset combo timer
    if (this.comboTimer) {
      this.comboTimer.remove();
    }
    
    // Set new timer to reset combo
    this.comboTimer = this.scene.time.delayedCall(this.comboTimeout, () => {
      this.resetCombo();
    });
    
    // Emit combo changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('comboChanged', { combo: this.combo });
    }
  }
  
  /**
   * Reset the combo multiplier
   */
  private resetCombo(): void {
    if (this.combo > 1) {
      this.combo = 1;
      
      // Emit combo reset event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('comboReset');
      }
    }
  }
  
  /**
   * Get the current score
   */
  public getScore(): number {
    return this.score;
  }
  
  /**
   * Get the current high score
   */
  public getHighScore(): number {
    return this.highScore;
  }
  
  /**
   * Get the current combo multiplier
   */
  public getCombo(): number {
    return this.combo;
  }
  
  /**
   * Reset the score to zero
   */
  public resetScore(): void {
    this.score = 0;
    this.resetCombo();
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateScore({ score: this.score });
    }
    
    // Emit score reset event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('scoreReset');
    }
  }
  
  /**
   * Clean up resources when scene is shut down
   */
  public cleanup(): void {
    if (this.comboTimer) {
      this.comboTimer.remove();
      this.comboTimer = null;
    }
  }
}

export default ScoreManager;