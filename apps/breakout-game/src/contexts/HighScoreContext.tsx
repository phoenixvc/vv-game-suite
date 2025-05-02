"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface HighScore {
  name: string
  score: number
}

interface HighScoreContextType {
  highScores: HighScore[]
  setHighScores: React.Dispatch<React.SetStateAction<HighScore[]>>
  addHighScore: (name: string, score: number) => void
}

const defaultHighScores: HighScore[] = [
  { name: "TEZ", score: 5000 },
  { name: "XTZ", score: 4500 },
  { name: "NFT", score: 4000 },
  { name: "DFI", score: 3500 },
  { name: "LQD", score: 3000 },
  { name: "BTC", score: 2800 },
  { name: "ETH", score: 2600 },
  { name: "SOL", score: 2400 },
  { name: "DOT", score: 2200 },
]

const HighScoreContext = createContext<HighScoreContextType | undefined>(undefined)

export function HighScoreProvider({ children }: { children: ReactNode }) {
  const [highScores, setHighScores] = useState<HighScore[]>(defaultHighScores)

  const addHighScore = (name: string, score: number) => {
    setHighScores((prevHighScores) => {
      const newHighScores = [...prevHighScores, { name, score }]
      newHighScores.sort((a, b) => b.score - a.score)
      return newHighScores.slice(0, 10) // Keep only top 10 scores
    })
  }

  return (
    <HighScoreContext.Provider value={{ highScores, setHighScores, addHighScore }}>
      {children}
    </HighScoreContext.Provider>
  )
}

export function useHighScoreContext() {
  const context = useContext(HighScoreContext)
  if (context === undefined) {
    throw new Error("useHighScoreContext must be used within a HighScoreProvider")
  }
  return context
}
