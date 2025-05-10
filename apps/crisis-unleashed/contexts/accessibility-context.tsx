"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type AccessibilityContextType = {
  reducedMotion: boolean
  toggleReducedMotion: () => void
  highContrast: boolean
  toggleHighContrast: () => void
}

const AccessibilityContext = createContext<AccessibilityContextType>({
  reducedMotion: false,
  toggleReducedMotion: () => {},
  highContrast: false,
  toggleHighContrast: () => {},
})

export function AccessibilityProvider({ children }: { children: React.ReactNode }) {
  // Check for user's system preferences
  const [reducedMotion, setReducedMotion] = useState(false)
  const [highContrast, setHighContrast] = useState(false)

  useEffect(() => {
    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    setReducedMotion(prefersReducedMotion)

    // Check for stored preferences
    const storedReducedMotion = localStorage.getItem("reducedMotion")
    if (storedReducedMotion !== null) {
      setReducedMotion(storedReducedMotion === "true")
    }

    const storedHighContrast = localStorage.getItem("highContrast")
    if (storedHighContrast !== null) {
      setHighContrast(storedHighContrast === "true")
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem("reducedMotion", reducedMotion.toString())
  }, [reducedMotion])

  useEffect(() => {
    localStorage.setItem("highContrast", highContrast.toString())
  }, [highContrast])

  const toggleReducedMotion = () => {
    setReducedMotion((prev) => !prev)
  }

  const toggleHighContrast = () => {
    setHighContrast((prev) => !prev)
  }

  return (
    <AccessibilityContext.Provider
      value={{
        reducedMotion,
        toggleReducedMotion,
        highContrast,
        toggleHighContrast,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  )
}

export const useAccessibility = () => useContext(AccessibilityContext)
