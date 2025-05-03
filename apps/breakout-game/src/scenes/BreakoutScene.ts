import { Ball } from '../objects/Ball';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpManager } from '../managers/PowerUpManager';
import { PaddleController } from '../managers/PaddleController';
import { BrickManager, MarketSignal } from '../managers/BrickManager';
import { UIManager } from '../managers/UIManager';

class BreakoutScene extends Phaser.Scene {
  private ball!: Ball;
  private score: number = 0;
  private lives: number = 3;
  private marketSim!: MarketSim;
  private marketData: any;
  private edge: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
  private angleFactor: number = 5;
  
  // Managers
  private powerUpManager!: PowerUpManager;
  private paddleController!: PaddleController;
  private brickManager!: BrickManager;
  private uiManager!: UIManager;
  constructor(angleFactor: number) {
    super({ key: 'Breakout', active: true });
    this.angleFactor = angleFactor;
  }
  
  preload() {
    this.load.setBaseURL('/assets/games/breakout/');
    this.load.image('ball', 'ball.svg');
    this.load.image('paddle', 'paddle.svg');
    this.load.image('paddle-vertical', 'paddle-vertical.svg');
    this.load.image('brick', 'brick.svg');
    this.load.image('star', 'star.svg'); // For particle effects
    this.load.image('powerup_extraLife', 'powerup_extraLife.svg');
    this.load.image('powerup_paddleGrow', 'powerup_paddleGrow.svg');
    this.load.image('powerup_shield', 'powerup_shield.svg');
  }
  
  create() {
    // Initialize physics
    this.physics.world.setBoundsCollision(true, true, true, true);
	  
    // Initialize managers
    this.paddleController = new PaddleController(this, this.edge);
    this.brickManager = new BrickManager(this);
    this.powerUpManager = new PowerUpManager(this);
    this.uiManager = new UIManager(this);
    // Create bricks using simulated market data
    this.marketSim = new MarketSim();
    const bricks = this.brickManager.createBricks(this.marketSim.getInitialSignals());
	  
    // Set up game objects
    this.ball = new Ball(this, 400, 500, 'ball');
	  
    // Collision setup
    this.physics.add.collider(
      this.ball, 
      bricks, 
      this.brickManager.hitBrick.bind(this.brickManager), 
      null, 
      this
    );
		
    this.physics.add.collider(
      this.ball, 
      this.paddleController.getPaddle(), 
      this.hitPaddle, 
      null, 
      this
    );
    
    // Input handling
    this.input.keyboard?.createCursorKeys();
    
    // Performance monitoring
    this.game.events.on('poststep', () => {
      PerformanceMonitor.trackFPS(this.game.loop.actualFps);
    });
    // Fetch market data from registry
    this.marketData = this.registry.get('marketData');
  }
  
  update() {
    // Paddle movement
    this.paddleController.controlPaddle();
    
    // Ball reset logic
    if (this.ball.y > this.scale.height) {
      if (this.powerUpManager.isShieldActive()) {
        // Shield is active, bounce the ball back up instead of losing a life
        this.ball.setVelocityY(-this.ball.body.velocity.y);
        // Position the ball just above the bottom edge to prevent multiple triggers
        this.ball.y = this.scale.height - 5;
      } else {
        // No shield, lose a life
        this.lives--;
        this.uiManager.updateLivesText(this.lives);
        
        if(this.lives <= 0) {
          this.gameOver();
        } else {
          this.resetBall();
        }
      }
    }
    
    // Check for power-up collection
    this.physics.overlap(
      this.paddleController.getPaddle(), 
      this.powerUpManager.getPowerUps(), 
      this.powerUpManager.collectPowerUp.bind(this.powerUpManager), 
      null, 
      this
    );
    
    // Display market data overlay
    this.uiManager.displayMarketDataOverlay(this.marketData);
  }

  private hitPaddle(
    object1: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    object2: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    // Extract the game objects
    const ball = object1 as unknown as Phaser.GameObjects.GameObject;
    const paddle = object2 as unknown as Phaser.Physics.Arcade.Sprite;
    
    if (this.edge === 'bottom' || this.edge === 'top') {
      const diff = ball.x - paddle.x;
      ball.body.velocity.x = diff * this.angleFactor;
      ball.body.velocity.y *= -1;
      if (this.edge === 'top') ball.body.velocity.y = Math.abs(ball.body.velocity.y);
      else ball.body.velocity.y = -Math.abs(ball.body.velocity.y);
    } else {
      const diff = ball.y - paddle.y;
      ball.body.velocity.y = diff * this.angleFactor;
      ball.body.velocity.x *= -1;
      if (this.edge === 'left') ball.body.velocity.x = Math.abs(ball.body.velocity.x);
      else ball.body.velocity.x = -Math.abs(ball.body.velocity.x);
    }
  }
  
  private resetBall() {
    this.ball.resetToPaddle(this.paddleController.getPaddle());
  }
  
  private gameOver() {
    this.scene.pause();
    this.uiManager.showGameOver();
  }
  
  // Public methods for managers to use
  public getBall(): Ball {
    return this.ball;
  }
  
  public getPaddle(): Phaser.Physics.Arcade.Sprite {
    return this.paddleController.getPaddle();
  }
  
  public increaseScore(points: number): void {
    this.score += points;
    this.uiManager.updateScoreText(this.score);
  }
  
  public addLife(): void {
    this.lives++;
    this.uiManager.updateLivesText(this.lives);
  }
  
  public createPowerUp(x: number, y: number): void {
    this.powerUpManager.createPowerUp(x, y);
  }
  
  public addShield(): void {
    this.powerUpManager.addShield();
  }
  
  shutdown() {
    // Clean up all managers
    this.powerUpManager.cleanup();
    
    // Call parent shutdown
    super.shutdown();
  }
}
// Simulated market data class
class MarketSim {
  getInitialSignals(): MarketSignal[] {
    // Stub for real data integration
    return Array(60).fill(null).map((_,i) => ({
      position: i,
      value: Phaser.Math.Between(50, 200),
      type: ['liquidity', 'price', 'volume'][i%3]
    }));
  }
}

export default BreakoutScene;
