import * as Phaser from 'phaser';
import BrickManager from '../managers/BrickManager';
import CollisionManager from '../managers/CollisionManager';
import EventManager from '../managers/EventManager'; // New import for event management
import PaddleController from '../managers/PaddleController';
import PowerUpManager from '../managers/PowerUpManager';
import UIManager from '../managers/UIManager';
import { AdaptiveRenderer } from '../plugins/PerformanceMonitor';
import { MarketSim } from '../simulations/MarketSim';
import { PowerUpType } from '../types/PowerUp';

class BreakoutScene extends Phaser.Scene {
  // Game objects
  private ball!: Phaser.Physics.Matter.Sprite;
  private bricks!: Phaser.GameObjects.Group;
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private powerUps!: Phaser.GameObjects.Group;
  
  // Game state
  private score: number = 0;
  private lives: number = 3;
  private angleFactor: number = 5;
  private marketData: any;
  private ballLaunched: boolean = false;
  
  // Managers
  private brickManager!: BrickManager;
  private collisionManager!: CollisionManager;
  private powerUpManager!: PowerUpManager;
  private uiManager!: UIManager;
  private paddleControllers: Record<string, PaddleController> = {};
  private marketSim!: MarketSim;
  private adaptiveRenderer!: AdaptiveRenderer;
  private eventManager!: EventManager; // New event manager
  private gameContext: any;
  
  // Matter.js collision categories
  private ballCategory: number = 0x0001;
  private paddleCategory: number = 0x0002;
  private brickCategory: number = 0x0004;
  private powerUpCategory: number = 0x0008;
  private wallCategory: number = 0x0010;
  
  constructor() {
    super({ key: 'BreakoutScene' });
  }
  
  // Getters for managers and game properties
  public getBrickManager(): BrickManager {
    return this.brickManager;
  }
  
  public getPowerUpManager(): PowerUpManager {
    return this.powerUpManager;
  }
  
  public getUIManager(): UIManager {
    return this.uiManager;
  }
  
  public getCollisionManager(): CollisionManager {
    return this.collisionManager;
  }
  
  public getAngleFactor(): number {
    return this.angleFactor;
  }
  
  public setAngleFactor(value: number): void {
    this.angleFactor = value;
    this.registry.set('angleFactor', value);
  }
  
  public getMarketSim(): MarketSim {
    return this.marketSim;
  }
  
  public getEventManager(): EventManager {
    return this.eventManager;
  }
  
  init(data: any): void {
    // Initialize game state
    this.score = 0;
    this.lives = 3;
    this.ballLaunched = false;
    this.gameContext = data.gameContext || {};
    
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
    // Load assets with proper paths
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
    // Initialize Matter.js physics
    this.matter.world.setBounds(0, 0, this.scale.width, this.scale.height);
    
    // Initialize managers
    this.eventManager = new EventManager(this); // Initialize event manager first
    this.brickManager = new BrickManager(this);
    this.collisionManager = new CollisionManager(this);
    this.powerUpManager = new PowerUpManager(this);
    this.uiManager = new UIManager(this);
    this.marketSim = new MarketSim();
    
    // Get active paddles from game registry (set by React component)
    const activePaddles = this.registry.get('activePaddles') || ['bottom'];
    const controlType = this.registry.get('controlType') || 'keyboard';
    
    // Create game objects
    this.createGameObjects(activePaddles, controlType);
    
    // Set up collision handlers
    this.setupCollisionHandlers();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Update UI
    this.uiManager.updateScore(this.score);
    this.uiManager.updateLives(this.lives);
    this.uiManager.updateLevel(this.registry.get('level') || 1);
    this.uiManager.updateMarketOverlay(this.marketData);
    this.uiManager.updateLevelTheme(this.registry.get('levelTheme') || 'Default');
    
    // Initialize adaptive renderer for performance monitoring
    try {
      this.adaptiveRenderer = new AdaptiveRenderer(this);
    } catch (error) {
      console.warn('Adaptive renderer not available:', error);
    }
  }
  
