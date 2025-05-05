import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useGameActions } from '../hooks/useGameActions'
import { Ball } from '../types/Ball'
import { Paddle } from '../types/Paddle'
import { PowerUp } from '../types/PowerUp'
import { GameState, Pixel, PointLossIndicator, WalletType, initialGameState } from '../types/game-types'

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
  walletType: WalletType
  setWalletType: React.Dispatch<React.SetStateAction<WalletType>>
  highScores: { name: string; score: number }[]
  setHighScores: React.Dispatch<React.SetStateAction<{ name: string; score: number }[]>>
  getCurrentLevelTheme: () => string[]
  buyExtraLife: () => void
  captureSignal: () => void
  takeVaultDamage: (damage: number) => void
  makeStrategyDecision: (strategy: string) => void
  updateEducationalProgress: (topic: string) => void
  updatePerformanceMetrics: (metric: string, value: number) => void
  initializeWallet: (provider: 'metamask' | 'phantom') => void
  updatePortfolio: (value: number) => void
  defendVault: () => void
  spawnPowerUp: (x: number, y: number, type: string) => void
  collectPowerUp: (powerUp: Partial<PowerUp>) => void
  applyPowerUpEffect: (powerUp: PowerUp) => void
  removePowerUpEffect: (powerUp: PowerUp) => void
  getAngleFactor: () => number
  trackLevel: () => void
  updateLevel: (level: number) => void
  handleAchievements: () => void
  handleRewards: () => void
  customizePaddles: () => void
  customizeBalls: () => void
  handleSoundEffects: () => void
  handleBackgroundMusic: () => void
  handleTutorial: () => void
  handleHelpSection: () => void
  handleLeaderboards: () => void
  handleAdaptiveDifficulty: () => void
}
const GameContext = createContext<GameContextType | undefined>(undefined)

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>(initialGameState)
  const gameStateRef = useRef<GameState>(initialGameState)
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
  const [walletType, setWalletType] = useState<WalletType>("ETH")
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

  // Import all game actions from a separate hook
  const gameActions = useGameActions({
    gameState,
    setGameState,
    paddlesRef,
    walletBalance,
    setWalletBalance,
    powerUpsRef
  });

  useEffect(() => {
    gameStateRef.current = gameState
  }, [gameState])

  useEffect(() => {
    const handleCollectPowerUp = (event: CustomEvent) => {
      const { type, duration } = event.detail
      // Create a partial PowerUp object that will be handled by collectPowerUp
      const powerUpData = { x: 0, y: 0, type, duration } as Partial<PowerUp>
      gameActions.collectPowerUp(powerUpData)
    }
    window.addEventListener('collectPowerUp', handleCollectPowerUp as EventListener)

    return () => {
      window.removeEventListener('collectPowerUp', handleCollectPowerUp as EventListener)
    }
  }, [gameActions])

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
    ...gameActions
  }), [
    gameState,
    walletConnected,
    walletBalance,
    walletType,
    highScores,
    gameActions
  ])

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