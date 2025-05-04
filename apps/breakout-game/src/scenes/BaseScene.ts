import * as Phaser from 'phaser';
import EventManager from '../managers/EventManager';
import TimeManager from '../managers/TimeManager';

/**
 * Base scene class with common functionality for all game scenes
 */
abstract class BaseScene extends Phaser.Scene {
  // Common managers
  protected eventManager!: EventManager;
  protected timeManager!: TimeManager;
  
  constructor(config: string | Phaser.Types.Scenes.SettingsConfig) {
    super(config);
  }
  
  /**
   * Initialize common managers used by all scenes
   */
  protected initializeCommonManagers(): void {
    // Create event manager first as other managers depend on it
    this.eventManager = new EventManager(this);
    
    // Create time manager early as it's needed by other managers
    this.timeManager = new TimeManager(this, this.eventManager);
  }
  
  /**
   * Get the event manager
   */
  public getEventManager(): EventManager {
    return this.eventManager;
  }
  
  /**
   * Get the time manager
   */
  public getTimeManager(): TimeManager {
    return this.timeManager;
  }
  
  /**
   * Update common managers
   */
  protected updateCommonManagers(time: number, delta: number): void {
    // Update TimeManager first
    if (this.timeManager) {
      this.timeManager.update(time, delta);
    }
  }
  
  /**
   * Clean up common managers
   */
  protected cleanupCommonManagers(): void {
    // Clean up TimeManager
    if (this.timeManager) {
      this.timeManager.shutdown();
    }
  }
}

export default BaseScene;