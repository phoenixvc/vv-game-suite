import * as Phaser from 'phaser';
import { ASSETS } from '../../constants/GameConstants';
import { PowerUpType } from '../../types/PowerUpType';
import BreakoutScene from './BreakoutScene';

declare global {
  interface Window {
    audioPlaceholders?: {
      bounce: string;
      break: string;
      powerup: string;
    };
  }
}

/**
 * Handles asset loading for the Breakout game
 */
class BreakoutAssetLoader {
  private scene: BreakoutScene;
  private loadingComplete: boolean = false;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Load all required assets
   */
  public loadAssets(): void {
    console.log('Starting asset loading process');
    
    // Show loading progress
    this.createLoadingBar();
    
    // Create placeholder assets for missing files
    this.createPlaceholderAssets();
    
    // Add error handler for missing assets
    this.scene.load.on('loaderror', (file: any) => {
      console.warn(`Failed to load asset: ${file.key}. Using placeholder.`);
      this.handleMissingAsset(file);
    });
    
    // Set a timeout to ensure we don't get stuck in loading
    const loadTimeout = setTimeout(() => {
      console.warn('Asset loading timed out, proceeding with available assets');
      // Force completion if loading takes too long
      if (!this.loadingComplete) {
        this.loadingComplete = true;
        if (this.scene.events) {
          this.scene.events.emit('assetsLoaded');
        }
      }
    }, 5000); // 5 seconds timeout
    
    // Listen for load completion
    this.scene.load.on('complete', () => {
      console.log('Phaser loader complete event fired');
      clearTimeout(loadTimeout); // Clear the timeout
      if (!this.loadingComplete) {
        this.onLoadComplete();
      }
    });
    
    // Load assets by category
    this.loadImages();
    this.loadSpriteSheets();
    this.loadAudio();
    this.loadFonts();
    
    // Create a single pixel texture for use as a fallback
    this.createPixelTexture();
    
    // Start loading
    console.log('Starting Phaser loader');
    this.scene.load.start();
  }

  /**
   * Create a single pixel texture that can be used for various purposes
   */
  private createPixelTexture(): void {
    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
    graphics.fillStyle(0xFFFFFF);
    graphics.fillRect(0, 0, 1, 1);
    graphics.generateTexture('pixel', 1, 1);
    graphics.destroy();
  }

  /**
   * Handle load completion
   */
  private onLoadComplete(): void {
    try {
      this.loadingComplete = true;
      console.log('All assets loaded, creating animations');
      
      // Create animations
      this.createAnimations();
      
      // Notify scene that assets are loaded
      console.log('Asset loading complete, emitting assetsLoaded event');
      this.scene.events.emit('assetsLoaded');
      
      // Force the scene to proceed if it's stuck
      this.scene.time.delayedCall(1000, () => {
        if (this.scene.scene.isActive('BreakoutScene')) {
          console.log('Scene is still active, checking if game has started');
          // Check if the game has started by looking for active balls
          const ballManager = this.scene['ballManager'];
          if (ballManager) {
            // Use getAllBalls() to check if there are any active balls
            const activeBalls = ballManager.getAllBalls();
            if (!activeBalls || activeBalls.length === 0) {
              console.log('No active balls found, forcing game initialization');
              // Force initialization of game objects if they don't exist
              this.forceGameInitialization();
            }
          }
        }
      });
    } catch (error) {
      console.error('Error in onLoadComplete:', error);
      // Ensure the event is emitted even if there's an error
      this.scene.events.emit('assetsLoaded');
    }
  }

