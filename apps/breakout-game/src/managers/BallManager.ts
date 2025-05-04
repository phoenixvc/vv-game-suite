import * as Phaser from 'phaser';
import { PHYSICS } from '../constants/GameConstants';
import BallController from '../controllers/BallController';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * BallManager - Manages all balls in the game
 */
class BallManager {
  private scene: BreakoutScene;
  private balls: Phaser.Physics.Matter.Sprite[] = [];
  private ballControllers: BallController[] = [];
  private ballTexture: string = 'ball';
  private initialBallVelocity: number = PHYSICS.BALL.INITIAL_VELOCITY;
  private ballAttachedToPaddle: boolean = false;
  private attachedPaddle: Phaser.Physics.Matter.Sprite | null = null;
  private speedFactor: number = 1.0;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    // Listen for game events
    eventManager.on('ballOutOfBounds', this.handleBallOutOfBounds, this);
    eventManager.on('checkLevelProgress', this.checkBallCount, this);
  }
  
  /**
   * Set the speed factor for balls
   * @param factor Speed multiplier to apply to the initial ball velocity
   */
  public setSpeedFactor(factor: number): void {
    this.speedFactor = factor;
    
    // Apply to initial velocity for new balls
    const baseVelocity = PHYSICS.BALL.INITIAL_VELOCITY;
    this.initialBallVelocity = baseVelocity * this.speedFactor;
    
    // Apply to existing balls
    this.applySpeedMultiplier(factor);
    
    // Emit event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballSpeedFactorChanged', { factor: this.speedFactor });
    }
  }
  
  /**
   * Get the current speed factor
   * @returns The current speed factor
   */
  public getSpeedFactor(): number {
    return this.speedFactor;
  }
  
  /**
   * Create a new ball
   * @param options Optional configuration for the new ball
   * @returns The created ball sprite
   */
  public createBall(options: {
    x?: number;
    y?: number;
    velocity?: { x: number; y: number };
    texture?: string;
  } = {}): Phaser.Physics.Matter.Sprite {
    // Default position to center of screen if not specified
    const x = options.x !== undefined ? options.x : this.scene.scale.width / 2;
    const y = options.y !== undefined ? options.y : this.scene.scale.height / 2;
    
    // Create ball sprite
    const ball = this.scene.matter.add.sprite(x, y, options.texture || this.ballTexture);
    
    // Set ball size
    ball.setDisplaySize(16, 16);
    
    // Set ball properties
    ball.setCircle(8);
    ball.setBounce(1);
    ball.setFriction(0);
    ball.setFrictionAir(0);
    ball.setData('id', `ball_${Date.now()}_${this.balls.length}`);
    
    // Create ball controller
    const ballController = new BallController(this.scene, ball);
    ball.setData('controller', ballController);
    
    // Add to arrays
    this.balls.push(ball);
    this.ballControllers.push(ballController);
    
    // Set initial velocity if provided
    if (options.velocity) {
      ball.setVelocity(options.velocity.x, options.velocity.y);
    } else {
      // Default velocity (downward)
      const angle = Math.PI * 1.5; // Straight down
      const vx = Math.cos(angle) * this.initialBallVelocity;
      const vy = Math.sin(angle) * this.initialBallVelocity;
      ball.setVelocity(vx, vy);
    }
    
    // Apply physics category
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager) {
      physicsManager.setCollisionCategory(ball, 'ball');
    }
    
    // Emit event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballCreated', { ball });
    }
    
    return ball;
  }
  
  /**
   * Reset the ball position to the paddle
   * @param paddles Array of available paddles
   */
  public resetBall(paddles: Phaser.Physics.Matter.Sprite[]): void {
    // Clear any existing balls
    this.cleanup();
    
    // Default to the bottom paddle if available
    let paddle = paddles.find(p => p.getData('id') === 'bottom');
    if (!paddle && paddles.length > 0) {
      paddle = paddles[0]; // Use the first paddle if bottom not found
    }
    
    if (paddle) {
      // Create new ball above the paddle
      const paddleY = paddle.y;
      const paddleHeight = paddle.height;
      const paddleEdge = paddle.getData('edge') || 'top';
      
      let ballX = paddle.x;
      let ballY = paddleY;
      
      // Position the ball based on which edge of the paddle is facing inward
      switch (paddleEdge) {
        case 'top':
          ballY = paddleY - paddleHeight / 2 - 10;
          break;
        case 'bottom':
          ballY = paddleY + paddleHeight / 2 + 10;
          break;
        case 'left':
          ballX = paddle.x - paddle.width / 2 - 10;
          break;
        case 'right':
          ballX = paddle.x + paddle.width / 2 + 10;
          break;
      }
      
      // Create ball with no initial velocity
      const ball = this.createBall({
        x: ballX,
        y: ballY,
        velocity: { x: 0, y: 0 }
      });
      
      // Store reference to attached paddle
      this.attachedPaddle = paddle;
      this.ballAttachedToPaddle = true;
      
      // Emit event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('ballReset', { ball, paddle });
      }
    } else {
      // No paddle available, create ball in center
      this.createBall();
      this.ballAttachedToPaddle = false;
    }
  }
  
  /**
   * Launch the ball from its current position
   */
  public launchBall(): void {
    if (!this.ballAttachedToPaddle) {
      return; // Ball is not attached to paddle
    }
    
    const ball = this.getActiveBall();
    if (!ball) {
      return; // No active ball
    }
    
    // Calculate launch angle based on paddle position
    let angle = -Math.PI / 2; // Default: straight up
    
    if (this.attachedPaddle) {
      const paddleEdge = this.attachedPaddle.getData('edge') || 'top';
      
      // Adjust angle based on which edge of the paddle is facing inward
      switch (paddleEdge) {
        case 'top':
          angle = -Math.PI / 2; // Up
          break;
        case 'bottom':
          angle = Math.PI / 2; // Down
          break;
        case 'left':
          angle = -Math.PI; // Left
          break;
        case 'right':
          angle = 0; // Right
          break;
      }
      
      // Add slight randomness to angle
      const randomFactor = this.scene.getAngleFactor ? this.scene.getAngleFactor() : 5;
      angle += (Math.random() - 0.5) * Math.PI / randomFactor;
    }
    
    // Set velocity based on angle
    const vx = Math.cos(angle) * this.initialBallVelocity;
    const vy = Math.sin(angle) * this.initialBallVelocity;
    ball.setVelocity(vx, vy);
    
    // Ball is no longer attached
    this.ballAttachedToPaddle = false;
    this.attachedPaddle = null;
    
    // Emit event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballLaunched', { ball, velocity: { x: vx, y: vy } });
    }
  }
  
  /**
   * Calculate the angle for ball reflection based on where it hit the paddle
   * @param ball The ball sprite
   * @param paddle The paddle sprite
   * @returns The calculated angle in radians
   */
  public calculateBallAngle(ball: Phaser.Physics.Matter.Sprite, paddle: Phaser.Physics.Matter.Sprite): number {
    // Get paddle orientation
    const paddleOrientation = paddle.getData('orientation') || 'horizontal';
    const paddleEdge = paddle.getData('edge') || 'top';
    
    let hitPosition = 0;
    
    if (paddleOrientation === 'horizontal') {
      // For horizontal paddles, use X position
      hitPosition = (ball.x - paddle.x) / (paddle.width / 2);
      
      // Clamp between -1 and 1
      hitPosition = Phaser.Math.Clamp(hitPosition, -1, 1);
      
      // Calculate angle based on hit position
      // The further from center, the more extreme the angle
      const maxAngle = Math.PI / 3; // 60 degrees
      let angle = hitPosition * maxAngle;
      
      // Adjust angle based on which edge of the paddle is facing inward
      if (paddleEdge === 'top') {
        return -Math.PI / 2 + angle; // Upward
      } else {
        return Math.PI / 2 + angle; // Downward
      }
    } else {
      // For vertical paddles, use Y position
      hitPosition = (ball.y - paddle.y) / (paddle.height / 2);
      
      // Clamp between -1 and 1
      hitPosition = Phaser.Math.Clamp(hitPosition, -1, 1);
      
      // Calculate angle based on hit position
      const maxAngle = Math.PI / 3; // 60 degrees
      let angle = hitPosition * maxAngle;
      
      // Adjust angle based on which edge of the paddle is facing inward
      if (paddleEdge === 'left') {
        return Math.PI + angle; // Leftward
      } else {
        return 0 + angle; // Rightward
      }
    }
  }
  
  /**
   * Check if the ball is out of bounds
   * @returns True if any ball is out of bounds
   */
  public checkBallBounds(): boolean {
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    const padding = 50; // Extra padding to ensure ball is truly out
    
    // Check all balls
    for (const ball of this.balls) {
      if (!ball || !ball.active) continue;
      
      // Check if ball is far outside the screen
      if (
        ball.x < -padding ||
        ball.x > width + padding ||
        ball.y < -padding ||
        ball.y > height + padding
      ) {
        return true;
      }
    }
    
    return false;
  }
  
  /**
   * Get the first active ball
   * @returns The first active ball or undefined if none exists
   */
  public getActiveBall(): Phaser.Physics.Matter.Sprite | undefined {
    // Find the first active ball
    for (let i = 0; i < this.balls.length; i++) {
      const ball = this.balls[i];
      if (ball && ball.active) {
        const controller = ball.getData('controller');
        if (controller && controller.isActive !== false) {
          return ball;
        }
      }
    }
    
    return undefined;
  }
  
  /**
   * Get all active balls
   * @returns Array of all active balls
   */
  public getAllBalls(): Phaser.Physics.Matter.Sprite[] {
    return this.balls.filter(ball => {
      if (!ball || !ball.active) return false;
      
      const controller = ball.getData('controller');
      return controller && controller.isActive !== false;
    });
  }
  
  /**
   * Handle ball out of bounds
   */
  private handleBallOutOfBounds(data: { ballId: string }): void {
    // Find the ball by ID
    const ballIndex = this.balls.findIndex(ball => 
      ball && ball.getData('id') === data.ballId
    );
    
    if (ballIndex !== -1) {
      const ball = this.balls[ballIndex];
      const controller = ball.getData('controller') as BallController;
      
      // Remove ball
      if (controller) {
        controller.destroy();
      }
      
      // Remove from arrays
      this.balls.splice(ballIndex, 1);
      this.ballControllers.splice(ballIndex, 1);
      
      // Check if all balls are gone
      if (this.balls.length === 0) {
        // Emit event for life lost
        const eventManager = this.scene.getEventManager();
        if (eventManager) {
          eventManager.emit('allBallsLost');
        }
      }
    }
  }
  
  /**
   * Check if there are any balls left
   */
  private checkBallCount(): void {
    const activeBalls = this.getAllBalls();
    
    if (activeBalls.length === 0) {
      // Emit event for life lost
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('allBallsLost');
      }
    }
  }
  
  /**
   * Create multiple balls
   * @param count Number of balls to create
   * @param options Ball creation options
   */
  public activateMultiBall(count: number = 2, options: any = {}): void {
    // Get active ball position to spawn new balls from
    const activeBall = this.getActiveBall();
    
    if (activeBall) {
      const x = activeBall.x;
      const y = activeBall.y;
      
      // Create additional balls with different angles
      for (let i = 0; i < count; i++) {
        // Calculate angle based on index
        const angle = Math.PI / 4 * (i % 2 === 0 ? 1 : -1) * (Math.floor(i / 2) + 1);
        
        // Calculate velocity
        const speed = this.initialBallVelocity;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Create ball
        this.createBall({
          x,
          y,
          velocity: { x: vx, y: vy },
          texture: options.texture || this.ballTexture
        });
      }
      
      // Emit event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('multiBallActivated', { count });
      }
    } else {
      // If no active ball, create from center
      for (let i = 0; i < count; i++) {
        this.createBall();
      }
    }
  }
  
  /**
   * Apply speed multiplier to all balls
   * @param multiplier Speed multiplier
   */
  public applySpeedMultiplier(multiplier: number): void {
    const balls = this.getAllBalls();
    
    balls.forEach(ball => {
      const controller = ball.getData('controller') as BallController;
      if (controller) {
        controller.multiplyVelocity(multiplier);
      }
    });
    
    // Emit event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballSpeedChanged', { multiplier });
    }
  }
  
  /**
   * Apply effect to all balls
   * @param effect Effect name
   * @param duration Effect duration
   */
  public applyEffectToAllBalls(effect: string, duration?: number): void {
    const balls = this.getAllBalls();
    
    balls.forEach(ball => {
      const controller = ball.getData('controller') as BallController;
      if (controller) {
        controller.applyEffect(effect, duration);
      }
    });
  }
  
  /**
   * Update all balls
   */
  public update(): void {
    // If ball is attached to paddle, update its position
    if (this.ballAttachedToPaddle && this.attachedPaddle) {
      const ball = this.getActiveBall();
      if (ball) {
        const paddle = this.attachedPaddle;
        const paddleEdge = paddle.getData('edge') || 'top';
        
        // Position the ball based on which edge of the paddle is facing inward
        switch (paddleEdge) {
          case 'top':
            ball.x = paddle.x;
            ball.y = paddle.y - paddle.height / 2 - 10;
            break;
          case 'bottom':
            ball.x = paddle.x;
            ball.y = paddle.y + paddle.height / 2 + 10;
            break;
          case 'left':
            ball.x = paddle.x - paddle.width / 2 - 10;
            ball.y = paddle.y;
            break;
          case 'right':
            ball.x = paddle.x + paddle.width / 2 + 10;
            ball.y = paddle.y;
            break;
        }
      }
    }
    
    // Update all ball controllers
    for (let i = this.ballControllers.length - 1; i >= 0; i--) {
      const controller = this.ballControllers[i];
      if (controller) {
        controller.update();
        
        // Check if ball is out of bounds
        if (controller.isOutOfBounds()) {
          const ball = controller.getBall();
          const ballId = ball.getData('id');
          
          // Emit event
          const eventManager = this.scene.getEventManager();
          if (eventManager) {
            eventManager.emit('ballOutOfBounds', { ballId });
          }
        }
      }
    }
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('ballOutOfBounds', this.handleBallOutOfBounds, this);
      eventManager.off('checkLevelProgress', this.checkBallCount, this);
    }
    
    // Destroy all balls
    this.ballControllers.forEach(controller => {
      if (controller) {
        controller.destroy();
      }
    });
    
    // Clear arrays
    this.balls = [];
    this.ballControllers = [];
    
    // Reset state
    this.ballAttachedToPaddle = false;
    this.attachedPaddle = null;
  }
}

export default BallManager;