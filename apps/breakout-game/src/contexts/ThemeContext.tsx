"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface ThemeContextType {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
  toggleTheme: () => void
}

const defaultTheme = "light"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState(defaultTheme)

  /**
   * Toggles the theme between light and dark modes.
   */
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"))
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useThemeContext() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useThemeContext must be used within a ThemeProvider")
  }
  return context
}
