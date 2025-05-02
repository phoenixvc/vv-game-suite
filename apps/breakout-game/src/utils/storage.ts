import { EDUCATIONAL_ELEMENTS, PERFORMANCE_METRICS } from "@/utils/constants"

// Function to get high score from localStorage
export function getHighScore(): number {
  if (typeof window === "undefined") return 0

  const savedHighScore = localStorage.getItem("promptingGameHighScore")
  return savedHighScore ? Number.parseInt(savedHighScore, 10) : 0
}

// Function to save high score to localStorage
export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return

  localStorage.setItem("promptingGameHighScore", score.toString())
}

// Function to get daily games played
export function getDailyGamesPlayed(): { gamesPlayed: number; lastPlayDate: string } {
  if (typeof window === "undefined") return { gamesPlayed: 0, lastPlayDate: "" }

  const today = new Date().toDateString()
  const lastPlayDate = localStorage.getItem("promptingGameLastPlayDate") || ""
  const gamesPlayedToday = localStorage.getItem("promptingGameGamesPlayedToday")

  // Reset counter if it's a new day
  if (lastPlayDate !== today) {
    localStorage.setItem("promptingGameLastPlayDate", today)
    localStorage.setItem("promptingGameGamesPlayedToday", "0")
    return { gamesPlayed: 0, lastPlayDate: today }
  }

  return {
    gamesPlayed: gamesPlayedToday ? Number.parseInt(gamesPlayedToday, 10) : 0,
    lastPlayDate,
  }
}

// Function to increment daily games played
export function incrementDailyGamesPlayed(): number {
  if (typeof window === "undefined") return 0

  const { gamesPlayed } = getDailyGamesPlayed()
  const newCount = gamesPlayed + 1
  localStorage.setItem("promptingGameGamesPlayedToday", newCount.toString())
  return newCount
}

// Function to get time until next day reset
export function getTimeUntilReset(): { hours: number; minutes: number } {
  const now = new Date()
  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(0, 0, 0, 0)

  const timeUntilReset = tomorrow.getTime() - now.getTime()
  const hours = Math.floor(timeUntilReset / (1000 * 60 * 60))
  const minutes = Math.floor((timeUntilReset % (1000 * 60 * 60)) / (1000 * 60))

  return { hours, minutes }
}

// Function to save educational progress to localStorage
export function saveEducationalProgress(progress: Record<string, boolean>): void {
  if (typeof window === "undefined") return

  localStorage.setItem("educationalProgress", JSON.stringify(progress))
}

// Function to load educational progress from localStorage
export function loadEducationalProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {}

  const savedProgress = localStorage.getItem("educationalProgress")
  return savedProgress ? JSON.parse(savedProgress) : {}
}

// Function to save performance metrics to localStorage
export function savePerformanceMetrics(metrics: Record<string, number>): void {
  if (typeof window === "undefined") return

  localStorage.setItem("performanceMetrics", JSON.stringify(metrics))
}

// Function to load performance metrics from localStorage
export function loadPerformanceMetrics(): Record<string, number> {
  if (typeof window === "undefined") return {}

  const savedMetrics = localStorage.getItem("performanceMetrics")
  return savedMetrics ? JSON.parse(savedMetrics) : {}
}