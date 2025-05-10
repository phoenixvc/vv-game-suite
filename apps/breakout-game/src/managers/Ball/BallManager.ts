import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { Body as MatterBody } from 'matter-js';
import * as Phaser from 'phaser';
import { PHYSICS } from '../../constants/GameConstants';
import BallController from '../../controllers/BallController';
import BallEventHandler from './BallEventHandler';
import BallFactory from './BallFactory';
import BallInputHandler from './BallInputHandler';
import BallLauncher from './BallLauncher';
import BallPositioner from './BallPositioner';
import BallStateManager from './BallStateManager';
import BallUIManager from './BallUIManager';

/**
 * Manages all balls in the game
 */
class BallManager {
  private scene: BreakoutScene;
  
  // Speed settings
  private initialBallSpeed: number = PHYSICS.BALL.INITIAL_VELOCITY;
  private minBallSpeed: number = PHYSICS.BALL.MIN_VELOCITY;
  private maxBallSpeed: number = PHYSICS.BALL.MAX_VELOCITY;
  private speedFactor: number = 1;
  
  // Ball texture
  private ballTexture: string = 'ball';
  
  // Helper components
  private ballFactory: BallFactory;
  private ballPositioner: BallPositioner;
  private ballLauncher: BallLauncher;
  private ballInputHandler: BallInputHandler;
  private ballUIManager: BallUIManager;
  private ballEventHandler: BallEventHandler;
  private ballStateManager: BallStateManager;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Initialize state manager
    this.ballStateManager = new BallStateManager(scene);
    
    // Initialize helper components
    this.ballFactory = new BallFactory(scene);
    this.ballPositioner = new BallPositioner(scene);
    this.ballLauncher = new BallLauncher(scene, this.ballPositioner);
    this.ballUIManager = new BallUIManager(scene);
    
    // Initialize event handler with callbacks
    this.ballEventHandler = new BallEventHandler(
      scene,
      this.handleAllBallsLost.bind(this),
      this.handleBallOutOfBounds.bind(this)
    );
    
    // Initialize input handler with launch callback
    this.ballInputHandler = new BallInputHandler(
      scene,
      this.handleLaunchInput.bind(this)
    );
    
