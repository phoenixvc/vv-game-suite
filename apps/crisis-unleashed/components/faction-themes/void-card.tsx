"use client"

import { useState, useRef, useEffect } from "react"
import styles from "@/styles/animations.module.css"
import { getSafeImagePath } from "@/lib/image-utils"

interface VoidCardProps {
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
}

export default function VoidCard({
  title,
  description,
  image,
  power,
  cost,
  type = "Entity",
  rarity = "common",
  className = "",
  onClick,
  size,
}: VoidCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isGlitching, setIsGlitching] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const glitchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Rarity colors
  const rarityColors = {
    common: "from-indigo-700 to-indigo-900",
    uncommon: "from-indigo-600 to-purple-800",
    rare: "from-purple-600 to-indigo-900",
    legendary: "from-indigo-500 via-purple-600 to-fuchsia-700",
  }

  // Trigger random glitch effects
  useEffect(() => {
    if (!isHovered) return

    const triggerRandomGlitch = () => {
      if (Math.random() < 0.3) {
        setIsGlitching(true)

        if (glitchTimeoutRef.current) {
          clearTimeout(glitchTimeoutRef.current)
        }

        glitchTimeoutRef.current = setTimeout(
          () => {
            setIsGlitching(false)
          },
          200 + Math.random() * 500,
        )
      }

      const nextGlitch = 1000 + Math.random() * 3000
      setTimeout(triggerRandomGlitch, nextGlitch)
    }

    const timeout = setTimeout(triggerRandomGlitch, 500)

    return () => {
      clearTimeout(timeout)
      if (glitchTimeoutRef.current) {
        clearTimeout(glitchTimeoutRef.current)
      }
    }
  }, [isHovered])

  // Dimensional tear effect on the image
  useEffect(() => {
    if (!isHovered || !imageRef.current || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const img = imageRef.current

    // Wait for image to load
    if (!img.complete) {
      img.onload = setupCanvas
    } else {
      setupCanvas()
    }

    function setupCanvas() {
      // Set canvas dimensions
      canvas.width = img.width
      canvas.height = img.height

      let animationId: number
      let time = 0

      function animate() {
        time += 0.01

        // Draw the original image
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

        // Apply dimensional tear effects
        applyDimensionalTears(ctx, canvas.width, canvas.height, time)

        animationId = requestAnimationFrame(animate)
      }

      animate()

      return () => {
        cancelAnimationFrame(animationId)
      }
    }

    function applyDimensionalTears(ctx: CanvasRenderingContext2D, width: number, height: number, time: number) {
      // Create 2-3 tears
      const tearCount = 2 + Math.floor(Math.random())

      for (let i = 0; i < tearCount; i++) {
        // Tear position and size
        const x = width * (0.2 + Math.random() * 0.6)
        const y = height * (0.2 + Math.random() * 0.6)
        const size = 20 + Math.random() * 40

        // Create tear shape
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(Math.random() * Math.PI * 2)

        // Draw tear
        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size)
        gradient.addColorStop(0, "rgba(99, 102, 241, 0.8)")
        gradient.addColorStop(0.5, "rgba(79, 70, 229, 0.4)")
        gradient.addColorStop(1, "rgba(67, 56, 202, 0)")

        ctx.fillStyle = gradient

        // Create irregular tear shape
        ctx.beginPath()
        const segments = 12
        const angleStep = (Math.PI * 2) / segments

        for (let j = 0; j <= segments; j++) {
          const angle = j * angleStep
          const distortionAmount = Math.sin(angle * 3 + time * 2) * 0.3 * size
          const currentRadius = size + distortionAmount

          const x = Math.cos(angle) * currentRadius
          const y = Math.sin(angle) * currentRadius

          if (j === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }
        }

        ctx.closePath()
        ctx.fill()

        // Add glow effect
        ctx.shadowColor = "rgba(99, 102, 241, 0.8)"
        ctx.shadowBlur = 15
        ctx.beginPath()
        ctx.arc(0, 0, size * 0.5, 0, Math.PI * 2)
        ctx.fill()

        // Add some void particles
        for (let j = 0; j < 10; j++) {
          const particleAngle = Math.random() * Math.PI * 2
          const particleDistance = Math.random() * size * 1.5
          const particleSize = 1 + Math.random() * 2

          const particleX = Math.cos(particleAngle) * particleDistance
          const particleY = Math.sin(particleAngle) * particleDistance

          ctx.fillStyle = `rgba(${99 + Math.random() * 50}, ${102 + Math.random() * 50}, ${241 + Math.random() * 14}, ${Math.random() * 0.8})`
          ctx.beginPath()
          ctx.arc(particleX, particleY, particleSize, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }

      // Occasionally add glitch lines
      if (Math.random() < 0.1) {
        const lineCount = 1 + Math.floor(Math.random() * 3)

        for (let i = 0; i < lineCount; i++) {
          const y = Math.random() * height
          const lineWidth = 1 + Math.random() * 5

          ctx.fillStyle = `rgba(99, 102, 241, ${0.3 + Math.random() * 0.5})`
          ctx.fillRect(0, y, width, lineWidth)
        }
      }
    }

    return () => {
      if (img.onload) {
        img.onload = null
      }
    }
  }, [isHovered, image])

  let width = "w-64"
  let height = "h-96"

  if (size === "sm") {
    width = "w-48"
    height = "h-72"
  } else if (size === "lg") {
    width = "w-80"
    height = "h-120"
  }

  return (
    <div
      ref={cardRef}
      className={`relative overflow-hidden rounded-lg ${width} ${height} cursor-pointer transition-all duration-500 ${className} ${
        isGlitching ? styles.voidGlitch : ""
      }`}
      style={{
        transformStyle: "preserve-3d",
        transform: isHovered ? "translateY(-10px)" : "translateY(0)",
        boxShadow: isHovered
          ? "0 15px 30px rgba(79, 70, 229, 0.3), 0 0 15px rgba(99, 102, 241, 0.2)"
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

      {/* Void border */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='voidPattern' patternUnits='userSpaceOnUse' width='40' height='40' patternTransform='rotate(45)'%3E%3Cpath d='M20,0 Q25,20 20,40 Q15,20 20,0 Z' fill='rgba(79, 70, 229, 0.2)'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23voidPattern)'/%3E%3C/svg%3E")`,
          opacity: isHovered ? 0.8 : 0.5,
          transition: "opacity 0.5s ease",
        }}
      />

      {/* Card content */}
      <div className="relative z-10 flex flex-col h-full p-3">
        {/* Card header */}
        <div className="flex justify-between items-center mb-2">
          <div
            className="text-lg font-bold text-indigo-100 bg-indigo-900 bg-opacity-70 px-2 py-1 rounded"
            style={{
              textShadow: "0 1px 2px rgba(0,0,0,0.5)",
              borderLeft: "3px solid #6366f1",
            }}
          >
            {title}
          </div>
          {cost !== undefined && (
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-700 border-2 border-indigo-300 text-indigo-100 font-bold">
              {cost}
            </div>
          )}
        </div>

        {/* Card image */}
        <div
          className="relative h-40 mb-2 overflow-hidden rounded"
          style={{
            boxShadow: "inset 0 0 10px rgba(67, 56, 202, 0.5)",
            border: "2px solid rgba(99, 102, 241, 0.5)",
          }}
        >
          {/* Hidden original image for reference */}
          <img
            ref={imageRef}
            src={getSafeImagePath(image || "/placeholder.svg?height=160&width=220&query=void%20entity")}
            alt={title}
            className="hidden"
            onError={(e) => {
              // Fallback to placeholder if image fails to load
              ;(e.target as HTMLImageElement).src = "/void-entity.png"
            }}
          />

          {/* Canvas for dimensional tear effect */}
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-transform duration-700"
            style={{
              transform: isHovered ? "scale(1.1)" : "scale(1)",
              filter: isGlitching ? "hue-rotate(90deg) brightness(1.2)" : "none",
              transition: "transform 0.7s ease, filter 0.2s ease",
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-t from-indigo-900 to-transparent opacity-50" />

          {/* Void rifts overlay */}
          {isHovered && (
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E")`,
                opacity: 0.7,
                mixBlendMode: "overlay",
              }}
            />
          )}
        </div>

        {/* Card type */}
        <div className="text-xs text-indigo-200 bg-indigo-800 bg-opacity-70 px-2 py-1 rounded-sm mb-2 inline-block">
          {type}
        </div>

        {/* Card description */}
        <div
          className={`flex-grow mb-2 text-sm text-indigo-100 bg-indigo-900 bg-opacity-50 p-2 rounded overflow-y-auto ${
            isGlitching ? "text-purple-300" : ""
          }`}
          style={{
            maxHeight: "80px",
            scrollbarWidth: "thin",
            scrollbarColor: "#6366f1 #312e81",
            transition: "color 0.2s ease",
          }}
        >
          {description}
        </div>

        {/* Card footer */}
        {power !== undefined && (
          <div className="flex justify-end">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-700 border-2 border-indigo-300 text-indigo-100 font-bold">
              {power}
            </div>
          </div>
        )}
      </div>

      {/* Void symbols that appear randomly */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className={`absolute w-6 h-6 opacity-0 ${styles.voidSymbolAppear}`}
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
                animationDelay: `${index * 0.5 + Math.random() * 2}s`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d={
                    [
                      "M12 2L15 5H9L12 2ZM12 22L9 19H15L12 22ZM2 12L5 9V15L2 12ZM22 12L19 15V9L22 12ZM12 7L17 12L12 17L7 12L12 7Z",
                      "M12 2L2 12L12 22L22 12L12 2ZM12 7L17 12L12 17L7 12L12 7Z",
                      "M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 16C9.79 16 8 14.21 8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16Z",
                    ][index % 3]
                  }
                  fill="rgba(99, 102, 241, 0.7)"
                />
              </svg>
            </div>
          ))}
        </div>
      )}

      {/* Dimensional tear effect on hover */}
      {isHovered && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)",
            opacity: 0.7,
          }}
        />
      )}

      {/* Glitch effect on hover */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-500 ${
          isGlitching ? "opacity-100" : "opacity-0"
        }`}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='matrix' values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 0.5 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E")`,
          mixBlendMode: "overlay",
        }}
      />
    </div>
  )
}
