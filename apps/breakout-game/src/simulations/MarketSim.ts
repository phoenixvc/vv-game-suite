import * as Phaser from 'phaser';
import { MarketSignal } from '../types/MarketSignal';
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
      type: ['liquidity', 'price', 'volume'][i % 3],
      trend: Math.random() > 0.5 ? 'up' : 'down',
      strength: Math.random(), // Add strength as a number between 0 and 1
      color: Phaser.Display.Color.GetColor(
        Phaser.Math.Between(100, 255),
        Phaser.Math.Between(100, 255),
        Phaser.Math.Between(100, 255)
      )
    }));
  }
}