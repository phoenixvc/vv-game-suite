import { EDUCATIONAL_ELEMENTS, PERFORMANCE_METRICS } from "@/utils/constants"

/**
 * Retrieves the high score from localStorage.
 * @returns {number} The high score.
 */
export function getHighScore(): number {
  if (typeof window === "undefined") return 0

  const savedHighScore = localStorage.getItem("promptingGameHighScore")
  return savedHighScore ? Number.parseInt(savedHighScore, 10) : 0
}

/**
 * Saves the high score to localStorage.
 * @param {number} score - The high score to save.
 */
export function saveHighScore(score: number): void {
  if (typeof window === "undefined") return

  localStorage.setItem("promptingGameHighScore", score.toString())
}

/**
 * Retrieves the number of daily games played and the last play date from localStorage.
 * @returns {Object} An object containing the number of games played and the last play date.
 */
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

/**
 * Increments the number of daily games played and saves it to localStorage.
 * @returns {number} The updated number of daily games played.
 */
export function incrementDailyGamesPlayed(): number {
  if (typeof window === "undefined") return 0

  const { gamesPlayed } = getDailyGamesPlayed()
  const newCount = gamesPlayed + 1
  localStorage.setItem("promptingGameGamesPlayedToday", newCount.toString())
  return newCount
}

/**
 * Retrieves the time until the next day reset.
 * @returns {Object} An object containing the hours and minutes until the next day reset.
 */
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

/**
 * Saves the educational progress to localStorage.
 * @param {Object} progress - The educational progress to save.
 */
export function saveEducationalProgress(progress: Record<string, boolean>): void {
  if (typeof window === "undefined") return

  localStorage.setItem("educationalProgress", JSON.stringify(progress))
}

/**
 * Loads the educational progress from localStorage.
 * @returns {Object} The loaded educational progress.
 */
export function loadEducationalProgress(): Record<string, boolean> {
  if (typeof window === "undefined") return {}

  const savedProgress = localStorage.getItem("educationalProgress")
  return savedProgress ? JSON.parse(savedProgress) : {}
}

/**
 * Saves the performance metrics to localStorage.
 * @param {Object} metrics - The performance metrics to save.
 */
export function savePerformanceMetrics(metrics: Record<string, number>): void {
  if (typeof window === "undefined") return

  localStorage.setItem("performanceMetrics", JSON.stringify(metrics))
}

/**
 * Loads the performance metrics from localStorage.
 * @returns {Object} The loaded performance metrics.
 */
export function loadPerformanceMetrics(): Record<string, number> {
  if (typeof window === "undefined") return {}

  const savedMetrics = localStorage.getItem("performanceMetrics")
  return savedMetrics ? JSON.parse(savedMetrics) : {}
}
