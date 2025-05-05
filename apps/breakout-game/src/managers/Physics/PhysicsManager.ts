import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { CollisionHandlerInterface } from '../CollisionHandlers/CollisionHandlerInterface';
import ErrorManager from '../ErrorManager';
import { setupCollisionCallbacks, setupCollisionGroups } from './collisionHelpers';

// Define the CollisionGroups interface
export interface CollisionGroups {
  [key: string]: {
    category: number;
    mask: number;
  };
}

// Define game bounds interface
interface GameBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

// Define collision categories as constants
export const CollisionCategory = {
  DEFAULT: 0x0001,
  BALL: 0x0002,
  PADDLE: 0x0004,
  BRICK: 0x0008,
  WALL: 0x0010,
  POWERUP: 0x0020,
  LASER: 0x0040
};

export class PhysicsManager {
  private scene: BreakoutScene;
  private collisionHandlers: CollisionHandlerInterface[] = [];
  private collisionGroups: CollisionGroups = {};
  private walls: Phaser.Physics.Matter.Sprite[] = [];
  private errorManager: ErrorManager;
  
  // Wall properties
  private leftWall: MatterJS.BodyType;
  private rightWall: MatterJS.BodyType;
  private topWall: MatterJS.BodyType;
  private bottomWall: MatterJS.BodyType;
  
  // Visual wall properties
  private visualLeftWall: Phaser.GameObjects.Rectangle;
  private visualRightWall: Phaser.GameObjects.Rectangle;
  private visualTopWall: Phaser.GameObjects.Rectangle;
  private visualBottomWall: Phaser.GameObjects.Rectangle;
  
  // Game bounds and wall settings
  private gameBounds: GameBounds;
  private wallThickness: number;
  private createBottomWall: boolean = false; // Default to false for breakout game

  // Expose collision categories as public properties
  public readonly ballCategory: number = CollisionCategory.BALL;
  public readonly paddleCategory: number = CollisionCategory.PADDLE;
  public readonly brickCategory: number = CollisionCategory.BRICK;
  public readonly wallCategory: number = CollisionCategory.WALL;
  public readonly powerUpCategory: number = CollisionCategory.POWERUP;
  public readonly laserCategory: number = CollisionCategory.LASER;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Get or create ErrorManager
    this.errorManager = scene.getErrorManager ? scene.getErrorManager() : null;
    if (!this.errorManager && typeof ErrorManager === 'function') {
      this.errorManager = new ErrorManager(scene);
    }
    
    // Setup physics world
    this.scene.matter.world.setBounds(0, 0, this.scene.scale.width, this.scene.scale.height);
    this.scene.matter.world.setGravity(0, 0.2);
    
