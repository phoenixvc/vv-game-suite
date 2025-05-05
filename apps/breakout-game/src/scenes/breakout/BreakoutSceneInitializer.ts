import PaddleController from '@/controllers/paddle/PaddleController';
import { BrickManager, CollisionManager, PhysicsManager, ThemeManager, UIManager } from '@/managers';
import PaddleManager from '@/managers/paddle/PaddleManager'; // Fixed import path
import BallManager from '../../managers/Ball/BallManager';
import InputManager from '../../managers/InputManager';
import LevelManager from '../../managers/LevelManager';
import ParticleManager from '../../managers/ParticleManager';
import PowerUpManager from '../../managers/PowerUpManager';
import ScoreManager from '../../managers/ScoreManager';
import { MarketSim } from '../../simulations/MarketSim';
import BreakoutScene from './BreakoutScene';

/**
 * Handles initialization of the Breakout scene and its managers
 */
class BreakoutSceneInitializer {
  private scene: BreakoutScene;
  themeManager: any;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
/**
 * Initialize all managers and game objects
 */
public initialize(): void {
  console.log('Initializing BreakoutScene...');
  
  try {
    // Initialize theme manager
    this.themeManager = new ThemeManager(this.scene);
    this.scene.setThemeManager(this.themeManager);

    // Set NeuralIquid as the default theme
    if (this.themeManager.getThemeNames().includes('NeuralIquid')) {
      this.themeManager.setThemeByName('NeuralIquid');
    } else {
      // Apply default theme if NeuralIquid is not available
      this.themeManager.applyCurrentTheme();
    }

    // Initialize managers in the correct order (dependency-based)
    this.initializePhysicsManager();
    this.initializeCollisionManager();
    this.initializeParticleManager();

    // Initialize paddle manager before ball manager
    this.initializePaddleManager();
    
    // Create paddles immediately
    this.createPaddles();
    
    // Now initialize ball manager
    this.initializeBallManager();
    
    // Initialize remaining managers
    this.initializeBrickManager();
    this.initializePowerUpManager();
    this.initializeScoreManager();
    this.initializeInputManager();
    this.initializeUIManager();
    this.initializeMarketSim();
    this.initializeLevelManager();
    
    // Create game objects (including HUD)
    this.createGameObjects();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Initialize gameplay (this will reset the ball position)
    this.initializeGameplay();
    
    console.log('BreakoutScene initialization complete');
  } catch (error) {
    console.error('Error initializing scene:', error);
  }
}

/**
 * Create game objects including UI elements
 */
private createGameObjects(): void {
  try {
    // Create the game HUD (after other UI elements are created)
    //const gameHUD = new GameHUD(this.scene);
    
    // // Set the HUD using the appropriate setter method
    // if (typeof this.scene.setHUDManager === 'function') {
    //   this.scene.setHUDManager(gameHUD);
    // } else {
    //   // Fallback: set it using type assertion if setter doesn't exist
    //   (this.scene as any).gameHUD = gameHUD;
    // }
    //letft for uimanager
    
    console.log('Game objects created successfully');
  } catch (error) {
    console.error('Error creating game objects:', error);
    // Use getErrorManager method instead of direct access
    const errorManager = this.scene.getErrorManager ? this.scene.getErrorManager() : null;
    if (errorManager) {
      errorManager.logError('Failed to create game objects', error instanceof Error ? error.stack : undefined);
    }
  }
}

/**
 * Create paddles
 */
private createPaddles(): void {
  console.log('Creating paddles from initializer...');
  
  // Get paddle manager
  const paddleManager = this.scene.getPaddleManager();
  if (!paddleManager) {
    console.error('Paddle manager not available');
    return;
  }
  
  // Set active paddles in registry
  const activePaddles = ['bottom', 'top'];
  this.scene.registry.set('activePaddles', activePaddles);
  
  // Create paddles
  paddleManager.createPaddles();
  
  // Verify paddles were created
  const paddles = paddleManager.getPaddles();
  console.log(`Created ${paddles.length} paddles`);
}

/**
 * Initialize gameplay
 */
private initializeGameplay(): void {
  console.log('Initializing gameplay from initializer...');
  
  // Use the gameplay component to initialize the gameplay
  if (this.scene.getGameplay() && typeof this.scene.getGameplay().initializeGameplay === 'function') {
    this.scene.getGameplay().initializeGameplay();
    return;
  }
  
  // Fall back to manual initialization if gameplay component is not available
  
  // Get ball manager
  const ballManager = this.scene.getBallManager();
  if (!ballManager) {
    console.error('Ball manager not available');
    return;
  }
  
  // Get paddle manager
  const paddleManager = this.scene.getPaddleManager();
  if (!paddleManager) {
    console.error('Paddle manager not available');
    return;
  }
  
  // Reset ball position to paddle
  const paddles = paddleManager.getPaddles();
  if (paddles.length > 0) {
    console.log('Resetting ball to paddle from initializer');
    ballManager.resetBall(paddles);
    
    // Verify ball is attached
    const isAttached = ballManager.isBallAttachedToPaddle();
    console.log('Ball attached to paddle:', isAttached);
  } else {
    console.error('No paddles available to reset ball position');
  }
}
  
  /**
   * Initialize physics manager
   */
  private initializePhysicsManager(): void {
    const physicsManager = new PhysicsManager(this.scene);
    this.scene.setPhysicsManager(physicsManager);
  }
  
