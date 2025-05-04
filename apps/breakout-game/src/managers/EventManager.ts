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
   * Set up common event listeners for the game
   */
  public setupEventListeners(): void {
    // Set up logging for important events in development
    if (process.env.NODE_ENV === 'development') {
      this.setEventLogging(true);
  }

    // Set up core game event handlers
    this.setupCoreGameEvents();
    
    // Set up UI-related event handlers
    this.setupUIEvents();
    
    // Set up gameplay event handlers
    this.setupGameplayEvents();
  }
  
  /**
   * Set up core game event handlers
   */
  private setupCoreGameEvents(): void {
    // Game state events
    this.on('gameStarted', this.onGameStarted, this);
    this.on('gameOver', this.onGameOver, this);
    this.on('levelComplete', this.onLevelComplete, this);
    this.on('lifeLost', this.onLifeLost, this);
  }

  /**
   * Set up UI-related event handlers
   */
  private setupUIEvents(): void {
    // UI update events
    this.on('scoreUpdated', this.onScoreUpdated, this);
    this.on('livesUpdated', this.onLivesUpdated, this);
  }
  /**
   * Set up gameplay event handlers
   */
  private setupGameplayEvents(): void {
    // Gameplay events
    this.on('ballLaunched', this.onBallLaunched, this);
    this.on('brickDestroyed', this.onBrickDestroyed, this);
    this.on('powerUpCollected', this.onPowerUpCollected, this);
    this.on('powerUpExpired', this.onPowerUpExpired, this);
  }
  
  // Event handler methods
  private onGameStarted(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Game started', data);
}

  private onGameOver(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Game over', data);
  }
  
  private onLevelComplete(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Level complete', data);
  }
  
  private onLifeLost(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Life lost', data);
  }
  
  private onScoreUpdated(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Score updated', data);
  }
  
  private onLivesUpdated(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Lives updated', data);
  }
  
  private onBallLaunched(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Ball launched', data);
    
    // Create particle effect for ball launch
    const particleManager = (this.scene as any).getParticleManager?.();
    if (particleManager && data && data.ball) {
      particleManager.createParticles(data.ball.x, data.ball.y, {
        color: 0xffffff,
        count: 10,
        speed: { min: 30, max: 80 },
        scale: { start: 0.3, end: 0 },
        lifespan: 300
      });
    }
  }
  
  private onBrickDestroyed(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Brick destroyed', data);
    
    // Create particle effect for brick destruction
    if (data && data.x !== undefined && data.y !== undefined) {
      const particleManager = (this.scene as any).getParticleManager?.();
      if (particleManager) {
        let color = 0xffffff;
        if (data.special && data.specialType) {
          // Different colors for special bricks
          switch (data.specialType) {
            case 'explosive': color = 0xff0000; break;
            case 'reinforced': color = 0x888888; break;
            case 'powerup': color = 0x00ff00; break;
            default: color = 0xffffff;
          }
        }
        
        particleManager.createParticles(data.x, data.y, {
          color,
          count: 15,
          speed: { min: 50, max: 150 },
          scale: { start: 0.5, end: 0 },
          lifespan: 600
        });
      }
    }
  }
  
  private onPowerUpCollected(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Power-up collected', data);
    
    // Create particle effect for power-up collection
    if (data && data.x !== undefined && data.y !== undefined) {
      const particleManager = (this.scene as any).getParticleManager?.();
      if (particleManager) {
        particleManager.createExplosion(data.x, data.y, 0x00ffff, 20);
      }
    }
  }
  
  private onPowerUpExpired(data?: any): void {
    if (this.eventLog) console.log('[EventManager] Power-up expired', data);
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
  
  /**
   * Clean up all event listeners
   */
  public cleanup(): void {
    // Remove all listeners
    this.removeAllListeners();
    
    // Log cleanup
    if (this.eventLog) {
      console.log('[EventManager] Cleaned up all event listeners');
    }
  }
}

export default EventManager;