"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SettingsContextType {
  soundOn: boolean
  setSoundOn: React.Dispatch<React.SetStateAction<boolean>>
  controls: string
  setControls: React.Dispatch<React.SetStateAction<string>>
}

const defaultSettings = {
  soundOn: true,
  controls: "keyboard", // Default to keyboard controls
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(defaultSettings.soundOn)
  const [controls, setControls] = useState(defaultSettings.controls)

  return (
    <SettingsContext.Provider value={{ soundOn, setSoundOn, controls, setControls }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettingsContext() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider")
  }
  return context
}
