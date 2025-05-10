import PaddleController from '@/controllers/paddle';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import PaddleFactory, { ControllerType } from './PaddleFactory';
import PaddlePhysics from './PaddlePhysics';

export class PaddleManager {
  private scene: BreakoutScene;
  private paddles: Phaser.Physics.Matter.Sprite[] = [];
  private paddleControllers: Record<string, PaddleController> = {};
  private paddleFactory: PaddleFactory | null = null;
  public paddlePhysics: PaddlePhysics | null = null;
  private physicsManager: any = null;
  private errorManager: any = null;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Try to get physics manager
    this.physicsManager = 'getPhysicsManager' in this.scene && 
      typeof this.scene.getPhysicsManager === 'function' ? 
      this.scene.getPhysicsManager() : null;
      
    // Try to get error manager
    this.errorManager = 'getErrorManager' in this.scene && 
      typeof this.scene.getErrorManager === 'function' ? 
      this.scene.getErrorManager() : null;
      
    // Create paddle factory
    this.paddleFactory = new PaddleFactory(this.scene);
    
    // Create paddle physics handler
    this.paddlePhysics = new PaddlePhysics(this.scene);
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Register this manager with the scene directly without calling getPaddleManager
    // to avoid infinite recursion
    (this.scene as any).paddleManager = this;
    console.log('PaddleManager registered with scene directly');
  }
  
  /**
   * Ensure the paddle manager is registered with the scene
   * This method is now separate from the constructor to avoid infinite recursion
   */
  public ensureRegisteredWithScene(): void {
    // Skip this check since we already register in the constructor
    console.log('PaddleManager already registered with scene');
  }

  public createPaddles(): Phaser.Physics.Matter.Sprite[] {
    console.log('Creating paddles from PaddleManager...');
    
    // Check if paddles have already been created (using registry flag)
    if (this.scene.registry.get('paddlesCreated')) {
      console.log('Paddles already created according to registry, skipping creation');
      // Even if we skip creation, check the positions to make sure they're valid
      this.checkAndFixPaddlePositions();
      return this.paddles;
    }
    
    try {
      // Set active paddles in registry - ONLY include 'bottom' for now
      const activePaddles = ['bottom']; // Changed from ['bottom', 'top']
      this.scene.registry.set('activePaddles', activePaddles);
      
      // Clear any existing paddles first
      if (this.paddles && this.paddles.length > 0) {
        console.log(`Clearing ${this.paddles.length} existing paddles`);
        // Remove them from the scene if possible
        this.paddles.forEach(paddle => {
          if (paddle && paddle.scene) {
            paddle.destroy();
          }
        });
        // Reset the paddles array
        this.paddles = [];
      }
      
      // Create new paddles based on active edges
      const newPaddles: Phaser.Physics.Matter.Sprite[] = [];
      
      // Get active edges from registry
      const activeEdges = this.scene.registry.get('activePaddles') || ['bottom'];
      console.log(`Active edges for paddle creation: ${JSON.stringify(activeEdges)}`);
      
      // Check if paddleFactory exists
      if (!this.paddleFactory) {
        console.error('PaddleFactory is null, creating emergency fallback paddle');
        this.createEmergencyPaddle();
        
        // Mark paddles as created to avoid infinite loops
        this.scene.registry.set('paddlesCreated', true);
        return this.paddles;
      }
      
      // Create a paddle for each active edge
      for (const edge of activeEdges) {
        try {
          console.log(`Creating paddle for edge: ${edge}`);
          
          // Use try-catch for each step to isolate failures
          try {
            // Create the paddle using the factory directly
            const paddle = this.paddleFactory.createPaddle(edge);
            console.log(`Paddle created for edge ${edge}:`, {
              x: paddle.x,
              y: paddle.y,
              width: paddle.displayWidth,
              height: paddle.displayHeight,
              visible: paddle.visible,
              active: paddle.active
            });
            
            // Create controller for the paddle
            const controllerType = this.determineControllerType(edge);
            console.log(`Using controller type for ${edge}: ${controllerType}`);
            const controller = this.createControllerForPaddle(paddle, controllerType);
            
            if (controller) {
              console.log(`Controller created for paddle at edge ${edge}`);
            } else {
              console.error(`Failed to create controller for paddle at edge ${edge}`);
            }
            
            // Add to paddles array
            this.paddles.push(paddle);
            newPaddles.push(paddle);
            
            // Make sure the paddle is visible
            paddle.setVisible(true);
            paddle.setAlpha(1);
            
            console.log(`Paddle for edge ${edge} successfully created and added`);
          } catch (innerError) {
            console.error(`Error in paddle creation process for edge ${edge}:`, innerError);
            
            // Try the fallback method if the factory method failed
            try {
              console.log(`Attempting fallback paddle creation for edge ${edge}`);
              
              // Create a basic paddle based on the edge
              const props = this.calculatePaddleProperties(edge as any);
              
              // Create the paddle directly
              const paddle = this.createPaddle(
                props.x, props.y, props.width, props.height,
                {
                  texture: props.texture,
                  isVertical: props.isVertical,
                  isConcave: edge === 'bottom',
                  id: edge
                }
              );
              
              // Set edge data
              paddle.setData('edge', edge);
              
              // Create a controller
              const controllerType = this.determineControllerType(edge);
              this.createControllerForPaddle(paddle, controllerType);
              
              // Add to arrays
              this.paddles.push(paddle);
              newPaddles.push(paddle);
              
              console.log(`Fallback paddle created for edge ${edge}`);
            } catch (fallbackError) {
              console.error(`Failed to create fallback paddle for edge ${edge}:`, fallbackError);
            }
          }
        } catch (error) {
          console.error(`Error creating paddle for edge ${edge}:`, error);
          if (this.errorManager) {
            this.errorManager.logError(`Failed to create paddle for edge ${edge}`, error instanceof Error ? error.stack : undefined);
          }
        }
      }
      
      // Mark paddles as created in registry
      this.scene.registry.set('paddlesCreated', true);
      
      // Debug log paddle properties
      console.log(`Created ${this.paddles.length} paddles in total`);
      this.paddles.forEach((paddle, index) => {
        console.log(`Paddle ${index}:`, {
          edge: paddle.getData('edge'),
          isConcave: paddle.getData('isConcave'),
          isConvex: paddle.getData('isConvex'),
          position: { x: paddle.x, y: paddle.y },
          visible: paddle.visible,
          active: paddle.active
        });
      });
      
      // Check and fix paddle positions if needed
      this.checkAndFixPaddlePositions();
      
      return this.paddles;
    } catch (error) {
      console.error('Error in createPaddles:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create paddles', error instanceof Error ? error.stack : undefined);
      }
      
      // If we failed to create paddles, try the emergency paddle
      if (this.paddles.length === 0) {
        this.createEmergencyPaddle();
      }
      
      return this.paddles;
    }
  }
