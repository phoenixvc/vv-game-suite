import React, { useEffect, useState, useRef } from 'react';
import { BasePaddleProps, getInitialPositions, renderPaddles, createPhaserGame, CustomPaddleScene, PaddlePositions } from './BasePaddle';

interface MousePaddleProps extends BasePaddleProps {
  // No additional props needed for mouse control
}

const MousePaddle: React.FC<MousePaddleProps> = ({ 
  width, 
  height, 
  color, 
  gameWidth, 
  gameHeight, 
  angleFactor 
}) => {
  const [positions, setPositions] = useState<PaddlePositions>(getInitialPositions(gameWidth, gameHeight, width, height));
  
  // Ref to track the closest paddle to the mouse
  const closestPaddleRef = useRef<'top' | 'bottom' | 'left' | 'right' | null>(null);
  
  // Reference to the game container for mouse position calculations
  const gameContainerRef = useRef<HTMLDivElement>(null);

  // Handle mouse controls
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!gameContainerRef.current) return;
      
      // Get game container bounds
      const rect = gameContainerRef.current.getBoundingClientRect();
      
      // Calculate mouse position relative to game container
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      // Calculate distances to each edge
      const distToTop = mouseY;
      const distToBottom = rect.height - mouseY;
      const distToLeft = mouseX;
      const distToRight = rect.width - mouseX;
      
      // Find the closest edge
      const minDist = Math.min(distToTop, distToBottom, distToLeft, distToRight);
      
      let closestPaddle: 'top' | 'bottom' | 'left' | 'right';
      
      if (minDist === distToTop) {
        closestPaddle = 'top';
      } else if (minDist === distToBottom) {
        closestPaddle = 'bottom';
      } else if (minDist === distToLeft) {
        closestPaddle = 'left';
      } else {
        closestPaddle = 'right';
      }
      
      closestPaddleRef.current = closestPaddle;
      
      // Move only the closest paddle
      setPositions((prev: PaddlePositions) => {
        const newPositions = { ...prev };
        
        if (closestPaddle === 'top' || closestPaddle === 'bottom') {
          // For horizontal paddles, adjust x position
          const newX = mouseX - width / 2;
          const clampedX = Math.max(0, Math.min(gameWidth - width, newX));
          newPositions[closestPaddle].x = clampedX;
        } else {
          // For vertical paddles, adjust y position
          const newY = mouseY - width / 2; // width is the height of vertical paddles
          const clampedY = Math.max(0, Math.min(gameHeight - width, newY));
          newPositions[closestPaddle].y = clampedY;
        }
        
        return newPositions;
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gameWidth, gameHeight, width, height]);

  // Initialize Phaser game with all four paddles
  useEffect(() => {
    const game = createPhaserGame(
      gameWidth, 
      gameHeight, 
      positions, 
      width, 
      height, 
      angleFactor,
      (scene: CustomPaddleScene) => {
        // Highlight the closest paddle
        if (closestPaddleRef.current) {
          // Reset all paddles to normal tint
          if (scene.bottomPaddle) scene.bottomPaddle.setTint(0xffffff);
          if (scene.topPaddle) scene.topPaddle.setTint(0xffffff);
          if (scene.leftPaddle) scene.leftPaddle.setTint(0xffffff);
          if (scene.rightPaddle) scene.rightPaddle.setTint(0xffffff);
          
          // Highlight the closest paddle
          const highlightColor = 0x00ff00; // Green tint
          switch (closestPaddleRef.current) {
            case 'top':
              if (scene.topPaddle) scene.topPaddle.setTint(highlightColor);
              break;
            case 'bottom':
              if (scene.bottomPaddle) scene.bottomPaddle.setTint(highlightColor);
              break;
            case 'left':
              if (scene.leftPaddle) scene.leftPaddle.setTint(highlightColor);
              break;
            case 'right':
              if (scene.rightPaddle) scene.rightPaddle.setTint(highlightColor);
              break;
          }
        }
      }
    );

    return () => {
      game.destroy(true);
    };
  }, [positions, gameWidth, gameHeight, width, height, angleFactor]);

  // Render a visual representation of the paddles and the game container
  return (
    <div 
      ref={gameContainerRef}
      className="game-container"
      style={{
        position: 'relative',
        width: gameWidth,
        height: gameHeight,
        backgroundColor: '#000',
        overflow: 'hidden'
      }}
    >
      {renderPaddles(positions, width, height, color, closestPaddleRef.current)}
      <div className="control-mode-indicator" style={{ position: 'absolute', top: 10, right: 10, color: 'white' }}>
        Mouse Mode: {closestPaddleRef.current || 'None'} paddle active
      </div>
    </div>
  );
};

export default MousePaddle;