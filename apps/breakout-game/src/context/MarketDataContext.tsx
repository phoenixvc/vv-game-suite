import React, { createContext, useState, useEffect, ReactNode } from 'react';

export interface MarketData {
  asset: string;
  price: number;
  volume: number;
  liquidity: number;
  trend: 'bull' | 'bear' | 'neutral';
  updatedAt: number;
}

interface MarketDataProviderType {
  marketData: MarketData[];
}

export const MarketDataContext = createContext<MarketDataProviderType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: ReactNode }) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [useLiveData, setUseLiveData] = useState(true);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const data = useLiveData
          ? await fetch("https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd").then(res => res.json())
          : await fetch("/api/mock-market").then(res => res.json());
        setMarketData(data);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        // Provide fallback data or handle error state
        setMarketData([]);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, [useLiveData]);

  const toggleDataSource = () => {
    setUseLiveData(prev => !prev);
  };

  return (
    <MarketDataContext.Provider value={{ marketData, toggleDataSource }}>
      {children}
    </MarketDataContext.Provider>
  );
}