    // Setup collision groups and callbacks
    this.collisionGroups = setupCollisionGroups(this);
    setupCollisionCallbacks(this);
  }

  /**
   * Remove existing walls
   */
  private removeWalls(): void {
    try {
      // Remove physics bodies
      [this.leftWall, this.rightWall, this.topWall, this.bottomWall].forEach(wall => {
        if (wall) {
          this.scene.matter.world.remove(wall);
        }
      });
      
      // Reset wall references
      this.leftWall = null;
      this.rightWall = null;
      this.topWall = null;
      this.bottomWall = null;
    } catch (error) {
      console.error('Error removing walls:', error);
    }
  }

  /**
   * Remove existing visual walls
   */
  private removeVisualWalls(): void {
    try {
      // Remove visual wall game objects
      [this.visualLeftWall, this.visualRightWall, this.visualTopWall, this.visualBottomWall].forEach(wall => {
        if (wall) {
          wall.destroy();
        }
      });
      
      // Reset visual wall references
      this.visualLeftWall = null;
      this.visualRightWall = null;
      this.visualTopWall = null;
      this.visualBottomWall = null;
    } catch (error) {
      console.error('Error removing visual walls:', error);
    }
  }

  /**
   * Set world bounds for the game
   * @param x Left boundary
   * @param y Top boundary
   * @param width Width of the game area
   * @param height Height of the game area
   */
  public setWorldBounds(x: number, y: number, width: number, height: number): void {
    try {
      // Store the game bounds for reference
      this.gameBounds = { x, y, width, height };
      
      // Calculate wall thickness based on game size (thicker walls for larger games)
      const wallThickness = Math.max(10, Math.min(20, width * 0.02));
      this.wallThickness = wallThickness;
      
      // Create walls
      this.setupGameWalls(x, y, width, height, wallThickness);
      
      // Log the game bounds
      console.log(`Game bounds set to: x=${x}, y=${y}, width=${width}, height=${height}`);
    } catch (error) {
      console.error('Error setting world bounds:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to set world bounds', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Create walls around the game area
   */
  private setupGameWalls(x: number, y: number, width: number, height: number, thickness: number): void {
    try {
      // Remove any existing walls
      this.removeWalls();
      
      const scene = this.scene;
      
      // Create left wall
      this.leftWall = scene.matter.add.rectangle(
        x - thickness / 2,
        y + height / 2,
        thickness,
        height,
        {
          isStatic: true,
          label: 'wall_left'
        }
      );
      
      // Create right wall
      this.rightWall = scene.matter.add.rectangle(
        x + width + thickness / 2,
        y + height / 2,
        thickness,
        height,
        {
          isStatic: true,
          label: 'wall_right'
        }
      );
      
      // Create top wall (positioned just below the HUD)
      this.topWall = scene.matter.add.rectangle(
        x + width / 2,
        y + thickness / 2,
        width,
        thickness,
        {
          isStatic: true,
          label: 'wall_top'
        }
      );
      
      // Create bottom wall (optional, usually not needed with paddles)
      if (this.createBottomWall) {
        this.bottomWall = scene.matter.add.rectangle(
          x + width / 2,
          y + height + thickness / 2,
          width,
          thickness,
          {
            isStatic: true,
            label: 'wall_bottom'
          }
        );
      }
      
      // Set collision categories for the walls
      const wallCategory = this.wallCategory;
      
      [this.leftWall, this.rightWall, this.topWall, this.bottomWall].forEach(wall => {
        if (wall) {
          // Fix: Use the proper way to set collision category on a Matter body
          if (wall.collisionFilter) {
            wall.collisionFilter.category = wallCategory;
          } else {
            wall.collisionFilter = { category: wallCategory, mask: -1, group: 0 };
          }
        }
      });
      
      // Create visual walls if needed
      this.createVisualWalls(x, y, width, height, thickness);
    } catch (error) {
      console.error('Error creating walls:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create walls', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Create visual representations of the walls
   */
  private createVisualWalls(x: number, y: number, width: number, height: number, thickness: number): void {
    try {
      // Remove any existing visual walls
      this.removeVisualWalls();
      
      // Get the current theme color for walls
      let wallColor = 0x0000ff; // Default blue color
      
      // Fix: Properly check if getThemeManager exists and returns a valid object
      if (typeof this.scene.getThemeManager === 'function') {
        const themeManager = this.scene.getThemeManager();
        if (themeManager && typeof themeManager.getCurrentTheme === 'function') {
          const theme = themeManager.getCurrentTheme();
          if (theme && typeof theme.wallColor !== 'undefined') {
            wallColor = theme.wallColor;
          }
        }
      }
      
      // Create visual walls
      this.visualLeftWall = this.scene.add.rectangle(
        x - thickness / 2,
        y + height / 2,
        thickness,
        height,
        wallColor
      );
      
      this.visualRightWall = this.scene.add.rectangle(
        x + width + thickness / 2,
        y + height / 2,
        thickness,
        height,
        wallColor
      );
      
      this.visualTopWall = this.scene.add.rectangle(
        x + width / 2,
        y + thickness / 2,
        width,
        thickness,
        wallColor
      );
      
      if (this.createBottomWall) {
        this.visualBottomWall = this.scene.add.rectangle(
          x + width / 2,
          y + height + thickness / 2,
          width,
          thickness,
          wallColor
        );
      }
      
      // Add glow effect to walls
      [this.visualLeftWall, this.visualRightWall, this.visualTopWall, this.visualBottomWall].forEach(wall => {
        if (wall) {
          // Fix: Check if renderer exists and has pipelines property
          const renderer = this.scene.renderer;
          if (renderer) {
            // Use type assertion to check for pipelines
            const webGLRenderer = renderer as Phaser.Renderer.WebGL.WebGLRenderer;
            if (webGLRenderer.pipelines && typeof webGLRenderer.pipelines.get === 'function') {
              const pipeline = webGLRenderer.pipelines.get('Light2D');
              if (pipeline) {
                wall.setPipeline('Light2D');
              }
            }
          }
        }
      });
    } catch (error) {
      console.error('Error creating visual walls:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create visual walls', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Initialize physics for the scene
   */
  public initializePhysics(): void {
    // Any additional physics initialization can go here
    console.log('Physics system initialized');
  }

  /**
   * Create walls/boundaries for the game
   */
  public createWalls(): void {
    // Check if walls already exist
    if (this.walls.length > 0) {
      console.log('Walls already exist, skipping creation');
      return;
    }

    console.log('Creating game walls/boundaries');
    
    try {
      const width = this.scene.scale.width;
      const height = this.scene.scale.height;
      
      // Create wall thickness and offset
      const wallThickness = 20;
      const offset = wallThickness / 2;
      
      // Create walls as static rectangles
      // Top wall
      const topWall = this.createWallSprite(width / 2, offset, width, wallThickness, 'top');
      
      // Left wall
      const leftWall = this.createWallSprite(offset, height / 2, wallThickness, height, 'left');
      
      // Right wall
      const rightWall = this.createWallSprite(width - offset, height / 2, wallThickness, height, 'right');
      
      // Bottom wall (optional - often omitted in breakout games to allow the ball to fall out)
      // Uncomment if you want a bottom wall
      // const bottomWall = this.createWallSprite(width / 2, height - offset, width, wallThickness, 'bottom');
      
      console.log(`Created ${this.walls.length} walls`);
      
      // Emit an event that walls have been created
      // Fix: Check if getEventManager exists and returns a valid object
      if (typeof this.scene.getEventManager === 'function') {
        const eventManager = this.scene.getEventManager();
        if (eventManager && typeof eventManager.emit === 'function') {
          eventManager.emit('wallsCreated', { walls: this.walls });
        }
      }
    } catch (error) {
      console.error('Error creating walls:', error);
    }
  }
  
  /**
   * Create a single wall sprite
   */
  private createWallSprite(
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    edge: string
  ): Phaser.Physics.Matter.Sprite {
    // Create a rectangle for the wall with specific physics options
    const wall = this.scene.matter.add.sprite(x, y, 'wall', undefined, {
      isStatic: true,  // Make it static so it doesn't move
      ignoreGravity: true,  // Explicitly ignore gravity
      frictionAir: 0,  // No air friction
      friction: 0,  // No friction with other objects
      frictionStatic: 0,  // No static friction
      restitution: 1,  // Perfect bounce
      label: `wall_${edge}`  // Label for collision detection
    });
    
    // Set the display size
    wall.setDisplaySize(width, height);
    
    // Store wall properties
    wall.setData('edge', edge);
    wall.setData('isWall', true);
    
    // Set collision properties
    this.setCollisionCategory(wall, 'wall');
    
    // Make the wall visible
    wall.setAlpha(0.5); // Semi-transparent
    wall.setTint(0x888888); // Light gray color
    
    // Ensure the wall is static and not affected by gravity
    wall.setStatic(true);
    wall.setFixedRotation(); // Prevent rotation
    
    // Add to walls array
    this.walls.push(wall);
    
    // Log wall creation
    console.log(`Created ${edge} wall at (${x}, ${y}) with size ${width}x${height}`);
    
    return wall;
  }

  /**
   * Get the scene this physics manager is attached to
   * @returns The scene
   */
  public getScene(): BreakoutScene {
    return this.scene;
  }

  /**
   * Register a collision handler
   * @param handler The collision handler to register
   */
  public registerCollisionHandler(handler: CollisionHandlerInterface): void {
    this.collisionHandlers.push(handler);
  }

  /**
   * Process a collision through all registered handlers
   * @param bodyA First body in the collision
   * @param bodyB Second body in the collision
   * @param stage Collision stage (start, active, end)
   * @returns True if the collision was handled by any handler
   */
  public processCollision(
    bodyA: MatterJS.BodyType,
    bodyB: MatterJS.BodyType,
    stage: 'start' | 'active' | 'end' = 'start'
  ): boolean {
    // Try each handler until one handles the collision
    for (const handler of this.collisionHandlers) {
      try {
        if (handler.handleCollision(bodyA, bodyB, stage)) {
          return true;
        }
      } catch (e) {
        console.warn('Error in collision handler:', e);
      }
    }
    return false;
  }

  /**
   * Set up collision properties for a ball
   * @param ball The ball sprite to set up collisions for
   */
  public setupCollisionForBall(ball: Phaser.Physics.Matter.Sprite): void {
    // Set collision category using our helper method
    this.setCollisionCategory(ball, 'ball');
    
    // Apply additional ball-specific physics settings if needed
    if (ball.body) {
      // Access Matter.js specific properties using type assertion
      const matterBody = ball.body as unknown as MatterJS.BodyType;
      
      // Make sure the ball has the correct collision mask
      const ballGroup = this.getCollisionGroup('ball');
      if (ballGroup) {
        // Initialize collisionFilter with required properties
        if (!matterBody.collisionFilter) {
          matterBody.collisionFilter = {
            category: ballGroup.category,
            mask: ballGroup.mask,
            group: 0
          };
        } else {
          // Update existing collisionFilter
          matterBody.collisionFilter.category = ballGroup.category;
          matterBody.collisionFilter.mask = ballGroup.mask;
        }
      }
      
      // Set the label for collision detection
      matterBody.label = 'ball';
      
      // Log collision settings for debugging
      console.log('Ball collision settings:', {
        label: matterBody.label,
        category: matterBody.collisionFilter?.category,
        mask: matterBody.collisionFilter?.mask
      });
      
      // Add any other ball-specific physics settings
      // For example, you might want to ensure perfect bounce
      if (typeof ball.setBounce === 'function') {
        ball.setBounce(1);
      }
    }
    
    // Enable debug collision events if needed
    this.enableCollisionEvents(ball);
  }

  /**
   * Enable collision events for an object (for debugging)
   * @param gameObject The game object to enable collision events for
   */
  public enableCollisionEvents(gameObject: Phaser.GameObjects.GameObject): void {
    // Make sure the object has a body and we can access its properties
    if (!gameObject || !('body' in gameObject) || !gameObject.body) {
      return;
    }
    
    // Store a reference to the object's body
    const body = gameObject.body;
    
    // Set a data property to identify this object in collision events
    if (typeof gameObject.setData === 'function') {
      // Use a unique ID if not already set
      if (!gameObject.getData('id')) {
        gameObject.setData('id', `obj_${Date.now()}_${Math.floor(Math.random() * 1000)}`);
      }
      
      // Store the object type if available
      // Use type assertion to access the label property
      const bodyLabel = (body as any).label;
      const label = bodyLabel || (gameObject.getData ? gameObject.getData('type') : null) || 'unknown';
      gameObject.setData('collisionType', label);
    }
    
    // In Matter.js with Phaser, we don't set callbacks directly on bodies
    // Instead, we use the collision events from the Matter world
    
    // You can add this object to a special debug group if needed
    if (typeof gameObject.setData === 'function') {
      gameObject.setData('debugCollisions', true);
    }
    
    // Log that we've enabled collision events for this object
    const objectId = gameObject.getData ? gameObject.getData('id') : 'unknown';
    const objectType = (body as any).label || (gameObject.getData ? gameObject.getData('type') : 'unknown');
    console.log(`Enabled collision events for ${objectType} (${objectId})`);
  }

  /**
   * Set collision category for a game object
   * @param gameObject The game object
   * @param groupName The collision group name
   */
  public setCollisionCategory(
    gameObject: Phaser.Physics.Matter.Sprite | Phaser.GameObjects.GameObject,
    groupName: string
  ): void {
    // Get the collision group
    const group = this.collisionGroups[groupName];
    if (!group) {
      console.warn(`Collision group '${groupName}' not found`);
      return;
    }

    // Set the collision category and mask
    if ('setCollisionCategory' in gameObject && typeof gameObject.setCollisionCategory === 'function') {
      // Use Phaser's built-in methods if available
      gameObject.setCollisionCategory(group.category);
      gameObject.setCollidesWith(group.mask);
      
      // Log for debugging
      console.log(`Set collision for ${groupName} using Phaser methods:`, {
        category: group.category,
        mask: group.mask
      });
    } else if ('body' in gameObject && gameObject.body) {
      // Handle case where gameObject has a body property
      // Use type assertion to access Matter.js properties
      const matterBody = gameObject.body as unknown as MatterJS.BodyType;
      
      // Initialize collisionFilter with required properties
      if (!matterBody.collisionFilter) {
        matterBody.collisionFilter = {
          category: group.category,
          mask: group.mask,
          group: 0
        };
      } else {
        // Update existing collisionFilter
        matterBody.collisionFilter.category = group.category;
        matterBody.collisionFilter.mask = group.mask;
      }
      
      // Set label based on group name for easier debugging
      matterBody.label = groupName;
      
      // Log for debugging
      console.log(`Set collision for ${groupName} using direct access:`, {
        category: group.category,
        mask: group.mask
      });
    }
  }

  /**
   * Get collision group by name
   * @param name The collision group name
   * @returns The collision group or undefined if not found
   */
  public getCollisionGroup(name: string) {
    return this.collisionGroups[name];
  }

  /**
   * Get all walls
   * @returns Array of wall sprites
   */
  public getWalls(): Phaser.Physics.Matter.Sprite[] {
    return this.walls;
  }

  /**
   * Clean up physics resources
   */
  public cleanup(): void {
    // Clear collision handlers
    this.collisionHandlers = [];
    
    // Remove walls
    this.removeWalls();
    this.removeVisualWalls();
    
    // Clear walls array
    this.walls = [];
    
    // Other cleanup as needed
  }

  /**
   * Debug collision settings for a game object
   * @param gameObject The game object to debug
   * @param label Optional label for the log
   */
  public debugCollisionSettings(gameObject: Phaser.GameObjects.GameObject, label: string = 'Object'): void {
    if (!gameObject) {
      console.warn(`Cannot debug collision settings for ${label}: object is null`);
      return;
    }
    
    console.group(`Collision settings for ${label}`);
    
    if ('body' in gameObject && gameObject.body) {
      const matterBody = gameObject.body as unknown as MatterJS.BodyType;
      
      console.log('Body:', {
        id: matterBody.id,
        label: matterBody.label,
        type: matterBody.type,
        collisionFilter: matterBody.collisionFilter,
        isSensor: matterBody.isSensor,
        isStatic: matterBody.isStatic
      });
      
      if (matterBody.parts && matterBody.parts.length > 1) {
        console.log('Body parts:', matterBody.parts.length);
        matterBody.parts.forEach((part, index) => {
          console.log(`Part ${index}:`, {
            id: part.id,
            label: part.label,
            collisionFilter: part.collisionFilter
          });
        });
      }
    } else {
      console.log('No physics body found');
    }
    
    console.groupEnd();
  }
}

export default PhysicsManager;