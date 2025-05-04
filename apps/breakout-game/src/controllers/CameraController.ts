import BreakoutScene from '@/scenes/breakout/BreakoutScene';
import * as Phaser from 'phaser';

/**
 * Controls camera effects like shake, flash, and zoom
 */
class CameraController {
  private scene: BreakoutScene;
  private camera: Phaser.Cameras.Scene2D.Camera;
  private isShaking: boolean = false;
  private effectsEnabled: boolean = true;
    
  constructor(scene: BreakoutScene) {
    this.scene = scene;
    this.camera = scene.cameras.main;
      
    // Set up event listeners
    this.setupEventListeners();
  }
    
  /**
   * Set up event listeners for camera effects
   */
  private setupEventListeners(): void {
    const eventManager = this.scene['eventManager'];
    if (!eventManager) return;
      
    // Listen for events that trigger camera effects
    eventManager.on('brickDestroyed', this.onBrickDestroyed, this);
    eventManager.on('powerUpCollected', this.onPowerUpCollected, this);
    eventManager.on('lifeLost', this.onLifeLost, this);
    eventManager.on('levelComplete', this.onLevelComplete, this);
    eventManager.on('gameOver', this.onGameOver, this);
    
    // Listen for settings changes
    eventManager.on('settingsChanged', this.onSettingsChanged, this);
  }
    
  /**
   * Handle settings changes
   */
  private onSettingsChanged(data: any): void {
    if (data && typeof data.cameraEffects === 'boolean') {
      this.effectsEnabled = data.cameraEffects;
    }
  }
  
  /**
   * Shake camera with configurable intensity and duration
   */
  shake(intensity: number = 0.005, duration: number = 100): void {
    if (!this.effectsEnabled || this.isShaking) return;
      
    this.isShaking = true;
    this.camera.shake(intensity, duration);
      
    // Reset flag when shake completes
    this.scene.time.delayedCall(duration, () => {
      this.isShaking = false;
    });
  }
    
  /**
   * Flash camera with color
   */
  flash(color: number[] = [255, 255, 255], duration: number = 100): void {
    if (!this.effectsEnabled) return;
    this.camera.flash(duration, color[0] / 255, color[1] / 255, color[2] / 255);
  }
    
  /**
   * Zoom camera
   */
  zoom(scale: number, duration: number = 500): void {
    if (!this.effectsEnabled) return;
    this.scene.tweens.add({
      targets: this.camera,
      zoom: scale,
      duration: duration,
      ease: 'Sine.easeInOut',
      yoyo: true
    });
  }
    
  /**
   * Pan camera to position
   */
  panTo(x: number, y: number, duration: number = 1000): void {
    if (!this.effectsEnabled) return;
    
    this.scene.tweens.add({
      targets: this.camera,
      scrollX: x - this.camera.width / 2,
      scrollY: y - this.camera.height / 2,
      duration: duration,
      ease: 'Power2'
    });
  }
    
  /**
   * Reset camera position and zoom
   */
  reset(): void {
    this.camera.setScroll(0, 0);
    this.camera.setZoom(1);
  }
  
  /**
   * Event handlers
   */
  private onBrickDestroyed(data: any): void {
    // Small shake when brick is destroyed
    if (data && data.special) {
      // Stronger effect for special bricks
      this.shake(0.005, 100);
    } else {
      // Subtle effect for normal bricks
      this.shake(0.002, 50);
    }
  }
  
  private onPowerUpCollected(data: any): void {
    if (!data) return;
    // Flash with color based on power-up type
    const colors: Record<string, number[]> = {
      expand: [0, 255, 0],
      shrink: [255, 0, 0],
      multiball: [255, 165, 0],
      laser: [255, 0, 255],
      sticky: [0, 255, 255],
      slow: [0, 0, 255],
      fast: [255, 165, 0],
      extralife: [255, 105, 180]
    };
      
    const color = colors[data.type] || [255, 255, 255];
    this.flash(color, 200);
  }
    
  private onLifeLost(data: any): void {
    // Stronger shake when life is lost
    this.shake(0.01, 200);
    this.flash([255, 0, 0], 300);
  }
    
  private onLevelComplete(data: any): void {
    // Celebration effects
    this.flash([0, 255, 0], 500);
    this.zoom(1.1, 1000);
  }
  
  private onGameOver(data: any): void {
    // Game over effects
    this.shake(0.02, 1000);
    this.flash([255, 0, 0], 1000);
  }
  
  /**
   * Enable or disable camera effects
   */
  setEffectsEnabled(enabled: boolean): void {
    this.effectsEnabled = enabled;
  }
  
  /**
   * Clean up resources
   */
  cleanup(): void {
    // Remove event listeners
    const eventManager = this.scene['eventManager'];
    if (eventManager) {
      eventManager.off('brickDestroyed', this.onBrickDestroyed, this);
      eventManager.off('powerUpCollected', this.onPowerUpCollected, this);
      eventManager.off('lifeLost', this.onLifeLost, this);
      eventManager.off('levelComplete', this.onLevelComplete, this);
      eventManager.off('gameOver', this.onGameOver, this);
      eventManager.off('settingsChanged', this.onSettingsChanged, this);
    }
    
    // Reset camera
    this.reset();
  }
}

export default CameraController;