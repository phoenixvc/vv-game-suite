import BreakoutScene from '../scenes/BreakoutScene';
import { PowerUpType } from '../types/PowerUp';
import { PowerUpHandler } from './PowerUpHandler';

export class LaserPowerUp implements PowerUpHandler {
  type = PowerUpType.LASER;
  private fireLaserHandler: Function | null = null;
  private activeLasers: Phaser.Physics.Arcade.Sprite[] = [];
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Arcade.Sprite, duration: number): void {
    paddle.setData('laser', true);
    
    // Create visual laser effect
    const laserEmitter = scene.add.particles(0, 0, 'laser', {
      speed: 500,
      lifespan: 1000,
      quantity: 1,
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD'
    });
    
    paddle.setData('laserEmitter', laserEmitter);
    
    // Add input handler for firing lasers
    this.fireLaserHandler = () => {
      if (paddle.getData('laser')) {
        const x = paddle.x;
        const y = paddle.y - paddle.height / 2;
        
        // Create laser beam
        const laser = scene.physics.add.sprite(x, y, 'laser');
        laser.setVelocityY(-600);
        this.activeLasers.push(laser);
        
        // Add collision with bricks
        scene.physics.add.collider(
          laser, 
          scene['bricks'], 
          (obj1, obj2) => {
            // Cast the objects to the correct types
            const laserSprite = obj1 as Phaser.Physics.Arcade.Sprite;
            const brick = obj2 as Phaser.GameObjects.GameObject;
            
            // Remove the laser from our tracking array
            const index = this.activeLasers.indexOf(laserSprite);
            if (index !== -1) {
              this.activeLasers.splice(index, 1);
            }
            
            // Destroy the laser
            laserSprite.destroy();
            
            // Call the hitBrick method on the scene
            scene['hitBrick'].call(scene, laserSprite, brick);
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
            if (laser && !laser.body.enable) {
              laser.destroy();
      }
  }
        });
      }
    };
  
    scene.input.on('pointerdown', this.fireLaserHandler);
    paddle.setData('laserHandler', this.fireLaserHandler);
  }
  
  remove(scene: BreakoutScene): void {
    const paddle = scene['paddle'];
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
    
    // Clean up any active lasers
    this.activeLasers.forEach(laser => {
      if (laser) {
        laser.destroy();
  }
    });
    this.activeLasers = [];
}
}