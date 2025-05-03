import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class LaserPowerUp implements PowerUpHandler {
  type = PowerUpType.LASER;
  private fireLaserHandler: Function | null = null;
  private activeLasers: Phaser.Physics.Arcade.Sprite[] = [];
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    paddle.setData('laser', true);
    
    // Create visual laser effect - check if 'laser' texture exists
    try {
    const laserEmitter = scene.add.particles(0, 0, 'laser', {
      speed: 500,
      lifespan: 1000,
      quantity: 1,
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD'
    });
    
    paddle.setData('laserEmitter', laserEmitter);
    } catch (error) {
      console.warn('Could not create laser particle effect:', error);
    }
    
    // Add input handler for firing lasers
    this.fireLaserHandler = () => {
      if (paddle.getData('laser')) {
        const x = paddle.x;
        const y = paddle.y - paddle.height / 2;
        
        try {
          // Create laser beam - check if 'laser' texture exists
        const laser = scene.physics.add.sprite(x, y, 'laser');
        laser.setVelocityY(-600);
        this.activeLasers.push(laser);
        
          // Add collision with bricks using the exact ArcadePhysicsCallback type
        scene.physics.add.collider(
          laser, 
          scene['bricks'], 
            // Use a properly typed callback that matches ArcadePhysicsCallback
            (
              object1: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
              object2: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody | Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
            ) => {
              // Fix: Get the actual game objects from the physics bodies
              // We need to handle different types of objects properly
              let laserObj: Phaser.Physics.Arcade.Sprite;
              let brickObj: Phaser.GameObjects.GameObject;
              
              if ('gameObject' in object1) {
                laserObj = object1.gameObject as Phaser.Physics.Arcade.Sprite;
              } else if (object1 instanceof Phaser.GameObjects.GameObject) {
                laserObj = object1 as Phaser.Physics.Arcade.Sprite;
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
              
            // Remove the laser from our tracking array
              const index = this.activeLasers.indexOf(laserObj);
          if (index !== -1) {
            this.activeLasers.splice(index, 1);
      }
            
            // Destroy the laser
              laserObj.destroy();
            
            // Call the hitBrick method on the scene
              if (typeof scene['hitBrick'] === 'function') {
                scene['hitBrick'].call(scene, laserObj, brickObj);
  }
            },
            undefined, 
            scene
          );
          
        // Auto-destroy after 1 second
        scene.time.delayedCall(1000, () => {
          // Find the laser in our tracking array
          const index = this.activeLasers.indexOf(laser);
          if (index !== -1) {
            // Remove from tracking array
            this.activeLasers.splice(index, 1);
            
            // Check if the laser still exists before destroying it
              if (laser && laser.body) {
        laser.destroy();
  }
}
        });
        } catch (error) {
          console.error('Error creating laser:', error);
}
  }
    };
  
    scene.input.on('pointerdown', this.fireLaserHandler);
    paddle.setData('laserHandler', this.fireLaserHandler);
  }
  
  remove(scene: BreakoutScene): void {
    const paddle = scene['paddle'];
    if (paddle) {
    paddle.setData('laser', false);
    
    // Clean up laser emitter
    const laserEmitter = paddle.getData('laserEmitter');
    if (laserEmitter) {
      laserEmitter.destroy();
    }
    
    // Remove input handler
    if (this.fireLaserHandler) {
      scene.input.off('pointerdown', this.fireLaserHandler);
      this.fireLaserHandler = null;
    }
    }
    
    // Clean up any active lasers
    this.activeLasers.forEach(laser => {
      if (laser) {
        laser.destroy();
  }
    });
    this.activeLasers = [];
}
}