import { BrickManager, CollisionManager, PhysicsManager } from '@/managers';
import * as Phaser from 'phaser';
import { DEFAULT_MARKET_DATA, GAME_STATE } from '../../constants/GameConstants';
import BallManager from '../../managers/Ball/BallManager';
import ErrorManager from '../../managers/ErrorManager';
import InputManager from '../../managers/InputManager';
import LevelManager from '../../managers/LevelManager';
import ParticleManager from '../../managers/ParticleManager';
import PowerUpManager from '../../managers/PowerUpManager';
import ScoreManager from '../../managers/ScoreManager';
import UIManager from '../../managers/UIManager';
import { AdaptiveRenderer } from '../../plugins/PerformanceMonitor';
import { MarketSim } from '../../simulations/MarketSim';
import DebugUtils from '../../utils/DebugUtils';
import BaseScene from '../BaseScene';
import BreakoutAssetLoader from './BreakoutAssetLoader';
import { BreakoutSceneGameplay } from './BreakoutSceneGameplay';
import BreakoutSceneInitializer from './BreakoutSceneInitializer';
import { BreakoutSceneManagers } from './BreakoutSceneManagers';
import { BreakoutScenePaddles } from './BreakoutScenePaddles';
import BreakoutSceneParticleEffects from './BreakoutSceneParticleEffects';
// Import the correct PaddleController
import PaddleManager from '@/managers/PaddleManager';
import PaddleController from '../../controllers/paddle/PaddleController';

/**
 * Main Breakout game scene
 */
class BreakoutScene extends BaseScene {
  // Game objects
  private bricks!: Phaser.GameObjects.Group;
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private powerUps!: Phaser.GameObjects.Group;
  
  // Game state
  private lives: number = GAME_STATE.INITIAL_LIVES;
  private marketData: any;
  private gameContext: any;
  
  // Managers
  private brickManager!: BrickManager;
  private collisionManager!: CollisionManager;
  private powerUpManager!: PowerUpManager;
  private uiManager!: UIManager;
  private ballManager!: BallManager;
  private levelManager!: LevelManager;
  private scoreManager!: ScoreManager;
  private inputManager!: InputManager;
  private physicsManager!: PhysicsManager;
  private particleManager!: ParticleManager;
  private paddleControllers: Record<string, PaddleController> = {}; // Updated type
  private marketSim!: MarketSim;
  private adaptiveRenderer!: AdaptiveRenderer;
  private errorManager!: ErrorManager; // Added error manager
  
  // Initializer and effects handler
  private initializer!: BreakoutSceneInitializer;
  private particleEffects!: BreakoutSceneParticleEffects;
  
  // Mixins to extend functionality
  private managers: BreakoutSceneManagers;
  private paddleSystem: BreakoutScenePaddles;
  private gameplay: BreakoutSceneGameplay;
  
  // Manager getter/setter methods
  public getBrickManager: () => BrickManager;
  public setBrickManager: (manager: BrickManager) => void;
  public getPowerUpManager: () => PowerUpManager;
  public setPowerUpManager: (manager: PowerUpManager) => void;
  public getUIManager: () => UIManager;
  public setUIManager: (manager: UIManager) => void;
  public getCollisionManager: () => CollisionManager;
  public setCollisionManager: (manager: CollisionManager) => void;
  public getBallManager: () => BallManager;
  public setBallManager: (manager: BallManager) => void;
  public getLevelManager: () => LevelManager;
  public setLevelManager: (manager: LevelManager) => void;
  public getScoreManager: () => ScoreManager;
  public setScoreManager: (manager: ScoreManager) => void;
  public getInputManager: () => InputManager;
  public setInputManager: (manager: InputManager) => void;
  public getParticleManager: () => ParticleManager;
  public setParticleManager: (manager: ParticleManager) => void;
  public getPhysicsManager: () => PhysicsManager;
  public setPhysicsManager: (manager: PhysicsManager) => void;
  public getGameplay: () => BreakoutSceneGameplay;
  public setGameplay: (gameplay: BreakoutSceneGameplay) => void;
  public getSoundManager: () => any;
  public getAngleFactor: () => number;
  public setAngleFactor: (value: number) => void;
  public getMarketSim: () => MarketSim;
  public setMarketSim: (marketSim: MarketSim) => void;
  public getMarketData: () => any;
  public getErrorManager: () => ErrorManager; // Added getter for error manager
  
