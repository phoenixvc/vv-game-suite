import BreakoutScene from './BreakoutScene';

/**
 * Handles gameplay-related functionality for the BreakoutScene
 */
export class BreakoutSceneGameplay {
  private scene: BreakoutScene;
  autoStart: boolean = false; // Default to false
  private gameStarted: boolean = false; // Track if game has started
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
    /**
   * Initialize the game scene
   */
    public initializeGameplay(): void {
      console.log('Initializing gameplay...');
      
      try {
        // Create paddles first
        this.createPaddles();
        
        // Ensure a ball is created before trying to reset its position
        const ballManager = this.scene.getBallManager();
        if (ballManager) {
          // Check if there's already an active ball
          if (!ballManager.getActiveBall()) {
            // Create a new ball first
            const paddleManager = this.scene.getPaddleManager();
            if (paddleManager) {
              const paddles = paddleManager.getPaddles();
              if (paddles.length > 0) {
                // Initialize a ball (this will create one if needed)
                ballManager.ensureBallOnPaddle();
              }
            }
          } else {
            // If a ball already exists, just reset its position
            this.resetBallPosition();
          }
        }
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start game if auto-start is enabled
        if (this.autoStart) {
          console.log('Auto-start enabled, starting game...');
          this.startGame();
        }
        
        console.log('Gameplay initialization complete');
      } catch (error) {
        console.error('Error initializing gameplay:', error);
      }
    }

  /**
   * Create game objects
   */
  public createGameObjects(): void {
    console.log('Creating game objects...');
    
    // Create paddles
    this.createPaddles();
    
    console.log('Game objects created');
  }

  /**
   * Initialize managers
   */
  public initializeManagers(): void {
    console.log('Initializing managers from gameplay...');
    // This is intentionally empty as managers are initialized elsewhere
  }

  /**
   * Set up event listeners
   */
  public setupEventListeners(): void {
    console.log('Setting up gameplay event listeners...');
    
    const eventManager = this.scene.getEventManager();
    if (!eventManager) {
      console.error('Event manager not found');
      return;
    }
    
    // Listen for ball out of bounds
    eventManager.on('ballOutOfBounds', () => {
      console.log('Ball out of bounds, resetting...');
      this.resetBallPosition();
    });
    
    // Listen for game over
    eventManager.on('gameOver', () => {
      console.log('Game over event received');
      // Handle game over
    });
    
    const inputManager = this.scene.getInputManager();
    if (inputManager) {
      // Check if game is not started yet
      if (!this.gameStarted) {
        // Listen for game state changes instead of direct action
        const eventManager = this.scene.getEventManager();
        if (eventManager) {
          // Listen for the event that indicates the game should start
          eventManager.on('gameControlsEnabled', () => {
            this.startGame();
          });
        }
      }
    }
    
    console.log('Event listeners set up');
  }

  /**
   * Create paddles for the game
   */
  private createPaddles(): void {
    console.log('Creating paddles from gameplay...');
    
    // Use the scene's createPaddles method if available
    if (typeof this.scene.createPaddles === 'function') {
      this.scene.createPaddles();
    }
    
    console.log('Paddles created');
  }

  /**
   * Reset the ball position to the paddle
   */
  private resetBallPosition(): void {
    console.log('Resetting ball position to paddle...');
    
    const ballManager = this.scene.getBallManager();
    const paddleManager = this.scene.getPaddleManager();
    
    if (!ballManager) {
      console.error('Ball manager not found');
      return;
    }
    
    if (!paddleManager) {
      console.error('Paddle manager not found');
      return;
    }
    
    const paddles = paddleManager.getPaddles();
    if (paddles.length === 0) {
      console.error('No paddles available to reset ball position');
      return;
    }
    
    console.log(`Found ${paddles.length} paddles, resetting ball position`);
    
    // Check if there's an active ball first
    if (!ballManager.getActiveBall()) {
      // No active ball, create one first
      console.log('No active ball found, creating a new one');
      ballManager.createBall();
    }
    
    // Now reset the ball
    ballManager.resetBall(paddles);
    
    // Verify the ball was properly attached
    const ball = ballManager.getBall();
    const isAttached = ballManager.isBallAttachedToPaddle();
    
    if (ball && isAttached) {
      console.log('Ball successfully reset and attached to paddle');
    } else {
      console.error('Failed to attach ball to paddle:', { 
        ballExists: !!ball, 
        isAttached: isAttached 
      });
      
      // Recovery attempt - try to create a new ball and attach it
      if (!ball) {
        console.log('Recovery attempt: Creating new ball');
        const newBall = ballManager.createBall();
        if (newBall) {
          console.log('Recovery: New ball created, attempting to attach');
          ballManager.resetBall(paddles);
        }
      }
    }
  }

