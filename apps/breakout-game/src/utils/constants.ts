import { PowerUpType } from "@/types/game-types"

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
  [PowerUpType.PADDLE_SIZE_INCREASE]: "#3B82F6", // Blue
  [PowerUpType.PADDLE_SIZE_DECREASE]: "#EF4444", // Red
  [PowerUpType.MULTI_BALL]: "#61AEEE", // Light blue
  [PowerUpType.EXTRA_LIFE]: "#10B981", // Green
  [PowerUpType.SCORE_MULTIPLIER]: "#F59E0B", // Amber
  [PowerUpType.SLOW_BALL]: "#8B5CF6", // Purple
  [PowerUpType.FAST_BALL]: "#EC4899", // Pink
  [PowerUpType.STICKY_PADDLE]: "#14B8A6", // Teal
  [PowerUpType.GHOST_BALL]: "#A3E635", // Lime
}

// Power-up symbols
export const POWER_UP_SYMBOLS = {
  [PowerUpType.PADDLE_SIZE_INCREASE]: "+",
  [PowerUpType.PADDLE_SIZE_DECREASE]: "-",
  [PowerUpType.MULTI_BALL]: "×",
  [PowerUpType.EXTRA_LIFE]: "♥",
  [PowerUpType.SCORE_MULTIPLIER]: "2×",
  [PowerUpType.SLOW_BALL]: "↓",
  [PowerUpType.FAST_BALL]: "↑",
  [PowerUpType.STICKY_PADDLE]: "≡",
  [PowerUpType.GHOST_BALL]: "○",
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

// Define power-up types
export const POWER_UP_TYPES = [
  'extraLife',
  'paddleGrow',
  'paddleShrink',
  'multiBall',
  'speedUp',
  'sticky',
  'laser',
  'shield'
];

// Define power-up sprites
export const POWER_UP_SPRITES = {
  extraLife: 'powerup_extraLife',
  paddleGrow: 'powerup_paddleGrow',
  paddleShrink: 'powerup_paddleShrink',
  multiBall: 'powerup_multiBall',
  speedUp: 'powerup_speedUp',
  sticky: 'powerup_sticky',
  laser: 'powerup_laser',
  shield: 'powerup_shield'
};

// Define power-up effects
export const POWER_UP_EFFECTS = {
  extraLife: (game) => game.addLife(),
  paddleGrow: (game) => {
    game.paddle.setScale(1.5, 1);
    game.setPowerUpTimer('paddleGrow', 10000); // 10 seconds
  },
  paddleShrink: (game) => {
    game.paddle.setScale(0.5, 1);
    game.setPowerUpTimer('paddleShrink', 10000); // 10 seconds
  },
  multiBall: (game) => game.addMultiBall(),
  speedUp: (game) => {
    game.ball.setVelocity(game.ball.body.velocity.x * 1.5, game.ball.body.velocity.y * 1.5);
    game.setPowerUpTimer('speedUp', 10000); // 10 seconds
  },
  sticky: (game) => {
    game.paddle.setSticky(true);
    game.setPowerUpTimer('sticky', 10000); // 10 seconds
  },
  laser: (game) => game.enableLaser(),
  shield: (game) => game.addShield()
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
