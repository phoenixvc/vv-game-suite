import PaddleController from '@/controllers/paddle/PaddleController';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import ErrorManager from '../ErrorManager';
import { PhysicsManager } from '../PhysicsManager';
import PaddleFactory from './PaddleFactory';
import PaddlePhysics from './PaddlePhysics';
import PaddleVisualEffects from './PaddleVisualEffects';

/**
 * Manages the creation and coordination of all paddles in the game
 */
class PaddleManager {
  private scene: Phaser.Scene;
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private paddleControllers: Record<string, PaddleController> = {};
  private physicsManager?: PhysicsManager;
  private errorManager?: ErrorManager;
  private paddleFactory?: PaddleFactory;
  private paddlePhysics?: PaddlePhysics;
  private visualEffects?: PaddleVisualEffects;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Get managers from scene if available
    if ('getPhysicsManager' in scene && typeof scene.getPhysicsManager === 'function') {
      this.physicsManager = scene.getPhysicsManager();
    }
    
    if ('getErrorManager' in scene && typeof scene.getErrorManager === 'function') {
      this.errorManager = scene.getErrorManager();
    }
    
    // Initialize helper classes if this is a BreakoutScene
    if (scene instanceof BreakoutScene) {
      this.paddleFactory = new PaddleFactory(scene);
      this.paddlePhysics = new PaddlePhysics(scene);
      this.visualEffects = new PaddleVisualEffects(scene);
    }
  }
  
/**
 * Create all active paddles based on game configuration
 */
createPaddles(): void {
  if (!this.paddleFactory) {
    console.error('PaddleFactory not initialized');
    return;
  }
  
  // Get active paddles from game registry
  const activePaddles = this.scene.registry.get('activePaddles') || ['bottom'];
  
  // Create active paddles based on game mode
  activePaddles.forEach(edge => {
    if (['top', 'bottom', 'left', 'right'].includes(edge)) {
      const paddle = this.paddleFactory.createPaddle(edge as 'top' | 'bottom' | 'left' | 'right');
      const controller = this.paddleFactory.createPaddleController(paddle);
      
      this.paddles.push(paddle);
      this.paddleControllers[edge] = controller;
    }
  });
  
  // Listen for events
  this.setupEventListeners();
  
  // Set up collision handlers for physics behavior
  if (this.paddlePhysics) {
    this.paddlePhysics.setupCollisionHandlers();
  }
  
  // Set up paddle collisions with momentum transfer
  this.setupPaddleCollisions();
}
  
/**
 * Set up collision handling for paddles
 * This handles ball-paddle collisions with momentum transfer and visual effects
 */