  createGameObjects(activePaddles: string[], controlType: string): void {
    // Create ball with Matter.js physics
    this.ball = this.matter.add.sprite(
      this.scale.width / 2, 
      this.scale.height / 2, 
      'ball', 
      undefined, 
      {
        shape: { type: 'circle' },
        friction: 0,
        frictionAir: 0,
        restitution: 1,
        density: 0.01,
        label: 'ball'
      }
    );
    
    // Set ball collision category and what it collides with
    this.ball.setCollisionCategory(this.ballCategory);
    this.ball.setCollidesWith([this.paddleCategory, this.brickCategory, this.wallCategory]);
    
    // Create bricks using market data
    this.bricks = this.add.group();
    const signals = this.marketSim.getInitialSignals();
    this.createBricks(signals);
    
    // Create only the active paddles based on game mode
    this.paddles = [];
    
    if (activePaddles.includes('bottom')) {
      const bottomPaddle = this.createPaddle('bottom');
      this.paddles.push(bottomPaddle);
    }
    
    if (activePaddles.includes('top')) {
      const topPaddle = this.createPaddle('top');
      this.paddles.push(topPaddle);
    }
    
    if (activePaddles.includes('left')) {
      const leftPaddle = this.createPaddle('left');
      this.paddles.push(leftPaddle);
    }
    
    if (activePaddles.includes('right')) {
      const rightPaddle = this.createPaddle('right');
      this.paddles.push(rightPaddle);
    }
    
    // Create power-ups group
    this.powerUps = this.add.group();
  }
  
