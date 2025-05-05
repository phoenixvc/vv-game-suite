/**
 * UIThemeIntegration
 * Handles integration with the game's theming system
 */

import * as Phaser from 'phaser';
import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import UIConstants from './UIConstants';

// Define the custom event interface
interface ThemeChangedEvent extends Event {
  detail?: {
    theme: string;
  };
}

class UIThemeIntegration {
  private scene: BreakoutScene;
  private currentTheme: string = 'default';
  private themeListeners: Map<string, Function[]> = new Map();
  // Store the bound event handler to be able to remove it later
  private themeChangedHandler: (event: ThemeChangedEvent) => void;

  constructor(scene: BreakoutScene) {
    this.scene = scene;
    // Bind the event handler to this instance
    this.themeChangedHandler = this.handleThemeChanged.bind(this);
  }

  /**
   * Initialize theme integration
   */
  public initialize(): void {
    // Set up theme change listeners
    this.setupThemeChangeListeners();
    
    // Apply the initial theme
    this.applyCurrentTheme();
  }

  /**
   * Handle theme changed event
   */
  private handleThemeChanged(event: ThemeChangedEvent): void {
      if (event.detail && event.detail.theme) {
        this.setTheme(event.detail.theme);
      }
  }

  /**
   * Set up listeners for theme change events
   */
  private setupThemeChangeListeners(): void {
    // Listen for theme change events from the settings
    document.addEventListener('theme-changed', this.themeChangedHandler as EventListener);
  }

  /**
   * Set the current theme
   * @param themeName Name of the theme to apply
   */
  public setTheme(themeName: string): void {
    this.currentTheme = themeName;
    this.applyCurrentTheme();
  }
  /**
   * Apply the current theme to all game elements
   */
  private applyCurrentTheme(): void {
    // Apply theme to the game canvas
    this.applyThemeToCanvas();
    
    // Notify all registered components about the theme change
    this.notifyThemeListeners();
  }
  /**
   * Apply theme to the game canvas
   */
  private applyThemeToCanvas(): void {
    const canvas = this.scene.game.canvas;
    
    // Remove all existing theme classes
    // Use the available theme names from COLORS instead of THEMES
    const themeClasses = Object.keys(UIConstants.COLORS)
      .filter(key => typeof UIConstants.COLORS[key] === 'object')
      .map(key => `theme-${key.toLowerCase()}`);
    
    canvas.classList.remove(...themeClasses);
    
    // Add the current theme class
    canvas.classList.add(`theme-${this.currentTheme.toLowerCase()}`);
  }

  /**
   * Register a component to be notified of theme changes
   * @param componentId Unique identifier for the component
   * @param callback Function to call when theme changes
   */
  public registerThemeListener(componentId: string, callback: Function): void {
    if (!this.themeListeners.has(componentId)) {
      this.themeListeners.set(componentId, []);
}

    this.themeListeners.get(componentId)?.push(callback);
  }

  /**
   * Unregister a component from theme change notifications
   * @param componentId Unique identifier for the component
   */
  public unregisterThemeListener(componentId: string): void {
    this.themeListeners.delete(componentId);
  }

  /**
   * Notify all registered components about a theme change
   */
  private notifyThemeListeners(): void {
    this.themeListeners.forEach((callbacks) => {
      callbacks.forEach(callback => {
        try {
          callback(this.currentTheme);
        } catch (error) {
          console.error('Error in theme change callback:', error);
        }
      });
    });
  }

  /**
   * Get theme color based on the current theme
   * @param colorKey Key of the color to get
   */
  public getThemeColor(colorKey: string): string {
    const theme = this.currentTheme.toUpperCase();
    if (UIConstants.COLORS[theme] && UIConstants.COLORS[theme][colorKey]) {
      return UIConstants.COLORS[theme][colorKey];
    }
    
    // Fallback to default theme
    return UIConstants.COLORS.DEFAULT[colorKey] || '#ffffff';
  }

  /**
   * Apply NeuralIquid theme to the game
   */
  public applyNeuralIquidTheme(): void {
    this.setTheme('NEURAL_IQUID');
  }

  /**
   * Clean up resources
   */
  public destroy(): void {
    // Remove event listeners with the properly stored handler
    document.removeEventListener('theme-changed', this.themeChangedHandler as EventListener);
    
    // Clear all theme listeners
    this.themeListeners.clear();
  }
}

export default UIThemeIntegration;