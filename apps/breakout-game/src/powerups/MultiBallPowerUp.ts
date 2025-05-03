import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class MultiBallPowerUp implements PowerUpHandler {
  type = PowerUpType.MULTI_BALL;
  private multiBalls: Phaser.Physics.Arcade.Sprite[] = [];
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    // Access the ball directly from the scene
    const mainBall = scene['ball'];
    
    // Check if mainBall and its body exist
    if (!mainBall || !mainBall.body) {
      console.warn('Cannot create multi-balls: Main ball or its physics body is missing');
      return;
    }
    
    const velocity = mainBall.body.velocity;
    
    // Create 2 additional balls
    for (let i = 0; i < 2; i++) {
      const angle = i === 0 ? Math.PI / 4 : -Math.PI / 4; // 45 degrees in different directions
      const newVelocity = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
      };
      
      try {
        // Create a new ball with the same properties as the main ball
        const ball = new (mainBall.constructor as any)(
          scene, 
          mainBall.x, 
          mainBall.y, 
          mainBall.texture.key
        );
        
        ball.setVelocity(newVelocity.x, newVelocity.y);
        this.multiBalls.push(ball);
        
        // Add the same collision handlers as the main ball
        scene.physics.add.collider(ball, scene['paddle'], 
          (obj1, obj2) => {
            const ballObj = obj1 as Phaser.Physics.Arcade.Sprite;
            const paddleObj = obj2 as Phaser.Physics.Arcade.Sprite;
            scene['hitPaddle'].call(scene, ballObj, paddleObj);
          }, 
          undefined, 
          scene
        );
        
        // Add collision with bricks
        scene.physics.add.collider(ball, scene['bricks'], 
          (obj1, obj2) => {
            const ballObj = obj1 as Phaser.Physics.Arcade.Sprite;
            const brickObj = obj2 as Phaser.GameObjects.GameObject;
            scene['hitBrick'].call(scene, ballObj, brickObj);
          }, 
          undefined, 
          scene
        );
      } catch (error) {
        console.error('Error creating multi-ball:', error);
  }
    }
  
    // Add a visual feedback
    scene.cameras.main.flash(500, 255, 255, 0); // Flash yellow
  }
  
  remove(scene: BreakoutScene): void {
    // Clean up multi balls
    this.multiBalls.forEach(ball => {
      try {
        if (ball) {
          ball.destroy();
      }
      } catch (error) {
        console.error('Error destroying multi-ball:', error);
  }
    });
    this.multiBalls = [];
}
}