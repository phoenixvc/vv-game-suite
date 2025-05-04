import * as Phaser from 'phaser';
import { ASSETS } from '../../constants/GameConstants';
import { PowerUpType } from '../../types/PowerUp';
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
 * Handles asset loading for the Breakout scene
 */
class BreakoutAssetLoader {
  private scene: BreakoutScene;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
  }
  
  /**
   * Load all assets needed for the Breakout scene
   */
  public loadAssets(): void {
    // Create placeholder assets for missing files
    this.createPlaceholderAssets();
    
    this.loadImages();
    this.loadSpriteSheets();
    this.loadAudio();
    this.loadFonts();
    
    // Add error handler for missing assets
    this.scene.load.on('loaderror', (file: any) => {
      console.warn(`Failed to load asset: ${file.key}. Using placeholder.`);
      this.handleMissingAsset(file);
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
}
  
  /**
   * Handle missing assets by using placeholders
   */
  private handleMissingAsset(file: any): void {
    const key = file.key;
    
    // Handle basic game assets
    if (key === 'ball') {
      // Use the alternative approach that recreates textures directly
      this.scene.textures.remove(key);
      const ballGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      ballGraphics.fillStyle(0xFFFFFF);
      ballGraphics.fillCircle(16, 16, 16);
      ballGraphics.generateTexture(key, 32, 32);
      ballGraphics.destroy();
    } else if (key === 'paddle') {
      this.scene.textures.remove(key);
      const paddleGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      paddleGraphics.fillStyle(0x0088FF);
      paddleGraphics.fillRect(0, 0, 120, 20);
      paddleGraphics.generateTexture(key, 120, 20);
      paddleGraphics.destroy();
    } else if (key === 'paddle-vertical') {
      this.scene.textures.remove(key);
      const paddleVerticalGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      paddleVerticalGraphics.fillStyle(0x0088FF);
      paddleVerticalGraphics.fillRect(0, 0, 20, 120);
      paddleVerticalGraphics.generateTexture(key, 20, 120);
      paddleVerticalGraphics.destroy();
    } else if (key === 'brick') {
      this.scene.textures.remove(key);
      const brickGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      brickGraphics.fillStyle(0xFF8800);
      brickGraphics.fillRect(0, 0, 80, 30);
      brickGraphics.generateTexture(key, 80, 30);
      brickGraphics.destroy();
    } else if (key === 'star') {
      this.scene.textures.remove(key);
      const starGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      starGraphics.fillStyle(0xFFFF00);
      // Draw a simple star shape
      starGraphics.fillCircle(16, 16, 16);
      starGraphics.generateTexture(key, 32, 32);
      starGraphics.destroy();
    } 
    // Handle power-up assets
    else if (key.startsWith('powerup_')) {
      this.scene.textures.remove(key);
      const type = key.replace('powerup_', '');
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
      powerUpGraphics.generateTexture(key, 32, 32);
      powerUpGraphics.destroy();
    } 
    // Handle UI assets
    else if (key === 'background') {
      this.scene.textures.remove(key);
      const bgGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      bgGraphics.fillGradientStyle(0x000033, 0x000033, 0x000066, 0x000066, 1);
      bgGraphics.fillRect(0, 0, 800, 600);
      bgGraphics.generateTexture(key, 800, 600);
      bgGraphics.destroy();
    } else if (key === 'button') {
      this.scene.textures.remove(key);
      const buttonGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      buttonGraphics.fillStyle(0x444444);
      buttonGraphics.fillRoundedRect(0, 0, 200, 50, 10);
      buttonGraphics.lineStyle(2, 0x888888);
      buttonGraphics.strokeRoundedRect(0, 0, 200, 50, 10);
      buttonGraphics.generateTexture(key, 200, 50);
      buttonGraphics.destroy();
    } else if (key === 'panel') {
      this.scene.textures.remove(key);
      const panelGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      panelGraphics.fillStyle(0x222222, 0.8);
      panelGraphics.fillRoundedRect(0, 0, 400, 300, 20);
      panelGraphics.lineStyle(2, 0x888888);
      panelGraphics.strokeRoundedRect(0, 0, 400, 300, 20);
      panelGraphics.generateTexture(key, 400, 300);
      panelGraphics.destroy();
    } 
    // Handle sprite sheets
    else if (key === 'explosion') {
      this.scene.textures.remove(key);
      const explosionGraphics = this.scene.make.graphics({ x: 0, y: 0 });
      
      // Create a simple explosion animation with 4 frames
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
    }
  }
  
  /**
   * Load image assets
   */
  private loadImages(): void {
    // Set base URL for assets
    this.scene.load.setBaseURL(ASSETS.BASE_URL);
    
    // Load basic game images
    this.scene.load.image('ball', ASSETS.IMAGES.BALL);
    this.scene.load.image('paddle', ASSETS.IMAGES.PADDLE);
    this.scene.load.image('paddle-vertical', ASSETS.IMAGES.PADDLE_VERTICAL);
    this.scene.load.image('brick', ASSETS.IMAGES.BRICK);
    this.scene.load.image('star', ASSETS.IMAGES.STAR);
    
    // Load power-up images
    Object.values(PowerUpType).forEach(type => {
      this.scene.load.image(`powerup_${type}`, `powerup_${type}.svg`);
    });
    
    // Load UI elements if they exist
    if (ASSETS.IMAGES.BACKGROUND) {
      this.scene.load.image('background', ASSETS.IMAGES.BACKGROUND);
    }
    
    if (ASSETS.IMAGES.BUTTON) {
      this.scene.load.image('button', ASSETS.IMAGES.BUTTON);
    }
    
    if (ASSETS.IMAGES.PANEL) {
      this.scene.load.image('panel', ASSETS.IMAGES.PANEL);
    }
  }

  /**
   * Load sprite sheets
   */
  private loadSpriteSheets(): void {
    // Load any sprite sheets needed for animations
    if (ASSETS.SPRITESHEETS?.EXPLOSION) {
      this.scene.load.spritesheet('explosion', ASSETS.SPRITESHEETS.EXPLOSION.KEY, {
        frameWidth: ASSETS.SPRITESHEETS.EXPLOSION.FRAME_WIDTH,
        frameHeight: ASSETS.SPRITESHEETS.EXPLOSION.FRAME_HEIGHT
      });
    }
  }
  
  /**
   * Load audio assets
   */
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
    // Try to load from files as before
    if (ASSETS.AUDIO?.BOUNCE) {
      this.scene.load.audio('bounce', ASSETS.AUDIO.BOUNCE);
    }

    if (ASSETS.AUDIO?.BREAK) {
      this.scene.load.audio('break', ASSETS.AUDIO.BREAK);
    }
    
    if (ASSETS.AUDIO?.POWERUP) {
      this.scene.load.audio('powerup', ASSETS.AUDIO.POWERUP);
    }
  }
}
  
  /**
   * Load font assets
   */
  private loadFonts(): void {
    // Define the font paths
    const fontTexture = 'assets/games/breakout/font.png';
    const fontXML = 'assets/games/breakout/font.xml';
    
    // Load custom fonts if they exist in ASSETS config, otherwise use our local paths
    if (ASSETS.FONTS?.MAIN) {
      this.scene.load.bitmapFont('main-font', ASSETS.FONTS.MAIN.TEXTURE, ASSETS.FONTS.MAIN.XML);
    } else {
      this.scene.load.bitmapFont('main-font', fontTexture, fontXML);
    }
  }
}

export default BreakoutAssetLoader;