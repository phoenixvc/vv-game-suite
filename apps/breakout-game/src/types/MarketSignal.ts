/**
 * Represents a market signal that can be used to create themed bricks
 * in the breakout game. Each signal has different properties that affect
 * brick appearance, behavior, and value.
 */
export interface MarketSignal {
  /**
   * The type of market signal (e.g., price, volume, liquidity)
   */
  type: 'price' | 'volume' | 'liquidity' | 'volatility' | 'sentiment' | string;
  
  /**
   * The value of the signal, which can affect brick value/points
   */
  value: number;
  
  /**
   * Optional source of the signal (e.g., BTC, ETH, market-wide)
   */
  source?: string;
  
  /**
   * Optional timestamp of when the signal was generated
   */
  timestamp?: number;
  
  /**
   * Strength or confidence level of the signal (0-1)
   */
  strength: number;
  
  /**
   * Trend direction (positive, negative, neutral, up, down)
   */
  trend: 'positive' | 'negative' | 'neutral' | 'up' | 'down' | string;
  
  /**
   * Color representation for the signal (hexadecimal)
   */
  color: number;
  
  /**
   * Position index for the signal in a layout
   */
  position: number;
  
  /**
   * Optional metadata for additional signal information
   */
  metadata?: Record<string, any>;
}

/**
 * Factory function to create a market signal with default values
 */
export function createMarketSignal(
  type: MarketSignal['type'],
  value: number,
  options: Partial<Omit<MarketSignal, 'type' | 'value'>> = {}
): MarketSignal {
  return {
    type,
    value,
    source: options.source || 'generic',
    timestamp: options.timestamp || Date.now(),
    strength: options.strength || 0.5,
    trend: options.trend || 'neutral',
    color: options.color || 0xFFFFFF, // Default white color
    position: options.position || 0,
    metadata: options.metadata || {}
  };
}

/**
 * Generate a random market signal for testing or demo purposes
 */
export function generateRandomMarketSignal(): MarketSignal {
  const types = ['price', 'volume', 'liquidity', 'volatility', 'sentiment'] as const;
  const trends = ['positive', 'negative', 'neutral'] as const;
  const sources = ['BTC', 'ETH', 'SOL', 'DOT', 'AVAX', 'LINK'];
  
  const randomType = types[Math.floor(Math.random() * types.length)];
  const randomValue = Math.floor(Math.random() * 1000) + 50;
  const randomSource = sources[Math.floor(Math.random() * sources.length)];
  const randomStrength = Math.random();
  const randomTrend = trends[Math.floor(Math.random() * trends.length)];
  const randomColor = Math.floor(Math.random() * 0xFFFFFF);
  const randomPosition = Math.floor(Math.random() * 100);
  
  return {
    type: randomType,
    value: randomValue,
    source: randomSource,
    timestamp: Date.now(),
    strength: randomStrength,
    trend: randomTrend,
    color: randomColor,
    position: randomPosition,
    metadata: {
      isRandom: true
    }
  };
}

/**
 * Generate a batch of random market signals
 * @param count Number of signals to generate
 */
export function generateRandomMarketSignals(count: number): MarketSignal[] {
  const signals: MarketSignal[] = [];
  for (let i = 0; i < count; i++) {
    signals.push(generateRandomMarketSignal());
  }
  return signals;
}

export default MarketSignal;
