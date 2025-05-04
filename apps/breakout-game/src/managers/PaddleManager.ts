import * as Phaser from 'phaser';
import { LAYOUT } from '../constants/GameConstants';
import PaddleController from './PaddleController';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';

/**
 * Manages the creation and coordination of all paddles in the game
 */
class PaddleManager {
  private scene: BreakoutScene;
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private paddleControllers: Record<string, PaddleController> = {};
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Create all active paddles based on game configuration
   */
  createPaddles(): void {
    // Get active paddles from game registry
    const activePaddles = this.scene.registry.get('activePaddles') || ['bottom'];
    
    // Create active paddles based on game mode
    activePaddles.forEach(edge => {
      if (['top', 'bottom', 'left', 'right'].includes(edge)) {
        const paddle = this.createPaddle(edge as 'top' | 'bottom' | 'left' | 'right');
        this.paddles.push(paddle);
      }
    });
    
    // Listen for events
    this.setupEventListeners();
  }
  
  /**
   * Create a single paddle at the specified edge
   */
  createPaddle(edge: 'top' | 'bottom' | 'left' | 'right'): Phaser.Physics.Matter.Sprite {
    // Calculate position and dimensions based on edge
    const { x, y, width, height, texture, isVertical } = this.calculatePaddleProperties(edge);
    
    // Create paddle with Matter.js physics
    const paddle = this.scene.matter.add.sprite(x, y, texture, undefined, {
      isStatic: true,
      label: `paddle_${edge}`,
      friction: 0,
      restitution: 1
    });
    
    // Set paddle size
    paddle.displayWidth = width;
    paddle.displayHeight = height;
    
    // Set paddle collision category and what it collides with
    const physicsManager = this.scene.getPhysicsManager();
    if (physicsManager) {
      paddle.setCollisionCategory(physicsManager.paddleCategory);
      paddle.setCollidesWith([
        physicsManager.ballCategory, 
        physicsManager.powerUpCategory
      ]);
    }
    
    // Store edge information
    paddle.setData('edge', edge);
    paddle.setData('isVertical', isVertical);
    
    // Create a controller for this paddle
    // Determine orientation based on edge
    const orientation = (edge === 'left' || edge === 'right') ? 'vertical' : 'horizontal';
    
    // Create controller with correct parameters
    const controller = new PaddleController(
      this.scene, 
      edge, 
      orientation // Use orientation instead of speed
    );
    
    controller.setPaddle(paddle);
    this.paddleControllers[edge] = controller;
    
    return paddle;
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
   * Set up event listeners for paddle-related events
   */
  private setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    if (!eventManager) return;
    
    // Listen for power-up events that affect paddles
    eventManager.on('powerUpExpired', this.handlePowerUpExpired, this);
    eventManager.on('paddleSizeChanged', this.handlePaddleSizeChanged, this);
  }
  
  /**
   * Handle power-up expiration
   */
  private handlePowerUpExpired(data: { type: string }): void {
    // Reset paddle properties based on power-up type
    if (data.type === 'expand' || data.type === 'shrink') {
      this.resetPaddleSize();
    } else if (data.type === 'sticky') {
      this.setStickyPaddles(false);
    }
  }
  
  /**
   * Handle paddle size change events
   */
  private handlePaddleSizeChanged(data: { scale: number }): void {
    this.paddles.forEach(paddle => {
      const isVertical = paddle.getData('isVertical');
      if (isVertical) {
        paddle.setScale(1, data.scale);
      } else {
        paddle.setScale(data.scale, 1);
      }
    });
    
    // Emit event for UI updates
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('paddlePropertiesChanged', {
        size: data.scale,
        sticky: this.isPaddleSticky()
      });
    }
  }
  
  /**
   * Reset all paddles to normal size
   */
  resetPaddleSize(): void {
    this.paddles.forEach(paddle => {
      paddle.setScale(1, 1);
    });
    
    // Emit event for UI updates
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('paddlePropertiesChanged', {
        size: 1,
        sticky: this.isPaddleSticky()
      });
    }
  }

  /**
   * Set sticky property on all paddles
   */
  setStickyPaddles(isSticky: boolean): void {
    this.paddles.forEach(paddle => {
      paddle.setData('sticky', isSticky);
    });
    
    // Emit event for UI updates
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('paddlePropertiesChanged', {
        size: this.getPaddleScale(),
        sticky: isSticky
      });
    }
  }
  
  /**
   * Check if any paddle is sticky
   */
  isPaddleSticky(): boolean {
    return this.paddles.some(paddle => paddle.getData('sticky') === true);
  }
  
  /**
   * Get the current paddle scale (size)
   */
  getPaddleScale(): number {
    if (this.paddles.length === 0) return 1;
    
    // Get scale from first paddle
    const paddle = this.paddles[0];
    const isVertical = paddle.getData('isVertical');
    return isVertical ? paddle.scaleY : paddle.scaleX;
  }
  
  /**
   * Get all active paddles
   */
  getPaddles(): Phaser.Physics.Matter.Sprite[] {
    return this.paddles;
  }
  
  /**
   * Get a specific paddle by edge
   */
  getPaddleByEdge(edge: string): Phaser.Physics.Matter.Sprite | undefined {
    return this.paddles.find(paddle => paddle.getData('edge') === edge);
  }
  
  /**
   * Update method called every frame
   */
  update(): void {
    // Update all paddle controllers
    Object.values(this.paddleControllers).forEach(controller => {
      controller.update();
    });
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('powerUpExpired', this.handlePowerUpExpired, this);
      eventManager.off('paddleSizeChanged', this.handlePaddleSizeChanged, this);
    }
    
    // Clean up paddle controllers
    Object.values(this.paddleControllers).forEach(controller => {
      if (controller && typeof controller.cleanup === 'function') {
        controller.cleanup();
      }
    });
  }
}

export default PaddleManager;