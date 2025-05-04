import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import { PHYSICS } from '../constants/GameConstants';
import { BallCollisionHandler } from './CollisionHandlers/BallCollisionHandler';
import { CollisionHandlerInterface } from './CollisionHandlers/CollisionHandlerInterface';

/**
 * Manages physics configuration and interactions in the game
 */
class PhysicsManager {
  private scene: BreakoutScene;
  private collisionHandlers: CollisionHandlerInterface[] = [];
  
  // Physics collision categories
  public ballCategory: number = PHYSICS.COLLISION.BALL;
  public paddleCategory: number = PHYSICS.COLLISION.PADDLE;
  public brickCategory: number = PHYSICS.COLLISION.BRICK;
  public powerUpCategory: number = PHYSICS.COLLISION.POWERUP;
  public wallCategory: number = PHYSICS.COLLISION.WALL;
  public laserCategory: number = PHYSICS.COLLISION.LASER;
  public shieldCategory: number = PHYSICS.COLLISION.SHIELD;
  
  private collisionGroups: {
    [key: string]: {
      category: number;
      mask: number;
    };
  } = {};
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Initialize basic collision handlers
    this.collisionHandlers.push(new BallCollisionHandler(scene));
  }
  
  /**
   * Initialize the physics world and configuration
   */
  public initializePhysics(): void {
    // Set up world bounds
    this.scene.matter.world.setBounds(
      0, 0, 
      this.scene.scale.width, 
      this.scene.scale.height
    );
    
    // Configure physics properties
    this.scene.matter.world.setGravity(0, 0.2);
    
    // Set up collision groups
    this.setupCollisionGroups();
  }
  
  /**
   * Set up collision groups and categories
   */
  private setupCollisionGroups(): void {
    // Define default collision settings
    const defaultCollisionGroup = {
      category: 0x0001,
      mask: 0xFFFFFFFF
    };

    // Configure which categories collide with each other
    const collisionGroups = {
      ball: {
        category: this.ballCategory,
        mask: this.paddleCategory | this.brickCategory | this.wallCategory
      },
      paddle: {
        category: this.paddleCategory,
        mask: this.ballCategory | this.powerUpCategory
      },
      brick: {
        category: this.brickCategory,
        mask: this.ballCategory | this.laserCategory
      },
      wall: {
        category: this.wallCategory,
        mask: this.ballCategory
      },
      powerUp: {
        category: this.powerUpCategory,
        mask: this.paddleCategory
      },
      laser: {
        category: this.laserCategory,
        mask: this.brickCategory
      },
      shield: {
        category: this.shieldCategory,
        mask: this.ballCategory
      }
    };

    // Store collision groups for later use
    this.collisionGroups = collisionGroups;

    // Configure collision callbacks if needed
    this.setupCollisionCallbacks();
  }
  
  /**
   * Set what a game object collides with
   * @param gameObject The game object to configure
   * @param types Array of object types to collide with
   */
  public setCollidesWith(
    gameObject: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image,
    types: Array<'ball' | 'paddle' | 'brick' | 'wall' | 'powerUp' | 'laser' | 'shield'>
  ): void {
    if (!gameObject.body) return;
    
    // Calculate combined collision mask from all specified types
    let combinedMask = 0;
    
    types.forEach(type => {
      const collisionGroup = this.collisionGroups[type];
      if (collisionGroup) {
        combinedMask |= collisionGroup.category;
      }
    });
    
    // Set the collision mask using Phaser's method if available
    if (typeof gameObject.setCollidesWith === 'function') {
      gameObject.setCollidesWith(combinedMask);
    } else {
      // Direct Matter.js approach if the Phaser method doesn't exist
      try {
        // Use type assertion to access Matter.js specific properties
        const matterBody = gameObject.body as any;
        
        if (Array.isArray(matterBody)) {
          // Handle compound bodies
          matterBody.forEach(body => {
            if (body && typeof body === 'object' && body.collisionFilter) {
              body.collisionFilter.mask = combinedMask;
            }
          });
        } else if (matterBody && typeof matterBody === 'object') {
          // Handle single body - use type assertion to bypass TypeScript checks
          if (matterBody.collisionFilter) {
            matterBody.collisionFilter.mask = combinedMask;
          } else if (matterBody.parts && Array.isArray(matterBody.parts)) {
            // Try to set on all parts if the body is a compound
            matterBody.parts.forEach((part: any) => {
              if (part && typeof part === 'object' && part.collisionFilter) {
                part.collisionFilter.mask = combinedMask;
              }
            });
          }
        }
      } catch (error) {
        console.error('Error setting collision mask:', error);
      }
    }
  }

/**
 * Get the collision category for a specific type
 * @param type The type to get the category for
 * @returns The collision category number
 */
