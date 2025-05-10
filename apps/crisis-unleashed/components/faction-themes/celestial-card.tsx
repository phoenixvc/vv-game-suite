"use client"

import { useState } from "react"
import styles from "../../styles/animations.module.css"
import Image from "next/image"
import { getSafeImagePath } from "@/lib/image-utils"

// Update the CelestialCardProps interface to include all props being used
interface CelestialCardProps {
  title: string
  description: string
  image?: string
  rarity?: "common" | "uncommon" | "rare" | "epic" | "legendary"
  type?: "hero" | "artifact" | "spell"
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

/**
 * Renders a stylized celestial-themed card with dynamic visual effects and interactive behavior.
 *
 * Displays a card with a title, description, image, rarity indicator, and type icon. The card features animated cosmic effects, a constellation pattern overlay, and visual styling that adapts to rarity and size. Hovering triggers a glow and shimmer effect. Supports an optional click handler and customizable appearance via props.
 *
 * @param title - The card's title text.
 * @param description - The card's description text.
 * @param image - Optional image URL for the card; defaults to a placeholder if not provided or if loading fails.
 * @param rarity - Optional rarity level; determines border and glow effects. Defaults to "common".
 * @param type - Optional card type; determines the icon displayed. Defaults to "artifact".
 * @param onClick - Optional click handler for the card.
 * @param className - Optional additional CSS classes for the card container.
 * @param size - Optional card size; affects dimensions and image size. Defaults to "md".
 *
 * @returns A React element representing the celestial card.
 */
export function CelestialCard({
  title,
  description,
  image = "/placeholder.svg?key=3j2wr",
  rarity = "common",
  type = "artifact",
  onClick,
  className = "",
  size = "md",
}: CelestialCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Determine border color based on rarity
  const getRarityColor = () => {
    switch (rarity) {
      case "common":
        return "from-purple-300/30 to-purple-500/30"
      case "uncommon":
        return "from-purple-400/40 to-purple-600/40"
      case "rare":
        return "from-purple-500/50 to-purple-700/50"
      case "epic":
        return "from-purple-600/60 to-purple-800/60"
      case "legendary":
        return "from-purple-700/70 via-fuchsia-500/70 to-purple-900/70"
      default:
        return "from-purple-300/30 to-purple-500/30"
    }
  }

  // Determine glow effect based on rarity
  const getGlowEffect = () => {
    if (!isHovered) return ""

    switch (rarity) {
      case "common":
        return "shadow-[0_0_10px_rgba(168,85,247,0.3)]"
      case "uncommon":
        return "shadow-[0_0_15px_rgba(168,85,247,0.4)]"
      case "rare":
        return "shadow-[0_0_20px_rgba(168,85,247,0.5)]"
      case "epic":
        return "shadow-[0_0_25px_rgba(192,132,252,0.6)]"
      case "legendary":
        return "shadow-[0_0_30px_rgba(217,70,239,0.7)]"
      default:
        return "shadow-[0_0_10px_rgba(168,85,247,0.3)]"
    }
  }

  // Determine card type icon
  const getTypeIcon = () => {
    switch (type) {
      case "hero":
        return "👑"
      case "artifact":
        return "🔮"
      case "spell":
        return "✨"
      default:
        return "🔮"
    }
  }

  return (
    <div
      className={`relative flex flex-col ${
        size === "sm" ? "w-48 h-72" : size === "lg" ? "w-80 h-[32rem]" : "w-64 h-96"
      } rounded-lg overflow-hidden transition-all duration-300 ${
        isHovered ? "transform scale-105 " + getGlowEffect() : ""
      } ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Cosmic border */}
      <div className={`absolute inset-0 bg-gradient-to-br ${getRarityColor()} rounded-lg`}></div>

      {/* Card content container */}
      <div className="absolute inset-[2px] bg-[#1a103d] rounded-lg overflow-hidden flex flex-col">
        {/* Constellation pattern overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <pattern id="constellationPattern" width="100" height="100" patternUnits="userSpaceOnUse">
              <circle cx="10" cy="10" r="1" fill="white" />
              <circle cx="30" cy="20" r="1" fill="white" />
              <circle cx="50" cy="10" r="1" fill="white" />
              <circle cx="70" cy="30" r="1" fill="white" />
              <circle cx="90" cy="15" r="1" fill="white" />
              <circle cx="20" cy="50" r="1" fill="white" />
              <circle cx="40" cy="70" r="1" fill="white" />
              <circle cx="60" cy="50" r="1" fill="white" />
              <circle cx="80" cy="80" r="1" fill="white" />
              <line x1="10" y1="10" x2="30" y2="20" stroke="white" strokeWidth="0.2" />
              <line x1="30" y1="20" x2="50" y2="10" stroke="white" strokeWidth="0.2" />
              <line x1="50" y1="10" x2="70" y2="30" stroke="white" strokeWidth="0.2" />
              <line x1="70" y1="30" x2="90" y2="15" stroke="white" strokeWidth="0.2" />
              <line x1="20" y1="50" x2="40" y2="70" stroke="white" strokeWidth="0.2" />
              <line x1="40" y1="70" x2="60" y2="50" stroke="white" strokeWidth="0.2" />
              <line x1="60" y1="50" x2="80" y2="80" stroke="white" strokeWidth="0.2" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#constellationPattern)" />
          </svg>
        </div>

        {/* Card image */}
        <div className={`relative ${size === "sm" ? "h-24" : size === "lg" ? "h-56" : "h-40"} overflow-hidden`}>
          <Image
            src={getSafeImagePath(image || "/placeholder.svg")}
            alt={title}
            width={size === "sm" ? 192 : size === "lg" ? 320 : 256}
            height={size === "sm" ? 120 : size === "lg" ? 200 : 160}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              ;(e.target as HTMLImageElement).src = "/celestial-card.png"
            }}
          />

          {/* Cosmic overlay on hover */}
          {isHovered && (
            <div
              className={`absolute inset-0 bg-gradient-to-t from-transparent to-purple-900/30 ${styles.cosmicShimmer}`}
            ></div>
          )}

          {/* Rarity indicator */}
          <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold">
            <div
              className={`absolute inset-0 rounded-full ${styles.starTwinkle}`}
              style={{
                background:
                  rarity === "legendary"
                    ? "linear-gradient(45deg, #a855f7, #d946ef, #a855f7)"
                    : `rgba(168, 85, 247, ${["common", "uncommon", "rare", "epic", "legendary"].indexOf(rarity) * 0.2 + 0.2})`,
              }}
            ></div>
            <span className="relative text-white z-10">
              {["common", "uncommon", "rare", "epic", "legendary"].indexOf(rarity) + 1}
            </span>
          </div>
        </div>

        {/* Card content */}
        <div className="flex-1 p-4 flex flex-col">
          {/* Title with cosmic effect */}
          <h3 className={`text-lg font-bold text-white mb-2 ${styles.cosmicText}`}>{title}</h3>

          {/* Description */}
          <p className="text-sm text-purple-100/80 flex-1">{description}</p>

          {/* Card footer */}
          <div className="mt-2 flex justify-between items-center">
            {/* Card type */}
            <div className="flex items-center">
              <span className="mr-1">{getTypeIcon()}</span>
              <span className="text-xs text-purple-200/70 capitalize">{type}</span>
            </div>

            {/* Cosmic energy indicator */}
            <div className={`w-6 h-6 rounded-full flex items-center justify-center ${styles.cosmicPulse}`}>
              <div className="w-4 h-4 rounded-full bg-purple-500"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CelestialCard
