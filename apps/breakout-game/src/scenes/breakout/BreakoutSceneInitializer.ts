import { CollisionManager } from '@/managers';
import BallManager from '../../managers/BallManager';
import BrickManager from '../../managers/BrickManager';
import InputManager from '../../managers/InputManager';
import LevelManager from '../../managers/LevelManager';
import PaddleController from '../../managers/PaddleManager';
import ParticleManager from '../../managers/ParticleManager';
import PhysicsManager from '../../managers/PhysicsManager';
import PowerUpManager from '../../managers/PowerUpManager';
import ScoreManager from '../../managers/ScoreManager';
import UIManager from '../../managers/UIManager';
import { MarketSim } from '../../simulations/MarketSim';
import BreakoutScene from './BreakoutScene';

/**
 * Handles initialization of the Breakout scene and its managers
 */
class BreakoutSceneInitializer {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Initialize all managers and game objects
   */
  public initialize(): void {
    // Initialize managers in the correct order (dependency-based)
    this.initializePhysicsManager();
    this.initializeCollisionManager();
    this.initializeParticleManager();
    this.initializeBallManager();
    this.initializePaddleManager();
    this.initializeBrickManager();
    this.initializePowerUpManager();
    this.initializeScoreManager();
    this.initializeInputManager();
    this.initializeUIManager();
    this.initializeMarketSim();
    this.initializeLevelManager();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Initialize physics manager
   */
  private initializePhysicsManager(): void {
    const physicsManager = new PhysicsManager(this.scene);
    physicsManager.initializePhysics();
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
    // Create default paddle
    const paddleController = new PaddleController(this.scene);
    this.scene.addPaddleController('default', paddleController);
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
  }
}

export default BreakoutSceneInitializer;