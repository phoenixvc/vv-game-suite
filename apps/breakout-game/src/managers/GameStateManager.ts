import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { GAME_STATE } from '../constants/GameConstants';

class GameStateManager {
  private scene: BreakoutScene;
  private lives: number;
  private isGameStarted: boolean = false;
  private isGamePaused: boolean = false;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.lives = GAME_STATE.INITIAL_LIVES;
  }
  
  /**
   * Initialize game state
   */
  public initialize(): void {
    // Initialize game state
    this.lives = GAME_STATE.INITIAL_LIVES;
    this.isGameStarted = false;
    this.isGamePaused = false;
    
    // Set up event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.on('gameOver', this.handleGameOver, this);
      eventManager.on('lifeLost', this.handleLifeLost, this);
      eventManager.on('gameStarted', this.handleGameStarted, this);
      eventManager.on('gamePaused', this.handleGamePaused, this);
      eventManager.on('gameResumed', this.handleGameResumed, this);
    }
    
    // Update UI with initial lives
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLives({ lives: this.lives });
    }
  }
  
  /**
   * Handle game over event
   */
  public handleGameOver(data: any): void {
    const uiManager = this.scene.getUIManager();
    if (uiManager && typeof uiManager.showGameOver === 'function') {
      uiManager.showGameOver();
    }
    
    this.scene.scene.pause();
    
    // Allow restart on click
    this.scene.input.once('pointerdown', () => {
      this.scene.scene.restart();
    });
  }
  
  /**
   * Handle life lost event
   */
  public handleLifeLost(data: any): void {
    this.lives--;
    
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLives({ lives: this.lives });
    }
    
    if (this.lives <= 0) {
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('gameOver');
      }
    } else {
      this.resetAfterLifeLost();
    }
  }
  
  /**
   * Reset game state after life lost
   */
  private resetAfterLifeLost(): void {
    // Reset ball
    const ballManager = this.scene.getBallManager();
    if (ballManager && typeof ballManager.resetBall === 'function') {
      const paddleManager = this.scene.getPaddleManager();
      
      // Get paddles as an array
      const paddles = paddleManager ? paddleManager.getPaddles() : [];
      
      // Pass the paddles array to resetBall
      ballManager.resetBall(paddles);
    }
    
    // Show life lost message
    const uiManager = this.scene.getUIManager();
    if (uiManager && typeof uiManager.showLifeLostMessage === 'function') {
      uiManager.showLifeLostMessage();
    }
  }
  
  /**
   * Handle game started event
   */
  public handleGameStarted(data: any): void {
    console.log('Game started');
    this.isGameStarted = true;
    
    // Any additional logic when the game starts
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('gameStateChanged', { state: 'started' });
    }
  }
  
  /**
   * Handle game paused event
   */
  public handleGamePaused(data: any): void {
    this.isGamePaused = true;
    
    // Any additional logic when the game is paused
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('gameStateChanged', { state: 'paused' });
    }
  }
  
  /**
   * Handle game resumed event
   */
  public handleGameResumed(data: any): void {
    this.isGamePaused = false;
    
    // Any additional logic when the game is resumed
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('gameStateChanged', { state: 'resumed' });
    }
  }
  
  /**
   * Get current number of lives
   */
  public getLives(): number {
    return this.lives;
  }
  
  /**
   * Set number of lives
   */
  public setLives(lives: number): void {
    this.lives = lives;
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLives({ lives: this.lives });
    }
  }
  
  /**
   * Add an extra life
   */
  public addLife(): void {
    this.lives++;
    
    // Update UI
    const uiManager = this.scene.getUIManager();
    if (uiManager) {
      uiManager.updateLives({ lives: this.lives });
    }
    
    // Emit event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('lifeAdded', { lives: this.lives });
    }
  }
  
  /**
   * Check if game is started
   */
  public isStarted(): boolean {
    return this.isGameStarted;
  }
  
  /**
   * Check if game is paused
   */
  public isPaused(): boolean {
    return this.isGamePaused;
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('gameOver', this.handleGameOver, this);
      eventManager.off('lifeLost', this.handleLifeLost, this);
      eventManager.off('gameStarted', this.handleGameStarted, this);
      eventManager.off('gamePaused', this.handleGamePaused, this);
      eventManager.off('gameResumed', this.handleGameResumed, this);
    }
  }
}

export default GameStateManager;