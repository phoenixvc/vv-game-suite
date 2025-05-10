"use client"

import { useState, useEffect, useRef } from "react"
import type { CardData } from "@/lib/card-data"
import styles from "@/styles/animations.module.css"
import { getSafeImagePath } from "@/lib/image-utils"

/**
 * Renders a stylized cybernetic-themed card UI with animated circuit borders, interactive hover effects, and card details.
 *
 * Displays the card's name, image (with fallback), provision, type, stats (if applicable), description, up to two abilities, faction, and rarity. The card features an animated canvas border with pulsating nodes and animated data flow lines on hover, as well as a holographic overlay effect.
 *
 * @param card - The card data to display, including properties such as name, imageUrl, provision, type, attack, defense, health, description, abilities, faction, and rarity.
 * @param className - Optional additional CSS classes for the card container.
 * @param onClick - Optional click event handler for the card.
 * @param size - Optional size variant ("sm", "md", or "lg"); defaults to "md".
 *
 * @returns The rendered React element for the cybernetic card.
 *
 * @remark If the card image fails to load or is missing, a placeholder SVG is displayed based on the card name.
 */
export default function CyberneticCard({
  card,
  className = "",
  onClick,
  size = "md",
}: {
  card: CardData
  className?: string
  onClick?: () => void
  size?: "sm" | "md" | "lg"
}) {
  const [isHovered, setIsHovered] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [imageError, setImageError] = useState(false)

  // Handle image error
  const handleImageError = () => {
    setImageError(true)
  }

  // Get image URL with fallback
  const getImageUrl = () => {
    if (imageError || !card.imageUrl) {
      return `/placeholder.svg?height=300&width=250&query=${encodeURIComponent(
        `cybernetic ${card.name.toLowerCase()}`,
      )}`
    }
    return card.imageUrl
  }

  // Draw circuit border animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      return { width: rect.width, height: rect.height }
    }

    const { width, height } = updateCanvasSize()

    // Animation variables
    let time = 0
    let animationFrame: number

    // Draw circuit border
    const drawCircuitBorder = () => {
      time += 0.01
      ctx.clearRect(0, 0, width, height)

      // Draw border
      ctx.strokeStyle = "#0ea5e9"
      ctx.lineWidth = 2
      ctx.strokeRect(0, 0, width, height)

      // Draw corner circuits
      const cornerSize = 20
      const cornerGap = 5

      // Top left corner
      ctx.beginPath()
      ctx.moveTo(0, cornerSize)
      ctx.lineTo(0, cornerGap)
      ctx.lineTo(cornerGap, 0)
      ctx.lineTo(cornerSize, 0)
      ctx.strokeStyle = "#0ea5e9"
      ctx.lineWidth = 2
      ctx.stroke()

      // Top right corner
      ctx.beginPath()
      ctx.moveTo(width - cornerSize, 0)
      ctx.lineTo(width - cornerGap, 0)
      ctx.lineTo(width, cornerGap)
      ctx.lineTo(width, cornerSize)
      ctx.stroke()

      // Bottom left corner
      ctx.beginPath()
      ctx.moveTo(0, height - cornerSize)
      ctx.lineTo(0, height - cornerGap)
      ctx.lineTo(cornerGap, height)
      ctx.lineTo(cornerSize, height)
      ctx.stroke()

      // Bottom right corner
      ctx.beginPath()
      ctx.moveTo(width - cornerSize, height)
      ctx.lineTo(width - cornerGap, height)
      ctx.lineTo(width, height - cornerGap)
      ctx.lineTo(width, height - cornerSize)
      ctx.stroke()

      // Draw circuit nodes
      const nodePositions = [
        { x: cornerSize / 2, y: cornerSize / 2 },
        { x: width - cornerSize / 2, y: cornerSize / 2 },
        { x: cornerSize / 2, y: height - cornerSize / 2 },
        { x: width - cornerSize / 2, y: height - cornerSize / 2 },
        { x: width / 2, y: 0 },
        { x: width / 2, y: height },
        { x: 0, y: height / 2 },
        { x: width, y: height / 2 },
      ]

      nodePositions.forEach((node, index) => {
        const pulse = Math.sin(time * 2 + index) * 0.5 + 0.5
        ctx.beginPath()
        ctx.arc(node.x, node.y, 3 + pulse * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(14, 165, 233, ${0.5 + pulse * 0.5})`
        ctx.fill()
      })

      // Draw data flow
      if (isHovered) {
        const flowPositions = [
          { startX: 0, startY: height / 2, endX: width, endY: height / 2 },
          { startX: width / 2, startY: 0, endX: width / 2, endY: height },
        ]

        flowPositions.forEach((flow) => {
          const gradient = ctx.createLinearGradient(flow.startX, flow.startY, flow.endX, flow.endY)
          gradient.addColorStop(0, "rgba(14, 165, 233, 0)")
          gradient.addColorStop((time * 2) % 1, "rgba(14, 165, 233, 0.8)")
          gradient.addColorStop(Math.min(((time * 2) % 1) + 0.1, 1), "rgba(14, 165, 233, 0.8)")
          gradient.addColorStop(1, "rgba(14, 165, 233, 0)")

          ctx.strokeStyle = gradient
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(flow.startX, flow.startY)
          ctx.lineTo(flow.endX, flow.endY)
          ctx.stroke()
        })
      }

      animationFrame = requestAnimationFrame(drawCircuitBorder)
    }

    drawCircuitBorder()

    return () => {
      cancelAnimationFrame(animationFrame)
    }
  }, [isHovered])

  return (
    <div
      className={`relative rounded-md overflow-hidden transition-all duration-300 ${className} ${
        isHovered ? "scale-105 shadow-lg shadow-cyan-500/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      <div className="relative z-10 bg-slate-900 p-4 border border-slate-800">
        {/* Card Header */}
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-bold text-cyan-400">{card.name}</h3>
          <div className="bg-cyan-900/50 px-2 py-1 rounded text-xs font-mono text-cyan-300">{card.provision || 0}</div>
        </div>

        {/* Card Image */}
        <div className="relative mb-3 bg-slate-800 rounded overflow-hidden">
          <div className="pt-[75%]">
            <img
              src={getSafeImagePath(getImageUrl() || "/placeholder.svg")}
              alt={card.name}
              className="absolute inset-0 w-full h-full object-cover"
              onError={handleImageError}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent opacity-60"></div>
            <div
              className={`absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-transparent ${
                isHovered ? styles.securityScan : ""
              }`}
            ></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-sm px-2 py-1 text-xs font-mono text-cyan-300">
            {card.type || "Cybernetic"}
          </div>
        </div>

        {/* Card Stats */}
        {card.type === "Hero" && (
          <div className="flex justify-between mb-3 bg-slate-800/50 rounded p-2">
            <div className="text-center">
              <div className="text-xs text-slate-400">ATK</div>
              <div className="text-cyan-400 font-bold">{card.attack || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">DEF</div>
              <div className="text-cyan-400 font-bold">{card.defense || 0}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-slate-400">HP</div>
              <div className="text-cyan-400 font-bold">{card.health || 0}</div>
            </div>
          </div>
        )}

        {/* Card Description */}
        <div className="mb-3">
          <p className="text-sm text-slate-300">{card.description}</p>
        </div>

        {/* Card Abilities */}
        {card.abilities && card.abilities.length > 0 && (
          <div className="space-y-2 mb-3">
            {card.abilities.slice(0, 2).map((ability, index) => (
              <div key={index} className="bg-slate-800/50 rounded p-2">
                <div className="flex justify-between items-center mb-1">
                  <div className="text-sm font-bold text-cyan-400">{ability.name}</div>
                  {ability.cost !== undefined && (
                    <div className="bg-cyan-900/50 px-2 py-0.5 rounded-full text-xs font-mono text-cyan-300">
                      {ability.cost}
                    </div>
                  )}
                </div>
                <p className="text-xs text-slate-300">{ability.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Card Footer */}
        <div className="flex justify-between text-xs text-slate-400">
          <div>{card.faction}</div>
          <div className="text-cyan-300">{card.rarity}</div>
        </div>

        {/* Holographic Overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-transparent to-cyan-500/5 pointer-events-none transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        ></div>
      </div>
    </div>
  )
}
