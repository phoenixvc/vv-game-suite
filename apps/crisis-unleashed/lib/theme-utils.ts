import { FactionTheme, Theme } from "@/types/theme";
import { VALID_FACTION_THEMES } from "@/constants/themes";

/**
 * Check if a string is a valid faction theme
 * @param theme The theme string to check
 * @returns Type guard for FactionTheme
 */
export function isValidFactionTheme(theme: string): theme is FactionTheme {
  return VALID_FACTION_THEMES.includes(theme as FactionTheme);
}

/**
 * Check if a string is a valid theme mode
 * @param theme The theme string to check
 * @returns Boolean indicating if the theme is valid
 */
export function isValidTheme(theme: string): theme is Theme {
  return ["dark", "light", "system"].includes(theme as Theme);
}

/**
 * Get the display name for a faction theme
 * @param theme The faction theme
 * @returns The display name for the theme
 */
export function getFactionThemeDisplayName(theme: FactionTheme): string {
  const displayNames = {
    default: "Default",
    celestial: "Celestial Dominion",
    void: "Void Harbingers",
    primordial: "Primordial Ascendancy",
    titanborn: "Titanborn",
    eclipsed: "Eclipsed Order",
    cybernetic: "Cybernetic Nexus"
  };
  return displayNames[theme];
}

/**
 * Get the CSS class name for a faction theme
 * @param theme The faction theme
 * @returns The CSS class name for the theme
 */
export function getFactionThemeClassName(theme: FactionTheme): string {
  const classNames = {
    default: "theme-default",
    celestial: "theme-celestial",
    void: "theme-void",
    primordial: "theme-primordial",
    titanborn: "theme-titanborn",
    eclipsed: "theme-eclipsed",
    cybernetic: "theme-cybernetic"
  };
  return classNames[theme];
}
