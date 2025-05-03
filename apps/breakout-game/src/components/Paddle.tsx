import React, { useEffect, useState } from 'react';
import Phaser from 'phaser';

interface PaddleProps {
  edge: 'top' | 'bottom' | 'left' | 'right';
  width: number;
  height: number;
  color: string;
  speed: number;
  gameWidth: number;
  gameHeight: number;
  paddleEdge: 'top' | 'bottom' | 'left' | 'right';
  angleFactor: number; // Added angleFactor prop
}

const Paddle: React.FC<PaddleProps> = ({ edge, width, height, color, speed, gameWidth, gameHeight, paddleEdge, angleFactor }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    switch (paddleEdge) {
      case 'top':
        setPosition({ x: gameWidth / 2 - width / 2, y: height / 2 });
        break;
      case 'bottom':
        setPosition({ x: gameWidth / 2 - width / 2, y: gameHeight - height / 2 });
        break;
      case 'left':
        setPosition({ x: width / 2, y: gameHeight / 2 - height / 2 });
        break;
      case 'right':
        setPosition({ x: gameWidth - width / 2, y: gameHeight / 2 - height / 2 });
        break;
    }
  }, [paddleEdge, width, height, gameWidth, gameHeight]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (paddleEdge) {
        case 'top':
        case 'bottom':
          if (event.key === 'ArrowLeft') {
            setPosition(prev => ({ ...prev, x: Math.max(0, prev.x - speed) }));
          } else if (event.key === 'ArrowRight') {
            setPosition(prev => ({ ...prev, x: Math.min(gameWidth - width, prev.x + speed) }));
          }
          break;
        case 'left':
        case 'right':
          if (event.key === 'ArrowUp') {
            setPosition(prev => ({ ...prev, y: Math.max(0, prev.y - speed) }));
          } else if (event.key === 'ArrowDown') {
            setPosition(prev => ({ ...prev, y: Math.min(gameHeight - height, prev.y + speed) }));
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [paddleEdge, speed, gameWidth, gameHeight, width, height]);

  useEffect(() => {
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      width: gameWidth,
      height: gameHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: false
        }
      },
      scene: {
        preload: function () {
          this.load.image('ball', 'path/to/ball.png');
        },
        create: function () {
          const ball = this.physics.add.image(position.x, position.y, 'ball');
          ball.setCollideWorldBounds(true);
          ball.setBounce(1, 1);
          this.physics.add.collider(ball, this.paddle, (ball: any, paddle: any) => {
            const impactPoint = ball.x - paddle.x;
            ball.setVelocityX(impactPoint * 10);
          });
          this.registry.set('angleFactor', angleFactor); // Pass angleFactor to the scene
        }
      }
    });

    return () => {
      game.destroy(true);
    };
  }, [position, gameWidth, gameHeight, angleFactor]);

  return (
    <div
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        width: width,
        height: height,
        backgroundColor: color,
      }}
    />
  );
};

export default Paddle;
