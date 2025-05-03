import Phaser from 'phaser';
import { BrickManager } from '../managers/BrickManager';
import { PaddleController } from '../managers/PaddleController';
import { PowerUpManager } from '../managers/PowerUpManager';
import { UIManager } from '../managers/UIManager';
import { Ball } from '../objects/Ball';
import { PowerUpType } from '../types/PowerUp';
// Import the AdaptiveRenderer class from PerformanceMonitor
import { CollisionManager } from '../managers/CollisionManager';
import { AdaptiveRenderer } from '../plugins/PerformanceMonitor';
import { MarketSim } from '../simulations/MarketSim';

class BreakoutScene extends Phaser.Scene {
  // Game objects
  private paddle!: Phaser.Physics.Arcade.Sprite;
  private ball!: Ball;
  private bricks!: Phaser.GameObjects.Group;
  private paddle2!: Phaser.Physics.Arcade.Sprite;
  private paddleLeft!: Phaser.Physics.Arcade.Sprite;
  private paddleRight!: Phaser.Physics.Arcade.Sprite;
  private powerUps!: Phaser.GameObjects.Group;
  
  // Game state
  private score: number = 0;
  private lives: number = 3;
  private edge: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  public angleFactor: number = 5;
  private marketData: any;
  // Managers
  public powerUpManager!: PowerUpManager;
  private paddleController!: PaddleController;
  private paddleController2!: PaddleController;
  private paddleControllerLeft!: PaddleController;
  private paddleControllerRight!: PaddleController;
  public brickManager!: BrickManager;
  private uiManager!: UIManager;
  private marketSim!: MarketSim;
  private collisionManager!: CollisionManager;
  private adaptiveRenderer!: AdaptiveRenderer;
  
  constructor() {
    super({ key: 'Breakout' });
  }
  
  init(data: any): void {
    // Initialize game state
    this.score = 0;
    this.lives = 3;
    this.edge = 'bottom';
    
    // Get angle factor from registry if available
    this.angleFactor = this.registry.get('angleFactor') || 5;
    
    // Get market data from registry if available
    this.marketData = this.registry.get('marketData') || {
      price: 1000,
      volume: 500,
      trend: 'bullish'
    };
  }
  preload(): void {
    this.load.setBaseURL('/assets/games/breakout/');
    this.load.image('ball', 'ball.svg');
    this.load.image('paddle', 'paddle.svg');
    this.load.image('paddle-vertical', 'paddle-vertical.svg');
    this.load.image('brick', 'brick.svg');
    this.load.image('star', 'star.svg');
    
    // Load power-up images
    Object.values(PowerUpType).forEach(type => {
      this.load.image(`powerup_${type}`, `powerup_${type}.svg`);
    });
  }
  
  create(): void {
    // Initialize physics
    this.physics.world.setBoundsCollision(true, true, true, true);
	  
    // Initialize managers
    this.powerUpManager = new PowerUpManager(this);
    this.brickManager = new BrickManager(this);
    this.paddleController = new PaddleController(this, 'bottom');
    this.paddleController2 = new PaddleController(this, 'top');
    this.paddleControllerLeft = new PaddleController(this, 'left');
    this.paddleControllerRight = new PaddleController(this, 'right');
    this.uiManager = new UIManager(this);
    this.marketSim = new MarketSim();
    this.collisionManager = new CollisionManager(this);
    
    // Create game objects
    this.createGameObjects();
    
    // Set up collisions using the collision manager
    this.collisionManager.setupCollisions(
      this.ball, 
      this.bricks as unknown as Phaser.Physics.Arcade.StaticGroup, // Type assertion to match the expected parameter
      [this.paddle, this.paddle2, this.paddleLeft, this.paddleRight],
      this.powerUps as unknown as Phaser.Physics.Arcade.Group // Type assertion for powerUps
    );
	
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize adaptive renderer for performance monitoring
    try {
      this.adaptiveRenderer = new AdaptiveRenderer(this);
    } catch (error) {
      console.warn('Adaptive renderer not available:', error);
    }
  }
  
  update(): void {
    // Update paddle controllers
    this.paddleController.update();
    this.paddleController2.update();
    this.paddleControllerLeft.update();
    this.paddleControllerRight.update();
    
    // Check if ball is out of bounds
    this.checkBallBounds();
    
    // Update UI
    this.uiManager.updateMarketOverlay(this.marketData);
    this.uiManager.updateLevelTheme(this.registry.get('levelTheme') || 'Default');
  }
  
