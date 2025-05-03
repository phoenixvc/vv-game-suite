"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface SettingsContextType {
  soundOn: boolean
  setSoundOn: React.Dispatch<React.SetStateAction<boolean>>
  controls: string
  setControls: React.Dispatch<React.SetStateAction<string>>
  backgroundMusicOn: boolean
  setBackgroundMusicOn: React.Dispatch<React.SetStateAction<boolean>>
  toggleSound: () => void
  toggleBackgroundMusic: () => void
}

const defaultSettings = {
  soundOn: true,
  controls: "keyboard", // Default to keyboard controls
  backgroundMusicOn: true, // Default to background music on
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundOn, setSoundOn] = useState(defaultSettings.soundOn)
  const [controls, setControls] = useState(defaultSettings.controls)
  const [backgroundMusicOn, setBackgroundMusicOn] = useState(defaultSettings.backgroundMusicOn)

  const toggleSound = () => {
    setSoundOn(prev => !prev)
  }

  const toggleBackgroundMusic = () => {
    setBackgroundMusicOn(prev => !prev)
  }

  return (
    <SettingsContext.Provider value={{ soundOn, setSoundOn, controls, setControls, backgroundMusicOn, setBackgroundMusicOn, toggleSound, toggleBackgroundMusic }}>
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
