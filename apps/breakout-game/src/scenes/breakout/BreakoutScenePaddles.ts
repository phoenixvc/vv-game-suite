import * as Phaser from 'phaser';
import PaddleManager from '../../managers/PaddleManager';
import BreakoutScene from './BreakoutScene';

/**
 * Handles all paddle-related functionality for the BreakoutScene
 */
export class BreakoutScenePaddles {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Add a paddle controller with a specific ID
   * @param id The ID for the paddle controller
   * @param controller The paddle controller to add
   */
  public addPaddleController = (id: string, controller: PaddleManager): void => {
    this.scene['paddleControllers'][id] = controller;
    
    // Add the paddles to our paddles array for easy access
    const paddles = controller.getPaddles();
    if (paddles && Array.isArray(paddles)) {
      // Add each paddle from the array if it's not already included
      paddles.forEach(paddle => {
        if (!this.scene['paddles'].includes(paddle)) {
          this.scene['paddles'].push(paddle);
        }
      });
    }
  }
  
  /**
   * Get a specific paddle controller by ID
   * @param id The ID of the paddle controller to get
   * @returns The paddle controller or undefined if not found
   */
  public getPaddleControllerById = (id: string): PaddleManager | undefined => {
    return this.scene['paddleControllers'][id];
  }
  
  /**
   * Get all paddle controllers
   * @returns Record of all paddle controllers
   */
  public getAllPaddleControllers = (): Record<string, PaddleManager> => {
    return this.scene['paddleControllers'];
  }
  
  /**
   * Get all paddle sprites
   * @returns Array of all paddle sprites
   */
  public getAllPaddles = (): Phaser.Physics.Matter.Sprite[] => {
    return this.scene['paddles'];
  }
  
  /**
   * Get the default paddle manager (for backward compatibility)
   * @returns The default paddle controller
   */
  public getPaddleManager = (): PaddleManager | undefined => {
    return this.scene['paddleControllers']['default'];
  }
  
  /**
   * Create the four paddles at the edges of the screen
   * This is called by the initializer
   */
  public createPaddles = (): void => {
    // Initialize the paddles array if it doesn't exist
    if (!this.scene['paddles']) {
      this.scene['paddles'] = [];
    }
    
    // Initialize the paddleControllers object if it doesn't exist
    if (!this.scene['paddleControllers']) {
      this.scene['paddleControllers'] = {};
    }
    
    // Create a single PaddleManager to manage all paddles
    const paddleManager = new PaddleManager(this.scene);
    
    // Use the PaddleManager to create paddles
    paddleManager.createPaddles();
    
    // Get all paddles created by the manager
    const paddles = paddleManager.getPaddles();
    
    // Store paddles in the scene for easy access
    this.scene['paddles'] = paddles;
    
    // Add the manager as the default controller
    this.scene['paddleControllers']['default'] = paddleManager;
    
    // Add individual controllers for each edge
    const edges = ['bottom', 'top', 'left', 'right'];
    edges.forEach(edge => {
      // Check if the paddle exists for this edge
      const paddle = paddleManager.getPaddleByEdge(edge);
      if (paddle) {
        // Use the same manager for all edges
        this.scene['paddleControllers'][edge] = paddleManager;
      }
    });
    
    // Apply physics categories to paddles
    const physicsManager = this.scene['physicsManager'];
    if (physicsManager) {
      paddles.forEach(paddle => {
        physicsManager.setCollisionCategory(paddle, 'paddle');
      });
    }
  }
}