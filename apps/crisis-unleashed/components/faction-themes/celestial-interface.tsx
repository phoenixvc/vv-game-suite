"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "../../styles/animations.module.css"

interface CelestialInterfaceProps {
  title: string
  children: React.ReactNode
  showTimeControls?: boolean
  showCosmicMap?: boolean
  className?: string
}

export function CelestialInterface({
  title,
  children,
  showTimeControls = true,
  showCosmicMap = true,
  className = "",
}: CelestialInterfaceProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [timeFlow, setTimeFlow] = useState<"normal" | "accelerated" | "reversed" | "paused">("normal")
  const [cosmicEnergy, setCosmicEnergy] = useState(75)

  // Update time based on timeFlow
  useEffect(() => {
    let interval: NodeJS.Timeout

    if (timeFlow === "paused") {
      return
    }

    interval = setInterval(() => {
      setCurrentTime((prevTime) => {
        const newTime = new Date(prevTime)

        switch (timeFlow) {
          case "normal":
            newTime.setSeconds(newTime.getSeconds() + 1)
            break
          case "accelerated":
            newTime.setMinutes(newTime.getMinutes() + 1)
            break
          case "reversed":
            newTime.setSeconds(newTime.getSeconds() - 1)
            break
        }

        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timeFlow])

  // Format time for display
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  // Format cosmic date
  const formatCosmicDate = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `Cosmic Cycle ${year}.${month}.${day}`
  }

  return (
    <div className={`bg-[#1a103d] text-purple-100 rounded-lg overflow-hidden border border-purple-900 ${className}`}>
      {/* Header with cosmic pattern */}
      <div className="relative bg-gradient-to-r from-purple-900 to-purple-800 p-4">
        <div className="absolute inset-0 opacity-20">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="celestialPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#celestialPattern)" />
          </svg>
        </div>

        <div className="relative flex justify-between items-center">
          <h2 className={`text-xl font-bold ${styles.cosmicText}`}>{title}</h2>

          {/* Cosmic energy indicator */}
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
            <div className="text-sm">Cosmic Energy: {cosmicEnergy}%</div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="p-4">{children}</div>

      {/* Footer with time controls and cosmic map */}
      <div className="bg-purple-900/30 p-4 border-t border-purple-800">
        <div className="flex flex-wrap justify-between items-center gap-4">
          {/* Time controls */}
          {showTimeControls && (
            <div className="flex flex-col">
              <div className={`text-lg font-mono ${styles.cosmicText}`}>{formatTime(currentTime)}</div>
              <div className="text-xs text-purple-300">{formatCosmicDate(currentTime)}</div>
              <div className="flex mt-2 space-x-2">
                <button
                  onClick={() => setTimeFlow("reversed")}
                  className={`px-2 py-1 rounded text-xs ${timeFlow === "reversed" ? "bg-purple-700" : "bg-purple-900"}`}
                >
                  ⏪ Reverse
                </button>
                <button
                  onClick={() => setTimeFlow("paused")}
                  className={`px-2 py-1 rounded text-xs ${timeFlow === "paused" ? "bg-purple-700" : "bg-purple-900"}`}
                >
                  ⏸️ Pause
                </button>
                <button
                  onClick={() => setTimeFlow("normal")}
                  className={`px-2 py-1 rounded text-xs ${timeFlow === "normal" ? "bg-purple-700" : "bg-purple-900"}`}
                >
                  ▶️ Normal
                </button>
                <button
                  onClick={() => setTimeFlow("accelerated")}
                  className={`px-2 py-1 rounded text-xs ${timeFlow === "accelerated" ? "bg-purple-700" : "bg-purple-900"}`}
                >
                  ⏩ Fast
                </button>
              </div>
            </div>
          )}

          {/* Cosmic map */}
          {showCosmicMap && (
            <div className="relative w-32 h-32 rounded-full overflow-hidden border border-purple-700">
              <div className="absolute inset-0 bg-[#1a103d]">
                {/* Cosmic map visualization */}
                <div className={`absolute inset-0 ${styles.cosmicRotate}`}>
                  <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="20" fill="none" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
                    <circle cx="50" cy="50" r="10" fill="none" stroke="rgba(168, 85, 247, 0.6)" strokeWidth="1" />

                    {/* Constellation lines */}
                    <line x1="30" y1="30" x2="70" y2="70" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
                    <line x1="30" y1="70" x2="70" y2="30" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
                    <line x1="50" y1="20" x2="50" y2="80" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />
                    <line x1="20" y1="50" x2="80" y2="50" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.5" />

                    {/* Stars */}
                    <circle cx="30" cy="30" r="1.5" fill="white" />
                    <circle cx="70" cy="70" r="1.5" fill="white" />
                    <circle cx="30" cy="70" r="1.5" fill="white" />
                    <circle cx="70" cy="30" r="1.5" fill="white" />
                    <circle cx="50" cy="20" r="1.5" fill="white" />
                    <circle cx="50" cy="80" r="1.5" fill="white" />
                    <circle cx="20" cy="50" r="1.5" fill="white" />
                    <circle cx="80" cy="50" r="1.5" fill="white" />
                    <circle cx="50" cy="50" r="2" fill="rgba(192, 132, 252, 0.8)" />
                  </svg>
                </div>

                {/* Current position indicator */}
                <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 rounded-full bg-purple-500 z-10 border border-white"></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default CelestialInterface
