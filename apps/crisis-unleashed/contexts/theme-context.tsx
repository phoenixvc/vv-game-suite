"use client"

import { VALID_FACTION_THEMES } from "@/constants/themes"
import { isValidFactionTheme, isValidTheme } from "@/lib/theme-utils"
import { FactionTheme, Theme, ThemeContextType } from "@/types/theme"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [currentTheme, setCurrentTheme] = useState<FactionTheme>("default")

  // Initialize theme from localStorage if available
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme && isValidTheme(storedTheme)) {
      setTheme(storedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    } else {
      setTheme("light")
    }

    // Initialize faction theme from localStorage if available
    const storedFactionTheme = localStorage.getItem("factionTheme") as FactionTheme | null
    if (storedFactionTheme && isValidFactionTheme(storedFactionTheme)) {
      setCurrentTheme(storedFactionTheme)
    }
  }, [])

  // Update localStorage and document class when theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme)

    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
      root.classList.add(systemTheme)
    } else {
      root.classList.add(theme)
    }
  }, [theme])
 
  // Update localStorage when faction theme changes
  useEffect(() => {
    localStorage.setItem("factionTheme", currentTheme)
    
    // Update faction theme classes on the document root
    const root = window.document.documentElement
    // Use the VALID_FACTION_THEMES constant to ensure this list stays up to date
    const themeClasses = VALID_FACTION_THEMES.map(theme => `theme-${theme}`)
    
    // Remove all faction theme classes
    root.classList.remove(...themeClasses)
    
    // Add the current faction theme class
    root.classList.add(`theme-${currentTheme}`)
  }, [currentTheme])

  return (
   <ThemeContext.Provider 
     value={{ 
       theme, 
       setTheme, 
       currentTheme, 
       setCurrentTheme 
     }}
   >
     {children}
   </ThemeContext.Provider>
 )
}

const DEFAULT_THEME_CONTEXT: ThemeContextType = {
  theme: "dark" as Theme,
  setTheme: () => {},
  currentTheme: "default" as FactionTheme,
  setCurrentTheme: () => {}
};

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return DEFAULT_THEME_CONTEXT;
  }
  return context
}
