"use client"

import type React from "react"
import { useState } from "react"
import styles from "../../styles/animations.module.css"
import { getSafeImagePath } from "@/lib/image-utils"

// Update the TitanbornCardProps interface to include all props being used
interface TitanbornCardProps {
  title: string
  description: string
  image?: string
  rarity?: "common" | "uncommon" | "rare" | "legendary"
  type?: string
  cost?: number
  power?: number
  children?: React.ReactNode
  onClick?: () => void
  className?: string
  size?: "sm" | "md" | "lg"
}

export function TitanbornCard({
  title,
  description,
  image = "/stone-forge.png",
  rarity = "common",
  type = "Artifact",
  cost,
  power,
  children,
  onClick,
  className = "",
  size = "md",
}: TitanbornCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Rarity-based styling
  const rarityStyles = {
    common: {
      borderColor: "border-stone-500",
      titleBg: "bg-stone-700",
      accentColor: "text-stone-300",
      glowColor: "rgba(120, 113, 108, 0.7)",
    },
    uncommon: {
      borderColor: "border-amber-600",
      titleBg: "bg-amber-900",
      accentColor: "text-amber-300",
      glowColor: "rgba(217, 119, 6, 0.7)",
    },
    rare: {
      borderColor: "border-orange-500",
      titleBg: "bg-orange-900",
      accentColor: "text-orange-300",
      glowColor: "rgba(249, 115, 22, 0.7)",
    },
    legendary: {
      borderColor: "border-red-600",
      titleBg: "bg-red-900",
      accentColor: "text-red-300",
      glowColor: "rgba(220, 38, 38, 0.7)",
    },
  }

  const currentRarityStyle = rarityStyles[rarity]

  return (
    <div
      className={`relative overflow-hidden rounded-md transition-all duration-300 ${className}`}
      style={{
        maxWidth: "300px",
        transform: isHovered ? "translateY(-5px)" : "translateY(0)",
        boxShadow: isHovered
          ? `0 10px 25px -5px ${currentRarityStyle.glowColor}, 0 8px 10px -6px ${currentRarityStyle.glowColor}`
          : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Stone texture border */}
      <div
        className={`absolute inset-0 border-8 ${currentRarityStyle.borderColor} rounded-md pointer-events-none`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fillOpacity='0.1' fillRule='evenodd'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Card content */}
      <div className="relative bg-stone-800 text-stone-100">
        {/* Card image */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={getSafeImagePath(image || "/placeholder.svg")}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? "scale(1.05)" : "scale(1)",
            }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              ;(e.target as HTMLImageElement).src = "/stone-forge.png"
            }}
          />

          {/* Forge glow overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-orange-600/30 to-transparent opacity-0 transition-opacity duration-300`}
            style={{ opacity: isHovered ? 0.6 : 0 }}
          />

          {/* Cost indicator */}
          {cost !== undefined && (
            <div
              className={`absolute top-2 left-2 w-8 h-8 rounded-full flex items-center justify-center ${currentRarityStyle.titleBg} ${styles.stoneTexture}`}
            >
              <span className="text-white font-bold">{cost}</span>
            </div>
          )}

          {/* Power indicator */}
          {power !== undefined && (
            <div
              className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center ${currentRarityStyle.titleBg} ${styles.stoneTexture}`}
            >
              <span className="text-white font-bold">{power}</span>
            </div>
          )}
        </div>

        {/* Card title */}
        <div
          className={`${currentRarityStyle.titleBg} px-3 py-2 border-y-2 ${currentRarityStyle.borderColor} ${styles.stoneTexture}`}
        >
          <h3 className={`font-bold text-lg ${currentRarityStyle.accentColor}`}>{title}</h3>
        </div>

        {/* Card type */}
        <div className="px-3 py-1 bg-stone-900 text-xs text-stone-400 border-b border-stone-700">{type}</div>

        {/* Card description */}
        <div className="p-3 bg-stone-800">
          <p className="text-sm">{description}</p>
          {children}
        </div>

        {/* Metal corner accents */}
        <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-amber-600" />
        <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-amber-600" />
        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-amber-600" />
        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-amber-600" />
      </div>

      {/* Rarity indicator */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-1 ${styles.metalShine}`}
        style={{
          background: currentRarityStyle.glowColor,
          opacity: isHovered ? 1 : 0.7,
        }}
      />
    </div>
  )
}

export default TitanbornCard