  createBricks(signals: any[]): void {
    // Clear existing bricks
    this.bricks.clear(true, true);
    
    const rows = 5;
    const cols = 10;
    const brickWidth = 80;
    const brickHeight = 30;
    const startX = (this.scale.width - (cols * brickWidth)) / 2 + brickWidth / 2;
    const startY = 100;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * brickWidth;
        const y = startY + row * brickHeight;
        
        // Create brick with Matter.js physics
        const brick = this.matter.add.sprite(x, y, 'brick', undefined, {
          isStatic: true,
          label: 'brick',
          friction: 0,
          restitution: 1
        });
        
        // Set brick collision category and what it collides with
        brick.setCollisionCategory(this.brickCategory);
        brick.setCollidesWith(this.ballCategory);
        
        // Store brick data
        brick.setData('points', (rows - row) * 10);
        brick.setData('health', row + 1);
        
        // Add to group
        this.bricks.add(brick);
      }
    }
  }
  
  createPaddle(edge: 'top' | 'bottom' | 'left' | 'right'): Phaser.Physics.Matter.Sprite {
    let x = 0;
    let y = 0;
    let width = 100;
    let height = 20;
    let texture = 'paddle';
    let isVertical = false;
    
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
        width = 20;
        height = 100;
        texture = 'paddle-vertical';
        isVertical = true;
        break;
      case 'right':
        x = this.scale.width - 50;
        y = this.scale.height / 2;
        width = 20;
        height = 100;
        texture = 'paddle-vertical';
        isVertical = true;
        break;
    }
    
    // Create paddle with Matter.js physics
    const paddle = this.matter.add.sprite(x, y, texture, undefined, {
      isStatic: true,
      label: `paddle_${edge}`,
      friction: 0,
      restitution: 1
    });
    
    // Set paddle size
    paddle.displayWidth = width;
    paddle.displayHeight = height;
    
    // Set paddle collision category and what it collides with
    paddle.setCollisionCategory(this.paddleCategory);
    paddle.setCollidesWith([this.ballCategory, this.powerUpCategory]);
    
    // Store edge information
    paddle.setData('edge', edge);
    
    // Create a controller for this paddle
    const speed = 10; // Speed for Matter.js is typically lower than Arcade
    const controller = new PaddleController(this, edge, speed);
    controller.setPaddle(paddle);
    this.paddleControllers[edge] = controller;
    
    return paddle;
  }
  
  setupCollisionHandlers(): void {
    // Set up collision handler for ball and bricks
    this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      event.pairs.forEach((pair) => {
        const bodyA = pair.bodyA;
        const bodyB = pair.bodyB;
        
        // Ball-Brick collision
        if (
          (bodyA.label === 'ball' && bodyB.label === 'brick') ||
          (bodyA.label === 'brick' && bodyB.label === 'ball')
        ) {
          const brick = bodyA.label === 'brick' 
            ? bodyA.gameObject as Phaser.Physics.Matter.Sprite
            : bodyB.gameObject as Phaser.Physics.Matter.Sprite;
          
          if (brick && brick.getData) {
            let health = brick.getData('health') - 1;
            
            if (health <= 0) {
              // Brick destroyed
              const points = brick.getData('points') || 10;
              this.increaseScore(points);
              
              // Chance to spawn power-up
              if (Math.random() < 0.2) {
                this.createPowerUp(brick.x, brick.y);
              }
              
              // Remove brick
              this.bricks.remove(brick, true, true);
              brick.destroy();
              
              // Check if level is complete
              if (this.bricks.getLength() === 0) {
                this.eventManager.emit('levelComplete');
              }
            } else {
              // Brick damaged
              brick.setData('health', health);
              // Optionally change brick appearance based on health
              this.eventManager.emit('brickDamaged', { brick, health });
            }
          }
        }
        
        // Ball-Paddle collision
        if (
          (bodyA.label?.startsWith('paddle_') && bodyB.label === 'ball') ||
          (bodyA.label === 'ball' && bodyB.label?.startsWith('paddle_'))
        ) {
          const paddle = bodyA.label?.startsWith('paddle_') 
            ? bodyA.gameObject as Phaser.Physics.Matter.Sprite
            : bodyB.gameObject as Phaser.Physics.Matter.Sprite;
          
          const ball = bodyA.label === 'ball' 
            ? bodyA.gameObject as Phaser.Physics.Matter.Sprite
            : bodyB.gameObject as Phaser.Physics.Matter.Sprite;
          
          if (paddle && ball) {
            // Calculate angle based on where ball hit the paddle
            this.calculateBallAngle(ball, paddle);
            this.eventManager.emit('ballPaddleCollision', { ball, paddle });
          }
        }
        
        // PowerUp-Paddle collision
        if (
          (bodyA.label?.startsWith('paddle_') && bodyB.label?.startsWith('powerup_')) ||
          (bodyA.label?.startsWith('powerup_') && bodyB.label?.startsWith('paddle_'))
        ) {
          const powerUp = bodyA.label?.startsWith('powerup_') 
            ? bodyA.gameObject as Phaser.Physics.Matter.Sprite
            : bodyB.gameObject as Phaser.Physics.Matter.Sprite;
          
          if (powerUp) {
            // Apply power-up effect
            const powerUpType = powerUp.getData('type') as PowerUpType;
            this.powerUpManager.applyPowerUp(powerUpType);
            
            // Remove power-up
            powerUp.destroy();
            
            // Emit event
            this.eventManager.emit('powerUpCollected', { type: powerUpType });
          }
        }
      });
    });
  }
  
  calculateBallAngle(ball: Phaser.Physics.Matter.Sprite, paddle: Phaser.Physics.Matter.Sprite): void {
    const edge = paddle.getData('edge') as 'top' | 'bottom' | 'left' | 'right';
    
    // Calculate relative position of ball on paddle
    let relativePosition = 0;
    
    switch (edge) {
      case 'bottom':
      case 'top':
        relativePosition = (ball.x - (paddle.x - paddle.displayWidth / 2)) / paddle.displayWidth;
        break;
      case 'left':
      case 'right':
        relativePosition = (ball.y - (paddle.y - paddle.displayHeight / 2)) / paddle.displayHeight;
        break;
    }
    
    // Clamp relative position between 0 and 1
    relativePosition = Phaser.Math.Clamp(relativePosition, 0, 1);
    
    // Calculate angle based on relative position and edge
    let angle = 0;
    const baseSpeed = 5;
    let velocityX = 0;
    let velocityY = 0;
    
    switch (edge) {
      case 'bottom':
        angle = Phaser.Math.Linear(150, 30, relativePosition);
        velocityX = baseSpeed * Math.cos(Phaser.Math.DegToRad(angle));
        velocityY = -baseSpeed * Math.sin(Phaser.Math.DegToRad(angle));
        break;
      case 'top':
        angle = Phaser.Math.Linear(210, 330, relativePosition);
        velocityX = baseSpeed * Math.cos(Phaser.Math.DegToRad(angle));
        velocityY = -baseSpeed * Math.sin(Phaser.Math.DegToRad(angle));
        break;
      case 'left':
        angle = Phaser.Math.Linear(300, 60, relativePosition);
        velocityX = baseSpeed * Math.cos(Phaser.Math.DegToRad(angle));
        velocityY = baseSpeed * Math.sin(Phaser.Math.DegToRad(angle));
        break;
      case 'right':
        angle = Phaser.Math.Linear(240, 120, relativePosition);
        velocityX = baseSpeed * Math.cos(Phaser.Math.DegToRad(angle));
        velocityY = baseSpeed * Math.sin(Phaser.Math.DegToRad(angle));
        break;
    }
    
    // Apply angle factor to adjust difficulty
    velocityX *= this.angleFactor / 5;
    velocityY *= this.angleFactor / 5;
    
    // Set ball velocity
    this.matter.body.setVelocity(ball.body as MatterJS.BodyType, {
      x: velocityX,
      y: velocityY
    });
  }
  
  setupEventListeners(): void {
    // Use the event manager for game events
    this.eventManager.on('levelComplete', this.handleLevelComplete, this);
    this.eventManager.on('gameOver', this.handleGameOver, this);
    this.eventManager.on('lifeLost', this.handleLifeLost, this);
    this.eventManager.on('scoreChanged', this.handleScoreChanged, this);
    
    // Click to start
    this.input.on('pointerdown', this.startGame, this);
  }
  
  // New handler methods for events
  handleLifeLost(data: any): void {
    // Additional logic for life lost event
    console.log('Life lost:', data);
  }
  
  handleScoreChanged(data: any): void {
    // Additional logic for score changed event
    console.log('Score changed:', data);
  }
  
  checkBallBounds(): void {
    if (!this.ball || !this.ballLaunched) return;
    
    const ballY = this.ball.y;
    const ballX = this.ball.x;
    
    // Check if ball is out of bounds
    if (
      ballY > this.scale.height + 20 || 
      ballY < -20 || 
      ballX > this.scale.width + 20 || 
      ballX < -20
    ) {
      this.lives--;
      this.uiManager.updateLives(this.lives);
      
      // Emit life lost event
      this.eventManager.emit('lifeLost', { livesRemaining: this.lives });
      
      if (this.lives <= 0) {
        this.eventManager.emit('gameOver');
      } else {
        this.resetBall();
      }
    }
  }
  
  resetBall(): void {
    // Reset ball position
    this.ballLaunched = false;
    
    // Find the bottom paddle if it exists, otherwise use the first paddle
    const bottomPaddle = this.paddles.find(p => p.getData('edge') === 'bottom') || this.paddles[0];
    
    if (bottomPaddle) {
      this.ball.setPosition(bottomPaddle.x, bottomPaddle.y - 20);
      this.matter.body.setVelocity(this.ball.body as MatterJS.BodyType, { x: 0, y: 0 });
    } else {
      this.ball.setPosition(this.scale.width / 2, this.scale.height / 2);
      this.matter.body.setVelocity(this.ball.body as MatterJS.BodyType, { x: 0, y: 0 });
    }
    
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
  
  startGame(): void {
    if (!this.ballLaunched) {
      this.ballLaunched = true;
      
      // Launch the ball
      const angle = Phaser.Math.Between(60, 120);
      const velocityX = 5 * Math.cos(Phaser.Math.DegToRad(angle));
      const velocityY = -5 * Math.sin(Phaser.Math.DegToRad(angle));
      
      this.matter.body.setVelocity(this.ball.body as MatterJS.BodyType, {
        x: velocityX,
        y: velocityY
      });
      
      // Emit game started event
      this.eventManager.emit('gameStarted');
    }
  }
  
  handleLevelComplete(): void {
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
  
  handleGameOver(): void {
    this.uiManager.showGameOver();
    this.scene.pause();
    
    // Allow restart on click
    this.input.once('pointerdown', () => {
      this.scene.restart();
    });
  }
  
  resetLevel(nextLevel: boolean = false): void {
    // Reset ball
    this.resetBall();
    
    // Increment level if needed
    if (nextLevel) {
      const currentLevel = this.registry.get('level') || 1;
      this.registry.set('level', currentLevel + 1);
      this.uiManager.updateLevel(currentLevel + 1);
      
      // Create new bricks with updated market data
      const signals = this.marketSim.getInitialSignals();
      this.createBricks(signals);
      
      // Emit level changed event
      this.eventManager.emit('levelChanged', { level: currentLevel + 1 });
    }
  }
  
  increaseScore(points: number): void {
    this.score += points;
    this.uiManager.updateScore(this.score);
    
    // Emit score changed event
    this.eventManager.emit('scoreChanged', { score: this.score, points });
    
    // Update high score if needed
    const highScore = this.registry.get('highScore') || 0;
    if (this.score > highScore) {
      this.registry.set('highScore', this.score);
      this.eventManager.emit('highScoreChanged', { highScore: this.score });
    }
  }
  
  createPowerUp(x: number, y: number): void {
    // Choose a random power-up type
    const powerUpTypes = Object.values(PowerUpType);
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    
    // Create power-up with Matter.js physics
    const powerUp = this.matter.add.sprite(x, y, `powerup_${randomType}`, undefined, {
      label: `powerup_${randomType}`,
      friction: 0,
      frictionAir: 0.02,
      restitution: 0.8,
      density: 0.001
    });
    
    // Set power-up collision category and what it collides with
    powerUp.setCollisionCategory(this.powerUpCategory);
    powerUp.setCollidesWith([this.paddleCategory, this.wallCategory]);
    
    // Store power-up type
    powerUp.setData('type', randomType);
    
    // Add to group
    this.powerUps.add(powerUp);
    
    // Apply downward velocity
    this.matter.body.setVelocity(powerUp.body as MatterJS.BodyType, {
      x: 0,
      y: 2
    });
    
    // Emit power-up created event
    this.eventManager.emit('powerUpCreated', { type: randomType, x, y });
  }
  
  update(): void {
    // Update paddle controllers
    Object.values(this.paddleControllers).forEach(controller => {
      controller.update();
    });
    
    // Check if ball is out of bounds
    this.checkBallBounds();
  }
}

export default BreakoutScene;