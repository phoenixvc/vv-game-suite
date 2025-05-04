import * as Phaser from 'phaser';

/**
 * Manages error handling and display throughout the game
 */
export class ErrorManager {
  private scene: Phaser.Scene;
  private errorContainer: Phaser.GameObjects.Container | null = null;
  private errorText: Phaser.GameObjects.Text | null = null;
  private errorLog: Array<{message: string, stack?: string, timestamp: number}> = [];
  private isErrorDisplayed: boolean = false;
  
  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    
    // Set up global error handler
    this.setupGlobalErrorHandler();
  }
  
  /**
   * Set up global error handlers
   */
  private setupGlobalErrorHandler(): void {
    // Store original console.error
    const originalConsoleError = console.error;
    
    // Override console.error to capture errors
    console.error = (...args: any[]) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Log the error
      const errorMessage = args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg) : String(arg)
      ).join(' ');
      
      this.logError(errorMessage);
    };
    
    // Handle uncaught errors
    window.addEventListener('error', (event) => {
      this.logError(event.message, event.error?.stack);
      return false;
    });
    
    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      const message = event.reason instanceof Error 
        ? event.reason.message 
        : 'Unhandled Promise rejection';
      const stack = event.reason instanceof Error ? event.reason.stack : undefined;
      
      this.logError(message, stack);
    });
  }
  
  /**
   * Log an error and optionally display it
   * @param message Error message
   * @param stack Optional stack trace
   * @param display Whether to display the error on screen
   */
  public logError(message: string, stack?: string, display: boolean = true): void {
    // Add to error log
    this.errorLog.push({
      message,
      stack,
      timestamp: Date.now()
    });
    
    // Limit log size
    if (this.errorLog.length > 50) {
      this.errorLog.shift();
    }
    
    // Log to console for debugging
    console.warn('[ErrorManager] Error:', message);
    if (stack) console.warn('[ErrorManager] Stack:', stack);
    
    // Display error if requested
    if (display && this.scene.scene.isActive()) {
      this.displayError(message);
    }
  }
  
  /**
   * Display an error message on screen
   * @param message The error message to display
   */
  public displayError(message: string): void {
    // Don't create multiple error displays
    if (this.isErrorDisplayed) {
      if (this.errorText) {
        this.errorText.setText(message);
      }
      return;
    }
    
    this.isErrorDisplayed = true;
    
    try {
      const { width, height } = this.scene.scale;
      
      // Create container for error display
      this.errorContainer = this.scene.add.container(width / 2, height / 2);
      
      // Add semi-transparent background
      const bg = this.scene.add.rectangle(
        0, 0, 
        width * 0.8, 
        height * 0.3,
        0x000000, 0.8
      );
      bg.setStrokeStyle(2, 0xff0000);
      this.errorContainer.add(bg);
      
      // Add error title
      const titleText = this.scene.add.text(
        0, -bg.height / 2 + 20, 
        'ERROR', 
        { 
          fontFamily: 'Arial', 
          fontSize: '24px', 
          color: '#ff0000',
          align: 'center'
        }
      );
      titleText.setOrigin(0.5);
      this.errorContainer.add(titleText);
      
      // Add error message
      this.errorText = this.scene.add.text(
        0, 0, 
        message, 
        { 
          fontFamily: 'Arial', 
          fontSize: '16px', 
          color: '#ffffff',
          align: 'center',
          wordWrap: { width: bg.width - 40 }
        }
      );
      this.errorText.setOrigin(0.5);
      this.errorContainer.add(this.errorText);
      
      // Add continue button
      const continueButton = this.scene.add.text(
        0, bg.height / 2 - 30, 
        'Continue', 
        { 
          fontFamily: 'Arial', 
          fontSize: '18px', 
          color: '#ffffff',
          backgroundColor: '#444444',
          padding: { x: 10, y: 5 }
        }
      );
      continueButton.setOrigin(0.5);
      continueButton.setInteractive({ useHandCursor: true });
      continueButton.on('pointerdown', () => this.hideError());
      this.errorContainer.add(continueButton);
      
      // Add to scene
      this.scene.children.bringToTop(this.errorContainer);
      
      // Pause game if it's running
      if (!this.scene.scene.isPaused()) {
        this.scene.scene.pause();
      }
      
    } catch (err) {
      // If we can't display the error graphically, log it
      console.error('Failed to display error:', err);
    }
  }
  
  /**
   * Hide the error display
   */
  public hideError(): void {
    if (this.errorContainer) {
      this.errorContainer.destroy();
      this.errorContainer = null;
      this.errorText = null;
    }
    
    this.isErrorDisplayed = false;
    
    // Resume game if it was paused
    if (this.scene.scene.isPaused()) {
      this.scene.scene.resume();
    }
  }
  
  /**
   * Get all logged errors
   */
  public getErrorLog(): Array<{message: string, stack?: string, timestamp: number}> {
    return [...this.errorLog];
  }
  
  /**
   * Clear the error log
   */
  public clearErrorLog(): void {
    this.errorLog = [];
  }
  
  /**
   * Create a wrapped function that catches errors
   * @param fn The function to wrap
   * @param context The context to bind the function to
   * @returns A wrapped function that catches errors
   */
  public wrapWithErrorHandler<T extends (...args: any[]) => any>(
    fn: T, 
    context: any = null
  ): (...args: Parameters<T>) => ReturnType<T> | undefined {
    return (...args: Parameters<T>): ReturnType<T> | undefined => {
      try {
        return fn.apply(context, args);
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        const stack = error instanceof Error ? error.stack : undefined;
        this.logError(`Error in ${fn.name || 'anonymous function'}: ${message}`, stack);
        return undefined;
      }
    };
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    if (this.errorContainer) {
      this.errorContainer.destroy();
      this.errorContainer = null;
      this.errorText = null;
    }
    
    // Restore original console.error if needed
    // (This part is optional and depends on your needs)
  }
}

export default ErrorManager;