  /**
   * Force game initialization if it appears to be stuck
   */
  private forceGameInitialization(): void {
    try {
      console.log('Forcing game initialization');
      
      // Check if paddle exists and create it if not
      const paddleManager = this.scene['paddleManager'];
      if (paddleManager && (!paddleManager.getPaddles() || paddleManager.getPaddles().length === 0)) {
        console.log('Creating paddles');
        paddleManager.createPaddles();
      }
      
      // Check if ball exists and create it if not
      const ballManager = this.scene['ballManager'];
      if (ballManager && !ballManager.getActiveBall()) {
        console.log('Creating ball');
        ballManager.createBall();
      }
      
      // Check if bricks exist and create them if not
      const brickManager = this.scene['brickManager'];
      if (brickManager && (!brickManager.getBricks() || brickManager.getBricks().getChildren().length === 0)) {
        console.log('Creating bricks');
        // Get market signals from the scene or create default ones if not available
        const marketSignals = this.scene['marketSignals'] || [];
        
        // If no market signals are available, create some default ones
        if (marketSignals.length === 0) {
          console.log('No market signals found, creating default signals');
          // Create some placeholder market signals for level 1 with correct structure
          const defaultSignals = [
            { 
              value: 100, 
              trend: 'up', 
              strength: 1, // Changed from 'strong' to 1
              color: 0xff0000,
              position: 0, // Use numeric position instead of x/y coordinates
              type: 'stock'
            },
            { 
              value: 200, 
              trend: 'down', 
              strength: 0.6, // Changed from 'medium' to 0.6
              color: 0x00ff00,
              position: 1,
              type: 'crypto'
            },
            { 
              value: 150, 
              trend: 'up', 
              strength: 0.3, // Changed from 'weak' to 0.3
              color: 0x0000ff,
              position: 2,
              type: 'forex'
            },
            { 
              value: 120, 
              trend: 'up', 
              strength: 1, // Changed from 'strong' to 1
              color: 0xffff00,
              position: 3,
              type: 'stock'
            },
            { 
              value: 180, 
              trend: 'down', 
              strength: 0.6, // Changed from 'medium' to 0.6
              color: 0xff00ff,
              position: 4,
              type: 'crypto'
            }
          ];
          
          brickManager.createBricksForLevel(1, defaultSignals);
        } else {
          brickManager.createBricksForLevel(1, marketSignals);
        }
      }
      
      // Force UI update using the correct method from UIManager
      const uiManager = this.scene['uiManager'];
      if (uiManager) {
        console.log('Updating UI');
        // Use updateInitialUI which is the correct method in UIManager
        if (typeof uiManager.updateInitialUI === 'function') {
          uiManager.updateInitialUI();
        } else {
          console.log('UIManager.updateInitialUI method not found');
        }
      }
      
      console.log('Forced initialization complete');
    } catch (error) {
      console.error('Error during forced initialization:', error);
    }
  }

  /**
   * Create a loading bar
   */
  private createLoadingBar(): void {
    const { width, height } = this.scene.scale;
    
    // Create loading text (using system font since bitmap font isn't loaded yet)
    const loadingText = this.scene.add.text(
      width / 2,
      height / 2 - 50,
      'LOADING...',
      {
        fontFamily: '"VCR OSD Mono", "Courier New", monospace',
        fontSize: '24px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 1
      }
    );
    loadingText.setOrigin(0.5);
    
    // Create progress bar background
    const progressBarBg = this.scene.add.rectangle(
      width / 2,
      height / 2,
      width / 2,
      20,
      0x222222
    );
    
    // Create progress bar
    const progressBar = this.scene.add.rectangle(
      width / 2 - width / 4,
      height / 2,
      0,
      20,
      0x00ff00
    );
    progressBar.setOrigin(0, 0.5);
    
    // Update progress bar as assets load
    this.scene.load.on('progress', (value: number) => {
      progressBar.width = (width / 2) * value;
    });
    
    // Remove loading bar when assets are loaded
    this.scene.events.once('assetsLoaded', () => {
      loadingText.destroy();
      progressBarBg.destroy();
      progressBar.destroy();
    });
  }
  
