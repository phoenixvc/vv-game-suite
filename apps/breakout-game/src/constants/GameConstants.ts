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
    INITIAL_VELOCITY: 50,
    MAX_VELOCITY: 800,
    MIN_VELOCITY: 30,
    VELOCITY_INCREMENT: 5,
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
    // Power-up images
    POWERUP_MULTI_BALL: 'powerup_MULTI_BALL.svg',
    POWERUP_PADDLE_GROW: 'powerup_PADDLE_GROW.svg',
    POWERUP_PADDLE_SHRINK: 'powerup_PADDLE_SHRINK.svg',
    POWERUP_SPEED_DOWN: 'powerup_SPEED_DOWN.svg',
    POWERUP_SPEED_UP: 'powerup_SPEED_UP.svg',
    POWERUP_EXTRA_LIFE: 'powerup_EXTRA_LIFE.svg',
    POWERUP_LASER: 'powerup_LASER.svg',
    POWERUP_STICKY: 'powerup_STICKY.svg',
    POWERUP_SHIELD: 'powerup_SHIELD.svg',
    POWERUP_FIREBALL: 'powerup_FIREBALL.svg',
    POWERUP_SCORE_MULTIPLIER: 'powerup_SCORE_MULTIPLIER.svg',
  },
  SPRITESHEETS: {
    EXPLOSION: {
      KEY: 'explosion.svg',
      FRAME_WIDTH: 64,
      FRAME_HEIGHT: 64
    },
    BRICKS: {
      KEY: 'bricks.svg',
      FRAME_WIDTH: 80,
      FRAME_HEIGHT: 30
  },
    POWERUPS: {
      KEY: 'powerups.svg',
      FRAME_WIDTH: 32,
      FRAME_HEIGHT: 32
    }
  },
  AUDIO: {
    BOUNCE: 'bounce.mp3',
    BREAK: 'break.mp3',
    POWERUP: 'powerup.mp3',
    MUSIC: 'music.mp3'
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

// Game configuration object (used by scene components)
export const GAME_CONFIG = {
  PADDLE: {
    WIDTH: LAYOUT.PADDLE.WIDTH,
    HEIGHT: LAYOUT.PADDLE.HEIGHT,
  },
  BALL: {
    RADIUS: LAYOUT.BALL.RADIUS,
  },
  BRICK: {
    WIDTH: LAYOUT.BRICK.WIDTH,
    HEIGHT: LAYOUT.BRICK.HEIGHT,
  }
};