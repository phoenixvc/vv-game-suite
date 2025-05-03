import { MarketSignal } from '../managers/BrickManager';
import Phaser from 'phaser';

/**
 * Simulates market data for the game
 */
export class MarketSim {
  /**
   * Gets initial market signals for brick creation
   * @returns Array of market signals with position, value and type
   */
  getInitialSignals(): MarketSignal[] {
    // Stub for real data integration
    return Array(60).fill(null).map((_, i) => ({
      position: i,
      value: Phaser.Math.Between(50, 200),
      type: ['liquidity', 'price', 'volume'][i % 3]
    }));
  }
}