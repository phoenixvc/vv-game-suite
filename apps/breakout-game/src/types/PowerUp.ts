import { PowerUpType } from './PowerUpType';

// This is a simplified interface for PowerUp that can be used in React components
// It doesn't include Phaser-specific properties but has the essential properties needed
export interface PowerUp {
  x: number;
  y: number;
  type: PowerUpType | string;
  duration?: number;
  active?: boolean;
}

// Export the PowerUpConfig interface for consistency
export interface PowerUpConfig {
  x: number;
  y: number;
  type: PowerUpType | string;
  texture?: string;
  duration?: number;
  velocity?: { x?: number; y?: number };
}