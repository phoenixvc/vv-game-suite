import { FACTION_THEME_CLASS_NAMES, FACTION_THEME_DISPLAY_NAMES, VALID_FACTION_THEMES } from "@/constants/themes";
import { FactionTheme, Theme } from "@/types/theme";

/**
 * Determines whether the given string is a valid faction theme.
 *
 * @param theme - The string to validate as a faction theme.
 * @returns True if {@link theme} is a valid {@link FactionTheme}; otherwise, false.
 */
export function isValidFactionTheme(theme: string): theme is FactionTheme {
  return (VALID_FACTION_THEMES as readonly string[]).includes(theme);
}

/**
 * Check if a string is a valid theme mode
 * @param theme The theme string to check
 * @returns Boolean indicating if the theme is valid
 */
const VALID_THEMES: readonly Theme[] = ["dark", "light", "system"] as const;

/**
 * Determines whether the provided string is a valid theme mode.
 *
 * @returns True if {@link theme} is one of the recognized theme modes; otherwise, false.
 */
export function isValidTheme(theme: string): theme is Theme {
  return VALID_THEMES.includes(theme as Theme);
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
