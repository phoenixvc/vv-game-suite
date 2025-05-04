/**
 * Game Constants
 * Central location for all game constants and configuration values
 */

// Physics constants
export const PHYSICS = {
  // Matter.js collision categories
  COLLISION: {
    BALL: 0x0001,
    PADDLE: 0x0002,
    BRICK: 0x0004,
    POWERUP: 0x0008,
    WALL: 0x0010,
    LASER: 0x0020,
    SHIELD: 0x0040,
  },
  
  // Ball physics
  BALL: {
    INITIAL_VELOCITY: 300,
    MAX_VELOCITY: 800,
    MIN_VELOCITY: 150,
    VELOCITY_INCREMENT: 25,
  },
  
  // Paddle physics
  PADDLE: {
    MOVE_SPEED: 500,
    FRICTION: 0.1,
    RESTITUTION: 1.05,
  }
};

// Game layout constants
export const LAYOUT = {
  BRICK: {
    ROWS: 5,
    COLS: 10,
    WIDTH: 80,
    HEIGHT: 30,
    START_Y: 100,
  },
  
  PADDLE: {
    WIDTH: 120,
    HEIGHT: 20,
  },
  
  BALL: {
    RADIUS: 10,
  },
};

// Game state constants
export const GAME_STATE = {
  INITIAL_LIVES: 3,
  SCORE_MULTIPLIER: 10,
  DEFAULT_ANGLE_FACTOR: 5,
};

// Time constants (in milliseconds)
export const TIME = {
  POWERUP_SPAWN_INTERVAL: 10000,
  LEVEL_TRANSITION_DELAY: 2000,
  BALL_LAUNCH_DELAY: 1000,
  GAME_TICK_RATE: 16.67, // ~60 FPS
};

// Asset paths
export const ASSETS = {
  BASE_URL: '/assets/games/breakout/',
  IMAGES: {
    BALL: 'ball.svg',
    PADDLE: 'paddle.svg',
    PADDLE_VERTICAL: 'paddle-vertical.svg',
    BRICK: 'brick.svg',
    STAR: 'star.svg',
    BACKGROUND: 'background.svg',
    BUTTON: 'button.svg',
    PANEL: 'panel.svg',
  },
  SPRITESHEETS: {
    EXPLOSION: {
      KEY: 'explosion.svg',
      FRAME_WIDTH: 64,
      FRAME_HEIGHT: 64
    }
  },
  AUDIO: {
    BOUNCE: 'bounce.mp3',
    BREAK: 'break.mp3',
    POWERUP: 'powerup.mp3'
  },
  FONTS: {
    MAIN: {
      TEXTURE: 'font.png',
      XML: 'font.xml'
    }
  }
};

// Default market simulation data
export const DEFAULT_MARKET_DATA = {
  price: 1000,
  volume: 500,
  trend: 'bullish'
};