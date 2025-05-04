import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

/**
 * Controls cross-platform input handling
 */
class InputController {
  private scene: BreakoutScene;
  private inputType: 'keyboard' | 'mouse' | 'touch' | 'gamepad' = 'keyboard';
  private gamepad?: Phaser.Input.Gamepad.Gamepad;
  private touchControls?: Phaser.GameObjects.Container;
  private keyboardControls: Record<string, Phaser.Input.Keyboard.Key> = {};
  private isActive: boolean = true;
  private previousButtonStates: Record<string, boolean> = {};
    
  constructor(scene: BreakoutScene) {
    this.scene = scene;
      
    // Detect platform and set default input type
    this.detectPlatform();
      
    // Set up input handlers
    this.setupInputHandlers();
      
    // Listen for gamepad connections
    this.setupGamepadListeners();
    
    // Set up event listeners
    this.setupEventListeners();
  }
  
  /**
   * Detect platform and set appropriate input type
   */
  private detectPlatform(): void {
    const isMobile = this.scene.sys.game.device.input.touch;
    const hasGamepad = this.scene.input.gamepad?.total > 0;
      
    if (isMobile) {
      this.inputType = 'touch';
    } else if (hasGamepad) {
      this.inputType = 'gamepad';
    } else {
      this.inputType = 'keyboard';
    }
    
    // Emit input type detected event
    this.scene['eventManager']?.emit('inputTypeDetected', { type: this.inputType });
  }
    
  /**
   * Set up input handlers based on input type
   */
  private setupInputHandlers(): void {
    // Set up keyboard controls
    this.setupKeyboardControls();
    // Set up touch controls if needed
    if (this.inputType === 'touch') {
      this.createTouchControls();
    }
  }
  
