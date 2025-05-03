"use client"

import { useEffect, useMemo } from "react"

import type React from "react"

import { createContext, useContext, useState, useRef, type ReactNode } from "react"
import type { Ball, Paddle, Pixel, PowerUp, PointLossIndicator } from "@/types/game-types"
import { LEVEL_THEMES } from "@/utils/constants"

interface GameState {
  score: number
  highScore: number
  lives: number
  level: number
  gameOver: boolean
  gameStarted: boolean
  demoMode: boolean
  scoreMultiplier: number
  powerUpTimeRemaining: Record<number, number>
  gamesPlayedToday: number
  dailyGamesLimit: number
  lastPlayDate: string
  showLandingPage: boolean
  version: string
  isOverlayVisible: boolean
  isRestingState: boolean
  titleRotation: number
  currentPhase: string
  signalsCaptured: number
  vaultHP: number
  portfolioBalance: number
  strategy: string
  educationalProgress: Record<string, boolean>
  performanceMetrics: Record<string, number>
  angleFactor: number // Added angleFactor property
}

interface GameContextType {
  gameState: GameState
  setGameState: React.Dispatch<React.SetStateAction<GameState>>
  gameStateRef: React.MutableRefObject<GameState>
  pixelsRef: React.MutableRefObject<Pixel[]>
  ballsRef: React.MutableRefObject<Ball[]>
  paddlesRef: React.MutableRefObject<Paddle[]>
  powerUpsRef: React.MutableRefObject<PowerUp[]>
  scaleRef: React.MutableRefObject<number>
  lastMousePosRef: React.MutableRefObject<{ x: number; y: number }>
  mouseSpeedRef: React.MutableRefObject<{ x: number; y: number }>
  pointLossIndicatorsRef: React.MutableRefObject<PointLossIndicator[]>
  deltaTimeRef: React.MutableRefObject<number>
  lastFrameTimeRef: React.MutableRefObject<number>
  walletConnected: boolean
  setWalletConnected: React.Dispatch<React.SetStateAction<boolean>>
  walletBalance: number
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>
  walletType: string
  setWalletType: React.Dispatch<React.SetStateAction<string>>
  highScores: { name: string; score: number }[]
  setHighScores: React.Dispatch<React.SetStateAction<{ name: string; score: number }[]>>
  getCurrentLevelTheme: () => string[]
  buyExtraLife: () => void
  captureSignal: () => void
  takeVaultDamage: (damage: number) => void
  makeStrategyDecision: (strategy: string) => void
  updateEducationalProgress: (topic: string) => void
  updatePerformanceMetrics: (metric: string, value: number) => void
  initializeWallet: (provider: 'metamask'|'phantom') => void
  updatePortfolio: (value: number) => void
  defendVault: () => void
  spawnPowerUp: (x: number, y: number, type: string) => void
  collectPowerUp: (powerUp: PowerUp) => void
  applyPowerUpEffect: (powerUp: PowerUp) => void
  removePowerUpEffect: (powerUp: PowerUp) => void
}

const defaultGameState: GameState = {
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
  version: "1.0.0", // Added version number for release
  isOverlayVisible: false, // Initially hidden
  isRestingState: true, // Initially in resting state
  titleRotation: 0, // Initial rotation angle
  currentPhase: "Signal Hunt",
  signalsCaptured: 0,
  vaultHP: 100,
  portfolioBalance: 0,
  strategy: "",
  educationalProgress: {},
  performanceMetrics: {},
  angleFactor: 5 // Initialized angleFactor
}

