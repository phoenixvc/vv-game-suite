import * as Phaser from 'phaser';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import { BallPaddleCollisionHandler } from './BallPaddleCollisionHandler';
import { BallBrickCollisionHandler } from './BallBrickCollisionHandler';
import { PaddlePowerUpCollisionHandler } from './PaddlePowerUpCollisionHandler';
import { BallWallCollisionHandler } from './BallWallCollisionHandler';
import { LaserBrickCollisionHandler } from './LaserBrickCollisionHandler';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

class CollisionManager {
  private scene: BreakoutScene;
  private collisionHandlers: CollisionHandlerInterface[] = [];
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Set up all collision handlers for the game
   */
  public setupCollisionHandlers(): void {
    // Create and register collision handlers
    this.registerCollisionHandlers();
    
    // Listen for Matter.js collision events
    this.scene.matter.world.on('collisionstart', this.handleCollisionStart, this);
    this.scene.matter.world.on('collisionactive', this.handleCollisionActive, this);
    this.scene.matter.world.on('collisionend', this.handleCollisionEnd, this);
  }
  
  /**
   * Register all collision handlers
   */
  private registerCollisionHandlers(): void {
    // Create handlers for different collision types
    this.collisionHandlers = [
      new BallPaddleCollisionHandler(this.scene),
      new BallBrickCollisionHandler(this.scene),
      new PaddlePowerUpCollisionHandler(this.scene),
      new BallWallCollisionHandler(this.scene),
      new LaserBrickCollisionHandler(this.scene)
    ];
  }
  
  /**
   * Handle collision start events from Matter.js
   */
  public handleCollisionStart(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    this.processCollisionEvent(event, 'start');
  }
  
  /**
   * Handle active collisions from Matter.js
   */
  public handleCollisionActive(event: Phaser.Physics.Matter.Events.CollisionActiveEvent): void {
    this.processCollisionEvent(event, 'active');
  }
  
  /**
   * Handle collision end events from Matter.js
   */
  public handleCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionEndEvent): void {
    this.processCollisionEvent(event, 'end');
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
   * Clean up resources
   */
  public cleanup(): void {
    // Remove collision event listeners
    if (this.scene.matter && this.scene.matter.world) {
      this.scene.matter.world.off('collisionstart', this.handleCollisionStart, this);
      this.scene.matter.world.off('collisionactive', this.handleCollisionActive, this);
      this.scene.matter.world.off('collisionend', this.handleCollisionEnd, this);
    }
    
    // Clear collision handlers
    this.collisionHandlers = [];
  }
}

export default CollisionManager;