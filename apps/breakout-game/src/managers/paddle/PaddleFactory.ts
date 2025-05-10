import { AIPaddleController, KeyboardPaddleController, MousePaddleController } from '@/controllers/paddle';
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
 * Controller type enum
 */
export enum ControllerType {
  KEYBOARD = 'keyboard',
  MOUSE = 'mouse',
  TOUCH = 'touch',
  AI = 'ai'
}

/**
 * Factory class for creating paddles and their controllers
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
  
  // Determine paddle type based on edge - bottom paddle should be concave
  const paddleType: PaddleType = edge === 'bottom' ? PaddleType.CONCAVE : PaddleType.CONVEX;
  
  console.log(`Creating ${paddleType} paddle at edge ${edge} at position (${x}, ${y})`);
  
  try {
    // Create the appropriate paddle type using the enhanced paddle classes
    const orientation = isVertical ? 'vertical' : 'horizontal';
    
    // Use createCustomPaddle instead of direct creation
    const paddle = this.createCustomPaddle(
      paddleType,
      x,
      y,
      width,
      height,
      orientation
    );
    
    // Store edge information
    paddle.setData('edge', edge);
    paddle.setData('isVertical', isVertical);
    paddle.setData('width', width);
    paddle.setData('height', height);
    
    // Set paddle type data
    paddle.setData('isConcave', paddleType === PaddleType.CONCAVE);
    paddle.setData('isConvex', paddleType === PaddleType.CONVEX);
    paddle.setData('paddleType', paddleType);
    
    // Use our own physics shape creation method directly
    this.createPaddlePhysicsShape(paddle, paddleType === PaddleType.CONCAVE);
    
    // Apply visual effects to make the paddle actually look concave/convex
    this.applyPaddleVisualShape(paddle, paddleType);
    
    return paddle;
  } catch (error) {
    console.error(`Error creating paddle at edge ${edge}:`, error);
    
    // Fallback to the original method if there's an error
    return this.createFallbackPaddle(edge, x, y, width, height, texture, isVertical);
  }
}

/**
 * Apply visual effects to make the paddle look concave or convex
 */
