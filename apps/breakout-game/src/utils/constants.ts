import { PowerUpType } from "../types/PowerUp";

// Update the color scheme to match the website's theme
export const COLOR = "#61AEEE" // Light blue from the website's "AI-Powered" text
export const HIT_COLOR = "#1E293B" // Darker shade for hit blocks
export const BACKGROUND_COLOR = "#0F172A" // Dark blue background matching the website
export const BALL_COLOR = "#FFFFFF" // Keep white for visibility
export const PADDLE_COLOR = "#61AEEE" // Match the light blue accent color
export const LETTER_SPACING = 1
export const WORD_SPACING = 3

// Update power-up colors to be more consistent with the website theme
export const POWER_UP_COLORS = {
  [PowerUpType.PADDLE_GROW]: "#3B82F6", // Blue
  [PowerUpType.PADDLE_SHRINK]: "#EF4444", // Red
  [PowerUpType.MULTI_BALL]: "#61AEEE", // Light blue
  [PowerUpType.EXTRA_LIFE]: "#10B981", // Green
  [PowerUpType.SCORE_MULTIPLIER]: "#F59E0B", // Amber
  [PowerUpType.SPEED_UP]: "#8B5CF6", // Purple
  [PowerUpType.STICKY]: "#14B8A6", // Teal
  [PowerUpType.SHIELD]: "#A3E635", // Lime
}

// Power-up symbols
export const POWER_UP_SYMBOLS = {
  [PowerUpType.PADDLE_GROW]: "+",
  [PowerUpType.PADDLE_SHRINK]: "-",
  [PowerUpType.MULTI_BALL]: "×",
  [PowerUpType.EXTRA_LIFE]: "♥",
  [PowerUpType.SCORE_MULTIPLIER]: "2×",
  [PowerUpType.SPEED_UP]: "↑",
  [PowerUpType.STICKY]: "≡",
  [PowerUpType.SHIELD]: "○",
}

// Updated themes for different levels to be more finance/crypto related
export const LEVEL_THEMES = [
  ["TEZOS", "BLOCKCHAIN"],
  ["SMART", "CONTRACTS"],
  ["LIQUIDITY", "POOLS"],
  ["YIELD", "FARMING"],
  ["DEFI", "TRADING"],
  ["NFT", "MARKETPLACE"],
  ["STAKING", "REWARDS"],
  ["CRYPTO", "ASSETS"],
  ["TOKEN", "EXCHANGE"],
]

// Fixed time step for physics updates (in ms)
export const PHYSICS_TIME_STEP = 16.67 // ~60 FPS

// New constants for game phases
export const GAME_PHASES = {
  SIGNAL_HUNT: "Signal Hunt",
  VAULT_DEFENSE: "Vault Defense",
  STRATEGY_DECISION: "Strategy Decision",
}

// New constants for educational elements
export const EDUCATIONAL_ELEMENTS = {
  SIGNAL_CAPTURE: "Signal Capture",
  VAULT_DEFENSE: "Vault Defense",
  STRATEGY_DECISION: "Strategy Decision",
}

// New constants for performance metrics
export const PERFORMANCE_METRICS = {
  SIGNAL_ACCURACY: "Signal Accuracy",
  VAULT_HP: "Vault HP",
  PORTFOLIO_BALANCE: "Portfolio Balance",
}

// Define power-up types using our PowerUpType enum
export const POWER_UP_TYPES = [
  PowerUpType.EXTRA_LIFE,
  PowerUpType.PADDLE_GROW,
  PowerUpType.PADDLE_SHRINK,
  PowerUpType.MULTI_BALL,
  PowerUpType.SPEED_UP,
  PowerUpType.STICKY,
  PowerUpType.LASER,
  PowerUpType.SHIELD,
  PowerUpType.SCORE_MULTIPLIER
];

// Define power-up sprites
export const POWER_UP_SPRITES = {
  [PowerUpType.EXTRA_LIFE]: 'powerup_extraLife',
  [PowerUpType.PADDLE_GROW]: 'powerup_paddleGrow',
  [PowerUpType.PADDLE_SHRINK]: 'powerup_paddleShrink',
  [PowerUpType.MULTI_BALL]: 'powerup_multiBall',
  [PowerUpType.SPEED_UP]: 'powerup_speedUp',
  [PowerUpType.STICKY]: 'powerup_sticky',
  [PowerUpType.LASER]: 'powerup_laser',
  [PowerUpType.SHIELD]: 'powerup_shield',
  [PowerUpType.SCORE_MULTIPLIER]: 'powerup_scoreMultiplier'
};

// Define power-up effects
export const POWER_UP_EFFECTS = {
  [PowerUpType.EXTRA_LIFE]: (game) => game.addLife(),
  [PowerUpType.PADDLE_GROW]: (game) => {
    game.paddle.setScale(1.5, 1);
    game.setPowerUpTimer(PowerUpType.PADDLE_GROW, 10000); // 10 seconds
  },
  [PowerUpType.PADDLE_SHRINK]: (game) => {
    game.paddle.setScale(0.5, 1);
    game.setPowerUpTimer(PowerUpType.PADDLE_SHRINK, 10000); // 10 seconds
  },
  [PowerUpType.MULTI_BALL]: (game) => game.addMultiBall(),
  [PowerUpType.SPEED_UP]: (game) => {
    game.ball.setVelocity(game.ball.body.velocity.x * 1.5, game.ball.body.velocity.y * 1.5);
    game.setPowerUpTimer(PowerUpType.SPEED_UP, 10000); // 10 seconds
  },
  [PowerUpType.STICKY]: (game) => {
    game.paddle.setSticky(true);
    game.setPowerUpTimer(PowerUpType.STICKY, 10000); // 10 seconds
  },
  [PowerUpType.LASER]: (game) => game.enableLaser(),
  [PowerUpType.SHIELD]: (game) => game.addShield(),
  [PowerUpType.SCORE_MULTIPLIER]: (game) => {
    game.scoreMultiplier = 2;
    game.setPowerUpTimer(PowerUpType.SCORE_MULTIPLIER, 10000); // 10 seconds
  }
};

// New constants for market data types
export const MARKET_DATA_TYPES = {
  PRICE: 'price',
  VOLUME: 'volume',
  LIQUIDITY: 'liquidity',
  TREND: 'trend'
};

// New constants for integration points
export const INTEGRATION_POINTS = {
  BLOCK_TYPES: 'blockTypes',
  BLOCK_COLORS: 'blockColors',
  BLOCK_BEHAVIORS: 'blockBehaviors',
  SPECIAL_EVENTS: 'specialEvents',
  POWER_UPS: 'powerUps',
  DATA_OVERLAYS: 'dataOverlays',
  DIFFICULTY_ADJUSTMENT: 'difficultyAdjustment',
  REWARDS: 'rewards'
};