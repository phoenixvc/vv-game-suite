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
  toggleDataSource: () => void;
  isLoading: boolean;
  hasError: boolean;
}

export const MarketDataContext = createContext<MarketDataProviderType | undefined>(undefined);

export function MarketDataProvider({ children }: { children: ReactNode }) {
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [useLiveData, setUseLiveData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const API_URL = process.env.REACT_APP_MARKET_API_URL || "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
  const MOCK_API_URL = "/api/mock-market";
  const POLL_INTERVAL_MS = process.env.REACT_APP_MARKET_DATA_POLL_INTERVAL_MS ? parseInt(process.env.REACT_APP_MARKET_DATA_POLL_INTERVAL_MS) : 10000;

  useEffect(() => {
    const fetchMarketData = async () => {
      setIsLoading(true);
      setHasError(false);
      try {
        const data = useLiveData
          ? await fetch(API_URL).then(res => res.json())
          : await fetch(MOCK_API_URL).then(res => res.json());

        const validatedData = Array.isArray(data) ? data.map(item => ({
          asset: item.asset || item.id || 'unknown',
          price: typeof item.price === 'number' ? item.price : parseFloat(item.current_price) || 0,
          volume: typeof item.volume === 'number' ? item.volume : parseFloat(item.total_volume) || 0,
          liquidity: typeof item.liquidity === 'number' ? item.liquidity : parseFloat(item.market_cap) || 0,
          trend: item.trend || (item.price_change_percentage_24h > 0 ? 'bull' : item.price_change_percentage_24h < 0 ? 'bear' : 'neutral'),
          updatedAt: item.updatedAt || Date.now()
        })) : [];

        setMarketData(validatedData);
      } catch (error) {
        console.error("Failed to fetch market data:", error);
        setHasError(true);
        setMarketData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketData();
    const interval = setInterval(fetchMarketData, POLL_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [useLiveData]);

  const toggleDataSource = () => {
    setUseLiveData(prev => !prev);
  };

  return (
    <MarketDataContext.Provider value={{ marketData, toggleDataSource, isLoading, hasError }}>
      {children}
    </MarketDataContext.Provider>
  );
}
