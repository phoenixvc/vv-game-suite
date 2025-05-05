import { Brick } from '@/objects';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { MarketSignal } from '@/types/MarketSignal';
import { BrickCollisionHandler } from '../CollisionHandlers/BrickCollisionHandler';
import { BrickFactory } from './BrickFactory';


class BrickManager {
  private scene: BreakoutScene;
  private bricks: Phaser.GameObjects.Group;
  private factory: BrickFactory;
  private collisionHandler: BrickCollisionHandler;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.bricks = this.scene.add.group({
      classType: Brick,
      runChildUpdate: true
    });
    this.factory = new BrickFactory(scene, this.bricks);
    this.collisionHandler = new BrickCollisionHandler(scene, this.bricks);
  }

  /**
   * Create bricks for the current level
   * @param level Current game level
   * @param signals Market signals to use for brick creation
   * @returns The group containing the created bricks
   */
  public createBricksForLevel(level: number, signals: MarketSignal[]): Phaser.GameObjects.Group {
    this.clearBricks();
    
    // The factory now adds bricks to the existing group instead of returning a new one
    this.factory.createBricks(level, signals);
    // Return the existing bricks group
    return this.bricks;
  }

  public createBricks(signals: MarketSignal[]): Phaser.GameObjects.Group {
    console.log('Bricks are created in the BreakoutScene');
    return this.bricks;
  }

  public getBricks(): Phaser.GameObjects.Group {
    return this.bricks;
  }

    /**
     * Handle collision between a ball and a brick
     * @param ball The ball game object
     * @param brick The brick game object
     */
    public handleBrickCollision(ball: Phaser.GameObjects.GameObject, brick: Phaser.GameObjects.GameObject): void {
        // Use handleGameObjectCollision instead of handleCollision
        this.collisionHandler.handleGameObjectCollision(ball, brick);
    }

  public clearBricks(): void {
    if (this.bricks) {
      this.bricks.clear(true, true);
    }
  }

  public getBrickCount(): number {
    return this.bricks.countActive();
  }
  public createBrickPattern(config: {
    level: number,
    theme: string,
    difficulty: number,
    width: number,
    height: number
  }): void {
    console.log('Creating brick pattern with config:', config);
  }

  public cleanup(): void {
    this.clearBricks();
  }
}

export default BrickManager;