/**
 * Debug method to check and fix paddle positions if they're outside the visible area
 */
public checkAndFixPaddlePositions(): void {
  try {
    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;
    
    console.log(`Game dimensions: ${gameWidth}x${gameHeight}`);
    console.log(`Current paddle count: ${this.paddles.length}`);
    
    this.paddles.forEach((paddle, index) => {
      const edge = paddle.getData('edge') || 'unknown';
      const oldX = paddle.x;
      const oldY = paddle.y;
      
      // Check if paddle is outside visible area
      let needsRepositioning = false;
      let newX = oldX;
      let newY = oldY;
      
      // Check horizontal bounds
      if (paddle.x < paddle.displayWidth / 2) {
        newX = paddle.displayWidth / 2;
        needsRepositioning = true;
      } else if (paddle.x > gameWidth - paddle.displayWidth / 2) {
        newX = gameWidth - paddle.displayWidth / 2;
        needsRepositioning = true;
      }
      
      // Check vertical bounds - ensure the paddle is fully visible
      if (paddle.y < paddle.displayHeight / 2) {
        newY = paddle.displayHeight / 2 + 10; // Add some padding
        needsRepositioning = true;
      } else if (paddle.y > gameHeight - paddle.displayHeight / 2) {
        newY = gameHeight - paddle.displayHeight / 2 - 10; // Add some padding
        needsRepositioning = true;
      }
      
      // Special case for bottom paddle - ensure it's properly positioned
      if (edge === 'bottom') {
        const idealY = gameHeight - paddle.displayHeight / 2 - 20; // 20px from bottom edge
        if (Math.abs(paddle.y - idealY) > 30) { // If it's significantly off
          newY = idealY;
          needsRepositioning = true;
          console.log(`Fixing bottom paddle position to ideal Y: ${idealY}`);
        }
      }
      
      // Reposition if needed
      if (needsRepositioning) {
        console.log(`Fixing paddle ${index} (${edge}) position from (${oldX}, ${oldY}) to (${newX}, ${newY})`);
        
        // For Matter.js physics, we need to use the Matter.Body.setPosition method
        if (paddle.body && this.scene.matter) {
          // First update the sprite position
          paddle.setPosition(newX, newY);
          
          // Then update the physics body position using Matter.js methods
          this.scene.matter.body.setPosition(paddle.body as MatterJS.BodyType, {
            x: newX,
            y: newY
          });
          
          console.log(`Updated paddle body position to (${newX}, ${newY})`);
        } else {
          // If no physics body, just update the sprite
          paddle.setPosition(newX, newY);
        }
      } else {
        console.log(`Paddle ${index} (${edge}) position is OK: (${oldX}, ${oldY})`);
      }
      
      // Make sure paddle is visible
      paddle.setVisible(true);
      paddle.setAlpha(1);
      
      // Ensure the paddle is properly registered with the scene
      if (edge === 'bottom') {
        this.scene.registry.set('bottomPaddleExists', true);
      }
    });
    
    // If we have no paddles, create an emergency one
    if (this.paddles.length === 0) {
      console.warn('No paddles found! Creating emergency paddle');
      this.createEmergencyPaddle();
    }
  } catch (error) {
    console.error('Error checking paddle positions:', error);
  }
}

