import BallManager from '../managers/BallManager';
import BrickManager from '../managers/BrickManager';
import CollisionManager from '../managers/CollisionHandlers/CollisionManager';
import EventManager from '../managers/EventManager';
import GameStateManager from '../managers/GameStateManager';
import InputManager from '../managers/InputManager';
import LevelManager from '../managers/LevelManager';
import PaddleManager from '../managers/PaddleManager';
import ParticleManager from '../managers/ParticleManager';
import PhysicsManager from '../managers/PhysicsManager';
import PowerUpManager from '../managers/PowerUpManager';
import ScoreManager from '../managers/ScoreManager';
import TimeManager from '../managers/TimeManager';
import UIManager from '../managers/UIManager';
import ErrorManager from '../managers/ErrorManager';
import { AdaptiveRenderer } from '../plugins/PerformanceMonitor';
import { MarketSim } from '../simulations/MarketSim';
import wrapManagerWithErrorHandling from '../utils/wrapWithErrorHandling';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

class BreakoutInitializer {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Initialize all game components
   */
  public initialize(): void {
    try {
      // Initialize managers in the correct order
      this.initializeManagers();
      
      // Wrap managers with error handling if error manager is available
      this.wrapManagersWithErrorHandling();
      
      // Set up game objects and systems
      const physicsManager = this.scene.getPhysicsManager();
      if (physicsManager) {
        physicsManager.initializePhysics();
      }
      
      // Initialize game state
      const gameStateManager = this.scene['gameStateManager'] as GameStateManager;
      if (gameStateManager) {
        gameStateManager.initialize();
      }
    
      // Create game objects
      const paddleManager = this.scene.getPaddleManager();
      if (paddleManager && typeof paddleManager.createPaddles === 'function') {
        paddleManager.createPaddles();
    }
    
      const ballManager = this.scene.getBallManager();
      if (ballManager) {
        ballManager.createBall();
      }
      
      // Set up collision handlers
      const collisionManager = this.scene.getCollisionManager();
      if (collisionManager) {
        collisionManager.setupCollisionHandlers();
      }
      // Set up event listeners
      const eventManager = this.scene.getEventManager();
      if (eventManager && typeof eventManager.setupEventListeners === 'function') {
        eventManager.setupEventListeners();
      }
      
      // Update UI
      const uiManager = this.scene.getUIManager();
      if (uiManager && typeof uiManager.updateInitialUI === 'function') {
        uiManager.updateInitialUI();
    }
    
      // Initialize the level
      const levelManager = this.scene.getLevelManager();
      if (levelManager && typeof levelManager.initLevel === 'function') {
        levelManager.initLevel();
  }
      
      // Initialize performance monitoring
      this.initializePerformanceMonitoring();
    } catch (error) {
      console.error('Error initializing game:', error);
      // Show error using scene's method if available
      if (this.scene.showFatalError) {
        this.scene.showFatalError(
          error instanceof Error ? error.message : 'Failed to initialize game'
        );
}
    }
  }

  /**
   * Initialize all game managers
   */
  private initializeManagers(): void {
    // Core systems - use existing instances if they've already been created
    if (!this.scene.getEventManager()) {
      this.scene['eventManager'] = new EventManager(this.scene);
    }
    
    if (!this.scene.getTimeManager()) {
      this.scene['timeManager'] = new TimeManager(this.scene, this.scene.getEventManager());
    }
    
    if (!this.scene.getParticleManager()) {
      this.scene['particleManager'] = new ParticleManager(this.scene);
    }
    
    if (!this.scene.getPhysicsManager()) {
      this.scene['physicsManager'] = new PhysicsManager(this.scene);
    }
    
    // Create market simulation before level manager
    this.scene['marketSim'] = new MarketSim();
    
    // Game state and UI
    this.scene['gameStateManager'] = new GameStateManager(this.scene);
    this.scene['uiManager'] = new UIManager(this.scene);
    this.scene['scoreManager'] = new ScoreManager(this.scene);
    this.scene['inputManager'] = new InputManager(this.scene);
    
    // Game objects
    this.scene['paddleManager'] = new PaddleManager(this.scene);
    this.scene['brickManager'] = new BrickManager(this.scene);
    this.scene['ballManager'] = new BallManager(this.scene);
    this.scene['powerUpManager'] = new PowerUpManager(this.scene);
    
    // Game systems that depend on other managers
    this.scene['collisionManager'] = new CollisionManager(this.scene);
    this.scene['levelManager'] = new LevelManager(this.scene, this.scene['marketSim']);
  }
  
  /**
   * Wrap all managers with error handling
   */
  private wrapManagersWithErrorHandling(): void {
    const errorManager = this.scene.getErrorManager ? this.scene.getErrorManager() : null;
    if (!errorManager) return;
    
    // Get all manager names
    const managerNames = Object.keys(this.scene)
      .filter(key => key.endsWith('Manager'));
    
    // Wrap each manager with error handling
    for (const managerName of managerNames) {
      const manager = this.scene[managerName];
      if (manager && typeof manager === 'object') {
        wrapManagerWithErrorHandling(
          manager, 
          errorManager,
          managerName
        );
      }
    }
  }
  
  /**
   * Initialize performance monitoring
   */
  private initializePerformanceMonitoring(): void {
    try {
      this.scene['adaptiveRenderer'] = new AdaptiveRenderer(this.scene);
    } catch (error) {
      console.warn('Adaptive renderer not available:', error);
    }
  }
  
  /**
   * Shutdown and cleanup all game components
   */
  public shutdown(): void {
    // Clean up all managers
    this.cleanupManagers();
  }
    
  /**
   * Clean up all managers
   */
  private cleanupManagers(): void {
    // Clean up the event manager last since other managers might emit events during cleanup
    let eventManager = null;
    
    // Get all manager names
    const managerNames = Object.keys(this.scene)
      .filter(key => key.endsWith('Manager'));
    
    // Clean up each manager that has a cleanup method
    managerNames.forEach(managerName => {
      // Save event manager for last
      if (managerName === 'eventManager') {
        eventManager = this.scene[managerName];
        return;
      }
      
      const manager = this.scene[managerName];
      if (manager && typeof manager.cleanup === 'function') {
        try {
          manager.cleanup();
        } catch (error) {
          console.warn(`Error cleaning up ${managerName}:`, error);
        }
      }
    });
    
    // Clean up any other resources
    if (this.scene['adaptiveRenderer'] && 
        typeof this.scene['adaptiveRenderer'].cleanup === 'function') {
      this.scene['adaptiveRenderer'].cleanup();
    }
    
    // Clean up event manager last
    if (eventManager && typeof eventManager.cleanup === 'function') {
      try {
        eventManager.cleanup();
      } catch (error) {
        console.warn('Error cleaning up eventManager:', error);
      }
    }
  }
}

export default BreakoutInitializer;