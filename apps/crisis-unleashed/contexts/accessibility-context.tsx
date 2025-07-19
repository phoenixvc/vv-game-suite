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

  // Save preferences to localStorage and apply styles when they change
  useEffect(() => {
    localStorage.setItem("reducedMotion", reducedMotion.toString())
    
    // Apply reduced motion to document
    if (reducedMotion) {
      document.documentElement.style.setProperty('--animation-duration', '0.01ms')
      document.documentElement.style.setProperty('--transition-duration', '0.01ms')
    } else {
      document.documentElement.style.removeProperty('--animation-duration')
      document.documentElement.style.removeProperty('--transition-duration')
    }
  }, [reducedMotion])

  useEffect(() => {
    localStorage.setItem("highContrast", highContrast.toString())
    
    // Apply high contrast class to document
    if (highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
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