  // Paddle system methods - updated types to use PaddleController
  public addPaddleController: (id: string, controller: PaddleController) => void;
  public getPaddleControllerById: (id: string) => PaddleController | undefined;
  public getAllPaddleControllers: () => Record<string, PaddleController>;
  public getAllPaddles: () => Phaser.Physics.Matter.Sprite[];
  
  /**
   * Get the paddle system
   */
  public getPaddleSystem(): BreakoutScenePaddles {
    return this.paddleSystem;
  }

  /**
   * Get the paddle manager
   */
  public getPaddleManager(): PaddleManager | undefined {
    // First try to get it from the paddleSystem
    if (this.paddleSystem && typeof this.paddleSystem.getPaddleManager === 'function') {
      return this.paddleSystem.getPaddleManager();
    }
    
    // Fall back to the direct property if it exists
    return (this as any).paddleManager;
  }

  // Implement our own createPaddles method instead of using the one from paddleSystem
  public createPaddles(): void {
    console.log('Creating paddles from BreakoutScene');
    
    try {
      // Delegate to the paddle system but make sure we're using the right context
      if (this.paddleSystem && typeof this.paddleSystem.createPaddles === 'function') {
        // Call with the correct context
        this.paddleSystem.createPaddles.call(this.paddleSystem);
      } else {
        console.error('paddleSystem.createPaddles is not available');
      }
    } catch (error) {
      console.error('Error in BreakoutScene.createPaddles:', error);
    }
  }
  
  // Gameplay methods
  public createBricks: (signals: any[]) => void;
  public resetBall: () => void;
  public startGame: () => void;
  public setPowerUpTimer: (powerUp: any, duration: number) => void;
  
  constructor() {
    super({ key: 'BreakoutScene' });
    
    // Initialize mixins
    this.managers = new BreakoutSceneManagers(this);
    this.paddleSystem = new BreakoutScenePaddles(this);
    this.gameplay = new BreakoutSceneGameplay(this);
    
    // Assign manager methods
    this.getBrickManager = this.managers.getBrickManager;
    this.setBrickManager = this.managers.setBrickManager;
    this.getPowerUpManager = this.managers.getPowerUpManager;
    this.setPowerUpManager = this.managers.setPowerUpManager;
    this.getUIManager = this.managers.getUIManager;
    this.setUIManager = this.managers.setUIManager;
    this.getCollisionManager = this.managers.getCollisionManager;
    this.setCollisionManager = this.managers.setCollisionManager;
    this.getBallManager = this.managers.getBallManager;
    this.setBallManager = this.managers.setBallManager;
    this.getLevelManager = this.managers.getLevelManager;
    this.setLevelManager = this.managers.setLevelManager;
    this.getScoreManager = this.managers.getScoreManager;
    this.setScoreManager = this.managers.setScoreManager;
    this.getInputManager = this.managers.getInputManager;
    this.setInputManager = this.managers.setInputManager;
    this.getParticleManager = this.managers.getParticleManager;
    this.setParticleManager = this.managers.setParticleManager;
    this.getPhysicsManager = this.managers.getPhysicsManager; // This line is correct but the function might not be working
    this.setPhysicsManager = this.managers.setPhysicsManager; // This line is correct
    this.getSoundManager = this.managers.getSoundManager;
    this.getAngleFactor = this.managers.getAngleFactor;
    this.setAngleFactor = this.managers.setAngleFactor;
    this.getMarketSim = this.managers.getMarketSim;
    this.setMarketSim = this.managers.setMarketSim;
    this.getMarketData = this.managers.getMarketData;
    
    // Add getGameplay and setGameplay assignments
    this.getGameplay = () => this.gameplay;
    this.setGameplay = (gameplay: BreakoutSceneGameplay) => { this.gameplay = gameplay; };
    
    // Add error manager getter
    this.getErrorManager = () => this.errorManager;
    
    // Assign paddle system methods - bind to ensure correct 'this' context
    this.addPaddleController = (id: string, controller: PaddleController) => 
      this.paddleSystem.addPaddleController(id, controller);
    this.getPaddleControllerById = (id: string) => 
      this.paddleSystem.getPaddleControllerById(id);
    this.getAllPaddleControllers = () => 
      this.paddleSystem.getAllPaddleControllers();
    this.getAllPaddles = () => 
      this.paddleSystem.getAllPaddles();
    
    // Don't assign createPaddles from paddleSystem, we've implemented our own
    
    // Assign gameplay methods - bind to ensure correct 'this' context
    this.createBricks = (signals: any[]) => 
      this.gameplay.createBricks(signals);
    this.resetBall = () => 
      this.gameplay.resetBall();
    this.startGame = () => 
      this.gameplay.startGame();
    this.setPowerUpTimer = (powerUp: any, duration: number) => 
      this.gameplay.setPowerUpTimer(powerUp, duration);
  }
  
