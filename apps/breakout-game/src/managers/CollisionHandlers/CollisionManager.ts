import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import { BallBrickCollisionHandler } from './BallBrickCollisionHandler';
import { BallPaddleCollisionHandler } from './BallPaddleCollisionHandler';
import { BallWallCollisionHandler } from './BallWallCollisionHandler';
import { CollisionHandlerInterface } from './CollisionHandlerInterface';
import { LaserBrickCollisionHandler } from './LaserBrickCollisionHandler';
import { PaddlePowerUpCollisionHandler } from './PaddlePowerUpCollisionHandler';

class CollisionManager {
  private scene: BreakoutScene;
  private collisionHandlers: CollisionHandlerInterface[] = [];

  constructor(scene: BreakoutScene) {
    this.scene = scene;
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
      const ballManager = this.scene.getBallManager();
      const initialSpeed = 5;
      const angle = Math.random() * Math.PI * 2;
      const vx = Math.cos(angle) * initialSpeed;
      const vy = Math.sin(angle) * initialSpeed;
      ball.setVelocity(vx, vy);
      console.log(`Ball velocity reset to (${vx}, ${vy})`);
    }
  }

  public cleanup(): void {
    if (this.scene.matter && this.scene.matter.world) {
      this.scene.matter.world.off('collisionstart', this.handleCollisionStart, this);
      this.scene.matter.world.off('collisionactive', this.handleCollisionActive, this);
      this.scene.matter.world.off('collisionend', this.handleCollisionEnd, this);
    }
    this.collisionHandlers = [];
  }
}

export default CollisionManager;
