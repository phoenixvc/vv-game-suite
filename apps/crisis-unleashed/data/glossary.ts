export interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
  relatedTerms?: string[]
}

export const glossaryTerms: GlossaryTerm[] = [
  // Core Game Concepts
  {
    id: "game-overview",
    term: "Crisis Unleashed",
    definition:
      "A strategic card game featuring faction-based gameplay where players build decks, deploy heroes, artifacts, and respond to crisis events in an immersive world.",
    category: "Core Concepts",
    relatedTerms: ["deck-building", "factions", "game-phases"],
  },
  {
    id: "deck-building",
    term: "Deck Building",
    definition:
      "The process of selecting cards to create a playable deck. Players choose heroes, artifacts, and other cards, typically focusing on synergies within a primary faction.",
    category: "Core Concepts",
    relatedTerms: ["synergy", "faction-purity", "card-limit"],
  },
  {
    id: "game-phases",
    term: "Game Phases",
    definition:
      "The structured sequence of play in each round: Draw Phase, Resource Phase, Main Phase, Combat Phase, and End Phase.",
    category: "Core Concepts",
    relatedTerms: ["turn-structure", "action-points", "combat"],
  },

  // Resources
  {
    id: "energy",
    term: "Energy",
    definition:
      "A primary resource used to power abilities, deploy cards, and activate effects. Each faction has different methods of generating and utilizing Energy.",
    category: "Resources",
    relatedTerms: ["materials", "information", "resource-conversion"],
  },
  {
    id: "materials",
    term: "Materials",
    definition:
      "A primary resource used for constructing structures, reinforcing units, and crafting artifacts. Materials are physical components needed for tangible creations.",
    category: "Resources",
    relatedTerms: ["energy", "information", "resource-generation"],
  },
  {
    id: "information",
    term: "Information",
    definition:
      "A primary resource representing knowledge, data, and intelligence. Used for research, espionage, and unlocking advanced technologies.",
    category: "Resources",
    relatedTerms: ["energy", "materials", "research-points"],
  },
  {
    id: "resource-conversion",
    term: "Resource Conversion",
    definition:
      "The ability to transform one type of resource into another, often at a conversion rate determined by faction abilities or card effects.",
    category: "Resources",
    relatedTerms: ["energy", "materials", "information"],
  },
  {
    id: "resource-generation",
    term: "Resource Generation",
    definition:
      "The methods by which players acquire resources each turn, including base generation, territory control bonuses, and card effects.",
    category: "Resources",
    relatedTerms: ["energy", "materials", "information", "territory"],
  },

  // Card Types
  {
    id: "hero-card",
    term: "Hero Card",
    definition:
      "Powerful character cards with health points, attack values, and special abilities. Heroes remain in play until defeated and can level up through gameplay actions.",
    category: "Cards",
    relatedTerms: ["artifact-card", "ability", "hero-level"],
  },
  {
    id: "artifact-card",
    term: "Artifact Card",
    definition:
      "Equippable items and structures that provide ongoing benefits or abilities. Artifacts can be attached to heroes or placed in territory zones.",
    category: "Cards",
    relatedTerms: ["hero-card", "equipment", "structure"],
  },
  {
    id: "crisis-card",
    term: "Crisis Card",
    definition:
      "Game-changing event cards that affect all players, creating both challenges and opportunities. Crisis cards can alter resource generation, modify card abilities, or create new victory conditions.",
    category: "Cards",
    relatedTerms: ["crisis-event", "global-effect", "response-card"],
  },
  {
    id: "response-card",
    term: "Response Card",
    definition:
      "Cards that can be played outside of your turn in reaction to specific triggers or events. They often provide defensive capabilities or counter-strategies.",
    category: "Cards",
    relatedTerms: ["trigger", "counter", "reaction"],
  },
  {
    id: "structure",
    term: "Structure",
    definition:
      "A type of artifact that is placed in a territory rather than equipped to a hero. Structures provide zone control, resource generation, or other strategic benefits.",
    category: "Cards",
    relatedTerms: ["artifact-card", "territory", "fortification"],
  },

  // Gameplay Mechanics
  {
    id: "synergy",
    term: "Synergy",
    definition:
      "The beneficial interaction between cards that enhances their effectiveness when used together. Synergies can be based on faction, card type, abilities, or other attributes.",
    category: "Gameplay",
    relatedTerms: ["combo", "faction-purity", "deck-building"],
  },
  {
    id: "combat",
    term: "Combat",
    definition:
      "The system of conflict resolution between heroes and other game elements. Combat involves attack values, defense values, abilities, and various modifiers.",
    category: "Gameplay",
    relatedTerms: ["attack", "defense", "damage", "defeat"],
  },
  {
    id: "territory",
    term: "Territory",
    definition:
      "Zones on the game board that can be controlled by players. Controlling territories provides resource bonuses and strategic advantages.",
    category: "Gameplay",
    relatedTerms: ["control", "structure", "resource-generation"],
  },
  {
    id: "crisis-event",
    term: "Crisis Event",
    definition:
      "Game-changing events that affect all players, creating both challenges and opportunities. Crisis events can alter resource generation, modify card abilities, or create new victory conditions.",
    category: "Gameplay",
    relatedTerms: ["crisis-card", "global-effect", "adaptation"],
  },
  {
    id: "action-points",
    term: "Action Points",
    definition:
      "A limited resource each turn that determines how many actions a player can take during their Main Phase. Different actions cost varying amounts of Action Points.",
    category: "Gameplay",
    relatedTerms: ["main-phase", "deploy", "activate", "move"],
  },
  {
    id: "hero-level",
    term: "Hero Level",
    definition:
      "The progression system for hero cards. Heroes can gain experience and level up, unlocking new abilities and improved stats.",
    category: "Gameplay",
    relatedTerms: ["hero-card", "experience", "ability"],
  },

  // Factions
  {
    id: "faction",
    term: "Faction",
    definition:
      "One of six major groups in the game, each with unique abilities, playstyles, and aesthetic themes. Players typically align with one faction but can use cards from multiple factions.",
    category: "Factions",
    relatedTerms: [
      "cybernetic-nexus",
      "void-harbingers",
      "primordial-ascendancy",
      "eclipsed-order",
      "titanborn",
      "celestial-dominion",
    ],
  },
  {
    id: "cybernetic-nexus",
    term: "Cybernetic Nexus",
    definition:
      "A faction specializing in technology, automation, and information warfare. They excel at resource conversion and efficiency.",
    category: "Factions",
    relatedTerms: ["faction", "information", "technology"],
  },
  {
    id: "void-harbingers",
    term: "Void Harbingers",
    definition:
      "A faction drawing power from dimensional rifts and cosmic anomalies. They specialize in sacrifice mechanics and reality manipulation.",
    category: "Factions",
    relatedTerms: ["faction", "dimensional-rift", "sacrifice"],
  },
  {
    id: "primordial-ascendancy",
    term: "Primordial Ascendancy",
    definition:
      "A faction harnessing natural forces and biological adaptation. They excel at resource regeneration and evolutionary mechanics.",
    category: "Factions",
    relatedTerms: ["faction", "adaptation", "nature"],
  },
  {
    id: "eclipsed-order",
    term: "Eclipsed Order",
    definition:
      "A faction of shadow operatives and mystical assassins. They specialize in stealth, sabotage, and targeted elimination.",
    category: "Factions",
    relatedTerms: ["faction", "stealth", "sabotage"],
  },
  {
    id: "titanborn",
    term: "Titanborn",
    definition:
      "A faction of master craftsmen and elemental forgers. They excel at creating powerful artifacts and reinforcing structures.",
    category: "Factions",
    relatedTerms: ["faction", "crafting", "fortification"],
  },
  {
    id: "celestial-dominion",
    term: "Celestial Dominion",
    definition:
      "A faction manipulating time and cosmic forces. They specialize in prediction, control, and altering the flow of the game.",
    category: "Factions",
    relatedTerms: ["faction", "time", "prediction"],
  },

  // Advanced Mechanics
  {
    id: "faction-purity",
    term: "Faction Purity",
    definition:
      "The degree to which a deck focuses on a single faction. Higher faction purity unlocks powerful synergies and special abilities.",
    category: "Advanced Mechanics",
    relatedTerms: ["synergy", "deck-building", "faction"],
  },
  {
    id: "dimensional-rift",
    term: "Dimensional Rift",
    definition:
      "A special zone created by Void Harbinger cards that exists outside normal play. Cards in rifts can affect the game in unique ways.",
    category: "Advanced Mechanics",
    relatedTerms: ["void-harbingers", "banish", "phase-shift"],
  },
  {
    id: "adaptation",
    term: "Adaptation",
    definition:
      "A Primordial Ascendancy mechanic that allows cards to evolve and gain new abilities in response to game conditions.",
    category: "Advanced Mechanics",
    relatedTerms: ["primordial-ascendancy", "evolution", "mutation"],
  },
  {
    id: "stealth",
    term: "Stealth",
    definition:
      "An Eclipsed Order mechanic that allows cards to remain hidden or protected from targeting until they attack or use certain abilities.",
    category: "Advanced Mechanics",
    relatedTerms: ["eclipsed-order", "reveal", "ambush"],
  },
  {
    id: "crafting",
    term: "Crafting",
    definition:
      "A Titanborn mechanic that allows the creation or upgrading of artifacts during gameplay by combining resources and components.",
    category: "Advanced Mechanics",
    relatedTerms: ["titanborn", "artifact-card", "upgrade"],
  },
  {
    id: "time-manipulation",
    term: "Time Manipulation",
    definition:
      "A Celestial Dominion mechanic that allows altering the turn sequence, replaying actions, or predicting future card draws.",
    category: "Advanced Mechanics",
    relatedTerms: ["celestial-dominion", "prediction", "rewind"],
  },
  {
    id: "technology",
    term: "Technology",
    definition:
      "A Cybernetic Nexus mechanic that allows upgrading and networking cards to create powerful systems and information networks.",
    category: "Advanced Mechanics",
    relatedTerms: ["cybernetic-nexus", "network", "upgrade"],
  },

  // Card Attributes
  {
    id: "attack",
    term: "Attack",
    definition:
      "A numerical value representing a hero's offensive capability. Used when initiating combat against other heroes or structures.",
    category: "Card Attributes",
    relatedTerms: ["combat", "damage", "hero-card"],
  },
  {
    id: "defense",
    term: "Defense",
    definition:
      "A numerical value representing a hero's or structure's resistance to attacks. Reduces incoming damage during combat.",
    category: "Card Attributes",
    relatedTerms: ["combat", "damage", "hero-card", "structure"],
  },
  {
    id: "health",
    term: "Health",
    definition:
      "A numerical value representing how much damage a hero or structure can sustain before being defeated or destroyed.",
    category: "Card Attributes",
    relatedTerms: ["damage", "healing", "defeat"],
  },
  {
    id: "ability",
    term: "Ability",
    definition:
      "Special powers or effects that cards can use. Abilities may require resources to activate and can have various triggers and effects.",
    category: "Card Attributes",
    relatedTerms: ["active-ability", "passive-ability", "triggered-ability"],
  },
  {
    id: "rarity",
    term: "Rarity",
    definition:
      "The classification of cards based on their scarcity and power level. Common, Uncommon, Rare, Epic, and Legendary are the standard rarity levels.",
    category: "Card Attributes",
    relatedTerms: ["common", "uncommon", "rare", "epic", "legendary"],
  },

  // Game States
  {
    id: "victory-condition",
    term: "Victory Condition",
    definition:
      "The requirements that must be met to win the game. Standard victory is achieved by reducing all opponents' Nexus points to zero.",
    category: "Game States",
    relatedTerms: ["nexus-points", "alternative-victory", "defeat"],
  },
  {
    id: "nexus-points",
    term: "Nexus Points",
    definition: "A player's life total. When reduced to zero, the player is eliminated from the game.",
    category: "Game States",
    relatedTerms: ["victory-condition", "damage", "direct-damage"],
  },
  {
    id: "alternative-victory",
    term: "Alternative Victory",
    definition:
      "Special win conditions introduced by certain cards or crisis events that allow players to win through means other than reducing opponents' Nexus points.",
    category: "Game States",
    relatedTerms: ["victory-condition", "crisis-event", "special-objective"],
  },

  // Card Designer Terms
  {
    id: "card-template",
    term: "Card Template",
    definition:
      "The base design framework for creating cards, including layout, art placement, text fields, and faction styling.",
    category: "Card Designer",
    relatedTerms: ["card-art", "card-text", "faction-styling"],
  },
  {
    id: "card-art",
    term: "Card Art",
    definition:
      "The visual illustration that represents the card's character, artifact, or event. Card art is a central element of the card's identity.",
    category: "Card Designer",
    relatedTerms: ["card-template", "art-frame", "full-art"],
  },
  {
    id: "card-text",
    term: "Card Text",
    definition: "The written content on a card, including name, type, abilities, flavor text, and other information.",
    category: "Card Designer",
    relatedTerms: ["ability-text", "flavor-text", "rules-text"],
  },
  {
    id: "faction-styling",
    term: "Faction Styling",
    definition:
      "The visual design elements specific to each faction, including color schemes, frame designs, icons, and typography.",
    category: "Card Designer",
    relatedTerms: ["card-template", "faction", "card-frame"],
  },
  {
    id: "card-back",
    term: "Card Back",
    definition: "The reverse side of cards, typically featuring faction-specific designs or a universal game logo.",
    category: "Card Designer",
    relatedTerms: ["faction-styling", "card-template"],
  },
]