const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(defaultGameState)
  const gameStateRef = useRef<GameState>(defaultGameState)
  const pixelsRef = useRef<Pixel[]>([])
  const ballsRef = useRef<Ball[]>([])
  const paddlesRef = useRef<Paddle[]>([])
  const powerUpsRef = useRef<PowerUp[]>([])
  const scaleRef = useRef(1)
  const lastMousePosRef = useRef({ x: 0, y: 0 })
  const mouseSpeedRef = useRef({ x: 0, y: 0 })
  const pointLossIndicatorsRef = useRef<PointLossIndicator[]>([])
  const deltaTimeRef = useRef(0)
  const lastFrameTimeRef = useRef(0)
  const [walletConnected, setWalletConnected] = useState(false)
  const [walletBalance, setWalletBalance] = useState(0.5)
  const [walletType, setWalletType] = useState("ETH") // Default to Ethereum
  const [highScores, setHighScores] = useState<{ name: string; score: number }[]>([
    { name: "TEZ", score: 5000 },
    { name: "XTZ", score: 4500 },
    { name: "NFT", score: 4000 },
    { name: "DFI", score: 3500 },
    { name: "LQD", score: 3000 },
    { name: "BTC", score: 2800 },
    { name: "ETH", score: 2600 },
    { name: "SOL", score: 2400 },
    { name: "DOT", score: 2200 },
  ])

  // Update the ref whenever state changes
  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  const getCurrentLevelTheme = () => {
    const levelIndex = (gameState.level - 1) % LEVEL_THEMES.length
    return LEVEL_THEMES[levelIndex]
  }

  /**
   * Buys an extra life for the player if they have enough wallet balance.
   * Deducts 0.01 from the wallet balance and adds one life to the game state.
   */
  const buyExtraLife = () => {
    if (walletBalance >= 0.01) {
      setWalletBalance((prev) => prev - 0.01)
      setGameState((prev) => ({
        ...prev,
        lives: prev.lives + 1,
        gameOver: false,
      }))
    }
  }

  /**
   * Captures a signal and increments the signalsCaptured count in the game state.
   */
  const captureSignal = () => {
    setGameState((prev) => ({
      ...prev,
      signalsCaptured: prev.signalsCaptured + 1,
    }))
  }

  /**
   * Takes damage to the vault and reduces the vaultHP in the game state.
   * @param damage - The amount of damage to be taken.
   */
  const takeVaultDamage  = (damage: number) => {
    setGameState((prev) => ({
      ...prev,
      vaultHP: prev.vaultHP - damage,
    }))
  }

  /**
   * Makes a strategy decision and updates the strategy in the game state.
   * @param strategy - The chosen strategy.
   */
  const makeStrategyDecision = (strategy: string) => {
    setGameState((prev) => ({
      ...prev,
      strategy,
    }))
  }

  const updateEducationalProgress = (topic: string) => {
    setGameState((prev) => ({
      ...prev,
      educationalProgress: {
        ...prev.educationalProgress,
        [topic]: true,
      },
    }))
  }

  const updatePerformanceMetrics = (metric: string, value: number) => {
    setGameState((prev) => ({
      ...prev,
      performanceMetrics: {
        ...prev,
        [metric]: value,
      },
    }))
  }

  const initializeWallet = (provider: 'metamask'|'phantom') => {
    // Wallet initialization logic
  }

  const updatePortfolio = (value: number) => {
    setGameState((prev) => ({
      ...prev,
      portfolioBalance: prev.portfolioBalance + value,
    }))
  }

  const defendVault = () => {
    // Vault defense logic
  }

  const spawnPowerUp = (x: number, y: number, type: string) => {
    const newPowerUp: PowerUp = { x, y, type, duration: 10000 }; // Example duration
    powerUpsRef.current.push(newPowerUp);
  };

  const collectPowerUp = (powerUp: PowerUp) => {
    applyPowerUpEffect(powerUp);
    setTimeout(() => {
      removePowerUpEffect(powerUp);
    }, powerUp.duration);
  };

  const applyPowerUpEffect = (powerUp: PowerUp) => {
    switch (powerUp.type) {
      case 'extraLife':
        setGameState((prev) => ({
          ...prev,
          lives: prev.lives + 1,
        }));
        break;
      case 'paddleGrow':
        paddlesRef.current.forEach((paddle) => {
          paddle.width *= 1.5;
        });
        break;
      // Add other power-up effects here
    }
  };

  const removePowerUpEffect = (powerUp: PowerUp) => {
    switch (powerUp.type) {
      case 'paddleGrow':
        paddlesRef.current.forEach((paddle) => {
          paddle.width /= 1.5;
        });
        break;
      // Add other power-up expiration logic here
    }
  };

  // TODO: Avoid Inline Functions in Context Value 
  // If you use useMemo, ensure all functions used in the context value are either stable (useCallback) or defined outside the render.
  const contextValue = useMemo(() => ({
    gameState,
    setGameState,
    gameStateRef,
    pixelsRef,
    ballsRef,
    paddlesRef,
    powerUpsRef,
    scaleRef,
    lastMousePosRef,
    mouseSpeedRef,
    pointLossIndicatorsRef,
    deltaTimeRef,
    lastFrameTimeRef,
    walletConnected,
    setWalletConnected,
    walletBalance,
    setWalletBalance,
    walletType,
    setWalletType,
    highScores,
    setHighScores,
    getCurrentLevelTheme,
    buyExtraLife,
    captureSignal,
    takeVaultDamage,
    makeStrategyDecision,
    updateEducationalProgress,
    updatePerformanceMetrics,
    initializeWallet,
    updatePortfolio,
    defendVault,
    spawnPowerUp,
    collectPowerUp,
    applyPowerUpEffect,
    removePowerUpEffect,
  }), [
    gameState,
    walletConnected,
    walletBalance,
    walletType,
    highScores,
    // ...add other dependencies if needed
  ]);

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  )
}

export function useGameContext() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGameContext must be used within a GameProvider")
  }
  return context
}
