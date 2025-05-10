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
  edge?: 'top' | 'bottom' | 'left' | 'right';
  id?: string;
}

export class Paddle extends Phaser.Physics.Matter.Sprite {
  constructor(opts: PaddleOptions) {
    const { scene, x, y, texture } = opts;
    super(scene.matter.world, x, y, texture);
    scene.add.existing(this);

    const width = opts.width;
    const height = opts.height;

    // Set up the physics body
    this.setBody({ type: 'rectangle', width, height });
    this.setStatic(true);
    this.setCollisionCategory(opts.collisionCategory);
    this.setCollidesWith(opts.collidesWith);
    this.setFriction(0);
    this.setFrictionAir(0);
    this.setBounce(1.1);

    // Determine paddle edge/position if not provided
    const edge = opts.edge || this.determinePaddleEdge(opts.orientation, x, y, scene);
    
    // Set the body label with a unique identifier
    const id = opts.id || edge || `paddle_${Date.now()}`;
    (this.body as MatterJS.BodyType).label = `paddle_${id}`;
    
    // Store important properties in data for easy access by managers
    this.setData('orientation', opts.orientation);
    this.setData('isVertical', opts.orientation === 'vertical');
    this.setData('edge', edge);
    this.setData('id', id);
    this.setData('width', width);
    this.setData('height', height);
    this.setData('originalTint', this.tintTopLeft);
    
    // Initialize with default properties
    this.setData('sticky', false);
    this.setData('isConcave', false);
    this.setData('isConvex', true);
    this.setData('consecutivePaddleHits', 0);
  }
  
  /**
   * Determine which edge this paddle is on based on its position
   */
  private determinePaddleEdge(
    orientation: 'horizontal' | 'vertical',
    x: number,
    y: number,
    scene: Phaser.Scene
  ): 'top' | 'bottom' | 'left' | 'right' {
    const centerX = scene.scale.width / 2;
    const centerY = scene.scale.height / 2;
    
    if (orientation === 'horizontal') {
      return y < centerY ? 'top' : 'bottom';
    } else {
      return x < centerX ? 'left' : 'right';
    }
  }
  
  /**
   * Calculate bounce angle based on where the ball hits the paddle
   * This is a utility method that can be used by physics handlers
   */
  calculateBounceAngle(hitPosition: { x: number, y: number }): number {
    const orientation = this.getData('orientation');
    let relativePos: number;
    
    if (orientation === 'horizontal') {
      // For horizontal paddles, use X position for angle calculation
      relativePos = (hitPosition.x - this.x) / (this.displayWidth / 2);
    } else {
      // For vertical paddles, use Y position for angle calculation
      relativePos = (hitPosition.y - this.y) / (this.displayHeight / 2);
    }
    
    // Clamp relative position between -1 and 1
    relativePos = Phaser.Math.Clamp(relativePos, -1, 1);
    
    // Base angle depends on orientation
    const baseAngle = orientation === 'horizontal' ? -Math.PI / 2 : 0;
    
    // Max angle offset (60 degrees)
    const maxAngleOffset = Math.PI / 3;
    
    return baseAngle + (relativePos * maxAngleOffset);
  }
  
  /**
   * Get the paddle's shape type (concave or convex)
   */
  getShapeType(): 'concave' | 'convex' {
    return this.getData('isConcave') ? 'concave' : 'convex';
  }
  
  /**
   * Check if the paddle is sticky (from power-ups)
   */
  isSticky(): boolean {
    return this.getData('sticky') === true;
  }
  
  /**
   * Set the paddle's sticky state
   */
  setSticky(isSticky: boolean): void {
    this.setData('sticky', isSticky);
  }
  
  /**
   * Flash the paddle for visual feedback
   */
  flash(color: number = 0xffffff, duration: number = 100): void {
    const originalTint = this.getData('originalTint') || this.tintTopLeft;
    this.setTint(color);
    this.scene.time.delayedCall(duration, () => {
      this.setTint(originalTint);
    });
  }
  
  /**
   * Increment the consecutive paddle hit counter
   * This is used for scoring and game mechanics
   */
  incrementPaddleHitCounter(): void {
    const currentHits = this.getData('consecutivePaddleHits') || 0;
    this.setData('consecutivePaddleHits', currentHits + 1);
    
    // Emit an event that other systems can listen for
    const eventManager = this.scene.events;
    if (eventManager) {
      eventManager.emit('paddleHit', {
        paddle: this.getData('edge'),
        hitPosition: this.x,
        consecutiveHits: currentHits + 1
      });
    }
    
    // Visual feedback for hit
    this.flash(0xffffff, 50);
  }
  
  /**
   * Handle ball hit event
   * This is a base implementation that subclasses can override
   */
  onBallHit(ball: Phaser.Physics.Arcade.Body): void {
    // Increment hit counter
    this.incrementPaddleHitCounter();
    
    // Base implementation just provides visual feedback
    this.flash();
  }
  
  /**
   * Clean up resources when the paddle is destroyed
   */
  destroy(fromScene?: boolean): void {
    // Call parent destroy method
    super.destroy(fromScene);
  }
}