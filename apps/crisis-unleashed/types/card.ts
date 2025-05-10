export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface Card {
  type: string;
  id: string;
  name: string;
  set?: string;
  rarity?: CardRarity;
  faction?: string;
  // Add other card properties
}

export interface CardBackProps {
  card: {
    id?: string;
    name?: string;
    type?: string;
    rarity?: CardRarity;
    set?: string;
    faction?: string;
    [key: string]: any;
  };
  darkMode?: boolean;
  className?: string;
}