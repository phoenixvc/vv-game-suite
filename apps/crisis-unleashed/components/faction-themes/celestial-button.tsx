"use client"

import type React from "react"

import { useState } from "react"
import styles from "../../styles/animations.module.css"

interface CelestialButtonProps {
  children: React.ReactNode
  onClick?: () => void
  variant?: "primary" | "secondary" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  disabled?: boolean
  className?: string
  icon?: React.ReactNode
  cosmicEffect?: "portal" | "stars" | "time" | "none"
}

export function CelestialButton({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  className = "",
  icon,
  cosmicEffect = "stars",
}: CelestialButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Determine base styles based on variant
  const getVariantStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-purple-700 to-purple-900 text-white border-purple-500"
      case "secondary":
        return "bg-gradient-to-r from-purple-600/30 to-purple-800/30 text-purple-100 border-purple-700/50"
      case "outline":
        return "bg-transparent text-purple-300 border-purple-500"
      case "ghost":
        return "bg-transparent text-purple-300 border-transparent hover:bg-purple-900/20"
      default:
        return "bg-gradient-to-r from-purple-700 to-purple-900 text-white border-purple-500"
    }
  }

  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs py-1 px-3"
      case "lg":
        return "text-lg py-3 px-6"
      case "md":
      default:
        return "text-sm py-2 px-4"
    }
  }

  // Determine cosmic effect
  const getCosmicEffect = () => {
    if (disabled || cosmicEffect === "none") return ""

    if (isHovered) {
      switch (cosmicEffect) {
        case "portal":
          return styles.portalOpen
        case "stars":
          return styles.starTwinkle
        case "time":
          return styles.timeRipple
        default:
          return styles.starTwinkle
      }
    }

    return ""
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative overflow-hidden
        rounded-md border
        transition-all duration-300
        ${getVariantStyles()}
        ${getSizeStyles()}
        ${isPressed ? "transform scale-95" : ""}
        ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
        ${className}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
    >
      {/* Cosmic effect background */}
      <div className={`absolute inset-0 ${getCosmicEffect()}`}>
        {cosmicEffect === "stars" && (
          <div className="absolute inset-0 opacity-30">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <pattern id="starPattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <circle cx="10" cy="10" r="0.5" fill="white" />
              </pattern>
              <rect width="100%" height="100%" fill="url(#starPattern)" />
            </svg>
          </div>
        )}

        {cosmicEffect === "portal" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0 h-0 rounded-full bg-purple-500/20 absolute"></div>
          </div>
        )}

        {cosmicEffect === "time" && (
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="1" />
              <line x1="50" y1="50" x2="50" y2="20" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
              <line x1="50" y1="50" x2="70" y2="50" stroke="rgba(168, 85, 247, 0.5)" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Button content */}
      <div className="relative flex items-center justify-center">
        {icon && <span className="mr-2">{icon}</span>}
        {children}
      </div>
    </button>
  )
}

export default CelestialButton