  /**
   * Create placeholder assets
   */
  private createPlaceholderAssets(): void {
    // Create a simple texture for the ball
    const ballGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    ballGraphics.fillStyle(0xFFFFFF);
    ballGraphics.fillCircle(16, 16, 16);
    ballGraphics.generateTexture('placeholder_ball', 32, 32);
    ballGraphics.destroy(); // Clean up the graphics object after generating texture
    
    // Create a simple texture for the paddle
    const paddleGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    paddleGraphics.fillStyle(0x0088FF);
    paddleGraphics.fillRect(0, 0, 120, 20);
    paddleGraphics.generateTexture('placeholder_paddle', 120, 20);
    paddleGraphics.destroy();
    
    // Create a vertical paddle placeholder
    const paddleVerticalGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    paddleVerticalGraphics.fillStyle(0x0088FF);
    paddleVerticalGraphics.fillRect(0, 0, 20, 120);
    paddleVerticalGraphics.generateTexture('placeholder_paddle_vertical', 20, 120);
    paddleVerticalGraphics.destroy();
    
    // Create a simple texture for the brick
    const brickGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    brickGraphics.fillStyle(0xFF8800);
    brickGraphics.fillRect(0, 0, 80, 30);
    brickGraphics.generateTexture('placeholder_brick', 80, 30);
    brickGraphics.destroy();
    
    // Create simple textures for powerups
    Object.values(PowerUpType).forEach(type => {
      const powerUpGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      
      // Choose a color based on the power-up type
      let color = 0xFFFFFF;
      switch(type) {
        case PowerUpType.MULTI_BALL: color = 0xFF5500; break;
        case PowerUpType.PADDLE_GROW: color = 0x00FF00; break;
        case PowerUpType.PADDLE_SHRINK: color = 0xFF0000; break;
        case PowerUpType.SPEED_DOWN: color = 0x0000FF; break;
        case PowerUpType.SPEED_UP: color = 0xFFFF00; break;
        case PowerUpType.EXTRA_LIFE: color = 0xFF00FF; break;
        case PowerUpType.LASER: color = 0x00FFFF; break;
        case PowerUpType.STICKY: color = 0x8800FF; break;
        case PowerUpType.SHIELD: color = 0xFFFFFF; break;
        case PowerUpType.FIREBALL: color = 0xFF8800; break;
        case PowerUpType.SCORE_MULTIPLIER: color = 0x8B5CF6; break;
      }
      
      powerUpGraphics.fillStyle(color);
      powerUpGraphics.fillCircle(16, 16, 16);
      powerUpGraphics.generateTexture(`placeholder_powerup_${type}`, 32, 32);
      powerUpGraphics.destroy();
    });
    
    // Create UI placeholders
    const bgGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    bgGraphics.fillGradientStyle(0x000033, 0x000033, 0x000066, 0x000066, 1);
    bgGraphics.fillRect(0, 0, 800, 600);
    bgGraphics.generateTexture('placeholder_background', 800, 600);
    bgGraphics.destroy();
    
    const buttonGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    buttonGraphics.fillStyle(0x444444);
    buttonGraphics.fillRoundedRect(0, 0, 200, 50, 10);
    buttonGraphics.lineStyle(2, 0x888888);
    buttonGraphics.strokeRoundedRect(0, 0, 200, 50, 10);
    buttonGraphics.generateTexture('placeholder_button', 200, 50);
    buttonGraphics.destroy();
    
    const panelGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    panelGraphics.fillStyle(0x222222, 0.8);
    panelGraphics.fillRoundedRect(0, 0, 400, 300, 20);
    panelGraphics.lineStyle(2, 0x888888);
    panelGraphics.strokeRoundedRect(0, 0, 400, 300, 20);
    panelGraphics.generateTexture('placeholder_panel', 400, 300);
    panelGraphics.destroy();
    
    // Create particle texture
    const particleGraphics = this.scene.make.graphics({ x: 0, y: 0 });
    particleGraphics.fillStyle(0xFFFFFF);
    particleGraphics.fillCircle(4, 4, 4);
    particleGraphics.generateTexture('particle', 8, 8);
    particleGraphics.destroy();
  }
  