public getCollisionCategory(type: 'ball' | 'paddle' | 'brick' | 'wall' | 'powerUp' | 'laser' | 'shield'): number {
  const collisionGroup = this.collisionGroups[type];
  return collisionGroup ? collisionGroup.category : 0x0001; // Default category if not found
}
  /**
   * Apply collision category and mask to a game object
   * @param gameObject The game object to configure
   * @param type The type of object (ball, paddle, brick, etc.)
   */
  public setCollisionCategory(
    gameObject: Phaser.Physics.Matter.Sprite | Phaser.Physics.Matter.Image,
    type: 'ball' | 'paddle' | 'brick' | 'wall' | 'powerUp' | 'laser' | 'shield'
  ): void {
    if (!gameObject.body) return;
    
    const collisionGroup = this.collisionGroups[type];
    if (!collisionGroup) return;
    
    // Set the collision category and mask
    gameObject.setCollisionCategory(collisionGroup.category);
    gameObject.setCollidesWith(collisionGroup.mask);
  }
  
  /**
   * Set up collision callback handlers
   */
  private setupCollisionCallbacks(): void {
    // Listen for collision events
    this.scene.matter.world.on('collisionstart', this.handleCollisionStart, this);
    this.scene.matter.world.on('collisionactive', this.handleCollisionActive, this);
    this.scene.matter.world.on('collisionend', this.handleCollisionEnd, this);
  }
  
  /**
   * Handle collision start events
   */
  private handleCollisionStart(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    // Option 1: Use our own collision handlers
    if (this.collisionHandlers.length > 0) {
      this.processCollisionEvent(event, 'start');
    } 
    // Option 2: Delegate to collision manager if available
    else {
      const collisionManager = this.scene.getCollisionManager();
      if (collisionManager && typeof collisionManager.handleCollisionStart === 'function') {
        collisionManager.handleCollisionStart(event);
      }
    }
  }
  
  /**
   * Handle active collision events
   */
  private handleCollisionActive(event: Phaser.Physics.Matter.Events.CollisionActiveEvent): void {
    // Option 1: Use our own collision handlers
    if (this.collisionHandlers.length > 0) {
      this.processCollisionEvent(event, 'active');
    } 
    // Option 2: Delegate to collision manager if available
    else {
      const collisionManager = this.scene.getCollisionManager();
      if (collisionManager && typeof collisionManager.handleCollisionActive === 'function') {
        collisionManager.handleCollisionActive(event);
      }
    }
  }
  
  /**
   * Handle collision end events
   */
  private handleCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionEndEvent): void {
    // Option 1: Use our own collision handlers
    if (this.collisionHandlers.length > 0) {
      this.processCollisionEvent(event, 'end');
    } 
    // Option 2: Delegate to collision manager if available
    else {
      const collisionManager = this.scene.getCollisionManager();
      if (collisionManager && typeof collisionManager.handleCollisionEnd === 'function') {
        collisionManager.handleCollisionEnd(event);
      }
    }
  }
  
  /**
   * Process a collision event by delegating to registered handlers
   */
  private processCollisionEvent(
    event: Phaser.Physics.Matter.Events.CollisionStartEvent | 
           Phaser.Physics.Matter.Events.CollisionActiveEvent | 
           Phaser.Physics.Matter.Events.CollisionEndEvent,
    stage: 'start' | 'active' | 'end'
  ): void {
    const pairs = event.pairs;
    
    for (let i = 0; i < pairs.length; i++) {
      const bodyA = pairs[i].bodyA;
      const bodyB = pairs[i].bodyB;
      
      // Skip if bodies don't have gameObject references
      if (!bodyA.gameObject || !bodyB.gameObject) continue;
      
      // Try each handler until one handles the collision
      for (const handler of this.collisionHandlers) {
        const handled = handler.handleCollision(bodyA, bodyB, stage);
        if (handled) break;
      }
    }
  }
  
  /**
   * Apply physics properties to a game object
   */
  public applyPhysicsToGameObject(
    gameObject: Phaser.GameObjects.GameObject, 
    options: any
  ): void {
    if (!this.scene.matter.add) return;
    
    // Apply physics body to the game object
    this.scene.matter.add.gameObject(gameObject, options);
  }
  
  /**
   * Create a physics body for a game object
   * @param gameObject The game object to add physics to
   * @param bodyType Type of physics body to create
   * @param options Physics body options
   */
  public createBody(
    gameObject: Phaser.GameObjects.GameObject,
    bodyType: 'rectangle' | 'circle' | 'polygon' = 'rectangle',
    options: any = {}
  ): void {
    if (!this.scene.matter.add) return;
    
    switch (bodyType) {
      case 'rectangle':
        this.scene.matter.add.rectangle(
          options.x || 0,
          options.y || 0,
          options.width || 32,
          options.height || 32,
          options
        );
        break;
      case 'circle':
        this.scene.matter.add.circle(
          options.x || 0,
          options.y || 0,
          options.radius || 16,
          options
        );
        break;
      case 'polygon':
        if (options.vertices) {
          this.scene.matter.add.fromVertices(
            options.x || 0,
            options.y || 0,
            options.vertices,
            options
          );
        }
        break;
    }
  }

  /**
   * Set physics world gravity
   * @param x Horizontal gravity
   * @param y Vertical gravity
   */
  public setGravity(x: number, y: number): void {
    if (this.scene.matter && this.scene.matter.world) {
      this.scene.matter.world.setGravity(x, y);
      
      // Emit event for gravity change
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('gravityChanged', { x, y });
      }
    }
  }
  
  /**
   * Register a collision handler
   * @param handler The collision handler to register
   */
  public registerCollisionHandler(handler: CollisionHandlerInterface): void {
    this.collisionHandlers.push(handler);
  }
  
  /**
   * Clean up physics resources
   */
  public cleanup(): void {
    // Remove collision listeners
    if (this.scene.matter && this.scene.matter.world) {
      this.scene.matter.world.off('collisionstart', this.handleCollisionStart, this);
      this.scene.matter.world.off('collisionactive', this.handleCollisionActive, this);
      this.scene.matter.world.off('collisionend', this.handleCollisionEnd, this);
    }
    
    // Clear collision handlers
    this.collisionHandlers = [];
  }
}

export default PhysicsManager;