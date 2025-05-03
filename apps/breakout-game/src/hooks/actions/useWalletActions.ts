import { useCallback } from 'react';
import { GameState } from '../../types/game-types';

interface UseWalletActionsProps {
  gameState: GameState;
  setGameState: React.Dispatch<React.SetStateAction<GameState>>;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
}

export function useWalletActions({
  gameState,
  setGameState,
  walletBalance,
  setWalletBalance
}: UseWalletActionsProps) {
  
  const buyExtraLife = useCallback(() => {
    if (walletBalance >= 0.01) {
      setWalletBalance((prev) => prev - 0.01);
      setGameState((prev) => ({
        ...prev,
        lives: prev.lives + 1,
        gameOver: false,
      }));
    }
  }, [walletBalance, setWalletBalance, setGameState]);

  const initializeWallet = useCallback((provider: 'metamask' | 'phantom') => {
    // Wallet initialization logic
    if (provider === 'metamask') {
      // Connect to Ethereum
      setGameState(prev => ({
        ...prev,
        walletType: 'eth'
      }));
      // Simulate successful connection
      setWalletBalance(0.5);
      setGameState(prev => ({
        ...prev,
        walletConnected: true
      }));
    } else if (provider === 'phantom') {
      // Connect to Solana
      setGameState(prev => ({
        ...prev,
        walletType: 'sol'
      }));
      // Simulate successful connection
      setWalletBalance(10);
      setGameState(prev => ({
        ...prev,
        walletConnected: true
      }));
    }
  }, [setGameState, setWalletBalance]);

  const updatePortfolio = useCallback((value: number) => {
    setGameState((prev) => ({
      ...prev,
      portfolioBalance: prev.portfolioBalance + value,
    }));
  }, [setGameState]);

  const handleRewards = useCallback(() => {
    // Logic to handle rewards
    const levelRewards = [
      { level: 5, reward: 0.01 },
      { level: 10, reward: 0.02 },
      { level: 15, reward: 0.05 }
    ];
    
    levelRewards.forEach(reward => {
      if (gameState.level === reward.level) {
        setWalletBalance(prev => prev + reward.reward);
        console.log(`Rewarded ${reward.reward} ETH for reaching level ${reward.level}`);
      }
    });
  }, [gameState.level, setWalletBalance]);

  return {
    buyExtraLife,
    initializeWallet,
    updatePortfolio,
    handleRewards
  };
}