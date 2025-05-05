import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import BallManager from '../Ball/BallManager';
import { ErrorManager } from '../ErrorManager';
import ParticleManager from '../ParticleManager';
import { BallBrickCollisionHandler } from './BallBrickCollisionHandler';
import { BallPaddleCollisionHandler } from './BallPaddleCollisionHandler';
import { BallWallCollisionHandler } from './BallWallCollisionHandler';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import { LaserBrickCollisionHandler } from './LaserBrickCollisionHandler';
import { PaddlePowerUpCollisionHandler } from './PaddlePowerUpCollisionHandler';

class CollisionManager {
  private scene: BreakoutScene;
  private collisionHandlers: CollisionHandlerInterface[] = [];
  private errorManager?: ErrorManager;
  private particleManager?: ParticleManager;
  private ballManager?: BallManager;
  private soundManager?: any;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Get managers from scene if available
    if ('getErrorManager' in scene && typeof scene.getErrorManager === 'function') {
      this.errorManager = scene.getErrorManager();
    }
    
    if ('getParticleManager' in scene && typeof scene.getParticleManager === 'function') {
      this.particleManager = scene.getParticleManager();
    }
    
    if ('getBallManager' in scene && typeof scene.getBallManager === 'function') {
      this.ballManager = scene.getBallManager();
    } else {
      // Fallback to direct access if getter method is not available
      this.ballManager = (scene as any).ballManager;
    }
    
