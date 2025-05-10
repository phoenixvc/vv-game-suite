import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

class ScoreManager {
  private scene: BreakoutScene;
  private score: number = 0;
  private highScore: number = 0;
  private combo: number = 1;
  private comboTimer: Phaser.Time.TimerEvent | null = null;
  private comboTimeout: number = 2000; // 2 seconds to maintain combo
  private consecutiveHitMultiplier: number = 1; // Multiplier based on consecutive paddle hits
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Get high score from registry if available
    this.highScore = this.scene.registry.get('highScore') || 0;
    
    // Set up event listeners for consecutive hits
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.on('consecutiveHitUpdated', this.handleConsecutiveHitUpdated, this);
      eventManager.on('consecutiveHitReset', this.handleConsecutiveHitReset, this);
    }
  }
  
  /**
   * Handle consecutive hit updates
   */
  private handleConsecutiveHitUpdated(data: { hits: number }): void {
    // Calculate multiplier based on consecutive hits
    // Formula: Base multiplier + (hits * 0.1) capped at a reasonable maximum
    this.consecutiveHitMultiplier = Math.min(1 + (data.hits * 0.1), 3);
    
    // Show visual feedback for multiplier
    const uiManager = this.scene.getUIManager();
    if (uiManager && typeof uiManager.updateMultiplier === 'function') {
      uiManager.updateMultiplier(this.consecutiveHitMultiplier);
    }
    
    // Emit event for other systems
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('multiplierChanged', { 
        multiplier: this.consecutiveHitMultiplier,
        source: 'consecutiveHits'
      });
    }
  }
  
  /**
   * Handle consecutive hit reset
   */
  private handleConsecutiveHitReset(): void {
    // Reset multiplier to base value
    this.consecutiveHitMultiplier = 1;
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager && typeof uiManager.updateMultiplier === 'function') {
      uiManager.updateMultiplier(this.consecutiveHitMultiplier);
    }
    
    // Emit event for other systems
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('multiplierChanged', { 
        multiplier: this.consecutiveHitMultiplier,
        source: 'consecutiveHits'
      });
    }
  }
  
  /**
   * Add points to the score (alias for increaseScore for compatibility)
   * @param points Points to add
   */
  public addScore(points: number): void {
    this.increaseScore(points);
  }
  
  /**
   * Increase the player's score
   * @param points Base points to add
   * @param applyCombo Whether to apply combo multiplier
   * @param applyConsecutiveHits Whether to apply consecutive hits multiplier
   */
  public increaseScore(
    points: number, 
    applyCombo: boolean = true, 
    applyConsecutiveHits: boolean = true
  ): void {
    // Calculate multipliers
    let totalMultiplier = 1;
    
    if (applyCombo) {
      totalMultiplier *= this.combo;
    }
    
    if (applyConsecutiveHits) {
      totalMultiplier *= this.consecutiveHitMultiplier;
    }
    
    // Apply multiplier to points
    const finalPoints = Math.round(points * totalMultiplier);
    
    // Update score
    this.score += finalPoints;
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateGameScore(this.score);
    }
    
    // Emit score changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('scoreChanged', { 
        score: this.score, 
        points: finalPoints,
        combo: this.combo,
        consecutiveHitMultiplier: this.consecutiveHitMultiplier,
        totalMultiplier: totalMultiplier
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
   * Get the consecutive hit multiplier
   */
  public getConsecutiveHitMultiplier(): number {
    return this.consecutiveHitMultiplier;
  }
  
  /**
   * Get the total multiplier (combo * consecutive hits)
   */
  public getTotalMultiplier(): number {
    return this.combo * this.consecutiveHitMultiplier;
  }
  
  /**
   * Reset the score to zero
   */
  public resetScore(): void {
    this.score = 0;
    this.resetCombo();
    this.consecutiveHitMultiplier = 1;
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateGameScore(this.score);
      
      if (typeof uiManager.updateMultiplier === 'function') {
        uiManager.updateMultiplier(1);
      }
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
    
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('consecutiveHitUpdated', this.handleConsecutiveHitUpdated, this);
      eventManager.off('consecutiveHitReset', this.handleConsecutiveHitReset, this);
    }
  }
}

export default ScoreManager;