import * as Phaser from 'phaser';

/**
 * Utility class for text creation and manipulation in the game
 * Provides bitmap font support with system font fallback
 * and cryptocurrency symbol helpers
 */
export class TextUtils {
  /**
   * Creates game text with bitmap font and system font fallback
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param text - Text content (can include crypto symbols)
   * @param size - Font size (default: 24)
   * @param color - Text color (default: white)
   * @param align - Text alignment (default: center)
   * @returns Phaser.GameObjects.BitmapText or Phaser.GameObjects.Text
   */
  static createText(
    scene: Phaser.Scene, 
    x: number, 
    y: number, 
    text: string, 
    size = 24, 
    color = '#ffffff',
    align = 'center'
  ): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    // Check if bitmap fonts should be used (and are available)
    const useFallbackFonts = scene.registry.get('useFallbackFonts');
    
    if (!useFallbackFonts) {
      try {
        // Try to create bitmap text
        const bitmapText = scene.add.bitmapText(
          x, y, 
          'main-font', 
          text, 
          size
        );
        
        // Set color if provided (as tint for bitmap font)
        if (color) {
          bitmapText.setTint(Phaser.Display.Color.HexStringToColor(color).color);
        }
        
        return bitmapText;
      } catch (error) {
        // If bitmap font creation fails, fall back to system font
        console.warn('Bitmap font failed, using system font fallback', error);
        scene.registry.set('useFallbackFonts', true);
      }
    }
    