  /**
   * Initialize collision manager
   */
  private initializeCollisionManager(): void {
    const collisionManager = new CollisionManager(this.scene);
    collisionManager.setupCollisionHandlers();
    this.scene.setCollisionManager(collisionManager);
  }
  
  /**
   * Initialize particle manager
   */
  private initializeParticleManager(): void {
    const particleManager = new ParticleManager(this.scene);
    this.scene.setParticleManager(particleManager);
  }
  
  /**
   * Initialize ball manager
   */
  private initializeBallManager(): void {
    const ballManager = new BallManager(this.scene);
    this.scene.setBallManager(ballManager);
  }
  
  /**
   * Initialize paddle manager
   */
  private initializePaddleManager(): void {
    console.log('Initializing paddle manager...');
    
    try {
      // Create a PaddleManager instance
      const paddleManager = new PaddleManager(this.scene);
      
      // Store it directly on the scene for access
      // This is important - we need to set it on the scene directly
      (this.scene as any).paddleManager = paddleManager;
      
      // Connect it to the paddleSystem using the setPaddleManager method
      const paddleSystem = (this.scene as any).paddleSystem;
      if (paddleSystem && typeof paddleSystem.setPaddleManager === 'function') {
        paddleSystem.setPaddleManager(paddleManager);
        console.log('Connected paddle manager to paddle system');
      } else {
        console.warn('Could not connect paddle manager to paddle system');
      }
      
      // Create default paddle controller
      const paddleController = new PaddleController(this.scene, 'default', 'horizontal');
      this.scene.addPaddleController('default', paddleController);
      
      console.log('Paddle manager initialized');
    } catch (error) {
      console.error('Error initializing paddle manager:', error);
    }
  }
  
  /**
   * Initialize brick manager
   */
  private initializeBrickManager(): void {
    const brickManager = new BrickManager(this.scene);
    this.scene.setBrickManager(brickManager);
  }
  
  /**
   * Initialize power-up manager
   */
  private initializePowerUpManager(): void {
    const powerUpManager = new PowerUpManager(this.scene);
    this.scene.setPowerUpManager(powerUpManager);
  }
  
  /**
   * Initialize score manager
   */
  private initializeScoreManager(): void {
    const scoreManager = new ScoreManager(this.scene);
    this.scene.setScoreManager(scoreManager);
  }
  
  /**
   * Initialize input manager
   */
  private initializeInputManager(): void {
    const inputManager = new InputManager(this.scene);
    this.scene.setInputManager(inputManager);
  }
  
  /**
   * Initialize UI manager
   */
  private initializeUIManager(): void {
    const uiManager = new UIManager(this.scene);
    this.scene.setUIManager(uiManager);
  }
  
  /**
   * Initialize market simulation
   */
  private initializeMarketSim(): void {
    // Create MarketSim without parameters since its constructor doesn't take any
    const marketSim = new MarketSim();
    
    // If the scene expects market data to be set, we can get it from the MarketSim
    const marketData = this.scene.getMarketData();
    if (marketData !== undefined) {
      // Store the initial signals in the market data if needed
      const initialSignals = marketSim.getInitialSignals();
      if (typeof marketData === 'object') {
        marketData.signals = initialSignals;
      }
    }
    
    this.scene.setMarketSim(marketSim);
  }
  
  /**
   * Initialize level manager
   */
  private initializeLevelManager(): void {
    const marketSim = this.scene.getMarketSim();
    const levelManager = new LevelManager(this.scene, marketSim);
    this.scene.setLevelManager(levelManager);
    
    // Initialize the first level
    levelManager.initLevel();
  }
  
  /**
   * Set up event listeners for game events
   */
  private setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    // Power-up event listeners
    eventManager.on('powerUpCollected', (data: { type: string, duration: number }) => {
      const timeManager = this.scene.getTimeManager();
      if (timeManager) {
        timeManager.setPowerUpTimer(
          data.type,
          data.duration,
          () => {
            eventManager.emit('powerUpExpired', { type: data.type });
          },
          this.scene
        );
      }
    });
  }
  
  /**
   * Clean up resources when scene is shut down
   */
  public shutdown(): void {
    try {
      // Clean up the game HUD - use the appropriate getter method
      const hudManager = this.scene.getHUDManager ? this.scene.getHUDManager() : null;
      if (hudManager && typeof hudManager.destroy === 'function') {
        hudManager.destroy();
      }
      
      // Clean up managers in reverse order of initialization
      const levelManager = this.scene.getLevelManager();
      if (levelManager && typeof levelManager.cleanup === 'function') {
        levelManager.cleanup();
      }
      
      const inputManager = this.scene.getInputManager();
      if (inputManager && typeof inputManager.cleanup === 'function') {
        inputManager.cleanup();
      }
      
      const collisionManager = this.scene.getCollisionManager();
      if (collisionManager && typeof collisionManager.cleanup === 'function') {
        collisionManager.cleanup();
      }
      
      const physicsManager = this.scene.getPhysicsManager();
      if (physicsManager && typeof physicsManager.cleanup === 'function') {
        physicsManager.cleanup();
      }
    } catch (error) {
      console.error('Error in BreakoutSceneInitializer.shutdown:', error);
    }
  }
}

export default BreakoutSceneInitializer;