/**
 * Get the correct position for attaching a ball to a paddle
 * This helps ensure the ball is positioned correctly on the paddle
 */
public getBallAttachPosition(paddleEdge: string = 'bottom'): { x: number, y: number } {
  // Find the paddle for the specified edge
  const paddle = this.getPaddleByEdge(paddleEdge);
  
  if (!paddle) {
    console.error(`No paddle found for edge ${paddleEdge}`);
    // Return center of screen as fallback
    return { 
      x: this.scene.scale.width / 2, 
      y: this.scene.scale.height / 2 
    };
  }
  
  // Get paddle properties
  const isVertical = paddle.getData('isVertical');
  const paddleX = paddle.x;
  const paddleY = paddle.y;
  const paddleWidth = paddle.displayWidth;
  const paddleHeight = paddle.displayHeight;
  
  // Calculate ball position based on paddle edge
  let ballX = paddleX;
  let ballY = paddleY;
  
  switch (paddleEdge) {
    case 'bottom':
      // Position ball on top of bottom paddle
      ballY = paddleY - (paddleHeight / 2) - 10; // 10px above paddle
      break;
    case 'top':
      // Position ball below top paddle
      ballY = paddleY + (paddleHeight / 2) + 10; // 10px below paddle
      break;
    case 'left':
      // Position ball to the right of left paddle
      ballX = paddleX + (paddleWidth / 2) + 10; // 10px right of paddle
      break;
    case 'right':
      // Position ball to the left of right paddle
      ballX = paddleX - (paddleWidth / 2) - 10; // 10px left of paddle
      break;
  }
  
  console.log(`Ball attach position for ${paddleEdge} paddle: (${ballX}, ${ballY})`);
  
  return { x: ballX, y: ballY };
}

/**
 * Create an emergency paddle if none exist
 */
private createEmergencyPaddle(): void {
  try {
    const gameWidth = this.scene.scale.width;
    const gameHeight = this.scene.scale.height;
    
    // Create a basic paddle at the bottom
    const paddle = this.createPaddle(
      gameWidth / 2,  // x position (center)
      gameHeight - 50, // y position (near bottom)
      100,  // width
      20,   // height
      { 
        texture: 'paddle',
        isVertical: false,
        isConcave: true,
        id: 'bottom'
      }
    );
    
    // Set edge data
    paddle.setData('edge', 'bottom');
    
    // Create a basic keyboard controller
    this.createControllerForPaddle(paddle, ControllerType.KEYBOARD);
    
    // Register the paddle
    this.scene.registry.set('bottomPaddleExists', true);
    this.scene.registry.set('paddlesCreated', true);
    
    console.log('Emergency paddle created at position:', paddle.x, paddle.y);
  } catch (error) {
    console.error('Failed to create emergency paddle:', error);
  }
}

/**
 * Fix any issues with paddle positions and visibility
 * This can be called from other managers if they detect problems
 */
