import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { CollisionHandlerInterface } from '../CollisionHandlers/CollisionHandlerInterface';
import { setupCollisionCallbacks, setupCollisionGroups } from './collisionHelpers';

// Define the CollisionGroups interface
export interface CollisionGroups {
  [key: string]: {
    category: number;
    mask: number;
  };
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

  // Expose collision categories as public properties
  public readonly ballCategory: number = CollisionCategory.BALL;
  public readonly paddleCategory: number = CollisionCategory.PADDLE;
  public readonly brickCategory: number = CollisionCategory.BRICK;
  public readonly wallCategory: number = CollisionCategory.WALL;
  public readonly powerUpCategory: number = CollisionCategory.POWERUP;
  public readonly laserCategory: number = CollisionCategory.LASER;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Setup physics world
    this.scene.matter.world.setBounds(0, 0, this.scene.scale.width, this.scene.scale.height);
    this.scene.matter.world.setGravity(0, 0.2);
    
    // Setup collision groups and callbacks
    this.collisionGroups = setupCollisionGroups(this);
    setupCollisionCallbacks(this);
  }

  /**
   * Initialize physics for the scene
   */
  public initializePhysics(): void {
    // Any additional physics initialization can go here
    console.log('Physics system initialized');
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
   * Clean up physics resources
   */
  public cleanup(): void {
    // Clear collision handlers
    this.collisionHandlers = [];
    
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