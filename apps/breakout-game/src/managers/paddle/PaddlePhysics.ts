import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Handles physics interactions for paddles
 */
export class PaddlePhysics {
  private scene: BreakoutScene;
  private debugGraphics: Phaser.GameObjects.Graphics | null = null;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Create debug graphics if debug mode is enabled
    if (this.scene.registry.get('debugMode')) {
      this.debugGraphics = this.scene.add.graphics();
    }
  }

  /**
   * Set up collision handlers for paddle-ball interactions
   */
  setupCollisionHandlers(): void {
    // Add collision handler for ball-paddle collisions
    this.scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
      const pairs = event.pairs;
      
      for (let i = 0; i < pairs.length; i++) {
        const bodyA = pairs[i].bodyA;
        const bodyB = pairs[i].bodyB;
        
        // Check if this is a ball-paddle collision
        const ball = bodyA.label.includes('ball') ? bodyA : 
                    bodyB.label.includes('ball') ? bodyB : null;
                    
        const paddle = bodyA.label.includes('paddle') ? bodyA : 
                      bodyB.label.includes('paddle') ? bodyB : null;
        
        if (ball && paddle) {
          // Get the game objects
          const ballObject = ball.gameObject as Phaser.Physics.Matter.Sprite;
          
          // The paddle body might be a compound body, so we need to find the actual sprite
          let paddleObject: Phaser.Physics.Matter.Sprite | null = null;
          
          // If the body has a gameObject property, use it directly
          if (paddle.gameObject) {
            paddleObject = paddle.gameObject as Phaser.Physics.Matter.Sprite;
          } 
          // Otherwise, find the parent body that has the gameObject
          else if (paddle.parent && paddle.parent.gameObject) {
            paddleObject = paddle.parent.gameObject as Phaser.Physics.Matter.Sprite;
          }
          
          if (paddleObject) {
            // Calculate the collision point for more accurate physics
            const collisionPoint = {
              x: pairs[i].collision.supports.length > 0 ? pairs[i].collision.supports[0].x : ball.position.x,
              y: pairs[i].collision.supports.length > 0 ? pairs[i].collision.supports[0].y : ball.position.y
            };
            
            if (paddleObject.getData('isConcave')) {
              // Apply concave physics effect
              this.applyConcavePhysicsEffect(ballObject, paddleObject, collisionPoint);
            } else if (paddleObject.getData('isConvex')) {
              // Apply convex physics effect
              this.applyConvexPhysicsEffect(ballObject, paddleObject, collisionPoint);
            }
          }
        }

        // Check for ball-wall collisions
        const wall = bodyA.label.includes('wall') ? bodyA : 
                    bodyB.label.includes('wall') ? bodyB : null;
                    
        const ballInWallCollision = bodyA.label.includes('ball') ? bodyA : 
                                   bodyB.label.includes('ball') ? bodyB : null;
        
        if (wall && ballInWallCollision) {
          // Handle wall collision
          this.handleWallCollision(
            ballInWallCollision.gameObject as Phaser.Physics.Matter.Sprite,
            wall.label
          );
        }
      }
    });
  }

  /**
   * Apply physics effect to simulate concave paddle collision
   */
  applyConcavePhysicsEffect(
    ball: Phaser.Physics.Matter.Sprite, 
    paddle: Phaser.Physics.Matter.Sprite,
    collisionPoint: { x: number, y: number }
  ): void {
    try {
      const edge = paddle.getData('edge');
      const isVertical = paddle.getData('isVertical');
      const paddleWidth = paddle.getData('width');
      const paddleHeight = paddle.getData('height');
      
      // Calculate relative position of ball on paddle (0 to 1)
      let hitPosition;
      
      if (isVertical) {
        // For vertical paddles, use Y position
        hitPosition = (ball.y - (paddle.y - paddleHeight/2)) / paddleHeight;
      } else {
        // For horizontal paddles, use X position
        hitPosition = (ball.x - (paddle.x - paddleWidth/2)) / paddleWidth;
      }
      
      // Clamp hit position between 0 and 1
      hitPosition = Phaser.Math.Clamp(hitPosition, 0, 1);
      
      // Calculate angle modifier based on hit position
      // For concave, we want center hits to be straighter, edge hits to angle more
      const normalizedPos = (hitPosition - 0.5) * 2; // -1 to 1
      
      // Use a quadratic curve for concave effect - stronger at edges, weaker in center
      const angleModifier = Math.pow(normalizedPos, 2) * 0.8;
      
      // Get current velocity
      const velocity = new Phaser.Math.Vector2(ball.body.velocity.x, ball.body.velocity.y);
      const speed = velocity.length();
      
      // Calculate new angle and speed based on hit position
      let newAngle = velocity.angle();
      let newSpeed = speed * 1.05; // Base speed boost
      
      // Calculate the normal vector at the collision point based on the concave shape
      // For a concave shape, the normal changes based on hit position
      let normalVector = new Phaser.Math.Vector2(0, 0);
      
      if (isVertical) {
        // Vertical paddle
        switch (edge) {
          case 'left':
            // Left paddle should deflect right more at edges
            // Normal vector points right, but angles more towards center at the edges
            normalVector.x = 1;
            normalVector.y = -normalizedPos * 0.5; // Angled up or down based on hit position
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle - angleModifier;
            break;
          case 'right':
            // Right paddle should deflect left more at edges
            // Normal vector points left, but angles more towards center at the edges
            normalVector.x = -1;
            normalVector.y = normalizedPos * 0.5; // Angled up or down based on hit position
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle + angleModifier;
            break;
        }
      } else {
        // Horizontal paddle
        switch (edge) {
          case 'top':
            // Top paddle should deflect down more at edges
            // Normal vector points down, but angles more towards center at the edges
            normalVector.x = normalizedPos * 0.5; // Angled left or right based on hit position
            normalVector.y = 1;
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle + angleModifier;
            break;
          case 'bottom':
            // Bottom paddle should deflect up more at edges
            // Normal vector points up, but angles more towards center at the edges
            normalVector.x = -normalizedPos * 0.5; // Angled left or right based on hit position
            normalVector.y = -1;
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle - angleModifier;
            break;
        }
      }
      
      // Add extra speed boost for center hits (concave effect)
      // Center hits should be faster than edge hits
      const centerBoost = 1.0 + (1.0 - Math.abs(normalizedPos)) * 0.2;
      newSpeed *= centerBoost;
      
      // Set new velocity
      velocity.setToPolar(newAngle, newSpeed);
      ball.setVelocity(velocity.x, velocity.y);
      
      // Draw debug information if debug mode is enabled
      this.drawDebugInfo(ball, paddle, collisionPoint, normalVector, velocity);
      
      // Visual feedback - flash paddle
      paddle.setTint(0xffffff);
      this.scene.time.delayedCall(100, () => {
        paddle.setTint(paddle.getData('originalTint'));
      });
      
      // Emit event for other systems to react to
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('paddleHit', {
          paddle: edge,
          hitPosition: hitPosition,
          ballVelocity: { x: velocity.x, y: velocity.y }
        });
      }
    } catch (error) {
      console.error('Error applying concave physics effect:', error);
    }
  }

  /**
   * Apply physics effect to simulate convex paddle collision
   */
  applyConvexPhysicsEffect(
    ball: Phaser.Physics.Matter.Sprite, 
    paddle: Phaser.Physics.Matter.Sprite,
    collisionPoint: { x: number, y: number }
  ): void {
    try {
      const edge = paddle.getData('edge');
      const isVertical = paddle.getData('isVertical');
      const paddleWidth = paddle.getData('width');
      const paddleHeight = paddle.getData('height');
      
      // Calculate relative position of ball on paddle (0 to 1)
      let hitPosition;
      
      if (isVertical) {
        // For vertical paddles, use Y position
        hitPosition = (ball.y - (paddle.y - paddleHeight/2)) / paddleHeight;
      } else {
        // For horizontal paddles, use X position
        hitPosition = (ball.x - (paddle.x - paddleWidth/2)) / paddleWidth;
      }
      
      // Clamp hit position between 0 and 1
      hitPosition = Phaser.Math.Clamp(hitPosition, 0, 1);
      
      // Calculate angle modifier based on hit position
      // For convex, we want the opposite effect of concave
      // Center hits should angle more, edge hits should be straighter
      const normalizedPos = (hitPosition - 0.5) * 2; // -1 to 1
      
      // For convex, use a different curve - stronger in center, weaker at edges
      // Using a sine function for a smooth convex effect
      const angleModifier = Math.sin(normalizedPos * Math.PI/2) * 0.8;
      
      // Get current velocity
      const velocity = new Phaser.Math.Vector2(ball.body.velocity.x, ball.body.velocity.y);
      const speed = velocity.length();
      
      // Calculate new angle and speed based on hit position
      let newAngle = velocity.angle();
      let newSpeed = speed * 1.05; // Base speed boost
      
      // Calculate the normal vector at the collision point based on the convex shape
      // For a convex shape, the normal changes based on hit position
      let normalVector = new Phaser.Math.Vector2(0, 0);
      
      if (isVertical) {
        // Vertical paddle - opposite of concave behavior
        switch (edge) {
          case 'left':
            // Left paddle should deflect left more in center
            // Normal vector points right, but angles away from center in the middle
            normalVector.x = 1;
            normalVector.y = normalizedPos * 0.5; // Angled up or down based on hit position
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle + angleModifier;
            break;
          case 'right':
            // Right paddle should deflect right more in center
            // Normal vector points left, but angles away from center in the middle
            normalVector.x = -1;
            normalVector.y = -normalizedPos * 0.5; // Angled up or down based on hit position
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle - angleModifier;
            break;
        }
      } else {
        // Horizontal paddle - opposite of concave behavior
        switch (edge) {
          case 'top':
            // Top paddle should deflect up more in center
            // Normal vector points down, but angles away from center in the middle
            normalVector.x = -normalizedPos * 0.5; // Angled left or right based on hit position
            normalVector.y = 1;
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle - angleModifier;
            break;
          case 'bottom':
            // Bottom paddle should deflect down more in center
            // Normal vector points up, but angles away from center in the middle
            normalVector.x = normalizedPos * 0.5; // Angled left or right based on hit position
            normalVector.y = -1;
            newAngle = this.calculateReflectionAngle(velocity, normalVector);
            newAngle = newAngle + angleModifier;
            break;
        }
      }
      
      // Add extra speed boost for hits near the edges (convex effect)
      // Edge hits should be faster than center hits (opposite of concave)
      const edgeBoost = 1.0 + Math.abs(normalizedPos) * 0.2;
      newSpeed *= edgeBoost;
      
      // Set new velocity
      velocity.setToPolar(newAngle, newSpeed);
      ball.setVelocity(velocity.x, velocity.y);
      
      // Draw debug information if debug mode is enabled
      this.drawDebugInfo(ball, paddle, collisionPoint, normalVector, velocity);
      
      // Visual feedback - flash paddle
      paddle.setTint(0xffffff);
      this.scene.time.delayedCall(100, () => {
        paddle.setTint(paddle.getData('originalTint'));
      });
      
      // Emit event for other systems to react to
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('paddleHit', {
          paddle: edge,
          hitPosition: hitPosition,
          ballVelocity: { x: velocity.x, y: velocity.y }
        });
      }
    } catch (error) {
      console.error('Error applying convex physics effect:', error);
    }
  }

  /**
   * Calculate reflection angle based on incoming velocity and surface normal
   */
  private calculateReflectionAngle(
    velocity: Phaser.Math.Vector2,
    normal: Phaser.Math.Vector2
  ): number {
    // Normalize the normal vector
    normal.normalize();
    
    // Calculate the dot product of velocity and normal
    const dot = velocity.x * normal.x + velocity.y * normal.y;
    
    // Calculate the reflection vector: r = v - 2(v·n)n
    const reflectionX = velocity.x - 2 * dot * normal.x;
    const reflectionY = velocity.y - 2 * dot * normal.y;
    
    // Return the angle of the reflection vector
    return Math.atan2(reflectionY, reflectionX);
  }

  /**
   * Draw debug information for collisions
   */
  private drawDebugInfo(
    ball: Phaser.Physics.Matter.Sprite,
    paddle: Phaser.Physics.Matter.Sprite,
    collisionPoint: { x: number, y: number },
    normal: Phaser.Math.Vector2,
    velocity: Phaser.Math.Vector2
  ): void {
    if (!this.debugGraphics) return;
    
    // Clear previous debug graphics
    this.debugGraphics.clear();
    
    // Draw collision point
    this.debugGraphics.fillStyle(0xff0000);
    this.debugGraphics.fillCircle(collisionPoint.x, collisionPoint.y, 5);
    
    // Draw normal vector
    this.debugGraphics.lineStyle(2, 0x00ff00);
    const normalScale = 50; // Scale the normal vector for visibility
    this.debugGraphics.lineBetween(
      collisionPoint.x, 
      collisionPoint.y, 
      collisionPoint.x + normal.x * normalScale, 
      collisionPoint.y + normal.y * normalScale
    );
    
    // Draw velocity vector
    this.debugGraphics.lineStyle(2, 0x0000ff);
    const velocityScale = 10; // Scale the velocity vector for visibility
    this.debugGraphics.lineBetween(
      ball.x, 
      ball.y, 
      ball.x + velocity.x * velocityScale, 
      ball.y + velocity.y * velocityScale
    );
    
    // Make the debug graphics disappear after a short time
    this.scene.time.delayedCall(500, () => {
      if (this.debugGraphics) {
        this.debugGraphics.clear();
      }
    });
  }

  /**
   * Handle ball collision with walls
   */
  handleWallCollision(ball: Phaser.Physics.Matter.Sprite, wallLabel: string): void {
    try {
      // Determine which wall was hit
      const wallType = wallLabel.split('_')[1]; // Assuming format "wall_top", "wall_left", etc.
      
      // Apply slight speed increase on wall hits to keep game dynamic
      const velocity = new Phaser.Math.Vector2(ball.body.velocity.x, ball.body.velocity.y);
      const currentSpeed = velocity.length();
      const newSpeed = currentSpeed * 1.02; // 2% speed increase on wall hits
      
      // Cap the maximum speed to prevent the ball from becoming too fast
      const maxSpeed = 15; // Adjust based on your game's scale
      const cappedSpeed = Math.min(newSpeed, maxSpeed);
      
      // Apply the new speed while maintaining the current angle
      velocity.normalize().scale(cappedSpeed);
      ball.setVelocity(velocity.x, velocity.y);
      
      // Visual feedback - flash the ball
      const originalTint = ball.getData('originalTint') || 0xffffff;
      ball.setTint(0xaaaaff); // Light blue flash for wall hits
      this.scene.time.delayedCall(50, () => {
        ball.setTint(originalTint);
      });
      
      // Emit event for other systems to react to
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('wallHit', {
          wall: wallType,
          ballVelocity: { x: velocity.x, y: velocity.y }
        });
      }
    } catch (error) {
      console.error('Error handling wall collision:', error);
    }
  }
}

export default PaddlePhysics;