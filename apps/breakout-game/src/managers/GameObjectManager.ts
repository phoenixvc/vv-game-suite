import * as Phaser from 'phaser';
import BreakoutScene from '../scenes/breakout/BreakoutScene';

/**
 * Manages the creation and lifecycle of game objects and physics bodies
 */
class GameObjectManager {
  private scene: BreakoutScene;
  private gameObjects: Map<string, Phaser.GameObjects.GameObject> = new Map();
  private physicsBodies: Map<string, MatterJS.BodyType> = new Map();
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Create initial game objects
   */
  public createInitialObjects(): void {
    console.log('Creating initial game objects');
    
    try {
      // Create background
      this.createBackground();
      
      // Create any additional game objects needed at startup
      this.createBoundaries();
      
      console.log('Initial game objects created successfully');
    } catch (error) {
      console.error('Error creating initial game objects:', error);
      throw error;
    }
  }
  
  /**
   * Create game background
   */
  private createBackground(): void {
    try {
      // Create a background using available textures or a gradient
      const { width, height } = this.scene.scale;
      
      // Check if we have a background texture
      if (this.scene.textures.exists('background')) {
        const background = this.scene.add.image(width / 2, height / 2, 'background');
        background.setDisplaySize(width, height);
        this.registerGameObject('background', background);
      } else {
        // Create a gradient background if no texture is available
        const background = this.scene.add.graphics();
        background.fillGradientStyle(
          0x111111, 0x111111, 
          0x222222, 0x222222, 
          1
        );
        background.fillRect(0, 0, width, height);
        this.registerGameObject('background', background);
      }
    } catch (error) {
      console.warn('Error creating background:', error);
      // Continue without background rather than failing completely
    }
  }
  
  /**
   * Create game boundaries
   */
  private createBoundaries(): void {
    try {
      
      if (!this.scene.textures.exists('pixel')) {
        const graphics = this.scene.make.graphics({ x: 0, y: 0 });
        graphics.fillStyle(0xFFFFFF);
        graphics.fillRect(0, 0, 1, 1);
        graphics.generateTexture('pixel', 1, 1);
        graphics.destroy();
      }

      const physicsManager = this.scene.getPhysicsManager();
      if (!physicsManager) {
        console.warn('Physics manager not available, skipping boundaries creation');
        return;
      }
      
      const { width, height } = this.scene.scale;
      
      // Create invisible walls for the game boundaries
      // These will be used for collision detection
      const wallThickness = 50; // Thick enough to prevent tunneling
      
      // Top wall
      const topWall = this.scene.matter.add.rectangle(
        width / 2, -wallThickness / 2,
        width, wallThickness,
        { isStatic: true }
      );
      this.registerPhysicsBody('topWall', topWall);
      
      // Bottom wall (death zone)
      const bottomWall = this.scene.matter.add.rectangle(
        width / 2, height + wallThickness / 2,
        width, wallThickness,
        { isStatic: true }
      );
      this.registerPhysicsBody('bottomWall', bottomWall);
      
      // Left wall
      const leftWall = this.scene.matter.add.rectangle(
        -wallThickness / 2, height / 2,
        wallThickness, height,
        { isStatic: true }
      );
      this.registerPhysicsBody('leftWall', leftWall);
      
      // Right wall
      const rightWall = this.scene.matter.add.rectangle(
        width + wallThickness / 2, height / 2,
        wallThickness, height,
        { isStatic: true }
      );
      this.registerPhysicsBody('rightWall', rightWall);
      
      // Set collision categories for the walls
      if (typeof physicsManager.setCollisionCategory === 'function') {
        // Create game objects for the walls so we can set collision categories
        // This is necessary because setCollisionCategory expects a GameObject with a body
        const createWallSprite = (x: number, y: number, width: number, height: number, key: string) => {
          const wall = this.scene.matter.add.sprite(x, y, 'pixel');
          wall.setDisplaySize(width, height);
          wall.setStatic(true);
          wall.setAlpha(0); // Make invisible
          this.registerGameObject(key + 'Sprite', wall);
          return wall;
        };
        
        const topWallSprite = createWallSprite(width / 2, -wallThickness / 2, width, wallThickness, 'top');
        const bottomWallSprite = createWallSprite(width / 2, height + wallThickness / 2, width, wallThickness, 'bottom');
        const leftWallSprite = createWallSprite(-wallThickness / 2, height / 2, wallThickness, height, 'left');
        const rightWallSprite = createWallSprite(width + wallThickness / 2, height / 2, wallThickness, height, 'right');
        
        // Set collision categories
        [topWallSprite, leftWallSprite, rightWallSprite].forEach(wall => {
          physicsManager.setCollisionCategory(wall, 'wall');
        });
        
        // Bottom wall has a different category for detecting ball out of bounds
        physicsManager.setCollisionCategory(bottomWallSprite, 'wall');
      }
    } catch (error) {
      console.error('Error creating boundaries:', error);
      throw error;
    }
  }
  
  /**
   * Register a game object with this manager
   * @param key Unique identifier for the game object
   * @param gameObject The game object to register
   */
  public registerGameObject(key: string, gameObject: Phaser.GameObjects.GameObject): void {
    this.gameObjects.set(key, gameObject);
  }
  
  /**
   * Register a physics body with this manager
   * @param key Unique identifier for the physics body
   * @param body The physics body to register
   */
  public registerPhysicsBody(key: string, body: MatterJS.BodyType): void {
    this.physicsBodies.set(key, body);
  }
  
  /**
   * Get a registered game object by key
   * @param key The key of the game object to retrieve
   * @returns The game object or undefined if not found
   */
  public getGameObject(key: string): Phaser.GameObjects.GameObject | undefined {
    return this.gameObjects.get(key);
  }
  
  /**
   * Get a registered physics body by key
   * @param key The key of the physics body to retrieve
   * @returns The physics body or undefined if not found
   */
  public getPhysicsBody(key: string): MatterJS.BodyType | undefined {
    return this.physicsBodies.get(key);
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    // Destroy all game objects
    this.gameObjects.forEach(gameObject => {
      if (gameObject && typeof gameObject.destroy === 'function') {
        gameObject.destroy();
      }
    });
    
    // Remove all physics bodies
    this.physicsBodies.forEach(body => {
      if (body && this.scene.matter && this.scene.matter.world) {
        this.scene.matter.world.remove(body);
  }
    });
    
    // Clear the maps
    this.gameObjects.clear();
    this.physicsBodies.clear();
}
}

export default GameObjectManager;