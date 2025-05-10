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
    readonly id?: string;
    readonly name?: string;
    readonly type?: string;
    readonly rarity?: CardRarity;
    readonly set?: string;
    readonly faction?: string;
    // Card stats
    readonly power?: number;
    readonly health?: number;
    readonly cost?: number;
    readonly energy?: number;
    
    // Card content
    readonly description?: string;
    readonly effect?: string;
    readonly lore?: string;
    readonly abilities?: Array<{
      name: string;
      cost?: number;
      description: string;
    }>;
    
    // Card metadata
    readonly artist?: string;
    readonly illustration?: string;
    readonly releaseDate?: string;
    readonly variant?: string;
    readonly isHolo?: boolean;
    readonly isPromo?: boolean;
    
    // Game mechanics
    readonly keywords?: string[];
    readonly requirements?: string;
    readonly impact?: string;
    readonly duration?: string;
    readonly synergies?: string[];
    readonly restrictions?: string[];
  };
  darkMode?: boolean;
  className?: string;
}