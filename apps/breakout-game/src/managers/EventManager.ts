import * as Phaser from 'phaser';

/**
 * EventManager - A centralized event management system for the game
 * This class wraps Phaser's event emitter and provides additional functionality
 */
class EventManager {
  private scene: Phaser.Scene;
  private emitter: Phaser.Events.EventEmitter;
  private eventLog: boolean = false;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.emitter = new Phaser.Events.EventEmitter();
  }

  /**
   * Register an event listener
   * @param event Event name
   * @param fn Callback function
   * @param context Context for the callback
   */
  public on(event: string, fn: Function, context?: any): void {
    this.emitter.on(event, fn, context || this);
  }

  /**
   * Register a one-time event listener
   * @param event Event name
   * @param fn Callback function
   * @param context Context for the callback
   */
  public once(event: string, fn: Function, context?: any): void {
    this.emitter.once(event, fn, context || this);
  }

  /**
   * Remove an event listener
   * @param event Event name
   * @param fn Callback function
   * @param context Context for the callback
   */
  public off(event: string, fn?: Function, context?: any): void {
    this.emitter.off(event, fn, context);
  }

  /**
   * Emit an event
   * @param event Event name
   * @param data Event data
   */
  public emit(event: string, data?: any): void {
    if (this.eventLog) {
      console.log(`[EventManager] Event emitted: ${event}`, data);
    }
    
    // Emit on our local emitter
    this.emitter.emit(event, data);
    
    // Also emit on the scene's event emitter for compatibility
    this.scene.events.emit(event, data);
  }

  /**
   * Enable or disable event logging
   * @param enabled Whether to enable logging
   */
  public setEventLogging(enabled: boolean): void {
    this.eventLog = enabled;
  }

  /**
   * Get all registered event listeners
   * @returns Array of event names
   */
  public getRegisteredEvents(): string[] {
    return this.emitter.eventNames() as string[];
  }

  /**
   * Remove all listeners for a specific event
   * @param event Event name
   */
  public removeAllListeners(event?: string): void {
    if (event) {
      this.emitter.removeAllListeners(event);
    } else {
      this.emitter.removeAllListeners();
    }
  }

  /**
   * Check if an event has listeners
   * @param event Event name
   * @returns Whether the event has listeners
   */
  public hasListeners(event: string): boolean {
    return this.emitter.listenerCount(event) > 0;
  }
}

export default EventManager;