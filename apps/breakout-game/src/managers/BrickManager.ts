import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import { Brick } from '../objects/Brick';

// Constants for better maintainability
const POWERUP_SPAWN_CHANCE = 20; // 20% chance
const PARTICLE_CONFIG = {
          texture: 'square',
          count: 15,
          speed: { min: 50, max: 150 },
          scale: { start: 0.5, end: 0 },
          lifespan: 600,
          duration: 600
};

export interface MarketSignal {
  position: number;
  value: number;
  type: string;
}
        
class BrickManager {
  private scene: BreakoutScene;
  private bricks: Phaser.GameObjects.Group;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.bricks = this.scene.add.group({
      classType: Brick,
      runChildUpdate: true
    });
  }
  
  /**
   * Create bricks for a specific level using market signals
   * @param level The level number
   * @param signals Array of market signals to use for brick generation
   * @returns The group containing all created bricks
   */
  public createBricksForLevel(level: number, signals: MarketSignal[]): Phaser.GameObjects.Group {
    // Clear any existing bricks
    this.clearBricks();
    
    // Get game dimensions
    const width = this.scene.scale.width;
    const height = this.scene.scale.height;
    
    // Calculate brick dimensions based on level
    const brickWidth = 80;
    const brickHeight = 30;
    const padding = 10;
    
    // Calculate number of rows and columns based on level difficulty
    const rows = 3 + Math.min(level, 5); // Increase rows with level, max 8
    const cols = 8 + Math.min(level, 4); // Increase columns with level, max 12
    
    // Calculate starting position to center the grid
    const startX = (width - (cols * (brickWidth + padding))) / 2 + brickWidth / 2;
    const startY = 80 + (level * 5); // Move bricks down slightly with each level
    
    // Create brick grid
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        // Calculate position
        const x = startX + col * (brickWidth + padding);
        const y = startY + row * (brickHeight + padding);
        
        // Determine brick properties based on signals if available
        let brickType = '';
        let brickValue = 100 + (level * 10); // Base value increases with level
        let brickHealth = 1;
        let brickColor = 0xffffff;
        
        // Find a signal that matches this position if available
        const signalIndex = row * cols + col;
        if (signals && signals[signalIndex]) {
          const signal = signals[signalIndex];
          
          // Use signal data to customize brick
          brickType = signal.type || '';
          brickValue = Math.max(50, signal.value || brickValue);
          
          // Set color based on signal type
          switch (signal.type) {
            case 'price':
              brickColor = 0xff0000; // Red for price signals
              brickHealth = 2; // Stronger bricks
              break;
            case 'volume':
              brickColor = 0x00ff00; // Green for volume signals
              break;
            case 'liquidity':
              brickColor = 0x0000ff; // Blue for liquidity signals
              brickHealth = 3; // Strongest bricks
              break;
            default:
              // Random color for other types
              brickColor = Phaser.Display.Color.RandomRGB().color;
  }
        } else {
          // Random color for bricks without signals
          brickColor = Phaser.Display.Color.RandomRGB().color;
}

        // Create the brick as a Matter.js sprite
        const brick = this.scene.matter.add.sprite(x, y, 'brick');
        
        // Set brick properties
        brick.setRectangle(brickWidth, brickHeight);
        brick.setStatic(true);
        brick.setData('type', brickType);
        brick.setData('value', brickValue);
        brick.setData('health', brickHealth);
        brick.setTint(brickColor);
        
        // Add to the bricks group
        this.bricks.add(brick);
        
        // Set collision category
        const physicsManager = this.scene.getPhysicsManager();
        if (physicsManager) {
          physicsManager.setCollisionCategory(brick, 'brick');
        }
      }
    }
    
    console.log(`Created ${this.bricks.getLength()} bricks for level ${level}`);
    return this.bricks;
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
   * Handle collision between ball and brick for Matter.js physics
   * This is called by CollisionManager when a ball hits a brick
   */
  public handleBrickCollision(
    ball: Phaser.GameObjects.GameObject,
    brick: Phaser.GameObjects.GameObject
  ): void {
    // Skip if brick doesn't have getData method
    if (!brick || !('getData' in brick)) {
      return;
    }
    
    // Get brick data
    const brickType = brick.getData ? brick.getData('type') || '' : '';
    const brickValue = brick.getData ? Number(brick.getData('value')) || 100 : 100;
    const brickHealth = brick.getData ? Number(brick.getData('health')) || 1 : 1;
    
    // Apply damage to the brick
    let destroyed = false;
    
    if (brickHealth <= 1) {
      // Brick is destroyed
      destroyed = true;
    } else {
      // Reduce brick health
      brick.setData('health', brickHealth - 1);
      
      // Update brick appearance based on health
      if ('setTint' in brick && typeof brick.setTint === 'function') {
        // Darken the brick as it takes damage
        const tint = 0xffffff - ((0xffffff / (brickHealth + 1)) * (brickHealth - (brickHealth - 1)));
        brick.setTint(tint);
      }
      
      // Emit brick damaged event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('brickDamaged', { brick });
        }
    }
        
    if (destroyed) {
      // Calculate score based on brick type and value
      let scoreValue = brickValue;
      if (brickType === 'price') scoreValue *= 1.5;
      if (brickType === 'liquidity') scoreValue *= 2;
      
      // Update score using ScoreManager
      const scoreManager = this.scene.getScoreManager();
      if (scoreManager) {
        scoreManager.increaseScore(Math.floor(scoreValue));
      }
      
      // Get brick position for effects
      let brickX = 0;
      let brickY = 0;
      if ('x' in brick && typeof brick.x === 'number') brickX = brick.x;
      if ('y' in brick && typeof brick.y === 'number') brickY = brick.y;
      // Use ParticleManager to create a brick destroy effect
      const particleManager = this.scene.getParticleManager();
      if (particleManager) {
        // Get the brick color if available
        let color = 0xffffff;
        if ('tintTopLeft' in brick) {
          color = Number(brick.tintTopLeft);
      }
        
        // Create particles with the brick's color
        particleManager.createParticles(brickX, brickY, {
          ...PARTICLE_CONFIG,
          color: color
        });
    }
  
      // Add screen shake effect
    this.scene.cameras.main.shake(50, 0.01);
  
      // Randomly spawn power-ups using PowerUpManager
      if (Phaser.Math.Between(0, 100) < POWERUP_SPAWN_CHANCE) {
      const powerUpManager = this.scene.getPowerUpManager();
      if (powerUpManager) {
          powerUpManager.createPowerUp(brickX, brickY);
      }
    }
  
      // Remove the brick from the physics world if it has a body
      if ('body' in brick && brick.body) {
        this.scene.matter.world.remove(brick.body);
    }
  
      // Destroy the brick
      if ('destroy' in brick && typeof brick.destroy === 'function') {
        brick.destroy();
    }
      
      // Emit brick destroyed event
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('brickDestroyed', {
          x: brickX,
          y: brickY,
          special: brickType !== '',
          specialType: brickType
        });
  }
      
      // Check if all bricks are destroyed
      if (this.bricks.countActive() === 0) {
        this.scene.events.emit('levelComplete');
}
    }
  }

  /**
   * Clear all bricks from the game
   */
  public clearBricks(): void {
    this.bricks.clear(true, true);
  }
  
  /**
   * Get the current number of active bricks
   */
  public getBrickCount(): number {
    return this.bricks.countActive();
  }
  
  /**
   * Create a brick pattern based on level configuration
   */
  public createBrickPattern(config: {
    level: number,
    theme: string,
    difficulty: number,
    width: number,
    height: number
  }): void {
    // Implementation would depend on your game's design
    // This is a placeholder that can be expanded later
    console.log('Creating brick pattern with config:', config);
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    this.clearBricks();
  }
}

export default BrickManager;