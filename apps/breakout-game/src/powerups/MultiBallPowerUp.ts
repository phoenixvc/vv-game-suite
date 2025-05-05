import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { PowerUpType } from '../types/PowerUpType';
import { PowerUpHandler } from './PowerUpHandler';

export class MultiBallPowerUp implements PowerUpHandler {
  type = PowerUpType.MULTI_BALL;
  private multiBalls: Phaser.Physics.Matter.Sprite[] = [];
  
  apply(scene: BreakoutScene, paddle: Phaser.Physics.Matter.Sprite, duration: number): void {
    const mainBall = scene['ball'];
    if (!mainBall || !mainBall.body) return;
  
    const velocity = mainBall.body.velocity;
  
    for (let i = 0; i < 2; i++) {
      const angle = i === 0 ? Math.PI / 4 : -Math.PI / 4;
      const newVelocity = {
        x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
        y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
      };
  
      try {
        const ball = new (mainBall.constructor as any)(
          scene, mainBall.x, mainBall.y, mainBall.texture.key
        );
  
        ball.setVelocity(newVelocity.x, newVelocity.y);
        ball.setData('isMultiBall', true);
        ball.body.label = 'multiBall';
        this.multiBalls.push(ball);
  
      } catch (error) {
        console.error('Error creating multi-ball:', error);
      }
    }
  
    scene.cameras.main.flash(500, 255, 255, 0);
  
    // Add collision handler only once per scene
    if (!scene.data.get('multiBallCollisionHandlerAttached')) {
      scene.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
        for (const pair of event.pairs) {
          const bodyA = pair.bodyA;
          const bodyB = pair.bodyB;
          const a = bodyA.gameObject;
          const b = bodyB.gameObject;
  
          if (!a || !b) continue;
  
          const isBallA = a.getData('isMultiBall');
          const isBallB = b.getData('isMultiBall');
  
          // Ball hitting brick
          if ((isBallA && b.name === 'brick') || (isBallB && a.name === 'brick')) {
            const brick = isBallA ? b : a;
            const ball = (isBallA ? a : b);
            if (ball instanceof Phaser.Physics.Matter.Sprite) {
              ball.destroy(); // ✅ safe now
            }
  
            if (typeof scene['hitBrick'] === 'function') {
              scene['hitBrick'].call(scene, ball, brick);
            }
          }
  
          // Ball hitting paddle
          if ((isBallA && b === paddle) || (isBallB && a === paddle)) {
            const ball = isBallA ? a : b;
            if (typeof scene['hitPaddle'] === 'function') {
              scene['hitPaddle'].call(scene, ball, paddle);
            }
          }
        }
      });
      scene.data.set('multiBallCollisionHandlerAttached', true);
    }
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