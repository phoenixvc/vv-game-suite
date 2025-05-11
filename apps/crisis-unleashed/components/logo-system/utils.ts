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
  * Returns the primary color hex code for the specified faction.
  *
  * If {@link monochrome} is true, returns black or white depending on {@link inverted}. Otherwise, returns the faction's primary color.
  *
  * @param faction - The faction identifier.
  * @param monochrome - If true, returns a monochrome color instead of the faction color.
  * @param inverted - If true and {@link monochrome} is set, returns white; otherwise, returns black.
  * @returns The hex color code for the faction's primary color or the selected monochrome color.
  */
export function getFactionColor(faction: FactionId, monochrome = false, inverted = false): string {
   if (monochrome) return inverted ? "#ffffff" : "#000000";
  return FACTION_DATA[faction].primaryColor;
 }

/**
 * Returns the secondary color hex code for the specified faction.
 *
 * If the faction is not recognized, returns the default secondary color.
 *
 * @param faction - The identifier of the faction.
 * @returns The secondary color hex code for the faction or the default if unknown.
 */
export function getFactionSecondaryColor(faction: string): string {
  return (FACTION_DATA[faction as FactionId]?.secondaryColor || DEFAULT_FACTION_DATA.secondaryColor);
}

/**
 * Returns the formatted display name for a given faction identifier.
 *
 * Converts the faction's identifier into a user-friendly name with proper capitalization and spacing.
 *
 * @param faction - The faction identifier to format.
 * @returns The display name of the faction.
 */
export function getFactionName(faction: FactionId): string {
  return formatFactionName(faction);
}

/**
 * Constructs a URL for the favicon associated with a given faction and size.
 *
 * @param faction - The identifier of the faction.
 * @param size - The desired favicon size in pixels.
 * @returns The URL string for the faction's favicon.
 */
export function getFactionFaviconUrl(faction: string, size = 32): string {
  // In a real implementation, this would point to actual generated favicons
  return `/api/favicon?faction=${faction}&size=${size}`;
}

/**
 * Returns an array of all defined faction identifiers.
 *
 * @returns An array containing every {@link FactionId} present in the faction data.
 */
export function getAllFactions(): FactionId[] {
  return (Object.keys(FACTION_DATA) as Array<keyof typeof FACTION_DATA>).map(
    (k) => k as FactionId,
  );
}

/**
 * Converts a faction identifier string to a display-friendly name.
 *
 * Splits a hyphen-separated faction identifier into words, capitalizes each word, and joins them with spaces.
 *
 * @param faction - The hyphen-separated faction identifier.
 * @returns The formatted faction name suitable for display.
 */
export function formatFactionName(faction: string): string {
  return faction
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Returns the description for the specified faction.
 *
 * If the faction is not recognized, returns a default description.
 *
 * @param faction - The identifier of the faction.
 * @returns The description string associated with the faction.
 */
export function getFactionDescription(faction: string): string {
  return FACTION_DATA[faction as FactionId]?.description || DEFAULT_FACTION_DATA.description;
}

/**
 * Returns the list of ability keywords associated with a faction.
 *
 * If the faction is not recognized, returns the default set of keywords.
 *
 * @param faction - The identifier of the faction.
 * @returns An array of keywords for the specified faction.
 */
export function getFactionKeywords(faction: string): string[] {
  return FACTION_DATA[faction as FactionId]?.keywords || DEFAULT_FACTION_DATA.keywords;
}

/**
 * Returns the icon name associated with the specified faction.
 *
 * If the faction is not recognized, a default icon name is returned.
 *
 * @param faction - The identifier of the faction.
 * @returns The icon name for the given faction, or a default if unknown.
 */
export function getFactionIconName(faction: string): string {
  return FACTION_DATA[faction as FactionId]?.iconName || DEFAULT_FACTION_DATA.iconName;
}

/**
 * Returns the font family associated with the specified faction.
 *
 * If the faction is not recognized, returns the default font family.
 *
 * @param faction - The identifier of the faction.
 * @returns The font family name for the faction, or the default if unknown.
 */
export function getFactionFont(faction: string): string {
  return FACTION_DATA[faction as FactionId]?.fontFamily || DEFAULT_FACTION_DATA.fontFamily;
}

/**
 * Generates a CSS linear gradient using a faction's primary and secondary colors.
 *
 * @param faction - The faction identifier.
 * @param options - Optional settings for gradient direction, monochrome mode, and color inversion.
 * @returns A CSS linear-gradient string representing the faction's color scheme.
 */
export function getFactionGradient(
  faction: FactionId,
  { direction = 'to right', monochrome = false, inverted = false } = {}
): string {
  const primary = getFactionColor(faction, monochrome, inverted);
  const secondary = getFactionSecondaryColor(faction);
  
  return `linear-gradient(${direction}, ${primary}, ${secondary})`;
}