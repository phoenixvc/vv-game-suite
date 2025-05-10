"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { getSafeImagePath } from "@/lib/image-utils"

interface PrimordialCardProps {
  title: string
  description: string
  image?: string
  power?: number
  cost?: number
  type?: string
  rarity?: "common" | "uncommon" | "rare" | "legendary"
  className?: string
  onClick?: () => void
  size?: "sm" | "md" | "lg"
  children?: React.ReactNode
}

export const PrimordialCard: React.FC<PrimordialCardProps> = ({
  title,
  description,
  image = "/lush-forest-stream.png",
  power,
  cost,
  type = "Creature",
  rarity = "common",
  className = "",
  onClick,
  size = "md",
  children,
}) => {
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const leafContainerRef = useRef<HTMLDivElement>(null)

  // Rarity colors
  const rarityColors = {
    common: "from-green-600 to-green-800",
    uncommon: "from-emerald-500 to-emerald-700",
    rare: "from-teal-500 to-teal-800",
    legendary: "from-green-400 to-yellow-600",
  }

  // Add falling leaves animation
  useEffect(() => {
    if (!leafContainerRef.current || !isHovered) return

    const container = leafContainerRef.current
    const containerRect = container.getBoundingClientRect()

    // Create leaves
    const createLeaf = () => {
      if (!container) return

      const leaf = document.createElement("div")
      leaf.className = "absolute w-3 h-3 opacity-70 z-10"

      // Randomize leaf shape and color
      const leafType = Math.floor(Math.random() * 3)
      const hue = 80 + Math.floor(Math.random() * 40)

      if (leafType === 0) {
        leaf.style.clipPath = "ellipse(50% 100% at 50% 0%)"
        leaf.style.backgroundColor = `hsl(${hue}, 70%, 40%)`
      } else if (leafType === 1) {
        leaf.style.clipPath = "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)"
        leaf.style.backgroundColor = `hsl(${hue}, 80%, 35%)`
      } else {
        leaf.style.clipPath = "polygon(50% 0%, 80% 30%, 100% 50%, 80% 70%, 50% 100%, 20% 70%, 0% 50%, 20% 30%)"
        leaf.style.backgroundColor = `hsl(${hue - 10}, 75%, 30%)`
      }

      // Random starting position
      const startX = Math.random() * containerRect.width
      leaf.style.left = `${startX}px`
      leaf.style.top = "-10px"

      // Add to container
      container.appendChild(leaf)

      // Animate falling
      const duration = 3000 + Math.random() * 3000
      const rotationDirection = Math.random() > 0.5 ? 1 : -1
      const horizontalMovement = (Math.random() - 0.5) * 100

      let startTime: number | null = null

      const animateLeaf = (timestamp: number) => {
        if (!startTime) startTime = timestamp
        const elapsed = timestamp - startTime
        const progress = elapsed / duration

        if (progress < 1) {
          // Vertical movement
          const verticalPosition = progress * containerRect.height
          leaf.style.top = `${verticalPosition}px`

          // Horizontal swaying
          const swayAmount = Math.sin(progress * 10) * 20
          const horizontalPosition = startX + horizontalMovement * progress + swayAmount
          leaf.style.left = `${horizontalPosition}px`

          // Rotation
          const rotation = progress * 360 * rotationDirection
          leaf.style.transform = `rotate(${rotation}deg) scale(${1 + Math.sin(progress * Math.PI) * 0.2})`

          requestAnimationFrame(animateLeaf)
        } else {
          // Remove leaf when animation completes
          if (container.contains(leaf)) {
            container.removeChild(leaf)
          }
        }
      }

      requestAnimationFrame(animateLeaf)
    }

    // Create leaves periodically
    const leafInterval = setInterval(createLeaf, 300)

    return () => {
      clearInterval(leafInterval)
      // Clean up any remaining leaves
      if (container) {
        const leaves = container.querySelectorAll("div")
        leaves.forEach((leaf) => container.removeChild(leaf))
      }
    }
  }, [isHovered])

  const cardWidth = size === "sm" ? "w-48" : size === "lg" ? "w-80" : "w-64"
  const cardHeight = size === "sm" ? "h-72" : size === "lg" ? "h-auto" : "h-96"

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-lg ${cardWidth} ${cardHeight} cursor-pointer transition-all duration-500 ${className}`}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered ? "translateY(-10px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 15px 30px rgba(0, 100, 0, 0.3), 0 0 15px rgba(0, 255, 0, 0.2)"
          : "0 5px 15px rgba(0, 0, 0, 0.2)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Card background with gradient */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${rarityColors[rarity]} transition-all duration-500`}
        style={{
          opacity: isHovered ? 0.9 : 0.8,
        }}
      />

      {/* Organic border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='leafPattern' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='rotate(45)'%3E%3Cpath d='M10,0 Q15,10 20,0 Q15,-10 10,0 Z' fill='rgba(0,100,0,0.3)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23leafPattern)'/%3E%3C/svg%3E")`,
          opacity: isHovered ? 0.8 : 0.5,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full p-3">
        {/* Card header */}
        <div className="flex justify-between items-center mb-2">
          <div
            className="text-lg font-bold text-green-100 bg-green-900 bg-opacity-70 px-2 py-1 rounded"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              borderLeft: "3px solid #22c55e",
            }}
          >
            {title}
          </div>
          {cost !== undefined && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 border-2 border-green-300 text-green-100 font-bold">
              {cost}
            </div>
          )}
        </div>

        {/* Card image */}
        <div
          className="relative h-40 mb-2 overflow-hidden rounded"
          style={{
            boxShadow: "inset 0 0 10px rgba(0,50,0,0.5)",
            border: "2px solid rgba(34, 197, 94, 0.5)",
          }}
        >
          <img
            src={getSafeImagePath(image || "/placeholder.svg")}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
            }}
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              ;(e.target as HTMLImageElement).src = "/nature-card.png"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-green-900 to-transparent opacity-50" />
        </div>

        {/* Card type */}
        <div className="text-xs text-green-200 bg-green-800 bg-opacity-70 px-2 py-1 rounded-sm mb-2 inline-block">
          {type}
        </div>

        {/* Card description */}
        <div
          className="flex-grow mb-2 text-sm text-green-100 bg-green-900 bg-opacity-50 p-2 rounded overflow-y-auto"
          style={{
            maxHeight: "80px",
            scrollbarWidth: "thin",
            scrollbarColor: "#22c55e #064e3b",
          }}
        >
          {description}
        </div>

        {/* Card footer */}
        {power !== undefined && (
          <div className="flex justify-end">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-700 border-2 border-green-300 text-green-100 font-bold">
              {power}
            </div>
          </div>
        )}
        {children}
      </div>

      {/* Leaf animation container */}
      <div ref={leafContainerRef} className="absolute inset-0 overflow-hidden pointer-events-none" />

      {/* Glow effect on hover */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          boxShadow: "inset 0 0 20px rgba(34, 197, 94, 0.5)",
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  )
}

export default PrimordialCard
