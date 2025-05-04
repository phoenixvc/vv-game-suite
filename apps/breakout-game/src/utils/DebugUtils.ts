/**
 * Utility functions for debugging
 */
export class DebugUtils {
    /**
     * Log the current state of the game
     * @param scene The current scene
     */
    public static logGameState(scene: any): void {
      console.log('=== GAME STATE DEBUG ===');
      
      // Check for managers
      console.log('Managers:');
      const managers = [
        'physicsManager',
        'inputManager',
        'ballManager',
        'paddleManager',
        'brickManager',
        'powerUpManager',
        'particleManager',
        'eventManager',
        'timeManager',
        'soundManager',
        'uiManager',
        'levelManager',
        'scoreManager'
      ];
      
      managers.forEach(manager => {
        console.log(`- ${manager}: ${scene[manager] ? 'Available' : 'Missing'}`);
      });
      
      // Check for game objects
      console.log('\nGame Objects:');
      
      // Check paddles
      const paddleControllers = scene.getAllPaddleControllers ? scene.getAllPaddleControllers() : {};
      const paddleCount = Object.keys(paddleControllers).length;
      console.log(`- Paddles: ${paddleCount}`);
      
      if (paddleCount > 0) {
        Object.entries(paddleControllers).forEach(([id, controller]) => {
          const paddle = (controller as any).paddle;
          if (paddle) {
            console.log(`  - Paddle ${id}: x=${paddle.x}, y=${paddle.y}, active=${paddle.active}`);
          }
        });
      }
      
      // Check balls
      const ballManager = scene.getBallManager ? scene.getBallManager() : null;
      const balls = ballManager ? ballManager.getAllBalls() : [];
      console.log(`- Balls: ${balls.length}`);
      
      if (balls.length > 0) {
        balls.forEach((ball, index) => {
          console.log(`  - Ball ${index}: x=${ball.x}, y=${ball.y}, active=${ball.active}`);
        });
      }
      
      // Check bricks
      const brickManager = scene.getBrickManager ? scene.getBrickManager() : null;
      const brickCount = brickManager ? brickManager.getBrickCount() : 0;
      console.log(`- Bricks: ${brickCount}`);
      
      console.log('======================');
    }
  }
  
  export default DebugUtils;