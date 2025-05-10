export const FACTION_LOGOS = {
  PRIMORDIAL: "PA", // Primordial Ascendancy
  VOID: "VH",       // Void Harbingers
  TITANBORN: "TB", // Titanborn
  ECLIPSED: "EO", // Eclipsed Order
  CYBERNETIC: "CN", // Cybernetic Nexus
  CELESTIAL: "CD", // Celestial Dominion
  AETHER: "AE", // Aetheric Conclave
} as const;

export const FACTION_NAMES = {
  PRIMORDIAL: "Primordial Ascendancy",
  VOID: "Void Harbingers", 
  TITANBORN: "Titanborn",
  ECLIPSED: "Eclipsed Order",
  CYBERNETIC: "Cybernetic Nexus",
  CELESTIAL: "Celestial Dominion",
  AETHER: "Aetheric Conclave",
} as const;

// Primary colors - core identity of each faction
export const FACTION_PRIMARY_COLOR = {
  // Vibrant emerald green - represents primal nature, growth, and ancient power
  PRIMORDIAL: "#2E7D32", 
  
  // Deep violet-black - represents the mysterious void, emptiness, and cosmic unknown
  VOID: "#311B92", 
  
  // Rich copper-bronze - represents strength, earth, and forged resilience
  TITANBORN: "#B87333", 
  
  // Midnight blue with purple undertones - represents shadow, secrecy, and hidden knowledge
  ECLIPSED: "#1A237E", 
  
  // Electric blue - represents technology, innovation, and digital advancement
  CYBERNETIC: "#0288D1", 
  
  // Radiant gold - represents divine light, celestial power, and heavenly authority
  CELESTIAL: "#FFC107", 
  
  // Vibrant turquoise - represents magical energy, arcane power, and mystical forces
  AETHER: "#00838F",
} as const;

// Secondary colors - supporting elements and backgrounds
export const FACTION_SECONDARY_COLOR = {
  PRIMORDIAL: "#81C784", // Softer green - natural harmony
  VOID: "#673AB7",      // Medium purple - void energy
  TITANBORN: "#E67E22", // Warm orange - forge fire
  ECLIPSED: "#5C6BC0",  // Softer blue - twilight sky
  CYBERNETIC: "#4DD0E1", // Light teal - digital interface
  CELESTIAL: "#FFE082",  // Soft gold - divine aura
  AETHER: "#4DD0E1", // Bright cyan - flowing magical currents
} as const;

// Accent colors - highlights, important elements, and contrast
export const FACTION_ACCENT_COLOR = {
  PRIMORDIAL: "#FBC02D", // Amber gold - life energy and vitality
  VOID: "#D500F9",      // Bright magenta - void energy discharge
  TITANBORN: "#FAFAFA", // Off-white - molten metal and stone
  ECLIPSED: "#F44336",  // Crimson - blood rituals and danger
  CYBERNETIC: "#76FF03", // Neon green - code and digital elements
  CELESTIAL: "#FFFFFF",  // Pure white - divine light and purity
  AETHER: "#FF4081", // Bright pink - magical energy sparks and arcane symbols
} as const;

// Dark variants for backgrounds and dark mode
export const FACTION_DARK_COLOR = {
  PRIMORDIAL: "#1B5E20", // Deep forest green
  VOID: "#1A0033",      // Near-black purple
  TITANBORN: "#7D4E24", // Dark bronze
  ECLIPSED: "#0D1259",  // Dark navy
  CYBERNETIC: "#01579B", // Dark blue
  CELESTIAL: "#FF8F00",  // Dark amber
  AETHER: "#6A1B9A", // Dark purple
} as const;

// Light variants for highlights and light mode
export const FACTION_LIGHT_COLOR = {
  PRIMORDIAL: "#C8E6C9", // Pale green
  VOID: "#D1C4E9",      // Pale lavender
  TITANBORN: "#FFE0B2", // Pale orange
  ECLIPSED: "#C5CAE9",  // Pale blue
  CYBERNETIC: "#B3E5FC", // Pale blue
  CELESTIAL: "#FFECB3",  // Pale gold
  AETHER: "#E1BEE7", // Pale lavender
} as const;