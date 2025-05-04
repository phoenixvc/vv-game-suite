import PaddleManager from '@/managers/PaddleManager';
import * as Phaser from 'phaser';
import { GAME_CONFIG } from '../../constants/GameConstants';
import PaddleController from '../../controllers/paddle/PaddleController';
import BreakoutScene from './BreakoutScene';

/**
 * Handles paddle-related functionality for the Breakout scene
 */
export class BreakoutScenePaddles {
  private scene: BreakoutScene;
  private paddleControllers: Record<string, PaddleController> = {};
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private paddleManager?: PaddleManager; // Changed to optional
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    // Remove the immediate call to getPaddleManager()
  }
  
  /**
   * Add a paddle controller
   */
  public addPaddleController(id: string, controller: PaddleController): void {
    this.paddleControllers[id] = controller;
  }
  
  /**
   * Get a paddle controller by ID
   */
  public getPaddleControllerById(id: string): PaddleController | undefined {
    return this.paddleControllers[id];
  }
  
  /**
   * Get all paddle controllers
   */
  public getAllPaddleControllers(): Record<string, PaddleController> {
    return this.paddleControllers;
  }
  
  /**
   * Get all paddles
   */
  public getAllPaddles(): Phaser.Physics.Matter.Sprite[] {
    // First try to get paddles from the paddle manager
    const paddleManager = this.getPaddleManager();
    if (paddleManager && typeof paddleManager.getPaddles === 'function') {
      const managerPaddles = paddleManager.getPaddles();
      if (managerPaddles && managerPaddles.length > 0) {
        return managerPaddles;
      }
    }
    
    // If that fails, collect paddles from controllers
    if (Object.keys(this.paddleControllers).length > 0) {
      const controllerPaddles: Phaser.Physics.Matter.Sprite[] = [];
      
      Object.values(this.paddleControllers).forEach(controller => {
        if (controller && controller.getPaddle && typeof controller.getPaddle === 'function') {
          const paddle = controller.getPaddle();
          if (paddle) {
            controllerPaddles.push(paddle);
          }
        }
      });
      
      if (controllerPaddles.length > 0) {
        return controllerPaddles;
      }
    }
    
    // If all else fails, return the paddles from this class
    return this.paddles;
  }
  
  /**
   * Get the main paddle manager (bottom paddle)
   */
  public getPaddleManager(): PaddleManager | undefined {
    // Return the existing paddle manager if we have one
    if (this.paddleManager) {
      return this.paddleManager;
    }
    
    // Try to get it from the scene
    if ((this.scene as any).paddleManager) {
      this.paddleManager = (this.scene as any).paddleManager;
      return this.paddleManager;
    }
    
    // Lazy initialization of paddleManager if needed
    console.log('Creating new PaddleManager');
    this.paddleManager = new PaddleManager(this.scene);
    return this.paddleManager;
  }
  
  /**
   * Set the paddle manager (for use by initializers)
   */
  public setPaddleManager(manager: PaddleManager): void {
    console.log('Setting paddle manager in BreakoutScenePaddles');
    this.paddleManager = manager;
  }
  
  /**
   * Create paddles for the game
   */
  public createPaddles(): void {
    console.log('Creating paddles for the game');
    
    try {
      // Clear existing paddles
      this.paddles = [];
      
      // Get physics manager
      const physicsManager = this.scene.getPhysicsManager();
      if (!physicsManager) {
        console.error('Physics manager not available');
        return;
      }
      
      // Get game dimensions
      const { width, height } = this.scene.scale;
      
      // Create bottom paddle (main player paddle)
      this.createPaddle({
        id: 'bottom',
        x: width / 2,
        y: height - 50,
        width: GAME_CONFIG.PADDLE.WIDTH,
        height: GAME_CONFIG.PADDLE.HEIGHT,
        edge: 'top',
        isPlayer: true
      });
      
      // Always create top paddle (as seen in the screenshot)
      this.createPaddle({
        id: 'top',
        x: width / 2,
        y: 50,
        width: GAME_CONFIG.PADDLE.WIDTH,
        height: GAME_CONFIG.PADDLE.HEIGHT,
        edge: 'bottom',
        isPlayer: false
      });
      
      // Create other paddles based on level configuration
      const levelManager = this.scene.getLevelManager();
      const currentLevel = levelManager ? levelManager.getCurrentLevel() : 1;
      
      // Add side paddles for higher levels
      if (currentLevel >= 3) {
        // Left paddle
        this.createPaddle({
          id: 'left',
          x: 20,
          y: height / 2,
          width: GAME_CONFIG.PADDLE.HEIGHT, // Swapped for vertical paddle
          height: GAME_CONFIG.PADDLE.WIDTH * 1.5, // Swapped for vertical paddle
          edge: 'right',
          isPlayer: false,
          orientation: 'vertical'
        });
        
        // Right paddle
        this.createPaddle({
          id: 'right',
          x: width - 20,
          y: height / 2,
          width: GAME_CONFIG.PADDLE.HEIGHT, // Swapped for vertical paddle
          height: GAME_CONFIG.PADDLE.WIDTH * 1.5, // Swapped for vertical paddle
          edge: 'left',
          isPlayer: false,
          orientation: 'vertical'
        });
      }
      
      console.log(`Created ${this.paddles.length} paddles`);
      
      // Emit event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('paddlesCreated', { paddles: this.paddles });
      }
      
      // Initialize the PaddleManager as well
      const paddleManager = this.getPaddleManager();
      if (paddleManager && typeof paddleManager.createPaddles === 'function') {
        // Tell the manager which edges should have active paddles
        const activePaddles = ['bottom', 'top'];
        if (currentLevel >= 3) {
          activePaddles.push('left', 'right');
        }
        
        // Store in registry for the manager to use
        this.scene.registry.set('activePaddles', activePaddles);
        
        // Create paddles in the manager
        paddleManager.createPaddles();
      }
    } catch (error) {
      console.error('Error creating paddles:', error);
    }
  }
  
  /**
   * Create a single paddle
   */
  private createPaddle(options: {
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    edge: string;
    isPlayer: boolean;
    orientation?: string;
  }): void {
    try {
      // Create paddle sprite
      const paddle = this.scene.matter.add.sprite(
        options.x,
        options.y,
        'paddle'
      );
      
      // Set paddle size
      paddle.setDisplaySize(options.width, options.height);
      
      // Set paddle properties
      paddle.setStatic(true);
      paddle.setData('id', options.id);
      paddle.setData('edge', options.edge);
      paddle.setData('orientation', options.orientation || 'horizontal');
      
      // Set collision properties
      const physicsManager = this.scene.getPhysicsManager();
      if (physicsManager) {
        paddle.setCollisionCategory(physicsManager.paddleCategory);
        paddle.setCollidesWith([physicsManager.ballCategory, physicsManager.powerUpCategory]);
      }
      
      // Create controller with the appropriate parameters
      // Pass the paddle object as the second parameter and orientation as the third
      const controlType: 'keyboard' | 'mouse' | 'touch' | 'ai' = options.isPlayer ? 'keyboard' : 'ai';
      const controlOptions = {
        controlType: controlType,
        difficulty: 0.5
      };
      
      const orientation = (options.orientation as 'horizontal' | 'vertical') || 'horizontal';
      
      const controller = new PaddleController(
        this.scene,
        paddle,
        orientation,
        controlOptions
      );
      
      // Add to arrays
      this.paddles.push(paddle);
      this.paddleControllers[options.id] = controller;
      
      console.log(`Created paddle: ${options.id} at (${options.x}, ${options.y})`);
    } catch (error) {
      console.error(`Error creating paddle ${options.id}:`, error);
    }
  }
}

export default BreakoutScenePaddles;