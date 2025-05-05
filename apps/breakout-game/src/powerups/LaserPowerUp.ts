import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUpType';
import { PowerUpHandler } from './PowerUpHandler';

export class LaserPowerUp implements PowerUpHandler {
  type = PowerUpType.LASER;
  private fireLaserHandler: Function | null = null;
  private activeLasers: Phaser.Physics.Matter.Sprite[] = [];
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Matter.Sprite, duration: number): void {
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
        const laser = scene.matter.add.sprite(x, y, 'laser');
        laser.setVelocityY(-600);
        this.activeLasers.push(laser);
        
        scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
          event.pairs.forEach(pair => {
            const bodyA = pair.bodyA;
            const bodyB = pair.bodyB;
        
            const gameObjectA = bodyA.gameObject;
            const gameObjectB = bodyB.gameObject;
        
            if (!gameObjectA || !gameObjectB) return;
        
            // Match laser and brick (order agnostic)
            const laser = [gameObjectA, gameObjectB].find(obj => this.activeLasers.includes(obj as Phaser.Physics.Matter.Sprite));
            const brick = [gameObjectA, gameObjectB].find(obj => obj !== laser && obj.name === 'brick'); // assuming bricks have `name = 'brick'`
        
            if (laser && brick) {
              const index = this.activeLasers.indexOf(laser as Phaser.Physics.Matter.Sprite);
              if (index !== -1) {
                this.activeLasers.splice(index, 1);
                laser.destroy();
              }
        
              if (typeof scene['hitBrick'] === 'function') {
                scene['hitBrick'].call(scene, laser, brick);
              }
            }
          });
        });
        
          
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