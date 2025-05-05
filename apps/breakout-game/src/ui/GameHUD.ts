import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

/**
 * Game HUD (Heads-Up Display) for Breakout
 * Handles UI elements like score, lives, level, and ball speed
 */
export default class GameHUD {
  private scene: BreakoutScene;
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;
  private ballHitCounterText!: Phaser.GameObjects.Text; // Ball hit counter
  private paddleHitCounterText!: Phaser.GameObjects.Text; // Paddle hit counter
  private speedMeter!: Phaser.GameObjects.Container;
  private speedBar!: Phaser.GameObjects.Rectangle;
  private speedText!: Phaser.GameObjects.Text;
  private hudContainer!: Phaser.GameObjects.Container;
  private hudBackground!: Phaser.GameObjects.Rectangle;
  
  // Configuration
  private hudHeight = 50; // Increased height to accommodate counters
  private padding = 10;
  private maxBallSpeed = 20; // Maximum expected ball speed for meter
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.createHUD();
    this.setupEventListeners();
  }
  
  /**
   * Create the HUD elements
   */
  private createHUD(): void {
    const { width, height } = this.scene.scale;
    
    // Create container for HUD at the top of the screen
    // FIXED: Moved the HUD container to the very top of the screen
    this.hudContainer = this.scene.add.container(0, 0);
    
    // Create semi-transparent background for HUD
    this.hudBackground = this.scene.add.rectangle(
      width / 2, 
      this.hudHeight / 2, 
      width, 
      this.hudHeight, 
      0x000000, 
      0.7
    );
    this.hudContainer.add(this.hudBackground);
    
    // Create score text (left side) - FIXED: Positioned at the very top
    this.scoreText = this.scene.add.text(
      this.padding, 
      this.hudHeight / 3, 
      'Score: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '18px', 
        color: '#ffffff' 
      }
    ).setOrigin(0, 0.5);
    this.hudContainer.add(this.scoreText);
    
    // Create level text (center) - FIXED: Positioned at the very top
    this.levelText = this.scene.add.text(
      width / 2, 
      this.hudHeight / 3, 
      'Level: 1', 
      { 
        fontFamily: 'Arial', 
        fontSize: '18px', 
        color: '#ffffff' 
      }
    ).setOrigin(0.5, 0.5);
    this.hudContainer.add(this.levelText);
    
    // Create lives text (right side) - FIXED: Positioned at the very top
    this.livesText = this.scene.add.text(
      width - this.padding, 
      this.hudHeight / 3, 
      'Lives: 3', 
      { 
        fontFamily: 'Arial', 
        fontSize: '18px', 
        color: '#ffffff' 
      }
    ).setOrigin(1, 0.5);
    this.hudContainer.add(this.livesText);
    
    // Create ball hit counter text (left of level text)
    this.ballHitCounterText = this.scene.add.text(
      width / 2 - 100, 
      this.hudHeight * 2/3, 
      'Ball Hits: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '16px', 
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5, 0.5);
    this.hudContainer.add(this.ballHitCounterText);
    
    // Create paddle hit counter text (right of level text)
    this.paddleHitCounterText = this.scene.add.text(
      width / 2 + 100, 
      this.hudHeight * 2/3, 
      'Paddle Hits: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '16px', 
        color: '#00ffff',
        stroke: '#000000',
        strokeThickness: 2
      }
    ).setOrigin(0.5, 0.5);
    this.hudContainer.add(this.paddleHitCounterText);
    
    // Create speed meter container (bottom right)
    this.speedMeter = this.scene.add.container(width - 120, height - 30);
    
    // Create speed meter background
    const speedMeterBg = this.scene.add.rectangle(0, 0, 100, 15, 0x333333);
    this.speedMeter.add(speedMeterBg);
    
    // Create speed meter bar
    this.speedBar = this.scene.add.rectangle(-50, 0, 0, 13, 0x00ff00);
    this.speedBar.setOrigin(0, 0.5);
    this.speedMeter.add(this.speedBar);
    
    // Create speed text
    this.speedText = this.scene.add.text(
      0, 
      -15, 
      'Speed: 0', 
      { 
        fontFamily: 'Arial', 
        fontSize: '14px', 
        color: '#ffffff' 
      }
    ).setOrigin(0.5, 1);
    this.speedMeter.add(this.speedText);
    
    // Make sure HUD is always on top
    this.hudContainer.setDepth(1000);
    this.speedMeter.setDepth(1000);
    
    // Adjust the game's bounds to account for the HUD
    this.adjustGameBounds();
  }
  
  /**
   * Adjust the game's physics bounds to account for the HUD
   */
  private adjustGameBounds(): void {
    // If we have a physics manager, adjust the world bounds
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager && typeof physicsManager.setWorldBounds === 'function') {
      const { width, height } = this.scene.scale;
      
      // FIXED: Increased the top gap to ensure game objects don't overlap with the HUD
      const topGap = this.hudHeight + 15; // Increased gap for better separation
      physicsManager.setWorldBounds(0, topGap, width, height - topGap - 5);
    }
  }
  
  /**
   * Get the HUD height
   */
  public getHudHeight(): number {
    return this.hudHeight;
  }
  
  /**
   * Set up event listeners for game state changes
   */
  private setupEventListeners(): void {
    // Get event manager if available
    const eventManager = this.scene.getEventManager?.();
    if (!eventManager) return;
    
    // Listen for score updates
    eventManager.on('scoreUpdated', this.updateScore, this);
    
    // Listen for lives updates
    eventManager.on('livesUpdated', this.updateLives, this);
    
    // Listen for level updates
    eventManager.on('levelUpdated', this.updateLevel, this);
    
    // Listen for consecutive ball hit updates
    eventManager.on('consecutiveHitUpdated', this.updateBallHitCounter, this);
    
    // Listen for consecutive paddle hit updates
    eventManager.on('consecutivePaddleHitUpdated', this.updatePaddleHitCounter, this);
    
    // Update speed in the game loop
    this.scene.events.on('update', this.updateBallSpeed, this);
  }
  
  /**
   * Update the score display
   */
  private updateScore(data: { score: number }): void {
    this.scoreText.setText(`Score: ${data.score}`);
  }
  
  /**
   * Update the lives display
   */
  private updateLives(data: { lives: number }): void {
    this.livesText.setText(`Lives: ${data.lives}`);
  }
  
  /**
   * Update the level display
   */
  private updateLevel(data: { level: number }): void {
    this.levelText.setText(`Level: ${data.level}`);
  }
  
  /**
   * Update the consecutive ball hit counter display
   */
  private updateBallHitCounter(data: { hits: number }): void {
    // Update the text
    this.ballHitCounterText.setText(`Ball Hits: ${data.hits}`);
    
    // Scale effect for visual feedback
    this.scene.tweens.add({
      targets: this.ballHitCounterText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Change color based on hit count for visual feedback
    if (data.hits >= 10) {
      this.ballHitCounterText.setColor('#ff0000'); // Red for high combo
    } else if (data.hits >= 5) {
      this.ballHitCounterText.setColor('#ffaa00'); // Orange for medium combo
    } else {
      this.ballHitCounterText.setColor('#ffff00'); // Yellow for low combo
    }
  }
  
  /**
   * Update the consecutive paddle hit counter display
   */
  private updatePaddleHitCounter(data: { hits: number }): void {
    // Update the text
    this.paddleHitCounterText.setText(`Paddle Hits: ${data.hits}`);
    
    // Scale effect for visual feedback
    this.scene.tweens.add({
      targets: this.paddleHitCounterText,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 100,
      yoyo: true,
      ease: 'Power2'
    });
    
    // Change color based on hit count for visual feedback
    if (data.hits >= 10) {
      this.paddleHitCounterText.setColor('#ff00ff'); // Magenta for high combo
    } else if (data.hits >= 5) {
      this.paddleHitCounterText.setColor('#00ffaa'); // Teal for medium combo
    } else {
      this.paddleHitCounterText.setColor('#00ffff'); // Cyan for low combo
    }
  }
  
  /**
   * Update the ball speed meter
   */
  private updateBallSpeed(): void {
    // Get ball manager
    const ballManager = this.scene.getBallManager?.();
    if (!ballManager) return;
    
    // Get active ball
    const balls = ballManager.getAllBalls();
    if (!balls || balls.length === 0) {
      // No active balls, show speed as 0
      this.updateSpeedMeter(0);
      return;
    }
    
    // Calculate average speed of all balls
    let totalSpeed = 0;
    let maxSpeed = 0;
    
    balls.forEach(ball => {
      if (ball.body) {
        const velocity = ball.body.velocity;
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        totalSpeed += speed;
        maxSpeed = Math.max(maxSpeed, speed);
      }
    });
    
    // Use max speed for the meter
    this.updateSpeedMeter(maxSpeed);
  }
  
  /**
   * Update the speed meter display
   */
  private updateSpeedMeter(speed: number): void {
    // Calculate percentage of max speed
    const percentage = Math.min(speed / this.maxBallSpeed, 1);
    
    // Update bar width (max width is 100)
    const barWidth = percentage * 100;
    this.speedBar.width = barWidth;
    
    // Update bar color based on speed
    if (percentage < 0.3) {
      this.speedBar.fillColor = 0x00ff00; // Green for slow
    } else if (percentage < 0.7) {
      this.speedBar.fillColor = 0xffff00; // Yellow for medium
    } else {
      this.speedBar.fillColor = 0xff0000; // Red for fast
    }
    
    // Update speed text
    this.speedText.setText(`Speed: ${speed.toFixed(1)}`);
  }
  
  /**
   * Clean up event listeners
   */
  public destroy(): void {
    // Get event manager if available
    const eventManager = this.scene.getEventManager?.();
    if (eventManager) {
      eventManager.off('scoreUpdated', this.updateScore, this);
      eventManager.off('livesUpdated', this.updateLives, this);
      eventManager.off('levelUpdated', this.updateLevel, this);
      eventManager.off('consecutiveHitUpdated', this.updateBallHitCounter, this);
      eventManager.off('consecutivePaddleHitUpdated', this.updatePaddleHitCounter, this);
    }
    
    this.scene.events.off('update', this.updateBallSpeed, this);
    
    // Destroy game objects
    this.hudContainer.destroy();
    this.speedMeter.destroy();
  }
}