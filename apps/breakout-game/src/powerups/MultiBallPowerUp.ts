import BreakoutScene from '@/scenes/breakout/BreakoutScene';
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
        scene.physics.add.collider(
          ball, 
          scene['paddle'], 
          (
            object1: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
            object2: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
          ) => {
            // Handle different types of objects properly
            let ballObj: Phaser.Physics.Arcade.Sprite;
            let paddleObj: Phaser.Physics.Arcade.Sprite;
            
            if ('gameObject' in object1) {
              ballObj = object1.gameObject as Phaser.Physics.Arcade.Sprite;
            } else if (object1 instanceof Phaser.GameObjects.GameObject) {
              ballObj = object1 as Phaser.Physics.Arcade.Sprite;
            } else {
              return; // Can't handle this type
            }
            
            if ('gameObject' in object2) {
              paddleObj = object2.gameObject as Phaser.Physics.Arcade.Sprite;
            } else if (object2 instanceof Phaser.GameObjects.GameObject) {
              paddleObj = object2 as Phaser.Physics.Arcade.Sprite;
            } else {
              return; // Can't handle this type
  }
            
            if (typeof scene['hitPaddle'] === 'function') {
              scene['hitPaddle'].call(scene, ballObj, paddleObj);
            }
          }, 
          undefined, 
          scene
        );
        
        // Add collision with bricks
        scene.physics.add.collider(
          ball, 
          scene['bricks'], 
          (
            object1: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
            object2: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
          ) => {
            // Handle different types of objects properly
            let ballObj: Phaser.Physics.Arcade.Sprite;
            let brickObj: Phaser.GameObjects.GameObject;
            
            if ('gameObject' in object1) {
              ballObj = object1.gameObject as Phaser.Physics.Arcade.Sprite;
            } else if (object1 instanceof Phaser.GameObjects.GameObject) {
              ballObj = object1 as Phaser.Physics.Arcade.Sprite;
            } else {
              return; // Can't handle this type
  }
            
            if ('gameObject' in object2) {
              brickObj = object2.gameObject as Phaser.GameObjects.GameObject;
            } else if (object2 instanceof Phaser.GameObjects.GameObject) {
              brickObj = object2 as Phaser.GameObjects.GameObject;
            } else {
              return; // Can't handle this type
}
    
            if (typeof scene['hitBrick'] === 'function') {
              scene['hitBrick'].call(scene, ballObj, brickObj);
}
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