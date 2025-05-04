import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';
import MatterJS from 'matter-js';

// Define control types
export enum ControlType {
  KEYBOARD = 'keyboard',
  TOUCH = 'touch',
  MOUSE = 'mouse',
  GAMEPAD = 'gamepad'
}

// Define game states
export enum GameState {
  READY = 'ready',    // Initial state, waiting for first click
  STARTED = 'started', // Game started, paddle control enabled, but ball not launched
  PLAYING = 'playing'  // Ball launched, full gameplay
}

class InputManager {
  private scene: BreakoutScene;
  private controlType: ControlType;
  private touchActive: boolean = false;
  private mouseActive: boolean = false;
  private gamepadActive: boolean = false;
  private gamepad: Phaser.Input.Gamepad.Gamepad | null = null;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    
    // Get control type from registry if available
    const storedControlType = this.scene.registry.get('controlType');
    this.controlType = storedControlType ? storedControlType : ControlType.KEYBOARD;
    
    // Initialize input handlers
    this.initialize();
  }
  
  /**
   * Initialize input handlers and game state
   */
  public initialize(): void {
    console.log('Initializing input manager...');
    
    // Set initial game state
    this.scene.registry.set('gameState', GameState.READY);
    
    // Set up keyboard controls
    this.setupKeyboardControls();
    
    // Set up mouse/touch controls
    this.setupPointerControls();
    
    // Set up gamepad detection
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.once('connected', this.handleGamepadConnected, this);
    }
    
    console.log('Input manager initialized');
  }
  
  /**
   * Set up keyboard controls
   */
  private setupKeyboardControls(): void {
    // Add keyboard event listeners if needed
    // This is a placeholder for keyboard control setup
  }
  
  /**
   * Set up pointer (mouse/touch) controls
   */
  private setupPointerControls(): void {
    // Handle pointer down events for game state progression
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      const gameState = this.scene.registry.get('gameState') || GameState.READY;
      
      if (gameState === GameState.READY) {
        // First click: Start the game (enable paddle control)
        console.log('First click: Starting game (enabling paddle control)');
        this.scene.registry.set('gameState', GameState.STARTED);
        
        // Enable paddle control
        this.enablePaddleControl();
        
        // Emit event that game is started (but ball not launched yet)
        const eventManager = this.scene.getEventManager();
        if (eventManager) {
          eventManager.emit('gameControlsEnabled');
        }
      } 
      else if (gameState === GameState.STARTED) {
        // Second click: Launch the ball
        console.log('Second click: Launching ball');
        this.scene.registry.set('gameState', GameState.PLAYING);
        
        // Start the game (launch ball)
        if (typeof this.scene.startGame === 'function') {
          this.scene.startGame();
        }
      }
      
      // Update control type based on input device
      if (pointer.wasTouch) {
        this.touchActive = true;
        if (this.controlType !== ControlType.TOUCH) {
          this.setControlType(ControlType.TOUCH);
        }
      } else {
        this.mouseActive = true;
        if (this.controlType !== ControlType.MOUSE) {
          this.setControlType(ControlType.MOUSE);
        }
      }
    });
    
    // Handle pointer move events for paddle control
    this.scene.input.on('pointermove', this.handlePointerMove, this);
  }
  
  /**
   * Enable paddle control
   */
  private enablePaddleControl(): void {
    console.log('Enabling paddle control');
    
    // Get all paddle controllers
    const paddleControllers = this.scene.getAllPaddleControllers ? 
      this.scene.getAllPaddleControllers() : {};
    
    // Enable each controller
    Object.values(paddleControllers).forEach(controller => {
      if (controller && typeof controller.enableControl === 'function') {
        controller.enableControl();
      }
    });
    
    // If no getAllPaddleControllers method, try to enable through paddle manager
    const paddleManager = this.scene.getPaddleManager ? this.scene.getPaddleManager() : null;
    if (paddleManager) {
      // Call enableControl method on paddle manager
      if (typeof paddleManager.enableControl === 'function') {
        paddleManager.enableControl();
      } else {
        // Fallback: enable individual paddle controllers through their data
        const paddles = paddleManager.getPaddles ? paddleManager.getPaddles() : [];
        paddles.forEach(paddle => {
          const controller = paddle.getData('controller');
          if (controller && typeof controller.enableControl === 'function') {
            controller.enableControl();
          }
        });
      }
    }
  }
  
  /**
   * Handle pointer move events for touch/mouse controls
   */
  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    // Only handle if using touch or mouse controls and game is started
    const gameState = this.scene.registry.get('gameState');
    if ((this.controlType !== ControlType.TOUCH && this.controlType !== ControlType.MOUSE) || 
        gameState === GameState.READY) {
      return;
    }
    
    // Get paddles through paddle manager if available
    const paddleManager = this.scene.getPaddleManager ? this.scene.getPaddleManager() : null;
    const paddles = paddleManager ? paddleManager.getPaddles() : this.scene['paddles'];
    
    if (!paddles || paddles.length === 0) return;
    
    // Focus on bottom paddle for now
    const bottomPaddle = paddles.find(p => p.getData('edge') === 'bottom');
    if (bottomPaddle) {
      // Calculate new x position
      const newX = Phaser.Math.Clamp(
        pointer.x,
        bottomPaddle.displayWidth / 2,
        this.scene.scale.width - bottomPaddle.displayWidth / 2
      );
      
      // Update paddle position
      this.scene.matter.body.setPosition(bottomPaddle.body as any, {
        x: newX,
        y: bottomPaddle.y
      });
    }
  }
  
  /**
   * Handle gamepad connection
   */
  private handleGamepadConnected(pad: Phaser.Input.Gamepad.Gamepad): void {
    this.gamepad = pad;
    this.gamepadActive = true;
    
    // Switch to gamepad controls
    this.setControlType(ControlType.GAMEPAD);
    
    // Emit gamepad connected event
    if (this.scene.getEventManager) {
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('gamepadConnected', { pad });
      }
    }
  }
  
  /**
   * Update method to be called in the scene's update loop
   */
  public update(): void {
    // Handle gamepad input if active
    if (this.gamepadActive && this.gamepad) {
      this.handleGamepadInput();
    }
  }
  
  /**
   * Handle gamepad input
   */
  private handleGamepadInput(): void {
    if (!this.gamepad) return;
    
    const gameState = this.scene.registry.get('gameState');
    if (gameState === GameState.READY) {
      // If in READY state, A button starts the game (enables controls)
      // Check if A button (index 0) is pressed
      if (this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed) {
        console.log('Gamepad A button: Starting game (enabling paddle control)');
        this.scene.registry.set('gameState', GameState.STARTED);
        this.enablePaddleControl();
      }
      return;
    }
    
    // Get paddles through paddle manager if available
    const paddleManager = this.scene.getPaddleManager ? this.scene.getPaddleManager() : null;
    const paddles = paddleManager ? paddleManager.getPaddles() : this.scene['paddles'];
    
    if (!paddles || paddles.length === 0) return;
    
    // Get bottom paddle
    const bottomPaddle = paddles.find(p => p.getData('edge') === 'bottom');
    if (!bottomPaddle) return;
    
    // Get left stick horizontal axis
    const leftStickX = this.gamepad.leftStick.x;
    
    // Only move if stick is pushed significantly
    if (Math.abs(leftStickX) > 0.1) {
      // Calculate movement speed based on stick position
      const speed = 10 * leftStickX;
      
      // Calculate new position
      const newX = Phaser.Math.Clamp(
        bottomPaddle.x + speed,
        bottomPaddle.displayWidth / 2,
        this.scene.scale.width - bottomPaddle.displayWidth / 2
      );
      
      // Update paddle position
      this.scene.matter.body.setPosition(bottomPaddle.body as any, {
        x: newX,
        y: bottomPaddle.y
      });
    }
    
    // Check A button for launching the ball (only in STARTED state)
    if (gameState === GameState.STARTED && 
        this.gamepad.buttons[0] && this.gamepad.buttons[0].pressed) {
      console.log('Gamepad A button: Launching ball');
      this.scene.registry.set('gameState', GameState.PLAYING);
      
      if (typeof this.scene.startGame === 'function') {
        this.scene.startGame();
      }
    }
  }
  
  /**
   * Set the control type
   */
  public setControlType(type: ControlType): void {
    this.controlType = type;
    this.scene.registry.set('controlType', type);
    
    // Emit control type changed event
    if (this.scene.getEventManager) {
      const eventManager = this.scene.getEventManager();
      if (eventManager) {
        eventManager.emit('controlTypeChanged', { type });
      }
    }
  }
  
  /**
   * Get the current control type
   */
  public getControlType(): ControlType {
    return this.controlType;
  }
  
  /**
   * Get the current game state
   */
  public getGameState(): GameState {
    return this.scene.registry.get('gameState') || GameState.READY;
  }
  
  /**
   * Clean up event listeners when scene is shut down
   */
  public cleanup(): void {
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.off('connected', this.handleGamepadConnected, this);
    }
  }
}

export default InputManager;