import { FACTION_THEME_CLASS_NAMES, FACTION_THEME_DISPLAY_NAMES, VALID_FACTION_THEMES } from "@/constants/themes";
import { FactionTheme, Theme } from "@/types/theme";

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
const VALID_THEMES: readonly Theme[] = ["dark", "light", "system"] as const;

 export function isValidTheme(theme: string): theme is Theme {
   return theme === "dark" || theme === "light" || theme === "system";
 }

/**
 * Get the display name for a faction theme
 * @param theme The faction theme
 * @returns The display name for the theme
 */
export function getFactionThemeDisplayName(theme: FactionTheme): string {
  return FACTION_THEME_DISPLAY_NAMES[theme];
}

/**
 * Get the CSS class name for a faction theme
 * @param theme The faction theme
 * @returns The CSS class name for the theme
 */
export function getFactionThemeClassName(theme: FactionTheme): string {
  return FACTION_THEME_CLASS_NAMES[theme];
}
