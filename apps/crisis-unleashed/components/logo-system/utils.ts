/**
 * Logo system utility functions
 * 
 * These functions provide common utilities for working with faction-based styling
 * and logo system components.
 */

export type FactionId =
  | "cybernetic-nexus"
  | "primordial-ascendancy"
  | "void-harbingers"
  | "eclipsed-order"
  | "titanborn"
  | "celestial-dominion";

  // Define a type for faction data
type FactionDataType = {
  [key in FactionId]: {
    primaryColor: string;
    secondaryColor: string;
    description: string;
    keywords: string[];
    iconName: string;
    fontFamily: string;
  }
};

// Single source of truth for faction data
const FACTION_DATA: FactionDataType = {
  "cybernetic-nexus": {
    primaryColor: "#00a8ff", // Cyber blue
    secondaryColor: "#00ffcc", // Cyber teal
    description: "Advanced technological society focused on cybernetic enhancements and digital evolution.",
    keywords: ["Hack", "Augment", "Interface", "Overcharge", "Network"],
    iconName: "circuit-board",
    fontFamily: "'Orbitron', sans-serif",
  },
  "primordial-ascendancy": {
    primaryColor: "#2ecc71", // Vibrant green
    secondaryColor: "#8bc34a", // Natural lime
    description: "Nature-attuned collective that harnesses ancient elemental powers and biological adaptations.",
    keywords: ["Grow", "Adapt", "Terraform", "Symbiosis", "Evolve"],
    iconName: "leaf",
    fontFamily: "'Quicksand', sans-serif",
  },
  "void-harbingers": {
    primaryColor: "#9b59b6", // Mysterious purple
    secondaryColor: "#673ab7", // Deep purple
    description: "Mysterious sect that draws power from cosmic forces and dimensional rifts.",
    keywords: ["Corrupt", "Consume", "Distort", "Void-touch", "Entropy"],
    iconName: "eye",
    fontFamily: "'Rajdhani', sans-serif",
  },
  "eclipsed-order": {
    primaryColor: "#34495e", // Dark blue-gray
    secondaryColor: "#607d8b", // Blue-gray
    description: "Secretive organization balancing light and shadow magics through disciplined rituals.",
    keywords: ["Balance", "Ritual", "Twilight", "Duality", "Discipline"],
    iconName: "moon-stars",
    fontFamily: "'Cinzel', serif",
  },
  "titanborn": {
    primaryColor: "#e67e22", // Earthy orange
    secondaryColor: "#d35400", // Deep orange
    description: "Resilient warriors descended from ancient giants, masters of metallurgy and earth magic.",
    keywords: ["Forge", "Endure", "Smash", "Reinforce", "Legacy"],
    iconName: "hammer",
    fontFamily: "'Bebas Neue', sans-serif",
  },
  "celestial-dominion": {
    primaryColor: "#f1c40f", // Golden yellow
    secondaryColor: "#ff9800", // Bright orange
    description: "Enlightened beings connected to celestial bodies and astral energies.",
    keywords: ["Illuminate", "Ascend", "Purify", "Radiance", "Judgment"],
    iconName: "sun",
    fontFamily: "'Montserrat', sans-serif",
  },
} as const;

// Default values for fallback
const DEFAULT_FACTION_DATA = {
  primaryColor: "#3498db", // Default blue
  secondaryColor: "#2196f3", // Light blue
  description: "Unknown faction",
  keywords: ["Generic"],
  iconName: "circle",
  fontFamily: "'Inter', sans-serif",
};
/**
 * Get faction theme color
 * @param faction Faction identifier
 * @param monochrome Whether to use monochrome colors
 * @param inverted Whether to invert the colors
 * @returns Hex color code
 */
export function getFactionColor(faction: FactionId, monochrome = false, inverted = false): string {
   if (monochrome) return inverted ? "#ffffff" : "#000000";
  return FACTION_DATA[faction].primaryColor;
 }

/**
 * Get faction secondary color
 * @param faction Faction identifier
 * @returns Hex color code
 */
export function getFactionSecondaryColor(faction: string): string {
  return (FACTION_DATA[faction as FactionId]?.secondaryColor || DEFAULT_FACTION_DATA.secondaryColor);
}

/**
 * Get faction name
 * @param faction Faction identifier
 * @returns Full faction name
 */
export function getFactionName(faction: FactionId): string {
  return formatFactionName(faction);
}

/**
 * Generate a favicon URL for a specific faction
 * @param faction Faction identifier
 * @param size Size of the favicon in pixels
 * @returns URL to the faction favicon
 */
export function getFactionFaviconUrl(faction: string, size = 32): string {
  // In a real implementation, this would point to actual generated favicons
  return `/api/favicon?faction=${faction}&size=${size}`;
}

/**
 * Get all available faction names
 * @returns Array of faction identifiers
 */
export function getAllFactions(): FactionId[] {
  return (Object.keys(FACTION_DATA) as Array<keyof typeof FACTION_DATA>).map(
    (k) => k as FactionId,
  );
}

/**
 * Convert faction name to display format
 * @param faction Faction identifier
 * @returns Formatted faction name for display
 */
export function formatFactionName(faction: string): string {
  return faction
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Get faction description
 * @param faction Faction identifier
 * @returns Description of the faction
 */
export function getFactionDescription(faction: string): string {
  return FACTION_DATA[faction as FactionId]?.description || DEFAULT_FACTION_DATA.description;
}

/**
 * Get faction ability keywords
 * @param faction Faction identifier
 * @returns Array of ability keywords associated with the faction
 */
export function getFactionKeywords(faction: string): string[] {
  return FACTION_DATA[faction as FactionId]?.keywords || DEFAULT_FACTION_DATA.keywords;
}

/**
 * Get faction icon name
 * @param faction Faction identifier
 * @returns Icon name for the faction
 */
export function getFactionIconName(faction: string): string {
  return FACTION_DATA[faction as FactionId]?.iconName || DEFAULT_FACTION_DATA.iconName;
}

/**
 * Get faction font family
 * @param faction Faction identifier
 * @returns Font family name for the faction
 */
export function getFactionFont(faction: string): string {
  return FACTION_DATA[faction as FactionId]?.fontFamily || DEFAULT_FACTION_DATA.fontFamily;
}

/**
 * Generate a CSS gradient for a faction
 * @param faction Faction identifier
 * @param direction Direction of the gradient (default: 'to right')
 * @returns CSS gradient string
 */
export function getFactionGradient(
  faction: FactionId,
  { direction = 'to right', monochrome = false, inverted = false } = {}
): string {
  const primary = getFactionColor(faction, monochrome, inverted);
  const secondary = getFactionSecondaryColor(faction);
  
  return `linear-gradient(${direction}, ${primary}, ${secondary})`;
}