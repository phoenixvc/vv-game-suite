import { BrickManager, CollisionManager, PaddleManager, PhysicsManager, ThemeManager, UIManager } from '@/managers';
import * as Phaser from 'phaser';
import { DEFAULT_MARKET_DATA, GAME_STATE } from '../../constants/GameConstants';
import BallManager from '../../managers/Ball/BallManager';
import ErrorManager from '../../managers/ErrorManager';
import InputManager from '../../managers/InputManager';
import LevelManager from '../../managers/LevelManager';
import ParticleManager from '../../managers/ParticleManager';
import PowerUpManager from '../../managers/PowerUpManager';
import ScoreManager from '../../managers/ScoreManager';
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
import GameHUD from '@/ui/GameHUD';
import PaddleController from '../../controllers/paddle/PaddleController';

/**
 * Main Breakout game scene
 */
class BreakoutScene extends BaseScene {
  // Game objects
  private bricks!: Phaser.GameObjects.Group;
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private powerUps!: Phaser.GameObjects.Group;
  private vaultWalls: Phaser.Physics.Matter.Image[] = []; // Changed to Matter.Image for physics
  
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
  public getHUDManager: () => GameHUD;
  public setHUDManager: (manager: GameHUD) => void;
  public getThemeManager: () => ThemeManager;
  public setThemeManager: (manager: ThemeManager) => void;
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
    this.getPhysicsManager = this.managers.getPhysicsManager;
    this.setPhysicsManager = this.managers.setPhysicsManager;
    this.getSoundManager = this.managers.getSoundManager;
    this.getAngleFactor = this.managers.getAngleFactor;
    this.setAngleFactor = this.managers.setAngleFactor;
    this.getMarketSim = this.managers.getMarketSim;
    this.setMarketSim = this.managers.setMarketSim;
    this.getMarketData = this.managers.getMarketData;
    this.getThemeManager = this.managers.getThemeManager; // Add this line
    this.setThemeManager = this.managers.setThemeManager; // Add this line
    
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
      // Create fallback textures first to ensure they're available
      this.createFallbackTextures();
      
      // Load vault wall image with just the filename - NO paths
      this.load.image('vault-wall', 'vault-wall.svg');
      
      // Handle loading errors for vault wall
      this.load.once('loaderror', (fileObj: any) => {
        if (fileObj.key === 'vault-wall') {
          console.warn('Failed to load vault-wall texture, using fallback');
          // Use the fallback texture we created
          if (this.textures.exists('vault-wall-fallback')) {
            console.log('Using vault-wall-fallback texture');
          }
        }
      });
      
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
  
