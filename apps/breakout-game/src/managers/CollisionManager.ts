import * as Phaser from 'phaser';
import BreakoutScene from '../scenes/BreakoutScene';

class CollisionManager {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Set up all collision handlers for the game
   * @param ball The main ball object
   * @param bricks The bricks group
   * @param paddles Array of paddles in the game
   * @param powerUps The power-ups group
   */
  setupCollisions(
    ball: Phaser.Physics.Matter.Sprite,
    bricks: Phaser.GameObjects.Group,
    paddles: Phaser.Physics.Matter.Sprite[],
    powerUps: Phaser.GameObjects.Group
  ): void {
    // Matter.js collision handling is done in the scene's setupCollisionHandlers method
    // This method is kept for compatibility with the original code structure
    console.log('Matter.js collisions are set up in the scene');
  }
  
  /**
   * Handle collision between ball and brick
   */
  private handleBallBrickCollision(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    bodyA?: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    bodyB?: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ): void {
    // Instead of using handleBrickCollision, we'll implement the brick collision logic here
    // since that method might not exist in BrickManager
    
    // Extract brick data if possible
    const brickObj = brick as unknown as Phaser.GameObjects.GameObject;
    if (!brickObj) return;
    
    // Try to get brick type and value
    let brickType = '';
    let brickValue = 100;
    
    if ('getData' in brickObj && typeof brickObj.getData === 'function') {
      brickType = brickObj.getData('type') || '';
      brickValue = brickObj.getData('value') || 100;
    }
    
    // Calculate score based on brick type and value
    let scoreValue = brickValue;
    if (brickType === 'price') scoreValue *= 1.5;
    if (brickType === 'liquidity') scoreValue *= 2;
    
    // Update score
    this.scene.increaseScore(scoreValue);
    
    // Create particle effect if possible
    if ('x' in brickObj && 'y' in brickObj && 
        typeof brickObj.x === 'number' && typeof brickObj.y === 'number') {
      this.scene.add.particles(brickObj.x, brickObj.y, 'star', {
        speed: 100,
        scale: { start: 1, end: 0 },
        lifespan: 500
      });
    }
    
    // Camera shake for feedback
    this.scene.cameras.main.shake(50, 0.01);
    
    // Chance to spawn power-up
    if (Phaser.Math.Between(0, 100) < 20 && 
        'x' in brickObj && 'y' in brickObj && 
        typeof brickObj.x === 'number' && typeof brickObj.y === 'number') {
      this.scene.createPowerUp(brickObj.x, brickObj.y);
    }
    
    // Destroy the brick
    if ('destroy' in brickObj && typeof brickObj.destroy === 'function') {
      brickObj.destroy();
    }
    
    // Check if all bricks are destroyed
    if (this.scene.brickManager.getBricks().countActive() === 0) {
      this.scene.events.emit('levelComplete');
    }
  }
  
  /**
   * Handle collision between ball and paddle
   */
  private handleBallPaddleCollision(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    paddle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    bodyA?: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    bodyB?: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ): void {
    // Safe access with type casting
    const ballObj = ball as unknown as Phaser.GameObjects.GameObject;
    const paddleObj = paddle as unknown as Phaser.GameObjects.GameObject;
    
    if (!ballObj || !paddleObj) return;
    
    // Safe access to properties with proper type checking
    let ballX = 0;
    let ballY = 0;
    let paddleX = 0;
    let paddleY = 0;
    
    if ('x' in ballObj && typeof ballObj.x === 'number') ballX = ballObj.x;
    if ('y' in ballObj && typeof ballObj.y === 'number') ballY = ballObj.y;
    if ('x' in paddleObj && typeof paddleObj.x === 'number') paddleX = paddleObj.x;
    if ('y' in paddleObj && typeof paddleObj.y === 'number') paddleY = paddleObj.y;
    
    // Safe access to body
    const ballBody = 'body' in ballObj && ballObj.body ? ballObj.body : null;
    
    if (ballBody) {
      // Determine which edge the paddle is on
      let edge: 'top' | 'bottom' | 'left' | 'right' = 'bottom';
      
      if (paddleY < this.scene.scale.height / 2) edge = 'top';
      else if (paddleY > this.scene.scale.height / 2) edge = 'bottom';
      else if (paddleX < this.scene.scale.width / 2) edge = 'left';
      else edge = 'right';
      
      // Apply appropriate physics based on edge
      if (edge === 'bottom' || edge === 'top') {
        const diff = ballX - paddleX;
        ballBody.velocity.x = diff * this.scene.getAngleFactor();
        
        if (edge === 'top') {
          ballBody.velocity.y = Math.abs(ballBody.velocity.y);
        } else {
          ballBody.velocity.y = -Math.abs(ballBody.velocity.y);
  }
      } else {
        const diff = ballY - paddleY;
        ballBody.velocity.y = diff * this.scene.getAngleFactor();
        
        if (edge === 'left') {
          ballBody.velocity.x = Math.abs(ballBody.velocity.x);
        } else {
          ballBody.velocity.x = -Math.abs(ballBody.velocity.x);
}
      }
    }
  }
  
  /**
   * Handle power-up collection
   */
  private collectPowerUp(
    paddle: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    powerUp: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    bodyA?: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody,
    bodyB?: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ): void {
    this.scene.powerUpManager.collectPowerUp(paddle, powerUp);
  }
}

export default CollisionManager;