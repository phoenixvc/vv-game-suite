"use client"

import React, { createContext, useState, useContext } from 'react';

// Define the context type
interface SettingsContextType {
  soundOn: boolean;
  setSoundOn: React.Dispatch<React.SetStateAction<boolean>>;
  musicOn: boolean;
  setMusicOn: React.Dispatch<React.SetStateAction<boolean>>;
  difficulty: string;
  setDifficulty: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Provider component
export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [soundOn, setSoundOn] = useState(true);
  const [musicOn, setMusicOn] = useState(true);
  const [difficulty, setDifficulty] = useState('normal');

  const value = {
    soundOn,
    setSoundOn,
    musicOn,
    setMusicOn,
    difficulty,
    setDifficulty
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Custom hook to use the settings context
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}