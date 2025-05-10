export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface CardAbility {
  name: string;
  cost?: number;
  description: string;
}

export interface CardStats {
    power: number;
    health: number;
    cost: number;
    energy: number;
}

export interface CardContent {
    description: string;
    effect: string;
    lore: string;
    abilities: CardAbility[];
}

export interface CardMetadata {
    artist: string;
    illustration: string;
    releaseDate: string;
    variant: string;
    isHolo: boolean;
    isPromo: boolean;
}

export interface CardMechanics {
    keywords: string[];
    requirements: string;
    impact: string;
    duration: string;
    synergies: string[];
    restrictions: string[];
}

export interface Card {
  type: string;
  id: string;
  name: string;
  set?: string;
  rarity?: CardRarity;
  faction?: string;
  
  stats?: CardStats;
  content?: CardContent;
  metadata?: CardMetadata;
  mechanics?: CardMechanics;
}

// ReadonlyCard represents a card with all properties readonly
export interface ReadonlyCardData {
    id?: string;
    name?: string;
    type?: string;
    set?: string;
    rarity?: CardRarity;
    faction?: string;
    
    // Card stats
    stats?: Readonly<{
      power?: number;
      health?: number;
      cost?: number;
      energy?: number;
    }>;
    
    // Card content
    content?: Readonly<{
      description?: string;
      effect?: string;
      lore?: string;
      abilities?: ReadonlyArray<Readonly<CardAbility>>;
    }>;
  
    // Card metadata
    metadata?: Readonly<{
      artist?: string;
      illustration?: string;
      releaseDate?: string;
      variant?: string;
      isHolo?: boolean;
      isPromo?: boolean;
    }>;
    
    // Game mechanics
    mechanics?: Readonly<{
      keywords?: ReadonlyArray<string>;
      requirements?: string;
      impact?: string;
      duration?: string;
      synergies?: ReadonlyArray<string>;
      restrictions?: ReadonlyArray<string>;
    }>;
}

export interface CardBackProps {
  card: Readonly<ReadonlyCardData>;
  darkMode?: boolean;
  className?: string;
}