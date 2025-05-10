import { PaddleManager } from '@/managers';
import * as Phaser from 'phaser';
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
   * Create paddles for the game - MODIFIED TO USE PADDLE MANAGER
   */
  public createPaddles(): void {
    console.log('Creating paddles for the game');
    
    try {
      // Get the paddle manager
      const paddleManager = this.getPaddleManager();
      
      // Check if paddles already exist
      if (paddleManager && paddleManager.getPaddles().length > 0) {
        console.log('Paddles already exist, skipping creation');
        return;
      }
      
      // Set up active paddles based on level
      const levelManager = this.scene.getLevelManager();
      const currentLevel = levelManager ? levelManager.getCurrentLevel() : 1;
      
      // Determine which edges should have active paddles
      const activePaddles = ['bottom'];
      if (currentLevel >= 3) { // Changed from level 2+ to level 3+
        activePaddles.push('top');
      }
      if (currentLevel >= 5) {
        activePaddles.push('left');
      }
      if (currentLevel >= 7) {
        activePaddles.push('right');
      }
      
      // Store in registry for the manager to use
      this.scene.registry.set('activePaddles', activePaddles);
      
      // Create paddles in the manager
      // if (paddleManager && typeof paddleManager.createPaddles === 'function') {
      //   paddleManager.createPaddles();
      // }
    } catch (error) {
      console.error('Error creating paddles:', error);
    }
  }

}

export default BreakoutScenePaddles;