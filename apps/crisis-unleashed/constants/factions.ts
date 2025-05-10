// Define the faction keys directly
export type FactionKey = 
  | 'PRIMORDIAL'
  | 'VOID'
  | 'TITANBORN'
  | 'ECLIPSED'
  | 'CYBERNETIC'
  | 'CELESTIAL'
  | 'AETHER';
  
export const FACTION_LOGOS: Record<FactionKey, string> = {
   PRIMORDIAL: "PA", // Primordial Ascendancy
   VOID: "VH",       // Void Harbingers
   TITANBORN: "TB",  // Titanborn
   ECLIPSED: "EO",   // Eclipsed Order
   CYBERNETIC: "CN", // Cybernetic Nexus
   CELESTIAL: "CD",  // Celestial Dominion
   AETHER: "AE",     // Aetheric Conclave
 } as const;

export const FACTION_NAMES: Record<FactionKey, string> = {
   PRIMORDIAL: "Primordial Ascendancy",
   VOID: "Void Harbingers",
   TITANBORN: "Titanborn",
   ECLIPSED: "Eclipsed Order",
   CYBERNETIC: "Cybernetic Nexus",
   CELESTIAL: "Celestial Dominion",
   AETHER: "Aetheric Conclave",
 } as const;
 
 export interface FactionColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  dark: string;
  light: string;
}

export const FACTION_COLORS: Record<FactionKey, FactionColorPalette> = {
  PRIMORDIAL: {
    // Vibrant emerald green - represents primal nature, growth, and ancient power
    primary: "#2E7D32",
    // Softer green - natural harmony
    secondary: "#81C784",
    // Amber gold - life energy and vitality
    accent: "#FBC02D",
    // Deep forest green
    dark: "#1B5E20",
    // Pale green
    light: "#C8E6C9",
  },
  
  VOID: {
    // Deep violet-black - represents the mysterious void, emptiness, and cosmic unknown
    primary: "#311B92",
    // Medium purple - void energy
    secondary: "#673AB7",
    // Bright magenta - void energy discharge
    accent: "#D500F9",
    // Near-black purple
    dark: "#1A0033",
    // Pale lavender
    light: "#D1C4E9",
  },
  
  TITANBORN: {
    // Rich copper-bronze - represents strength, earth, and forged resilience
    primary: "#B87333",
    // Warm orange - forge fire
    secondary: "#E67E22",
    // Off-white - molten metal and stone
    accent: "#FAFAFA",
    // Dark bronze
    dark: "#7D4E24",
    // Pale orange
    light: "#FFE0B2",
  },
  
  ECLIPSED: {
    // Midnight blue with purple undertones - represents shadow, secrecy, and hidden knowledge
    primary: "#1A237E",
    // Softer blue - twilight sky
    secondary: "#5C6BC0",
    // Crimson - blood rituals and danger
    accent: "#F44336",
    // Dark navy
    dark: "#0D1259",
    // Pale blue
    light: "#C5CAE9",
  },
  
  CYBERNETIC: {
    // Electric blue - represents technology, innovation, and digital advancement
    primary: "#0288D1",
    // Light teal - digital interface
    secondary: "#4DD0E1",
    // Neon green - code and digital elements
    accent: "#76FF03",
    // Dark blue
    dark: "#01579B",
    // Pale blue
    light: "#B3E5FC",
  },
  
  CELESTIAL: {
    // Radiant gold - represents divine light, celestial power, and heavenly authority
    primary: "#FFC107",
    // Soft gold - divine aura
    secondary: "#FFE082",
    // Pure white - divine light and purity
    accent: "#FFFFFF",
    // Dark amber
    dark: "#FF8F00",
    // Pale gold
    light: "#FFECB3",
  },
  
  AETHER: {
    // Vibrant turquoise - represents magical energy, arcane power, and mystical forces
    primary: "#00838F",
    // Bright cyan - flowing magical currents
    secondary: "#4DD0E1",
    // Bright pink - magical energy sparks and arcane symbols
    accent: "#FF4081",
    // Deep teal
    dark: "#006064",
    // Pale cyan
    light: "#B2EBF2",
  },
} as const;
