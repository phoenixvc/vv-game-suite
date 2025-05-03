import BreakoutScene from '../scenes/BreakoutScene';
import { Brick, BrickConfig } from '../objects/Brick';

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
    // Define the grid layout
    const gridConfig = {
      width: 10,
      height: 6,
      cellWidth: 64,
      cellHeight: 32,
      x: 112,
      y: 100
    };
    
    // Create bricks based on market signals
    for (let row = 0; row < gridConfig.height; row++) {
      for (let col = 0; col < gridConfig.width; col++) {
        const position = row * gridConfig.width + col;
        
        if (position < signals.length) {
          const signal = signals[position];
          const x = gridConfig.x + col * gridConfig.cellWidth + gridConfig.cellWidth / 2;
          const y = gridConfig.y + row * gridConfig.cellHeight + gridConfig.cellHeight / 2;
          
          // Create brick configuration
          const brickConfig: BrickConfig = {
            x,
            y,
            width: gridConfig.cellWidth - 4, // Small gap between bricks
            height: gridConfig.cellHeight - 4,
            type: signal.type,
            value: signal.value,
            health: Math.ceil(signal.value / 50), // Health based on value
            texture: 'brick'
          };
          
          // Create the brick and add to group
          const brick = new Brick(this.scene, brickConfig);
          this.bricks.add(brick);
        }
      }
    }
    
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
      // Add points based on brick value
      this.scene.increaseScore(brick.getValue());
      
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
}
}
}