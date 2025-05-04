import * as Phaser from 'phaser';

/**
 * Paddle orientation - horizontal (top/bottom) or vertical (left/right)
 */
export type PaddleOrientation = 'horizontal' | 'vertical';

/**
 * Paddle position on screen
 */
export type PaddlePosition = 'top' | 'bottom' | 'left' | 'right';

/**
 * Type of control mechanism for the paddle
 */
export type PaddleControlType = 'keyboard' | 'mouse' | 'touch' | 'ai' | 'gamepad';

/**
 * Options for paddle controllers
 */
export interface PaddleControllerOptions {
  /** Type of control for this paddle */
  controlType?: PaddleControlType;
  
  /** Difficulty setting for AI controllers (0-1) */
  difficulty?: number;
  
  /** Movement speed of the paddle */
  speed?: number;
  
  /** Whether the paddle should start as sticky */
  sticky?: boolean;
  
  /** Custom keyboard keys for this paddle */
  keys?: {
    left?: string | number;
    right?: string | number;
    up?: string | number;
    down?: string | number;
  };
}

/**
 * Interface that all paddle controllers must implement
 */
export interface IPaddleController {
  /** Set the paddle sprite this controller will control */
  setPaddle(paddle: Phaser.Physics.Matter.Sprite): void;
  
  /** Get the current paddle sprite */
  getPaddle(): Phaser.Physics.Matter.Sprite | undefined;
  
  /** Update method called each frame */
  update(): void;
  
  /** Set the paddle's stickiness */
  setSticky(isSticky: boolean): void;
  
  /** Check if the paddle is sticky */
  isSticky(): boolean;
  
  /** Set the paddle's movement speed */
  setSpeed(speed: number): void;
  
  /** Clean up resources when no longer needed */
  cleanup(): void;
}

/**
 * Data stored on paddle sprites
 */
export interface PaddleData {
  /** Unique ID for this paddle */
  id: string;
  
  /** Position of this paddle */
  position: PaddlePosition;
  
  /** Which edge of the paddle faces inward */
  edge: 'top' | 'bottom' | 'left' | 'right';
  
  /** Whether this paddle is vertical */
  isVertical: boolean;
  
  /** Whether this paddle is sticky */
  sticky: boolean;
}