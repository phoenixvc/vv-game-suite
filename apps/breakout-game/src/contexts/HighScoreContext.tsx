import { createContext, useContext, useState, type ReactNode } from "react"

interface HighScore {
  name: string
  score: number
}

interface HighScoreContextType {
  highScores: HighScore[]
  setHighScores: React.Dispatch<React.SetStateAction<HighScore[]>>
  addHighScore: (name: string, score: number) => void
  getTopScores: (count: number) => HighScore[] // Added method to get top scores
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

  /**
   * Adds a new high score to the list and sorts it in descending order.
   * Keeps only the top 10 scores.
   * @param name - The name of the player.
   * @param score - The score of the player.
   */
  const addHighScore = (name: string, score: number) => {
    setHighScores((prevHighScores) => {
      const newHighScores = [...prevHighScores, { name, score }]
      newHighScores.sort((a, b) => b.score - a.score)
      return newHighScores.slice(0, 10) // Keep only top 10 scores
    })
  }

  /**
   * Gets the top scores from the high score list.
   * @param count - The number of top scores to retrieve.
   * @returns An array of the top scores.
   */
  const getTopScores = (count: number) => {
    return highScores.slice(0, count)
  }

  return (
    <HighScoreContext.Provider value={{ highScores, setHighScores, addHighScore, getTopScores }}>
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
