import React from 'react';
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
  topPaddle?: Phaser.Physics.Arcade.Sprite;
  bottomPaddle?: Phaser.Physics.Arcade.Sprite;
  leftPaddle?: Phaser.Physics.Arcade.Sprite;
  rightPaddle?: Phaser.Physics.Arcade.Sprite;
  paddles?: Phaser.Physics.Arcade.Group;
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
      default: 'arcade',
      arcade: {
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
        // Create a group for all paddles
        this.paddles = this.physics.add.group();
        
        // Create ball
        const ball = this.physics.add.image(gameWidth / 2, gameHeight / 2, 'ball');
        ball.setCollideWorldBounds(true);
        ball.setBounce(1, 1);
        ball.setVelocity(200, 200); // Initial velocity
        
        // Create all four paddles with appropriate dimensions
        // Bottom paddle (horizontal)
        this.bottomPaddle = this.physics.add.sprite(
          positions.bottom.x + width/2, 
          positions.bottom.y, 
          'paddle'
        );
        this.bottomPaddle.setDisplaySize(width, height);
        this.bottomPaddle.setImmovable(true);
        this.paddles.add(this.bottomPaddle);
        
        // Top paddle (horizontal)
        this.topPaddle = this.physics.add.sprite(
          positions.top.x + width/2, 
          positions.top.y, 
          'paddle'
        );
        this.topPaddle.setDisplaySize(width, height);
        this.topPaddle.setImmovable(true);
        this.paddles.add(this.topPaddle);
        
        // Left paddle (vertical)
        this.leftPaddle = this.physics.add.sprite(
          positions.left.x, 
          positions.left.y + width/2, 
          'paddle'
        );
        this.leftPaddle.setDisplaySize(height, width); // Swap dimensions for vertical paddles
        this.leftPaddle.setImmovable(true);
        this.paddles.add(this.leftPaddle);
        
        // Right paddle (vertical)
        this.rightPaddle = this.physics.add.sprite(
          positions.right.x, 
          positions.right.y + width/2, 
          'paddle'
        );
        this.rightPaddle.setDisplaySize(height, width); // Swap dimensions for vertical paddles
        this.rightPaddle.setImmovable(true);
        this.paddles.add(this.rightPaddle);
        
        // Add collision between ball and all paddles
        this.physics.add.collider(ball, this.paddles, (ball: any, paddle: any) => {
          // Calculate impact point for horizontal paddles (bottom and top)
          if (paddle === this.bottomPaddle || paddle === this.topPaddle) {
            const impactPoint = ball.x - paddle.x;
            const normalizedImpact = impactPoint / (width / 2); // Range: -1 to 1
            ball.setVelocityX(ball.body.velocity.x + normalizedImpact * angleFactor * 100);
          } 
          // Calculate impact point for vertical paddles (left and right)
          else if (paddle === this.leftPaddle || paddle === this.rightPaddle) {
            const impactPoint = ball.y - paddle.y;
            const normalizedImpact = impactPoint / (width / 2); // Range: -1 to 1
            ball.setVelocityY(ball.body.velocity.y + normalizedImpact * angleFactor * 100);
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