public setupPaddleCollisions(): void {
  try {
    // Import PaddlePhysics
    import('../../utils/PaddlePhysics').then(({ PaddlePhysics }) => {
      // Listen for collisions between balls and paddles
      this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        const pairs = event.pairs;
        
        for (let i = 0; i < pairs.length; i++) {
          const bodyA = pairs[i].bodyA;
          const bodyB = pairs[i].bodyB;
          
          // Use type assertion to access the label property
          const bodyALabel = (bodyA as any).label;
          const bodyBLabel = (bodyB as any).label;
          
          // Check if the collision is between a ball and a paddle
          const isPaddleCollision = 
            (bodyALabel === 'ball' && bodyBLabel?.startsWith('paddle_')) ||
            (bodyBLabel === 'ball' && bodyALabel?.startsWith('paddle_'));
          
          if (isPaddleCollision) {
            // Get the ball and paddle bodies
            const ballBody = bodyALabel === 'ball' ? bodyA : bodyB;
            const paddleBody = bodyALabel === 'ball' ? bodyB : bodyA;
            
            // Find the corresponding game objects
            const ballManager = this.scene instanceof BreakoutScene ? this.scene.getBallManager() : null;
            const ball = ballManager?.getAllBalls().find(b => b.body === ballBody);
            const paddle = this.getPaddles().find(p => p.body === paddleBody);
            
            if (ball && paddle) {
              console.log(`Ball collision with paddle ${(paddleBody as any).label}`);
              
              // Calculate the hit position
              const hitPosition = {
                x: pairs[i].collision.supports[0].x,
                y: pairs[i].collision.supports[0].y
              };
              
              // Calculate the new velocity using PaddlePhysics
              const newVelocity = PaddlePhysics.calculateBallDeflection(
                ball, paddle, hitPosition
              );
              
              // Get the consecutive paddle hit count (without hitting a brick)
              const consecutiveHits = ball.getData('consecutivePaddleHits') || 0;
              
              // Increase the consecutive hit count
              ball.setData('consecutivePaddleHits', consecutiveHits + 1);
              
              // Calculate speed multiplier: 10% increase per consecutive hit
              const hitMultiplier = 1 + (consecutiveHits * 0.1);
              
              // Get paddle velocity
              const paddleVelocity = {
                x: paddle.body.velocity.x,
                y: paddle.body.velocity.y
              };
              
              // Calculate paddle momentum factor (percentage of paddle speed to transfer)
              // We'll use 30% of the paddle's velocity as a bonus
              const paddleMomentumFactor = 0.3;
              
              // Calculate paddle speed (magnitude of velocity)
              const paddleSpeed = Math.sqrt(
                paddleVelocity.x * paddleVelocity.x + 
                paddleVelocity.y * paddleVelocity.y
              );
              
              // Only apply momentum transfer if paddle is moving at a significant speed
              let momentumBonus = 1.0;
              if (paddleSpeed > 0.5) {
                // Calculate momentum bonus (1.0 to 1.5 based on paddle speed)
                // Cap at 50% bonus for very fast paddles
                momentumBonus = 1.0 + Math.min(paddleSpeed * paddleMomentumFactor, 0.5);
                console.log(`Paddle momentum bonus: ${momentumBonus.toFixed(2)}x from speed ${paddleSpeed.toFixed(2)}`);
              }
              
              // Combine all speed multipliers
              const speedMultiplier = hitMultiplier * momentumBonus;
              console.log(`Consecutive hits: ${consecutiveHits + 1}, Total speed multiplier: ${speedMultiplier.toFixed(2)}x`);
              
              // Apply the new velocity with the combined speed multiplier
              this.scene.matter.body.setVelocity(ballBody, {
                x: newVelocity.x * speedMultiplier,
                y: newVelocity.y * speedMultiplier
              });
              
              // Make the ball smaller with each consecutive hit (up to a minimum size)
              const currentScale = ball.scaleX;
              const newScale = Math.max(currentScale * 0.95, 0.5); // Reduce by 5% each hit, minimum 50% of original size
              
              // Only shrink if we're above the minimum size
              if (currentScale > 0.5) {
                ball.setScale(newScale);
                
                // Adjust the physics body size to match the visual size
                if (ball.body) {
                  // Get the original radius (assuming it's stored in the ball's data)
                  const originalRadius = ball.getData('originalRadius') || 10; // Default to 10 if not set
                  const newRadius = originalRadius * newScale;
                  
                  // Instead of using matter.body.scale which causes type errors, recreate the circular body with the new size
                  try {
                    // Store the current velocity before changing the body
                    const currentVelocity = { 
                      x: ballBody.velocity.x, 
                      y: ballBody.velocity.y 
                    };
                    
                    // Store the current position
                    const currentPosition = {
                      x: ball.x,
                      y: ball.y
                    };
                    
                    // Remove the existing body from the world
                    this.scene.matter.world.remove(ball.body);
                    
                    // Create a new circular body with the scaled radius
                    const newBody = this.scene.matter.bodies.circle(
                      currentPosition.x,
                      currentPosition.y,
                      newRadius,
                      {
                        label: 'ball',
                        frictionAir: 0,
                        friction: 0.01,
                        restitution: 1.0,
                        density: 0.002
                      }
                    );
                    
                    // Set the new body on the ball sprite
                    ball.setExistingBody(newBody);
                    
                    // Restore the position
                    ball.setPosition(currentPosition.x, currentPosition.y);
                    
                    // Restore the velocity with the speed multiplier
                    this.scene.matter.body.setVelocity(newBody, {
                      x: currentVelocity.x,
                      y: currentVelocity.y
                    });
                    
                    // Set collision categories if physics manager is available
                    const physicsManager = this.scene instanceof BreakoutScene ? this.scene.getPhysicsManager() : this.physicsManager;
                    if (physicsManager) {
                      ball.setCollisionCategory(physicsManager.ballCategory);
                      ball.setCollidesWith([
                        physicsManager.brickCategory,
                        physicsManager.paddleCategory,
                        physicsManager.wallCategory
                      ]);
                    }
                    
                    console.log(`Ball resized to scale: ${newScale}, new radius: ${newRadius}`);
                  } catch (error) {
                    console.error('Error resizing ball:', error);
                    // If resizing fails, just keep the visual scale change
                  }
                }
              }
              
              // Play bounce sound if available
              const soundManager = this.scene instanceof BreakoutScene ? this.scene.getSoundManager() : null;
              if (soundManager && typeof soundManager.playSound === 'function') {
                soundManager.playSound('bounce');
              }
              
              // Create particle effect at collision point
              const particleManager = this.scene instanceof BreakoutScene ? this.scene.getParticleManager() : null;
              if (particleManager) {
                // Change particle color based on consecutive hits
                const hitColors = [0x00ffff, 0x00ff00, 0xffff00, 0xff8800, 0xff0000, 0xff00ff];
                const colorIndex = Math.min(consecutiveHits, hitColors.length - 1);
                
                // If we have significant paddle momentum, make particles larger and more numerous
                const particleScale = momentumBonus > 1.2 ? 1.5 : 1.0;
                const particleCount = momentumBonus > 1.2 ? 20 : 10;
                
                particleManager.createBounceEffect(
                  hitPosition.x,
                  hitPosition.y,
                  hitColors[colorIndex],
                  particleScale,
                  particleCount
                );
              }
              
              // Add a flash effect to the paddle
              const originalTint = paddle.tintTopLeft;
              paddle.setTint(0xffffff);
              this.scene.time.delayedCall(100, () => {
                paddle.setTint(originalTint);
              });
              
                    // Add a "speed line" effect if the ball is going very fast
                    if (speedMultiplier > 1.3 && particleManager) {
                      // Create a trail behind the ball
                      particleManager.createSpeedLines(ball, speedMultiplier);
                    }
                    
                    // Transfer spin to the ball based on paddle movement
                    this.transferPaddleSpin(ball, paddle, paddleVelocity);
                  }
                }
              }
            });
          }).catch(error => {
            console.error('Error importing PaddlePhysics:', error);
            if (this.errorManager) {
              this.errorManager.logError('Failed to import PaddlePhysics', error instanceof Error ? error.stack : undefined);
            }
          });
        } catch (error) {
          console.error('Error setting up paddle collisions:', error);
          if (this.errorManager) {
            this.errorManager.logError('Failed to set up paddle collisions', error instanceof Error ? error.stack : undefined);
          }
        }
      }
      /**
  * Update the color of all paddles
  * Called by ThemeManager when applying a theme
  */
 updatePaddleColors(paddleColor: number): void {
  try {
    // Apply the color to all paddles
    this.paddles.forEach(paddle => {
      paddle.setTint(paddleColor);
    });
    
    console.log(`Updated paddle colors to: ${paddleColor.toString(16)}`);
  } catch (error) {
    console.error('Error updating paddle colors:', error);
    if (this.errorManager) {
      this.errorManager.logError('Failed to update paddle colors', error instanceof Error ? error.stack : undefined);
    }
  }
}
  /**
   * Transfer spin to the ball based on paddle movement
   * This creates a more realistic physics effect where the paddle's motion
   * affects the ball's rotation and trajectory
   */
  private transferPaddleSpin(
    ball: Phaser.Physics.Matter.Sprite, 
    paddle: Phaser.Physics.Matter.Sprite,
    paddleVelocity: { x: number, y: number }
  ): void {
    try {
      // Only apply spin if the paddle is moving at a significant speed
      const paddleSpeed = Math.sqrt(paddleVelocity.x * paddleVelocity.x + paddleVelocity.y * paddleVelocity.y);
      if (paddleSpeed < 0.5) return;
      
      // Get paddle orientation
      const isVertical = paddle.getData('isVertical');
      
      // Calculate spin factor based on paddle movement
      // For horizontal paddles, x-movement creates spin
      // For vertical paddles, y-movement creates spin
      let spinFactor = 0;
      
      if (isVertical) {
        // For vertical paddles, y velocity creates spin
        spinFactor = paddleVelocity.y * 0.1;
      } else {
        // For horizontal paddles, x velocity creates spin
        spinFactor = paddleVelocity.x * 0.1;
      }
      
      // Store the spin factor on the ball
      const currentSpin = ball.getData('spinFactor') || 0;
      const newSpin = currentSpin + spinFactor;
      ball.setData('spinFactor', newSpin);
      
      // Apply visual rotation effect to the ball
      ball.setAngularVelocity(newSpin);
      
      // Apply a slight curve to the ball's trajectory based on spin
      const currentVelocity = {
        x: ball.body.velocity.x,
        y: ball.body.velocity.y
      };
      
      // Calculate perpendicular vector to create curve effect
      // This creates a Magnus effect where spin causes the ball to curve
      const speed = Math.sqrt(currentVelocity.x * currentVelocity.x + currentVelocity.y * currentVelocity.y);
      const normalizedVelocity = {
        x: currentVelocity.x / speed,
        y: currentVelocity.y / speed
      };
      
      // Perpendicular vector (rotate 90 degrees)
      const perpVector = {
        x: -normalizedVelocity.y,
        y: normalizedVelocity.x
      };
      
      // Apply spin effect to velocity (max 10% deflection)
      const spinEffect = Math.min(Math.abs(newSpin) * 0.05, 0.1);
      const spinDirection = newSpin > 0 ? 1 : -1;
      
      // Update velocity with curve effect
      const newVelocity = {
        x: currentVelocity.x + perpVector.x * spinEffect * spinDirection * speed,
        y: currentVelocity.y + perpVector.y * spinEffect * spinDirection * speed
      };
      
      // Apply the new velocity - Fix the type error with a proper type assertion
      this.scene.matter.body.setVelocity(ball.body as MatterJS.BodyType, newVelocity);
      
      // Log spin effect
      console.log(`Applied spin: ${newSpin.toFixed(2)}, causing ${(spinEffect * 100).toFixed(1)}% curve`);
      
      // Create a visual effect to show the spin
      if (Math.abs(newSpin) > 0.5 && this.visualEffects) {
        // If we have visual effects available, show spin effect
        const spinColor = newSpin > 0 ? 0x00ffff : 0xff00ff;
        this.visualEffects.createSpinEffect(ball, spinColor, Math.abs(newSpin));
      }
    } catch (error) {
      console.error('Error applying paddle spin to ball:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to apply paddle spin', error instanceof Error ? error.stack : undefined);
      }
    }
  }
  
  /**
   * Set up event listeners for paddle-related events
   */
  private setupEventListeners(): void {
    const eventManager = 'getEventManager' in this.scene && typeof this.scene.getEventManager === 'function' 
      ? this.scene.getEventManager() 
      : null;
      
    if (!eventManager) return;
    
    // Listen for power-up events that affect paddles
    eventManager.on('powerUpExpired', this.handlePowerUpExpired, this);
    eventManager.on('paddleSizeChanged', this.handlePaddleSizeChanged, this);
  }
  
  /**
   * Handle power-up expiration
   */
  private handlePowerUpExpired(data: { type: string }): void {
    // Reset paddle properties based on power-up type
    if (data.type === 'expand' || data.type === 'shrink') {
      this.resetPaddleSize();
    } else if (data.type === 'sticky') {
      this.setStickyPaddles(false);
    }
  }
  
  /**
   * Handle paddle size change events
   */
  private handlePaddleSizeChanged(data: { scale: number }): void {
    this.paddles.forEach(paddle => {
      const isVertical = paddle.getData('isVertical');
      if (isVertical) {
        paddle.setScale(1, data.scale);
      } else {
        paddle.setScale(data.scale, 1);
      }
    });
    
    // Emit event for UI updates
    const eventManager = 'getEventManager' in this.scene && typeof this.scene.getEventManager === 'function' 
      ? this.scene.getEventManager() 
      : null;
      
    if (eventManager) {
      eventManager.emit('paddlePropertiesChanged', {
        size: data.scale,
        sticky: this.isPaddleSticky()
      });
    }
  }
  
  /**
   * Reset all paddles to normal size
   */
  resetPaddleSize(): void {
    this.paddles.forEach(paddle => {
      paddle.setScale(1, 1);
    });
    
    // Emit event for UI updates
    const eventManager = 'getEventManager' in this.scene && typeof this.scene.getEventManager === 'function' 
      ? this.scene.getEventManager() 
      : null;
      
    if (eventManager) {
      eventManager.emit('paddlePropertiesChanged', {
        size: 1,
        sticky: this.isPaddleSticky()
      });
    }
  }

  /**
   * Set sticky property on all paddles
   */
  setStickyPaddles(isSticky: boolean): void {
    this.paddles.forEach(paddle => {
      paddle.setData('sticky', isSticky);
    });
    
    // Emit event for UI updates
    const eventManager = 'getEventManager' in this.scene && typeof this.scene.getEventManager === 'function' 
      ? this.scene.getEventManager() 
      : null;
      
    if (eventManager) {
      eventManager.emit('paddlePropertiesChanged', {
        size: this.getPaddleScale(),
        sticky: isSticky
      });
    }
  }
  
  /**
   * Check if any paddle is sticky
   */
  isPaddleSticky(): boolean {
    return this.paddles.some(paddle => paddle.getData('sticky') === true);
  }
  
  /**
   * Get the current paddle scale (size)
   */
  getPaddleScale(): number {
    if (this.paddles.length === 0) return 1;
    
    // Get scale from first paddle
    const paddle = this.paddles[0];
    const isVertical = paddle.getData('isVertical');
    return isVertical ? paddle.scaleY : paddle.scaleX;
  }
  
  /**
   * Get all active paddles
   */
  getPaddles(): Phaser.Physics.Matter.Sprite[] {
    return this.paddles;
  }
  
  /**
   * Get all paddles (alias for getPaddles for compatibility)
   */
  getAllPaddles(): Phaser.Physics.Matter.Sprite[] {
    return this.paddles;
  }
  
  /**
   * Get a specific paddle by edge
   */
  getPaddleByEdge(edge: string): Phaser.Physics.Matter.Sprite | undefined {
    return this.paddles.find(paddle => paddle.getData('edge') === edge);
  }
  
  /**
   * Enable control for all paddle controllers
   * Called by InputManager when game state changes
   */
  enableControl(): void {
    Object.values(this.paddleControllers).forEach(controller => {
      if (controller && typeof controller.enableControl === 'function') {
        controller.enableControl();
      }
    });
    
    // Emit event that paddle controls are enabled
    const eventManager = 'getEventManager' in this.scene && typeof this.scene.getEventManager === 'function' 
      ? this.scene.getEventManager() 
      : null;
      
    if (eventManager) {
      eventManager.emit('paddleControlEnabled');
    }
  }
  
  /**
   * Create a proper concave or convex paddle shape
   * This method creates the correct physics shape for paddles
   */
  public createPaddlePhysicsShape(paddle: Phaser.Physics.Matter.Sprite, isConcave: boolean): void {
    try {
      // Get paddle dimensions
      const width = paddle.displayWidth;
      const height = paddle.displayHeight;
      const isVertical = paddle.getData('isVertical');
      
      // Get the label from the body before removing it
      const bodyLabel = (paddle.body as any).label;
      
      // Remove existing physics body
      this.scene.matter.world.remove(paddle.body);
      
      let paddleBody;
      
      if (isConcave) {
        // Create a concave paddle (curved inward)
        if (isVertical) {
          // Vertical concave paddle
          const parts = [];
          const segments = 5; // Number of segments to create the curve
          const segmentWidth = width;
          const segmentHeight = height / segments;
          const curveFactor = width * 0.3; // How much the curve bends inward
          
          for (let i = 0; i < segments; i++) {
            // Calculate the x-offset for this segment (creates the curve)
            const progress = i / (segments - 1);
            const curveAmount = Math.sin(progress * Math.PI) * curveFactor;
            
            // Create a rectangle segment with appropriate position
            const segment = this.scene.matter.bodies.rectangle(
              curveAmount, // X offset creates the curve
              (i - segments/2 + 0.5) * segmentHeight, // Y position
              segmentWidth * 0.8, // Slightly narrower segments
              segmentHeight * 0.9, // Slightly shorter segments with gap
              { label: 'paddle_segment' }
            );
            
            parts.push(segment);
          }
          
          // Combine all segments into a compound body
          paddleBody = this.scene.matter.body.create({
            parts: parts,
            isStatic: true,
            label: bodyLabel // Use the saved label
          });
          
        } else {
          // Horizontal concave paddle
          const parts = [];
          const segments = 5; // Number of segments to create the curve
          const segmentWidth = width / segments;
          const segmentHeight = height;
          const curveFactor = height * 0.3; // How much the curve bends inward
          
          for (let i = 0; i < segments; i++) {
            // Calculate the y-offset for this segment (creates the curve)
            const progress = i / (segments - 1);
            const curveAmount = Math.sin(progress * Math.PI) * curveFactor;
            
            // Create a rectangle segment with appropriate position
            const segment = this.scene.matter.bodies.rectangle(
              (i - segments/2 + 0.5) * segmentWidth, // X position
              curveAmount, // Y offset creates the curve
              segmentWidth * 0.9, // Slightly narrower segments with gap
              segmentHeight * 0.8, // Slightly shorter segments
              { label: 'paddle_segment' }
            );
            
            parts.push(segment);
          }
          
          // Combine all segments into a compound body
          paddleBody = this.scene.matter.body.create({
            parts: parts,
            isStatic: true,
            label: bodyLabel // Use the saved label
          });
        }
        
      } else {
        // Create a convex paddle (curved outward)
        if (isVertical) {
          // Vertical convex paddle
          const parts = [];
          const segments = 5; // Number of segments to create the curve
          const segmentWidth = width;
          const segmentHeight = height / segments;
          const curveFactor = width * 0.3; // How much the curve bends outward
          
          for (let i = 0; i < segments; i++) {
            // Calculate the x-offset for this segment (creates the curve)
            const progress = i / (segments - 1);
            const curveAmount = -Math.sin(progress * Math.PI) * curveFactor;
            
            // Create a rectangle segment with appropriate position
            const segment = this.scene.matter.bodies.rectangle(
              curveAmount, // X offset creates the curve
              (i - segments/2 + 0.5) * segmentHeight, // Y position
              segmentWidth * 0.8, // Slightly narrower segments
              segmentHeight * 0.9, // Slightly shorter segments with gap
              { label: 'paddle_segment' }
            );
            
            parts.push(segment);
          }
          
          // Combine all segments into a compound body
          paddleBody = this.scene.matter.body.create({
            parts: parts,
            isStatic: true,
            label: bodyLabel // Use the saved label
          });
          
        } else {
          // Horizontal convex paddle
          const parts = [];
          const segments = 5; // Number of segments to create the curve
          const segmentWidth = width / segments;
          const segmentHeight = height;
          const curveFactor = height * 0.3; // How much the curve bends outward
          
          for (let i = 0; i < segments; i++) {
            // Calculate the y-offset for this segment (creates the curve)
            const progress = i / (segments - 1);
            const curveAmount = -Math.sin(progress * Math.PI) * curveFactor;
            
            // Create a rectangle segment with appropriate position
            const segment = this.scene.matter.bodies.rectangle(
              (i - segments/2 + 0.5) * segmentWidth, // X position
              curveAmount, // Y offset creates the curve
              segmentWidth * 0.9, // Slightly narrower segments with gap
              segmentHeight * 0.8, // Slightly shorter segments
              { label: 'paddle_segment' }
            );
            
            parts.push(segment);
          }
          
          // Combine all segments into a compound body
          paddleBody = this.scene.matter.body.create({
            parts: parts,
            isStatic: true,
            label: bodyLabel // Use the saved label
          });
        }
      }
      
      // Set the new body on the paddle
      paddle.setExistingBody(paddleBody);
      
      // Set the paddle position
      paddle.setPosition(paddle.x, paddle.y);
      
      // Set physics properties
      paddle.setFriction(0.01);
      paddle.setBounce(1.1);
      
      // Set collision categories if physics manager is available
      if (this.physicsManager) {
        paddle.setCollisionCategory(this.physicsManager.paddleCategory);
        paddle.setCollidesWith([
          this.physicsManager.ballCategory,
          this.physicsManager.powerUpCategory
        ]);
      } else {
        // Try to get physics manager from scene if it wasn't available at construction
        const physicsManager = 'getPhysicsManager' in this.scene && typeof this.scene.getPhysicsManager === 'function'
          ? this.scene.getPhysicsManager()
          : null;
          
        if (physicsManager) {
          paddle.setCollisionCategory(physicsManager.paddleCategory);
          paddle.setCollidesWith([
            physicsManager.ballCategory,
            physicsManager.powerUpCategory
          ]);
        }
      }
      
      // Store shape information
      paddle.setData('isConcave', isConcave);
      paddle.setData('isConvex', !isConcave);
      
      console.log(`Created ${isConcave ? 'concave' : 'convex'} paddle physics shape`);
      
    } catch (error) {
      console.error('Error creating paddle physics shape:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create paddle physics shape', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Create a paddle with the specified properties
   */
  public createPaddle(
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    options: { 
      texture?: string, 
      isVertical?: boolean, 
      isConcave?: boolean,
      id?: string
    } = {}
  ): Phaser.Physics.Matter.Sprite {
    try {
      // Set default options
      const texture = options.texture || 'paddle';
      const isVertical = options.isVertical || false;
      const isConcave = options.isConcave || false;
      const id = options.id || `paddle_${this.paddles.length}`;

      // Create the paddle sprite
      const paddle = this.scene.matter.add.sprite(x, y, texture, undefined, {
        isStatic: true,
        label: `paddle_${id}`
      });

      // Set display size
      paddle.setDisplaySize(width, height);

      // Store paddle properties
      paddle.setData('isVertical', isVertical);
      paddle.setData('id', id);

      // Create the proper physics shape
      this.createPaddlePhysicsShape(paddle, isConcave);

      // Add to paddles array
      this.paddles.push(paddle);

      return paddle;
    } catch (error) {
      console.error('Error creating paddle:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create paddle', error instanceof Error ? error.stack : undefined);
      }
      
      // Create a fallback paddle in case of error
      const fallbackPaddle = this.scene.matter.add.sprite(x, y, 'paddle', undefined, {
        isStatic: true,
        label: 'paddle_fallback'
      });
      fallbackPaddle.setDisplaySize(width, height);
      this.paddles.push(fallbackPaddle);
      
      return fallbackPaddle;
    }
  }
  
  /**
   * Register a paddle controller
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
   * Update method called every frame
   * Note: PaddleController.update() doesn't accept parameters according to the interface
   */
  public update(time?: number, delta?: number): void {
    // Update all paddle controllers
    Object.values(this.paddleControllers).forEach(controller => {
      // Make sure the controller is valid before calling update
      if (controller && typeof controller.update === 'function') {
        try {
          // Call update without parameters as per the interface definition
          controller.update();
          
          // Store time and delta in the scene's registry if needed by controllers
          if (time !== undefined && delta !== undefined) {
            this.scene.registry.set('currentTime', time);
            this.scene.registry.set('currentDelta', delta);
          }
        } catch (error) {
          console.error('Error updating paddle controller:', error);
          if (this.errorManager) {
            this.errorManager.logError('Error updating paddle controller', error instanceof Error ? error.stack : undefined);
          }
        }
      }
    });
  }

  /**
   * Clean up resources
   */
  public cleanup(): void {
    try {
      // Remove event listeners
      const eventManager = 'getEventManager' in this.scene && typeof this.scene.getEventManager === 'function' 
        ? this.scene.getEventManager() 
        : null;
        
      if (eventManager) {
        eventManager.off('powerUpExpired', this.handlePowerUpExpired, this);
        eventManager.off('paddleSizeChanged', this.handlePaddleSizeChanged, this);
      }
      
      // Clean up paddle controllers
      Object.values(this.paddleControllers).forEach(controller => {
        if (controller && typeof controller.cleanup === 'function') {
          controller.cleanup();
        }
      });
      
      // Clear arrays
      this.paddleControllers = {};
      this.paddles = [];
    } catch (error) {
      console.error('Error in PaddleManager cleanup:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to clean up paddle manager', error instanceof Error ? error.stack : undefined);
      }
    }
  }
}

export default PaddleManager;