  init(data: any): void {
    try {
      // Initialize game state
      this.lives = GAME_STATE.INITIAL_LIVES;
      this.gameContext = data.gameContext || {};
      
      // Get market data from registry if available
      this.marketData = this.registry.get('marketData') || DEFAULT_MARKET_DATA;
      
      // Initialize common managers from base class
      this.initializeCommonManagers();
      
      // Initialize physics manager early since it's needed by other systems
      this.physicsManager = new PhysicsManager(this);
      
      // Store the physics manager using the setter
      this.setPhysicsManager(this.physicsManager);
      
      // Log to verify physics manager is available
      console.log('Physics manager initialized in init:', !!this.physicsManager);
    } catch (error) {
      console.error('Error in BreakoutScene.init:', error);
      // We can't use errorManager yet as it's not initialized
    }
  }
    
  preload(): void {
    try {
      // Asset loading is now handled in a separate file
      const assetLoader = new BreakoutAssetLoader(this);
      assetLoader.loadAssets();
      
      // Add a safety timeout in case the assetsLoaded event never fires
      this.time.delayedCall(10000, () => {
        console.warn('Safety timeout reached, forcing scene to continue');
        if (!this.scene.isActive('BreakoutScene')) {
          this.scene.start('BreakoutScene');
        }
      });
      
      // Make sure we're listening for the assetsLoaded event
      this.events.once('assetsLoaded', () => {
        console.log('Assets loaded event received, proceeding with scene creation');
        // If we're still in the preload phase, move to create
        if (this.scene.isActive('BreakoutScene')) {
          // The scene will automatically proceed to create after preload
          console.log('Scene will proceed to create phase');
        }
      });
      
    } catch (error) {
      console.error('Error in BreakoutScene.preload:', error);
      // Force scene to continue even if there's an error
      this.scene.start('BreakoutScene');
    }
  }
  
  create(): void {
    try {
      // Initialize error manager first
      this.errorManager = new ErrorManager(this);
      
      // Create groups for game objects
      this.bricks = this.add.group();
      this.powerUps = this.add.group();
      
      // Ensure physics manager is initialized before other components
      if (!this.physicsManager) {
        console.log('Creating physics manager in create method');
        this.physicsManager = new PhysicsManager(this);
        this.setPhysicsManager(this.physicsManager);
      }
      
      // Log game dimensions to verify they're available
      console.log('Game dimensions:', this.scale.width, 'x', this.scale.height);
      
      // Initialize the game using the initializer
      this.initializer = new BreakoutSceneInitializer(this);
      this.initializer.initialize();
      
      // Set up particle effects
      this.particleEffects = new BreakoutSceneParticleEffects(this);
      this.particleEffects.setupParticleEffects();
      
      // Wrap critical methods with error boundaries
      this.wrapCriticalMethods();
      
      // Debug game state
      this.time.delayedCall(1000, () => {
        console.log('Running debug check...');
        DebugUtils.logGameState(this);
      });
    } catch (error) {
      console.error('Error in BreakoutScene.create:', error);
      this.showFatalError(error instanceof Error ? error.message : String(error));
    }
  }
  
