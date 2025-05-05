import { Paddle } from '@/objects/Paddle';
import * as Phaser from 'phaser';

// Base interface for paddle props
export interface BasePaddleProps {
  width: number;
  height: number;
  color: string;
  gameWidth: number;
  gameHeight: number;
  angleFactor: number;
  player?: number;
}

// Define a custom scene type that includes the paddles
export interface CustomPaddleScene extends Phaser.Scene {
  topPaddle?: Phaser.Physics.Matter.Sprite;
  bottomPaddle?: Phaser.Physics.Matter.Sprite;
  leftPaddle?: Phaser.Physics.Matter.Sprite;
  rightPaddle?: Phaser.Physics.Matter.Sprite;
  paddles?: Phaser.Physics.Matter.Sprite[];
}

// Base positions type
export interface PaddlePositions {
  top: { x: number; y: number };
  bottom: { x: number; y: number };
  left: { x: number; y: number };
  right: { x: number; y: number };
}

// Initialize default paddle positions
export const getInitialPositions = (gameWidth: number, gameHeight: number, width: number, height: number): PaddlePositions => ({
  top: { x: gameWidth / 2 - width / 2, y: height / 2 },
  bottom: { x: gameWidth / 2 - width / 2, y: gameHeight - height / 2 },
  left: { x: width / 2, y: gameHeight / 2 - height / 2 },
  right: { x: gameWidth - width / 2, y: gameHeight / 2 - height / 2 }
});

