// Utility functions for the logo system

export function getFactionColor(faction: string, monochrome = false, inverted = false): string {
  if (monochrome) return inverted ? "#ffffff" : "#000000"

  switch (faction) {
    case "cybernetic-nexus":
      return "#00a8ff"
    case "primordial-ascendancy":
      return "#2ecc71"
    case "void-harbingers":
      return "#9b59b6"
    case "eclipsed-order":
      return "#34495e"
    case "titanborn":
      return "#e67e22"
    case "celestial-dominion":
      return "#f1c40f"
    default:
      return "#3498db"
  }
}

export function getFactionSecondaryColor(faction: string): string {
  switch (faction) {
    case "cybernetic-nexus":
      return "#0077b6"
    case "primordial-ascendancy":
      return "#27ae60"
    case "void-harbingers":
      return "#8e44ad"
    case "eclipsed-order":
      return "#2c3e50"
    case "titanborn":
      return "#d35400"
    case "celestial-dominion":
      return "#f39c12"
    default:
      return "#2980b9"
  }
}

export function getFactionName(faction: string): string {
  return formatFactionName(faction)
}

export function formatFactionName(faction: string): string {
  return faction
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

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

export function getFactionFaviconUrl(faction: string): string {
  return `/favicons/${faction}-favicon.ico`
}
