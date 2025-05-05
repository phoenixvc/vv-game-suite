import PaddleController from '@/controllers/paddle/PaddleController';
import { ConcavePaddle } from '@/objects/ConcavePaddle';
import { ConvexPaddle } from '@/objects/ConvexPaddle';
import { Paddle, PaddleOptions } from '@/objects/Paddle';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import { LAYOUT } from '../../constants/GameConstants';
import PaddleVisualEffects from './PaddleVisualEffects';

/**
 * Paddle type enum
 */
export enum PaddleType {
  NORMAL = 'normal',
  CONCAVE = 'concave',
  CONVEX = 'convex'
}

/**
 * Factory class for creating paddles
 */
export class PaddleFactory {
  private scene: BreakoutScene;
  private visualEffects: PaddleVisualEffects;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.visualEffects = new PaddleVisualEffects(scene);
  }
  
  /**
   * Create a paddle at the specified edge
   */
  createPaddle(edge: 'top' | 'bottom' | 'left' | 'right'): Phaser.Physics.Matter.Sprite {
    // Calculate position and dimensions based on edge
    const { x, y, width, height, texture, isVertical } = this.calculatePaddleProperties(edge);
    
    // Determine paddle type based on edge
    // Fix: Explicitly declare the type to avoid TypeScript inference issues
    const paddleType: PaddleType = edge === 'bottom' ? PaddleType.CONCAVE : PaddleType.CONVEX;
    
    try {
      // Create the appropriate paddle type using the enhanced paddle classes
      const orientation = isVertical ? 'vertical' : 'horizontal';
      const paddleOptions: PaddleOptions = {
        scene: this.scene,
        x,
        y,
        width,
        height,
        orientation,
        collisionCategory: this.getCollisionCategory(),
        collidesWith: this.getCollidesWith(),
        texture
      };
      
      let paddle: Paddle;
      
      // Fix: Simplify the switch statement to avoid TypeScript errors
      if (paddleType === PaddleType.CONCAVE) {
        paddle = new ConcavePaddle(paddleOptions);
      } else if (paddleType === PaddleType.CONVEX) {
        paddle = new ConvexPaddle(paddleOptions);
      } else {
        paddle = new Paddle(paddleOptions);
      }
      
      // Store edge information
      paddle.setData('edge', edge);
      paddle.setData('isVertical', isVertical);
      paddle.setData('width', width);
      paddle.setData('height', height);
      
      // Set paddle type data
      paddle.setData('isConcave', paddleType === PaddleType.CONCAVE);
      paddle.setData('isConvex', paddleType === PaddleType.CONVEX);
      paddle.setData('paddleType', paddleType);
      
      // Add visual effects (if not already applied by the specialized paddle classes)
      if (!paddle.getData('visualEffectsApplied')) {
        this.visualEffects.applyPaddleVisualEffects(paddle);
      }
      
      return paddle;
    } catch (error) {
      console.error(`Error creating paddle at edge ${edge}:`, error);
      
      // Fallback to the original method if there's an error
      return this.createFallbackPaddle(edge, x, y, width, height, texture, isVertical);
    }
  }
  
  /**
   * Create a specific type of paddle at a custom position
   */
  createCustomPaddle(
    type: PaddleType, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    orientation: 'horizontal' | 'vertical' = 'horizontal'
  ): Paddle {
    // Common options for all paddle types
    const options: PaddleOptions = {
      scene: this.scene,
      x,
      y,
      width,
      height,
      orientation,
      collisionCategory: this.getCollisionCategory(),
      collidesWith: this.getCollidesWith(),
      texture: orientation === 'horizontal' ? 'paddle' : 'paddle-vertical'
    };
    
    // Create the appropriate paddle type - Fix: Use if/else instead of switch
    let paddle: Paddle;
    
    if (type === PaddleType.CONCAVE) {
      paddle = new ConcavePaddle(options);
    } else if (type === PaddleType.CONVEX) {
      paddle = new ConvexPaddle(options);
    } else {
      paddle = new Paddle(options);
    }
    
    // Set data properties
    paddle.setData('isVertical', orientation === 'vertical');
    paddle.setData('paddleType', type);
    
    return paddle;
  }

  /**
   * Create a fallback paddle when the enhanced paddle creation fails
   */
  private createFallbackPaddle(
    edge: string, 
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    texture: string, 
    isVertical: boolean
  ): Phaser.Physics.Matter.Sprite {
    // Create a fallback sprite without physics as a last resort
    const fallbackPaddle = this.scene.add.sprite(x, y, texture);
    fallbackPaddle.displayWidth = width;
    fallbackPaddle.displayHeight = height;
    
    // Convert to a Matter sprite with minimal configuration
    const paddleSprite = this.scene.matter.add.gameObject(fallbackPaddle, {
      isStatic: true,
      label: `paddle_${edge}_fallback`
    }) as Phaser.Physics.Matter.Sprite;
    
    // Add minimal required data
    paddleSprite.setData('edge', edge);
    paddleSprite.setData('isVertical', isVertical);
    
    return paddleSprite;
  }

  /**
   * Create a controller for the paddle
   */
  createPaddleController(paddle: Phaser.Physics.Matter.Sprite): PaddleController {
    const edge = paddle.getData('edge') as string;
    const isVertical = paddle.getData('isVertical') as boolean;
    
    // Determine orientation based on edge
    const orientation = isVertical ? 'vertical' : 'horizontal';

    // Create controller with correct parameters
    return new PaddleController(
      this.scene, 
      paddle,
      orientation
    );
  }
  
  /**
   * Calculate paddle position and properties based on edge
   */
  private calculatePaddleProperties(edge: 'top' | 'bottom' | 'left' | 'right'): {
    x: number;
    y: number;
    width: number;
    height: number;
    texture: string;
    isVertical: boolean;
  } {
    let x = 0;
    let y = 0;
    let width = LAYOUT.PADDLE.WIDTH;
    let height = LAYOUT.PADDLE.HEIGHT;
    let texture = 'paddle';
    let isVertical = false;
    
    switch (edge) {
      case 'top':
        x = this.scene.scale.width / 2;
        y = 50;
        break;
      case 'bottom':
        x = this.scene.scale.width / 2;
        y = this.scene.scale.height - 50;
        break;
      case 'left':
        x = 50;
        y = this.scene.scale.height / 2;
        width = LAYOUT.PADDLE.HEIGHT;
        height = LAYOUT.PADDLE.WIDTH;
        texture = 'paddle-vertical';
        isVertical = true;
        break;
      case 'right':
        x = this.scene.scale.width - 50;
        y = this.scene.scale.height / 2;
        width = LAYOUT.PADDLE.HEIGHT;
        height = LAYOUT.PADDLE.WIDTH;
        texture = 'paddle-vertical';
        isVertical = true;
        break;
    }
    
    return { x, y, width, height, texture, isVertical };
  }
  
  /**
   * Get the collision category for paddles
   */
  private getCollisionCategory(): number {
    // Try to get from physics manager if available
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager && physicsManager.paddleCategory) {
      return physicsManager.paddleCategory;
    }
    
    // Default value if not available
    return 0x0002;
  }
  
  /**
   * Get the collision categories the paddle should collide with
   */
  private getCollidesWith(): number[] {
    // Try to get from physics manager if available
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager) {
      return [
        physicsManager.ballCategory || 0x0001,
        physicsManager.powerUpCategory || 0x0008,
        physicsManager.wallCategory || 0x0004
      ];
    }
    
    // Default values if not available
    return [0x0001, 0x0004, 0x0008];
  }
}

export default PaddleFactory;