  /**
   * Handle missing assets by using placeholders
   */
  private handleMissingAsset(file: any): void {
    const key = file.key;
    console.log(`Using placeholder for missing asset: ${key}`);
    
    try {
      // Helper function to safely replace a texture
      const replaceWithPlaceholder = (originalKey: string, placeholderKey: string) => {
        if (this.scene.textures.exists(placeholderKey)) {
          // Instead of trying to reuse the source image directly, we'll create a new texture
          // by copying the placeholder texture's canvas data
          const placeholderFrame = this.scene.textures.getFrame(placeholderKey);
          
          // Create a new canvas to draw the placeholder texture
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = placeholderFrame.width;
          canvas.height = placeholderFrame.height;
          
          // Draw the placeholder texture to our canvas
          if (context) {
            // Get the source image data and draw it to our canvas
            const sourceCanvas = this.scene.textures.get(placeholderKey).getSourceImage();
            context.drawImage(sourceCanvas as CanvasImageSource, 0, 0);
            
            // Remove any existing texture with the original key
            if (this.scene.textures.exists(originalKey)) {
              this.scene.textures.remove(originalKey);
            }
            
            // Add our new canvas as the texture
            this.scene.textures.addCanvas(originalKey, canvas);
            
            console.log(`Successfully replaced ${originalKey} with placeholder`);
          }
        }
      };
      
      // Handle basic game assets
      if (key === 'ball') {
        replaceWithPlaceholder(key, 'placeholder_ball');
      } else if (key === 'paddle') {
        replaceWithPlaceholder(key, 'placeholder_paddle');
      } else if (key === 'paddle-vertical') {
        replaceWithPlaceholder(key, 'placeholder_paddle_vertical');
      } else if (key === 'brick') {
        replaceWithPlaceholder(key, 'placeholder_brick');
      } else if (key === 'star') {
        // Create a simple star texture directly
        const starGraphics = this.scene.make.graphics({ x: 0, y: 0 });
        starGraphics.fillStyle(0xFFFF00);
        starGraphics.fillCircle(16, 16, 16);
        starGraphics.generateTexture(key, 32, 32);
        starGraphics.destroy();
      } 
      // Handle power-up assets
      else if (key.startsWith('powerup_')) {
        const type = key.replace('powerup_', '');
        replaceWithPlaceholder(key, `placeholder_powerup_${type}`);
      } 
      // Handle UI assets
      else if (key === 'background') {
        replaceWithPlaceholder(key, 'placeholder_background');
      } else if (key === 'button') {
        replaceWithPlaceholder(key, 'placeholder_button');
      } else if (key === 'panel') {
        replaceWithPlaceholder(key, 'placeholder_panel');
      } 
      // Handle sprite sheets
      else if (key === 'explosion') {
        // Create a simple explosion animation with 4 frames
        const explosionGraphics = this.scene.make.graphics({ x: 0, y: 0 });
        
        // Frame 1: small circle
        explosionGraphics.fillStyle(0xFF8800);
        explosionGraphics.fillCircle(32, 32, 10);
        
        // Frame 2: medium circle
        explosionGraphics.fillStyle(0xFF4400);
        explosionGraphics.fillCircle(32+64, 32, 20);
        
        // Frame 3: large circle
        explosionGraphics.fillStyle(0xFF0000);
        explosionGraphics.fillCircle(32+128, 32, 30);
        
        // Frame 4: fading circle
        explosionGraphics.fillStyle(0x880000);
        explosionGraphics.fillCircle(32+192, 32, 25);
        
        explosionGraphics.generateTexture(key, 256, 64);
        explosionGraphics.destroy();
        
        // Create the animation from the spritesheet
        if (!this.scene.anims.exists('explode')) {
          this.scene.anims.create({
            key: 'explode',
            frames: this.scene.anims.generateFrameNumbers(key, { start: 0, end: 3 }),
            frameRate: 10,
            repeat: 0
          });
        }
      }
      // For audio assets, we don't need to create placeholders as they're optional
      else if (key === 'bounce' || key === 'break' || key === 'powerup') {
        // Just mark the file as complete so the game doesn't stall waiting for it
        file.state = Phaser.Loader.FILE_COMPLETE;
      }
      // For font assets, create a simple placeholder
      else if (key === 'main-font') {
        // For bitmap fonts, it's complex to create placeholders
        // Just mark as complete and the game will use system fonts instead
        file.state = Phaser.Loader.FILE_COMPLETE;
        
        // Let the game know to use system fonts as fallback
        this.scene.registry.set('useFallbackFonts', true);
      } else {
        // For any other assets we don't handle specifically, mark as complete
        console.log(`No specific placeholder handling for ${key}, marking as complete`);
        file.state = Phaser.Loader.FILE_COMPLETE;
      }
    } catch (error) {
      console.error(`Error creating placeholder for ${key}:`, error);
      // Mark the file as complete to avoid stalling the loader
      file.state = Phaser.Loader.FILE_COMPLETE;
    }
  }
    
