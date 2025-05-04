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
  private errorCount: Record<string, number> = {}; // Track error frequency
  private maxErrorsPerType: number = 3; // Maximum number of times to show the same error
  
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
    try {
      // Generate a simple hash of the error message to track frequency
      const errorKey = this.getErrorKey(message);
      
      // Increment error count
      this.errorCount[errorKey] = (this.errorCount[errorKey] || 0) + 1;
      
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
      
      // Special handling for common errors
      if (message.includes("Cannot read properties of undefined (reading 'position')")) {
        console.warn('[ErrorManager] Detected position access on undefined object. This is likely a timing issue with destroyed game objects.');
        // Only display first few occurrences to avoid spam
        display = this.errorCount[errorKey] <= this.maxErrorsPerType;
      }
      
      // Display error if requested and scene is active
      if (display && this.scene && this.scene.scene && typeof this.scene.scene.isActive === 'function') {
        try {
          const isActive = this.scene.scene.isActive();
          if (isActive) {
            this.displayError(message);
          }
        } catch (e) {
          console.warn('[ErrorManager] Could not check if scene is active:', e);
        }
      }
    } catch (e) {
      // Last resort fallback if our error handler itself has an error
      console.error('[ErrorManager] Error in error handler:', e);
    }
  }
  
  /**
   * Generate a simple key for the error to track frequency
   */
  private getErrorKey(message: string): string {
    // Extract the main part of the error message (first line or first 50 chars)
    const mainPart = message.split('\n')[0].substring(0, 50);
    return mainPart;
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
      // Safety check - make sure scene and scale exist
      if (!this.scene || !this.scene.scale) {
        console.warn('[ErrorManager] Cannot display error: scene or scale not available');
        return;
      }
      
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
      
      // Format the error message - keep it short and readable
      const formattedMessage = this.formatErrorMessage(message);
      
      // Add error message
      this.errorText = this.scene.add.text(
        0, 0, 
        formattedMessage, 
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
      if (this.scene.children && typeof this.scene.children.bringToTop === 'function') {
        this.scene.children.bringToTop(this.errorContainer);
      }
      
      // Pause game if it's running
      if (this.scene.scene && typeof this.scene.scene.isPaused === 'function' && !this.scene.scene.isPaused()) {
        this.scene.scene.pause();
      }
      
    } catch (err) {
      // If we can't display the error graphically, log it
      console.error('[ErrorManager] Failed to display error:', err);
    }
  }
  
  /**
   * Format error message to be more user-friendly
   */
  private formatErrorMessage(message: string): string {
    // Truncate very long messages
    if (message.length > 200) {
      message = message.substring(0, 200) + '...';
    }
    
    // Handle specific error types with more user-friendly messages
    if (message.includes("Cannot read properties of undefined (reading 'position')")) {
      return "A game object was accessed after being destroyed.\nThis won't affect your gameplay.\n\nTechnical details: Object position property not found";
    }
    
    return message;
  }
  
  /**
   * Hide the error display
   */
  public hideError(): void {
    try {
      if (this.errorContainer) {
        this.errorContainer.destroy();
        this.errorContainer = null;
        this.errorText = null;
      }
      
      this.isErrorDisplayed = false;
      
      // Resume game if it was paused
      if (this.scene && this.scene.scene && 
          typeof this.scene.scene.isPaused === 'function' && 
          typeof this.scene.scene.resume === 'function' && 
          this.scene.scene.isPaused()) {
        this.scene.scene.resume();
      }
    } catch (err) {
      console.error('[ErrorManager] Error hiding error display:', err);
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
    this.errorCount = {};
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
   * Safely access an object property with error handling
   * @param obj The object to access
   * @param propertyPath The property path (e.g., 'position.x')
   * @param defaultValue Default value if property doesn't exist
   */
  public safeAccess<T>(obj: any, propertyPath: string, defaultValue: T): T {
    try {
      if (!obj) return defaultValue;
      
      const parts = propertyPath.split('.');
      let current = obj;
      
      for (const part of parts) {
        if (current === undefined || current === null) {
          return defaultValue;
        }
        current = current[part];
      }
      
      return current !== undefined && current !== null ? current : defaultValue;
    } catch (e) {
      return defaultValue;
    }
  }
  
  /**
   * Clean up resources
   */
  public cleanup(): void {
    try {
      if (this.errorContainer) {
        this.errorContainer.destroy();
        this.errorContainer = null;
        this.errorText = null;
      }
      
      this.isErrorDisplayed = false;
      
      // Don't restore original console.error to keep error tracking active
      // even during scene transitions
    } catch (e) {
      console.error('[ErrorManager] Error during cleanup:', e);
    }
  }
}

export default ErrorManager;