public fixPaddlePositions(): void {
  console.log('Fixing paddle positions...');
  this.checkAndFixPaddlePositions();
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
 * Create a controller for a paddle
 */
public createControllerForPaddle(
  paddle: Phaser.Physics.Matter.Sprite, 
  controllerType: ControllerType | string,
  options?: { difficulty?: number }
): PaddleController | null {
  try {
    // Convert string to enum if needed
    let controlType: ControllerType;
    if (typeof controllerType === 'string') {
      switch (controllerType.toLowerCase()) {
        case 'mouse':
        case 'touch':
          controlType = ControllerType.MOUSE;
          break;
        case 'ai':
          controlType = ControllerType.AI;
          break;
        case 'keyboard':
        default:
          controlType = ControllerType.KEYBOARD;
          break;
      }
    } else {
      controlType = controllerType;
    }
    
    // Create controller using the factory
    if (this.paddleFactory) {
      const controller = this.paddleFactory.createPaddleController(
        paddle,
        controlType,
        options
      );
      
      // Store the controller
      const paddleId = paddle.getData('id') || paddle.getData('edge') || 'default';
      // Fix: Use paddleControllers instead of controllers
      this.paddleControllers[paddleId] = controller;
      
      return controller;
    }
    
    return null;
  } catch (error) {
    console.error('Error creating paddle controller:', error);
    return null;
  }
}

/**
 * Set up event listeners for paddle-related events
 */
private setupEventListeners(): void {
  try {
    const eventManager = 'getEventManager' in this.scene && 
      typeof this.scene.getEventManager === 'function' ? 
      this.scene.getEventManager() : null;
      
    if (!eventManager) {
      console.warn('Event manager not available, skipping event listener setup');
      return;
    }
    
    // Listen for power-up events that affect paddles
    eventManager.on('powerUpExpired', this.handlePowerUpExpired, this);
    eventManager.on('paddleSizeChanged', this.handlePaddleSizeChanged, this);
    
    console.log('Paddle event listeners set up');
  } catch (error) {
    console.error('Error setting up event listeners:', error);
    // Don't use errorManager here as it might not be initialized yet
  }
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
    const eventManager = 'getEventManager' in this.scene && 
      typeof this.scene.getEventManager === 'function' ? 
      this.scene.getEventManager() : null;
      
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
    const eventManager = 'getEventManager' in this.scene && 
      typeof this.scene.getEventManager === 'function' ? 
      this.scene.getEventManager() : null;
      
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
    const eventManager = 'getEventManager' in this.scene && 
      typeof this.scene.getEventManager === 'function' ? 
      this.scene.getEventManager() : null;
      
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
   * Get all paddles (alias for getPaddles for compatibility)
   */
  getAllPaddles(): Phaser.Physics.Matter.Sprite[] {
    return this.paddles;
  }
  
  /**
   * Get a specific paddle by edge
   */
  getPaddleByEdge(edge: string): Phaser.Physics.Matter.Sprite | undefined {
    return this.paddles.find(paddle => paddle.getData('edge') === edge);
  }
  
  /**
   * Enable control for all paddle controllers
   * Called by InputManager when game state changes
   */
  enableControl(): void {
    Object.values(this.paddleControllers).forEach(controller => {
      if (controller && typeof controller.enableControl === 'function') {
        controller.enableControl();
      }
    });
    
    // Emit event that paddle controls are enabled
    const eventManager = 'getEventManager' in this.scene && 
      typeof this.scene.getEventManager === 'function' ? 
      this.scene.getEventManager() : null;
      
    if (eventManager) {
      eventManager.emit('paddleControlEnabled');
    }
  }
  
  /**
   * Create a paddle with the specified properties
   */
  public createPaddle(
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
      const id = options.id || `paddle_${this.paddles.length}`;

      // Create the paddle sprite
      const paddle = this.scene.matter.add.sprite(x, y, texture, undefined, {
        isStatic: true,
        label: `paddle_${id}`
      });

      // Set display size
      paddle.setDisplaySize(width, height);

      // Store paddle properties
      paddle.setData('isVertical', isVertical);
      paddle.setData('id', id);
      paddle.setData('width', width);
      paddle.setData('height', height);
      paddle.setData('originalTint', paddle.tintTopLeft);

      // Create the proper physics shape
      if (this.paddlePhysics) {
        this.paddlePhysics.createPaddlePhysicsShape(paddle, isConcave);
      }

      // Add to paddles array
      this.paddles.push(paddle);

      return paddle;
    } catch (error) {
      console.error('Error creating paddle:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to create paddle', error instanceof Error ? error.stack : undefined);
      }
      
      // Create a fallback paddle in case of error
      const fallbackPaddle = this.scene.matter.add.sprite(x, y, 'paddle', undefined, {
        isStatic: true,
        label: 'paddle_fallback'
      });
      fallbackPaddle.setDisplaySize(width, height);
      this.paddles.push(fallbackPaddle);
      
      return fallbackPaddle;
    }
  }
  
  /**
   * Register a paddle controller
   */
  public addPaddleController(id: string, controller: PaddleController): void {
    this.paddleControllers[id] = controller;
  }
  
  /**
   * Get a paddle controller by ID
   */
  public getPaddleControllerById(id: string): PaddleController | undefined {
    return this.paddleControllers[id];
  }
  
  /**
   * Get all paddle controllers
   */
  public getAllPaddleControllers(): Record<string, PaddleController> {
    return this.paddleControllers;
  }
  
  /**
   * Update method called every frame
   * Note: PaddleController.update() doesn't accept parameters according to the interface
   */
  public update(time?: number, delta?: number): void {
    // Update all paddle controllers
    Object.values(this.paddleControllers).forEach(controller => {
      // Make sure the controller is valid before calling update
      if (controller && typeof controller.update === 'function') {
        try {
          // Call update without parameters as per the interface definition
          controller.update();
          
          // Store time and delta in the scene's registry if needed by controllers
          if (time !== undefined && delta !== undefined) {
            this.scene.registry.set('currentTime', time);
            this.scene.registry.set('currentDelta', delta);
          }
        } catch (error) {
          console.error('Error updating paddle controller:', error);
          if (this.errorManager) {
            this.errorManager.logError('Error updating paddle controller', error instanceof Error ? error.stack : undefined);
          }
        }
      }
    });
  }
  
  /**
   * Change the control type for a specific paddle
   */
  public changeControllerType(
    paddleId: string,
    controlType: ControllerType,  // Changed from 'keyboard' | 'mouse' | 'touch' | 'ai'
    options?: { difficulty?: number }
  ): void {
    try {
      const controller = this.paddleControllers[paddleId];
      if (!controller) {
        console.error(`No controller found for paddle ID: ${paddleId}`);
        return;
      }
      
      const paddle = controller.getPaddle();
      if (!paddle) {
        console.error('Cannot change controller type: no paddle assigned');
        return;
      }
      
      // Clean up the old controller
      controller.cleanup();
      
      // Create a new controller with the specified type
      if (!this.paddleFactory) {
        console.error('PaddleFactory not initialized');
        return;
      }
      
      // Get paddle orientation and other properties
      const isVertical = paddle.getData('isVertical');
      const orientation = isVertical ? 'vertical' : 'horizontal';
      const wasEnabled = controller.isControlEnabled();
      
      // Create a new controller based on the control type
      const newController = this.paddleFactory.createPaddleController(
        paddle,
        controlType,
        options
      );
      
      // Restore enabled state if it was enabled before
      if (wasEnabled) {
        newController.enableControl();
      }
      
      // Replace the controller in the collection
      this.paddleControllers[paddleId] = newController;
      
      // Emit event that controller type has changed
      const eventManager = 'getEventManager' in this.scene && 
        typeof this.scene.getEventManager === 'function' ? 
        this.scene.getEventManager() : null;
        
      if (eventManager) {
        eventManager.emit('paddleControllerChanged', {
          paddleId,
          controlType
        });
      }
      
      console.log(`Changed controller type for paddle ${paddleId} to ${controlType}`);
    } catch (error) {
      console.error('Error changing controller type:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to change controller type', error instanceof Error ? error.stack : undefined);
      }
    }
  }
  
  /**
   * Set AI difficulty for all AI-controlled paddles
   */
  public setAIDifficulty(difficulty: number): void {
    try {
      const normalizedDifficulty = Phaser.Math.Clamp(difficulty, 0, 1);
      
      // Update all AI controllers
      Object.values(this.paddleControllers).forEach(controller => {
        // Check if this is an AI controller by examining its instance
        const controllerInstance = controller as any;
        
        // If the controller has a setDifficulty method, it's likely an AI controller
        if (controllerInstance.controller && 
            typeof controllerInstance.controller.setDifficulty === 'function') {
          controllerInstance.controller.setDifficulty(normalizedDifficulty);
        }
      });
      
      // Store the current AI difficulty in the registry for reference
      this.scene.registry.set('aiDifficulty', normalizedDifficulty);
      
      console.log(`Set AI difficulty to ${normalizedDifficulty}`);
    } catch (error) {
      console.error('Error setting AI difficulty:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to set AI difficulty', error instanceof Error ? error.stack : undefined);
      }
    }
  }
  
  /**
   * Disable control for all paddle controllers
   */
  disableControl(): void {
    Object.values(this.paddleControllers).forEach(controller => {
      if (controller && typeof controller.disableControl === 'function') {
        controller.disableControl();
      }
    });
    
    // Emit event that paddle controls are disabled
    const eventManager = 'getEventManager' in this.scene && 
      typeof this.scene.getEventManager === 'function' ? 
      this.scene.getEventManager() : null;
      
    if (eventManager) {
      eventManager.emit('paddleControlDisabled');
    }
  }

  
  /**
   * Initialize the physics handlers for paddles
   */
  public initializePhysics(): void {
    if (this.paddlePhysics) {
      this.paddlePhysics.setupCollisionHandlers();
    }
  }
  
  /**
   * Update paddle colors based on the current theme
   * @param color The color to apply to paddles
   */
  public updatePaddleColors(color: number): void {
    try {
      // Apply the color to all paddles
      this.paddles.forEach(paddle => {
        // Store the original color in data if not already stored
        if (!paddle.getData('originalTint')) {
          paddle.setData('originalTint', paddle.tintTopLeft);
        }
        
        // Apply the new tint color
        paddle.setTint(color);
      });
      
      // Emit an event that paddle colors have been updated
      const eventManager = 'getEventManager' in this.scene && 
        typeof this.scene.getEventManager === 'function' ? 
        this.scene.getEventManager() : null;
        
      if (eventManager) {
        eventManager.emit('paddleColorsUpdated', { color });
      }
      
      console.log(`Updated paddle colors to ${color.toString(16)}`);
    } catch (error) {
      console.error('Error updating paddle colors:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to update paddle colors', error instanceof Error ? error.stack : undefined);
      }
    }
  }
  /**
 * Calculate paddle position and properties based on edge
 * This is a fallback method in case the PaddleFactory's method is not accessible
 */