    if ('getSoundManager' in scene && typeof scene.getSoundManager === 'function') {
      this.soundManager = scene.getSoundManager();
    }
  }

  public setupCollisionHandlers(): void {
    this.registerCollisionHandlers();
    this.scene.matter.world.on('collisionstart', this.handleCollisionStart, this);
    this.scene.matter.world.on('collisionactive', this.handleCollisionActive, this);
    this.scene.matter.world.on('collisionend', this.handleCollisionEnd, this);
    console.log('CollisionManager: All collision handlers set up');
  }

  private registerCollisionHandlers(): void {
    this.collisionHandlers = [
      new BallPaddleCollisionHandler(this.scene),
      new BallBrickCollisionHandler(this.scene),
      new PaddlePowerUpCollisionHandler(this.scene),
      new BallWallCollisionHandler(this.scene),
      new LaserBrickCollisionHandler(this.scene)
    ];
    console.log(`CollisionManager: Registered ${this.collisionHandlers.length} collision handlers`);
  }

  public handleCollisionStart(event: Phaser.Physics.Matter.Events.CollisionStartEvent): void {
    this.processCollisionEvent(event, 'start');
  }

  public handleCollisionActive(event: Phaser.Physics.Matter.Events.CollisionActiveEvent): void {
    this.processCollisionEvent(event, 'active');
  }

  public handleCollisionEnd(event: Phaser.Physics.Matter.Events.CollisionEndEvent): void {
    this.processCollisionEvent(event, 'end');
  }

  private processCollisionEvent(
    event: Phaser.Physics.Matter.Events.CollisionStartEvent |
           Phaser.Physics.Matter.Events.CollisionActiveEvent |
           Phaser.Physics.Matter.Events.CollisionEndEvent,
    stage: 'start' | 'active' | 'end'
  ): void {
    const pairs = event.pairs;

    for (let i = 0; i < pairs.length; i++) {
      const bodyA = pairs[i].bodyA;
      const bodyB = pairs[i].bodyB;

      // Skip if either body doesn't have a gameObject
      if (!bodyA.gameObject || !bodyB.gameObject) {
        continue;
      }

      if (stage === 'start') {
        console.log(`Collision detected between ${bodyA.label || 'unknown'} and ${bodyB.label || 'unknown'}`);
      }

      let handled = false;
      for (const handler of this.collisionHandlers) {
        handled = handler.handleCollision(bodyA, bodyB, stage);
        if (handled) {
          if (stage === 'start') {
            console.log(`Collision handled by ${handler.constructor.name}`);
          }
          break;
        }
      }

      const ballA = bodyA.label?.includes('ball') ? bodyA.gameObject : null;
      const ballB = bodyB.label?.includes('ball') ? bodyB.gameObject : null;
      const ball = ballA || ballB;

      if (ball && stage === 'end') {
        this.ensureBallActive(ball as Phaser.Physics.Matter.Sprite);
      }
    }
  }

  private ensureBallActive(ball: Phaser.Physics.Matter.Sprite): void {
    if (!ball) return;

    const { width, height } = this.scene.scale;
    if (ball.x < -50 || ball.x > width + 50 || ball.y < -50 || ball.y > height + 50) {
      console.warn('Ball out of bounds, repositioning...');
      ball.setPosition(width / 2, height / 2);
      ball.setVelocity(Phaser.Math.Between(-3, 3), -5);
    }

    if (!ball.body) {
      this.scene.matter.add.gameObject(ball);
    }

    ball.setVisible(true);
    ball.setActive(true);

    if (ball.body && Math.abs(ball.body.velocity.x) < 0.1 && Math.abs(ball.body.velocity.y) < 0.1) {
      const initialSpeed = 5;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * initialSpeed;
      const vy = Math.sin(angle) * initialSpeed;
      ball.setVelocity(vx, vy);
      console.log(`Ball velocity reset to (${vx}, ${vy})`);
    }
  }

  /**
   * Set up specialized collision handling for paddles
   * This provides more advanced physics handling for paddle collisions
   */
  public setupPaddleCollisions(): void {
    try {
      // Import PaddlePhysics dynamically to avoid circular dependencies
      import('../../utils/PaddlePhysics').then(({ PaddlePhysics }) => {
        // This specialized handler will be called in addition to the regular handlers
        // It provides more advanced physics calculations for paddle collisions
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
              const ball = this.ballManager?.getAllBalls().find(b => b.body === ballBody);
              
              // Get all paddles from the scene
              let paddle;
              if ('getAllPaddles' in this.scene && typeof this.scene.getAllPaddles === 'function') {
                paddle = this.scene.getAllPaddles().find(p => p.body === paddleBody);
              }
              
              if (ball && paddle) {
                console.log(`Advanced physics handling for ball collision with paddle ${(paddleBody as any).label}`);
                
                // Calculate the hit position
                const hitPosition = {
                  x: pairs[i].collision.supports[0].x,
                  y: pairs[i].collision.supports[0].y
                };
                
                // Calculate the new velocity using PaddlePhysics
                const newVelocity = PaddlePhysics.calculateBallDeflection(
                  ball, paddle, hitPosition
                );
                
                // Apply the new velocity - use type assertion to fix the TypeScript error
                this.scene.matter.body.setVelocity(ball.body as MatterJS.BodyType, newVelocity);
                
                // Play bounce sound if available
                if (this.soundManager && typeof this.soundManager.playSound === 'function') {
                  this.soundManager.playSound('bounce');
                }
                
                // Create particle effect at collision point
                if (this.particleManager) {
                  this.particleManager.createBounceEffect(
                    hitPosition.x,
                    hitPosition.y,
                    0x00ffff
                  );
                }
                
                // Add a flash effect to the paddle
                const originalTint = paddle.tintTopLeft;
                paddle.setTint(0xffffff);
                this.scene.time.delayedCall(100, () => {
                  paddle.setTint(originalTint);
                });
              }
            }
          }
        });
        
        console.log('Advanced paddle collision physics handler set up');
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

  public cleanup(): void {
    try {
      if (this.scene.matter && this.scene.matter.world) {
        this.scene.matter.world.off('collisionstart', this.handleCollisionStart, this);
        this.scene.matter.world.off('collisionactive', this.handleCollisionActive, this);
        this.scene.matter.world.off('collisionend', this.handleCollisionEnd, this);
      }
      this.collisionHandlers = [];
    } catch (error) {
      console.error('Error in CollisionManager cleanup:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to clean up collision manager', error instanceof Error ? error.stack : undefined);
      }
    }
  }
}

export default CollisionManager;