  /**
   * Set up keyboard controls
   */
  private setupKeyboardControls(): void {
    // Game control keys
    this.keyboardControls.left = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    this.keyboardControls.right = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
    this.keyboardControls.up = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    this.keyboardControls.down = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
    this.keyboardControls.space = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.keyboardControls.esc = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    
    // Alternative keys (WASD)
    this.keyboardControls.a = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.keyboardControls.d = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    this.keyboardControls.w = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.keyboardControls.s = this.scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    
    // Add key press listeners for one-shot actions
    this.keyboardControls.space.on('down', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'launch', pressed: true });
    });
    
    this.keyboardControls.esc.on('down', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'pause', pressed: true });
    });
  }
  
  /**
   * Set up gamepad connection listeners
   */
  private setupGamepadListeners(): void {
    // Check if gamepad plugin is available
    if (!this.scene.input.gamepad) return;
    
    // Listen for gamepad connections
    this.scene.input.gamepad.on('connected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      this.gamepad = pad;
      this.inputType = 'gamepad';
      
      // Initialize button states
      this.previousButtonStates = {};
      
      // Emit event
      this.scene['eventManager']?.emit('inputTypeChanged', { type: 'gamepad' });
    });
    
    // Listen for gamepad disconnections
    this.scene.input.gamepad.on('disconnected', (pad: Phaser.Input.Gamepad.Gamepad) => {
      if (this.gamepad === pad) {
        this.gamepad = undefined;
        this.inputType = 'keyboard';
        
        // Emit event
        this.scene['eventManager']?.emit('inputTypeChanged', { type: 'keyboard' });
      }
    });
  }
  
  /**
   * Create touch controls overlay
   */
  private createTouchControls(): void {
    // Remove existing controls if any
    if (this.touchControls) {
      this.touchControls.destroy();
    }
    
    // Create container for touch controls
    this.touchControls = this.scene.add.container(0, 0);
    
    // Add touch buttons/zones
    const leftZone = this.scene.add.rectangle(
      this.scene.scale.width * 0.25, 
      this.scene.scale.height * 0.9,
      this.scene.scale.width * 0.5,
      this.scene.scale.height * 0.2,
      0x0000ff,
      0.2
    ).setInteractive();
    
    const rightZone = this.scene.add.rectangle(
      this.scene.scale.width * 0.75, 
      this.scene.scale.height * 0.9,
      this.scene.scale.width * 0.5,
      this.scene.scale.height * 0.2,
      0xff0000,
      0.2
    ).setInteractive();
    
    // Add launch button
    const launchButton = this.scene.add.circle(
      this.scene.scale.width * 0.5,
      this.scene.scale.height * 0.75,
      50,
      0x00ff00,
      0.5
    ).setInteractive();
    
    // Add pause button
    const pauseButton = this.scene.add.rectangle(
      this.scene.scale.width - 30,
      30,
      40,
      40,
      0xffffff,
      0.5
    ).setInteractive();
    
    // Add to container
    this.touchControls.add([leftZone, rightZone, launchButton, pauseButton]);
    
    // Set up touch events
    leftZone.on('pointerdown', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveLeft', pressed: true });
    });
    
    leftZone.on('pointerup', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveLeft', pressed: false });
    });
    
    rightZone.on('pointerdown', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveRight', pressed: true });
    });
    
    rightZone.on('pointerup', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveRight', pressed: false });
    });
    
    launchButton.on('pointerdown', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'launch', pressed: true });
    });
    
    pauseButton.on('pointerdown', () => {
      this.scene['eventManager']?.emit('inputAction', { type: 'pause', pressed: true });
    });
    
    // Make touch controls visible only for touch input
    this.touchControls.setVisible(this.inputType === 'touch');
  }
  
  /**
   * Set up event listeners
   */
  private setupEventListeners(): void {
    const eventManager = this.scene['eventManager'];
    if (!eventManager) return;
    
    // Listen for game state changes
    eventManager.on('gamePaused', () => { this.isActive = false; }, this);
    eventManager.on('gameResumed', () => { this.isActive = true; }, this);
    
    // Listen for input preference changes
    eventManager.on('inputPreferenceChanged', this.handleInputPreferenceChanged, this);
  }
  
  /**
   * Handle input preference changes
   */
  private handleInputPreferenceChanged(data: { type: 'keyboard' | 'mouse' | 'touch' | 'gamepad' }): void {
    this.setInputType(data.type);
  }
  
  /**
   * Update method called every frame
   */
  update(): void {
    if (!this.isActive) return;
    
    // Handle keyboard input
    if (this.inputType === 'keyboard') {
      this.updateKeyboardInput();
    }
    
    // Handle gamepad input
    else if (this.inputType === 'gamepad' && this.gamepad) {
      this.updateGamepadInput();
    }
    
    // Mouse input is handled by event listeners
  }
  
  /**
   * Update keyboard input
   */
  private updateKeyboardInput(): void {
    // Check movement keys
    const leftPressed = this.keyboardControls.left.isDown || this.keyboardControls.a.isDown;
    const rightPressed = this.keyboardControls.right.isDown || this.keyboardControls.d.isDown;
    const upPressed = this.keyboardControls.up.isDown || this.keyboardControls.w.isDown;
    const downPressed = this.keyboardControls.down.isDown || this.keyboardControls.s.isDown;
    
    // Emit movement events
    if (leftPressed) {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveLeft', pressed: true });
    }
    
    if (rightPressed) {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveRight', pressed: true });
    }
    
    if (upPressed) {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveUp', pressed: true });
    }
    
    if (downPressed) {
      this.scene['eventManager']?.emit('inputAction', { type: 'moveDown', pressed: true });
    }
  }
  
  /**
   * Update gamepad input
   */
  private updateGamepadInput(): void {
    if (!this.gamepad) return;
    
    // Left stick or d-pad for movement
    const leftRight = this.gamepad.leftStick?.x || 0;
    const upDown = this.gamepad.leftStick?.y || 0;
    
    // Check dpad as a fallback
    const dpadLeftRight = 
      (this.isButtonDown(this.gamepad, 14) ? 1 : 0) - // Right
      (this.isButtonDown(this.gamepad, 13) ? 1 : 0);  // Left
      
    const dpadUpDown = 
      (this.isButtonDown(this.gamepad, 15) ? 1 : 0) - // Down
      (this.isButtonDown(this.gamepad, 12) ? 1 : 0);  // Up
    
    // Use either analog stick or dpad
    const finalLeftRight = Math.abs(leftRight) > 0.1 ? leftRight : dpadLeftRight;
    const finalUpDown = Math.abs(upDown) > 0.1 ? upDown : dpadUpDown;
    
    if (Math.abs(finalLeftRight) > 0.1) {
      this.scene['eventManager']?.emit('inputAction', {
        type: finalLeftRight < 0 ? 'moveLeft' : 'moveRight',
        value: Math.abs(finalLeftRight),
        pressed: true
      });
    }
    
    if (Math.abs(finalUpDown) > 0.1) {
      this.scene['eventManager']?.emit('inputAction', {
        type: finalUpDown < 0 ? 'moveUp' : 'moveDown',
        value: Math.abs(finalUpDown),
        pressed: true
      });
    }
    
    // Check buttons for actions (using button indexes for better compatibility)
    // A button (0)
    this.checkButtonState(0, 'launch');
    
    // B button (1)
    this.checkButtonState(1, 'action');
    
    // Start button (9)
    this.checkButtonState(9, 'pause');
  }
  
  /**
   * Check if a gamepad button is down
   */
  private isButtonDown(gamepad: Phaser.Input.Gamepad.Gamepad, buttonIndex: number): boolean {
    return gamepad.buttons[buttonIndex]?.pressed || false;
  }
  
  /**
   * Check button state and emit events on change
   */
  private checkButtonState(buttonIndex: number, actionType: string): void {
    if (!this.gamepad) return;
    
    const buttonKey = `button_${buttonIndex}`;
    const isPressed = this.isButtonDown(this.gamepad, buttonIndex);
    const wasPressed = this.previousButtonStates[buttonKey] || false;
    
    // Only emit on button state changes
    if (isPressed && !wasPressed) {
      this.scene['eventManager']?.emit('inputAction', { 
        type: actionType, 
        pressed: true 
      });
    } else if (!isPressed && wasPressed) {
      this.scene['eventManager']?.emit('inputAction', { 
        type: actionType, 
        pressed: false 
      });
    }
    
    // Update previous state
    this.previousButtonStates[buttonKey] = isPressed;
  }
  
  /**
   * Change input type
   */
  setInputType(type: 'keyboard' | 'mouse' | 'touch' | 'gamepad'): void {
    this.inputType = type;
    
    // Update UI and controllers
    this.scene['eventManager']?.emit('inputTypeChanged', { type: this.inputType });
    
    // Show/hide touch controls
    if (this.touchControls) {
      this.touchControls.setVisible(this.inputType === 'touch');
    }
  }
  
  /**
   * Get current input type
   */
  getInputType(): string {
    return this.inputType;
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene['eventManager'];
    if (eventManager) {
      eventManager.off('gamePaused', null, this);
      eventManager.off('gameResumed', null, this);
      eventManager.off('inputPreferenceChanged', this.handleInputPreferenceChanged, this);
    }
    
    // Clean up gamepad listeners
    if (this.scene.input.gamepad) {
      this.scene.input.gamepad.off('connected');
      this.scene.input.gamepad.off('disconnected');
    }
    
    // Remove keyboard keys
    Object.values(this.keyboardControls).forEach(key => {
      key.removeAllListeners();
      this.scene.input.keyboard.removeKey(key.keyCode);
    });
    
    // Destroy touch controls
    if (this.touchControls) {
      this.touchControls.destroy();
    }
  }
}

export default InputController;