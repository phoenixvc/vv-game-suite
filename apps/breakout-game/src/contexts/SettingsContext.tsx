"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

interface SettingsContextType {
  soundOn: boolean
  setSoundOn: React.Dispatch<React.SetStateAction<boolean>>
  controls: 'keyboard' | 'mouse'
  setControls: React.Dispatch<React.SetStateAction<'keyboard' | 'mouse'>>
  backgroundMusicOn: boolean
  setBackgroundMusicOn: React.Dispatch<React.SetStateAction<boolean>>
  toggleSound: () => void
  toggleBackgroundMusic: () => void
  toggleControlMode: () => void
}

// Define the settings type to avoid 'any'
interface GameSettings {
  soundOn: boolean;
  controls: 'keyboard' | 'mouse';
  backgroundMusicOn: boolean;
}

// Default settings
const defaultSettings: GameSettings = {
  soundOn: true,
  controls: 'keyboard',
  backgroundMusicOn: true
};

// Load settings from localStorage if available
const loadSettings = (): GameSettings => {
  if (typeof window === 'undefined') {
    return defaultSettings;
  }
  
  try {
    const savedSettings = localStorage.getItem('breakout-settings');
    if (savedSettings) {
      return JSON.parse(savedSettings) as GameSettings;
    }
  } catch (error) {
    console.error('Failed to load settings from localStorage:', error);
  }
  
  return defaultSettings;
};
// Save settings to localStorage
const saveSettings = (settings: GameSettings): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem('breakout-settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => loadSettings());
  const { soundOn, controls, backgroundMusicOn } = settings;
  
  // Save settings whenever they change
  useEffect(() => {
    saveSettings(settings);
  }, [settings]);
  
  const setSoundOn = (value: React.SetStateAction<boolean>) => {
    setSettings((prev: GameSettings) => ({
      ...prev,
      soundOn: typeof value === 'function' ? value(prev.soundOn) : value
    }));
  };

  const setControls = (value: React.SetStateAction<'keyboard' | 'mouse'>) => {
    setSettings((prev: GameSettings) => ({
      ...prev,
      controls: typeof value === 'function' ? value(prev.controls) : value
    }));
  };

  const setBackgroundMusicOn = (value: React.SetStateAction<boolean>) => {
    setSettings((prev: GameSettings) => ({
      ...prev,
      backgroundMusicOn: typeof value === 'function' ? value(prev.backgroundMusicOn) : value
    }));
  };

  const toggleSound = () => {
    setSoundOn((prev: boolean) => !prev);
  };

  const toggleBackgroundMusic = () => {
    setBackgroundMusicOn((prev: boolean) => !prev);
  };
  
  const toggleControlMode = () => {
    setControls((prev: 'keyboard' | 'mouse') => prev === 'keyboard' ? 'mouse' : 'keyboard');
  };
  return (
    <SettingsContext.Provider 
      value={{ 
        soundOn, 
        setSoundOn, 
        controls, 
        setControls, 
        backgroundMusicOn, 
        setBackgroundMusicOn, 
        toggleSound, 
        toggleBackgroundMusic,
        toggleControlMode
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettingsContext must be used within a SettingsProvider");
  }
  return context;
}

export default SettingsContext;