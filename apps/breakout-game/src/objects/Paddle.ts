import * as Phaser from 'phaser';

export interface PaddleOptions {
  scene: Phaser.Scene;
  x: number;
  y: number;
  width: number;
  height: number;
  orientation: 'horizontal' | 'vertical';
  collisionCategory: number;
  collidesWith: number[];
  texture: string;
}

// Define a type for objects that might have dimensions
interface WithDimensions {
  x: number;
  y: number;
  width?: number;
  height?: number;
  displayWidth?: number;
  displayHeight?: number;
  body?: {
    label?: string;
  };
  getData?: (key: string) => any;
}

export class Paddle extends Phaser.Physics.Matter.Sprite {
  private lastWallCollisionTime: number = 0;
  private consecutivePaddleHits: number = 0;
  private wallCollisionCooldown: number = 200; // ms
  
  constructor(opts: PaddleOptions) {
    const { scene, x, y, texture } = opts;
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);

    const width = opts.width;
    const height = opts.height;

    this.setBody({ type: 'rectangle', width, height });
    this.setStatic(true);
    this.setCollisionCategory(opts.collisionCategory);
    this.setCollidesWith(opts.collidesWith);
    this.setFriction(0);
    this.setFrictionAir(0);

    (this.body as MatterJS.BodyType).label = 'paddle';
    
    // Initialize data properties
    this.setData('consecutivePaddleHits', 0);
    