  /**
   * Wrap critical methods with error boundaries
   */
  private wrapCriticalMethods(): void {
    // Wrap update method
    const originalUpdate = this.update;
    this.update = function(this: BreakoutScene, time: number, delta: number) {
      try {
        originalUpdate.call(this, time, delta);
      } catch (error) {
        if (this.errorManager) {
          this.errorManager.logError(
            `Error in update: ${error instanceof Error ? error.message : String(error)}`,
            error instanceof Error ? error.stack : undefined
          );
        } else {
          console.error('Error in update:', error);
        }
      }
    };
    
    // Wrap other critical methods as needed
    const methodsToWrap = [
      'resetBall',
      'startGame',
      'createBricks',
      'setPowerUpTimer',
      'shutdown'
    ];
    
    methodsToWrap.forEach(methodName => {
      if (typeof this[methodName as keyof this] === 'function') {
        const originalMethod = this[methodName as keyof this] as Function;
        (this as any)[methodName] = function(this: BreakoutScene, ...args: any[]) {
          try {
            return originalMethod.apply(this, args);
          } catch (error) {
            if (this.errorManager) {
              this.errorManager.logError(
                `Error in ${methodName}: ${error instanceof Error ? error.message : String(error)}`,
                error instanceof Error ? error.stack : undefined
              );
            } else {
              console.error(`Error in ${methodName}:`, error);
            }
            return undefined;
          }
        };
      }
    });
  }
  
  // Modify the update method to check game state before updating controllers
  update(time: number, delta: number): void {
    // Update common managers from base class
    this.updateCommonManagers(time, delta);
    
    // Get game state
    const gameStarted = this.ballManager ? this.ballManager.isBallLaunched() : false;
    
    // Update all managers that need per-frame updates
    if (this.paddleControllers) {
      Object.values(this.paddleControllers).forEach(controller => {
        // Only update paddle controllers if game has started or if they're AI controlled
        if (gameStarted || controller.getPaddle()?.getData('isAI')) {
          controller.update();
        }
      });
    }
    
    if (this.inputManager) {
      this.inputManager.update();
    }

    if (this.ballManager) {
      this.ballManager.update();
      
      // Check if ball is out of bounds
      if (this.ballManager.checkBallBounds() && this.eventManager) {
        this.eventManager.emit('lifeLost', { livesRemaining: this.lives });
      }
    }
    
    // Update particle effects
    if (this.particleManager) {
      this.particleManager.update();
    }
  }
  
  /**
   * Show a fatal error that prevents the game from continuing
   */
  public showFatalError(message: string): void {
    // Create a simple error display for fatal errors
    // This is used when the error manager itself might not be available
    const width = this.scale?.width || 800;
    const height = this.scale?.height || 600;
    
    // Add semi-transparent background
    const bg = this.add.rectangle(
      width / 2, height / 2, 
      width * 0.8, 
      height * 0.3,
      0x000000, 0.9
    );
    bg.setStrokeStyle(4, 0xff0000);
    
    // Add error title
    this.add.text(
      width / 2, height / 2 - bg.height / 2 + 30, 
      'FATAL ERROR', 
      { 
        fontFamily: 'Arial', 
        fontSize: '28px', 
        color: '#ff0000',
        align: 'center'
      }
    ).setOrigin(0.5);
    
    // Add error message
    this.add.text(
      width / 2, height / 2, 
      message, 
      { 
        fontFamily: 'Arial', 
        fontSize: '18px', 
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: bg.width - 60 }
      }
    ).setOrigin(0.5);
    
    // Add restart button
    const restartButton = this.add.text(
      width / 2, height / 2 + bg.height / 2 - 40, 
      'Restart Game', 
      { 
        fontFamily: 'Arial', 
        fontSize: '20px', 
        color: '#ffffff',
        backgroundColor: '#aa0000',
        padding: { x: 15, y: 8 }
      }
    );
    restartButton.setOrigin(0.5);
    restartButton.setInteractive({ useHandCursor: true });
    restartButton.on('pointerdown', () => {
      // Restart the current scene
      this.scene.restart();
    });
  }
  
  shutdown(): void {
    try {
      // Clean up common managers from base class
      this.cleanupCommonManagers();
      
      // Clean up ParticleManager
      if (this.particleManager) {
        this.particleManager.cleanup();
      }
      
      // Use initializer to clean up other resources
      if (this.initializer) {
        this.initializer.shutdown();
      }
      
      // Clean up error manager last
      if (this.errorManager) {
        this.errorManager.cleanup();
      }
    } catch (error) {
      console.error('Error in BreakoutScene.shutdown:', error);
    }
  }
}

export default BreakoutScene;