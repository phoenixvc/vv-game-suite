"use client"

import type React from "react"
import { useState, useEffect } from "react"
import styles from "../../styles/animations.module.css"

interface TitanbornInterfaceProps {
  title: string
  children: React.ReactNode
  forgeLevel?: number
  showForgeIndicator?: boolean
  className?: string
}

export function TitanbornInterface({
  title,
  children,
  forgeLevel = 75,
  showForgeIndicator = true,
  className = "",
}: TitanbornInterfaceProps) {
  const [currentForgeLevel, setCurrentForgeLevel] = useState(forgeLevel)
  const [isForging, setIsForging] = useState(false)

  // Simulate forge level fluctuations
  useEffect(() => {
    if (!showForgeIndicator) return

    const interval = setInterval(() => {
      setCurrentForgeLevel((prev) => {
        const fluctuation = Math.random() * 6 - 3 // -3 to +3
        const newValue = Math.max(0, Math.min(100, prev + fluctuation))
        return newValue
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [showForgeIndicator])

  // Determine forge status
  const getForgeStatus = () => {
    if (currentForgeLevel < 30) return "Cold"
    if (currentForgeLevel < 60) return "Warming"
    if (currentForgeLevel < 85) return "Optimal"
    return "Overheating"
  }

  // Get color based on forge level
  const getForgeColor = () => {
    if (currentForgeLevel < 30) return "bg-blue-500"
    if (currentForgeLevel < 60) return "bg-yellow-500"
    if (currentForgeLevel < 85) return "bg-orange-500"
    return "bg-red-500"
  }

  return (
    <div
      className={`bg-stone-800 border-2 border-stone-600 rounded-md overflow-hidden ${className}`}
      style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.05' fillRule='evenodd'/%3E%3C/svg%3E")`,
      }}
    >
      {/* Header with metal texture */}
      <div
        className={`bg-stone-700 border-b-2 border-amber-700 px-4 py-2 flex justify-between items-center ${styles.metalShine}`}
      >
        <h2 className="text-amber-300 font-bold text-lg flex items-center">
          <span className={`inline-block w-3 h-3 rounded-full bg-amber-500 mr-2 ${styles.forgeGlow}`}></span>
          {title}
        </h2>

        {/* Forge controls */}
        <div className="flex items-center space-x-2">
          <button
            className={`px-2 py-1 bg-stone-800 border border-stone-600 rounded text-xs text-stone-300 hover:bg-stone-700 transition-colors ${isForging ? "bg-amber-900 text-amber-200" : ""}`}
            onClick={() => setIsForging(!isForging)}
          >
            {isForging ? "Stop Forge" : "Start Forge"}
          </button>
        </div>
      </div>

      {/* Forge level indicator */}
      {showForgeIndicator && (
        <div className="px-4 py-2 bg-stone-900 border-b border-stone-700">
          <div className="flex justify-between items-center text-xs text-stone-400 mb-1">
            <span>Forge Temperature</span>
            <span className={currentForgeLevel > 85 ? "text-red-400" : "text-amber-400"}>
              {getForgeStatus()} ({Math.round(currentForgeLevel)}%)
            </span>
          </div>
          <div className="w-full h-2 bg-stone-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getForgeColor()} ${styles.forgeFlicker}`}
              style={{ width: `${currentForgeLevel}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Content area */}
      <div className="p-4 text-stone-200">{children}</div>

      {/* Metal corner rivets */}
      <div className="absolute top-2 left-2 w-2 h-2 rounded-full bg-amber-600 shadow-inner" />
      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-600 shadow-inner" />
      <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-amber-600 shadow-inner" />
      <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-amber-600 shadow-inner" />
    </div>
  )
}

export default TitanbornInterface
