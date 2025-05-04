import { CollisionManager } from '@/managers';
import * as Phaser from 'phaser';
import { DEFAULT_MARKET_DATA, GAME_STATE } from '../../constants/GameConstants';
import BallManager from '../../managers/BallManager';
import BrickManager from '../../managers/BrickManager';
import ErrorManager from '../../managers/ErrorManager';
import InputManager from '../../managers/InputManager';
import LevelManager from '../../managers/LevelManager';
import PaddleController from '../../managers/PaddleManager';
import ParticleManager from '../../managers/ParticleManager';
import PhysicsManager from '../../managers/PhysicsManager';
import PowerUpManager from '../../managers/PowerUpManager';
import ScoreManager from '../../managers/ScoreManager';
import UIManager from '../../managers/UIManager';
import { AdaptiveRenderer } from '../../plugins/PerformanceMonitor';
import { MarketSim } from '../../simulations/MarketSim';
import BaseScene from '../BaseScene';
import { BreakoutSceneGameplay } from './BreakoutSceneGameplay';
import BreakoutSceneInitializer from './BreakoutSceneInitializer';
import { BreakoutSceneManagers } from './BreakoutSceneManagers';
import { BreakoutScenePaddles } from './BreakoutScenePaddles';
import BreakoutSceneParticleEffects from './BreakoutSceneParticleEffects';
import BreakoutAssetLoader from './BreakoutAssetLoader';


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
  private paddleControllers: Record<string, PaddleController> = {};
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
  public getSoundManager: () => any;
  public getAngleFactor: () => number;
  public setAngleFactor: (value: number) => void;
  public getMarketSim: () => MarketSim;
  public setMarketSim: (marketSim: MarketSim) => void;
  public getMarketData: () => any;
  public getErrorManager: () => ErrorManager; // Added getter for error manager
  
  // Paddle system methods
  public addPaddleController: (id: string, controller: PaddleController) => void;
  public getPaddleControllerById: (id: string) => PaddleController | undefined;
  public getAllPaddleControllers: () => Record<string, PaddleController>;
  public getAllPaddles: () => Phaser.Physics.Matter.Sprite[];
  public getPaddleManager: () => PaddleController | undefined;
  public createPaddles: () => void;
  
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
    this.getPhysicsManager = this.managers.getPhysicsManager;
    this.setPhysicsManager = this.managers.setPhysicsManager;
    this.getSoundManager = this.managers.getSoundManager;
    this.getAngleFactor = this.managers.getAngleFactor;
    this.setAngleFactor = this.managers.setAngleFactor;
    this.getMarketSim = this.managers.getMarketSim;
    this.setMarketSim = this.managers.setMarketSim;
    this.getMarketData = this.managers.getMarketData;
    
    // Add error manager getter
    this.getErrorManager = () => this.errorManager;
    
    // Assign paddle system methods
    this.addPaddleController = this.paddleSystem.addPaddleController;
    this.getPaddleControllerById = this.paddleSystem.getPaddleControllerById;
    this.getAllPaddleControllers = this.paddleSystem.getAllPaddleControllers;
    this.getAllPaddles = this.paddleSystem.getAllPaddles;
    this.getPaddleManager = this.paddleSystem.getPaddleManager;
    this.createPaddles = this.paddleSystem.createPaddles;
    
    // Assign gameplay methods
    this.createBricks = this.gameplay.createBricks;
    this.resetBall = this.gameplay.resetBall;
    this.startGame = this.gameplay.startGame;
    this.setPowerUpTimer = this.gameplay.setPowerUpTimer;
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
    } catch (error) {
      console.error('Error in BreakoutScene.init:', error);
      // We can't use errorManager yet as it's not initialized
    }
  }
    
  preload(): void {
    try {
      // Asset loading is now handled in a separate file
      new BreakoutAssetLoader(this).loadAssets();
    } catch (error) {
      console.error('Error in BreakoutScene.preload:', error);
      // We can't use errorManager yet as it's not initialized
    }
  }
  
  create(): void {
    try {
      // Initialize error manager first
      this.errorManager = new ErrorManager(this);
      
      // Create groups for game objects
      this.bricks = this.add.group();
      this.powerUps = this.add.group();
      
      // Initialize the game using the initializer
      this.initializer = new BreakoutSceneInitializer(this);
      this.initializer.initialize();
      
      // Set up particle effects
      this.particleEffects = new BreakoutSceneParticleEffects(this);
      this.particleEffects.setupParticleEffects();
      
      // Wrap critical methods with error boundaries
      this.wrapCriticalMethods();
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
  
  // Original update method (will be wrapped by wrapCriticalMethods)
  update(time: number, delta: number): void {
    // Update common managers from base class
    this.updateCommonManagers(time, delta);
    
    // Update all managers that need per-frame updates
    if (this.paddleControllers) {
      Object.values(this.paddleControllers).forEach(controller => {
        controller.update();
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
    const { width, height } = this.scale;
    
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