import { ethers } from 'ethers';

export const connectWallet = async (type: WalletType) => {
  if (type === 'eth') {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    this.gameContext.setWalletAddress(await signer.getAddress());
  } else if (type === 'sol') {
    const resp = await window.solana.connect();
    this.gameContext.setWalletAddress(resp.publicKey.toString());
  }
};

export const buyPowerUp = (cost: number) => {
  if (this.gameContext.walletBalance >= cost) {
    this.gameContext.setWalletBalance(prev => prev - cost);
    return true;
  }
  return false;
};
