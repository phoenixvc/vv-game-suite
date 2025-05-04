import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { MarketSim } from '../simulations/MarketSim';

class LevelManager {
  private scene: BreakoutScene;
  private currentLevel: number = 1;
  private levelTheme: string = 'Default';
  private difficultyFactor: number = 1.0;
  private marketSim: MarketSim;
  private levelThemes: string[] = ['Default', 'Night', 'Retro', 'Future', 'Neon'];
  
  constructor(scene: BreakoutScene, marketSim: MarketSim) {
    this.scene = scene;
    this.marketSim = marketSim;
    
    // Get initial level from registry if available
    this.currentLevel = this.scene.registry.get('level') || 1;
    this.levelTheme = this.scene.registry.get('levelTheme') || 'Default';
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners for level-related events
   */
  private setupEventListeners(): void {
    // Get event manager
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    // Listen for level complete event
    eventManager.on('levelComplete', this.completeLevel, this);
    
    // Listen for game reset event
    eventManager.on('gameReset', this.resetLevel, this);
    
    // Listen for theme change request
    eventManager.on('themeChangeRequest', this.handleThemeChangeRequest, this);
  }
  
  private initializeLevelManager(): void {
    const marketSim = this.scene.getMarketSim();
    const levelManager = new LevelManager(this.scene, marketSim);
    this.scene.setLevelManager(levelManager);
    
    // Initialize the first level
    levelManager.initLevel();
  }

  /**
   * Initialize a new level
   */
  public initLevel(): void {
    // Set up level-specific properties
    this.updateDifficultyFactor();
    
    // Create bricks for this level
    this.createBricks();
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLevel({ level: this.currentLevel });
      // Check if updateLevelTheme exists before calling it
      if (typeof uiManager.updateLevelTheme === 'function') {
        uiManager.updateLevelTheme(this.levelTheme);
      }
    }
    
    // Emit level initialized event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('levelInitialized', { 
        level: this.currentLevel,
        theme: this.levelTheme,
        difficulty: this.difficultyFactor
      });
    }
  }
  
  /**
   * Create bricks for the current level
   */
  private createBricks(): void {
    // Get market signals from the market simulator
    const signals = this.marketSim.getInitialSignals();
    
    // Get brick manager and create bricks
    const brickManager = this.scene.getBrickManager();
    if (brickManager && typeof brickManager.createBricksForLevel === 'function') {
      brickManager.createBricksForLevel(this.currentLevel, signals);
    }
  }
    
  /**
   * Handle level completion
   */
  public completeLevel(): void {
    // Show level complete message
    const uiManager = this.scene.getUIManager();
    if (uiManager && typeof uiManager.showLevelComplete === 'function') {
      uiManager.showLevelComplete();
    }
    
    // Pause the game briefly
    this.scene.scene.pause();
    
    // Resume after delay and advance to next level
    this.scene.time.delayedCall(2000, () => {
      this.scene.scene.resume();
      this.advanceToNextLevel();
    });
  }
  
  /**
   * Advance to the next level
   */
  public advanceToNextLevel(): void {
    // Increment level
    this.currentLevel++;
    this.scene.registry.set('level', this.currentLevel);
    
    // Reset the ball
    const ballManager = this.scene.getBallManager();
    const paddleManager = this.scene.getPaddleManager();
    
    if (ballManager && typeof ballManager.resetBall === 'function') {
      // Get paddles from paddle manager
      const paddles = paddleManager ? paddleManager.getPaddles() : [];
      
      // Pass paddles to resetBall
      ballManager.resetBall(paddles);
    }
    
    // Update difficulty
    this.updateDifficultyFactor();
    
    // Possibly change theme every few levels
    if (this.currentLevel % 3 === 0) {
      this.rotateTheme();
    }

    // Create new bricks
    this.createBricks();
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLevel({ level: this.currentLevel });
      
      // Update level theme in UI
      if (typeof uiManager.updateLevelTheme === 'function') {
        uiManager.updateLevelTheme(this.levelTheme);
      }
    }
    
    // Emit level changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('levelChanged', { 
        level: this.currentLevel,
        theme: this.levelTheme,
        difficulty: this.difficultyFactor
      });
    }
  }
  
  /**
   * Reset to level 1
   */
  public resetLevel(): void {
    // Reset to level 1
    this.currentLevel = 1;
    this.scene.registry.set('level', this.currentLevel);
    
    // Reset theme to default
    this.levelTheme = 'Default';
    this.scene.registry.set('levelTheme', this.levelTheme);
    
    // Update difficulty
    this.updateDifficultyFactor();
    
    // Create new bricks
    this.createBricks();
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLevel({ level: this.currentLevel });
      // Check if updateLevelTheme exists before calling it
      if (typeof uiManager.updateLevelTheme === 'function') {
        uiManager.updateLevelTheme(this.levelTheme);
      }
    }
    
    // Emit level reset event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('levelReset', { 
        level: this.currentLevel,
        theme: this.levelTheme,
        difficulty: this.difficultyFactor
      });
    }
  }
  
  /**
   * Rotate to the next theme
   */
  private rotateTheme(): void {
    const currentIndex = this.levelThemes.indexOf(this.levelTheme);
    const nextIndex = (currentIndex + 1) % this.levelThemes.length;
    this.setLevelTheme(this.levelThemes[nextIndex]);
  }
  
  /**
   * Handle theme change request
   */
  private handleThemeChangeRequest(data: any): void {
    if (data && data.theme && this.levelThemes.includes(data.theme)) {
      this.setLevelTheme(data.theme);
    } else {
      this.rotateTheme();
    }
  }
  
  /**
   * Update the difficulty factor based on current level
   */
  private updateDifficultyFactor(): void {
    // Increase difficulty with each level
    this.difficultyFactor = 1.0 + (this.currentLevel - 1) * 0.1;
    
    // Cap difficulty at a reasonable maximum
    if (this.difficultyFactor > 2.0) {
      this.difficultyFactor = 2.0;
    }
    
    // Update ball speed or other game parameters based on difficulty
    const ballManager = this.scene.getBallManager();
    if (ballManager && typeof ballManager.setSpeedFactor === 'function') {
      ballManager.setSpeedFactor(this.difficultyFactor);
    }
  }
  
  /**
   * Get the current level number
   */
  public getCurrentLevel(): number {
    return this.currentLevel;
  }
  
  /**
   * Get the current level theme
   */
  public getLevelTheme(): string {
    return this.levelTheme;
  }
  
  /**
   * Set the level theme
   */
  public setLevelTheme(theme: string): void {
    this.levelTheme = theme;
    this.scene.registry.set('levelTheme', theme);
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager && typeof uiManager.updateLevelTheme === 'function') {
      uiManager.updateLevelTheme(theme);
    }
    
    // Emit theme changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('themeChanged', { theme });
    }
  }
  
  /**
   * Get the current difficulty factor
   */
  public getDifficultyFactor(): number {
    return this.difficultyFactor;
  }
  
  /**
   * Clean up event listeners when scene is shut down
   */
  public cleanup(): void {
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    eventManager.off('levelComplete', this.completeLevel, this);
    eventManager.off('gameReset', this.resetLevel, this);
    eventManager.off('themeChangeRequest', this.handleThemeChangeRequest, this);
  }
}

export default LevelManager;