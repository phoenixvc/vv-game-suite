"use client"

import type React from "react"

import { useState } from "react"
import styles from "../../styles/animations.module.css"
import { getSafeImagePath } from "@/lib/image-utils"

// Update the EclipsedCardProps interface to include all props being used
interface EclipsedCardProps {
  title: string
  description: string
  image?: string
  rarity?: "common" | "uncommon" | "rare" | "legendary"
  onClick?: () => void
  className?: string
  children?: React.ReactNode
  size?: "sm" | "md" | "lg"
  type?: string
  cost?: number
  power?: number
}

export function EclipsedCard({
  title,
  description,
  image = "/placeholder.svg?key=9syth",
  rarity = "common",
  onClick,
  className = "",
  children,
}: EclipsedCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [showDaggers, setShowDaggers] = useState(false)

  // Rarity colors
  const rarityColors = {
    common: "from-gray-700 to-gray-900",
    uncommon: "from-blue-900 to-gray-900",
    rare: "from-purple-900 to-gray-900",
    legendary: "from-red-900 to-gray-900",
  }

  // Show daggers on hover after a delay
  const handleMouseEnter = () => {
    setIsHovered(true)
    setTimeout(() => setShowDaggers(true), 200)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setShowDaggers(false)
  }

  return (
    <div
      className={`relative overflow-hidden rounded-md shadow-lg transition-all duration-300 ${className}`}
      style={{
        width: "300px",
        height: "420px",
        boxShadow: isHovered
          ? "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 10px rgba(128, 0, 0, 0.3)"
          : "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
        transform: isHovered ? "translateY(-5px)" : "none",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
    >
      {/* Card border with rarity gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${rarityColors[rarity]} rounded-md`}></div>

      {/* Card inner content */}
      <div className="absolute inset-[2px] bg-gray-900 rounded-[5px] flex flex-col overflow-hidden">
        {/* Card image */}
        <div className="relative h-[200px] overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-700"
            style={{
              backgroundImage: `url(${getSafeImagePath(image)})`,
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              filter: "brightness(0.8) contrast(1.2)",
            }}
          ></div>

          {/* Shadow overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-70"></div>

          {/* Dagger silhouettes */}
          {showDaggers && (
            <>
              <div
                className={`absolute top-2 left-2 w-6 h-12 bg-black opacity-60 ${styles.shadowAppear}`}
                style={{
                  clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                  transform: "rotate(-30deg)",
                }}
              ></div>
              <div
                className={`absolute bottom-2 right-2 w-6 h-12 bg-black opacity-60 ${styles.shadowAppear}`}
                style={{
                  clipPath: "polygon(50% 0, 100% 25%, 100% 75%, 50% 100%, 0 75%, 0 25%)",
                  transform: "rotate(30deg)",
                }}
              ></div>
            </>
          )}
        </div>

        {/* Card content */}
        <div className="flex-1 p-4 flex flex-col">
          <h3 className={`text-lg font-semibold text-gray-100 mb-2 ${isHovered ? styles.shadowPulse : ""}`}>{title}</h3>
          <p className="text-sm text-gray-300 flex-1">{description}</p>

          {/* Card footer */}
          <div className="mt-4 flex justify-between items-center">
            <div className={`text-xs uppercase tracking-wider text-gray-400 ${isHovered ? styles.shadowText : ""}`}>
              Eclipsed Order
            </div>
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-br ${rarityColors[rarity]} ${isHovered ? styles.shadowPulse : ""}`}
            ></div>
          </div>
        </div>
      </div>

      {/* Corner shadow accents that appear on hover */}
      {isHovered && (
        <>
          <div className={`absolute top-0 left-0 w-12 h-12 pointer-events-none ${styles.shadowCorner}`}></div>
          <div
            className={`absolute top-0 right-0 w-12 h-12 pointer-events-none ${styles.shadowCorner}`}
            style={{ transform: "scaleX(-1)" }}
          ></div>
          <div
            className={`absolute bottom-0 left-0 w-12 h-12 pointer-events-none ${styles.shadowCorner}`}
            style={{ transform: "scaleY(-1)" }}
          ></div>
          <div
            className={`absolute bottom-0 right-0 w-12 h-12 pointer-events-none ${styles.shadowCorner}`}
            style={{ transform: "scale(-1)" }}
          ></div>
        </>
      )}

      {children}
    </div>
  )
}

export default EclipsedCard
