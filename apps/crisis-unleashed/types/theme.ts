export type Theme = "light" | "dark" | "system"
export type FactionTheme = "cybernetic-nexus" | "primordial-ascendancy" | "eclipsed-order" | "celestial-dominion" | "titanborn" | "void-harbingers" | "default"

export interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
  currentTheme: FactionTheme
  setCurrentTheme: (theme: FactionTheme) => void
}
