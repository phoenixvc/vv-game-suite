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
  private brickColors: { [key: string]: number } = {};

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.bricks = this.scene.add.group({
      classType: Brick,
      runChildUpdate: true
    });
    this.factory = new BrickFactory(scene, this.bricks);
    this.collisionHandler = new BrickCollisionHandler(scene, this.bricks);
    
    // Initialize with default colors
    this.brickColors = {
      standard: 0xffffff,
      explosive: 0xff0000,
      reinforced: 0x888888,
      powerup: 0x00ff00,
      indestructible: 0x444444
    };
  }

  /**
   * Update brick colors based on the current theme
   * @param brickColors Object containing color values for different brick types
   */
  public updateBrickColors(brickColors: { [key: string]: number }): void {
    try {
      // Store the new brick colors
      this.brickColors = { ...this.brickColors, ...brickColors };
      
      // Apply colors to existing bricks
      if (this.bricks && this.bricks.getChildren().length > 0) {
        this.bricks.getChildren().forEach((brick: any) => {
          // Only update if it's a Brick object with the right methods
          if (brick && typeof brick.getBrickType === 'function') {
            const brickType = brick.getBrickType();
            if (brickType && this.brickColors[brickType]) {
              // Store original color if not already stored
              if (!brick.getData('originalTint')) {
                brick.setData('originalTint', brick.tintTopLeft);
              }
              
              // Apply the new color
              brick.setTint(this.brickColors[brickType]);
            }
          }
        });
      }
      
      // Emit an event that brick colors have been updated
      const eventManager = this.scene.getEventManager?.();
      if (eventManager) {
        eventManager.emit('brickColorsUpdated', { colors: this.brickColors });
      }
      
      console.log('Updated brick colors:', this.brickColors);
    } catch (error) {
      console.error('Error updating brick colors:', error);
      // Log error if error manager exists
      const errorManager = this.scene['getErrorManager']?.();
      if (errorManager && typeof errorManager.logError === 'function') {
        errorManager.logError('Failed to update brick colors', error instanceof Error ? error.stack : undefined);
      }
    }
  }

  /**
   * Get the color for a specific brick type
   * @param brickType The type of brick
   * @returns The color for the specified brick type
   */
  public getBrickColor(brickType: string): number {
    return this.brickColors[brickType] || this.brickColors.standard;
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