import BreakoutScene from '@/scenes/breakout/BreakoutScene';
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
      friction: 0,     // No friction
      frictionAir: 0,  // No air resistance
      density: 0.01,   // Low density for consistent physics
      label: 'ball',   // Label for collision detection
      isSensor: false  // NOT a sensor - we want physical collisions
    });
    
    // Replace the sprite's body with our custom circle body
    ball.setExistingBody(circleBody);
    
    // Disable gravity for the ball - VERY IMPORTANT to prevent auto-falling
    ball.setIgnoreGravity(true);
    
    // Disable rotation
    ball.setFixedRotation();
    
    // Set the ball's collision category and mask
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager) {
      // Use setCollisionCategory directly
      physicsManager.setCollisionCategory(ball, 'ball');
      
      // Make sure ball collides with everything important
      physicsManager.setCollidesWith(ball, ['paddle', 'brick', 'wall', 'powerUp']);
    }
    
    // Set custom properties
    ball.setData('type', 'ball');
    ball.setData('isMainBall', true);
    ball.setData('id', `ball_${Date.now()}`);
    
    // Make sure the ball has no initial velocity
    if (ball.body) {
      this.scene.matter.body.setVelocity(ball.body as any, { x: 0, y: 0 });
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