import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import ParticleEffectsConfig from '@/config/ParticleEffectsConfig';
import { createNeuralIquidTheme } from './NeuralIquidThemeIntegration';

/**
 * Theme configuration interface
 */
interface ThemeConfig {
  wallColor: number;
  name: string;
  backgroundColor: number;
  textColor: string;
  accentColor: string;
  particleColor: number;
  ballColor: number;
  paddleColor: number;
  uiColor: string;
  brickColors: {
    [key: string]: number;
  };
  filters?: Phaser.Renderer.WebGL.Pipelines.PostFXPipeline[];
}

/**
 * ThemeManager - Manages visual themes for the breakout game
 */
class ThemeManager {
  private scene: BreakoutScene;
  private themes: ThemeConfig[];
  private currentThemeIndex: number = 0;
  
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.themes = this.createThemes();
    this.setupEventListeners();
  }
  
  /**
   * Create the available themes
   */
  private createThemes(): ThemeConfig[] {
    // Add the NeuralIquid theme to the existing themes
    return [
      {
        name: 'Default',
        backgroundColor: 0x221e30,
        textColor: '#ffffff',
        accentColor: '#ffff00',
        particleColor: 0xffffff,
        ballColor: 0xffffff,
        paddleColor: 0x00ffff,
        uiColor: '#ffff00',
        wallColor: 0x0000ff,
        brickColors: {
          standard: 0xffffff,
          explosive: 0xff0000,
          reinforced: 0x888888,
          powerup: 0x00ff00,
          indestructible: 0x444444
        }
      },
      {
        name: 'Night',
        backgroundColor: 0x000022,
        textColor: '#8080ff',
        accentColor: '#4040ff',
        particleColor: 0x8080ff,
        ballColor: 0x8080ff,
        paddleColor: 0x4040ff,
        uiColor: '#8080ff',
        wallColor: 0x2020aa,
        brickColors: {
          standard: 0x4040ff,
          explosive: 0xff4040,
          reinforced: 0x606060,
          powerup: 0x40ff40,
          indestructible: 0x303030
        }
      },
      {
        name: 'Retro',
        backgroundColor: 0x002200,
        textColor: '#00ff00',
        accentColor: '#00aa00',
        particleColor: 0x00ff00,
        ballColor: 0x00ff00,
        paddleColor: 0x00aa00,
        uiColor: '#00ff00',
        wallColor: 0x008800,
        brickColors: {
          standard: 0x00ff00,
          explosive: 0xff0000,
          reinforced: 0x555555,
          powerup: 0xffff00,
          indestructible: 0x222222
        }
      },
      {
        name: 'Future',
        backgroundColor: 0x001a33,
        textColor: '#00ffff',
        accentColor: '#0088ff',
        particleColor: 0x00ffff,
        ballColor: 0x00ffff,
        paddleColor: 0x0088ff,
        uiColor: '#00ffff',
        wallColor: 0x0066cc,
        brickColors: {
          standard: 0x00ffff,
          explosive: 0xff6600,
          reinforced: 0x7799aa,
          powerup: 0x66ff66,
          indestructible: 0x336699
        }
      },
      {
        name: 'Neon',
        backgroundColor: 0x330033,
        textColor: '#ff00ff',
        accentColor: '#aa00aa',
        particleColor: 0xff00ff,
        ballColor: 0xff00ff,
        paddleColor: 0xaa00aa,
        uiColor: '#ff00ff',
        wallColor: 0x880088,
        brickColors: {
          standard: 0xff00ff,
          explosive: 0xff6600,
          reinforced: 0xaa66aa,
          powerup: 0x66ff66,
          indestructible: 0x663366
  }
      },
      // Add the NeuralIquid theme
      createNeuralIquidTheme() as ThemeConfig
    ];
  }
  
  /**
   * Set up event listeners for theme-related events
   */
  private setupEventListeners(): void {
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.on('themeChangeRequested', this.nextTheme, this);
    }
  }
  
  /**
   * Apply the current theme to the game
   */
  public applyCurrentTheme(): void {
    const theme = this.getCurrentTheme();
    
    // Set background color
    this.scene.cameras.main.setBackgroundColor(theme.backgroundColor);
    
    // Emit theme changed event
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.emit('themeChanged', { theme: theme.name });
    }
    
    // Apply theme to game objects
    this.applyThemeToGameObjects(theme);
  }
  
  /**
   * Apply theme to game objects
   */
  private applyThemeToGameObjects(theme: ThemeConfig): void {
    // Apply to balls
    const ballManager = this.scene.getBallManager?.();
    if (ballManager) {
      ballManager.updateBallColors(theme.ballColor);
    }
    
    // Apply to paddles
    const paddleManager = this.scene.getPaddleManager?.();
    if (paddleManager) {
      paddleManager.updatePaddleColors(theme.paddleColor);
    }
    
    // Apply to bricks
    const brickManager = this.scene.getBrickManager?.();
    if (brickManager) {
      brickManager.updateBrickColors(theme.brickColors);
    }
    
    // Apply to particles
    const particleManager = this.scene.getParticleManager?.();
    if (particleManager) {
      particleManager.updateParticleColors(theme.particleColor);
    }
    
    // Apply to walls if they exist
    this.updateWallColors(theme.wallColor);
    
    // Apply additional NeuralIquid specific styling if it's the current theme
    if (theme.name === 'NeuralIquid') {
      this.applyNeuralIquidSpecificStyling();
    }
  }
  
  /**
   * Apply NeuralIquid-specific styling to game elements
   */
  private applyNeuralIquidSpecificStyling(): void {
    try {
      // Apply to UI elements
      const uiManager = this.scene.getUIManager?.();
      if (uiManager) {
        // Use any NeuralIquid-specific UI styling methods
        if (typeof uiManager['applyNeuralIquidTheme'] === 'function') {
          uiManager['applyNeuralIquidTheme']();
  }
      }
  
      // Apply gradient effects to any special elements
      this.applyGradientEffects();
      
    } catch (error) {
      console.warn('Error applying NeuralIquid specific styling:', error);
    }
  }
  
  /**
   * Apply gradient effects to special game elements
   */
  private applyGradientEffects(): void {
    try {
      // This would be implemented based on the specific game elements
      // that should have gradient effects in the NeuralIquid theme
    } catch (error) {
      console.warn('Error applying gradient effects:', error);
    }
  }
  
  /**
   * Update wall colors based on the current theme
   */
  private updateWallColors(color: number): void {
    try {
      // Try to access vault walls if they exist
      if (this.scene && typeof this.scene['vaultWalls'] === 'object' && Array.isArray(this.scene['vaultWalls'])) {
        const walls = this.scene['vaultWalls'];
        walls.forEach(wall => {
          if (wall && typeof wall.setTint === 'function') {
            wall.setTint(color);
          }
        });
      }
    } catch (error) {
      console.warn('Error updating wall colors:', error);
    }
  }
  
  /**
   * Switch to the next theme
   */
  public nextTheme(): void {
    this.currentThemeIndex = (this.currentThemeIndex + 1) % this.themes.length;
    this.applyCurrentTheme();
    }
  
  /**
   * Switch to the previous theme
   */
  public previousTheme(): void {
    this.currentThemeIndex = (this.currentThemeIndex - 1 + this.themes.length) % this.themes.length;
    this.applyCurrentTheme();
  }
  
  /**
   * Set theme by name
   * @param themeName Name of the theme to set
   * @returns True if theme was found and set, false otherwise
   */
  public setThemeByName(themeName: string): boolean {
    const index = this.themes.findIndex(theme => theme.name === themeName);
    if (index !== -1) {
      this.currentThemeIndex = index;
      this.applyCurrentTheme();
      return true;
}
    return false;
  }

  /**
   * Get the current theme
   */
  public getCurrentTheme(): ThemeConfig {
    return this.themes[this.currentThemeIndex];
  }
  
  /**
   * Get all available themes
   */
  public getThemes(): ThemeConfig[] {
    return this.themes;
  }
  
  /**
   * Get theme names
   */
  public getThemeNames(): string[] {
    return this.themes.map(theme => theme.name);
  }
  
  /**
   * Get particle color for the current theme
   */
  public getParticleColor(type: string): number {
    const theme = this.getCurrentTheme();
    
    // Try to get specific particle color from ParticleEffectsConfig
    try {
      const pathParts = type.split('.');
      let config: any = ParticleEffectsConfig;
      
      for (const part of pathParts) {
        if (config[part]) {
          config = config[part];
        } else {
          // If path not found, return theme's default particle color
          return theme.particleColor;
        }
      }
      
      // If we found a color in the config, return it
      if (config && typeof config.color === 'number') {
        return config.color;
      }
    } catch (error) {
      console.warn(`Error getting particle color for ${type}:`, error);
    }
    
    // Default to theme's particle color
    return theme.particleColor;
  }
  
  /**
   * Get brick color based on type for the current theme
   */
  public getBrickColor(brickType: string): number {
    const theme = this.getCurrentTheme();
    return theme.brickColors[brickType] || theme.brickColors.standard;
  }
  
  /**
   * Clean up resources when scene is shut down
   */
  public cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene.getEventManager();
    if (eventManager) {
      eventManager.off('themeChangeRequested', this.nextTheme, this);
    }
  }
}

export default ThemeManager;