private calculatePaddleProperties(edge: 'top' | 'bottom' | 'left' | 'right'): {
  x: number;
  y: number;
  width: number;
  height: number;
  texture: string;
  isVertical: boolean;
} {
  const gameWidth = this.scene.scale.width;
  const gameHeight = this.scene.scale.height;
  
  // Default paddle dimensions
  const defaultWidth = 100;
  const defaultHeight = 20;
  
  let x = 0;
  let y = 0;
  let width = defaultWidth;
  let height = defaultHeight;
  let texture = 'paddle';
  let isVertical = false;
  
  switch (edge) {
    case 'top':
      x = gameWidth / 2;
      y = 50; // Ensure this is visible (not negative)
      break;
    case 'bottom':
      x = gameWidth / 2;
      y = gameHeight - 50; // Ensure this is visible and not too close to the edge
      break;
    case 'left':
      x = 50;
      y = gameHeight / 2;
      width = defaultHeight;
      height = defaultWidth;
      texture = 'paddle-vertical';
      isVertical = true;
      break;
    case 'right':
      x = gameWidth - 50;
      y = gameHeight / 2;
      width = defaultHeight;
      height = defaultWidth;
      texture = 'paddle-vertical';
      isVertical = true;
      break;
  }
  
  // Log the calculated position for debugging
  console.log(`Calculated paddle position for ${edge}: (${x}, ${y}), size: ${width}x${height}`);
  
  return { x, y, width, height, texture, isVertical };
}
  /**
   * Clean up resources
   */
  public cleanup(): void {
    try {
      // Remove event listeners
      const eventManager = 'getEventManager' in this.scene && 
        typeof this.scene.getEventManager === 'function' ? 
        this.scene.getEventManager() : null;
        
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
      
      // Clear arrays
      this.paddleControllers = {};
      this.paddles = [];
    } catch (error) {
      console.error('Error in PaddleManager cleanup:', error);
      if (this.errorManager) {
        this.errorManager.logError('Failed to clean up paddle manager', error instanceof Error ? error.stack : undefined);
      }
    }
  }
}

export default PaddleManager;