    // Create regular text with system font
    return scene.add.text(x, y, text, {
      fontFamily: '"VCR OSD Mono", "Courier New", monospace',
      fontSize: `${size}px`,
      color: color,
      align: align,
      stroke: '#000000',
      strokeThickness: 1
    });
  }
  
  /**
   * Creates a title text with larger font size and bold style
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param title - Game title
   * @param size - Font size (default: 32)
   * @param color - Text color (default: white)
   * @returns Text object
   */
  static createTitleText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    title: string,
    size = 32,
    color = '#ffffff'
  ): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    const titleText = this.createText(scene, x, y, title, size, color);
    
    // If it's a regular text, apply bold style
    if (titleText instanceof Phaser.GameObjects.Text) {
      titleText.setStyle({ fontStyle: 'bold' });
    }
    
    return titleText;
  }
  
  /**
   * Returns the appropriate symbol for a cryptocurrency
   * @param symbol - Cryptocurrency code (BTC, ETH, etc.)
   * @returns The Unicode symbol or original string
   */
  static cryptoSymbol(symbol: string): string {
    const symbols: Record<string, string> = {
      'BTC': '₿', // Bitcoin (U+20BF)
      'ETH': 'Ξ', // Ethereum (U+039E)
      'LTC': 'Ł', // Litecoin (U+0141)
      'DOGE': 'Ð', // Dogecoin (U+00D0)
      'XRP': 'Ʀ', // Ripple
      'USD': '$',
      'EUR': '€',
      'YEN': '¥'
    };
    
    return symbols[symbol.toUpperCase()] || symbol;
  }

  /**
   * Creates a score text display with crypto symbol
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param score - Score value
   * @param cryptoType - Cryptocurrency type (default: BTC)
   * @param size - Font size (default: 24)
   * @returns Text object
   */
  static createScoreText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    score: number,
    cryptoType = 'BTC',
    size = 24
  ): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.createText(
      scene,
      x,
      y,
      `SCORE: ${score} ${this.cryptoSymbol(cryptoType)}`,
      size
    );
  }

  /**
   * Creates a lives display with crypto symbol
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param lives - Number of lives
   * @param cryptoType - Cryptocurrency type (default: ETH)
   * @param size - Font size (default: 24)
   * @returns Text object
   */
  static createLivesText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    lives: number,
    cryptoType = 'ETH',
    size = 24
  ): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.createText(
      scene,
      x,
      y,
      `LIVES: ${lives} ${this.cryptoSymbol(cryptoType)}`,
      size
    );
  }

  /**
   * Creates a level display
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param level - Current level
   * @param size - Font size (default: 24)
   * @returns Text object
   */
  static createLevelText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    level: number,
    size = 24
  ): Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text {
    return this.createText(
      scene,
      x,
      y,
      `LEVEL: ${level}`,
      size
    );
  }

  /**
   * Updates the text of a text object safely (works with both BitmapText and Text)
   * @param textObject - The text object to update
   * @param newText - The new text content
   */
  static updateText(
    textObject: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text,
    newText: string
  ): void {
    if (textObject) {
      textObject.setText(newText);
    }
  }

  /**
   * Updates a score text with new score value
   * @param textObject - The score text object
   * @param score - New score value
   * @param cryptoType - Cryptocurrency type
   */
  static updateScoreText(
    textObject: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text,
    score: number,
    cryptoType = 'BTC'
  ): void {
    this.updateText(textObject, `SCORE: ${score} ${this.cryptoSymbol(cryptoType)}`);
  }

  /**
   * Updates a lives text with new lives value
   * @param textObject - The lives text object
   * @param lives - New lives value
   * @param cryptoType - Cryptocurrency type
   */
  static updateLivesText(
    textObject: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text,
    lives: number,
    cryptoType = 'ETH'
  ): void {
    this.updateText(textObject, `LIVES: ${lives} ${this.cryptoSymbol(cryptoType)}`);
  }
  
  /**
   * Creates a flashing text effect
   * @param scene - The current scene
   * @param textObject - The text object to animate
   * @param duration - Duration of each flash cycle in ms (default: 500)
   * @param repeat - Number of times to repeat (-1 for infinite) (default: -1)
   */
  static createFlashingText(
    scene: Phaser.Scene,
    textObject: Phaser.GameObjects.BitmapText | Phaser.GameObjects.Text,
    duration = 500,
    repeat = -1
  ): Phaser.Tweens.Tween {
    return scene.tweens.add({
      targets: textObject,
      alpha: { from: 1, to: 0.2 },
      duration: duration,
      yoyo: true,
      repeat: repeat
    });
  }
  
  /**
   * Creates a text with a typing effect
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param fullText - The complete text to type
   * @param speed - Typing speed in ms per character (default: 50)
   * @param size - Font size (default: 24)
   * @param color - Text color (default: white)
   */
  static createTypingText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    fullText: string,
    speed = 50,
    size = 24,
    color = '#ffffff'
  ): { text: Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText, timeline: Phaser.Time.TimerEvent } {
    // Create empty text object first
    const textObject = this.createText(scene, x, y, '', size, color);
    
    // Set up typing effect
    let currentChar = 0;
    const textLength = fullText.length;
    
    const timer = scene.time.addEvent({
      delay: speed,
      callback: () => {
        currentChar++;
        this.updateText(textObject, fullText.substring(0, currentChar));
        
        // Stop when all text is typed
        if (currentChar === textLength) {
          timer.destroy();
        }
      },
      repeat: textLength - 1
    });
    
    return { text: textObject, timeline: timer };
  }
  
  /**
   * Creates a countdown timer text
   * @param scene - The current scene
   * @param x - X position
   * @param y - Y position
   * @param seconds - Starting seconds
   * @param size - Font size (default: 32)
   * @param color - Text color (default: white)
   * @param onComplete - Callback when countdown reaches zero
   */
  static createCountdownText(
    scene: Phaser.Scene,
    x: number,
    y: number,
    seconds: number,
    size = 32,
    color = '#ffffff',
    onComplete?: () => void
  ): { text: Phaser.GameObjects.Text | Phaser.GameObjects.BitmapText, timer: Phaser.Time.TimerEvent } {
    // Create text object
    const textObject = this.createText(scene, x, y, seconds.toString(), size, color);
    
    // Set up countdown
    const timer = scene.time.addEvent({
      delay: 1000,
      callback: () => {
        seconds--;
        this.updateText(textObject, seconds.toString());
        
        // Check if countdown is complete
        if (seconds <= 0) {
          timer.destroy();
          if (onComplete) onComplete();
        }
      },
      repeat: seconds - 1
    });
    
    return { text: textObject, timer };
  }
}