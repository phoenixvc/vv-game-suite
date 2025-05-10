import BreakoutScene from "@/scenes/breakout/BreakoutScene";
import { generateRandomMarketSignals, MarketSignal } from "@/types/MarketSignal";

export class BrickFactory {
  private scene: BreakoutScene;
  private bricks: Phaser.GameObjects.Group;
  
  constructor(scene: BreakoutScene, bricks: Phaser.GameObjects.Group) {
    this.scene = scene;
    this.bricks = bricks;
  }
  
  /**
   * Create bricks for a level based on market signals
   * @param level Current game level
   * @param signals Market signals to use for brick creation
   * @returns A group containing the created bricks
   */
  public createBricks(
    level: number,
    signals?: MarketSignal[]
  ): void {
    const width = this.scene.scale.width;
  
    const brickWidth = 80;
    const brickHeight = 30;
    const padding = 10;
    const rows = 3 + Math.min(level, 5);
    const cols = 8 + Math.min(level, 4);
    const startX = (width - (cols * (brickWidth + padding))) / 2 + brickWidth / 2;
    const startY = 160 + (level * 5); // Changed from 80 to 160 to move down 2 rows

    // Generate random signals if none provided
    if (!signals || signals.length < rows * cols) {
      // You'll need to import or define generateRandomMarketSignals
      signals = generateRandomMarketSignals(rows * cols);
    }
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = startX + col * (brickWidth + padding);
        const y = startY + row * (brickHeight + padding);
        const signalIndex = row * cols + col;
        const signal = signalIndex < signals.length ? signals[signalIndex] : null;

        let brickType = '';
        let brickValue = 100 + (level * 10);
        let brickHealth = 1;
        let brickColor = 0xffffff;

        if (signal) {
          brickType = signal.type || '';
          brickValue = Math.max(50, signal.value || brickValue);
          
          // Apply different properties based on signal type
          switch (signal.type) {
            case 'price':
              brickColor = 0xff0000; // Red
              brickHealth = 2;
              break;
            case 'volume':
              brickColor = 0x00ff00; // Green
              break;
            case 'liquidity':
              brickColor = 0x0000ff; // Blue
              brickHealth = 3;
              break;
            case 'volatility':
              brickColor = 0xffff00; // Yellow
              brickHealth = 1;
              brickValue *= 1.5; // Higher value
              break;
            case 'sentiment':
              brickColor = 0xff00ff; // Purple
              // Sentiment affects value based on trend
              if (signal.trend === 'positive') {
                brickValue *= 1.2;
                brickColor = 0xc0ff00; // Lime
              } else if (signal.trend === 'negative') {
                brickValue *= 0.8;
                brickColor = 0xff00c0; // Pink
              }
              break;
            default:
              brickColor = Phaser.Display.Color.RandomRGB().color;
          }

          // Apply strength modifier if available
          if (signal.strength !== undefined) {
            // Higher strength means more health
            brickHealth = Math.max(1, Math.round(brickHealth * (1 + signal.strength)));
          }
        } else {
          // Random color for bricks without signals
          brickColor = Phaser.Display.Color.RandomRGB().color;
        }

        // Create the brick sprite
        const brick = this.scene.matter.add.sprite(x, y, 'brick');
        brick.setRectangle(brickWidth, brickHeight);
        brick.setStatic(true);
        
        // Store data on the brick for gameplay logic
        brick.setData('type', brickType);
        brick.setData('value', brickValue);
        brick.setData('health', brickHealth);
        brick.setData('maxHealth', brickHealth); // Store original health for visual effects
        
        // Store the original signal for reference
        if (signal) {
          brick.setData('signal', signal);
        }
        brick.setTint(brickColor);
        this.bricks.add(brick);

        // Configure physics for the brick
        const physicsManager = this.scene.getPhysicsManager();
        if (physicsManager) {
          physicsManager.setCollisionCategory(brick, 'brick');
          
          // Make sure the brick has a label for collision detection
          if (brick.body) {
            (brick.body as any).label = 'brick';
          }
        }
      }
    }
  }
}
