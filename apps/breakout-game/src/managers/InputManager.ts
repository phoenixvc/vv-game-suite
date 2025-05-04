import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

// Define control types
export enum ControlType {
  KEYBOARD = 'keyboard',
  TOUCH = 'touch',
  MOUSE = 'mouse',
  GAMEPAD = 'gamepad'
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
    this.initializeInputHandlers();
  }
  
  /**
   * Initialize input handlers based on control type
   */
  private initializeInputHandlers(): void {
    // Always set up pointer down for starting the game
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    
    // Set up touch controls if enabled
    if (this.controlType === ControlType.TOUCH || this.controlType === ControlType.MOUSE) {
      this.scene.input.on('pointermove', this.handlePointerMove, this);
    }
    
    // Set up gamepad detection
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.once('connected', this.handleGamepadConnected, this);
    }
  }
  
  /**
   * Handle pointer down events
   */
  private handlePointerDown(pointer: Phaser.Input.Pointer): void {
    // Start the game if not started
    if (typeof this.scene.startGame === 'function' && !this.scene['ballLaunched']) {
      this.scene.startGame();
    }
    
    // If using touch/mouse controls, update control type
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
  }
  
  /**
   * Handle pointer move events for touch/mouse controls
   */
  private handlePointerMove(pointer: Phaser.Input.Pointer): void {
    // Only handle if using touch or mouse controls
    if (this.controlType !== ControlType.TOUCH && this.controlType !== ControlType.MOUSE) {
      return;
    }
    
    // Update paddle position based on pointer
    const paddles = this.scene['paddles'];
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
      this.scene.matter.body.setPosition(bottomPaddle.body as MatterJS.BodyType, {
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
      this.scene.getEventManager().emit('gamepadConnected', { pad });
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
    
    const paddles = this.scene['paddles'];
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
      this.scene.matter.body.setPosition(bottomPaddle.body as MatterJS.BodyType, {
        x: newX,
        y: bottomPaddle.y
      });
    }
    
    // Check A button for launching the ball
    if (this.gamepad.A && !this.scene['ballLaunched'] && typeof this.scene.startGame === 'function') {
      this.scene.startGame();
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
      this.scene.getEventManager().emit('controlTypeChanged', { type });
    }
  }
  
  /**
   * Get the current control type
   */
  public getControlType(): ControlType {
    return this.controlType;
  }
  
  /**
   * Clean up event listeners when scene is shut down
   */
  public cleanup(): void {
    this.scene.input.off('pointerdown', this.handlePointerDown, this);
    this.scene.input.off('pointermove', this.handlePointerMove, this);
    
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.off('connected', this.handleGamepadConnected, this);
    }
  }
}

export default InputManager;