    // Set up update listener for wall collision detection
    this.scene.events.on('update', this.checkWallCollision, this);
  }
  
  /**
   * Handle ball hit event
   * This is a base implementation that can be overridden by child classes
   * @param ball The ball body that hit the paddle
   */
  public onBallHit(ball: Phaser.Physics.Arcade.Body): void {
    // Increment the paddle hit counter
    this.incrementPaddleHitCounter();
    
    // Base implementation just emits an event
    const eventManager = this.scene.events;
    if (eventManager) {
      eventManager.emit('paddleBallCollision', { 
        paddle: this, 
        ball,
        paddleType: this.getData('paddleType') || 'default'
      });
    }
  }
    
  /**
   * Calculate bounce angle based on where the ball hits the paddle
   * Base implementation for standard paddles
   */
  calculateBounceAngle(ballX: number): number {
    // Get the relative position of the ball on the paddle (-1 to 1)
    const relativePos = (ballX - this.x) / (this.width / 2);
    
    // Base angle (in radians)
    const baseAngle = -Math.PI / 2; // Straight up
    
    // For standard paddle, we want a linear relationship between hit position and angle
    const maxAngleOffset = Math.PI / 3; // 60 degrees max
    
    return baseAngle + (relativePos * maxAngleOffset);
  }
  /**
   * Check if the paddle is colliding with walls
   */
  checkWallCollision() {
    const now = Date.now();
    // Only check if enough time has passed since last collision
    if (now - this.lastWallCollisionTime < this.wallCollisionCooldown) {
      return;
    }
  
    // Get physics manager and wall manager
    const physicsManager = (this.scene as any).getPhysicsManager?.();
    const wallManager = (this.scene as any).getWallManager?.();
    if (!physicsManager) return;
    
    // Try to get walls from both physics manager and wall manager
    let walls: any[] = [];
    
    // Get walls from physics manager if available
    if (physicsManager && typeof physicsManager.getWalls === 'function') {
      const physicsWalls = physicsManager.getWalls();
      if (physicsWalls && physicsWalls.length) {
        walls = walls.concat(physicsWalls);
      }
    }
  
    // Get vault walls from wall manager if available
    if (wallManager && typeof wallManager.getVaultWalls === 'function') {
      const vaultWalls = wallManager.getVaultWalls();
      if (vaultWalls && vaultWalls.length) {
        walls = walls.concat(vaultWalls);
      }
    }
    
    if (walls.length === 0) return;
    
    // Get paddle bounds
    const paddleX = this.x;
    const paddleY = this.y;
    const paddleWidth = this.width;
    const paddleHeight = this.height;
    const paddleLeft = paddleX - paddleWidth / 2;
    const paddleRight = paddleX + paddleWidth / 2;
    const paddleTop = paddleY - paddleHeight / 2;
    const paddleBottom = paddleY + paddleHeight / 2;
    
    // Check collision with each wall
    for (const wall of walls) {
      // Ensure wall has the necessary properties
      const wallObj = wall as WithDimensions;
      
      // Skip if wall doesn't have a position
      if (typeof wallObj.x !== 'number' || typeof wallObj.y !== 'number') {
        continue;
      }
      
      // Get wall dimensions - try different properties based on the object type
      let wallWidth = 0;
      let wallHeight = 0;
      let wallX = wallObj.x;
      let wallY = wallObj.y;
      
      // Try to get wall dimensions
      if (typeof wallObj.width === 'number' && typeof wallObj.height === 'number') {
        wallWidth = wallObj.width;
        wallHeight = wallObj.height;
      } else if (typeof wallObj.displayWidth === 'number' && typeof wallObj.displayHeight === 'number') {
        wallWidth = wallObj.displayWidth;
        wallHeight = wallObj.displayHeight;
      } else {
        // Skip if we can't determine wall dimensions
        continue;
      }
      
      // Calculate wall bounds
      const wallLeft = wallX - wallWidth / 2;
      const wallRight = wallX + wallWidth / 2;
      const wallTop = wallY - wallHeight / 2;
      const wallBottom = wallY + wallHeight / 2;
      
      // Check for overlap
      const overlaps = !(
        paddleRight < wallLeft ||
        paddleLeft > wallRight ||
        paddleBottom < wallTop ||
        paddleTop > wallBottom
      );
      
      if (overlaps) {
        this.handleWallCollision(wall);
        this.lastWallCollisionTime = now;
        
        // Reset paddle hit counter when hitting a wall
        this.resetPaddleHitCounter();
        break;
      }
    }
  }
  /**
   * Handle collision with a wall
   */
  handleWallCollision(wall: any) {
    const wallObj = wall as WithDimensions;
    
    // Get the edge data from the wall or try to determine it
    let edge: string | null = null;
    
    if (wallObj.getData && typeof wallObj.getData === 'function') {
      edge = wallObj.getData('edge');
    }
    
    if (!edge && wallObj.body && wallObj.body.label) {
      const label = wallObj.body.label;
      if (label === 'leftVaultWall') edge = 'left';
      else if (label === 'rightVaultWall') edge = 'right';
      else if (label === 'roofVaultWall') edge = 'top';
      else if (label === 'bottomVaultWall') edge = 'bottom';
    }
    
    // Get wall dimensions
    let wallX = 0;
    let wallY = 0;
    let wallWidth = 0;
    let wallHeight = 0;
    
    if (typeof wallObj.x === 'number' && typeof wallObj.y === 'number') {
      wallX = wallObj.x;
      wallY = wallObj.y;
    }
    
    if (typeof wallObj.width === 'number' && typeof wallObj.height === 'number') {
      wallWidth = wallObj.width;
      wallHeight = wallObj.height;
    } else if (typeof wallObj.displayWidth === 'number' && typeof wallObj.displayHeight === 'number') {
      wallWidth = wallObj.displayWidth;
      wallHeight = wallObj.displayHeight;
    }
    
    // Calculate wall bounds
    const wallLeft = wallX - wallWidth / 2;
    const wallRight = wallX + wallWidth / 2;
    const wallTop = wallY - wallHeight / 2;
    const wallBottom = wallY + wallHeight / 2;
    
    // If edge is not determined, try to infer it based on position
    if (!edge) {
      // Determine which side of the wall we're hitting based on paddle position
      const paddleX = this.x;
      const paddleY = this.y;
      
      // Calculate distances to each wall edge
      const distToLeft = Math.abs(paddleX - wallLeft);
      const distToRight = Math.abs(paddleX - wallRight);
      const distToTop = Math.abs(paddleY - wallTop);
      const distToBottom = Math.abs(paddleY - wallBottom);
      
      // Find the minimum distance
      const minDist = Math.min(distToLeft, distToRight, distToTop, distToBottom);
      
      // Set edge based on minimum distance
      if (minDist === distToLeft) edge = 'left';
      else if (minDist === distToRight) edge = 'right';
      else if (minDist === distToTop) edge = 'top';
      else edge = 'bottom';
    }
    
    // Push the paddle away from the wall
    if (edge === 'left') {
      this.setX(wallRight + this.width/2 + 1);
    } else if (edge === 'right') {
      this.setX(wallLeft - this.width/2 - 1);
    } else if (edge === 'top') {
      this.setY(wallBottom + this.height/2 + 1);
    } else if (edge === 'bottom') {
      this.setY(wallTop - this.height/2 - 1);
    }
    
    // Emit wall collision event
    const eventManager = (this.scene as any).getEventManager?.();
    if (eventManager) {
      eventManager.emit('paddleWallCollision', { paddle: this, wall, edge });
    }
    
    // Visual feedback for collision
    this.scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: 50,
      yoyo: true,
      ease: 'Power2'
    });
  }
  
  /**
   * Increment the consecutive paddle hits counter
   */
  incrementPaddleHitCounter() {
    const currentHits = this.getData('consecutivePaddleHits') || 0;
    this.setData('consecutivePaddleHits', currentHits + 1);
    this.emitPaddleHitCounterUpdate();
    
    // Visual feedback for hits
    this.scene.tweens.add({
      targets: this,
      scaleY: 1.1,
      duration: 50,
      yoyo: true,
      ease: 'Power2'
    });
  }
  
  /**
   * Reset the consecutive paddle hits counter
   */
  resetPaddleHitCounter() {
    this.setData('consecutivePaddleHits', 0);
    this.emitPaddleHitCounterUpdate();
  }
  
  /**
   * Emit an event to update the paddle hit counter in the HUD
   */
  emitPaddleHitCounterUpdate() {
    const eventManager = (this.scene as any).getEventManager?.();
    if (eventManager) {
      eventManager.emit('consecutivePaddleHitUpdated', { 
        hits: this.getData('consecutivePaddleHits') || 0 
      });
    }
  }
  
  /**
   * Clean up resources when the paddle is destroyed
   */
  destroy() {
    // Remove update listener
    this.scene.events.off('update', this.checkWallCollision, this);
        // Call parent destroy method
    super.destroy();
  }
}