  /**
   * Load image assets
   */
  private loadImages(): void {
    // Set base URL for assets if it exists
    if (ASSETS.BASE_URL) {
      this.scene.load.setBaseURL(ASSETS.BASE_URL);
    }
    
    // Load background
    if (ASSETS.IMAGES?.BACKGROUND) {
      this.scene.load.image('background', ASSETS.IMAGES.BACKGROUND);
    }
    
    // Load ball
    if (ASSETS.IMAGES?.BALL) {
      this.scene.load.image('ball', ASSETS.IMAGES.BALL);
    } else {
      this.scene.load.image('ball', 'ball.svg');
    }
    
    // Load paddle
    if (ASSETS.IMAGES?.PADDLE) {
      this.scene.load.image('paddle', ASSETS.IMAGES.PADDLE);
    } else {
      this.scene.load.image('paddle', 'paddle.svg');
    }
    
    // Load vertical paddle if available
    if (ASSETS.IMAGES?.PADDLE_VERTICAL) {
      this.scene.load.image('paddle-vertical', ASSETS.IMAGES.PADDLE_VERTICAL);
    }
    
    // Load brick
    if (ASSETS.IMAGES?.BRICK) {
      this.scene.load.image('brick', ASSETS.IMAGES.BRICK);
    } else {
      this.scene.load.image('brick', 'brick.svg');
    }
    
    // Load star
    if (ASSETS.IMAGES?.STAR) {
      this.scene.load.image('star', ASSETS.IMAGES.STAR);
    }
    
    // Map PowerUpType enum values to the correct file names
    const powerUpFileMap: Record<string, string> = {
      'multiball': 'powerup_MULTI_BALL.svg',
      'expand': 'powerup_PADDLE_GROW.svg',
      'shrink': 'powerup_PADDLE_SHRINK.svg',
      'slow': 'powerup_SPEED_DOWN.svg',
      'fast': 'powerup_SPEED_UP.svg',
      'extraLife': 'powerup_EXTRA_LIFE.svg',
      'laser': 'powerup_LASER.svg',
      'sticky': 'powerup_STICKY.svg',
      'shield': 'powerup_SHIELD.svg',
      'fireball': 'powerup_FIREBALL.svg',
      'scoreMultiplier': 'powerup_SCORE_MULTIPLIER.svg'
    };
    
    // Load power-up images with the correct mapping
    Object.entries(powerUpFileMap).forEach(([powerUpKey, fileName]) => {
      this.scene.load.image(`powerup_${powerUpKey}`, fileName);
    });
    
    // Load UI elements
    if (ASSETS.IMAGES?.PANEL) {
      this.scene.load.image('panel', ASSETS.IMAGES.PANEL);
    }
    
    if (ASSETS.IMAGES?.BUTTON) {
      this.scene.load.image('button', ASSETS.IMAGES.BUTTON);
    }
  }
  
  /**
   * Load sprite sheets
   */
  private loadSpriteSheets(): void {
    // Load brick spritesheet with different colors
    // Fix: Check if BRICKS exists before accessing it
    const defaultBricksConfig = {
      KEY: 'bricks.svg',
      FRAME_WIDTH: 80,
      FRAME_HEIGHT: 30
    };
    
    const bricksConfig = ASSETS.SPRITESHEETS?.BRICKS || defaultBricksConfig;
    
    this.scene.load.spritesheet(
      'bricks',
      bricksConfig.KEY,
      {
        frameWidth: bricksConfig.FRAME_WIDTH,
        frameHeight: bricksConfig.FRAME_HEIGHT
      }
    );
    
    // Load power-up spritesheet
    // Fix: Check if POWERUPS exists before accessing it
    const defaultPowerupsConfig = {
      KEY: 'powerups.svg',
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32
    };
    
    const powerupsConfig = ASSETS.SPRITESHEETS?.POWERUPS || defaultPowerupsConfig;
    
    this.scene.load.spritesheet(
      'powerups',
      powerupsConfig.KEY,
      {
        frameWidth: powerupsConfig.FRAME_WIDTH,
        frameHeight: powerupsConfig.FRAME_HEIGHT
      }
    );
    
    // Load explosion animation
    if (ASSETS.SPRITESHEETS?.EXPLOSION) {
      this.scene.load.spritesheet(
        'explosion',
        ASSETS.SPRITESHEETS.EXPLOSION.KEY,
        {
          frameWidth: ASSETS.SPRITESHEETS.EXPLOSION.FRAME_WIDTH,
          frameHeight: ASSETS.SPRITESHEETS.EXPLOSION.FRAME_HEIGHT
        }
      );
    }
  }
  
