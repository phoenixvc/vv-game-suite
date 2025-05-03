import { Brick, BrickConfig } from '../objects/Brick';
import BreakoutScene from '../scenes/BreakoutScene';

export interface MarketSignal {
  position: number;
  value: number;
  type: string;
}

export class BrickManager {
  private scene: BreakoutScene;
  private bricks: Phaser.GameObjects.Group;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.bricks = this.scene.add.group({
      classType: Brick,
      runChildUpdate: true
    });
  }
  
  public createBricks(signals: MarketSignal[]): Phaser.GameObjects.Group {
    // This method is now implemented directly in the BreakoutScene
    // We'll keep this for compatibility
    console.log('Bricks are created in the BreakoutScene');
    return this.bricks;
  }
  
  public getBricks(): Phaser.GameObjects.Group {
    return this.bricks;
  }
  
  /**
   * Handle collision between ball and brick
   * Updated to match Phaser's ArcadePhysicsCallback signature
   */
  public hitBrick(
    ballBody: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody, 
    brickBody: Phaser.Physics.Arcade.Body | Phaser.Physics.Arcade.StaticBody
  ): void {
    // Get the actual game objects from the bodies
    const ball = ballBody.gameObject;
    const brick = brickBody.gameObject as Brick;
    
    if (!brick || !(brick instanceof Brick)) {
      return;
    }
    
    // Apply damage to the brick
    const destroyed = brick.hit();
    
    if (destroyed) {
      // Calculate score based on brick type and value
      let scoreValue = brick.getValue();
      if (brick.getType() === 'price') scoreValue *= 1.5;
      if (brick.getType() === 'liquidity') scoreValue *= 2;
      
      // Update score
      this.scene.increaseScore(Math.floor(scoreValue));
    
      // Create particle effect
      this.scene.add.particles(brick.x, brick.y, 'star', {
        speed: 100,
        scale: { start: 1, end: 0 },
        lifespan: 500
      });
      
      // Add screen shake effect
      this.scene.cameras.main.shake(50, 0.01);
      
      // Randomly spawn power-ups
      if (Phaser.Math.Between(0, 100) < 20) { // 20% chance
        this.scene.createPowerUp(brick.x, brick.y);
      }
      
      // Remove the brick
      brick.destroy();
    
      // Check if all bricks are destroyed
      if (this.bricks.countActive() === 0) {
        this.scene.events.emit('levelComplete');
      }
    }
  }
  
  /**
   * Alternative collision handler for use with Arcade Physics collider
   */
  public handleBrickCollision(
    ball: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile,
    brick: Phaser.Types.Physics.Arcade.GameObjectWithBody | Phaser.Tilemaps.Tile
  ): void {
    const brickObj = brick as unknown as Phaser.GameObjects.GameObject;
    if (!brickObj) return;
    
    // Extract brick data - ensure we get numbers
    const brickType = brickObj.getData ? brickObj.getData('type') : '';
    const brickValue = brickObj.getData ? Number(brickObj.getData('value')) || 100 : 100;
  
    // Calculate score based on brick type and value
    let scoreValue = brickValue;
    if (brickType === 'price') scoreValue *= 1.5;
    if (brickType === 'liquidity') scoreValue *= 2;
  
    // Update score - this needs to be implemented in the scene
    if ('increaseScore' in this.scene && typeof this.scene.increaseScore === 'function') {
      this.scene.increaseScore(Math.floor(scoreValue));
    } else {
      // Fallback if increaseScore method doesn't exist
      const currentScore = this.scene.registry.get('score') || 0;
      this.scene.registry.set('score', currentScore + Math.floor(scoreValue));
    }
  
    // Create particle effect if we can access x and y
    if ('x' in brickObj && 'y' in brickObj) {
      const x = Number(brickObj.x);
      const y = Number(brickObj.y);
      this.scene.add.particles(x, y, 'star', {
        speed: 100,
        scale: { start: 1, end: 0 },
        lifespan: 500
      });
    }
  
    // Camera shake for feedback
    this.scene.cameras.main.shake(50, 0.01);
  
    // Chance to spawn power-up
    if (Phaser.Math.Between(0, 100) < 20 && 'x' in brickObj && 'y' in brickObj) { // 20% chance
      if ('createPowerUp' in this.scene && typeof this.scene.createPowerUp === 'function') {
        const x = Number(brickObj.x);
        const y = Number(brickObj.y);
        this.scene.createPowerUp(x, y);
      }
    }
  
    // Destroy the brick
    if ('destroy' in brickObj && typeof brickObj.destroy === 'function') {
      brickObj.destroy();
    }
  
    // Check if all bricks are destroyed
    if (this.bricks.countActive() === 0) {
      this.scene.events.emit('levelComplete');
    }
  }
}