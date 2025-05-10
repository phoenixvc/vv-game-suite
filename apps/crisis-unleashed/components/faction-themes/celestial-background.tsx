"use client"

import type React from "react"
import { useEffect, useRef } from "react"

// Update the CelestialBackgroundProps interface to include all props being used
interface CelestialBackgroundProps {
  children?: React.ReactNode
  showConstellations?: boolean
  intensity?: "low" | "medium" | "high"
  showPortal?: boolean
  className?: string
}

export function CelestialBackground({
  children,
  showConstellations = true,
  intensity = "medium",
  className = "",
}: CelestialBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Set up the cosmic background animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Star parameters
    const intensityFactors = {
      low: { starCount: 100, constellationCount: 3, pulseIntensity: 0.5 },
      medium: { starCount: 200, constellationCount: 5, pulseIntensity: 1 },
      high: { starCount: 300, constellationCount: 8, pulseIntensity: 1.5 },
    }

    const { starCount, constellationCount, pulseIntensity } = intensityFactors[intensity]

    // Create stars
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.5,
      color: `rgba(${150 + Math.random() * 105}, ${150 + Math.random() * 105}, ${200 + Math.random() * 55}, ${0.5 + Math.random() * 0.5})`,
      pulse: Math.random() * 0.08 * pulseIntensity + 0.02,
      phase: Math.random() * Math.PI * 2,
    }))

    // Create constellations if enabled
    const constellations: { stars: { x: number; y: number }[]; lines: { from: number; to: number }[] }[] = []

    if (showConstellations) {
      for (let i = 0; i < constellationCount; i++) {
        const centerX = Math.random() * canvas.width
        const centerY = Math.random() * canvas.height
        const constellationStars = []
        const starCount = 5 + Math.floor(Math.random() * 7) // 5-11 stars per constellation

        // Create stars for this constellation
        for (let j = 0; j < starCount; j++) {
          const distance = 20 + Math.random() * 80
          const angle = Math.random() * Math.PI * 2
          constellationStars.push({
            x: centerX + Math.cos(angle) * distance,
            y: centerY + Math.sin(angle) * distance,
          })
        }

        // Create lines between stars
        const lines = []
        const lineCount = Math.min(starCount - 1 + Math.floor(Math.random() * 3), (starCount * (starCount - 1)) / 2)

        for (let j = 0; j < lineCount; j++) {
          const from = Math.floor(Math.random() * starCount)
          let to = Math.floor(Math.random() * starCount)
          while (to === from) {
            to = Math.floor(Math.random() * starCount)
          }
          lines.push({ from, to })
        }

        constellations.push({ stars: constellationStars, lines })
      }
    }

    // Animation loop
    let time = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        const pulseFactor = 1 + Math.sin(time * star.pulse + star.phase) * 0.3
        ctx.fillStyle = star.color
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius * pulseFactor, 0, Math.PI * 2)
        ctx.fill()
      })

      // Draw constellations
      if (showConstellations) {
        constellations.forEach((constellation) => {
          // Draw lines
          ctx.strokeStyle = "rgba(180, 180, 255, 0.15)"
          ctx.lineWidth = 1
          constellation.lines.forEach((line) => {
            const fromStar = constellation.stars[line.from]
            const toStar = constellation.stars[line.to]
            ctx.beginPath()
            ctx.moveTo(fromStar.x, fromStar.y)
            ctx.lineTo(toStar.x, toStar.y)
            ctx.stroke()
          })

          // Draw constellation stars (slightly larger)
          constellation.stars.forEach((star) => {
            const pulseFactor = 1 + Math.sin(time * 0.05 + star.x) * 0.3
            ctx.fillStyle = "rgba(200, 200, 255, 0.8)"
            ctx.beginPath()
            ctx.arc(star.x, star.y, 1.5 * pulseFactor, 0, Math.PI * 2)
            ctx.fill()
          })
        })
      }

      time += 0.01
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [showConstellations, intensity])

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, #0f0730 0%, #1a1040 50%, #2c1d56 100%)",
        }}
      />
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.9, mixBlendMode: "screen" }}
      />
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.1) 0%, rgba(15, 7, 48, 0) 70%)",
          pointerEvents: "none",
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  )
}

export default CelestialBackground
