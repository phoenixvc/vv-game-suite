/**
 * Logo system utility functions
 * 
 * These functions provide common utilities for working with faction-based styling
 * and logo system components.
 */

/**
 * Get faction theme color
 * @param faction Faction identifier
 * @param monochrome Whether to use monochrome colors
 * @param inverted Whether to invert the colors
 * @returns Hex color code
 */
export function getFactionColor(faction: string, monochrome = false, inverted = false): string {
  if (monochrome) return inverted ? "#ffffff" : "#000000"

  switch (faction) {
    case "cybernetic-nexus":
      return "#00a8ff" // Cyber blue
    case "primordial-ascendancy":
      return "#2ecc71" // Vibrant green
    case "void-harbingers":
      return "#9b59b6" // Mysterious purple
    case "eclipsed-order":
      return "#34495e" // Dark blue-gray
    case "titanborn":
      return "#e67e22" // Earthy orange
    case "celestial-dominion":
      return "#f1c40f" // Golden yellow
    default:
      return "#3498db" // Default blue
  }
}

/**
 * Get faction secondary color
 * @param faction Faction identifier
 * @returns Hex color code
 */
export function getFactionSecondaryColor(faction: string): string {
  switch (faction) {
    case "cybernetic-nexus":
      return "#00ffcc" // Cyber teal
    case "primordial-ascendancy":
      return "#8bc34a" // Natural lime
    case "void-harbingers":
      return "#673ab7" // Deep purple
    case "eclipsed-order":
      return "#607d8b" // Blue-gray
    case "titanborn":
      return "#d35400" // Deep orange
    case "celestial-dominion":
      return "#ff9800" // Bright orange
    default:
      return "#2196f3" // Light blue
  }
}

/**
 * Get faction name
 * @param faction Faction identifier
 * @returns Full faction name
 */
export function getFactionName(faction: string): string {
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
  return `/api/favicon?faction=${faction}&size=${size}`
}

/**
 * Get all available faction names
 * @returns Array of faction identifiers
 */
export function getAllFactions(): string[] {
  return [
    "cybernetic-nexus",
    "primordial-ascendancy",
    "void-harbingers",
    "eclipsed-order",
    "titanborn",
    "celestial-dominion",
  ]
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
    .join(" ")
}

/**
 * Get faction description
 * @param faction Faction identifier
 * @returns Description of the faction
 */
export function getFactionDescription(faction: string): string {
  switch (faction) {
    case "cybernetic-nexus":
      return "Advanced technological society focused on cybernetic enhancements and digital evolution."
    case "primordial-ascendancy":
      return "Nature-attuned collective that harnesses ancient elemental powers and biological adaptations."
    case "void-harbingers":
      return "Mysterious sect that draws power from cosmic forces and dimensional rifts."
    case "eclipsed-order":
      return "Secretive organization balancing light and shadow magics through disciplined rituals."
    case "titanborn":
      return "Resilient warriors descended from ancient giants, masters of metallurgy and earth magic."
    case "celestial-dominion":
      return "Enlightened beings connected to celestial bodies and astral energies."
    default:
      return "Unknown faction"
  }
}

/**
 * Get faction ability keywords
 * @param faction Faction identifier
 * @returns Array of ability keywords associated with the faction
 */
export function getFactionKeywords(faction: string): string[] {
  switch (faction) {
    case "cybernetic-nexus":
      return ["Hack", "Augment", "Interface", "Overcharge", "Network"]
    case "primordial-ascendancy":
      return ["Grow", "Adapt", "Terraform", "Symbiosis", "Evolve"]
    case "void-harbingers":
      return ["Corrupt", "Consume", "Distort", "Void-touch", "Entropy"]
    case "eclipsed-order":
      return ["Balance", "Ritual", "Twilight", "Duality", "Discipline"]
    case "titanborn":
      return ["Forge", "Endure", "Smash", "Reinforce", "Legacy"]
    case "celestial-dominion":
      return ["Illuminate", "Ascend", "Purify", "Radiance", "Judgment"]
    default:
      return ["Generic"]
  }
}

/**
 * Get faction icon name
 * @param faction Faction identifier
 * @returns Icon name for the faction
 */
export function getFactionIconName(faction: string): string {
  switch (faction) {
    case "cybernetic-nexus":
      return "circuit-board"
    case "primordial-ascendancy":
      return "leaf"
    case "void-harbingers":
      return "eye"
    case "eclipsed-order":
      return "moon-stars"
    case "titanborn":
      return "hammer"
    case "celestial-dominion":
      return "sun"
    default:
      return "circle"
  }
}

/**
 * Get faction font family
 * @param faction Faction identifier
 * @returns Font family name for the faction
 */
export function getFactionFont(faction: string): string {
  switch (faction) {
    case "cybernetic-nexus":
      return "'Orbitron', sans-serif"
    case "primordial-ascendancy":
      return "'Quicksand', sans-serif"
    case "void-harbingers":
      return "'Rajdhani', sans-serif"
    case "eclipsed-order":
      return "'Cinzel', serif"
    case "titanborn":
      return "'Bebas Neue', sans-serif"
    case "celestial-dominion":
      return "'Montserrat', sans-serif"
    default:
      return "'Inter', sans-serif"
  }
}

/**
 * Generate a CSS gradient for a faction
 * @param faction Faction identifier
 * @param direction Direction of the gradient (default: 'to right')
 * @returns CSS gradient string
 */
export function getFactionGradient(faction: string, direction = 'to right'): string {
  const primary = getFactionColor(faction)
  const secondary = getFactionSecondaryColor(faction)
  
  return `linear-gradient(${direction}, ${primary}, ${secondary})`
}