  /**
   * Load audio assets
   */
  private loadAudio(): void {
    // Check if we have the audio placeholders available
    if (window.audioPlaceholders) {
      // Use the placeholders directly
      this.scene.cache.audio.add('bounce', window.audioPlaceholders.bounce);
      this.scene.cache.audio.add('break', window.audioPlaceholders.break);
      this.scene.cache.audio.add('powerup', window.audioPlaceholders.powerup);
    } else {
      // Try to load from files
      if (ASSETS.AUDIO?.BOUNCE) {
        this.scene.load.audio('bounce', ASSETS.AUDIO.BOUNCE);
      } else {
        this.scene.load.audio('bounce', 'sounds/bounce.mp3');
      }
  
      if (ASSETS.AUDIO?.BREAK) {
        this.scene.load.audio('break', ASSETS.AUDIO.BREAK);
      } else {
        this.scene.load.audio('break', 'sounds/break.mp3');
      }
      
      if (ASSETS.AUDIO?.POWERUP) {
        this.scene.load.audio('powerup', ASSETS.AUDIO.POWERUP);
      } else {
        this.scene.load.audio('powerup', 'sounds/powerup.mp3');
      }
      
      // Load background music if available
      if (ASSETS.AUDIO?.MUSIC) {
        this.scene.load.audio('music', ASSETS.AUDIO.MUSIC);
      } else {
        // Music is optional, so we don't need to load a default
        console.log('Background music not specified, will be disabled by default');
      }
    }
  }
  
  /**
   * Load font assets
   */
  private loadFonts(): void {
    // Define the font paths
    const fontTexture = 'font.png';
    const fontXML = 'font.xml';
    
    // Load custom fonts if they exist in ASSETS config, otherwise use our local paths
    if (ASSETS.FONTS?.MAIN) {
      this.scene.load.bitmapFont('main-font', ASSETS.FONTS.MAIN.TEXTURE, ASSETS.FONTS.MAIN.XML);
    } else {
      this.scene.load.bitmapFont('main-font', fontTexture, fontXML);
    }
    
    // Set up error handler for font loading
    this.scene.load.on('loaderror', (fileObj: any) => {
      if (fileObj.key === 'main-font') {
        console.warn('Failed to load bitmap font, will use system font fallback');
        this.scene.registry.set('useFallbackFonts', true);
      }
    });
  }
  
  /**
   * Create animations from loaded spritesheets
   */
  private createAnimations(): void {
    try {
      // Create explosion animation
      if (this.scene.textures.exists('explosion')) {
        if (!this.scene.anims.exists('explode')) {
          this.scene.anims.create({
            key: 'explode',
            frames: this.scene.anims.generateFrameNumbers('explosion', { start: 0, end: 5 }),
            frameRate: 10,
            repeat: 0
          });
        }
      }
      
      // Create power-up animations
      if (this.scene.textures.exists('powerups')) {
        // Create animation for each power-up type
        const powerUpTypes = ['multiball', 'expand', 'shrink', 'slow', 'fast', 'extraLife', 'laser'];
        
        powerUpTypes.forEach((type, index) => {
          const animKey = `powerup-${type}`;
          if (!this.scene.anims.exists(animKey)) {
            this.scene.anims.create({
              key: animKey,
              frames: this.scene.anims.generateFrameNumbers('powerups', { start: index, end: index }),
              frameRate: 1,
              repeat: -1
            });
          }
        });
      }
    } catch (error) {
      console.error('Error creating animations:', error);
    }
  }
}

export default BreakoutAssetLoader;