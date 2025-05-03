import React, { useEffect, useState } from 'react';
import { BasePaddleProps, getInitialPositions, renderPaddles, createPhaserGame, PaddlePositions } from './BasePaddle';

interface KeyboardPaddleProps extends BasePaddleProps {
  speed: number;
  player?: number;
}

const KeyboardPaddle: React.FC<KeyboardPaddleProps> = ({ 
  width, 
  height, 
  color, 
  speed, 
  gameWidth, 
  gameHeight, 
  angleFactor, 
  player = 1 
}) => {
  const [positions, setPositions] = useState<PaddlePositions>(getInitialPositions(gameWidth, gameHeight, width, height));

  // Handle keyboard controls for all paddles
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Player 1 controls (arrows)
      if (player === 1) {
        switch (event.key) {
          case 'ArrowLeft':
            // Move bottom and top paddles left
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              bottom: { ...prev.bottom, x: Math.max(0, prev.bottom.x - speed) },
              top: { ...prev.top, x: Math.max(0, prev.top.x - speed) }
            }));
            break;
          case 'ArrowRight':
            // Move bottom and top paddles right
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              bottom: { ...prev.bottom, x: Math.min(gameWidth - width, prev.bottom.x + speed) },
              top: { ...prev.top, x: Math.min(gameWidth - width, prev.top.x + speed) }
            }));
            break;
          case 'ArrowUp':
            // Move left and right paddles up
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              left: { ...prev.left, y: Math.max(0, prev.left.y - speed) },
              right: { ...prev.right, y: Math.max(0, prev.right.y - speed) }
            }));
            break;
          case 'ArrowDown':
            // Move left and right paddles down
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              left: { ...prev.left, y: Math.min(gameHeight - height, prev.left.y + speed) },
              right: { ...prev.right, y: Math.min(gameHeight - height, prev.right.y + speed) }
            }));
            break;
        }
      }
      // Player 2 controls (WASD)
      else if (player === 2) {
        switch (event.key) {
          case 'a':
            // Move bottom and top paddles left
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              bottom: { ...prev.bottom, x: Math.max(0, prev.bottom.x - speed) },
              top: { ...prev.top, x: Math.max(0, prev.top.x - speed) }
            }));
            break;
          case 'd':
            // Move bottom and top paddles right
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              bottom: { ...prev.bottom, x: Math.min(gameWidth - width, prev.bottom.x + speed) },
              top: { ...prev.top, x: Math.min(gameWidth - width, prev.top.x + speed) }
            }));
            break;
          case 'w':
            // Move left and right paddles up
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              left: { ...prev.left, y: Math.max(0, prev.left.y - speed) },
              right: { ...prev.right, y: Math.max(0, prev.right.y - speed) }
            }));
            break;
          case 's':
            // Move left and right paddles down
            setPositions((prev: PaddlePositions) => ({
              ...prev,
              left: { ...prev.left, y: Math.min(gameHeight - height, prev.left.y + speed) },
              right: { ...prev.right, y: Math.min(gameHeight - height, prev.right.y + speed) }
            }));
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [speed, gameWidth, gameHeight, width, height, player]);

  // Initialize Phaser game with all four paddles
  useEffect(() => {
    const game = createPhaserGame(gameWidth, gameHeight, positions, width, height, angleFactor);

    return () => {
      game.destroy(true);
    };
  }, [positions, gameWidth, gameHeight, width, height, angleFactor]);

  // Render a visual representation of the paddles
  return (
    <div 
      className="game-container"
      style={{
        position: 'relative',
        width: gameWidth,
        height: gameHeight,
        backgroundColor: '#000',
        overflow: 'hidden'
      }}
    >
      {renderPaddles(positions, width, height, color)}
      <div className="control-mode-indicator" style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
        Keyboard Mode: Player {player}
      </div>
    </div>
  );
};

export default KeyboardPaddle;