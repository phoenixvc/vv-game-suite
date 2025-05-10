import { FactionTheme } from "@/types/theme";

export function isValidFactionTheme(theme: string): theme is FactionTheme {
  // Add your valid faction themes here
  const validThemes = ["default", "celestial", "void", "primordial", "titanborn", "eclipsed", "cybernetic"]; 
  return validThemes.includes(theme);
}