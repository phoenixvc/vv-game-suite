"use client"

import type React from "react"

import { useState, useEffect } from "react"
import styles from "../../styles/animations.module.css"

interface EclipsedInterfaceProps {
  title: string
  children: React.ReactNode
  stealthLevel?: number
  showTargets?: boolean
  className?: string
}

export function EclipsedInterface({
  title,
  children,
  stealthLevel = 70,
  showTargets = true,
  className = "",
}: EclipsedInterfaceProps) {
  const [currentStealthLevel, setCurrentStealthLevel] = useState(stealthLevel)
  const [isDetected, setIsDetected] = useState(false)
  const [targets, setTargets] = useState<Array<{ id: number; x: number; y: number; marked: boolean }>>([])

  // Initialize random targets
  useEffect(() => {
    if (showTargets) {
      const newTargets = Array.from({ length: 5 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        marked: false,
      }))
      setTargets(newTargets)
    }
  }, [showTargets])

  // Simulate stealth level fluctuations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStealthLevel((prev) => {
        const change = Math.random() * 6 - 3
        const newValue = Math.max(0, Math.min(100, prev + change))

        // Check if detected
        if (newValue < 30 && !isDetected) {
          setIsDetected(true)
          setTimeout(() => setIsDetected(false), 3000)
        }

        return newValue
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isDetected])

  // Mark random targets periodically
  useEffect(() => {
    if (!showTargets) return

    const interval = setInterval(() => {
      setTargets((prev) => {
        const newTargets = [...prev]
        const randomIndex = Math.floor(Math.random() * newTargets.length)

        newTargets[randomIndex] = {
          ...newTargets[randomIndex],
          marked: !newTargets[randomIndex].marked,
        }

        return newTargets
      })
    }, 3000)

    return () => clearInterval(interval)
  }, [showTargets])

  // Determine stealth level color
  const getStealthColor = () => {
    if (currentStealthLevel > 70) return "bg-green-500"
    if (currentStealthLevel > 30) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <div className={`relative border border-gray-700 rounded-md bg-gray-900 shadow-lg overflow-hidden ${className}`}>
      {/* Interface header */}
      <div className="border-b border-gray-700 bg-gray-800 px-4 py-2 flex justify-between items-center">
        <h2 className="text-gray-200 font-medium tracking-wider">{title}</h2>

        {/* Stealth indicator */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">STEALTH</span>
          <div className="w-24 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full ${getStealthColor()} transition-all duration-1000`}
              style={{ width: `${currentStealthLevel}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Detection alert */}
      {isDetected && (
        <div
          className={`absolute inset-x-0 top-10 bg-red-900 bg-opacity-80 text-red-100 text-center py-1 text-sm ${styles.shadowPulse}`}
        >
          ⚠ DETECTION RISK ELEVATED ⚠
        </div>
      )}

      {/* Main content */}
      <div className="relative p-4">{children}</div>

      {/* Target indicators */}
      {showTargets && (
        <div className="absolute inset-0 pointer-events-none">
          {targets.map((target) => (
            <div
              key={target.id}
              className={`absolute w-4 h-4 ${target.marked ? styles.shadowPulse : ""}`}
              style={{
                left: `${target.x}%`,
                top: `${target.y}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div
                className={`w-full h-full rounded-full border ${target.marked ? "border-red-500" : "border-gray-500"} opacity-70`}
              ></div>
              {target.marked && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-1 h-1 bg-red-500 rounded-full"></div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-gray-600"></div>
      <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-gray-600"></div>
      <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-gray-600"></div>
      <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-gray-600"></div>
    </div>
  )
}

export default EclipsedInterface
