import { ethers } from 'ethers';
import { WalletType } from '../types/game-types';

// Define a GameContext interface for this file
interface GameContext {
  setWalletAddress: (address: string) => void;
  walletBalance: number;
  setWalletBalance: React.Dispatch<React.SetStateAction<number>>;
}

// Create a context variable
let gameContext: GameContext;

// Function to initialize the context
export const initGameContext = (context: GameContext) => {
  gameContext = context;
};

export const connectWallet = async (type: WalletType) => {
  try {
    if (type === 'eth' && window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      if (gameContext) {
        gameContext.setWalletAddress(await signer.getAddress());
      }
    } else if (type === 'sol' && window.solana) {
      const resp = await window.solana.connect();
      if (gameContext) {
        gameContext.setWalletAddress(resp.publicKey.toString());
      }
    }
  } catch (error) {
    console.error('Failed to connect wallet:', error);
    alert('Failed to connect wallet. Please check your wallet extension or internet connection.');
  }
};

export const buyPowerUp = (cost: number) => {
  if (gameContext && gameContext.walletBalance >= cost) {
    gameContext.setWalletBalance((prev: number) => prev - cost);
    return true;
  }
  return false;
};

// Add these types to make TypeScript happy with window.ethereum and window.solana
declare global {
  interface Window {
    ethereum?: any;
    solana?: {
      connect: () => Promise<{ publicKey: { toString: () => string } }>;
    };
  }
}