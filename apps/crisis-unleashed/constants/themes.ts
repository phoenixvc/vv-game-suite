import { FactionTheme } from "@/types/theme";

export const VALID_FACTION_THEMES: readonly FactionTheme[] = [
  "default", "celestial", "void", "primordial", "titanborn", "eclipsed", "cybernetic"
] as const;

// Map from faction theme to full display name
export const FACTION_THEME_DISPLAY_NAMES = {
  default: "Default",
  celestial: "Celestial Dominion",
  void: "Void Harbingers",
  primordial: "Primordial Ascendancy",
  titanborn: "Titanborn",
  eclipsed: "Eclipsed Order",
  cybernetic: "Cybernetic Nexus"
} as const;

// Map from faction theme to CSS class name
export const FACTION_THEME_CLASS_NAMES = {
  default: "theme-default",
  celestial: "theme-celestial-dominion",
  void: "theme-void-harbingers",
  primordial: "theme-primordial-ascendancy",
  titanborn: "theme-titanborn",
  eclipsed: "theme-eclipsed-order",
  cybernetic: "theme-cybernetic-nexus"
} as const;