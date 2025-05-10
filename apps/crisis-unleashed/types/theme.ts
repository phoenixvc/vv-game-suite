export type Theme = "light" | "dark" | "system"
export type FactionTheme = "cybernetic" | "primordial" | "eclipsed" | "celestial" | "titanborn" | "void" | "default"

export interface ThemeContextType {
  readonly theme: Theme
  setTheme: (theme: Theme) => void
  readonly currentTheme: FactionTheme
  setCurrentTheme: (theme: FactionTheme) => void
}