// Render paddles function
export const renderPaddles = (
  positions: PaddlePositions, 
  width: number, 
  height: number, 
  color: string,
  activePaddle?: 'top' | 'bottom' | 'left' | 'right' | null
) => (
  <>
    <div 
      className={`bottom-paddle ${activePaddle === 'bottom' ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: positions.bottom.x,
        top: positions.bottom.y - height/2,
        width: width,
        height: height,
        backgroundColor: activePaddle === 'bottom' ? '#00ff00' : color,
        transition: 'background-color 0.2s'
      }}
    />
    <div 
      className={`top-paddle ${activePaddle === 'top' ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: positions.top.x,
        top: positions.top.y - height/2,
        width: width,
        height: height,
        backgroundColor: activePaddle === 'top' ? '#00ff00' : color,
        transition: 'background-color 0.2s'
      }}
    />
    <div 
      className={`left-paddle ${activePaddle === 'left' ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: positions.left.x - height/2,
        top: positions.left.y,
        width: height, // Swap dimensions for vertical paddles
        height: width,
        backgroundColor: activePaddle === 'left' ? '#00ff00' : color,
        transition: 'background-color 0.2s'
      }}
    />
    <div 
      className={`right-paddle ${activePaddle === 'right' ? 'active' : ''}`}
      style={{
        position: 'absolute',
        left: positions.right.x - height/2,
        top: positions.right.y,
        width: height, // Swap dimensions for vertical paddles
        height: width,
        backgroundColor: activePaddle === 'right' ? '#00ff00' : color,
        transition: 'background-color 0.2s'
      }}
    />
  </>
);

// Create Phaser game with paddles
export const createPhaserGame = (
  gameWidth: number, 
  gameHeight: number, 
  positions: PaddlePositions, 
  width: number, 
  height: number, 
  angleFactor: number,
  onUpdate?: (scene: CustomPaddleScene) => void
) => {
  return new Phaser.Game({
    type: Phaser.AUTO,
    width: gameWidth,
    height: gameHeight,
    physics: {
      default: 'matter',
      matter: {
        gravity: { y: 0, x: 0 },
        debug: false
      }
    },
    scene: {
      preload: function (this: CustomPaddleScene) {
        this.load.image('ball', 'path/to/ball.svg');
        this.load.image('paddle', 'path/to/paddle.svg');
      },
      create: function (this: CustomPaddleScene) {
        // Create an array for all paddles
        this.paddles = [];
        
        // Create ball using Matter.js
        const ball = this.matter.add.sprite(gameWidth / 2, gameHeight / 2, 'ball');
        ball.setCircle(ball.width / 2);
        ball.setBounce(1); // Matter.js only needs one value
        ball.setFriction(0, 0); // Set friction to 0
        ball.setVelocity(2, 2); // Initial velocity
        ball.setData('isBall', true);
        (ball.body as MatterJS.BodyType).label = 'ball';

        // Set up collision categories
        const worldCategory = 0x0001;
        const ballCategory = 0x0002;
        const paddleCategory = 0x0004;
        
        // Configure world bounds as static bodies with collision
        this.matter.world.setBounds(0, 0, gameWidth, gameHeight);
        
        // Create all four paddles with appropriate dimensions using Matter.js
        
        this.bottomPaddle = new Paddle({
          scene: this,
          x: positions.bottom.x + width / 2,
          y: positions.bottom.y,
          width,
          height,
          orientation: 'horizontal',
          collisionCategory: paddleCategory,
          collidesWith: [ballCategory],
          texture: 'paddle'
        });

        this.paddles.push(this.bottomPaddle);
        this.topPaddle = new Paddle({
          scene: this,
          x: positions.top.x + width / 2,
          y: positions.top.y,
          width,
          height,
          orientation: 'horizontal',
          collisionCategory: paddleCategory,
          collidesWith: [ballCategory],
          texture: 'paddle'
        });
        this.paddles.push(this.topPaddle);

        this.leftPaddle = new Paddle({
          scene: this,
          x: positions.left.x,
          y: positions.left.y + width / 2,
          width: height, // swapped
          height: width,
          orientation: 'vertical',
          collisionCategory: paddleCategory,
          collidesWith: [ballCategory],
          texture: 'paddle'
        });
        this.paddles.push(this.leftPaddle);
        
        this.rightPaddle = new Paddle({
          scene: this,
          x: positions.right.x,
          y: positions.right.y + width / 2,
          width: height, // swapped
          height: width,
          orientation: 'vertical',
          collisionCategory: paddleCategory,
          collidesWith: [ballCategory],
          texture: 'paddle'
        });
        this.paddles.push(this.rightPaddle);
        
        // Set up collision handler for ball and paddles using Matter.js events
        this.matter.world.on('collisionstart', (event: Phaser.Physics.Matter.Events.CollisionStartEvent) => {
          const pairs = event.pairs;
          
          for (let i = 0; i < pairs.length; i++) {
            const bodyA = pairs[i].bodyA as MatterJS.BodyType;
            const bodyB = pairs[i].bodyB as MatterJS.BodyType;

            const labels = [bodyA.label, bodyB.label];
            if (labels.includes('ball') && labels.includes('paddle')) {
              const ballBody = bodyA.label === 'ball' ? bodyA : bodyB;
              const paddleBody = bodyA.label === 'paddle' ? bodyA : bodyB;

              if (ballBody.gameObject && paddleBody.gameObject) {
                const ball = ballBody.gameObject as Phaser.Physics.Matter.Sprite;
                const paddle = paddleBody.gameObject as Phaser.Physics.Matter.Sprite;

                const isPaddleHorizontal =
                  paddle === this.bottomPaddle || paddle === this.topPaddle;

                const impactPoint = isPaddleHorizontal
                  ? ball.x - paddle.x
                  : ball.y - paddle.y;
                const normalizedImpact = impactPoint / (width / 2);

                const velocity = ball.body.velocity as Phaser.Math.Vector2;
                const newVelocity = isPaddleHorizontal
                  ? { x: velocity.x + normalizedImpact * angleFactor, y: velocity.y }
                  : { x: velocity.x, y: velocity.y + normalizedImpact * angleFactor };

                ball.setVelocity(newVelocity.x, newVelocity.y);
              }
            }
          }
        });
        
        this.registry.set('angleFactor', angleFactor);
      },
      update: function (this: CustomPaddleScene) {
        // Update paddle positions
        if (this.bottomPaddle) this.bottomPaddle.setPosition(positions.bottom.x + width/2, positions.bottom.y);
        if (this.topPaddle) this.topPaddle.setPosition(positions.top.x + width/2, positions.top.y);
        if (this.leftPaddle) this.leftPaddle.setPosition(positions.left.x, positions.left.y + width/2);
        if (this.rightPaddle) this.rightPaddle.setPosition(positions.right.x, positions.right.y + width/2);
        
        // Call custom update function if provided
        if (onUpdate) {
          onUpdate(this);
        }
      }
    }
  });
};