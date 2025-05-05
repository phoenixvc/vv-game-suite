import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { Body as MatterBody } from 'matter-js';
import * as Phaser from 'phaser';

/**
 * Factory for creating ball objects
 */
class BallFactory {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Create a ball sprite with physics
   */
  public createBall(): Phaser.Physics.Matter.Sprite {
    console.log('Creating ball...');
    
    // Get the ball texture key
    const ballTextureKey = 'ball';
    
    // Check if the texture exists
    if (!this.scene.textures.exists(ballTextureKey)) {
      console.error(`Ball texture '${ballTextureKey}' not found!`);
      // Create a placeholder texture
      this.createBallPlaceholder();
    }
    
    // Create the ball sprite in the center of the screen
    const { width, height } = this.scene.scale;
    const x = width / 2;
    const y = height / 2;
    
    // Create the ball with Matter physics
    const ball = this.scene.matter.add.sprite(x, y, ballTextureKey);
    
    // Make sure the ball is visible
    ball.setVisible(true);
    ball.setAlpha(1);
    
    // Set the ball's physical properties
    const radius = ball.width / 2;
    const circleBody = this.scene.matter.bodies.circle(x, y, radius, {
      restitution: 1,  // Perfect bounce
      friction: 0.001, // Very slight friction to prevent sliding along surfaces
      frictionAir: 0,  // No air resistance
      density: 0.01,   // Low density for consistent physics
      label: 'ball',   // Label for collision detection
      isSensor: false, // NOT a sensor - we want physical collisions
      slop: 0          // Reduce slop to prevent passing through objects
    });
    
    // Replace the sprite's body with our custom circle body
    ball.setExistingBody(circleBody);
    
    // Disable gravity for the ball
    ball.setIgnoreGravity(true);
    
    // Disable rotation
    ball.setFixedRotation();
    
    // Set the ball's collision category and mask
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager) {
      // Check if the setupCollisionForBall method exists
      if (typeof physicsManager.setupCollisionForBall === 'function') {
        // Use the physics manager to set up collisions
        physicsManager.setupCollisionForBall(ball);
      } else {
        // Fall back to setCollisionCategory method
        physicsManager.setCollisionCategory(ball, 'ball');
        
        // Instead, if you need to set specific collision masks, do it directly:
        if (ball.body) {
          const ballGroup = physicsManager.getCollisionGroup('ball');
          if (ballGroup) {
            // Use proper type assertion for Matter.js body
            const matterBody = ball.body as unknown as MatterJS.BodyType;
            if (matterBody.collisionFilter) {
              matterBody.collisionFilter.category = ballGroup.category;
              matterBody.collisionFilter.mask = ballGroup.mask;
            } else {
              // Initialize collisionFilter if it doesn't exist
              matterBody.collisionFilter = {
                category: ballGroup.category,
                mask: ballGroup.mask,
                group: 0
              };
            }
          }
        }
      }
    
      // Enable collision events for debugging
      if (typeof physicsManager.enableCollisionEvents === 'function') {
        physicsManager.enableCollisionEvents(ball);
      }
    } else {
      // Fallback if physics manager is not available
      // Define collision categories
      const Category = {
        DEFAULT: 0x0001,
        BALL: 0x0002,
        PADDLE: 0x0004,
        BRICK: 0x0008,
        WALL: 0x0010,
        POWERUP: 0x0020
      };
      
      // Set collision filter directly on the body
      if (ball.body) {
        // Cast the body to a Matter.js body to access collisionFilter
        const matterBody = ball.body as unknown as MatterJS.BodyType;
        
        // Initialize collisionFilter if it doesn't exist
        if (!matterBody.collisionFilter) {
          matterBody.collisionFilter = {
            category: Category.BALL,
            mask: Category.DEFAULT | Category.PADDLE | Category.BRICK | Category.WALL | Category.POWERUP,
            group: 0
          };
        } else {
          // Set collision category
          matterBody.collisionFilter.category = Category.BALL;
          
          // Set what the ball collides with
          matterBody.collisionFilter.mask = 
            Category.DEFAULT | Category.PADDLE | Category.BRICK | Category.WALL | Category.POWERUP;
        }
      }
    }
    
    // Set custom properties
    ball.setData('type', 'ball');
    ball.setData('isMainBall', true);
    ball.setData('id', `ball_${Date.now()}`);
    
    // Make sure the ball has no initial velocity
    if (ball.body) {
      // Cast the body to the correct Matter.js type for setVelocity
      const matterBody = ball.body as MatterBody;
      this.scene.matter.body.setVelocity(matterBody, { x: 0, y: 0 });
    }
    
    // Log ball creation
    console.log(`Ball created at position (${x}, ${y}), radius: ${radius}`);
    console.log('Ball visibility:', ball.visible, 'Alpha:', ball.alpha);
    
    return ball;
  }

  /**
   * Create a placeholder texture for the ball if the original is missing
   */
  private createBallPlaceholder(): void {
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0xffffff);
    graphics.fillCircle(8, 8, 8);
    
    graphics.generateTexture('ball', 16, 16);
    graphics.destroy();
    
    console.log('Created placeholder ball texture');
  }
}

export default BallFactory;