private applyPaddleVisualShape(paddle: Phaser.Physics.Matter.Sprite, paddleType: PaddleType): void {
  try {
    // Get paddle dimensions
    const width = paddle.displayWidth;
    const height = paddle.displayHeight;
    const isVertical = paddle.getData('isVertical');
    
    // Clear any existing graphics
    if (paddle.getData('shapeGraphics')) {
      const oldGraphics = paddle.getData('shapeGraphics');
      if (oldGraphics && oldGraphics.destroy) {
        oldGraphics.destroy();
      }
    }
    
    // Create a graphics object for the custom shape
    const graphics = this.scene.add.graphics();
    
    // Set fill style based on paddle's tint
    const tint = paddle.tintTopLeft || 0x0099ff;
    graphics.fillStyle(tint, 1);
    
    // Draw the appropriate shape
    if (paddleType === PaddleType.CONCAVE) {
      // Concave shape (curved inward)
      if (isVertical) {
        // Vertical concave paddle
        graphics.beginPath();
        
        // Start at top-left
        graphics.moveTo(-width/2, -height/2);
        
        // Draw the left edge
        graphics.lineTo(-width/2, height/2);
        
        // Draw the bottom edge
        graphics.lineTo(width/2, height/2);
        
        // Draw the right edge
        graphics.lineTo(width/2, -height/2);
        
        // Draw the concave curve on top
        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          const x = width * (t - 0.5);
          const y = -height/2 - Math.sin(t * Math.PI) * (height * 0.15);
          graphics.lineTo(x, y);
        }
        
        graphics.closePath();
        graphics.fillPath();
        
      } else {
        // Horizontal concave paddle
        graphics.beginPath();
        
        // Start at top-left
        graphics.moveTo(-width/2, -height/2);
        
        // Draw the top edge
        graphics.lineTo(width/2, -height/2);
        
        // Draw the right edge
        graphics.lineTo(width/2, height/2);
        
        // Draw the bottom edge
        graphics.lineTo(-width/2, height/2);
        
        // Draw the concave curve on top
        for (let i = 10; i >= 0; i--) {
          const t = i / 10;
          const x = width * (t - 0.5);
          const y = -height/2 - Math.sin(t * Math.PI) * (height * 0.15);
          graphics.lineTo(x, y);
        }
        
        graphics.closePath();
        graphics.fillPath();
      }
    } else {
      // Convex shape (curved outward)
      if (isVertical) {
        // Vertical convex paddle
        graphics.beginPath();
        
        // Start at bottom-left
        graphics.moveTo(-width/2, height/2);
        
        // Draw the bottom edge
        graphics.lineTo(width/2, height/2);
        
        // Draw the right edge with a curve
        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          const y = height * (t - 0.5);
          const x = width/2 + Math.sin(t * Math.PI) * (width * 0.15);
          graphics.lineTo(x, y);
        }
        
        // Draw the left edge with a curve
        for (let i = 10; i >= 0; i--) {
          const t = i / 10;
          const y = height * (t - 0.5);
          const x = -width/2 - Math.sin(t * Math.PI) * (width * 0.15);
          graphics.lineTo(x, y);
        }
        
        graphics.closePath();
        graphics.fillPath();
        
      } else {
        // Horizontal convex paddle
        graphics.beginPath();
        
        // Start at top-left
        graphics.moveTo(-width/2, -height/2);
        
        // Draw the top edge
        graphics.lineTo(width/2, -height/2);
        
        // Draw the right edge
        graphics.lineTo(width/2, height/2);
        
        // Draw the bottom edge with a curve
        for (let i = 0; i <= 10; i++) {
          const t = i / 10;
          const x = width * (0.5 - t);
          const y = height/2 + Math.sin(t * Math.PI) * (height * 0.15);
          graphics.lineTo(x, y);
        }
        
        graphics.closePath();
        graphics.fillPath();
      }
    }
    
    // Store the graphics object with the paddle
    paddle.setData('shapeGraphics', graphics);
    
    // Make the paddle sprite itself transparent
    paddle.setAlpha(0);
    
    // Position the graphics at the paddle's position
    graphics.x = paddle.x;
    graphics.y = paddle.y;
    
    // Update the graphics position when the paddle moves
    this.scene.events.on('update', () => {
      if (graphics && graphics.active && paddle && paddle.active) {
        graphics.x = paddle.x;
        graphics.y = paddle.y;
      }
    });
    
    console.log(`Applied ${paddleType} visual shape to paddle`);
    
  } catch (error) {
    console.error('Error applying paddle visual shape:', error);
    // If the visual shape fails, make sure the paddle is still visible
    paddle.setAlpha(1);
  }
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
  // Get game dimensions
  const gameWidth = this.scene.scale.width;
  const gameHeight = this.scene.scale.height;
  
  // Use constants for paddle dimensions
  let width = LAYOUT.PADDLE.WIDTH;
  let height = LAYOUT.PADDLE.HEIGHT;
  let texture = 'paddle';
  let isVertical = false;
  
  // Calculate center position - ensure paddle is centered horizontally
  const centerX = gameWidth / 2;
  
  // Calculate positions based on edge
  let x = centerX; // Default to center for horizontal paddles
  let y = 0;
  
  switch (edge) {
    case 'top':
      x = centerX;
      y = 50; // Distance from top
      break;
    case 'bottom':
      x = centerX; // Ensure it's centered horizontally
      y = gameHeight - height/2 - 20; // Position from bottom with padding
      break;
    case 'left':
      x = 50; // Distance from left
      y = gameHeight / 2;
      width = LAYOUT.PADDLE.HEIGHT; // Swap dimensions for vertical paddle
      height = LAYOUT.PADDLE.WIDTH;
      texture = 'paddle-vertical';
      isVertical = true;
      break;
    case 'right':
      x = gameWidth - 50; // Distance from right
      y = gameHeight / 2;
      width = LAYOUT.PADDLE.HEIGHT; // Swap dimensions for vertical paddle
      height = LAYOUT.PADDLE.WIDTH;
      texture = 'paddle-vertical';
      isVertical = true;
      break;
  }
  
  console.log(`Paddle properties for ${edge}: position (${x}, ${y}), size ${width}x${height}`);
  
  return { x, y, width, height, texture, isVertical };
}

/**
 * Create a proper concave or convex paddle shape
 * Consolidated from PaddleManager
 */