    // Set initial ball speed
    this.ballLauncher.setInitialBallSpeed(this.initialBallSpeed);
  }
  
  /**
   * Update ball colors based on the current theme
   * @param color The color to apply to balls
   */
  public updateBallColors(color: number): void {
    try {
      // Apply the color to all balls
      const balls = this.ballStateManager.getAllBalls();
      
      balls.forEach(ball => {
        // Store the original color in data if not already stored
        if (!ball.getData('originalTint')) {
          ball.setData('originalTint', ball.tintTopLeft);
        }
        
        // Apply the new tint color
        ball.setTint(color);
      });
      
      // Store the current ball color for future balls
      this.scene.registry.set('ballColor', color);
      
      // Emit an event that ball colors have been updated
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('ballColorsUpdated', { color });
      }
      
      console.log(`Updated ball colors to ${color.toString(16)}`);
    } catch (error) {
      console.error('Error updating ball colors:', error);
      // Log error if error manager exists
      const errorManager = this.scene['getErrorManager']?.();
      if (errorManager && typeof errorManager.logError === 'function') {
        errorManager.logError('Failed to update ball colors', error instanceof Error ? error.stack : undefined);
      }
    }
  }
  
  /**
   * Initialize the ball manager
   */
  public initialize(): void {
    console.log('Initializing BallManager');
    
    // Get paddles to attach ball to
    const paddleManager = this.scene.getPaddleManager();
    if (paddleManager) {
      const paddles = typeof paddleManager.getPaddles === 'function' ? 
        paddleManager.getPaddles() : [];
        
      if (paddles && paddles.length > 0) {
        this.initializeBall(paddles);
      } else {
        console.log('No paddles available, will initialize ball later');
      }
    }
    
    // Show start prompt
    this.ballUIManager.createStartPrompt();
  }
  
  /**
   * Initialize a ball and attach it to a paddle
   */
  private initializeBall(paddles: Phaser.Physics.Matter.Sprite[]): void {
    console.log('Initializing ball with paddles:', paddles.length);
    
    // Create a ball
    const ball = this.createBall();
    
    // Find the bottom paddle (or any paddle if bottom not found)
    let bottomPaddle: Phaser.Physics.Matter.Sprite | null = null;
    
    for (const paddle of paddles) {
      const edge = paddle.getData('edge');
      console.log(`Checking paddle with edge: ${edge}`);
      if (edge === 'bottom') {
        bottomPaddle = paddle;
        break;
      }
    }
    
    // If no bottom paddle found, use the first paddle
    if (!bottomPaddle && paddles.length > 0) {
      bottomPaddle = paddles[0];
      console.log('No bottom paddle found, using first available paddle');
    }
    
    if (!bottomPaddle) {
      console.error('No paddle available to attach ball to');
      return;
    }
    
    // Store the attached paddle in state manager
    this.ballStateManager.attachBallToPaddle(ball, bottomPaddle);
    
    // Position the ball on the paddle
    this.ballPositioner.updateBallPositionOnPaddle(ball, bottomPaddle);
    
    console.log(`Ball initialized at position (${ball.x}, ${ball.y})`);
    console.log('Ball attached to paddle:', this.ballStateManager.isBallAttachedToPaddle());
  }
  
  /**
   * Create a ball
   */
  public createBall(): Phaser.Physics.Matter.Sprite {
    // Create ball using factory
    const ball = this.ballFactory.createBall();
    
    // Create controller for the ball
    const controller = new BallController(this.scene, ball);
    
    // Add to state manager
    this.ballStateManager.addBall(ball, controller);
    
    return ball;
  }
  
  /**
   * Ensure there's a ball on the paddle
   */
  public ensureBallOnPaddle(): void {
    console.log('Ensuring ball is on paddle');
    
    // If we already have a ball attached, no need to do anything
    if (this.ballStateManager.isBallAttachedToPaddle() && this.ballStateManager.getActiveBall()) {
      console.log('Ball already attached to paddle');
      return;
    }
    
    // Get paddles
    const paddleManager = this.scene.getPaddleManager();
    if (!paddleManager) {
      console.error('No paddle manager found');
      return;
    }
    
    const paddles = typeof paddleManager.getPaddles === 'function' ? 
      paddleManager.getPaddles() : [];
      
    if (!paddles || paddles.length === 0) {
      console.error('No paddles available');
      return;
    }
    
    // If we have an active ball, reset it to the paddle
    const activeBall = this.ballStateManager.getActiveBall();
    if (activeBall) {
      console.log('Resetting existing ball to paddle');
      this.resetBall(paddles);
    } else {
      // Otherwise initialize a new ball
      console.log('Creating new ball on paddle');
      this.initializeBall(paddles);
    }
    
    // Show start prompt
    this.ballUIManager.createStartPrompt();
  }
  
  /**
   * Handle input to launch ball
   */
  private handleLaunchInput(): void {
    // Only handle if the ball is attached to the paddle
    if (this.ballStateManager.isBallAttachedToPaddle() && !this.ballStateManager.isBallLaunched()) {
      this.launchBall();
    }
  }
  
  /**
   * Launch the ball
   */
  public launchBall(): void {
    console.log('BallManager.launchBall called');
    
    if (this.ballStateManager.isBallLaunched()) {
      console.log('Ball already launched, ignoring');
      return;
    }
    
    // Get the main ball
    const ball = this.ballStateManager.getActiveBall();
    if (!ball) {
      console.error('No active ball found to launch');
      
      // Try to create and initialize a ball as a recovery mechanism
      try {
        const paddleManager = this.scene.getPaddleManager();
        if (paddleManager) {
          const paddles = typeof paddleManager.getPaddles === 'function' ? 
            paddleManager.getPaddles() : [];
            
          if (paddles && paddles.length > 0) {
            console.log('Attempting to create ball before launch');
            this.initializeBall(paddles);
            
            // Try launching again after a short delay
            this.scene.time.delayedCall(100, () => {
              this.launchBall();
            });
            return;
          }
        }
      } catch (e) {
        console.error('Recovery attempt failed:', e);
      }
      
      return; // No active ball and recovery failed
    }
    
    // Set ball as launched in state manager
    this.ballStateManager.setBallLaunched();
    console.log('Ball launched flag set to true');
    
    // Launch the ball using the launcher
    const attachedPaddle = this.ballStateManager.getAttachedPaddle();
    this.ballLauncher.launchBall(ball, attachedPaddle || undefined);
    
    // Remove the start prompt
    this.ballUIManager.removeStartPrompt();
  }
  
  /**
   * Update all balls
   */
  public update(): void {
    // If ball is attached to paddle, update its position
    if (this.ballStateManager.isBallAttachedToPaddle()) {
      const ball = this.ballStateManager.getActiveBall();
      const paddle = this.ballStateManager.getAttachedPaddle();
      if (ball && paddle) {
        this.ballPositioner.updateBallPositionOnPaddle(ball, paddle);
      }
    }
    
    // Check for stuck balls (very low velocity) or balls moving too fast
    if (this.ballStateManager.isBallLaunched()) {
      const ball = this.ballStateManager.getActiveBall();
      if (ball && ball.body) {
        // For Matter.js physics
        const velocity = ball.body.velocity || { x: 0, y: 0 };
        const speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
        
        // If ball is moving too slowly, give it a boost
        if (speed < this.minBallSpeed) {
          console.log(`Ball speed too low (${speed}), boosting`);
          
          // Normalize current velocity and apply minimum speed
          const angle = Math.atan2(velocity.y, velocity.x);
          const newVelocityX = Math.cos(angle) * this.initialBallSpeed;
          const newVelocityY = Math.sin(angle) * this.initialBallSpeed;
          
          // Set new velocity - use any to bypass type checking
          this.scene.matter.body.setVelocity(ball.body as any, {
            x: newVelocityX,
            y: newVelocityY
          });
        }
        // Ensure ball doesn't exceed max speed
        else if (speed > this.maxBallSpeed) {
          console.log(`Ball speed too high (${speed}), capping`);
          
          // Normalize and apply max speed
          const angle = Math.atan2(velocity.y, velocity.x);
          const newVelocityX = Math.cos(angle) * this.maxBallSpeed;
          const newVelocityY = Math.sin(angle) * this.maxBallSpeed;
          
          // Set new velocity - use any to bypass type checking
          this.scene.matter.body.setVelocity(ball.body as any, {
            x: newVelocityX,
            y: newVelocityY
          });
        }
      }
    }
    
    // Update all ball controllers
    const controllers = this.ballStateManager.getAllBallControllers();
    for (const controller of controllers) {
      controller.update();
    }
  }
  
  /**
   * Reset the ball to a paddle
   */
  public resetBall(paddles: Phaser.Physics.Matter.Sprite[]): void {
    console.log('Resetting ball to paddle...');
    
    // Get the main ball
    let ball = this.ballStateManager.getActiveBall();
    
    // If no active ball exists, create one
    if (!ball) {
      console.log('No active ball found, creating a new one');
      ball = this.createBall();
      
      if (!ball) {
        console.error('Failed to create a new ball');
        return;
      }
    }
    
    // Find the bottom paddle (or any paddle if bottom not found)
    let bottomPaddle: Phaser.Physics.Matter.Sprite | null = null;
    
    for (const paddle of paddles) {
      const edge = paddle.getData('edge');
      console.log(`Checking paddle with edge: ${edge}`);
      if (edge === 'bottom') {
        bottomPaddle = paddle;
        break;
      }
    }
    
    // If no bottom paddle found, use the first paddle
    if (!bottomPaddle && paddles.length > 0) {
      bottomPaddle = paddles[0];
      console.log('No bottom paddle found, using first available paddle');
    }
    
    if (!bottomPaddle) {
      console.error('No paddle available to reset ball to');
      return;
    }
    
    // Make sure the ball is active and visible
    ball.setActive(true);
    ball.setVisible(true);
    ball.setAlpha(1);
    
    // Reset velocity to zero
    if (ball.body) {
      const matterBody = ball.body as MatterBody;
      this.scene.matter.body.setVelocity(matterBody, { x: 0, y: 0 });
    }
    
    // Store the attached paddle in state manager
    this.ballStateManager.attachBallToPaddle(ball, bottomPaddle);
    
    // Position the ball on the paddle
    this.ballPositioner.updateBallPositionOnPaddle(ball, bottomPaddle);
    
    console.log(`Ball reset to paddle at position (${ball.x}, ${ball.y})`);
    console.log('Ball attached to paddle:', this.ballStateManager.isBallAttachedToPaddle());
    console.log('Ball visibility:', ball.visible, 'Alpha:', ball.alpha);
  }

  /**
 * Get a ball by its physics body
 * @param body The physics body to search for
 * @returns The ball sprite with this body, or undefined if not found
 */
