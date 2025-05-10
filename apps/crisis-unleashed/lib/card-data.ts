export interface Ability {
  name: string
  description: string
  cost?: number
  type?: string
}

export interface CardData {
  id: string
  name: string
  type: string
  cardType?: string
  faction?: string
  rarity?: string
  provision?: number
  description: string

  // Hero specific
  health?: number
  attack?: number
  defense?: number
  speed?: number
  intelligence?: number
  abilities?: Ability[]

  // Artifact specific
  effect?: string
  requirements?: string

  // Crisis specific
  impact?: string
  duration?: string

  // Common fields
  aspects?: string[]
  lore?: string
  artist?: string
  imageUrl?: string
}