  private createGameObjects(): void {
    // Create ball
    this.ball = new Ball(this, this.scale.width / 2, this.scale.height / 2, 'ball');
    
    // Create paddles
    this.paddle = this.createPaddle('bottom');
    this.paddle2 = this.createPaddle('top');
    this.paddleLeft = this.createPaddle('left');
    this.paddleRight = this.createPaddle('right');
    
    // Set paddles in controllers
    this.paddleController.setPaddle(this.paddle);
    this.paddleController2.setPaddle(this.paddle2);
    this.paddleControllerLeft.setPaddle(this.paddleLeft);
    this.paddleControllerRight.setPaddle(this.paddleRight);
    
    // Create bricks using market data
    this.bricks = this.brickManager.createBricks(this.marketSim.getInitialSignals());
    
    // Get power-ups group
    this.powerUps = this.powerUpManager.getPowerUpsGroup();
  }
  
  private setupEventListeners(): void {
    // Level complete event
    this.events.on('levelComplete', this.handleLevelComplete, this);
    
    // Game over event
    this.events.on('gameOver', this.handleGameOver, this);
    
    // Click to start
    this.input.on('pointerdown', this.startGame, this);
  }
  
  createPaddle(edge: 'top' | 'bottom' | 'left' | 'right'): Phaser.Physics.Arcade.Sprite {
    let x = 0;
    let y = 0;
    let texture = 'paddle';
    switch (edge) {
      case 'top':
        x = this.scale.width / 2;
        y = 50;
        break;
      case 'bottom':
        x = this.scale.width / 2;
        y = this.scale.height - 50;
        break;
      case 'left':
        x = 50;
        y = this.scale.height / 2;
        texture = 'paddle-vertical';
        break;
      case 'right':
        x = this.scale.width - 50;
        y = this.scale.height / 2;
        texture = 'paddle-vertical';
        break;
    }
    
    const paddle = this.physics.add.sprite(x, y, texture)
      .setImmovable(true)
      .setCollideWorldBounds(true);
      
    // Rotate vertical paddles
    if (edge === 'left' || edge === 'right') {
      paddle.setAngle(90);
    }

    return paddle;
  }
  private checkBallBounds(): void {
    if (!this.ball) return;
    
    const ballY = this.ball.y;
    const ballX = this.ball.x;
    
    // Check both vertical and horizontal bounds
    if (ballY > this.scale.height || ballY < 0 || ballX > this.scale.width || ballX < 0) {
      this.lives--;
      this.uiManager.updateLives(this.lives);
    
      if (this.lives <= 0) {
        this.events.emit('gameOver');
      } else {
        this.resetBall();
      }
    }
  }
  
  private resetBall(): void {
    this.ball.resetToPaddle(this.paddle);
    
    // Show life lost message
    const lifeLostText = this.add.text(
      this.scale.width / 2, 
      this.scale.height / 2, 
      'LIFE LOST', 
      { fontSize: '32px', color: '#FF0000' }
    ).setOrigin(0.5);
    
    // Flash the text
    this.tweens.add({
      targets: lifeLostText,
      alpha: 0,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => {
        lifeLostText.destroy();
      }
    });
  }

  private startGame(): void {
    if (this.ball.body && this.ball.body.velocity.y === 0) {
      this.ball.setVelocity(75, -300);
    }
  }
  
  private handleLevelComplete(): void {
    // Show level complete message
    this.uiManager.showLevelComplete();
    
    // Pause the game briefly
    this.scene.pause();
    
    // Resume after delay and reset
    this.time.delayedCall(2000, () => {
      this.scene.resume();
      this.resetLevel(true);
    });
  }
  
  private handleGameOver(): void {
    this.uiManager.showGameOver();
    this.scene.pause();
    
    // Allow restart on click
    this.input.once('pointerdown', () => {
      this.scene.restart();
    });
  }
  
  private resetLevel(nextLevel: boolean = false): void {
    // Reset ball and paddles
    this.resetBall();
    
    // Increment level if needed
    if (nextLevel) {
      const currentLevel = this.registry.get('level') || 1;
      this.registry.set('level', currentLevel + 1);
      this.uiManager.updateLevel(currentLevel + 1);
      
      // Create new bricks with updated market data
      this.bricks = this.brickManager.createBricks(this.marketSim.getInitialSignals());
    }
  }
  
  public increaseScore(points: number): void {
    this.score += points;
    this.uiManager.updateScore(this.score);
    
    // Update high score if needed
    const highScore = this.registry.get('highScore') || 0;
    if (this.score > highScore) {
      this.registry.set('highScore', this.score);
    }
  }
  
  public createPowerUp(x: number, y: number): void {
    this.powerUpManager.createPowerUp(x, y);
  }
}
export default BreakoutScene;
