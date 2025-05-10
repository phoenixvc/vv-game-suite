export type CardRarity = 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface CardAbility {
  readonly name: string;
  readonly cost?: number;
  readonly description: string;
}

export interface CardStats {
    readonly power: number;
    readonly health: number;
    readonly cost: number;
    readonly energy: number;
}

export interface CardContent {
    readonly description: string;
    readonly effect: string;
    readonly lore: string;
    readonly abilities: ReadonlyArray<CardAbility>;
}

export interface CardMetadata {
    readonly artist: string;
    readonly illustration: string;
    readonly releaseDate: string;
    readonly variant: string;
    readonly isHolo: boolean;
    readonly isPromo: boolean;
}

export interface CardMechanics {
    readonly keywords: ReadonlyArray<string>;
    readonly requirements: string;
    readonly impact: string;
    readonly duration: string;
    readonly synergies: ReadonlyArray<string>;
    readonly restrictions: ReadonlyArray<string>;
}

export interface Card {
  readonly type: string;
  readonly id: string;
  readonly name: string;
  readonly set?: string;
  readonly rarity?: CardRarity;
  readonly faction?: string;
  
  readonly stats?: CardStats;
  readonly content?: CardContent;
  readonly metadata?: CardMetadata;
  readonly mechanics?: CardMechanics;
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

  abilities?: ReadonlyArray<Readonly<CardAbility>>;
}

export interface CardBackProps {
  card: Readonly<ReadonlyCardData>;
  darkMode?: boolean;
  className?: string;
}