  /**
   * Method needed for InputManager
   * Starts the game (but doesn't launch the ball)
   */
  public startGame = (): void => {
    console.log('startGame called - initializing game state');
    
    if (this.gameStarted) {
      console.log('Game already started, ignoring');
      return;
    }
    
    this.gameStarted = true;
    
    // Make sure the ball is reset and attached to paddle
    const ballManager = this.scene.getBallManager();
    if (ballManager) {
      const paddleManager = this.scene.getPaddleManager();
      if (paddleManager) {
        const paddles = paddleManager.getPaddles();
        if (paddles.length > 0) {
          ballManager.resetBall(paddles);
        }
      }
    }
    
    // Emit game started event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('gameStarted');
      console.log('gameStarted event emitted');
      
      // Update UI to show "Click to launch ball" message
      const uiManager = this.scene.getUIManager();
      if (uiManager) {
        uiManager.showMessage('Click to launch ball', 2000);
      }
    }
  }
  
  /**
   * Launch the ball (separate from starting the game)
   */
  public launchBall = (): void => {
    console.log('launchBall called');
    
    if (!this.gameStarted) {
      console.log('Game not started yet, starting first');
      this.startGame();
      return;
    }
    
    // Launch the ball using BallManager
    const ballManager = this.scene.getBallManager();
    if (!ballManager) {
      console.error('Ball manager not found!');
      return;
    }
    
    // If ball is not attached to paddle, reset it first
    if (!ballManager.isBallAttachedToPaddle()) {
      console.log('Ball not attached to paddle, resetting position first');
      const paddleManager = this.scene.getPaddleManager();
      if (paddleManager) {
        const paddles = paddleManager.getPaddles();
        if (paddles.length > 0) {
          ballManager.resetBall(paddles);
        } else {
          console.error('No paddles available to reset ball position');
        }
      } else {
        console.error('Paddle manager not found!');
      }
    }
    
    // Now launch the ball
    console.log('Calling ballManager.launchBall()');
    ballManager.launchBall();
    
    // Verify the ball was launched
    const ball = ballManager.getBall();
    console.log('Ball launched, velocity:', ball?.body?.velocity);
    
    // Emit ball launched event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('ballLaunched');
      console.log('ballLaunched event emitted');
    }
  }

  /**
   * Method needed for compatibility with LevelManager
   * Creates bricks based on provided signals
   */
  public createBricks = (signals: any[]): void => {
    const brickManager = this.scene['brickManager'];
    if (brickManager && typeof brickManager.createBricksForLevel === 'function') {
      brickManager.createBricksForLevel(1, signals);
    }
  }
  
  /**
   * Method needed for BallManager
   * Resets the ball position
   */
  public resetBall = (): void => {
    const ballManager = this.scene['ballManager'];
    if (ballManager) {
      const paddleManager = this.scene.getPaddleManager();
      if (paddleManager) {
        const paddles = paddleManager.getPaddles();
        if (paddles.length > 0) {
          ballManager.resetBall(paddles);
        }
      }
    }
  }
  
  /**
   * Method for PowerUpManager to use TimeManager
   * Sets a timer for power-up duration
   */
  public setPowerUpTimer = (powerUp: any, duration: number): void => {
    const timeManager = this.scene['timeManager'];
    if (timeManager) {
      timeManager.setPowerUpTimer(
        powerUp.type,
        duration,
        () => powerUp.removeEffect(this.scene),
        this.scene
      );
    }
  }
}