  /**
   * Create fallback textures for essential game elements
   */
  private createFallbackTextures(): void {
    try {
      // Create a simple texture for vault walls
      const wallGraphics = this.make.graphics({ x: 0, y: 0 });
      wallGraphics.fillStyle(0x3355ff);
      wallGraphics.fillRect(0, 0, 20, 600);
      wallGraphics.lineStyle(2, 0x0033cc);
      wallGraphics.strokeRect(0, 0, 20, 600);
      wallGraphics.generateTexture('vault-wall-fallback', 20, 600);
      wallGraphics.destroy();
      
      console.log('Created fallback textures for vault walls');
    } catch (error) {
      console.error('Error creating fallback textures:', error);
    }
  }
  
/**
 * Create vault walls and roof for the game area
 * These walls will bounce the ball back with increased velocity
 */
private createVaultWalls(): void {
  try {
    console.log('Creating vault walls and roof for the level');
    
    // Get the current level
    const currentLevel = this.levelManager ? this.levelManager.getCurrentLevel() : 1;
    
    // Only create walls for the first level
    if (currentLevel !== 1) {
      console.log('Skipping vault walls creation for level', currentLevel);
      return;
    }
    
    // Get game dimensions
    const width = this.scale.width;
    const height = this.scale.height;
    
    // Wall thickness
    const wallThickness = 20;
    
    // Check if vault-wall texture exists, otherwise use fallback
    const textureKey = this.textures.exists('vault-wall') ? 'vault-wall' : 'vault-wall-fallback';
    console.log(`Using texture ${textureKey} for vault walls`);
    
    // Create left wall with rectangle physics body - IMPROVED CONFIGURATION
    const leftWall = this.matter.add.image(
      wallThickness / 2,
      height / 2,
      textureKey,
      undefined,
      {
        isStatic: true,
        label: 'leftVaultWall',
        ignoreGravity: true,  // Explicitly ignore gravity
        frictionAir: 0,       // No air friction
        friction: 0.01,       // Low friction
        restitution: 1.2      // Bounce factor
      }
    );
    
    // Set up physics properties for left wall
    leftWall.setDisplaySize(wallThickness, height);
    leftWall.setTint(0x3355ff);
    // Use a more explicit way to set the rectangle shape
    leftWall.setBody({
      type: 'rectangle',
      width: wallThickness,
      height: height
    }, {
      isStatic: true,  // Reinforce that this is static
      label: 'leftVaultWall'
    });
    
    // Create right wall with rectangle physics body - IMPROVED CONFIGURATION
    const rightWall = this.matter.add.image(
      width - wallThickness / 2,
      height / 2,
      textureKey,
      undefined,
      {
        isStatic: true,
        label: 'rightVaultWall',
        ignoreGravity: true,  // Explicitly ignore gravity
        frictionAir: 0,       // No air friction
        friction: 0.01,       // Low friction
        restitution: 1.2      // Bounce factor
      }
    );
    
    // Set up physics properties for right wall
    rightWall.setDisplaySize(wallThickness, height);
    rightWall.setFlipX(true);
    rightWall.setTint(0x3355ff);
    // Use a more explicit way to set the rectangle shape
    rightWall.setBody({
      type: 'rectangle',
      width: wallThickness,
      height: height
    }, {
      isStatic: true,  // Reinforce that this is static
      label: 'rightVaultWall'
    });
    
    // Create roof with rectangle physics body - IMPROVED CONFIGURATION
    const roof = this.matter.add.image(
      width / 2,
      wallThickness / 2,
      textureKey,
      undefined,
      {
        isStatic: true,
        label: 'roofVaultWall',
        ignoreGravity: true,  // Explicitly ignore gravity
        frictionAir: 0,       // No air friction
        friction: 0.01,       // Low friction
        restitution: 1.3      // Bounce factor
      }
    );
    
    // Set up physics properties for roof
    roof.setDisplaySize(width, wallThickness);
    roof.setTint(0x33ff55);
    // Use a more explicit way to set the rectangle shape
    roof.setBody({
      type: 'rectangle',
      width: width,
      height: wallThickness
    }, {
      isStatic: true,  // Reinforce that this is static
      label: 'roofVaultWall'
    });
    
    // Add glow effects if postFX is available
    try {
      if (leftWall.postFX) {
        leftWall.postFX.addGlow(0x0066ff, 4, 0, false, 0.1, 16);
        rightWall.postFX.addGlow(0x0066ff, 4, 0, false, 0.1, 16);
        roof.postFX.addGlow(0x00ff66, 4, 0, false, 0.1, 16);
      }
    } catch (error) {
      console.warn('Failed to add glow effects to walls:', error);
    }
    
    // Store references to the walls
    this.vaultWalls.push(leftWall, rightWall, roof);
    
    // Set up collision categories if physics manager is available
    if (this.physicsManager) {
      const wallCategory = this.physicsManager.wallCategory;
      const ballCategory = this.physicsManager.ballCategory;
      
      // Set collision categories for walls
      leftWall.setCollisionCategory(wallCategory);
      leftWall.setCollidesWith(ballCategory);
      
      rightWall.setCollisionCategory(wallCategory);
      rightWall.setCollidesWith(ballCategory);
      
      roof.setCollisionCategory(wallCategory);
      roof.setCollidesWith(ballCategory);
    } else {
      console.warn('Physics manager not available, skipping collision category setup for walls');
    }
    
    // IMPORTANT: Remove any existing collision listeners to avoid duplicates
    this.matter.world.off('collisionstart', this.handleWallCollisions, this);
    
    // Add collision event for walls to increase ball speed on collision
    this.matter.world.on('collisionstart', this.handleWallCollisions, this);
    
    console.log('Vault walls and roof created successfully');
  } catch (error) {
    console.error('Error creating vault walls:', error);
    if (this.errorManager) {
      this.errorManager.logError('Failed to create vault walls', error instanceof Error ? error.stack : undefined);
    }
  }
}

// Extract collision handling to a separate method to avoid duplicate listeners
private handleWallCollisions(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
  const pairs = event.pairs;
  
  for (let i = 0; i < pairs.length; i++) {
    const bodyA = pairs[i].bodyA;
    const bodyB = pairs[i].bodyB;
    
    // Use type assertion to access the label property
    const bodyALabel = (bodyA as any).label;
    const bodyBLabel = (bodyB as any).label;
    
    // Check if one body is a ball and the other is a vault wall
    const isWallCollision = 
      (bodyALabel === 'ball' && (bodyBLabel === 'leftVaultWall' || bodyBLabel === 'rightVaultWall' || bodyBLabel === 'roofVaultWall')) ||
      (bodyBLabel === 'ball' && (bodyALabel === 'leftVaultWall' || bodyALabel === 'rightVaultWall' || bodyALabel === 'roofVaultWall'));
    
    if (isWallCollision) {
      // Get the ball body
      const ballBody = bodyALabel === 'ball' ? bodyA : bodyB;
      // Get the wall body
      const wallBody = bodyALabel === 'ball' ? bodyB : bodyA;
      
      // Find the corresponding ball game object
      const ball = this.ballManager.getAllBalls().find(b => b.body === ballBody);
      
      console.log(`Ball collision with ${(wallBody as any).label} detected`);
      
      // Get the current consecutive hit count (if available)
      const consecutiveHits = ball ? (ball.getData('consecutivePaddleHits') || 0) : 0;
      
      // Calculate speed multiplier: base 15% + 10% per consecutive hit
      const speedMultiplier = 1.15 * (1 + consecutiveHits * 0.1);
      
      console.log(`Wall bounce with speed multiplier: ${speedMultiplier}`);
      
      // Apply the new velocity with the speed multiplier
      const vx = ballBody.velocity.x * speedMultiplier;
      const vy = ballBody.velocity.y * speedMultiplier;
      
      // Apply the new velocity
      this.matter.body.setVelocity(ballBody, { x: vx, y: vy });
      
      // If we have a ball reference, increase the consecutive hit counter
      if (ball) {
        // Increment the consecutive hit counter
        ball.setData('consecutivePaddleHits', consecutiveHits + 1);
        
        // Make the ball smaller with each consecutive hit (up to a minimum size)
        const currentScale = ball.scaleX;
        const newScale = Math.max(currentScale * 0.95, 0.5); // Reduce by 5% each hit, minimum 50% of original size
        
        // Only shrink if we're above the minimum size
        if (currentScale > 0.5) {
          ball.setScale(newScale);
          
          // Adjust the physics body size to match the visual size
          if (ball.body) {
            // Get the original radius (assuming it's stored in the ball's data)
            const originalRadius = ball.getData('originalRadius') || 10; // Default to 10 if not set
            const newRadius = originalRadius * newScale;
            
            // Recreate the body with the new size
            try {
              // Store the current velocity before changing the body
              const currentVelocity = { 
                x: vx, // Use the already calculated new velocity 
                y: vy
              };
              
              // Store the current position
              const currentPosition = {
                x: ball.x,
                y: ball.y
              };
              
              // Remove the existing body from the world
              this.matter.world.remove(ball.body);
              
              // Create a new circular body with the scaled radius
              const newBody = this.matter.bodies.circle(
                currentPosition.x,
                currentPosition.y,
                newRadius,
                {
                  label: 'ball',
                  frictionAir: 0,
                  friction: 0.01,
                  restitution: 1.0,
                  density: 0.002
                }
              );
              
              // Set the new body on the ball sprite
              ball.setExistingBody(newBody);
              
              // Restore the position
              ball.setPosition(currentPosition.x, currentPosition.y);
              
              // Apply the new velocity
              this.matter.body.setVelocity(newBody, currentVelocity);
              
              // Set collision categories if physics manager is available
              if (this.physicsManager) {
                ball.setCollisionCategory(this.physicsManager.ballCategory);
                ball.setCollidesWith([
                  this.physicsManager.brickCategory,
                  this.physicsManager.paddleCategory,
                  this.physicsManager.wallCategory
                ]);
              }
              
              console.log(`Ball resized after wall collision to scale: ${newScale}, new radius: ${newRadius}`);
            } catch (error) {
              console.error('Error resizing ball after wall collision:', error);
              // If resizing fails, just keep the visual scale change
            }
          }
        }
      }
      
      // Play bounce sound if available
      const soundManager = this.getSoundManager();
      if (soundManager && typeof soundManager.playSound === 'function') {
        soundManager.playSound('bounce');
      }
      
      // Create particle effect at collision point
      if (this.particleManager) {
        // Determine color based on which wall was hit
        let color = 0x4444ff; // Default blue
        const wallLabel = (wallBody as any).label;
        if (wallLabel === 'roofVaultWall') {
          color = 0x44ff44; // Green for roof
        } else if (wallLabel === 'leftVaultWall') {
          color = 0xff4444; // Red for left wall
        } else if (wallLabel === 'rightVaultWall') {
          color = 0xffff44; // Yellow for right wall
        }
        
        // Change particle color based on consecutive hits
        if (ball) {
          const hitColors = [0x00ffff, 0x00ff00, 0xffff00, 0xff8800, 0xff0000, 0xff00ff];
          const colorIndex = Math.min(consecutiveHits, hitColors.length - 1);
          color = hitColors[colorIndex];
        }
        
        this.particleManager.createBounceEffect(
          ballBody.position.x,
          ballBody.position.y,
          color
        );
      }
      
      // Add a flash effect to the wall that was hit
      const hitWall = this.vaultWalls.find(wall => wall.body === wallBody);
      
      if (hitWall) {
        // Store the original tint
        const originalTint = hitWall.tintTopLeft;
        
        // Flash the wall white
        hitWall.setTint(0xffffff);
        
        // Reset tint after a short delay
        this.time.delayedCall(100, () => {
          hitWall.setTint(originalTint);
        });
      }
    }
  }
}

/**
 * Remove the vault walls and roof (used when progressing to later levels)
 */
public removeVaultWalls(): void {
  try {
    console.log('Removing vault walls and roof');
    
    // Remove collision listener first
    this.matter.world.off('collisionstart', this.handleWallCollisions, this);
    
    // Remove all vault walls
    this.vaultWalls.forEach(wall => {
      if (wall && wall.body) {
        // Remove physics body and destroy game object
        wall.destroy();
      }
    });
    
    // Clear the array
    this.vaultWalls = [];
    
    console.log('Vault walls and roof removed successfully');
  } catch (error) {
    console.error('Error removing vault walls:', error);
    if (this.errorManager) {
      this.errorManager.logError('Failed to remove vault walls', error instanceof Error ? error.stack : undefined);
    }
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
    
    // Create vault walls for the first level
    this.createVaultWalls();
    
    // Paddle collisions are now handled by PaddleManager
    // No need to call this.setupPaddleCollisions() anymore
    
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
   * Reset consecutive paddle hits when a brick is hit
   * This should be called from the brick collision handler
   */
  public resetConsecutiveHits(ball: Phaser.Physics.Matter.Sprite): void {
    try {
      if (ball && ball.getData('consecutivePaddleHits') > 0) {
        console.log('Brick hit, resetting consecutive paddle hits');
        ball.setData('consecutivePaddleHits', 0);
        
        // Reset ball size to original if it was shrunk
        const currentScale = ball.scaleX;
        if (currentScale < 1) {
          ball.setScale(1);
          
          // Get the original radius
          const originalRadius = ball.getData('originalRadius') || 10;
          
          // Store the current velocity before changing the body
          const currentVelocity = { 
            x: ball.body.velocity.x, 
            y: ball.body.velocity.y 
          };
          
          // Store the current position
          const currentPosition = {
            x: ball.x,
            y: ball.y
          };
          
          // Remove the existing body from the world
          this.matter.world.remove(ball.body);
          
          // Create a new circular body with the original radius
          const newBody = this.matter.bodies.circle(
            currentPosition.x,
            currentPosition.y,
            originalRadius,
            {
              label: 'ball',
              frictionAir: 0,
              friction: 0.01,
              restitution: 1.0,
              density: 0.002
            }
          );
          
          // Set the new body on the ball sprite
          ball.setExistingBody(newBody);
          
          // Restore the position
          ball.setPosition(currentPosition.x, currentPosition.y);
          
          // Restore the velocity
          this.matter.body.setVelocity(newBody, currentVelocity);
          
          // Set collision categories if physics manager is available
          if (this.physicsManager) {
            ball.setCollisionCategory(this.physicsManager.ballCategory);
            ball.setCollidesWith([
              this.physicsManager.brickCategory,
              this.physicsManager.paddleCategory,
              this.physicsManager.wallCategory
            ]);
          }
          
          console.log('Ball size reset to original');
        }
      }
    } catch (error) {
      console.error('Error resetting consecutive hits:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to reset consecutive hits', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Initialize ball properties
   * This should be called when creating a new ball
   */
  public initializeBallProperties(ball: Phaser.Physics.Matter.Sprite): void {
    try {
      // Store the original radius for later scaling calculations
      const radius = ball.displayWidth / 2;
      ball.setData('originalRadius', radius);
      
      // Initialize consecutive paddle hits counter
      ball.setData('consecutivePaddleHits', 0);
      
      console.log(`Ball initialized with radius: ${radius}`);
    } catch (error) {
      console.error('Error initializing ball properties:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to initialize ball properties', error instanceof Error ? error.stack : undefined);
      }
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
      'shutdown',
      'createVaultWalls',
      'removeVaultWalls'
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
      
      // Remove vault walls
      this.removeVaultWalls();
      
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
