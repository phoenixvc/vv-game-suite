import { PowerUp } from './PowerUp';

// Define WalletType
export type WalletType = 'eth' | 'sol' | 'none' | 'ETH' | 'SOL';

// Define Pixel for visual effects
export interface Pixel {
  x: number;
  y: number;
  color: string;
  alpha: number;
  size: number;
}

// Define PointLossIndicator
export interface PointLossIndicator {
  x: number;
  y: number;
  value: number;
  time: number;
}

// Define PerformanceMetrics with proper types
export interface PerformanceMetrics {
  score?: number;
  highScore?: number;
  lives?: number;
  level?: number;
  gameOver?: boolean;
  gameStarted?: boolean;
  demoMode?: boolean;
  scoreMultiplier?: number;
  powerUpTimeRemaining?: Record<string, number>;
  fps?: number;
  averageFps?: number;
  memoryUsage?: number;
  renderTime?: number;
  updateTime?: number;
  collisionChecks?: number;
  objectsRendered?: number;
  particleCount?: number;
  networkLatency?: number;
  loadTime?: number;
  assetLoadTime?: Record<string, number>;
  inputLatency?: number;
  [key: string]: number | boolean | Record<string, number> | undefined;
}

// Define the complete GameState interface
export interface GameState {
  score: number;
  highScore: number;
  lives: number;
  level: number;
  gameOver: boolean;
  gameStarted: boolean;
  demoMode: boolean;
  scoreMultiplier: number;
  powerUpTimeRemaining: Record<string, number>;
  gamesPlayedToday: number;
  dailyGamesLimit: number;
  lastPlayDate: string;
  showLandingPage: boolean;
  version: string;
  isOverlayVisible: boolean;
  isRestingState: boolean;
  titleRotation: number;
  currentPhase: string;
  signalsCaptured: number;
  vaultHP: number;
  portfolioBalance: number;
  strategy: string;
  educationalProgress: Record<string, boolean>;
  performanceMetrics: PerformanceMetrics;
  angleFactor: number;
  collectedPowerUps: PowerUp[];
}

// Initial state for the game
export const initialGameState: GameState = {
    score: 0,
    highScore: 0,
    lives: 3,
    level: 1,
    gameOver: false,
    gameStarted: false,
  demoMode: true,
    scoreMultiplier: 1,
    powerUpTimeRemaining: {},
  gamesPlayedToday: 0,
  dailyGamesLimit: 3,
  lastPlayDate: "",
  showLandingPage: true,
  version: "1.0.0",
  isOverlayVisible: false,
  isRestingState: true,
  titleRotation: 0,
  currentPhase: "Signal Hunt",
  signalsCaptured: 0,
  vaultHP: 100,
  portfolioBalance: 0,
  strategy: "",
  educationalProgress: {},
  performanceMetrics: {},
  angleFactor: 5,
  collectedPowerUps: []
};

// Define level themes
export const LEVEL_THEMES = [
  ["DeFi Basics", "blue", "Learn about decentralized finance fundamentals"],
  ["Yield Farming", "green", "Explore yield farming strategies"],
  ["NFT Markets", "purple", "Discover the world of non-fungible tokens"],
  ["DAO Governance", "orange", "Understand decentralized autonomous organizations"],
  ["Layer 2 Solutions", "red", "Learn about scaling solutions for blockchains"]
];