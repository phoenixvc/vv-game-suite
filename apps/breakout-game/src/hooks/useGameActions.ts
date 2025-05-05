import { useCallback } from 'react';
import { GameState, LEVEL_THEMES } from '../types/game-types';
import { Paddle } from '../types/Paddle';
import { PowerUp } from '../types/PowerUp';
import { useGameProgressActions } from './actions/useGameProgressActions';
import { usePowerUpActions } from './actions/usePowerUpActions';
import { useUIActions } from './actions/useUIActions';
import { useWalletActions } from './actions/useWalletActions';

interface UseGameActionsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  paddlesRef: React.MutableRefObject<Paddle[]>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
  powerUpsRef: React.MutableRefObject<PowerUp[]>;
}

export function useGameActions({
  gameState,
  setGameState,
  paddlesRef,
  walletBalance,
  setWalletBalance,
  powerUpsRef
}: UseGameActionsProps) {
  
  // Import specialized action hooks
  const powerUpActions = usePowerUpActions({ gameState, setGameState, paddlesRef, powerUpsRef });
  const walletActions = useWalletActions({ gameState, setGameState, walletBalance, setWalletBalance });
  const progressActions = useGameProgressActions({ gameState, setGameState });
  const uiActions = useUIActions({ gameState, setGameState, paddlesRef });

  const getCurrentLevelTheme = useCallback(() => {
    const levelIndex = (gameState.level - 1) % LEVEL_THEMES.length;
    return LEVEL_THEMES[levelIndex];
  }, [gameState.level]);

  const captureSignal = useCallback(() => {
    setGameState((prev) => ({
      ...prev,
      signalsCaptured: prev.signalsCaptured + 1,
    }));
  }, [setGameState]);

  const takeVaultDamage = useCallback((damage: number) => {
    setGameState((prev) => ({
      ...prev,
      vaultHP: Math.max(0, prev.vaultHP - damage),
    }));
  }, [setGameState]);

  const makeStrategyDecision = useCallback((strategy: string) => {
    setGameState((prev) => ({
      ...prev,
      strategy,
    }));
    
    // Apply different effects based on strategy
    switch (strategy) {
      case 'aggressive':
        // Increase score multiplier but reduce lives
        setGameState((prev) => ({
          ...prev,
          scoreMultiplier: prev.scoreMultiplier * 1.5,
          lives: Math.max(1, prev.lives - 1)
        }));
        break;
      case 'balanced':
        // Moderate boost to score multiplier
        setGameState((prev) => ({
          ...prev,
          scoreMultiplier: prev.scoreMultiplier * 1.2
        }));
        break;
      case 'conservative':
        // Small boost to score multiplier and add a life
        setGameState((prev) => ({
          ...prev,
          scoreMultiplier: prev.scoreMultiplier * 1.1,
          lives: prev.lives + 1
        }));
        break;
    }
  }, [setGameState]);

  const defendVault = useCallback(() => {
    // Vault defense logic
    setGameState(prev => ({
      ...prev,
      vaultHP: Math.min(100, prev.vaultHP + 10) // Restore some vault health
    }));
  }, [setGameState]);

  const getAngleFactor = useCallback(() => {
    return gameState.angleFactor;
  }, [gameState.angleFactor]);

  return {
    // Core game actions
    getCurrentLevelTheme,
    captureSignal,
    takeVaultDamage,
    makeStrategyDecision,
    defendVault,
    getAngleFactor,
    
    // Actions from specialized hooks
    ...powerUpActions,
    ...walletActions,
    ...progressActions,
    ...uiActions
  };
}