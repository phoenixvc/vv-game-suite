import * as Phaser from 'phaser';
import { TIME } from '../constants/GameConstants';
import EventManager from './EventManager';

/**
 * TimeManager handles all time-related operations in the game
 * including timers, cooldowns, and time-based events
 */
export default class TimeManager {
  private scene: Phaser.Scene;
  private eventManager: EventManager;
  private timers: Map<string, Phaser.Time.TimerEvent> = new Map();
  private cooldowns: Map<string, number> = new Map();
  private gameTime: number = 0;
  private isPaused: boolean = false;
  private timeScale: number = 1.0;
  
  constructor(scene: Phaser.Scene, eventManager: EventManager) {
    this.scene = scene;
    this.eventManager = eventManager;
    
    // Listen for pause/resume events
    this.eventManager.on('gamePaused', this.pauseAllTimers, this);
    this.eventManager.on('gameResumed', this.resumeAllTimers, this);
  }
  
  /**
   * Update method called every frame
   * @param time Current game time
   * @param delta Time elapsed since last frame
   */
  public update(time: number, delta: number): void {
    if (this.isPaused) return;
    
    // Update game time
    this.gameTime += delta * this.timeScale;
    
    // Update cooldowns
    this.cooldowns.forEach((value, key) => {
      if (value > 0) {
        this.cooldowns.set(key, value - delta * this.timeScale);
        if (this.cooldowns.get(key)! <= 0) {
          this.eventManager.emit(`cooldown-complete-${key}`);
        }
      }
    });
  }
  
  /**
   * Create a timer that executes a callback after a specified delay
   * @param key Unique identifier for the timer
   * @param delay Delay in milliseconds
   * @param callback Function to call when timer completes
   * @param callbackContext Context for the callback
   * @param repeat Number of times to repeat (-1 for infinite)
   * @returns The timer event
   */
  public createTimer(
    key: string, 
    delay: number, 
    callback: Function, 
    callbackContext?: any, 
    repeat: number = 0
  ): Phaser.Time.TimerEvent {
    // Clear existing timer with the same key if it exists
    this.clearTimer(key);
    
    // Create new timer
    const timer = this.scene.time.addEvent({
      delay: delay,
      callback: callback,
      callbackScope: callbackContext || this,
      repeat: repeat,
      paused: this.isPaused
    });
    
    // Store timer
    this.timers.set(key, timer);
    
    return timer;
  }
  
  /**
   * Clear a timer by key
   * @param key The timer key to clear
   */
  public clearTimer(key: string): void {
    if (this.timers.has(key)) {
      const timer = this.timers.get(key)!;
      timer.remove();
      this.timers.delete(key);
    }
  }
  
  /**
   * Clear all timers
   */
  public clearAllTimers(): void {
    this.timers.forEach((timer) => {
      timer.remove();
    });
    this.timers.clear();
  }
  
  /**
   * Set a cooldown
   * @param key Unique identifier for the cooldown
   * @param duration Duration in milliseconds
   */
  public setCooldown(key: string, duration: number): void {
    this.cooldowns.set(key, duration);
  }
  
  /**
   * Check if a cooldown is active
   * @param key The cooldown key to check
   * @returns True if cooldown is active, false otherwise
   */
  public isCooldownActive(key: string): boolean {
    return this.cooldowns.has(key) && this.cooldowns.get(key)! > 0;
  }
  
  /**
   * Get remaining cooldown time
   * @param key The cooldown key
   * @returns Remaining time in milliseconds or 0 if not active
   */
  public getCooldownRemaining(key: string): number {
    return this.cooldowns.has(key) ? Math.max(0, this.cooldowns.get(key)!) : 0;
  }
  
  /**
   * Clear a cooldown
   * @param key The cooldown key to clear
   */
  public clearCooldown(key: string): void {
    this.cooldowns.delete(key);
  }
  
  /**
   * Set up a power-up timer
   * @param powerUpType The type of power-up
   * @param duration Duration in milliseconds
   * @param onExpire Callback when power-up expires
   * @param context Context for the callback
   */
  public setPowerUpTimer(powerUpType: string, duration: number, onExpire: Function, context?: any): void {
    const timerKey = `powerup-${powerUpType}`;
    this.createTimer(timerKey, duration, onExpire, context || this);
    
    // Emit event for UI updates
    this.eventManager.emit('powerUpActivated', { 
      type: powerUpType, 
      duration: duration,
      remaining: duration
    });
    
    // Create a progress timer that updates every second
    const progressInterval = Math.min(1000, duration / 10);
    this.createTimer(
      `${timerKey}-progress`, 
      progressInterval, 
      () => {
        const remaining = this.getTimerRemaining(timerKey);
        this.eventManager.emit('powerUpProgress', {
          type: powerUpType,
          remaining: remaining,
          duration: duration
        });
      }, 
      this, 
      Math.floor(duration / progressInterval) - 1
    );
  }
  
  /**
   * Get the remaining time for a timer
   * @param key The timer key
   * @returns Remaining time in milliseconds or 0 if timer doesn't exist
   */
  public getTimerRemaining(key: string): number {
    if (!this.timers.has(key)) return 0;
    
    const timer = this.timers.get(key)!;
    return timer.getRemaining();
  }
  
  /**
   * Pause all timers
   */
  public pauseAllTimers(): void {
    this.isPaused = true;
    this.timers.forEach((timer) => {
      timer.paused = true;
    });
  }
  
  /**
   * Resume all timers
   */
  public resumeAllTimers(): void {
    this.isPaused = false;
    this.timers.forEach((timer) => {
      timer.paused = false;
    });
  }
  
  /**
   * Set the time scale (speed up or slow down time)
   * @param scale The time scale factor (1.0 is normal speed)
   */
  public setTimeScale(scale: number): void {
    this.timeScale = Math.max(0.1, Math.min(3.0, scale));
    this.scene.time.timeScale = this.timeScale;
  }
  
  /**
   * Get the current game time
   * @returns Current game time in milliseconds
   */
  public getGameTime(): number {
    return this.gameTime;
  }
  
  /**
   * Schedule a delayed call
   * @param delay Delay in milliseconds
   * @param callback Function to call
   * @param context Context for the callback
   * @returns The timer event
   */
  public delayedCall(delay: number, callback: Function, context?: any): Phaser.Time.TimerEvent {
    return this.scene.time.delayedCall(delay, callback, [], context || this);
  }
  
  /**
   * Clean up resources
   */
  public shutdown(): void {
    this.clearAllTimers();
    this.cooldowns.clear();
    
    // Remove event listeners
    this.eventManager.off('gamePaused', this.pauseAllTimers, this);
    this.eventManager.off('gameResumed', this.resumeAllTimers, this);
  }
}