createPaddlePhysicsShape(paddle: Phaser.Physics.Matter.Sprite, isConcave: boolean): void {
  try {
    // Enable debug visualization to see the physics body
    this.scene.registry.set('debugPhysics', true);
    
    // Get paddle dimensions
    const width = paddle.displayWidth;
    const height = paddle.displayHeight;
    const isVertical = paddle.getData('isVertical');
    
    // Get the label from the body before removing it
    const bodyLabel = (paddle.body as any).label;
    
    // Remove existing physics body
    this.scene.matter.world.remove(paddle.body);
    
    let paddleBody;
    
    if (isConcave) {
      // Create a concave paddle (curved inward)
      if (isVertical) {
        // Vertical concave paddle
        const parts = [];
        const segments = 5; // Number of segments to create the curve
        const segmentWidth = width;
        const segmentHeight = height / segments;
        const curveFactor = width * 0.3; // How much the curve bends inward
        
        for (let i = 0; i < segments; i++) {
          // Calculate the x-offset for this segment (creates the curve)
          const progress = i / (segments - 1);
          const curveAmount = Math.sin(progress * Math.PI) * curveFactor;
          
          // Create a rectangle segment with appropriate position
          // Position is relative to the paddle's center (0,0)
          const segment = this.scene.matter.bodies.rectangle(
            curveAmount, // X offset creates the curve
            (i - (segments-1)/2) * segmentHeight, // Centered Y position
            segmentWidth * 0.8, // Slightly narrower segments
            segmentHeight * 0.9, // Slightly shorter segments with gap
            { label: 'paddle_segment' }
          );
          
          parts.push(segment);
        }
        
        // Combine all segments into a compound body
        paddleBody = this.scene.matter.body.create({
          parts: parts,
          isStatic: true,
          label: bodyLabel // Use the saved label
        });
        
      } else {
        // Horizontal concave paddle
        const parts = [];
        const segments = 5; // Number of segments to create the curve
        const segmentWidth = width / segments;
        const segmentHeight = height;
        const curveFactor = height * 0.3; // How much the curve bends inward
        
        for (let i = 0; i < segments; i++) {
          // Calculate the y-offset for this segment (creates the curve)
          const progress = i / (segments - 1);
          const curveAmount = Math.sin(progress * Math.PI) * curveFactor;
          
          // Create a rectangle segment with appropriate position
          // Position is relative to the paddle's center (0,0)
          const segment = this.scene.matter.bodies.rectangle(
            (i - (segments-1)/2) * segmentWidth, // Centered X position
            curveAmount, // Y offset creates the curve
            segmentWidth * 0.9, // Slightly narrower segments with gap
            segmentHeight * 0.8, // Slightly shorter segments
            { label: 'paddle_segment' }
          );
          
          parts.push(segment);
        }
        
        // Combine all segments into a compound body
        paddleBody = this.scene.matter.body.create({
          parts: parts,
          isStatic: true,
          label: bodyLabel // Use the saved label
        });
      }
      
    } else {
      // Create a convex paddle (curved outward)
      if (isVertical) {
        // Vertical convex paddle
        const parts = [];
        const segments = 5; // Number of segments to create the curve
        const segmentWidth = width;
        const segmentHeight = height / segments;
        const curveFactor = width * 0.3; // How much the curve bends outward
        
        for (let i = 0; i < segments; i++) {
          // Calculate the x-offset for this segment (creates the curve)
          const progress = i / (segments - 1);
          const curveAmount = -Math.sin(progress * Math.PI) * curveFactor;
          
          // Create a rectangle segment with appropriate position
          // Position is relative to the paddle's center (0,0)
          const segment = this.scene.matter.bodies.rectangle(
            curveAmount, // X offset creates the curve
            (i - (segments-1)/2) * segmentHeight, // Centered Y position
            segmentWidth * 0.8, // Slightly narrower segments
            segmentHeight * 0.9, // Slightly shorter segments with gap
            { label: 'paddle_segment' }
          );
          
          parts.push(segment);
        }
        
        // Combine all segments into a compound body
        paddleBody = this.scene.matter.body.create({
          parts: parts,
          isStatic: true,
          label: bodyLabel // Use the saved label
        });
        
      } else {
        // Horizontal convex paddle
        const parts = [];
        const segments = 5; // Number of segments to create the curve
        const segmentWidth = width / segments;
        const segmentHeight = height;
        const curveFactor = height * 0.3; // How much the curve bends outward
        
        for (let i = 0; i < segments; i++) {
          // Calculate the y-offset for this segment (creates the curve)
          const progress = i / (segments - 1);
          const curveAmount = -Math.sin(progress * Math.PI) * curveFactor;
          
          // Create a rectangle segment with appropriate position
          // Position is relative to the paddle's center (0,0)
          const segment = this.scene.matter.bodies.rectangle(
            (i - (segments-1)/2) * segmentWidth, // Centered X position
            curveAmount, // Y offset creates the curve
            segmentWidth * 0.9, // Slightly narrower segments with gap
            segmentHeight * 0.8, // Slightly shorter segments
            { label: 'paddle_segment' }
          );
          
          parts.push(segment);
        }
        
        // Combine all segments into a compound body
        paddleBody = this.scene.matter.body.create({
          parts: parts,
          isStatic: true,
          label: bodyLabel // Use the saved label
        });
      }
    }
    
    // Set the new body on the paddle
    paddle.setExistingBody(paddleBody);
    
    // Set the paddle position
    paddle.setPosition(paddle.x, paddle.y);
    
    // Add debug visualization if in debug mode
    if (this.scene.registry.get('debugPhysics')) {
      // Add a debug outline to visualize the physics body
      this.addDebugOutline(paddle);
    }
    
    // Set physics properties
    paddle.setFriction(0.01);
    paddle.setBounce(1.1);
    
    // Set collision categories if physics manager is available
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager) {
      paddle.setCollisionCategory(physicsManager.paddleCategory);
      paddle.setCollidesWith([
        physicsManager.ballCategory,
        physicsManager.powerUpCategory
      ]);
    }
    
    // Store shape information
    paddle.setData('isConcave', isConcave);
    paddle.setData('isConvex', !isConcave);
    
    console.log(`Created ${isConcave ? 'concave' : 'convex'} paddle physics shape`);
    
  } catch (error) {
    console.error('Error creating paddle physics shape:', error);
    // Error handling can be done by the caller
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
  ): Phaser.Physics.Matter.Sprite {
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
    
    // Create the appropriate paddle type - Fix: Use type assertion to fix incompatibility
    let paddle: Phaser.Physics.Matter.Sprite;
    
    if (type === PaddleType.CONCAVE) {
      paddle = new ConcavePaddle(options) as unknown as Phaser.Physics.Matter.Sprite;
    } else if (type === PaddleType.CONVEX) {
      paddle = new ConvexPaddle(options) as unknown as Phaser.Physics.Matter.Sprite;
    } else {
      paddle = new Paddle(options) as unknown as Phaser.Physics.Matter.Sprite;
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
   * Create a controller for the paddle based on the game configuration
   * Enhanced to directly create specific controller types
   */
  createPaddleController(
    paddle: Phaser.Physics.Matter.Sprite, 
    controllerType?: ControllerType,
    options?: { difficulty?: number }
  ): PaddleController {
    const edge = paddle.getData('edge') as string;
    const isVertical = paddle.getData('isVertical') as boolean;
    const orientation = isVertical ? 'vertical' : 'horizontal';
    
    // Determine controller type if not specified
    if (!controllerType) {
      // Get default controller type based on edge and game settings
      controllerType = this.determineControllerType(edge);
    }
    
    // Create the appropriate controller based on type
    switch (controllerType) {
      case ControllerType.MOUSE:
      case ControllerType.TOUCH:
        return new PaddleController(
          this.scene, 
          paddle,
          { controlType: 'mouse' }
        );
      
      case ControllerType.AI:
        return new PaddleController(
          this.scene,
          paddle,
          { 
            controlType: 'ai',
            difficulty: options?.difficulty !== undefined ? options.difficulty : 0.5
          }
        );
      
      case ControllerType.KEYBOARD:
      default:
        return new PaddleController(
          this.scene,
          paddle,
          { controlType: 'keyboard' }
        );
    }
  }
  
  /**
   * Create a specific controller type directly
   * This provides more direct access to controller creation
   */
  createSpecificController(
    paddle: Phaser.Physics.Matter.Sprite,
    controllerType: ControllerType,
    options?: { difficulty?: number }
  ) {
    const isVertical = paddle.getData('isVertical') as boolean;
    const orientation = isVertical ? 'vertical' : 'horizontal';
    const paddleId = paddle.getData('edge') || 'default';
    
    switch (controllerType) {
      case ControllerType.MOUSE:
      case ControllerType.TOUCH:
        return new MousePaddleController(this.scene, paddle, orientation);
      
      case ControllerType.AI:
        return new AIPaddleController(
          this.scene, 
          paddle, 
          orientation, 
          options?.difficulty !== undefined ? options.difficulty : 0.5
        );
      
      case ControllerType.KEYBOARD:
      default:
        return new KeyboardPaddleController(this.scene, paddle, orientation, paddleId as string);
    }
  }
  
  /**
   * Determine the appropriate controller type based on edge and game settings
   */
  private determineControllerType(edge: string): ControllerType {
    // Get game settings
    const gameSettings = this.scene.registry.get('gameSettings') || {};
    const controlType = gameSettings.controlType || 'keyboard';
    const aiOpponents = gameSettings.aiOpponents || false;
    
    // Bottom paddle is usually player-controlled
    if (edge === 'bottom') {
      return controlType === 'mouse' ? ControllerType.MOUSE : ControllerType.KEYBOARD;
    }
    
    // Other paddles are AI by default, unless multiplayer is enabled
    if (aiOpponents || edge !== 'top') {
      return ControllerType.AI;
    }
    
    // Top paddle in 2-player mode uses keyboard
    return ControllerType.KEYBOARD;
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

  /**
   * Create a paddle with the specified properties
   * Consolidated from PaddleManager
   */
  createPaddleWithProperties(
    x: number, 
    y: number, 
    width: number, 
    height: number, 
    options: { 
      texture?: string, 
      isVertical?: boolean, 
      isConcave?: boolean,
      id?: string
    } = {}
  ): Phaser.Physics.Matter.Sprite {
    try {
      // Set default options
      const texture = options.texture || 'paddle';
      const isVertical = options.isVertical || false;
      const isConcave = options.isConcave || false;
      const id = options.id || `paddle_${Date.now()}`;

      // Determine paddle type based on options
      const paddleType = isConcave ? PaddleType.CONCAVE : PaddleType.CONVEX;
      const orientation = isVertical ? 'vertical' : 'horizontal';

      // Create the paddle using the appropriate method
      const paddle = this.createCustomPaddle(
        paddleType,
        x,
        y,
        width,
        height,
        orientation
      );

      // Store additional data
      paddle.setData('id', id);

      return paddle;
    } catch (error) {
      console.error('Error creating paddle with properties:', error);
      
      // Create a fallback paddle in case of error
      return this.createFallbackPaddle(
        'custom',
        x, 
        y, 
        width, 
        height, 
        options.texture || 'paddle',
        options.isVertical || false
      );
    }
  }

/**
 * Add debug outline to visualize the physics body
 * This helps debug hitbox alignment issues
 */
private addDebugOutline(paddle: Phaser.Physics.Matter.Sprite): void {
  try {
    // Create a graphics object for debug visualization
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(2, 0xff0000, 1);
    
    // Store the graphics object with the paddle for cleanup
    paddle.setData('debugGraphics', graphics);
    
    // Update the debug graphics in the scene's update loop
    this.scene.events.on('update', () => {
      if (!paddle.active || !graphics.active) return;
      
      graphics.clear();
      graphics.lineStyle(2, 0xff0000, 1);
      
      // Draw outline around the paddle's visual bounds
      graphics.strokeRect(
        paddle.x - paddle.displayWidth / 2,
        paddle.y - paddle.displayHeight / 2,
        paddle.displayWidth,
        paddle.displayHeight
      );
      
      // Draw the physics body if available
      const body = paddle.body as MatterJS.BodyType;
      if (body && body.parts) {
        graphics.lineStyle(2, 0x00ff00, 1);
        
        // Draw each part of the compound body
        for (let i = 1; i < body.parts.length; i++) {
          const part = body.parts[i];
          const vertices = part.vertices;
          
          // Start drawing from the last vertex to the first
          graphics.beginPath();
          graphics.moveTo(vertices[vertices.length - 1].x, vertices[vertices.length - 1].y);
          
          // Draw lines to each vertex
          for (let j = 0; j < vertices.length; j++) {
            graphics.lineTo(vertices[j].x, vertices[j].y);
          }
          
          graphics.closePath();
          graphics.strokePath();
        }
      }
    });
  } catch (error) {
    console.error('Error adding debug outline:', error);
  }
}
  
  /**
   * Change the controller type for a paddle
   * Moved from PaddleController to Factory
   */
  changeControllerType(
    controller: PaddleController,
    controlType: ControllerType,
    options?: { difficulty?: number }
  ): PaddleController {
    const paddle = controller.getPaddle();
    if (!paddle) {
      console.error('Cannot change controller type: no paddle assigned');
      return controller;
    }
    
    // Clean up the old controller
    controller.cleanup();
    
    // Create a new controller with the specified type
    return this.createPaddleController(paddle, controlType, options);
  }
}

export default PaddleFactory;