public getBallByBody(body: MatterJS.BodyType): Phaser.Physics.Matter.Sprite | undefined {
  return this.ballStateManager.getAllBalls().find(ball => ball.body === body);
}

  /**
   * Set the speed factor for balls
   * @param factor Speed multiplier to apply to the initial ball velocity
   */
  public setSpeedFactor(factor: number): void {
    this.speedFactor = factor;
    
    // Apply to initial velocity for new balls
    const baseVelocity = PHYSICS.BALL.INITIAL_VELOCITY;
    this.initialBallSpeed = baseVelocity * this.speedFactor;
    this.ballLauncher.setInitialBallSpeed(this.initialBallSpeed);
    
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
   * Check if the ball has been launched
   */
  public isBallLaunched(): boolean {
    return this.ballStateManager.isBallLaunched();
  }

  /**
   * Get the main ball (first active ball)
   * @returns The first active ball or undefined if none exists
   */
  public getBall(): Phaser.Physics.Matter.Sprite | undefined {
    return this.ballStateManager.getActiveBall();
  }

  /**
   * Get the first active ball
   * @returns The first active ball or undefined if none exists
   */
  public getActiveBall(): Phaser.Physics.Matter.Sprite | undefined {
    return this.ballStateManager.getActiveBall();
  }

  /**
   * Get all active balls
   * @returns Array of all active balls
   */
  public getAllBalls(): Phaser.Physics.Matter.Sprite[] {
    return this.ballStateManager.getAllBalls();
  }

  /**
   * Check if the ball is attached to the paddle
   * @returns True if the ball is attached to a paddle
   */
  public isBallAttachedToPaddle(): boolean {
    return this.ballStateManager.isBallAttachedToPaddle();
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
    const balls = this.ballStateManager.getAllBalls();
    for (const ball of balls) {
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
   * Handle ball out of bounds
   */
  private handleBallOutOfBounds(ballId: string): void {
    // Find the ball by ID
    const ball = this.ballStateManager.getAllBalls().find(
      ball => ball && ball.getData('id') === ballId
    );
    
    if (ball) {
      const controller = ball.getData('controller') as BallController;
      
      // Remove ball
      if (controller) {
        controller.destroy();
      }
      
      // Remove from state manager
      this.ballStateManager.removeBall(ballId);
      
      // Check if all balls are gone
      if (!this.ballStateManager.hasActiveBalls()) {
        this.ballEventHandler.emitAllBallsLost();
      }
    }
  }
  
  /**
   * Handle all balls lost
   */
  private handleAllBallsLost(): void {
    // This will be called by the event handler
    // Emit event for life lost via the event handler
    this.ballEventHandler.emitAllBallsLost();
  }
  
  /**
   * Check if there are any balls left
   */
  private checkBallCount(): void {
    if (!this.ballStateManager.hasActiveBalls()) {
      this.ballEventHandler.emitAllBallsLost();
    }
  }
  
  /**
   * Create a ball with specific options
   * @param options Ball creation options
   * @returns The created ball sprite
   */
  public createBallWithOptions(options: {
    x?: number;
    y?: number;
    velocity?: { x: number; y: number };
    texture?: string;
  } = {}): Phaser.Physics.Matter.Sprite {
    // Create the main ball first
    const ball = this.createBall();
    
    // Apply custom options
    if (options.x !== undefined && options.y !== undefined) {
      ball.setPosition(options.x, options.y);
    }
    
    if (options.velocity && ball.body) {
      // Use any to bypass type checking
      this.scene.matter.body.setVelocity(ball.body as any, options.velocity);
    }
    
    return ball;
  }
  
  /**
   * Create multiple balls
   * @param count Number of balls to create
   * @param options Ball creation options
   */
  public activateMultiBall(count: number = 2, options: any = {}): void {
    // Get active ball position to spawn new balls from
    const activeBall = this.ballStateManager.getActiveBall();
    
    if (activeBall) {
      const x = activeBall.x;
      const y = activeBall.y;
      
      // Create additional balls with different angles
      for (let i = 0; i < count; i++) {
        // Calculate angle based on index
        const angle = Math.PI / 4 * (i % 2 === 0 ? 1 : -1) * (Math.floor(i / 2) + 1);
        
        // Calculate velocity
        const speed = this.initialBallSpeed;
        const vx = Math.cos(angle) * speed;
        const vy = Math.sin(angle) * speed;
        
        // Create ball with options
        this.createBallWithOptions({
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
    const balls = this.ballStateManager.getAllBalls();
    
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
    const balls = this.ballStateManager.getAllBalls();
    
    balls.forEach(ball => {
      const controller = ball.getData('controller') as BallController;
      if (controller) {
        controller.applyEffect(effect, duration);
      }
    });
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    // Clean up all helper components
    this.ballInputHandler.cleanup();
    this.ballUIManager.cleanup();
    this.ballEventHandler.cleanup();
    
    // Destroy all balls
    const controllers = this.ballStateManager.getAllBallControllers();
    controllers.forEach(controller => {
      if (controller) {
        controller.destroy();
      }
    });
    
    // Clear state
    this.ballStateManager.clearBalls();
  }
}

export default BallManager;