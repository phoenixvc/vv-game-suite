"use client"

import { FactionTheme, Theme, ThemeContextType } from "@/types/theme"
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [currentTheme, setCurrentTheme] = useState<FactionTheme>("default")

  // Initialize theme from localStorage if available
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    } else {
      setTheme("light")
    }

    // Initialize faction theme from localStorage if available
    const storedFactionTheme = localStorage.getItem("factionTheme") as FactionTheme | null
    if (storedFactionTheme) {
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
  }, [currentTheme])
 
  return <ThemeContext.Provider value={{ theme, setTheme, currentTheme, setCurrentTheme }}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    return { 
      theme: "dark", 
      setTheme: () => {}, 
      currentTheme: "default" as FactionTheme, 
      setCurrentTheme: () => {} 
    }
  }
  return context
}
