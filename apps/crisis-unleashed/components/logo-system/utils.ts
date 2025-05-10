/**
 * Get faction theme color
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
 * Generate a favicon URL for a specific faction
 */
export function getFactionFaviconUrl(faction: string, size = 32): string {
  // In a real implementation, this would point to actual generated favicons
  return `/api/favicon?faction=${faction}&size=${size}`
}

/**
 * Get all available faction names
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
 */
export function formatFactionName(faction: string): string {
  return faction
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}
